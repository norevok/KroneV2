import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Get available time slots for a given date.
 * Uses hardcoded Krone service windows + real-time capacity from RestaurantReservation.
 * No SiteSettings fetch — uses sane defaults hardcoded here to save DB reads.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { date } = await req.json();

    if (!date) {
      return Response.json({ error: 'Date required' }, { status: 400 });
    }

    const MAX_CAPACITY = 120;
    const dateObj = new Date(date + 'T12:00:00');
    const dayOfWeek = dateObj.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    // Monday = closed
    if (dayOfWeek === 1) {
      return Response.json({ date, available_slots: [], used_capacity: {}, closed_reason: 'Montag Ruhetag' });
    }

    // Generate slots based on day
    const LUNCH = ['12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15'];
    const DINNER = ['17:30','17:45','18:00','18:15','18:30','18:45','19:00','19:15','19:30','19:45','20:00','20:15','20:30','20:45','21:00','21:15','21:30'];
    const SUNDAY = ['12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00','18:15','18:30','19:00','19:15','19:30'];

    const slots = dayOfWeek === 0 ? SUNDAY : [...LUNCH, ...DINNER];

    // Check for special closure rules (optional entity — gracefully skip if empty)
    try {
      const specialRules = await base44.asServiceRole.entities.SpecialOpeningRule.filter({
        entity_type: 'restaurant',
        effective_date: { $lte: date },
        end_date: { $gte: date }
      }, '-priority', 1);
      if (specialRules.length > 0) {
        const rule = specialRules[0];
        if (rule.is_closed) return Response.json({ date, available_slots: [], used_capacity: {}, closed_reason: rule.rule_name || 'Geschlossen' });
        if (rule.fully_booked) return Response.json({ date, available_slots: [], used_capacity: {}, closed_reason: 'Ausgebucht' });
      }
    } catch (_) {}

    // Get existing reservations for capacity check — use canonical RestaurantReservation entity
    const existing = await base44.asServiceRole.entities.RestaurantReservation.filter({
      reservation_date: date,
      status: { $in: ['new', 'pending', 'confirmed', 'seated'] }
    });

    // Calculate used capacity per slot
    const usedCapacity = {};
    slots.forEach(s => { usedCapacity[s] = 0; });
    existing.forEach(res => {
      if (usedCapacity[res.reservation_time] !== undefined) {
        usedCapacity[res.reservation_time] += (res.party_size || 0);
      }
    });

    // Available = slot not yet at capacity
    const availableSlots = slots.filter(s => (usedCapacity[s] || 0) < MAX_CAPACITY);

    return Response.json({
      date,
      available_slots: availableSlots,
      used_capacity: usedCapacity,
      max_capacity: MAX_CAPACITY,
      total_slots: slots.length,
    });
  } catch (error) {
    console.error('getReservationTimeSlots error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});