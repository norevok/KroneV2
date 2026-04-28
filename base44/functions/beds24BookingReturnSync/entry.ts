/**
 * Beds24 Booking Return Sync
 *
 * Called when the guest returns from Beds24 booking flow.
 * The return URL includes: ?bookid=XXX&token=YYY&status=confirmed
 *
 * This function:
 * 1. Validates the token from BookingLinkSession
 * 2. Upserts the HotelBookingIntent with confirmed booking data
 * 3. Links the booking to the user account
 * 4. Marks the BookingLinkSession as used
 * 5. Returns booking details to the frontend
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { token, bookid, status, check_in, check_out, guest_email } = body;

    if (!token && !bookid) {
      return Response.json({ error: 'Missing token or bookid' }, { status: 400 });
    }

    let linkedUserEmail = null;
    let linkedUserId = null;
    let sessionId = null;

    // Validate token and find linked session
    if (token) {
      const sessions = await base44.asServiceRole.entities.BookingLinkSession.filter({ token });
      const session = sessions[0];
      if (session) {
        if (new Date(session.expires_at) < new Date()) {
          // Expired — still allow but flag as expired
          await base44.asServiceRole.entities.BookingLinkSession.update(session.id, { status: 'expired' }).catch(() => {});
        } else {
          linkedUserEmail = session.user_email;
          linkedUserId = session.user_id;
          sessionId = session.id;
          await base44.asServiceRole.entities.BookingLinkSession.update(session.id, {
            status: 'used',
            used_at: new Date().toISOString(),
            beds24_booking_ref: bookid || '',
            return_params: JSON.stringify(body),
          }).catch(() => {});
        }
      }
    }

    // Fallback: use guest_email from return params
    const resolvedEmail = linkedUserEmail || (guest_email || '').toLowerCase().trim();

    // Map status
    const statusMap = {
      confirmed: 'returned_confirmed',
      success: 'returned_confirmed',
      pending: 'returned_pending',
      cancelled: 'returned_cancelled',
      cancel: 'returned_cancelled',
    };
    const mappedStatus = statusMap[status?.toLowerCase()] || 'returned_pending';

    let intentId = null;
    let action = 'none';

    if (bookid) {
      // Check if intent already exists (from webhook or previous session)
      const existing = await base44.asServiceRole.entities.HotelBookingIntent.filter({
        beds24_booking_ref: bookid,
      });

      if (existing.length > 0) {
        intentId = existing[0].id;
        await base44.asServiceRole.entities.HotelBookingIntent.update(intentId, {
          status: mappedStatus,
          return_status: status || 'unknown',
          returned_at: new Date().toISOString(),
          ...(resolvedEmail && { guest_email: resolvedEmail }),
          sync_status: 'synced',
          last_synced_at: new Date().toISOString(),
        });
        action = 'updated';
      } else {
        // Create from return flow
        const ref = `INT-RETURN-${bookid}`;
        const created = await base44.asServiceRole.entities.HotelBookingIntent.create({
          intent_ref: ref,
          status: mappedStatus,
          beds24_booking_ref: bookid,
          guest_email: resolvedEmail || '',
          check_in: check_in || '',
          check_out: check_out || '',
          return_status: status || 'unknown',
          returned_at: new Date().toISOString(),
          sync_status: 'synced',
          sync_notes: 'Created from Beds24 return flow',
          sync_attempted_at: new Date().toISOString(),
          last_synced_at: new Date().toISOString(),
          manual_review_required: !resolvedEmail,
        });
        intentId = created.id;
        action = 'created';
      }
    }

    // Notify Slack if confirmed (non-blocking)
    if (mappedStatus === 'returned_confirmed') {
      base44.asServiceRole.functions.invoke('notifySlack', {
        type: 'booking_returned',
        ref: bookid,
        status: mappedStatus,
        check_in,
        check_out,
        name: resolvedEmail,
        booking_ref: bookid,
      }).catch(() => {});
    }

    return Response.json({
      success: true,
      intent_id: intentId,
      action,
      status: mappedStatus,
      linked_user_email: resolvedEmail || null,
    });

  } catch (error) {
    console.error('beds24BookingReturnSync error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});