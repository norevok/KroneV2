import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { first_name, last_name, email, phone = '', message, inquiry_type = 'general', lang = 'de' } = await req.json();

    const typeLabels = {
      general:  { de: 'Allgemeine Anfrage', en: 'General Enquiry', it: 'Richiesta generale' },
      wedding:  { de: 'Hochzeit & Events', en: 'Wedding & Events', it: 'Matrimoni & eventi' },
      group:    { de: 'Gruppenanfrage', en: 'Group Booking', it: 'Prenotazione di gruppo' },
      business: { de: 'Geschäftsreise', en: 'Business Travel', it: "Viaggio d'affari" },
    };
    const typeLabel = typeLabels[inquiry_type]?.[lang] || inquiry_type;

    // Fetch admin email from SiteSettings — fall back to hardcoded default
    let adminEmail = 'info@krone-ammesso.de';
    try {
      const settings = await base44.asServiceRole.entities.SiteSettings.filter({ key: 'global' }, undefined, 1);
      if (settings?.[0]?.email_reservations) adminEmail = settings[0].email_reservations;
      else if (settings?.[0]?.email_info) adminEmail = settings[0].email_info;
    } catch (_) {}

    const autoReply = {
      de: {
        subject: 'Ihre Nachricht ist angekommen — Krone Langenburg by Ammesso',
        body: `<p>Liebe/r ${first_name},</p><p>vielen Dank für Ihre Nachricht. Wir melden uns schnellstmöglich zurück.</p><p>Mit freundlichen Grüßen,<br/>Team Krone Langenburg by Ammesso</p><hr/><p style="color:#999;font-size:12px;">Hauptstraße 24 · 74595 Langenburg · info@krone-ammesso.de</p>`,
      },
      en: {
        subject: 'Your message has been received — Krone Langenburg by Ammesso',
        body: `<p>Dear ${first_name},</p><p>Thank you for your message. We will be in touch as soon as possible.</p><p>Kind regards,<br/>Team Krone Langenburg by Ammesso</p><hr/><p style="color:#999;font-size:12px;">Hauptstraße 24 · 74595 Langenburg · info@krone-ammesso.de</p>`,
      },
      it: {
        subject: 'Il tuo messaggio è stato ricevuto — Krone Langenburg by Ammesso',
        body: `<p>Caro/a ${first_name},</p><p>Grazie per il tuo messaggio. Ti risponderemo al più presto.</p><p>Cordiali saluti,<br/>Team Krone Langenburg by Ammesso</p>`,
      },
    };

    const reply = autoReply[lang] || autoReply.de;

    // Send auto-reply to guest (may fail for external addresses — non-blocking)
    let guestEmailSent = false;
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        from_name: 'Krone Langenburg by Ammesso',
        subject: reply.subject,
        body: reply.body,
      });
      guestEmailSent = true;
    } catch (emailErr) {
      console.warn('Guest auto-reply failed (external address):', emailErr.message);
    }

    // Always send admin notification (uses SiteSettings email)
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: adminEmail,
        from_name: 'Krone Website',
        subject: `[Kontakt] ${typeLabel} — ${first_name} ${last_name}`,
        body: `<p><b>Art:</b> ${typeLabel}</p><p><b>Name:</b> ${first_name} ${last_name}</p><p><b>Email:</b> ${email}</p><p><b>Telefon:</b> ${phone || '—'}</p><p><b>Nachricht:</b></p><p>${message.replace(/\n/g, '<br/>')}</p>`,
      });
    } catch (adminEmailErr) {
      console.warn('Admin notification email failed:', adminEmailErr.message);
    }

    // Log email attempt
    await base44.asServiceRole.entities.EmailLog.create({
      recipient: email,
      subject: reply.subject,
      template: 'contact_confirmation',
      language: lang,
      status: guestEmailSent ? 'sent' : 'failed',
      failure_reason: guestEmailSent ? null : 'External address — platform limitation',
      sent_at: new Date().toISOString(),
    }).catch(() => {});

    // Mark inquiry as in_review
    const inquiries = await base44.asServiceRole.entities.ContactInquiry.filter({ email: email.toLowerCase() });
    if (inquiries.length > 0) {
      await base44.asServiceRole.entities.ContactInquiry.update(inquiries[0].id, {
        email_notification_sent: true,
        status: 'in_review',
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('sendContactEmail error:', error.message);
    try {
      const base44Fallback = createClientFromRequest(req);
      await base44Fallback.asServiceRole.entities.EmailLog.create({
        recipient: 'info@krone-ammesso.de',
        subject: 'Contact email send failure',
        template: 'contact_confirmation',
        status: 'failed',
        failure_reason: error.message,
        sent_at: new Date().toISOString(),
      });
    } catch (_) {}
    return Response.json({ error: error.message }, { status: 500 });
  }
});