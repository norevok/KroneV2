import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { CheckCircle, ArrowRight, Phone, Mail, Users, Calendar, Building2, Heart, Utensils, GlassWater, Sparkles, Music } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';



const EVENT_TYPES = [
  { id: 'wedding',      de: '💍 Hochzeit',                 en: '💍 Wedding' },
  { id: 'birthday',     de: '🥂 Geburtstag & Jubiläum',    en: '🥂 Birthday & Anniversary' },
  { id: 'corporate',    de: '🏢 Firmenevent & Tagung',      en: '🏢 Corporate Event & Meeting' },
  { id: 'private_dining', de: '🍽 Private Dining',          en: '🍽 Private Dining' },
  { id: 'group',        de: '👥 Gruppenreise',              en: '👥 Group Stay' },
  { id: 'other',        de: '✦ Sonstige Anfrage',           en: '✦ Other Request' },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

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
    if (form.honeypot) return;
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
      upcoming_eyebrow: '🎶 Bevorstehende Events',
      upcoming_title: 'Nächste Veranstaltung',
      events: [
        { icon: Heart, title: 'Hochzeiten', text: 'Ihr schönster Tag in historischem Rahmen. Individuelles Menü, bis zu 120 Gäste, Zimmerkontingente für Übernachtungsgäste.' },
        { icon: GlassWater, title: 'Feiern & Jubiläen', text: 'Geburtstage, runde Jahrestage, Familientreffen — wir gestalten Ihren Abend mit Wärme, Eleganz und hausgemachter Küche.' },
        { icon: Building2, title: 'Firmenevent & Tagung', text: 'Professionelles Ambiente für Meetings, Produktpräsentationen und Mitarbeiterevents. Gastronomie nach Maß.' },
        { icon: Utensils, title: 'Private Dining', text: 'Exklusives Dinner für Ihre Gruppe. Chef Omar Ammesso kreiert ein unvergessliches Menü — abgestimmt auf Ihren Anlass.' },
      ],
      how_title: 'So funktioniert es',
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
      gdpr: 'Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zu.',
      submit: 'Anfrage senden',
      success_title: 'Vielen Dank!',
      success_text: 'Ihre Event-Anfrage ist bei uns eingegangen. Wir melden uns innerhalb von 24 Stunden.',
      or_contact: 'Oder kontaktieren Sie uns direkt:',
    },
    en: {
      eyebrow: 'Events & Celebrations',
      title: 'Your Special Moment.\nOur Whole Heart.',
      subtitle: 'From dream weddings to exclusive corporate events — we create your occasion with personal hospitality and Mediterranean passion.',
      upcoming_eyebrow: '🎶 Upcoming Events',
      upcoming_title: 'Next Event',
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
      gdpr: 'I have read the privacy policy and agree to the processing of my data.',
      submit: 'Send Enquiry',
      success_title: 'Thank you!',
      success_text: 'Your event enquiry has been received. We will be in touch within 24 hours.',
      or_contact: 'Or contact us directly:',
    },
  };
  const c = C[lang] || C.de;

  const inputCls = "w-full bg-[#171311] border border-[#C9A96E]/30 focus:border-[#C9A96E]/70 focus:ring-2 focus:ring-[#C9A96E]/15 rounded-xl px-4 py-4 text-sm text-white placeholder-white/25 focus:outline-none transition-all font-body font-medium";

  return (
    <div className="min-h-screen bg-[#171311] text-white pb-20 lg:pb-0">

      {/* ── HERO — korrektes Padding inkl. EventsBanner ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 'clamp(580px, 80vh, 860px)' }}>
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2400&q=90"
          alt="Events & Feiern — Krone Langenburg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 55%' }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0D0B]/55 via-[#171311]/20 to-[#171311]" />
        {/* Padding: Utility(36) + Row1(56) + EventsBanner(34) = 126px mobile / +Row2(40) = 166px desktop */}
        <div className="absolute inset-0 flex flex-col justify-center text-center px-5"
          style={{ paddingTop: 'calc(var(--nav-h-mobile) + 40px)', paddingBottom: '80px' }}>
          <div className="max-w-[860px] w-full mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body mb-4">{c.eyebrow}</motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
              className="font-display font-light text-white whitespace-pre-line mb-5"
              style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4.5rem)', lineHeight: '1.05', textShadow: '0 2px 32px rgba(0,0,0,0.95), 0 4px 60px rgba(0,0,0,0.7)' }}>
              {c.title}
            </motion.h1>
            <motion.div
              className="w-20 h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent mx-auto mb-5"
              initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.8, delay: 0.4 }} />
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
              className="font-body max-w-[640px] mx-auto leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)', color: '#F0D990', textShadow: '0 1px 16px rgba(0,0,0,0.95), 0 2px 30px rgba(0,0,0,0.8)' }}>
              {c.subtitle}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
              <a href="#anfrage" className="btn-gold">
                {c.form_title} <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a href={`tel:${s.phone}`} className="btn-outline-dark">
                <Phone className="w-3.5 h-3.5" /> {lang === 'de' ? 'Direkt anrufen' : 'Call us'}
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── UPCOMING EVENT: 6. Juni — Premium Card ── */}
      <section className="bg-[#0F0D0B] border-b border-[#C9A96E]/20 py-12 sm:py-16 px-5">
        <div className="max-w-5xl mx-auto">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-gradient-to-r from-[#C9A96E]/60 to-transparent" />
            <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body font-semibold">{c.upcoming_eyebrow}</p>
            <div className="flex-1 h-px bg-gradient-to-r from-[#C9A96E]/20 to-transparent" />
          </div>

          {/* Event Card */}
          <div className="relative rounded-3xl overflow-hidden border border-[#C9A96E]/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            {/* Background image */}
            <img
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&q=85"
              alt="Live Musik Gala Dinner"
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ filter: 'brightness(0.22) saturate(0.8)' }}
            />
            {/* Gold accent border top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent" />

            <div className="relative z-10 p-7 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                {/* Left: main info */}
                <div className="lg:col-span-3">
                  <div className="inline-flex items-center gap-2.5 bg-[#C9A96E]/15 border border-[#C9A96E]/35 rounded-full px-4 py-2 mb-6">
                    <Music className="w-3.5 h-3.5 text-[#C9A96E]" />
                    <span className="text-[#E8C878] text-[10px] tracking-[0.35em] uppercase font-body font-bold">Special Event · 6. Juni 2026</span>
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-white mb-3 leading-[1.08]"
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
                    I Genio per 2<br />
                    <span className="text-[#C9A96E] italic text-2xl sm:text-3xl">Live-Musik & Gala-Dinner</span>
                  </h2>

                  <div className="w-12 h-px bg-gradient-to-r from-[#C9A96E]/60 to-transparent mb-5" />

                  <p className="text-white/75 font-body text-sm sm:text-base leading-relaxed mb-7 max-w-lg">
                    Am <strong className="text-white font-semibold">6. Juni ab 18:00 Uhr</strong> erwartet euch im Krone Langenburg by Ammesso eine unvergessliche Nacht — Live-Band, 5-Gang-Menü nach Wahl, und ab 21:00 Uhr der Dancefloor. 🕺💃
                  </p>

                  {/* Menu choices */}
                  <div className="grid grid-cols-2 gap-2.5 mb-7">
                    {[
                      { emoji: '🐟', text: 'Fisch-Menü' },
                      { emoji: '🥬', text: 'Vegetarisches Menü' },
                      { emoji: '🍖', text: 'Fleisch-Menü' },
                      { emoji: '✨', text: 'Überraschungsmenü' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 bg-white/5 border border-[#C9A96E]/18 rounded-xl px-3.5 py-3 backdrop-blur-sm">
                        <span className="text-base flex-shrink-0">{item.emoji}</span>
                        <span className="text-white/85 text-xs font-body font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/reserve" className="btn-gold inline-flex">
                    {lang === 'de' ? 'Jetzt Tisch reservieren' : 'Reserve your Table'} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Right: details box */}
                <div className="lg:col-span-2 bg-white/5 border border-[#C9A96E]/25 rounded-2xl p-6 backdrop-blur-sm">
                  <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body font-semibold mb-5">Details</p>
                  <div className="space-y-4">
                    {[
                      { icon: '📅', label: 'Datum', value: 'Freitag, 6. Juni 2026' },
                      { icon: '⏰', label: 'Einlass', value: 'Ab 18:00 Uhr' },
                      { icon: '🎤', label: 'Live-Band', value: 'I Genio per 2' },
                      { icon: '💃', label: 'Tanzfläche ab', value: '21:00 Uhr' },
                      { icon: '🍽', label: 'Menü', value: 'Mind. 5 Gänge nach Wahl' },
                      { icon: '📍', label: 'Location', value: 'Krone Langenburg, Hauptstr. 24' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 pb-4 border-b border-white/6 last:border-0 last:pb-0">
                        <span className="text-lg flex-shrink-0 w-6 text-center">{item.icon}</span>
                        <div>
                          <p className="text-[#C9A96E]/55 text-[10px] uppercase tracking-widest font-body mb-0.5">{item.label}</p>
                          <p className="text-white text-sm font-body font-semibold leading-snug">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="bg-[#1D1410] border-b border-[#C9A96E]/15">
        <div className="max-w-4xl mx-auto px-5 py-6 grid grid-cols-3 divide-x divide-[#C9A96E]/15">
          {[
            { label: lang === 'de' ? 'Kapazität' : 'Capacity', value: lang === 'de' ? 'Bis zu 120 Gäste' : 'Up to 120 guests', icon: Users },
            { label: lang === 'de' ? 'Übernachtung' : 'Accommodation', value: lang === 'de' ? '13 Zimmer & Suiten' : '13 Rooms & Suites', icon: Calendar },
            { label: lang === 'de' ? 'Kulinarik' : 'Cuisine', value: lang === 'de' ? 'Individuelle Menüs' : 'Individual menus', icon: Utensils },
          ].map((item, i) => (
            <div key={i} className="px-4 sm:px-8 text-center">
              <item.icon className="w-4 h-4 text-[#C9A96E]/50 mx-auto mb-2" />
              <p className="text-[#C9A96E]/50 text-[10px] tracking-[0.25em] uppercase font-body mb-1">{item.label}</p>
              <p className="text-white text-sm sm:text-base font-body font-semibold leading-tight">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── EVENT TYPES ── */}
      <motion.section
        className="py-16 sm:py-24 px-5 bg-[#171311]"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} transition={{ duration: 0.7 }} className="text-center mb-12">
            <p className="text-[#C9A96E] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-3">{c.eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-5xl font-light text-white leading-tight">
              {lang === 'de' ? 'Jeder Anlass. Unser Herzstück.' : 'Every Occasion. Our Specialty.'}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {c.events.map((evt, i) => (
              <motion.div key={i} variants={fadeUp} transition={{ duration: 0.65, delay: i * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                className="bg-[#1D1410] border border-[#C9A96E]/15 hover:border-[#C9A96E]/40 rounded-2xl p-7 sm:p-9 transition-all group shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
                <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 group-hover:bg-[#C9A96E]/18 flex items-center justify-center mb-5 transition-colors">
                  <evt.icon className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="font-display text-2xl font-light text-white mb-3">{evt.title}</h3>
                <p className="text-white/60 font-body leading-relaxed text-sm">{evt.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── IMAGE GALLERY — nur echte Krone-Bilder ── */}
      <section className="px-5 pb-16 bg-[#171311]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 h-52 sm:h-64">
          {[
            { src: "https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8c381b8e8_krone-kingsuite-2-zimmer-favorit-01.jpg", label: lang === 'de' ? 'Zimmer & Suiten' : 'Rooms & Suites' },
            { src: "https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/2bf4a9028_Krone_innen.png", label: lang === 'de' ? 'Restaurant' : 'Restaurant' },
            { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85", label: lang === 'de' ? 'Kulinarik' : 'Cuisine' },
            { src: "https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/aef46bd59_Krone_innen.png", label: lang === 'de' ? 'Ambiente' : 'Ambiance' },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl overflow-hidden relative group">
              <img src={item.src} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0B]/75 via-transparent to-transparent" />
              <p className="absolute bottom-3 left-3 text-white/90 text-xs font-body font-semibold tracking-wider uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <motion.section
        className="py-16 px-5 bg-[#1D1410] border-y border-[#C9A96E]/10"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} transition={{ duration: 0.7 }} className="text-center mb-10">
            <p className="text-[#C9A96E] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-3">{c.how_title}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-white">
              {lang === 'de' ? 'Von der ersten Idee bis zum unvergesslichen Abend' : 'From the first idea to the unforgettable evening'}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {c.steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} transition={{ duration: 0.65, delay: i * 0.08 }}
                className="bg-[#171311] border border-[#C9A96E]/15 rounded-2xl p-7 group hover:border-[#C9A96E]/30 transition-colors">
                <p className="font-display text-6xl font-light text-[#C9A96E]/18 group-hover:text-[#C9A96E]/30 transition-colors mb-3 leading-none">{step.n}</p>
                <div className="w-8 h-0.5 bg-gradient-to-r from-[#C9A96E]/60 to-transparent mb-5" />
                <h3 className="font-display text-xl font-light text-white mb-2">{step.t}</h3>
                <p className="text-white/50 text-sm font-body leading-relaxed">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── INQUIRY FORM (dark, high-contrast) ── */}
      <motion.section
        id="anfrage"
        className="py-16 sm:py-24 px-5 bg-[#171311]"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
        <div className="max-w-2xl mx-auto">
          <motion.div variants={fadeUp} transition={{ duration: 0.7 }} className="text-center mb-10 sm:mb-14">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body mb-3">{c.eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-3">{c.form_title}</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent mx-auto mb-4" />
            <p className="text-white/50 font-body text-sm">{c.form_sub}</p>
          </motion.div>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              className="bg-[#1D1410] border border-[#C9A96E]/20 rounded-3xl p-12 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-[#C9A96E]/12 border border-[#C9A96E]/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-[#C9A96E]" />
              </div>
              <h3 className="font-display text-3xl font-light text-white mb-3">{c.success_title}</h3>
              <p className="text-white/60 font-body mb-8">{c.success_text}</p>
              <p className="text-white/30 text-xs font-body mb-4 uppercase tracking-widest">{c.or_contact}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`tel:${s.phone}`} className="flex items-center justify-center gap-2 px-6 py-3.5 border border-[#C9A96E]/30 text-[#C9A96E] rounded-full text-xs tracking-widest uppercase font-body font-semibold hover:border-[#C9A96E]/60 transition-all">
                  <Phone className="w-3.5 h-3.5" /> {s.phone}
                </a>
                <a href={`mailto:${s.email_info}`} className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C9A96E] text-[#1C1714] rounded-full text-xs tracking-widest uppercase font-body font-semibold hover:bg-[#B8924A] transition-all">
                  <Mail className="w-3.5 h-3.5" /> {s.email_info}
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} transition={{ duration: 0.7 }}
              className="bg-[#1D1410] border border-[#C9A96E]/15 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Honeypot */}
                <input type="text" tabIndex={-1} autoComplete="off" style={{ display: 'none' }}
                  value={form.honeypot} onChange={e => setForm(f => ({ ...f, honeypot: e.target.value }))} />

                {/* Event type */}
                <div>
                  <label className="block text-[#C9A96E]/80 text-[10px] tracking-[0.35em] uppercase font-body font-semibold mb-4">{c.et_label}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {EVENT_TYPES.map(et => (
                      <button key={et.id} type="button" onClick={() => setForm(f => ({ ...f, event_type: et.id }))}
                        className={`px-3 py-3.5 rounded-xl text-xs font-body text-center border transition-all ${
                          form.event_type === et.id
                            ? 'border-[#C9A96E]/70 bg-[#C9A96E]/12 text-[#C9A96E] font-semibold shadow-[0_0_0_1px_rgba(201,169,110,0.3)]'
                            : 'border-[#C9A96E]/10 text-white/50 hover:border-[#C9A96E]/30 hover:text-white/80 bg-black/20'
                        }`}>
                        {lang === 'de' ? et.de : et.en}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#C9A96E]/80 text-[10px] tracking-[0.3em] uppercase font-body font-semibold mb-2.5">{c.first} *</label>
                    <input type="text" required value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[#C9A96E]/80 text-[10px] tracking-[0.3em] uppercase font-body font-semibold mb-2.5">{c.last} *</label>
                    <input type="text" required value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className="block text-[#C9A96E]/80 text-[10px] tracking-[0.3em] uppercase font-body font-semibold mb-2.5">{c.company}</label>
                  <input type="text" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className={inputCls} />
                </div>

                <div>
                  <label className="block text-[#C9A96E]/80 text-[10px] tracking-[0.3em] uppercase font-body font-semibold mb-2.5">{c.email} *</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#C9A96E]/80 text-[10px] tracking-[0.3em] uppercase font-body font-semibold mb-2.5">{c.phone}</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[#C9A96E]/80 text-[10px] tracking-[0.3em] uppercase font-body font-semibold mb-2.5">{c.guests}</label>
                    <input type="number" min="1" value={form.guest_count} onChange={e => setForm(f => ({ ...f, guest_count: e.target.value }))} className={inputCls} placeholder="z.B. 60" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#C9A96E]/80 text-[10px] tracking-[0.3em] uppercase font-body font-semibold mb-2.5">{c.date}</label>
                    <input type="date" value={form.preferred_date} onChange={e => setForm(f => ({ ...f, preferred_date: e.target.value }))} className={inputCls} style={{ colorScheme: 'dark' }} />
                  </div>
                  <div>
                    <label className="block text-[#C9A96E]/80 text-[10px] tracking-[0.3em] uppercase font-body font-semibold mb-2.5">{c.budget}</label>
                    <input type="text" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} className={inputCls} placeholder="z.B. €2.000–5.000" />
                  </div>
                </div>

                <div>
                  <label className="block text-[#C9A96E]/80 text-[10px] tracking-[0.3em] uppercase font-body font-semibold mb-2.5">{c.services}</label>
                  <input type="text" value={form.requested_services} onChange={e => setForm(f => ({ ...f, requested_services: e.target.value }))} className={inputCls} placeholder={lang === 'de' ? 'Menü, Dekoration, Übernachtung…' : 'Menu, decoration, accommodation…'} />
                </div>

                <div>
                  <label className="block text-[#C9A96E]/80 text-[10px] tracking-[0.3em] uppercase font-body font-semibold mb-2.5">{c.message}</label>
                  <textarea rows={4} required placeholder={c.msg_ph} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className={`${inputCls} resize-none`} />
                </div>

                {/* GDPR */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 flex-shrink-0 mt-0.5 rounded border-2 transition-colors flex items-center justify-center ${form.gdpr ? 'bg-[#C9A96E] border-[#C9A96E]' : 'border-[#C9A96E]/30 group-hover:border-[#C9A96E]/60'}`}
                    onClick={() => setForm(f => ({ ...f, gdpr: !f.gdpr }))}>
                    {form.gdpr && <svg className="w-3 h-3 text-[#1C1714]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-white/60 text-xs font-body leading-relaxed">
                    {c.gdpr}{' '}
                    <Link to="/privacy" className="text-[#C9A96E] hover:text-[#E8C878] underline" target="_blank">
                      {lang === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
                    </Link>
                  </span>
                </label>

                {error && <p className="text-red-400 text-sm font-body bg-red-900/20 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

                <button type="submit" disabled={submitting}
                  className="btn-gold w-full justify-center disabled:opacity-50">
                  {submitting
                    ? <div className="w-4 h-4 border-2 border-[#1C1714]/30 border-t-[#1C1714] rounded-full animate-spin" />
                    : <>{c.submit} <ArrowRight className="w-4 h-4" /></>}
                </button>

                <p className="text-center text-white/30 text-xs font-body">
                  {lang === 'de' ? 'Wir antworten innerhalb von 24 Stunden.' : 'We respond within 24 hours.'}
                </p>
              </form>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* ── CONTACT BAR ── */}
      <section className="py-12 px-5 bg-[#1D1410] border-t border-[#C9A96E]/10">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-white/40 text-sm font-body">{c.or_contact}</p>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${s.phone}`} className="flex items-center gap-2 px-5 py-2.5 border border-[#C9A96E]/25 text-[#C9A96E]/80 hover:text-[#C9A96E] hover:border-[#C9A96E]/50 bg-[#C9A96E]/5 rounded-full text-xs font-body transition-all">
              <Phone className="w-3.5 h-3.5" /> {s.phone}
            </a>
            <a href={`mailto:${s.email_info}`} className="flex items-center gap-2 px-5 py-2.5 border border-[#C9A96E]/25 text-[#C9A96E]/80 hover:text-[#C9A96E] hover:border-[#C9A96E]/50 bg-[#C9A96E]/5 rounded-full text-xs font-body transition-all">
              <Mail className="w-3.5 h-3.5" /> {s.email_info}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}