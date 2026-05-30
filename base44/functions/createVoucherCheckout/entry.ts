/**
 * createVoucherCheckout — Krone Langenburg Gift Shop
 * Creates a Stripe Checkout session for gift voucher purchase.
 * Supports flexible amounts and all 4 voucher product types.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      product_id,
      product_name,
      amount,
      purchaser_name,
      purchaser_email,
      recipient_name = '',
      recipient_email = '',
      personal_message = '',
      language = 'de',
      delivery_mode = 'buyer',
    } = body;

    if (!product_name || !amount || !purchaser_email) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 10 || amountNum > 2000) {
      return Response.json({ error: 'Invalid amount (must be 10–2000)' }, { status: 400 });
    }

    // Generate a unique voucher code
    const code = `KRONE-${Math.random().toString(36).substring(2, 5).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString();

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      // Dev fallback: create active voucher without payment
      await base44.asServiceRole.entities.GiftVoucher.create({
        code,
        product_id: product_id || 'value_voucher',
        product_name,
        amount_eur: amountNum,
        purchaser_email: purchaser_email.toLowerCase(),
        purchaser_name,
        recipient_name,
        recipient_email: recipient_email.toLowerCase(),
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

    // Create pending voucher in DB first
    const pendingVoucher = await base44.asServiceRole.entities.GiftVoucher.create({
      code,
      product_id: product_id || 'value_voucher',
      product_name,
      amount_eur: amountNum,
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

    const origin = req.headers.get('origin') || 'https://www.krone-ammesso.de';

    const descriptionDe = `Krone Langenburg Gutschein · Gültig 2 Jahre · Code: ${code}`;
    const descriptionEn = `Krone Langenburg Voucher · Valid 2 years · Code: ${code}`;
    const descriptionIt = `Krone Langenburg Buono · Valido 2 anni · Codice: ${code}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: purchaser_email,
      locale: language === 'it' ? 'it' : language === 'en' ? 'en' : 'de',
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(amountNum * 100),
          product_data: {
            name: `${product_name} — Krone Langenburg by Ammesso`,
            description: language === 'en' ? descriptionEn : language === 'it' ? descriptionIt : descriptionDe,
            images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&q=80'],
          },
        },
        quantity: 1,
      }],
      metadata: {
        voucher_id: pendingVoucher.id,
        voucher_code: code,
        purchaser_name: purchaser_name || '',
        recipient_name: recipient_name || '',
        recipient_email: recipient_email || '',
        personal_message: (personal_message || '').substring(0, 500),
        delivery_mode,
        language,
        product_name,
      },
      success_url: `${origin}/gutscheine?payment=success&session_id={CHECKOUT_SESSION_ID}&code=${code}`,
      cancel_url: `${origin}/gutscheine?payment=cancelled`,
    });

    // Save Stripe session ID
    await base44.asServiceRole.entities.GiftVoucher.update(pendingVoucher.id, {
      stripe_session_id: session.id,
    });

    return Response.json({ url: session.url, session_id: session.id, code });
  } catch (error) {
    console.error('createVoucherCheckout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});