import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, UtensilsCrossed, BedDouble, Star, MapPin, Gift, Users } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import HeroBookingBar from '@/components/home/HeroBookingBar';

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&q=80',
    de: { title: 'Willkommen im Krone Langenburg', sub: 'Boutique Hotel & Restaurant by Ammesso' },
    en: { title: 'Welcome to Krone Langenburg', sub: 'Boutique Hotel & Restaurant by Ammesso' },
    it: { title: 'Benvenuti al Krone Langenburg', sub: 'Hotel Boutique & Ristorante by Ammesso' },
  },
  {
    url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=80',
    de: { title: 'Exklusive Zimmer & Suiten', sub: 'Komfort und Stil im Herzen Langenburgs' },
    en: { title: 'Exclusive Rooms & Suites', sub: 'Comfort and style in the heart of Langenburg' },
    it: { title: 'Camere & Suite Esclusive', sub: 'Comfort e stile nel cuore di Langenburg' },
  },
  {
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=80',
    de: { title: 'Restaurant & Kulinarik', sub: 'Regionale Küche auf höchstem Niveau' },
    en: { title: 'Restaurant & Cuisine', sub: 'Regional cooking at the highest level' },
    it: { title: 'Ristorante & Cucina', sub: 'Cucina regionale al massimo livello' },
  },
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=80',
    de: { title: 'Events & Feiern', sub: 'Unvergessliche Momente für Hochzeiten und Feste' },
    en: { title: 'Events & Celebrations', sub: 'Unforgettable moments for weddings and gatherings' },
    it: { title: 'Eventi & Celebrazioni', sub: 'Momenti indimenticabili per matrimoni e feste' },
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80',
    de: { title: 'Entdecken Sie Langenburg', sub: 'Idyllisch gelegen im Hohenloher Land' },
    en: { title: 'Discover Langenburg', sub: 'Idyllically situated in the Hohenlohe region' },
    it: { title: 'Scopri Langenburg', sub: 'Situato idillicamente nella regione di Hohenlohe' },
  },
];

const BENEFITS = [
  { icon: BedDouble, de: 'Frühes Check-in', en: 'Early Check-in', it: 'Check-in anticipato' },
  { icon: Gift, de: 'Exklusive Angebote', en: 'Exclusive Offers', it: 'Offerte esclusive' },
  { icon: UtensilsCrossed, de: 'Tisch-Vorrang', en: 'Table Priority', it: 'Priorità tavolo' },
  { icon: Star, de: 'Mitglieder-Rabatte', en: 'Member Discounts', it: 'Sconti membri' },
  { icon: Users, de: 'Persönlicher Service', en: 'Personal Service', it: 'Servizio personale' },
];

