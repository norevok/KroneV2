import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const { reservation_id } = await req.json();
    if (!reservation_id) return Response.json({ error: 'Missing reservation_id' }, { status: 400 });

    let r;
    try {
      r = await base44.asServiceRole.entities.RestaurantReservation.get(reservation_id);
    } catch (_) {
      r = null;
    }
    if (!r) return Response.json({ error: 'Not found' }, { status: 404 });

    const lang = r.language || 'de';
    const ref = r.reservation_ref;

    const templates = {
      de: {
        subject: `Ihre Tischreservierung — Ref: ${ref}`,
        body: `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
          <div style="text-align:center;padding:20px 0;border-bottom:2px solid #C9A96E;margin-bottom:24px;">
            <h1 style="font-family:Georgia,serif;color:#0F0D0B;font-weight:300;margin:0;">Krone Langenburg</h1>
            <p style="color:#C9A96E;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">by Ammesso</p>
          </div>
          <h2 style="font-family:Georgia,serif;font-weight:300;color:#0F0D0B;">Ihre Reservierungsbestätigung</h2>
          <p>Liebe/r ${r.guest_first_name} ${r.guest_last_name},</p>
          <p>anbei Ihre Reservierungsdetails zur Erinnerung:</p>
          <div style="background:#f9f6f0;border-left:3px solid #C9A96E;padding:16px 20px;margin:20px 0;border-radius:4px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#666;width:40%;">Referenz</td><td style="padding:6px 0;font-weight:bold;">${ref}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Datum</td><td style="padding:6px 0;font-weight:bold;">${r.reservation_date}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Uhrzeit</td><td style="padding:6px 0;font-weight:bold;">${r.reservation_time} Uhr</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Personen</td><td style="padding:6px 0;font-weight:bold;">${r.party_size}</td></tr>
              ${r.notes ? `<tr><td style="padding:6px 0;color:#666;">Sonderwünsche</td><td style="padding:6px 0;">${r.notes}</td></tr>` : ''}
            </table>
          </div>
          <p style="color:#666;font-size:14px;">Bei Fragen: <a href="mailto:info@krone-ammesso.de" style="color:#C9A96E;">info@krone-ammesso.de</a> oder <a href="tel:+4979054177" style="color:#C9A96E;">+49 7905 41770</a></p>
          <p>Viele Grüße,<br/><strong>Team Krone Langenburg by Ammesso</strong></p>
          <div style="text-align:center;padding-top:20px;border-top:1px solid #eee;margin-top:24px;color:#999;font-size:12px;">Hauptstraße 24 · 74595 Langenburg · info@krone-ammesso.de</div>
        </body></html>`
      },
      en: {
        subject: `Your Table Reservation — Ref: ${ref}`,
        body: `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
          <div style="text-align:center;padding:20px 0;border-bottom:2px solid #C9A96E;margin-bottom:24px;">
            <h1 style="font-family:Georgia,serif;color:#0F0D0B;font-weight:300;margin:0;">Krone Langenburg</h1>
            <p style="color:#C9A96E;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">by Ammesso</p>
          </div>
          <h2 style="font-family:Georgia,serif;font-weight:300;color:#0F0D0B;">Your Reservation Confirmation</h2>
          <p>Dear ${r.guest_first_name} ${r.guest_last_name},</p>
          <p>Here are your reservation details as a reminder:</p>
          <div style="background:#f9f6f0;border-left:3px solid #C9A96E;padding:16px 20px;margin:20px 0;border-radius:4px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#666;width:40%;">Reference</td><td style="padding:6px 0;font-weight:bold;">${ref}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Date</td><td style="padding:6px 0;font-weight:bold;">${r.reservation_date}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Time</td><td style="padding:6px 0;font-weight:bold;">${r.reservation_time}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Guests</td><td style="padding:6px 0;font-weight:bold;">${r.party_size}</td></tr>
              ${r.notes ? `<tr><td style="padding:6px 0;color:#666;">Special Requests</td><td style="padding:6px 0;">${r.notes}</td></tr>` : ''}
            </table>
          </div>
          <p style="color:#666;font-size:14px;">Questions? <a href="mailto:info@krone-ammesso.de" style="color:#C9A96E;">info@krone-ammesso.de</a></p>
          <p>Kind regards,<br/><strong>Team Krone Langenburg by Ammesso</strong></p>
          <div style="text-align:center;padding-top:20px;border-top:1px solid #eee;margin-top:24px;color:#999;font-size:12px;">Hauptstraße 24 · 74595 Langenburg · info@krone-ammesso.de</div>
        </body></html>`
      },
      it: {
        subject: `La vostra prenotazione — Ref: ${ref}`,
        body: `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
          <div style="text-align:center;padding:20px 0;border-bottom:2px solid #C9A96E;margin-bottom:24px;">
            <h1 style="font-family:Georgia,serif;color:#0F0D0B;font-weight:300;margin:0;">Krone Langenburg</h1>
            <p style="color:#C9A96E;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">by Ammesso</p>
          </div>
          <h2 style="font-family:Georgia,serif;font-weight:300;color:#0F0D0B;">Conferma prenotazione</h2>
          <p>Caro/a ${r.guest_first_name} ${r.guest_last_name},</p>
          <p>Ecco i dettagli della vostra prenotazione:</p>
          <div style="background:#f9f6f0;border-left:3px solid #C9A96E;padding:16px 20px;margin:20px 0;border-radius:4px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#666;width:40%;">Riferimento</td><td style="padding:6px 0;font-weight:bold;">${ref}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Data</td><td style="padding:6px 0;font-weight:bold;">${r.reservation_date}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Orario</td><td style="padding:6px 0;font-weight:bold;">${r.reservation_time}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Ospiti</td><td style="padding:6px 0;font-weight:bold;">${r.party_size}</td></tr>
              ${r.notes ? `<tr><td style="padding:6px 0;color:#666;">Richieste speciali</td><td style="padding:6px 0;">${r.notes}</td></tr>` : ''}
            </table>
          </div>
          <p style="color:#666;font-size:14px;">Domande? <a href="mailto:info@krone-ammesso.de" style="color:#C9A96E;">info@krone-ammesso.de</a></p>
          <p>Cordiali saluti,<br/><strong>Team Krone Langenburg by Ammesso</strong></p>
        </body></html>`
      },
    };

    const tmpl = templates[lang] || templates.de;

    let emailSent = false;
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: r.guest_email,
        from_name: 'Krone Langenburg by Ammesso',
        subject: tmpl.subject,
        body: tmpl.body,
      });
      emailSent = true;
    } catch (emailErr) {
      console.warn('Resend email failed (external address):', emailErr.message);
    }

    await base44.asServiceRole.entities.RestaurantReservation.update(reservation_id, {
      email_confirmation_sent: emailSent,
      email_confirmation_sent_at: emailSent ? new Date().toISOString() : r.email_confirmation_sent_at,
    }).catch(() => {});

    await base44.asServiceRole.entities.EmailLog.create({
      recipient: r.guest_email,
      subject: tmpl.subject,
      template: 'reservation_confirmation',
      language: lang,
      status: emailSent ? 'sent' : 'failed',
      failure_reason: emailSent ? null : 'External address — platform limitation',
      sent_at: new Date().toISOString(),
      related_entity_type: 'RestaurantReservation',
      related_entity_id: reservation_id,
      related_ref: ref,
    }).catch(() => {});

    return Response.json({ success: true, email_sent: emailSent });
  } catch (error) {
    console.error('resendConfirmationEmail error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});