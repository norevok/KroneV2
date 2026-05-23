import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, UtensilsCrossed, BedDouble, Star, MapPin, Gift, Users, Wifi, Coffee, Check, ArrowRight, Calendar } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import HeroBookingBar from '@/components/home/HeroBookingBar';
import { base44 } from '@/api/base44Client';

const SLIDES = [
  {
    url: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg',
    de: { title: 'Ankommen. Genießen. Bleiben.', sub: 'Ihr Boutique-Hotel im Herzen von Langenburg.' },
    en: { title: 'Arrive. Enjoy. Stay.', sub: 'Your boutique hotel in the heart of Langenburg.' },
    it: { title: 'Arrivare. Gustare. Restare.', sub: 'Il vostro hotel boutique nel cuore di Langenburg.' },
  },
  {
    url: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/930ad0179_krone-kingsuite-1-zimmer-bett-tv-01.jpg',
    de: { title: 'Zimmer mit Ruhe und Charakter', sub: 'Entdecken Sie unsere 13 Zimmer für Geschäftsreisen, Wochenenden und besondere Anlässe.' },
    en: { title: 'Rooms with Peace and Character', sub: 'Discover our 13 rooms for business trips, weekends and special occasions.' },
    it: { title: 'Camere con carattere e tranquillità', sub: 'Scoprite le nostre 13 camere per viaggi di lavoro, weekend e occasioni speciali.' },
  },
  {
    url: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8c381b8e8_krone-kingsuite-2-zimmer-favorit-01.jpg',
    de: { title: 'Direkt buchen. Einfach ankommen.', sub: 'Prüfen Sie Verfügbarkeit und buchen Sie sicher über unsere Buchungsseite.' },
    en: { title: 'Book Direct. Arrive Easy.', sub: 'Check availability and book securely via our booking page.' },
    it: { title: 'Prenota direttamente. Arriva facilmente.', sub: 'Verifica disponibilità e prenota in sicurezza tramite la nostra pagina di prenotazione.' },
  },
  {
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=80',
    de: { title: 'Mediterrane Küche mit Herz', sub: 'Regionale Zutaten, italienische Tradition — alles unter einem Dach.' },
    en: { title: 'Mediterranean Cuisine with Heart', sub: 'Regional ingredients, Italian tradition — all under one roof.' },
    it: { title: 'Cucina mediterranea con cuore', sub: 'Ingredienti regionali, tradizione italiana — tutto sotto un tetto.' },
  },
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=80',
    de: { title: 'Events & Feiern in Langenburg', sub: 'Hochzeiten, Firmenevents und Familienfeiern — wir gestalten Ihren besonderen Moment.' },
    en: { title: 'Events & Celebrations in Langenburg', sub: 'Weddings, corporate events and family celebrations — we create your special moment.' },
    it: { title: 'Eventi e celebrazioni a Langenburg', sub: 'Matrimoni, eventi aziendali e feste di famiglia — creiamo il vostro momento speciale.' },
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80',
    de: { title: 'Schloss Langenburg & Hohenlohe', sub: 'Idyllisch gelegen — Ausflüge, Natur und Geschichte direkt vor der Tür.' },
    en: { title: 'Langenburg Castle & Hohenlohe', sub: 'Idyllically located — excursions, nature and history right at your doorstep.' },
    it: { title: 'Castello di Langenburg e Hohenlohe', sub: 'Situato idillicamente — escursioni, natura e storia a due passi.' },
  },
];

