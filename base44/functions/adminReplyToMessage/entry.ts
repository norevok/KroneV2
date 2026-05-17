import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Admin-only: reply to a GuestMessage thread.
 * - Saves staff_reply on the GuestMessage record
 * - Updates status, assigned_to, resolved_at
 * - Saves internal_notes (never sent to guest)
 * - Links to reservation/booking/intent if provided
 * - Sends email to guest if reply_text provided
 * - Creates EmailLog + AuditLog
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const {
      message_id,
      reply_text,         // visible to guest
      internal_notes,     // admin-only, never sent
      new_status,         // in_progress | resolved | closed
      assigned_to,        // email of staff member
      related_reservation_ref,
      related_booking_intent_id,
    } = await req.json();

    if (!message_id) return Response.json({ error: 'message_id required' }, { status: 400 });

    // Fetch the message to get guest email
    const messages = await base44.asServiceRole.entities.GuestMessage.filter({ id: message_id }, undefined, 1).catch(() => []);
    const msg = messages[0];
    if (!msg) return Response.json({ error: 'Message not found' }, { status: 404 });

    const now = new Date().toISOString();
    const updates = {};

    if (reply_text) {
      updates.staff_reply = reply_text;
      updates.replied_at = now;
    }
    if (internal_notes !== undefined) updates.staff_internal_notes = internal_notes;
    if (new_status) {
      updates.status = new_status;
      if (new_status === 'resolved') updates.resolved_at = now;
    }
    if (assigned_to) updates.assigned_to = assigned_to;
    if (related_reservation_ref) updates.related_reservation_ref = related_reservation_ref;
    if (related_booking_intent_id) updates.related_booking_intent_id = related_booking_intent_id;

    await base44.asServiceRole.entities.GuestMessage.update(message_id, updates);

    // Send guest email notification if reply_text provided
    if (reply_text && msg.user_email) {
      const lang = msg.language || 'de';

      const subjects = {
        de: `Antwort auf Ihre Nachricht — Krone Langenburg`,
        en: `Reply to your message — Krone Langenburg`,
        it: `Risposta al tuo messaggio — Krone Langenburg`,
      };

      const bodies = {
        de: `Sehr geehrte/r Gast,\n\nvielen Dank für Ihre Nachricht. Hier unsere Antwort:\n\n${reply_text}\n\nMit freundlichen Grüßen,\nIhr Team von Krone Langenburg by Ammesso`,
        en: `Dear Guest,\n\nThank you for your message. Here is our reply:\n\n${reply_text}\n\nKind regards,\nKrone Langenburg by Ammesso`,
        it: `Gentile ospite,\n\nGrazie per il tuo messaggio. Ecco la nostra risposta:\n\n${reply_text}\n\nCordiali saluti,\nKrone Langenburg by Ammesso`,
      };

      let emailStatus = 'sent';
      let emailFailure = null;

      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: msg.user_email,
          subject: subjects[lang] || subjects.de,
          body: bodies[lang] || bodies.de,
          from_name: 'Krone Langenburg by Ammesso',
        });
      } catch (emailErr) {
        emailStatus = 'failed';
        emailFailure = emailErr.message || 'unknown';
      }

      // EmailLog
      base44.asServiceRole.entities.EmailLog.create({
        recipient: msg.user_email,
        subject: subjects[lang] || subjects.de,
        template: 'guest_message_alert_admin',
        language: lang,
        status: emailStatus,
        sent_at: now,
        failure_reason: emailFailure,
        related_entity_type: 'GuestMessage',
        related_entity_id: message_id,
      }).catch(() => {});
    }

    // AuditLog
    base44.asServiceRole.entities.ActivityLog.create({
      actor_email: user.email,
      actor_role: user.role,
      action: 'guest_message_sent',
      entity_type: 'GuestMessage',
      entity_id: message_id,
      description: `Admin replied to guest message from ${msg.user_email}. New status: ${new_status || 'unchanged'}.`,
      performed_at: now,
    }).catch(() => {});

    return Response.json({ success: true });
  } catch (error) {
    console.error('adminReplyToMessage error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});