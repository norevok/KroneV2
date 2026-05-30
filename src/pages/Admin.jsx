/**
 * Admin Dashboard — Krone Langenburg by Ammesso
 * Route: /admin — Komplett neu designt: hell, kontraststark, übersichtlich
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import {
  CheckCircle, Clock, XCircle, AlertTriangle, UtensilsCrossed, Mail,
  MessageSquare, BedDouble, FileText, Download, Gift,
  Users, Briefcase, Image, BookOpen, Shield, BarChart, Calendar,
  Phone, ChevronDown, ChevronUp, ChevronRight, ArrowRight, RefreshCw, Sparkles,
  TrendingUp, Activity, Tag, Check, X, Star, Zap
} from 'lucide-react';
import AdminMessageCenter from '@/components/admin/AdminMessageCenter';
import AdminShell from '@/components/admin/AdminShell';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

// Status badge — high contrast, readable
function StatusBadge({ status }) {
  const MAP = {
    new:                'bg-blue-100 text-blue-800 border-blue-200',
    pending:            'bg-amber-100 text-amber-800 border-amber-200',
    confirmed:          'bg-emerald-100 text-emerald-800 border-emerald-200',
    seated:             'bg-violet-100 text-violet-800 border-violet-200',
    completed:          'bg-gray-100 text-gray-600 border-gray-200',
    cancelled_by_guest: 'bg-red-100 text-red-700 border-red-200',
    cancelled_by_staff: 'bg-red-100 text-red-700 border-red-200',
    cancelled:          'bg-red-100 text-red-700 border-red-200',
    no_show:            'bg-orange-100 text-orange-700 border-orange-200',
    archived:           'bg-gray-100 text-gray-400 border-gray-200',
    in_review:          'bg-blue-100 text-blue-700 border-blue-200',
    replied:            'bg-emerald-100 text-emerald-700 border-emerald-200',
    in_progress:        'bg-blue-100 text-blue-700 border-blue-200',
    resolved:           'bg-emerald-100 text-emerald-700 border-emerald-200',
    closed:             'bg-gray-100 text-gray-500 border-gray-200',
    uploaded:           'bg-amber-100 text-amber-700 border-amber-200',
    approved:           'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected:           'bg-red-100 text-red-700 border-red-200',
    active:             'bg-emerald-100 text-emerald-800 border-emerald-200',
    redeemed:           'bg-gray-100 text-gray-600 border-gray-200',
  };
  const STATUS_LABELS = {
    new: 'Neu', pending: 'Ausstehend', confirmed: 'Bestätigt', seated: 'Eingecheckt',
    completed: 'Abgeschlossen', cancelled_by_guest: 'Gast abgesagt', cancelled_by_staff: 'Storniert',
    cancelled: 'Storniert', no_show: 'No-show', archived: 'Archiviert', in_review: 'In Prüfung',
    replied: 'Beantwortet', in_progress: 'In Bearbeitung', resolved: 'Gelöst', closed: 'Geschlossen',
    uploaded: 'Hochgeladen', approved: 'Genehmigt', rejected: 'Abgelehnt',
    active: 'Aktiv', redeemed: 'Eingelöst',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-bold border tracking-wider uppercase ${MAP[status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// Stat card — light & readable
function StatCard({ icon: Icon, label, value, sub, color = 'text-[#8B6914]', urgent, to }) {
  const el = (
    <div className={`bg-white border rounded-2xl p-5 transition-all hover:shadow-md ${
      urgent ? 'border-amber-300 bg-amber-50 ring-1 ring-amber-200' : 'border-[#EDE6D8] hover:border-[#C9A96E]/40'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${urgent ? 'bg-amber-100' : 'bg-[#F7F3EC]'}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {urgent && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
      </div>
      <p className={`font-display text-3xl font-light ${color} mb-0.5`}>{value}</p>
      <p className="text-[#4A3F35] text-xs font-body font-semibold">{label}</p>
      {sub && <p className="text-[#8A7A6A] text-[10px] font-body mt-0.5">{sub}</p>}
    </div>
  );
  return to ? <Link to={to}>{el}</Link> : el;
}

const TABS = [
  { id: 'reservations', label: 'Reservierungen', icon: UtensilsCrossed },
  { id: 'contacts',     label: 'Kontakt',         icon: MessageSquare },
  { id: 'bookings',     label: 'Buchungen',        icon: BedDouble },
  { id: 'documents',    label: 'Dokumente',        icon: FileText },
  { id: 'messages',     label: 'Nachrichten',      icon: MessageSquare },
  { id: 'careers',      label: 'Bewerbungen',      icon: Briefcase },
  { id: 'vouchers',     label: 'Gutscheine',       icon: Gift },
];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState('loading');
  const [tab, setTab] = useState('reservations');
  const [reservations, setReservations] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [intents, setIntents] = useState([]);
  const [guestDocs, setGuestDocs] = useState([]);
  const [guestMsgs, setGuestMsgs] = useState([]);
  const [careerApps, setCareerApps] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRes, setSelectedRes] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedDocId, setExpandedDocId] = useState(null);
  const [docNotes, setDocNotes] = useState({});
  const [stats, setStats] = useState({ today: 0, pending: 0, confirmed: 0, contacts: 0, intents: 0, docs: 0, msgs: 0, vouchers: 0, careers: 0 });
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u) { setAccess('denied'); return; }
      if (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin') { setAccess('denied'); return; }
      setUser(u);
      setAccess('granted');
      loadAll();
    }).catch(() => setAccess('denied'));
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const [res, inq, int_, docs, msgs, apps, voucs] = await Promise.all([
      base44.entities.RestaurantReservation.list('-created_date', 100).catch(() => []),
      base44.entities.ContactInquiry.list('-created_date', 50).catch(() => []),
      base44.entities.HotelBookingIntent.list('-created_date', 50).catch(() => []),
      base44.entities.GuestDocument.list('-created_date', 50).catch(() => []),
      base44.entities.GuestMessage.list('-created_date', 50).catch(() => []),
      base44.entities.CareerApplication.list('-created_date', 50).catch(() => []),
      base44.entities.GiftVoucher.list('-created_date', 100).catch(() => []),
    ]);
    setReservations(res);
    setInquiries(inq);
    setIntents(int_);
    setGuestDocs(docs);
    setGuestMsgs(msgs);
    setCareerApps(apps);
    setVouchers(voucs);
    setStats({
      today: res.filter(r => r.reservation_date === today).length,
      pending: res.filter(r => r.status === 'new' || r.status === 'pending').length,
      confirmed: res.filter(r => r.status === 'confirmed' && r.reservation_date >= today).length,
      contacts: inq.filter(i => i.status === 'new').length,
      intents: int_.filter(i => i.status === 'initiated' || i.status === 'redirected_to_beds24').length,
      docs: docs.filter(d => d.status === 'uploaded').length,
      msgs: msgs.filter(m => m.status === 'new').length,
      vouchers: voucs.filter(v => v.status === 'active').length,
      careers: apps.filter(a => a.status === 'new').length,
    });
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  async function updateResStatus(id, status) {
    setUpdatingId(id);
    const updates = { status };
    if (status === 'confirmed') { updates.confirmed_at = new Date().toISOString(); updates.confirmed_by = user?.email; }
    if (status === 'cancelled_by_staff') { updates.cancelled_at = new Date().toISOString(); updates.cancelled_by = 'staff'; }
    await base44.entities.RestaurantReservation.update(id, updates);
    const updated = reservations.map(r => r.id === id ? { ...r, ...updates } : r);
    setReservations(updated);
    if (selectedRes?.id === id) setSelectedRes(prev => ({ ...prev, ...updates }));
    setUpdatingId(null);
    const r = reservations.find(res => res.id === id);
    if (!r) return;
    if (status === 'cancelled_by_staff' || status === 'cancelled_by_guest' || status === 'cancelled') {
      base44.functions.invoke('sendCancellationEmail', { reservation_ref: r.reservation_ref, guest_email: r.guest_email, guest_first_name: r.guest_first_name, lang: r.language || 'de' }).catch(() => {});
      base44.functions.invoke('notifySlack', { type: 'reservation_cancelled', ref: r.reservation_ref, name: `${r.guest_first_name} ${r.guest_last_name}`, date: r.reservation_date, time: r.reservation_time }).catch(() => {});
    }
  }

  async function updateInquiryStatus(id, status) {
    await base44.entities.ContactInquiry.update(id, { status, replied_at: status === 'replied' ? new Date().toISOString() : undefined });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  }

  const inputCls = "w-full bg-white border border-[#EDE6D8] rounded-xl px-3 py-2 text-sm text-[#1C1714] font-body focus:outline-none focus:border-[#C9A96E]/60 resize-none placeholder-[#8A7A6A]/50";

  if (access === 'loading') return (
    <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#C9A96E]/30 border-t-[#C9A96E] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#8A7A6A] text-sm font-body">Lade Admin-Bereich…</p>
      </div>
    </div>
  );

  if (access === 'denied') return (
    <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-5">
      <div className="text-center bg-white border border-red-200 rounded-2xl p-10 max-w-sm shadow-md">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-light text-[#1C1714] mb-2">Zugang verweigert</h1>
        <p className="text-[#8A7A6A] text-sm font-body">Nur für autorisierte Admins.</p>
        <Link to="/" className="mt-6 inline-block px-6 py-3 bg-[#1C1714] text-white rounded-full text-xs uppercase tracking-widest font-body font-semibold">Startseite</Link>
      </div>
    </div>
  );

  const totalPending = stats.pending + stats.contacts + stats.docs + stats.msgs + stats.careers;
  const pendingBadge = totalPending > 0 ? `${totalPending} ausstehend` : undefined;

  return (
    <AdminShell
      title="Dashboard"
      subtitle={lastUpdated ? `Aktualisiert: ${lastUpdated.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} · Kein Auto-Refresh` : 'Lade…'}
      onRefresh={loadAll}
      loading={loading}
      badge={pendingBadge}
    >
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── ALERT BANNER ── */}
        {totalPending > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-body text-amber-900 font-semibold">
                {totalPending} ausstehende Aufgaben
              </p>
              <p className="text-xs text-amber-700/70 font-body">
                {stats.pending > 0 && `${stats.pending} Reservierungen · `}
                {stats.contacts > 0 && `${stats.contacts} Kontaktanfragen · `}
                {stats.docs > 0 && `${stats.docs} Dokumente · `}
                {stats.msgs > 0 && `${stats.msgs} Nachrichten`}
              </p>
            </div>
            <button onClick={() => setTab('reservations')} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-body font-bold rounded-xl transition-colors">
              Prüfen <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── STAT GRID ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <StatCard icon={UtensilsCrossed} label="Heute" value={stats.today} color="text-[#8B6914]" sub="Tischreservierungen" to="/admin/reservations" />
          <StatCard icon={Clock} label="Ausstehend" value={stats.pending} color="text-amber-600" urgent={stats.pending > 0} to="/admin/reservations" />
          <StatCard icon={CheckCircle} label="Bestätigt" value={stats.confirmed} color="text-emerald-600" sub="zukünftig" />
          <StatCard icon={MessageSquare} label="Anfragen" value={stats.contacts} color="text-blue-600" urgent={stats.contacts > 0} />
          <StatCard icon={BedDouble} label="Buchungen" value={stats.intents} color="text-indigo-600" to="/admin/beds24-bookings" />
          <StatCard icon={FileText} label="Dokumente" value={stats.docs} color="text-purple-600" urgent={stats.docs > 0} sub="zur Prüfung" />
          <StatCard icon={MessageSquare} label="Nachrichten" value={stats.msgs} color="text-rose-600" urgent={stats.msgs > 0} />
          <StatCard icon={Gift} label="Gutscheine" value={stats.vouchers} color="text-[#8B6914]" sub="aktiv" to="/admin/vouchers" />
          <StatCard icon={Briefcase} label="Bewerbungen" value={stats.careers} color="text-cyan-600" urgent={stats.careers > 0} />
        </div>

        {/* ── QUICK NAV LINKS ── */}
        <div>
          <h2 className="text-[#1C1714] font-display text-lg font-semibold mb-3">Schnellzugriff</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {[
              { to: '/admin/reservations', icon: UtensilsCrossed, label: 'Reservierungen', sub: 'Täglich verwalten', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
              { to: '/admin/guests', icon: Users, label: 'Gäste', sub: 'Profile & Buchungen', color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { to: '/admin/beds24-bookings', icon: BedDouble, label: 'Hotelbuchungen', sub: 'Beds24 Sync', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
              { to: '/admin/calendar', icon: Calendar, label: 'Kalender', sub: 'Tagesansicht', color: 'bg-amber-50 border-amber-200 text-amber-700' },
              { to: '/admin/hero', icon: Image, label: 'Hero-Slides', sub: 'Startseite', color: 'bg-rose-50 border-rose-200 text-rose-700' },
              { to: '/admin/opening-hours', icon: Clock, label: 'Öffnungszeiten', sub: 'Sonderregeln', color: 'bg-orange-50 border-orange-200 text-orange-700' },
              { to: '/admin/menu', icon: BookOpen, label: 'Speisekarte', sub: 'Gerichte', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
              { to: '/admin/events', icon: Sparkles, label: 'Events', sub: 'Veranstaltungen', color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { to: '/admin/offers', icon: Tag, label: 'Angebote', sub: 'Sonderangebote', color: 'bg-teal-50 border-teal-200 text-teal-700' },
              { to: '/admin/vouchers', icon: Gift, label: 'Gutscheine', sub: 'Verwalten', color: 'bg-pink-50 border-pink-200 text-pink-700' },
              { to: '/dashboard', icon: BarChart, label: 'Statistiken', sub: 'Charts & Trends', color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
              { to: '/admin/audit', icon: Activity, label: 'Audit-Log', sub: 'Änderungen', color: 'bg-gray-50 border-gray-200 text-gray-700' },
            ].map((item, i) => (
              <Link key={i} to={item.to}
                className="bg-white border border-[#EDE6D8] rounded-xl p-3.5 flex items-center gap-3 hover:shadow-md hover:border-[#C9A96E]/40 transition-all group">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[#1C1714] text-sm font-body font-semibold truncate group-hover:text-[#8B6914] transition-colors">{item.label}</p>
                  <p className="text-[#8A7A6A] text-[10px] font-body truncate">{item.sub}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#C9A96E]/40 group-hover:text-[#8B6914] transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── TAB STRIP ── */}
        <div>
          <h2 className="text-[#1C1714] font-display text-lg font-semibold mb-3">Daten-Übersicht</h2>
          <div className="flex gap-1.5 bg-white rounded-2xl p-1.5 border border-[#EDE6D8] overflow-x-auto no-scrollbar shadow-sm flex-wrap sm:flex-nowrap">
            {TABS.map(t => {
              const count = t.id === 'reservations' ? stats.pending
                : t.id === 'contacts' ? stats.contacts
                : t.id === 'bookings' ? stats.intents
                : t.id === 'documents' ? stats.docs
                : t.id === 'messages' ? stats.msgs
                : t.id === 'careers' ? stats.careers
                : t.id === 'vouchers' ? stats.vouchers : 0;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-shrink-0 flex items-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-body font-semibold tracking-wide uppercase transition-all whitespace-nowrap ${
                    tab === t.id
                      ? 'bg-[#8B6914] text-white shadow-sm'
                      : 'text-[#8A7A6A] hover:text-[#1C1714] hover:bg-[#F7F3EC]'
                  }`}>
                  <t.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">{t.label}</span>
                  {count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                      tab === t.id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                    }`}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── LOADING ── */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-[#C9A96E]/30 border-t-[#C9A96E] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-[#8A7A6A] text-xs font-body">Lade Daten…</p>
            </div>
          </div>
        )}

        {/* ── RESERVATIONS ── */}
        {!loading && tab === 'reservations' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#4A3F35] text-sm font-body">{reservations.length} Reservierungen gesamt</p>
              <Link to="/admin/reservations" className="text-[#8B6914] text-xs font-body hover:underline flex items-center gap-1">
                Vollansicht <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {reservations.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#EDE6D8] rounded-2xl">
                <UtensilsCrossed className="w-8 h-8 text-[#8A7A6A]/30 mx-auto mb-3" />
                <p className="text-[#8A7A6A] font-body text-sm">Keine Reservierungen vorhanden</p>
              </div>
            ) : reservations.map(r => (
              <div key={r.id} className={`bg-white border rounded-2xl p-4 transition-all shadow-sm ${
                selectedRes?.id === r.id ? 'border-[#8B6914]/40 ring-1 ring-[#8B6914]/20' : 'border-[#EDE6D8] hover:border-[#C9A96E]/40 hover:shadow-md'
              }`}>
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={() => setSelectedRes(selectedRes?.id === r.id ? null : r)} className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-body text-sm text-[#1C1714] font-bold">{r.guest_first_name} {r.guest_last_name}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-[#4A3F35] text-xs font-body font-medium">
                      {r.reservation_date} · {r.reservation_time} · {r.party_size} Pers.
                    </p>
                    <p className="text-[#8A7A6A] text-[10px] font-body mt-0.5">{r.guest_email} · {r.reservation_ref}</p>
                  </button>
                  <div className="flex gap-2 flex-shrink-0">
                    {(r.status === 'new' || r.status === 'pending') && (
                      <button onClick={() => updateResStatus(r.id, 'confirmed')} disabled={updatingId === r.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-body font-bold transition-colors disabled:opacity-50">
                        <Check className="w-3.5 h-3.5" /> Bestätigen
                      </button>
                    )}
                    {!['cancelled_by_guest','cancelled_by_staff','no_show','archived','completed'].includes(r.status) && (
                      <button onClick={() => updateResStatus(r.id, 'cancelled_by_staff')} disabled={updatingId === r.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-xl font-body font-bold transition-colors disabled:opacity-50">
                        <X className="w-3.5 h-3.5" /> Absagen
                      </button>
                    )}
                    <button onClick={() => setSelectedRes(selectedRes?.id === r.id ? null : r)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F7F3EC] hover:bg-[#F2E8D0] text-[#8B6914] transition-colors">
                      {selectedRes?.id === r.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {selectedRes?.id === r.id && (
                  <div className="mt-4 pt-4 border-t border-[#EDE6D8] grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm font-body">
                      {[
                        ['Telefon', r.guest_phone || '—'],
                        ['Sprache', r.language?.toUpperCase() || '—'],
                        ['Quelle', r.source || '—'],
                        ['Erstellt', r.created_date ? format(new Date(r.created_date), 'dd.MM.yy HH:mm') : '—'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-3 py-1 border-b border-[#EDE6D8] last:border-0">
                          <span className="text-[#8A7A6A] font-semibold text-xs">{k}</span>
                          <span className="text-[#1C1714] text-right text-xs">{v}</span>
                        </div>
                      ))}
                      {(r.notes || r.dietary_notes) && (
                        <div className="pt-2 bg-[#F7F3EC] rounded-xl px-3 py-2">
                          <p className="text-[#8A7A6A] text-[10px] font-bold uppercase tracking-wider mb-1">Sonderwünsche</p>
                          {r.notes && <p className="text-[#1C1714] text-xs">{r.notes}</p>}
                          {r.dietary_notes && <p className="text-[#4A3F35] text-xs mt-1">🥗 {r.dietary_notes}</p>}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-1.5">
                        {r.status === 'confirmed' && (
                          <button onClick={() => updateResStatus(r.id, 'seated')}
                            className="py-2 bg-violet-600 hover:bg-violet-700 text-white text-[10px] rounded-xl font-body font-bold transition-colors">
                            Eingecheckt
                          </button>
                        )}
                        <button onClick={() => updateResStatus(r.id, 'completed')}
                          className="py-2 bg-[#F7F3EC] border border-[#EDE6D8] text-[#4A3F35] hover:bg-[#EDE6D8] text-[10px] rounded-xl font-body font-bold transition-colors">
                          Abgeschl.
                        </button>
                        <button onClick={() => updateResStatus(r.id, 'no_show')}
                          className="py-2 bg-[#F7F3EC] border border-[#EDE6D8] text-[#4A3F35] hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-[10px] rounded-xl font-body font-bold transition-colors">
                          No-show
                        </button>
                      </div>
                      <a href={`mailto:${r.guest_email}?subject=Ihre Reservierung ${r.reservation_ref}`}
                        className="flex items-center justify-center gap-2 py-2.5 border border-[#8B6914]/30 bg-[#F7F3EC] text-[#8B6914] hover:bg-[#F2E8D0] rounded-xl text-xs font-body font-bold tracking-wide transition-all">
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
            ))}
          </div>
        )}

        {/* ── CONTACTS ── */}
        {!loading && tab === 'contacts' && (
          <div className="space-y-2">
            {inquiries.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#EDE6D8] rounded-2xl">
                <MessageSquare className="w-8 h-8 text-[#8A7A6A]/30 mx-auto mb-3" />
                <p className="text-[#8A7A6A] font-body text-sm">Keine Kontaktanfragen vorhanden</p>
              </div>
            ) : inquiries.map(inq => (
              <div key={inq.id} className="bg-white border border-[#EDE6D8] rounded-2xl p-4 hover:shadow-md hover:border-[#C9A96E]/40 transition-all shadow-sm">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="font-body text-sm text-[#1C1714] font-bold">{inq.first_name} {inq.last_name}</span>
                      <StatusBadge status={inq.status} />
                      <span className="text-[#8A7A6A] text-[10px] font-body uppercase tracking-widest bg-[#F7F3EC] px-2 py-0.5 rounded-full">{inq.inquiry_type}</span>
                    </div>
                    <p className="text-[#4A3F35] text-xs font-body">{inq.email} · {inq.created_date ? format(new Date(inq.created_date), 'dd.MM.yy HH:mm') : ''}</p>
                    {inq.message && <p className="text-[#4A3F35] text-sm font-body mt-2 line-clamp-2 bg-[#F7F3EC] rounded-xl px-3 py-2">{inq.message}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0 flex-col sm:flex-row">
                    {inq.status === 'new' && (
                      <button onClick={() => updateInquiryStatus(inq.id, 'replied')}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-body font-bold transition-colors">
                        ✓ Beantwortet
                      </button>
                    )}
                    <a href={`mailto:${inq.email}`}
                      className="px-3 py-2 border border-[#8B6914]/30 bg-[#F7F3EC] text-[#8B6914] hover:bg-[#F2E8D0] rounded-xl text-xs font-body font-bold flex items-center gap-1 transition-colors">
                      <Mail className="w-3 h-3" /> E-Mail
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {!loading && tab === 'bookings' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#4A3F35] text-sm font-body">{intents.length} Buchungen gesamt</p>
              <Link to="/admin/beds24-bookings" className="text-[#8B6914] text-xs font-body hover:underline flex items-center gap-1">
                Vollansicht <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {intents.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#EDE6D8] rounded-2xl">
                <BedDouble className="w-8 h-8 text-[#8A7A6A]/30 mx-auto mb-3" />
                <p className="text-[#8A7A6A] font-body text-sm">Keine Buchungs-Intents vorhanden</p>
              </div>
            ) : intents.map(int => (
              <div key={int.id} className="bg-white border border-[#EDE6D8] rounded-2xl p-4 hover:shadow-md hover:border-[#C9A96E]/40 transition-all shadow-sm">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center flex-shrink-0">
                    <BedDouble className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-body text-sm text-[#1C1714] font-bold">{int.intent_ref}</span>
                      <StatusBadge status={int.status} />
                    </div>
                    <p className="text-[#4A3F35] text-xs font-body">
                      {int.check_in && `${int.check_in} → ${int.check_out} · `}
                      {int.guests_adults} Erw.
                      {int.guests_children > 0 ? ` · ${int.guests_children} Kinder` : ''}
                      {(int.room_category_interest) ? ` · ${int.room_category_interest}` : ''}
                    </p>
                    <p className="text-[#8A7A6A] text-[10px] font-body mt-0.5">
                      {int.created_date ? format(new Date(int.created_date), 'dd.MM.yy HH:mm') : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── DOCUMENTS ── */}
        {!loading && tab === 'documents' && (
          <div className="space-y-2">
            {guestDocs.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#EDE6D8] rounded-2xl">
                <FileText className="w-8 h-8 text-[#8A7A6A]/30 mx-auto mb-3" />
                <p className="text-[#8A7A6A] font-body text-sm">Keine Dokumente vorhanden</p>
              </div>
            ) : guestDocs.map(doc => {
              const expanded = expandedDocId === doc.id;
              const notes = docNotes[doc.id] ?? (doc.internal_notes || '');
              return (
                <div key={doc.id} className={`bg-white border rounded-2xl p-4 transition-all shadow-sm ${expanded ? 'border-[#8B6914]/40 ring-1 ring-[#8B6914]/20' : 'border-[#EDE6D8] hover:border-[#C9A96E]/40 hover:shadow-md'}`}>
                  <div className="flex items-start gap-3 flex-wrap">
                    <button onClick={() => setExpandedDocId(expanded ? null : doc.id)} className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-body text-sm text-[#1C1714] font-bold">{doc.original_filename}</span>
                        <StatusBadge status={doc.status} />
                        <span className="text-[#8A7A6A] text-[10px] font-body uppercase tracking-widest bg-[#F7F3EC] px-2 py-0.5 rounded-full">{doc.category}</span>
                      </div>
                      <p className="text-[#4A3F35] text-xs font-body">{doc.user_email} · {doc.created_date ? format(new Date(doc.created_date), 'dd.MM.yy HH:mm') : ''}</p>
                    </button>
                    <button onClick={async () => {
                      const res = await base44.functions.invoke('guestDocumentAccess', { document_id: doc.id });
                      if (res.data?.signed_url) window.open(res.data.signed_url, '_blank');
                    }} className="flex-shrink-0 px-3 py-2 bg-[#F7F3EC] border border-[#EDE6D8] text-[#8B6914] hover:bg-[#F2E8D0] text-xs rounded-xl font-body font-bold flex items-center gap-1.5 transition-colors">
                      <Download className="w-3.5 h-3.5" /> Herunterladen
                    </button>
                  </div>
                  {expanded && (
                    <div className="mt-4 pt-4 border-t border-[#EDE6D8] space-y-3">
                      <textarea value={notes} onChange={e => setDocNotes(p => ({ ...p, [doc.id]: e.target.value }))}
                        placeholder="Interne Notizen…" className={inputCls + ' h-20'} />
                      <div className="flex gap-2 flex-wrap">
                        {doc.status === 'uploaded' && (
                          <button onClick={async () => {
                            await base44.entities.GuestDocument.update(doc.id, { status: 'under_review', reviewed_by: user?.email, reviewed_at: new Date().toISOString(), internal_notes: notes });
                            setGuestDocs(p => p.map(d => d.id === doc.id ? { ...d, status: 'under_review' } : d));
                            setExpandedDocId(null);
                          }} className="flex-1 py-2.5 bg-[#F7F3EC] border border-[#EDE6D8] text-[#8B6914] text-xs rounded-xl font-body font-bold hover:bg-[#F2E8D0] transition-colors">
                            In Prüfung
                          </button>
                        )}
                        {(doc.status === 'uploaded' || doc.status === 'under_review') && (
                          <>
                            <button onClick={async () => {
                              await base44.entities.GuestDocument.update(doc.id, { status: 'approved', reviewed_by: user?.email, reviewed_at: new Date().toISOString(), internal_notes: notes });
                              setGuestDocs(p => p.map(d => d.id === doc.id ? { ...d, status: 'approved' } : d));
                              setExpandedDocId(null);
                            }} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-body font-bold transition-colors">
                              ✓ Genehmigen
                            </button>
                            <button onClick={async () => {
                              await base44.entities.GuestDocument.update(doc.id, { status: 'rejected', reviewed_by: user?.email, reviewed_at: new Date().toISOString(), internal_notes: notes });
                              setGuestDocs(p => p.map(d => d.id === doc.id ? { ...d, status: 'rejected' } : d));
                              setExpandedDocId(null);
                            }} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-xl font-body font-bold transition-colors">
                              ✕ Ablehnen
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── MESSAGES ── */}
        {!loading && tab === 'messages' && (
          <AdminMessageCenter messages={guestMsgs} loading={loading} currentUser={user} onUpdate={loadAll} />
        )}

        {/* ── CAREERS ── */}
        {!loading && tab === 'careers' && (
          <div className="space-y-2">
            {careerApps.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#EDE6D8] rounded-2xl">
                <Briefcase className="w-8 h-8 text-[#8A7A6A]/30 mx-auto mb-3" />
                <p className="text-[#8A7A6A] font-body text-sm">Keine Bewerbungen vorhanden</p>
              </div>
            ) : careerApps.map(app => (
              <div key={app.id} className="bg-white border border-[#EDE6D8] rounded-2xl p-4 hover:shadow-md hover:border-[#C9A96E]/40 transition-all shadow-sm">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="font-body text-sm text-[#1C1714] font-bold">{app.first_name} {app.last_name}</span>
                      <StatusBadge status={app.status} />
                      <span className="text-[#8A7A6A] text-[10px] font-body uppercase tracking-widest bg-[#F7F3EC] px-2 py-0.5 rounded-full">{app.position}</span>
                    </div>
                    <p className="text-[#4A3F35] text-xs font-body">{app.email} · {app.phone || '—'} · {app.created_date ? format(new Date(app.created_date), 'dd.MM.yy') : ''}</p>
                    {app.message && <p className="text-[#4A3F35] text-sm font-body mt-2 line-clamp-2 bg-[#F7F3EC] rounded-xl px-3 py-2">{app.message}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0 flex-col sm:flex-row">
                    {app.status === 'new' && (
                      <button onClick={async () => {
                        await base44.entities.CareerApplication.update(app.id, { status: 'in_review' });
                        setCareerApps(p => p.map(a => a.id === app.id ? { ...a, status: 'in_review' } : a));
                      }} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-xl font-body font-bold transition-colors">
                        In Prüfung
                      </button>
                    )}
                    <a href={`mailto:${app.email}`} className="px-3 py-2 border border-[#8B6914]/30 bg-[#F7F3EC] text-[#8B6914] hover:bg-[#F2E8D0] rounded-xl text-xs font-body font-bold flex items-center gap-1.5 transition-colors">
                      <Mail className="w-3 h-3" /> E-Mail
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── VOUCHERS ── */}
        {!loading && tab === 'vouchers' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#4A3F35] text-sm font-body">{vouchers.length} Gutscheine gesamt · {stats.vouchers} aktiv</p>
              <Link to="/admin/vouchers" className="text-[#8B6914] text-xs font-body hover:underline flex items-center gap-1">
                Alle verwalten <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {vouchers.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#EDE6D8] rounded-2xl">
                <Gift className="w-8 h-8 text-[#8A7A6A]/30 mx-auto mb-3" />
                <p className="text-[#8A7A6A] font-body text-sm">Keine Gutscheine vorhanden</p>
              </div>
            ) : vouchers.map(v => (
              <div key={v.id} className="bg-white border border-[#EDE6D8] rounded-2xl p-4 hover:shadow-md hover:border-[#C9A96E]/40 transition-all shadow-sm">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="font-body text-sm text-[#1C1714] font-bold tracking-widest">{v.code || '—'}</span>
                      <StatusBadge status={v.status} />
                      <span className="font-display text-lg font-semibold text-[#8B6914]">€{v.amount_eur}</span>
                    </div>
                    <p className="text-[#4A3F35] text-xs font-body font-semibold">{v.product_name}</p>
                    <p className="text-[#8A7A6A] text-xs font-body mt-0.5">
                      {v.purchaser_name || '—'} · {v.purchaser_email}
                      {v.recipient_name && ` → ${v.recipient_name}`}
                    </p>
                    <p className="text-[#8A7A6A] text-[10px] font-body mt-0.5">
                      {v.created_date ? format(new Date(v.created_date), 'dd.MM.yy') : ''}
                      {v.expires_at ? ` · Läuft ab: ${format(new Date(v.expires_at), 'dd.MM.yyyy')}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 flex-col">
                    {v.status === 'active' && (
                      <button onClick={async () => {
                        await base44.entities.GiftVoucher.update(v.id, { status: 'redeemed', redeemed_at: new Date().toISOString(), redeemed_by: user?.email });
                        setVouchers(p => p.map(x => x.id === v.id ? { ...x, status: 'redeemed' } : x));
                      }} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-body font-bold transition-colors">
                        ✓ Eingelöst
                      </button>
                    )}
                    {v.purchaser_email && (
                      <a href={`mailto:${v.purchaser_email}`} className="px-3 py-2 border border-[#8B6914]/30 bg-[#F7F3EC] text-[#8B6914] hover:bg-[#F2E8D0] rounded-xl text-xs font-body font-bold flex items-center gap-1.5 transition-colors">
                        <Mail className="w-3 h-3" /> E-Mail
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AdminShell>
  );
}