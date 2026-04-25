import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const { type, ref, name, date, time, guests, lang, email, inquiry_type, message, check_in, check_out, status } = payload;

    const webhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
    if (!webhookUrl || !webhookUrl.startsWith('https://')) {
      console.warn('SLACK_WEBHOOK_URL not configured or invalid');
      return Response.json({ skipped: true, reason: 'SLACK_WEBHOOK_URL not configured' });
    }

    let blocks = [];

    if (type === 'reservation' || type === 'new_reservation') {
      blocks = [
        { type: 'header', text: { type: 'plain_text', text: '🍽️ Neue Tischreservierung', emoji: true } },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Ref:*\n${ref}` },
            { type: 'mrkdwn', text: `*Name:*\n${name}` },
            { type: 'mrkdwn', text: `*Datum:*\n${date}` },
            { type: 'mrkdwn', text: `*Zeit:*\n${time} Uhr` },
            { type: 'mrkdwn', text: `*Personen:*\n${guests}` },
            { type: 'mrkdwn', text: `*Sprache:*\n${lang?.toUpperCase() || 'DE'}` },
          ]
        },
        { type: 'divider' }
      ];
    } else if (type === 'reservation_cancelled') {
      blocks = [
        { type: 'header', text: { type: 'plain_text', text: '❌ Reservierung storniert', emoji: true } },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Ref:*\n${ref}` },
            { type: 'mrkdwn', text: `*Name:*\n${name}` },
            { type: 'mrkdwn', text: `*Datum:*\n${date || '—'}` },
            { type: 'mrkdwn', text: `*Zeit:*\n${time || '—'}` },
          ]
        },
        { type: 'divider' }
      ];
    } else if (type === 'contact') {
      blocks = [
        { type: 'header', text: { type: 'plain_text', text: '📩 Neue Kontaktanfrage', emoji: true } },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Art:*\n${inquiry_type || 'general'}` },
            { type: 'mrkdwn', text: `*Name:*\n${name}` },
            { type: 'mrkdwn', text: `*Email:*\n${email || '—'}` },
          ]
        },
        ...(message ? [{ type: 'section', text: { type: 'mrkdwn', text: `*Nachricht:*\n${message}` } }] : []),
        { type: 'divider' }
      ];
    } else if (type === 'guest_message') {
      blocks = [
        { type: 'header', text: { type: 'plain_text', text: '💬 Gästenachricht', emoji: true } },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Von:*\n${name}` },
            { type: 'mrkdwn', text: `*Email:*\n${email || '—'}` },
            { type: 'mrkdwn', text: `*Art:*\n${inquiry_type || '—'}` },
          ]
        },
        ...(message ? [{ type: 'section', text: { type: 'mrkdwn', text: `*Nachricht:*\n${message}` } }] : []),
        { type: 'divider' }
      ];
    } else if (type === 'document_uploaded') {
      blocks = [
        { type: 'header', text: { type: 'plain_text', text: '📎 Neues Dokument hochgeladen', emoji: true } },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Gast:*\n${email || name}` },
            { type: 'mrkdwn', text: `*Kategorie:*\n${inquiry_type || '—'}` },
            { type: 'mrkdwn', text: `*Datei:*\n${message || '—'}` },
          ]
        },
        { type: 'divider' }
      ];
    } else if (type === 'booking_intent') {
      blocks = [
        { type: 'header', text: { type: 'plain_text', text: '🏨 Buchungsweiterleitung (Beds24)', emoji: true } },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Ref:*\n${ref}` },
            { type: 'mrkdwn', text: `*Name:*\n${name || '—'}` },
            { type: 'mrkdwn', text: `*Check-in:*\n${check_in || date || '—'}` },
            { type: 'mrkdwn', text: `*Check-out:*\n${check_out || '—'}` },
            { type: 'mrkdwn', text: `*Personen:*\n${guests || '—'}` },
          ]
        }
      ];
    } else if (type === 'booking_returned') {
      const emoji = status === 'returned_confirmed' ? '✅' : status === 'returned_cancelled' ? '❌' : '⏳';
      const statusLabel = status === 'returned_confirmed' ? 'Buchung bestätigt' : status === 'returned_cancelled' ? 'Buchung abgebrochen' : 'Buchung ausstehend';
      blocks = [
        { type: 'header', text: { type: 'plain_text', text: `${emoji} Beds24-Rückkehr — ${statusLabel}`, emoji: true } },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Intent-Ref:*\n${ref}` },
            { type: 'mrkdwn', text: `*Status:*\n${status}` },
            ...(payload.booking_ref ? [{ type: 'mrkdwn', text: `*Beds24-Buchungsref:*\n${payload.booking_ref}` }] : []),
            ...(check_in ? [{ type: 'mrkdwn', text: `*Check-in:*\n${check_in}` }] : []),
            ...(check_out ? [{ type: 'mrkdwn', text: `*Check-out:*\n${check_out}` }] : []),
            ...(name ? [{ type: 'mrkdwn', text: `*Gast:*\n${name}` }] : []),
          ]
        },
        ...(status === 'returned_confirmed' ? [{
          type: 'section',
          text: { type: 'mrkdwn', text: `✅ *Buchung erfolgreich über Beds24 abgeschlossen.* Bitte Buchungsbestätigung im Beds24-System prüfen.` }
        }] : []),
        { type: 'divider' }
      ];
    } else if (type === 'beds24_booking') {
      // Full hotel booking notification (new booking confirmed in Beds24)
      const bookingRef = payload.booking_ref || payload.beds24_ref || ref;
      const guestName = payload.guest_name || name || '—';
      const guestEmail = payload.guest_email || email || '—';
      const guestPhone = payload.guest_phone || '—';
      const roomName = payload.room_name || payload.room_category || '—';
      const totalPrice = payload.total_price ? `€ ${payload.total_price}` : '—';
      const nights = payload.nights || '—';
      const source = payload.source || 'Beds24';

      blocks = [
        { type: 'header', text: { type: 'plain_text', text: '🏨 Neue Hotelbuchung — Beds24', emoji: true } },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Buchungsref:*\n${bookingRef}` },
            { type: 'mrkdwn', text: `*Quelle:*\n${source}` },
            { type: 'mrkdwn', text: `*Gast:*\n${guestName}` },
            { type: 'mrkdwn', text: `*E-Mail:*\n${guestEmail}` },
            { type: 'mrkdwn', text: `*Telefon:*\n${guestPhone}` },
            { type: 'mrkdwn', text: `*Zimmer:*\n${roomName}` },
            { type: 'mrkdwn', text: `*Check-in:*\n${check_in || date || '—'}` },
            { type: 'mrkdwn', text: `*Check-out:*\n${check_out || '—'}` },
            { type: 'mrkdwn', text: `*Nächte:*\n${nights}` },
            { type: 'mrkdwn', text: `*Gesamtpreis:*\n${totalPrice}` },
          ]
        },
        ...(guests ? [{ type: 'section', text: { type: 'mrkdwn', text: `*Gäste:* ${guests}` } }] : []),
        ...(payload.special_requests ? [{ type: 'section', text: { type: 'mrkdwn', text: `*Sonderwünsche:*\n${payload.special_requests}` } }] : []),
        {
          type: 'section',
          text: { type: 'mrkdwn', text: `✅ Buchung im <https://beds24.com|Beds24 Dashboard> prüfen und bestätigen.` }
        },
        { type: 'divider' }
      ];
    } else {
      return Response.json({ skipped: true, reason: 'Unknown notification type' });
    }

    const slackRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    });

    // Log Slack attempt
    const base44 = createClientFromRequest(req);
    const hotelTypes = ['booking_intent', 'booking_returned', 'beds24_booking'];
    const resTypes = ['reservation', 'new_reservation', 'reservation_cancelled'];
    const channel = resTypes.includes(type) ? '#krone-reservations' : hotelTypes.includes(type) ? '#krone-hotel' : '#krone-ops-alerts';
    const entityTypeMap = {
      reservation: 'RestaurantReservation',
      reservation_cancelled: 'RestaurantReservation',
      contact: 'ContactInquiry',
      guest_message: 'GuestMessage',
      document_uploaded: 'GuestDocument',
      booking_intent: 'HotelBookingIntent',
      booking_returned: 'HotelBookingIntent',
      beds24_booking: 'HotelBookingIntent',
    };

    await base44.asServiceRole.entities.SlackLog.create({
      channel,
      message_type: type,
      status: slackRes.ok ? 'sent' : 'failed',
      sent_at: new Date().toISOString(),
      related_entity_type: entityTypeMap[type] || 'RestaurantReservation',
      related_ref: ref
    }).catch(() => {});

    if (!slackRes.ok) {
      console.error(`Slack error: ${slackRes.status}`);
      return Response.json({ error: `Slack error: ${slackRes.status}` }, { status: 500 });
    }

    // Update records after successful Slack send
    if ((type === 'reservation' || type === 'new_reservation' || type === 'reservation_cancelled') && ref) {
      const items = await base44.asServiceRole.entities.RestaurantReservation.filter({ reservation_ref: ref });
      if (items.length > 0) {
        await base44.asServiceRole.entities.RestaurantReservation.update(items[0].id, { slack_notified: true, slack_notified_at: new Date().toISOString() });
      }
    }
    if ((type === 'booking_intent' || type === 'booking_returned' || type === 'beds24_booking') && ref) {
      const items = await base44.asServiceRole.entities.HotelBookingIntent.filter({ intent_ref: ref }).catch(() => []);
      if (items.length > 0) {
        await base44.asServiceRole.entities.HotelBookingIntent.update(items[0].id, { slack_notified: true }).catch(() => {});
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('notifySlack error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});