export default function Home() {
  const { lang } = useLang();
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  function startTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000);
  }

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  function goTo(idx) {
    setCurrent(idx);
    startTimer();
  }
  function prev() { goTo((current - 1 + SLIDES.length) % SLIDES.length); }
  function next() { goTo((current + 1) % SLIDES.length); }

  const slide = SLIDES[current];
  const slideText = slide[lang] || slide.de;

  const features = [
    { icon: BedDouble, to: '/rooms', de: 'Zimmer & Suiten', en: 'Rooms & Suites', it: 'Camere & Suite', desc_de: 'Stilvoll eingerichtete Zimmer mit modernem Komfort', desc_en: 'Stylishly furnished rooms with modern comfort', desc_it: 'Camere arredate con stile e comfort moderno' },
    { icon: UtensilsCrossed, to: '/restaurant', de: 'Restaurant', en: 'Restaurant', it: 'Ristorante', desc_de: 'Regionale Spezialitäten und internationale Küche', desc_en: 'Regional specialties and international cuisine', desc_it: 'Specialità regionali e cucina internazionale' },
    { icon: Star, to: '/weddings', de: 'Events & Hochzeiten', en: 'Events & Weddings', it: 'Eventi & Matrimoni', desc_de: 'Der perfekte Rahmen für Ihre unvergesslichen Momente', desc_en: 'The perfect setting for your unforgettable moments', desc_it: 'La cornice perfetta per i vostri momenti indimenticabili' },
  ];

  return (
    <div className="min-h-screen bg-ivory">

      {/* ── HERO ── */}
      <div className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Slides */}
        {SLIDES.map((s, i) => (
          <div key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
            <img src={s.url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          </div>
        ))}

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pb-40 sm:pb-32">
          <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body mb-4 animate-fade-in">
            Krone Langenburg · by Ammesso
          </p>
          <h1 key={current} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4 leading-tight max-w-3xl animate-fade-up">
            {slideText.title}
          </h1>
          <p className="text-white/70 font-body text-base sm:text-lg max-w-xl animate-fade-in">
            {slideText.sub}
          </p>
          <div className="flex gap-3 mt-8">
            <Link to="/booking"
              className="px-7 py-3.5 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] font-body font-semibold text-xs tracking-widest uppercase rounded-full transition-all shadow-lg">
              {lang === 'de' ? 'Zimmer buchen' : lang === 'en' ? 'Book Now' : 'Prenota'}
            </Link>
            <Link to="/reserve"
              className="px-7 py-3.5 bg-white/15 hover:bg-white/25 border border-white/40 text-white font-body font-semibold text-xs tracking-widest uppercase rounded-full transition-all backdrop-blur-sm">
              {lang === 'de' ? 'Tisch reservieren' : lang === 'en' ? 'Reserve Table' : 'Prenota tavolo'}
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
        <div className="absolute bottom-36 sm:bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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

      {/* ── FEATURE CARDS ── */}
      <div className="bg-ivory py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">
              {lang === 'de' ? 'Entdecken Sie' : lang === 'en' ? 'Discover' : 'Scopri'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-charcoal">
              {lang === 'de' ? 'Das Krone Erlebnis' : lang === 'en' ? 'The Krone Experience' : "L'esperienza Krone"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Link key={i} to={f.to}
                className="group surface-card rounded-2xl overflow-hidden hover-lift">
                <div className="p-8 text-center">
                  <div className="w-14 h-14 bg-gold/8 border border-gold/15 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-gold/15 transition-colors">
                    <f.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-display text-2xl font-light text-charcoal mb-3">
                    {f[lang] || f.de}
                  </h3>
                  <p className="font-body text-sm text-[#8A7A6A] leading-relaxed">
                    {(lang === 'de' ? f.desc_de : lang === 'en' ? f.desc_en : f.desc_it)}
                  </p>
                  <div className="mt-5 text-gold text-xs tracking-[0.2em] uppercase font-body font-semibold group-hover:underline">
                    {lang === 'de' ? 'Mehr erfahren →' : lang === 'en' ? 'Learn more →' : 'Scopri di più →'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── KRONE GÄSTE-KONTO (Member Benefits) ── */}
      <div className="bg-charcoal py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">
            {lang === 'de' ? 'Mitglieder' : lang === 'en' ? 'Members' : 'Membri'}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory mb-4">
            {lang === 'de' ? 'Krone Gäste-Konto' : lang === 'en' ? 'Krone Guest Account' : 'Account Ospiti Krone'}
          </h2>
          <p className="font-body text-ivory/50 text-sm max-w-xl mx-auto mb-12">
            {lang === 'de'
              ? 'Registrieren Sie sich und genießen Sie exklusive Vorteile bei jedem Aufenthalt.'
              : lang === 'en'
              ? 'Register and enjoy exclusive benefits with every stay.'
              : 'Registrati e goditi vantaggi esclusivi ad ogni soggiorno.'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-10">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center">
                  <b.icon className="w-5 h-5 text-gold" />
                </div>
                <p className="text-ivory/60 text-xs font-body text-center">
                  {lang === 'de' ? b.de : lang === 'en' ? b.en : b.it}
                </p>
              </div>
            ))}
          </div>
          <Link to="/account"
            className="inline-flex items-center gap-2 px-8 py-4 border border-[#C9A96E]/40 text-[#C9A96E] hover:bg-[#C9A96E]/10 font-body font-semibold text-xs tracking-widest uppercase rounded-full transition-all">
            {lang === 'de' ? 'Jetzt registrieren' : lang === 'en' ? 'Create Account' : 'Crea account'}
          </Link>
        </div>
      </div>

      {/* ── LOCATION TEASER ── */}
      <div className="bg-stone py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-6 h-6 text-gold mx-auto mb-4" />
          <h2 className="font-display text-3xl sm:text-4xl font-light text-charcoal mb-4">
            {lang === 'de' ? 'Mitten in Langenburg' : lang === 'en' ? 'In the Heart of Langenburg' : 'Nel cuore di Langenburg'}
          </h2>
          <p className="font-body text-[#8A7A6A] text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            {lang === 'de'
              ? 'Gelegen im malerischen Hohenloher Land, ist Krone Langenburg Ihr perfekter Ausgangspunkt für Ausflüge in die Region.'
              : lang === 'en'
              ? 'Situated in the picturesque Hohenlohe region, Krone Langenburg is your perfect base for exploring the area.'
              : 'Situato nella pittoresca regione di Hohenlohe, il Krone Langenburg è la base perfetta per esplorare la zona.'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/discover"
              className="px-6 py-3 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
              {lang === 'de' ? 'Region entdecken' : lang === 'en' ? 'Discover Region' : 'Scopri la regione'}
            </Link>
            <Link to="/contact"
              className="px-6 py-3 btn-ghost-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
              {lang === 'de' ? 'Kontakt' : lang === 'en' ? 'Contact' : 'Contatti'}
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}