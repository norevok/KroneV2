/**
 * stripeVoucherWebhook — Krone Langenburg
 * Handles checkout.session.completed to activate vouchers and send emails.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

function emailHeader() {
  return `<div style="text-align:center;padding:24px 0 20px;border-bottom:2px solid #C9A96E;margin-bottom:28px;">
    <h1 style="font-family:Georgia,serif;color:#1C1714;font-weight:300;font-size:22px;margin:0;letter-spacing:2px;">KRONE LANGENBURG</h1>
    <p style="color:#C9A96E;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:5px 0 0;">by Ammesso</p>
  </div>`;
}

function emailFooter() {
  return `<div style="text-align:center;padding-top:24px;border-top:1px solid #eee;margin-top:28px;color:#aaa;font-size:11px;letter-spacing:1px;">
    Hauptstraße 24 · 74595 Langenburg · <a href="mailto:info@krone-ammesso.de" style="color:#C9A96E;text-decoration:none;">info@krone-ammesso.de</a>
  </div>`;
}

function voucherBox(code, amount, lang) {
  const label = lang === 'en' ? 'Your Voucher Code' : lang === 'it' ? 'Il tuo codice buono' : 'Ihr Gutscheincode';
  const value = lang === 'en' ? `Value: €${amount} · Valid 2 Years` : lang === 'it' ? `Valore: €${amount} · Valido 2 anni` : `Wert: €${amount} · Gültig 2 Jahre`;
  return `<div style="background:#f9f6f0;border:2px solid #C9A96E;padding:28px;margin:24px 0;border-radius:14px;text-align:center;">
    <p style="color:#8A7A6A;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;">${label}</p>
    <p style="font-family:Georgia,serif;font-size:32px;font-weight:300;color:#8B6914;letter-spacing:6px;margin:0;">${code}</p>
    <p style="color:#8A7A6A;font-size:13px;margin-top:10px;">${value}</p>
  </div>`;
}

function redeemNote(lang) {
  const note = lang === 'en'
    ? '💡 Please present your voucher code when making a reservation or at check-in. Our team will verify and apply the amount.'
    : lang === 'it'
    ? '💡 Si prega di presentare il codice buono al momento della prenotazione o al check-in. Il nostro team verificherà e applicherà l\'importo.'
    : '💡 Bitte geben Sie Ihren Gutscheincode bei der Reservierung an oder zeigen Sie ihn bei Ihrem Besuch vor. Unser Team prüft und verrechnet den Betrag.';
  return `<div style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:16px 20px;margin:20px 0;">
    <p style="margin:0;color:#666;font-size:13px;line-height:1.6;">${note}</p>
  </div>`;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!stripeKey) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  try {
    if (webhookSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const {
        voucher_id,
        voucher_code,
        purchaser_name,
        recipient_name,
        recipient_email,
        personal_message,
        delivery_mode,
        language,
        product_name,
      } = session.metadata || {};

      if (!voucher_id) {
        console.warn('No voucher_id in session metadata');
        return Response.json({ received: true });
      }

      // Idempotency check
      const existingList = await base44.asServiceRole.entities.GiftVoucher.filter({ id: voucher_id }, undefined, 1).catch(() => []);
      const existing = existingList[0];
      if (existing?.status === 'active' && existing?.stripe_session_id === session.id) {
        console.log(`Voucher ${voucher_id} already processed — skipping`);
        return Response.json({ received: true, skipped: 'already_processed' });
      }

      // Activate the voucher
      await base44.asServiceRole.entities.GiftVoucher.update(voucher_id, {
        status: 'active',
        stripe_payment_intent_id: session.payment_intent,
        stripe_session_id: session.id,
        paid_at: new Date().toISOString(),
      });

      const lang = language || 'de';
      const purchaserEmail = session.customer_email || session.customer_details?.email;
      const amount = (session.amount_total / 100).toFixed(2);
      const recipientEmailAddr = recipient_email || existing?.recipient_email || '';

      // ── EMAIL TO BUYER ──
      if (purchaserEmail && !existing?.email_sent) {
        const buyerSubject = lang === 'en'
          ? `Your Krone Langenburg Voucher — ${voucher_code}`
          : lang === 'it'
          ? `Il tuo buono Krone Langenburg — ${voucher_code}`
          : `Ihr Krone Langenburg Gutschein — ${voucher_code}`;

        const buyerBody = `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#333;background:#fff;">
          ${emailHeader()}
          <h2 style="font-family:Georgia,serif;font-weight:300;color:#1C1714;font-size:22px;">
            ${lang === 'en' ? 'Your Gift Voucher is Ready! 🎁' : lang === 'it' ? 'Il tuo buono regalo è pronto! 🎁' : 'Ihr Geschenkgutschein ist bereit! 🎁'}
          </h2>
          <p style="font-size:14px;line-height:1.7;">
            ${lang === 'en' ? `Dear ${purchaser_name || 'Guest'},` : lang === 'it' ? `Gentile ${purchaser_name || 'Ospite'},` : `Liebe/r ${purchaser_name || 'Gast'},`}
          </p>
          <p style="font-size:14px;line-height:1.7;color:#555;">
            ${lang === 'en'
              ? `Thank you for your purchase of <strong>${product_name}</strong> at Krone Langenburg by Ammesso. Your voucher is now active and ready to use.`
              : lang === 'it'
              ? `Grazie per l'acquisto di <strong>${product_name}</strong> presso Krone Langenburg by Ammesso. Il tuo buono è ora attivo e pronto per l'uso.`
              : `Vielen Dank für Ihren Kauf von <strong>${product_name}</strong> bei Krone Langenburg by Ammesso. Ihr Gutschein ist nun aktiv und kann sofort eingelöst werden.`}
          </p>
          ${voucherBox(voucher_code, amount, lang)}
          ${recipient_name ? `<p style="font-size:14px;color:#555;">${lang === 'en' ? `This voucher is for <strong>${recipient_name}</strong>.` : lang === 'it' ? `Questo buono è per <strong>${recipient_name}</strong>.` : `Dieser Gutschein ist für <strong>${recipient_name}</strong>.`}</p>` : ''}
          ${redeemNote(lang)}
          <p style="font-size:14px;line-height:1.7;color:#555;">
            ${lang === 'en'
              ? 'Redeemable for all services at the Krone Langenburg restaurant and hotel.'
              : lang === 'it'
              ? 'Riscattabile per tutti i servizi del ristorante e dell\'hotel Krone Langenburg by Ammesso.'
              : 'Einlösbar für alle Leistungen im Restaurant und Hotel der Krone Langenburg by Ammesso.'}
          </p>
          <p style="font-size:14px;line-height:1.7;">
            ${lang === 'en'
              ? 'Kind regards,<br/><strong>Team Krone Langenburg by Ammesso</strong>'
              : lang === 'it'
              ? 'Cordiali saluti,<br/><strong>Team Krone Langenburg by Ammesso</strong>'
              : 'Mit herzlichen Grüßen,<br/><strong>Team Krone Langenburg by Ammesso</strong>'}
          </p>
          ${emailFooter()}
        </body></html>`;

        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: purchaserEmail,
            from_name: 'Krone Langenburg by Ammesso',
            subject: buyerSubject,
            body: buyerBody,
          });
          await base44.asServiceRole.entities.GiftVoucher.update(voucher_id, { email_sent: true });
        } catch (e) {
          console.warn('Buyer email failed:', e.message);
        }
      }

      // ── EMAIL TO RECIPIENT (if delivery_mode = recipient and email provided) ──
      if (recipientEmailAddr && delivery_mode === 'recipient') {
        const recipSubject = lang === 'en'
          ? `You have received a gift voucher — Krone Langenburg`
          : lang === 'it'
          ? `Hai ricevuto un buono regalo — Krone Langenburg`
          : `Sie haben einen Gutschein erhalten — Krone Langenburg`;

        const recipBody = `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#333;background:#fff;">
          ${emailHeader()}
          <h2 style="font-family:Georgia,serif;font-weight:300;color:#1C1714;font-size:22px;">
            ${lang === 'en'
              ? `${recipient_name ? `Dear ${recipient_name},` : 'Hello,'} You have received a special gift! 🎁`
              : lang === 'it'
              ? `Congratulazioni${recipient_name ? `, ${recipient_name}` : ''} — Hai ricevuto un buono speciale! 🎁`
              : `Herzlichen Glückwunsch${recipient_name ? `, ${recipient_name}` : ''} — Sie haben einen besonderen Gutschein erhalten! 🎁`}
          </h2>
          <p style="font-size:14px;line-height:1.7;color:#555;">
            ${lang === 'en'
              ? `<strong>${purchaser_name || 'Someone special'}</strong> has sent you a gift voucher from Krone Langenburg by Ammesso — a boutique hotel and restaurant in the heart of Langenburg, Hohenlohe.`
              : lang === 'it'
              ? `<strong>${purchaser_name || 'Qualcuno di speciale'}</strong> ti ha inviato un buono regalo di Krone Langenburg by Ammesso — un boutique hotel e ristorante nel cuore di Langenburg, Hohenlohe.`
              : `<strong>${purchaser_name || 'Jemand Besonderes'}</strong> hat Ihnen einen Geschenkgutschein der Krone Langenburg by Ammesso geschickt — einem Boutique-Hotel und Restaurant im Herzen von Langenburg, Hohenlohe.`}
          </p>
          ${personal_message ? `<div style="background:#f9f6f0;border-left:3px solid #C9A96E;padding:16px 20px;margin:20px 0;border-radius:0 10px 10px 0;font-size:14px;color:#555;font-style:italic;">"${personal_message}"</div>` : ''}
          ${voucherBox(voucher_code, amount, lang)}
          <p style="font-size:14px;line-height:1.7;color:#555;">
            ${lang === 'en'
              ? `<strong>What's included:</strong> ${product_name}`
              : lang === 'it'
              ? `<strong>Cosa include:</strong> ${product_name}`
              : `<strong>Ihre Leistung:</strong> ${product_name}`}
          </p>
          ${redeemNote(lang)}
          <p style="font-size:14px;line-height:1.7;">
            ${lang === 'en'
              ? 'We look forward to welcoming you soon.<br/><strong>Team Krone Langenburg by Ammesso</strong>'
              : lang === 'it'
              ? 'Non vediamo l\'ora di darvi il benvenuto presto.<br/><strong>Team Krone Langenburg by Ammesso</strong>'
              : 'Wir freuen uns, Sie bald bei uns begrüßen zu dürfen.<br/><strong>Team Krone Langenburg by Ammesso</strong>'}
          </p>
          ${emailFooter()}
        </body></html>`;

        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: recipientEmailAddr,
            from_name: 'Krone Langenburg by Ammesso',
            subject: recipSubject,
            body: recipBody,
          });
        } catch (e) {
          console.warn('Recipient email failed:', e.message);
        }
      }

      // ── ADMIN NOTIFICATION ──
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'info@krone-ammesso.de',
          from_name: 'Krone Shop',
          subject: `[Gutschein] ${purchaser_name || purchaserEmail} — ${voucher_code} — €${amount}`,
          body: `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#333;">
            <h2 style="font-family:Georgia,serif;font-weight:300;">Neuer Gutschein-Kauf ✓</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:2;">
              <tr><td style="color:#666;width:35%;">Code</td><td style="font-weight:bold;letter-spacing:2px;">${voucher_code}</td></tr>
              <tr><td style="color:#666;">Wert</td><td style="font-weight:bold;">€${amount}</td></tr>
              <tr><td style="color:#666;">Produkt</td><td>${product_name || '—'}</td></tr>
              <tr><td style="color:#666;">Käufer</td><td>${purchaser_name || '—'}</td></tr>
              <tr><td style="color:#666;">Käufer E-Mail</td><td>${purchaserEmail}</td></tr>
              ${recipient_name ? `<tr><td style="color:#666;">Empfänger</td><td>${recipient_name}</td></tr>` : ''}
              ${recipientEmailAddr ? `<tr><td style="color:#666;">Empfänger E-Mail</td><td>${recipientEmailAddr}</td></tr>` : ''}
              ${personal_message ? `<tr><td style="color:#666;">Nachricht</td><td style="font-style:italic;">"${personal_message}"</td></tr>` : ''}
              <tr><td style="color:#666;">Lieferung</td><td>${delivery_mode || 'buyer'}</td></tr>
              <tr><td style="color:#666;">Stripe Session</td><td style="font-size:11px;word-break:break-all;">${session.id}</td></tr>
            </table>
            <p style="margin-top:20px;color:#666;font-size:13px;">Der Gutschein ist nun aktiv und die Bestätigung wurde versendet.</p>
          </body></html>`,
        });
      } catch (e) {
        console.warn('Admin notification failed:', e.message);
      }

      console.log(`Voucher ${voucher_code} activated for ${purchaserEmail}`);
    }

    if (event.type === 'payment_intent.payment_failed') {
      console.log(`Payment failed for intent ${event.data.object.id} — pending_payment voucher will be cleaned up by nightly job`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});