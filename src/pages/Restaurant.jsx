import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { Clock, UtensilsCrossed, Phone, Mail, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';

const HERO_IMG = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/0ba635de8_Krone_innen.png';

export default function Restaurant() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;

  const T = {
    de: {
      eyebrow: 'Restaurant & Bar',
      title: 'Mediterrane Küche mit Herz',
      subtitle: 'Frische Zutaten, handgemachte Pasta und echte Gastfreundschaft — täglich frisch für Sie zubereitet.',
      reserve: 'Tisch reservieren',
      menu: 'Speisekarte',
      hours_title: 'Öffnungszeiten',
      open: 'Geöffnet',
      closed: 'Geschlossen',
      events: 'Events & Hochzeiten',
      mon: 'Montag',
      mon_hours: 'Ruhetag',
      tue_fri: 'Dienstag – Freitag',
      sat: 'Samstag',
      sun: 'Sonntag',
      lunch: 'Mittagessen',
      dinner: 'Abendessen',
      all_day: 'Durchgehend',
      capacity: '120 Sitzplätze',
      terrace: 'Außenterrasse im Sommer',
      groups: 'Gruppen ab 10 Personen bitte direkt per E-Mail anfragen.',
      phone_label: 'Rufen Sie uns an',
      email_label: 'Schreiben Sie uns',
      chef_title: 'Mediterrane Leidenschaft',
      chef_bio: 'Frisch zubereitete Speisen mit besten Zutaten Hohenlohes. Jedes Gericht erzählt eine Geschichte — handwerklich perfektioniert und mit Herz serviert.',
      story: 'Unsere Geschichte',
      diets: 'Vegetarisch, vegan, Allergien — wir passen uns gerne an.',
    },
    en: {
      eyebrow: 'Restaurant & Bar',
      title: 'Mediterranean Cuisine with Heart',
      subtitle: 'Fresh ingredients, handmade pasta and genuine hospitality — prepared fresh for you daily.',
      reserve: 'Reserve a Table',
      menu: 'View Menu',
      hours_title: 'Opening Hours',
      open: 'Open',
      closed: 'Closed',
      events: 'Events & Weddings',
      mon: 'Monday',
      mon_hours: 'Closed',
      tue_fri: 'Tuesday – Friday',
      sat: 'Saturday',
      sun: 'Sunday',
      lunch: 'Lunch',
      dinner: 'Dinner',
      all_day: 'All day',
      capacity: '120 seats',
      terrace: 'Terrace in summer',
      groups: 'Groups of 10+ please enquire directly by email.',
      phone_label: 'Call us',
      email_label: 'Email us',
      chef_title: 'Mediterranean Passion',
      chef_bio: 'Freshly prepared dishes with the finest ingredients of Hohenlohe. Every course tells a story — crafted with precision and served with heart.',
      story: 'Our Story',
      diets: 'Vegetarian, vegan, allergies — we happily accommodate.',
    },
    it: {
      eyebrow: 'Ristorante & Bar',
      title: 'Cucina Mediterranea con Cuore',
      subtitle: 'Ingredienti freschi, pasta fatta a mano e vera ospitalità — preparati freschi per voi ogni giorno.',
      reserve: 'Prenota un tavolo',
      menu: 'Vedi il menu',
      hours_title: 'Orari di apertura',
      open: 'Aperto',
      closed: 'Chiuso',
      events: 'Eventi & Matrimoni',
      mon: 'Lunedì',
      mon_hours: 'Chiuso',
      tue_fri: 'Martedì – Venerdì',
      sat: 'Sabato',
      sun: 'Domenica',
      lunch: 'Pranzo',
      dinner: 'Cena',
      all_day: 'Tutto il giorno',
      capacity: '120 posti',
      terrace: 'Terrazza in estate',
      groups: 'Gruppi di 10+ persone: scrivere direttamente per email.',
      phone_label: 'Chiamaci',
      email_label: 'Scrivici',
      chef_title: 'Passione Mediterranea',
      chef_bio: 'Piatti freschi preparati con i migliori ingredienti di Hohenlohe. Ogni portata racconta una storia — realizzata con precisione e servita con il cuore.',
      story: 'La nostra storia',
      diets: 'Vegetariano, vegano, allergie — ci adattiamo volentieri.',
    },
  };

  const t = T[lang] || T.de;

  // Live status
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  let isOpen = false;
  if (day === 0) isOpen = hour >= 12 && hour < 20;
  else if (day >= 2 && day <= 6) isOpen = (hour >= 12 && hour < 14.5) || (hour >= 17.5 && hour < 22);

  const inputLabelCls = "text-[10px] tracking-[0.35em] uppercase font-body font-semibold mb-2";
  const cardCls = "bg-white border border-[#EDE6D8] rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(28,23,20,0.06)]";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1714] pb-24 lg:pb-0">

      {/* ── HERO ── */}
      <div className="relative page-top overflow-hidden" style={{ minHeight: 'clamp(450px, 60vh, 650px)' }}>
        <img
          src={HERO_IMG}
          alt="Restaurant Krone Langenburg by Ammesso"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 45%' }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/75" />
        
        <div className="absolute inset-0 flex items-center justify-center text-center px-5">
          <div className="max-w-3xl relative z-10">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body mb-5">{t.eyebrow}</p>
            <h1 className="font-display font-light text-white mb-5"
                style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', lineHeight: '1.15', textShadow: '0 2px 24px rgba(0,0,0,0.85)' }}>
              {t.title}
            </h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/70 to-transparent mx-auto mb-5" />
            <p className="text-white/95 font-body text-base sm:text-lg leading-relaxed mb-9 max-w-2xl mx-auto" 
               style={{ textShadow: '0 2px 16px rgba(0,0,0,0.85)', fontWeight: '300' }}>
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/reserve" className="btn-gold w-full sm:w-auto">
                <UtensilsCrossed className="w-4 h-4" /> {t.reserve}
              </Link>
              <Link to="/menu" className="btn-outline-dark w-full sm:w-auto">
                {t.menu} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── OPENING HOURS + STATUS ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-5 -mt-10 relative z-10">
        <div className={`${cardCls} mb-12`}>
          {/* Header with Status */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#EDE6D8]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F2E8D0] border border-[#C9A96E]/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#8B6914]" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-light text-[#1C1714]">{t.hours_title}</h2>
                <p className="text-[#8A7A6A] text-xs font-body mt-0.5">
                  {lang === 'de' ? 'Ihr Besuch bei uns' : lang === 'en' ? 'Your visit with us' : 'La tua visita da noi'}
                </p>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border-2 ${
              isOpen 
                ? 'border-emerald-500/30 bg-emerald-50' 
                : 'border-red-500/30 bg-red-50'
            }`}>
              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-sm font-body font-bold tracking-wide ${isOpen ? 'text-emerald-700' : 'text-red-700'}`}>
                {isOpen ? t.open : t.closed}
              </span>
            </div>
          </div>

          {/* Hours Grid - Professional Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Monday - Closed */}
            <div className="bg-[#F7F3EC] border border-[#EDE6D8] rounded-xl p-5 text-center">
              <p className="text-[#8B6914] text-[10px] tracking-[0.35em] uppercase font-body font-semibold mb-2">{t.mon}</p>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent mx-auto mb-3" />
              <p className="text-[#8A7A6A] text-sm font-body italic">{t.mon_hours}</p>
            </div>

            {/* Tue-Fri */}
            <div className="bg-white border-2 border-[#C9A96E]/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C9A96E] to-[#8B6914]" />
              <p className="text-[#8B6914] text-[10px] tracking-[0.35em] uppercase font-body font-semibold mb-3">{t.tue_fri}</p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />
                  <span className="text-[#1C1714] text-sm font-semibold">12:00 – 14:30</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />
                  <span className="text-[#1C1714] text-sm font-semibold">17:30 – 22:00</span>
                </div>
              </div>
            </div>

            {/* Weekend */}
            <div className="space-y-3">
              <div className="bg-white border border-[#EDE6D8] rounded-xl p-4">
                <p className="text-[#8B6914] text-[9px] tracking-[0.35em] uppercase font-body font-semibold mb-2">{t.sat}</p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                  <span className="text-[#1C1714] text-sm font-semibold">17:30 – 22:00</span>
                </div>
              </div>
              <div className="bg-white border border-[#EDE6D8] rounded-xl p-4">
                <p className="text-[#8B6914] text-[9px] tracking-[0.35em] uppercase font-body font-semibold mb-2">{t.sun}</p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                  <span className="text-[#1C1714] text-sm font-semibold">12:00 – 20:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#EDE6D8]">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#8B6914]" />
              <span className="text-[#4A3F35] text-sm font-body">{t.capacity}</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#8B6914]" />
              <span className="text-[#4A3F35] text-sm font-body">{t.terrace}</span>
            </div>
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="w-5 h-5 text-[#8B6914]" />
              <span className="text-[#4A3F35] text-sm font-body">{t.diets}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHEF SECTION ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-5 mb-12">
        <div className={`${cardCls}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <div className="relative rounded-xl overflow-hidden aspect-[3/4] shadow-lg">
                <img
                  src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/15c4ce145_kueche-innen.jpg"
                  alt="Professionelle Küche Krone Langenburg"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body mb-3">{t.chef_title}</p>
              <h2 className="font-display text-2xl font-light text-[#1C1714] mb-4">
                {lang === 'de' ? 'Unsere Küche' : lang === 'en' ? 'Our Kitchen' : 'La Nostra Cucina'}
              </h2>
              <p className="text-[#4A3F35] text-sm font-body leading-relaxed mb-6">{t.chef_bio}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/menu" className="inline-flex items-center gap-2 text-[#8B6914] hover:text-[#C9A96E] text-xs font-body font-semibold tracking-widest uppercase transition-all">
                  {t.menu} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTACT CARDS ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-5 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`${cardCls} p-6`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#F2E8D0] border border-[#C9A96E]/30 flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#8B6914]" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase font-body font-semibold text-[#8B6914]">{t.phone_label}</p>
                <a href={`tel:${s.phone}`} className="text-lg font-display font-light text-[#1C1714] hover:text-[#8B6914] transition-colors">
                  {s.phone}
                </a>
              </div>
            </div>
            <p className="text-[#4A3F35]/60 text-xs font-body leading-relaxed">
              {lang === 'de' ? 'Mo–Sa: 12–14:30 & 17:30–22 Uhr · So: 12–20 Uhr' : lang === 'en' ? 'Mon–Sat: 12–14:30 & 17:30–22 · Sun: 12–20' : 'Lun–Sab: 12–14:30 & 17:30–22 · Dom: 12–20'}
            </p>
          </div>

          <div className={`${cardCls} p-6`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#F2E8D0] border border-[#C9A96E]/30 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#8B6914]" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase font-body font-semibold text-[#8B6914]">{t.email_label}</p>
                <a href={`mailto:${s.email_info}`} className="text-lg font-display font-light text-[#1C1714] hover:text-[#8B6914] transition-colors">
                  {s.email_info}
                </a>
              </div>
            </div>
            <p className="text-[#4A3F35]/60 text-xs font-body leading-relaxed">{t.groups}</p>
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-5 mb-12 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-light text-[#1C1714] mb-3">
          {lang === 'de' ? 'Wir freuen uns auf Sie.' : lang === 'en' ? 'We look forward to seeing you.' : 'Non vediamo l\'ora di vedervi.'}
        </h2>
        <p className="text-[#4A3F35]/60 text-sm font-body mb-8">
          {lang === 'de'
            ? 'Reservieren Sie Ihren Tisch online oder rufen Sie uns an.'
            : lang === 'en'
            ? 'Book your table online or give us a call.'
            : 'Prenota il tuo tavolo online o chiamaci.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
          <Link to="/reserve" className="btn-gold w-full sm:w-auto">
            <UtensilsCrossed className="w-4 h-4" /> {t.reserve}
          </Link>
          <Link to="/menu" className="btn-ghost-gold w-full sm:w-auto">
            {t.menu}
          </Link>
          <Link to="/weddings" className="btn-ghost-gold w-full sm:w-auto">
            {t.events}
          </Link>
        </div>
      </div>

    </div>
  );
}