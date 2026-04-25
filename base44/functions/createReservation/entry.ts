import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      first_name, last_name, email, phone = '',
      date, time, guests, requests = '', lang = 'de',
    } = body;

    // Input validation
    if (!first_name || !last_name || !email || !date || !time || !guests) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (guests < 1 || guests > 20) {
      return Response.json({ error: 'Invalid party size' }, { status: 400 });
    }
    if (!/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Validate date is not in the past
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return Response.json({ error: 'Date must be today or in the future' }, { status: 400 });
    }

    const maxCapacity = 120;

    // Validate day is not Monday (closed)
    const dayOfWeek = new Date(date + 'T12:00:00').getDay();
    if (dayOfWeek === 1) {
      return Response.json({ error: 'Restaurant closed on this date' }, { status: 400 });
    }

    // Validate time is within service windows
    const LUNCH = { start: '12:00', end: '14:15' };
    const DINNER = { start: '17:30', end: '21:30' };
    const SUNDAY = { start: '12:00', end: '19:30' };
    const isSunday = dayOfWeek === 0;
    const windows = isSunday ? [SUNDAY] : [LUNCH, DINNER];
    const timeValid = windows.some(w => time >= w.start && time <= w.end);
    if (!timeValid) {
      return Response.json({ error: 'Time not available for booking' }, { status: 400 });
    }

    // Anti-spam: check if same email submitted in last 2 minutes
    const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const recentByEmail = await base44.asServiceRole.entities.RestaurantReservation.filter({ guest_email: email.toLowerCase() });
    const veryRecent = recentByEmail.filter(r => r.created_date && r.created_date > twoMinsAgo);
    if (veryRecent.length > 0) {
      return Response.json({ error: 'Please wait a moment before submitting again' }, { status: 429 });
    }

    // Duplicate check: same email + date + time
    const dupKey = `${email.toLowerCase()}|${date}|${time}`;
    const dups = await base44.asServiceRole.entities.RestaurantReservation.filter({ duplicate_check_key: dupKey });
    const activeDups = dups.filter(d => !['cancelled_by_guest','cancelled_by_staff','no_show','archived'].includes(d.status));
    if (activeDups.length > 0) {
      return Response.json({ error: 'duplicate' }, { status: 409 });
    }

    // Capacity check immediately before create (prevent race condition)
    const finalCheck = await base44.asServiceRole.entities.RestaurantReservation.filter({
      reservation_date: date,
      reservation_time: time,
    });
    const activeStatuses = ['new', 'pending', 'confirmed', 'seated'];
    const finalUsed = finalCheck
      .filter(r => activeStatuses.includes(r.status))
      .reduce((sum, r) => sum + (r.party_size || 0), 0);
    if (finalUsed + guests > maxCapacity) {
      return Response.json({ error: 'full', retry_after_ms: 2000 }, { status: 409 });
    }

    // Generate ref
    const dateStr = date.replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    const ref = `RES-${dateStr}-${rand}`;

    // Create reservation in RestaurantReservation entity
    const reservation = await base44.asServiceRole.entities.RestaurantReservation.create({
      reservation_ref: ref,
      status: 'new',
      guest_first_name: first_name,
      guest_last_name: last_name,
      guest_email: email.toLowerCase(),
      guest_phone: phone,
      reservation_date: date,
      reservation_time: time,
      party_size: guests,
      notes: requests,
      language: lang,
      source: 'website_form',
      duplicate_check_key: dupKey,
      email_confirmation_sent: false,
      slack_notified: false,
    });

    // Fire confirmation email (non-blocking)
    // NOTE: Base44 SendEmail can only send to app users, not external emails.
    // For external guests, we log the attempt and admin must trigger manually via admin dashboard.
    (async () => {
      try {
        const templates = {
          de: {
            subject: `Ihre Tischreservierung — Ref: ${ref}`,
            body: `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
              <div style="text-align:center;padding:20px 0;border-bottom:2px solid #C9A96E;margin-bottom:24px;">
                <h1 style="font-family:Georgia,serif;color:#0F0D0B;font-weight:300;margin:0;">Krone Langenburg</h1>
                <p style="color:#C9A96E;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">by Ammesso</p>
              </div>
              <h2 style="font-family:Georgia,serif;font-weight:300;color:#0F0D0B;">Ihre Reservierung ist bestätigt</h2>
              <p>Liebe/r ${first_name} ${last_name},</p>
              <p>vielen Dank für Ihre Reservierung. Wir freuen uns auf Sie!</p>
              <div style="background:#f9f6f0;border-left:3px solid #C9A96E;padding:16px 20px;margin:20px 0;border-radius:4px;">
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:6px 0;color:#666;width:40%;">Referenz</td><td style="padding:6px 0;font-weight:bold;">${ref}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Datum</td><td style="padding:6px 0;font-weight:bold;">${date}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Uhrzeit</td><td style="padding:6px 0;font-weight:bold;">${time} Uhr</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Personen</td><td style="padding:6px 0;font-weight:bold;">${guests}</td></tr>
                  ${requests ? `<tr><td style="padding:6px 0;color:#666;">Sonderwünsche</td><td style="padding:6px 0;">${requests}</td></tr>` : ''}
                </table>
              </div>
              <p style="color:#666;font-size:14px;">Bitte erscheinen Sie pünktlich. Wir bitten um Absage mindestens 24 Stunden vorher.</p>
              <p style="color:#666;font-size:14px;">Bei Fragen kontaktieren Sie uns unter <a href="mailto:info@krone-ammesso.de" style="color:#C9A96E;">info@krone-ammesso.de</a> oder <a href="tel:+4979054177" style="color:#C9A96E;">+49 7905 41770</a>.</p>
              <p>Viele Grüße,<br/><strong>Team Krone Langenburg by Ammesso</strong></p>
              <div style="text-align:center;padding-top:20px;border-top:1px solid #eee;margin-top:24px;color:#999;font-size:12px;">
                Hauptstraße 24 · 74595 Langenburg · info@krone-ammesso.de
              </div>
            </body></html>`
          },
          en: {
            subject: `Your Table Reservation — Ref: ${ref}`,
            body: `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
              <div style="text-align:center;padding:20px 0;border-bottom:2px solid #C9A96E;margin-bottom:24px;">
                <h1 style="font-family:Georgia,serif;color:#0F0D0B;font-weight:300;margin:0;">Krone Langenburg</h1>
                <p style="color:#C9A96E;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">by Ammesso</p>
              </div>
              <h2 style="font-family:Georgia,serif;font-weight:300;color:#0F0D0B;">Your Reservation is Confirmed</h2>
              <p>Dear ${first_name} ${last_name},</p>
              <p>Thank you for your reservation. We look forward to welcoming you!</p>
              <div style="background:#f9f6f0;border-left:3px solid #C9A96E;padding:16px 20px;margin:20px 0;border-radius:4px;">
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:6px 0;color:#666;width:40%;">Reference</td><td style="padding:6px 0;font-weight:bold;">${ref}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Date</td><td style="padding:6px 0;font-weight:bold;">${date}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Time</td><td style="padding:6px 0;font-weight:bold;">${time}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Guests</td><td style="padding:6px 0;font-weight:bold;">${guests}</td></tr>
                  ${requests ? `<tr><td style="padding:6px 0;color:#666;">Special Requests</td><td style="padding:6px 0;">${requests}</td></tr>` : ''}
                </table>
              </div>
              <p style="color:#666;font-size:14px;">Please arrive on time. We kindly ask for cancellations at least 24 hours in advance.</p>
              <p style="color:#666;font-size:14px;">For questions contact us at <a href="mailto:info@krone-ammesso.de" style="color:#C9A96E;">info@krone-ammesso.de</a> or <a href="tel:+4979054177" style="color:#C9A96E;">+49 7905 41770</a>.</p>
              <p>Kind regards,<br/><strong>Team Krone Langenburg by Ammesso</strong></p>
              <div style="text-align:center;padding-top:20px;border-top:1px solid #eee;margin-top:24px;color:#999;font-size:12px;">
                Hauptstraße 24 · 74595 Langenburg · info@krone-ammesso.de
              </div>
            </body></html>`
          },
          it: {
            subject: `La vostra prenotazione — Ref: ${ref}`,
            body: `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
              <div style="text-align:center;padding:20px 0;border-bottom:2px solid #C9A96E;margin-bottom:24px;">
                <h1 style="font-family:Georgia,serif;color:#0F0D0B;font-weight:300;margin:0;">Krone Langenburg</h1>
                <p style="color:#C9A96E;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">by Ammesso</p>
              </div>
              <h2 style="font-family:Georgia,serif;font-weight:300;color:#0F0D0B;">La vostra prenotazione è confermata</h2>
              <p>Caro/a ${first_name} ${last_name},</p>
              <p>Grazie per la vostra prenotazione. Non vediamo l'ora di accogliervi!</p>
              <div style="background:#f9f6f0;border-left:3px solid #C9A96E;padding:16px 20px;margin:20px 0;border-radius:4px;">
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:6px 0;color:#666;width:40%;">Riferimento</td><td style="padding:6px 0;font-weight:bold;">${ref}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Data</td><td style="padding:6px 0;font-weight:bold;">${date}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Orario</td><td style="padding:6px 0;font-weight:bold;">${time}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Ospiti</td><td style="padding:6px 0;font-weight:bold;">${guests}</td></tr>
                  ${requests ? `<tr><td style="padding:6px 0;color:#666;">Richieste speciali</td><td style="padding:6px 0;">${requests}</td></tr>` : ''}
                </table>
              </div>
              <p style="color:#666;font-size:14px;">Vi preghiamo di arrivare puntuali. Cancellazioni entro 24 ore prima.</p>
              <p style="color:#666;font-size:14px;">Per domande: <a href="mailto:info@krone-ammesso.de" style="color:#C9A96E;">info@krone-ammesso.de</a></p>
              <p>Cordiali saluti,<br/><strong>Team Krone Langenburg by Ammesso</strong></p>
              <div style="text-align:center;padding-top:20px;border-top:1px solid #eee;margin-top:24px;color:#999;font-size:12px;">
                Hauptstraße 24 · 74595 Langenburg · info@krone-ammesso.de
              </div>
            </body></html>`
          }
        };
        const template = templates[lang] || templates.de;

        // Try to send email. If recipient is external (not an app user), SendEmail will fail.
        // In that case, log it and leave status as 'new' for admin to confirm/email manually.
        let emailSent = false;
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: email,
            from_name: 'Krone Langenburg by Ammesso',
            subject: template.subject,
            body: template.body
          });
          emailSent = true;
        } catch (emailErr) {
          // External email address — platform limitation. Log for admin visibility.
          console.warn('Email send failed (external address):', emailErr.message);
        }

        // Always confirm the reservation regardless of email delivery
        await base44.asServiceRole.entities.RestaurantReservation.update(reservation.id, {
          status: 'confirmed',
          email_confirmation_sent: emailSent,
          email_confirmation_sent_at: emailSent ? new Date().toISOString() : null,
          confirmed_at: new Date().toISOString(),
        });

        await base44.asServiceRole.entities.EmailLog.create({
          recipient: email,
          subject: template.subject,
          template: 'reservation_confirmation',
          language: lang,
          status: emailSent ? 'sent' : 'failed',
          failure_reason: emailSent ? null : 'External address — platform limitation',
          sent_at: new Date().toISOString(),
          related_entity_type: 'RestaurantReservation',
          related_entity_id: reservation.id,
          related_ref: ref
        }).catch(() => {});
      } catch (e) {
        console.error('Email/confirm flow failed:', e.message);
        // Still try to confirm the reservation so it's not stuck as 'new'
        await base44.asServiceRole.entities.RestaurantReservation.update(reservation.id, {
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
        }).catch(() => {});
      }
    })();

    // Send Slack notification (non-blocking)
    (async () => {
      try {
        const webhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
        if (!webhookUrl) return;

        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blocks: [
              { type: 'header', text: { type: 'plain_text', text: '🍽️ Neue Tischreservierung', emoji: true } },
              {
                type: 'section',
                fields: [
                  { type: 'mrkdwn', text: `*Ref:*\n${ref}` },
                  { type: 'mrkdwn', text: `*Name:*\n${first_name} ${last_name}` },
                  { type: 'mrkdwn', text: `*Datum:*\n${date}` },
                  { type: 'mrkdwn', text: `*Zeit:*\n${time} Uhr` },
                  { type: 'mrkdwn', text: `*Personen:*\n${guests}` },
                  { type: 'mrkdwn', text: `*Sprache:*\n${lang.toUpperCase()}` },
                ]
              },
              ...(requests ? [{ type: 'section', text: { type: 'mrkdwn', text: `*Sonderwünsche:*\n${requests}` } }] : []),
              { type: 'divider' }
            ]
          })
        });

        await base44.asServiceRole.entities.RestaurantReservation.update(reservation.id, {
          slack_notified: true,
          slack_notified_at: new Date().toISOString(),
        });

        await base44.asServiceRole.entities.SlackLog.create({
          channel: '#krone-reservations',
          message_type: 'new_reservation',
          status: 'sent',
          sent_at: new Date().toISOString(),
          related_entity_type: 'RestaurantReservation',
          related_entity_id: reservation.id,
          related_ref: ref
        });
      } catch (e) {
        console.error('Slack notification failed:', e.message);
        await base44.asServiceRole.entities.SlackLog.create({
          channel: '#krone-reservations',
          message_type: 'new_reservation',
          status: 'failed',
          failure_reason: e.message,
          sent_at: new Date().toISOString(),
          related_entity_type: 'RestaurantReservation',
          related_ref: ref
        }).catch(() => {});
      }
    })();

    return Response.json({ success: true, ref, reservation_id: reservation.id });
  } catch (error) {
    console.error('createReservation error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});