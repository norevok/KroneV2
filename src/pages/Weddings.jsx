import { useState } from 'react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { CheckCircle, ArrowRight, Phone, Mail, Heart, Sparkles, Building2, UtensilsCrossed } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';
import { motion } from 'framer-motion';

const HERO_IMG = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=90";

const EVENT_TYPES = [
  { id: 'wedding',     icon: '💍', de: 'Hochzeit',                  en: 'Wedding',               it: 'Matrimonio' },
  { id: 'celebration', icon: '🥂', de: 'Geburtstag & Jubiläum',     en: 'Birthday & Anniversary', it: 'Compleanno & anniversario' },
  { id: 'corporate',   icon: '🏢', de: 'Firmenevent',                en: 'Corporate Event',        it: 'Evento aziendale' },
  { id: 'private_dining', icon: '🍽', de: 'Private Dining',          en: 'Private Dining',         it: 'Cena privata' },
  { id: 'group',       icon: '👥', de: 'Gruppenreise / Kontingent',  en: 'Group Stay',             it: 'Soggiorno di gruppo' },
  { id: 'other',       icon: '✦',  de: 'Sonstige Anfrage',           en: 'Other Request',          it: 'Altra richiesta' },
];

const FEATURES = [
  {
    icon: Heart,
    de_t: 'Traumhochzeiten',
    en_t: 'Dream Weddings',
    it_t: 'Matrimoni da sogno',
    de: 'Intimes Ambiente für bis zu 120 Gäste, Raumkontingente für Übernachtungsgäste, individuelle Menügestaltung.',
    en: 'Intimate setting for up to 120 guests, room contingents, individual menu design.',
    it: 'Ambiente intimo per fino a 120 ospiti, contingenti di camere, menù individuale.',
  },
  {
    icon: Sparkles,
    de_t: 'Feiern & Jubiläen',
    en_t: 'Celebrations',
    it_t: 'Feste e anniversari',
    de: 'Geburtstage, runde Jahrestage, Familientreffen — vom intimen Dinner bis zur großen Tafel.',
    en: 'Birthdays, milestones, family gatherings — from intimate dinner to grand banquet.',
    it: 'Compleanni, anniversari, riunioni di famiglia — dalla cena intima al grande banchetto.',
  },
  {
    icon: Building2,
    de_t: 'Firmenevents',
    en_t: 'Corporate Events',
    it_t: 'Eventi aziendali',
    de: 'Tagungen, Produktpräsentationen, Mitarbeiterevents — Professionalität gepaart mit echter Gastlichkeit.',
    en: 'Meetings, presentations, team events — professionalism paired with genuine hospitality.',
    it: 'Riunioni, presentazioni, eventi per dipendenti — professionalità e ospitalità autentica.',
  },
  {
    icon: UtensilsCrossed,
    de_t: 'Private Dining',
    en_t: 'Private Dining',
    it_t: 'Cena privata',
    de: 'Exklusives Abendessen in privatem Rahmen. Chef Omar Ammesso gestaltet für Sie ein unvergessliches Menü.',
    en: 'Exclusive dinner in a private setting. Chef Omar Ammesso creates an unforgettable menu for you.',
    it: 'Cena esclusiva in un ambiente privato. Lo chef Omar Ammesso crea un menù indimenticabile.',
  },
];

const STEPS = [
  {
    n: '01',
    de_t: 'Anfrage senden', en_t: 'Send an Enquiry', it_t: 'Invia una richiesta',
    de: 'Erzählen Sie uns von Ihrem Event — Art, Datum, Gästezahl und Ihre besonderen Wünsche.',
    en: 'Tell us about your event — type, date, guest count and your special wishes.',
    it: 'Raccontateci del vostro evento — tipo, data, numero di ospiti e i vostri desideri.',
  },
  {
    n: '02',
    de_t: 'Persönliches Gespräch', en_t: 'Personal Consultation', it_t: 'Consulenza personale',
    de: 'Wir melden uns innerhalb von 24 Stunden und besprechen gemeinsam das ideale Konzept.',
    en: 'We respond within 24 hours and together develop the ideal concept for your event.',
    it: 'Vi rispondiamo entro 24 ore e sviluppiamo insieme il concetto ideale per il vostro evento.',
  },
  {
    n: '03',
    de_t: 'Ihr unvergesslicher Tag', en_t: 'Your Unforgettable Day', it_t: 'Il vostro giorno indimenticabile',
    de: 'Unser Team sorgt dafür, dass jedes Detail stimmt — vom ersten Gang bis zum letzten Tanz.',
    en: 'Our team ensures every detail is perfect — from the first course to the last dance.',
    it: 'Il nostro team cura ogni dettaglio — dal primo piatto all\'ultimo ballo.',
  },
];

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };

