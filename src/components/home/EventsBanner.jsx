/**
 * EventsBanner — Professioneller, animierter Top-Banner
 * "Special Events kommen bald" — scrollend/laufend
 */
import { motion } from 'framer-motion';
import { Sparkles, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const ITEMS = [
  { icon: Calendar, de: '🎶 6. Juni · Live-Band & Gala-Dinner · Krone Langenburg', en: '🎶 June 6th · Live Band & Gala Dinner · Krone Langenburg', it: '🎶 6 Giugno · Live Band & Gala Dinner · Krone Langenburg' },
  { icon: Sparkles, de: '🍽 I Genio per 2 · Live-Musik ab 18:00 Uhr · Ab 21:00 tanzen', en: '🍽 I Genio per 2 · Live Music from 6pm · Dancing from 9pm', it: '🍽 I Genio per 2 · Musica dal vivo dalle 18:00' },
  { icon: Star,     de: '✨ 5-Gang-Menü · Fisch · Fleisch · Vegetarisch · Überraschungsmenü', en: '✨ 5-Course Menu · Fish · Meat · Vegetarian · Chef\'s Surprise', it: '✨ Menù 5 portate · Pesce · Carne · Vegetariano · Sorpresa' },
  { icon: Calendar, de: '🎶 6. Juni · Live-Band & Gala-Dinner · Krone Langenburg', en: '🎶 June 6th · Live Band & Gala Dinner · Krone Langenburg', it: '🎶 6 Giugno · Live Band & Gala Dinner · Krone Langenburg' },
  { icon: Sparkles, de: '🍽 I Genio per 2 · Live-Musik ab 18:00 Uhr · Ab 21:00 tanzen', en: '🍽 I Genio per 2 · Live Music from 6pm · Dancing from 9pm', it: '🍽 I Genio per 2 · Musica dal vivo dalle 18:00' },
  { icon: Star,     de: '✨ 5-Gang-Menü · Fisch · Fleisch · Vegetarisch · Überraschungsmenü', en: '✨ 5-Course Menu · Fish · Meat · Vegetarian · Chef\'s Surprise', it: '✨ Menù 5 portate · Pesce · Carne · Vegetariano · Sorpresa' },
  { icon: Calendar, de: '🎶 6. Juni · Live-Band & Gala-Dinner · Krone Langenburg', en: '🎶 June 6th · Live Band & Gala Dinner · Krone Langenburg', it: '🎶 6 Giugno · Live Band & Gala Dinner · Krone Langenburg' },
  { icon: Sparkles, de: '🍽 I Genio per 2 · Live-Musik ab 18:00 Uhr · Ab 21:00 tanzen', en: '🍽 I Genio per 2 · Live Music from 6pm · Dancing from 9pm', it: '🍽 I Genio per 2 · Musica dal vivo dalle 18:00' },
];

export default function EventsBanner({ lang = 'de' }) {
  return (
    <Link to="/events" className="block overflow-hidden bg-[#1C1714] border-b border-[#C9A96E]/20 relative group cursor-pointer">
      {/* Gold shimmer line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/60 to-transparent" />

      {/* Scrolling ticker */}
      <div className="py-2.5 relative overflow-hidden">
        <motion.div
          className="flex gap-0 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            const text = lang === 'en' ? item.en : lang === 'it' ? item.it : item.de;
            return (
              <span key={i} className="inline-flex items-center gap-2.5 px-8 text-[11px] font-body font-semibold tracking-[0.18em] uppercase text-[#C9A96E]/80 group-hover:text-[#C9A96E] transition-colors flex-shrink-0">
                <Icon className="w-3 h-3 text-[#C9A96E]/60 flex-shrink-0" />
                {text}
                <span className="text-[#C9A96E]/25 mx-2">✦</span>
              </span>
            );
          })}
        </motion.div>
      </div>

      {/* Gold shimmer line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />
    </Link>
  );
}