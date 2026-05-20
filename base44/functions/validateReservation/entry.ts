import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Validates a restaurant reservation request server-side.
 * Checks: date validity, time validity, capacity, opening hours, duplicates, spam.
 * Returns: { valid: boolean, errors: string[], reservation_ref?: string }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const {
      guest_email,
      guest_first_name,
      guest_last_name,
      guest_phone,
      reservation_date,
      reservation_time,
      party_size,
      notes,
      dietary_notes,
      occasion,
      language,
      source,
      source_page
    } = payload;

    const errors = [];

    // Validation: required fields
    if (!guest_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest_email)) {
      errors.push('Valid email is required');
    }
    if (!guest_first_name || guest_first_name.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }
    if (!guest_last_name || guest_last_name.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }
    if (!reservation_date) {
      errors.push('Reservation date is required');
    }
    if (!reservation_time) {
      errors.push('Reservation time is required');
    }
    if (!party_size || party_size < 1 || party_size > 12) {
      errors.push('Party size must be between 1 and 12');
    }

    if (errors.length > 0) {
      return Response.json({ valid: false, errors }, { status: 400 });
    }

    // Parse date
    const resDate = new Date(reservation_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Date must be today or in future, within 90 days
    if (resDate < today || resDate > new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)) {
      errors.push('Reservation date must be within 90 days');
    }

    // Get canonical settings
    const settings = await base44.asServiceRole.entities.SiteSettings.filter(
      { key: 'global' },
      undefined,
      1
    );

    if (!settings || settings.length === 0) {
      return Response.json(
        { valid: false, errors: ['System configuration missing'] },
        { status: 500 }
      );
    }

    const config = settings[0];
    const maxCapacity = config.restaurant_max_capacity || 120;

    // Get opening hours for this day
    const dayOfWeek = resDate.getDay();
    const openingHours = await base44.asServiceRole.entities.OpeningHour.filter(
      { entity_type: 'restaurant', day_of_week: dayOfWeek, is_active: true },
      undefined,
      1
    );

    if (openingHours.length === 0 || openingHours[0].is_closed) {
      errors.push('Restaurant is closed on this day');
    } else {
      const hours = openingHours[0];
      const [resHour, resMin] = reservation_time.split(':').map(Number);
      const [openHour, openMin] = (hours.opening_time || '00:00').split(':').map(Number);
      const [closeHour, closeMin] = (hours.closing_time || '23:59').split(':').map(Number);

      const resTimeMinutes = resHour * 60 + resMin;
      const openTimeMinutes = openHour * 60 + openMin;
      const closeTimeMinutes = closeHour * 60 + closeMin;

      if (resTimeMinutes < openTimeMinutes || resTimeMinutes >= closeTimeMinutes - 30) {
        errors.push('Reservation time is outside service hours or too close to closing');
      }
    }

    // Check for special rules (closures, events)
    const specialRules = await base44.asServiceRole.entities.SpecialOpeningRule.filter(
      {
        entity_type: 'restaurant',
        effective_date: { $lte: reservation_date },
        end_date: { $gte: reservation_date }
      },
      '-priority',
      1
    );

    if (specialRules.length > 0) {
      const topRule = specialRules[0];
      if (topRule.is_closed || topRule.fully_booked) {
        errors.push(`Restaurant is ${topRule.is_closed ? 'closed' : 'fully booked'} on this date: ${topRule.notes_en || topRule.rule_name}`);
      }
    }

    if (errors.length > 0) {
      return Response.json({ valid: false, errors }, { status: 400 });
    }

    // Check capacity
    const [hours, minutes] = reservation_time.split(':').map(Number);
    const timeWindow = `${String(hours).padStart(2, '0')}:00`; // Round to hour for grouping

    const existingReservations = await base44.asServiceRole.entities.RestaurantReservation.filter(
      {
        reservation_date,
        reservation_time,
        status: { $in: ['confirmed', 'seated', 'completed'] }
      }
    );

    const bookedSeats = existingReservations.reduce((sum, res) => sum + (res.party_size || 0), 0);
    const availableSeats = maxCapacity - bookedSeats;

    if (party_size > availableSeats) {
      errors.push(`Only ${availableSeats} seats available at this time`);
    }

    if (errors.length > 0) {
      return Response.json({ valid: false, errors }, { status: 400 });
    }

    // Check for duplicate submission (anti-spam)
    const dupKey = `${guest_email}|${reservation_date}|${reservation_time}`;
    const recentDups = await base44.asServiceRole.entities.RestaurantReservation.filter(
      {
        guest_email,
        reservation_date,
        reservation_time,
        status: { $in: ['new', 'pending', 'confirmed'] }
      }
    );

    if (recentDups.length > 0) {
      errors.push('A reservation for this email/date/time already exists. Please contact us if you need to make changes.');
    }

    if (errors.length > 0) {
      return Response.json({ valid: false, errors }, { status: 409 });
    }

    // All checks passed — return valid: true WITHOUT creating any record.
    // Record creation is handled exclusively by createReservation to avoid duplicates.
    return Response.json({
      valid: true,
      errors: [],
      available_seats: availableSeats - party_size,
    });
  } catch (error) {
    console.error('Reservation validation error:', error);
    return Response.json(
      { valid: false, errors: ['Server error during validation'] },
      { status: 500 }
    );
  }
});