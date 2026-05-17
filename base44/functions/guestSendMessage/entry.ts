import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Guest function: Notify hotel after a GuestMessage has been created by the frontend.
 * Frontend creates the entity directly, then calls this to trigger notifications.
 * Does NOT create a duplicate message record.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { message_id, message_type, subject, body, language } = await req.json();

    if (!body) return Response.json({ error: 'body required' }, { status: 400 });

    const lang = language || 'de';
    const now = new Date().toISOString();

    // Link to guest profile if exists (non-blocking)
    if (message_id) {
      base44.entities.GuestProfile.filter({ user_email: user.email.toLowerCase() }, undefined, 1)
        .then(profiles => {
          if (profiles.length > 0) {
            base44.entities.GuestMessage.update(message_id, { guest_profile_id: profiles[0].id }).catch(() => {});
          }
        }).catch(() => {});
    }

    // Fetch admin email from SiteSettings
    let adminEmail = 'info@krone-langenburg.de';
    try {
      const settings = await base44.asServiceRole.entities.SiteSettings.filter({ key: 'global' }, undefined, 1);
      if (settings[0]?.email_reservations) adminEmail = settings[0].email_reservations;
      else if (settings[0]?.email_info) adminEmail = settings[0].email_info;
    } catch (_) {}

    const adminSubjects = {
      de: `Neue Gästenachricht: ${subject || message_type || 'Anfrage'}`,
      en: `New Guest Message: ${subject || message_type || 'Enquiry'}`,
      it: `Nuovo messaggio ospite: ${subject || message_type || 'Richiesta'}`,
    };

    const adminBodies = {
      de: `Neue Nachricht von ${user.full_name || user.email}:\n\nArt: ${message_type || '—'}\nBetreff: ${subject || '—'}\n\nNachricht:\n${body}\n\n---\nBitte im Admin Dashboard antworten.`,
      en: `New message from ${user.full_name || user.email}:\n\nType: ${message_type || '—'}\nSubject: ${subject || '—'}\n\nMessage:\n${body}\n\n---\nPlease reply in the Admin Dashboard.`,
      it: `Nuovo messaggio da ${user.full_name || user.email}:\n\nTipo: ${message_type || '—'}\nOggetto: ${subject || '—'}\n\nMessaggio:\n${body}\n\n---\nRispondere nel pannello Admin.`,
    };

    // Notify admin via email
    let emailStatus = 'sent';
    let emailFailure = null;
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: adminEmail,
        subject: adminSubjects[lang] || adminSubjects.de,
        body: adminBodies[lang] || adminBodies.de,
        from_name: 'Krone Langenburg — Gästenachricht',
      });
    } catch (err) {
      emailStatus = 'failed';
      emailFailure = err.message || 'unknown';
    }

    // EmailLog for admin notification
    base44.asServiceRole.entities.EmailLog.create({
      recipient: adminEmail,
      subject: adminSubjects[lang] || adminSubjects.de,
      template: 'guest_message_alert_admin',
      language: lang,
      status: emailStatus,
      sent_at: now,
      failure_reason: emailFailure,
      related_entity_type: 'GuestMessage',
      related_entity_id: message_id || null,
    }).catch(() => {});

    // ActivityLog
    base44.asServiceRole.entities.ActivityLog.create({
      actor_email: user.email,
      action: 'guest_message_sent',
      entity_type: 'GuestMessage',
      entity_id: message_id || null,
      description: `Guest ${user.email} sent message: "${subject || message_type}"`,
      performed_at: now,
    }).catch(() => {});

    // Slack notification
    base44.asServiceRole.functions.invoke('notifySlack', {
      type: 'guest_message',
      name: user.full_name || user.email,
      email: user.email,
      inquiry_type: message_type || 'general_question',
      message: body.substring(0, 200),
    }).catch(() => {});

    return Response.json({ success: true });
  } catch (error) {
    console.error('guestSendMessage error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});