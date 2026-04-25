import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { X, ChevronLeft, ChevronRight, UtensilsCrossed, BedDouble, Grid3X3, LayoutGrid, Maximize2 } from 'lucide-react';

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=90",
    thumb: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80",
    cat: 'dining', span: 'col-span-2 row-span-2',
    de: 'Kulinarium — Abendstimmung', en: 'Kulinarium — Evening atmosphere', it: 'Kulinarium — Atmosfera serale'
  },
  {
    src: "https://images.unsplash.com/photo-1551183053-bf91798d792e?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1551183053-bf91798d792e?w=600&q=80",
    cat: 'dining', span: '',
    de: 'Handgemachte Pasta', en: 'Handmade Pasta', it: 'Pasta fatta a mano'
  },
  {
    src: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80",
    cat: 'dining', span: '',
    de: 'Mediterrane Küche', en: 'Mediterranean cuisine', it: 'Cucina mediterranea'
  },
  {
    src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80",
    cat: 'dining', span: 'col-span-2',
    de: 'Frische Zutaten', en: 'Fresh ingredients', it: 'Ingredienti freschi'
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
    cat: 'dining', span: '',
    de: 'Dessert & Dolce Vita', en: 'Dessert & Dolce Vita', it: 'Dessert & Dolce Vita'
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    cat: 'dining', span: '',
    de: 'Antipasti & Vorspeisen', en: 'Antipasti & Starters', it: 'Antipasti'
  },
  {
    src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    cat: 'rooms', span: '',
    de: 'Deluxe Einzelzimmer', en: 'Deluxe Single Room', it: 'Camera Singola Deluxe'
  },
  {
    src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80",
    cat: 'rooms', span: 'col-span-2',
    de: 'Deluxe Doppelzimmer', en: 'Deluxe Double Room', it: 'Camera Doppia Deluxe'
  },
  {
    src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
    cat: 'rooms', span: 'row-span-2',
    de: 'King Suite', en: 'King Suite', it: 'King Suite'
  },
  {
    src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80",
    cat: 'rooms', span: '',
    de: 'Badezimmer Detail', en: 'Bathroom Detail', it: 'Dettaglio bagno'
  },
  {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=90",
    thumb: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=700&q=80",
    cat: 'events', span: 'col-span-2 row-span-2',
    de: 'Hochzeit & Feiern', en: 'Weddings & Events', it: 'Matrimoni & eventi'
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
    cat: 'events', span: '',
    de: 'Festlich gedeckte Tafel', en: 'Festive table setting', it: 'Tavola imbandita'
  },
  {
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    cat: 'events', span: '',
    de: 'Champagner & Feier', en: 'Champagne & Celebration', it: 'Champagne & Festa'
  },
  {
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
    cat: 'property', span: 'col-span-2',
    de: 'Krone Langenburg — Außenansicht', en: 'Krone Langenburg — Exterior', it: 'Krone Langenburg — Esterno'
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    cat: 'property', span: '',
    de: 'Hohenlohe Landschaft', en: 'Hohenlohe landscape', it: 'Paesaggio Hohenlohe'
  },
  {
    src: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=600&q=80",
    cat: 'property', span: '',
    de: 'Altstadt Langenburg', en: 'Langenburg Old Town', it: 'Centro storico di Langenburg'
  },
  {
    src: "https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp",
    thumb: "https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp",
    cat: 'team', span: 'row-span-2',
    de: 'Chef Omar Ammesso', en: 'Chef Omar Ammesso', it: 'Chef Omar Ammesso'
  },
];

const CAT_LABELS = {
  de: { all: 'Alle', dining: 'Restaurant', rooms: 'Zimmer', events: 'Events', property: 'Das Haus', team: 'Team' },
  en: { all: 'All', dining: 'Restaurant', rooms: 'Rooms', events: 'Events', property: 'The Property', team: 'Team' },
  it: { all: 'Tutto', dining: 'Ristorante', rooms: 'Camere', events: 'Eventi', property: 'La struttura', team: 'Team' },
};

const CATS = ['all', 'dining', 'rooms', 'events', 'property', 'team'];

