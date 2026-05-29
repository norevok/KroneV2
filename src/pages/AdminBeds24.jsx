/**
 * AdminBeds24 — Beds24 Sync Dashboard
 * Shows all HotelBookingIntents, sync status, issues, and allows manual re-sync trigger.
 */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { RefreshCw, CheckCircle, AlertTriangle, Clock, XCircle, BedDouble, Activity, ExternalLink, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import Beds24ConfigStatus from '@/components/admin/Beds24ConfigStatus';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const STATUS_COLORS = {
  initiated: 'text-gold/80 bg-gold/10 border-gold/20',
  redirected_to_beds24: 'text-blue-400 bg-blue-950/30 border-blue-800/20',
  returned_pending: 'text-gold/60 bg-gold/8 border-gold/15',
  returned_confirmed: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/30',
  returned_cancelled: 'text-red-400 bg-red-950/40 border-red-800/30',
  synced_confirmed: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/30',
  synced_pending: 'text-blue-400 bg-blue-950/30 border-blue-800/20',
  sync_failed: 'text-red-400 bg-red-950/40 border-red-800/30',
  needs_review: 'text-amber-400 bg-amber-950/30 border-amber-800/20',
  archived: 'text-ivory/20 bg-ivory/5 border-ivory/10',
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-medium border tracking-wider uppercase ${STATUS_COLORS[status] || 'text-ivory/40 bg-ivory/5 border-ivory/10'}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}

function SyncStatusDot({ status }) {
  if (status === 'synced') return <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />;
  if (status === 'failed') return <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />;
  if (status === 'syncing') return <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse inline-block" />;
  return <span className="w-2 h-2 rounded-full bg-ivory/20 inline-block" />;
}

export default function AdminBeds24() {
  const navigate = useNavigate();
  const [access, setAccess] = useState('loading');
  const [intents, setIntents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [syncing, setSyncing] = useState(null);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, failed: 0, needsReview: 0 });

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) {
        setAccess('denied');
        return;
      }
      setAccess('granted');
      loadData();
    }).catch(() => setAccess('denied'));
  }, []);

  async function loadData() {
    setLoading(true);
    const [intentData, issueData] = await Promise.all([
      base44.entities.HotelBookingIntent.list('-created_date', 200),
      base44.entities.HotelBookingSyncIssue.list('-created_date', 50).catch(() => []),
    ]);
    setIntents(intentData);
    setIssues(issueData);
    setStats({
      total: intentData.length,
      confirmed: intentData.filter(i => i.status === 'synced_confirmed' || i.status === 'returned_confirmed').length,
      pending: intentData.filter(i => ['initiated', 'redirected_to_beds24', 'returned_pending', 'synced_pending'].includes(i.status)).length,
      failed: intentData.filter(i => i.status === 'sync_failed').length,
      needsReview: intentData.filter(i => i.status === 'needs_review' || i.manual_review_required).length,
    });
    setLoading(false);
  }

  async function markReviewed(id) {
    setSyncing(id);
    await base44.entities.HotelBookingIntent.update(id, { manual_review_required: false, status: 'synced_confirmed' });
    setIntents(prev => prev.map(i => i.id === id ? { ...i, manual_review_required: false, status: 'synced_confirmed' } : i));
    setSyncing(null);
  }

  async function archiveIntent(id) {
    setSyncing(id);
    await base44.entities.HotelBookingIntent.update(id, { status: 'archived' });
    setIntents(prev => prev.map(i => i.id === id ? { ...i, status: 'archived' } : i));
    setSyncing(null);
  }

  const FILTERS = [
    { id: 'all', label: 'Alle' },
    { id: 'active', label: 'Aktiv' },
    { id: 'confirmed', label: 'Bestätigt' },
    { id: 'needs_review', label: 'Review nötig' },
    { id: 'failed', label: 'Fehlgeschlagen' },
    { id: 'archived', label: 'Archiviert' },
  ];

  const filteredIntents = intents.filter(i => {
    if (filter === 'all') return i.status !== 'archived';
    if (filter === 'active') return ['initiated', 'redirected_to_beds24', 'returned_pending', 'synced_pending'].includes(i.status);
    if (filter === 'confirmed') return i.status === 'synced_confirmed' || i.status === 'returned_confirmed';
    if (filter === 'needs_review') return i.status === 'needs_review' || i.manual_review_required;
    if (filter === 'failed') return i.status === 'sync_failed';
    if (filter === 'archived') return i.status === 'archived';
    return true;
  });

  if (access === 'loading') return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  );

  if (access === 'denied') return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-5">
      <div className="text-center glass-card border border-red-900/30 rounded-2xl p-10 max-w-sm">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-light text-ivory mb-2">Zugang verweigert</h1>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 btn-gold rounded-full text-xs uppercase tracking-widest font-body font-semibold">Startseite</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-5">

        {/* Header */}
        <div className="flex items-center justify-between py-6 gap-3 flex-wrap">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-1">Admin · Hotel</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory">Beds24 Sync</h1>
            <p className="text-ivory/30 text-xs font-body mt-1">Buchungs-Sync & Hotel-Dashboard</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/admin" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              ← Admin
            </Link>
            <a href="https://beds24.com/control2.php" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Beds24
            </a>
            <button onClick={loadData} className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-ivory text-xs font-body transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-6">
          {[
            { label: 'Gesamt', value: stats.total, color: 'text-ivory' },
            { label: 'Bestätigt', value: stats.confirmed, color: 'text-emerald-400' },
            { label: 'Ausstehend', value: stats.pending, color: 'text-gold' },
            { label: 'Fehlerhaft', value: stats.failed, color: 'text-red-400' },
            { label: 'Review nötig', value: stats.needsReview, color: 'text-amber-400' },
          ].map((s, i) => (
            <div key={i} className="glass-card border border-[#C9A96E]/10 rounded-2xl p-4">
              <p className={`font-display text-3xl font-light ${s.color}`}>{s.value}</p>
              <p className="text-ivory/40 text-xs font-body mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Review alert */}
        {stats.needsReview > 0 && (
          <div className="mb-5 border border-amber-500/20 bg-amber-950/20 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-sm font-body text-ivory/70">
              <strong className="text-amber-400">{stats.needsReview}</strong> Buchung{stats.needsReview !== 1 ? 'en' : ''} erfordern manuelle Überprüfung.
            </p>
          </div>
        )}

        {/* Sync Issues */}
        {issues.filter(i => i.severity === 'critical').length > 0 && (
          <div className="mb-5 glass-card border border-red-900/30 rounded-xl p-4">
            <p className="text-xs font-body text-red-400 font-semibold mb-2 tracking-widest uppercase">⚠ Sync-Fehler</p>
            {issues.filter(i => i.severity === 'critical').slice(0, 3).map(issue => (
              <div key={issue.id} className="text-xs text-ivory/50 font-body py-1 border-t border-red-900/20 first:border-0">
                {issue.description} — {issue.detected_at ? format(new Date(issue.detected_at), 'dd.MM.yy HH:mm') : ''}
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-1 bg-espresso rounded-xl p-1 mb-5 border border-[#C9A96E]/10 overflow-x-auto no-scrollbar">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-body tracking-widest uppercase transition-all whitespace-nowrap ${filter === f.id ? 'bg-gold text-charcoal font-semibold' : 'text-ivory/40 hover:text-ivory'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Intents Table */}
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
        ) : filteredIntents.length === 0 ? (
          <div className="text-center py-16 text-ivory/30 font-body text-sm">Keine Buchungen in dieser Kategorie</div>
        ) : (
          <div className="space-y-2">
            {filteredIntents.map(intent => {
              const expanded = expandedId === intent.id;
              return (
                <div key={intent.id} className={`glass-card border rounded-xl transition-all ${expanded ? 'border-gold/25' : 'border-[#C9A96E]/08 hover:border-[#C9A96E]/20'}`}>
                  <div className="p-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <button onClick={() => setExpandedId(expanded ? null : intent.id)} className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <SyncStatusDot status={intent.sync_status} />
                          <span className="font-body text-sm text-ivory font-mono">{intent.intent_ref || intent.id.slice(-8)}</span>
                          <StatusBadge status={intent.status} />
                          {intent.manual_review_required && (
                            <span className="text-[10px] text-amber-400 border border-amber-800/30 px-2 py-0.5 rounded-full font-body">Review nötig</span>
                          )}
                          {intent.beds24_booking_ref && (
                            <span className="text-[10px] text-ivory/30 border border-ivory/10 px-2 py-0.5 rounded-full font-body">Beds24: {intent.beds24_booking_ref}</span>
                          )}
                        </div>
                        <div className="text-ivory/30 text-xs font-body flex flex-wrap gap-3">
                          {intent.guest_email && <span>{intent.guest_email}</span>}
                          {intent.check_in && <span>📅 {intent.check_in} → {intent.check_out}</span>}
                          {intent.guests_adults && <span>👤 {intent.guests_adults} Erw.</span>}
                          <span>{intent.created_date ? format(new Date(intent.created_date), 'dd.MM.yy HH:mm') : ''}</span>
                        </div>
                      </button>
                      <div className="flex gap-2 flex-shrink-0">
                        {intent.manual_review_required && (
                          <button onClick={() => markReviewed(intent.id)} disabled={syncing === intent.id}
                            className="px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 text-[10px] rounded-lg font-body hover:bg-emerald-900/60 transition-colors tracking-widest uppercase">
                            ✓ Bestätigen
                          </button>
                        )}
                        {!['archived'].includes(intent.status) && (
                          <button onClick={() => archiveIntent(intent.id)} disabled={syncing === intent.id}
                            className="px-3 py-1.5 bg-ivory/5 border border-ivory/10 text-ivory/30 text-[10px] rounded-lg font-body hover:text-ivory/60 transition-colors tracking-widest uppercase">
                            Archiv
                          </button>
                        )}
                        <button onClick={() => setExpandedId(expanded ? null : intent.id)}
                          className="w-7 h-7 flex items-center justify-center text-ivory/30 hover:text-gold transition-colors">
                          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {expanded && (
                      <div className="mt-4 pt-4 border-t border-[#C9A96E]/08 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
                        <div className="space-y-2">
                          <div className="flex justify-between"><span className="text-ivory/30">Intent Ref</span><span className="text-ivory/70 font-mono">{intent.intent_ref}</span></div>
                          <div className="flex justify-between"><span className="text-ivory/30">Beds24 Ref</span><span className="text-ivory/70 font-mono">{intent.beds24_booking_ref || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-ivory/30">Gast</span><span className="text-ivory/70">{intent.guest_first_name} {intent.guest_last_name}</span></div>
                          <div className="flex justify-between"><span className="text-ivory/30">E-Mail</span><span className="text-ivory/70">{intent.guest_email || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-ivory/30">Telefon</span><span className="text-ivory/70">{intent.guest_phone || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-ivory/30">Zimmer</span><span className="text-ivory/70">{intent.room_category_interest || '—'}</span></div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between"><span className="text-ivory/30">Check-in</span><span className="text-ivory/70">{intent.check_in || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-ivory/30">Check-out</span><span className="text-ivory/70">{intent.check_out || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-ivory/30">Erwachsene</span><span className="text-ivory/70">{intent.guests_adults || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-ivory/30">Kinder</span><span className="text-ivory/70">{intent.guests_children || 0}</span></div>
                          <div className="flex justify-between"><span className="text-ivory/30">Sync Status</span><span className="text-ivory/70">{intent.sync_status || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-ivory/30">Letzter Sync</span><span className="text-ivory/70">{intent.last_synced_at ? format(new Date(intent.last_synced_at), 'dd.MM.yy HH:mm') : '—'}</span></div>
                        </div>
                        {intent.sync_notes && (
                          <div className="col-span-2 bg-ivory/5 rounded-lg p-3">
                            <p className="text-ivory/30 text-[10px] uppercase tracking-wider mb-1">Sync Notes</p>
                            <p className="text-ivory/50">{intent.sync_notes}</p>
                          </div>
                        )}
                        {intent.beds24_booking_url_used && (
                          <div className="col-span-2">
                            <a href={intent.beds24_booking_url_used} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-gold/60 hover:text-gold text-[10px] transition-colors">
                              <ExternalLink className="w-3 h-3" /> Beds24 Buchungs-URL öffnen
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Integration Config Status */}
        <Beds24ConfigStatus />

        {/* Webhook Info */}
        <div className="mt-4 glass-card border border-[#C9A96E]/08 rounded-xl p-5">
          <p className="text-ivory/30 text-[10px] tracking-[0.3em] uppercase font-body mb-3">Webhook Konfiguration</p>
          <p className="text-ivory/50 text-xs font-body mb-2">
            Beds24 Webhook URL → Dashboard › Code › Functions › <span className="font-mono text-gold/60">beds24BookingWebhook</span>
          </p>
          <p className="text-ivory/30 text-[10px] font-body">
            Secrets: <span className="font-mono">BEDS24_WEBHOOK_SECRET</span> (optional, aber empfohlen) · <span className="font-mono">BEDS24_API_KEY</span>
          </p>
        </div>
      </div>
    </div>
  );
}