import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { CheckCircle, AlertCircle, Loader2, BedDouble, Calendar, User, LogIn, Mail, Phone, Search } from 'lucide-react';
import { format } from 'date-fns';
import { de, enUS, it } from 'date-fns/locale';

const LOCALE_MAP = { de, en: enUS, it };

const COPY = {
  de: {
    eyebrow: 'Krone Langenburg by Ammesso',
    title: 'Buchungsbestätigung',
    loading: 'Ihre Buchung wird verarbeitet…',
    login_title: 'Konto verknüpfen',
    login_sub: 'Melden Sie sich an, damit Ihre Buchung automatisch in Ihrem Gäste-Konto erscheint.',
    login_btn: 'Einloggen / Registrieren',
    login_skip: 'Ohne Konto fortfahren',
    linking: 'Buchung wird verknüpft…',
    success_title: 'Buchung erfolgreich verknüpft!',
    success_sub: 'Ihre Buchung wurde erfolgreich mit Ihrem Krone Gäste-Konto verknüpft.',
    unverified_title: 'Buchung eingegangen',
    unverified_sub: 'Ihre Buchung wurde entgegengenommen. Sie wird von unserem Team geprüft und mit Ihrem Konto verknüpft.',
    no_match_title: 'Buchung nicht gefunden',
    no_match_sub: 'Wir konnten Ihre Buchung noch nicht automatisch zuordnen. Unser Team prüft die Buchung und verknüpft sie manuell mit Ihrem Konto.',
    manual_title: 'Buchung manuell verknüpfen',
    manual_sub: 'Geben Sie Ihre Buchungsdaten ein, um die Buchung Ihrem Konto zuzuordnen.',
    ref_label: 'Buchungsreferenz',
    email_label: 'Buchungs-E-Mail',
    arrival_label: 'Anreise',
    lookup_btn: 'Buchung suchen',
    view_bookings: 'Meine Reisen ansehen',
    goto_home: 'Zur Startseite',
    contact_hotel: 'Hotel kontaktieren',
    arrival: 'Anreise',
    departure: 'Abreise',
    room: 'Zimmer',
    guests: 'Gäste',
    status: 'Status',
    payment: 'Zahlung',
    note: 'Änderungen oder Stornierungen sind nur direkt über das Hotel möglich.',
    ref: 'Buchungsreferenz',
  },
  en: {
    eyebrow: 'Krone Langenburg by Ammesso',
    title: 'Booking Confirmation',
    loading: 'Processing your booking…',
    login_title: 'Link to your account',
    login_sub: 'Sign in so your booking appears automatically in your guest account.',
    login_btn: 'Sign In / Register',
    login_skip: 'Continue without account',
    linking: 'Linking booking…',
    success_title: 'Booking successfully linked!',
    success_sub: 'Your booking has been linked to your Krone guest account.',
    unverified_title: 'Booking received',
    unverified_sub: 'Your booking has been received and will be reviewed and linked to your account by our team.',
    no_match_title: 'Booking not found',
    no_match_sub: 'We could not automatically match your booking. Our team will review it and link it to your account manually.',
    manual_title: 'Link booking manually',
    manual_sub: 'Enter your booking details to link the booking to your account.',
    ref_label: 'Booking Reference',
    email_label: 'Booking Email',
    arrival_label: 'Arrival Date',
    lookup_btn: 'Find Booking',
    view_bookings: 'View My Trips',
    goto_home: 'Go to Home',
    contact_hotel: 'Contact Hotel',
    arrival: 'Arrival',
    departure: 'Departure',
    room: 'Room',
    guests: 'Guests',
    status: 'Status',
    payment: 'Payment',
    note: 'Changes or cancellations must be arranged directly with the hotel.',
    ref: 'Booking Reference',
  },
  it: {
    eyebrow: 'Krone Langenburg by Ammesso',
    title: 'Conferma prenotazione',
    loading: 'Elaborazione della prenotazione…',
    login_title: 'Collega al tuo account',
    login_sub: 'Accedi per visualizzare la tua prenotazione nel tuo account ospiti.',
    login_btn: 'Accedi / Registrati',
    login_skip: 'Continua senza account',
    linking: 'Collegamento prenotazione…',
    success_title: 'Prenotazione collegata!',
    success_sub: 'La tua prenotazione è stata collegata al tuo account ospiti Krone.',
    unverified_title: 'Prenotazione ricevuta',
    unverified_sub: 'La tua prenotazione è stata ricevuta e sarà verificata dal nostro team.',
    no_match_title: 'Prenotazione non trovata',
    no_match_sub: 'Non riusciamo a trovare automaticamente la tua prenotazione. Il nostro team la verificherà manualmente.',
    manual_title: 'Collega manualmente',
    manual_sub: 'Inserisci i dati della tua prenotazione per collegarla al tuo account.',
    ref_label: 'Numero di prenotazione',
    email_label: 'Email di prenotazione',
    arrival_label: 'Data di arrivo',
    lookup_btn: 'Cerca prenotazione',
    view_bookings: 'Le mie prenotazioni',
    goto_home: 'Torna alla home',
    contact_hotel: "Contatta l'hotel",
    arrival: 'Arrivo',
    departure: 'Partenza',
    room: 'Camera',
    guests: 'Ospiti',
    status: 'Stato',
    payment: 'Pagamento',
    note: 'Modifiche o cancellazioni devono essere effettuate direttamente con l\'hotel.',
    ref: 'Numero prenotazione',
  },
};