export default function Weddings() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    event_type: 'wedding', guest_count: '', preferred_date: '', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.ContactInquiry.create({
      first_name: form.first_name, last_name: form.last_name,
      email: form.email, phone: form.phone,
      inquiry_type: form.event_type === 'wedding' ? 'wedding' : form.event_type === 'group' ? 'group' : 'event',
      guest_count: parseInt(form.guest_count) || 0,
      preferred_date: form.preferred_date,
      message: `[${form.event_type}] Gäste: ${form.guest_count} | Datum: ${form.preferred_date}\n\n${form.message}`,
      language: lang,
    });
    base44.functions.invoke('notifySlack', {
      type: 'contact', name: `${form.first_name} ${form.last_name}`,
      email: form.email, inquiry_type: form.event_type,
      message: form.message.slice(0, 200),
    }).catch(() => {});
    base44.functions.invoke('sendContactEmail', {
      first_name: form.first_name, last_name: form.last_name,
      email: form.email, phone: form.phone,
      message: `[${form.event_type}] Gäste: ${form.guest_count} | Datum: ${form.preferred_date}\n\n${form.message}`,
      inquiry_type: form.event_type, lang,
    }).catch(() => {});
    setDone(true);
    setSubmitting(false);
  }

  const C = {
    de: {
      eyebrow: 'Hochzeiten & Events',
      title: 'Ihr besonderer Tag.\nUnser ganzes Herz.',
      hero_sub: 'Die Krone Langenburg — eine Bühne für die schönsten Momente Ihres Lebens.',
      btn_enquire: 'Event anfragen',
      btn_consult: 'Beratung vereinbaren',
      lead: 'Die Krone Langenburg ist nicht nur ein Ort — sie ist eine Bühne für die schönsten Momente Ihres Lebens. Wir begleiten Sie von der ersten Idee bis zum letzten Tanz.',
      capacity: 'Bis zu 120 Gäste',
      rooms: 'Raumkontingente verfügbar',
      flexible: 'Individuelle Menügestaltung',
      process_eyebrow: 'So funktioniert es',
      process_title: 'Von der ersten Idee bis zum unvergesslichen Abend',
      form_eyebrow: 'Kontakt aufnehmen',
      form_title: 'Anfrage senden',
      form_sub: 'Schildern Sie uns Ihren Wunsch — wir melden uns persönlich innerhalb von 24 Stunden.',
      et_label: 'Art des Events',
      guests: 'Geschätzte Gästezahl',
      date: 'Wunschdatum',
      first: 'Vorname', last: 'Nachname', email: 'E-Mail', phone: 'Telefon',
      message: 'Erzählen Sie uns von Ihrem Event',
      msg_ph: 'Was planen Sie? Welche Atmosphäre wünschen Sie sich? Gibt es besondere Wünsche?',
      submit: 'Anfrage senden',
      reply_note: 'Wir antworten innerhalb von 24 Stunden.',
      success_title: 'Vielen Dank!',
      success_text: 'Ihre Anfrage ist bei uns eingegangen. Wir melden uns persönlich innerhalb von 24 Stunden.',
      contact_label: 'Oder sprechen Sie direkt mit uns:',
    },
    en: {
      eyebrow: 'Weddings & Events',
      title: 'Your Special Day.\nOur Whole Heart.',
      hero_sub: 'Krone Langenburg — a stage for the most beautiful moments of your life.',
      btn_enquire: 'Enquire about your event',
      btn_consult: 'Schedule a consultation',
      lead: 'Krone Langenburg is not just a venue — it is a stage for the most beautiful moments of your life. We accompany you from the first idea to the last dance.',
      capacity: 'Up to 120 guests',
      rooms: 'Room contingents available',
      flexible: 'Individual menu design',
      process_eyebrow: 'How it works',
      process_title: 'From the first idea to the unforgettable evening',
      form_eyebrow: 'Get in touch',
      form_title: 'Send an Enquiry',
      form_sub: 'Tell us about your vision — we will be in touch personally within 24 hours.',
      et_label: 'Event Type',
      guests: 'Estimated Guest Count',
      date: 'Preferred Date',
      first: 'First Name', last: 'Last Name', email: 'Email', phone: 'Phone',
      message: 'Tell us about your event',
      msg_ph: 'What are you planning? What atmosphere do you have in mind? Any special requirements?',
      submit: 'Send Enquiry',
      reply_note: 'We respond within 24 hours.',
      success_title: 'Thank you!',
      success_text: 'Your enquiry has been received. We will be in touch personally within 24 hours.',
      contact_label: 'Or speak with us directly:',
    },
    it: {
      eyebrow: 'Matrimoni & eventi',
      title: 'Il vostro giorno speciale.\nTutto il nostro cuore.',
      hero_sub: 'Krone Langenburg — un palcoscenico per i momenti più belli della vostra vita.',
      btn_enquire: 'Invia richiesta evento',
      btn_consult: 'Prenota una consulenza',
      lead: 'Krone Langenburg non è solo un luogo — è un palcoscenico per i momenti più belli della vostra vita. Vi accompagniamo dalla prima idea all\'ultimo ballo.',
      capacity: 'Fino a 120 ospiti',
      rooms: 'Contingenti di camere disponibili',
      flexible: 'Menù individuale su misura',
      process_eyebrow: 'Come funziona',
      process_title: 'Dalla prima idea alla serata indimenticabile',
      form_eyebrow: 'Contattaci',
      form_title: 'Invia una richiesta',
      form_sub: 'Raccontateci la vostra idea — vi risponderemo personalmente entro 24 ore.',
      et_label: 'Tipo di evento',
      guests: 'Numero di ospiti stimato',
      date: 'Data preferita',
      first: 'Nome', last: 'Cognome', email: 'Email', phone: 'Telefono',
      message: 'Raccontateci il vostro evento',
      msg_ph: 'Cosa state pianificando? Che atmosfera desiderate? Ci sono esigenze particolari?',
      submit: 'Invia richiesta',
      reply_note: 'Risponderemo entro 24 ore.',
      success_title: 'Grazie!',
      success_text: 'La vostra richiesta è stata ricevuta. Vi risponderemo personalmente entro 24 ore.',
      contact_label: 'Oppure contattateci direttamente:',
    },
  };
  const c = C[lang] || C.de;

  const inputCls = "w-full bg-[#0F0D0B]/80 border border-[#C9A96E]/20 rounded-xl px-4 py-4 text-sm text-[#FAF8F5] placeholder-[#D7D0C5]/25 focus:outline-none focus:border-[#C9A96E]/55 focus:ring-2 focus:ring-[#C9A96E]/12 transition-all font-body";

  return (
    <div className="min-h-screen bg-[#171311] text-[#FAF8F5] pb-24 lg:pb-0">

      {/* ── PHASE 1: HERO ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 'calc(100vh)' }}>
        <img
          src={HERO_IMG}
          alt="Hochzeit & Events Krone Langenburg by Ammesso — Eventlocation Hohenlohe"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Multi-layer cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0D0B]/70 via-[#171311]/30 to-[#171311]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0D0B]/30 via-transparent to-[#0F0D0B]/20" />
        {/* Warm gold tint at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#B08A42]/6 to-transparent" />

        {/* Hero Content — bottom aligned, generous padding */}
        {/* pt accounts for: mobile = utility(36) + nav(56) + banner(36) = 128px | desktop = utility(36) + nav(56) + secondary(40) + banner(36) = 168px */}
        <div className="absolute inset-0 flex flex-col justify-end px-5 sm:px-10 pb-16 sm:pb-20 pt-[126px] lg:pt-[166px]">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}>
              <p className="text-[#C9A96E] text-[10px] sm:text-[11px] tracking-[0.5em] uppercase font-body mb-4 sm:mb-5">{c.eyebrow}</p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[2.2rem] sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.08] whitespace-pre-line mb-5 sm:mb-7"
              style={{ textShadow: '0 2px 24px rgba(0,0,0,0.7), 0 4px 60px rgba(0,0,0,0.4)' }}>
              {c.title}
            </motion.h1>

            <motion.div
              className="w-14 sm:w-20 h-px bg-gradient-to-r from-[#C9A96E]/80 via-[#C9A96E]/50 to-transparent mb-5 sm:mb-7"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.45, transformOrigin: 'left' }}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-white/75 font-body text-sm sm:text-base max-w-xl leading-relaxed mb-8 sm:mb-10"
              style={{ textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}>
              {c.hero_sub}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}>
              <a href="#anfrage"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] rounded-full font-body font-bold text-xs tracking-widest uppercase transition-all shadow-[0_8px_28px_rgba(201,169,110,0.35)] hover:shadow-[0_12px_36px_rgba(201,169,110,0.5)] hover:-translate-y-0.5 w-full sm:w-auto">
                {c.btn_enquire} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href={`tel:${s.phone}`}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 border-2 border-white/30 hover:border-[#C9A96E]/70 text-white hover:text-[#C9A96E] rounded-full font-body font-semibold text-xs tracking-widest uppercase transition-all backdrop-blur-sm hover:-translate-y-0.5 w-full sm:w-auto">
                <Phone className="w-3.5 h-3.5" /> {c.btn_consult}
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="w-4 h-6 rounded-full border border-white/40 flex items-start justify-center pt-1">
            <div className="w-0.5 h-1.5 bg-white/60 rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* ── PHASE 2: INTRO QUOTE ── */}
      <motion.section
        className="py-16 sm:py-24 px-5 bg-[#1D1410] border-y border-[#C9A96E]/10"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} transition={{ duration: 0.7 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/60 to-transparent mx-auto mb-8" />

          <motion.p
            variants={fadeUp} transition={{ duration: 0.8 }}
            className="font-display text-xl sm:text-2xl md:text-3xl font-light text-[#FAF8F5]/80 italic leading-[1.6] mb-8">
            &ldquo;{c.lead}&rdquo;
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration: 0.7 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/60 to-transparent mx-auto mb-10" />

          <motion.div
            variants={fadeUp} transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {[c.capacity, c.rooms, c.flexible].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm font-body text-[#FAF8F5]/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]/60 flex-shrink-0" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── PHASE 3: EVENT CATEGORY CARDS ── */}
      <motion.section
        className="py-16 sm:py-24 px-4 sm:px-8 bg-[#171311]"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} transition={{ duration: 0.7 }} className="text-center mb-12 sm:mb-16">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.45em] uppercase font-body mb-3">
              {lang === 'de' ? 'Was wir für Sie gestalten' : lang === 'en' ? 'What we create for you' : 'Cosa creiamo per voi'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-white">
              {lang === 'de' ? 'Jeder Anlass verdient Perfektion' : lang === 'en' ? 'Every occasion deserves perfection' : 'Ogni occasione merita perfezione'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp} transition={{ duration: 0.65, delay: i * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                className="group bg-[#1D1410] border border-[#C9A96E]/15 hover:border-[#C9A96E]/40 rounded-2xl p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 group-hover:bg-[#C9A96E]/18 group-hover:border-[#C9A96E]/35 flex items-center justify-center flex-shrink-0 transition-all duration-300 mt-0.5">
                    <f.icon className="w-5 h-5 text-[#C9A96E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl sm:text-2xl font-light text-white mb-3 leading-tight">
                      {lang === 'de' ? f.de_t : lang === 'en' ? f.en_t : f.it_t}
                    </h3>
                    <p className="text-[#D7D0C5]/60 text-sm font-body leading-[1.7]">
                      {lang === 'de' ? f.de : lang === 'en' ? f.en : f.it}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── GALLERY STRIP ── */}
      <section className="px-4 sm:px-8 pb-16 sm:pb-20 bg-[#171311]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-3 h-44 sm:h-64 md:h-72">
            {[
              { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=85", alt: 'Hochzeit Tischdekoration — Krone Langenburg by Ammesso' },
              { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85", alt: 'Gourmet Dinner — Krone Langenburg by Ammesso' },
              { src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=85", alt: 'Event Champagner — Krone Langenburg by Ammesso' },
            ].map((item, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden group">
                <img src={item.src} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0B]/60 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHASE 4: PROCESS STEPS ── */}
      <motion.section
        className="py-16 sm:py-24 px-4 sm:px-8 bg-[#1D1410] border-y border-[#C9A96E]/8"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} transition={{ duration: 0.7 }} className="text-center mb-14 sm:mb-18">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.45em] uppercase font-body mb-3">{c.process_eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-white leading-[1.1] max-w-2xl mx-auto">
              {c.process_title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {STEPS.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp} transition={{ duration: 0.65, delay: i * 0.08 }}
                className="relative bg-[#171311] border border-[#C9A96E]/15 rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.25)] group hover:border-[#C9A96E]/30 transition-colors duration-300">
                {/* Step number */}
                <p className="font-display text-6xl sm:text-7xl font-light text-[#C9A96E]/18 group-hover:text-[#C9A96E]/28 transition-colors duration-300 mb-5 leading-none select-none">
                  {item.n}
                </p>
                {/* Gold accent line */}
                <div className="w-8 h-0.5 bg-gradient-to-r from-[#C9A96E]/70 to-transparent mb-6" />
                <h3 className="font-display text-xl sm:text-2xl font-light text-white mb-4 leading-tight">
                  {lang === 'de' ? item.de_t : lang === 'en' ? item.en_t : item.it_t}
                </h3>
                <p className="text-[#D7D0C5]/55 text-sm font-body leading-[1.75]">
                  {lang === 'de' ? item.de : lang === 'en' ? item.en : item.it}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── PHASE 5: INQUIRY FORM ── */}
      <motion.section
        id="anfrage"
        className="py-16 sm:py-24 px-4 sm:px-8 bg-[#171311]"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
        <div className="max-w-2xl mx-auto">

          {/* Section header */}
          <motion.div variants={fadeUp} transition={{ duration: 0.7 }} className="text-center mb-10 sm:mb-14">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body mb-3">{c.form_eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4">{c.form_title}</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent mx-auto mb-4" />
            <p className="text-[#D7D0C5]/50 font-body text-sm sm:text-base leading-relaxed max-w-md mx-auto">{c.form_sub}</p>
          </motion.div>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-[#1D1410] border border-[#C9A96E]/20 rounded-3xl p-10 sm:p-14 text-center shadow-2xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-18 h-18 rounded-full bg-[#C9A96E]/12 border border-[#C9A96E]/30 flex items-center justify-center mx-auto mb-7" style={{ width: 72, height: 72 }}>
                <CheckCircle className="w-9 h-9 text-[#C9A96E]" />
              </motion.div>
              <h3 className="font-display text-3xl sm:text-4xl font-light text-white mb-4">{c.success_title}</h3>
              <p className="text-[#D7D0C5]/55 font-body text-sm mb-10 leading-relaxed max-w-sm mx-auto">{c.success_text}</p>
              <div className="w-12 h-px bg-[#C9A96E]/30 mx-auto mb-8" />
              <p className="text-[#D7D0C5]/35 text-xs font-body mb-5 tracking-wider uppercase">{c.contact_label}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`tel:${s.phone}`} className="flex items-center justify-center gap-2 px-6 py-3.5 border border-[#C9A96E]/30 text-[#C9A96E]/80 hover:text-[#C9A96E] hover:border-[#C9A96E]/60 rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all">
                  <Phone className="w-3.5 h-3.5" /> {s.phone}
                </a>
                <a href={`mailto:${s.email_info}`} className="flex items-center justify-center gap-2 px-6 py-3.5 border border-[#C9A96E]/30 text-[#C9A96E]/80 hover:text-[#C9A96E] hover:border-[#C9A96E]/60 rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all">
                  <Mail className="w-3.5 h-3.5" /> {s.email_info}
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} transition={{ duration: 0.7 }}
              className="bg-[#1D1410] border border-[#C9A96E]/12 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Event Type Selector */}
                <div>
                  <label className="block text-[#D7D0C5]/50 text-[10px] tracking-[0.35em] uppercase font-body mb-4">{c.et_label}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {EVENT_TYPES.map(et => (
                      <button key={et.id} type="button"
                        onClick={() => setForm(f => ({ ...f, event_type: et.id }))}
                        className={`relative px-3 py-3.5 rounded-xl text-xs font-body text-center border transition-all duration-200 ${
                          form.event_type === et.id
                            ? 'border-[#C9A96E]/70 bg-[#C9A96E]/12 text-[#C9A96E] font-semibold shadow-[0_0_0_1px_rgba(201,169,110,0.3),0_4px_16px_rgba(201,169,110,0.12)]'
                            : 'border-[#C9A96E]/10 text-[#D7D0C5]/50 hover:border-[#C9A96E]/30 hover:text-[#D7D0C5]/80 bg-[#0F0D0B]/30'
                        }`}>
                        <span className="block text-base mb-0.5">{et.icon}</span>
                        <span className="leading-tight">{lang === 'de' ? et.de : lang === 'en' ? et.en : et.it}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#D7D0C5]/45 text-[10px] tracking-[0.28em] uppercase font-body mb-2">{c.first} *</label>
                    <input type="text" required value={form.first_name}
                      onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                      className={inputCls} placeholder="Omar" />
                  </div>
                  <div>
                    <label className="block text-[#D7D0C5]/45 text-[10px] tracking-[0.28em] uppercase font-body mb-2">{c.last} *</label>
                    <input type="text" required value={form.last_name}
                      onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                      className={inputCls} placeholder="Ammesso" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[#D7D0C5]/45 text-[10px] tracking-[0.28em] uppercase font-body mb-2">{c.email} *</label>
                  <input type="email" required value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={inputCls} placeholder="name@email.de" />
                </div>

                {/* Phone + Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#D7D0C5]/45 text-[10px] tracking-[0.28em] uppercase font-body mb-2">{c.phone}</label>
                    <input type="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className={inputCls} placeholder="+49 7905 …" />
                  </div>
                  <div>
                    <label className="block text-[#D7D0C5]/45 text-[10px] tracking-[0.28em] uppercase font-body mb-2">{c.guests}</label>
                    <input type="number" min="1" value={form.guest_count}
                      onChange={e => setForm(f => ({ ...f, guest_count: e.target.value }))}
                      className={inputCls} placeholder="z.B. 60" />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-[#D7D0C5]/45 text-[10px] tracking-[0.28em] uppercase font-body mb-2">{c.date}</label>
                  <input type="date" value={form.preferred_date}
                    onChange={e => setForm(f => ({ ...f, preferred_date: e.target.value }))}
                    className={inputCls}
                    style={{ colorScheme: 'dark' }} />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[#D7D0C5]/45 text-[10px] tracking-[0.28em] uppercase font-body mb-2">{c.message} *</label>
                  <textarea rows={5} required placeholder={c.msg_ph} value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className={`${inputCls} resize-none leading-relaxed`} />
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button type="submit" disabled={submitting}
                    className="group w-full py-4.5 bg-gradient-to-r from-[#C9A96E] to-[#B8924A] hover:from-[#D4B87C] hover:to-[#C9A96E] text-[#1C1714] rounded-xl font-body font-bold text-xs tracking-[0.18em] uppercase disabled:opacity-50 flex items-center justify-center gap-2.5 shadow-[0_8px_28px_rgba(201,169,110,0.3)] hover:shadow-[0_12px_36px_rgba(201,169,110,0.45)] transition-all duration-300 hover:-translate-y-0.5"
                    style={{ paddingTop: '1.1rem', paddingBottom: '1.1rem' }}>
                    {submitting
                      ? <div className="w-4 h-4 border-2 border-[#1C1714]/30 border-t-[#1C1714] rounded-full animate-spin" />
                      : <>{c.submit} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></>
                    }
                  </button>
                  <p className="text-center text-[#D7D0C5]/30 text-xs font-body mt-4 tracking-wide">
                    {c.reply_note}
                  </p>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* ── PHASE 6: CONTACT BAR ── */}
      <section className="py-14 sm:py-16 px-5 bg-[#1D1410] border-t border-[#C9A96E]/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#C9A96E] text-[10px] tracking-[0.45em] uppercase font-body mb-4">
            {c.contact_label}
          </p>
          <div className="w-10 h-px bg-[#C9A96E]/25 mx-auto mb-7" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`tel:${s.phone}`}
              className="group flex items-center gap-3 px-7 py-4 border border-[#C9A96E]/20 hover:border-[#C9A96E]/55 bg-[#C9A96E]/5 hover:bg-[#C9A96E]/10 text-[#D7D0C5]/65 hover:text-[#C9A96E] rounded-full text-sm font-body font-medium transition-all duration-300 w-full sm:w-auto justify-center">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>{s.phone}</span>
            </a>
            <a href={`mailto:${s.email_info}`}
              className="group flex items-center gap-3 px-7 py-4 border border-[#C9A96E]/20 hover:border-[#C9A96E]/55 bg-[#C9A96E]/5 hover:bg-[#C9A96E]/10 text-[#D7D0C5]/65 hover:text-[#C9A96E] rounded-full text-sm font-body font-medium transition-all duration-300 w-full sm:w-auto justify-center">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>{s.email_info}</span>
            </a>
          </div>
          <p className="text-[#D7D0C5]/25 text-xs font-body mt-7 tracking-wider">
            Krone Langenburg by Ammesso · Hauptstraße 24 · 74595 Langenburg
          </p>
        </div>
      </section>

    </div>
  );
}