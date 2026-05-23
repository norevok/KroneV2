import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import {
  ArrowLeft, Calendar, Clock, Users, XCircle, AlertTriangle,
  Search, CheckCircle, BedDouble, UtensilsCrossed, Plus,
  ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

const STATUS_MAP = {
  de: {
    new: 'Neu', pending: 'Ausstehend', confirmed: 'Bestätigt', seated: 'Eingecheckt',
    completed: 'Abgeschlossen', cancelled_by_guest: 'Gast abgesagt',
    cancelled_by_staff: 'Storniert', no_show: 'Nicht erschienen', archived: 'Archiviert'
  },
  en: {
    new: 'New', pending: 'Pending', confirmed: 'Confirmed', seated: 'Seated',
    completed: 'Completed', cancelled_by_guest: 'Cancelled', cancelled_by_staff: 'Cancelled',
    no_show: 'No show', archived: 'Archived'
  },
  it: {
    new: 'Nuovo', pending: 'In attesa', confirmed: 'Confermato', seated: 'Seduto',
    completed: 'Completato', cancelled_by_guest: 'Annullato',
    cancelled_by_staff: 'Annullato', no_show: 'Non presentato', archived: 'Archiviato'
  },
};

const STATUS_COLORS = {
  new: 'text-[#A47A12] bg-[#A47A12]/10 border-[#A47A12]/20',
  pending: 'text-[#A47A12] bg-[#A47A12]/10 border-[#A47A12]/20',
  confirmed: 'text-[#17352C] bg-[#17352C]/10 border-[#17352C]/20',
  seated: 'text-blue-700 bg-blue-50 border-blue-200',
  completed: 'text-[#5F5A52] bg-[#5F5A52]/8 border-[#5F5A52]/15',
  cancelled_by_guest: 'text-[#B42318] bg-[#B42318]/8 border-[#B42318]/15',
  cancelled_by_staff: 'text-[#B42318] bg-[#B42318]/8 border-[#B42318]/15',
  no_show: 'text-[#B42318]/70 bg-[#B42318]/5 border-[#B42318]/10',
  archived: 'text-[#5F5A52]/50 bg-[#5F5A52]/5 border-[#5F5A52]/10',
};

const NON_CANCELLABLE = ['cancelled_by_guest', 'cancelled_by_staff', 'no_show', 'archived', 'completed'];

export default function GuestReservations() {
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState({});
  const [cancelSuccess, setCancelSuccess] = useState({});
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [expanded, setExpanded] = useState({});

  // Lookup form
  const [lookupForm, setLookupForm] = useState({ confirmation_number: '', first_name: '', last_name: '', email: '', check_in: '' });
  const [lookupSubmitting, setLookupSubmitting] = useState(false);
  const [lookupDone, setLookupDone] = useState(false);

  async function loadData(u) {
    const [res, hotel] = await Promise.all([
      base44.entities.RestaurantReservation.filter({ guest_email: u.email }, '-reservation_date', 100).catch(() => []),
      base44.entities.GuestReservationLink.filter({ user_email: u.email }, '-created_date', 20).catch(() => []),
    ]);
    setReservations(res);
    setHotelBookings(hotel);
  }

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (auth) => {
      if (!auth) { base44.auth.redirectToLogin(window.location.href); return; }
      const u = await base44.auth.me();
      setUser(u);
      await loadData(u);
      setLoading(false);
    });
  }, []);

  async function handleCancel(reservationId) {
    setCancellingId(reservationId);
    setCancelError(prev => ({ ...prev, [reservationId]: null }));
    const res = await base44.functions.invoke('cancelReservation', { reservation_id: reservationId });
    if (res.data?.success) {
      setCancelSuccess(prev => ({ ...prev, [reservationId]: true }));
      setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'cancelled_by_guest' } : r));
    } else {
      const err = res.data?.error;
      let msg;
      if (err === 'too_late') {
        msg = lang === 'de' ? 'Stornierung nicht mehr möglich (< 24h vor dem Termin). Bitte rufen Sie uns an.' : lang === 'en' ? 'Cannot cancel less than 24h before. Please call us.' : 'Impossibile annullare meno di 24h prima.';
      } else if (err === 'already_cancelled') {
        msg = lang === 'de' ? 'Bereits storniert.' : lang === 'en' ? 'Already cancelled.' : 'Già annullato.';
      } else {
        msg = lang === 'de' ? 'Fehler. Bitte kontaktieren Sie uns direkt.' : lang === 'en' ? 'Error. Please contact us.' : 'Errore. Contattateci.';
      }
      setCancelError(prev => ({ ...prev, [reservationId]: msg }));
    }
    setCancellingId(null);
    setConfirmCancel(null);
  }

  async function handleLookup(e) {
    e.preventDefault();
    setLookupSubmitting(true);
    await base44.entities.HotelBookingIntent.create({
      intent_ref: `LOOKUP-${Date.now().toString(36).toUpperCase()}`,
      status: 'needs_review',
      guest_email: (lookupForm.email || user?.email || '').toLowerCase(),
      guest_first_name: lookupForm.first_name,
      guest_last_name: lookupForm.last_name,
      check_in: lookupForm.check_in,
      beds24_booking_ref: lookupForm.confirmation_number,
      manual_review_required: true,
      sync_notes: `Guest lookup request. Conf#: ${lookupForm.confirmation_number}`,
    }).catch(() => {});
    base44.functions.invoke('notifySlack', {
      type: 'booking_intent',
      ref: lookupForm.confirmation_number || 'LOOKUP',
      name: `${lookupForm.first_name} ${lookupForm.last_name}`,
      email: lookupForm.email || user?.email,
      check_in: lookupForm.check_in,
      message: 'Guest booking lookup request — manual review needed.',
    }).catch(() => {});
    setLookupDone(true);
    setLookupSubmitting(false);
  }

  const C = {
    de: {
      title: 'Reservierungen & Buchungen',
      back: 'Zurück zum Konto',
      tab_upcoming: 'Bevorstehend',
      tab_past: 'Vergangen',
      tab_hotel: 'Hotelzimmer',
      empty_upcoming: 'Keine bevorstehenden Reservierungen.',
      empty_past: 'Keine vergangenen Reservierungen.',
      empty_hotel: 'Keine verknüpften Zimmer-Buchungen.',
      cta_reserve: 'Tisch reservieren',
      cta_rooms: 'Zimmer buchen',
      cancel_btn: 'Stornieren',
      cancel_confirm: 'Reservierung wirklich stornieren?',
      cancel_yes: 'Ja, stornieren',
      cancel_no: 'Abbrechen',
      cancel_policy: 'Kostenlos stornierbar bis 24h vor dem Termin. Sie erhalten eine Bestätigungsmail.',
      cancel_success: '✓ Storniert. Bestätigung wird per E-Mail gesendet.',
      guests: 'Gäste',
      requests: 'Sonderwünsche:',
      notes: 'Bemerkungen:',
      refresh: 'Aktualisieren',
      lookup_title: 'Hotelbuchung verknüpfen',
      lookup_sub: 'Buchung über Beds24 oder per E-Mail gemacht? Daten eingeben — wir verknüpfen manuell.',
      lookup_conf: 'Bestätigungsnummer / Ref.',
      lookup_first: 'Vorname', lookup_last: 'Nachname',
      lookup_email: 'E-Mail der Buchung', lookup_checkin: 'Check-in-Datum',
      lookup_submit: 'Buchung anfragen',
      lookup_success: 'Anfrage gespeichert. Wir prüfen die Buchung und melden uns innerhalb von 24 Stunden.',
      hotel_contact: 'Hotel kontaktieren',
      hotel_message: 'Nachricht senden',
      hotel_change_note: 'Änderungen/Stornierungen nur direkt über das Hotel.',
      hotel_unverified: '⏳ Wird von unserem Team geprüft',
      arrival: 'Anreise', departure: 'Abreise', room: 'Zimmer', guests_lbl: 'Gäste', payment: 'Zahlung',
    },
    en: {
      title: 'Reservations & Bookings',
      back: 'Back to Account',
      tab_upcoming: 'Upcoming',
      tab_past: 'Past',
      tab_hotel: 'Hotel Rooms',
      empty_upcoming: 'No upcoming reservations.',
      empty_past: 'No past reservations.',
      empty_hotel: 'No linked hotel bookings.',
      cta_reserve: 'Reserve a Table',
      cta_rooms: 'Book a Room',
      cancel_btn: 'Cancel',
      cancel_confirm: 'Cancel this reservation?',
      cancel_yes: 'Yes, cancel',
      cancel_no: 'Keep it',
      cancel_policy: 'Free cancellation up to 24h before. You will receive a confirmation email.',
      cancel_success: '✓ Cancelled. Confirmation will be sent by email.',
      guests: 'guests',
      requests: 'Requests:',
      notes: 'Notes:',
      refresh: 'Refresh',
      lookup_title: 'Link Hotel Booking',
      lookup_sub: 'Booked via Beds24 or by email? Enter your details — we will link manually.',
      lookup_conf: 'Confirmation / Booking Ref.',
      lookup_first: 'First Name', lookup_last: 'Last Name',
      lookup_email: 'Booking Email', lookup_checkin: 'Check-in Date',
      lookup_submit: 'Find My Booking',
      lookup_success: 'Request saved. We will review your booking and be in touch within 24 hours.',
      hotel_contact: 'Contact Hotel',
      hotel_message: 'Send Message',
      hotel_change_note: 'Changes or cancellations must be arranged directly with the hotel.',
      hotel_unverified: '⏳ Being reviewed by our team',
      arrival: 'Arrival', departure: 'Departure', room: 'Room', guests_lbl: 'Guests', payment: 'Payment',
    },
    it: {
      title: 'Prenotazioni',
      back: 'Torna al profilo',
      tab_upcoming: 'Future',
      tab_past: 'Passate',
      tab_hotel: 'Hotel',
      empty_upcoming: 'Nessuna prenotazione futura.',
      empty_past: 'Nessuna prenotazione passata.',
      empty_hotel: 'Nessuna prenotazione hotel.',
      cta_reserve: 'Prenota un tavolo',
      cta_rooms: 'Prenota camera',
      cancel_btn: 'Annulla',
      cancel_confirm: 'Annullare questa prenotazione?',
      cancel_yes: 'Sì, annulla',
      cancel_no: 'Torna indietro',
      cancel_policy: 'Annullamento gratuito fino a 24h prima. Riceverete una conferma via email.',
      cancel_success: '✓ Annullato. Conferma inviata via email.',
      guests: 'ospiti',
      requests: 'Richieste:',
      notes: 'Note:',
      refresh: 'Aggiorna',
      lookup_title: 'Collega prenotazione hotel',
      lookup_sub: 'Prenotato tramite Beds24 o email? Inserisci i dati — collegheremo manualmente.',
      lookup_conf: 'Numero di conferma / Ref.',
      lookup_first: 'Nome', lookup_last: 'Cognome',
      lookup_email: 'Email prenotazione', lookup_checkin: 'Data check-in',
      lookup_submit: 'Cerca prenotazione',
      lookup_success: 'Richiesta salvata. Verificheremo entro 24 ore.',
      hotel_contact: 'Contatta hotel',
      hotel_message: 'Invia messaggio',
      hotel_change_note: 'Modifiche o annullamenti solo direttamente con l\'hotel.',
      hotel_unverified: '⏳ In verifica dal nostro team',
      arrival: 'Arrivo', departure: 'Partenza', room: 'Camera', guests_lbl: 'Ospiti', payment: 'Pagamento',
    },
  };
  const c = C[lang] || C.de;
  const statusMap = STATUS_MAP[lang] || STATUS_MAP.de;

  const canCancel = (r) => {
    if (NON_CANCELLABLE.includes(r.status)) return false;
    const resDateTime = new Date(`${r.reservation_date}T${r.reservation_time}:00`);
    return (resDateTime - new Date()) / (1000 * 60 * 60) >= 24;
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingRes = reservations.filter(r =>
    r.reservation_date >= today && !['cancelled_by_guest', 'cancelled_by_staff', 'no_show', 'archived'].includes(r.status)
  );
  const pastRes = reservations.filter(r =>
    r.reservation_date < today || ['cancelled_by_guest', 'cancelled_by_staff', 'no_show', 'completed', 'archived'].includes(r.status)
  );

  const tabs = [
    { key: 'upcoming', label: c.tab_upcoming, count: upcomingRes.length, icon: Calendar },
    { key: 'past', label: c.tab_past, count: pastRes.length, icon: Clock },
    { key: 'hotel', label: c.tab_hotel, count: hotelBookings.length, icon: BedDouble },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-[#A47A12]/20 border-t-[#A47A12] rounded-full animate-spin" />
    </div>
  );

  const ReservationCard = ({ r }) => {
    const isExpanded = expanded[r.id];
    return (
      <div className="bg-white border border-[#E8DED0] rounded-xl shadow-sm overflow-hidden hover:border-[#A47A12]/30 transition-all">
        {/* Card header */}
        <div
          className="p-4 sm:p-5 cursor-pointer select-none"
          onClick={() => setExpanded(prev => ({ ...prev, [r.id]: !prev[r.id] }))}
        >
          <div className="flex items-start justify-between gap-3">
            {/* Date badge + info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-[#17352C] flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                <p className="text-white text-base font-body font-bold leading-none">{r.reservation_date?.split('-')[2]}</p>
                <p className="text-white/60 text-[9px] font-body leading-none mt-0.5">
                  {r.reservation_date?.split('-')[1]}/{r.reservation_date?.split('-')[0].slice(2)}
                </p>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-body text-sm text-[#151515] font-semibold">{r.reservation_time} Uhr</p>
                  <span className="text-[#5F5A52] text-xs">·</span>
                  <p className="text-[#5F5A52] text-xs font-body">{r.party_size} {c.guests}</p>
                </div>
                <p className="text-[#5F5A52] text-[11px] font-body mt-0.5 truncate">{r.reservation_ref}</p>
              </div>
            </div>
            {/* Status + expand */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-[10px] font-body font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[r.status] || 'text-[#5F5A52] bg-[#5F5A52]/8 border-[#5F5A52]/15'}`}>
                {statusMap[r.status] || r.status}
              </span>
              {isExpanded
                ? <ChevronUp className="w-4 h-4 text-[#5F5A52]/40" />
                : <ChevronDown className="w-4 h-4 text-[#5F5A52]/40" />}
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className="px-4 sm:px-5 pb-4 border-t border-[#F0E8DC]">
            <div className="pt-3 space-y-2">
              {r.notes && (
                <p className="text-[#5F5A52] text-xs font-body">
                  <span className="text-[#151515] font-semibold">{c.requests}</span> {r.notes}
                </p>
              )}
              {r.dietary_notes && (
                <p className="text-[#5F5A52] text-xs font-body">
                  <span className="text-[#151515] font-semibold">{lang === 'de' ? 'Ernährung:' : 'Diet:'}</span> {r.dietary_notes}
                </p>
              )}
              {r.occasion && r.occasion !== 'regular' && (
                <p className="text-[#5F5A52] text-xs font-body">
                  <span className="text-[#151515] font-semibold">{lang === 'de' ? 'Anlass:' : 'Occasion:'}</span> {r.occasion}
                </p>
              )}
              <p className="text-[#5F5A52] text-[11px] font-body">
                <span className="font-semibold text-[#151515]">{lang === 'de' ? 'Gast:' : 'Guest:'}</span> {r.guest_first_name} {r.guest_last_name}
              </p>

              {/* Cancel success */}
              {cancelSuccess[r.id] && (
                <div className="flex items-start gap-2 text-xs text-[#17352C] font-body bg-[#17352C]/8 border border-[#17352C]/20 rounded-lg px-3 py-2 mt-2">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{c.cancel_success}</span>
                </div>
              )}

              {/* Cancel error */}
              {cancelError[r.id] && (
                <div className="flex items-start gap-2 text-xs text-[#B42318] font-body bg-[#B42318]/5 border border-[#B42318]/15 rounded-lg px-3 py-2 mt-2">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{cancelError[r.id]}</span>
                </div>
              )}

              {/* Confirm cancel dialog */}
              {confirmCancel === r.id && (
                <div className="mt-3 border border-[#B42318]/20 bg-[#B42318]/5 rounded-xl p-4">
                  <p className="text-[#151515] text-sm font-body font-semibold mb-1">{c.cancel_confirm}</p>
                  <p className="text-[#5F5A52] text-xs font-body mb-3">{c.cancel_policy}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCancel(r.id)}
                      disabled={cancellingId === r.id}
                      className="flex-1 py-2.5 bg-[#B42318] text-white text-xs font-body font-semibold rounded-lg hover:bg-[#9A1E14] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {cancellingId === r.id
                        ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><XCircle className="w-3.5 h-3.5" /> {c.cancel_yes}</>}
                    </button>
                    <button
                      onClick={() => setConfirmCancel(null)}
                      className="flex-1 py-2.5 bg-white border border-[#E8DED0] text-[#5F5A52] text-xs font-body font-semibold rounded-lg hover:text-[#151515] transition-colors"
                    >
                      {c.cancel_no}
                    </button>
                  </div>
                </div>
              )}

              {/* Cancel button */}
              {canCancel(r) && confirmCancel !== r.id && !cancelSuccess[r.id] && (
                <button
                  onClick={() => { setConfirmCancel(r.id); setCancelError(prev => ({ ...prev, [r.id]: null })); }}
                  className="mt-2 flex items-center gap-1.5 text-[#B42318]/60 hover:text-[#B42318] text-[10px] font-body uppercase tracking-widest transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" /> {c.cancel_btn}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F2EA] text-[#151515] pt-16 sm:pt-20 pb-28 lg:pb-10 px-4 sm:px-5">
      <div className="max-w-2xl mx-auto">

        {/* Back + header */}
        <Link to="/account" className="flex items-center gap-2 text-[#5F5A52] hover:text-[#151515] text-xs font-body tracking-widest uppercase mb-5 transition-colors mt-4">
          <ArrowLeft className="w-3.5 h-3.5" /> {c.back}
        </Link>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl sm:text-4xl font-light text-[#151515]">{c.title}</h1>
          <button
            onClick={() => user && loadData(user)}
            className="flex items-center gap-1.5 text-[#5F5A52] hover:text-[#151515] text-xs font-body transition-colors p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E8DED0]"
            title={c.refresh}>
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <Link to="/reserve"
            className="flex items-center justify-center gap-2 py-3 bg-[#17352C] hover:bg-[#0F2920] text-white rounded-xl text-xs font-body font-semibold tracking-wider uppercase transition-all shadow-sm">
            <UtensilsCrossed className="w-3.5 h-3.5" /> {c.cta_reserve}
          </Link>
          <Link to="/rooms"
            className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-[#17352C] text-[#17352C] hover:bg-[#17352C] hover:text-white rounded-xl text-xs font-body font-semibold tracking-wider uppercase transition-all">
            <BedDouble className="w-3.5 h-3.5" /> {c.cta_rooms}
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-[#E8DED0] rounded-xl p-1 mb-5 shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-body font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-[#17352C] text-white shadow-sm'
                  : 'text-[#5F5A52] hover:text-[#151515] hover:bg-[#F7F2EA]'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#A47A12]/15 text-[#A47A12]'
                }`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab: Upcoming restaurant reservations */}
        {activeTab === 'upcoming' && (
          <div className="space-y-3">
            {upcomingRes.length === 0 ? (
              <div className="bg-white border border-[#E8DED0] rounded-2xl p-8 text-center shadow-sm">
                <UtensilsCrossed className="w-8 h-8 text-[#E8DED0] mx-auto mb-3" />
                <p className="text-[#5F5A52] text-sm font-body mb-4">{c.empty_upcoming}</p>
                <Link to="/reserve" className="inline-flex items-center gap-1.5 text-[#A47A12] hover:text-[#8B6914] text-xs font-body tracking-wider transition-colors font-semibold">
                  <Plus className="w-3.5 h-3.5" /> {c.cta_reserve}
                </Link>
              </div>
            ) : (
              upcomingRes.map(r => <ReservationCard key={r.id} r={r} />)
            )}
          </div>
        )}

        {/* Tab: Past restaurant reservations */}
        {activeTab === 'past' && (
          <div className="space-y-3">
            {pastRes.length === 0 ? (
              <div className="bg-white border border-[#E8DED0] rounded-2xl p-8 text-center shadow-sm">
                <p className="text-[#5F5A52] text-sm font-body">{c.empty_past}</p>
              </div>
            ) : (
              pastRes.map(r => <ReservationCard key={r.id} r={r} />)
            )}
          </div>
        )}

        {/* Tab: Hotel bookings */}
        {activeTab === 'hotel' && (
          <div className="space-y-4">
            {hotelBookings.length === 0 ? (
              <div className="bg-white border border-[#E8DED0] rounded-2xl p-8 text-center shadow-sm">
                <BedDouble className="w-8 h-8 text-[#E8DED0] mx-auto mb-3" />
                <p className="text-[#5F5A52] text-sm font-body mb-4">{c.empty_hotel}</p>
                <Link to="/rooms" className="inline-flex items-center gap-1.5 text-[#A47A12] hover:text-[#8B6914] text-xs font-body tracking-wider transition-colors font-semibold">
                  <Plus className="w-3.5 h-3.5" /> {c.cta_rooms}
                </Link>
              </div>
            ) : (
              hotelBookings.map(b => (
                <div key={b.id} className="bg-white border border-[#E8DED0] rounded-xl p-4 sm:p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[#A47A12] text-[10px] font-body tracking-[0.3em] uppercase mb-0.5">Beds24 · Krone Langenburg</p>
                      <p className="font-body text-[#151515] text-sm font-semibold tracking-wider">{b.source_reference}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-semibold border flex-shrink-0 ${
                      b.booking_status === 'confirmed' ? 'text-[#17352C] bg-[#17352C]/10 border-[#17352C]/20' :
                      b.booking_status === 'cancelled' ? 'text-[#B42318] bg-[#B42318]/8 border-[#B42318]/15' :
                      'text-[#5F5A52] bg-[#5F5A52]/8 border-[#5F5A52]/15'
                    }`}>
                      {b.booking_status === 'confirmed' ? (lang === 'de' ? 'Bestätigt' : 'Confirmed') :
                       b.booking_status === 'cancelled' ? (lang === 'de' ? 'Storniert' : 'Cancelled') : b.booking_status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-body mb-3">
                    <div>
                      <span className="text-[#5F5A52] uppercase tracking-wider text-[10px] font-semibold">{c.arrival}</span><br />
                      <span className="text-[#151515] font-medium">{b.arrival_date || '—'}</span>
                    </div>
                    <div>
                      <span className="text-[#5F5A52] uppercase tracking-wider text-[10px] font-semibold">{c.departure}</span><br />
                      <span className="text-[#151515] font-medium">{b.departure_date || '—'}</span>
                    </div>
                    {b.room_type && (
                      <div>
                        <span className="text-[#5F5A52] uppercase tracking-wider text-[10px] font-semibold">{c.room}</span><br />
                        <span className="text-[#151515]">{b.room_type}</span>
                      </div>
                    )}
                    {b.number_of_guests && (
                      <div>
                        <span className="text-[#5F5A52] uppercase tracking-wider text-[10px] font-semibold">{c.guests_lbl}</span><br />
                        <span className="text-[#151515]">{b.number_of_guests}</span>
                      </div>
                    )}
                    {b.payment_status && b.payment_status !== 'unknown' && (
                      <div>
                        <span className="text-[#5F5A52] uppercase tracking-wider text-[10px] font-semibold">{c.payment}</span><br />
                        <span className={b.payment_status === 'paid' ? 'text-[#17352C] font-semibold' : 'text-[#A47A12] font-semibold'}>
                          {b.payment_status}{b.total_price ? ` · €${b.total_price}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  {!b.verified && (
                    <p className="text-[#A47A12] text-[10px] font-body mb-3 bg-[#A47A12]/8 border border-[#A47A12]/20 rounded-lg px-3 py-2">{c.hotel_unverified}</p>
                  )}
                  <p className="text-[#5F5A52] text-[10px] font-body mb-3">{c.hotel_change_note}</p>
                  <div className="flex gap-2">
                    <Link to="/contact" className="flex-1 py-2.5 text-center text-[10px] font-body tracking-widest uppercase border-2 border-[#17352C] text-[#17352C] hover:bg-[#17352C] hover:text-white rounded-lg transition-all font-semibold">
                      {c.hotel_contact}
                    </Link>
                    <Link to="/account/messages" className="flex-1 py-2.5 text-center text-[10px] font-body tracking-widest uppercase bg-[#17352C] text-white hover:bg-[#0F2920] rounded-lg transition-colors font-semibold">
                      {c.hotel_message}
                    </Link>
                  </div>
                </div>
              ))
            )}

            {/* Hotel Booking Lookup */}
            <div className="mt-4 bg-white border border-[#E8DED0] rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#17352C]/10 flex items-center justify-center flex-shrink-0">
                  <Search className="w-4 h-4 text-[#17352C]" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-light text-[#151515]">{c.lookup_title}</h2>
                  <p className="text-[#5F5A52] text-xs font-body mt-0.5">{c.lookup_sub}</p>
                </div>
              </div>

              {lookupDone ? (
                <div className="bg-[#17352C]/8 border border-[#17352C]/20 rounded-xl p-4 flex gap-3">
                  <CheckCircle className="w-4 h-4 text-[#17352C] flex-shrink-0 mt-0.5" />
                  <p className="text-[#17352C] text-sm font-body font-medium">{c.lookup_success}</p>
                </div>
              ) : (
                <form onSubmit={handleLookup} className="space-y-3">
                  <div>
                    <label className="block text-[#5F5A52] text-[10px] tracking-[0.25em] uppercase font-body mb-1.5 font-semibold">{c.lookup_conf}</label>
                    <input type="text" value={lookupForm.confirmation_number}
                      onChange={e => setLookupForm(f => ({ ...f, confirmation_number: e.target.value }))}
                      className="w-full bg-white border-2 border-[#E8DED0] rounded-xl px-4 py-3 text-sm text-[#151515] focus:outline-none focus:border-[#A47A12]/50 transition-colors font-body placeholder-[#5F5A52]/40"
                      placeholder="z.B. 123456 oder KRONE-2025-001" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#5F5A52] text-[10px] tracking-[0.25em] uppercase font-body mb-1.5 font-semibold">{c.lookup_first}</label>
                      <input type="text" required value={lookupForm.first_name}
                        onChange={e => setLookupForm(f => ({ ...f, first_name: e.target.value }))}
                        className="w-full bg-white border-2 border-[#E8DED0] rounded-xl px-4 py-3 text-sm text-[#151515] focus:outline-none focus:border-[#A47A12]/50 transition-colors font-body" />
                    </div>
                    <div>
                      <label className="block text-[#5F5A52] text-[10px] tracking-[0.25em] uppercase font-body mb-1.5 font-semibold">{c.lookup_last}</label>
                      <input type="text" required value={lookupForm.last_name}
                        onChange={e => setLookupForm(f => ({ ...f, last_name: e.target.value }))}
                        className="w-full bg-white border-2 border-[#E8DED0] rounded-xl px-4 py-3 text-sm text-[#151515] focus:outline-none focus:border-[#A47A12]/50 transition-colors font-body" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#5F5A52] text-[10px] tracking-[0.25em] uppercase font-body mb-1.5 font-semibold">{c.lookup_email}</label>
                      <input type="email" value={lookupForm.email}
                        onChange={e => setLookupForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full bg-white border-2 border-[#E8DED0] rounded-xl px-4 py-3 text-sm text-[#151515] focus:outline-none focus:border-[#A47A12]/50 transition-colors font-body" />
                    </div>
                    <div>
                      <label className="block text-[#5F5A52] text-[10px] tracking-[0.25em] uppercase font-body mb-1.5 font-semibold">{c.lookup_checkin}</label>
                      <input type="date" value={lookupForm.check_in}
                        onChange={e => setLookupForm(f => ({ ...f, check_in: e.target.value }))}
                        className="w-full bg-white border-2 border-[#E8DED0] rounded-xl px-4 py-3 text-sm text-[#151515] focus:outline-none focus:border-[#A47A12]/50 transition-colors font-body" />
                    </div>
                  </div>
                  <button type="submit" disabled={lookupSubmitting}
                    className="w-full py-3.5 bg-[#17352C] hover:bg-[#0F2920] disabled:opacity-50 text-white rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold transition-all shadow-md flex items-center justify-center gap-2">
                    {lookupSubmitting
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><Search className="w-3.5 h-3.5" /> {c.lookup_submit}</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}