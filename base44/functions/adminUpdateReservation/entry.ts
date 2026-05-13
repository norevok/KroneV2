import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Admin function: Update a reservation status/details.
 * Admin-only. Logs all changes, triggers notifications on cancellation.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const payload = await req.json();
    const { reservation_id, new_status, cancellation_reason, internal_notes, notes } = payload;

    if (!reservation_id || !new_status) {
      return Response.json({ error: 'reservation_id and new_status are required' }, { status: 400 });
    }

    const existing = await base44.asServiceRole.entities.RestaurantReservation.filter(
      { id: reservation_id }, undefined, 1
    );

    if (!existing || existing.length === 0) {
      return Response.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const res = existing[0];
    const oldStatus = res.status;

    const updateData = { status: new_status };
    if (new_status === 'confirmed') { updateData.confirmed_at = new Date().toISOString(); updateData.confirmed_by = user.email; }
    if (new_status === 'cancelled_by_staff') { updateData.cancelled_at = new Date().toISOString(); updateData.cancelled_by = 'staff'; }
    if (cancellation_reason) updateData.cancellation_reason = cancellation_reason;
    if (internal_notes) updateData.internal_notes = internal_notes;
    if (notes) updateData.notes = notes;

    await base44.asServiceRole.entities.RestaurantReservation.update(reservation_id, updateData);

    // Audit entry
    await base44.asServiceRole.entities.AdminAuditEntry.create({
      admin_email: user.email,
      action: 'status_change',
      entity_type: 'RestaurantReservation',
      entity_id: reservation_id,
      entity_ref: res.reservation_ref,
      old_value: oldStatus,
      new_value: new_status,
      change_summary: `Status changed from ${oldStatus} to ${new_status}`,
      performed_at: new Date().toISOString(),
    }).catch(() => {});

    // Notify on cancellation only
    if (new_status === 'cancelled_by_staff' && res.guest_email) {
      base44.functions.invoke('sendCancellationEmail', {
        reservation_ref: res.reservation_ref,
        guest_email: res.guest_email,
        guest_first_name: res.guest_first_name,
        lang: res.language || 'de',
      }).catch(() => {});
      base44.functions.invoke('notifySlack', {
        type: 'reservation_cancelled',
        ref: res.reservation_ref,
        name: `${res.guest_first_name} ${res.guest_last_name}`,
        date: res.reservation_date,
        time: res.reservation_time,
      }).catch(() => {});
    }

    return Response.json({ success: true, reservation_id, old_status: oldStatus, new_status });
  } catch (error) {
    console.error('Admin update reservation error:', error);
    return Response.json({ error: 'Server error updating reservation' }, { status: 500 });
  }
});