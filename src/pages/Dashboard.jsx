import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, Calendar, Users, MessageSquare, CheckCircle, Clock, Activity, LayoutDashboard, RefreshCw, UtensilsCrossed, BedDouble, Gift, FileText, AlertTriangle, ChevronRight } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

function MetricCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5 flex items-start gap-4 hover:border-[#C9A96E]/20 transition-all">
      <div className={`w-10 h-10 rounded-full bg-[#1A1410] border border-[#C9A96E]/10 flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-ivory/40 text-[10px] font-body uppercase tracking-wider mb-1">{label}</p>
        <p className={`font-display text-3xl font-light ${color}`}>{value}</p>
        {sub && <p className="text-ivory/25 text-[10px] font-body mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { lang } = useLang();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState({
    totalReservations: 0, confirmedReservations: 0, pendingReservations: 0,
    cancelledReservations: 0, totalBookingIntents: 0, guestMessages: 0,
    activeVouchers: 0, pendingDocs: 0, todayReservations: 0,
  });
  const [chartData, setChartData] = useState({ activityByDay: [], statusBreakdown: [], bookingSummary: [] });
  const [recentReservations, setRecentReservations] = useState([]);
  const [pendingAlerts, setPendingAlerts] = useState([]);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u) return;
      setUser(u);
      if (ADMIN_EMAILS.includes(u.email) || u.role === 'admin') setIsAdmin(true);
    }).catch(() => {});
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    // Paginated limits — minimal fetch, no background refresh, no polling
    const [reservations, intents, messages, vouchers, docs] = await Promise.all([
      base44.entities.RestaurantReservation.list('-created_date', 200).catch(() => []),
      base44.entities.HotelBookingIntent.list('-created_date', 100).catch(() => []),
      base44.entities.GuestMessage.list('-created_date', 50).catch(() => []),
      base44.entities.GiftVoucher.list('-created_date', 50).catch(() => []),
      base44.entities.GuestDocument.list('-created_date', 50).catch(() => []),
    ]);

    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const pending = reservations.filter(r => r.status === 'new' || r.status === 'pending').length;
    const cancelled = reservations.filter(r => r.status?.includes('cancelled')).length;
    const todayRes = reservations.filter(r => r.reservation_date === today).length;
    const activeVouchers = vouchers.filter(v => v.status === 'active').length;
    const pendingDocs = docs.filter(d => d.status === 'uploaded').length;
    const newMsgs = messages.filter(m => m.status === 'new').length;

    setMetrics({ totalReservations: reservations.length, confirmedReservations: confirmed, pendingReservations: pending, cancelledReservations: cancelled, totalBookingIntents: intents.length, guestMessages: messages.length, activeVouchers, pendingDocs, todayReservations: todayRes });
    setRecentReservations(reservations.slice(0, 8));

    // Alerts
    const alerts = [];
    if (pending > 0) alerts.push({ type: 'warning', msg: lang === 'de' ? `${pending} Reservierungen ausstehend` : `${pending} reservations pending`, link: '/admin' });
    if (pendingDocs > 0) alerts.push({ type: 'info', msg: lang === 'de' ? `${pendingDocs} Dokumente zur Prüfung` : `${pendingDocs} documents to review`, link: '/admin' });
    if (newMsgs > 0) alerts.push({ type: 'info', msg: lang === 'de' ? `${newMsgs} neue Nachrichten` : `${newMsgs} new messages`, link: '/admin' });
    setPendingAlerts(alerts);

    // Chart — last 14 days
    const now = new Date();
    const activityByDay = Array.from({ length: 14 }, (_, i) => {
      const d = startOfDay(subDays(now, 13 - i));
      const dateStr = format(d, 'yyyy-MM-dd');
      return {
        date: format(d, 'dd.MM'),
        Reservierungen: reservations.filter(r => r.created_date?.startsWith(dateStr)).length,
        Buchungen: intents.filter(x => x.created_date?.startsWith(dateStr)).length,
      };
    });

    const statusBreakdown = [
      { name: lang === 'de' ? 'Bestätigt' : 'Confirmed', value: confirmed, color: '#10b981' },
      { name: lang === 'de' ? 'Ausstehend' : 'Pending', value: pending, color: '#f59e0b' },
      { name: lang === 'de' ? 'Abgesagt' : 'Cancelled', value: cancelled, color: '#ef4444' },
      { name: lang === 'de' ? 'Abgeschlossen' : 'Completed', value: reservations.filter(r => r.status === 'completed').length, color: '#6b7280' },
    ];

    // Booking summary — last 6 months
    const bookingSummary = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthStr = format(d, 'yyyy-MM');
      const label = format(d, 'MMM yy');
      return {
        month: label,
        Tischreservierungen: reservations.filter(r => r.reservation_date?.startsWith(monthStr)).length,
        Hotelbuchungen: intents.filter(x => x.created_date?.startsWith(monthStr)).length,
      };
    });

    setChartData({ activityByDay, statusBreakdown, bookingSummary });
    setLoading(false);
  }

  if (loading) return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center pt-20">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p className="text-ivory/30 text-sm font-body">…</p>
      </div>
    </div>
  );

  const STATUS_BADGE = {
    new: 'text-gold/80 bg-gold/10 border-gold/20',
    pending: 'text-gold/80 bg-gold/10 border-gold/20',
    confirmed: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/30',
    cancelled_by_guest: 'text-red-400 bg-red-950/30 border-red-800/20',
    cancelled_by_staff: 'text-red-400 bg-red-950/30 border-red-800/20',
    completed: 'text-ivory/30 bg-ivory/5 border-ivory/10',
    no_show: 'text-red-400/60 bg-red-950/20 border-red-900/15',
  };

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 sm:pt-20 pb-20 px-4 sm:px-5">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 py-7 sm:py-10 flex-wrap">
          <div>
            <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-2">Krone Langenburg</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory mb-1">
              {lang === 'de' ? 'Übersicht' : 'Overview'}
            </h1>
            <p className="text-ivory/35 text-sm font-body">
              {format(new Date(), 'EEEE, d. MMMM yyyy')} · {user?.email}
            </p>
            <p className="text-ivory/20 text-[10px] font-body mt-0.5">
              {lang === 'de' ? 'Daten werden nur bei manuellem Refresh aktualisiert' : 'Data updates on manual refresh only'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin && (
              <>
                <Link to="/admin" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Admin
                </Link>
                <Link to="/activity-log" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
                  <Activity className="w-3.5 h-3.5" /> Log
                </Link>
              </>
            )}
            <button onClick={loadData} className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-ivory text-xs font-body transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Alerts */}
        {pendingAlerts.length > 0 && (
          <div className="space-y-2 mb-8">
            {pendingAlerts.map((a, i) => (
              <Link key={i} to={a.link} className="flex items-center gap-3 border border-gold/20 bg-gold/6 rounded-xl px-4 py-3 hover:bg-gold/10 transition-colors">
                <AlertTriangle className="w-4 h-4 text-gold flex-shrink-0" />
                <p className="text-ivory/70 text-sm font-body flex-1">{a.msg}</p>
                <ChevronRight className="w-4 h-4 text-gold/40 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-10">
          <MetricCard icon={UtensilsCrossed} label={lang === 'de' ? 'Heute' : 'Today'} value={metrics.todayReservations} color="text-gold" sub={lang === 'de' ? 'Reservierungen' : 'reservations'} />
          <MetricCard icon={Clock} label={lang === 'de' ? 'Ausstehend' : 'Pending'} value={metrics.pendingReservations} color="text-amber-400" />
          <MetricCard icon={CheckCircle} label={lang === 'de' ? 'Bestätigt' : 'Confirmed'} value={metrics.confirmedReservations} color="text-emerald-400" />
          <MetricCard icon={BedDouble} label={lang === 'de' ? 'Buchungen' : 'Bookings'} value={metrics.totalBookingIntents} color="text-blue-400" />
          <MetricCard icon={Gift} label={lang === 'de' ? 'Gutscheine' : 'Vouchers'} value={metrics.activeVouchers} color="text-gold-light" sub={lang === 'de' ? 'aktiv' : 'active'} />
          <MetricCard icon={MessageSquare} label={lang === 'de' ? 'Nachrichten' : 'Messages'} value={metrics.guestMessages} color="text-pink-400" />
          <MetricCard icon={FileText} label={lang === 'de' ? 'Dokumente' : 'Documents'} value={metrics.pendingDocs} color="text-purple-400" sub={lang === 'de' ? 'zur Prüfung' : 'to review'} />
          <MetricCard icon={Calendar} label={lang === 'de' ? 'Gesamt Res.' : 'Total Res.'} value={metrics.totalReservations} color="text-ivory/50" />
          <MetricCard icon={TrendingUp} label={lang === 'de' ? 'Abgesagt' : 'Cancelled'} value={metrics.cancelledReservations} color="text-red-400" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {/* Trend - 2/3 width */}
          <div className="lg:col-span-2 glass-card border border-[#C9A96E]/10 rounded-2xl p-5 sm:p-6">
            <h2 className="font-display text-xl font-light text-ivory mb-5">{lang === 'de' ? 'Aktivität (14 Tage)' : 'Activity (14 Days)'}</h2>
            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={240} minWidth={400}>
                <LineChart data={chartData.activityByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,169,110,0.08)" />
                  <XAxis dataKey="date" stroke="rgba(245,239,227,0.3)" style={{ fontSize: '11px' }} />
                  <YAxis stroke="rgba(245,239,227,0.3)" style={{ fontSize: '11px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1A1410', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '8px', color: '#F5EFE3', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(245,239,227,0.5)' }} />
                  <Line type="monotone" dataKey="Reservierungen" stroke="#C9A96E" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Buchungen" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status breakdown - 1/3 width */}
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5 sm:p-6">
            <h2 className="font-display text-xl font-light text-ivory mb-5">{lang === 'de' ? 'Reservierungsstatus' : 'Reservation Status'}</h2>
            <div className="space-y-3">
              {chartData.statusBreakdown.filter(s => s.value > 0).map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-body mb-1">
                    <span style={{ color: s.color }}>{s.name}</span>
                    <span className="text-ivory/50">{s.value}</span>
                  </div>
                  <div className="h-1.5 bg-ivory/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${metrics.totalReservations ? Math.round(s.value / metrics.totalReservations * 100) : 0}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
              {metrics.totalReservations === 0 && (
                <p className="text-ivory/20 text-xs font-body text-center py-4">{lang === 'de' ? 'Keine Daten' : 'No data'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Summary Chart */}
        <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5 sm:p-6 mb-8">
          <h2 className="font-display text-xl font-light text-ivory mb-5">
            {lang === 'de' ? 'Buchungsübersicht (6 Monate)' : 'Booking Summary (6 Months)'}
          </h2>
          <div className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={260} minWidth={400}>
              <BarChart data={chartData.bookingSummary} barGap={4} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,169,110,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(245,239,227,0.3)" style={{ fontSize: '11px' }} />
                <YAxis allowDecimals={false} stroke="rgba(245,239,227,0.3)" style={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1410', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '8px', color: '#F5EFE3', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(201,169,110,0.05)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(245,239,227,0.5)' }} />
                <Bar dataKey="Tischreservierungen" fill="#C9A96E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Hotelbuchungen" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Reservations */}
        {recentReservations.length > 0 && (
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-light text-ivory">{lang === 'de' ? 'Letzte Reservierungen' : 'Recent Reservations'}</h2>
              <Link to="/admin" className="text-gold/60 hover:text-gold text-xs font-body tracking-wider transition-colors">
                {lang === 'de' ? 'Alle anzeigen →' : 'View all →'}
              </Link>
            </div>
            <div className="space-y-2 overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#C9A96E]/08">
                    {['Gast', 'Datum', 'Zeit', 'Pers.', 'Status'].map(h => (
                      <th key={h} className="text-left text-[10px] tracking-widest uppercase font-body text-ivory/25 pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentReservations.map(r => (
                    <tr key={r.id} className="border-b border-[#C9A96E]/05 hover:bg-white/2 transition-colors">
                      <td className="py-2.5 pr-4">
                        <p className="text-ivory/75 text-sm font-body">{r.guest_first_name} {r.guest_last_name}</p>
                        <p className="text-ivory/25 text-[10px] font-body truncate max-w-[140px]">{r.guest_email}</p>
                      </td>
                      <td className="py-2.5 pr-4 text-ivory/50 text-sm font-body">{r.reservation_date}</td>
                      <td className="py-2.5 pr-4 text-ivory/50 text-sm font-body">{r.reservation_time}</td>
                      <td className="py-2.5 pr-4 text-ivory/50 text-sm font-body">{r.party_size}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-body border uppercase tracking-wider ${STATUS_BADGE[r.status] || 'text-ivory/30 bg-ivory/5 border-ivory/10'}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}