function BookingCard({ link, c, lang }) {
  const locale = LOCALE_MAP[lang] || de;
  const formatDate = (d) => d ? format(new Date(d), 'EEE, d. MMM yyyy', { locale }) : '—';

  const STATUS_LABELS = {
    confirmed: { de: 'Bestätigt', en: 'Confirmed', it: 'Confermata' },
    pending: { de: 'Ausstehend', en: 'Pending', it: 'In attesa' },
    cancelled: { de: 'Storniert', en: 'Cancelled', it: 'Cancellata' },
    completed: { de: 'Abgeschlossen', en: 'Completed', it: 'Completata' },
    unknown: { de: 'Unbekannt', en: 'Unknown', it: 'Sconosciuto' },
  };
  const PAY_LABELS = {
    paid: { de: 'Bezahlt', en: 'Paid', it: 'Pagato' },
    unpaid: { de: 'Ausstehend', en: 'Unpaid', it: 'Non pagato' },
    partial: { de: 'Teilweise', en: 'Partial', it: 'Parziale' },
    refunded: { de: 'Erstattet', en: 'Refunded', it: 'Rimborsato' },
    unknown: { de: '—', en: '—', it: '—' },
  };

  return (
    <div className="bg-white border border-[#EDE6D8] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(28,23,20,0.08)]">
      {/* Header strip */}
      <div className="bg-[#1C1714] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body">Krone Langenburg · Beds24</p>
          <p className="text-white font-body text-sm font-semibold mt-0.5">{link.source_reference}</p>
        </div>
        <BedDouble className="w-5 h-5 text-[#C9A96E]/60" />
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm font-body">
          <div>
            <p className="text-[#8A7A6A] text-[10px] uppercase tracking-wider mb-0.5">{c.arrival}</p>
            <p className="text-[#1C1714] font-medium">{formatDate(link.arrival_date)}</p>
          </div>
          <div>
            <p className="text-[#8A7A6A] text-[10px] uppercase tracking-wider mb-0.5">{c.departure}</p>
            <p className="text-[#1C1714] font-medium">{formatDate(link.departure_date)}</p>
          </div>
          {link.room_type && (
            <div>
              <p className="text-[#8A7A6A] text-[10px] uppercase tracking-wider mb-0.5">{c.room}</p>
              <p className="text-[#1C1714]">{link.room_type}</p>
            </div>
          )}
          {link.number_of_guests && (
            <div>
              <p className="text-[#8A7A6A] text-[10px] uppercase tracking-wider mb-0.5">{c.guests}</p>
              <p className="text-[#1C1714]">{link.number_of_guests}</p>
            </div>
          )}
          <div>
            <p className="text-[#8A7A6A] text-[10px] uppercase tracking-wider mb-0.5">{c.status}</p>
            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
              link.booking_status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
              link.booking_status === 'cancelled' ? 'bg-red-50 text-red-600' :
              'bg-stone-100 text-stone-600'
            }`}>
              {STATUS_LABELS[link.booking_status]?.[lang] || link.booking_status}
            </span>
          </div>
          {link.payment_status && link.payment_status !== 'unknown' && (
            <div>
              <p className="text-[#8A7A6A] text-[10px] uppercase tracking-wider mb-0.5">{c.payment}</p>
              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                link.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {PAY_LABELS[link.payment_status]?.[lang] || link.payment_status}
                {link.total_price ? ` · €${link.total_price}` : ''}
              </span>
            </div>
          )}
        </div>
        {!link.verified && (
          <p className="text-amber-600 text-xs font-body bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            {lang === 'de' ? '⏳ Wird von unserem Team geprüft' : lang === 'en' ? '⏳ Being reviewed by our team' : '⏳ In verifica dal nostro team'}
          </p>
        )}
        <p className="text-[#8A7A6A] text-xs font-body leading-relaxed border-t border-[#EDE6D8] pt-3">{c.note}</p>
        <div className="flex gap-2 pt-1">
          <Link to="/contact" className="flex-1 py-3 text-center text-xs font-body font-semibold tracking-wider uppercase border border-[#C9A96E]/40 text-[#8B6914] hover:bg-[#8B6914]/5 rounded-xl transition-colors">
            {c.contact_hotel}
          </Link>
          <Link to="/account/messages" className="flex-1 py-3 text-center text-xs font-body font-semibold tracking-wider uppercase bg-[#1C1714] hover:bg-[#2A2118] text-white rounded-xl transition-colors">
            {lang === 'de' ? 'Nachricht senden' : lang === 'en' ? 'Send Message' : 'Invia messaggio'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmed() {
  const { lang } = useLang();
  const c = COPY[lang] || COPY.de;

  const [phase, setPhase] = useState('init'); // init | login_prompt | linking | success | unverified | no_match | manual | manual_submitted
  const [user, setUser] = useState(null);
  const [params, setParams] = useState({});
  const [linkedBooking, setLinkedBooking] = useState(null);
  const [logId, setLogId] = useState(null);

  // Manual form
  const [manualRef, setManualRef] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualArrival, setManualArrival] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

  // Read URL params on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const extracted = {
      booking_reference: urlParams.get('bookid') || urlParams.get('bookId') || urlParams.get('reference') || urlParams.get('booking_id') || urlParams.get('ref') || '',
      extracted_email: urlParams.get('email') || urlParams.get('guestemail') || '',
      arrival_date: urlParams.get('arrival') || urlParams.get('checkin') || urlParams.get('firstnight') || '',
      departure_date: urlParams.get('departure') || urlParams.get('checkout') || urlParams.get('lastnight') || '',
      raw_params: JSON.stringify(Object.fromEntries(urlParams.entries())),
    };
    setParams(extracted);
    if (extracted.booking_reference) setManualRef(extracted.booking_reference);
    if (extracted.extracted_email) setManualEmail(extracted.extracted_email);
    if (extracted.arrival_date) setManualArrival(extracted.arrival_date);
  }, []);

  // Check auth
  useEffect(() => {
    if (!params) return;
    base44.auth.isAuthenticated().then(async (auth) => {
      if (auth) {
        const u = await base44.auth.me().catch(() => null);
        setUser(u);
        setPhase('linking');
      } else {
        setPhase('login_prompt');
      }
    }).catch(() => setPhase('login_prompt'));
  }, [params]);

  // When user logs in mid-flow (via return from login page)
  useEffect(() => {
    if (phase === 'linking' && user) {
      doLink();
    }
  }, [phase, user]);

  async function doLink() {
    setPhase('linking');

    // Log the return event
    let returnLogId = logId;
    if (!returnLogId) {
      const log = await base44.entities.Beds24ReturnLog.create({
        user_id: user?.id,
        user_email: user?.email,
        raw_query_params: params.raw_params,
        extracted_booking_reference: params.booking_reference,
        extracted_email: params.extracted_email,
        extracted_arrival: params.arrival_date,
        extracted_departure: params.departure_date,
        match_status: 'pending',
        created_at: new Date().toISOString(),
      }).catch(() => null);
      returnLogId = log?.id;
      setLogId(returnLogId);
    }

    if (!params.booking_reference && !params.extracted_email && !params.arrival_date) {
      setPhase('manual');
      return;
    }

    const res = await base44.functions.invoke('beds24LinkBooking', {
      ...params,
      return_log_id: returnLogId,
    });

    const data = res.data;

    if (data?.success && data?.status === 'already_linked') {
      setLinkedBooking(data.link);
      setPhase('success');
    } else if (data?.success) {
      setLinkedBooking(data.link);
      setPhase(data.status === 'verified' ? 'success' : 'unverified');
    } else if (data?.status === 'no_match') {
      setPhase('no_match');
    } else {
      setPhase('manual');
    }
  }

  async function handleManualLookup(e) {
    e.preventDefault();
    if (!user) {
      // Store params and redirect to login
      sessionStorage.setItem('beds24_pending_params', JSON.stringify({
        booking_reference: manualRef,
        extracted_email: manualEmail,
        arrival_date: manualArrival,
      }));
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    setManualLoading(true);

    // Create lookup request
    await base44.entities.BookingLookupRequest.create({
      user_id: user.id,
      user_email: user.email,
      booking_reference: manualRef,
      guest_email: manualEmail || user.email,
      arrival_date: manualArrival,
      status: 'pending',
      return_log_id: logId,
    }).catch(() => {});

    // Also attempt link with the provided data
    const res = await base44.functions.invoke('beds24LinkBooking', {
      booking_reference: manualRef,
      extracted_email: manualEmail || user.email,
      arrival_date: manualArrival,
      raw_params: JSON.stringify({ manual: true }),
      return_log_id: logId,
    });

    const data = res.data;
    if (data?.success) {
      setLinkedBooking(data.link);
      setPhase(data.status === 'verified' ? 'success' : 'unverified');
    } else {
      setPhase('manual_submitted');
    }
    setManualLoading(false);
  }

  function handleLoginRedirect() {
    // Save current URL params to restore after login
    const currentSearch = window.location.search;
    sessionStorage.setItem('beds24_return_search', currentSearch);
    base44.auth.redirectToLogin(window.location.href);
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-16 sm:pt-20 pb-24">
      <div className="max-w-xl mx-auto px-4 sm:px-5 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#8B6914] text-[10px] tracking-[0.5em] uppercase font-body mb-2">{c.eyebrow}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-[#1C1714]">{c.title}</h1>
        </div>

        <AnimatePresence mode="wait">

          {/* INIT / LINKING */}
          {(phase === 'init' || phase === 'linking') && (
            <motion.div key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center py-16 gap-4">
              <Loader2 className="w-10 h-10 text-[#C9A96E] animate-spin" />
              <p className="font-body text-[#8A7A6A] text-sm">{phase === 'linking' ? c.linking : c.loading}</p>
            </motion.div>
          )}

          {/* LOGIN PROMPT */}
          {phase === 'login_prompt' && (
            <motion.div key="login"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white border border-[#EDE6D8] rounded-2xl p-8 shadow-[0_4px_20px_rgba(28,23,20,0.08)] text-center">
              <div className="w-16 h-16 bg-[#C9A96E]/10 border border-[#C9A96E]/25 rounded-full flex items-center justify-center mx-auto mb-5">
                <LogIn className="w-7 h-7 text-[#C9A96E]" />
              </div>
              <h2 className="font-display text-2xl font-light text-[#1C1714] mb-2">{c.login_title}</h2>
              <p className="font-body text-[#8A7A6A] text-sm leading-relaxed mb-7">{c.login_sub}</p>
              <button onClick={handleLoginRedirect}
                className="w-full py-4 bg-[#1C1714] hover:bg-[#2A2118] text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all shadow-lg mb-3 flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" /> {c.login_btn}
              </button>
              <button onClick={() => setPhase('manual')}
                className="w-full py-3 border border-[#EDE6D8] text-[#8A7A6A] hover:text-[#1C1714] rounded-full text-xs tracking-widest uppercase font-body transition-colors">
                {c.login_skip}
              </button>
            </motion.div>
          )}

          {/* SUCCESS */}
          {phase === 'success' && (
            <motion.div key="success"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-5">
              <div className="bg-white border border-[#EDE6D8] rounded-2xl p-7 text-center shadow-[0_4px_20px_rgba(28,23,20,0.06)]">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="font-display text-2xl font-light text-[#1C1714] mb-2">{c.success_title}</h2>
                <p className="font-body text-[#8A7A6A] text-sm">{c.success_sub}</p>
              </div>
              {linkedBooking && <BookingCard link={linkedBooking} c={c} lang={lang} />}
              <div className="flex gap-3">
                <Link to="/meine-reisen?new=1" className="flex-1 py-4 text-center bg-[#1C1714] hover:bg-[#2A2118] text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all">
                  {c.view_bookings}
                </Link>
                <Link to="/" className="flex-1 py-4 text-center border border-[#EDE6D8] text-[#8A7A6A] hover:text-[#1C1714] rounded-full text-xs tracking-widest uppercase font-body transition-colors">
                  {c.goto_home}
                </Link>
              </div>
            </motion.div>
          )}

          {/* UNVERIFIED (pending admin review) */}
          {phase === 'unverified' && (
            <motion.div key="unverified"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-5">
              <div className="bg-white border border-amber-100 rounded-2xl p-7 text-center shadow-[0_4px_20px_rgba(28,23,20,0.06)]">
                <div className="w-16 h-16 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                <h2 className="font-display text-2xl font-light text-[#1C1714] mb-2">{c.unverified_title}</h2>
                <p className="font-body text-[#8A7A6A] text-sm">{c.unverified_sub}</p>
              </div>
              {linkedBooking && <BookingCard link={linkedBooking} c={c} lang={lang} />}
              <div className="flex gap-3">
                <Link to="/meine-reisen?new=1" className="flex-1 py-4 text-center bg-[#1C1714] hover:bg-[#2A2118] text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all">
                  {c.view_bookings}
                </Link>
                <Link to="/contact" className="flex-1 py-4 text-center border border-[#EDE6D8] text-[#8A7A6A] hover:text-[#1C1714] rounded-full text-xs tracking-widest uppercase font-body transition-colors">
                  {c.contact_hotel}
                </Link>
              </div>
            </motion.div>
          )}

          {/* NO MATCH */}
          {phase === 'no_match' && (
            <motion.div key="no_match"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-5">
              <div className="bg-white border border-[#EDE6D8] rounded-2xl p-7 text-center shadow-[0_4px_20px_rgba(28,23,20,0.06)]">
                <div className="w-16 h-16 bg-[#F2E8D0] border border-[#C9A96E]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-[#C9A96E]" />
                </div>
                <h2 className="font-display text-2xl font-light text-[#1C1714] mb-2">{c.no_match_title}</h2>
                <p className="font-body text-[#8A7A6A] text-sm">{c.no_match_sub}</p>
              </div>
              <button onClick={() => setPhase('manual')}
                className="w-full py-4 bg-[#1C1714] hover:bg-[#2A2118] text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all">
                {c.manual_title}
              </button>
              <div className="flex gap-3">
                <Link to="/meine-reisen" className="flex-1 py-4 text-center border border-[#EDE6D8] text-[#8A7A6A] hover:text-[#1C1714] rounded-full text-xs tracking-widest uppercase font-body transition-colors">
                  {c.view_bookings}
                </Link>
                <Link to="/contact" className="flex-1 py-4 text-center border border-[#EDE6D8] text-[#8A7A6A] hover:text-[#1C1714] rounded-full text-xs tracking-widest uppercase font-body transition-colors">
                  {c.contact_hotel}
                </Link>
              </div>
            </motion.div>
          )}

          {/* MANUAL FORM */}
          {phase === 'manual' && (
            <motion.div key="manual"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white border border-[#EDE6D8] rounded-2xl p-7 shadow-[0_4px_20px_rgba(28,23,20,0.06)]">
              <h2 className="font-display text-2xl font-light text-[#1C1714] mb-1">{c.manual_title}</h2>
              <p className="font-body text-[#8A7A6A] text-sm mb-6">{c.manual_sub}</p>
              <form onSubmit={handleManualLookup} className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase font-body text-[#8A7A6A] mb-1.5">{c.ref_label}</label>
                  <input type="text" value={manualRef} onChange={e => setManualRef(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EDE6D8] rounded-xl px-4 py-3.5 text-sm font-body text-[#1C1714] focus:outline-none focus:border-[#C9A96E]/50 focus:ring-2 focus:ring-[#C9A96E]/10 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase font-body text-[#8A7A6A] mb-1.5">{c.email_label}</label>
                  <input type="email" value={manualEmail} onChange={e => setManualEmail(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EDE6D8] rounded-xl px-4 py-3.5 text-sm font-body text-[#1C1714] focus:outline-none focus:border-[#C9A96E]/50 focus:ring-2 focus:ring-[#C9A96E]/10 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase font-body text-[#8A7A6A] mb-1.5">{c.arrival_label}</label>
                  <input type="date" value={manualArrival} onChange={e => setManualArrival(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EDE6D8] rounded-xl px-4 py-3.5 text-sm font-body text-[#1C1714] focus:outline-none focus:border-[#C9A96E]/50 transition-all" />
                </div>
                <button type="submit" disabled={manualLoading || (!manualRef && !manualEmail)}
                  className="w-full py-4 bg-[#1C1714] hover:bg-[#2A2118] disabled:opacity-50 text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all flex items-center justify-center gap-2">
                  {manualLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {c.lookup_btn}
                </button>
              </form>
            </motion.div>
          )}

          {/* MANUAL SUBMITTED */}
          {phase === 'manual_submitted' && (
            <motion.div key="manual_submitted"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white border border-[#EDE6D8] rounded-2xl p-8 text-center shadow-[0_4px_20px_rgba(28,23,20,0.06)]">
              <div className="w-16 h-16 bg-[#C9A96E]/10 border border-[#C9A96E]/25 rounded-full flex items-center justify-center mx-auto mb-5">
                <Mail className="w-7 h-7 text-[#C9A96E]" />
              </div>
              <h2 className="font-display text-2xl font-light text-[#1C1714] mb-2">{c.no_match_title}</h2>
              <p className="font-body text-[#8A7A6A] text-sm leading-relaxed mb-7">{c.no_match_sub}</p>
              <div className="flex gap-3">
                <Link to="/account/reservations" className="flex-1 py-4 text-center bg-[#1C1714] hover:bg-[#2A2118] text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all">
                  {c.view_bookings}
                </Link>
                <Link to="/contact" className="flex-1 py-4 text-center border border-[#EDE6D8] text-[#8A7A6A] hover:text-[#1C1714] rounded-full text-xs tracking-widest uppercase font-body transition-colors">
                  {c.contact_hotel}
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}