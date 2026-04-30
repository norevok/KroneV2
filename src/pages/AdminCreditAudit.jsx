/**
 * AdminCreditAudit — Internal admin-only page
 * Shows the post-optimization credit architecture for Krone Langenburg.
 * Route: /admin/credits
 */

import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, Zap, ArrowLeft, Info } from 'lucide-react';

const AUDIT = {
  disabled: [
    { name: 'ChatWidget LLM (InvokeLLM)', reason: 'Called InvokeLLM on EVERY user chat message — largest single credit leak. Replaced with zero-credit static FAQ + quick-links widget.' },
    { name: 'detectAnomalies function', reason: 'Not called by any automation, no scheduled trigger. Was on-demand only. Functionality visible in admin dashboard. Deleted.' },
    { name: 'syncHealthStatus function', reason: 'Admin-on-demand diagnostic. Dashboard already shows all same data. Deleted.' },
    { name: 'initializeSystemDefaults function', reason: 'One-time setup function — system is initialized. No further value. Deleted.' },
    { name: 'ensureSuperAdminRole function', reason: 'Only logged to console. Did nothing functional. Deleted.' },
    { name: 'Beds24 webhook per-event info log (HotelBookingSyncIssue)', reason: 'Created a DB record on EVERY incoming Beds24 webhook event, including routine info pings. Now only writes on real failures.' },
    { name: 'logActivity on every admin status change', reason: 'Admin page called logActivity (backend function = 1 invocation) for every single reservation status click. Removed — status changes are visible in DB.' },
    { name: 'nightlyMaintenance ActivityLog write when nothing changed', reason: 'Was writing to ActivityLog every night even when zero records were modified. Now only writes when something actually changed.' },
    { name: 'guestSendMessage raw SiteSettings fetch + direct Slack call', reason: 'Fetched SiteSettings entity and called Slack directly — now delegates to existing notifySlack function, saving the redundant DB read.' },
  ],
  retained: [
    { name: 'createReservation → SendEmail (guest + admin)', type: 'ESSENTIAL', why: 'Guest confirmation + admin alert on every new table reservation. 2 emails per reservation.' },
    { name: 'createReservation → Slack (notifySlack)', type: 'ESSENTIAL', why: 'Real-time reservation alert for front-of-house staff.' },
    { name: 'sendCancellationEmail → SendEmail', type: 'ESSENTIAL', why: 'Guest cancellation notification. Only triggered on real cancellation.' },
    { name: 'sendContactEmail → SendEmail (guest + admin)', type: 'ESSENTIAL', why: 'Contact form auto-reply + admin notification. Triggered by real form submission.' },
    { name: 'notifySlack', type: 'ESSENTIAL', why: 'Shared Slack notification function. Called only on: new reservation, cancellation, contact inquiry, booking confirmed, document upload, guest message.' },
    { name: 'beds24BookingWebhook → notifySlack', type: 'ESSENTIAL', why: 'Hotel booking confirmed via Beds24 webhook → Slack notification to staff.' },
    { name: 'beds24BookingReturnSync → notifySlack', type: 'ESSENTIAL', why: 'Guest returns from Beds24 with confirmed status → Slack notification.' },
    { name: 'stripeVoucherWebhook → SendEmail', type: 'ESSENTIAL', why: 'Voucher activation after Stripe payment. Email to purchaser + admin.' },
    { name: 'createVoucherCheckout', type: 'ESSENTIAL', why: 'Creates Stripe checkout session per purchase. On-demand only.' },
    { name: 'generateBookingToken', type: 'ESSENTIAL', why: 'Creates booking session token for logged-in users. On-demand only.' },
    { name: 'guestSendMessage → notifySlack', type: 'ESSENTIAL', why: 'Authenticated guest message → Slack alert to admin.' },
    { name: 'guestDocumentAccess (signed URL)', type: 'ESSENTIAL', why: 'Admin downloads secure document. On-demand only.' },
    { name: 'logActivity', type: 'KEPT - REDUCED', why: 'Still available for explicit admin actions (manual export, configuration changes). NOT called for routine status changes anymore.' },
    { name: 'nightlyMaintenance (scheduled, 02:00)', type: 'ESSENTIAL', why: '1 invocation/day. Archives stale records, closes old inquiries. Only writes ActivityLog when records are actually modified.' },
  ],
  architecture: [
    'Every credit-consuming invocation is now tied to a real business event.',
    'No polling, no background health checks, no recurring monitoring.',
    'No AI/LLM calls from the frontend or backend in normal operation.',
    'Slack alerts: new reservation, cancellation, contact inquiry, hotel booking confirmed, guest message.',
    'Emails: reservation confirmation (guest + admin), cancellation confirmation, contact auto-reply + admin alert, voucher purchase confirmation.',
    'One scheduled automation: nightly maintenance at 02:00 — minimal DB writes, no external calls.',
    'Beds24 integration: webhook-driven only. No polling. No status-check loops.',
  ]
};

