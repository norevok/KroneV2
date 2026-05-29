/**
 * adminBeds24Lookup
 * Admin-only: Look up a booking in Beds24 V2 API and optionally link it to a guest.
 * Uses Beds24 V2 refresh-token auth (cached access token).
 * NEVER exposes tokens in responses.
 * Allowed: admin manual lookup only.
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

function _audit(base44, fields) {
  base44.asServiceRole.entities.IntegrationExecutionLog.create({
    integration: 'beds24', executed_at: new Date().toISOString(), ...fields,
  }).catch(() => {});
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Config validation
  const longLifeToken = Deno.env.get('BEDS24_LONG_LIFE_TOKEN') || '';
  const propertyId    = Deno.env.get('BEDS24_PROPERTY_ID')     || '';
  const baseUrl       = Deno.env.get('BEDS24_API_BASE_URL')    || 'https://api.beds24.com/v2';

  if (!longLifeToken || !propertyId) {
    return Response.json({
      error: 'Beds24 integration not configured.',
      missing: [...(!longLifeToken ? ['BEDS24_LONG_LIFE_TOKEN'] : []), ...(!propertyId ? ['BEDS24_PROPERTY_ID'] : [])],
    }, { status: 400 });
  }

  const body = await req.json();
  const { booking_reference, guest_email, arrival_date, lookup_request_id, guest_user_id, action } = body;

  // ── Manual link action ──
  if (action === 'manual_link' && lookup_request_id && guest_user_id) {
    const rows      = await base44.asServiceRole.entities.BookingLookupRequest.filter({ id: lookup_request_id });
    const lookupReq = rows[0];
    if (!lookupReq) return Response.json({ error: 'Lookup request not found' }, { status: 404 });

    const link = await base44.asServiceRole.entities.GuestReservationLink.create({
      user_id:          guest_user_id,
      user_email:       lookupReq.guest_email,
      source:           'beds24',
      source_reference: lookupReq.booking_reference || booking_reference || 'MANUAL',
      external_booking_id: booking_reference || lookupReq.booking_reference || '',
      arrival_date:     lookupReq.arrival_date || arrival_date || '',
      departure_date:   lookupReq.departure_date || '',
      guest_name:       `${lookupReq.first_name || ''} ${lookupReq.last_name || ''}`.trim(),
      guest_email:      lookupReq.guest_email,
      booking_status:   'confirmed',
      payment_status:   'unknown',
      verified:         true,
      verified_at:      new Date().toISOString(),
      verified_by:      user.email,
      linked_by_admin:  true,
      admin_notes:      body.admin_notes || `Manually linked by ${user.email}`,
    });

    await base44.asServiceRole.entities.BookingLookupRequest.update(lookup_request_id, {
      status: 'linked', linked_reservation_id: link.id,
      admin_reviewed_by: user.email, admin_reviewed_at: new Date().toISOString(),
      admin_notes: body.admin_notes,
    });

    if (!lookupReq.email_sent_to_guest) {
      base44.asServiceRole.integrations.Core.SendEmail({
        to: lookupReq.guest_email,
        subject: 'Ihre Buchung wurde mit Ihrem Krone Gäste-Konto verknüpft',
        body: `Liebe/r Gast,\n\nIhre Zimmerbuchung bei Krone Langenburg wurde erfolgreich Ihrem Gäste-Konto zugeordnet.\n\nSie können Ihre Buchung jetzt unter "Meine Reisen" einsehen: https://krone-ammesso.de/account/reservations\n\nMit herzlichen Grüßen\nIhr Team Krone Langenburg by Ammesso`,
      }).catch(() => {});
      base44.asServiceRole.entities.EmailLog.create({
        recipient: lookupReq.guest_email, template: 'guest_welcome', status: 'sent',
        subject: 'Ihre Buchung wurde mit Ihrem Krone Gäste-Konto verknüpft',
        sent_at: new Date().toISOString(), related_entity_type: 'GuestReservationLink',
        related_entity_id: link.id, related_ref: link.source_reference,
      }).catch(() => {});
      base44.asServiceRole.entities.BookingLookupRequest.update(lookup_request_id, { email_sent_to_guest: true }).catch(() => {});
    }

    base44.asServiceRole.entities.AdminAuditEntry.create({
      admin_email: user.email, action: 'manual_sync', entity_type: 'GuestReservationLink',
      entity_id: link.id, entity_ref: link.source_reference,
      change_summary: `Admin ${user.email} manually linked booking ${link.source_reference} to ${lookupReq.guest_email}`,
      performed_at: new Date().toISOString(),
    }).catch(() => {});

    return Response.json({ success: true, link });
  }

  // ── API lookup ──
  if (!booking_reference && !guest_email) {
    return Response.json({ error: 'booking_reference or guest_email required' }, { status: 400 });
  }

  const token = await _getAccessToken(base44);

  let url = `${baseUrl}/bookings?includeInvoice=false`;
  if (booking_reference) url += `&bookId=${encodeURIComponent(booking_reference)}`;
  if (guest_email)       url += `&guestEmail=${encodeURIComponent(guest_email)}`;
  if (arrival_date)      url += `&arrivalFrom=${encodeURIComponent(arrival_date)}`;

  const t0  = Date.now();
  const res = await fetch(url, { headers: { 'token': token } });

  _audit(base44, {
    action: 'api_request', endpoint: '/bookings',
    http_status: res.status, success: res.ok,
    duration_ms: Date.now() - t0, token_used: 'access_token',
    token_was_cached: true, related_ref: booking_reference || '',
    triggered_by: 'admin_lookup', error_message: res.ok ? undefined : `HTTP ${res.status}`,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    return Response.json({ error: `Beds24 API error: ${res.status}`, detail: errText }, { status: 502 });
  }

  const data     = await res.json();
  const bookings = data?.data || data?.bookings || [];

  // Strip sensitive fields — never return raw data to frontend
  const safeBookings = bookings.map(b => ({
    bookId:        b.bookId || b.id,
    reference:     b.bookId || b.id,
    roomName:      b.roomName || b.unitName || '',
    guestName:     `${b.guestFirstName || ''} ${b.guestLastName || ''}`.trim(),
    guestEmail:    b.guestEmail || b.email || '',
    firstNight:    b.firstNight || b.arrival,
    lastNight:     b.lastNight  || b.departure,
    adults:        b.numAdult   || b.adults || 1,
    status:        b.status,
    paymentStatus: b.paymentStatus,
    price:         b.price || b.totalPrice,
    currency:      b.currency || 'EUR',
  }));

  return Response.json({ success: true, bookings: safeBookings, total: safeBookings.length });
});