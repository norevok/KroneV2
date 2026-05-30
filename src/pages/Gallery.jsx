import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { X, ChevronLeft, ChevronRight, UtensilsCrossed, BedDouble, Grid3X3, LayoutGrid, Maximize2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VIDEO_URL = 'https://media.base44.com/videos/public/69e1fb8a73bbccc7f63ef768/7f1d3de74_Unternehmensfilm.mp4';

// Video preview: Omar portrait from Wix — correct branding poster
const VIDEO_POSTER = 'https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp';

// ── GALLERY — ONLY real uploaded KRONE images ──
// NO AI, NO Unsplash except genuine restaurant/event atmoshere that is non-identifiable
const GALLERY = [
  // ── Zimmer — Einzelzimmer ──
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/d998a99a1_IMG_1644.jpg', cat: 'rooms', de: 'Einzelzimmer', en: 'Single Room' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/7f4a28fae_IMG_1646.jpg', cat: 'rooms', de: 'Einzelzimmer — Altstadt-Blick', en: 'Single Room — Old Town View' },
  // ── Zimmer — Doppelzimmer ──
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/46611ec66_krone-dz-bett-balkontuer-01.jpg', cat: 'rooms', de: 'Deluxe Doppelzimmer', en: 'Deluxe Double Room' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/7063cdda7_krone-dz-doppelbett-balkon-03.jpg', cat: 'rooms', de: 'Deluxe Doppelzimmer — Bett', en: 'Deluxe Double — Bed' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/3a179ef1d_krone-dz-zimmer-tv-fenster-02.jpg', cat: 'rooms', de: 'Deluxe Zimmer — Fensterblick', en: 'Deluxe Room — Window View' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/69a6d105a_krone-dz-aussicht-talblick-01.jpg', cat: 'rooms', de: 'Talblick aus dem Zimmer', en: 'Valley View from Room' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/975fb81f7_krone-dz-dusche-regendusche-03.jpg', cat: 'rooms', de: 'Regendusche', en: 'Rain Shower' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/90854213e_krone-dz-badezimmer-waschbecken-01.jpg', cat: 'rooms', de: 'Badezimmer', en: 'Bathroom' },
  // ── King Suite 1 ──
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8e0419119_krone-kingsuite-1-zimmer-uebersicht-01.jpg', cat: 'rooms', de: 'King Suite 1 — Übersicht', en: 'King Suite 1 — Overview' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/a8e3a47b0_krone-kingsuite-1-zimmer-wohnbereich-02.jpg', cat: 'rooms', de: 'King Suite 1 — Wohnbereich', en: 'King Suite 1 — Living Area' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/463dc9086_krone-kingsuite-1-zimmer-bett-tv-01.jpg', cat: 'rooms', de: 'King Suite 1 — Schlafbereich', en: 'King Suite 1 — Bedroom' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/6d9bcf521_krone-kingsuite-1-zimmer-detail-01.jpg', cat: 'rooms', de: 'King Suite 1 — Detail', en: 'King Suite 1 — Detail' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/737cda4af_krone-kingsuite-1-aussicht-panorama-01.jpg', cat: 'rooms', de: 'King Suite 1 — Panorama', en: 'King Suite 1 — Panorama' },
  // ── King Suite 2 ──
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8c381b8e8_krone-kingsuite-2-zimmer-favorit-01.jpg', cat: 'rooms', de: 'King Suite 2 — Signature', en: 'King Suite 2 — Signature' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/1d910ed64_krone-kingsuite-2-zimmer-balkon-01.jpg', cat: 'rooms', de: 'King Suite 2 — Balkon', en: 'King Suite 2 — Balcony' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/9e7befb58_krone-kingsuite-2-zimmer-detail-02.jpg', cat: 'rooms', de: 'King Suite 2 — Detail', en: 'King Suite 2 — Detail' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/2d7d84b34_krone-kingsuite-2-aussicht-landschaft-01.jpg', cat: 'rooms', de: 'King Suite 2 — Landschaft', en: 'King Suite 2 — Landscape' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg', cat: 'rooms', de: 'Panorama Hohenlohe', en: 'Panorama Hohenlohe' },
  { src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/6730c558e_krone-kingsuite-2-aussicht-landschaft-02.jpg', cat: 'rooms', de: 'Hohenloher Landschaft', en: 'Hohenlohe Landscape' },
  // ── Team ──
  { src: 'https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp', cat: 'team', de: 'Chef Omar Ammesso', en: 'Chef Omar Ammesso' },
];

