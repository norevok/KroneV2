import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { BedDouble, Calendar, Users, Hash, Tag, ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { de, enUS, it as itLocale } from 'date-fns/locale';

const LOCALE_MAP = { de, en: enUS, it: itLocale };

const COPY = {
  de: {
    eyebrow: 'Krone Langenburg by Ammesso',
    title: 'Meine Reisen',
    sub: 'Ihre Hotelaufenthalte auf einen Blick.',
    back: 'Zurück zum Konto',
    empty_title: 'Noch keine Reisen',
    empty_sub: 'Nach einer erfolgreichen Buchung erscheinen Ihre Aufenthalte hier automatisch.',
    book_now: 'Zimmer buchen',
    success_msg: 'Ihre Buchung wurde erfolgreich abgeschlossen und Ihrem Konto hinzugefügt.',
    checkin: 'Check-In',
    checkout: 'Check-Out',
    room: 'Zimmertyp',
    ref: 'Buchungsreferenz',
    status: 'Status',
    guests: 'Gäste',
    payment: 'Zahlung',
    pending_note: 'Wird von unserem Team geprüft',
    contact: 'Kontakt',
    status_confirmed: 'Bestätigt',
    status_pending: 'Ausstehend',
    status_cancelled: 'Storniert',
    status_completed: 'Abgeschlossen',
    status_unknown: 'Unbekannt',
    pay_paid: 'Bezahlt',
    pay_unpaid: 'Offen',
    pay_partial: 'Teilweise',
    pay_refunded: 'Erstattet',
  },
  en: {
    eyebrow: 'Krone Langenburg by Ammesso',
    title: 'My Trips',
    sub: 'Your hotel stays at a glance.',
    back: 'Back to Account',
    empty_title: 'No trips yet',
    empty_sub: 'After a successful booking, your stays will appear here automatically.',
    book_now: 'Book a Room',
    success_msg: 'Your booking has been successfully completed and added to your account.',
    checkin: 'Check-In',
    checkout: 'Check-Out',
    room: 'Room Type',
    ref: 'Booking Reference',
    status: 'Status',
    guests: 'Guests',
    payment: 'Payment',
    pending_note: 'Being reviewed by our team',
    contact: 'Contact',
    status_confirmed: 'Confirmed',
    status_pending: 'Pending',
    status_cancelled: 'Cancelled',
    status_completed: 'Completed',
    status_unknown: 'Unknown',
    pay_paid: 'Paid',
    pay_unpaid: 'Unpaid',
    pay_partial: 'Partial',
    pay_refunded: 'Refunded',
  },
  it: {
    eyebrow: 'Krone Langenburg by Ammesso',
    title: 'I miei viaggi',
    sub: 'I tuoi soggiorni in hotel a colpo d\'occhio.',
    back: 'Torna al profilo',
    empty_title: 'Nessun viaggio ancora',
    empty_sub: 'Dopo una prenotazione riuscita, i tuoi soggiorni appariranno qui automaticamente.',
    book_now: 'Prenota camera',
    success_msg: 'La prenotazione è stata completata con successo e aggiunta al tuo account.',
    checkin: 'Check-In',
    checkout: 'Check-Out',
    room: 'Tipo di camera',
    ref: 'Numero prenotazione',
    status: 'Stato',
    guests: 'Ospiti',
    payment: 'Pagamento',
    pending_note: 'In verifica dal nostro team',
    contact: 'Contatto',
    status_confirmed: 'Confermata',
    status_pending: 'In attesa',
    status_cancelled: 'Cancellata',
    status_completed: 'Completata',
    status_unknown: 'Sconosciuto',
    pay_paid: 'Pagato',
    pay_unpaid: 'Non pagato',
    pay_partial: 'Parziale',
    pay_refunded: 'Rimborsato',
  },
};

function statusLabel(status, c) {
  const map = { confirmed: c.status_confirmed, pending: c.status_pending, cancelled: c.status_cancelled, completed: c.status_completed, unknown: c.status_unknown };
  return map[status] || status;
}
function payLabel(status, c) {
  const map = { paid: c.pay_paid, unpaid: c.pay_unpaid, partial: c.pay_partial, refunded: c.pay_refunded };
  return map[status] || status;
}
function statusColor(status) {
  if (status === 'confirmed') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (status === 'cancelled') return 'bg-red-50 text-red-600 border-red-100';
  if (status === 'completed') return 'bg-stone-100 text-stone-600 border-stone-200';
  return 'bg-amber-50 text-amber-700 border-amber-100';
}

function TripCard({ booking, c, lang }) {
  const locale = LOCALE_MAP[lang] || de;
  const fmt = (d) => { try { return format(new Date(d), 'EEE, d. MMM yyyy', { locale }); } catch { return d || '—'; } };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#EDE6D8] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(28,23,20,0.07)]">

      {/* Header strip */}
      <div className="bg-[#1C1714] px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body">Krone Langenburg · Beds24</p>
          <p className="text-white font-body text-sm font-semibold mt-0.5">{booking.source_reference || '—'}</p>
        </div>
        <BedDouble className="w-5 h-5 text-[#C9A96E]/50" />
      </div>

      <div className="p-5 space-y-4">
        {/* Dates row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3 h-3 text-[#8B6914]" />
              <p className="text-[#8A7A6A] text-[10px] uppercase tracking-wider font-body">{c.checkin}</p>
            </div>
            <p className="text-[#1C1714] text-sm font-body font-medium">{fmt(booking.arrival_date)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3 h-3 text-[#8B6914]" />
              <p className="text-[#8A7A6A] text-[10px] uppercase tracking-wider font-body">{c.checkout}</p>
            </div>
            <p className="text-[#1C1714] text-sm font-body font-medium">{fmt(booking.departure_date)}</p>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {booking.room_type && (
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Tag className="w-3 h-3 text-[#8B6914]" />
                <p className="text-[#8A7A6A] text-[10px] uppercase tracking-wider font-body">{c.room}</p>
              </div>
              <p className="text-[#1C1714] font-body text-xs">{booking.room_type}</p>
            </div>
          )}
          {booking.number_of_guests && (
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="w-3 h-3 text-[#8B6914]" />
                <p className="text-[#8A7A6A] text-[10px] uppercase tracking-wider font-body">{c.guests}</p>
              </div>
              <p className="text-[#1C1714] font-body text-xs">{booking.number_of_guests}</p>
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Hash className="w-3 h-3 text-[#8B6914]" />
              <p className="text-[#8A7A6A] text-[10px] uppercase tracking-wider font-body">{c.status}</p>
            </div>
            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-body font-semibold border ${statusColor(booking.booking_status)}`}>
              {statusLabel(booking.booking_status, c)}
            </span>
          </div>
          {booking.payment_status && booking.payment_status !== 'unknown' && (
            <div>
              <p className="text-[#8A7A6A] text-[10px] uppercase tracking-wider font-body mb-1">{c.payment}</p>
              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-body font-semibold border ${
                booking.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {payLabel(booking.payment_status, c)}{booking.total_price ? ` · €${booking.total_price}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Unverified notice */}
        {!booking.verified && (
          <p className="text-amber-600 text-xs font-body bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            ⏳ {c.pending_note}
          </p>
        )}

        {/* Contact link */}
        <Link to="/contact"
          className="block w-full py-3 text-center text-xs font-body font-semibold tracking-widest uppercase border border-[#C9A96E]/40 text-[#8B6914] hover:bg-[#8B6914]/5 rounded-xl transition-colors">
          {c.contact}
        </Link>
      </div>
    </motion.div>
  );
}

