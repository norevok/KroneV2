import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * adminBeds24Lookup
 * Admin-only: Look up a booking in Beds24 API and optionally link it to a guest.
 * Payload: { booking_reference?, guest_email?, arrival_date?, lookup_request_id?, guest_user_id? }
 */
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { booking_reference, guest_email, arrival_date, lookup_request_id, guest_user_id, action } = body;

  const apiKey = Deno.env.get('BEDS24_API_KEY');
  if (!apiKey) {
    return Response.json({ error: 'BEDS24_API_KEY not configured' }, { status: 400 });
  }

  const creds = await base44.asServiceRole.entities.Beds24ApiCredential.list();
  const cred = creds[0];
  const baseUrl = cred?.api_base_url || 'https://api.beds24.com/v2';

  // --- Manual link action (admin links without API lookup) ---
  if (action === 'manual_link' && lookup_request_id && guest_user_id) {
    const req2 = await base44.asServiceRole.entities.BookingLookupRequest.filter({ id: lookup_request_id });
    const lookupReq = req2[0];
    if (!lookupReq) return Response.json({ error: 'Lookup request not found' }, { status: 404 });

    const link = await base44.asServiceRole.entities.GuestReservationLink.create({
      user_id: guest_user_id,
      user_email: lookupReq.guest_email,
      source: 'beds24',
      source_reference: lookupReq.booking_reference || booking_reference || 'MANUAL',
      external_booking_id: booking_reference || lookupReq.booking_reference || '',
      arrival_date: lookupReq.arrival_date || arrival_date || '',
      departure_date: lookupReq.departure_date || '',
      guest_name: `${lookupReq.first_name || ''} ${lookupReq.last_name || ''}`.trim(),
      guest_email: lookupReq.guest_email,
      booking_status: 'confirmed',
      payment_status: 'unknown',
      verified: true,
      verified_at: new Date().toISOString(),
      verified_by: user.email,
      linked_by_admin: true,
      admin_notes: body.admin_notes || `Manually linked by ${user.email}`,
    });

    await base44.asServiceRole.entities.BookingLookupRequest.update(lookup_request_id, {
      status: 'linked',
      linked_reservation_id: link.id,
      admin_reviewed_by: user.email,
      admin_reviewed_at: new Date().toISOString(),
      admin_notes: body.admin_notes,
    });

    // Notify guest — only if email_sent flag not set
    if (!lookupReq.email_sent_to_guest) {
      base44.asServiceRole.integrations.Core.SendEmail({
        to: lookupReq.guest_email,
        subject: 'Ihre Buchung wurde mit Ihrem Krone Gäste-Konto verknüpft',
        body: `Liebe/r Gast,\n\nIhre Zimmerbuchung bei Krone Langenburg wurde erfolgreich Ihrem Gäste-Konto zugeordnet.\n\nSie können Ihre Buchung jetzt unter "Meine Reisen" einsehen: https://krone-ammesso.de/account/reservations\n\nBei Fragen stehen wir Ihnen gerne zur Verfügung.\n\nMit herzlichen Grüßen\nIhr Team Krone Langenburg by Ammesso`,
      }).catch(() => {});
      base44.asServiceRole.entities.EmailLog.create({
        recipient: lookupReq.guest_email,
        subject: 'Ihre Buchung wurde mit Ihrem Krone Gäste-Konto verknüpft',
        template: 'guest_welcome',
        status: 'sent',
        sent_at: new Date().toISOString(),
        related_entity_type: 'GuestReservationLink',
        related_entity_id: link.id,
        related_ref: link.source_reference,
      }).catch(() => {});
      // Mark as sent to prevent duplicates
      base44.asServiceRole.entities.BookingLookupRequest.update(lookup_request_id, {
        email_sent_to_guest: true,
      }).catch(() => {});
    }

    // Admin audit entry
    base44.asServiceRole.entities.AdminAuditEntry.create({
      admin_email: user.email,
      action: 'manual_sync',
      entity_type: 'GuestReservationLink',
      entity_id: link.id,
      entity_ref: link.source_reference,
      change_summary: `Admin ${user.email} manually linked booking ${link.source_reference} to guest ${lookupReq.guest_email}`,
      performed_at: new Date().toISOString(),
    }).catch(() => {});

    return Response.json({ success: true, link });
  }

  // --- API lookup ---
  if (!booking_reference && !guest_email) {
    return Response.json({ error: 'booking_reference or guest_email required' }, { status: 400 });
  }

  let url = `${baseUrl}/bookings?includeInvoice=false`;
  if (booking_reference) url += `&bookId=${encodeURIComponent(booking_reference)}`;
  if (guest_email) url += `&email=${encodeURIComponent(guest_email)}`;
  if (arrival_date) url += `&arrivalFrom=${arrival_date}`;

  const apiRes = await fetch(url, {
    headers: { 'token': apiKey, 'Content-Type': 'application/json' },
  });

  if (!apiRes.ok) {
    const errText = await apiRes.text();
    return Response.json({ error: `Beds24 API error: ${apiRes.status}`, detail: errText }, { status: 502 });
  }

  const apiData = await apiRes.json();
  const bookings = apiData?.data || apiData?.bookings || [];

  // Strip sensitive fields before returning to admin UI
  const safeBookings = bookings.map(b => ({
    bookId: b.bookId || b.id,
    reference: b.bookId || b.id,
    roomName: b.roomName || b.unitName || '',
    guestName: `${b.guestFirstName || ''} ${b.guestLastName || ''}`.trim(),
    guestEmail: b.guestEmail || b.email || '',
    firstNight: b.firstNight || b.arrival,
    lastNight: b.lastNight || b.departure,
    adults: b.numAdult || b.adults || 1,
    status: b.status,
    paymentStatus: b.paymentStatus,
    price: b.price || b.totalPrice,
    currency: b.currency || 'EUR',
  }));

  return Response.json({ success: true, bookings: safeBookings, total: safeBookings.length });
});