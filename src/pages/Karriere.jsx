import { useState } from 'react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { SITE_DEFAULTS } from '@/lib/siteData';
import { CheckCircle, ChefHat, Users, Heart, Lightbulb, ArrowRight } from 'lucide-react';

const POSITIONS = [
  {
    id: 'service',
    icon: '🤝',
    de_title: 'Service & Empfang',
    en_title: 'Service & Front of House',
    de_desc: 'Sie sind das Gesicht der Krone. Gastfreundschaft ist Ihre Leidenschaft.',
    en_desc: 'You are the face of the Krone. Hospitality is your passion.',
  },
  {
    id: 'kitchen',
    icon: '🍳',
    de_title: 'Küche & Kochen',
    en_title: 'Kitchen & Cooking',
    de_desc: 'Mediterrane Küche, Handwerk, Leidenschaft — wir suchen Köche mit Seele.',
    en_desc: 'Mediterranean cuisine, craftsmanship, passion — we look for chefs with soul.',
  },
  {
    id: 'reception',
    icon: '🏨',
    de_title: 'Rezeption & Housekeeping',
    en_title: 'Reception & Housekeeping',
    de_desc: 'Ein perfektes Gästeerlebnis beginnt beim Check-in. Sie machen den Unterschied.',
    en_desc: 'A perfect guest experience starts at check-in. You make the difference.',
  },
  {
    id: 'events',
    icon: '✨',
    de_title: 'Events & Hochzeiten',
    en_title: 'Events & Weddings',
    de_desc: 'Hochzeiten, Firmenevents, besondere Abende. Planung ist Ihre Stärke.',
    en_desc: 'Weddings, corporate events, special evenings. Planning is your strength.',
  },
  {
    id: 'initiative',
    icon: '💡',
    de_title: 'Initiativbewerbung',
    en_title: 'Open Application',
    de_desc: 'Keine passende Stelle gefunden? Überzeugen Sie uns trotzdem.',
    en_desc: 'No matching position? Convince us anyway.',
  },
];

const inputCls = "w-full bg-white border border-stone-mid rounded-xl px-4 py-3 text-sm text-charcoal placeholder-stone-dark focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/10 transition-all font-body";

