import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { CheckCircle, ArrowRight, Phone, Mail, Users, Calendar, Building2, Heart, Utensils, GlassWater } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
  corporate: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
  wedding: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
};

const EVENT_TYPES = [
  { id: 'wedding', de: '💍 Hochzeit', en: '💍 Wedding' },
  { id: 'birthday', de: '🥂 Geburtstag & Jubiläum', en: '🥂 Birthday & Anniversary' },
  { id: 'corporate', de: '🏢 Firmenevent & Tagung', en: '🏢 Corporate Event & Meeting' },
  { id: 'private_dining', de: '🍽 Private Dining', en: '🍽 Private Dining' },
  { id: 'group', de: '👥 Gruppenreise', en: '👥 Group Stay' },
  { id: 'other', de: '✦ Sonstige Anfrage', en: '✦ Other Request' },
];

const inputCls = "w-full bg-white border-2 border-[#EDE6D8] focus:border-[#8B6914] rounded-xl px-4 py-3.5 text-base text-[#1C1714] placeholder-[#1C1714]/30 focus:outline-none transition-colors font-body";

export default function Events() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;
  const [form, setForm] = useState({
    first_name: '', last_name: '', company: '', email: '', phone: '',
    event_type: 'wedding', guest_count: '', preferred_date: '',
    budget: '', requested_services: '', message: '', gdpr: false,
    honeypot: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.honeypot) return; // spam protection
    if (!form.gdpr) {
      setError(lang === 'de' ? 'Bitte stimmen Sie der Datenschutzerklärung zu.' : 'Please accept the privacy policy.');
      return;
    }
    setError('');
    setSubmitting(true);

    await base44.entities.ContactInquiry.create({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email.toLowerCase().trim(),
      phone: form.phone,
      company: form.company,
      inquiry_type: form.event_type === 'wedding' ? 'wedding' : form.event_type === 'group' ? 'group_event' : form.event_type === 'corporate' ? 'business' : 'general',
      guest_count: parseInt(form.guest_count) || 0,
      preferred_date: form.preferred_date,
      message: [
        `[Event-Typ: ${form.event_type}]`,
        form.company ? `Firma: ${form.company}` : '',
        `Gäste: ${form.guest_count || '—'}`,
        `Datum: ${form.preferred_date || '—'}`,
        form.budget ? `Budget: ${form.budget}` : '',
        form.requested_services ? `Gewünschte Leistungen: ${form.requested_services}` : '',
        `\n${form.message}`,
      ].filter(Boolean).join('\n'),
      language: lang,
    });

    // Admin Slack + email notifications (non-blocking)
    base44.functions.invoke('sendContactEmail', {
      first_name: form.first_name, last_name: form.last_name,
      email: form.email, phone: form.phone,
      message: `[${form.event_type}] Gäste: ${form.guest_count} | Datum: ${form.preferred_date}\n\n${form.message}`,
      inquiry_type: form.event_type, lang,
    }).catch(() => {});

    base44.functions.invoke('notifySlack', {
      type: 'contact', name: `${form.first_name} ${form.last_name}`,
      email: form.email, inquiry_type: form.event_type,
      message: form.message.slice(0, 200),
    }).catch(() => {});

    setDone(true);
    setSubmitting(false);
  }

  const C = {
    de: {
      eyebrow: 'Events & Feiern',
      title: 'Ihr unvergesslicher Moment.\nUnser ganzes Herz.',
      subtitle: 'Von der Traumhochzeit bis zum exklusiven Firmenevent — wir gestalten Ihren Anlass mit persönlicher Gastfreundschaft und mediterraner Leidenschaft.',
      capacity_label: 'Kapazität',
      capacity_value: 'Bis zu 120 Gäste',
      rooms_label: 'Übernachtung',
      rooms_value: '13 Zimmer & Suiten',
      menu_label: 'Kulinarik',
      menu_value: 'Individuelle Menügestaltung',
      events: [
        { icon: Heart, title: 'Hochzeiten', text: 'Ihr schönster Tag in historischem Rahmen. Individuelles Menü, bis zu 120 Gäste, Zimmerkontingente für Übernachtungsgäste.' },
        { icon: GlassWater, title: 'Feiern & Jubiläen', text: 'Geburtstage, runde Jahrestage, Familientreffen — wir gestalten Ihren Abend mit Wärme, Eleganz und hausgemachter Küche.' },
        { icon: Building2, title: 'Firmenevent & Tagung', text: 'Professionelles Ambiente für Meetings, Produktpräsentationen und Mitarbeiterevents. Gastronomie nach Maß.' },
        { icon: Utensils, title: 'Private Dining', text: 'Exklusives Dinner für Ihre Gruppe. Chef Omar Ammesso kreiert ein unvergessliches Menü — abgestimmt auf Ihren Anlass.' },
      ],
      how_title: 'Wie es funktioniert',
      steps: [
        { n: '01', t: 'Anfrage senden', d: 'Erzählen Sie uns von Ihrem Event. Art, Datum, Gästezahl und Wünsche.' },
        { n: '02', t: 'Persönliches Gespräch', d: 'Wir melden uns innerhalb von 24h und besprechen gemeinsam das ideale Konzept.' },
        { n: '03', t: 'Ihr unvergesslicher Tag', d: 'Unser Team sorgt für jedes Detail — Menü, Dekoration und Gastfreundschaft.' },
      ],
      form_title: 'Event anfragen',
      form_sub: 'Schildern Sie uns Ihren Wunsch — wir antworten innerhalb von 24 Stunden.',
      et_label: 'Art des Events',
      first: 'Vorname', last: 'Nachname', company: 'Firma (optional)',
      email: 'E-Mail', phone: 'Telefon', guests: 'Geschätzte Gästezahl',
      date: 'Wunschdatum (ca.)', budget: 'Budget (optional)',
      services: 'Gewünschte Leistungen (optional)', message: 'Ihre Nachricht *',
      msg_ph: 'Was planen Sie? Welche Atmosphäre wünschen Sie sich?',
      gdpr: 'Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten für die Bearbeitung meiner Anfrage zu.',
      submit: 'Anfrage senden',
      success_title: 'Vielen Dank!',
      success_text: 'Ihre Event-Anfrage ist bei uns eingegangen. Wir melden uns innerhalb von 24 Stunden.',
      or_contact: 'Oder kontaktieren Sie uns direkt:',
    },
    en: {
      eyebrow: 'Events & Celebrations',
      title: 'Your Special Moment.\nOur Whole Heart.',
      subtitle: 'From dream weddings to exclusive corporate events — we create your occasion with personal hospitality and Mediterranean passion.',
      capacity_label: 'Capacity', capacity_value: 'Up to 120 guests',
      rooms_label: 'Accommodation', rooms_value: '13 Rooms & Suites',
      menu_label: 'Cuisine', menu_value: 'Individual menu design',
      events: [
        { icon: Heart, title: 'Weddings', text: 'Your most beautiful day in a historic setting. Custom menus, up to 120 guests, room contingents available.' },
        { icon: GlassWater, title: 'Celebrations & Anniversaries', text: 'Birthdays, milestone anniversaries, family gatherings — designed with warmth and elegance.' },
        { icon: Building2, title: 'Corporate Events & Meetings', text: 'Professional setting for meetings, presentations and team events. Catering tailored to you.' },
        { icon: Utensils, title: 'Private Dining', text: 'Exclusive dinner for your group. Chef Omar Ammesso creates an unforgettable menu for your occasion.' },
      ],
      how_title: 'How It Works',
      steps: [
        { n: '01', t: 'Send an Enquiry', d: 'Tell us about your event — type, date, guest count and wishes.' },
        { n: '02', t: 'Personal Consultation', d: 'We respond within 24h and discuss the ideal concept together.' },
        { n: '03', t: 'Your Unforgettable Day', d: 'Our team ensures every detail is perfect — menu, décor and hospitality.' },
      ],
      form_title: 'Event Enquiry',
      form_sub: 'Tell us about your vision — we will respond within 24 hours.',
      et_label: 'Event Type',
      first: 'First Name', last: 'Last Name', company: 'Company (optional)',
      email: 'Email', phone: 'Phone', guests: 'Estimated Guest Count',
      date: 'Preferred Date (approx.)', budget: 'Budget (optional)',
      services: 'Requested services (optional)', message: 'Your Message *',
      msg_ph: 'What are you planning? What atmosphere do you have in mind?',
      gdpr: 'I have read the privacy policy and agree to the processing of my data for handling my enquiry.',
      submit: 'Send Enquiry',
      success_title: 'Thank you!',
      success_text: 'Your event enquiry has been received. We will be in touch within 24 hours.',
      or_contact: 'Or contact us directly:',
    },
  };
  const c = C[lang] || C.de;

  return (
    <div className="min-h-screen bg-white text-[#1C1714] pb-20 lg:pb-0">

      {/* Hero */}
      <div className="relative h-[65vh] min-h-[420px] overflow-hidden">
        <img src={IMAGES.hero} alt="Events & Feiern — Krone Langenburg" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1714]/70 via-[#1C1714]/40 to-[#1C1714]/90" />
        <div className="absolute inset-0 flex items-end pb-16 px-5">
          <div className="max-w-4xl mx-auto w-full">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body mb-4">{c.eyebrow}</p>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-light text-white leading-[1.0] whitespace-pre-line mb-4">{c.title}</h1>
            <p className="text-white/65 font-body text-lg max-w-2xl leading-relaxed">{c.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-[#F7F3EC] border-y border-[#EDE6D8]">
        <div className="max-w-4xl mx-auto px-5 py-6 grid grid-cols-3 divide-x divide-[#EDE6D8]">
          {[
            { label: c.capacity_label, value: c.capacity_value, icon: Users },
            { label: c.rooms_label, value: c.rooms_value, icon: Calendar },
            { label: c.menu_label, value: c.menu_value, icon: Utensils },
          ].map((item, i) => (
            <div key={i} className="px-4 sm:px-8 text-center">
              <item.icon className="w-4 h-4 text-[#8B6914]/60 mx-auto mb-2" />
              <p className="text-[#1C1714]/50 text-[10px] tracking-[0.25em] uppercase font-body mb-1">{item.label}</p>
              <p className="text-[#1C1714] text-sm sm:text-base font-body font-semibold leading-tight">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Event types */}
      <section className="py-16 sm:py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#8B6914] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-3">{c.eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-5xl font-light text-[#1C1714] leading-tight">
              {lang === 'de' ? 'Jeder Anlass. Unser Herzstück.' : 'Every Occasion. Our Specialty.'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {c.events.map((evt, i) => (
              <div key={i} className="bg-white border border-[#EDE6D8] rounded-3xl p-7 sm:p-10 hover:shadow-md hover:border-[#C9A96E]/30 transition-all group">
                <div className="w-12 h-12 rounded-full bg-[#F7F3EC] border border-[#EDE6D8] flex items-center justify-center mb-5 group-hover:bg-[#F2E8D0] transition-colors">
                  <evt.icon className="w-5 h-5 text-[#8B6914]/70" />
                </div>
                <h3 className="font-display text-2xl font-light text-[#1C1714] mb-3">{evt.title}</h3>
                <p className="text-[#4A3F35]/70 font-body leading-relaxed">{evt.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image gallery strip */}
      <section className="px-5 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4 h-48 sm:h-72">
          {[IMAGES.wedding, IMAGES.corporate, IMAGES.dining].map((src, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-5 bg-[#F7F3EC] border-y border-[#EDE6D8]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#8B6914] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-3">{c.how_title}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714]">
              {lang === 'de' ? 'Von der ersten Idee bis zum unvergesslichen Abend' : 'From the first idea to the unforgettable evening'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {c.steps.map((step, i) => (
              <div key={i} className="bg-white border border-[#EDE6D8] rounded-2xl p-6">
                <p className="font-display text-5xl font-light text-[#8B6914]/20 mb-3">{step.n}</p>
                <h3 className="font-display text-xl font-light text-[#1C1714] mb-2">{step.t}</h3>
                <p className="text-[#4A3F35]/60 text-sm font-body leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-16 sm:py-24 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#8B6914] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-3">{c.eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714] mb-3">{c.form_title}</h2>
            <p className="text-[#4A3F35]/60 font-body text-sm">{c.form_sub}</p>
          </div>

          {done ? (
            <div className="bg-white border border-[#EDE6D8] rounded-3xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#F2E8D0] flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-[#8B6914]" />
              </div>
              <h3 className="font-display text-3xl font-light text-[#1C1714] mb-3">{c.success_title}</h3>
              <p className="text-[#4A3F35]/70 font-body mb-8">{c.success_text}</p>
              <p className="text-[#4A3F35]/40 text-sm font-body mb-4">{c.or_contact}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`tel:${s.phone}`} className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#8B6914] text-[#8B6914] rounded-full text-xs tracking-widest uppercase font-body font-semibold hover:bg-[#F2E8D0] transition-all">
                  <Phone className="w-3.5 h-3.5" /> {s.phone}
                </a>
                <a href={`mailto:${s.email_info}`} className="flex items-center justify-center gap-2 px-6 py-3 bg-[#8B6914] text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold hover:bg-[#7A5A0F] transition-all">
                  <Mail className="w-3.5 h-3.5" /> {s.email_info}
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-[#EDE6D8] rounded-3xl p-6 sm:p-10 shadow-sm space-y-5">

              {/* Honeypot (hidden) */}
              <input type="text" tabIndex={-1} autoComplete="off" style={{ display: 'none' }}
                value={form.honeypot} onChange={e => setForm(f => ({ ...f, honeypot: e.target.value }))} />

              {/* Event type selector */}
              <div>
                <label className="block text-[#1C1714]/50 text-[10px] tracking-[0.3em] uppercase font-body mb-3">{c.et_label}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EVENT_TYPES.map(et => (
                    <button key={et.id} type="button" onClick={() => setForm(f => ({ ...f, event_type: et.id }))}
                      className={`px-3 py-2.5 rounded-xl text-xs font-body text-left border transition-all ${form.event_type === et.id ? 'border-[#8B6914] bg-[#F2E8D0] text-[#8B6914] font-semibold' : 'border-[#EDE6D8] text-[#4A3F35]/60 hover:border-[#C9A96E]/50'}`}>
                      {lang === 'de' ? et.de : et.en}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1C1714]/50 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.first} *</label>
                  <input type="text" required value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[#1C1714]/50 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.last} *</label>
                  <input type="text" required value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className={inputCls} />
                </div>
              </div>

              <div>
                <label className="block text-[#1C1714]/50 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.company}</label>
                <input type="text" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className={inputCls} />
              </div>

              <div>
                <label className="block text-[#1C1714]/50 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.email} *</label>
                <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1C1714]/50 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.phone}</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[#1C1714]/50 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.guests}</label>
                  <input type="number" min="1" value={form.guest_count} onChange={e => setForm(f => ({ ...f, guest_count: e.target.value }))} className={inputCls} placeholder="z.B. 60" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1C1714]/50 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.date}</label>
                  <input type="date" value={form.preferred_date} onChange={e => setForm(f => ({ ...f, preferred_date: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[#1C1714]/50 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.budget}</label>
                  <input type="text" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} className={inputCls} placeholder="z.B. €2.000–5.000" />
                </div>
              </div>

              <div>
                <label className="block text-[#1C1714]/50 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.services}</label>
                <input type="text" value={form.requested_services} onChange={e => setForm(f => ({ ...f, requested_services: e.target.value }))} className={inputCls} placeholder={lang === 'de' ? 'Menü, Dekoration, Übernachtung…' : 'Menu, decoration, accommodation…'} />
              </div>

              <div>
                <label className="block text-[#1C1714]/50 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.message}</label>
                <textarea rows={4} required placeholder={c.msg_ph} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className={`${inputCls} resize-none`} />
              </div>

              {/* GDPR */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`w-5 h-5 flex-shrink-0 mt-0.5 rounded border-2 transition-colors flex items-center justify-center ${form.gdpr ? 'bg-[#8B6914] border-[#8B6914]' : 'border-[#C8BEA8] group-hover:border-[#8B6914]/50'}`}
                  onClick={() => setForm(f => ({ ...f, gdpr: !f.gdpr }))}>
                  {form.gdpr && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-[#4A3F35]/60 text-xs font-body leading-relaxed">
                  {c.gdpr}{' '}
                  <Link to="/privacy" className="text-[#8B6914] hover:underline" target="_blank">
                    {lang === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
                  </Link>
                </span>
              </label>

              {error && <p className="text-red-600 text-sm font-body">{error}</p>}

              <button type="submit" disabled={submitting}
                className="w-full py-4 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-full text-sm tracking-[0.15em] uppercase font-body font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                {submitting
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <>{c.submit} <ArrowRight className="w-4 h-4" /></>}
              </button>

              <p className="text-center text-[#4A3F35]/40 text-xs font-body">
                {lang === 'de' ? 'Wir antworten innerhalb von 24 Stunden.' : 'We respond within 24 hours.'}
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Direct contact */}
      <section className="py-10 px-5 bg-[#F7F3EC] border-t border-[#EDE6D8]">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-[#4A3F35]/50 text-sm font-body">{c.or_contact}</p>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${s.phone}`} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#EDE6D8] rounded-full text-xs text-[#4A3F35]/70 hover:text-[#8B6914] hover:border-[#C9A96E]/50 transition-all font-body shadow-sm">
              <Phone className="w-3.5 h-3.5" /> {s.phone}
            </a>
            <a href={`mailto:${s.email_info}`} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#EDE6D8] rounded-full text-xs text-[#4A3F35]/70 hover:text-[#8B6914] hover:border-[#C9A96E]/50 transition-all font-body shadow-sm">
              <Mail className="w-3.5 h-3.5" /> {s.email_info}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}