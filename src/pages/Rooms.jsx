import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { SITE_DEFAULTS, ROOMS } from '@/lib/siteData';
import { Star, Coffee, ChevronRight, CheckCircle, AlertCircle, ExternalLink, Wifi, Bath, Wind, MapPin, ArrowRight, BedDouble, Users, CalendarDays } from 'lucide-react';

const AMENITIES = {
  de: ['Kostenloses WLAN', 'Klimaanlage', 'Eigenes Bad', 'Premium-Bettwäsche', 'Arbeitsbereich', 'Stadtblick'],
  en: ['Free WiFi', 'Air Conditioning', 'Private Bathroom', 'Premium Bedding', 'Work Desk', 'City View'],
  it: ['WiFi gratuito', 'Aria condizionata', 'Bagno privato', 'Biancheria premium', 'Scrivania', 'Vista città'],
};

// Real photo galleries for each room
const ROOM_PHOTOS = {
  deluxe_single: [
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/fa83a17cd_krone-kingsuite-1-balkon-aussicht-01.jpg',
  ],
  deluxe_double: [
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/930ad0179_krone-kingsuite-1-zimmer-bett-tv-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/d8a0d0a11_krone-kingsuite-1-zimmer-bett-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/0f40c4112_krone-kingsuite-1-balkon-panorama-01.jpg',
  ],
  superior_suite: [
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/804199c28_krone-kingsuite-1-zimmer-uebersicht-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/c914d145e_krone-kingsuite-1-zimmer-bett-02.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/d09aea914_krone-kingsuite-1-balkon-aussicht-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/fa83a17cd_krone-kingsuite-1-balkon-aussicht-01.jpg',
  ],
  superior_suite_2: [
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8c381b8e8_krone-kingsuite-2-zimmer-favorit-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8457db47b_krone-kingsuite-2-zimmer-wohnbereich-02.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/0449ddce1_krone-kingsuite-2-zimmer-bett-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8e0d680f3_krone-kingsuite-2-zimmer-balkon-01.jpg',
    'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/a0d03ed2c_krone-kingsuite-2-aussicht-landschaft-01.jpg',
  ],
};

const ROOM_DETAILS = {
  deluxe_single: {
    size_m2: 18,
    max_guests: 1,
    bed: { de: 'Einzelbett', en: 'Single bed', it: 'Letto singolo' },
    features: {
      de: ['Ruhige Lage', 'Modernes Bad', 'Schreibtisch', 'Stadtblick', 'Minikühlschrank'],
      en: ['Quiet location', 'Modern bathroom', 'Work desk', 'City view', 'Mini fridge'],
      it: ['Posizione tranquilla', 'Bagno moderno', 'Scrivania', 'Vista città', 'Mini frigo'],
    },
  },
  deluxe_double: {
    size_m2: 26,
    max_guests: 2,
    bed: { de: 'Doppelbett (180×200)', en: 'Double bed (180×200)', it: 'Letto matrimoniale (180×200)' },
    features: {
      de: ['Panoramafenster', 'Regendusche', 'Schreibtisch', 'Langenburg-Blick', 'Minibar'],
      en: ['Panoramic window', 'Rain shower', 'Work desk', 'Langenburg view', 'Minibar'],
      it: ['Finestra panoramica', 'Doccia a pioggia', 'Scrivania', 'Vista Langenburg', 'Minibar'],
    },
  },
  king_suite: {
    size_m2: 42,
    max_guests: 2,
    bed: { de: 'King-Size-Bett (200×200)', en: 'King-size bed (200×200)', it: 'Letto king size (200×200)' },
    features: {
      de: ['Separater Wohnbereich', 'Freistehende Badewanne', 'Premium-Minibar', 'Loungebereich', 'Exklusiver Blick'],
      en: ['Separate living area', 'Freestanding bathtub', 'Premium minibar', 'Lounge area', 'Exclusive view'],
      it: ['Soggiorno separato', 'Vasca freestanding', 'Minibar premium', 'Area lounge', 'Vista esclusiva'],
    },
  },
};

