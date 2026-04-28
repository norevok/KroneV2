import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, UtensilsCrossed, BedDouble, Star, ChevronDown, Phone, Images } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import { SITE_DEFAULTS } from '@/lib/siteData';
import { base44 } from '@/api/base44Client';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1800&q=85",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&q=85",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=85",
];

const IMAGES = {
  dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=80",
  pasta: "https://images.unsplash.com/photo-1551183053-bf91798d792e?w=800&q=80",
  room1: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  room2: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
  room3: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
  chef: "https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp",
  wedding: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
  hohenlohe: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
};

const GALLERY_STRIP = [
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=75",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=75",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=75",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=75",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=75",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=75",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&q=75",
];

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeUp({ children, delay = 0, className = '' }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroReady, setHeroReady] = useState(false);
  const [activeReview, setActiveReview] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => { const t = setTimeout(() => setHeroReady(true), 100); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setInterval(() => setHeroSlide(s => (s + 1) % HERO_IMAGES.length), 6000); return () => clearInterval(t); }, []);
  useEffect(() => {
    base44.entities.Review.filter({ is_active: true }, 'sort_order', 20)
      .then(data => { if (data?.length > 0) setReviews(data); }).catch(() => {});
  }, []);
  useEffect(() => {
    if (reviews.length === 0) return;
    const t = setInterval(() => setActiveReview(r => (r + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [reviews.length]);

  const C = {
    de: {
      hero_eyebrow: 'Krone Langenburg by Ammesso',
      hero_title: 'Wo Heimat schmeckt.',
      hero_sub: 'Mediterrane Küche mit Herz. Stilvolle Zimmer im historischen Herz Hohenlohes.',
      reserve: 'Tisch reservieren',
      book_room: 'Zimmer buchen',
      scroll: 'Entdecken',
      dining_eyebrow: 'Kulinarium by Ammesso',
      dining_title: 'Mediterrane Seele. Hohenloher Herz.',
      dining_p1: 'Im Kulinarium by Ammesso begegnen sich zwei Welten: die lebendige Aromenvielfalt des Mittelmeerraums und die ehrliche Bodenständigkeit Hohenlohes. Chef Omar Ammesso kocht nicht für den Trend — er kocht für den Moment.',
      dining_p2: 'Handgemachte Pasta, langsam geschmorte Fleischgerichte, saisonale Zutaten vom Wochenmarkt. Jedes Gericht ist eine persönliche Geschichte — ausgedrückt in Geschmack.',
      menu_cta: 'Zur Speisekarte',
      rooms_eyebrow: 'Unterkunft',
      rooms_title: 'Schlafen, wo Geschichte wohnt.',
      rooms_p: 'Unsere Zimmer und Suiten verbinden historisches Flair mit modernem Komfort. Wachen Sie auf im Herzen von Langenburg — still, warm, vollständig.',
      rooms_trust: 'Direktbucher-Preise · Keine Gebühren · Frühstück auf Anfrage',
      rooms_cta: 'Zimmer & Preise',
      story_eyebrow: 'Unsere Geschichte',
      story_title: 'Ein Traum, der schmeckt.',
      story_p: 'Omar Ammesso ist kein gelernter Koch — er ist ein Besessener. Aufgewachsen zwischen zwei Kulturen, destilliert er in jedem Gericht das Beste aus beiden Welten. Die Krone Langenburg ist sein Zuhause.',
      story_cta: 'Die Geschichte lesen',
      weddings_eyebrow: 'Hochzeiten & Events',
      weddings_title: 'Ihr besonderer Tag. Unser ganzes Herz.',
      weddings_p: 'Von der Traumhochzeit bis zum Firmenevent — wir schaffen unvergessliche Momente mit Leidenschaft und Liebe zum Detail.',
      weddings_cta: 'Jetzt anfragen',
      trust_eyebrow: 'Warum die Krone?',
      review_title: 'Was Gäste sagen',
      gallery_eyebrow: 'Impressionen',
      gallery_title: 'Erleben Sie die Krone',
      gallery_cta: 'Alle Fotos ansehen',
      cta_title: 'Bereit für einen Abend, den Sie nicht vergessen?',
      cta_sub: 'Reservieren Sie Ihren Tisch oder buchen Sie Ihr Zimmer — direkt, ohne Aufpreis.',
      phone_cta: 'Anrufen',
      trust: [
        { icon: '✦', t: 'Authentisch', d: 'Kein Franchise, kein Konzept. Echte Küche, echte Menschen, echtes Hohenlohe.' },
        { icon: '◇', t: 'Persönlich', d: 'Vom ersten Tisch bis zur letzten Suite kennen wir jeden Gast beim Namen.' },
        { icon: '◆', t: 'Historisch', d: 'Ein Haus mit Geschichte — restauriert mit Respekt für das Original.' },
        { icon: '✦', t: 'Leidenschaftlich', d: 'Hinter jedem Gericht steckt ein Mensch mit einer Geschichte.' },
      ],
    },
    en: {
      hero_eyebrow: 'Krone Langenburg by Ammesso',
      hero_title: 'Where Home Tastes Real.',
      hero_sub: 'Mediterranean cuisine with heart. Stylish rooms in the historic heart of Hohenlohe.',
      reserve: 'Reserve a Table', book_room: 'Book a Room', scroll: 'Discover',
      dining_eyebrow: 'Kulinarium by Ammesso',
      dining_title: 'Mediterranean Soul. Hohenlohe Heart.',
      dining_p1: 'At Kulinarium by Ammesso, two worlds meet: the vibrant flavors of the Mediterranean and the honest groundedness of Hohenlohe.',
      dining_p2: 'Handmade pasta, slow-braised meats, seasonal ingredients from the market. Every dish is a personal story — expressed in taste.',
      menu_cta: 'View Menu', rooms_eyebrow: 'Accommodation',
      rooms_title: 'Sleep Where History Lives.',
      rooms_p: 'Our rooms and suites combine historic character with modern comfort. Wake up in the heart of Langenburg.',
      rooms_trust: 'Direct rates · No fees · Breakfast on request', rooms_cta: 'Rooms & Rates',
      story_eyebrow: 'Our Story', story_title: 'A Dream That Tastes.',
      story_p: 'Omar Ammesso is not a trained chef — he is an obsessive. Raised between two cultures, he distills the best of both worlds into every dish.',
      story_cta: 'Read the Story', weddings_eyebrow: 'Weddings & Events',
      weddings_title: 'Your Special Day. Our Whole Heart.',
      weddings_p: 'From dream weddings to corporate events — we create unforgettable moments with passion and attention to detail.',
      weddings_cta: 'Enquire Now', trust_eyebrow: 'Why the Krone?',
      review_title: 'What Guests Say', gallery_eyebrow: 'Impressions',
      gallery_title: 'Experience the Krone', gallery_cta: 'View All Photos',
      cta_title: "Ready for an evening you won't forget?",
      cta_sub: 'Reserve your table or book your room — directly, without fees.', phone_cta: 'Call Us',
      trust: [
        { icon: '✦', t: 'Authentic', d: 'No franchise, no concept. Real food, real people, real Hohenlohe.' },
        { icon: '◇', t: 'Personal', d: 'From the first table to the last suite, we know every guest by name.' },
        { icon: '◆', t: 'Historic', d: 'A house with history — restored with respect for the original.' },
        { icon: '✦', t: 'Passionate', d: 'Behind every dish is a person with a story.' },
      ],
    },
  };
  const c = C[lang] || C.de;

  return (
    <div className="bg-ivory text-charcoal overflow-x-hidden pb-20 lg:pb-0">

      {/* ── HERO — dark section (photography always dark overlay) */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {HERO_IMAGES.map((src, i) => (
          <img key={src} src={src} alt="" aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover scale-[1.04] transition-all duration-[2000ms] ease-in-out ${heroReady && i === heroSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/40 to-charcoal/85" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-charcoal/80 to-transparent" />

        <div className="relative z-10 text-center px-5 max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center pt-20 sm:pt-24">
          <div className={`transition-all duration-1000 delay-300 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-gold-light/50" />
              <p className="text-gold-light text-[10px] tracking-[0.5em] uppercase font-body">{c.hero_eyebrow}</p>
              <div className="h-px w-8 bg-gold-light/50" />
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-500 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-light text-ivory leading-[0.95] tracking-tight mb-5">
              {c.hero_title}
            </h1>
          </div>

          <div className={`transition-all duration-1000 delay-700 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-ivory/60 text-sm sm:text-base font-body font-light leading-relaxed max-w-xl mb-8 px-2">{c.hero_sub}</p>
          </div>

          <div className={`transition-all duration-1000 delay-[900ms] w-full max-w-sm sm:max-w-none ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
              <Link to="/reserve"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-gold hover:bg-[#7A5A0F] text-white rounded-full text-xs tracking-[0.2em] uppercase font-body font-semibold transition-all shadow-lg">
                <UtensilsCrossed className="w-3.5 h-3.5 flex-shrink-0" /> {c.reserve}
              </Link>
              <Link to="/rooms"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 border-2 border-ivory/60 hover:border-ivory text-ivory rounded-full text-xs tracking-[0.2em] uppercase font-body font-semibold transition-all">
                <BedDouble className="w-3.5 h-3.5 flex-shrink-0" /> {c.book_room}
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-ivory/30 text-xs font-body">
              <MapPin className="w-3 h-3 text-gold-light/50" />
              <span className="tracking-wider">{s.address_street} · {s.address_zip} {s.address_city}</span>
            </div>
          </div>

          <div className={`flex gap-1.5 mt-8 transition-all duration-1000 delay-[1100ms] ${heroReady ? 'opacity-100' : 'opacity-0'}`}>
            {HERO_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setHeroSlide(i)}
                className={`h-0.5 rounded-full transition-all duration-500 ${i === heroSlide ? 'w-6 bg-gold-light' : 'w-2 bg-ivory/25'}`}
                aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>

        {/* Hours strip at bottom of hero */}
        <div className={`relative z-10 w-full mt-auto transition-all duration-1000 delay-[1200ms] ${heroReady ? 'opacity-100' : 'opacity-0'}`}>
          <div className="border-t border-ivory/10 bg-charcoal/70 backdrop-blur-md">
            <div className="max-w-3xl mx-auto px-5 py-3.5 grid grid-cols-3 divide-x divide-ivory/10">
              {[
                { d: lang === 'de' ? 'Mo' : 'Mon', h: lang === 'de' ? 'Ruhetag' : 'Closed', dim: true },
                { d: lang === 'de' ? 'Di–Sa' : 'Tue–Sat', h: '12–14:30 · 17:30–22' },
                { d: lang === 'de' ? 'So' : 'Sun', h: '12:00–20:00' },
              ].map((item, i) => (
                <div key={i} className={`px-4 text-center ${item.dim ? 'opacity-30' : ''}`}>
                  <p className="text-ivory/40 text-[9px] tracking-[0.3em] uppercase font-body mb-0.5">{item.d}</p>
                  <p className="text-ivory/70 text-xs font-body">{item.h}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-ivory/25 pointer-events-none">
          <span className="text-[9px] tracking-[0.4em] uppercase font-body">{c.scroll}</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* ── DINING — light surface */}
      <section className="py-16 sm:py-24 px-5 bg-ivory">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <FadeUp>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-2/5 h-48 rounded-xl overflow-hidden shadow-premium opacity-80 z-10">
                <img src={IMAGES.pasta} alt="Handgemachte Pasta" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="relative rounded-2xl overflow-hidden h-[420px] md:h-[500px] shadow-premium">
                <img src={IMAGES.dining} alt="Kulinarium Dining" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className="bg-gold text-white text-[9px] font-body font-semibold px-3 py-1.5 rounded-full uppercase tracking-[0.2em]">
                    Kulinarium by Ammesso
                  </span>
                </div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-5">{c.dining_eyebrow}</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-charcoal mb-6 leading-[1.05]">{c.dining_title}</h2>
            <p className="text-charcoal/65 leading-relaxed font-body mb-4">{c.dining_p1}</p>
            <p className="text-charcoal/50 leading-relaxed font-body text-sm mb-10">{c.dining_p2}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/reserve" className="flex items-center justify-center gap-2 px-7 py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
                <UtensilsCrossed className="w-3.5 h-3.5" /> {c.reserve}
              </Link>
              <Link to="/menu" className="flex items-center justify-center gap-2 px-7 py-3.5 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
                {c.menu_cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── ROOMS — warm stone surface */}
      <section className="py-16 sm:py-24 px-5 bg-stone">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <FadeUp className="order-2 lg:order-1">
            <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-5">{c.rooms_eyebrow}</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-charcoal mb-6 leading-[1.05]">{c.rooms_title}</h2>
            <p className="text-charcoal/65 leading-relaxed font-body mb-6">{c.rooms_p}</p>
            <div className="flex items-center gap-2 text-charcoal/40 text-xs font-body mb-10">
              <Star className="w-3.5 h-3.5 text-gold fill-gold/20 flex-shrink-0" />
              <span>{c.rooms_trust}</span>
            </div>
            <Link to="/rooms" className="inline-flex items-center gap-2 px-7 py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              {c.rooms_cta} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </FadeUp>
          <FadeUp delay={150} className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden h-56 shadow-card hover-lift">
                  <img src={IMAGES.room1} alt="Deluxe Einzelzimmer" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                </div>
                <div className="relative rounded-xl overflow-hidden h-36 shadow-card hover-lift">
                  <img src={IMAGES.hohenlohe} alt="Hohenlohe" className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
              <div className="space-y-3 pt-6">
                <div className="relative rounded-xl overflow-hidden h-36 shadow-card hover-lift">
                  <img src={IMAGES.room3} alt="Superior Suite" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="relative rounded-2xl overflow-hidden h-56 shadow-card hover-lift">
                  <img src={IMAGES.room2} alt="Deluxe Doppelzimmer" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── GALLERY STRIP */}
      <section className="py-14 sm:py-20 px-5 bg-ivory">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-2">{c.gallery_eyebrow}</p>
                <h2 className="font-display text-3xl sm:text-4xl font-light text-charcoal">{c.gallery_title}</h2>
              </div>
              <Link to="/gallery" className="flex-shrink-0 flex items-center gap-2 px-6 py-3 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
                <Images className="w-3.5 h-3.5" /> {c.gallery_cta}
              </Link>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
              {GALLERY_STRIP.map((src, i) => (
                <Link key={i} to="/gallery"
                  className="relative flex-shrink-0 w-40 sm:w-52 h-32 sm:h-40 rounded-xl overflow-hidden group cursor-pointer hover-lift">
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
              <Link to="/gallery"
                className="flex-shrink-0 w-40 sm:w-52 h-32 sm:h-40 rounded-xl bg-stone border border-stone-mid hover:border-gold/30 transition-all flex flex-col items-center justify-center gap-2 group">
                <Images className="w-5 h-5 text-gold/50 group-hover:text-gold transition-colors" />
                <span className="text-[10px] tracking-widest uppercase font-body text-charcoal/40 group-hover:text-gold transition-colors text-center px-2">{c.gallery_cta}</span>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── TRUST PILLARS */}
      <section className="py-14 px-5 bg-stone-mid/50 border-y border-stone-mid">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="text-center mb-10">
              <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-3">{c.trust_eyebrow}</p>
              <div className="section-divider" />
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {c.trust.map((item, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div className="surface-card rounded-2xl p-6 h-full flex sm:flex-col gap-4 sm:gap-0">
                  <p className="text-gold text-xl sm:mb-4 flex-shrink-0">{item.icon}</p>
                  <div>
                    <h3 className="font-display text-xl font-light text-charcoal mb-1 sm:mb-2">{item.t}</h3>
                    <p className="text-charcoal/50 text-sm font-body leading-relaxed">{item.d}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHEF & STORY */}
      <section className="py-16 sm:py-24 px-5 bg-charcoal">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <FadeUp>
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 lg:h-[460px] shadow-premium">
              <img src={IMAGES.chef} alt="Chef Omar Ammesso" className="w-full h-full object-cover object-top" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
              <div className="absolute bottom-7 left-7">
                <p className="font-display text-2xl text-ivory font-light leading-tight">Omar Ammesso</p>
                <p className="text-gold-light text-[10px] tracking-[0.35em] uppercase font-body mt-1">Chef & Founder · Krone Langenburg</p>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="text-gold-light text-[10px] tracking-[0.45em] uppercase font-body mb-5">{c.story_eyebrow}</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-ivory mb-6 leading-[1.05]">{c.story_title}</h2>
            <p className="text-ivory/60 leading-relaxed font-body mb-7">{c.story_p}</p>
            <blockquote className="border-l-2 border-gold-light/40 pl-5 italic font-display text-xl text-ivory/55 mb-8 leading-relaxed">
              {lang === 'de' ? '"Ich koche nicht für den Michelin-Stern. Ich koche dafür, dass du morgen wieder kommst."'
                : '"I don\'t cook for the Michelin star. I cook so you come back tomorrow."'}
            </blockquote>
            <Link to="/story" className="inline-flex items-center gap-2 text-gold-light text-xs tracking-[0.25em] uppercase font-body hover:gap-3 transition-all">
              {c.story_cta} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── REVIEWS */}
      {reviews.length > 0 && (
        <section className="py-16 sm:py-20 px-5 bg-ivory">
          <div className="max-w-3xl mx-auto text-center">
            <FadeUp>
              <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-8">{c.review_title}</p>
              <div className="relative min-h-[160px]">
                {reviews.map((r, i) => (
                  <div key={i}
                    className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${i === activeReview ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="flex gap-1 mb-4">
                      {[...Array(r.stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-gold text-gold" />)}
                    </div>
                    <p className="font-display text-xl md:text-2xl font-light text-charcoal italic leading-relaxed mb-3 max-w-2xl">
                      &ldquo;{lang === 'de' ? r.content_de : lang === 'en' ? r.content_en : r.content_it}&rdquo;
                    </p>
                    <p className="text-charcoal/40 text-xs font-body tracking-widest uppercase">— {r.name}</p>
                  </div>
                ))}
              </div>
              {reviews.length > 1 && (
                <div className="flex justify-center gap-2.5 mt-8">
                  {reviews.map((_, i) => (
                    <button key={i} onClick={() => setActiveReview(i)}
                      className={`h-1.5 rounded-full transition-all ${i === activeReview ? 'w-8 bg-gold' : 'w-2 bg-stone-dark'}`} />
                  ))}
                </div>
              )}
            </FadeUp>
          </div>
        </section>
      )}

      {/* ── WEDDINGS */}
      <section className="relative py-20 sm:py-28 px-5 overflow-hidden">
        <img src={IMAGES.wedding} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-charcoal/75" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeUp>
            <p className="text-gold-light text-[10px] tracking-[0.45em] uppercase font-body mb-5">{c.weddings_eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-light text-ivory mb-5 leading-[1.05]">{c.weddings_title}</h2>
            <p className="text-ivory/55 leading-relaxed font-body mb-8 max-w-xl mx-auto text-sm">{c.weddings_p}</p>
            <Link to="/weddings" className="inline-flex items-center gap-2.5 px-9 py-4 bg-gold hover:bg-[#7A5A0F] text-white rounded-full text-xs tracking-[0.2em] uppercase font-body font-semibold transition-all shadow-lg">
              {c.weddings_cta} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ TEASER */}
      <section className="py-10 sm:py-14 px-5 bg-stone border-t border-stone-mid">
        <FadeUp>
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-2">
                {lang === 'de' ? 'Häufige Fragen' : 'Frequently Asked'}
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-light text-charcoal">
                {lang === 'de' ? 'Noch Fragen?' : 'Still have questions?'}
              </h3>
              <p className="text-charcoal/50 text-sm font-body mt-1">
                {lang === 'de' ? 'Reservierungen, Zimmer, Öffnungszeiten und Events.' : 'Reservations, rooms, hours and events.'}
              </p>
            </div>
            <Link to="/faq" className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              {lang === 'de' ? 'Zur FAQ' : 'View FAQ'} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ── FINAL CTA */}
      <section className="py-16 sm:py-24 px-5 bg-ivory border-t border-stone-mid">
        <FadeUp>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-4">Krone Langenburg by Ammesso</p>
            <h2 className="font-display text-3xl sm:text-5xl font-light text-charcoal mb-3 leading-[1.05]">{c.cta_title}</h2>
            <p className="text-charcoal/50 font-body text-sm mb-8 max-w-sm mx-auto">{c.cta_sub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link to="/reserve"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-9 py-4 btn-gold rounded-full text-xs tracking-[0.2em] uppercase font-body font-semibold shadow-lg">
                <UtensilsCrossed className="w-3.5 h-3.5" /> {c.reserve}
              </Link>
              <a href={`tel:${s.phone}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-9 py-4 btn-ghost-gold rounded-full text-xs tracking-[0.2em] uppercase font-body font-semibold">
                <Phone className="w-3.5 h-3.5" /> {c.phone_cta}
              </a>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-charcoal/30 text-xs font-body flex-wrap">
              <MapPin className="w-3 h-3" />
              <span>{s.address_street} · {s.address_zip} {s.address_city}</span>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}