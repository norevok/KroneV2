/**
 * Admin Restaurant Reservations Dashboard
 * Route: /admin/reservations
 * 
 * Shows all restaurant reservations grouped by date and status
 * for easy capacity management and daily operations.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { format, parseISO, startOfDay, isToday, isTomorrow, addDays } from 'date-fns';
import { de, enUS, it } from 'date-fns/locale';
import {
  ArrowLeft, Calendar, Clock, Users, CheckCircle, XCircle,
  RefreshCw, UtensilsCrossed, Mail, Phone, Filter, ChevronDown,
  ChevronUp, AlertTriangle, Search, ArrowRight
} from 'lucide-react';
import { useLang } from '@/lib/useLang';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const STATUS_COLORS = {
  new: 'bg-[#1a2a3a] border-blue-700/40 text-blue-300',
  pending: 'bg-amber-950/40 border-amber-700/40 text-amber-300',
  confirmed: 'bg-emerald-950/40 border-emerald-700/30 text-emerald-300',
  seated: 'bg-purple-950/40 border-purple-700/30 text-purple-300',
  completed: 'bg-white/5 border-white/10 text-white/40',
  cancelled_by_guest: 'bg-red-950/40 border-red-800/30 text-red-300',
  cancelled_by_staff: 'bg-red-950/40 border-red-800/30 text-red-300',
  no_show: 'bg-white/5 border-white/8 text-white/30',
  archived: 'bg-white/3 border-white/6 text-white/20',
};

const STATUS_LABELS = {
  de: {
    new: 'Neu', pending: 'Ausstehend', confirmed: 'Bestätigt', seated: 'Eingecheckt',
    completed: 'Abgeschlossen', cancelled_by_guest: 'Gast abgesagt',
    cancelled_by_staff: 'Storniert', no_show: 'Nicht erschienen', archived: 'Archiviert'
  },
  en: {
    new: 'New', pending: 'Pending', confirmed: 'Confirmed', seated: 'Seated',
    completed: 'Completed', cancelled_by_guest: 'Cancelled',
    cancelled_by_staff: 'Cancelled', no_show: 'No show', archived: 'Archived'
  },
  it: {
    new: 'Nuovo', pending: 'In attesa', confirmed: 'Confermato', seated: 'Seduto',
    completed: 'Completato', cancelled_by_guest: 'Annullato',
    cancelled_by_staff: 'Annullato', no_show: 'Non presentato', archived: 'Archiviato'
  },
};

const LOCALE_MAP = { de, en: enUS, it };

export default function AdminReservationsDashboard() {
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState('loading');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDates, setExpandedDates] = useState({});

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) {
        setAccess('denied');
        return;
      }
      setUser(u);
      setAccess('granted');
      loadReservations();
    }).catch(() => setAccess('denied'));
  }, []);

  async function loadReservations() {
    setLoading(true);
    try {
      const data = await base44.entities.RestaurantReservation.list('-reservation_date', 200);
      setReservations(data || []);
      // Expand today and tomorrow by default
      const today = format(new Date(), 'yyyy-MM-dd');
      const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
      setExpandedDates({ [today]: true, [tomorrow]: true });
    } catch (_) {}
    setLoading(false);
  }

  const toggleDate = (date) => {
    setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  const updateStatus = async (reservationId, newStatus) => {
    await base44.entities.RestaurantReservation.update(reservationId, {
      status: newStatus,
      confirmed_at: newStatus === 'confirmed' ? new Date().toISOString() : undefined,
      confirmed_by: user?.email,
    });
    loadReservations();
  };

  // Group by date
  const grouped = reservations.reduce((acc, r) => {
    const date = r.reservation_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(r);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(grouped).sort();

  // Filter
  const filteredDates = sortedDates.filter(date => {
    const dayReservations = grouped[date];
    if (filterStatus !== 'all') {
      if (!dayReservations.some(r => r.status === filterStatus)) return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!dayReservations.some(r => 
        r.guest_first_name?.toLowerCase().includes(term) ||
        r.guest_last_name?.toLowerCase().includes(term) ||
        r.guest_email?.toLowerCase().includes(term) ||
        r.reservation_ref?.toLowerCase().includes(term)
      )) return false;
    }
    return true;
  });

  // Stats
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayReservations = grouped[todayStr] || [];
  const todayConfirmed = todayReservations.filter(r => r.status === 'confirmed').length;
  const todayPending = todayReservations.filter(r => ['pending', 'new'].includes(r.status)).length;
  const todayCapacity = todayReservations
    .filter(r => ['confirmed', 'pending', 'new', 'seated'].includes(r.status))
    .reduce((sum, r) => sum + (r.party_size || 0), 0);

  const c = {
    de: {
      title: 'Restaurant Reservierungen',
      back: 'Admin Dashboard',
      today: 'Heute',
      tomorrow: 'Morgen',
      capacity: 'Auslastung',
      guests: 'Gäste',
      reservations: 'Reservierungen',
      confirmed: 'Bestätigt',
      pending: 'Ausstehend',
      filter: 'Filter',
      all: 'Alle',
      search: 'Suchen...',
      expand: 'Alle erweitern',
      collapse: 'Alle zuklappen',
      no_reservations: 'Keine Reservierungen',
      party_size: 'Personen',
      time: 'Uhrzeit',
      status: 'Status',
      actions: 'Aktionen',
      confirm: 'Bestätigen',
      cancel: 'Stornieren',
      seated: 'Einchecken',
      complete: 'Abschließen',
      notes: 'Notizen',
      contact: 'Kontakt',
      email: 'E-Mail',
      phone: 'Telefon',
    },
    en: {
      title: 'Restaurant Reservations',
      back: 'Admin Dashboard',
      today: 'Today',
      tomorrow: 'Tomorrow',
      capacity: 'Capacity',
      guests: 'Guests',
      reservations: 'Reservations',
      confirmed: 'Confirmed',
      pending: 'Pending',
      filter: 'Filter',
      all: 'All',
      search: 'Search...',
      expand: 'Expand all',
      collapse: 'Collapse all',
      no_reservations: 'No reservations',
      party_size: 'Guests',
      time: 'Time',
      status: 'Status',
      actions: 'Actions',
      confirm: 'Confirm',
      cancel: 'Cancel',
      seated: 'Seat',
      complete: 'Complete',
      notes: 'Notes',
      contact: 'Contact',
      email: 'Email',
      phone: 'Phone',
    },
    it: {
      title: 'Prenotazioni Ristorante',
      back: 'Dashboard Admin',
      today: 'Oggi',
      tomorrow: 'Domani',
      capacity: 'Capacità',
      guests: 'Ospiti',
      reservations: 'Prenotazioni',
      confirmed: 'Confermate',
      pending: 'In attesa',
      filter: 'Filtro',
      all: 'Tutte',
      search: 'Cerca...',
      expand: 'Espandi tutto',
      collapse: 'Comprimi tutto',
      no_reservations: 'Nessuna prenotazione',
      party_size: 'Ospiti',
      time: 'Orario',
      status: 'Stato',
      actions: 'Azioni',
      confirm: 'Conferma',
      cancel: 'Annulla',
      seated: 'Sieduta',
      complete: 'Completa',
      notes: 'Note',
      contact: 'Contatto',
      email: 'Email',
      phone: 'Telefono',
    },
  };

  const statusLabels = STATUS_LABELS[lang] || STATUS_LABELS.de;
  const locale = LOCALE_MAP[lang] || de;

  if (access === 'loading') return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full animate-spin" />
    </div>
  );

  if (access === 'denied') return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-5">
      <div className="bg-white border border-red-200 rounded-2xl p-10 max-w-sm text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-light text-stone-800 mb-2">Zugang verweigert</h1>
        <p className="text-stone-500 text-sm font-body">Nur für autorisierte Admins.</p>
        <Link to="/" className="mt-6 inline-block px-6 py-3 bg-[#1C1714] text-white rounded-lg text-xs uppercase tracking-widest font-body font-semibold">Startseite</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1714] pt-16 sm:pt-20 pb-20 px-4 sm:px-5">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="py-6">
          <Link to="/admin" className="flex items-center gap-2 text-stone-500 hover:text-stone-700 text-xs font-body tracking-wider mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {c.back}
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[#8B6914] text-[10px] tracking-[0.45em] uppercase font-body mb-2">Krone Langenburg · Restaurant</p>
              <h1 className="font-display text-3xl sm:text-4xl font-light text-stone-800">{c.title}</h1>
            </div>
            <button onClick={loadReservations} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:text-stone-800 text-xs font-body transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Today Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <Calendar className="w-4 h-4 text-blue-600 mb-3" />
            <p className="font-display text-3xl font-light text-stone-800">{todayReservations.length}</p>
            <p className="text-stone-500 text-[10px] font-body uppercase tracking-wider mt-1">{c.reservations}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <Users className="w-4 h-4 text-emerald-600 mb-3" />
            <p className="font-display text-3xl font-light text-stone-800">{todayCapacity}</p>
            <p className="text-stone-500 text-[10px] font-body uppercase tracking-wider mt-1">{c.guests}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <CheckCircle className="w-4 h-4 text-emerald-600 mb-3" />
            <p className="font-display text-3xl font-light text-stone-800">{todayConfirmed}</p>
            <p className="text-stone-500 text-[10px] font-body uppercase tracking-wider mt-1">{c.confirmed}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <Clock className="w-4 h-4 text-amber-600 mb-3" />
            <p className="font-display text-3xl font-light text-stone-800">{todayPending}</p>
            <p className="text-stone-500 text-[10px] font-body uppercase tracking-wider mt-1">{c.pending}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={c.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C9A96E]/50 transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-[#C9A96E]/50 transition-colors"
              >
                <option value="all">{c.all}</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reservations by Date */}
        {filteredDates.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
            <UtensilsCrossed className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 text-sm font-body">{c.no_reservations}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDates.map(date => {
              const dayReservations = grouped[date];
              const isTodayDate = date === todayStr;
              const isTomorrowDate = date === format(addDays(new Date(), 1), 'yyyy-MM-dd');
              const dateLabel = isTodayDate ? c.today : isTomorrowDate ? c.tomorrow : format(parseISO(date), 'EEEE, d. MMMM yyyy', { locale });
              const dayCapacity = dayReservations
                .filter(r => ['confirmed', 'pending', 'new', 'seated'].includes(r.status))
                .reduce((sum, r) => sum + (r.party_size || 0), 0);
              const isExpanded = expandedDates[date];

              return (
                <div key={date} className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
                  {/* Date Header */}
                  <div
                    className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 cursor-pointer flex items-center justify-between"
                    onClick={() => toggleDate(date)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                        isTodayDate ? 'bg-[#17352C] text-white' : 'bg-white border border-stone-200 text-stone-700'
                      }`}>
                        <p className="text-lg font-body font-bold leading-none">{date.split('-')[2]}</p>
                        <p className="text-[9px] leading-none mt-0.5 opacity-60">{date.split('-')[1]}/{date.split('-')[0].slice(2)}</p>
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-light text-stone-800">{dateLabel}</h3>
                        <p className="text-stone-500 text-xs font-body mt-0.5">
                          {dayReservations.length} {c.reservations} · {dayCapacity} {c.guests}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isExpanded
                        ? <ChevronUp className="w-5 h-5 text-stone-400" />
                        : <ChevronDown className="w-5 h-5 text-stone-400" />}
                    </div>
                  </div>

                  {/* Reservations List */}
                  {isExpanded && (
                    <div className="divide-y divide-stone-100">
                      {dayReservations
                        .sort((a, b) => a.reservation_time.localeCompare(b.reservation_time))
                        .map(r => (
                          <div key={r.id} className="p-4 sm:p-5 hover:bg-stone-50 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap mb-2">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-semibold border ${STATUS_COLORS[r.status] || 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                                    {statusLabels[r.status] || r.status}
                                  </span>
                                  <span className="text-stone-700 text-sm font-body font-semibold">{r.reservation_time} Uhr</span>
                                  <span className="text-stone-500 text-xs font-body">·</span>
                                  <span className="text-stone-700 text-sm font-body">{r.party_size} {c.party_size}</span>
                                  <span className="text-stone-500 text-xs font-body">·</span>
                                  <span className="text-stone-500 text-xs font-body">{r.reservation_ref}</span>
                                </div>
                                <p className="text-stone-800 font-body font-medium">
                                  {r.guest_first_name} {r.guest_last_name}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-stone-500 font-body">
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> {r.guest_email}
                                  </span>
                                  {r.guest_phone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" /> {r.guest_phone}
                                    </span>
                                  )}
                                </div>
                                {r.notes && (
                                  <p className="text-stone-600 text-xs font-body mt-2 bg-stone-100 rounded-lg px-3 py-2 inline-block">
                                    <span className="font-semibold">{c.notes}:</span> {r.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col gap-2">
                                {r.status === 'new' || r.status === 'pending' ? (
                                  <>
                                    <button
                                      onClick={() => updateStatus(r.id, 'confirmed')}
                                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-body font-semibold transition-colors"
                                    >
                                      {c.confirm}
                                    </button>
                                    <button
                                      onClick={() => updateStatus(r.id, 'cancelled_by_staff')}
                                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-body font-semibold transition-colors"
                                    >
                                      {c.cancel}
                                    </button>
                                  </>
                                ) : r.status === 'confirmed' ? (
                                  <button
                                    onClick={() => updateStatus(r.id, 'seated')}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-body font-semibold transition-colors"
                                  >
                                    {c.seated}
                                  </button>
                                ) : r.status === 'seated' ? (
                                  <button
                                    onClick={() => updateStatus(r.id, 'completed')}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs font-body font-semibold transition-colors"
                                  >
                                    {c.complete}
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}