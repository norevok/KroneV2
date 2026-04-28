import { useState } from 'react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { Gift, ShoppingCart, X, Check, ArrowRight, Star, Heart, UtensilsCrossed, BedDouble } from 'lucide-react';

const PRODUCTS = [
  {
    id: 'voucher_50',
    emoji: '🎁',
    amount: 50,
    de_title: 'Genuss-Gutschein · €50',
    en_title: 'Dining Voucher · €50',
    de_desc: 'Perfekt für einen schönen Restaurantabend. Gültig für alle Speisen und Getränke im Kulinarium.',
    en_desc: 'Perfect for a lovely restaurant evening. Valid for all food and drinks at the Kulinarium.',
    de_for: 'Restaurant · Gültig 2 Jahre',
    en_for: 'Restaurant · Valid 2 Years',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    popular: false,
  },
  {
    id: 'voucher_100',
    emoji: '✨',
    amount: 100,
    de_title: 'Erlebnis-Gutschein · €100',
    en_title: 'Experience Voucher · €100',
    de_desc: 'Für ein vollständiges Dinner-Erlebnis oder einen Hotelaufenthalt. Der meistgekaufte Gutschein.',
    en_desc: 'For a full dinner experience or hotel stay. Our most popular voucher.',
    de_for: 'Restaurant & Hotel · Gültig 2 Jahre',
    en_for: 'Restaurant & Hotel · Valid 2 Years',
    image: 'https://images.unsplash.com/photo-1551183053-bf91798d792e?w=600&q=80',
    popular: true,
  },
  {
    id: 'voucher_150',
    emoji: '💎',
    amount: 150,
    de_title: 'Verwöhn-Gutschein · €150',
    en_title: 'Indulgence Voucher · €150',
    de_desc: 'Mehrgängiges Dinner, Hotelübernachtung oder eine Kombination — ganz nach Wunsch.',
    en_desc: 'Multi-course dinner, hotel night or a combination — entirely as desired.',
    de_for: 'Restaurant & Hotel · Gültig 2 Jahre',
    en_for: 'Restaurant & Hotel · Valid 2 Years',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
    popular: false,
  },
  {
    id: 'voucher_250',
    emoji: '👑',
    amount: 250,
    de_title: 'Luxus-Paket-Gutschein · €250',
    en_title: 'Luxury Package Voucher · €250',
    de_desc: 'Übernachtung in der Suite, Champagner, romantisches Dinner — das ultimative Geschenk.',
    en_desc: 'Suite overnight, champagne, romantic dinner — the ultimate gift.',
    de_for: 'Volle Flexibilität · Gültig 2 Jahre',
    en_for: 'Full Flexibility · Valid 2 Years',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
    popular: false,
  },
];

const inputCls = "w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-charcoal placeholder-stone-400 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all font-body";

