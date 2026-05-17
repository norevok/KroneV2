import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { MessageSquare, Send, ArrowLeft, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

const REQUEST_TYPES = [
  { id: 'general_question', de: 'Allgemeine Frage', en: 'General Question', it: 'Domanda generale' },
  { id: 'arrival_time', de: 'Ankunftszeit', en: 'Arrival Time', it: 'Orario di arrivo' },
  { id: 'invoice_address', de: 'Rechnungsadresse', en: 'Invoice Address', it: 'Indirizzo fattura' },
  { id: 'room_preference', de: 'Zimmerwunsch', en: 'Room Preference', it: 'Preferenza camera' },
  { id: 'extra_bed', de: 'Zusatzbett / Kinderbett', en: 'Extra / Baby Bed', it: 'Letto extra / culla' },
  { id: 'dietary_request', de: 'Ernährungshinweis', en: 'Dietary Request', it: 'Richiesta alimentare' },
  { id: 'special_request', de: 'Sonderwunsch', en: 'Special Request', it: 'Richiesta speciale' },
];

const STATUS_INFO = {
  new: { de: 'Neu', en: 'New', it: 'Nuovo', color: 'text-gold' },
  in_progress: { de: 'In Bearbeitung', en: 'In Progress', it: 'In elaborazione', color: 'text-blue-400' },
  resolved: { de: 'Beantwortet', en: 'Resolved', it: 'Risolto', color: 'text-emerald-400' },
  closed: { de: 'Geschlossen', en: 'Closed', it: 'Chiuso', color: 'text-ivory/30' },
};

export default function GuestMessages() {
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ message_type: 'general_question', subject: '', body: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    base44.auth.isAuthenticated().then(async auth => {
      if (!auth) { base44.auth.redirectToLogin(window.location.href); return; }
      const u = await base44.auth.me();
      setUser(u);
      // Filter by user_email — guests can only see their own messages
      const msgs = await base44.entities.GuestMessage.filter({ user_email: u.email }, '-created_date', 50).catch(() => []);
      setMessages(msgs);
      setLoading(false);
    });
  }, []);

  async function handleSend(e) {
    e.preventDefault();
    if (!user) return;
    setSending(true);

    // Create message entity on frontend (single source of truth — no duplicate)
    const msg = await base44.entities.GuestMessage.create({
      user_email: user.email,
      guest_name: user.full_name || user.email,
      message_type: form.message_type,
      subject: form.subject,
      body: form.body,
      language: lang,
      status: 'new',
    });

    // Notify hotel (admin email + Slack + logs) via backend
    base44.functions.invoke('guestSendMessage', {
      message_id: msg.id,
      message_type: form.message_type,
      subject: form.subject,
      body: form.body,
      language: lang,
    }).catch(() => {});

    setMessages(prev => [msg, ...prev]);
    setForm({ message_type: 'general_question', subject: '', body: '' });
    setSent(true);
    setSending(false);
    setTimeout(() => setSent(false), 4000);
  }

  const c = {
    de: {
      title: 'Nachrichten', back: 'Zurück zum Konto', new: 'Neue Nachricht',
      type: 'Art der Anfrage', subject: 'Betreff', body: 'Ihre Nachricht',
      send: 'Senden', sent: 'Gesendet ✓', empty: 'Noch keine Nachrichten',
      reply_label: 'Antwort des Teams', no_reply: 'Noch keine Antwort — wir melden uns innerhalb von 24 Stunden.',
      your_msg: 'Ihre Nachricht',
    },
    en: {
      title: 'Messages', back: 'Back to Account', new: 'New Message',
      type: 'Request Type', subject: 'Subject', body: 'Your Message',
      send: 'Send', sent: 'Sent ✓', empty: 'No messages yet',
      reply_label: 'Team Reply', no_reply: 'No reply yet — we respond within 24 hours.',
      your_msg: 'Your Message',
    },
    it: {
      title: 'Messaggi', back: 'Torna al profilo', new: 'Nuovo messaggio',
      type: 'Tipo di richiesta', subject: 'Oggetto', body: 'Il tuo messaggio',
      send: 'Invia', sent: 'Inviato ✓', empty: 'Nessun messaggio',
      reply_label: 'Risposta del team', no_reply: 'Nessuna risposta ancora — rispondiamo entro 24 ore.',
      your_msg: 'Il tuo messaggio',
    },
  };
  const t = c[lang] || c.de;

  const inputClass = "w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-4 py-3 text-sm text-ivory font-body focus:outline-none focus:border-gold/40 transition-colors";

  if (loading) return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 sm:pt-20 pb-28 lg:pb-10 px-4 sm:px-5">
      <div className="max-w-xl mx-auto">
        <Link to="/account" className="flex items-center gap-2 text-ivory/30 hover:text-ivory text-xs font-body tracking-widest uppercase mb-6 sm:mb-8 transition-colors mt-4">
          <ArrowLeft className="w-3.5 h-3.5" /> {t.back}
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory mb-6 sm:mb-8">{t.title}</h1>

        {/* New message form */}
        <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5 sm:p-6 mb-6">
          <h2 className="text-ivory/40 text-[10px] tracking-[0.3em] uppercase font-body mb-5">{t.new}</h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.type}</label>
              <select value={form.message_type} onChange={e => setForm(f => ({ ...f, message_type: e.target.value }))} className={inputClass}>
                {REQUEST_TYPES.map(rt => (
                  <option key={rt.id} value={rt.id}>{lang === 'de' ? rt.de : lang === 'en' ? rt.en : rt.it}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.subject}</label>
              <input type="text" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className={inputClass} placeholder={lang === 'de' ? 'Kurzer Betreff...' : 'Brief subject...'} />
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.body}</label>
              <textarea rows={4} required value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} className={`${inputClass} resize-none`} placeholder={lang === 'de' ? 'Wie können wir helfen?' : 'How can we help?'} />
            </div>
            {sent && (
              <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-xl p-3 flex gap-2 text-sm text-emerald-300 font-body">
                <CheckCircle className="w-4 h-4 flex-shrink-0" /> {t.sent}
              </div>
            )}
            <button type="submit" disabled={sending}
              className="w-full py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {sending ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : <><Send className="w-3.5 h-3.5" /> {t.send}</>}
            </button>
          </form>
        </div>

        {/* Message history — guest sees only their own, no internal_notes ever shown */}
        {messages.length === 0 ? (
          <div className="glass-card border border-[#C9A96E]/08 rounded-xl p-8 text-center">
            <MessageSquare className="w-8 h-8 text-ivory/15 mx-auto mb-3" />
            <p className="text-ivory/30 text-sm font-body mb-2">{t.empty}</p>
            <p className="text-ivory/20 text-xs font-body">
              {lang === 'de' ? 'Schreiben Sie uns — wir antworten innerhalb von 24 Stunden.' : lang === 'en' ? 'Write to us — we respond within 24 hours.' : 'Scriveteci — rispondiamo entro 24 ore.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map(msg => {
              const statusInfo = STATUS_INFO[msg.status] || STATUS_INFO.new;
              const rt = REQUEST_TYPES.find(r => r.id === (msg.message_type || msg.request_type));
              const isOpen = expanded[msg.id];
              return (
                <div key={msg.id}
                  className={`glass-card border rounded-xl transition-all ${isOpen ? 'border-gold/20' : 'border-[#C9A96E]/08 hover:border-[#C9A96E]/20'}`}>
                  {/* Thread header */}
                  <button
                    onClick={() => setExpanded(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                    className="w-full text-left p-4 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-body text-sm text-ivory truncate">{msg.subject}</span>
                        <span className={`text-[10px] font-body ${statusInfo.color}`}>{statusInfo[lang] || statusInfo.de}</span>
                        {msg.staff_reply && !isOpen && (
                          <span className="text-[10px] text-emerald-400/70 border border-emerald-800/30 px-2 py-0.5 rounded-full">
                            {lang === 'de' ? '1 Antwort' : '1 Reply'}
                          </span>
                        )}
                      </div>
                      <p className="text-ivory/30 text-xs font-body">
                        {rt ? (lang === 'de' ? rt.de : lang === 'en' ? rt.en : rt.it) : ''}
                        {msg.created_date ? ` · ${format(new Date(msg.created_date), 'dd.MM.yy')}` : ''}
                      </p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-ivory/30 flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-ivory/30 flex-shrink-0 mt-0.5" />}
                  </button>

                  {/* Thread body */}
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-4 border-t border-[#C9A96E]/08 pt-4">
                      {/* Guest's original message */}
                      <div>
                        <p className="text-ivory/25 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.your_msg}</p>
                        <p className="text-ivory/60 text-sm font-body leading-relaxed bg-[#1C1714]/40 rounded-xl px-4 py-3">{msg.body}</p>
                      </div>
                      {/* Staff reply — never shows internal_notes */}
                      <div>
                        <p className="text-ivory/25 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.reply_label}</p>
                        {msg.staff_reply ? (
                          <div className="bg-gold/8 border border-gold/15 rounded-xl px-4 py-3">
                            <p className="text-ivory/80 text-sm font-body leading-relaxed">{msg.staff_reply}</p>
                            {msg.replied_at && (
                              <p className="text-ivory/25 text-[10px] font-body mt-2">
                                {format(new Date(msg.replied_at), 'dd.MM.yy HH:mm')} — Krone Langenburg Team
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-ivory/30 text-sm font-body italic">{t.no_reply}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}