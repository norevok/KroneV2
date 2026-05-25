import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { SITE_DEFAULTS, ROOMS } from '@/lib/siteData';
import { Star, Coffee, CheckCircle, AlertCircle, ExternalLink, Wifi, Bath, Wind, MapPin, ArrowRight, BedDouble, Users, CalendarDays, Phone, ChevronRight } from 'lucide-react';

// ── ROOM PHOTO LIBRARY — all Base44 uploaded media, correctly assigned ──
// Base44 media base: https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/
// Filename key:
//   krone-kingsuite-1-* = King Suite 1 (Superior Suite)
//   krone-kingsuite-2-* = King Suite 2 (Superior Suite 2)
//   zimmer-bett-tv     = Bed with TV view  → used as Einzelzimmer cover (cleanest single-bed shot)
//   zimmer-bett-01     = Bed without TV    → used as Doppelzimmer cover (clear double-bed shot)
//   zimmer-uebersicht  = Full-room overview → Superior Suite 1 cover
//   zimmer-favorit     = Signature shot     → Superior Suite 2 cover
const ROOM_PHOTOS = {
  // Deluxe Einzelzimmer — echte Zimmerfotos
  deluxe_single: [
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/d998a99a1_IMG_1644.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/7f4a28fae_IMG_1646.jpg',
  ],
  // Deluxe Doppelzimmer
  deluxe_double: [
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/46611ec66_krone-dz-bett-balkontuer-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/7063cdda7_krone-dz-doppelbett-balkon-03.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/3a179ef1d_krone-dz-zimmer-tv-fenster-02.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/69a6d105a_krone-dz-aussicht-talblick-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/975fb81f7_krone-dz-dusche-regendusche-03.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/90854213e_krone-dz-badezimmer-waschbecken-01.jpg',
  ],
  // Superior Suite (King Suite 1)
  superior_suite: [
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8e0419119_krone-kingsuite-1-zimmer-uebersicht-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/a8e3a47b0_krone-kingsuite-1-zimmer-wohnbereich-02.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/463dc9086_krone-kingsuite-1-zimmer-bett-tv-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/6d9bcf521_krone-kingsuite-1-zimmer-detail-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/737cda4af_krone-kingsuite-1-aussicht-panorama-01.jpg',
  ],
  // Superior Suite 2 (King Suite 2)
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
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);

  const params = new URLSearchParams(window.location.search);
  const returnState = params.get('return');
  const intentRef = params.get('ref');

  const beds24Base = SITE_DEFAULTS.beds24_booking_url;
  const today = new Date().toISOString().split('T')[0];
  const minCheckout = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
    : new Date(new Date().getTime() + 86400000).toISOString().split('T')[0];

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

    // CREDIT OPTIMIZATION: Slack notification removed from booking intent click.
    // Real Slack alert fires via beds24BookingWebhook only on confirmed booking.
    setSavingIntent(false);
    setShowBooking(true);
  }

  const beds24EmbedUrl = `${beds24Base}&lang=${lang}&iframe=1${checkIn ? `&checkin=${checkIn}` : ''}${checkOut ? `&checkout=${checkOut}` : ''}&adults=${adults}`;

  const T = {
    de: {
      eyebrow: 'Unterkunft',
      title: 'Zimmer & Suiten',
      subtitle: 'Stilvoll übernachten im historischen Herzen Hohenlohes.',
      checkin: 'Anreise', checkout: 'Abreise', adults_label: 'Erwachsene',
      check_avail: 'Verfügbarkeit prüfen',
      direct_title: 'Warum direkt buchen?',
      benefit1_t: 'Beste Preisgarantie', benefit1: 'Günstigster Preis garantiert — keine Drittanbieter-Aufschläge.',
      benefit2_t: 'Persönlicher Kontakt', benefit2: 'Direkt mit unserem Team — Sonderwünsche, Frühstück, Zimmerauswahl.',
      benefit3_t: 'Historisches Haus', benefit3: 'Schlafen in einem denkmalgeschützten Haus mit Geschichte.',
      benefit4_t: 'Restaurant vor der Tür', benefit4: 'Frühstücken und abends mediterran speisen — alles unter einem Dach.',
      breakfast: 'Frühstück auf Anfrage · €14 p.P.',
      book_now: 'Jetzt buchen',
      book_close: 'Schließen',
      price_from: 'Ab',
      per_night: '/ Nacht',
      view_book: 'Zimmer buchen',
      features: 'Ausstattung',
      confirmed_msg: 'Ihre Buchung wurde bestätigt — wir freuen uns auf Ihren Besuch!',
      pending_msg: 'Ihre Buchung wird bearbeitet. Bei Fragen stehen wir gerne zur Verfügung.',
      group_title: 'Gruppen, Hochzeiten & Events',
      group_text: 'Für besondere Anlässe und Gruppenreisen erstellen wir individuelle Angebote.',
      enquire: 'Anfragen',
      nights_label: 'Nächte',
      location_title: 'Lage & Anreise',
      region_title: 'Langenburg & Hohenlohe',
      region_text: 'Langenburg liegt im malerischen Jagsttal — umgeben von Schlössern, Weinbergen und der Weite des Hohenloher Landes.',
    },
    en: {
      eyebrow: 'Accommodation',
      title: 'Rooms & Suites',
      subtitle: 'Stylish stays in the historic heart of Hohenlohe.',
      checkin: 'Check-in', checkout: 'Check-out', adults_label: 'Adults',
      check_avail: 'Check Availability',
      direct_title: 'Why Book Directly?',
      benefit1_t: 'Best Price Guarantee', benefit1: 'Lowest price guaranteed — no third-party surcharges.',
      benefit2_t: 'Personal Contact', benefit2: 'Directly with our team — special requests, breakfast, room selection.',
      benefit3_t: 'Historic House', benefit3: 'Sleep in a listed historic building with character.',
      benefit4_t: 'Restaurant On-Site', benefit4: 'Breakfast and evening dining under one roof.',
      breakfast: 'Breakfast on request · €14 p.p.',
      book_now: 'Book Now',
      book_close: 'Close',
      price_from: 'From',
      per_night: '/ night',
      view_book: 'Book Room',
      features: 'Features',
      confirmed_msg: 'Your booking has been confirmed — we look forward to welcoming you!',
      pending_msg: 'Your booking is being processed. Please contact us if you have questions.',
      group_title: 'Groups, Weddings & Events',
      group_text: 'For special occasions and group travel, we create individual offers.',
      enquire: 'Enquire',
      nights_label: 'nights',
      location_title: 'Location & Directions',
      region_title: 'Langenburg & Hohenlohe',
      region_text: 'Langenburg lies in the picturesque Jagst Valley — surrounded by castles, vineyards and the Hohenlohe countryside.',
    },
  };
  const t = T[lang] || T.de;

  const inputCls = "w-full bg-white border-2 border-[#EDE6D8] focus:border-[#8B6914] rounded-xl px-4 py-3 text-base text-[#1C1714] placeholder-[#1C1714]/35 focus:outline-none transition-colors font-body";

  return (
    <div className="min-h-screen bg-white text-[#1C1714] pb-24 lg:pb-0">

      {/* Return banners */}
      {returnState === 'confirmed' && (
        <div className="max-w-5xl mx-auto px-5 pt-[134px] lg:pt-[174px]">
          <div className="border border-emerald-200 bg-emerald-50 rounded-2xl p-5 flex gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-800 font-body">{t.confirmed_msg}</p>
              {intentRef && <p className="text-xs text-emerald-600/70 mt-0.5 font-body">Ref: {intentRef}</p>}
            </div>
          </div>
        </div>
      )}
      {returnState === 'pending' && (
        <div className="max-w-5xl mx-auto px-5 pt-[134px] lg:pt-[174px]">
          <div className="border border-amber-200 bg-amber-50 rounded-2xl p-5 flex gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 font-body">{t.pending_msg}</p>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className={`relative bg-[#1C1714] ${returnState ? 'pt-8' : 'pt-[126px] lg:pt-[166px] pb-16 sm:pb-20'} overflow-hidden`}>
        <img
          src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg"
          alt="Krone Langenburg Zimmer Panorama"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1714]/60 to-[#1C1714]/90" />
        <div className="relative text-center px-5 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-[#C9A96E]/50" />
            <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body">{t.eyebrow}</p>
            <div className="h-px w-8 bg-[#C9A96E]/50" />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-light text-white mb-4 leading-tight">{t.title}</h1>
          <p className="text-white/60 font-body text-lg max-w-md mx-auto">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-12">

        {/* Booking search bar */}
        <div className="mb-12 bg-white border-2 border-[#EDE6D8] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <CalendarDays className="w-5 h-5 text-[#8B6914]" />
            <p className="text-[#1C1714] font-body font-semibold text-base">
              {lang === 'de' ? 'Ihr Aufenthalt' : 'Your Stay'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#1C1714]/60 text-xs tracking-[0.2em] uppercase font-body font-medium mb-2">{t.checkin}</label>
              <input type="date" min={today} value={checkIn}
                onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(''); }}
                className={inputCls} />
            </div>
            <div>
              <label className="block text-[#1C1714]/60 text-xs tracking-[0.2em] uppercase font-body font-medium mb-2">{t.checkout}</label>
              <input type="date" min={minCheckout} value={checkOut} onChange={e => setCheckOut(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-[#1C1714]/60 text-xs tracking-[0.2em] uppercase font-body font-medium mb-2">{t.adults_label}</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setAdults(a => Math.max(1, a - 1))}
                  className="w-11 h-11 rounded-full border-2 border-[#EDE6D8] text-[#1C1714]/60 hover:border-[#8B6914] hover:text-[#8B6914] transition-colors text-xl flex items-center justify-center font-light">−</button>
                <span className="flex-1 text-center font-display text-3xl font-light text-[#1C1714]">{adults}</span>
                <button onClick={() => setAdults(a => Math.min(8, a + 1))}
                  className="w-11 h-11 rounded-full border-2 border-[#EDE6D8] text-[#1C1714]/60 hover:border-[#8B6914] hover:text-[#8B6914] transition-colors text-xl flex items-center justify-center font-light">+</button>
              </div>
            </div>
          </div>
          {checkIn && checkOut && (
            <div className="mt-5 pt-5 border-t border-[#EDE6D8] flex items-center justify-between gap-4 flex-wrap">
              <p className="text-[#1C1714]/50 text-sm font-body">
                {Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)} {t.nights_label} · {adults} {t.adults_label}
              </p>
              <button onClick={() => handleBookNow(null)} disabled={savingIntent}
                className="flex items-center gap-2 px-8 py-4 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-lg text-sm font-body font-bold tracking-widest uppercase transition-all disabled:opacity-50 shadow-md hover:-translate-y-px">
                {t.check_avail} <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Direct booking benefits */}
        <div className="mb-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: t.benefit1_t, d: t.benefit1, icon: '✦' },
            { t: t.benefit2_t, d: t.benefit2, icon: '◇' },
            { t: t.benefit3_t, d: t.benefit3, icon: '◆' },
            { t: t.benefit4_t, d: t.benefit4, icon: '✦' },
          ].map((b, i) => (
            <div key={i} className="bg-[#F7F3EC] border border-[#EDE6D8] rounded-2xl p-5">
              <p className="text-[#8B6914] text-lg mb-2">{b.icon}</p>
              <p className="text-[#1C1714] font-body font-semibold text-sm mb-1.5">{b.t}</p>
              <p className="text-[#4A3F35]/70 text-sm font-body leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>

        {/* Room Cards */}
        <div className="space-y-10 mb-16">
          {ROOMS.map((room, idx) => {
            const photos = ROOM_PHOTOS[room.id] || [room.image];
            const activePhoto = activePhotos[room.id] || 0;
            const features = lang === 'de' ? room.features_de : room.features_en;
            const isReversed = idx % 2 === 1;

            return (
              <div key={room.id} className="bg-white border border-[#EDE6D8] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${isReversed ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Photos */}
                  <div className={`flex flex-col ${isReversed ? 'lg:col-start-2' : ''}`}>
                    <div className="relative h-64 sm:h-80 lg:h-full min-h-[280px] overflow-hidden">
                      <img src={photos[activePhoto] || room.image}
                        alt={lang === 'de' ? (room.alt_de || room.key_de + ' im Krone Langenburg by Ammesso') : (room.alt_en || room.key_en + ' at Krone Langenburg by Ammesso')}
                        className="w-full h-full object-cover transition-all duration-500" loading="lazy" />
                      {room.price_from && (
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                          <p className="text-[#8B6914] font-body font-bold text-sm">{t.price_from} €{room.price_from}<span className="text-[#1C1714]/40 font-normal text-xs">{t.per_night}</span></p>
                        </div>
                      )}
                      {room.size_m2 && (
                        <div className="absolute bottom-4 left-4 bg-[#1C1714]/70 backdrop-blur-sm rounded-full px-3 py-1.5">
                          <p className="text-white text-xs font-body">{room.size_m2} m²</p>
                        </div>
                      )}
                    </div>
                    {photos.length > 1 && (
                      <div className="flex gap-1.5 p-2.5 bg-[#F7F3EC] overflow-x-auto no-scrollbar">
                        {photos.map((p, pi) => (
                          <button key={pi} onClick={() => setActivePhotos(prev => ({ ...prev, [room.id]: pi }))}
                            className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${activePhoto === pi ? 'border-[#8B6914]' : 'border-transparent opacity-60 hover:opacity-90'}`}>
                            <img src={p} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-7 sm:p-10 flex flex-col justify-center ${isReversed ? 'lg:col-start-1' : ''}`}>
                    <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body font-medium mb-3">
                      {idx === 0 ? (lang === 'de' ? 'Einzelzimmer' : 'Single Room') : idx < 2 ? (lang === 'de' ? 'Doppelzimmer' : 'Double Room') : '✦ Suite'}
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714] mb-4 leading-tight">
                      {lang === 'de' ? room.key_de : room.key_en}
                    </h2>
                    <p className="text-[#4A3F35] text-base font-body leading-relaxed mb-6">
                      {lang === 'de' ? room.description_de : room.description_en}
                    </p>

                    {/* Specs */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="flex items-center gap-1.5 text-sm text-[#4A3F35]/70 font-body bg-[#F7F3EC] rounded-full px-3 py-1.5 border border-[#EDE6D8]">
                        <Users className="w-3.5 h-3.5 text-[#8B6914]/60" /> max. {room.max_guests} {lang === 'de' ? 'Pers.' : 'guests'}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-[#4A3F35]/70 font-body bg-[#F7F3EC] rounded-full px-3 py-1.5 border border-[#EDE6D8]">
                        <BedDouble className="w-3.5 h-3.5 text-[#8B6914]/60" /> {lang === 'de' ? room.bed_de : room.bed_en}
                      </span>
                    </div>

                    {/* Features */}
                    {features && features.length > 0 && (
                      <div className="mb-8">
                        <p className="text-[#1C1714]/40 text-[10px] tracking-[0.25em] uppercase font-body mb-2">{t.features}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {features.map((f, i) => (
                            <span key={i} className="text-sm text-[#4A3F35]/60 font-body flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#8B6914]/40" /> {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button onClick={() => handleBookNow(room.id)} disabled={savingIntent}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-lg text-sm font-body font-bold tracking-widest uppercase transition-all self-start disabled:opacity-50 shadow-md hover:-translate-y-px">
                      {t.view_book} <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* All-rooms amenities */}
        <div className="bg-[#F7F3EC] border border-[#EDE6D8] rounded-2xl p-6 sm:p-8 mb-10">
          <p className="text-[#1C1714]/40 text-[10px] tracking-[0.35em] uppercase font-body text-center mb-5">
            {lang === 'de' ? 'In allen Zimmern enthalten' : 'Included in all rooms'}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
            {[
              { icon: Wifi, label: 'WLAN' },
              { icon: Wind, label: lang === 'de' ? 'Klimaanlage' : 'A/C' },
              { icon: Bath, label: lang === 'de' ? 'Bad' : 'Bathroom' },
              { icon: Coffee, label: lang === 'de' ? 'Frühstück opt.' : 'Breakfast opt.' },
              { icon: Star, label: lang === 'de' ? 'Premium-Bettwäsche' : 'Premium Linen' },
              { icon: MapPin, label: lang === 'de' ? 'Stadtlage' : 'Town Centre' },
            ].map((a, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white border border-[#EDE6D8] flex items-center justify-center shadow-sm">
                  <a.icon className="w-4 h-4 text-[#8B6914]/70" />
                </div>
                <span className="text-[#4A3F35]/70 text-xs font-body leading-tight">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <div className="bg-[#1C1714] rounded-3xl p-8 sm:p-12 text-center mb-10">
          <p className="text-[#C9A96E] text-[10px] tracking-[0.45em] uppercase font-body mb-4">
            {lang === 'de' ? 'Sichere Buchung via Beds24 · Sofortige Bestätigung' : 'Secure booking via Beds24 · Instant confirmation'}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-4">
            {lang === 'de' ? 'Verfügbarkeit & Preise prüfen' : 'Check Availability & Rates'}
          </h2>
          <p className="text-white/50 font-body text-base mb-8 max-w-sm mx-auto">
            {lang === 'de' ? 'Direkt online buchen — sicher, schnell und zum besten Preis.' : 'Book directly online — secure, fast, best price guaranteed.'}
          </p>
          <button onClick={() => handleBookNow(null)} disabled={savingIntent}
            className="inline-flex items-center gap-2.5 px-10 py-4 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-lg text-base font-body font-bold tracking-widest uppercase transition-all shadow-lg disabled:opacity-60 hover:-translate-y-px">
            {t.book_now} <ExternalLink className="w-4 h-4" />
          </button>
          <p className="text-white/25 text-xs font-body mt-4">{t.breakfast}</p>
        </div>

        {/* Map */}
        <div className="mb-10">
          <h3 className="font-display text-2xl sm:text-3xl font-light text-[#1C1714] mb-5 text-center">{t.location_title}</h3>
          <div className="rounded-2xl overflow-hidden border border-[#EDE6D8] h-[380px] sm:h-[480px] shadow-sm">
            <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=9.855%2C49.241%2C9.900%2C49.258&layer=mapnik&marker=49.2489%2C9.8753"
              title="Krone Langenburg Standort" />
          </div>
        </div>

        {/* Region */}
        <div className="bg-[#F7F3EC] border border-[#EDE6D8] rounded-2xl p-6 sm:p-8 mb-10">
          <h3 className="font-display text-2xl font-light text-[#1C1714] mb-3">{t.region_title}</h3>
          <p className="text-[#4A3F35] text-base font-body leading-relaxed mb-5">{t.region_text}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { e: '🏰', de: 'Schloss Langenburg', en: 'Langenburg Castle' },
              { e: '🌊', de: 'Jagsttal', en: 'Jagst Valley' },
              { e: '🍷', de: 'Hohenloher Wein', en: 'Hohenlohe Wine' },
              { e: '🚗', de: 'Automuseum', en: 'Car Museum' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-[#EDE6D8] rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{item.e}</div>
                <p className="text-[#4A3F35]/70 text-xs font-body">{lang === 'de' ? item.de : item.en}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 text-center">
            <Link to="/discover" className="inline-flex items-center gap-2 text-[#8B6914] hover:text-[#7A5A0F] text-sm font-body font-semibold tracking-wider transition-colors">
              {lang === 'de' ? 'Region entdecken' : 'Explore Region'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Groups / Weddings */}
        <div className="bg-white border-2 border-[#EDE6D8] rounded-2xl p-7 sm:p-9 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body font-medium mb-3">💍 {t.group_title}</p>
            <p className="text-[#4A3F35] text-base font-body leading-relaxed">{t.group_text}</p>
          </div>
          <div className="flex gap-3 md:justify-end">
            <Link to="/weddings" className="flex items-center gap-2 px-6 py-3.5 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-lg text-sm font-body font-bold tracking-widest uppercase transition-all shadow-md hover:-translate-y-px">
              {t.enquire} <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="flex items-center gap-2 px-6 py-3.5 border-2 border-[#8B6914] text-[#8B6914] hover:bg-[#F2E8D0] rounded-lg text-sm font-body font-bold tracking-widest uppercase transition-all">
              {lang === 'de' ? 'Kontakt' : 'Contact'}
            </Link>
          </div>
        </div>

      </div>

      {/* Beds24 overlay */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#1C1714] animate-fade-in">
          <div className="flex items-center justify-between px-5 py-4 bg-[#2A2118] border-b border-[#C9A96E]/15 flex-shrink-0">
            <div>
              <p className="font-display text-lg font-light text-white">Krone Langenburg</p>
              <p className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase font-body">
                {lang === 'de' ? 'Sichere Online-Buchung' : 'Secure Online Booking'}
              </p>
            </div>
            <button onClick={() => setShowBooking(false)}
              className="px-5 py-2 border border-[#C9A96E]/20 text-white/60 hover:text-white hover:border-[#C9A96E]/50 text-xs font-body tracking-widest uppercase rounded-full transition-colors">
              ✕ {t.book_close}
            </button>
          </div>
          <iframe src={beds24EmbedUrl} title="Beds24 Secure Booking" className="flex-1 w-full border-0 bg-white min-h-[60vh]" allow="payment" />
          <div className="flex-shrink-0 text-center py-3 px-5 bg-[#2A2118] border-t border-[#C9A96E]/10">
            <a href={beds24EmbedUrl} target="_blank" rel="noopener noreferrer" className="text-[#C9A96E] text-xs font-body hover:underline">
              {lang === 'de' ? 'Direkt in neuer Seite öffnen →' : 'Open directly in new tab →'}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}