const BENEFITS = [
  { icon: BedDouble, de: 'Direktbuchung', en: 'Direct Booking', it: 'Prenotazione diretta', desc_de: 'Bester Preis garantiert', desc_en: 'Best price guaranteed', desc_it: 'Miglior prezzo garantito' },
  { icon: Wifi, de: 'Gratis WLAN', en: 'Free Wi-Fi', it: 'Wi-Fi gratuito', desc_de: 'In allen Zimmern & Bereichen', desc_en: 'In all rooms & areas', desc_it: 'In tutte le camere e aree' },
  { icon: Gift, de: 'Persönliche Angebote', en: 'Personal Offers', it: 'Offerte personali', desc_de: 'Exklusiv für Stammgäste', desc_en: 'Exclusive for returning guests', desc_it: 'Esclusivo per ospiti abituali' },
  { icon: Calendar, de: 'Reservierungen im Blick', en: 'Reservations Overview', it: 'Prenotazioni a portata di mano', desc_de: 'Alles im Gäste-Konto', desc_en: 'All in your guest account', desc_it: 'Tutto nel vostro account ospiti' },
  { icon: Users, de: 'Persönlicher Service', en: 'Personal Service', it: 'Servizio personale', desc_de: 'Direkt mit unserem Team', desc_en: 'Directly with our team', desc_it: 'Direttamente con il nostro team' },
];

