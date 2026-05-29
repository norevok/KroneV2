import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { Gift, Check, ArrowRight, UtensilsCrossed, BedDouble, Star, Lock, Mail, User, MessageSquare } from 'lucide-react';

// ── Voucher products ──────────────────────────────────────────────────────────
const VOUCHERS = [
  {
    id: 'restaurant_experience',
    icon: UtensilsCrossed,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=90',
    de_title: 'Restaurant-Gutschein',
    en_title: 'Restaurant Voucher',
    de_desc: 'Schenken Sie einen besonderen Abend voller Genuss, mediterraner Küche und herzlicher Atmosphäre in der Krone Langenburg by Ammesso.',
    en_desc: 'Give the gift of a special evening filled with pleasure, Mediterranean cuisine and warm atmosphere at Krone Langenburg by Ammesso.',
    de_tag: 'Für Genießer',
    en_tag: 'For Foodies',
    amounts: [25, 50, 75, 100],
    popular: true,
    color: '#8B6914',
  },
  {
    id: 'hotel_stay',
    icon: BedDouble,
    image: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8c381b8e8_krone-kingsuite-2-zimmer-favorit-01.jpg',
    de_title: 'Hotelübernachtung',
    en_title: 'Hotel Stay Voucher',
    de_desc: 'Schenken Sie Ihren Liebsten Zeit zum Wohlfühlen — eine Übernachtung in der historischen Krone Langenburg.',
    en_desc: 'Give your loved ones time to relax — an overnight stay in the historic Krone Langenburg.',
    de_tag: 'Unvergesslich',
    en_tag: 'Unforgettable',
    amounts: [100, 150, 200, 250],
    color: '#8B6914',
  },
];

const inputCls = "w-full bg-[#FAF7F2] border border-[#EDE6D8] rounded-xl px-4 py-3.5 text-sm text-[#1C1714] placeholder-[#8A7A6A]/60 focus:outline-none focus:border-[#8B6914]/50 focus:ring-2 focus:ring-[#8B6914]/10 transition-all font-body";
const labelCls = "block text-[10px] tracking-[0.25em] uppercase font-body font-semibold text-[#8A7A6A] mb-2";

// ── Delivery option ───────────────────────────────────────────────────────────
const DELIVERY_OPTIONS = [
  { id: 'buyer', de: 'An mich senden', en: 'Send to me' },
  { id: 'recipient', de: 'Direkt an Empfänger senden', en: 'Send directly to recipient' },
];

