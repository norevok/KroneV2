import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { reservation_id } = await req.json();
    if (!reservation_id) return Response.json({ error: 'Missing reservation_id' }, { status: 400 });

    // Fetch the reservation
    let r;
    try {
      r = await base44.asServiceRole.entities.RestaurantReservation.get(reservation_id);
    } catch (_) {
      r = null;
    }

    if (!r) return Response.json({ error: 'Not found' }, { status: 404 });

    // Security: only the guest who made it can cancel
    if (r.guest_email !== user.email.toLowerCase() && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cannot cancel already cancelled / completed / no_show
    const nonCancellable = ['cancelled_by_guest', 'cancelled_by_staff', 'no_show', 'archived', 'completed'];
    if (nonCancellable.includes(r.status)) {
      return Response.json({ error: 'already_cancelled' }, { status: 409 });
    }

    // Check 24h policy: reservation must be more than 24h away
    const resDateTime = new Date(`${r.reservation_date}T${r.reservation_time}:00`);
    const now = new Date();
    const hoursUntil = (resDateTime - now) / (1000 * 60 * 60);
    if (hoursUntil < 24) {
      return Response.json({ error: 'too_late' }, { status: 409 });
    }

    // Cancel it
    await base44.asServiceRole.entities.RestaurantReservation.update(reservation_id, {
      status: 'cancelled_by_guest',
      cancelled_at: now.toISOString(),
      cancelled_by: 'guest',
      cancellation_reason: 'Guest self-cancelled via account',
    });

    // Send cancellation email (non-blocking)
    base44.asServiceRole.integrations.Core.SendEmail({
      to: r.guest_email,
      from_name: 'Krone Langenburg by Ammesso',
      subject: r.language === 'en'
        ? `Reservation Cancelled — ${r.reservation_ref}`
        : r.language === 'it'
        ? `Prenotazione annullata — ${r.reservation_ref}`
        : `Reservierung storniert — ${r.reservation_ref}`,
      body: r.language === 'en'
        ? `<p>Dear ${r.guest_first_name},</p><p>Your reservation <strong>${r.reservation_ref}</strong> on ${r.reservation_date} at ${r.reservation_time} has been cancelled as requested.</p><p>We hope to welcome you again soon.</p><p>Team Krone Langenburg by Ammesso</p>`
        : r.language === 'it'
        ? `<p>Caro/a ${r.guest_first_name},</p><p>La vostra prenotazione <strong>${r.reservation_ref}</strong> del ${r.reservation_date} alle ${r.reservation_time} è stata annullata.</p><p>Speriamo di accogliervi presto.</p><p>Team Krone Langenburg by Ammesso</p>`
        : `<p>Liebe/r ${r.guest_first_name},</p><p>Ihre Reservierung <strong>${r.reservation_ref}</strong> am ${r.reservation_date} um ${r.reservation_time} Uhr wurde wie gewünscht storniert.</p><p>Wir hoffen, Sie bald wieder begrüßen zu dürfen.</p><p>Team Krone Langenburg by Ammesso</p>`,
    }).catch(() => {});

    // Notify Slack
    const webhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            { type: 'header', text: { type: 'plain_text', text: '❌ Gast hat Reservierung storniert', emoji: true } },
            { type: 'section', fields: [
              { type: 'mrkdwn', text: `*Ref:*\n${r.reservation_ref}` },
              { type: 'mrkdwn', text: `*Gast:*\n${r.guest_first_name} ${r.guest_last_name}` },
              { type: 'mrkdwn', text: `*Datum:*\n${r.reservation_date}` },
              { type: 'mrkdwn', text: `*Zeit:*\n${r.reservation_time}` },
            ]},
          ]
        }),
      }).catch(() => {});
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('cancelReservation error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});