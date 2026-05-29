import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { SITE_DEFAULTS, ROOMS } from '@/lib/siteData';
import { Star, Coffee, CheckCircle, AlertCircle, ExternalLink, Wifi, Bath, Wind, MapPin, ArrowRight, BedDouble, Users, CalendarDays, Phone, ChevronRight, Navigation, Check, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

const MAPS_URL = 'https://maps.app.goo.gl/GF5S8i2vASmpA7jUA';
const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2604.2316221936717!2d9.8452029!3d49.2530556!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47985de90735ea63%3A0x86445a21b13205c1!2sKrone%20Langenburg%20by%20Ammesso!5e0!3m2!1sde!2sth!4v1779880134107!5m2!1sde!2sth';

// ── ROOM PHOTO LIBRARY ──
const ROOM_PHOTOS = {
  deluxe_single: [
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/d998a99a1_IMG_1644.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/7f4a28fae_IMG_1646.jpg',
  ],
  deluxe_double: [
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/46611ec66_krone-dz-bett-balkontuer-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/7063cdda7_krone-dz-doppelbett-balkon-03.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/3a179ef1d_krone-dz-zimmer-tv-fenster-02.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/69a6d105a_krone-dz-aussicht-talblick-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/975fb81f7_krone-dz-dusche-regendusche-03.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/90854213e_krone-dz-badezimmer-waschbecken-01.jpg',
  ],
  superior_suite: [
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8e0419119_krone-kingsuite-1-zimmer-uebersicht-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/a8e3a47b0_krone-kingsuite-1-zimmer-wohnbereich-02.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/463dc9086_krone-kingsuite-1-zimmer-bett-tv-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/6d9bcf521_krone-kingsuite-1-zimmer-detail-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/737cda4af_krone-kingsuite-1-aussicht-panorama-01.jpg',
  ],
  superior_suite_2: [
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/1d910ed64_krone-kingsuite-2-zimmer-balkon-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/9e7befb58_krone-kingsuite-2-zimmer-detail-02.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/2d7d84b34_krone-kingsuite-2-aussicht-landschaft-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/6730c558e_krone-kingsuite-2-aussicht-landschaft-02.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg',
  ],
};

export default function Rooms() {
  const { lang } = useLang();
  const [showBooking, setShowBooking] = useState(false);
  const [activePhotos, setActivePhotos] = useState({});
  const [savingIntent, setSavingIntent] = useState(false);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  const today = new Date().toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);

  // Hero Slider Bilder - Hochwertige, scharfe Aufnahmen
  const HERO_IMAGES = [
    {
      src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8c381b8e8_krone-kingsuite-2-zimmer-favorit-01.jpg',
      alt: 'King Suite Zimmer Krone Langenburg by Ammesso',
      pos: '50% 50%',
      blur: 0
    },
    {
      src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/46611ec66_krone-dz-bett-balkontuer-01.jpg',
      alt: 'Doppelzimmer mit Balkontür Krone Langenburg',
      pos: '50% 45%',
      blur: 0
    },
    {
      src: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/69a6d105a_krone-dz-aussicht-talblick-01.jpg',
      alt: 'Doppelzimmer mit Stadtblick Krone Langenburg',
      pos: '50% 50%',
      blur: 0
    }
  ];

  const params = new URLSearchParams(window.location.search);
  const returnState = params.get('return');
  const intentRef = params.get('ref');

  const beds24Base = SITE_DEFAULTS.beds24_booking_url;
  const minCheckout = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
    : new Date(new Date().getTime() + 86400000).toISOString().split('T')[0];

  // Auto-Slider für Hero
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex(prev => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  async function handleBookNow(roomId = null) {
    setSavingIntent(true);
    const ref = `INT-${Date.now().toString(36).toUpperCase()}`;
    let token = '';
    try {
      const tokenRes = await base44.functions.invoke('generateBookingToken', { check_in: checkIn, check_out: checkOut, adults, room_category: roomId || '' });
      token = tokenRes?.data?.token || '';
    } catch (_) {}

    const p = new URLSearchParams();
    if (lang !== 'de') p.set('lang', lang);
    if (checkIn) p.set('checkin', checkIn);
    if (checkOut) p.set('checkout', checkOut);
    if (adults) p.set('adults', adults);
    if (token) p.set('referer', token);
    const beds24Url = `${beds24Base}&${p.toString()}`;

    base44.entities.HotelBookingIntent.create({
      intent_ref: ref, status: 'redirected_to_beds24', language: lang,
      source_page: 'rooms', room_category_interest: roomId || '',
      beds24_booking_url_used: beds24Url, redirected_at: new Date().toISOString(),
    }).catch(() => {});

    setSavingIntent(false);
    setShowBooking(true);
  }

  const beds24EmbedUrl = `${beds24Base}&lang=${lang}&iframe=1${checkIn ? `&checkin=${checkIn}` : ''}${checkOut ? `&checkout=${checkOut}` : ''}&adults=${adults}`;

  const T = {
    de: {
      eyebrow: 'Unterkunft', title: 'Zimmer & Suiten',
      subtitle: 'Stilvoll übernachten im historischen Herzen Hohenlohes.',
      checkin: 'Anreise', checkout: 'Abreise', adults_label: 'Erwachsene',
      check_avail: 'Verfügbarkeit prüfen',
      direct_title: 'Warum direkt buchen?',
      benefit1_t: 'Beste Preisgarantie', benefit1: 'Günstigster Preis — keine Drittanbieter-Aufschläge.',
      benefit2_t: 'Persönlicher Kontakt', benefit2: 'Direkt mit unserem Team — Sonderwünsche willkommen.',
      benefit3_t: 'Historisches Haus', benefit3: 'Schlafen in einem denkmalgeschützten Haus mit Geschichte.',
      benefit4_t: 'Restaurant vor der Tür', benefit4: 'Mediterran speisen direkt im Haus.',
      breakfast: 'Frühstück auf Anfrage · €14 p.P.',
      book_now: 'Jetzt buchen', book_close: 'Schließen',
      price_from: 'Ab', per_night: '/ Nacht', view_book: 'Zimmer buchen',
      features: 'Ausstattung',
      confirmed_msg: 'Ihre Buchung wurde bestätigt — wir freuen uns auf Ihren Besuch!',
      pending_msg: 'Ihre Buchung wird bearbeitet. Bei Fragen stehen wir gerne zur Verfügung.',
      group_title: 'Gruppen, Hochzeiten & Events',
      group_text: 'Für besondere Anlässe und Gruppenreisen erstellen wir individuelle Angebote.',
      enquire: 'Anfragen', nights_label: 'Nächte',
      location_title: 'Besuchen Sie uns in Langenburg',
      region_title: 'Langenburg & Hohenlohe',
      region_text: 'Langenburg liegt im malerischen Jagsttal — umgeben von Schlössern, Weinbergen und der Weite des Hohenloher Landes.',
      open_maps: 'In Google Maps öffnen',
    },
    en: {
      eyebrow: 'Accommodation', title: 'Rooms & Suites',
      subtitle: 'Stylish stays in the historic heart of Hohenlohe.',
      checkin: 'Check-in', checkout: 'Check-out', adults_label: 'Adults',
      check_avail: 'Check Availability',
      direct_title: 'Why Book Directly?',
      benefit1_t: 'Best Price Guarantee', benefit1: 'Lowest price — no third-party surcharges.',
      benefit2_t: 'Personal Contact', benefit2: 'Directly with our team — special requests welcome.',
      benefit3_t: 'Historic House', benefit3: 'Sleep in a listed historic building with character.',
      benefit4_t: 'Restaurant On-Site', benefit4: 'Mediterranean dining right on the premises.',
      breakfast: 'Breakfast on request · €14 p.p.',
      book_now: 'Book Now', book_close: 'Close',
      price_from: 'From', per_night: '/ night', view_book: 'Book Room',
      features: 'Features',
      confirmed_msg: 'Your booking has been confirmed — we look forward to welcoming you!',
      pending_msg: 'Your booking is being processed. Please contact us if you have questions.',
      group_title: 'Groups, Weddings & Events',
      group_text: 'For special occasions and group travel, we create individual offers.',
      enquire: 'Enquire', nights_label: 'nights',
      location_title: 'Visit us in Langenburg',
      region_title: 'Langenburg & Hohenlohe',
      region_text: 'Langenburg lies in the picturesque Jagst Valley — surrounded by castles, vineyards and the Hohenlohe countryside.',
      open_maps: 'Open in Google Maps',
    },
  };
  const t = T[lang] || T.de;

  const inputCls = "w-full bg-[#FAF7F2] border-2 border-[#EDE6D8] focus:border-[#C9A96E] rounded-xl px-4 py-3.5 text-sm text-[#1C1714] placeholder-[#8A7A6A] focus:outline-none transition-all font-body font-medium focus:bg-white";
  
  const inputLabelCls = "block text-[#C9A96E] text-[10px] tracking-[0.25em] uppercase font-body font-semibold mb-2";

  return (
    <div className="min-h-screen bg-[#0F0E0B] text-white pb-24 lg:pb-0">

      {/* Return banners */}
      {returnState === 'confirmed' && (
        <div className="max-w-5xl mx-auto px-5 page-top">
          <div className="border border-emerald-700/40 bg-emerald-950/30 rounded-2xl p-5 flex gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-300 font-body">{t.confirmed_msg}</p>
              {intentRef && <p className="text-xs text-emerald-400/50 mt-0.5 font-body">Ref: {intentRef}</p>}
            </div>
          </div>
        </div>
      )}
      {returnState === 'pending' && (
        <div className="max-w-5xl mx-auto px-5 page-top">
          <div className="border border-amber-700/40 bg-amber-950/30 rounded-2xl p-5 flex gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-300 font-body">{t.pending_msg}</p>
          </div>
        </div>
      )}

      {/* ── HERO mit Slider ── */}
      <div className={`relative overflow-hidden ${returnState ? 'pt-8' : ''}`} style={{ minHeight: 'clamp(650px, 78vh, 900px)' }}>
        {/* Slider Images - Kristallklare Qualität */}
        {HERO_IMAGES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroSlideIndex ? 1 : 0 }}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                objectPosition: slide.pos, 
                filter: 'brightness(1.08) contrast(1.15) saturate(1.1)',
                transform: 'scale(1.01)'
              }}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0E0B]/35 via-[#0F0E0B]/5 to-[#0F0E0B]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0E0B]/15 via-transparent to-[#0F0E0B]/15" />

        {/* Content - Elegant & Premium */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 pb-10" style={{ paddingTop: '180px' }}>
          <div className="max-w-[900px] w-full relative z-10">
            {/* Sanfter Blur-Hintergrund für Lesbarkeit */}
            <div className="absolute -inset-8 bg-gradient-to-b from-black/40 via-black/20 to-black/40 backdrop-blur-[1px] rounded-[32px] -z-10" />
            
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A96E]/60" />
              <p className="text-[#C9A96E] text-[10px] tracking-[0.6em] uppercase font-body font-medium">{t.eyebrow}</p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A96E]/60" />
            </div>
            <h1
              className="font-display font-light text-white mb-5"
              style={{ 
                fontSize: 'clamp(2.5rem, 4.8vw, 4.5rem)', 
                lineHeight: '1.15', 
                textShadow: '0 2px 32px rgba(0,0,0,0.85), 0 1px 8px rgba(0,0,0,0.7)',
                letterSpacing: '0.02em'
              }}>
              {t.title}
            </h1>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/70 to-transparent mx-auto mb-5" />
            <p className="text-white/90 font-body max-w-[560px] mx-auto leading-relaxed mb-9"
               style={{ 
                 fontSize: 'clamp(1.05rem, 1.5vw, 1.15rem)', 
                 textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.7)',
                 fontWeight: '400'
               }}>
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => handleBookNow(null)} disabled={savingIntent}
                className="btn-gold disabled:opacity-50">
                {t.book_now} <ExternalLink className="w-4 h-4" />
              </button>
              <a href={`tel:${SITE_DEFAULTS.phone}`}
                className="btn-outline-dark px-8">
                <Phone className="w-4 h-4" /> {SITE_DEFAULTS.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <button
          onClick={() => setHeroSlideIndex(prev => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-[#C9A96E]/30 border border-white/20 hover:border-[#C9A96E]/50 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setHeroSlideIndex(prev => (prev + 1) % HERO_IMAGES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-[#C9A96E]/30 border border-white/20 hover:border-[#C9A96E]/50 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all z-20"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        {/* Slider Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroSlideIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === heroSlideIndex ? 'bg-[#C9A96E] w-6' : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-12 sm:py-16">

        {/* ── BOOKING BAR ── */}
        <div className="mb-14 bg-[#171411] border border-[#C9A96E]/15 rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="text-center mb-7">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.45em] uppercase font-body mb-2">Krone Langenburg by Ammesso</p>
            <div className="flex items-center justify-center gap-2 mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#C9A96E]/60" />
              <p className="text-white/60 text-sm font-body">Hauptstraße 24 · 74595 Langenburg, Deutschland</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={inputLabelCls}>{t.checkin}</label>
              <input type="date" min={today} value={checkIn}
                onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(''); }}
                className={inputCls} 
                style={{ colorScheme: 'light' }} />
            </div>
            <div>
              <label className={inputLabelCls}>{t.checkout}</label>
              <input type="date" min={minCheckout} value={checkOut} onChange={e => setCheckOut(e.target.value)} className={inputCls} 
                style={{ colorScheme: 'light' }} />
            </div>
            <div>
              <label className={inputLabelCls}>{t.adults_label}</label>
              <div className="flex items-center gap-3 h-[46px]">
                <button onClick={() => setAdults(a => Math.max(1, a - 1))}
                  className="w-11 h-11 rounded-full border-2 border-[#C9A96E]/30 text-[#C9A96E] hover:border-[#C9A96E] hover:bg-[#C9A96E] hover:text-white transition-all text-xl flex items-center justify-center font-light">−</button>
                <span className="flex-1 text-center font-display text-3xl font-light text-white">{adults}</span>
                <button onClick={() => setAdults(a => Math.min(8, a + 1))}
                  className="w-11 h-11 rounded-full border-2 border-[#C9A96E]/30 text-[#C9A96E] hover:border-[#C9A96E] hover:bg-[#C9A96E] hover:text-white transition-all text-xl flex items-center justify-center font-light">+</button>
              </div>
            </div>
          </div>
          {checkIn && checkOut && (
            <div className="mt-6 pt-6 border-t border-white/8 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-white/35 text-sm font-body">
                {Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)} {t.nights_label} · {adults} {t.adults_label}
              </p>
              <button onClick={() => handleBookNow(null)} disabled={savingIntent}
                className="btn-gold disabled:opacity-50">
                {t.check_avail} <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── DIRECT BOOKING BENEFITS ── */}
        <div className="mb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: t.benefit1_t, d: t.benefit1, icon: '✦' },
            { t: t.benefit2_t, d: t.benefit2, icon: '◇' },
            { t: t.benefit3_t, d: t.benefit3, icon: '◆' },
            { t: t.benefit4_t, d: t.benefit4, icon: '✦' },
          ].map((b, i) => (
            <div key={i} className="bg-gradient-to-br from-[#1D1510] to-[#171411] border border-[#C9A96E]/25 rounded-2xl p-6 sm:p-7 hover:border-[#C9A96E]/50 hover:shadow-[0_8px_24px_rgba(201,169,110,0.12)] transition-all duration-300">
              <p className="text-[#C9A96E] text-2xl mb-4">{b.icon}</p>
              <p className="text-white font-body font-bold text-sm mb-2.5 leading-tight">{b.t}</p>
              <p className="text-white/65 text-sm font-body leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>

        {/* ── ROOM CARDS ── */}
        <div className="space-y-8 mb-16">
          {ROOMS.map((room, idx) => {
            const photos = ROOM_PHOTOS[room.id] || [room.image];
            const activePhoto = activePhotos[room.id] || 0;
            const features = lang === 'de' ? room.features_de : room.features_en;
            const isReversed = idx % 2 === 1;

            return (
              <div key={room.id} className="bg-[#171411] border border-white/8 rounded-3xl overflow-hidden hover:border-[#C9A96E]/20 transition-all hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${isReversed ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Photos */}
                  <div className={`flex flex-col ${isReversed ? 'lg:col-start-2' : ''}`}>
                    <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px] overflow-hidden">
                      <img src={photos[activePhoto] || room.image}
                        alt={lang === 'de' ? (room.alt_de || room.key_de + ' — Krone Langenburg by Ammesso') : (room.alt_en || room.key_en + ' — Krone Langenburg by Ammesso')}
                        className="w-full h-full object-cover transition-all duration-700 hover:scale-105" loading="lazy" />
                      {room.price_from && (
                        <div className="absolute top-4 right-4 bg-[#0F0E0B]/80 backdrop-blur-md rounded-full px-4 py-2 border border-[#C9A96E]/25">
                          <p className="text-[#C9A96E] font-body font-bold text-sm">{t.price_from} €{room.price_from}<span className="text-white/35 font-normal text-xs">{t.per_night}</span></p>
                        </div>
                      )}
                      {room.size_m2 && (
                        <div className="absolute bottom-4 left-4 bg-[#0F0E0B]/70 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                          <p className="text-white/70 text-xs font-body">{room.size_m2} m²</p>
                        </div>
                      )}
                    </div>
                    {photos.length > 1 && (
                      <div className="flex gap-1.5 p-2.5 bg-black/30 overflow-x-auto no-scrollbar">
                        {photos.map((p, pi) => (
                          <button key={pi} onClick={() => setActivePhotos(prev => ({ ...prev, [room.id]: pi }))}
                            className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${activePhoto === pi ? 'border-[#C9A96E]' : 'border-transparent opacity-40 hover:opacity-70'}`}>
                            <img src={p} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-7 sm:p-10 flex flex-col justify-center ${isReversed ? 'lg:col-start-1' : ''}`}>
                    <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body font-medium mb-3">
                      {idx === 0 ? (lang === 'de' ? 'Einzelzimmer' : 'Single Room') : idx < 2 ? (lang === 'de' ? 'Doppelzimmer' : 'Double Room') : '✦ Suite'}
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-4 leading-tight">
                      {lang === 'de' ? room.key_de : room.key_en}
                    </h2>
                    <p className="text-white/55 text-base font-body leading-relaxed mb-6">
                      {lang === 'de' ? room.description_de : room.description_en}
                    </p>

                    {/* Specs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="flex items-center gap-1.5 text-sm text-white/50 font-body bg-white/5 rounded-full px-3 py-1.5 border border-white/8">
                        <Users className="w-3.5 h-3.5 text-[#C9A96E]/50" /> max. {room.max_guests} {lang === 'de' ? 'Pers.' : 'guests'}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-white/50 font-body bg-white/5 rounded-full px-3 py-1.5 border border-white/8">
                        <BedDouble className="w-3.5 h-3.5 text-[#C9A96E]/50" /> {lang === 'de' ? room.bed_de : room.bed_en}
                      </span>
                    </div>

                    {/* Features */}
                    {features && features.length > 0 && (
                      <div className="mb-8">
                        <p className="text-white/25 text-[10px] tracking-[0.25em] uppercase font-body mb-3">{t.features}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                          {features.map((f, i) => (
                            <span key={i} className="text-sm text-white/45 font-body flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#C9A96E]/40" /> {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button onClick={() => handleBookNow(room.id)} disabled={savingIntent}
                      className="btn-gold self-start disabled:opacity-50">
                      {t.view_book} <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── ALL-ROOM AMENITIES ── */}
        <div className="bg-white border border-[#EDE6D8] rounded-2xl p-6 sm:p-8 mb-12 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <p className="text-[#8B6914] text-[10px] tracking-[0.35em] uppercase font-body font-semibold text-center mb-6">
            {lang === 'de' ? 'In allen Zimmern enthalten' : 'Included in all rooms'}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-5 text-center">
            {[
              { icon: Wifi, label: 'WLAN' },
              { icon: Wind, label: lang === 'de' ? 'Klimaanlage' : 'A/C' },
              { icon: Bath, label: lang === 'de' ? 'Bad' : 'Bathroom' },
              { icon: Coffee, label: lang === 'de' ? 'Frühstück opt.' : 'Breakfast opt.' },
              { icon: Star, label: lang === 'de' ? 'Premium-Bettwäsche' : 'Premium Linen' },
              { icon: MapPin, label: lang === 'de' ? 'Stadtlage' : 'Town Centre' },
            ].map((a, i) => (
              <div key={i} className="flex flex-col items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#F7F3EC] border border-[#EDE6D8] flex items-center justify-center">
                  <a.icon className="w-4 h-4 text-[#8B6914]" />
                </div>
                <span className="text-[#4A3F35] text-xs font-body font-medium leading-tight">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN CTA ── */}
        <div className="relative bg-[#171411] border border-[#C9A96E]/15 rounded-3xl p-8 sm:p-12 text-center mb-12 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#C9A96E]/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.45em] uppercase font-body mb-4">
              {lang === 'de' ? 'Sichere Buchung via Beds24 · Sofortige Bestätigung' : 'Secure booking via Beds24 · Instant confirmation'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-4">
              {lang === 'de' ? 'Verfügbarkeit & Preise prüfen' : 'Check Availability & Rates'}
            </h2>
            <p className="text-white/40 font-body text-base mb-8 max-w-sm mx-auto">
              {lang === 'de' ? 'Direkt online buchen — sicher, schnell und zum besten Preis.' : 'Book directly online — secure, fast, best price guaranteed.'}
            </p>
            <button onClick={() => handleBookNow(null)} disabled={savingIntent}
              className="btn-gold px-10 disabled:opacity-60">
              {t.book_now} <ExternalLink className="w-4 h-4" />
            </button>
            <p className="text-white/20 text-xs font-body mt-4">{t.breakfast}</p>
          </div>
        </div>

        {/* ── PREMIUM MAP SECTION ── */}
        <div className="mb-12">
          <div className="text-center mb-7">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.45em] uppercase font-body mb-3">Krone Langenburg by Ammesso</p>
            <h3 className="font-display text-3xl sm:text-4xl font-light text-white mb-2">{t.location_title}</h3>
            <p className="text-white/40 text-sm font-body">Hauptstraße 24 · 74595 Langenburg, Deutschland</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/8 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
            <iframe
              src={MAPS_EMBED}
              width="100%"
              height="400"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Krone Langenburg by Ammesso — Google Maps"
            />
          </div>
          <div className="mt-4 text-center">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
              className="btn-ghost-gold px-6">
              <Navigation className="w-3.5 h-3.5" /> {t.open_maps}
            </a>
          </div>
        </div>

        {/* ── REGION ── */}
        <div className="bg-[#171411] border border-white/8 rounded-2xl p-6 sm:p-8 mb-10">
          <h3 className="font-display text-2xl font-light text-white mb-3">{t.region_title}</h3>
          <p className="text-white/45 text-base font-body leading-relaxed mb-6">{t.region_text}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { e: '🏰', de: 'Schloss Langenburg', en: 'Langenburg Castle' },
              { e: '🌊', de: 'Jagsttal', en: 'Jagst Valley' },
              { e: '🍷', de: 'Hohenloher Wein', en: 'Hohenlohe Wine' },
              { e: '🚗', de: 'Automuseum', en: 'Car Museum' },
            ].map((item, i) => (
              <div key={i} className="bg-white/4 border border-white/8 rounded-xl p-4 text-center hover:border-[#C9A96E]/20 transition-colors">
                <div className="text-2xl mb-2">{item.e}</div>
                <p className="text-white/45 text-xs font-body">{lang === 'de' ? item.de : item.en}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 text-center">
            <Link to="/discover" className="inline-flex items-center gap-2 text-[#C9A96E]/60 hover:text-[#C9A96E] text-sm font-body font-semibold tracking-wider transition-colors">
              {lang === 'de' ? 'Region entdecken' : 'Explore Region'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── GROUPS / WEDDINGS ── */}
        <div className="bg-[#171411] border border-[#C9A96E]/15 rounded-2xl p-7 sm:p-9 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body font-medium mb-3">💍 {t.group_title}</p>
            <p className="text-white/55 text-base font-body leading-relaxed">{t.group_text}</p>
          </div>
          <div className="flex gap-3 md:justify-end flex-wrap">
            <Link to="/weddings"
              className="btn-gold px-6">
              {t.enquire} <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/contact"
              className="btn-ghost-gold px-6">
              {lang === 'de' ? 'Kontakt' : 'Contact'}
            </Link>
          </div>
        </div>

      </div>

      {/* ── BEDS24 OVERLAY ── */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#0F0E0B] animate-fade-in">
          <div className="flex items-center justify-between px-5 py-4 bg-[#171411] border-b border-[#C9A96E]/15 flex-shrink-0">
            <div>
              <p className="font-display text-lg font-light text-white">Krone Langenburg</p>
              <p className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase font-body">
                {lang === 'de' ? 'Sichere Online-Buchung' : 'Secure Online Booking'}
              </p>
            </div>
            <button onClick={() => setShowBooking(false)}
              className="px-5 py-2 border border-[#C9A96E]/20 text-white/50 hover:text-white hover:border-[#C9A96E]/50 text-xs font-body tracking-widest uppercase rounded-full transition-colors">
              ✕ {t.book_close}
            </button>
          </div>
          <iframe src={beds24EmbedUrl} title="Beds24 Secure Booking" className="flex-1 w-full border-0 bg-white min-h-[60vh]" allow="payment" />
          <div className="flex-shrink-0 text-center py-3 px-5 bg-[#171411] border-t border-[#C9A96E]/10">
            <a href={beds24EmbedUrl} target="_blank" rel="noopener noreferrer" className="text-[#C9A96E]/60 text-xs font-body hover:text-[#C9A96E] transition-colors">
              {lang === 'de' ? 'Direkt in neuer Seite öffnen →' : 'Open directly in new tab →'}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}