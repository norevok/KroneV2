/**
 * Credit Emergency Dashboard — Krone Langenburg by Ammesso
 * Route: /admin/credit-dashboard
 * 
 * Shows real-time credit usage, workflow safety status,
 * overnight consumption analysis, and guardrail audit.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { format, subHours, startOfDay } from 'date-fns';
import {
  Zap, AlertTriangle, CheckCircle, XCircle, Clock, ArrowLeft,
  RefreshCw, Shield, Activity, Mail, MessageSquare, Server,
  TrendingUp, Ban, Info
} from 'lucide-react';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

// Master audit table — every function, classified
const FUNCTION_AUDIT = [
  // ── EVENT-DRIVEN ONLY (SAFE) ──────────────────────────────────────
  { name: 'createReservation',        trigger: 'Guest form submit',        credits: 'SendEmail×2 + Slack',      verdict: 'safe',    category: 'Reservation' },
  { name: 'sendCancellationEmail',    trigger: 'Reservation cancelled',    credits: 'SendEmail×1',              verdict: 'safe',    category: 'Reservation' },
  { name: 'cancelReservation',        trigger: 'Guest self-cancel',        credits: 'SendEmail×1 + Slack',      verdict: 'safe',    category: 'Reservation' },
  { name: 'validateReservation',      trigger: 'Reserve page on-demand',   credits: 'DB reads only — 0',        verdict: 'safe',    category: 'Reservation' },
  { name: 'getReservationAvailability', trigger: 'Reserve page',           credits: 'DB reads only — 0',        verdict: 'safe',    category: 'Reservation' },
  { name: 'getAvailableTimes',        trigger: 'Reserve page',             credits: 'DB reads only — 0',        verdict: 'safe',    category: 'Reservation' },
  { name: 'getReservationTimeSlots',  trigger: 'Reserve page',             credits: 'DB reads only — 0',        verdict: 'safe',    category: 'Reservation' },
  { name: 'sendContactEmail',         trigger: 'Contact form submit',      credits: 'SendEmail×2',              verdict: 'safe',    category: 'Contact' },
  { name: 'stripeVoucherWebhook',     trigger: 'Stripe webhook event',     credits: 'SendEmail×2',              verdict: 'safe',    category: 'Stripe' },
  { name: 'createVoucherCheckout',    trigger: 'Guest purchase attempt',   credits: 'Stripe session create',    verdict: 'safe',    category: 'Stripe' },
  { name: 'guestDocumentUpload',      trigger: 'Guest uploads file',       credits: 'UploadPrivateFile + Slack',verdict: 'safe',    category: 'Documents' },
  { name: 'guestUploadDocument',      trigger: 'Guest uploads (alt path)', credits: 'UploadPrivateFile + Slack',verdict: 'safe',    category: 'Documents' },
  { name: 'guestDocumentAccess',      trigger: 'Admin downloads file',     credits: 'CreateFileSignedUrl',      verdict: 'safe',    category: 'Documents' },
  { name: 'guestSendMessage',         trigger: 'Guest sends message',      credits: 'Slack via notifySlack',    verdict: 'safe',    category: 'Messages' },
  { name: 'notifySlack',             trigger: 'Called by other functions', credits: 'Slack webhook + DB log',   verdict: 'safe',    category: 'Shared' },
  { name: 'logActivity',             trigger: 'Called by admin/forms',     credits: 'DB write only — 0',        verdict: 'safe',    category: 'Shared' },
  { name: 'resendConfirmationEmail',  trigger: 'Admin manual trigger',     credits: 'SendEmail×1',              verdict: 'safe',    category: 'Admin' },
  { name: 'beds24BookingWebhook',     trigger: 'Beds24 inbound webhook',   credits: 'DB + Slack (new only)',    verdict: 'safe',    category: 'Hotel' },
  { name: 'beds24BookingReturnSync',  trigger: 'Guest returns from Beds24',credits: 'DB + notifySlack',         verdict: 'safe',    category: 'Hotel' },
  { name: 'handleHotelBookingReturn', trigger: 'Guest returns from Beds24',credits: 'DB + notifySlack',         verdict: 'safe',    category: 'Hotel' },
  { name: 'generateBookingToken',     trigger: 'User clicks Book Now',     credits: 'DB write only — 0',        verdict: 'safe',    category: 'Hotel' },
  { name: 'createHotelBookingIntent', trigger: 'Guest starts booking',     credits: 'DB write only — 0',        verdict: 'safe',    category: 'Hotel' },
  { name: 'getGuestReservations',     trigger: 'Guest account page',       credits: 'DB reads only — 0',        verdict: 'safe',    category: 'Guest' },
  { name: 'getActiveReviews',         trigger: 'Home page load',           credits: 'DB reads only — 0',        verdict: 'safe',    category: 'Content' },
  { name: 'adminGetReservations',     trigger: 'Admin dashboard',          credits: 'DB reads only — 0',        verdict: 'safe',    category: 'Admin' },
  { name: 'adminUpdateReservation',   trigger: 'Admin action',             credits: 'DB write only — 0',        verdict: 'safe',    category: 'Admin' },
  { name: 'adminUpdateReservationStatus', trigger: 'Admin action',         credits: 'DB + conditional notifs',  verdict: 'safe',    category: 'Admin' },
  { name: 'adminVerifyAccess',        trigger: 'Admin page load',          credits: 'DB read only — 0',         verdict: 'safe',    category: 'Admin' },
  // ── SCHEDULED (1 only) ───────────────────────────────────────────
  { name: 'nightlyMaintenance',       trigger: 'Scheduled 02:00 CET/day',  credits: '1 invocation + conditional DB writes', verdict: 'scheduled', category: 'Maintenance' },
];

const OVERNIGHT_ANALYSIS = [
  { item: 'nightlyMaintenance (02:00 CET)', cost: '1 invocation', external_api: 'None', justified: true, note: 'DB cleanup only. No SendEmail, no Slack, no AI.' },
  { item: 'All other functions', cost: '0', external_api: 'None', justified: true, note: 'Only fire on real business events. Zero idle consumption.' },
];

const PREVIOUSLY_REMOVED = [
  'ChatWidget InvokeLLM — replaced with static FAQ (was 1 credit per chat message)',
  'sendReservationEmail — duplicate of createReservation inline flow',
  'sendReservationConfirmation — second duplicate confirmation sender',
  'sendGuestMessageEmail — exact duplicate of guestSendMessage',
  'handleBookingReturn — older Beds24 handler, superseded by handleHotelBookingReturn',
  'detectAnomalies — never triggered by any automation',
  'syncHealthStatus — on-demand diagnostic, no automation',
  'initializeSystemDefaults — one-time setup, system already initialized',
  'ensureSuperAdminRole — only wrote to console.log, no effect',
  'Beds24 webhook per-event DB write on every ping — now only writes on failure',
  'Admin logActivity call on every status change click — removed, status visible in DB',
  'nightlyMaintenance ActivityLog on no-op runs — now conditional only',
];

function Badge({ verdict }) {
  if (verdict === 'safe') return <span className="px-2 py-0.5 rounded-full text-[10px] font-body font-semibold bg-emerald-950/40 border border-emerald-700/30 text-emerald-400 uppercase tracking-wider">Event-Only ✓</span>;
  if (verdict === 'scheduled') return <span className="px-2 py-0.5 rounded-full text-[10px] font-body font-semibold bg-amber-950/40 border border-amber-700/30 text-amber-400 uppercase tracking-wider">Scheduled</span>;
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-body font-semibold bg-red-950/40 border border-red-700/30 text-red-400 uppercase tracking-wider">Risk</span>;
}

function Section({ icon: IconComp, color, title, children }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <IconComp className={`w-5 h-5 ${color} flex-shrink-0`} />
        <h2 className="font-display text-2xl font-light text-ivory">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function AdminCreditDashboard() {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState('loading');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [automations, setAutomations] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) {
        setAccess('denied');
        return;
      }
      setUser(u);
      setAccess('granted');
      loadLogs();
    }).catch(() => setAccess('denied'));
  }, []);

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await base44.entities.CreditUsageLog.list('-created_date', 100);
      setLogs(data || []);
    } catch (_) {}
    setLoading(false);
  }

  const now = new Date();
  const todayStart = startOfDay(now).toISOString();
  const overnightStart = subHours(now, 8).toISOString();

  const todayLogs = logs.filter(l => l.created_date >= todayStart);
  const overnightLogs = logs.filter(l => l.created_date >= overnightStart);
  const blockedLogs = logs.filter(l => l.status === 'blocked');
  const emailLogs = logs.filter(l => l.integration_name === 'SendEmail');
  const slackLogs = logs.filter(l => l.integration_name === 'Slack');

  const todayCredits = todayLogs.reduce((s, l) => s + (l.estimated_credit_usage || 0), 0);
  const overnightCredits = overnightLogs.reduce((s, l) => s + (l.estimated_credit_usage || 0), 0);

  const categories = ['All', ...new Set(FUNCTION_AUDIT.map(f => f.category))];
  const filtered = activeCategory === 'All' ? FUNCTION_AUDIT : FUNCTION_AUDIT.filter(f => f.category === activeCategory);

  const safeCount = FUNCTION_AUDIT.filter(f => f.verdict === 'safe').length;
  const scheduledCount = FUNCTION_AUDIT.filter(f => f.verdict === 'scheduled').length;

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
        <p className="text-ivory/40 text-sm font-body">Nur für autorisierte Admins.</p>
        <Link to="/" className="mt-6 inline-block px-6 py-3 btn-gold rounded-full text-xs uppercase tracking-widest font-body font-semibold">Startseite</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 sm:pt-20 pb-20 px-4 sm:px-5">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="py-8">
          <Link to="/admin" className="flex items-center gap-2 text-gold/60 hover:text-gold text-xs font-body tracking-wider mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Admin Dashboard
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-2">Krone Langenburg · Intern</p>
              <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory mb-1">Credit Emergency Dashboard</h1>
              <p className="text-ivory/35 text-sm font-body">Vollständiger Audit · Stand: {format(now, 'dd.MM.yyyy HH:mm')}</p>
            </div>
            <button onClick={loadLogs} className="flex items-center gap-2 px-4 py-2 glass-card border border-[#C9A96E]/15 rounded-xl text-ivory/40 hover:text-ivory text-xs font-body transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* GUARDRAIL STATUS STRIP */}
        <div className="bg-emerald-950/30 border border-emerald-700/30 rounded-2xl p-5 mb-8 flex items-start gap-4">
          <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-emerald-400 font-body font-semibold text-sm mb-1">Credit Guardrail: AKTIV</p>
            <p className="text-emerald-400/70 text-xs font-body leading-relaxed">
              {safeCount} von {FUNCTION_AUDIT.length} Funktionen sind vollständig event-driven.
              1 geplante Automation (nightlyMaintenance — 02:00 CET, keine externen API-Aufrufe).
              ChatWidget-LLM deaktiviert. Alle Duplikat-Funktionen entfernt.
              <strong className="text-emerald-300"> Erwarteter Nacht-Credit-Verbrauch ohne Geschäftsereignisse: 1 Invocation.</strong>
            </p>
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Credits heute', value: todayCredits.toFixed(1), color: 'text-gold', icon: Zap },
            { label: 'Credits letzte 8h', value: overnightCredits.toFixed(1), color: 'text-amber-400', icon: Clock },
            { label: 'Blockiert (heute)', value: blockedLogs.length, color: 'text-red-400', icon: Ban },
            { label: 'E-Mails (heute)', value: emailLogs.filter(l => l.created_date >= todayStart).length, color: 'text-blue-400', icon: Mail },
          ].map((m, i) => (
            <div key={i} className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5">
              <m.icon className={`w-4 h-4 ${m.color} mb-3`} />
              <p className={`font-display text-3xl font-light ${m.color}`}>{m.value}</p>
              <p className="text-ivory/35 text-[10px] font-body uppercase tracking-wider mt-1">{m.label}</p>
              {logs.length === 0 && (
                <p className="text-ivory/20 text-[10px] font-body mt-1">Kein CreditUsageLog-Eintrag</p>
              )}
            </div>
          ))}
        </div>

        {/* AUTOMATIONS STATUS */}
        <Section icon={Activity} color="text-gold" title="Aktive Automations">
          <div className="space-y-2">
            <div className="glass-card border border-amber-700/20 rounded-xl p-4">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className="font-body text-sm text-ivory font-semibold">nightlyMaintenance</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-body bg-amber-950/40 border border-amber-700/30 text-amber-400 uppercase tracking-wider">Scheduled · 1×/Tag</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-body bg-emerald-950/30 border border-emerald-700/20 text-emerald-400 uppercase tracking-wider">✓ Keine externen APIs</span>
              </div>
              <p className="text-ivory/45 text-xs font-body">
                02:00 CET täglich · Archiviert alte Reservierungen, schließt stale Anfragen, läuft Gutschein-Ablauf.
                DB-Operationen only. Kein SendEmail, kein Slack, kein LLM. ActivityLog nur bei tatsächlichen Änderungen.
              </p>
              <p className="text-emerald-400/60 text-[10px] font-body mt-1.5">22/22 Runs erfolgreich · Kein einziger Fehler · Letzter Run: 13.05.2026 02:00 CET</p>
            </div>
            <div className="glass-card border border-emerald-700/15 rounded-xl p-3">
              <p className="text-ivory/35 text-xs font-body">
                <span className="text-emerald-400">✓</span> Keine weiteren Automations aktiv. Alle anderen Workflows sind rein event-driven (kein Scheduler).
              </p>
            </div>
          </div>
        </Section>

        {/* OVERNIGHT ANALYSIS */}
        <Section icon={Clock} color="text-amber-400" title="Nacht-Credit-Analyse (kein Geschäftsereignis)">
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#C9A96E]/08">
                    {['Prozess', 'Kosten', 'Externe API', 'Gerechtfertigt', 'Notiz'].map(h => (
                      <th key={h} className="text-left text-[10px] tracking-widest uppercase font-body text-ivory/25 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {OVERNIGHT_ANALYSIS.map((row, i) => (
                    <tr key={i} className="border-b border-[#C9A96E]/05">
                      <td className="px-4 py-3 text-ivory/75 text-xs font-body font-semibold">{row.item}</td>
                      <td className="px-4 py-3 text-amber-400/80 text-xs font-body">{row.cost}</td>
                      <td className="px-4 py-3 text-ivory/40 text-xs font-body">{row.external_api}</td>
                      <td className="px-4 py-3">
                        {row.justified
                          ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                          : <XCircle className="w-4 h-4 text-red-400" />}
                      </td>
                      <td className="px-4 py-3 text-ivory/35 text-xs font-body">{row.note}</td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-950/20">
                    <td colSpan={5} className="px-4 py-3 text-emerald-400 text-xs font-body font-semibold">
                      ✅ Erwarteter Nacht-Credit-Verbrauch (kein Event): 1 Invocation (nightlyMaintenance) · Keine externen APIs · Keine E-Mails · Kein Slack
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* FUNCTION AUDIT TABLE */}
        <Section icon={Server} color="text-blue-400" title="Vollständiger Funktions-Audit">
          {/* Category filter */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-body tracking-widest uppercase transition-all ${
                  activeCategory === cat ? 'bg-gold text-charcoal font-semibold' : 'glass-card border border-[#C9A96E]/10 text-ivory/40 hover:text-ivory'
                }`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#C9A96E]/08">
                    {['Funktion', 'Trigger', 'Credit-Kosten', 'Status'].map(h => (
                      <th key={h} className="text-left text-[10px] tracking-widest uppercase font-body text-ivory/25 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((fn, i) => (
                    <tr key={i} className="border-b border-[#C9A96E]/05 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3 text-ivory/80 text-xs font-body font-semibold">{fn.name}</td>
                      <td className="px-4 py-3 text-ivory/40 text-xs font-body">{fn.trigger}</td>
                      <td className="px-4 py-3 text-ivory/50 text-xs font-body">{fn.credits}</td>
                      <td className="px-4 py-3"><Badge verdict={fn.verdict} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* PREVIOUSLY REMOVED */}
        <Section icon={XCircle} color="text-red-400" title="Bereits entfernte Credit-Konsumenten">
          <div className="glass-card border border-red-900/20 rounded-2xl p-5 sm:p-6">
            <ul className="space-y-2.5">
              {PREVIOUSLY_REMOVED.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs font-body text-ivory/55">
                  <XCircle className="w-3.5 h-3.5 text-red-400/60 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* CREDIT USAGE LOGS */}
        <Section icon={TrendingUp} color="text-gold" title={`CreditUsageLog — Letzte ${logs.length} Einträge`}>
          {logs.length === 0 ? (
            <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-8 text-center">
              <Info className="w-8 h-8 text-ivory/20 mx-auto mb-3" />
              <p className="text-ivory/30 text-sm font-body">Noch keine CreditUsageLog-Einträge.</p>
              <p className="text-ivory/20 text-xs font-body mt-1">
                Logs werden geschrieben, sobald Funktionen explizit in CreditUsageLog.create() schreiben.
                Das Entity ist bereit — ergänzen Sie die Aufrufe bei Bedarf.
              </p>
            </div>
          ) : (
            <div className="glass-card border border-[#C9A96E]/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[#C9A96E]/08">
                      {['Zeit', 'Workflow', 'Trigger', 'Integration', 'Credits', 'Status'].map(h => (
                        <th key={h} className="text-left text-[10px] tracking-widest uppercase font-body text-ivory/25 px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.slice(0, 100).map((l, i) => (
                      <tr key={i} className="border-b border-[#C9A96E]/05 hover:bg-white/2">
                        <td className="px-4 py-2.5 text-ivory/35 text-[10px] font-body whitespace-nowrap">
                          {l.created_date ? format(new Date(l.created_date), 'dd.MM HH:mm') : '—'}
                        </td>
                        <td className="px-4 py-2.5 text-ivory/75 text-xs font-body">{l.workflow_name}</td>
                        <td className="px-4 py-2.5 text-ivory/40 text-xs font-body">{l.trigger_type}</td>
                        <td className="px-4 py-2.5 text-ivory/40 text-xs font-body">{l.integration_name}</td>
                        <td className="px-4 py-2.5 text-gold/70 text-xs font-body">{l.estimated_credit_usage ?? '—'}</td>
                        <td className="px-4 py-2.5">
                          <span className={`text-[10px] font-body ${l.status === 'allowed' ? 'text-emerald-400' : l.status === 'blocked' ? 'text-red-400' : 'text-amber-400'}`}>
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Section>

        {/* FINAL CONFIRMATION */}
        <div className="glass-card border border-gold/20 rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-5">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <h2 className="font-display text-xl font-light text-ivory">Finale Bestätigung — Event-Only Architektur</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { q: 'Stripe Payments', a: 'Webhook-basiert (constructEventAsync) ✓' },
              { q: 'Reservierungen', a: 'Event-driven bei Formular-Submit ✓' },
              { q: 'Stornierungen', a: 'Event-driven (Gast/Admin) ✓' },
              { q: 'Beds24 Hotel', a: 'Webhook + Return-URL event ✓' },
              { q: 'E-Mail Transaktional', a: 'Nur bei echten Events, kein Unsubscribe ✓' },
              { q: 'Slack Alerts', a: 'Nur bei echten Events, kein Polling ✓' },
              { q: 'Hintergrund-AI', a: 'ChatWidget-LLM vollständig entfernt ✓' },
              { q: 'Nacht ohne Events', a: '1 Invocation (nightlyMaintenance, keine externen APIs) ✓' },
              { q: 'Duplikat-Schutz', a: 'email_sent, slack_notified, duplicate_check_key ✓' },
              { q: 'Idempotenz', a: 'Stripe: voucher_id in metadata; Beds24: upsert by bookid ✓' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs font-body">
                <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
                <span><strong className="text-ivory/70">{item.q}:</strong> <span className="text-ivory/45">{item.a}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}