import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import HeroBookingBar from '@/components/home/HeroBookingBar';
import { ChevronLeft, ChevronRight, UtensilsCrossed, BedDouble, Heart, Sparkles, Star, MapPin } from 'lucide-react';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=80',
    de: { title: 'Willkommen im Krone Langenburg', sub: 'Gastlichkeit seit Generationen' },
    en: { title: 'Welcome to Krone Langenburg', sub: 'Hospitality for generations' },
    it: { title: 'Benvenuti al Krone Langenburg', sub: 'Ospitalità da generazioni' },
  },
  {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=80',
    de: { title: 'Kulinarische Exzellenz', sub: 'Regionale Küche auf höchstem Niveau' },
    en: { title: 'Culinary Excellence', sub: 'Regional cuisine at its finest' },
    it: { title: 'Eccellenza Culinaria', sub: 'Cucina regionale di alto livello' },
  },
  {
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1800&q=80',
    de: { title: 'Elegante Zimmer & Suiten', sub: 'Ihr Zuhause in Hohenlohe' },
    en: { title: 'Elegant Rooms & Suites', sub: 'Your home in Hohenlohe' },
    it: { title: 'Camere & Suite Eleganti', sub: 'La vostra casa in Hohenlohe' },
  },
  {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=80',
    de: { title: 'Unvergessliche Feiern', sub: 'Hochzeiten, Events & Feste' },
    en: { title: 'Unforgettable Celebrations', sub: 'Weddings, events & parties' },
    it: { title: 'Celebrazioni Indimenticabili', sub: 'Matrimoni, eventi e feste' },
  },
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80',
    de: { title: 'Langenburg entdecken', sub: 'Historische Stadt im Herzen Hohenlohes' },
    en: { title: 'Discover Langenburg', sub: 'Historic town in the heart of Hohenlohe' },
    it: { title: 'Scopri Langenburg', sub: 'Città storica nel cuore di Hohenlohe' },
  },
];

const HIGHLIGHTS = [
  {
    icon: BedDouble,
    de: { title: 'Zimmer & Suiten', desc: 'Komfortabel eingerichtete Zimmer mit Blick auf das historische Langenburg.' },
    en: { title: 'Rooms & Suites', desc: 'Comfortably furnished rooms with views of historic Langenburg.' },
    it: { title: 'Camere & Suite', desc: 'Camere confortevolmente arredate con vista su Langenburg storica.' },
    to: '/rooms',
  },
  {
    icon: UtensilsCrossed,
    de: { title: 'Restaurant', desc: 'Regionale Küche mit saisonalen Zutaten — Di bis Sa zum Mittag- und Abendessen.' },
    en: { title: 'Restaurant', desc: 'Regional cuisine with seasonal ingredients — Tue to Sat for lunch and dinner.' },
    it: { title: 'Ristorante', desc: 'Cucina regionale con ingredienti di stagione — Mar a Sab per pranzo e cena.' },
    to: '/restaurant',
  },
  {
    icon: Heart,
    de: { title: 'Events & Hochzeiten', desc: 'Ihr besonderer Moment verdient den perfekten Rahmen.' },
    en: { title: 'Events & Weddings', desc: 'Your special moment deserves the perfect setting.' },
    it: { title: 'Events & Matrimoni', desc: 'Il vostro momento speciale merita la cornice perfetta.' },
    to: '/weddings',
  },
  {
    icon: Sparkles,
    de: { title: 'Angebote & Pakete', desc: 'Exklusive Arrangements für einen unvergesslichen Aufenthalt.' },
    en: { title: 'Offers & Packages', desc: 'Exclusive arrangements for an unforgettable stay.' },
    it: { title: 'Offerte & Pacchetti', desc: 'Arrangiamenti esclusivi per un soggiorno indimenticabile.' },
    to: '/offers',
  },
];

const MEMBER_BENEFITS = [
  { icon: '🔑', de: 'Exklusive Mitgliederpreise', en: 'Exclusive member rates', it: 'Tariffe esclusive per i membri' },
  { icon: '⚡', de: 'Schnelles Online-Einchecken', en: 'Fast online check-in', it: 'Check-in online veloce' },
  { icon: '💌', de: 'Persönliche Betreuung', en: 'Personal concierge', it: 'Servizio concierge personale' },
  { icon: '🎁', de: 'Sonderangebote & Geschenke', en: 'Special offers & gifts', it: 'Offerte speciali e regali' },
  { icon: '📋', de: 'Reservierungen verwalten', en: 'Manage reservations', it: 'Gestisci prenotazioni' },
];

