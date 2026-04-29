/**
 * stripeVoucherWebhook — Krone Langenburg
 * Handles Stripe webhook events to activate gift vouchers after successful payment.
 * Configure in Stripe dashboard: endpoint = /functions/stripeVoucherWebhook
 * Events: checkout.session.completed, payment_intent.payment_failed
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

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
      const { voucher_id, voucher_code, purchaser_name, recipient_name, language } = session.metadata || {};

      if (!voucher_id) {
        console.warn('No voucher_id in session metadata');
        return Response.json({ received: true });
      }

      // Activate the voucher
      await base44.asServiceRole.entities.GiftVoucher.update(voucher_id, {
        status: 'active',
        stripe_payment_intent_id: session.payment_intent,
        stripe_session_id: session.id,
        paid_at: new Date().toISOString(),
      });

      // Send email confirmation to purchaser
      const lang = language || 'de';
      const purchaserEmail = session.customer_email || session.customer_details?.email;
      const amount = (session.amount_total / 100).toFixed(2);

      const subjects = {
        de: `Ihr Krone Langenburg Gutschein — ${voucher_code}`,
        en: `Your Krone Langenburg Voucher — ${voucher_code}`,
      };
      const bodies = {
        de: `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
          <div style="text-align:center;padding:20px 0;border-bottom:2px solid #C9A96E;margin-bottom:24px;">
            <h1 style="font-family:Georgia,serif;color:#0F0D0B;font-weight:300;margin:0;">Krone Langenburg</h1>
            <p style="color:#C9A96E;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">by Ammesso</p>
          </div>
          <h2 style="font-family:Georgia,serif;font-weight:300;">Ihr Geschenkgutschein ist bereit! 🎁</h2>
          <p>Liebe/r ${purchaser_name || 'Gast'},</p>
          <p>vielen Dank für Ihren Kauf. Ihr Gutschein ist nun aktiv.</p>
          <div style="background:#f9f6f0;border:2px solid #C9A96E;padding:24px;margin:20px 0;border-radius:12px;text-align:center;">
            <p style="color:#8A7A6A;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Ihr Gutscheincode</p>
            <p style="font-family:Georgia,serif;font-size:28px;font-weight:300;color:#8B6914;letter-spacing:4px;margin:0;">${voucher_code}</p>
            <p style="color:#8A7A6A;font-size:12px;margin-top:8px;">Wert: €${amount} · Gültig 2 Jahre</p>
          </div>
          ${recipient_name ? `<p>Dieser Gutschein ist für <strong>${recipient_name}</strong>.</p>` : ''}
          <p style="color:#666;font-size:14px;">Einlösbar für alle Leistungen im Restaurant und Hotel der Krone Langenburg.</p>
          <p>Mit herzlichen Grüßen,<br/><strong>Team Krone Langenburg by Ammesso</strong></p>
          <div style="text-align:center;padding-top:20px;border-top:1px solid #eee;margin-top:24px;color:#999;font-size:12px;">
            Hauptstraße 24 · 74595 Langenburg · info@krone-ammesso.de
          </div>
        </body></html>`,
        en: `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
          <div style="text-align:center;padding:20px 0;border-bottom:2px solid #C9A96E;margin-bottom:24px;">
            <h1 style="font-family:Georgia,serif;color:#0F0D0B;font-weight:300;margin:0;">Krone Langenburg</h1>
            <p style="color:#C9A96E;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">by Ammesso</p>
          </div>
          <h2 style="font-family:Georgia,serif;font-weight:300;">Your Gift Voucher is Ready! 🎁</h2>
          <p>Dear ${purchaser_name || 'Guest'},</p>
          <p>Thank you for your purchase. Your voucher is now active.</p>
          <div style="background:#f9f6f0;border:2px solid #C9A96E;padding:24px;margin:20px 0;border-radius:12px;text-align:center;">
            <p style="color:#8A7A6A;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Your Voucher Code</p>
            <p style="font-family:Georgia,serif;font-size:28px;font-weight:300;color:#8B6914;letter-spacing:4px;margin:0;">${voucher_code}</p>
            <p style="color:#8A7A6A;font-size:12px;margin-top:8px;">Value: €${amount} · Valid 2 Years</p>
          </div>
          ${recipient_name ? `<p>This voucher is for <strong>${recipient_name}</strong>.</p>` : ''}
          <p style="color:#666;font-size:14px;">Redeemable for all services at the Krone Langenburg restaurant and hotel.</p>
          <p>Kind regards,<br/><strong>Team Krone Langenburg by Ammesso</strong></p>
          <div style="text-align:center;padding-top:20px;border-top:1px solid #eee;margin-top:24px;color:#999;font-size:12px;">
            Hauptstraße 24 · 74595 Langenburg · info@krone-ammesso.de
          </div>
        </body></html>`,
      };

      if (purchaserEmail) {
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: purchaserEmail,
            from_name: 'Krone Langenburg by Ammesso',
            subject: subjects[lang] || subjects.de,
            body: bodies[lang] || bodies.de,
          });
          await base44.asServiceRole.entities.GiftVoucher.update(voucher_id, { email_sent: true });
        } catch (emailErr) {
          console.warn('Voucher email failed:', emailErr.message);
        }
      }

      console.log(`Voucher ${voucher_code} activated for ${purchaserEmail}`);

      // Notify admin about voucher purchase
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'info@krone-ammesso.de',
          from_name: 'Krone Shop',
          subject: `[Gutschein] ${purchaser_name || purchaserEmail} — ${voucher_code} — €${amount}`,
          body: `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
            <h2 style="font-family:Georgia,serif;font-weight:300;">Neuer Gutschein-Kauf ✓</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:6px 0;color:#666;">Code</td><td style="padding:6px 0;font-weight:bold;letter-spacing:2px;">${voucher_code}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Wert</td><td style="padding:6px 0;font-weight:bold;">€${amount}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Produkt</td><td style="padding:6px 0;">${session.metadata?.product_name || '—'}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Käufer</td><td style="padding:6px 0;">${purchaser_name || '—'}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Käufer E-Mail</td><td style="padding:6px 0;">${purchaserEmail}</td></tr>
              ${recipient_name ? `<tr><td style="padding:6px 0;color:#666;">Empfänger</td><td style="padding:6px 0;">${recipient_name}</td></tr>` : ''}
              <tr><td style="padding:6px 0;color:#666;">Stripe Session</td><td style="padding:6px 0;font-size:11px;">${session.id}</td></tr>
            </table>
            <p style="margin-top:20px;color:#666;font-size:13px;">Der Gutschein ist nun aktiv und wurde an den Käufer gesendet.</p>
          </body></html>`,
        });
      } catch (adminEmailErr) {
        console.warn('Admin voucher notification failed:', adminEmailErr.message);
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      // Mark related vouchers as failed — they remain pending_payment (expired by nightly job)
      const paymentIntentId = event.data.object.id;
      console.log(`Payment failed for intent ${paymentIntentId}`);
      // Note: pending_payment vouchers are cleaned up by nightlyMaintenance after 24h
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});