export default function Shop() {
  const { lang } = useLang();
  const [cart, setCart] = useState(null); // single-item cart
  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState('products'); // products | details | processing | success | error
  const [form, setForm] = useState({
    purchaser_name: '', purchaser_email: '',
    recipient_name: '', recipient_email: '',
    personal_message: '',
  });
  const [loading, setLoading] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const t = {
    de: {
      eyebrow: 'Geschenke & Gutscheine',
      title: 'Das Geschenk, das bleibt.',
      sub: 'Verschenken Sie ein unvergessliches Erlebnis — ein Abendessen, eine Übernachtung oder beides. Gültig 2 Jahre.',
      add_cart: 'In den Warenkorb',
      popular_badge: 'Beliebt',
      cart_title: 'Warenkorb',
      checkout: 'Zur Kasse',
      your_details: 'Ihre Angaben',
      recipient_details: 'Empfänger (optional)',
      purchaser_name: 'Ihr Name *',
      purchaser_email: 'Ihre E-Mail *',
      recipient_name: 'Name des Empfängers',
      recipient_email: 'E-Mail des Empfängers',
      message: 'Persönliche Nachricht',
      pay_now: 'Sicher bezahlen',
      success_title: 'Gutschein bestellt! 🎉',
      success_sub: 'Ihr Gutschein wird innerhalb weniger Minuten an die angegebene E-Mail gesendet.',
      your_code: 'Ihr Gutscheincode',
      continue: 'Weiter einkaufen',
      back: '← Zurück',
      processing: 'Zahlung wird verarbeitet…',
      secure: '🔒 SSL-verschlüsselte Zahlung via Stripe',
      policy: '2 Jahre gültig · Auf alle Leistungen anrechenbar · Nicht erstattungsfähig',
      remove: 'Entfernen',
      empty_cart: 'Ihr Warenkorb ist leer',
    },
    en: {
      eyebrow: 'Gifts & Vouchers',
      title: 'The gift that stays.',
      sub: 'Give an unforgettable experience — a dinner, an overnight stay, or both. Valid 2 years.',
      add_cart: 'Add to Cart',
      popular_badge: 'Popular',
      cart_title: 'Cart',
      checkout: 'Checkout',
      your_details: 'Your Details',
      recipient_details: 'Recipient (optional)',
      purchaser_name: 'Your Name *',
      purchaser_email: 'Your Email *',
      recipient_name: 'Recipient Name',
      recipient_email: 'Recipient Email',
      message: 'Personal Message',
      pay_now: 'Pay Securely',
      success_title: 'Voucher ordered! 🎉',
      success_sub: 'Your voucher will be sent to the provided email within a few minutes.',
      your_code: 'Your Voucher Code',
      continue: 'Continue Shopping',
      back: '← Back',
      processing: 'Processing payment…',
      secure: '🔒 SSL-encrypted payment via Stripe',
      policy: 'Valid 2 years · Redeemable on all services · Non-refundable',
      remove: 'Remove',
      empty_cart: 'Your cart is empty',
    },
  };
  const tx = t[lang] || t.de;

  function addToCart(product) {
    setCart(product);
    setCartOpen(true);
  }

  async function handleCheckout(e) {
    e.preventDefault();
    if (!form.purchaser_name || !form.purchaser_email) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await base44.functions.invoke('createVoucherCheckout', {
        product_id: cart.id,
        product_name: lang === 'de' ? cart.de_title : cart.en_title,
        amount: cart.amount,
        purchaser_name: form.purchaser_name,
        purchaser_email: form.purchaser_email,
        recipient_name: form.recipient_name,
        recipient_email: form.recipient_email,
        personal_message: form.personal_message,
        language: lang,
      });
      if (res.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = res.data.url;
      } else if (res.data?.voucher_code) {
        // Fallback: immediate creation (dev mode)
        setVoucherCode(res.data.voucher_code);
        setStep('success');
      } else {
        setErrorMsg(lang === 'de' ? 'Zahlung konnte nicht gestartet werden.' : 'Could not initiate payment.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error');
    }
    setLoading(false);
  }

  // Check for Stripe return
  const urlParams = new URLSearchParams(window.location.search);
  const stripeStatus = urlParams.get('payment');
  const sessionId = urlParams.get('session_id');

  if (stripeStatus === 'success' && sessionId && step !== 'success') {
    setStep('success');
    setVoucherCode(urlParams.get('code') || '');
  }

  return (
    <div className="min-h-screen bg-ivory text-charcoal pb-24 lg:pb-10">

      {/* Hero */}
      <div className="relative bg-espresso pt-20 sm:pt-28 pb-14 sm:pb-20 px-5 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=60"
          alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/80 to-espresso/95" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-gold/40" />
            <p className="text-gold-light text-[10px] tracking-[0.5em] uppercase font-body">{tx.eyebrow}</p>
            <div className="h-px w-8 bg-gold/40" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-ivory mb-4 leading-[0.95]">{tx.title}</h1>
          <p className="text-ivory/50 font-body text-sm max-w-lg mx-auto">{tx.sub}</p>
          {/* Cart indicator */}
          {cart && (
            <button onClick={() => setCartOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-white rounded-full text-xs font-body font-semibold tracking-widest uppercase">
              <ShoppingCart className="w-3.5 h-3.5" />
              {lang === 'de' ? cart.de_title : cart.en_title} · €{cart.amount}
            </button>
          )}
        </div>
      </div>

      {/* Success screen */}
      {step === 'success' && (
        <div className="max-w-lg mx-auto px-5 py-16 text-center">
          <div className="surface-card rounded-3xl p-8 sm:p-10">
            <div className="w-20 h-20 bg-gold-pale rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-gold" />
            </div>
            <h2 className="font-display text-3xl font-light text-charcoal mb-3">{tx.success_title}</h2>
            <p className="text-charcoal/60 font-body text-sm mb-6">{tx.success_sub}</p>
            {voucherCode && (
              <div className="bg-gold-pale border border-gold/20 rounded-2xl px-6 py-4 mb-6">
                <p className="text-[10px] tracking-[0.3em] uppercase font-body text-gold/60 mb-1">{tx.your_code}</p>
                <p className="font-display text-2xl font-light text-gold tracking-[0.2em]">{voucherCode}</p>
              </div>
            )}
            <button onClick={() => { setStep('products'); setCart(null); setForm({ purchaser_name:'',purchaser_email:'',recipient_name:'',recipient_email:'',personal_message:'' }); }}
              className="inline-flex items-center gap-2 px-7 py-3.5 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
              {tx.continue} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Products grid */}
      {step === 'products' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-5 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {PRODUCTS.map(product => (
              <div key={product.id}
                className={`surface-card rounded-2xl overflow-hidden group hover:shadow-premium transition-all duration-300 relative flex flex-col ${product.popular ? 'ring-2 ring-gold/40' : ''}`}>
                {product.popular && (
                  <div className="absolute top-3 right-3 z-10 bg-gold text-white text-[9px] px-2.5 py-1 rounded-full font-body font-semibold tracking-widest uppercase">
                    {tx.popular_badge}
                  </div>
                )}
                <div className="relative h-44 overflow-hidden">
                  <img src={product.image} alt={lang === 'de' ? product.de_title : product.en_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-2xl">{product.emoji}</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-lg font-light text-charcoal mb-1.5 leading-tight">
                    {lang === 'de' ? product.de_title : product.en_title}
                  </h3>
                  <p className="text-charcoal/55 text-xs font-body leading-relaxed mb-3 flex-1">
                    {lang === 'de' ? product.de_desc : product.en_desc}
                  </p>
                  <p className="text-[10px] font-body tracking-wider text-gold/60 mb-4">
                    {lang === 'de' ? product.de_for : product.en_for}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-2xl font-light text-charcoal">€{product.amount}</p>
                    <button onClick={() => addToCart(product)}
                      className="flex items-center gap-1.5 px-4 py-2 btn-gold rounded-full text-[10px] tracking-widest uppercase font-body font-semibold">
                      <Gift className="w-3 h-3" /> {tx.add_cart}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              { icon: Gift, de: 'Sofortige Lieferung per E-Mail', en: 'Instant delivery by email' },
              { icon: Star, de: 'Gültig 2 Jahre', en: 'Valid 2 years' },
              { icon: Heart, de: 'Einlösbar für Essen & Übernachtung', en: 'Redeemable for food & stays' },
            ].map((item, i) => (
              <div key={i} className="surface-card rounded-xl p-4 flex items-center gap-3">
                <item.icon className="w-5 h-5 text-gold flex-shrink-0" />
                <p className="text-sm font-body text-charcoal/70">{lang === 'de' ? item.de : item.en}</p>
              </div>
            ))}
          </div>

          {/* How to redeem */}
          <div className="mt-8 surface-card rounded-2xl p-6 sm:p-8">
            <h3 className="font-display text-2xl font-light text-charcoal mb-4">
              {lang === 'de' ? 'So einfach einlösen' : 'Easy to redeem'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { n: '1', de: 'Gutschein kaufen', en: 'Purchase voucher', de_d: 'Online in Sekunden — direkt per E-Mail', en_d: 'Online in seconds — directly by email' },
                { n: '2', de: 'Gutscheincode vorzeigen', en: 'Present voucher code', de_d: 'An der Kasse oder bei Buchung', en_d: 'At checkout or when booking' },
                { n: '3', de: 'Erlebnis genießen', en: 'Enjoy the experience', de_d: 'Restaurant, Hotel oder beides', en_d: 'Restaurant, hotel or both' },
              ].map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-pale border border-gold/20 flex items-center justify-center flex-shrink-0 font-display text-gold font-light">{step.n}</div>
                  <div>
                    <p className="font-body font-semibold text-sm text-charcoal mb-0.5">{lang === 'de' ? step.de : step.en}</p>
                    <p className="text-xs font-body text-charcoal/50">{lang === 'de' ? step.de_d : step.en_d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fly-out cart */}
      {cartOpen && step === 'products' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end">
          <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative bg-white w-full sm:w-96 sm:h-full sm:max-h-screen rounded-t-3xl sm:rounded-none shadow-2xl overflow-y-auto flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-gold" />
                <h2 className="font-display text-lg font-light text-charcoal">{tx.cart_title}</h2>
              </div>
              <button onClick={() => setCartOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4 text-charcoal/40" />
              </button>
            </div>

            {!cart ? (
              <div className="flex-1 flex items-center justify-center text-charcoal/40 font-body text-sm py-10">{tx.empty_cart}</div>
            ) : step === 'products' ? (
              <div className="flex-1 flex flex-col">
                {/* Cart item */}
                <div className="p-6 border-b border-stone-100">
                  <div className="flex gap-4">
                    <img src={cart.image} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-body font-semibold text-sm text-charcoal">{lang === 'de' ? cart.de_title : cart.en_title}</p>
                      <p className="text-xs text-charcoal/50 font-body mt-0.5">{lang === 'de' ? cart.de_for : cart.en_for}</p>
                      <p className="font-display text-lg font-light text-charcoal mt-1">€{cart.amount}</p>
                    </div>
                    <button onClick={() => setCart(null)} className="text-charcoal/25 hover:text-red-400 transition-colors flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Total */}
                <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-charcoal/60">Total</span>
                    <span className="font-semibold text-charcoal">€{cart.amount}</span>
                  </div>
                </div>
                {/* Checkout CTA */}
                <div className="p-6">
                  <button onClick={() => setStep('details')}
                    className="w-full py-4 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> {tx.checkout}
                  </button>
                  <p className="text-center text-[10px] font-body text-charcoal/30 mt-3">{tx.secure}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Checkout details form */}
      {step === 'details' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end">
          <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={() => setStep('products')} />
          <div className="relative bg-white w-full sm:w-96 h-full max-h-screen rounded-t-3xl sm:rounded-none shadow-2xl overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 sticky top-0 bg-white z-10">
              <button onClick={() => setStep('products')} className="text-charcoal/40 hover:text-charcoal text-xs font-body tracking-wider">
                {tx.back}
              </button>
              <h2 className="font-display text-lg font-light text-charcoal">{tx.checkout}</h2>
              <button onClick={() => { setStep('products'); setCartOpen(false); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100">
                <X className="w-4 h-4 text-charcoal/40" />
              </button>
            </div>

            <form onSubmit={handleCheckout} className="flex-1 flex flex-col p-6 gap-5 overflow-y-auto">
              {/* Item summary */}
              {cart && (
                <div className="bg-stone-50 rounded-xl p-4 flex items-center gap-3 border border-stone-100">
                  <span className="text-xl">{cart.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-xs text-charcoal truncate">{lang === 'de' ? cart.de_title : cart.en_title}</p>
                  </div>
                  <p className="font-display text-lg font-light text-charcoal flex-shrink-0">€{cart.amount}</p>
                </div>
              )}

              {/* Your details */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase font-body text-charcoal/40 mb-3">{tx.your_details}</p>
                <div className="space-y-3">
                  <input type="text" required placeholder={tx.purchaser_name} value={form.purchaser_name}
                    onChange={e => setForm(f => ({...f, purchaser_name: e.target.value}))} className={inputCls} />
                  <input type="email" required placeholder={tx.purchaser_email} value={form.purchaser_email}
                    onChange={e => setForm(f => ({...f, purchaser_email: e.target.value}))} className={inputCls} />
                </div>
              </div>

              {/* Recipient */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase font-body text-charcoal/40 mb-3">{tx.recipient_details}</p>
                <div className="space-y-3">
                  <input type="text" placeholder={tx.recipient_name} value={form.recipient_name}
                    onChange={e => setForm(f => ({...f, recipient_name: e.target.value}))} className={inputCls} />
                  <input type="email" placeholder={tx.recipient_email} value={form.recipient_email}
                    onChange={e => setForm(f => ({...f, recipient_email: e.target.value}))} className={inputCls} />
                  <textarea rows={3} placeholder={tx.message} value={form.personal_message}
                    onChange={e => setForm(f => ({...f, personal_message: e.target.value}))}
                    className={`${inputCls} resize-none`} />
                </div>
              </div>

              {errorMsg && <p className="text-red-600 text-xs font-body bg-red-50 rounded-xl px-4 py-3">{errorMsg}</p>}

              <div className="mt-auto space-y-3">
                <button type="submit" disabled={loading}
                  className="w-full py-4 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><Gift className="w-4 h-4" /> {tx.pay_now} · €{cart?.amount}</>
                  }
                </button>
                <p className="text-center text-[10px] font-body text-charcoal/30">{tx.secure}</p>
                <p className="text-center text-[10px] font-body text-charcoal/25">{tx.policy}</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}