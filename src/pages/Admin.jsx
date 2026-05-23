import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { CheckCircle, Clock, XCircle, AlertTriangle, UtensilsCrossed, Mail, RefreshCw, MessageSquare, BedDouble, Heart, FileText, Download, Activity, Calendar, BookOpen, Sparkles, Briefcase, Gift, Hotel, Users } from 'lucide-react';
import AdminMessageCenter from '@/components/admin/AdminMessageCenter';
import { format } from 'date-fns';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const STATUS_COLORS = {
  new: 'text-gold/80 bg-gold/10 border-gold/20',
  pending: 'text-gold/80 bg-gold/10 border-gold/20',
  confirmed: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/30',
  seated: 'text-blue-400 bg-blue-950/40 border-blue-800/30',
  completed: 'text-ivory/40 bg-ivory/5 border-ivory/10',
  cancelled_by_guest: 'text-red-400 bg-red-950/40 border-red-800/30',
  cancelled_by_staff: 'text-red-400 bg-red-950/40 border-red-800/30',
  cancelled: 'text-red-400 bg-red-950/40 border-red-800/30',
  no_show: 'text-red-400/60 bg-red-950/20 border-red-900/20',
  archived: 'text-ivory/20 bg-ivory/5 border-ivory/10',
  in_review: 'text-blue-400 bg-blue-950/30 border-blue-800/20',
  replied: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/20',
  in_progress: 'text-blue-400 bg-blue-950/30 border-blue-800/20',
  resolved: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/20',
  closed: 'text-ivory/30 bg-ivory/5 border-ivory/10',
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-medium border tracking-wider uppercase ${STATUS_COLORS[status] || 'text-ivory/40 bg-ivory/5 border-ivory/10'}`}>
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = 'text-gold' }) {
  return (
    <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="font-display text-3xl font-light text-ivory mb-0.5">{value}</p>
      <p className="text-ivory/40 text-xs font-body">{label}</p>
      {sub && <p className="text-ivory/25 text-[10px] font-body mt-1">{sub}</p>}
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
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
  const [stats, setStats] = useState({ today: 0, pending: 0, confirmed: 0, contacts: 0, intents: 0, docs: 0, msgs: 0, vouchers: 0 });

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u) { setAccess('denied'); return; }
      if (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin') { setAccess('denied'); return; }
      setUser(u);
      setAccess('granted');
      loadAll();
    }).catch(() => setAccess('denied'));
  }, []);

  async function loadAll() {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const [res, inq, int_, docs, msgs, apps, voucs] = await Promise.all([
      base44.entities.RestaurantReservation.list('-created_date', 100),
      base44.entities.ContactInquiry.list('-created_date', 50),
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
    });
    setLoading(false);
  }

  async function updateResStatus(id, status) {
    setUpdatingId(id);
    const updates = { status };
    if (status === 'confirmed') { updates.confirmed_at = new Date().toISOString(); updates.confirmed_by = user?.email; }
    if (status === 'cancelled') { updates.cancelled_at = new Date().toISOString(); updates.cancelled_by = 'staff'; }
    await base44.entities.RestaurantReservation.update(id, updates);
    const updated = reservations.map(r => r.id === id ? { ...r, ...updates } : r);
    setReservations(updated);
    if (selectedRes?.id === id) setSelectedRes(prev => ({ ...prev, ...updates }));
    setUpdatingId(null);

    // Fire notifications after status change
    const r = reservations.find(res => res.id === id);
    if (!r) return;
    if (status === 'cancelled_by_staff' || status === 'cancelled_by_guest' || status === 'cancelled') {
      base44.functions.invoke('sendCancellationEmail', {
        reservation_ref: r.reservation_ref,
        guest_email: r.guest_email,
        guest_first_name: r.guest_first_name,
        lang: r.language || 'de',
      }).catch(console.warn);
      base44.functions.invoke('notifySlack', {
        type: 'reservation_cancelled',
        ref: r.reservation_ref,
        name: `${r.guest_first_name} ${r.guest_last_name}`,
        date: r.reservation_date,
        time: r.reservation_time,
      }).catch(() => {});
    }
  }

  async function updateInquiryStatus(id, status) {
    await base44.entities.ContactInquiry.update(id, { status, replied_at: status === 'replied' ? new Date().toISOString() : undefined });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  }

  const inputCls = "w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-2 text-xs text-ivory font-body focus:outline-none focus:border-gold/30";

  if (access === 'loading') {
    return <div className="min-h-screen bg-charcoal flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;
  }

  if (access === 'denied') {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-5">
        <div className="text-center glass-card border border-red-900/30 rounded-2xl p-10 max-w-sm">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-light text-ivory mb-2">Zugang verweigert</h1>
          <p className="text-ivory/40 text-sm font-body">Dieser Bereich ist nur für autorisierte Admins zugänglich.</p>
          <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 btn-gold rounded-full text-xs uppercase tracking-widest font-body font-semibold">Startseite</button>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'reservations', label: 'Reservierungen', icon: UtensilsCrossed, count: stats.pending },
    { id: 'contacts', label: 'Kontakt', icon: MessageSquare, count: stats.contacts },
    { id: 'bookings', label: 'Buchungen', icon: BedDouble, count: stats.intents },
    { id: 'documents', label: 'Dokumente', icon: FileText, count: stats.docs },
    { id: 'messages', label: 'Nachrichten', icon: Heart, count: stats.msgs },
    { id: 'careers', label: 'Bewerbungen', icon: Briefcase, count: careerApps.filter(a => a.status === 'new').length },
    { id: 'vouchers', label: 'Gutscheine', icon: Gift, count: stats.vouchers },
  ];

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="flex items-center justify-between py-6 sm:py-8 gap-3">
          <div className="min-w-0">
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-1">Admin</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory">Dashboard</h1>
            <p className="text-ivory/30 text-xs font-body mt-1 truncate max-w-[140px] sm:max-w-xs">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
            <Link to="/admin/calendar" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kalender</span>
            </Link>
            <Link to="/admin/menu" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Speisekarte</span>
            </Link>
            <Link to="/admin/events" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Events</span>
            </Link>
            <Link to="/admin/guest-calendar" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gästekal.</span>
            </Link>
            <Link to="/admin/beds24" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              <BedDouble className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Beds24</span>
            </Link>
            <Link to="/admin/audit" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Audit</span>
            </Link>
            <Link to="/admin/credits" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              <span className="text-[10px]">⚡</span>
              <span className="hidden sm:inline text-xs">Credits</span>
            </Link>
            <Link to="/admin/credit-dashboard" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-emerald-700/20 rounded-xl text-emerald-400/50 hover:text-emerald-400 text-xs font-body transition-colors">
              <span className="text-[10px]">🛡</span>
              <span className="hidden sm:inline text-xs">Guard</span>
            </Link>
            <Link to="/admin/hero" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              <span className="text-[10px]">🖼</span>
              <span className="hidden sm:inline text-xs">Slides</span>
            </Link>
            <Link to="/admin/offers" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              <span className="text-[10px]">🎁</span>
              <span className="hidden sm:inline text-xs">Angebote</span>
            </Link>
            <Link to="/admin/opening-hours" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              <span className="text-[10px]">🕐</span>
              <span className="hidden sm:inline text-xs">Öffnungszeit.</span>
            </Link>
            <Link to="/admin/beds24-bookings" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              <span className="text-[10px]">🏨</span>
              <span className="hidden sm:inline text-xs">Buchungs-Links</span>
            </Link>
            <Link to="/admin/reservations" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Reservierungen</span>
            </Link>
            <button onClick={loadAll} className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-ivory text-xs font-body transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2 sm:gap-3 mb-6 sm:mb-8">
          <StatCard icon={UtensilsCrossed} label="Heute" value={stats.today} color="text-gold" />
          <StatCard icon={Clock} label="Ausstehend" value={stats.pending} color="text-gold/70" />
          <StatCard icon={CheckCircle} label="Bestätigt" value={stats.confirmed} color="text-emerald-400" />
          <StatCard icon={MessageSquare} label="Anfragen" value={stats.contacts} color="text-blue-400" />
          <StatCard icon={BedDouble} label="Buchungen" value={stats.intents} color="text-ivory/50" />
          <StatCard icon={FileText} label="Dokumente" value={stats.docs} color="text-ivory/50" />
          <StatCard icon={Heart} label="Nachrichten" value={stats.msgs} color="text-rose-400" />
          <StatCard icon={Gift} label="Gutscheine aktiv" value={stats.vouchers} color="text-gold-light" />
        </div>

        {/* Pending alerts */}
        {stats.pending > 0 && (
          <div className="mb-5 border border-gold/20 bg-gold/8 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-gold flex-shrink-0" />
            <p className="text-sm font-body text-ivory/70">
              <strong className="text-gold">{stats.pending}</strong> neue Reservierung{stats.pending !== 1 ? 'en' : ''} – bitte prüfen und bestätigen.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0.5 sm:gap-1 bg-espresso rounded-xl p-1 mb-6 border border-[#C9A96E]/10 overflow-x-auto no-scrollbar">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex items-center justify-center gap-1 sm:gap-2 py-2.5 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs font-body tracking-widest uppercase transition-all whitespace-nowrap ${tab === t.id ? 'bg-gold text-charcoal font-semibold' : 'text-ivory/40 hover:text-ivory'}`}>
              <t.icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden xs:inline sm:inline">{t.label}</span>
              {t.count > 0 && <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${tab === t.id ? 'bg-charcoal/20 text-charcoal' : 'bg-gold/20 text-gold'}`}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* RESERVATIONS */}
        {tab === 'reservations' && (
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-16 text-ivory/30 font-body text-sm">Keine Reservierungen</div>
            ) : (
              reservations.map(r => (
                <div key={r.id}
                  className={`glass-card border rounded-xl p-4 transition-all ${selectedRes?.id === r.id ? 'border-gold/30' : 'border-[#C9A96E]/08 hover:border-[#C9A96E]/20'}`}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button onClick={() => setSelectedRes(selectedRes?.id === r.id ? null : r)}
                      className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-body text-sm text-ivory">{r.guest_first_name} {r.guest_last_name}</span>
                        <StatusBadge status={r.status} />
                        <span className="text-ivory/40 text-xs font-body">{r.reservation_date} · {r.reservation_time} · {r.party_size} P.</span>
                        {!r.email_confirmation_sent && <span className="text-[10px] text-red-400/70 border border-red-900/30 px-2 py-0.5 rounded-full font-body">E-Mail ausstehend</span>}
                        {!r.slack_notified && <span className="text-[10px] text-ivory/20 border border-ivory/10 px-2 py-0.5 rounded-full font-body">Slack ausstehend</span>}
                      </div>
                      <div className="text-ivory/30 text-xs font-body mt-0.5">{r.guest_email} · {r.reservation_ref}</div>
                    </button>
                    <div className="flex gap-2 flex-shrink-0">
                      {(r.status === 'new' || r.status === 'pending') && (
                        <button onClick={() => updateResStatus(r.id, 'confirmed')} disabled={updatingId === r.id}
                          className="px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 text-[10px] rounded-lg font-body hover:bg-emerald-900/60 transition-colors tracking-widest uppercase">
                          ✓ Bestätigen
                        </button>
                      )}
                      {!['cancelled_by_guest','cancelled_by_staff','no_show','archived','completed'].includes(r.status) && (
                        <button onClick={() => updateResStatus(r.id, 'cancelled_by_staff')} disabled={updatingId === r.id}
                          className="px-3 py-1.5 bg-red-950/40 border border-red-900/30 text-red-400 text-[10px] rounded-lg font-body hover:bg-red-950/60 transition-colors tracking-widest uppercase">
                          ✕ Absagen
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedRes?.id === r.id && (
                    <div className="mt-4 pt-4 border-t border-[#C9A96E]/08 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2 text-xs font-body">
                        <div className="flex justify-between"><span className="text-ivory/30">Telefon</span><span className="text-ivory/70">{r.guest_phone || '—'}</span></div>
                        <div className="flex justify-between"><span className="text-ivory/30">Sprache</span><span className="text-ivory/70">{r.language?.toUpperCase()}</span></div>
                        <div className="flex justify-between"><span className="text-ivory/30">Quelle</span><span className="text-ivory/70">{r.source}</span></div>
                        <div className="flex justify-between"><span className="text-ivory/30">Erstellt</span><span className="text-ivory/70">{r.created_date ? format(new Date(r.created_date), 'dd.MM.yy HH:mm') : '—'}</span></div>
                        {(r.notes || r.dietary_notes) && (
                          <div className="pt-2 border-t border-[#C9A96E]/08">
                            <span className="text-ivory/30 block mb-1">Sonderwünsche</span>
                            {r.notes && <span className="text-ivory/60">{r.notes}</span>}
                            {r.dietary_notes && <span className="text-ivory/50 text-xs block mt-1">🥗 {r.dietary_notes}</span>}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          {r.status === 'confirmed' && (
                          <button onClick={() => updateResStatus(r.id, 'seated')}
                            className="flex-1 py-2 bg-blue-900/40 border border-blue-800/30 text-blue-400 text-[10px] rounded-lg font-body hover:bg-blue-900/60 transition-colors tracking-widest uppercase">
                            Eingecheckt
                          </button>
                        )}
                          <button onClick={() => updateResStatus(r.id, 'completed')}
                            className="flex-1 py-2 bg-ivory/5 border border-ivory/10 text-ivory/40 text-[10px] rounded-lg font-body hover:text-ivory hover:border-ivory/20 transition-colors tracking-widest uppercase">
                            Abgeschlossen
                          </button>
                          <button onClick={() => updateResStatus(r.id, 'no_show')}
                            className="flex-1 py-2 bg-ivory/5 border border-ivory/10 text-ivory/40 text-[10px] rounded-lg font-body hover:text-red-400 hover:border-red-900/20 transition-colors tracking-widest uppercase">
                            No-show
                          </button>
                        </div>
                        <a href={`mailto:${r.guest_email}?subject=Ihre Reservierung ${r.reservation_ref}`}
                          className="flex items-center justify-center gap-2 py-2 btn-ghost-gold rounded-lg text-[10px] font-body tracking-widest uppercase">
                          <Mail className="w-3.5 h-3.5" /> E-Mail schreiben
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* CONTACTS */}
        {tab === 'contacts' && (
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-16 text-ivory/30 font-body text-sm">Keine Kontaktanfragen</div>
            ) : (
              inquiries.map(inq => (
                <div key={inq.id} className="glass-card border border-[#C9A96E]/08 rounded-xl p-4 hover:border-[#C9A96E]/20 transition-all">
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-body text-sm text-ivory">{inq.first_name} {inq.last_name}</span>
                        <StatusBadge status={inq.status} />
                        <span className="text-ivory/30 text-[10px] font-body uppercase tracking-widest">{inq.inquiry_type}</span>
                      </div>
                      <p className="text-ivory/30 text-xs font-body">{inq.email} · {inq.created_date ? format(new Date(inq.created_date), 'dd.MM.yy') : ''}</p>
                      {inq.message && <p className="text-ivory/50 text-xs font-body mt-2 line-clamp-2">{inq.message}</p>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {inq.status === 'new' && (
                        <button onClick={() => updateInquiryStatus(inq.id, 'replied')}
                          className="px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 text-[10px] rounded-lg font-body tracking-widest uppercase">
                          Beantwortet
                        </button>
                      )}
                      <a href={`mailto:${inq.email}`}
                        className="px-3 py-1.5 btn-ghost-gold border rounded-lg text-[10px] font-body tracking-widest uppercase flex items-center gap-1">
                        <Mail className="w-3 h-3" /> E-Mail
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* GUEST DOCUMENTS */}
        {tab === 'documents' && (
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
            ) : guestDocs.length === 0 ? (
              <div className="text-center py-16 text-ivory/30 font-body text-sm">Keine Dokumente</div>
            ) : (
              guestDocs.map(doc => {
                const expanded = expandedDocId === doc.id;
                const notes = docNotes[doc.id] || doc.internal_notes || '';
                return (
                  <div key={doc.id} className={`glass-card border rounded-xl p-4 transition-all ${expanded ? 'border-gold/25' : 'border-[#C9A96E]/08 hover:border-[#C9A96E]/20'}`}>
                    {/* Header */}
                    <div className="flex items-start gap-3 flex-wrap">
                      <button onClick={() => setExpandedDocId(expanded ? null : doc.id)} className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-body text-sm text-ivory">{doc.original_filename}</span>
                          <StatusBadge status={doc.status} />
                          <span className="text-ivory/30 text-[10px] font-body uppercase tracking-widest">{doc.category}</span>
                        </div>
                        <p className="text-ivory/30 text-xs font-body">{doc.user_email} · {doc.created_date ? format(new Date(doc.created_date), 'dd.MM.yy HH:mm') : ''}</p>
                        {doc.description && <p className="text-ivory/40 text-xs font-body mt-1">{doc.description}</p>}
                      </button>
                      <button onClick={async () => {
                        const res = await base44.functions.invoke('guestDocumentAccess', { document_id: doc.id });
                        if (res.data?.signed_url) window.open(res.data.signed_url, '_blank');
                      }} className="px-3 py-1.5 glass-card border border-[#C9A96E]/15 text-ivory/50 hover:text-gold text-[10px] rounded-lg font-body tracking-widest uppercase flex items-center gap-1 flex-shrink-0">
                        <Download className="w-3 h-3" /> DL
                      </button>
                    </div>

                    {/* Expanded actions */}
                    {expanded && (
                      <div className="mt-4 pt-4 border-t border-[#C9A96E]/08 space-y-3">
                        {/* Internal notes */}
                        <div>
                          <label className="text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-2 block">Interne Notizen</label>
                          <textarea
                            value={notes}
                            onChange={(e) => setDocNotes(prev => ({ ...prev, [doc.id]: e.target.value }))}
                            placeholder="Notizen für das Team..."
                            className={inputCls + ' resize-none h-20'}
                          />
                        </div>

                        {/* Status buttons */}
                        <div className="flex gap-2 flex-wrap">
                          {doc.status === 'uploaded' && (
                            <button onClick={async () => {
                              await base44.entities.GuestDocument.update(doc.id, { status: 'under_review', reviewed_by: user?.email, reviewed_at: new Date().toISOString(), internal_notes: notes });
                              setGuestDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'under_review', internal_notes: notes } : d));
                              setExpandedDocId(null);
                            }} className="flex-1 py-2 bg-gold/10 border border-gold/20 text-gold text-[10px] rounded-lg font-body hover:bg-gold/20 transition-colors tracking-widest uppercase">
                              ⧖ In Prüfung
                            </button>
                          )}
                          {(doc.status === 'uploaded' || doc.status === 'under_review') && (
                            <>
                              <button onClick={async () => {
                                await base44.entities.GuestDocument.update(doc.id, { status: 'approved', reviewed_by: user?.email, reviewed_at: new Date().toISOString(), internal_notes: notes });
                                setGuestDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'approved', internal_notes: notes } : d));
                                setExpandedDocId(null);
                              }} className="flex-1 py-2 bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 text-[10px] rounded-lg font-body hover:bg-emerald-900/60 transition-colors tracking-widest uppercase">
                                ✓ Genehmigen
                              </button>
                              <button onClick={async () => {
                                await base44.entities.GuestDocument.update(doc.id, { status: 'rejected', reviewed_by: user?.email, reviewed_at: new Date().toISOString(), internal_notes: notes });
                                setGuestDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'rejected', internal_notes: notes } : d));
                                setExpandedDocId(null);
                              }} className="flex-1 py-2 bg-red-950/40 border border-red-900/30 text-red-400 text-[10px] rounded-lg font-body hover:bg-red-950/60 transition-colors tracking-widest uppercase">
                                ✕ Ablehnen
                              </button>
                            </>
                          )}
                        </div>

                        {/* Review info */}
                        {doc.reviewed_by && (
                          <div className="text-[10px] text-ivory/30 border-t border-ivory/10 pt-2">
                            {lang === 'de' ? 'Überprüft von' : 'Reviewed by'} {doc.reviewed_by} am {doc.reviewed_at ? format(new Date(doc.reviewed_at), 'dd.MM.yy HH:mm') : ''}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* GUEST MESSAGES — full message center */}
        {tab === 'messages' && (
          <AdminMessageCenter
            messages={guestMsgs}
            loading={loading}
            currentUser={user}
            onUpdate={loadAll}
          />
        )}

        {/* CAREER APPLICATIONS */}
        {tab === 'careers' && (
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
            ) : careerApps.length === 0 ? (
              <div className="text-center py-16 text-ivory/30 font-body text-sm">Keine Bewerbungen</div>
            ) : (
              careerApps.map(app => (
                <div key={app.id} className="glass-card border border-[#C9A96E]/08 rounded-xl p-4 hover:border-[#C9A96E]/20 transition-all">
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-body text-sm text-ivory">{app.first_name} {app.last_name}</span>
                        <StatusBadge status={app.status} />
                        <span className="text-ivory/30 text-[10px] font-body uppercase tracking-widest">{app.position}</span>
                      </div>
                      <p className="text-ivory/30 text-xs font-body">{app.email} · {app.phone || '—'} · {app.created_date ? format(new Date(app.created_date), 'dd.MM.yy') : ''}</p>
                      {app.message && <p className="text-ivory/40 text-xs font-body mt-1 line-clamp-2">{app.message}</p>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {app.status === 'new' && (
                        <button onClick={async () => {
                          await base44.entities.CareerApplication.update(app.id, { status: 'in_review' });
                          setCareerApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'in_review' } : a));
                        }} className="px-3 py-1.5 bg-blue-900/40 border border-blue-700/30 text-blue-400 text-[10px] rounded-lg font-body tracking-widest uppercase">
                          In Prüfung
                        </button>
                      )}
                      <a href={`mailto:${app.email}`}
                        className="px-3 py-1.5 btn-ghost-gold border rounded-lg text-[10px] font-body tracking-widest uppercase flex items-center gap-1">
                        <Mail className="w-3 h-3" /> E-Mail
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* VOUCHERS */}
        {tab === 'vouchers' && (
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
            ) : vouchers.length === 0 ? (
              <div className="text-center py-16 text-ivory/30 font-body text-sm">Keine Gutscheine</div>
            ) : (
              vouchers.map(v => (
                <div key={v.id} className="glass-card border border-[#C9A96E]/08 rounded-xl p-4 hover:border-[#C9A96E]/20 transition-all">
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-body text-sm text-ivory font-semibold tracking-widest">{v.code || '—'}</span>
                        <StatusBadge status={v.status} />
                        <span className="font-display text-lg font-light text-gold">€{v.amount_eur}</span>
                      </div>
                      <p className="text-ivory/50 text-xs font-body">{v.product_name}</p>
                      <p className="text-ivory/30 text-xs font-body mt-0.5">
                        Käufer: {v.purchaser_name || '—'} · {v.purchaser_email}
                        {v.recipient_name && ` → ${v.recipient_name}`}
                      </p>
                      <p className="text-ivory/20 text-[10px] font-body mt-0.5">
                        {v.created_date ? format(new Date(v.created_date), 'dd.MM.yy HH:mm') : ''}
                        {v.paid_at ? ` · Bezahlt: ${format(new Date(v.paid_at), 'dd.MM.yy HH:mm')}` : ''}
                        {v.expires_at ? ` · Läuft ab: ${format(new Date(v.expires_at), 'dd.MM.yyyy')}` : ''}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {v.status === 'active' && (
                        <button onClick={async () => {
                          await base44.entities.GiftVoucher.update(v.id, { status: 'redeemed', redeemed_at: new Date().toISOString(), redeemed_by: user?.email });
                          setVouchers(prev => prev.map(x => x.id === v.id ? { ...x, status: 'redeemed' } : x));
                        }} className="px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 text-[10px] rounded-lg font-body hover:bg-emerald-900/60 transition-colors tracking-widest uppercase">
                          ✓ Eingelöst
                        </button>
                      )}
                      {v.purchaser_email && (
                        <a href={`mailto:${v.purchaser_email}`}
                          className="px-3 py-1.5 btn-ghost-gold border rounded-lg text-[10px] font-body tracking-widest uppercase flex items-center gap-1">
                          <Mail className="w-3 h-3" /> E-Mail
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* BOOKING INTENTS */}
        {tab === 'bookings' && (
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
            ) : intents.length === 0 ? (
              <div className="text-center py-16 text-ivory/30 font-body text-sm">Keine Buchungs-Intents</div>
            ) : (
              intents.map(int => (
                <div key={int.id} className="glass-card border border-[#C9A96E]/08 rounded-xl p-4 hover:border-[#C9A96E]/20 transition-all">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-body text-sm text-ivory">{int.intent_ref}</span>
                        <StatusBadge status={int.status} />
                        {int.check_in && <span className="text-ivory/40 text-xs font-body">{int.check_in} → {int.check_out}</span>}
                      </div>
                      <p className="text-ivory/30 text-xs font-body">
                        {int.guests_adults} Erw. {int.guests_children > 0 ? `· ${int.guests_children} Kinder` : ''} · Sprache: {int.language?.toUpperCase() || 'DE'}
                        {(int.room_interest || int.room_category_interest) && ` · Zimmer: ${int.room_interest || int.room_category_interest}`}
                      </p>
                      <p className="text-ivory/20 text-[10px] font-body mt-0.5">{int.created_date ? format(new Date(int.created_date), 'dd.MM.yy HH:mm') : ''}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}