export default function Karriere() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;
  const [selectedPosition, setSelectedPosition] = useState('');
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedPosition) {
      setError(lang === 'de' ? 'Bitte wählen Sie eine Stelle.' : 'Please select a position.');
      return;
    }
    setSubmitting(true);
    setError('');
    await base44.entities.CareerApplication.create({
      ...form,
      position: selectedPosition,
      language: lang,
      status: 'new',
      email_confirmation_sent: false,
    });
    // Fire-and-forget Slack notification
    base44.functions.invoke('notifySlack', {
      type: 'contact',
      name: `${form.first_name} ${form.last_name}`,
      email: form.email,
      inquiry_type: `Karriere: ${selectedPosition}`,
      message: form.message.slice(0, 200),
    }).catch(() => {});
    // Admin email notification
    base44.asServiceRole?.integrations?.Core?.SendEmail?.({
      to: s.email_info,
      from_name: 'Krone Karriereportal',
      subject: `[Bewerbung] ${form.first_name} ${form.last_name} – ${selectedPosition}`,
      body: `<p><b>Position:</b> ${selectedPosition}</p><p><b>Name:</b> ${form.first_name} ${form.last_name}</p><p><b>E-Mail:</b> ${form.email}</p><p><b>Telefon:</b> ${form.phone || '—'}</p><p><b>Nachricht:</b><br/>${form.message.replace(/\n/g,'<br/>')}</p>`,
    }).catch(() => {});
    setDone(true);
    setSubmitting(false);
  }

  const t = {
    de: {
      eyebrow: 'Karriere bei Krone Langenburg',
      title: 'Werden Sie Teil unserer Geschichte.',
      sub: 'Wir suchen keine Lebensläufe. Wir suchen Menschen — mit Leidenschaft, Herzlichkeit und dem Wunsch, etwas Besonderes zu schaffen.',
      open_title: 'Offene Stellen',
      form_title: 'Jetzt bewerben',
      position_hint: 'Stelle wählen *',
      first: 'Vorname *',
      last: 'Nachname *',
      email: 'E-Mail *',
      phone: 'Telefon',
      message: 'Motivation & Anschreiben *',
      send: 'Bewerbung absenden',
      success_title: 'Vielen Dank für Ihre Bewerbung!',
      success_sub: 'Wir melden uns innerhalb von 5 Werktagen bei Ihnen.',
      values_title: 'Was uns ausmacht',
    },
    en: {
      eyebrow: 'Careers at Krone Langenburg',
      title: 'Become Part of Our Story.',
      sub: 'We don\'t look for CVs. We look for people — with passion, warmth and the desire to create something special.',
      open_title: 'Open Positions',
      form_title: 'Apply Now',
      position_hint: 'Select position *',
      first: 'First Name *',
      last: 'Last Name *',
      email: 'Email *',
      phone: 'Phone',
      message: 'Motivation & Cover Letter *',
      send: 'Submit Application',
      success_title: 'Thank you for your application!',
      success_sub: 'We will be in touch within 5 working days.',
      values_title: 'What defines us',
    },
  };
  const tx = t[lang] || t.de;

  const VALUES = [
    { icon: ChefHat, de: 'Handwerk & Qualität', en: 'Craft & Quality', de_d: 'Wir kochen und arbeiten mit Leidenschaft — nicht nach Rezept, sondern aus Überzeugung.', en_d: 'We cook and work with passion — not by recipe, but by conviction.' },
    { icon: Heart, de: 'Herzlichkeit', en: 'Warmth', de_d: 'Jeder Gast soll sich wie zu Hause fühlen. Dafür braucht es Menschen, die das wirklich meinen.', en_d: 'Every guest should feel at home. That takes people who truly mean it.' },
    { icon: Users, de: 'Ein echtes Team', en: 'A Real Team', de_d: 'Kein Hierarchie-Denken. Wir arbeiten zusammen, lernen voneinander, wachsen gemeinsam.', en_d: 'No hierarchical thinking. We work together, learn from each other, grow together.' },
    { icon: Lightbulb, de: 'Entwicklung & Förderung', en: 'Growth & Development', de_d: 'Wir investieren in unsere Mitarbeiter — mit Schulungen, Verantwortung und echten Perspektiven.', en_d: 'We invest in our people — with training, responsibility and real prospects.' },
  ];

  return (
    <div className="min-h-screen bg-ivory text-charcoal pb-24 lg:pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden bg-espresso page-top pb-16 sm:pb-20 px-5">
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85"
          alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" style={{ objectPosition: '50% 60%' }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/60 to-espresso/90" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-gold-light text-[10px] tracking-[0.5em] uppercase font-body mb-5">{tx.eyebrow}</p>
          <h1 className="font-display font-light text-ivory mb-4"
              style={{ fontSize: 'clamp(2.25rem, 4.2vw, 4rem)', lineHeight: '1.05' }}>{tx.title}</h1>
          <p className="text-ivory/50 font-body text-sm max-w-lg mx-auto">{tx.sub}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-5">

        {/* Values */}
        <div className="py-14 sm:py-18">
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body text-center mb-8">{tx.values_title}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v, i) => (
              <div key={i} className="surface-card rounded-2xl p-5 sm:p-6">
                <v.icon className="w-5 h-5 text-gold mb-4" />
                <h3 className="font-display text-xl font-light text-charcoal mb-2">{lang === 'de' ? v.de : v.en}</h3>
                <p className="text-sm font-body leading-relaxed" style={{color:'#7A6A5A'}}>{lang === 'de' ? v.de_d : v.en_d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions + Form */}
        <div className="pb-14 sm:pb-18 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Positions */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-3xl font-light text-charcoal mb-6">{tx.open_title}</h2>
            <div className="space-y-3">
              {POSITIONS.map(pos => (
                <button key={pos.id}
                  onClick={() => setSelectedPosition(pos.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selectedPosition === pos.id
                    ? 'border-gold bg-gold-pale'
                    : 'border-stone-mid bg-white hover:border-gold-light/60'}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">{pos.icon}</span>
                    <div>
                      <p className="font-body font-semibold text-sm text-charcoal">{lang === 'de' ? pos.de_title : pos.en_title}</p>
                      <p className="text-xs font-body mt-1" style={{color:'#7A6A5A'}}>{lang === 'de' ? pos.de_desc : pos.en_desc}</p>
                    </div>
                    {selectedPosition === pos.id && <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 ml-auto mt-0.5" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-3xl font-light text-charcoal mb-6">{tx.form_title}</h2>

            {done ? (
              <div className="surface-card rounded-2xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="font-display text-2xl font-light text-charcoal mb-2">{tx.success_title}</h3>
                <p className="text-sm font-body" style={{color:'#7A6A5A'}}>{tx.success_sub}</p>
              </div>
            ) : (
              <div className="surface-card rounded-2xl p-5 sm:p-7">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Position indicator */}
                  {selectedPosition && (
                    <div className="bg-gold-pale border border-gold/20 rounded-xl px-4 py-3 flex items-center gap-2">
                      <span className="text-sm font-body text-gold font-semibold">
                        {POSITIONS.find(p => p.id === selectedPosition)?.[lang === 'de' ? 'de_title' : 'en_title']}
                      </span>
                    </div>
                  )}
                  {!selectedPosition && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      <p className="text-xs font-body text-amber-700">{tx.position_hint}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase font-body mb-1.5" style={{color:'#8A7A6A'}}>{tx.first}</label>
                      <input type="text" required value={form.first_name} onChange={e => setForm(f => ({...f, first_name: e.target.value}))} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase font-body mb-1.5" style={{color:'#8A7A6A'}}>{tx.last}</label>
                      <input type="text" required value={form.last_name} onChange={e => setForm(f => ({...f, last_name: e.target.value}))} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase font-body mb-1.5" style={{color:'#8A7A6A'}}>{tx.email}</label>
                    <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase font-body mb-1.5" style={{color:'#8A7A6A'}}>{tx.phone}</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase font-body mb-1.5" style={{color:'#8A7A6A'}}>{tx.message}</label>
                    <textarea rows={6} required value={form.message}
                      onChange={e => setForm(f => ({...f, message: e.target.value}))}
                      placeholder={lang === 'de' ? 'Warum möchten Sie bei uns arbeiten?' : 'Why do you want to work with us?'}
                      className={`${inputCls} resize-none`} />
                  </div>
                  {error && <p className="text-red-600 text-xs font-body">{error}</p>}
                  <button type="submit" disabled={submitting}
                    className="w-full py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{tx.send} <ArrowRight className="w-3.5 h-3.5" /></>}
                  </button>
                  <p className="text-center text-[10px] font-body" style={{color:'#8A7A6A'}}>
                    {lang === 'de' ? '✓ Ihre Daten werden vertraulich behandelt.' : '✓ Your data is handled confidentially.'}
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Contact strip */}
        <div className="pb-10 border-t border-stone-mid pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-body" style={{color:'#7A6A5A'}}>
            {lang === 'de' ? 'Fragen zur Bewerbung?' : 'Questions about applying?'}
          </p>
          <a href={`mailto:${s.email_info}`}
            className="flex items-center gap-2 px-6 py-3 btn-ghost-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
            {s.email_info} <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}