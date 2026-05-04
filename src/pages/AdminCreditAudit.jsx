/**
 * AdminCreditAudit — Internal admin-only page
 * Shows the complete post-optimization credit architecture for Krone Langenburg.
 * Route: /admin/credits
 */

import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Zap, ArrowLeft, Info, AlertTriangle, GitMerge } from 'lucide-react';

// ── AUDIT DATA ────────────────────────────────────────────────────────────────

const REMOVED = [
  {
    name: 'ChatWidget (InvokeLLM)',
    category: 'AI / LLM',
    reason: 'Called InvokeLLM on every single chat message — the largest per-interaction credit leak. Replaced with a zero-credit static FAQ + quick-link widget.',
  },
  {
    name: 'sendReservationEmail',
    category: 'Duplicate function',
    reason: 'Old confirmation sender targeting the legacy Reservation entity. createReservation already handles all confirmation emails inline. Deleted.',
  },
  {
    name: 'sendReservationConfirmation',
    category: 'Duplicate function',
    reason: 'Second duplicate confirmation sender (also targets RestaurantReservation). Superseded by createReservation inline flow. Deleted.',
  },
  {
    name: 'sendGuestMessageEmail',
    category: 'Duplicate function',
    reason: 'Exact duplicate of guestSendMessage — both sent email + Slack for guest messages. guestSendMessage retained. Deleted.',
  },
  {
    name: 'handleBookingReturn',
    category: 'Duplicate function',
    reason: 'Older Beds24 return handler using raw SiteSettings fetch + direct Slack call instead of notifySlack. handleHotelBookingReturn is the canonical version. Deleted.',
  },
  {
    name: 'detectAnomalies',
    category: 'Dead function',
    reason: 'Not called by any automation or scheduled job. Admin dashboard shows same data. Deleted.',
  },
  {
    name: 'syncHealthStatus',
    category: 'Dead function',
    reason: 'On-demand diagnostic with no automation trigger. Dashboard already shows all relevant data. Deleted.',
  },
  {
    name: 'initializeSystemDefaults',
    category: 'One-time setup',
    reason: 'System is fully initialized. No further value. Deleted.',
  },
  {
    name: 'ensureSuperAdminRole',
    category: 'Dead function',
    reason: 'Only wrote to console.log. No functional effect. Deleted.',
  },
  {
    name: 'Beds24 webhook per-event HotelBookingSyncIssue write',
    category: 'Background DB spam',
    reason: 'Was creating a DB record on every incoming Beds24 ping including routine info events. Now only writes on genuine processing failures.',
  },
  {
    name: 'logActivity on every admin status change',
    category: 'Redundant function call',
    reason: 'Admin panel was invoking logActivity (= 1 backend invocation credit) for every reservation status click. Removed — status changes are immediately visible in the DB.',
  },
  {
    name: 'nightlyMaintenance ActivityLog write on no-op runs',
    category: 'Redundant DB write',
    reason: 'Was writing to ActivityLog every single night even when zero records were modified. Now only writes when something actually changed.',
  },
  {
    name: 'guestSendMessage raw SiteSettings fetch + direct Slack call',
    category: 'Redundant DB read',
    reason: 'Was fetching SiteSettings entity then calling Slack directly. Now delegates to notifySlack function, eliminating the extra entity read.',
  },
];

const RETAINED = [
  {
    name: 'createReservation → SendEmail (guest + admin)',
    trigger: 'Guest submits reservation form',
    cost: '2 emails per reservation',
    why: 'Essential transactional: guest confirmation + immediate admin alert. No alternative.',
  },
  {
    name: 'createReservation → notifySlack',
    trigger: 'Guest submits reservation form',
    cost: '1 Slack message per reservation',
    why: 'Real-time alert for front-of-house team. Essential operational flow.',
  },
  {
    name: 'sendCancellationEmail → SendEmail',
    trigger: 'Reservation cancelled (guest or admin)',
    cost: '1 email per cancellation',
    why: 'Essential transactional: guest must receive cancellation confirmation.',
  },
  {
    name: 'sendContactEmail → SendEmail (guest auto-reply + admin alert)',
    trigger: 'Contact form submitted',
    cost: '2 emails per submission',
    why: 'Essential: guest gets acknowledgement, admin gets instant notification.',
  },
  {
    name: 'notifySlack (contact inquiry)',
    trigger: 'Contact form submitted',
    cost: '1 Slack message',
    why: 'Instant team notification for new inquiry.',
  },
  {
    name: 'guestSendMessage → notifySlack + email',
    trigger: 'Authenticated guest sends message',
    cost: '1 email + 1 Slack per message',
    why: 'Internal team alert for guest communication. Fully event-driven.',
  },
  {
    name: 'beds24BookingWebhook → notifySlack',
    trigger: 'Beds24 sends confirmed booking webhook',
    cost: '1 Slack for new confirmed bookings only',
    why: 'Hotel booking confirmed — staff needs immediate notification.',
  },
  {
    name: 'handleHotelBookingReturn → notifySlack',
    trigger: 'Guest returns from Beds24 checkout',
    cost: '1 Slack per return event',
    why: 'Real booking lifecycle event. Staff needs to know outcome.',
  },
  {
    name: 'stripeVoucherWebhook → SendEmail (purchaser + admin)',
    trigger: 'Stripe payment completed',
    cost: '2 emails per voucher sold',
    why: 'Essential transactional: voucher delivery + admin revenue notification.',
  },
  {
    name: 'createVoucherCheckout',
    trigger: 'Guest purchases voucher',
    cost: '1 invocation per purchase attempt',
    why: 'Stripe session creation. Required for payment flow.',
  },
  {
    name: 'generateBookingToken',
    trigger: 'Guest initiates hotel booking',
    cost: '1 invocation per booking start',
    why: 'Account linking session token for Beds24 redirect. Required.',
  },
  {
    name: 'resendConfirmationEmail',
    trigger: 'Admin manually clicks resend',
    cost: '1 email on admin action only',
    why: 'Manual admin tool. Never runs automatically.',
  },
  {
    name: 'guestDocumentAccess (signed URL)',
    trigger: 'Admin downloads document',
    cost: '1 invocation on admin action only',
    why: 'On-demand secure file access. Never runs automatically.',
  },
  {
    name: 'nightlyMaintenance (scheduled 02:00 CET)',
    trigger: 'Scheduled: once per day',
    cost: '1 invocation/night + DB writes only when records change',
    why: 'Cleans up stale records. Conditional ActivityLog write. No emails, no Slack, no external calls.',
  },
  {
    name: 'validateReservation',
    trigger: 'Reserve page: on-demand validation',
    cost: '1 invocation per validation call (DB reads only)',
    why: 'Server-side capacity + duplicate check before form submit. No external integrations called.',
  },
  {
    name: 'adminGetReservations / adminUpdateReservation / adminUpdateReservationStatus',
    trigger: 'Admin actions only',
    cost: 'DB operations only — no integration credits',
    why: 'Internal admin operations. No email/Slack/LLM triggered.',
  },
  {
    name: 'getReservationAvailability / getAvailableTimes / getReservationTimeSlots',
    trigger: 'Reserve page date/time selection',
    cost: 'DB reads only — no integration credits',
    why: 'Read-only capacity checks. No external calls.',
  },
];

