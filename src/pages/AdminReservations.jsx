/**
 * Admin Restaurant Reservations — Komplett neu designt
 * Route: /admin/reservations — Hell, kontraststark, professionell
 */

import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { format, parseISO, addDays } from 'date-fns';
import { de, enUS, it } from 'date-fns/locale';
import {
  Calendar, Clock, Users, CheckCircle, XCircle, RefreshCw,
  UtensilsCrossed, Mail, Phone, Filter, ChevronDown, ChevronUp,
  AlertTriangle, Search, ArrowRight, Check, X, Star, MessageSquare
} from 'lucide-react';
import { useLang } from '@/lib/useLang';
import AdminShell from '@/components/admin/AdminShell';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const STATUS_COLORS = {
  new:                'bg-blue-100 text-blue-800 border-blue-200',
  pending:            'bg-amber-100 text-amber-800 border-amber-200',
  confirmed:          'bg-emerald-100 text-emerald-800 border-emerald-200',
  seated:             'bg-violet-100 text-violet-800 border-violet-200',
  completed:          'bg-gray-100 text-gray-600 border-gray-200',
  cancelled_by_guest: 'bg-red-100 text-red-700 border-red-200',
  cancelled_by_staff: 'bg-red-100 text-red-700 border-red-200',
  no_show:            'bg-orange-100 text-orange-700 border-orange-200',
  archived:           'bg-gray-100 text-gray-400 border-gray-200',
};

const STATUS_LABELS = {
  new: 'Neu', pending: 'Ausstehend', confirmed: 'Bestätigt', seated: 'Eingecheckt',
  completed: 'Abgeschlossen', cancelled_by_guest: 'Gast abgesagt',
  cancelled_by_staff: 'Storniert', no_show: 'No-show', archived: 'Archiviert'
};

const LOCALE_MAP = { de, en: enUS, it };

