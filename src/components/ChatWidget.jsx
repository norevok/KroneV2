/**
 * ChatWidget — STATIC FAQ version (no LLM / no integration credits)
 *
 * CREDIT OPTIMIZATION: Previously called InvokeLLM on every message.
 * Replaced with a static FAQ + quick-link widget that consumes ZERO credits.
 * If AI chat is needed in future, it must be explicitly re-enabled by admin.
 */

import { useState } from 'react';
import { MessageCircle, X, UtensilsCrossed, BedDouble, Gift, Phone, ChevronRight } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import { Link } from 'react-router-dom';

const QUICK_LINKS = {
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

const FAQ = {
  de: [
    { q: 'Wann ist das Restaurant geöffnet?', a: 'Di–Sa: 12:00–14:30 & 17:30–22:00 · So: 12:00–20:00 · Montag Ruhetag.' },
    { q: 'Wie kann ich reservieren?', a: 'Online über unser Reservierungsformular oder telefonisch unter +49 7905 41770.' },
    { q: 'Gibt es Parkplätze?', a: 'Ja, direkt am Hotel stehen Parkplätze zur Verfügung — kostenlos für Gäste.' },
    { q: 'Kann ich ein Zimmer direkt buchen?', a: 'Ja — direkt über unsere Website zum besten Preis, ohne Buchungsgebühren.' },
    { q: 'Bieten Sie Frühstück an?', a: 'Ja, Frühstück auf Anfrage für €14 pro Person.' },
    { q: 'Sind Haustiere erlaubt?', a: 'Bitte kontaktieren Sie uns direkt unter info@krone-ammesso.de.' },
  ],
  en: [
    { q: 'When is the restaurant open?', a: 'Tue–Sat: 12:00–14:30 & 17:30–22:00 · Sun: 12:00–20:00 · Monday closed.' },
    { q: 'How can I make a reservation?', a: 'Online via our reservation form or by phone at +49 7905 41770.' },
    { q: 'Is parking available?', a: 'Yes, parking is available directly at the hotel — free for guests.' },
    { q: 'Can I book a room directly?', a: 'Yes — directly via our website at the best rate, no booking fees.' },
    { q: 'Do you offer breakfast?', a: 'Yes, breakfast on request for €14 per person.' },
    { q: 'Are pets allowed?', a: 'Please contact us directly at info@krone-ammesso.de.' },
  ],
};

export default function ChatWidget() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const links = QUICK_LINKS[lang] || QUICK_LINKS.de;
  const faqs = FAQ[lang] || FAQ.de;

  return (
    <>
      {/* Bubble button */}
      <button
        onClick={() => setOpen(p => !p)}
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 w-14 h-14 bg-gold hover:bg-[#7A5A0F] text-white rounded-full shadow-premium flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Hilfe"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-40 right-4 lg:bottom-24 lg:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden" style={{ height: '500px' }}>

          {/* Header */}
          <div className="bg-espresso px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display text-base font-light text-ivory">Krone Langenburg</p>
              <p className="text-gold-light text-[9px] tracking-[0.3em] uppercase font-body">
                {lang === 'de' ? 'Hilfe & Kontakt' : 'Help & Contact'}
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-ivory/40 hover:text-ivory/80 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">

            {/* Quick links */}
            <div className="px-4 pt-4 pb-3 border-b border-stone-100">
              <p className="text-[9px] tracking-[0.3em] uppercase font-body text-charcoal/30 mb-3">
                {lang === 'de' ? 'Schnellzugriff' : 'Quick Access'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {links.map((action, i) =>
                  action.to ? (
                    <Link key={i} to={action.to} onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 bg-stone-50 hover:bg-gold-pale border border-stone-200 hover:border-gold/30 rounded-xl text-xs font-body text-charcoal/70 hover:text-gold transition-all">
                      <action.icon className="w-3.5 h-3.5 flex-shrink-0" /> {action.label}
                    </Link>
                  ) : (
                    <a key={i} href={action.href}
                      className="flex items-center gap-2 px-3 py-2.5 bg-stone-50 hover:bg-gold-pale border border-stone-200 hover:border-gold/30 rounded-xl text-xs font-body text-charcoal/70 hover:text-gold transition-all">
                      <action.icon className="w-3.5 h-3.5 flex-shrink-0" /> {action.label}
                    </a>
                  )
                )}
              </div>
            </div>

            {/* FAQ */}
            <div className="px-4 py-3">
              <p className="text-[9px] tracking-[0.3em] uppercase font-body text-charcoal/30 mb-3">
                {lang === 'de' ? 'Häufige Fragen' : 'Frequently Asked'}
              </p>
              <div className="space-y-1.5">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-stone-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-stone-50 transition-colors"
                    >
                      <span className="text-xs font-body text-charcoal/75 font-medium leading-tight">{faq.q}</span>
                      <ChevronRight className={`w-3.5 h-3.5 text-charcoal/30 flex-shrink-0 transition-transform ${expandedFaq === i ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedFaq === i && (
                      <div className="px-3 pb-3 text-xs font-body text-charcoal/60 leading-relaxed border-t border-stone-100 pt-2">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact strip */}
            <div className="px-4 pb-4">
              <a href="mailto:info@krone-ammesso.de"
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-stone-200 rounded-xl text-xs font-body text-charcoal/50 hover:text-gold hover:border-gold/30 transition-all">
                info@krone-ammesso.de
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}