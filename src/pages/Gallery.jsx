import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { X, ChevronLeft, ChevronRight, UtensilsCrossed, BedDouble, Grid3X3, LayoutGrid, Maximize2, Play, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VIDEO_URL = 'https://media.base44.com/videos/public/69e1fb8a73bbccc7f63ef768/7f1d3de74_Unternehmensfilm.mp4';
const VIDEO_POSTER = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8e0419119_krone-kingsuite-1-zimmer-uebersicht-01.jpg';

const GALLERY = [
  // ── Zimmer ──
  // Einzelzimmer
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/d998a99a1_IMG_1644.jpg', cat: 'rooms', de: 'Einzelzimmer', en: 'Single Room' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/7f4a28fae_IMG_1646.jpg', cat: 'rooms', de: 'Einzelzimmer — Blick auf die Altstadt', en: 'Single Room — Old Town View' },
  // Doppelzimmer
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/46611ec66_krone-dz-bett-balkontuer-01.jpg', cat: 'rooms', de: 'Deluxe Doppelzimmer', en: 'Deluxe Double Room' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/7063cdda7_krone-dz-doppelbett-balkon-03.jpg', cat: 'rooms', de: 'Deluxe Doppelzimmer — Bett', en: 'Deluxe Double — Bed' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/3a179ef1d_krone-dz-zimmer-tv-fenster-02.jpg', cat: 'rooms', de: 'Deluxe Zimmer — Fensterblick', en: 'Deluxe Room — Window View' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/69a6d105a_krone-dz-aussicht-talblick-01.jpg', cat: 'rooms', de: 'Talblick aus dem Zimmer', en: 'Valley View from Room' },
  // King Suite 1
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8e0419119_krone-kingsuite-1-zimmer-uebersicht-01.jpg', cat: 'rooms', de: 'King Suite 1 — Übersicht', en: 'King Suite 1 — Overview' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/a8e3a47b0_krone-kingsuite-1-zimmer-wohnbereich-02.jpg', cat: 'rooms', de: 'King Suite 1 — Wohnbereich', en: 'King Suite 1 — Living Area' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/737cda4af_krone-kingsuite-1-aussicht-panorama-01.jpg', cat: 'rooms', de: 'King Suite 1 — Panorama', en: 'King Suite 1 — Panorama' },
  // King Suite 2
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8c381b8e8_krone-kingsuite-2-zimmer-favorit-01.jpg', cat: 'rooms', de: 'King Suite 2 — Signature', en: 'King Suite 2 — Signature' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/2d7d84b34_krone-kingsuite-2-aussicht-landschaft-01.jpg', cat: 'rooms', de: 'King Suite 2 — Landschaft', en: 'King Suite 2 — Landscape' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg', cat: 'rooms', de: 'Panorama Hohenlohe', en: 'Panorama Hohenlohe' },
  // ── Restaurant ──
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=90', cat: 'dining', de: 'Kulinarium — Abendstimmung', en: 'Kulinarium — Evening atmosphere' },
  { src: 'https://images.unsplash.com/photo-1551183053-bf91798d792e?w=1200&q=90', cat: 'dining', de: 'Handgemachte Pasta', en: 'Handmade Pasta' },
  { src: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=90', cat: 'dining', de: 'Mediterrane Küche', en: 'Mediterranean cuisine' },
  { src: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=90', cat: 'dining', de: 'Frische Zutaten', en: 'Fresh ingredients' },
  { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=90', cat: 'dining', de: 'Dessert & Dolce Vita', en: 'Dessert & Dolce Vita' },
  // ── Events ──
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=90', cat: 'events', de: 'Hochzeit & Feiern', en: 'Weddings & Events' },
  { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=90', cat: 'events', de: 'Festlich gedeckte Tafel', en: 'Festive table setting' },
  { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=90', cat: 'events', de: 'Champagner & Feier', en: 'Champagne & Celebration' },
  // ── Property ──
  { src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=90', cat: 'property', de: 'Krone Langenburg — Außenansicht', en: 'Krone Langenburg — Exterior' },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90', cat: 'property', de: 'Hohenlohe Landschaft', en: 'Hohenlohe landscape' },
  { src: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=1200&q=90', cat: 'property', de: 'Altstadt Langenburg', en: 'Langenburg Old Town' },
  // ── Team ──
  { src: 'https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp', cat: 'team', de: 'Chef Omar Ammesso', en: 'Chef Omar Ammesso' },
];

const CAT_LABELS = {
  de: { all: 'Alle', dining: 'Restaurant', rooms: 'Zimmer', events: 'Events', property: 'Das Haus', team: 'Team' },
  en: { all: 'All', dining: 'Restaurant', rooms: 'Rooms', events: 'Events', property: 'The Property', team: 'Team' },
  it: { all: 'Tutto', dining: 'Ristorante', rooms: 'Camere', events: 'Eventi', property: 'La struttura', team: 'Team' },
};
const CATS = ['all', 'dining', 'rooms', 'events', 'property', 'team'];

function Lightbox({ images, index, onClose, onPrev, onNext, lang }) {
  const img = images[index];
  if (!img) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all" onClick={onClose}>
        <X className="w-5 h-5" />
      </button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/40 text-xs font-body tracking-widest">{index + 1} / {images.length}</div>
      <button className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
        onClick={e => { e.stopPropagation(); onPrev(); }}><ChevronLeft className="w-5 h-5" /></button>
      <button className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
        onClick={e => { e.stopPropagation(); onNext(); }}><ChevronRight className="w-5 h-5" /></button>
      <div className="max-w-5xl w-full max-h-[90vh] px-16 sm:px-20 flex flex-col items-center" onClick={e => e.stopPropagation()}>
        <img src={img.src} alt={img[lang] || img.de} className="max-h-[78vh] max-w-full w-auto rounded-xl object-contain shadow-2xl" style={{ userSelect: 'none' }} />
        <p className="text-white/50 text-sm font-body mt-4 text-center">{img[lang] || img.de}</p>
      </div>
    </div>
  );
}

function VideoModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/97 flex flex-col items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="w-full max-w-5xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body">Krone Langenburg by Ammesso</p>
            <p className="text-white font-display text-xl font-light mt-0.5">Unternehmensfilm</p>
          </div>
          <button onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Video */}
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-black" style={{ aspectRatio: '16/9' }}>
          <video
            src={VIDEO_URL}
            poster={VIDEO_POSTER}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const { lang } = useLang();
  const [activecat, setActiveCat] = useState('all');
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [layout, setLayout] = useState('masonry');
  const [loaded, setLoaded] = useState({});
  const [showVideo, setShowVideo] = useState(false);
  const labels = CAT_LABELS[lang] || CAT_LABELS.de;

  const filtered = activecat === 'all' ? GALLERY : GALLERY.filter(g => g.cat === activecat);

  const openLightbox = useCallback((idx) => setLightboxIdx(idx), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(() => setLightboxIdx(i => (i - 1 + filtered.length) % filtered.length), [filtered.length]);
  const next = useCallback(() => setLightboxIdx(i => (i + 1) % filtered.length), [filtered.length]);

  useEffect(() => { setLightboxIdx(null); }, [activecat]);

  useEffect(() => {
    if (lightboxIdx === null && !showVideo) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { closeLightbox(); setShowVideo(false); }
      if (e.key === 'ArrowLeft' && lightboxIdx !== null) prev();
      if (e.key === 'ArrowRight' && lightboxIdx !== null) next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, showVideo, prev, next, closeLightbox]);

  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    touchStartX.current = null;
  };

  const t = {
    de: { title: 'Galerie', sub: 'Eindrücke aus Restaurant, Zimmern und besonderen Momenten.', reserve: 'Tisch reservieren', rooms: 'Zimmer ansehen', video_btn: 'Unternehmensfilm ansehen', video_hide: 'Film schließen' },
    en: { title: 'Gallery', sub: 'Impressions from our restaurant, rooms and special moments.', reserve: 'Reserve Table', rooms: 'View Rooms', video_btn: 'Watch Our Film', video_hide: 'Close Film' },
    it: { title: 'Galleria', sub: 'Impressioni dal ristorante, le camere e i momenti speciali.', reserve: 'Prenota tavolo', rooms: 'Vedi camere', video_btn: 'Guarda il film', video_hide: 'Chiudi' },
  }[lang] || { title: 'Galerie', sub: '', reserve: 'Tisch reservieren', rooms: 'Zimmer', video_btn: 'Unternehmensfilm', video_hide: 'Schließen' };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1714] pb-24 lg:pb-10">

      {/* Hero header */}
      <div className="relative overflow-hidden bg-[#1C1714] pt-[126px] lg:pt-[166px] pb-16 sm:pb-20 px-5">
        <img src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg"
          alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none select-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1714]/70 to-[#1C1714]/90" />
        <div className="relative max-w-4xl mx-auto text-center pt-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-[#C9A96E]/40" />
            <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body">Krone Langenburg by Ammesso</p>
            <div className="h-px w-8 bg-[#C9A96E]/40" />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-light text-white mb-3 leading-tight">{t.title}</h1>
          <p className="text-white/40 font-body text-sm max-w-md mx-auto mb-8">{t.sub}</p>

          {/* Video CTA button */}
          <button
            onClick={() => setShowVideo(true)}
            className="inline-flex items-center gap-3 px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-[#C9A96E]/60 text-white rounded-full text-sm font-body font-semibold tracking-wider transition-all backdrop-blur-sm group"
          >
            <div className="w-8 h-8 rounded-full bg-[#C9A96E] flex items-center justify-center flex-shrink-0 group-hover:bg-[#B8924A] transition-colors shadow-md">
              <Play className="w-3.5 h-3.5 text-white ml-0.5" />
            </div>
            {t.video_btn}
          </button>
        </div>
      </div>

      {/* Video preview strip */}
      <div className="bg-[#1C1714] border-t border-[#C9A96E]/10 px-5 pb-8">
        <div className="max-w-7xl mx-auto">
          <div
            onClick={() => setShowVideo(true)}
            className="relative rounded-2xl overflow-hidden cursor-pointer group max-w-3xl mx-auto"
            style={{ aspectRatio: '16/5' }}
          >
            <video src={VIDEO_URL} poster={VIDEO_POSTER} muted playsInline preload="metadata"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C1714]/60 via-transparent to-[#1C1714]/60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#C9A96E] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
                <div className="text-left">
                  <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body">Krone Langenburg</p>
                  <p className="text-white font-display text-xl font-light">Unternehmensfilm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-10 sm:py-12">

        {/* Controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CATS.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-body tracking-wider uppercase border transition-all ${activecat === cat
                  ? 'border-[#8B6914] bg-[#F2E8D0] text-[#8B6914]'
                  : 'border-[#EDE6D8] text-[#1C1714]/50 hover:border-[#C9A96E]/50 hover:text-[#1C1714]/75'}`}>
                {labels[cat] || cat}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-[#EDE6D8] shadow-sm">
            <button onClick={() => setLayout('masonry')}
              className={`p-2 rounded-lg transition-all ${layout === 'masonry' ? 'bg-[#8B6914]/15 text-[#8B6914]' : 'text-[#1C1714]/30 hover:text-[#1C1714]/60'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setLayout('grid')}
              className={`p-2 rounded-lg transition-all ${layout === 'grid' ? 'bg-[#8B6914]/15 text-[#8B6914]' : 'text-[#1C1714]/30 hover:text-[#1C1714]/60'}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-[10px] font-body tracking-widest uppercase mb-6 text-[#8A7A6A]">
          {filtered.length} {lang === 'de' ? 'Bilder' : lang === 'en' ? 'Photos' : 'Foto'}
        </p>

        {/* MASONRY */}
        {layout === 'masonry' && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-2 sm:gap-3 [column-fill:_balance]">
            {filtered.map((img, i) => (
              <div key={`${activecat}-${i}`}
                className="break-inside-avoid mb-2 sm:mb-3 relative rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(i)}>
                <img src={img.src} alt={img[lang] || img.de} loading="lazy"
                  onLoad={() => setLoaded(p => ({ ...p, [`${activecat}-${i}`]: true }))}
                  className={`w-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded[`${activecat}-${i}`] ? 'opacity-100' : 'opacity-0'}`} />
                {!loaded[`${activecat}-${i}`] && <div className="absolute inset-0 bg-[#EDE6D8] animate-pulse min-h-[150px]" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1714]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute inset-0 flex items-end p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <p className="text-white text-xs font-body leading-tight">{img[lang] || img.de}</p>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-7 h-7 bg-[#1C1714]/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Maximize2 className="w-3 h-3 text-[#C9A96E]/80" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GRID */}
        {layout === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {filtered.map((img, i) => (
              <div key={`${activecat}-grid-${i}`}
                className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(i)}>
                <img src={img.src} alt={img[lang] || img.de} loading="lazy"
                  onLoad={() => setLoaded(p => ({ ...p, [`grid-${activecat}-${i}`]: true }))}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded[`grid-${activecat}-${i}`] ? 'opacity-100' : 'opacity-0'}`} />
                {!loaded[`grid-${activecat}-${i}`] && <div className="absolute inset-0 bg-[#EDE6D8] animate-pulse" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1714]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-[10px] sm:text-xs font-body leading-tight line-clamp-2">{img[lang] || img.de}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#1C1714]/30 font-body text-sm">
            {lang === 'de' ? 'Keine Bilder in dieser Kategorie.' : 'No photos in this category.'}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="bg-white border border-[#EDE6D8] rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition-all">
            <UtensilsCrossed className="w-6 h-6 text-[#8B6914] mx-auto mb-3" />
            <h3 className="font-display text-xl font-light text-[#1C1714] mb-2">
              {lang === 'de' ? 'Erleben Sie das Kulinarium' : lang === 'en' ? 'Experience the Kulinarium' : 'Scopri il Kulinarium'}
            </h3>
            <p className="text-xs font-body text-[#8A7A6A] mb-5">
              {lang === 'de' ? 'Mediterrane Küche mit Herz und Seele.' : lang === 'en' ? 'Mediterranean cuisine with heart and soul.' : 'Cucina mediterranea con cuore e anima.'}
            </p>
            <Link to="/reserve" className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all">
              {t.reserve}
            </Link>
          </div>
          <div className="bg-white border border-[#EDE6D8] rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition-all">
            <BedDouble className="w-6 h-6 text-[#8B6914] mx-auto mb-3" />
            <h3 className="font-display text-xl font-light text-[#1C1714] mb-2">
              {lang === 'de' ? 'Komfortabel übernachten' : lang === 'en' ? 'Stay in comfort' : 'Soggiorno confortevole'}
            </h3>
            <p className="text-xs font-body text-[#8A7A6A] mb-5">
              {lang === 'de' ? 'Stilvoll schlafen im Herzen Hohenlohes.' : lang === 'en' ? 'Sleep stylishly in the heart of Hohenlohe.' : "Dormire con stile nel cuore dell'Hohenlohe."}
            </p>
            <Link to="/rooms" className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all">
              {t.rooms}
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <Lightbox images={filtered} index={lightboxIdx} onClose={closeLightbox} onPrev={prev} onNext={next} lang={lang} />
        </div>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}
      </AnimatePresence>
    </div>
  );
}