export default function AdminReservations() {
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState('loading');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDates, setExpandedDates] = useState({});
  const [expandedRes, setExpandedRes] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) {
        setAccess('denied'); return;
      }
      setUser(u);
      setAccess('granted');
      loadReservations();
    }).catch(() => setAccess('denied'));
  }, []);

  async function loadReservations() {
    setLoading(true);
    const data = await base44.entities.RestaurantReservation.list('-reservation_date', 300).catch(() => []);
    setReservations(data || []);
    const today = format(new Date(), 'yyyy-MM-dd');
    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    setExpandedDates({ [today]: true, [tomorrow]: true });
    setLoading(false);
  }

  const toggleDate = (date) => setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }));

  const updateStatus = async (reservationId, newStatus) => {
    setUpdatingId(reservationId);
    const updates = { status: newStatus };
    if (newStatus === 'confirmed') { updates.confirmed_at = new Date().toISOString(); updates.confirmed_by = user?.email; }
    if (newStatus === 'cancelled_by_staff') { updates.cancelled_at = new Date().toISOString(); updates.cancelled_by = 'staff'; }
    await base44.entities.RestaurantReservation.update(reservationId, updates);
    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, ...updates } : r));
    if (newStatus === 'cancelled_by_staff') {
      const r = reservations.find(x => x.id === reservationId);
      if (r) {
        base44.functions.invoke('sendCancellationEmail', { reservation_ref: r.reservation_ref, guest_email: r.guest_email, guest_first_name: r.guest_first_name, lang: r.language || 'de' }).catch(() => {});
        base44.functions.invoke('notifySlack', { type: 'reservation_cancelled', ref: r.reservation_ref, name: `${r.guest_first_name} ${r.guest_last_name}`, date: r.reservation_date, time: r.reservation_time }).catch(() => {});
      }
    }
    setUpdatingId(null);
  };

  // Group by date
  const grouped = reservations.reduce((acc, r) => {
    const date = r.reservation_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(r);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a)); // newest first

  const filteredDates = sortedDates.filter(date => {
    const dayRes = grouped[date];
    if (filterStatus !== 'all' && !dayRes.some(r => r.status === filterStatus)) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!dayRes.some(r =>
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
  const todayRes = grouped[todayStr] || [];
  const todayConfirmed = todayRes.filter(r => r.status === 'confirmed').length;
  const todayPending = todayRes.filter(r => ['pending', 'new'].includes(r.status)).length;
  const todayCapacity = todayRes.filter(r => ['confirmed', 'pending', 'new', 'seated'].includes(r.status)).reduce((sum, r) => sum + (r.party_size || 0), 0);
  const totalPending = reservations.filter(r => ['pending', 'new'].includes(r.status)).length;
  const locale = LOCALE_MAP[lang] || de;

  if (access === 'loading') return (
    <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full animate-spin" />
    </div>
  );

  if (access === 'denied') return (
    <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-5">
      <div className="bg-white border border-red-200 rounded-2xl p-10 max-w-sm text-center shadow-md">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-light text-[#1C1714] mb-2">Zugang verweigert</h1>
        <p className="text-[#8A7A6A] text-sm font-body">Nur für autorisierte Admins.</p>
      </div>
    </div>
  );

  return (
    <AdminShell
      title="Reservierungen"
      subtitle={`${reservations.length} Einträge gesamt · ${totalPending > 0 ? `${totalPending} ausstehend` : 'Alles bestätigt'}`}
      onRefresh={loadReservations}
      loading={loading}
      badge={totalPending > 0 ? `${totalPending} neu` : undefined}
    >
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Heute-Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Calendar, label: 'Heute gesamt', value: todayRes.length, color: 'text-[#8B6914]', bg: 'bg-[#F7F3EC]' },
            { icon: Users, label: 'Gäste heute', value: todayCapacity, color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: CheckCircle, label: 'Bestätigt', value: todayConfirmed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: Clock, label: 'Ausstehend', value: todayPending, color: 'text-amber-600', bg: 'bg-amber-50', urgent: todayPending > 0 },
          ].map((s, i) => (
            <div key={i} className={`bg-white border rounded-2xl p-4 shadow-sm ${s.urgent ? 'border-amber-300 ring-1 ring-amber-200' : 'border-[#EDE6D8]'}`}>
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className={`font-display text-3xl font-light ${s.color}`}>{s.value}</p>
              <p className="text-[#4A3F35] text-[10px] font-body uppercase tracking-wider mt-1 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Alert — ausstehende */}
        {totalPending > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-amber-900 text-sm font-body font-semibold flex-1">
              {totalPending} Reservierung{totalPending !== 1 ? 'en' : ''} warten auf Bestätigung
            </p>
            <button onClick={() => setFilterStatus('new')} className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded-xl font-body font-bold hover:bg-amber-700 transition-colors flex-shrink-0">
              Nur neue anzeigen
            </button>
          </div>
        )}

        {/* Suche + Filter */}
        <div className="bg-white border border-[#EDE6D8] rounded-2xl p-4 shadow-sm flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 text-[#8A7A6A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Name, E-Mail, Referenz suchen…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F3EC] border border-[#EDE6D8] rounded-xl text-sm text-[#1C1714] placeholder-[#8A7A6A]/60 focus:outline-none focus:border-[#C9A96E]/60 transition-colors font-body"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8A7A6A]" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-[#F7F3EC] border border-[#EDE6D8] rounded-xl text-sm text-[#1C1714] focus:outline-none focus:border-[#C9A96E]/60 transition-colors font-body font-semibold"
            >
              <option value="all">Alle Status</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reservierungen nach Datum */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#C9A96E]/30 border-t-[#C9A96E] rounded-full animate-spin" />
          </div>
        ) : filteredDates.length === 0 ? (
          <div className="bg-white border border-[#EDE6D8] rounded-2xl p-12 text-center shadow-sm">
            <UtensilsCrossed className="w-12 h-12 text-[#8A7A6A]/30 mx-auto mb-4" />
            <p className="text-[#8A7A6A] text-sm font-body">Keine Reservierungen gefunden</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDates.map(date => {
              const dayReservations = grouped[date];
              const filteredDay = filterStatus !== 'all' ? dayReservations.filter(r => r.status === filterStatus) : dayReservations;
              const searchFiltered = searchTerm ? filteredDay.filter(r => {
                const term = searchTerm.toLowerCase();
                return r.guest_first_name?.toLowerCase().includes(term) ||
                  r.guest_last_name?.toLowerCase().includes(term) ||
                  r.guest_email?.toLowerCase().includes(term) ||
                  r.reservation_ref?.toLowerCase().includes(term);
              }) : filteredDay;
              if (searchFiltered.length === 0) return null;

              const isTodayDate = date === todayStr;
              const isTomorrowDate = date === format(addDays(new Date(), 1), 'yyyy-MM-dd');
              let dateLabel;
              try {
                dateLabel = isTodayDate ? '🟢 Heute'
                  : isTomorrowDate ? '📅 Morgen'
                  : format(parseISO(date), 'EEEE, d. MMMM yyyy', { locale });
              } catch { dateLabel = date; }

              const dayCapacity = searchFiltered.filter(r => ['confirmed', 'pending', 'new', 'seated'].includes(r.status)).reduce((sum, r) => sum + (r.party_size || 0), 0);
              const dayPending = searchFiltered.filter(r => ['pending', 'new'].includes(r.status)).length;
              const isExpanded = expandedDates[date] !== false && (expandedDates[date] === true || isTodayDate || isTomorrowDate);

              return (
                <div key={date} className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${
                  isTodayDate ? 'border-[#8B6914]/30 ring-1 ring-[#8B6914]/15' : 'border-[#EDE6D8]'
                }`}>
                  {/* Date header */}
                  <button
                    className={`w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors ${
                      isTodayDate ? 'bg-[#F2E8D0]' : 'bg-[#F7F3EC] hover:bg-[#F2E8D0]'
                    }`}
                    onClick={() => toggleDate(date)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 shadow-sm ${
                        isTodayDate ? 'bg-[#8B6914] text-white' : 'bg-white border border-[#EDE6D8] text-[#1C1714]'
                      }`}>
                        <p className="text-lg font-body font-bold leading-none">{date.split('-')[2]}</p>
                        <p className="text-[9px] leading-none mt-0.5 opacity-60">{date.split('-')[1]}.{date.split('-')[0].slice(2)}</p>
                      </div>
                      <div>
                        <h3 className="font-body text-base font-bold text-[#1C1714]">{dateLabel}</h3>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[#4A3F35] text-xs font-body">{searchFiltered.length} Reservierungen · {dayCapacity} Gäste</span>
                          {dayPending > 0 && (
                            <span className="bg-amber-100 text-amber-700 text-[10px] font-body font-bold px-2 py-0.5 rounded-full border border-amber-200">
                              {dayPending} ausstehend
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-[#8A7A6A]" /> : <ChevronDown className="w-5 h-5 text-[#8A7A6A]" />}
                  </button>

                  {/* Reservations list */}
                  {isExpanded && (
                    <div className="divide-y divide-[#EDE6D8]/60">
                      {searchFiltered
                        .sort((a, b) => a.reservation_time.localeCompare(b.reservation_time))
                        .map(r => {
                          const isExpR = expandedRes === r.id;
                          return (
                            <div key={r.id} className={`transition-colors ${isExpR ? 'bg-[#FAF7F2]' : 'hover:bg-[#F7F3EC]'}`}>
                              <div className="p-4 sm:p-5">
                                <div className="flex items-start justify-between gap-4">
                                  <button className="flex-1 text-left" onClick={() => setExpandedRes(isExpR ? null : r.id)}>
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-bold border ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                        {STATUS_LABELS[r.status] || r.status}
                                      </span>
                                      <span className="text-[#1C1714] text-sm font-body font-bold">{r.reservation_time} Uhr</span>
                                      <span className="text-[#4A3F35] text-sm font-body">{r.party_size} Pers.</span>
                                      {r.occasion && r.occasion !== 'regular' && (
                                        <span className="bg-rose-100 text-rose-700 text-[10px] font-body font-bold px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                                          <Star className="w-3 h-3" /> {r.occasion}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[#1C1714] font-body font-semibold text-sm">
                                      {r.guest_first_name} {r.guest_last_name}
                                    </p>
                                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                                      <span className="flex items-center gap-1 text-xs text-[#4A3F35] font-body">
                                        <Mail className="w-3 h-3 text-[#8A7A6A]" /> {r.guest_email}
                                      </span>
                                      {r.guest_phone && (
                                        <span className="flex items-center gap-1 text-xs text-[#4A3F35] font-body">
                                          <Phone className="w-3 h-3 text-[#8A7A6A]" /> {r.guest_phone}
                                        </span>
                                      )}
                                      <span className="text-[#8A7A6A] text-[10px] font-body">{r.reservation_ref}</span>
                                    </div>
                                    {r.notes && (
                                      <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-900 font-body">
                                        💬 {r.notes}
                                      </div>
                                    )}
                                  </button>

                                  {/* Quick actions */}
                                  <div className="flex flex-col gap-2 flex-shrink-0">
                                    {(r.status === 'new' || r.status === 'pending') && (
                                      <button
                                        onClick={() => updateStatus(r.id, 'confirmed')}
                                        disabled={updatingId === r.id}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-body font-bold transition-colors disabled:opacity-50 whitespace-nowrap"
                                      >
                                        <Check className="w-3.5 h-3.5" /> Bestätigen
                                      </button>
                                    )}
                                    {r.status === 'confirmed' && (
                                      <button
                                        onClick={() => updateStatus(r.id, 'seated')}
                                        disabled={updatingId === r.id}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-body font-bold transition-colors disabled:opacity-50"
                                      >
                                        <Users className="w-3.5 h-3.5" /> Eingecheckt
                                      </button>
                                    )}
                                    {r.status === 'seated' && (
                                      <button
                                        onClick={() => updateStatus(r.id, 'completed')}
                                        disabled={updatingId === r.id}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-xs font-body font-bold transition-colors disabled:opacity-50"
                                      >
                                        <CheckCircle className="w-3.5 h-3.5" /> Abgeschl.
                                      </button>
                                    )}
                                    {!['cancelled_by_guest','cancelled_by_staff','no_show','archived','completed'].includes(r.status) && (
                                      <button
                                        onClick={() => updateStatus(r.id, 'cancelled_by_staff')}
                                        disabled={updatingId === r.id}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-body font-bold transition-all disabled:opacity-50"
                                      >
                                        <X className="w-3.5 h-3.5" /> Absagen
                                      </button>
                                    )}
                                    {r.status === 'confirmed' && (
                                      <button
                                        onClick={() => updateStatus(r.id, 'no_show')}
                                        disabled={updatingId === r.id}
                                        className="px-4 py-2 bg-white border border-orange-200 text-orange-600 hover:bg-orange-100 rounded-xl text-xs font-body font-bold transition-colors disabled:opacity-50"
                                      >
                                        No-show
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Expanded detail */}
                                {isExpR && (
                                  <div className="mt-4 pt-4 border-t border-[#EDE6D8] grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2 space-y-1.5">
                                      {[
                                        ['Sprache', r.language?.toUpperCase() || '—'],
                                        ['Quelle', r.source || '—'],
                                        ['Anlass', r.occasion || '—'],
                                        ['Erstellt', r.created_date ? format(new Date(r.created_date), 'dd.MM.yy HH:mm') : '—'],
                                        ['Ref', r.reservation_ref || '—'],
                                      ].map(([k, v]) => (
                                        <div key={k} className="flex justify-between gap-3 py-1 border-b border-[#EDE6D8]/60 last:border-0">
                                          <span className="text-[#8A7A6A] text-xs font-body font-bold">{k}</span>
                                          <span className="text-[#1C1714] text-xs font-body text-right">{v}</span>
                                        </div>
                                      ))}
                                      {r.dietary_notes && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-xs text-green-900 font-body">
                                          🥗 {r.dietary_notes}
                                        </div>
                                      )}
                                    </div>
                                    <div className="space-y-2">
                                      <a href={`mailto:${r.guest_email}?subject=Ihre Reservierung ${r.reservation_ref}`}
                                        className="flex items-center justify-center gap-2 py-2.5 border border-[#8B6914]/30 bg-[#F7F3EC] text-[#8B6914] hover:bg-[#F2E8D0] rounded-xl text-xs font-body font-bold transition-all">
                                        <Mail className="w-3.5 h-3.5" /> E-Mail schreiben
                                      </a>
                                      {r.guest_phone && (
                                        <a href={`tel:${r.guest_phone}`}
                                          className="flex items-center justify-center gap-2 py-2.5 border border-[#EDE6D8] bg-white text-[#4A3F35] hover:bg-[#F7F3EC] rounded-xl text-xs font-body font-bold transition-all">
                                          <Phone className="w-3.5 h-3.5" /> Anrufen
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </AdminShell>
  );
}