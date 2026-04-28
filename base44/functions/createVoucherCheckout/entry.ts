/**
 * createVoucherCheckout — Krone Langenburg Gift Shop
 * Creates a Stripe Checkout session for gift voucher purchase.
 * On success, Stripe redirects to /shop?payment=success&session_id=...
 * On cancel, Stripe redirects to /shop?payment=cancelled
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      product_id, product_name, amount,
      purchaser_name, purchaser_email,
      recipient_name = '', recipient_email = '',
      personal_message = '', language = 'de',
    } = body;

    if (!product_name || !amount || !purchaser_email) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (amount < 10 || amount > 1000) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      // Dev fallback: create voucher directly without payment
      const code = `KRONE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const expiresAt = new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString();
      await base44.asServiceRole.entities.GiftVoucher.create({
        code,
        product_id,
        product_name,
        amount_eur: amount,
        purchaser_email,
        purchaser_name,
        recipient_name,
        recipient_email,
        personal_message,
        status: 'active',
        language,
        paid_at: new Date().toISOString(),
        expires_at: expiresAt,
        email_sent: false,
      });
      return Response.json({ voucher_code: code, dev_mode: true });
    }

    const stripe = new Stripe(stripeKey);

    // Generate a pre-voucher record in pending state
    const code = `KRONE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString();

    const pendingVoucher = await base44.asServiceRole.entities.GiftVoucher.create({
      code,
      product_id,
      product_name,
      amount_eur: amount,
      purchaser_email: purchaser_email.toLowerCase(),
      purchaser_name,
      recipient_name,
      recipient_email: recipient_email.toLowerCase(),
      personal_message,
      status: 'pending_payment',
      language,
      expires_at: expiresAt,
      email_sent: false,
    });

    const origin = req.headers.get('origin') || 'https://krone.base44.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: purchaser_email,
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: product_name,
            description: language === 'de'
              ? `Krone Langenburg Gutschein · Gültig 2 Jahre · Code: ${code}`
              : `Krone Langenburg Voucher · Valid 2 years · Code: ${code}`,
            images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80'],
          },
        },
        quantity: 1,
      }],
      metadata: {
        voucher_id: pendingVoucher.id,
        voucher_code: code,
        purchaser_name,
        recipient_name,
        language,
      },
      success_url: `${origin}/shop?payment=success&session_id={CHECKOUT_SESSION_ID}&code=${code}`,
      cancel_url: `${origin}/shop?payment=cancelled`,
    });

    // Store session ID on the voucher
    await base44.asServiceRole.entities.GiftVoucher.update(pendingVoucher.id, {
      stripe_session_id: session.id,
    });

    return Response.json({ url: session.url, session_id: session.id, code });
  } catch (error) {
    console.error('createVoucherCheckout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});