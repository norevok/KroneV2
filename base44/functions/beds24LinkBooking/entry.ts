import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * beds24LinkBooking
 * Called from /booking-confirmed after guest is authenticated.
 * Attempts to verify and link a Beds24 booking to the guest account.
 *
 * Payload: { booking_reference, extracted_email, arrival_date, departure_date, raw_params, return_log_id }
 */
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const {
    booking_reference,
    extracted_email,
    arrival_date,
    departure_date,
    raw_params,
    return_log_id,
  } = body;

  const logId = return_log_id || null;

  // --- Prevent double-linking ---
  const existingLinks = await base44.asServiceRole.entities.GuestReservationLink.filter({
    source_reference: booking_reference,
  });
  if (existingLinks.length > 0) {
    const existing = existingLinks[0];
    // Only allow if it belongs to this user
    if (existing.user_id === user.id) {
      return Response.json({ success: true, status: 'already_linked', link: existing });
    } else {
      // Someone else already claimed this reference
      await _updateLog(base44, logId, 'no_match', null, 'Reference already claimed by another account');
      return Response.json({ success: false, status: 'claimed', error: 'Booking reference already linked to another account.' });
    }
  }

  // --- Load Beds24 API config ---
  const creds = await base44.asServiceRole.entities.Beds24ApiCredential.list();
  const cred = creds[0];
  const apiEnabled = cred?.api_enabled && !!Deno.env.get('BEDS24_API_KEY');

  let bookingData = null;
  let verifiedByApi = false;

  if (apiEnabled && booking_reference) {
    try {
      const apiKey = Deno.env.get('BEDS24_API_KEY');
      const baseUrl = cred.api_base_url || 'https://api.beds24.com/v2';

      // Try fetching booking by reference
      const apiRes = await fetch(`${baseUrl}/bookings?bookId=${encodeURIComponent(booking_reference)}&includeInvoice=false`, {
        headers: {
          'token': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (apiRes.ok) {
        const apiData = await apiRes.json();
        const bookings = apiData?.data || apiData?.bookings || [];
        if (bookings.length > 0) {
          const b = bookings[0];
          // Security: verify the booking belongs to the right guest
          const bEmail = (b.guestEmail || b.email || '').toLowerCase().trim();
          const bName = ((b.guestFirstName || '') + ' ' + (b.guestLastName || '')).toLowerCase();
          const userEmailLower = user.email.toLowerCase().trim();
          const suppliedEmailLower = (extracted_email || '').toLowerCase().trim();

          const emailMatches = bEmail && (bEmail === userEmailLower || bEmail === suppliedEmailLower);
          const dateMatches = !arrival_date || (b.firstNight === arrival_date || b.arrival === arrival_date);

          if (emailMatches || dateMatches) {
            bookingData = {
              external_booking_id: String(b.bookId || b.id || booking_reference),
              source_reference: booking_reference,
              room_type: b.roomName || b.unitName || b.roomType || '',
              arrival_date: b.firstNight || b.arrival || arrival_date,
              departure_date: b.lastNight || b.departure || departure_date,
              guest_name: `${b.guestFirstName || ''} ${b.guestLastName || ''}`.trim() || user.full_name,
              guest_email: bEmail || user.email,
              number_of_guests: Number(b.numAdult || b.adults || 1),
              booking_status: _mapStatus(b.status),
              payment_status: _mapPayment(b.paymentStatus || b.payment),
              total_price: Number(b.price || b.totalPrice || 0) || null,
              currency: b.currency || 'EUR',
            };
            verifiedByApi = true;
          }
        }
      }
    } catch (err) {
      // API failed — fall back to manual match
      await _updateLog(base44, logId, 'api_error', null, err.message);
    }
  }

  // --- If API didn't verify, do basic email/date check for manual match ---
  if (!bookingData && booking_reference) {
    const emailOk = extracted_email && extracted_email.toLowerCase() === user.email.toLowerCase();
    if (emailOk || arrival_date) {
      bookingData = {
        external_booking_id: booking_reference,
        source_reference: booking_reference,
        room_type: '',
        arrival_date: arrival_date || '',
        departure_date: departure_date || '',
        guest_name: user.full_name || '',
        guest_email: extracted_email || user.email,
        number_of_guests: 1,
        booking_status: 'confirmed',
        payment_status: 'unknown',
        total_price: null,
        currency: 'EUR',
      };
      // Not API-verified — flagged for admin review
      verifiedByApi = false;
    }
  }

  // --- If we have enough to create a link ---
  if (bookingData) {
    const link = await base44.asServiceRole.entities.GuestReservationLink.create({
      user_id: user.id,
      user_email: user.email,
      source: 'beds24',
      verified: verifiedByApi,
      verified_at: verifiedByApi ? new Date().toISOString() : null,
      verified_by: verifiedByApi ? 'api_auto' : null,
      linked_by_admin: false,
      return_log_id: logId,
      ...bookingData,
    });

    await _updateLog(base44, logId, 'linked', link.id, null);

    // Log activity
    base44.asServiceRole.entities.ActivityLog.create({
      actor_email: user.email,
      action: 'booking_intent_created',
      entity_type: 'GuestReservationLink',
      entity_id: link.id,
      entity_ref: booking_reference,
      description: `Beds24 booking ${booking_reference} linked to guest ${user.email} (verified: ${verifiedByApi})`,
      performed_at: new Date().toISOString(),
    }).catch(() => {});

    // Notify admin via email if not API verified
    if (!verifiedByApi) {
      const emailPromise = base44.asServiceRole.integrations.Core.SendEmail({
        to: 'oammesso@gmail.com',
        subject: `⚠️ Beds24 Buchung manuell prüfen – ${booking_reference}`,
        body: `Gast ${user.email} hat Buchung ${booking_reference} verknüpft, aber die API-Verifikation war nicht möglich.\n\nBitte im Admin-Dashboard prüfen: https://krone-ammesso.de/admin/beds24-bookings\n\nRef: ${link.id}`,
      }).catch(() => null);
      base44.asServiceRole.entities.EmailLog.create({
        recipient: 'oammesso@gmail.com',
        subject: `⚠️ Beds24 Buchung manuell prüfen – ${booking_reference}`,
        template: 'new_reservation_admin',
        status: 'sent',
        sent_at: new Date().toISOString(),
        related_entity_type: 'GuestReservationLink',
        related_entity_id: link.id,
        related_ref: booking_reference,
      }).catch(() => {});
    }

    return Response.json({ success: true, status: verifiedByApi ? 'verified' : 'unverified', link });
  }

  // --- No match found — create lookup request ---
  const lookupReq = await base44.asServiceRole.entities.BookingLookupRequest.create({
    user_id: user.id,
    user_email: user.email,
    booking_reference: booking_reference || '',
    guest_email: extracted_email || user.email,
    arrival_date: arrival_date || '',
    departure_date: departure_date || '',
    status: 'pending',
    return_log_id: logId,
  });

  await _updateLog(base44, logId, 'no_match', null, 'No API match, lookup request created');

  // Admin notification
  base44.asServiceRole.integrations.Core.SendEmail({
    to: 'oammesso@gmail.com',
    subject: `🔍 Beds24 Buchung nicht zugeordnet – ${booking_reference || user.email}`,
    body: `Gast ${user.email} kehrte von Beds24 zurück, aber die Buchung ${booking_reference || '(keine Ref)'} konnte nicht automatisch zugeordnet werden.\n\nBitte manuell prüfen: https://krone-ammesso.de/admin/beds24-bookings\n\nLookup-Request ID: ${lookupReq.id}`,
  }).catch(() => {});
  base44.asServiceRole.entities.EmailLog.create({
    recipient: 'oammesso@gmail.com',
    subject: `🔍 Beds24 Buchung nicht zugeordnet – ${booking_reference || user.email}`,
    template: 'new_reservation_admin',
    status: 'sent',
    sent_at: new Date().toISOString(),
    related_entity_type: 'BookingLookupRequest',
    related_entity_id: lookupReq.id,
    related_ref: booking_reference || '',
  }).catch(() => {});

  return Response.json({ success: false, status: 'no_match', lookup_request_id: lookupReq.id });
});

function _mapStatus(raw) {
  if (!raw) return 'confirmed';
  const s = String(raw).toLowerCase();
  if (s.includes('cancel')) return 'cancelled';
  if (s.includes('pending') || s === '0') return 'pending';
  if (s.includes('complet')) return 'completed';
  return 'confirmed';
}

function _mapPayment(raw) {
  if (!raw) return 'unknown';
  const s = String(raw).toLowerCase();
  if (s.includes('paid') || s === '1') return 'paid';
  if (s.includes('partial')) return 'partial';
  if (s.includes('refund')) return 'refunded';
  if (s.includes('unpaid') || s === '0') return 'unpaid';
  return 'unknown';
}

async function _updateLog(base44, logId, status, matchedId, errMsg) {
  if (!logId) return;
  base44.asServiceRole.entities.Beds24ReturnLog.update(logId, {
    match_status: status,
    matched_booking_id: matchedId || undefined,
    error_message: errMsg || undefined,
    api_lookup_attempted: true,
  }).catch(() => {});
}