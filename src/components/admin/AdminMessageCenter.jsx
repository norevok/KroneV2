import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Mail, Send, Lock, Tag, CheckCircle, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';

const STATUS_COLORS = {
  new: 'text-gold/80 bg-gold/10 border-gold/20',
  in_progress: 'text-blue-400 bg-blue-950/30 border-blue-800/20',
  resolved: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/20',
  closed: 'text-ivory/30 bg-ivory/5 border-ivory/10',
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-medium border tracking-wider uppercase ${STATUS_COLORS[status] || 'text-ivory/40 bg-ivory/5 border-ivory/10'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

export default function AdminMessageCenter({ messages: initialMessages, loading, currentUser, onUpdate }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [expanded, setExpanded] = useState({});
  const [replyText, setReplyText] = useState({});
  const [internalNotes, setInternalNotes] = useState({});
  const [assignTo, setAssignTo] = useState({});
  const [linkRef, setLinkRef] = useState({});
  const [linkIntentId, setLinkIntentId] = useState({});
  const [saving, setSaving] = useState({});

  // Sync when parent updates
  useState(() => { setMessages(initialMessages || []); }, [initialMessages]);

  const inputCls = "w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-2 text-xs text-ivory font-body focus:outline-none focus:border-gold/30";

  async function handleAction(msgId, newStatus) {
    const guestEmail = messages.find(m => m.id === msgId)?.user_email;
    setSaving(prev => ({ ...prev, [msgId]: true }));

    const payload = {
      message_id: msgId,
      new_status: newStatus,
    };
    if (replyText[msgId]) payload.reply_text = replyText[msgId];
    if (internalNotes[msgId] !== undefined) payload.internal_notes = internalNotes[msgId];
    if (assignTo[msgId]) payload.assigned_to = assignTo[msgId];
    if (linkRef[msgId]) payload.related_reservation_ref = linkRef[msgId];
    if (linkIntentId[msgId]) payload.related_booking_intent_id = linkIntentId[msgId];

    await base44.functions.invoke('adminReplyToMessage', payload);

    const updates = {
      status: newStatus,
      staff_reply: replyText[msgId] || messages.find(m => m.id === msgId)?.staff_reply,
      staff_internal_notes: internalNotes[msgId] !== undefined ? internalNotes[msgId] : messages.find(m => m.id === msgId)?.staff_internal_notes,
      assigned_to: assignTo[msgId] || messages.find(m => m.id === msgId)?.assigned_to,
      related_reservation_ref: linkRef[msgId] || messages.find(m => m.id === msgId)?.related_reservation_ref,
      related_booking_intent_id: linkIntentId[msgId] || messages.find(m => m.id === msgId)?.related_booking_intent_id,
      replied_at: replyText[msgId] ? new Date().toISOString() : messages.find(m => m.id === msgId)?.replied_at,
    };
    if (newStatus === 'resolved') updates.resolved_at = new Date().toISOString();

    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, ...updates } : m));
    setSaving(prev => ({ ...prev, [msgId]: false }));

    // Clear draft reply
    setReplyText(prev => { const n = { ...prev }; delete n[msgId]; return n; });
    if (onUpdate) onUpdate();
  }

  async function saveInternalNotesOnly(msgId) {
    setSaving(prev => ({ ...prev, [msgId + '_notes']: true }));
    await base44.functions.invoke('adminReplyToMessage', {
      message_id: msgId,
      internal_notes: internalNotes[msgId] || '',
    });
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, staff_internal_notes: internalNotes[msgId] || '' } : m));
    setSaving(prev => ({ ...prev, [msgId + '_notes']: false }));
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  );

  if (messages.length === 0) return (
    <div className="text-center py-16 text-ivory/30 font-body text-sm">Keine Nachrichten</div>
  );

  return (
    <div className="space-y-3">
      {messages.map(msg => {
        const isOpen = expanded[msg.id];
        const isSaving = saving[msg.id];
        return (
          <div key={msg.id} className={`glass-card border rounded-xl transition-all ${isOpen ? 'border-gold/20' : 'border-[#C9A96E]/08 hover:border-[#C9A96E]/20'}`}>
            {/* Header */}
            <button
              onClick={() => setExpanded(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
              className="w-full text-left p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-body text-sm text-ivory">{msg.guest_name || msg.user_email}</span>
                  <StatusBadge status={msg.status} />
                  {msg.message_type && (
                    <span className="text-ivory/30 text-[10px] font-body uppercase tracking-widest">{msg.message_type.replace(/_/g, ' ')}</span>
                  )}
                  {msg.assigned_to && (
                    <span className="text-blue-400/60 text-[10px] font-body flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> {msg.assigned_to}
                    </span>
                  )}
                </div>
                <p className="text-ivory/50 text-xs font-body truncate">{msg.subject}</p>
                <p className="text-ivory/20 text-[10px] font-body mt-0.5">
                  {msg.user_email}
                  {msg.created_date ? ` · ${format(new Date(msg.created_date), 'dd.MM.yy HH:mm')}` : ''}
                  {msg.related_reservation_ref ? ` · Res: ${msg.related_reservation_ref}` : ''}
                </p>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4 text-ivory/30 flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-ivory/30 flex-shrink-0 mt-1" />}
            </button>

            {/* Expanded panel */}
            {isOpen && (
              <div className="border-t border-[#C9A96E]/08 px-4 pb-5 pt-4 space-y-5">

                {/* Guest message body */}
                <div>
                  <p className="text-ivory/30 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">Gästenachricht</p>
                  <p className="text-ivory/70 text-sm font-body leading-relaxed bg-[#1C1714]/40 rounded-xl px-4 py-3">{msg.body}</p>
                  {msg.staff_reply && (
                    <div className="mt-3 bg-gold/8 border border-gold/15 rounded-xl px-4 py-3">
                      <p className="text-ivory/30 text-[10px] tracking-[0.2em] uppercase font-body mb-1">Letzte Antwort</p>
                      <p className="text-ivory/80 text-sm font-body leading-relaxed">{msg.staff_reply}</p>
                      {msg.replied_at && <p className="text-ivory/25 text-[10px] font-body mt-1">{format(new Date(msg.replied_at), 'dd.MM.yy HH:mm')}</p>}
                    </div>
                  )}
                </div>

                {/* Internal notes — ADMIN ONLY */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lock className="w-3 h-3 text-gold/50" />
                    <p className="text-ivory/30 text-[10px] tracking-[0.2em] uppercase font-body">Interne Notizen (nur für Admin/Staff)</p>
                  </div>
                  <textarea
                    rows={2}
                    value={internalNotes[msg.id] !== undefined ? internalNotes[msg.id] : (msg.staff_internal_notes || '')}
                    onChange={e => setInternalNotes(prev => ({ ...prev, [msg.id]: e.target.value }))}
                    placeholder="Intern — für das Team, nie für den Gast sichtbar..."
                    className={inputCls + ' resize-none'}
                  />
                  <button
                    onClick={() => saveInternalNotesOnly(msg.id)}
                    disabled={saving[msg.id + '_notes']}
                    className="mt-1.5 text-[10px] text-gold/50 hover:text-gold font-body tracking-widest uppercase transition-colors disabled:opacity-40">
                    {saving[msg.id + '_notes'] ? '...' : '↑ Notiz speichern'}
                  </button>
                </div>

                {/* Reply to guest */}
                <div>
                  <p className="text-ivory/30 text-[10px] tracking-[0.2em] uppercase font-body mb-1.5">Antwort an Gast (löst E-Mail aus)</p>
                  <textarea
                    rows={3}
                    value={replyText[msg.id] || ''}
                    onChange={e => setReplyText(prev => ({ ...prev, [msg.id]: e.target.value }))}
                    placeholder="Nachricht an Gast — wird per E-Mail versendet..."
                    className={inputCls + ' resize-none'}
                  />
                </div>

                {/* Link + Assign in 2 cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <UserCheck className="w-3 h-3 text-ivory/30" />
                      <p className="text-ivory/30 text-[10px] tracking-[0.2em] uppercase font-body">Zuweisen an</p>
                    </div>
                    <input
                      type="email"
                      placeholder="staff@krone.de"
                      value={assignTo[msg.id] !== undefined ? assignTo[msg.id] : (msg.assigned_to || '')}
                      onChange={e => setAssignTo(prev => ({ ...prev, [msg.id]: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Tag className="w-3 h-3 text-ivory/30" />
                      <p className="text-ivory/30 text-[10px] tracking-[0.2em] uppercase font-body">Reservierungs-Ref</p>
                    </div>
                    <input
                      type="text"
                      placeholder="RES-YYYYMMDD-XXXXX"
                      value={linkRef[msg.id] !== undefined ? linkRef[msg.id] : (msg.related_reservation_ref || '')}
                      onChange={e => setLinkRef(prev => ({ ...prev, [msg.id]: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Beds24 Intent ID */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Tag className="w-3 h-3 text-ivory/30" />
                    <p className="text-ivory/30 text-[10px] tracking-[0.2em] uppercase font-body">Beds24 / Buchungs-Intent ID</p>
                  </div>
                  <input
                    type="text"
                    placeholder="HotelBookingIntent ID..."
                    value={linkIntentId[msg.id] !== undefined ? linkIntentId[msg.id] : (msg.related_booking_intent_id || '')}
                    onChange={e => setLinkIntentId(prev => ({ ...prev, [msg.id]: e.target.value }))}
                    className={inputCls}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap pt-1">
                  <button
                    onClick={() => handleAction(msg.id, 'in_progress')}
                    disabled={isSaving}
                    className="flex-1 py-2 bg-blue-900/40 border border-blue-700/30 text-blue-400 text-[10px] rounded-lg font-body hover:bg-blue-900/60 transition-colors tracking-widest uppercase disabled:opacity-40">
                    {isSaving ? '...' : '⧖ In Bearbeitung'}
                  </button>
                  <button
                    onClick={() => handleAction(msg.id, 'resolved')}
                    disabled={isSaving}
                    className="flex-1 py-2 bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 text-[10px] rounded-lg font-body hover:bg-emerald-900/60 transition-colors tracking-widest uppercase disabled:opacity-40">
                    {isSaving ? '...' : '✓ Lösen + Senden'}
                  </button>
                  <button
                    onClick={() => handleAction(msg.id, 'closed')}
                    disabled={isSaving}
                    className="flex-1 py-2 bg-ivory/5 border border-ivory/10 text-ivory/40 text-[10px] rounded-lg font-body hover:text-ivory hover:border-ivory/20 transition-colors tracking-widest uppercase disabled:opacity-40">
                    Schließen
                  </button>
                  <a href={`mailto:${msg.user_email}`}
                    className="px-3 py-2 btn-ghost-gold border rounded-lg text-[10px] font-body tracking-widest uppercase flex items-center gap-1 flex-shrink-0">
                    <Mail className="w-3 h-3" /> E-Mail
                  </a>
                </div>

                {/* Timestamps */}
                {(msg.resolved_at || msg.replied_at) && (
                  <div className="text-[10px] text-ivory/20 border-t border-ivory/8 pt-2 space-y-0.5">
                    {msg.replied_at && <p>Beantwortet: {format(new Date(msg.replied_at), 'dd.MM.yy HH:mm')}</p>}
                    {msg.resolved_at && <p>Gelöst: {format(new Date(msg.resolved_at), 'dd.MM.yy HH:mm')}</p>}
                    {msg.assigned_to && <p>Zugewiesen an: {msg.assigned_to}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}