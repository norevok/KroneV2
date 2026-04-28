import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, BedDouble, UtensilsCrossed, Gift, Phone, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';

const QUICK_ACTIONS = {
  de: [
    { label: 'Tisch reservieren', icon: UtensilsCrossed, to: '/reserve' },
    { label: 'Zimmer buchen', icon: BedDouble, to: '/rooms' },
    { label: 'Gutschein kaufen', icon: Gift, to: '/shop' },
    { label: 'Anrufen', icon: Phone, href: 'tel:+4979054177' },
  ],
  en: [
    { label: 'Reserve a table', icon: UtensilsCrossed, to: '/reserve' },
    { label: 'Book a room', icon: BedDouble, to: '/rooms' },
    { label: 'Buy a voucher', icon: Gift, to: '/shop' },
    { label: 'Call us', icon: Phone, href: 'tel:+4979054177' },
  ],
};

const SYSTEM_PROMPT = `You are a friendly and professional AI assistant for Krone Langenburg by Ammesso, a boutique hotel and restaurant in Langenburg, Baden-Württemberg, Germany.

Key information:
- Restaurant: Kulinarium by Ammesso – Mediterranean cuisine with heart. Open Tue-Sat 12:00-14:30 & 17:30-22:00, Sunday 12:00-20:00. Monday closed.
- Hotel: 4 rooms/suites (Deluxe Single from €89, Deluxe Double from €119, Superior Suite from €159, Superior Suite 2 from €179). Direct booking via Beds24.
- Address: Hauptstraße 24, 74595 Langenburg, Germany. Phone: +49 7905 41770. Email: info@krone-ammesso.de
- Chef: Omar Ammesso – self-taught, Mediterranean passion, Hohenlohe roots.
- Vouchers/gifts available in the shop (€50, €100, €150, €250).
- Reservations: table at /reserve, hotel rooms at /rooms, gift vouchers at /shop.

Answer questions helpfully and concisely in the language the user writes in (primarily German or English). Keep answers under 3 sentences. For reservations, direct users to the relevant page. Be warm, elegant, and professional.`;

export default function ChatWidget() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = QUICK_ACTIONS[lang] || QUICK_ACTIONS.de;

  const greetings = {
    de: 'Guten Tag! Ich bin Ihr digitaler Assistent der Krone Langenburg. Wie kann ich Ihnen helfen? 🏨',
    en: 'Good day! I\'m your digital assistant at Krone Langenburg. How can I help you? 🏨',
  };

  function openChat() {
    setOpen(true);
    if (!hasGreeted) {
      setMessages([{ role: 'assistant', content: greetings[lang] || greetings.de }]);
      setHasGreeted(true);
    }
  }

  async function sendMessage(text) {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const conversation = newMessages
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `${SYSTEM_PROMPT}\n\nConversation:\n${conversation}\n\nAssistant:`,
        model: 'gpt_5_mini',
      });
      setMessages(prev => [...prev, { role: 'assistant', content: typeof res === 'string' ? res : res?.response || 'Ich stehe Ihnen gleich zur Verfügung.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: lang === 'de' ? 'Entschuldigung, ein Fehler ist aufgetreten. Rufen Sie uns gerne an: +49 7905 41770' : 'Sorry, an error occurred. Please call us: +49 7905 41770' }]);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <>
      {/* Bubble button */}
      <button
        onClick={open ? () => setOpen(false) : openChat}
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 w-14 h-14 bg-gold hover:bg-[#7A5A0F] text-white rounded-full shadow-premium flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Chat öffnen"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        {!open && messages.length === 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-40 right-4 lg:bottom-24 lg:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden"
          style={{ height: '480px' }}>

          {/* Header */}
          <div className="bg-espresso px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display text-base font-light text-ivory">Krone Langenburg</p>
              <p className="text-gold-light text-[9px] tracking-[0.3em] uppercase font-body">AI Assistent · {lang === 'de' ? 'Online' : 'Online'}</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-ivory/40 hover:text-ivory/80 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-stone-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-body leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gold text-white rounded-br-sm'
                    : 'bg-white text-charcoal border border-stone-100 shadow-sm rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions (only if no conversation yet) */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 border-t border-stone-100 flex flex-wrap gap-2 bg-white flex-shrink-0">
              {quickActions.map((action, i) => (
                action.to ? (
                  <Link key={i} to={action.to} onClick={() => setOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 hover:bg-gold-pale border border-stone-200 hover:border-gold/30 rounded-full text-[10px] font-body text-charcoal/70 hover:text-gold transition-all">
                    <action.icon className="w-3 h-3" /> {action.label}
                  </Link>
                ) : (
                  <a key={i} href={action.href}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 hover:bg-gold-pale border border-stone-200 hover:border-gold/30 rounded-full text-[10px] font-body text-charcoal/70 hover:text-gold transition-all">
                    <action.icon className="w-3 h-3" /> {action.label}
                  </a>
                )
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-stone-100 flex gap-2 bg-white flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={lang === 'de' ? 'Schreiben Sie uns…' : 'Write to us…'}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-full px-4 py-2 text-sm font-body text-charcoal placeholder-stone-400 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
              disabled={loading}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              className="w-9 h-9 bg-gold hover:bg-[#7A5A0F] disabled:bg-stone-200 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}