const ARCHITECTURE = [
  'Every integration credit is tied to a real business event with a human actor.',
  'Zero scheduled automations that call external APIs. The one nightly job does DB cleanup only.',
  'Zero AI/LLM usage in production operation (ChatWidget replaced with static FAQ).',
  'Zero duplicate notification chains — each event triggers exactly one email flow and one Slack message.',
  'Zero polling loops — all hotel booking sync is webhook-driven via Beds24.',
  'Zero "monitoring only" automations — admin dashboard provides all visibility without recurring jobs.',
  'Dead and duplicate backend functions removed: 9 functions deleted in total.',
  'Remaining 1 scheduled automation (nightlyMaintenance): 1 invocation/night, conditional DB write, no external API calls.',
  'All transactional emails: no unsubscribe links, no marketing footers.',
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

function Section({ icon: Icon, color, title, children }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
        <h2 className="font-display text-2xl font-light text-ivory">{title}</h2>
      </div>
      {children}
    </div>
  );
}

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
          <p className="text-ivory/40 text-sm font-body">Vollständiger Audit nach Optimierung · Stand: Mai 2026</p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="glass-card border border-red-900/30 rounded-2xl p-5 text-center">
            <p className="font-display text-3xl font-light text-red-400 mb-1">{REMOVED.length}</p>
            <p className="text-red-400/60 text-[10px] font-body uppercase tracking-wider">Entfernt / Deaktiviert</p>
          </div>
          <div className="glass-card border border-emerald-800/30 rounded-2xl p-5 text-center">
            <p className="font-display text-3xl font-light text-emerald-400 mb-1">{RETAINED.length}</p>
            <p className="text-emerald-400/60 text-[10px] font-body uppercase tracking-wider">Verbleibend (event-driven)</p>
          </div>
          <div className="glass-card border border-gold/20 rounded-2xl p-5 text-center">
            <p className="font-display text-3xl font-light text-gold mb-1">1</p>
            <p className="text-gold/60 text-[10px] font-body uppercase tracking-wider">Geplante Automation</p>
          </div>
        </div>

        {/* Removed */}
        <Section icon={XCircle} color="text-red-400" title="Entfernt & Deaktiviert">
          <div className="space-y-2">
            {REMOVED.map((item, i) => (
              <div key={i} className="glass-card border border-red-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-red-300/90 text-sm font-body font-semibold">{item.name}</p>
                  <span className="text-[9px] px-2 py-0.5 rounded-full border border-red-900/30 bg-red-950/30 text-red-400/70 font-body uppercase tracking-wider">{item.category}</span>
                </div>
                <p className="text-ivory/40 text-xs font-body leading-relaxed">{item.reason}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Retained */}
        <Section icon={CheckCircle} color="text-emerald-400" title="Verbleibende Credit-Konsumenten">
          <div className="space-y-2">
            {RETAINED.map((item, i) => (
              <div key={i} className="glass-card border border-[#C9A96E]/08 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="text-ivory/80 text-sm font-body font-semibold">{item.name}</p>
                </div>
                <p className="text-ivory/35 text-xs font-body mb-1.5">
                  <span className="text-gold/50">Trigger:</span> {item.trigger}
                </p>
                <p className="text-ivory/35 text-xs font-body mb-1.5">
                  <span className="text-gold/50">Kosten:</span> {item.cost}
                </p>
                <p className="text-ivory/50 text-xs font-body leading-relaxed">{item.why}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Final architecture */}
        <Section icon={Zap} color="text-gold" title="Ziel-Architektur">
          <div className="glass-card border border-[#C9A96E]/15 rounded-2xl p-6 sm:p-8">
            <ul className="space-y-3">
              {ARCHITECTURE.map((line, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-body text-ivory/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/50 flex-shrink-0 mt-1.5" />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-[#C9A96E]/10 flex items-start gap-2 text-xs font-body text-ivory/25">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>Credits werden ausschließlich für echte Geschäftsereignisse mit einem menschlichen Akteur verbraucht. Keine Hintergrundprozesse, kein Polling, kein KI-Assistent im Live-Betrieb.</span>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}