export default function MeineReisen() {
  const { lang } = useLang();
  const c = COPY[lang] || COPY.de;

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check if coming from a fresh booking return
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('new') === '1') setShowSuccess(true);

    base44.auth.isAuthenticated().then(async (auth) => {
      if (!auth) { base44.auth.redirectToLogin(window.location.href); return; }
      const user = await base44.auth.me();
      const links = await base44.entities.GuestReservationLink.filter(
        { user_email: user.email },
        '-created_date',
        50
      ).catch(() => []);
      setBookings(links);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Real-time subscription — new booking appears automatically
  useEffect(() => {
    const unsubscribe = base44.entities.GuestReservationLink.subscribe((event) => {
      if (event.type === 'create') {
        setBookings(prev => [event.data, ...prev]);
        setShowSuccess(true);
      } else if (event.type === 'update') {
        setBookings(prev => prev.map(b => b.id === event.id ? event.data : b));
      } else if (event.type === 'delete') {
        setBookings(prev => prev.filter(b => b.id !== event.id));
      }
    });
    return unsubscribe;
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <Loader2 className="w-7 h-7 text-[#C9A96E] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 lg:pb-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-5 pt-6 pb-12" style={{ paddingTop: 'calc(var(--nav-h-mobile) + 24px)' }}>

        {/* Back */}
        <Link to="/account" className="flex items-center gap-2 text-[#8A7A6A] hover:text-[#1C1714] text-xs font-body tracking-widest uppercase mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> {c.back}
        </Link>

        {/* Title */}
        <div className="mb-8">
          <p className="text-[#8B6914] text-[10px] tracking-[0.5em] uppercase font-body mb-2">{c.eyebrow}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714]">{c.title}</h1>
          <p className="text-[#8A7A6A] font-body text-sm mt-1">{c.sub}</p>
        </div>

        {/* Success banner */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-emerald-800 text-sm font-body leading-relaxed">{c.success_msg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bookings list */}
        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-[#EDE6D8] rounded-2xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#F2E8D0] border border-[#C9A96E]/20 rounded-full flex items-center justify-center mx-auto mb-5">
              <BedDouble className="w-7 h-7 text-[#C9A96E]" />
            </div>
            <h2 className="font-display text-2xl font-light text-[#1C1714] mb-2">{c.empty_title}</h2>
            <p className="text-[#8A7A6A] font-body text-sm leading-relaxed mb-7 max-w-xs mx-auto">{c.empty_sub}</p>
            <Link to="/rooms"
              className="inline-flex items-center gap-2 btn-gold px-6">
              <Plus className="w-4 h-4" /> {c.book_now}
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <TripCard key={b.id} booking={b} c={c} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}