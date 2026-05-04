import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, UtensilsCrossed, BedDouble, Star, ChevronDown, Phone, Images, Heart, CalendarDays, Gift } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import { SITE_DEFAULTS } from '@/lib/siteData';
import { base44 } from '@/api/base44Client';

const HERO_IMAGES = [
  "https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/9adaad6b9_generated_image.png",
  "https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1800&q=85",
];

const IMAGES = {
  dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=80",
  pasta: "https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?w=800&q=80",
  room1: "https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/930ad0179_krone-kingsuite-1-zimmer-bett-tv-01.jpg",
  room2: "https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8c381b8e8_krone-kingsuite-2-zimmer-favorit-01.jpg",
  room3: "https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/d09aea914_krone-kingsuite-1-balkon-aussicht-01.jpg",
  chef: "https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp",
  wedding: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=80",
  schloss: "https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/9adaad6b9_generated_image.png",
  suite2: "https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg",
};

function useInView(threshold = 0.1) {
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
      hero_sub: 'Boutique-Hotel, Restaurant & Events im Herzen von Hohenlohe',
      reserve: 'Tisch reservieren',
      book_room: 'Zimmer buchen',
      discover: 'Langenburg entdecken',
      trust: ['Direktbuchung', 'Restaurant im Haus', 'Events & Hochzeiten', 'Historisches Langenburg'],
      welcome_eyebrow: 'Willkommen',
      welcome_title: 'Ein Haus mit Geschichte. Ein Ort mit Seele.',
      welcome_p: 'Das Krone Langenburg by Ammesso vereint historisches Flair mit mediterraner Gastfreundschaft. Mitten in der malerischen Altstadt Langenburgs — mit Blick auf Schloss und Jagsttal.',
      dining_eyebrow: 'Kulinarium by Ammesso',
      dining_title: 'Mediterrane Küche. Hohenloher Herz.',
      dining_p: 'Handgemachte Pasta, langsam geschmorte Fleischgerichte, frische Saisonzutaten. Jedes Gericht ist eine persönliche Geschichte.',
      menu_cta: 'Zur Speisekarte',
      rooms_eyebrow: 'Zimmer & Suiten',
      rooms_title: 'Schlafen, wo Geschichte wohnt.',
      rooms_p: 'Vier stilvolle Zimmer und Suiten mit individuellem Charakter — direkt bei uns buchen zum besten Preis.',
      rooms_trust: 'Direktbucher-Garantie · Kein Aufpreis · Frühstück auf Anfrage',
      rooms_cta: 'Zimmer & Preise',
      story_eyebrow: 'Omar Ammesso',
      story_title: 'Ein Traum, der schmeckt.',
      story_p: 'Aufgewachsen zwischen zwei Kulturen — Omar Ammesso bringt die Aromen des Mittelmeers nach Hohenlohe. Authentisch, leidenschaftlich, von Herzen.',
      story_cta: 'Unsere Geschichte',
      weddings_eyebrow: 'Hochzeiten & Events',
      weddings_title: 'Ihr besonderer Moment. Unser ganzes Herz.',
      weddings_p: 'Von der Traumhochzeit bis zum privaten Dinner — wir gestalten Ihren Anlass unvergesslich.',
      weddings_cta: 'Anfragen',
      discover_eyebrow: 'Langenburg entdecken',
      discover_title: 'Schloss, Jagsttal & Hohenlohe.',
      discover_p: 'Schloss Langenburg, Deutsches Automuseum, Jagsttal-Wanderwege — eine Region zum Entdecken.',
      discover_cta: 'Region entdecken',
      voucher_eyebrow: 'Gutscheine',
      voucher_title: 'Das Geschenk, das bleibt.',
      voucher_p: 'Verschenken Sie ein unvergessliches Erlebnis — Abendessen, Übernachtung oder beides. Gültig 2 Jahre.',
      voucher_cta: 'Gutschein kaufen',
      review_title: 'Was unsere Gäste sagen',
      cta_title: 'Bereit für einen Abend, den Sie nicht vergessen?',
      cta_sub: 'Reservieren Sie Ihren Tisch oder buchen Sie Ihr Zimmer — direkt, ohne Aufpreis.',
      phone_cta: 'Anrufen',
      address_label: 'Adresse',
    },
    en: {
      hero_sub: 'Boutique Hotel, Restaurant & Events in the Heart of Hohenlohe',
      reserve: 'Reserve a Table', book_room: 'Book a Room', discover: 'Discover Langenburg',
      trust: ['Direct Booking', 'On-site Restaurant', 'Events & Weddings', 'Historic Langenburg'],
      welcome_eyebrow: 'Welcome',
      welcome_title: 'A House with History. A Place with Soul.',
      welcome_p: 'Krone Langenburg by Ammesso combines historic charm with Mediterranean hospitality — in the heart of Langenburg\'s old town.',
      dining_eyebrow: 'Kulinarium by Ammesso',
      dining_title: 'Mediterranean Soul. Hohenlohe Heart.',
      dining_p: 'Handmade pasta, slow-braised meats, seasonal ingredients. Every dish is a personal story.',
      menu_cta: 'View Menu',
      rooms_eyebrow: 'Rooms & Suites',
      rooms_title: 'Sleep Where History Lives.',
      rooms_p: 'Four stylish rooms and suites with individual character — book directly for the best price.',
      rooms_trust: 'Direct booking guarantee · No fees · Breakfast on request',
      rooms_cta: 'Rooms & Rates',
      story_eyebrow: 'Omar Ammesso',
      story_title: 'A Dream That Tastes.',
      story_p: 'Raised between two cultures — Omar Ammesso brings the flavours of the Mediterranean to Hohenlohe.',
      story_cta: 'Our Story',
      weddings_eyebrow: 'Weddings & Events',
      weddings_title: 'Your Special Moment. Our Whole Heart.',
      weddings_p: 'From dream weddings to private dinners — we create unforgettable memories.',
      weddings_cta: 'Enquire',
      discover_eyebrow: 'Discover Langenburg',
      discover_title: 'Castle, Jagst Valley & Hohenlohe.',
      discover_p: 'Langenburg Castle, German Car Museum, Jagst Valley trails — a region to explore.',
      discover_cta: 'Explore Region',
      voucher_eyebrow: 'Gift Vouchers',
      voucher_title: 'The Gift That Lasts.',
      voucher_p: 'Give an unforgettable experience — dinner, overnight stay or both. Valid 2 years.',
      voucher_cta: 'Buy Voucher',
      review_title: 'What Our Guests Say',
      cta_title: "Ready for an evening you won't forget?",
      cta_sub: 'Reserve your table or book your room — directly, no fees.',
      phone_cta: 'Call Us',
      address_label: 'Address',
    },
  };
  const c = C[lang] || C.de;

  return (
    <div className="bg-white text-charcoal overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {HERO_IMAGES.map((src, i) => (
          <img key={src} src={src} alt={`Krone Langenburg ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover scale-[1.04] transition-all duration-[2000ms] ease-in-out ${heroReady && i === heroSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'}`}
            loading={i === 0 ? 'eager' : 'lazy'} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />

        <div className="relative z-10 text-center px-5 max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center pt-24">
          <div className={`transition-all duration-1000 delay-200 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 bg-[#C9A96E]/70" />
              <p className="text-[#C9A96E] text-[11px] tracking-[0.5em] uppercase font-body font-medium">Krone Langenburg by Ammesso</p>
              <div className="h-px w-10 bg-[#C9A96E]/70" />
            </div>
          </div>
          <div className={`transition-all duration-1000 delay-400 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h1 className="font-display text-5xl sm:text-7xl md:text-[88px] font-light text-white leading-[0.95] tracking-tight mb-6">
              Krone Langenburg
            </h1>
            <p className="text-white/80 text-base sm:text-lg font-body font-light leading-relaxed max-w-2xl mx-auto mb-10 px-4">
              {c.hero_sub}
            </p>
          </div>
          <div className={`transition-all duration-1000 delay-600 w-full max-w-sm sm:max-w-none ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
              <Link to="/reserve" className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-full text-sm tracking-[0.15em] uppercase font-body font-semibold transition-all shadow-lg">
                <UtensilsCrossed className="w-4 h-4" /> {c.reserve}
              </Link>
              <Link to="/rooms" className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/50 text-white rounded-full text-sm tracking-[0.15em] uppercase font-body font-semibold transition-all">
                <BedDouble className="w-4 h-4" /> {c.book_room}
              </Link>
              <Link to="/discover" className="w-full sm:w-auto flex items-center justify-center gap-2 text-white/70 hover:text-white text-sm font-body transition-colors">
                <MapPin className="w-4 h-4" /> {c.discover}
              </Link>
            </div>
          </div>
          {/* Dot nav */}
          <div className={`flex gap-2 transition-all duration-1000 delay-[800ms] ${heroReady ? 'opacity-100' : 'opacity-0'}`}>
            {HERO_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setHeroSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === heroSlide ? 'w-8 bg-[#C9A96E]' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className={`relative z-10 w-full mt-auto transition-all duration-1000 delay-[1000ms] ${heroReady ? 'opacity-100' : 'opacity-0'}`}>
          <div className="border-t border-white/15 bg-black/50 backdrop-blur-md">
            <div className="max-w-4xl mx-auto px-5 py-4 grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/15">
              {c.trust.map((item, i) => (
                <div key={i} className="px-4 text-center">
                  <p className="text-white/80 text-[11px] font-body tracking-wider">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-white/40 animate-bounce" />
        </div>
      </section>

      {/* ── WELCOME ── */}
      <section className="py-20 sm:py-28 px-5 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <p className="text-[#8B6914] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-5">{c.welcome_eyebrow}</p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-[#1C1714] mb-7 leading-[1.05]">{c.welcome_title}</h2>
            <p className="text-[#4A3F35] text-lg font-body leading-relaxed max-w-2xl mx-auto mb-8">{c.welcome_p}</p>
            <div className="flex items-center justify-center gap-3 text-[#1C1714]/40 text-sm font-body">
              <MapPin className="w-4 h-4 text-[#8B6914]/60" />
              <span>{s.address_street} · {s.address_zip} {s.address_city}</span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── HOURS STRIP ── */}
      <section className="border-y border-[#EDE6D8] bg-[#F7F3EC]">
        <div className="max-w-3xl mx-auto px-5 py-5 grid grid-cols-3 divide-x divide-[#EDE6D8]">
          {[
            { d: lang === 'de' ? 'Mo' : 'Mon', h: lang === 'de' ? 'Ruhetag' : 'Closed', dim: true },
            { d: lang === 'de' ? 'Di–Sa' : 'Tue–Sat', h: '12–14:30 · 17:30–22' },
            { d: lang === 'de' ? 'So' : 'Sun', h: '12:00–20:00' },
          ].map((item, i) => (
            <div key={i} className={`px-4 text-center ${item.dim ? 'opacity-40' : ''}`}>
              <p className="text-[#1C1714]/50 text-[10px] tracking-[0.3em] uppercase font-body mb-1">{item.d}</p>
              <p className="text-[#1C1714] text-sm font-body font-medium">{item.h}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DINING ── */}
      <section className="py-20 sm:py-28 px-5 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeUp>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden h-[400px] sm:h-[500px] shadow-xl">
                <img src={IMAGES.dining} alt="Kulinarium by Ammesso — Dining" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="absolute -bottom-5 -right-5 w-36 h-36 rounded-xl overflow-hidden shadow-lg border-4 border-white hidden sm:block">
                <img src={IMAGES.pasta} alt="Handgemachte Pasta" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="text-[#8B6914] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-5">{c.dining_eyebrow}</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-[#1C1714] mb-6 leading-[1.05]">{c.dining_title}</h2>
            <p className="text-[#4A3F35] text-lg font-body leading-relaxed mb-10">{c.dining_p}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/reserve" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-full text-sm tracking-[0.15em] uppercase font-body font-semibold transition-all">
                <UtensilsCrossed className="w-4 h-4" /> {c.reserve}
              </Link>
              <Link to="/menu" className="flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-[#8B6914] text-[#8B6914] hover:bg-[#F2E8D0] rounded-full text-sm tracking-[0.15em] uppercase font-body font-semibold transition-all">
                {c.menu_cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── ROOMS ── */}
      <section className="py-20 sm:py-28 px-5 bg-[#F7F3EC]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeUp className="order-2 lg:order-1">
            <p className="text-[#8B6914] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-5">{c.rooms_eyebrow}</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-[#1C1714] mb-6 leading-[1.05]">{c.rooms_title}</h2>
            <p className="text-[#4A3F35] text-lg font-body leading-relaxed mb-4">{c.rooms_p}</p>
            <div className="flex items-center gap-2 text-[#4A3F35]/60 text-sm font-body mb-10">
              <Star className="w-4 h-4 text-[#8B6914] fill-[#8B6914]/20 flex-shrink-0" />
              <span>{c.rooms_trust}</span>
            </div>
            <Link to="/rooms" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1C1714] hover:bg-[#2A2118] text-white rounded-full text-sm tracking-[0.15em] uppercase font-body font-semibold transition-all">
              {c.rooms_cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
          <FadeUp delay={150} className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden h-52 shadow-md"><img src={IMAGES.room1} alt="Deluxe Doppelzimmer" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" /></div>
                <div className="rounded-xl overflow-hidden h-36 shadow-md"><img src={IMAGES.suite2} alt="Panorama Langenburg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" /></div>
              </div>
              <div className="space-y-3 pt-6">
                <div className="rounded-xl overflow-hidden h-36 shadow-md"><img src={IMAGES.room3} alt="Balkon Aussicht" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" /></div>
                <div className="rounded-2xl overflow-hidden h-52 shadow-md"><img src={IMAGES.room2} alt="Superior Suite" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" /></div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CHEF / STORY ── */}
      <section className="py-20 sm:py-28 px-5 bg-[#1C1714]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 shadow-2xl">
              <img src={IMAGES.chef} alt="Chef Omar Ammesso" className="w-full h-full object-cover object-top" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1714]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="font-display text-2xl text-white font-light">Omar Ammesso</p>
                <p className="text-[#C9A96E] text-[10px] tracking-[0.35em] uppercase font-body mt-1">Chef & Founder · Krone Langenburg</p>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="text-[#C9A96E] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-5">{c.story_eyebrow}</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-white mb-6 leading-[1.05]">{c.story_title}</h2>
            <p className="text-white/65 text-lg font-body leading-relaxed mb-7">{c.story_p}</p>
            <blockquote className="border-l-2 border-[#C9A96E]/40 pl-5 font-display text-xl text-white/50 italic mb-8 leading-relaxed">
              {lang === 'de' ? '"Ich koche nicht für den Michelin-Stern. Ich koche dafür, dass du morgen wieder kommst."' : '"I don\'t cook for the Michelin star. I cook so you come back tomorrow."'}
            </blockquote>
            <Link to="/story" className="inline-flex items-center gap-2 text-[#C9A96E] text-sm tracking-[0.25em] uppercase font-body hover:gap-3 transition-all">
              {c.story_cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── WEDDINGS ── */}
      <section className="relative py-24 sm:py-32 px-5 overflow-hidden">
        <img src={IMAGES.wedding} alt="Hochzeiten & Events Krone Langenburg" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-[#1C1714]/70" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeUp>
            <p className="text-[#C9A96E] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-5">{c.weddings_eyebrow}</p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-white mb-5 leading-[1.05]">{c.weddings_title}</h2>
            <p className="text-white/65 text-lg font-body leading-relaxed mb-10 max-w-xl mx-auto">{c.weddings_p}</p>
            <Link to="/weddings" className="inline-flex items-center gap-2.5 px-9 py-4 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-full text-sm tracking-[0.15em] uppercase font-body font-semibold transition-all shadow-lg">
              {c.weddings_cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── DISCOVER ── */}
      <section className="py-20 sm:py-28 px-5 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <p className="text-[#8B6914] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-5">{c.discover_eyebrow}</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-[#1C1714] mb-6 leading-[1.05]">{c.discover_title}</h2>
            <p className="text-[#4A3F35] text-lg font-body leading-relaxed mb-10">{c.discover_p}</p>
            <Link to="/discover" className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-[#1C1714] text-[#1C1714] hover:bg-[#1C1714] hover:text-white rounded-full text-sm tracking-[0.15em] uppercase font-body font-semibold transition-all">
              {c.discover_cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
          <FadeUp delay={150}>
            <div className="rounded-2xl overflow-hidden h-80 shadow-xl">
              <img src={IMAGES.schloss} alt="Schloss Langenburg und Jagsttal" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── VOUCHER ── */}
      <section className="py-16 px-5 bg-[#F7F3EC] border-y border-[#EDE6D8]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <FadeUp className="sm:col-span-2">
            <p className="text-[#8B6914] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-3">{c.voucher_eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714] mb-3">{c.voucher_title}</h2>
            <p className="text-[#4A3F35] text-base font-body leading-relaxed">{c.voucher_p}</p>
          </FadeUp>
          <FadeUp delay={100} className="flex sm:justify-end">
            <Link to="/shop" className="inline-flex items-center gap-2 px-7 py-4 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-full text-sm tracking-[0.15em] uppercase font-body font-semibold transition-all shadow-md">
              <Gift className="w-4 h-4" /> {c.voucher_cta}
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      {reviews.length > 0 && (
        <section className="py-20 sm:py-24 px-5 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <FadeUp>
              <p className="text-[#8B6914] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-10">{c.review_title}</p>
              <div className="relative min-h-[160px]">
                {reviews.map((r, i) => (
                  <div key={i} className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${i === activeReview ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="flex gap-1 mb-5">
                      {[...Array(r.stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#8B6914] text-[#8B6914]" />)}
                    </div>
                    <p className="font-display text-xl sm:text-2xl font-light text-[#1C1714] italic leading-relaxed mb-4 max-w-2xl">
                      &ldquo;{lang === 'de' ? r.content_de : lang === 'en' ? r.content_en : r.content_it}&rdquo;
                    </p>
                    <p className="text-[#4A3F35]/50 text-sm font-body tracking-widest uppercase">— {r.name}</p>
                  </div>
                ))}
              </div>
              {reviews.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {reviews.map((_, i) => (
                    <button key={i} onClick={() => setActiveReview(i)}
                      className={`h-1.5 rounded-full transition-all ${i === activeReview ? 'w-8 bg-[#8B6914]' : 'w-2 bg-[#C8BEA8]'}`} />
                  ))}
                </div>
              )}
            </FadeUp>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section className="py-20 sm:py-28 px-5 bg-[#1C1714]">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUp>
            <p className="text-[#C9A96E] text-[11px] tracking-[0.5em] uppercase font-body font-medium mb-4">Krone Langenburg by Ammesso</p>
            <h2 className="font-display text-3xl sm:text-5xl font-light text-white mb-4 leading-[1.05]">{c.cta_title}</h2>
            <p className="text-white/55 font-body text-base mb-10 max-w-sm mx-auto">{c.cta_sub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
              <Link to="/reserve" className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-9 py-4 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-full text-sm tracking-[0.15em] uppercase font-body font-semibold shadow-lg transition-all">
                <UtensilsCrossed className="w-4 h-4" /> {c.reserve}
              </Link>
              <a href={`tel:${s.phone}`} className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-9 py-4 border-2 border-white/30 hover:border-white/60 text-white rounded-full text-sm tracking-[0.15em] uppercase font-body font-semibold transition-all">
                <Phone className="w-4 h-4" /> {c.phone_cta}
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/30 text-sm font-body">
              <MapPin className="w-3.5 h-3.5" />
              <span>{s.address_street} · {s.address_zip} {s.address_city}</span>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}