const CAT_LABELS = {
  de: { all: 'Alle', rooms: 'Zimmer & Suiten', team: 'Team' },
  en: { all: 'All', rooms: 'Rooms & Suites', team: 'Team' },
  it: { all: 'Tutto', rooms: 'Camere & Suite', team: 'Team' },
};
const CATS = ['all', 'rooms', 'team'];

function Lightbox({ images, index, onClose, onPrev, onNext, lang }) {
  const img = images[index];
  if (!img) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center"
      onClick={onClose}
    >
      <button className="absolute top-5 right-5 z-10 w-11 h-11 flex items-center justify-center text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all" onClick={onClose}>
        <X className="w-5 h-5" />
      </button>
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/35 text-xs font-body tracking-[0.2em]">{index + 1} / {images.length}</div>
      <button className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
        onClick={e => { e.stopPropagation(); onPrev(); }}><ChevronLeft className="w-5 h-5" /></button>
      <button className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
        onClick={e => { e.stopPropagation(); onNext(); }}><ChevronRight className="w-5 h-5" /></button>
      <div className="max-w-5xl w-full max-h-[90vh] px-16 sm:px-24 flex flex-col items-center" onClick={e => e.stopPropagation()}>
        <img src={img.src} alt={img[lang] || img.de} className="max-h-[78vh] max-w-full w-auto rounded-2xl object-contain shadow-2xl" style={{ userSelect: 'none' }} />
        <p className="text-white/45 text-sm font-body mt-5 text-center tracking-wide">{img[lang] || img.de}</p>
      </div>
    </motion.div>
  );
}

function VideoModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/98 flex flex-col items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="w-full max-w-5xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[#B08A42] text-[10px] tracking-[0.4em] uppercase font-body">Krone Langenburg by Ammesso</p>
            <p className="text-white font-display text-2xl font-light mt-1">Unternehmensfilm</p>
          </div>
          <button onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-black" style={{ aspectRatio: '16/9' }}>
          <video
            src={VIDEO_URL}
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
    de: { title: 'Galerie', sub: 'Eindrücke aus unseren Zimmern, Suiten und dem Krone-Erlebnis.', reserve: 'Tisch reservieren', rooms: 'Zimmer ansehen', video_btn: 'Unternehmensfilm ansehen' },
    en: { title: 'Gallery', sub: 'Impressions from our rooms, suites and the Krone experience.', reserve: 'Reserve Table', rooms: 'View Rooms', video_btn: 'Watch Our Film' },
    it: { title: 'Galleria', sub: 'Impressioni dalle camere, suite e dall\'esperienza Krone.', reserve: 'Prenota tavolo', rooms: 'Vedi camere', video_btn: 'Guarda il film' },
  }[lang] || { title: 'Galerie', sub: 'Eindrücke aus unseren Zimmern, Suiten und dem Krone-Erlebnis.', reserve: 'Tisch reservieren', rooms: 'Zimmer ansehen', video_btn: 'Unternehmensfilm ansehen' };

  return (
    <div className="min-h-screen bg-[#F7F2EA] text-[#1A1A1A] pb-24 lg:pb-10">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-[#171311] page-top pb-16 sm:pb-20 px-5">
        <img src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/46611ec66_krone-dz-bett-balkontuer-01.jpg"
          alt="Krone Langenburg — Galerie"
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none select-none" style={{ objectPosition: '50% 40%' }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#171311]/55 to-[#171311]/88" />
        <div className="relative max-w-4xl mx-auto text-center pt-8">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-[#B08A42]/50" />
            <p className="text-[#B08A42] text-[10px] tracking-[0.5em] uppercase font-body">Krone Langenburg by Ammesso</p>
            <div className="h-px w-10 bg-[#B08A42]/50" />
          </div>
          <h1 className="font-display font-light text-white mb-4"
              style={{ fontSize: 'clamp(2.25rem, 4.2vw, 4rem)', lineHeight: '1.05' }}>{t.title}</h1>
          <p className="text-white/55 font-body text-sm sm:text-base max-w-md mx-auto mb-10">{t.sub}</p>

          {/* Video CTA — clean centered button */}
          <button
            onClick={() => setShowVideo(true)}
            className="inline-flex items-center gap-4 px-8 py-4 bg-[#B08A42]/20 hover:bg-[#B08A42]/30 border border-[#B08A42]/40 hover:border-[#B08A42]/70 text-white rounded-2xl text-sm font-body font-semibold tracking-wide transition-all backdrop-blur-sm group"
          >
            <div className="w-10 h-10 rounded-full bg-[#B08A42] flex items-center justify-center flex-shrink-0 group-hover:bg-[#9E7A38] transition-colors shadow-lg">
              <Play className="w-4 h-4 text-white ml-0.5" />
            </div>
            <div className="text-left">
              <p className="text-[#B08A42] text-[9px] tracking-[0.3em] uppercase font-body mb-0.5">Krone Langenburg</p>
              <p className="text-white font-display text-base font-light">
                    {lang === 'de' ? 'Unternehmensfilm ansehen' : lang === 'en' ? 'Watch Our Film' : 'Guarda il film'}
                  </p>
            </div>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-10 sm:py-12">

        {/* ── Controls row ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10">
          <div className="flex flex-wrap gap-2">
            {CATS.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs font-body tracking-wider uppercase border transition-all ${activecat === cat
                  ? 'border-[#B08A42] bg-[#B08A42] text-white shadow-md'
                  : 'border-[#D7D0C5] text-[#4A4A4A] hover:border-[#B08A42]/60 hover:text-[#1A1A1A] bg-white'}`}>
                {labels[cat] || cat}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-[#D7D0C5] shadow-sm">
            <button onClick={() => setLayout('masonry')}
              className={`p-2 rounded-lg transition-all ${layout === 'masonry' ? 'bg-[#B08A42]/15 text-[#B08A42]' : 'text-[#4A4A4A]/50 hover:text-[#1A1A1A]'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setLayout('grid')}
              className={`p-2 rounded-lg transition-all ${layout === 'grid' ? 'bg-[#B08A42]/15 text-[#B08A42]' : 'text-[#4A4A4A]/50 hover:text-[#1A1A1A]'}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-[10px] font-body tracking-[0.3em] uppercase mb-7 text-[#4A4A4A]/60">
          {filtered.length} {lang === 'de' ? 'Fotos' : lang === 'en' ? 'Photos' : 'Foto'}
        </p>

        {/* ── MASONRY ── */}
        {layout === 'masonry' && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-2.5 sm:gap-3 [column-fill:_balance]">
            {filtered.map((img, i) => (
              <div key={`${activecat}-${i}`}
                className="break-inside-avoid mb-2.5 sm:mb-3 relative rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(i)}>
                <img src={img.src} alt={img[lang] || img.de} loading="lazy"
                  onLoad={() => setLoaded(p => ({ ...p, [`${activecat}-${i}`]: true }))}
                  className={`w-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded[`${activecat}-${i}`] ? 'opacity-100' : 'opacity-0'}`} />
                {!loaded[`${activecat}-${i}`] && <div className="absolute inset-0 bg-[#EFE7DA] animate-pulse min-h-[160px]" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#171311]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute inset-0 flex items-end p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <p className="text-white text-xs font-body leading-tight font-medium">{img[lang] || img.de}</p>
                </div>
                <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-[#171311]/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    <Maximize2 className="w-3.5 h-3.5 text-[#B08A42]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── GRID ── */}
        {layout === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
            {filtered.map((img, i) => (
              <div key={`${activecat}-grid-${i}`}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(i)}>
                <img src={img.src} alt={img[lang] || img.de} loading="lazy"
                  onLoad={() => setLoaded(p => ({ ...p, [`grid-${activecat}-${i}`]: true }))}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded[`grid-${activecat}-${i}`] ? 'opacity-100' : 'opacity-0'}`} />
                {!loaded[`grid-${activecat}-${i}`] && <div className="absolute inset-0 bg-[#EFE7DA] animate-pulse" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#171311]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-[11px] sm:text-xs font-body leading-tight line-clamp-2 font-medium">{img[lang] || img.de}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#4A4A4A]/40 font-body text-sm">
            {lang === 'de' ? 'Keine Fotos in dieser Kategorie.' : lang === 'en' ? 'No photos in this category.' : 'Nessuna foto in questa categoria.'}
          </div>
        )}

        {/* ── CTAs ── */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white border border-[#D7D0C5] rounded-2xl p-7 sm:p-9 text-center hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-full bg-[#B08A42]/10 border border-[#B08A42]/20 flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-5 h-5 text-[#B08A42]" />
            </div>
            <h3 className="font-display text-2xl font-light text-[#1A1A1A] mb-2">
              {lang === 'de' ? 'Restaurant erleben' : lang === 'en' ? 'Experience the Restaurant' : 'Scopri il Ristorante'}
            </h3>
            <p className="text-sm font-body text-[#4A4A4A] mb-6 leading-relaxed">
              {lang === 'de' ? 'Mediterrane Küche mit Herz und Seele.' : lang === 'en' ? 'Mediterranean cuisine with heart and soul.' : 'Cucina mediterranea con cuore e anima.'}
            </p>
            <Link to="/reserve" className="inline-flex items-center gap-2 px-7 py-3 bg-[#B08A42] hover:bg-[#9E7A38] text-white rounded-lg text-xs tracking-widest uppercase font-body font-bold transition-all shadow-md hover:-translate-y-px">
              {t.reserve}
            </Link>
          </div>
          <div className="bg-[#171311] border border-[#B08A42]/15 rounded-2xl p-7 sm:p-9 text-center hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-full bg-[#B08A42]/15 border border-[#B08A42]/30 flex items-center justify-center mx-auto mb-4">
              <BedDouble className="w-5 h-5 text-[#B08A42]" />
            </div>
            <h3 className="font-display text-2xl font-light text-white mb-2">
              {lang === 'de' ? 'Zimmer & Suiten' : lang === 'en' ? 'Rooms & Suites' : 'Camere & Suite'}
            </h3>
            <p className="text-sm font-body text-white/55 mb-6 leading-relaxed">
              {lang === 'de' ? 'Stilvoll übernachten im Herzen Hohenlohes.' : lang === 'en' ? 'Sleep in style in the heart of Hohenlohe.' : "Dormite con stile nel cuore dell'Hohenlohe."}
            </p>
            <Link to="/rooms" className="inline-flex items-center gap-2 px-7 py-3 bg-[#B08A42] hover:bg-[#9E7A38] text-white rounded-lg text-xs tracking-widest uppercase font-body font-bold transition-all shadow-md hover:-translate-y-px">
              {t.rooms}
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <Lightbox images={filtered} index={lightboxIdx} onClose={closeLightbox} onPrev={prev} onNext={next} lang={lang} />
          </div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}
      </AnimatePresence>
    </div>
  );
}