export default function Home() {
  const { lang } = useLang();
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((idx) => {
    setFading(true);
    setTimeout(() => {
      setSlide(idx);
      setFading(false);
    }, 300);
  }, []);

  const prev = () => goTo((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = useCallback(() => goTo((slide + 1) % HERO_SLIDES.length), [slide, goTo]);

  useEffect(() => {
    const t = setTimeout(next, 6000);
    return () => clearTimeout(t);
  }, [next]);

  const current = HERO_SLIDES[slide];
  const text = current[lang] || current.de;

  return (
    <div className="bg-ivory">
      {/* ── HERO ── */}
      <section className="relative h-[92vh] min-h-[560px] max-h-[900px] overflow-hidden">
        {/* Background image */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: `url(${current.image}) center/cover no-repeat` }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        {/* Arrow controls */}
        <button onClick={prev}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/20">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={next}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/20">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot nav */}
        <div className="absolute bottom-44 sm:bottom-48 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all ${i === slide ? 'w-6 h-2 bg-[#C9A96E]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>

        {/* Hero text */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center text-center px-5 pb-32 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body mb-3 sm:mb-4">
            Krone Langenburg · by Ammesso
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-3 sm:mb-4 leading-tight max-w-3xl">
            {text.title}
          </h1>
          <p className="font-body text-white/70 text-base sm:text-lg max-w-xl mb-6">
            {text.sub}
          </p>
          <div className="flex gap-3">
            <Link to="/reserve"
              className="px-6 py-3 border border-white/50 text-white rounded-full text-xs tracking-widest uppercase font-body hover:bg-white/10 transition-all">
              {lang === 'de' ? 'Tisch reservieren' : lang === 'en' ? 'Reserve Table' : 'Prenota tavolo'}
            </Link>
          </div>
        </div>

        {/* Floating booking bar */}
        <div className="absolute bottom-6 left-0 right-0 z-10 px-4 sm:px-8">
          <HeroBookingBar lang={lang} />
        </div>
      </section>

      {/* ── HIGHLIGHTS ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">
            {lang === 'de' ? 'Entdecken Sie uns' : lang === 'en' ? 'Discover Us' : 'Scopriteci'}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-charcoal">
            {lang === 'de' ? 'Alles unter einem Dach' : lang === 'en' ? 'Everything under one roof' : 'Tutto sotto un tetto'}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {HIGHLIGHTS.map((h, i) => {
            const t = h[lang] || h.de;
            return (
              <Link key={i} to={h.to}
                className="group surface-card rounded-2xl p-6 hover-lift text-center transition-all">
                <div className="w-12 h-12 rounded-full bg-gold-pale flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/10 transition-colors">
                  <h.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-display text-xl font-light text-charcoal mb-2">{t.title}</h3>
                <p className="text-sm font-body text-stone-dark leading-relaxed">{t.desc}</p>
                <span className="inline-block mt-4 text-gold text-[10px] tracking-widest uppercase font-body font-semibold group-hover:translate-x-1 transition-transform">
                  {lang === 'de' ? 'Mehr erfahren →' : lang === 'en' ? 'Learn more →' : 'Scopri →'}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── ABOUT STRIP ── */}
      <section className="bg-charcoal py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-3">
              {lang === 'de' ? 'Unsere Geschichte' : lang === 'en' ? 'Our Story' : 'La nostra storia'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-5 leading-snug">
              {lang === 'de' ? 'Tradition & moderne Gastlichkeit' : lang === 'en' ? 'Tradition & modern hospitality' : 'Tradizione & ospitalità moderna'}
            </h2>
            <p className="text-white/60 text-sm font-body leading-relaxed mb-6">
              {lang === 'de'
                ? 'Das Krone Langenburg by Ammesso verbindet jahrhundertealte Gastlichkeit mit modernem Komfort. Im Herzen der historischen Altstadt gelegen, bieten wir unseren Gästen ein unvergessliches Erlebnis.'
                : lang === 'en'
                ? 'Krone Langenburg by Ammesso combines centuries-old hospitality with modern comfort. Located in the heart of the historic old town, we offer our guests an unforgettable experience.'
                : 'Krone Langenburg by Ammesso unisce l\'ospitalità secolare con il comfort moderno. Situato nel cuore del centro storico, offriamo ai nostri ospiti un\'esperienza indimenticabile.'
              }
            </p>
            <Link to="/story"
              className="inline-flex items-center gap-2 text-[#C9A96E] text-xs tracking-widest uppercase font-body font-semibold hover:text-white transition-colors">
              {lang === 'de' ? 'Unsere Geschichte' : lang === 'en' ? 'Our Story' : 'La nostra storia'} →
            </Link>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"
              alt="Krone Langenburg"
              className="rounded-2xl w-full h-64 sm:h-80 object-cover"
            />
            <div className="absolute -bottom-4 -left-4 bg-[#C9A96E] text-[#1C1714] rounded-xl px-4 py-3 text-center shadow-lg">
              <p className="font-display text-2xl font-semibold">★★★★</p>
              <p className="text-[10px] uppercase tracking-widest font-body font-semibold">
                {lang === 'de' ? 'Superior Hotel' : 'Superior Hotel'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GUEST ACCOUNT MEMBER BENEFITS ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-stone">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">Krone Gäste-Konto</p>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-charcoal mb-3">
            {lang === 'de' ? 'Werden Sie Mitglied' : lang === 'en' ? 'Become a Member' : 'Diventa membro'}
          </h2>
          <p className="text-stone-dark text-sm font-body max-w-xl mx-auto mb-10">
            {lang === 'de'
              ? 'Registrieren Sie sich kostenlos und genießen Sie exklusive Vorteile bei jedem Besuch.'
              : lang === 'en'
              ? 'Register for free and enjoy exclusive benefits with every visit.'
              : 'Registratevi gratuitamente e godete di vantaggi esclusivi ad ogni visita.'
            }
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
            {MEMBER_BENEFITS.map((b, i) => (
              <div key={i} className="surface-card rounded-2xl p-4 text-center">
                <span className="text-2xl block mb-2">{b.icon}</span>
                <p className="text-xs font-body text-charcoal font-medium leading-tight">
                  {b[lang] || b.de}
                </p>
              </div>
            ))}
          </div>
          <Link to="/account"
            className="inline-flex items-center gap-2 px-8 py-4 bg-charcoal hover:bg-espresso text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all">
            {lang === 'de' ? 'Jetzt registrieren' : lang === 'en' ? 'Register now' : 'Registrati ora'} →
          </Link>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section className="py-14 sm:py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-2">
            {lang === 'de' ? 'Anfahrt' : lang === 'en' ? 'Location' : 'Come raggiungerci'}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-light text-charcoal">Langenburg, Baden-Württemberg</h2>
        </div>
        <div className="rounded-2xl overflow-hidden border border-[#EDE6D8] h-72 sm:h-96">
          <iframe
            width="100%" height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyA-OPJc_4CvKv_S8YToDdmlS9hE7f1R1AU&q=${encodeURIComponent('Hauptstraße 24, 74595 Langenburg, Germany')}`}
            title="Krone Langenburg Location"
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm font-body text-stone-dark">
          <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" /> Hauptstraße 24, 74595 Langenburg</span>
          <span>·</span>
          <a href="tel:+4979054177" className="hover:text-gold transition-colors">+49 7905 41770</a>
          <span>·</span>
          <a href="mailto:info@krone-ammesso.de" className="hover:text-gold transition-colors">info@krone-ammesso.de</a>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-gold text-center">
        <p className="text-white/70 text-[10px] tracking-[0.4em] uppercase font-body mb-3">Krone Langenburg by Ammesso</p>
        <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-5">
          {lang === 'de' ? 'Wir freuen uns auf Sie' : lang === 'en' ? 'We look forward to seeing you' : 'Non vediamo l\'ora di vedervi'}
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/booking"
            className="px-8 py-4 bg-white text-charcoal rounded-full text-xs tracking-widest uppercase font-body font-semibold hover:bg-stone transition-all">
            {lang === 'de' ? 'Zimmer buchen' : lang === 'en' ? 'Book a Room' : 'Prenota una camera'}
          </Link>
          <Link to="/reserve"
            className="px-8 py-4 border-2 border-white/50 text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold hover:bg-white/10 transition-all">
            {lang === 'de' ? 'Tisch reservieren' : lang === 'en' ? 'Reserve a Table' : 'Prenota un tavolo'}
          </Link>
        </div>
      </section>
    </div>
  );
}