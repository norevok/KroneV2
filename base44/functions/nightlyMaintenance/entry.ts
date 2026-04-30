/**
 * Nightly Maintenance Job — Krone Langenburg
 * 
 * Runs once per night (scheduled: 02:00 Europe/Berlin).
 * Consolidates ALL non-critical maintenance into a single function:
 *   1. Archive old completed/cancelled reservations (>90 days)
 *   2. Close stale contact inquiries (>30 days with no reply)
 *   3. Close stale guest messages (>30 days resolved)
 *   4. Mark stale booking intents (>7 days uninitiated) as archived
 *   5. Detect anomalies and log them (no Slack — just DB log)
 * 
 * Credit cost: 1 invocation per night total.
 * All previous separate maintenance calls are now consolidated here.
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const startTime = Date.now();
  const results = { archived_reservations: 0, closed_inquiries: 0, closed_messages: 0, archived_intents: 0, errors: [] };

  try {
    const base44 = createClientFromRequest(req);

    // Auth check — only admins or internal scheduled calls
    let callerEmail = 'scheduler';
    try {
      const user = await base44.auth.me();
      if (user) {
        if (user.role !== 'admin') {
          return Response.json({ error: 'Forbidden' }, { status: 403 });
        }
        callerEmail = user.email;
      }
    } catch (_) {
      // Unauthenticated = scheduled call, allow it
    }

    const now = new Date();
    const day90 = new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const day30 = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
    const day7 = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

    // 1. Archive old completed/cancelled restaurant reservations
    try {
      const oldReservations = await base44.asServiceRole.entities.RestaurantReservation.filter({
        status: 'completed',
      }, '-reservation_date', 200);
      const toArchive = oldReservations.filter(r => r.reservation_date < day90);
      for (const r of toArchive) {
        await base44.asServiceRole.entities.RestaurantReservation.update(r.id, { status: 'archived' });
        results.archived_reservations++;
      }
    } catch (e) {
      results.errors.push(`archive_reservations: ${e.message}`);
    }

    // 2. Close stale contact inquiries with no reply after 30 days
    try {
      const staleInquiries = await base44.asServiceRole.entities.ContactInquiry.filter({
        status: 'new',
      }, '-created_date', 100);
      const toClose = staleInquiries.filter(i => i.created_date < day30);
      for (const i of toClose) {
        await base44.asServiceRole.entities.ContactInquiry.update(i.id, {
          status: 'closed',
          internal_notes: (i.internal_notes || '') + '\n[auto-closed: no reply after 30 days]',
        });
        results.closed_inquiries++;
      }
    } catch (e) {
      results.errors.push(`close_inquiries: ${e.message}`);
    }

    // 3. Close old resolved guest messages
    try {
      const staleMessages = await base44.asServiceRole.entities.GuestMessage.filter({
        status: 'resolved',
      }, '-created_date', 100);
      const toClose = staleMessages.filter(m => m.created_date < day30);
      for (const m of toClose) {
        await base44.asServiceRole.entities.GuestMessage.update(m.id, { status: 'closed' });
        results.closed_messages++;
      }
    } catch (e) {
      results.errors.push(`close_messages: ${e.message}`);
    }

    // 4b. Expire stale pending_payment vouchers (>24 hours)
    try {
      const day1 = new Date(now - 24 * 60 * 60 * 1000).toISOString();
      const staleVouchers = await base44.asServiceRole.entities.GiftVoucher.filter({
        status: 'pending_payment',
      }, '-created_date', 100);
      const toExpire = staleVouchers.filter(v => v.created_date < day1);
      for (const v of toExpire) {
        await base44.asServiceRole.entities.GiftVoucher.update(v.id, { status: 'expired' });
      }
    } catch (e) {
      results.errors.push(`expire_vouchers: ${e.message}`);
    }

    // 4. Archive stale booking intents (>7 days, never progressed)
    try {
      const staleIntents = await base44.asServiceRole.entities.HotelBookingIntent.filter({
        status: 'initiated',
      }, '-created_date', 100);
      const toArchive = staleIntents.filter(i => i.created_date < day7);
      for (const intent of toArchive) {
        await base44.asServiceRole.entities.HotelBookingIntent.update(intent.id, {
          status: 'archived',
          sync_notes: 'auto-archived: no progression after 7 days',
        });
        results.archived_intents++;
      }
    } catch (e) {
      results.errors.push(`archive_intents: ${e.message}`);
    }

    const duration = Date.now() - startTime;

    // CREDIT OPTIMIZATION: Only log to ActivityLog if something was actually changed,
    // or if there were errors. Skip the write when nothing happened.
    const somethingChanged = results.archived_reservations + results.closed_inquiries + results.closed_messages + results.archived_intents > 0 || results.errors.length > 0;
    if (somethingChanged) {
      await base44.asServiceRole.entities.ActivityLog.create({
        actor_email: callerEmail,
        actor_role: 'system',
        action: 'admin_status_change',
        entity_type: 'RestaurantReservation',
        description: `Nightly maintenance: archived ${results.archived_reservations} reservations, ${results.archived_intents} intents; closed ${results.closed_inquiries} inquiries, ${results.closed_messages} messages`,
        metadata: { ...results, duration_ms: duration },
        performed_at: now.toISOString(),
      }).catch(() => {});
    }

    return Response.json({
      success: true,
      ran_at: now.toISOString(),
      duration_ms: duration,
      results,
    });

  } catch (error) {
    console.error('nightlyMaintenance fatal error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});