export default function Rooms() {
  const { lang } = useLang();
  const [showBooking, setShowBooking] = useState(false);
  const [activePhotos, setActivePhotos] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [savingIntent, setSavingIntent] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const params = new URLSearchParams(window.location.search);
  const returnState = params.get('return');
  const intentRef = params.get('ref');

  const beds24Base = SITE_DEFAULTS.beds24_booking_url;

  // Min date = today
  const today = new Date().toISOString().split('T')[0];
  // Min checkout = day after checkin or tomorrow
  const minCheckout = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
    : new Date(new Date().getTime() + 86400000).toISOString().split('T')[0];

  async function handleBookNow(roomId = null) {
    setSavingIntent(true);
    const ref = `INT-${Date.now().toString(36).toUpperCase()}`;

    // Generate account-linking token (works even if not logged in)
    let token = '';
    try {
      const tokenRes = await base44.functions.invoke('generateBookingToken', {
        check_in: checkIn, check_out: checkOut, adults, room_category: roomId || '',
      });
      token = tokenRes?.data?.token || '';
    } catch (_) {}

    const p = new URLSearchParams();
    if (lang !== 'de') p.set('lang', lang);
    if (checkIn) p.set('checkin', checkIn);
    if (checkOut) p.set('checkout', checkOut);
    if (adults) p.set('adults', adults);
    if (token) p.set('referer', token); // Account-linking token
    const beds24Url = `${beds24Base}&${p.toString()}`;

    base44.entities.HotelBookingIntent.create({
      intent_ref: ref,
      status: 'redirected_to_beds24',
      language: lang,
      source_page: 'rooms',
      room_category_interest: roomId || '',
      beds24_booking_url_used: beds24Url,
      redirected_at: new Date().toISOString(),
    }).catch(() => {});

    base44.functions.invoke('notifySlack', {
      type: 'booking_intent', ref, name: '',
      check_in: checkIn, check_out: checkOut, guests: String(adults),
    }).catch(() => {});

    setSavingIntent(false);
    setShowBooking(true);
    setSelectedRoom(roomId);
  }

  const beds24EmbedUrl = `${beds24Base}&lang=${lang}&iframe=1${checkIn ? `&checkin=${checkIn}` : ''}${checkOut ? `&checkout=${checkOut}` : ''}&adults=${adults}`;

  const C = {
    de: {
      eyebrow: 'Unterkunft',
      title: 'Zimmer & Suiten',
      subtitle: 'Stilvolles Übernachten im historischen Herzen Hohenlohes.',
      book_direct: 'Direktbucher-Preise garantiert',
      no_commission: 'Keine Buchungsgebühren',
      breakfast: 'Frühstück optional · €14 p.P.',
      book_now: 'Jetzt buchen',
      book_close: 'Schließen',
      group_title: 'Hochzeiten & Gruppenaufenthalte',
      group_text: 'Für Hochzeiten, Firmenevents und Gruppenreisen erstellen wir individuelle Angebote mit Raumkontingenten.',
      returning_confirmed: 'Ihre Buchung wurde bestätigt — wir freuen uns auf Ihren Besuch!',
      returning_pending: 'Ihre Buchung wird bearbeitet. Bei Fragen stehen wir gerne zur Verfügung.',
      open_beds: 'Verfügbarkeit & Preise prüfen',
      amenities_title: 'Alle Zimmer beinhalten',
      size: 'Größe',
      max: 'Max. Gäste',
      bed_label: 'Bett',
      features_label: 'Ausstattung',
      from: 'Ab',
      per_night: 'pro Nacht',
      details: 'Details & Buchen',
      beds24_note: 'Sichere Buchung via Beds24 · Sofortige Bestätigung',
    },
    en: {
      eyebrow: 'Accommodation',
      title: 'Rooms & Suites',
      subtitle: 'Stylish stays in the historic heart of Hohenlohe.',
      book_direct: 'Best Direct Booking Rates',
      no_commission: 'No booking fees',
      breakfast: 'Breakfast optional · €14 p.p.',
      book_now: 'Book Now',
      book_close: 'Close',
      group_title: 'Weddings & Group Stays',
      group_text: 'For weddings, corporate events and group travel we create individual offers with room contingents.',
      returning_confirmed: 'Your booking has been confirmed — we look forward to welcoming you!',
      returning_pending: 'Your booking is being processed. Please contact us if you have any questions.',
      open_beds: 'Check Availability & Prices',
      amenities_title: 'All rooms include',
      size: 'Size',
      max: 'Max. Guests',
      bed_label: 'Bed',
      features_label: 'Features',
      from: 'From',
      per_night: 'per night',
      details: 'Details & Book',
      beds24_note: 'Secure booking via Beds24 · Instant confirmation',
    },
    it: {
      eyebrow: 'Alloggio',
      title: 'Camere & Suite',
      subtitle: 'Soggiorni eleganti nel cuore storico dell\'Hohenlohe.',
      book_direct: 'Prezzi diretti garantiti',
      no_commission: 'Nessuna commissione',
      breakfast: 'Colazione opzionale · €14 p.p.',
      book_now: 'Prenota ora',
      book_close: 'Chiudi',
      group_title: 'Matrimoni & soggiorni di gruppo',
      group_text: 'Per matrimoni, eventi aziendali e viaggi di gruppo creiamo offerte individuali con contingenti di camere.',
      returning_confirmed: 'La tua prenotazione è confermata — non vediamo l\'ora di accogliervi!',
      returning_pending: 'La tua prenotazione è in elaborazione. Contattateci per qualsiasi domanda.',
      open_beds: 'Verifica disponibilità e prezzi',
      amenities_title: 'Tutte le camere includono',
      size: 'Dimensione',
      max: 'Max. ospiti',
      bed_label: 'Letto',
      features_label: 'Caratteristiche',
      from: 'Da',
      per_night: 'a notte',
      details: 'Dettagli & prenota',
      beds24_note: 'Prenotazione sicura via Beds24 · Conferma immediata',
    },
  };
  const t = C[lang] || C.de;
  const amenitiesList = AMENITIES[lang] || AMENITIES.de;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pb-24 lg:pb-10">

      {/* Return banners */}
      {returnState === 'confirmed' && (
        <div className="max-w-5xl mx-auto px-5 pt-24">
          <div className="border border-gold/20 bg-gold/8 rounded-2xl p-5 flex gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-ivory text-sm font-body">{t.returning_confirmed}</p>
              {intentRef && <p className="text-xs text-gold/50 mt-0.5 font-body">Ref: {intentRef}</p>}
            </div>
          </div>
        </div>
      )}
      {returnState === 'pending' && (
        <div className="max-w-5xl mx-auto px-5 pt-24">
          <div className="border border-[#C9A96E]/15 bg-[#C9A96E]/5 rounded-2xl p-5 flex gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-gold/60 flex-shrink-0 mt-0.5" />
            <p className="text-ivory/60 text-sm font-body">{t.returning_pending}</p>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className={`text-center px-5 ${returnState ? 'pt-8' : 'pt-24 sm:pt-28'} pb-10 sm:pb-16`}>
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-8 bg-gold/40" />
          <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-body">{t.eyebrow}</p>
          <div className="h-px w-8 bg-gold/40" />
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-light text-ivory mb-3 sm:mb-4 leading-[1.0]">{t.title}</h1>
        <p className="text-ivory/40 font-body text-sm max-w-md mx-auto">{t.subtitle}</p>
      </div>

      <div className="max-w-6xl mx-auto px-5">

        {/* Trust strip */}
        <div className="border border-gold/20 bg-gold/5 rounded-2xl p-4 sm:p-5 mb-8 sm:mb-12 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <Star className="w-4 h-4 text-gold fill-gold/20 flex-shrink-0" />
            <div>
              <p className="text-ivory text-sm font-body font-semibold">{t.book_direct}</p>
              <p className="text-gold/60 text-xs font-body">{t.no_commission}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-ivory/40 text-xs font-body">
            <Coffee className="w-4 h-4 text-gold/50" /> {t.breakfast}
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2 text-ivory/40 text-xs font-body">
            <MapPin className="w-3.5 h-3.5 text-gold/50" /> Langenburg, Baden-Württemberg
          </div>
        </div>

        {/* ── Date / Guest Selector ── */}
        <div className="mb-8 sm:mb-12 glass-card border border-gold/20 bg-gold/5 rounded-2xl p-5 sm:p-7">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-gold/70" />
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body font-semibold">
              {lang === 'de' ? 'Ihr Aufenthalt' : lang === 'en' ? 'Your Stay' : 'Il vostro soggiorno'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">
                {lang === 'de' ? 'Anreise' : lang === 'en' ? 'Check-in' : 'Arrivo'}
              </label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(''); }}
                className="w-full bg-[#0F0D0B] border border-[#C9A96E]/20 rounded-xl px-4 py-3 text-sm text-ivory font-body focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">
                {lang === 'de' ? 'Abreise' : lang === 'en' ? 'Check-out' : 'Partenza'}
              </label>
              <input
                type="date"
                min={minCheckout}
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full bg-[#0F0D0B] border border-[#C9A96E]/20 rounded-xl px-4 py-3 text-sm text-ivory font-body focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">
                {lang === 'de' ? 'Erwachsene' : lang === 'en' ? 'Adults' : 'Adulti'}
              </label>
              <div className="flex items-center gap-2">
                <button onClick={() => setAdults(a => Math.max(1, a - 1))}
                  className="w-10 h-10 rounded-full border border-[#C9A96E]/20 text-ivory/60 hover:text-gold hover:border-gold/40 transition-colors text-lg flex items-center justify-center flex-shrink-0">
                  −
                </button>
                <span className="flex-1 text-center font-display text-2xl font-light text-ivory">{adults}</span>
                <button onClick={() => setAdults(a => Math.min(8, a + 1))}
                  className="w-10 h-10 rounded-full border border-[#C9A96E]/20 text-ivory/60 hover:text-gold hover:border-gold/40 transition-colors text-lg flex items-center justify-center flex-shrink-0">
                  +
                </button>
              </div>
            </div>
          </div>
          {checkIn && checkOut && (
            <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-ivory/40 text-xs font-body">
                {Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)}{' '}
                {lang === 'de' ? 'Nächte' : lang === 'en' ? 'nights' : 'notti'} · {adults}{' '}
                {lang === 'de' ? 'Erw.' : lang === 'en' ? 'adults' : 'adulti'}
              </p>
              <button
                onClick={() => handleBookNow(null)}
                disabled={savingIntent}
                className="px-6 py-2.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {lang === 'de' ? 'Verfügbarkeit prüfen' : lang === 'en' ? 'Check Availability' : 'Verifica disponibilità'}
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* What to expect section */}
        <div className="mb-10 sm:mb-14 glass-card border border-[#C9A96E]/10 rounded-2xl p-6 sm:p-8">
          <h2 className="font-display text-2xl md:text-3xl font-light text-ivory mb-5">
            {lang === 'de' ? 'Warum direkt bei uns buchen?' : lang === 'en' ? 'Why book directly with us?' : 'Perché prenotare direttamente con noi?'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                de_t: '✦ Beste Preisgarantie',
                en_t: '✦ Best Price Guarantee',
                it_t: '✦ Garanzia miglior prezzo',
                de: 'Direkt gebucht = günstigster Preis. Keine Drittanbieter-Gebühren, keine versteckten Kosten.',
                en: 'Direct booking = best price. No third-party fees, no hidden costs.',
                it: 'Prenotazione diretta = miglior prezzo. Nessuna commissione, nessun costo nascosto.',
              },
              {
                de_t: '✦ Persönlicher Kontakt',
                en_t: '✦ Personal Contact',
                it_t: '✦ Contatto personale',
                de: 'Sprechen Sie direkt mit unserem Team — für Sonderwünsche, Frühstück, Zimmerauswahl.',
                en: 'Speak directly to our team — for special requests, breakfast, room selection.',
                it: 'Parla direttamente con il nostro team — per richieste speciali, colazione, scelta camera.',
              },
              {
                de_t: '✦ Historisches Ambiente',
                en_t: '✦ Historic Atmosphere',
                it_t: '✦ Atmosfera storica',
                de: 'Schlafen Sie, wo Geschichte atmet — renoviert mit Respekt für das Original.',
                en: 'Sleep where history breathes — renovated with respect for the original.',
                it: 'Dormite dove respira la storia — ristrutturato nel rispetto dell\'originale.',
              },
              {
                de_t: '✦ Restaurant vor der Tür',
                en_t: '✦ Restaurant on your doorstep',
                it_t: '✦ Ristorante sotto casa',
                de: 'Wachen Sie auf und frühstücken Sie, wo Sie auch abends mediterran tafeln können.',
                en: 'Wake up and breakfast where you can also dine Mediterranean in the evening.',
                it: 'Svegliatevi e fate colazione dove cenerete anche la sera con cucina mediterranea.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div>
                  <p className="text-gold text-sm font-body font-semibold mb-1.5">
                    {lang === 'de' ? item.de_t : lang === 'en' ? item.en_t : item.it_t}
                  </p>
                  <p className="text-ivory/50 text-sm font-body leading-relaxed">
                    {lang === 'de' ? item.de : lang === 'en' ? item.en : item.it}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room cards — premium layout */}
        <div className="space-y-8 mb-14">
          {ROOMS.map((r, idx) => {
            const details = ROOM_DETAILS[r.id] || {};
            const features = details.features?.[lang] || details.features?.de || [];
            const bed = details.bed?.[lang] || details.bed?.de || '';
            const isReversed = idx % 2 === 1;
            const photos = ROOM_PHOTOS[r.id] || [r.image];
            const activePhoto = activePhotos[r.id] || 0;
            return (
              <div key={r.id}
                className="glass-card border border-[#C9A96E]/10 rounded-3xl overflow-hidden">
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${isReversed ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Image with thumbnail strip */}
                  <div className={`relative flex flex-col ${isReversed ? 'lg:col-start-2' : ''}`}>
                    <div className="relative h-56 sm:h-72 lg:h-[320px] overflow-hidden group flex-1">
                      <img src={photos[activePhoto] || r.image}
                        alt={lang === 'de' ? r.key_de : lang === 'en' ? r.key_en : r.key_it}
                        className="w-full h-full object-cover transition-all duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
                      {details.size_m2 && (
                        <div className="absolute top-4 left-4 bg-charcoal/70 backdrop-blur-sm border border-[#C9A96E]/20 rounded-full px-3 py-1.5 text-[10px] font-body text-gold/70 tracking-wider">
                          {details.size_m2} m²
                        </div>
                      )}
                    </div>
                    {/* Thumbnail strip — only shown when >1 photo */}
                    {photos.length > 1 && (
                      <div className="flex gap-1.5 p-2 bg-charcoal/80 overflow-x-auto no-scrollbar">
                        {photos.map((p, pi) => (
                          <button key={pi} onClick={() => setActivePhotos(prev => ({ ...prev, [r.id]: pi }))}
                            className={`flex-shrink-0 w-14 h-10 rounded-md overflow-hidden border-2 transition-all ${activePhoto === pi ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-90'}`}>
                            <img src={p} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-5 sm:p-8 md:p-10 flex flex-col justify-center ${isReversed ? 'lg:col-start-1' : ''}`}>
                    <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">
                      {idx === 2 ? '✦ Suite' : idx === 0 ? 'Einzelzimmer' : 'Doppelzimmer'}
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl font-light text-ivory mb-3 leading-tight">
                      {lang === 'de' ? r.key_de : lang === 'en' ? r.key_en : r.key_it}
                    </h2>
                    <p className="text-ivory/55 text-sm font-body leading-relaxed mb-6">
                      {lang === 'de' ? r.description_de : lang === 'en' ? r.description_en : r.description_it}
                    </p>

                    {/* Quick specs */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      {details.max_guests && (
                        <span className="flex items-center gap-1.5 text-xs text-ivory/40 font-body border border-[#C9A96E]/10 rounded-full px-3 py-1.5">
                          <Users className="w-3 h-3 text-gold/40" />
                          {t.max}: {details.max_guests}
                        </span>
                      )}
                      {bed && (
                        <span className="flex items-center gap-1.5 text-xs text-ivory/40 font-body border border-[#C9A96E]/10 rounded-full px-3 py-1.5">
                          <BedDouble className="w-3 h-3 text-gold/40" />
                          {bed}
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    {features.length > 0 && (
                      <div className="mb-7">
                        <p className="text-ivory/25 text-[10px] tracking-[0.25em] uppercase font-body mb-2">{t.features_label}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {features.map((f, i) => (
                            <span key={i} className="text-xs text-ivory/45 font-body flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-gold/40 flex-shrink-0" /> {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleBookNow(r.id)}
                      disabled={savingIntent}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold self-start disabled:opacity-50"
                    >
                      {t.details} <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* All-room amenities */}
        <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5 sm:p-8 mb-8 sm:mb-10">
          <h3 className="text-ivory/30 text-[10px] tracking-[0.35em] uppercase font-body mb-4 sm:mb-5 text-center">{t.amenities_title}</h3>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 text-center">
            {amenitiesList.map((a, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full border border-[#C9A96E]/15 flex items-center justify-center">
                  {i === 0 && <Wifi className="w-3.5 h-3.5 text-gold/50" />}
                  {i === 1 && <Wind className="w-3.5 h-3.5 text-gold/50" />}
                  {i === 2 && <Bath className="w-3.5 h-3.5 text-gold/50" />}
                  {i >= 3 && <Star className="w-3 h-3 text-gold/40" />}
                </div>
                <span className="text-ivory/40 text-xs font-body leading-tight">{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <div className="glass-card border border-[#C9A96E]/15 rounded-3xl p-6 sm:p-8 md:p-12 text-center mb-8 sm:mb-10">
          <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-4">{t.beds24_note}</p>
          <h2 className="font-display text-3xl md:text-4xl font-light text-ivory mb-4">{t.open_beds}</h2>
          <p className="text-ivory/40 font-body text-sm mb-8 max-w-sm mx-auto">
            {lang === 'de' ? 'Direkt online buchen — sicher, schnell und garantiert zum besten Preis.' : lang === 'en' ? 'Book directly online — secure, fast and guaranteed at the best price.' : 'Prenota direttamente online — sicuro, veloce e al miglior prezzo garantito.'}
          </p>
          <button
            onClick={() => handleBookNow(null)}
            disabled={savingIntent}
            className="inline-flex items-center gap-2.5 px-10 py-4 btn-gold rounded-full text-sm font-body font-semibold tracking-wider shadow-gold-glow disabled:opacity-60"
          >
            {t.book_now} <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Google Maps */}
        <div className="mb-8 sm:mb-10">
          <h3 className="font-display text-2xl font-light text-ivory mb-6 text-center">
            {lang === 'de' ? 'Lage & Anreise' : lang === 'en' ? 'Location & Directions' : 'Posizione e Indicazioni'}
          </h3>
          <div className="rounded-2xl overflow-hidden border border-[#C9A96E]/10 h-[400px] sm:h-[500px]">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyA-OPJc_4CvKv_S8YToDdmlS9hE7f1R1AU&q=${encodeURIComponent('Hauptstraße 24, 74595 Langenburg, Germany')}`}
              title="Krone Langenburg Location"
            />
          </div>
        </div>

        {/* Langenburg location section */}
        <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-10">
          <h3 className="font-display text-2xl font-light text-ivory mb-3">
            {lang === 'de' ? 'Langenburg & die Region Hohenlohe' : lang === 'en' ? 'Langenburg & the Hohenlohe Region' : 'Langenburg e la regione Hohenlohe'}
          </h3>
          <p className="text-ivory/50 text-sm font-body leading-relaxed mb-6">
            {lang === 'de'
              ? 'Langenburg ist eine der schönsten Kleinstädte Baden-Württembergs — gelegen im malerischen Jagsttal, geprägt von Schlössern, Weinbergen und der Weite des Hohenloher Landes. Die perfekte Basis für Ausflüge, Wanderungen und Entdeckungen.'
              : lang === 'en'
              ? 'Langenburg is one of the most beautiful small towns in Baden-Württemberg — set in the picturesque Jagst valley, shaped by castles, vineyards and the open Hohenlohe countryside. The perfect base for excursions, hikes and discoveries.'
              : 'Langenburg è uno dei borghi più belli del Baden-Württemberg — situato nella pittoresca valle del Jagst, caratterizzata da castelli, vigneti e la vastità della campagna di Hohenlohe. La base perfetta per escursioni, passeggiate e scoperte.'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { emoji: '🏰', de: 'Schloss Langenburg', en: 'Langenburg Castle', it: 'Castello di Langenburg' },
              { emoji: '🌊', de: 'Stausee Brettheim', en: 'Brettheim Reservoir', it: 'Lago di Brettheim' },
              { emoji: '🥂', de: 'Hohenloher Wein', en: 'Hohenlohe Wine', it: 'Vini di Hohenlohe' },
              { emoji: '🚶', de: 'Jagsttalweg', en: 'Jagst Valley Trail', it: 'Sentiero Jagst' },
            ].map((item, i) => (
              <div key={i} className="glass-card border border-[#C9A96E]/08 rounded-xl p-4">
                <div className="text-2xl mb-2">{item.emoji}</div>
                <p className="text-ivory/60 text-xs font-body">
                  {lang === 'de' ? item.de : lang === 'en' ? item.en : item.it}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Wedding / Group */}
        <div className="bg-espresso border border-[#C9A96E]/10 rounded-2xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">💍 {t.group_title}</p>
            <p className="text-ivory/50 text-sm font-body leading-relaxed">{t.group_text}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
            <Link to="/weddings"
              className="flex items-center justify-center gap-2 px-6 py-3 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              {lang === 'de' ? 'Anfragen' : lang === 'en' ? 'Enquire' : 'Richiedi'} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/contact"
              className="flex items-center justify-center gap-2 px-6 py-3 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              {lang === 'de' ? 'Kontakt' : lang === 'en' ? 'Contact' : 'Contatti'}
            </Link>
          </div>
        </div>
      </div>

      {/* Beds24 Full-screen Overlay */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex flex-col bg-charcoal animate-fade-in">
          <div className="flex items-center justify-between px-5 py-4 bg-espresso border-b border-[#C9A96E]/15 flex-shrink-0">
            <div>
              <p className="font-display text-lg font-light text-ivory">Krone Langenburg</p>
              <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-body">
                {lang === 'de' ? 'Sichere Online-Buchung' : lang === 'en' ? 'Secure Online Booking' : 'Prenotazione sicura online'}
              </p>
            </div>
            <button
              onClick={() => setShowBooking(false)}
              className="px-5 py-2 border border-[#C9A96E]/20 text-ivory/60 hover:text-ivory hover:border-[#C9A96E]/50 text-xs font-body tracking-widest uppercase rounded-full transition-colors"
            >
              ✕ {t.book_close}
            </button>
          </div>
          <iframe
            src={beds24EmbedUrl}
            title="Beds24 Secure Booking"
            className="flex-1 w-full border-0 bg-white min-h-[60vh]"
            allow="payment"
          />
          {/* Fallback for iframe load issues */}
          <div className="flex-shrink-0 text-center py-3 px-5 bg-espresso border-t border-[#C9A96E]/10">
            <p className="text-ivory/30 text-xs font-body">
              {lang === 'de' ? 'Falls die Buchung nicht lädt:' : lang === 'en' ? 'If the booking widget does not load:' : 'Se il widget non carica:'}{' '}
              <a href={beds24EmbedUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                {lang === 'de' ? 'Hier direkt buchen →' : lang === 'en' ? 'Book directly here →' : 'Prenota direttamente →'}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}