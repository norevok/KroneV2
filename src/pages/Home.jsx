import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, UtensilsCrossed, BedDouble, Star, MapPin, Gift, Users, Wifi, Coffee, Check, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import HeroBookingBar from '@/components/home/HeroBookingBar';
import EventsBanner from '@/components/home/EventsBanner';
import ChatWidget from '@/components/ChatWidget';
import { base44 } from '@/api/base44Client';

// ── Inline Restaurant Banner — schlank mit Hintergrundbild + Live-Status ──
function RestaurantBlock({ lang }) {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  let isOpen = false;
  if (day === 0) isOpen = hour >= 12 && hour < 21;
  else if (day >= 2 && day <= 6) isOpen = (hour >= 12 && hour < 14.5) || (hour >= 18 && hour < 22.5);

  return (
    <div className="relative overflow-hidden h-28 sm:h-32">
      {/* Background — restaurant table with view */}
      <img
        src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1200&q=80"
        alt="Restaurant Krone Langenburg"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
      />
      <div className="absolute inset-0 bg-[#1C1714]/72" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-0">

          {/* Left: name + status */}
          <div>
            <p className="font-display text-xl sm:text-2xl font-light text-white leading-tight">
              Krone Langenburg <span className="text-[#C9A96E] italic">by Ammesso</span>
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <span className={`text-xs font-body font-semibold ${isOpen ? 'text-emerald-300' : 'text-red-300'}`}>
                {isOpen
                  ? (lang === 'de' ? 'Jetzt geöffnet' : lang === 'en' ? 'Open now' : 'Aperto ora')
                  : (lang === 'de' ? 'Aktuell geschlossen' : lang === 'en' ? 'Currently closed' : 'Attualmente chiuso')}
              </span>
              <span className="text-white/30 text-xs font-body hidden sm:inline">·</span>
              <span className="text-white/40 text-xs font-body hidden sm:inline">
                {lang === 'de' ? 'Di–Sa 12–14:30 & 18–22:30 · So 12–21 Uhr' : 'Tue–Sat 12–14:30 & 18–22:30 · Sun 12–21'}
              </span>
            </div>
          </div>

          {/* Right: CTA */}
          <Link to="/reserve"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] rounded-lg text-xs tracking-widest uppercase font-body font-bold transition-all shadow-lg">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            {lang === 'de' ? 'Tisch reservieren' : lang === 'en' ? 'Reserve a Table' : 'Prenota'}
          </Link>

        </div>
      </div>
    </div>
  );
}

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1800&q=85',
    de: { title: 'Willkommen in Langenburg.', sub: 'Boutique-Hotel, Restaurant und echte Gastfreundschaft im Herzen von Hohenlohe.' },
    en: { title: 'Welcome to Langenburg.', sub: 'Boutique hotel, restaurant and genuine hospitality in the heart of Hohenlohe.' },
    it: { title: 'Benvenuti a Langenburg.', sub: 'Boutique hotel, ristorante e vera ospitalità nel cuore di Hohenlohe.' },
  },
  {
    url: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8c381b8e8_krone-kingsuite-2-zimmer-favorit-01.jpg',
    de: { title: 'Die King-Suite — Ihr Rückzugsort.', sub: 'Großzügig, stilvoll, unvergesslich — buchen Sie direkt zum besten Preis.' },
    en: { title: 'The King Suite — Your Retreat.', sub: 'Spacious, stylish, unforgettable — book directly at the best price.' },
    it: { title: 'La King Suite — Il vostro rifugio.', sub: 'Spaziosa, elegante, indimenticabile — prenota direttamente al miglior prezzo.' },
  },
  {
    // Wohnbereich King Suite 1 — neu hinzugefügt
    url: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/a8e3a47b0_krone-kingsuite-1-zimmer-wohnbereich-02.jpg',
    de: { title: 'Stilvoll wohnen in Langenburg.', sub: 'Zehn Zimmer und Suiten mit historischem Charme und modernem Komfort.' },
    en: { title: 'Live in Style in Langenburg.', sub: 'Ten rooms and suites with historic charm and modern comfort.' },
    it: { title: 'Vivere in stile a Langenburg.', sub: 'Dieci camere e suite con fascino storico e comfort moderno.' },
  },
  {
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85',
    de: { title: 'Mediterrane Küche mit Herz.', sub: 'Regionale Zutaten, italienische Wärme — im Kulinarium by Ammesso.' },
    en: { title: 'Mediterranean Cuisine with Heart.', sub: 'Regional ingredients, Italian warmth — at Kulinarium by Ammesso.' },
    it: { title: 'Cucina mediterranea con cuore.', sub: 'Ingredienti regionali, calore italiano — al Kulinarium by Ammesso.' },
  },
  {
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=85',
    de: { title: 'Hochzeiten & Events in Langenburg.', sub: 'Unvergessliche Momente — wir gestalten Ihren besonderen Anlass.' },
    en: { title: 'Weddings & Events in Langenburg.', sub: 'Unforgettable moments — we craft your special occasion.' },
    it: { title: 'Matrimoni & eventi a Langenburg.', sub: 'Momenti indimenticabili — creiamo la vostra occasione speciale.' },
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
      de: 'Zimmer & Suiten', en: 'Rooms & Suites', it: 'Camere & Suite', es: 'Habitaciones & Suites',
      desc_de: '10 exklusive Zimmer — sieben Doppelzimmer, ein Einzelzimmer und zwei großzügige King-Suites',
      desc_en: '10 exclusive rooms — seven double rooms, one single room and two generous King Suites',
      desc_it: '10 camere esclusive — sette doppie, una singola e due generose King Suite',
      desc_es: '10 habitaciones exclusivas — siete dobles, una individual y dos generosas King Suites',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8c381b8e8_krone-kingsuite-2-zimmer-favorit-01.jpg',
      alt: 'Zimmer Krone Langenburg Hotel Boutique Suite',
    },
    {
      icon: UtensilsCrossed,
      to: '/restaurant',
      de: 'Restaurant + Bar', en: 'Restaurant + Bar', it: 'Ristorante + Bar', es: 'Restaurante + Bar',
      desc_de: 'Mediterrane Küche mit regionalen Zutaten — Di–Sa Mittag & Abend, So ganztags geöffnet',
      desc_en: 'Mediterranean cuisine with regional ingredients — Tue–Sat lunch & dinner, Sun all day',
      desc_it: 'Cucina mediterranea con ingredienti regionali — Mar–Sab pranzo & cena, Dom tutto il giorno',
      desc_es: 'Cocina mediterránea con ingredientes regionales — Mar–Sáb almuerzo & cena, Dom todo el día',
      // Elegant restaurant wine & table setting — fine dining mood
      img: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=85',
      alt: 'Restaurant Krone Langenburg mediterrane Küche Tischreservierung',
    },
    {
      icon: Star,
      to: '/weddings',
      de: 'Events & Feiern', en: 'Events & Celebrations', it: 'Events & Feste', es: 'Eventos & Celebraciones',
      desc_de: 'Hochzeiten, Firmenevents und private Feste — individuell gestaltet und unvergesslich',
      desc_en: 'Weddings, corporate events and private celebrations — individually crafted and unforgettable',
      desc_it: 'Matrimoni, eventi aziendali e feste private — su misura e indimenticabili',
      desc_es: 'Bodas, eventos corporativos y celebraciones privadas — a medida e inolvidables',
      // Wedding celebration dinner setup — white flowers, elegant long table
      img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=85',
      alt: 'Eventlocation Hochzeit Firmenfeier Langenburg Krone by Ammesso',
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
      location_text: 'Unser Hotel liegt direkt im historischen Zentrum von Langenburg — nur wenige Schritte vom Schloss Langenburg und dem malerischen Jagsttal entfernt. Der ideale Ausgangspunkt für Ausflüge ins Hohenloher Land.',
      discover_btn: 'Region entdecken',
      contact_btn: 'Kontakt aufnehmen',
      restaurant_reserve: 'Tisch reservieren',
      rooms_book: 'Zimmer buchen',
      rooms_section: 'Unterkunft',
      rooms_title: '10 Zimmer & Suiten',
      rooms_text: 'Sieben stilvolle Doppelzimmer, ein Einzelzimmer und zwei großzügige King-Suites — jedes Zimmer verbindet historischen Charme mit zeitlosem Komfort. Schlafen, wo Geschichte lebt.',
      rooms_cta: 'Alle Zimmer ansehen',
      chip_castle: 'Schloss Langenburg',
      chip_nature: 'Jagsttal-Natur',
      chip_wine: 'Hohenloher Wein',
      chip_museum: 'Automuseum',
      account_cta: 'Zum Gäste-Konto',
    },
    en: {
      discover: 'Discover',
      experience: 'The Krone Experience',
      learn_more: 'Explore →',
      benefits_eyebrow: 'Krone Guest Account',
      benefits_title: 'Exclusive Member Benefits',
      benefits_sub: 'Create a free guest account and unlock exclusive advantages with every stay.',
      register: 'Create Free Account',
      already: 'Already a member? Sign in',
      location_eyebrow: 'Heart of Langenburg',
      location_title: 'At the Centre of Hohenlohe',
      location_text: 'Our hotel occupies a prime position in the historic heart of Langenburg — steps from the princely castle and the scenic Jagst Valley. The ideal starting point for excursions into one of Germany\'s most beautiful regions.',
      discover_btn: 'Explore the Region',
      contact_btn: 'Contact Us',
      restaurant_reserve: 'Reserve a Table',
      rooms_book: 'Book a Room',
      rooms_section: 'Accommodation',
      rooms_title: '10 Rooms & Suites',
      rooms_text: 'Seven elegant double rooms, one single room and two spacious King Suites — each space blends historic character with refined modern comfort. Sleep where history lives.',
      rooms_cta: 'View All Rooms',
      chip_castle: 'Langenburg Castle',
      chip_nature: 'Jagst Valley',
      chip_wine: 'Hohenlohe Wine',
      chip_museum: 'Automotive Museum',
      account_cta: 'Go to Guest Account',
    },
    it: {
      discover: 'Scopri',
      experience: "L'Esperienza Krone",
      learn_more: 'Scopri →',
      benefits_eyebrow: 'Account Ospiti Krone',
      benefits_title: 'Vantaggi esclusivi per i membri',
      benefits_sub: 'Crea il tuo account gratuito e goditi vantaggi esclusivi ad ogni soggiorno.',
      register: 'Crea account gratuito',
      already: 'Già membro? Accedi',
      location_eyebrow: 'Cuore di Langenburg',
      location_title: 'Nel cuore della regione di Hohenlohe',
      location_text: 'Il nostro hotel occupa una posizione privilegiata nel centro storico di Langenburg — a pochi passi dal castello principesco e dalla pittoresca valle del Jagst. La base ideale per esplorare una delle regioni più belle della Germania.',
      discover_btn: 'Esplora la regione',
      contact_btn: 'Contattaci',
      restaurant_reserve: 'Prenota un tavolo',
      rooms_book: 'Prenota una camera',
      rooms_section: 'Alloggio',
      rooms_title: '10 Camere & Suite',
      rooms_text: 'Sette eleganti camere doppie, una camera singola e due spaziose King Suite — ogni spazio unisce fascino storico e comfort moderno raffinato. Dormite dove vive la storia.',
      rooms_cta: 'Vedi tutte le camere',
      chip_castle: 'Castello di Langenburg',
      chip_nature: 'Valle del Jagst',
      chip_wine: 'Vino di Hohenlohe',
      chip_museum: 'Museo dell\'automobile',
      account_cta: 'Vai all\'account ospiti',
    },
    es: {
      discover: 'Descubra',
      experience: 'La Experiencia Krone',
      learn_more: 'Descubrir →',
      benefits_eyebrow: 'Cuenta de Huéspedes Krone',
      benefits_title: 'Ventajas exclusivas para socios',
      benefits_sub: 'Crea tu cuenta gratuita y disfruta de ventajas exclusivas en cada estancia.',
      register: 'Crear cuenta gratuita',
      already: '¿Ya eres socio? Inicia sesión',
      location_eyebrow: 'Corazón de Langenburg',
      location_title: 'En el corazón de la región de Hohenlohe',
      location_text: 'Nuestro hotel ocupa una posición privilegiada en el centro histórico de Langenburg — a pocos pasos del castillo principesco y del pintoresco valle del Jagst. El punto de partida ideal para explorar una de las regiones más bellas de Alemania.',
      discover_btn: 'Explorar la región',
      contact_btn: 'Contáctenos',
      restaurant_reserve: 'Reservar mesa',
      rooms_book: 'Reservar habitación',
      rooms_section: 'Alojamiento',
      rooms_title: '10 Habitaciones & Suites',
      rooms_text: 'Siete elegantes habitaciones dobles, una individual y dos amplias King Suites — cada espacio combina el encanto histórico con un confort moderno refinado. Duerma donde vive la historia.',
      rooms_cta: 'Ver todas las habitaciones',
      chip_castle: 'Castillo de Langenburg',
      chip_nature: 'Valle del Jagst',
      chip_wine: 'Vino de Hohenlohe',
      chip_museum: 'Museo del automóvil',
      account_cta: 'Ir a mi cuenta',
    },
  };
  const c = t[lang] || t.de;

  return (
    <div className="min-h-screen bg-[#FAF7F2]">

      {/* ── HERO — Premium 3D Ken Burns Slider ── */}
      <div className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
        {/* Slides with Ken Burns zoom effect */}
        {SLIDES.map((s, i) => (
          <AnimatePresence key={i}>
            {i === current && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}>
                <motion.img
                  src={s.url}
                  alt={s.de.title}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  initial={{ scale: 1.08, filter: 'brightness(0.85)' }}
                  animate={{ scale: 1.0, filter: 'brightness(1)' }}
                  transition={{ duration: 6, ease: 'easeOut' }}
                />
                {/* Multi-layer gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
              </motion.div>
            )}
          </AnimatePresence>
        ))}

        {/* Slide counter top-right */}
        <div className="absolute top-28 right-6 z-10 hidden sm:flex items-center gap-2">
          <span className="font-display text-2xl font-light text-white/60">{String(current + 1).padStart(2, '0')}</span>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <span className="font-display text-sm font-light text-white/30">{String(SLIDES.length).padStart(2, '0')}</span>
        </div>

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 pb-52 sm:pb-40 lg:pb-36 z-10">

          <motion.div
            key={`badge-${current}`}
            className="inline-flex items-center gap-2 bg-[#C9A96E]/20 backdrop-blur-sm border border-[#C9A96E]/30 rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C9A96E]" />
            <span className="text-[#C9A96E] text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase font-body font-semibold">Premium Boutique Hotel</span>
          </motion.div>
          <motion.p
            key={`eyebrow-${current}`}
            className="text-[#C9A96E]/70 text-[9px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.6em] uppercase font-body mb-3 sm:mb-5 hidden sm:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.1 }}>
            Krone Langenburg · by Ammesso
          </motion.p>
          <motion.h1
            key={`title-${current}`}
            className="font-display text-[2rem] leading-tight sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-3 sm:mb-5 max-w-4xl drop-shadow-xl px-2"
            initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            {slideText.title}
          </motion.h1>
          <motion.div
            key={`divider-${current}`}
            className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent mb-3 sm:mb-5"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          />
          <motion.p
            key={`sub-${current}`}
            className="text-white/70 font-body text-xs sm:text-base lg:text-lg max-w-sm sm:max-w-xl leading-relaxed px-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}>
            {slideText.sub}
          </motion.p>
          {/* Scroll hint */}
          <motion.div
            className="mt-8 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 bg-white/50 rounded-full" />
            </motion.div>
          </motion.div>
        </div>

        {/* Arrow controls — mobile: edge tap zones, desktop: visible buttons */}
        <motion.button onClick={prev} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          className="absolute left-0 sm:left-5 top-1/2 -translate-y-1/2 h-24 w-12 sm:w-11 sm:h-11 bg-transparent sm:bg-black/25 sm:hover:bg-[#C9A96E]/30 sm:border sm:border-white/20 sm:hover:border-[#C9A96E]/60 sm:rounded-full flex items-center justify-center text-white/70 sm:text-white transition-all backdrop-blur-none sm:backdrop-blur-sm z-10">
          <ChevronLeft className="w-6 h-6 sm:w-5 sm:h-5 drop-shadow-lg" />
        </motion.button>
        <motion.button onClick={next} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          className="absolute right-0 sm:right-5 top-1/2 -translate-y-1/2 h-24 w-12 sm:w-11 sm:h-11 bg-transparent sm:bg-black/25 sm:hover:bg-[#C9A96E]/30 sm:border sm:border-white/20 sm:hover:border-[#C9A96E]/60 sm:rounded-full flex items-center justify-center text-white/70 sm:text-white transition-all z-10">
          <ChevronRight className="w-6 h-6 sm:w-5 sm:h-5 drop-shadow-lg" />
        </motion.button>

        {/* Progress bar + dots */}
        <div className="absolute bottom-44 sm:bottom-36 lg:bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="relative overflow-hidden rounded-full transition-all">
                <span className={`block rounded-full transition-all duration-500 ${i === current ? 'w-8 h-1.5 bg-[#C9A96E]' : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/60'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Floating booking bar */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6 sm:pb-8 z-10">
          <HeroBookingBar lang={lang} />
        </div>
      </div>

      {/* EventsBanner is now inside Navbar — removed from here */}

      {/* ── RESTAURANT FEATURE BLOCK ── */}
      <RestaurantBlock lang={lang} />

      {/* ── BENEFIT STRIP ── */}
      <motion.div 
        className="bg-[#1C1714] py-10 sm:py-12 px-4 sm:px-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}>
        {/* Animated background accent */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A96E]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#C9A96E]/5 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-2">{c.benefits_eyebrow}</p>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-white">{c.benefits_title}</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div 
                key={i} 
                className="flex flex-col items-center text-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <motion.div 
                  className="w-11 h-11 bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-full flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5, borderColor: 'rgba(201,169,110,0.4)' }}
                  transition={{ duration: 0.3 }}
                >
                  <b.icon className="w-5 h-5 text-[#C9A96E]" />
                </motion.div>
                <div>
                  <p className="text-white font-body text-sm font-semibold mb-0.5">
                    {lang === 'de' ? b.de : lang === 'en' ? b.en : b.it}
                  </p>
                  <p className="text-white/40 font-body text-xs leading-tight">
                    {lang === 'de' ? b.desc_de : lang === 'en' ? b.desc_en : b.desc_it}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="mt-8 text-center flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}>
            {!isLoggedIn ? (
              <>
                <motion.button 
                  onClick={() => base44.auth.redirectToLogin(window.location.href)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] font-body font-bold text-sm tracking-widest uppercase rounded-lg transition-all shadow-lg"
                >
                  {c.register}
                </motion.button>
                <motion.button 
                  onClick={() => base44.auth.redirectToLogin(window.location.href)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 border-2 border-white/25 text-white/70 hover:text-white hover:border-white/50 font-body text-sm font-semibold tracking-wider uppercase rounded-lg transition-all"
                >
                  {c.already}
                </motion.button>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/account"
                  className="px-8 py-4 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] font-body font-bold text-sm tracking-widest uppercase rounded-lg transition-all shadow-lg inline-flex items-center gap-2">
                  {c.account_cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* ── FEATURE CARDS ── */}
      <motion.div 
        className="bg-[#FAF7F2] py-16 sm:py-20 px-4 sm:px-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}>
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body mb-3">{c.discover}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714]">{c.experience}</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -6, scale: 1.01 }} 
                whileTap={{ scale: 0.98 }} 
                transition={{ duration: 0.25 }}
                className="bg-white border border-[#EDE6D8] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 block"
              >
                <Link to={f.to} className="block">
                  <div className="h-52 overflow-hidden">
                    <img
                      src={f.img}
                      alt={f.alt || (f[lang] || f.de) + ' — Krone Langenburg by Ammesso'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="w-10 h-10 bg-[#8B6914]/8 border border-[#8B6914]/15 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#8B6914]/15 transition-colors">
                      <f.icon className="w-4.5 h-4.5 text-[#8B6914]" />
                    </div>
                    <h3 className="font-display text-xl font-light text-[#1C1714] mb-2">
                      {f[lang] || f.es || f.de}
                    </h3>
                    <p className="font-body text-sm text-[#8A7A6A] leading-relaxed mb-4">
                      {lang === 'de' ? f.desc_de : lang === 'en' ? f.desc_en : lang === 'es' ? f.desc_es : f.desc_it}
                    </p>
                    <span className="text-[#8B6914] text-xs tracking-[0.2em] uppercase font-body font-semibold group-hover:underline">
                      {c.learn_more}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── ROOMS PREVIEW ── */}
      <motion.div 
        className="bg-white py-16 sm:py-20 px-4 sm:px-8 border-t border-[#EDE6D8]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body mb-3">{c.rooms_section}</p>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714] mb-5">{c.rooms_title}</h2>
              <p className="font-body text-[#4A3F35] leading-relaxed mb-8">{c.rooms_text}</p>
              <div className="space-y-3 mb-8">
                {[
                  lang === 'de' ? 'Bester Preis bei Direktbuchung' : lang === 'en' ? 'Best rate guaranteed on direct booking' : lang === 'es' ? 'Mejor precio garantizado al reservar directo' : 'Miglior prezzo garantito con prenotazione diretta',
                  lang === 'de' ? 'Frühstück optional ab €14 p.P.' : lang === 'en' ? 'Breakfast available from €14 per person' : lang === 'es' ? 'Desayuno disponible desde €14 por persona' : 'Colazione disponibile da €14 a persona',
                  lang === 'de' ? 'Kostenloses WLAN in allen Zimmern' : lang === 'en' ? 'Complimentary Wi-Fi throughout' : lang === 'es' ? 'Wi-Fi gratuito en todas las habitaciones' : 'Wi-Fi gratuito in tutte le camere',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#8B6914] flex-shrink-0" />
                    <span className="text-[#4A3F35] font-body text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/rooms"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1C1714] hover:bg-[#2A2118] text-white rounded-lg text-sm tracking-widest uppercase font-body font-bold transition-all shadow-lg">
                {c.rooms_cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Deluxe Doppelzimmer — sauberes Bett-Motiv */}
              <div className="rounded-xl overflow-hidden h-52 sm:h-60 shadow-md">
                <img src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/d8a0d0a11_krone-kingsuite-1-zimmer-bett-01.jpg"
                  alt="Deluxe Doppelzimmer im Krone Langenburg by Ammesso" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
              {/* Superior Suite — Zimmerübersicht, versetzt */}
              <div className="rounded-xl overflow-hidden h-52 sm:h-60 mt-8 shadow-md">
                <img src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/804199c28_krone-kingsuite-1-zimmer-uebersicht-01.jpg"
                  alt="King Suite im Krone Langenburg by Ammesso" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
              {/* Superior Suite 2 — Favorit-Motiv */}
              <div className="rounded-xl overflow-hidden h-40 sm:h-44 shadow-md">
                <img src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8c381b8e8_krone-kingsuite-2-zimmer-favorit-01.jpg"
                  alt="King Suite 2 im Krone Langenburg by Ammesso" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
              {/* Panorama-Aussicht */}
              <div className="rounded-xl overflow-hidden h-40 sm:h-44 -mt-8 shadow-md">
                <img src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg"
                  alt="Zimmer in Langenburg Hotel Krone — Panorama Aussicht" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── RESTAURANT PREVIEW ── */}
      <motion.div 
        className="bg-[#1C1714] py-16 sm:py-20 px-4 sm:px-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1 rounded-2xl overflow-hidden h-72 sm:h-96">
              <img src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=900&q=85"
                alt="Restaurant Krone Langenburg by Ammesso — mediterrane Küche Langenburg"
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
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                <Link to="/reserve"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] rounded-lg text-sm tracking-widest uppercase font-body font-bold transition-all min-w-0">
                  <UtensilsCrossed className="w-4 h-4 flex-shrink-0" /> {c.restaurant_reserve}
                </Link>
                <Link to="/menu"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 border-2 border-white/25 text-white/70 hover:text-white hover:border-white/50 rounded-lg text-sm tracking-widest uppercase font-body font-semibold transition-all min-w-0">
                  {lang === 'de' ? 'Menü ansehen' : lang === 'en' ? 'View Menu' : 'Menù'} <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </Link>
                <Link to="/weddings"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 border-2 border-white/15 text-white/50 hover:text-white/80 hover:border-white/30 rounded-lg text-sm tracking-widest uppercase font-body font-semibold transition-all min-w-0">
                  {lang === 'de' ? 'Event anfragen' : lang === 'en' ? 'Enquire Event' : 'Evento'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── LOCATION TEASER ── */}
      <motion.div 
        className="relative bg-[#1C1714] py-20 sm:py-28 px-4 sm:px-8 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}>
        {/* Background parallax image */}
        <div className="absolute inset-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Schloss_Langenburg-msu-2021-0306-.jpg/1280px-Schloss_Langenburg-msu-2021-0306-.jpg"
            alt="Langenburg"
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1714]/80 via-[#1C1714]/60 to-[#1C1714]/95" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}>
            <MapPin className="w-5 h-5 text-[#C9A96E] mx-auto mb-4" />
            <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body mb-3">{c.location_eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-5xl font-light text-white mb-6">{c.location_title}</h2>
            <p className="font-body text-white/55 text-sm sm:text-base max-w-2xl mx-auto mb-12 leading-relaxed">{c.location_text}</p>
          </motion.div>

          {/* Premium 3D-style highlight cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-12">
            {[
              {
                // Schloss Langenburg — medieval hilltop castle Germany, real castle silhouette
                img: 'https://images.unsplash.com/photo-1564584083593-79f2f3e1e0da?w=600&q=85',
                alt: 'Schloss Langenburg Hohenlohe Burg',
                label: c.chip_castle,
                desc: lang === 'de' ? 'Historisches Schloss mit Blick ins Jagsttal.' : 'Historic castle overlooking the Jagst valley.',
                dist: '5 Min.',
              },
              {
                // Jagsttal — gentle German river valley, green meadows, no Alps
                img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=85',
                alt: 'Jagsttal Hohenlohe Natur Langenburg',
                label: c.chip_nature,
                desc: lang === 'de' ? 'Natur, Ausblicke und ruhige Wege direkt vor der Tür.' : 'Nature, views and peaceful paths right at your doorstep.',
                dist: lang === 'de' ? 'Direkt vor der Tür' : 'On your doorstep',
              },
              {
                // Classic vintage car / oldtimer — Automuseum context
                img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=85',
                alt: 'Deutsches Automuseum Schloss Langenburg Oldtimer',
                label: c.chip_museum,
                desc: lang === 'de' ? 'Automobilgeschichte in besonderer Schlosskulisse.' : 'Automotive history in a unique castle setting.',
                dist: '5 Min.',
              },
              {
                // Hohenloher Genuss — wine glasses, warm light, regional atmosphere
                img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=85',
                alt: 'Hohenloher Wein Weinberge Region Genuss',
                label: c.chip_wine,
                desc: lang === 'de' ? 'Wein, regionale Produkte und echte Hohenloher Gastlichkeit.' : 'Wine, regional produce and true Hohenlohe hospitality.',
                dist: '15 Min.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden h-36 sm:h-44 group cursor-default"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.15)' }}>
                <img src={item.img} alt={item.alt || item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Gold top accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C9A96E]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <p className="text-white font-body text-xs font-semibold leading-tight">{item.label}</p>
                  {item.desc && <p className="text-white/65 text-[10px] font-body mt-0.5 leading-snug hidden sm:block">{item.desc}</p>}
                  <p className="text-[#C9A96E] text-[10px] font-body mt-0.5 tracking-wider">{item.dist}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link to="/discover"
                className="flex items-center justify-center px-8 py-4 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] rounded-lg text-sm tracking-widest uppercase font-body font-bold transition-all shadow-[0_8px_30px_rgba(201,169,110,0.3)] w-full sm:w-auto">
                {c.discover_btn}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link to="/contact"
                className="flex items-center justify-center px-8 py-4 border-2 border-white/25 text-white/70 hover:text-white hover:border-white/50 rounded-lg text-sm tracking-widest uppercase font-body font-semibold transition-all w-full sm:w-auto">
                {c.contact_btn}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}