/**
 * AdminAuditLog — Full audit + system log dashboard
 * Replaces ActivityLogPage with richer data: EmailLog, SlackLog, ActivityLog, AdminAuditEntry
 */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { RefreshCw, Mail, MessageSquare, Activity, Shield, XCircle, Search } from 'lucide-react';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const STATUS_COLORS = {
  sent: 'text-emerald-400',
  failed: 'text-red-400',
  bounced: 'text-amber-400',
  success: 'text-emerald-400',
  error: 'text-red-400',
};

export default function AdminAuditLog() {
  const navigate = useNavigate();
  const [access, setAccess] = useState('loading');
  const [tab, setTab] = useState('emails');
  const [emails, setEmails] = useState([]);
  const [slackLogs, setSlackLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [auditEntries, setAuditEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) {
        setAccess('denied'); return;
      }
      setAccess('granted');
      loadData();
    }).catch(() => setAccess('denied'));
  }, []);

  async function loadData() {
    setLoading(true);
    const [em, sl, al, ae] = await Promise.all([
      base44.entities.EmailLog.list('-created_date', 100),
      base44.entities.SlackLog.list('-created_date', 100),
      base44.entities.ActivityLog.list('-created_date', 100).catch(() => []),
      base44.entities.AdminAuditEntry.list('-created_date', 100).catch(() => []),
    ]);
    setEmails(em);
    setSlackLogs(sl);
    setActivityLogs(al);
    setAuditEntries(ae);
    setLoading(false);
  }

  const TABS = [
    { id: 'emails', label: 'E-Mails', icon: Mail, count: emails.filter(e => e.status === 'failed').length },
    { id: 'slack', label: 'Slack', icon: MessageSquare, count: slackLogs.filter(s => s.status === 'failed').length },
    { id: 'activity', label: 'Aktivität', icon: Activity, count: 0 },
    { id: 'audit', label: 'Audit', icon: Shield, count: 0 },
  ];

  const filterSearch = (items, keys) => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(item => keys.some(k => String(item[k] || '').toLowerCase().includes(q)));
  };

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
      <div className="max-w-5xl mx-auto px-4 sm:px-5">

        {/* Header */}
        <div className="flex items-center justify-between py-6 gap-3 flex-wrap">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-1">Admin · System</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory">Audit & Logs</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/admin" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              ← Admin
            </Link>
            <button onClick={loadData} className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-ivory text-xs font-body transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/25" />
          <input type="text" placeholder="Suchen…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-espresso border border-[#C9A96E]/10 rounded-xl pl-10 pr-4 py-3 text-sm text-ivory placeholder-ivory/20 focus:outline-none focus:border-gold/30 font-body" />
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 sm:gap-1 bg-espresso rounded-xl p-1 mb-5 border border-[#C9A96E]/10 overflow-x-auto no-scrollbar">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-body tracking-widest uppercase transition-all whitespace-nowrap ${tab === t.id ? 'bg-gold text-charcoal font-semibold' : 'text-ivory/40 hover:text-ivory'}`}>
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
              {t.count > 0 && <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === t.id ? 'bg-charcoal/20' : 'bg-red-500/20 text-red-400'}`}>{t.count}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
        ) : (
          <>
            {/* EMAIL LOGS */}
            {tab === 'emails' && (
              <div className="space-y-1.5">
                {filterSearch(emails, ['recipient', 'subject', 'template', 'related_ref']).length === 0 ? (
                  <div className="text-center py-12 text-ivory/30 font-body text-sm">Keine E-Mail-Logs</div>
                ) : filterSearch(emails, ['recipient', 'subject', 'template', 'related_ref']).map(em => (
                  <div key={em.id} className="glass-card border border-[#C9A96E]/08 rounded-xl px-4 py-3 hover:border-[#C9A96E]/15 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`text-xs font-body font-semibold ${STATUS_COLORS[em.status] || 'text-ivory/50'}`}>
                            {em.status?.toUpperCase()}
                          </span>
                          <span className="text-ivory/60 text-xs font-body truncate">{em.subject}</span>
                        </div>
                        <p className="text-ivory/30 text-[10px] font-body">
                          → {em.recipient}
                          {em.template && ` · ${em.template}`}
                          {em.related_ref && ` · ${em.related_ref}`}
                        </p>
                        {em.failure_reason && <p className="text-red-400/60 text-[10px] font-body mt-0.5">{em.failure_reason}</p>}
                      </div>
                      <p className="text-ivory/20 text-[10px] font-body flex-shrink-0">
                        {em.sent_at ? format(new Date(em.sent_at), 'dd.MM.yy HH:mm') : em.created_date ? format(new Date(em.created_date), 'dd.MM.yy HH:mm') : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SLACK LOGS */}
            {tab === 'slack' && (
              <div className="space-y-1.5">
                {filterSearch(slackLogs, ['channel', 'message_type', 'related_ref']).length === 0 ? (
                  <div className="text-center py-12 text-ivory/30 font-body text-sm">Keine Slack-Logs</div>
                ) : filterSearch(slackLogs, ['channel', 'message_type', 'related_ref']).map(sl => (
                  <div key={sl.id} className="glass-card border border-[#C9A96E]/08 rounded-xl px-4 py-3 hover:border-[#C9A96E]/15 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`text-xs font-body font-semibold ${sl.status === 'sent' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {sl.status?.toUpperCase()}
                          </span>
                          <span className="text-ivory/60 text-xs font-body">{sl.message_type}</span>
                          <span className="text-ivory/30 text-[10px] font-body">{sl.channel}</span>
                        </div>
                        {sl.related_ref && <p className="text-ivory/30 text-[10px] font-body">{sl.related_ref}</p>}
                        {sl.failure_reason && <p className="text-red-400/60 text-[10px] font-body mt-0.5">{sl.failure_reason}</p>}
                      </div>
                      <p className="text-ivory/20 text-[10px] font-body flex-shrink-0">
                        {sl.sent_at ? format(new Date(sl.sent_at), 'dd.MM.yy HH:mm') : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ACTIVITY LOGS */}
            {tab === 'activity' && (
              <div className="space-y-1.5">
                {filterSearch(activityLogs, ['actor_email', 'action', 'description', 'entity_ref']).length === 0 ? (
                  <div className="text-center py-12 text-ivory/30 font-body text-sm">Keine Aktivitätslogs</div>
                ) : filterSearch(activityLogs, ['actor_email', 'action', 'description', 'entity_ref']).map(al => (
                  <div key={al.id} className="glass-card border border-[#C9A96E]/08 rounded-xl px-4 py-3 hover:border-[#C9A96E]/15 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-xs font-body text-gold/70">{al.action}</span>
                          <span className="text-ivory/40 text-[10px] font-body">{al.actor_email}</span>
                        </div>
                        {al.description && <p className="text-ivory/50 text-xs font-body">{al.description}</p>}
                        {al.entity_ref && <p className="text-ivory/25 text-[10px] font-body mt-0.5">{al.entity_type} · {al.entity_ref}</p>}
                      </div>
                      <p className="text-ivory/20 text-[10px] font-body flex-shrink-0">
                        {al.performed_at ? format(new Date(al.performed_at), 'dd.MM.yy HH:mm') : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADMIN AUDIT */}
            {tab === 'audit' && (
              <div className="space-y-1.5">
                {filterSearch(auditEntries, ['admin_email', 'action', 'entity_type', 'entity_ref', 'change_summary']).length === 0 ? (
                  <div className="text-center py-12 text-ivory/30 font-body text-sm">Keine Admin-Audit-Einträge</div>
                ) : filterSearch(auditEntries, ['admin_email', 'action', 'entity_type', 'entity_ref', 'change_summary']).map(ae => (
                  <div key={ae.id} className="glass-card border border-[#C9A96E]/08 rounded-xl px-4 py-3 hover:border-[#C9A96E]/15 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-xs font-body text-gold/70">{ae.action}</span>
                          <span className="text-ivory/40 text-[10px] font-body">{ae.admin_email}</span>
                          <span className="text-ivory/25 text-[10px] font-body">{ae.entity_type}</span>
                        </div>
                        {ae.change_summary && <p className="text-ivory/50 text-xs font-body">{ae.change_summary}</p>}
                        {ae.entity_ref && <p className="text-ivory/25 text-[10px] font-body mt-0.5">Ref: {ae.entity_ref}</p>}
                      </div>
                      <p className="text-ivory/20 text-[10px] font-body flex-shrink-0">
                        {ae.performed_at ? format(new Date(ae.performed_at), 'dd.MM.yy HH:mm') : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}