// Lightbox component
function Lightbox({ images, index, onClose, onPrev, onNext, lang }) {
  const img = images[index];
  if (!img) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}>
      {/* Close */}
      <button className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
        onClick={onClose}>
        <X className="w-5 h-5" />
      </button>
      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/40 text-xs font-body tracking-widest">
        {index + 1} / {images.length}
      </div>
      {/* Nav */}
      <button className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
        onClick={e => { e.stopPropagation(); onPrev(); }}>
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
        onClick={e => { e.stopPropagation(); onNext(); }}>
        <ChevronRight className="w-5 h-5" />
      </button>
      {/* Image */}
      <div className="max-w-5xl w-full max-h-[90vh] px-16 sm:px-20 flex flex-col items-center"
        onClick={e => e.stopPropagation()}>
        <img src={img.src} alt={img.de}
          className="max-h-[78vh] max-w-full w-auto rounded-xl object-contain shadow-2xl"
          style={{ userSelect: 'none' }} />
        <p className="text-white/50 text-sm font-body mt-4 text-center">{img[lang] || img.de}</p>
      </div>
    </div>
  );
}

export default function Gallery() {
  const { lang } = useLang();
  const [activecat, setActiveCat] = useState('all');
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [layout, setLayout] = useState('masonry'); // 'masonry' | 'grid'
  const [loaded, setLoaded] = useState({});
  const labels = CAT_LABELS[lang] || CAT_LABELS.de;

  const filtered = activecat === 'all' ? GALLERY : GALLERY.filter(g => g.cat === activecat);

  const openLightbox = useCallback((idx) => setLightboxIdx(idx), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(() => setLightboxIdx(i => (i - 1 + filtered.length) % filtered.length), [filtered.length]);
  const next = useCallback(() => setLightboxIdx(i => (i + 1) % filtered.length), [filtered.length]);

  // Reset lightbox index on filter change
  useEffect(() => { setLightboxIdx(null); }, [activecat]);

  // Keyboard nav
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, prev, next, closeLightbox]);

  // Touch swipe support for lightbox
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    touchStartX.current = null;
  };

  const t = {
    de: { title: 'Galerie', sub: 'Eindrücke aus Restaurant, Zimmern und besonderen Momenten.', reserve: 'Tisch reservieren', rooms: 'Zimmer ansehen', explore: 'Entdecken' },
    en: { title: 'Gallery', sub: 'Impressions from our restaurant, rooms and special moments.', reserve: 'Reserve Table', rooms: 'View Rooms', explore: 'Explore' },
    it: { title: 'Galleria', sub: 'Impressioni dal ristorante, le camere e i momenti speciali.', reserve: 'Prenota tavolo', rooms: 'Vedi camere', explore: 'Scopri' },
  }[lang] || { title: 'Galerie', sub: '', reserve: 'Tisch reservieren', rooms: 'Zimmer', explore: 'Entdecken' };

  return (
    <div className="min-h-screen bg-charcoal text-ivory pb-24 lg:pb-10">

      {/* Hero header */}
      <div className="relative overflow-hidden bg-espresso pt-20 sm:pt-24 pb-12 sm:pb-16 px-5 border-b border-[#C9A96E]/10">
        {/* Subtle background image */}
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=60"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-8 pointer-events-none select-none"
          style={{ opacity: 0.06 }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/80 to-espresso" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-gold/40" />
            <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-body">Krone Langenburg by Ammesso</p>
            <div className="h-px w-8 bg-gold/40" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-ivory mb-3 leading-[0.95]">
            {t.title}
          </h1>
          <p className="text-ivory/40 font-body text-sm max-w-md mx-auto mt-3">{t.sub}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-10 sm:py-12">

        {/* Controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10">
          {/* Category filters */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CATS.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-body tracking-wider uppercase border transition-all ${activecat === cat
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-[#C9A96E]/15 text-ivory/40 hover:border-[#C9A96E]/30 hover:text-ivory/60'}`}>
                {labels[cat] || cat}
              </button>
            ))}
          </div>
          {/* Layout toggle */}
          <div className="flex gap-1 bg-espresso rounded-xl p-1 border border-[#C9A96E]/10">
            <button onClick={() => setLayout('masonry')}
              className={`p-2 rounded-lg transition-all ${layout === 'masonry' ? 'bg-gold/20 text-gold' : 'text-ivory/30 hover:text-ivory/60'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setLayout('grid')}
              className={`p-2 rounded-lg transition-all ${layout === 'grid' ? 'bg-gold/20 text-gold' : 'text-ivory/30 hover:text-ivory/60'}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Count */}
        <p className="text-ivory/20 text-[10px] font-body tracking-widest uppercase mb-6">
          {filtered.length} {lang === 'de' ? 'Bilder' : lang === 'en' ? 'Photos' : 'Foto'}
        </p>

        {/* MASONRY LAYOUT */}
        {layout === 'masonry' && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-2 sm:gap-3 [column-fill:_balance]">
            {filtered.map((img, i) => (
              <div key={`${activecat}-${i}`}
                className="break-inside-avoid mb-2 sm:mb-3 relative rounded-xl overflow-hidden group cursor-pointer"
                style={{ animationDelay: `${i * 30}ms` }}
                onClick={() => openLightbox(i)}>
                <img
                  src={img.thumb}
                  alt={img[lang] || img.de}
                  loading="lazy"
                  onLoad={() => setLoaded(p => ({ ...p, [`${activecat}-${i}`]: true }))}
                  className={`w-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded[`${activecat}-${i}`] ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* Skeleton */}
                {!loaded[`${activecat}-${i}`] && (
                  <div className="absolute inset-0 bg-stone-warm animate-pulse min-h-[150px]" />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute inset-0 flex items-end p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div>
                    <p className="text-ivory text-xs font-body leading-tight">{img[lang] || img.de}</p>
                  </div>
                </div>
                {/* Expand icon */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-7 h-7 bg-charcoal/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Maximize2 className="w-3 h-3 text-gold/80" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GRID LAYOUT */}
        {layout === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {filtered.map((img, i) => (
              <div key={`${activecat}-grid-${i}`}
                className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(i)}>
                <img
                  src={img.thumb}
                  alt={img[lang] || img.de}
                  loading="lazy"
                  onLoad={() => setLoaded(p => ({ ...p, [`grid-${activecat}-${i}`]: true }))}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded[`grid-${activecat}-${i}`] ? 'opacity-100' : 'opacity-0'}`}
                />
                {!loaded[`grid-${activecat}-${i}`] && (
                  <div className="absolute inset-0 bg-stone-warm animate-pulse" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-ivory text-[10px] sm:text-xs font-body leading-tight line-clamp-2">{img[lang] || img.de}</p>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 bg-charcoal/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Maximize2 className="w-3 h-3 text-gold/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-ivory/30 font-body text-sm">
            {lang === 'de' ? 'Keine Bilder in dieser Kategorie.' : lang === 'en' ? 'No photos in this category.' : 'Nessuna foto in questa categoria.'}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-6 sm:p-8 text-center hover:border-[#C9A96E]/25 transition-all">
            <UtensilsCrossed className="w-6 h-6 text-gold/60 mx-auto mb-3" />
            <h3 className="font-display text-xl font-light text-ivory mb-2">
              {lang === 'de' ? 'Erleben Sie das Kulinarium' : lang === 'en' ? 'Experience the Kulinarium' : 'Scopri il Kulinarium'}
            </h3>
            <p className="text-ivory/40 text-xs font-body mb-5">
              {lang === 'de' ? 'Mediterrane Küche mit Herz und Seele.' : lang === 'en' ? 'Mediterranean cuisine with heart and soul.' : 'Cucina mediterranea con cuore e anima.'}
            </p>
            <Link to="/reserve" className="inline-flex items-center gap-1.5 px-6 py-2.5 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
              {t.reserve}
            </Link>
          </div>
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-6 sm:p-8 text-center hover:border-[#C9A96E]/25 transition-all">
            <BedDouble className="w-6 h-6 text-gold/60 mx-auto mb-3" />
            <h3 className="font-display text-xl font-light text-ivory mb-2">
              {lang === 'de' ? 'Komfortabel übernachten' : lang === 'en' ? 'Stay in comfort' : 'Soggiorno confortevole'}
            </h3>
            <p className="text-ivory/40 text-xs font-body mb-5">
              {lang === 'de' ? 'Stilvoll schlafen im Herzen Hohenlohes.' : lang === 'en' ? 'Sleep stylishly in the heart of Hohenlohe.' : 'Dormire con stile nel cuore dell\'Hohenlohe.'}
            </p>
            <Link to="/rooms" className="inline-flex items-center gap-1.5 px-6 py-2.5 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
              {t.rooms}
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <Lightbox
            images={filtered}
            index={lightboxIdx}
            onClose={closeLightbox}
            onPrev={prev}
            onNext={next}
            lang={lang}
          />
        </div>
      )}
    </div>
  );
}