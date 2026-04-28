/**
 * Beds24 Booking Webhook Handler
 *
 * Beds24 sends POST requests to this endpoint on:
 * - new booking created
 * - booking modified
 * - booking cancelled
 *
 * Configure in Beds24: Settings > Booking > Notifications > Webhook URL
 * Set URL to: <this function's public URL>
 *
 * Security: validate shared secret via query param ?secret=<BEDS24_WEBHOOK_SECRET>
 * Idempotent: upsert by beds24_booking_ref (bookid), never blindly create duplicates
 * Account linking: match via BookingLinkSession token or guest email
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const startTime = Date.now();

  // Validate shared secret
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');
  const expectedSecret = Deno.env.get('BEDS24_WEBHOOK_SECRET');
  if (expectedSecret && secret !== expectedSecret) {
    console.warn('Beds24 webhook: invalid secret');
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let rawBody = '';
  let payload = {};
  try {
    rawBody = await req.text();
    payload = JSON.parse(rawBody);
  } catch (_) {
    // Beds24 may send form-encoded or JSON
    payload = {};
  }

  const bookid = String(payload.bookid || payload.booking_id || '').trim();
  const eventType = payload.type || payload.event || 'unknown';

  // Log raw webhook event immediately (idempotency key = bookid + eventType + timestamp)
  const webhookLog = await base44.asServiceRole.entities.HotelBookingSyncIssue.create({
    issue_type: 'api_failure',
    description: `Beds24 webhook received: ${eventType} — bookid: ${bookid || 'none'}`,
    detected_at: new Date().toISOString(),
    severity: 'info',
    status: 'new',
  }).catch(() => null);

  if (!bookid) {
    console.warn('Beds24 webhook: no bookid in payload');
    return Response.json({ received: true, skipped: 'no bookid' });
  }

  try {
    // Check for existing booking intent with this beds24 ref (idempotency)
    const existing = await base44.asServiceRole.entities.HotelBookingIntent.filter({
      beds24_booking_ref: bookid,
    });

    const guestEmail = (payload.guest_email || payload.email || '').toLowerCase().trim();
    const checkIn = payload.checkin || payload.check_in || '';
    const checkOut = payload.checkout || payload.check_out || '';
    const guestFirst = payload.firstname || payload.first_name || '';
    const guestLast = payload.lastname || payload.last_name || '';
    const status = payload.status || 'confirmed';

    // Map Beds24 status to our schema
    const statusMap = {
      '1': 'synced_confirmed',
      '0': 'returned_cancelled',
      'confirmed': 'synced_confirmed',
      'cancelled': 'returned_cancelled',
      'pending': 'synced_pending',
    };
    const mappedStatus = statusMap[String(status)] || 'needs_review';

    // Try to find linked user via BookingLinkSession (by guest email)
    let linkedUserId = null;
    let linkedUserEmail = null;
    if (guestEmail) {
      const sessions = await base44.asServiceRole.entities.BookingLinkSession.filter({
        user_email: guestEmail,
        status: 'pending',
      }).catch(() => []);
      // Use most recent valid session
      const validSession = sessions
        .filter(s => new Date(s.expires_at) > new Date())
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0];
      if (validSession) {
        linkedUserId = validSession.user_id;
        linkedUserEmail = validSession.user_email;
        // Mark session as used
        await base44.asServiceRole.entities.BookingLinkSession.update(validSession.id, {
          status: 'used',
          used_at: new Date().toISOString(),
          beds24_booking_ref: bookid,
        }).catch(() => {});
      }
    }

    if (existing.length > 0) {
      // UPSERT — update existing record
      const record = existing[0];
      await base44.asServiceRole.entities.HotelBookingIntent.update(record.id, {
        status: mappedStatus,
        beds24_booking_ref: bookid,
        guest_email: guestEmail || record.guest_email,
        guest_first_name: guestFirst || record.guest_first_name,
        guest_last_name: guestLast || record.guest_last_name,
        check_in: checkIn || record.check_in,
        check_out: checkOut || record.check_out,
        sync_status: 'synced',
        sync_notes: `Webhook: ${eventType} at ${new Date().toISOString()}`,
        sync_attempted_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString(),
        ...(linkedUserEmail && { guest_email: linkedUserEmail }),
      });
      console.log(`Beds24 webhook: updated existing intent ${record.id} for bookid ${bookid}`);
    } else {
      // CREATE new intent from webhook
      const ref = `INT-WEBHOOK-${bookid}`;
      await base44.asServiceRole.entities.HotelBookingIntent.create({
        intent_ref: ref,
        status: mappedStatus,
        beds24_booking_ref: bookid,
        guest_email: linkedUserEmail || guestEmail || '',
        guest_first_name: guestFirst,
        guest_last_name: guestLast,
        check_in: checkIn,
        check_out: checkOut,
        sync_status: 'synced',
        sync_notes: `Created from Beds24 webhook: ${eventType}`,
        sync_attempted_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString(),
        slack_notified: false,
        manual_review_required: !linkedUserEmail && !guestEmail,
      });
      console.log(`Beds24 webhook: created new intent from bookid ${bookid}`);
    }

    // Notify Slack for new confirmed bookings
    if (mappedStatus === 'synced_confirmed' && (existing.length === 0)) {
      base44.asServiceRole.functions.invoke('notifySlack', {
        type: 'beds24_booking',
        beds24_ref: bookid,
        guest_name: `${guestFirst} ${guestLast}`.trim(),
        guest_email: guestEmail,
        check_in: checkIn,
        check_out: checkOut,
      }).catch(() => {});
    }

    return Response.json({
      received: true,
      bookid,
      action: existing.length > 0 ? 'updated' : 'created',
      duration_ms: Date.now() - startTime,
    });

  } catch (error) {
    console.error('Beds24 webhook processing error:', error.message);
    // Update the sync issue log
    if (webhookLog) {
      await base44.asServiceRole.entities.HotelBookingSyncIssue.update(webhookLog.id, {
        status: 'acknowledged',
        description: `Webhook processing failed: ${error.message}`,
        severity: 'critical',
      }).catch(() => {});
    }
    return Response.json({ received: true, error: error.message }, { status: 200 }); // Always 200 to Beds24
  }
});