export default function Home() {
  const { lang } = useLang();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(a => setIsLoggedIn(a)).catch(() => {});
  }, []);

  function startTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % SLIDES.length);
    }, 5500);
  }

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  function goTo(idx) {
    if (isAnimating) return;
    setCurrent(idx);
    startTimer();
  }
  function prev() { goTo((current - 1 + SLIDES.length) % SLIDES.length); }
  function next() { goTo((current + 1) % SLIDES.length); }

  const slide = SLIDES[current];
  const slideText = slide[lang] || slide.de;

  const features = [
    {
      icon: BedDouble,
      to: '/rooms',
      de: 'Zimmer & Suiten', en: 'Rooms & Suites', it: 'Camere & Suite',
      desc_de: '13 stilvolle Zimmer für Geschäftsreisende, Paare und besondere Anlässe',
      desc_en: '13 stylish rooms for business travellers, couples and special occasions',
      desc_it: '13 camere eleganti per viaggiatori d\'affari, coppie e occasioni speciali',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/804199c28_krone-kingsuite-1-zimmer-uebersicht-01.jpg',
    },
    {
      icon: UtensilsCrossed,
      to: '/restaurant',
      de: 'Restaurant + Bar', en: 'Restaurant + Bar', it: 'Ristorante + Bar',
      desc_de: 'Mediterrane Küche mit regionalen Zutaten — Di–Sa zu Mittag & Abend, So ganztags',
      desc_en: 'Mediterranean cuisine with regional ingredients — Tue–Sat lunch & dinner, Sun all day',
      desc_it: 'Cucina mediterranea con ingredienti regionali — Mar–Sab pranzo & cena, Dom tutto il giorno',
      img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    },
    {
      icon: Star,
      to: '/weddings',
      de: 'Events & Feiern', en: 'Events & Celebrations', it: 'Events & Feste',
      desc_de: 'Hochzeiten, Firmenfeiern und private Feste — maßgeschneidert und unvergesslich',
      desc_en: 'Weddings, corporate events and private celebrations — tailored and unforgettable',
      desc_it: 'Matrimoni, eventi aziendali e feste private — su misura e indimenticabili',
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    },
  ];

  const t = {
    de: {
      discover: 'Entdecken Sie',
      experience: 'Das Krone Erlebnis',
      learn_more: 'Mehr erfahren →',
      benefits_eyebrow: 'Krone Gäste-Konto',
      benefits_title: 'Ihre Vorteile als Mitglied',
      benefits_sub: 'Erstellen Sie ein kostenloses Konto und genießen Sie exklusive Vorteile bei jedem Aufenthalt.',
      register: 'Kostenlos registrieren',
      already: 'Bereits Mitglied? Einloggen',
      location_eyebrow: 'Mitten in Langenburg',
      location_title: 'Im Herzen des Hohenloher Landes',
      location_text: 'Unser Hotel liegt direkt im historischen Zentrum von Langenburg — nur wenige Schritte vom Schloss Langenburg und dem malerischen Jagsttal entfernt. Der perfekte Ausgangspunkt für Ausflüge in die Region.',
      discover_btn: 'Region entdecken',
      contact_btn: 'Kontakt aufnehmen',
      restaurant_reserve: 'Tisch reservieren',
      rooms_book: 'Zimmer buchen',
    },
    en: {
      discover: 'Discover',
      experience: 'The Krone Experience',
      learn_more: 'Learn more →',
      benefits_eyebrow: 'Krone Guest Account',
      benefits_title: 'Your Membership Benefits',
      benefits_sub: 'Create a free account and enjoy exclusive benefits with every stay.',
      register: 'Register for free',
      already: 'Already a member? Sign in',
      location_eyebrow: 'In the Heart of Langenburg',
      location_title: 'At the Centre of the Hohenlohe Region',
      location_text: 'Our hotel is located in the historic centre of Langenburg — just steps from Langenburg Castle and the picturesque Jagst Valley. The perfect base for exploring the region.',
      discover_btn: 'Discover the Region',
      contact_btn: 'Get in Touch',
      restaurant_reserve: 'Reserve a Table',
      rooms_book: 'Book a Room',
    },
    it: {
      discover: 'Scopri',
      experience: "L'esperienza Krone",
      learn_more: 'Scopri di più →',
      benefits_eyebrow: 'Account Ospiti Krone',
      benefits_title: 'I vantaggi per i membri',
      benefits_sub: 'Crea un account gratuito e goditi vantaggi esclusivi ad ogni soggiorno.',
      register: 'Registrati gratuitamente',
      already: 'Già membro? Accedi',
      location_eyebrow: 'Nel cuore di Langenburg',
      location_title: 'Al centro della regione di Hohenlohe',
      location_text: 'Il nostro hotel si trova nel centro storico di Langenburg — a pochi passi dal castello e dalla pittoresca valle del Jagst. La base perfetta per esplorare la regione.',
      discover_btn: 'Scopri la regione',
      contact_btn: 'Contattaci',
      restaurant_reserve: 'Prenota un tavolo',
      rooms_book: 'Prenota una camera',
    },
  };
  const c = t[lang] || t.de;

  return (
    <div className="min-h-screen bg-[#FAF7F2]">

      {/* ── HERO ── */}
      <div className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
        {/* Slides */}
        {SLIDES.map((s, i) => (
          <div key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
            <img
              src={s.url}
              alt={s.de.title}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
          </div>
        ))}

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pb-44 sm:pb-36 lg:pb-32">
          <p className="text-[#C9A96E] text-[9px] sm:text-[10px] tracking-[0.5em] uppercase font-body mb-4 animate-fade-in">
            Krone Langenburg · by Ammesso
          </p>
          <h1 key={`${current}-title`}
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4 leading-tight max-w-4xl animate-fade-up">
            {slideText.title}
          </h1>
          <p className="text-white/70 font-body text-sm sm:text-lg max-w-xl animate-fade-in leading-relaxed">
            {slideText.sub}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link to="/booking"
              className="px-7 py-3.5 bg-[#1C1714] hover:bg-[#2A2118] text-white font-body font-semibold text-xs tracking-widest uppercase rounded-full transition-all shadow-lg">
              {c.rooms_book}
            </Link>
            <Link to="/reserve"
              className="px-7 py-3.5 bg-white/15 hover:bg-white/25 border border-white/40 text-white font-body font-semibold text-xs tracking-widest uppercase rounded-full transition-all backdrop-blur-sm">
              {c.restaurant_reserve}
            </Link>
          </div>
        </div>

        {/* Arrow controls */}
        <button onClick={prev}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 border border-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm z-10">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={next}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 border border-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm z-10">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot nav */}
        <div className="absolute bottom-40 sm:bottom-32 lg:bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all ${i === current ? 'w-6 h-1.5 bg-[#C9A96E]' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>

        {/* Floating booking bar */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6 sm:pb-8 z-10">
          <HeroBookingBar lang={lang} />
        </div>
      </div>

      {/* ── BENEFIT STRIP ── */}
      <div className="bg-[#1C1714] py-10 sm:py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-2">{c.benefits_eyebrow}</p>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-white">{c.benefits_title}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className="w-11 h-11 bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <div>
                  <p className="text-white font-body text-sm font-semibold mb-0.5">
                    {lang === 'de' ? b.de : lang === 'en' ? b.en : b.it}
                  </p>
                  <p className="text-white/40 font-body text-xs leading-tight">
                    {lang === 'de' ? b.desc_de : lang === 'en' ? b.desc_en : b.desc_it}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center flex flex-col sm:flex-row gap-3 justify-center">
            {!isLoggedIn ? (
              <>
                <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
                  className="px-7 py-3.5 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] font-body font-semibold text-xs tracking-widest uppercase rounded-full transition-all shadow-lg">
                  {c.register}
                </button>
                <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
                  className="px-7 py-3.5 border border-white/20 text-white/60 hover:text-white hover:border-white/40 font-body text-xs tracking-wider uppercase rounded-full transition-all">
                  {c.already}
                </button>
              </>
            ) : (
              <Link to="/account"
                className="px-7 py-3.5 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] font-body font-semibold text-xs tracking-widest uppercase rounded-full transition-all shadow-lg inline-flex items-center gap-2">
                {lang === 'de' ? 'Zum Gäste-Konto' : lang === 'en' ? 'Go to Guest Account' : 'Vai all\'account ospiti'} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── FEATURE CARDS ── */}
      <div className="bg-[#FAF7F2] py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body mb-3">{c.discover}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714]">{c.experience}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Link key={i} to={f.to}
                className="group bg-white border border-[#EDE6D8] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="h-52 overflow-hidden">
                  <img
                    src={f.img}
                    alt={f[lang] || f.de}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 bg-[#8B6914]/8 border border-[#8B6914]/15 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#8B6914]/15 transition-colors">
                    <f.icon className="w-4.5 h-4.5 text-[#8B6914]" />
                  </div>
                  <h3 className="font-display text-xl font-light text-[#1C1714] mb-2">
                    {f[lang] || f.de}
                  </h3>
                  <p className="font-body text-sm text-[#8A7A6A] leading-relaxed mb-4">
                    {lang === 'de' ? f.desc_de : lang === 'en' ? f.desc_en : f.desc_it}
                  </p>
                  <span className="text-[#8B6914] text-xs tracking-[0.2em] uppercase font-body font-semibold group-hover:underline">
                    {c.learn_more}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROOMS PREVIEW ── */}
      <div className="bg-white py-16 sm:py-20 px-4 sm:px-8 border-t border-[#EDE6D8]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body mb-3">
                {lang === 'de' ? 'Unterkunft' : lang === 'en' ? 'Accommodation' : 'Alloggio'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714] mb-5">
                {lang === 'de' ? '13 Zimmer & Suiten' : lang === 'en' ? '13 Rooms & Suites' : '13 Camere & Suite'}
              </h2>
              <p className="font-body text-[#4A3F35] leading-relaxed mb-8">
                {lang === 'de'
                  ? 'Von eleganten Einzelzimmern bis zur großzügigen Superior Suite — jeder Raum im Krone Langenburg verbindet historisches Flair mit modernem Komfort. Schlafen, wo Geschichte lebt.'
                  : lang === 'en'
                  ? 'From elegant single rooms to the spacious Superior Suite — every room combines historic character with modern comfort. Sleep where history lives.'
                  : 'Dalle eleganti camere singole alla spaziosa Superior Suite — ogni camera combina carattere storico con comfort moderno.'}
              </p>
              <div className="space-y-3 mb-8">
                {[
                  lang === 'de' ? 'Bester Preis bei Direktbuchung' : lang === 'en' ? 'Best price on direct booking' : 'Miglior prezzo con prenotazione diretta',
                  lang === 'de' ? 'Frühstück optional ab €14 p.P.' : lang === 'en' ? 'Breakfast optional from €14 p.p.' : 'Colazione opzionale da €14 a persona',
                  lang === 'de' ? 'Gratis WLAN in allen Zimmern' : lang === 'en' ? 'Free Wi-Fi in all rooms' : 'Wi-Fi gratuito in tutte le camere',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#8B6914] flex-shrink-0" />
                    <span className="text-[#4A3F35] font-body text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/rooms"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1C1714] hover:bg-[#2A2118] text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all shadow-lg">
                {lang === 'de' ? 'Alle Zimmer ansehen' : lang === 'en' ? 'View All Rooms' : 'Vedi tutte le camere'} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden h-48 sm:h-56">
                <img src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/804199c28_krone-kingsuite-1-zimmer-uebersicht-01.jpg"
                  alt="Superior Suite" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
              <div className="rounded-2xl overflow-hidden h-48 sm:h-56 mt-6">
                <img src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8c381b8e8_krone-kingsuite-2-zimmer-favorit-01.jpg"
                  alt="Superior Suite 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
              <div className="rounded-2xl overflow-hidden h-36 sm:h-40">
                <img src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/930ad0179_krone-kingsuite-1-zimmer-bett-tv-01.jpg"
                  alt="Deluxe Doppelzimmer" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
              <div className="rounded-2xl overflow-hidden h-36 sm:h-40 -mt-6">
                <img src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg"
                  alt="Panorama Aussicht" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RESTAURANT PREVIEW ── */}
      <div className="bg-[#1C1714] py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1 rounded-2xl overflow-hidden h-72 sm:h-96">
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80"
                alt={lang === 'de' ? 'Restaurant Krone Langenburg' : 'Restaurant Krone Langenburg'}
                className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-3">
                {lang === 'de' ? 'Restaurant + Bar' : lang === 'en' ? 'Restaurant + Bar' : 'Ristorante + Bar'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-5">
                {lang === 'de' ? 'Mediterrane Küche. Hohenlohes Seele.' : lang === 'en' ? 'Mediterranean Cuisine. Hohenlohe Soul.' : 'Cucina mediterranea. Anima di Hohenlohe.'}
              </h2>
              <p className="font-body text-white/60 leading-relaxed mb-8">
                {lang === 'de'
                  ? 'Im Kulinarium by Ammesso verbinden wir die Wärme der italienischen Küche mit den besten Zutaten der Region. Pasta, Fleisch, Fisch — alles mit Liebe zubereitet, direkt aus unserer Küche auf Ihren Tisch.'
                  : lang === 'en'
                  ? 'At Kulinarium by Ammesso we combine the warmth of Italian cuisine with the finest regional ingredients. Pasta, meat, fish — all prepared with love, straight from our kitchen to your table.'
                  : 'Al Kulinarium by Ammesso combiniamo il calore della cucina italiana con i migliori ingredienti regionali.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/reserve"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all">
                  <UtensilsCrossed className="w-4 h-4" /> {c.restaurant_reserve}
                </Link>
                <Link to="/restaurant"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/20 text-white/70 hover:text-white hover:border-white/40 rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all">
                  {lang === 'de' ? 'Zum Restaurant' : lang === 'en' ? 'To the Restaurant' : 'Al ristorante'} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LOCATION TEASER ── */}
      <div className="bg-[#FAF7F2] py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <MapPin className="w-6 h-6 text-[#8B6914] mx-auto mb-4" />
          <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body mb-3">{c.location_eyebrow}</p>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714] mb-5">{c.location_title}</h2>
          <p className="font-body text-[#4A3F35] text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">{c.location_text}</p>
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            {[
              { e: '🏰', de: 'Schloss Langenburg', en: 'Langenburg Castle' },
              { e: '🌿', de: 'Jagsttal-Natur', en: 'Jagst Valley Nature' },
              { e: '🍷', de: 'Hohenloher Wein', en: 'Hohenlohe Wine' },
              { e: '🚗', de: 'Auto- & Technikmuseum', en: 'Automotive Museum' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-[#EDE6D8] rounded-xl px-5 py-3.5 flex items-center gap-3 shadow-sm">
                <span className="text-xl">{item.e}</span>
                <span className="text-[#4A3F35] font-body text-sm">{lang === 'en' ? item.en : item.de}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/discover"
              className="px-6 py-3 bg-[#1C1714] hover:bg-[#2A2118] text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all shadow-lg">
              {c.discover_btn}
            </Link>
            <Link to="/contact"
              className="px-6 py-3 border border-[#8B6914]/40 text-[#8B6914] hover:bg-[#8B6914]/5 rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all">
              {c.contact_btn}
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}