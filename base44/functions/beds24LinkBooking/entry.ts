/**
 * beds24LinkBooking
 * Called from /booking-confirmed after guest is authenticated.
 * Uses Beds24 V2 refresh-token auth (cached access token).
 * NEVER exposes tokens. NEVER polls.
 * Allowed: booking-confirmed return event, guest login continuation.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ── Module-level token cache ──
let _cachedToken  = null;
let _tokenExpires = 0;

async function _getAccessToken(base44) {
  const now = Date.now();
  if (_cachedToken && now < _tokenExpires) return _cachedToken;

  // Use LONG_LIFE_TOKEN directly (more reliable than refresh token flow)
  const longLifeToken = Deno.env.get('BEDS24_LONG_LIFE_TOKEN');
  const baseUrl       = Deno.env.get('BEDS24_API_BASE_URL') || 'https://api.beds24.com/v2';

  if (!longLifeToken) throw new Error('BEDS24_LONG_LIFE_TOKEN not configured');

  // No API call needed - use token directly
  const token = longLifeToken;
  _cachedToken  = token;
  _tokenExpires = Date.now() + (365 * 24 * 60 * 60 * 1000); // 1 year
  return token;
}

async function _lookupBooking(reference, email, arrivalDate, base44) {
  const token   = await _getAccessToken(base44);
  const baseUrl = Deno.env.get('BEDS24_API_BASE_URL') || 'https://api.beds24.com/v2';

  let url = `${baseUrl}/bookings?includeInvoice=false`;
  if (reference)   url += `&bookId=${encodeURIComponent(reference)}`;
  if (email)       url += `&guestEmail=${encodeURIComponent(email)}`;
  if (arrivalDate) url += `&arrivalFrom=${encodeURIComponent(arrivalDate)}&arrivalTo=${encodeURIComponent(arrivalDate)}`;

  const t0  = Date.now();
  const res = await fetch(url, { headers: { 'token': token } });

  _audit(base44, {
    action: 'api_request', endpoint: '/bookings',
    http_status: res.status, success: res.ok,
    duration_ms: Date.now() - t0, token_used: 'access_token',
    token_was_cached: true, related_ref: reference || '',
    triggered_by: 'booking_return',
    error_message: res.ok ? undefined : `HTTP ${res.status}`,
  });

  if (!res.ok) throw new Error(`Beds24 /bookings error: HTTP ${res.status}`);

  const data     = await res.json();
  const bookings = data?.data || data?.bookings || [];
  return bookings[0] || null;
}

function _mapStatus(raw) {
  if (!raw) return 'confirmed';
  const s = String(raw).toLowerCase();
  if (s.includes('cancel'))  return 'cancelled';
  if (s.includes('pending') || s === '0') return 'pending';
  if (s.includes('complet')) return 'completed';
  return 'confirmed';
}

function _mapPayment(raw) {
  if (!raw) return 'unknown';
  const s = String(raw).toLowerCase();
  if (s.includes('paid')   || s === '1') return 'paid';
  if (s.includes('partial'))             return 'partial';
  if (s.includes('refund'))              return 'refunded';
  if (s.includes('unpaid') || s === '0') return 'unpaid';
  return 'unknown';
}

function _audit(base44, fields) {
  base44.asServiceRole.entities.IntegrationExecutionLog.create({
    integration: 'beds24', executed_at: new Date().toISOString(), ...fields,
  }).catch(() => {});
}

async function _updateLog(base44, logId, status, matchedId, errMsg) {
  if (!logId) return;
  base44.asServiceRole.entities.Beds24ReturnLog.update(logId, {
    match_status:         status,
    matched_booking_id:   matchedId || undefined,
    error_message:        errMsg || undefined,
    api_lookup_attempted: true,
  }).catch(() => {});
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { booking_reference, extracted_email, arrival_date, departure_date, return_log_id } = body;
  const logId = return_log_id || null;

  // ── Prevent double-linking ──
  const existingLinks = await base44.asServiceRole.entities.GuestReservationLink.filter({
    source_reference: booking_reference,
  });
  if (existingLinks.length > 0) {
    const existing = existingLinks[0];
    if (existing.user_id === user.id) {
      return Response.json({ success: true, status: 'already_linked', link: existing });
    }
    await _updateLog(base44, logId, 'no_match', null, 'Reference already claimed by another account');
    return Response.json({ success: false, status: 'claimed', error: 'Booking reference already linked to another account.' });
  }

  // ── Try Beds24 V2 API lookup ──
  let bookingData   = null;
  let verifiedByApi = false;
  const isConfigured = !!Deno.env.get('BEDS24_LONG_LIFE_TOKEN') && !!Deno.env.get('BEDS24_PROPERTY_ID');

  if (isConfigured && booking_reference) {
    try {
      const b = await _lookupBooking(booking_reference, extracted_email || user.email, arrival_date, base44);
      if (b) {
        const bEmail       = (b.guestEmail || b.email || '').toLowerCase().trim();
        const emailMatches = bEmail && (bEmail === user.email.toLowerCase() || bEmail === (extracted_email || '').toLowerCase());
        const dateMatches  = !arrival_date || (b.firstNight === arrival_date || b.arrival === arrival_date);

        if (emailMatches || dateMatches) {
          bookingData = {
            external_booking_id: String(b.bookId || b.id || booking_reference),
            source_reference:    booking_reference,
            room_type:           b.roomName || b.unitName || b.roomType || '',
            arrival_date:        b.firstNight || b.arrival || arrival_date,
            departure_date:      b.lastNight  || b.departure || departure_date,
            guest_name:          `${b.guestFirstName || ''} ${b.guestLastName || ''}`.trim() || user.full_name,
            guest_email:         bEmail || user.email,
            number_of_guests:    Number(b.numAdult || b.adults || 1),
            booking_status:      _mapStatus(b.status),
            payment_status:      _mapPayment(b.paymentStatus || b.payment),
            total_price:         Number(b.price || b.totalPrice || 0) || null,
            currency:            b.currency || 'EUR',
          };
          verifiedByApi = true;
        }
      }
    } catch (err) {
      console.error('beds24LinkBooking: API lookup failed:', err.message);
      await _updateLog(base44, logId, 'api_error', null, err.message);
    }
  }

  // ── Fallback: unverified link ──
  if (!bookingData && booking_reference) {
    const emailOk = extracted_email && extracted_email.toLowerCase() === user.email.toLowerCase();
    if (emailOk || arrival_date) {
      bookingData = {
        external_booking_id: booking_reference,
        source_reference:    booking_reference,
        room_type:           '',
        arrival_date:        arrival_date || '',
        departure_date:      departure_date || '',
        guest_name:          user.full_name || '',
        guest_email:         extracted_email || user.email,
        number_of_guests:    1,
        booking_status:      'confirmed',
        payment_status:      'unknown',
        total_price:         null,
        currency:            'EUR',
      };
    }
  }

  // ── Create GuestReservationLink ──
  if (bookingData) {
    const link = await base44.asServiceRole.entities.GuestReservationLink.create({
      user_id:         user.id,
      user_email:      user.email,
      source:          'beds24',
      verified:        verifiedByApi,
      verified_at:     verifiedByApi ? new Date().toISOString() : null,
      verified_by:     verifiedByApi ? 'api_auto' : null,
      linked_by_admin: false,
      return_log_id:   logId,
      ...bookingData,
    });

    await _updateLog(base44, logId, 'linked', link.id, null);

    base44.asServiceRole.entities.ActivityLog.create({
      actor_email: user.email, action: 'booking_intent_created',
      entity_type: 'GuestReservationLink', entity_id: link.id,
      entity_ref: booking_reference,
      description: `Beds24 booking ${booking_reference} linked to ${user.email} (verified: ${verifiedByApi})`,
      performed_at: new Date().toISOString(),
    }).catch(() => {});

    if (!verifiedByApi) {
      base44.asServiceRole.integrations.Core.SendEmail({
        to: 'oammesso@gmail.com',
        subject: `⚠️ Beds24 Buchung manuell prüfen – ${booking_reference}`,
        body: `Gast ${user.email} hat Buchung ${booking_reference} verknüpft, aber API-Verifikation war nicht möglich.\n\nBitte prüfen: https://www.krone-ammesso.de/admin/beds24-bookings\n\nRef: ${link.id}`,
      }).catch(() => {});
      base44.asServiceRole.entities.EmailLog.create({
        recipient: 'oammesso@gmail.com', template: 'new_reservation_admin', status: 'sent',
        subject: `⚠️ Beds24 Buchung manuell prüfen – ${booking_reference}`,
        sent_at: new Date().toISOString(), related_entity_type: 'GuestReservationLink',
        related_entity_id: link.id, related_ref: booking_reference,
      }).catch(() => {});
    }

    return Response.json({ success: true, status: verifiedByApi ? 'verified' : 'unverified', link });
  }

  // ── No match — create BookingLookupRequest ──
  const lookupReq = await base44.asServiceRole.entities.BookingLookupRequest.create({
    user_id: user.id, user_email: user.email,
    booking_reference: booking_reference || '',
    guest_email: extracted_email || user.email,
    arrival_date: arrival_date || '', departure_date: departure_date || '',
    status: 'pending', return_log_id: logId,
  });

  await _updateLog(base44, logId, 'no_match', null, 'No API match, lookup request created');

  base44.asServiceRole.integrations.Core.SendEmail({
    to: 'oammesso@gmail.com',
    subject: `🔍 Beds24 Buchung nicht zugeordnet – ${booking_reference || user.email}`,
    body: `Gast ${user.email} kehrte von Beds24 zurück, Buchung ${booking_reference || '(keine Ref)'} konnte nicht zugeordnet werden.\n\nBitte prüfen: https://www.krone-ammesso.de/admin/beds24-bookings\n\nLookup-Request ID: ${lookupReq.id}`,
  }).catch(() => {});
  base44.asServiceRole.entities.EmailLog.create({
    recipient: 'oammesso@gmail.com', template: 'new_reservation_admin', status: 'sent',
    subject: `🔍 Beds24 Buchung nicht zugeordnet – ${booking_reference || user.email}`,
    sent_at: new Date().toISOString(), related_entity_type: 'BookingLookupRequest',
    related_entity_id: lookupReq.id, related_ref: booking_reference || '',
  }).catch(() => {});

  return Response.json({ success: false, status: 'no_match', lookup_request_id: lookupReq.id });
});