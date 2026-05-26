/**
 * Admin Dashboard — Krone Langenburg by Ammesso
 * Route: /admin
 *
 * Uses AdminShell for sidebar navigation.
 * No auto-refresh. Manual only. Event-driven only.
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import {
  CheckCircle, Clock, XCircle, AlertTriangle, UtensilsCrossed, Mail,
  MessageSquare, BedDouble, Heart, FileText, Download, Gift,
  Users, Briefcase, ChevronDown, ChevronUp
} from 'lucide-react';
import AdminMessageCenter from '@/components/admin/AdminMessageCenter';
import AdminShell from '@/components/admin/AdminShell';
import { format } from 'date-fns';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const STATUS_COLORS = {
  new: 'text-amber-400 bg-amber-950/30 border-amber-800/30',
  pending: 'text-amber-400 bg-amber-950/30 border-amber-800/30',
  confirmed: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/20',
  seated: 'text-blue-400 bg-blue-950/30 border-blue-800/20',
  completed: 'text-white/30 bg-white/5 border-white/10',
  cancelled_by_guest: 'text-red-400 bg-red-950/30 border-red-800/20',
  cancelled_by_staff: 'text-red-400 bg-red-950/30 border-red-800/20',
  cancelled: 'text-red-400 bg-red-950/30 border-red-800/20',
  no_show: 'text-red-400/60 bg-red-950/20 border-red-900/15',
  archived: 'text-white/20 bg-white/5 border-white/8',
  in_review: 'text-blue-400 bg-blue-950/30 border-blue-800/20',
  replied: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/20',
  in_progress: 'text-blue-400 bg-blue-950/30 border-blue-800/20',
  resolved: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/20',
  closed: 'text-white/25 bg-white/5 border-white/8',
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-semibold border tracking-wider uppercase ${STATUS_COLORS[status] || 'text-white/40 bg-white/5 border-white/8'}`}>
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = 'text-[#C9A96E]', urgent }) {
  return (
    <div className={`bg-white/4 border rounded-2xl p-5 transition-all ${urgent ? 'border-amber-700/40 bg-amber-950/15' : 'border-white/8'}`}>
      <div className="flex items-start justify-between mb-3">
        <Icon className={`w-5 h-5 ${color}`} />
        {urgent && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
      </div>
      <p className={`font-display text-3xl font-light ${color} mb-0.5`}>{value}</p>
      <p className="text-white/35 text-xs font-body">{label}</p>
      {sub && <p className="text-white/20 text-[10px] font-body mt-0.5">{sub}</p>}
    </div>
  );
}

const TABS = [
  { id: 'reservations', label: 'Reservierungen', icon: UtensilsCrossed },
  { id: 'contacts',     label: 'Kontakt',         icon: MessageSquare },
  { id: 'bookings',     label: 'Buchungen',        icon: BedDouble },
  { id: 'documents',    label: 'Dokumente',        icon: FileText },
  { id: 'messages',     label: 'Nachrichten',      icon: Heart },
  { id: 'careers',      label: 'Bewerbungen',      icon: Briefcase },
  { id: 'vouchers',     label: 'Gutscheine',       icon: Gift },
];

export default function Admin() {
  const { lang } = useLang();
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
      base44.functions.invoke('sendCancellationEmail', {
        reservation_ref: r.reservation_ref, guest_email: r.guest_email,
        guest_first_name: r.guest_first_name, lang: r.language || 'de',
      }).catch(console.warn);
      base44.functions.invoke('notifySlack', {
        type: 'reservation_cancelled', ref: r.reservation_ref,
        name: `${r.guest_first_name} ${r.guest_last_name}`,
        date: r.reservation_date, time: r.reservation_time,
      }).catch(() => {});
    }
  }

  async function updateInquiryStatus(id, status) {
    await base44.entities.ContactInquiry.update(id, { status, replied_at: status === 'replied' ? new Date().toISOString() : undefined });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  }

  const inputCls = "w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-body focus:outline-none focus:border-[#C9A96E]/30 resize-none";

  if (access === 'loading') return (
    <div className="min-h-screen bg-[#0F0D0B] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full animate-spin" />
    </div>
  );

  if (access === 'denied') return (
    <div className="min-h-screen bg-[#0F0D0B] flex items-center justify-center px-5">
      <div className="text-center bg-white/4 border border-red-900/30 rounded-2xl p-10 max-w-sm">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-light text-white mb-2">Zugang verweigert</h1>
        <p className="text-white/40 text-sm font-body">Nur für autorisierte Admins.</p>
        <Link to="/" className="mt-6 inline-block px-6 py-3 bg-[#C9A96E] text-[#0F0D0B] rounded-full text-xs uppercase tracking-widest font-body font-semibold">Startseite</Link>
      </div>
    </div>
  );

  const totalPending = stats.pending + stats.contacts + stats.docs + stats.msgs + stats.careers;
  const pendingBadge = totalPending > 0 ? `${totalPending} ausstehend` : undefined;

  return (
    <AdminShell
      title="Dashboard"
      subtitle={lastUpdated ? `Stand: ${lastUpdated.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} · Kein Auto-Refresh` : 'Lade Daten…'}
      onRefresh={loadAll}
      loading={loading}
      badge={pendingBadge}
    >
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── ALERT BANNER ── */}
        {stats.pending > 0 && (
          <div className="bg-amber-950/25 border border-amber-700/35 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm font-body text-white/70">
              <strong className="text-amber-400">{stats.pending}</strong> neue Reservierung{stats.pending !== 1 ? 'en' : ''} — bitte prüfen und bestätigen.
            </p>
            <button onClick={() => setTab('reservations')} className="ml-auto text-amber-400 text-xs font-body hover:underline flex-shrink-0">
              Anzeigen →
            </button>
          </div>
        )}

        {/* ── STAT GRID ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <StatCard icon={UtensilsCrossed} label="Heute" value={stats.today} color="text-[#C9A96E]" sub="Reservierungen" />
          <StatCard icon={Clock} label="Ausstehend" value={stats.pending} color="text-amber-400" urgent={stats.pending > 0} />
          <StatCard icon={CheckCircle} label="Bestätigt" value={stats.confirmed} color="text-emerald-400" sub="zukünftig" />
          <StatCard icon={MessageSquare} label="Anfragen" value={stats.contacts} color="text-blue-400" urgent={stats.contacts > 0} />
          <StatCard icon={BedDouble} label="Buchungen" value={stats.intents} color="text-white/50" />
          <StatCard icon={FileText} label="Dokumente" value={stats.docs} color="text-purple-400" urgent={stats.docs > 0} sub="zur Prüfung" />
          <StatCard icon={Heart} label="Nachrichten" value={stats.msgs} color="text-rose-400" urgent={stats.msgs > 0} />
          <StatCard icon={Gift} label="Gutscheine" value={stats.vouchers} color="text-[#C9A96E]" sub="aktiv" />
          <StatCard icon={Briefcase} label="Bewerbungen" value={stats.careers} color="text-cyan-400" urgent={stats.careers > 0} />
        </div>

        {/* ── TAB STRIP ── */}
        <div className="flex gap-1 bg-black/30 rounded-2xl p-1.5 border border-white/8 overflow-x-auto no-scrollbar">
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
                className={`flex-shrink-0 flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-body tracking-wide uppercase transition-all whitespace-nowrap ${
                  tab === t.id
                    ? 'bg-[#C9A96E] text-[#0F0D0B] font-bold shadow-sm'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}>
                <t.icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">{t.label}</span>
                {count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                    tab === t.id ? 'bg-[#0F0D0B]/20 text-[#0F0D0B]' : 'bg-amber-500/20 text-amber-400'
                  }`}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-white/25 text-xs font-body">Lade Daten…</p>
            </div>
          </div>
        )}

        {/* ── RESERVATIONS ── */}
        {!loading && tab === 'reservations' && (
          <div className="space-y-2">
            {reservations.length === 0 ? (
              <div className="text-center py-16 bg-white/3 border border-white/8 rounded-2xl">
                <UtensilsCrossed className="w-8 h-8 text-white/15 mx-auto mb-3" />
                <p className="text-white/30 font-body text-sm">Keine Reservierungen</p>
              </div>
            ) : reservations.map(r => (
              <div key={r.id} className={`bg-white/4 border rounded-2xl p-4 transition-all ${
                selectedRes?.id === r.id ? 'border-[#C9A96E]/30' : 'border-white/8 hover:border-white/15'
              }`}>
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={() => setSelectedRes(selectedRes?.id === r.id ? null : r)} className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-body text-sm text-white font-semibold">{r.guest_first_name} {r.guest_last_name}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-white/40 text-xs font-body">
                      {r.reservation_date} · {r.reservation_time} · {r.party_size} Pers. · {r.reservation_ref}
                    </p>
                    <p className="text-white/25 text-[10px] font-body mt-0.5">{r.guest_email}</p>
                  </button>
                  <div className="flex gap-2 flex-shrink-0">
                    {(r.status === 'new' || r.status === 'pending') && (
                      <button onClick={() => updateResStatus(r.id, 'confirmed')} disabled={updatingId === r.id}
                        className="px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 text-[10px] rounded-lg font-body hover:bg-emerald-900/60 transition-colors tracking-widest uppercase disabled:opacity-50">
                        ✓ Bestätigen
                      </button>
                    )}
                    {!['cancelled_by_guest','cancelled_by_staff','no_show','archived','completed'].includes(r.status) && (
                      <button onClick={() => updateResStatus(r.id, 'cancelled_by_staff')} disabled={updatingId === r.id}
                        className="px-3 py-1.5 bg-red-950/40 border border-red-900/30 text-red-400 text-[10px] rounded-lg font-body hover:bg-red-950/60 transition-colors tracking-widest uppercase disabled:opacity-50">
                        ✕ Absagen
                      </button>
                    )}
                  </div>
                </div>

                {selectedRes?.id === r.id && (
                  <div className="mt-4 pt-4 border-t border-white/8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-xs font-body">
                      {[
                        ['Telefon', r.guest_phone || '—'],
                        ['Sprache', r.language?.toUpperCase()],
                        ['Quelle', r.source],
                        ['Erstellt', r.created_date ? format(new Date(r.created_date), 'dd.MM.yy HH:mm') : '—'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-3">
                          <span className="text-white/30">{k}</span>
                          <span className="text-white/65 text-right">{v}</span>
                        </div>
                      ))}
                      {(r.notes || r.dietary_notes) && (
                        <div className="pt-2 border-t border-white/8">
                          <p className="text-white/25 text-[10px] mb-1">Sonderwünsche</p>
                          {r.notes && <p className="text-white/55">{r.notes}</p>}
                          {r.dietary_notes && <p className="text-white/45 mt-1">🥗 {r.dietary_notes}</p>}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-1.5">
                        {r.status === 'confirmed' && (
                          <button onClick={() => updateResStatus(r.id, 'seated')}
                            className="py-2 bg-blue-900/40 border border-blue-800/30 text-blue-400 text-[10px] rounded-xl font-body hover:bg-blue-900/60 transition-colors tracking-widest uppercase">
                            Eingecheckt
                          </button>
                        )}
                        <button onClick={() => updateResStatus(r.id, 'completed')}
                          className="py-2 bg-white/5 border border-white/10 text-white/40 text-[10px] rounded-xl font-body hover:text-white hover:border-white/20 transition-colors tracking-widest uppercase">
                          Abgesch.
                        </button>
                        <button onClick={() => updateResStatus(r.id, 'no_show')}
                          className="py-2 bg-white/5 border border-white/10 text-white/40 text-[10px] rounded-xl font-body hover:text-red-400 hover:border-red-900/20 transition-colors tracking-widest uppercase">
                          No-show
                        </button>
                      </div>
                      <a href={`mailto:${r.guest_email}?subject=Ihre Reservierung ${r.reservation_ref}`}
                        className="flex items-center justify-center gap-2 py-2.5 border border-[#C9A96E]/25 text-[#C9A96E]/70 hover:text-[#C9A96E] hover:border-[#C9A96E]/50 rounded-xl text-[10px] font-body tracking-widest uppercase transition-all">
                        <Mail className="w-3.5 h-3.5" /> E-Mail schreiben
                      </a>
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
              <div className="text-center py-16 bg-white/3 border border-white/8 rounded-2xl">
                <MessageSquare className="w-8 h-8 text-white/15 mx-auto mb-3" />
                <p className="text-white/30 font-body text-sm">Keine Kontaktanfragen</p>
              </div>
            ) : inquiries.map(inq => (
              <div key={inq.id} className="bg-white/4 border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-all">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-body text-sm text-white font-semibold">{inq.first_name} {inq.last_name}</span>
                      <StatusBadge status={inq.status} />
                      <span className="text-white/25 text-[10px] font-body uppercase tracking-widest">{inq.inquiry_type}</span>
                    </div>
                    <p className="text-white/30 text-xs font-body">{inq.email} · {inq.created_date ? format(new Date(inq.created_date), 'dd.MM.yy') : ''}</p>
                    {inq.message && <p className="text-white/45 text-xs font-body mt-2 line-clamp-2">{inq.message}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {inq.status === 'new' && (
                      <button onClick={() => updateInquiryStatus(inq.id, 'replied')}
                        className="px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 text-[10px] rounded-lg font-body tracking-widest uppercase hover:bg-emerald-900/60 transition-colors">
                        Beantwortet
                      </button>
                    )}
                    <a href={`mailto:${inq.email}`}
                      className="px-3 py-1.5 border border-[#C9A96E]/25 text-[#C9A96E]/70 hover:text-[#C9A96E] rounded-lg text-[10px] font-body tracking-widest uppercase flex items-center gap-1 transition-colors">
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
            {intents.length === 0 ? (
              <div className="text-center py-16 bg-white/3 border border-white/8 rounded-2xl">
                <BedDouble className="w-8 h-8 text-white/15 mx-auto mb-3" />
                <p className="text-white/30 font-body text-sm">Keine Buchungs-Intents</p>
              </div>
            ) : intents.map(int => (
              <div key={int.id} className="bg-white/4 border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-all">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-body text-sm text-white font-semibold">{int.intent_ref}</span>
                      <StatusBadge status={int.status} />
                    </div>
                    <p className="text-white/30 text-xs font-body">
                      {int.check_in && `${int.check_in} → ${int.check_out} · `}
                      {int.guests_adults} Erw.
                      {int.guests_children > 0 ? ` · ${int.guests_children} Kinder` : ''}
                      {(int.room_interest || int.room_category_interest) ? ` · ${int.room_interest || int.room_category_interest}` : ''}
                    </p>
                    <p className="text-white/20 text-[10px] font-body mt-0.5">
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
              <div className="text-center py-16 bg-white/3 border border-white/8 rounded-2xl">
                <FileText className="w-8 h-8 text-white/15 mx-auto mb-3" />
                <p className="text-white/30 font-body text-sm">Keine Dokumente</p>
              </div>
            ) : guestDocs.map(doc => {
              const expanded = expandedDocId === doc.id;
              const notes = docNotes[doc.id] ?? (doc.internal_notes || '');
              return (
                <div key={doc.id} className={`bg-white/4 border rounded-2xl p-4 transition-all ${expanded ? 'border-[#C9A96E]/25' : 'border-white/8 hover:border-white/15'}`}>
                  <div className="flex items-start gap-3 flex-wrap">
                    <button onClick={() => setExpandedDocId(expanded ? null : doc.id)} className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-body text-sm text-white font-semibold">{doc.original_filename}</span>
                        <StatusBadge status={doc.status} />
                        <span className="text-white/25 text-[10px] font-body uppercase tracking-widest">{doc.category}</span>
                      </div>
                      <p className="text-white/30 text-xs font-body">{doc.user_email} · {doc.created_date ? format(new Date(doc.created_date), 'dd.MM.yy HH:mm') : ''}</p>
                      {doc.description && <p className="text-white/35 text-xs font-body mt-1">{doc.description}</p>}
                    </button>
                    <button onClick={async () => {
                      const res = await base44.functions.invoke('guestDocumentAccess', { document_id: doc.id });
                      if (res.data?.signed_url) window.open(res.data.signed_url, '_blank');
                    }} className="flex-shrink-0 px-3 py-1.5 bg-white/5 border border-white/10 text-white/45 hover:text-[#C9A96E] text-[10px] rounded-lg font-body tracking-widest uppercase flex items-center gap-1 transition-colors">
                      <Download className="w-3 h-3" /> DL
                    </button>
                  </div>
                  {expanded && (
                    <div className="mt-4 pt-4 border-t border-white/8 space-y-3">
                      <textarea value={notes} onChange={e => setDocNotes(p => ({ ...p, [doc.id]: e.target.value }))}
                        placeholder="Interne Notizen…" className={inputCls + ' h-20'} />
                      <div className="flex gap-2 flex-wrap">
                        {doc.status === 'uploaded' && (
                          <button onClick={async () => {
                            await base44.entities.GuestDocument.update(doc.id, { status: 'under_review', reviewed_by: user?.email, reviewed_at: new Date().toISOString(), internal_notes: notes });
                            setGuestDocs(p => p.map(d => d.id === doc.id ? { ...d, status: 'under_review', internal_notes: notes } : d));
                            setExpandedDocId(null);
                          }} className="flex-1 py-2 bg-[#C9A96E]/10 border border-[#C9A96E]/25 text-[#C9A96E] text-[10px] rounded-xl font-body hover:bg-[#C9A96E]/20 transition-colors tracking-widest uppercase">
                            ⧖ In Prüfung
                          </button>
                        )}
                        {(doc.status === 'uploaded' || doc.status === 'under_review') && (
                          <>
                            <button onClick={async () => {
                              await base44.entities.GuestDocument.update(doc.id, { status: 'approved', reviewed_by: user?.email, reviewed_at: new Date().toISOString(), internal_notes: notes });
                              setGuestDocs(p => p.map(d => d.id === doc.id ? { ...d, status: 'approved', internal_notes: notes } : d));
                              setExpandedDocId(null);
                            }} className="flex-1 py-2 bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 text-[10px] rounded-xl font-body hover:bg-emerald-900/60 transition-colors tracking-widest uppercase">✓ Genehmigt</button>
                            <button onClick={async () => {
                              await base44.entities.GuestDocument.update(doc.id, { status: 'rejected', reviewed_by: user?.email, reviewed_at: new Date().toISOString(), internal_notes: notes });
                              setGuestDocs(p => p.map(d => d.id === doc.id ? { ...d, status: 'rejected', internal_notes: notes } : d));
                              setExpandedDocId(null);
                            }} className="flex-1 py-2 bg-red-950/40 border border-red-900/30 text-red-400 text-[10px] rounded-xl font-body hover:bg-red-950/60 transition-colors tracking-widest uppercase">✕ Ablehnen</button>
                          </>
                        )}
                      </div>
                      {doc.reviewed_by && (
                        <p className="text-white/20 text-[10px] font-body border-t border-white/8 pt-2">
                          Überprüft von {doc.reviewed_by} · {doc.reviewed_at ? format(new Date(doc.reviewed_at), 'dd.MM.yy HH:mm') : ''}
                        </p>
                      )}
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
              <div className="text-center py-16 bg-white/3 border border-white/8 rounded-2xl">
                <Briefcase className="w-8 h-8 text-white/15 mx-auto mb-3" />
                <p className="text-white/30 font-body text-sm">Keine Bewerbungen</p>
              </div>
            ) : careerApps.map(app => (
              <div key={app.id} className="bg-white/4 border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-all">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-body text-sm text-white font-semibold">{app.first_name} {app.last_name}</span>
                      <StatusBadge status={app.status} />
                      <span className="text-white/25 text-[10px] font-body uppercase tracking-widest">{app.position}</span>
                    </div>
                    <p className="text-white/30 text-xs font-body">{app.email} · {app.phone || '—'} · {app.created_date ? format(new Date(app.created_date), 'dd.MM.yy') : ''}</p>
                    {app.message && <p className="text-white/40 text-xs font-body mt-1 line-clamp-2">{app.message}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {app.status === 'new' && (
                      <button onClick={async () => {
                        await base44.entities.CareerApplication.update(app.id, { status: 'in_review' });
                        setCareerApps(p => p.map(a => a.id === app.id ? { ...a, status: 'in_review' } : a));
                      }} className="px-3 py-1.5 bg-blue-900/40 border border-blue-700/30 text-blue-400 text-[10px] rounded-lg font-body tracking-widest uppercase hover:bg-blue-900/60 transition-colors">
                        In Prüfung
                      </button>
                    )}
                    <a href={`mailto:${app.email}`} className="px-3 py-1.5 border border-[#C9A96E]/25 text-[#C9A96E]/70 hover:text-[#C9A96E] rounded-lg text-[10px] font-body tracking-widest uppercase flex items-center gap-1 transition-colors">
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
            {vouchers.length === 0 ? (
              <div className="text-center py-16 bg-white/3 border border-white/8 rounded-2xl">
                <Gift className="w-8 h-8 text-white/15 mx-auto mb-3" />
                <p className="text-white/30 font-body text-sm">Keine Gutscheine</p>
              </div>
            ) : vouchers.map(v => (
              <div key={v.id} className="bg-white/4 border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-all">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-body text-sm text-white font-bold tracking-widest">{v.code || '—'}</span>
                      <StatusBadge status={v.status} />
                      <span className="font-display text-lg font-light text-[#C9A96E]">€{v.amount_eur}</span>
                    </div>
                    <p className="text-white/45 text-xs font-body">{v.product_name}</p>
                    <p className="text-white/25 text-xs font-body mt-0.5">
                      {v.purchaser_name || '—'} · {v.purchaser_email}
                      {v.recipient_name && ` → ${v.recipient_name}`}
                    </p>
                    <p className="text-white/15 text-[10px] font-body mt-0.5">
                      {v.created_date ? format(new Date(v.created_date), 'dd.MM.yy HH:mm') : ''}
                      {v.paid_at ? ` · Bezahlt: ${format(new Date(v.paid_at), 'dd.MM.yy')}` : ''}
                      {v.expires_at ? ` · Läuft ab: ${format(new Date(v.expires_at), 'dd.MM.yyyy')}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {v.status === 'active' && (
                      <button onClick={async () => {
                        await base44.entities.GiftVoucher.update(v.id, { status: 'redeemed', redeemed_at: new Date().toISOString(), redeemed_by: user?.email });
                        setVouchers(p => p.map(x => x.id === v.id ? { ...x, status: 'redeemed' } : x));
                      }} className="px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 text-[10px] rounded-lg font-body hover:bg-emerald-900/60 transition-colors tracking-widest uppercase">
                        ✓ Eingelöst
                      </button>
                    )}
                    {v.purchaser_email && (
                      <a href={`mailto:${v.purchaser_email}`} className="px-3 py-1.5 border border-[#C9A96E]/25 text-[#C9A96E]/70 hover:text-[#C9A96E] rounded-lg text-[10px] font-body tracking-widest uppercase flex items-center gap-1 transition-colors">
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