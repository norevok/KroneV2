import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Send cancellation confirmation email to guest.
 * Logs attempt, updates reservation record.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { reservation_ref, guest_email, guest_first_name, lang } = payload;

    if (!reservation_ref || !guest_email) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find reservation
    const reservations = await base44.asServiceRole.entities.RestaurantReservation.filter(
      { reservation_ref },
      undefined,
      1
    );

    if (!reservations || reservations.length === 0) {
      return Response.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const reservation = reservations[0];

    // Localized templates
    const templates = {
      de: {
        subject: `Reservierung storniert — Ref: ${reservation_ref}`,
        body: `<html><body style="font-family:Arial;"><h2>Reservierung storniert</h2><p>Liebe/r ${guest_first_name},</p><p>Ihre Tischreservierung wurde storniert.</p><p><strong>Referenz:</strong> ${reservation_ref}</p><p>Falls Sie dies nicht bestätigt haben, kontaktieren Sie uns bitte sofort unter info@krone-ammesso.de</p><p>Viele Grüße,<br>Krone Langenburg Team</p></body></html>`
      },
      en: {
        subject: `Reservation Cancelled — Ref: ${reservation_ref}`,
        body: `<html><body style="font-family:Arial;"><h2>Reservation Cancelled</h2><p>Dear ${guest_first_name},</p><p>Your table reservation has been cancelled.</p><p><strong>Reference:</strong> ${reservation_ref}</p><p>If you did not confirm this, please contact us immediately at info@krone-ammesso.de</p><p>Best regards,<br>Krone Langenburg Team</p></body></html>`
      },
      it: {
        subject: `Prenotazione annullata — Ref: ${reservation_ref}`,
        body: `<html><body style="font-family:Arial;"><h2>Prenotazione annullata</h2><p>Caro/a ${guest_first_name},</p><p>La vostra prenotazione del tavolo è stata annullata.</p><p><strong>Riferimento:</strong> ${reservation_ref}</p><p>Se non l'avete confermato, contattateci subito a info@krone-ammesso.de</p><p>Cordiali saluti,<br>Team Krone Langenburg</p></body></html>`
      }
    };

    const template = templates[lang] || templates.de;

    // Send email (non-crashing for external addresses)
    let emailSent = false;
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: guest_email,
        from_name: 'Krone Langenburg by Ammesso',
        subject: template.subject,
        body: template.body
      });
      emailSent = true;
    } catch (emailErr) {
      console.warn('Cancellation email failed (external address):', emailErr.message);
    }

    await base44.asServiceRole.entities.EmailLog.create({
      recipient: guest_email,
      subject: template.subject,
      template: 'reservation_cancelled',
      language: lang || 'de',
      status: emailSent ? 'sent' : 'failed',
      failure_reason: emailSent ? null : 'External address — platform limitation',
      sent_at: new Date().toISOString(),
      related_entity_type: 'RestaurantReservation',
      related_entity_id: reservation.id,
      related_ref: reservation_ref
    }).catch(() => {});

    await base44.asServiceRole.entities.RestaurantReservation.update(reservation.id, {
      cancellation_confirmation_sent: emailSent,
      cancellation_confirmation_sent_at: emailSent ? new Date().toISOString() : null
    }).catch(() => {});

    return Response.json({ success: true, ref: reservation_ref, email_sent: emailSent });
  } catch (error) {
    console.error('sendCancellationEmail error:', error.message);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});