import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageCircle, X, Send, Bot, User, Loader2, UtensilsCrossed, BedDouble, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_ACTIONS = [
  { icon: UtensilsCrossed, label_de: 'Tisch reservieren', label_en: 'Reserve Table', label_it: 'Prenota tavolo', action: 'reserve' },
  { icon: BedDouble, label_de: 'Zimmer buchen', label_en: 'Book Room', label_it: 'Prenota camera', action: 'book' },
  { icon: Calendar, label_de: 'Verfügbarkeit prüfen', label_en: 'Check Availability', label_it: 'Verifica disponibilità', action: 'availability' },
];

const SUGGESTED_QUESTIONS = [
  { de: 'Öffnungszeiten Restaurant?', en: 'Restaurant opening hours?', it: 'Orari ristorante?' },
  { de: 'Zimmer verfügbar?', en: 'Rooms available?', it: 'Camere disponibili?' },
  { de: 'Parkplätze vorhanden?', en: 'Parking available?', it: 'Parcheggio disponibile?' },
  { de: 'Hochzeiten & Events?', en: 'Weddings & Events?', it: 'Matrimoni ed eventi?' },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const t = {
    de: {
      greeting: 'Willkommen! 👋 Ich bin Ihr AI-Assistent für das Krone Langenburg.',
      placeholder: 'Schreiben Sie Ihre Nachricht...',
      send: 'Senden',
      quick_actions: 'Schnellaktionen',
      suggested: 'Häufige Fragen',
      typing: 'Schreibt...',
      new_chat: 'Neue Nachricht',
    },
    en: {
      greeting: 'Welcome! 👋 I\'m your AI assistant for Krone Langenburg.',
      placeholder: 'Type your message...',
      send: 'Send',
      quick_actions: 'Quick Actions',
      suggested: 'Frequently Asked Questions',
      typing: 'Typing...',
      new_chat: 'New Message',
    },
    it: {
      greeting: 'Benvenuti! 👋 Sono il vostro assistente AI per Krone Langenburg.',
      placeholder: 'Scrivi il tuo messaggio...',
      send: 'Invia',
      quick_actions: 'Azioni rapide',
      suggested: 'Domande frequenti',
      typing: 'Scrivendo...',
      new_chat: 'Nuovo messaggio',
    },
  };

  const lang = localStorage.getItem('krone_lang') || 'de';
  const c = t[lang] || t.de;

  async function startConversation() {
    try {
      const conv = await base44.agents.createConversation({
        agent_name: 'krone_assistant',
        metadata: { name: `Guest Chat - ${new Date().toLocaleDateString()}` },
      });
      setConversationId(conv.id);
      
      // Add greeting message
      setMessages([{
        role: 'assistant',
        content: c.greeting + '\n\n' + (lang === 'de' ? 'Wie kann ich Ihnen helfen?' : lang === 'en' ? 'How can I help you?' : 'Come posso aiutarvi?'),
      }]);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setMessages([{
        role: 'assistant',
        content: lang === 'de' ? 'Entschuldigung, es gab ein Problem. Bitte kontaktieren Sie uns direkt.' : lang === 'en' ? 'Sorry, there was an issue. Please contact us directly.' : 'Spiacenti, c\'è stato un problema. Contattateci direttamente.',
      }]);
    }
  }

  async function handleQuickAction(action) {
    if (!conversationId) await startConversation();
    
    const actionMessages = {
      reserve: lang === 'de' ? 'Ich möchte einen Tisch reservieren.' : lang === 'en' ? 'I want to reserve a table.' : 'Vorrei prenotare un tavolo.',
      book: lang === 'de' ? 'Ich möchte ein Zimmer buchen.' : lang === 'en' ? 'I want to book a room.' : 'Vorrei prenotare una camera.',
      availability: lang === 'de' ? 'Ich möchte die Verfügbarkeit prüfen.' : lang === 'en' ? 'I want to check availability.' : 'Vorrei verificare la disponibilità.',
    };

    setInput(actionMessages[action]);
  }

  async function sendMessage(text) {
    if (!text.trim()) return;
    
    if (!conversationId) {
      await startConversation();
    }

    // Add user message
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Get existing conversation and add message
      const conv = await base44.agents.getConversation(conversationId);
      await base44.agents.addMessage(conv, userMsg);

      // Simulate AI response (in real implementation, this would trigger the agent)
      setTimeout(() => {
        const aiMsg = {
          role: 'assistant',
          content: lang === 'de' 
            ? 'Vielen Dank für Ihre Nachricht! Unser Team wird sich innerhalb von 24 Stunden bei Ihnen melden. Für dringende Anfragen rufen Sie uns bitte an.' 
            : lang === 'en'
            ? 'Thank you for your message! Our team will get back to you within 24 hours. For urgent inquiries, please call us.'
            : 'Grazie per il vostro messaggio! Il nostro team vi risponderà entro 24 ore. Per richieste urgenti, chiamateci.',
        };
        setMessages(prev => [...prev, aiMsg]);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to send message:', error);
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) {
      await sendMessage(input);
    }
  }

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#C9A96E] hover:bg-[#B8924A] text-white rounded-full shadow-2xl flex items-center justify-center transition-colors"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-[#EDE6D8] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#1C1714] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C9A96E]/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-light">Krone Assistant</h3>
                  <p className="text-[10px] text-white/60 font-body">AI-Powered Support</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-[#FAF7F2]">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-[#C9A96E]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bot className="w-6 h-6 text-[#C9A96E]" />
                  </div>
                  <p className="text-sm text-[#5F5A52] font-body mb-4">{c.greeting}</p>
                  
                  {/* Quick actions */}
                  <div className="space-y-3">
                    <p className="text-[10px] text-[#8A7A6A] font-body uppercase tracking-wider">{c.quick_actions}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {QUICK_ACTIONS.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickAction(action.action)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#EDE6D8] rounded-lg text-xs font-body text-[#1C1714] hover:border-[#C9A96E]/50 hover:bg-[#C9A96E]/5 transition-colors"
                        >
                          <action.icon className="w-3.5 h-3.5 text-[#C9A96E]" />
                          <span>{lang === 'de' ? action.label_de : lang === 'en' ? action.label_en : action.label_it}</span>
                        </button>
                      ))}
                    </div>

                    {/* Suggested questions */}
                    <div className="mt-4">
                      <p className="text-[10px] text-[#8A7A6A] font-body uppercase tracking-wider mb-2">{c.suggested}</p>
                      <div className="space-y-1.5">
                        {SUGGESTED_QUESTIONS.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(lang === 'de' ? q.de : lang === 'en' ? q.en : q.it)}
                            className="w-full text-left px-3 py-2 bg-white border border-[#EDE6D8] rounded-lg text-xs font-body text-[#5F5A52] hover:border-[#C9A96E]/50 hover:bg-[#C9A96E]/5 transition-colors"
                          >
                            {lang === 'de' ? q.de : lang === 'en' ? q.en : q.it}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 bg-[#C9A96E]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-[#C9A96E]" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-[#1C1714] text-white rounded-br-md'
                            : 'bg-white border border-[#EDE6D8] text-[#1C1714] rounded-bl-md'
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 bg-[#5F5A52] rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 bg-[#C9A96E]/20 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-[#C9A96E]" />
                      </div>
                      <div className="bg-white border border-[#EDE6D8] rounded-2xl rounded-bl-md px-4 py-3">
                        <Loader2 className="w-4 h-4 text-[#C9A96E] animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-[#EDE6D8]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={c.placeholder}
                  className="flex-1 bg-[#FAF7F2] border border-[#EDE6D8] rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A96E]/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-[#C9A96E] hover:bg-[#B8924A] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-[#8A7A6A] font-body mt-2 text-center">
                {lang === 'de' ? 'Antworten innerhalb von 24 Stunden' : lang === 'en' ? 'Responses within 24 hours' : 'Risposte entro 24 ore'}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}