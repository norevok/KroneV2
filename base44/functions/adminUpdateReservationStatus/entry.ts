import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Admin-only: Update reservation status with full audit trail.
 * Logs all changes, triggers notifications, enforces state machine.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin
    const settings = await base44.asServiceRole.entities.SiteSettings.filter(
      { key: 'global' },
      undefined,
      1
    );

    const adminEmails = settings?.[0]?.super_admin_emails || [];
    if (!adminEmails.includes(user.email) && user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { reservation_id, new_status, reason, internal_notes } = await req.json();

    if (!reservation_id || !new_status) {
      return Response.json(
        { error: 'reservation_id and new_status required' },
        { status: 400 }
      );
    }

    // Get current — use canonical RestaurantReservation entity
    let oldReservation = null;
    try {
      oldReservation = await base44.asServiceRole.entities.RestaurantReservation.get(reservation_id);
    } catch (_) {}

    // Fallback: try filter by id in case get() isn't supported
    if (!oldReservation) {
      const rows = await base44.asServiceRole.entities.RestaurantReservation.filter(
        { id: reservation_id }, undefined, 1
      );
      oldReservation = rows?.[0] || null;
    }

    if (!oldReservation) {
      return Response.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const oldStatus = oldReservation.status;

    // Validate state transition
    const validTransitions = {
      pending: ['confirmed', 'cancelled_by_staff'],
      confirmed: ['cancelled_by_staff', 'no_show', 'completed', 'seated'],
      seated: ['completed', 'cancelled_by_staff', 'no_show'],
      completed: [],
      cancelled_by_staff: [],
      cancelled_by_guest: [],
      no_show: []
    };

    if (!validTransitions[oldStatus]?.includes(new_status)) {
      return Response.json(
        { error: `Cannot transition from ${oldStatus} to ${new_status}` },
        { status: 400 }
      );
    }

    // Update reservation
    const updates = { status: new_status };
    if (new_status === 'confirmed') updates.confirmed_at = new Date().toISOString();
    if (new_status === 'cancelled_by_staff') updates.cancelled_at = new Date().toISOString();
    if (new_status === 'seated') updates.seated_at = new Date().toISOString();
    if (new_status === 'completed') updates.completed_at = new Date().toISOString();
    if (new_status === 'no_show') updates.completed_at = new Date().toISOString();
    if (internal_notes) updates.internal_notes = internal_notes;

    await base44.asServiceRole.entities.RestaurantReservation.update(reservation_id, updates);

    // Audit log
    await base44.asServiceRole.entities.AdminAuditEntry.create({
      admin_email: user.email,
      action: 'status_change',
      entity_type: 'RestaurantReservation',
      entity_id: reservation_id,
      entity_ref: oldReservation.reservation_ref,
      old_value: JSON.stringify({ status: oldStatus }),
      new_value: JSON.stringify({ status: new_status }),
      change_summary: `Status changed: ${oldStatus} → ${new_status}${reason ? ` (${reason})` : ''}`,
      performed_at: new Date().toISOString()
    });

    // Trigger notifications if cancelled
    if (new_status === 'cancelled_by_staff') {
      try {
        base44.functions.invoke('sendCancellationEmail', {
          reservation_ref: oldReservation.reservation_ref,
          guest_email: oldReservation.guest_email,
          guest_first_name: oldReservation.guest_first_name,
          lang: oldReservation.language
        });
      } catch (e) {
        console.warn('Cancellation email failed:', e.message);
      }

      try {
        base44.functions.invoke('notifySlack', {
          type: 'reservation_cancelled',
          ref: oldReservation.reservation_ref,
          name: `${oldReservation.guest_first_name} ${oldReservation.guest_last_name}`,
          date: oldReservation.reservation_date,
          time: oldReservation.reservation_time
        });
      } catch (e) {
        console.warn('Slack notification failed:', e.message);
      }
    }

    return Response.json({
      success: true,
      reservation_id,
      old_status: oldStatus,
      new_status,
      audited: true
    });
  } catch (error) {
    console.error('adminUpdateReservationStatus error:', error.message);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});