export default function AdminCreditAudit() {
  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 sm:pt-20 pb-20 px-4 sm:px-5">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="py-8">
          <Link to="/admin" className="flex items-center gap-2 text-gold/60 hover:text-gold text-xs font-body tracking-wider mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Admin Dashboard
          </Link>
          <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-2">Krone Langenburg · Intern</p>
          <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory mb-2">Credit-Architektur</h1>
          <p className="text-ivory/40 text-sm font-body">Post-Optimierung Audit · Stand: April 2026</p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="glass-card border border-red-900/30 rounded-2xl p-5 text-center">
            <p className="font-display text-3xl font-light text-red-400 mb-1">{AUDIT.disabled.length}</p>
            <p className="text-red-400/60 text-xs font-body uppercase tracking-wider">Deaktiviert / Entfernt</p>
          </div>
          <div className="glass-card border border-emerald-800/30 rounded-2xl p-5 text-center">
            <p className="font-display text-3xl font-light text-emerald-400 mb-1">{AUDIT.retained.length}</p>
            <p className="text-emerald-400/60 text-xs font-body uppercase tracking-wider">Verbleibend (event-driven)</p>
          </div>
          <div className="glass-card border border-gold/20 rounded-2xl p-5 text-center">
            <p className="font-display text-3xl font-light text-gold mb-1">1</p>
            <p className="text-gold/60 text-xs font-body uppercase tracking-wider">Geplante Automation</p>
          </div>
        </div>

        {/* What was disabled / removed */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <h2 className="font-display text-2xl font-light text-ivory">Deaktiviert & Entfernt</h2>
          </div>
          <div className="space-y-2">
            {AUDIT.disabled.map((item, i) => (
              <div key={i} className="glass-card border border-red-900/20 rounded-xl p-4">
                <p className="text-red-300/80 text-sm font-body font-semibold mb-1">{item.name}</p>
                <p className="text-ivory/40 text-xs font-body leading-relaxed">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What remains */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <h2 className="font-display text-2xl font-light text-ivory">Verbleibende Credit-Konsumenten</h2>
          </div>
          <div className="space-y-2">
            {AUDIT.retained.map((item, i) => (
              <div key={i} className={`glass-card rounded-xl p-4 border ${item.type === 'ESSENTIAL' ? 'border-emerald-900/20' : 'border-gold/15'}`}>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="text-ivory/80 text-sm font-body font-semibold">{item.name}</p>
                  <span className={`text-[9px] font-body tracking-widest uppercase px-2 py-0.5 rounded-full flex-shrink-0 border ${
                    item.type === 'ESSENTIAL' ? 'text-emerald-400 border-emerald-800/30 bg-emerald-950/30' : 'text-gold/70 border-gold/20 bg-gold/8'
                  }`}>{item.type}</span>
                </div>
                <p className="text-ivory/40 text-xs font-body leading-relaxed">{item.why}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final architecture */}
        <div className="glass-card border border-[#C9A96E]/15 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <Zap className="w-5 h-5 text-gold flex-shrink-0" />
            <h2 className="font-display text-2xl font-light text-ivory">Ziel-Architektur</h2>
          </div>
          <ul className="space-y-3">
            {AUDIT.architecture.map((line, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-body text-ivory/60">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/50 flex-shrink-0 mt-1.5" />
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-5 border-t border-[#C9A96E]/10">
            <div className="flex items-start gap-2 text-xs font-body text-ivory/30">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>Credits werden ausschließlich für echte Geschäftsereignisse verbraucht. Keine Hintergrundprozesse, kein Polling, kein KI-Assistent im Live-Betrieb.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}