export default function Shop() {
  const { lang } = useLang();

  const [step, setStep] = useState('products'); // products | configure | processing | success
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [delivery, setDelivery] = useState('buyer');
  const [form, setForm] = useState({
    purchaser_name: '',
    purchaser_email: '',
    recipient_name: '',
    recipient_email: '',
    personal_message: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successCode, setSuccessCode] = useState('');

  const t = {
    de: {
      eyebrow: 'Geschenke & Gutscheine',
      hero_title: 'Schenken Sie besondere Momente.',
      hero_sub: 'Ob ein genussvoller Abend, eine Übernachtung oder ein flexibler Wertgutschein — mit einem Gutschein der Krone Langenburg by Ammesso schenken Sie echte Erinnerungen.',
      popular: 'Beliebt',
      select_amount: 'Betrag wählen',
      custom_amount: 'Individueller Betrag (min. €10)',
      custom_placeholder: 'z.B. 80',
      configure_title: 'Gutschein personalisieren',
      your_details: 'Ihre Angaben',
      recipient_section: 'Empfänger',
      delivery_label: 'Lieferung',
      purchaser_name: 'Ihr Name',
      purchaser_email: 'Ihre E-Mail-Adresse',
      recipient_name: 'Name des Empfängers',
      recipient_email: 'E-Mail des Empfängers',
      message_label: 'Persönliche Nachricht (optional)',
      message_placeholder: 'Schreiben Sie eine persönliche Botschaft...',
      pay_btn: 'Sicher bezahlen via Stripe',
      secure_note: '🔒 SSL-verschlüsselte Zahlung · 2 Jahre gültig · Nicht erstattungsfähig',
      redeem_note: 'Bitte geben Sie Ihren Gutscheincode bei der Reservierung an oder zeigen Sie ihn bei Ihrem Besuch vor.',
      back: '← Zurück',
      success_title: 'Herzlichen Glückwunsch!',
      success_sub: 'Ihr Gutschein wurde erfolgreich gekauft. Sie erhalten in Kürze eine Bestätigung per E-Mail.',
      your_code: 'Ihr Gutscheincode',
      continue: 'Weitershoppen',
      step_select: 'Gutschein wählen',
      step_configure: 'Personalisieren',
      step_pay: 'Bezahlen',
      trust_1: 'Sofortige E-Mail-Lieferung',
      trust_2: '2 Jahre gültig',
      trust_3: 'Für Hotel & Restaurant',
      how_title: 'So funktioniert es',
      how_1_t: 'Gutschein wählen', how_1_d: 'Wählen Sie Art und Betrag',
      how_2_t: 'Personalisieren', how_2_d: 'Name, E-Mail & persönliche Nachricht',
      how_3_t: 'Sicher bezahlen', how_3_d: 'Via Stripe — einfach & geschützt',
      how_4_t: 'Gutschein erhalten', how_4_d: 'Sofort per E-Mail zugestellt',
      redeem_title: 'Einlösung',
      redeem_text: 'Zeigen Sie Ihren Gutscheincode beim Restaurantbesuch vor oder geben Sie ihn bei der Hotelbuchung in den Notizen an. Unser Team prüft und verrechnet den Betrag.',
      buy_this: 'Diesen Gutschein kaufen',
    },
    en: {
      eyebrow: 'Gifts & Vouchers',
      hero_title: 'Give the gift of time, taste and memories.',
      hero_sub: 'Whether a delightful dinner, an overnight stay or a flexible value voucher — with a Krone Langenburg by Ammesso voucher, you give real memories.',
      popular: 'Popular',
      select_amount: 'Select amount',
      custom_amount: 'Custom amount (min. €10)',
      custom_placeholder: 'e.g. 80',
      configure_title: 'Personalise Your Voucher',
      your_details: 'Your Details',
      recipient_section: 'Recipient',
      delivery_label: 'Delivery',
      purchaser_name: 'Your Name',
      purchaser_email: 'Your Email Address',
      recipient_name: 'Recipient Name',
      recipient_email: 'Recipient Email',
      message_label: 'Personal Message (optional)',
      message_placeholder: 'Write a personal message...',
      pay_btn: 'Pay Securely via Stripe',
      secure_note: '🔒 SSL-encrypted payment · Valid 2 years · Non-refundable',
      redeem_note: 'Please provide your voucher code when making a reservation or present it during your visit.',
      back: '← Back',
      success_title: 'Congratulations!',
      success_sub: 'Your voucher was purchased successfully. You will receive a confirmation by email shortly.',
      your_code: 'Your Voucher Code',
      continue: 'Continue Shopping',
      step_select: 'Select Voucher',
      step_configure: 'Personalise',
      step_pay: 'Pay',
      trust_1: 'Instant email delivery',
      trust_2: 'Valid 2 years',
      trust_3: 'For hotel & restaurant',
      how_title: 'How it works',
      how_1_t: 'Choose voucher', how_1_d: 'Select type and amount',
      how_2_t: 'Personalise', how_2_d: 'Name, email & personal message',
      how_3_t: 'Pay securely', how_3_d: 'Via Stripe — simple & safe',
      how_4_t: 'Receive voucher', how_4_d: 'Delivered instantly by email',
      redeem_title: 'Redemption',
      redeem_text: 'Present your voucher code at the restaurant or include it in your booking notes for hotel reservations. Our team will verify and apply the amount.',
      buy_this: 'Buy This Voucher',
    },
  };
  const tx = t[lang] || t.de;

  // Handle Stripe return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      setSuccessCode(params.get('code') || '');
      setStep('success');
    }
  }, []);

  const finalAmount = selectedVoucher?.customAmount && selectedAmount === 'custom'
    ? parseFloat(customAmount) || 0
    : selectedAmount;

  function selectVoucher(v) {
    setSelectedVoucher(v);
    setSelectedAmount(v.amounts[0]);
    setStep('configure');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleCheckout(e) {
    e.preventDefault();
    if (!form.purchaser_name || !form.purchaser_email) return;
    if (!finalAmount || finalAmount < 10) {
      setErrorMsg(lang === 'de' ? 'Bitte wählen Sie einen gültigen Betrag (min. €10).' : 'Please select a valid amount (min. €10).');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await base44.functions.invoke('createVoucherCheckout', {
        product_id: selectedVoucher.id,
        product_name: lang === 'de' ? selectedVoucher.de_title : selectedVoucher.en_title,
        amount: finalAmount,
        purchaser_name: form.purchaser_name,
        purchaser_email: form.purchaser_email,
        recipient_name: form.recipient_name,
        recipient_email: delivery === 'recipient' ? form.recipient_email : '',
        personal_message: form.personal_message,
        language: lang,
        delivery_mode: delivery,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else if (res.data?.voucher_code) {
        setSuccessCode(res.data.voucher_code);
        setStep('success');
      } else {
        setErrorMsg(lang === 'de' ? 'Zahlung konnte nicht gestartet werden.' : 'Could not start payment.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error');
    }
    setLoading(false);
  }

  // ── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] page-top">
        <div className="max-w-lg mx-auto px-5 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-[#EDE6D8] rounded-3xl p-8 sm:p-12 text-center shadow-xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-[#F2E8D0] border border-[#C9A96E]/30 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-[#8B6914]" />
            </motion.div>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714] mb-3">{tx.success_title}</h1>
            <p className="text-[#8A7A6A] font-body text-sm leading-relaxed mb-8">{tx.success_sub}</p>
            {successCode && (
              <div className="bg-[#F2E8D0] border border-[#C9A96E]/30 rounded-2xl px-6 py-5 mb-8">
                <p className="text-[10px] tracking-[0.3em] uppercase font-body text-[#8B6914]/60 mb-2">{tx.your_code}</p>
                <p className="font-display text-3xl font-light text-[#8B6914] tracking-[0.25em]">{successCode}</p>
              </div>
            )}
            <div className="bg-[#FAF7F2] rounded-xl px-5 py-4 mb-8 text-left">
              <p className="text-xs font-body text-[#4A3F35]/60 leading-relaxed">{tx.redeem_note}</p>
            </div>
            <button
              onClick={() => { setStep('products'); setSelectedVoucher(null); setSelectedAmount(null); setSuccessCode(''); }}
              className="btn-gold px-8">
              {tx.continue} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── CONFIGURE SCREEN ──────────────────────────────────────────────────────
  if (step === 'configure' && selectedVoucher) {
    const Icon = selectedVoucher.icon;
    return (
      <div className="min-h-screen bg-[#FAF7F2] page-top pb-24 lg:pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-5 py-10 sm:py-14">
          {/* Back */}
          <button onClick={() => setStep('products')}
            className="text-[#8A7A6A] hover:text-[#1C1714] text-sm font-body mb-8 flex items-center gap-1 transition-colors">
            {tx.back}
          </button>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-10">
            {[tx.step_select, tx.step_configure, tx.step_pay].map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-body font-bold transition-all ${
                  i === 0 ? 'bg-[#8B6914]/20 text-[#8B6914]' : i === 1 ? 'bg-[#8B6914] text-white' : 'bg-[#EDE6D8] text-[#8A7A6A]'
                }`}>{i === 0 ? <Check className="w-3 h-3" /> : i + 1}</div>
                <span className={`text-xs font-body hidden sm:block ${i === 1 ? 'text-[#1C1714] font-semibold' : 'text-[#8A7A6A]'}`}>{s}</span>
                {i < 2 && <div className="w-6 h-px bg-[#EDE6D8] flex-shrink-0" />}
              </div>
            ))}
          </div>

          {/* Voucher summary card */}
          <div className="bg-white border border-[#EDE6D8] rounded-2xl overflow-hidden mb-6 shadow-sm">
            <div className="relative h-32 overflow-hidden">
              <img src={selectedVoucher.image} alt={lang === 'de' ? selectedVoucher.de_title : selectedVoucher.en_title}
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C1714]/80 to-[#1C1714]/30" />
              <div className="absolute inset-0 flex items-center px-6 gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <div>
                  <p className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase font-body">
                    {lang === 'de' ? selectedVoucher.de_tag : selectedVoucher.en_tag}
                  </p>
                  <h2 className="font-display text-xl font-light text-white">
                    {lang === 'de' ? selectedVoucher.de_title : selectedVoucher.en_title}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="space-y-7">

            {/* Amount selection */}
            <div className="bg-white border border-[#EDE6D8] rounded-2xl p-5 sm:p-6 shadow-sm">
              <label className={labelCls}>{tx.select_amount}</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedVoucher.amounts.map(a => (
                  <button key={a} type="button"
                    onClick={() => setSelectedAmount(a)}
                    className={`px-5 py-2.5 rounded-full font-body text-sm font-semibold border transition-all ${
                      selectedAmount === a
                        ? 'bg-[#8B6914] text-white border-[#8B6914] shadow-md'
                        : 'bg-white text-[#4A3F35] border-[#EDE6D8] hover:border-[#8B6914]/40'
                    }`}>
                    €{a}
                  </button>
                ))}
                {selectedVoucher.customAmount && (
                  <button type="button"
                    onClick={() => setSelectedAmount('custom')}
                    className={`px-5 py-2.5 rounded-full font-body text-sm font-semibold border transition-all ${
                      selectedAmount === 'custom'
                        ? 'bg-[#8B6914] text-white border-[#8B6914] shadow-md'
                        : 'bg-white text-[#4A3F35] border-[#EDE6D8] hover:border-[#8B6914]/40'
                    }`}>
                    {lang === 'de' ? 'Individuell' : 'Custom'}
                  </button>
                )}
              </div>
              {selectedAmount === 'custom' && (
                <div className="mt-3">
                  <label className={labelCls}>{tx.custom_amount}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7A6A] font-body text-sm">€</span>
                    <input
                      type="number" min="10" max="1000"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      placeholder={tx.custom_placeholder}
                      className={`${inputCls} pl-8`} />
                  </div>
                </div>
              )}
              {finalAmount > 0 && (
                <div className="mt-4 flex items-center justify-between bg-[#F2E8D0] border border-[#C9A96E]/20 rounded-xl px-4 py-3">
                  <span className="text-[#8A7A6A] text-sm font-body">Gesamt</span>
                  <span className="font-display text-2xl font-light text-[#8B6914]">€{finalAmount}</span>
                </div>
              )}
            </div>

            {/* Delivery option */}
            <div className="bg-white border border-[#EDE6D8] rounded-2xl p-5 sm:p-6 shadow-sm">
              <label className={labelCls}>{tx.delivery_label}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DELIVERY_OPTIONS.map(opt => (
                  <button key={opt.id} type="button"
                    onClick={() => setDelivery(opt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      delivery === opt.id
                        ? 'border-[#8B6914]/50 bg-[#F2E8D0] text-[#8B6914]'
                        : 'border-[#EDE6D8] bg-white text-[#4A3F35] hover:border-[#8B6914]/30'
                    }`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        delivery === opt.id ? 'border-[#8B6914]' : 'border-[#C8BEA8]'
                      }`}>
                        {delivery === opt.id && <div className="w-2 h-2 rounded-full bg-[#8B6914]" />}
                      </div>
                      <span className="font-body text-sm font-medium">
                        {lang === 'de' ? opt.de : opt.en}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Your details */}
            <div className="bg-white border border-[#EDE6D8] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="font-display text-lg font-light text-[#1C1714]">{tx.your_details}</h3>
              <div>
                <label className={labelCls}>{tx.purchaser_name} *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7A6A]/50" />
                  <input type="text" required value={form.purchaser_name}
                    onChange={e => setForm(f => ({...f, purchaser_name: e.target.value}))}
                    placeholder="Omar Ammesso" className={`${inputCls} pl-10`} />
                </div>
              </div>
              <div>
                <label className={labelCls}>{tx.purchaser_email} *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7A6A]/50" />
                  <input type="email" required value={form.purchaser_email}
                    onChange={e => setForm(f => ({...f, purchaser_email: e.target.value}))}
                    placeholder="name@email.de" className={`${inputCls} pl-10`} />
                </div>
              </div>
            </div>

            {/* Recipient details */}
            <div className="bg-white border border-[#EDE6D8] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="font-display text-lg font-light text-[#1C1714]">{tx.recipient_section}</h3>
              <div>
                <label className={labelCls}>{tx.recipient_name}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7A6A]/50" />
                  <input type="text" value={form.recipient_name}
                    onChange={e => setForm(f => ({...f, recipient_name: e.target.value}))}
                    placeholder={lang === 'de' ? 'Name des Beschenkten' : 'Recipient name'} className={`${inputCls} pl-10`} />
                </div>
              </div>
              {delivery === 'recipient' && (
                <div>
                  <label className={labelCls}>{tx.recipient_email} *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7A6A]/50" />
                    <input type="email" required={delivery === 'recipient'} value={form.recipient_email}
                      onChange={e => setForm(f => ({...f, recipient_email: e.target.value}))}
                      placeholder="empfaenger@email.de" className={`${inputCls} pl-10`} />
                  </div>
                </div>
              )}
              <div>
                <label className={labelCls}>{tx.message_label}</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-[#8A7A6A]/50" />
                  <textarea rows={3} value={form.personal_message}
                    onChange={e => setForm(f => ({...f, personal_message: e.target.value}))}
                    placeholder={tx.message_placeholder}
                    className={`${inputCls} pl-10 resize-none`} />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-body">
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <div className="space-y-3 pt-2">
              <button type="submit" disabled={loading || !finalAmount || finalAmount < 10}
                className="btn-gold w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Lock className="w-4 h-4" /> {tx.pay_btn} {finalAmount > 0 ? `· €${finalAmount}` : ''}</>
                }
              </button>
              <p className="text-center text-[11px] font-body text-[#8A7A6A]/60 leading-relaxed">{tx.secure_note}</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── PRODUCTS SCREEN ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1714]">

      {/* Hero */}
      <div className="relative bg-[#1C1714] page-top pb-16 sm:pb-20 px-5 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1600&q=85"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1714]/70 via-[#1C1714]/60 to-[#1C1714]/90" />
        {/* Gold shimmer top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-transparent" />

        <div className="relative max-w-3xl mx-auto text-center pt-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-[#C9A96E]/40" />
            <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body">{tx.eyebrow}</p>
            <div className="h-px w-8 bg-[#C9A96E]/40" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-white mb-5 leading-[1.05]"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
            {tx.hero_title}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/60 to-transparent mx-auto mb-5" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/60 font-body text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {tx.hero_sub}
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-14 sm:py-18">

        {/* Trust strip */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-14">
          {[
            { icon: Gift, label: tx.trust_1 },
            { icon: Star, label: tx.trust_2 },
            { icon: BedDouble, label: tx.trust_3 },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-[#EDE6D8] rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#F2E8D0] flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-[#8B6914]" />
              </div>
              <p className="text-[10px] sm:text-xs font-body text-[#4A3F35]/70 leading-tight">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Voucher cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {VOUCHERS.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className={`bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col ${
                  v.popular ? 'border-[#C9A96E]/50 ring-2 ring-[#C9A96E]/20' : 'border-[#EDE6D8]'
                }`}>

                {v.popular && (
                  <div className="bg-[#8B6914] text-white text-[9px] tracking-[0.3em] uppercase font-body font-bold text-center py-1.5 px-4">
                    ✦ {tx.popular} ✦
                  </div>
                )}

                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={v.image}
                    alt={lang === 'de' ? v.de_title : v.en_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1714]/70 via-[#1C1714]/10 to-transparent" />
                  <div className="absolute bottom-4 left-5 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="text-white/80 text-[10px] tracking-[0.25em] uppercase font-body font-semibold">
                      {lang === 'de' ? v.de_tag : v.en_tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <h3 className="font-display text-2xl font-light text-[#1C1714] mb-2 leading-tight">
                    {lang === 'de' ? v.de_title : v.en_title}
                  </h3>
                  <p className="text-[#8A7A6A] text-sm font-body leading-relaxed mb-5 flex-1">
                    {lang === 'de' ? v.de_desc : v.en_desc}
                  </p>

                  {/* Amount pills preview */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {v.amounts.slice(0, 4).map(a => (
                      <span key={a} className="px-3 py-1 bg-[#F7F3EC] border border-[#EDE6D8] rounded-full text-xs font-body text-[#4A3F35]">
                        €{a}
                      </span>
                    ))}
                    {v.customAmount && (
                      <span className="px-3 py-1 bg-[#F7F3EC] border border-[#EDE6D8] rounded-full text-xs font-body text-[#8B6914]">
                        {lang === 'de' ? 'individuell' : 'custom'}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => selectVoucher(v)}
                    className="btn-gold w-full justify-center">
                    <Gift className="w-4 h-4" />
                    {tx.buy_this}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* How it works */}
        <div className="bg-[#1C1714] rounded-3xl p-8 sm:p-10 mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-light text-white text-center mb-8">{tx.how_title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
            {[
              { n: '1', t: tx.how_1_t, d: tx.how_1_d },
              { n: '2', t: tx.how_2_t, d: tx.how_2_d },
              { n: '3', t: tx.how_3_t, d: tx.how_3_d },
              { n: '4', t: tx.how_4_t, d: tx.how_4_d },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/25 flex items-center justify-center mx-auto mb-3">
                  <span className="font-display text-sm font-light text-[#C9A96E]">{item.n}</span>
                </div>
                <p className="font-body text-sm font-semibold text-white mb-1">{item.t}</p>
                <p className="font-body text-xs text-white/45 leading-tight">{item.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Redemption info */}
        <div className="bg-[#F2E8D0] border border-[#C9A96E]/25 rounded-2xl p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#8B6914]/12 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-[#8B6914]" />
            </div>
            <div>
              <h3 className="font-display text-xl font-light text-[#1C1714] mb-2">{tx.redeem_title}</h3>
              <p className="text-[#4A3F35]/70 font-body text-sm leading-relaxed">{tx.redeem_text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}