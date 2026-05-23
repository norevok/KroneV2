import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      first_name, last_name, email, phone = '',
      date, time, guests, requests = '', lang = 'de', gdpr_consent = false,
    } = body;

    // ── Auth check: require logged-in user ──
    let currentUser = null;
    try {
      currentUser = await base44.auth.me();
    } catch (_) {}
    if (!currentUser) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    // ── Input validation ──
    if (!first_name || !last_name || !email || !date || !time || !guests) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (guests < 1 || guests > 20) {
      return Response.json({ error: 'Invalid party size' }, { status: 400 });
    }
    if (!/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (!gdpr_consent) {
      return Response.json({ error: 'GDPR consent required' }, { status: 400 });
    }

    // ── Validate date not in past ──
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return Response.json({ error: 'Date must be today or in the future' }, { status: 400 });
    }

    const maxCapacity = 120;

    // ── Check SpecialOpeningRule (blocked/closed dates) ──
    const specialRules = await base44.asServiceRole.entities.SpecialOpeningRule.filter({
      entity_type: 'restaurant',
    }).catch(() => []);
    const applicableRule = specialRules
      .filter(r => r.effective_date <= date && (!r.end_date || r.end_date >= date))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))[0];
    if (applicableRule) {
      if (applicableRule.is_closed || applicableRule.rule_type === 'fully_closed' || applicableRule.rule_type === 'maintenance' || applicableRule.rule_type === 'private_event') {
        return Response.json({ error: 'closed' }, { status: 400 });
      }
      if (applicableRule.fully_booked || applicableRule.rule_type === 'fully_booked') {
        return Response.json({ error: 'full' }, { status: 409 });
      }
    }

    // ── Validate day is not Monday (closed) ──
    const dayOfWeek = new Date(date + 'T12:00:00').getDay();

    // Check OpeningHour overrides for this day of week
    const openingHours = await base44.asServiceRole.entities.OpeningHour.filter({
      entity_type: 'restaurant',
      day_of_week: dayOfWeek,
    }).catch(() => []);
    const dayConfig = openingHours.find(o => o.is_active !== false);

    if (dayConfig) {
      if (dayConfig.is_closed) {
        return Response.json({ error: 'closed' }, { status: 400 });
      }
      // Validate time within configured service windows
      const windows = (dayConfig.service_windows || []).filter(w => w.is_bookable !== false);
      if (windows.length > 0) {
        const timeValid = windows.some(w => time >= w.start && time <= w.end);
        if (!timeValid) {
          return Response.json({ error: 'Time not available for booking' }, { status: 400 });
        }
      }
    } else {
      // Fallback: hardcoded defaults
      if (dayOfWeek === 1) {
        return Response.json({ error: 'closed' }, { status: 400 });
      }
      const LUNCH = { start: '12:00', end: '14:15' };
      const DINNER = { start: '17:30', end: '21:30' };
      const SUNDAY = { start: '12:00', end: '19:30' };
      const isSunday = dayOfWeek === 0;
      const windows = isSunday ? [SUNDAY] : [LUNCH, DINNER];
      const timeValid = windows.some(w => time >= w.start && time <= w.end);
      if (!timeValid) {
        return Response.json({ error: 'Time not available for booking' }, { status: 400 });
      }
    }

    // ── Anti-spam: same user submitted in last 2 minutes ──
    const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const recentByEmail = await base44.asServiceRole.entities.RestaurantReservation.filter({ guest_email: email.toLowerCase() });
    const veryRecent = recentByEmail.filter(r => r.created_date && r.created_date > twoMinsAgo);
    if (veryRecent.length > 0) {
      return Response.json({ error: 'Please wait a moment before submitting again' }, { status: 429 });
    }

    // ── Duplicate check: same email + date + time ──
    const dupKey = `${email.toLowerCase()}|${date}|${time}`;
    const dups = await base44.asServiceRole.entities.RestaurantReservation.filter({ duplicate_check_key: dupKey });
    const activeDups = dups.filter(d => !['cancelled_by_guest','cancelled_by_staff','no_show','archived'].includes(d.status));
    if (activeDups.length > 0) {
      return Response.json({ error: 'duplicate' }, { status: 409 });
    }

    // ── Final capacity check (server-side, prevents race condition) ──
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

    // ── Generate ref ──
    const dateStr = date.replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    const ref = `RES-${dateStr}-${rand}`;
    const now = new Date().toISOString();

    // ── Create reservation ──
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

    // ── ConsentLog (GDPR) ──
    base44.asServiceRole.entities.ConsentLog.create({
      user_email: currentUser.email,
      consent_type: 'reservation',
      consent_given: true,
      consent_text: 'I agree to the processing of my data in accordance with the privacy policy.',
      source_page: '/reserve',
      source_form: 'reservation',
      language: lang,
      related_entity_type: 'RestaurantReservation',
      related_entity_id: reservation.id,
      consented_at: now,
    }).catch(() => {});

    // ── ActivityLog ──
    base44.asServiceRole.entities.ActivityLog.create({
      actor_email: currentUser.email,
      action: 'reservation_created',
      entity_type: 'RestaurantReservation',
      entity_id: reservation.id,
      entity_ref: ref,
      description: `Reservation ${ref} created by ${currentUser.email} for ${date} ${time}, ${guests} guests`,
      performed_at: now,
    }).catch(() => {});

    // ── Fire confirmation emails + Slack (non-blocking) ──
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
              <p style="color:#666;font-size:14px;">Fragen? <a href="mailto:info@krone-ammesso.de" style="color:#C9A96E;">info@krone-ammesso.de</a> · <a href="tel:+4979054177" style="color:#C9A96E;">+49 7905 41770</a></p>
              <p>Viele Grüße,<br/><strong>Team Krone Langenburg by Ammesso</strong></p>
              <div style="text-align:center;padding-top:20px;border-top:1px solid #eee;margin-top:24px;color:#999;font-size:12px;">Hauptstraße 24 · 74595 Langenburg</div>
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
              <p style="color:#666;font-size:14px;"><a href="mailto:info@krone-ammesso.de" style="color:#C9A96E;">info@krone-ammesso.de</a> · <a href="tel:+4979054177" style="color:#C9A96E;">+49 7905 41770</a></p>
              <p>Kind regards,<br/><strong>Team Krone Langenburg by Ammesso</strong></p>
              <div style="text-align:center;padding-top:20px;border-top:1px solid #eee;margin-top:24px;color:#999;font-size:12px;">Hauptstraße 24 · 74595 Langenburg</div>
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
              <p style="color:#666;font-size:14px;"><a href="mailto:info@krone-ammesso.de" style="color:#C9A96E;">info@krone-ammesso.de</a></p>
              <p>Cordiali saluti,<br/><strong>Team Krone Langenburg by Ammesso</strong></p>
              <div style="text-align:center;padding-top:20px;border-top:1px solid #eee;margin-top:24px;color:#999;font-size:12px;">Hauptstraße 24 · 74595 Langenburg</div>
            </body></html>`
          }
        };
        const template = templates[lang] || templates.de;

        // Guest confirmation email
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
          console.warn('Guest email send failed:', emailErr.message);
        }

        // Admin notification email
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: 'info@krone-ammesso.de',
            from_name: 'Krone Reservierungen',
            subject: `[Neue Reservierung] ${first_name} ${last_name} — ${date} ${time} — ${guests} P.`,
            body: `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
              <h2 style="font-family:Georgia,serif;font-weight:300;">Neue Tischreservierung ✓</h2>
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td style="padding:6px 0;color:#666;">Referenz</td><td style="padding:6px 0;font-weight:bold;">${ref}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Name</td><td style="padding:6px 0;">${first_name} ${last_name}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">E-Mail</td><td style="padding:6px 0;">${email}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Telefon</td><td style="padding:6px 0;">${phone || '—'}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Datum</td><td style="padding:6px 0;font-weight:bold;">${date}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Uhrzeit</td><td style="padding:6px 0;font-weight:bold;">${time} Uhr</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Personen</td><td style="padding:6px 0;font-weight:bold;">${guests}</td></tr>
                ${requests ? `<tr><td style="padding:6px 0;color:#666;">Sonderwünsche</td><td style="padding:6px 0;">${requests}</td></tr>` : ''}
                <tr><td style="padding:6px 0;color:#666;">Konto</td><td style="padding:6px 0;">${currentUser.email}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Sprache</td><td style="padding:6px 0;">${lang.toUpperCase()}</td></tr>
              </table>
              <p style="margin-top:16px;"><a href="https://krone.base44.app/admin" style="background:#8B6914;color:#fff;padding:10px 20px;border-radius:20px;text-decoration:none;font-size:13px;">Im Admin öffnen →</a></p>
            </body></html>`,
          });
        } catch (adminErr) {
          console.warn('Admin notification email failed:', adminErr.message);
        }

        // Update reservation: confirm + track email status
        await base44.asServiceRole.entities.RestaurantReservation.update(reservation.id, {
          status: 'confirmed',
          email_confirmation_sent: emailSent,
          email_confirmation_sent_at: emailSent ? now : null,
          confirmed_at: now,
        });

        // EmailLog
        await base44.asServiceRole.entities.EmailLog.create({
          recipient: email,
          subject: template.subject,
          template: 'reservation_confirmation',
          language: lang,
          status: emailSent ? 'sent' : 'failed',
          failure_reason: emailSent ? null : 'External address or platform limitation',
          sent_at: now,
          related_entity_type: 'RestaurantReservation',
          related_entity_id: reservation.id,
          related_ref: ref
        }).catch(() => {});

        // AdminAuditEntry
        base44.asServiceRole.entities.AdminAuditEntry.create({
          admin_email: currentUser.email,
          action: 'create',
          entity_type: 'RestaurantReservation',
          entity_id: reservation.id,
          entity_ref: ref,
          change_summary: `Reservation ${ref} created: ${date} ${time}, ${guests} guests, ${email}`,
          performed_at: now,
        }).catch(() => {});

      } catch (e) {
        console.error('Email/confirm flow failed:', e.message);
        // Ensure reservation is still confirmed even if email fails
        await base44.asServiceRole.entities.RestaurantReservation.update(reservation.id, {
          status: 'confirmed',
          confirmed_at: now,
        }).catch(() => {});
      }
    })();

    // ── Slack notification (non-blocking) ──
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
                  { type: 'mrkdwn', text: `*Konto:*\n${currentUser.email}` },
                ]
              },
              ...(requests ? [{ type: 'section', text: { type: 'mrkdwn', text: `*Sonderwünsche:*\n${requests}` } }] : []),
              { type: 'divider' }
            ]
          })
        });
        await base44.asServiceRole.entities.RestaurantReservation.update(reservation.id, {
          slack_notified: true,
          slack_notified_at: now,
        });
        base44.asServiceRole.entities.SlackLog.create({
          channel: '#krone-reservations',
          message_type: 'new_reservation',
          status: 'sent',
          sent_at: now,
          related_entity_type: 'RestaurantReservation',
          related_entity_id: reservation.id,
          related_ref: ref
        }).catch(() => {});
      } catch (e) {
        console.error('Slack notification failed:', e.message);
        base44.asServiceRole.entities.SlackLog.create({
          channel: '#krone-reservations',
          message_type: 'new_reservation',
          status: 'failed',
          failure_reason: e.message,
          sent_at: now,
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