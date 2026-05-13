import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Guest function: Send a message to property (questions, special requests).
 * Requires authentication. Logs message, notifies admin via Slack.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { message_type, subject, body, language, related_reservation_ref } = await req.json();

    if (!subject || !body) {
      return Response.json({ error: 'Subject and body are required' }, { status: 400 });
    }

    // Create message record
    const message = await base44.entities.GuestMessage.create({
      user_email: user.email.toLowerCase(),
      guest_name: user.full_name || user.email,
      message_type: message_type || 'general_question',
      subject,
      body,
      language: language || 'de',
      status: 'new',
      related_reservation_ref: related_reservation_ref || null,
    });

    // Link to guest profile if exists (non-blocking)
    base44.entities.GuestProfile.filter({ user_email: user.email.toLowerCase() }, undefined, 1)
      .then(profiles => {
        if (profiles.length > 0) {
          base44.entities.GuestMessage.update(message.id, { guest_profile_id: profiles[0].id }).catch(() => {});
        }
      }).catch(() => {});

    // Notify admin via Slack (no email to guest — they already know they sent it)
    base44.asServiceRole.functions.invoke('notifySlack', {
      type: 'guest_message',
      name: user.full_name || user.email,
      email: user.email,
      inquiry_type: message_type || 'general_question',
      message: body.substring(0, 200),
    }).catch(() => {});

    return Response.json({ success: true, message_id: message.id, status: 'new' });
  } catch (error) {
    console.error('Guest send message error:', error);
    return Response.json({ error: 'Server error sending message' }, { status: 500 });
  }
});