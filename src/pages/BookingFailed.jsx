import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, Phone } from 'lucide-react';
import { useLang } from '@/lib/useLang';

const COPY = {
  de: {
    eyebrow: 'Krone Langenburg by Ammesso',
    title: 'Buchung nicht abgeschlossen',
    sub: 'Buchung konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.',
    retry: 'Erneut buchen',
    contact: 'Kontakt aufnehmen',
    or: 'oder',
    phone_label: 'Telefonisch erreichbar:',
  },
  en: {
    eyebrow: 'Krone Langenburg by Ammesso',
    title: 'Booking not completed',
    sub: 'Your booking could not be completed. Please try again or contact us directly.',
    retry: 'Try again',
    contact: 'Contact us',
    or: 'or',
    phone_label: 'Reach us by phone:',
  },
  it: {
    eyebrow: 'Krone Langenburg by Ammesso',
    title: 'Prenotazione non completata',
    sub: 'La prenotazione non è stata completata. Si prega di riprovare o contattarci direttamente.',
    retry: 'Riprova',
    contact: 'Contattaci',
    or: 'o',
    phone_label: 'Chiamaci:',
  },
};

export default function BookingFailed() {
  const { lang } = useLang();
  const c = COPY[lang] || COPY.de;

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#8B6914] text-[10px] tracking-[0.5em] uppercase font-body mb-4">{c.eyebrow}</p>

          <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714] mb-3">{c.title}</h1>
          <p className="font-body text-[#8A7A6A] text-sm leading-relaxed max-w-sm mx-auto">{c.sub}</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/rooms"
            className="flex items-center justify-center gap-2 w-full py-4 bg-[#1C1714] hover:bg-[#2A2118] text-white rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all shadow-lg">
            <RefreshCw className="w-4 h-4" /> {c.retry}
          </Link>
          <Link
            to="/contact"
            className="flex items-center justify-center gap-2 w-full py-4 border-2 border-[#C9A96E]/50 text-[#8B6914] hover:bg-[#C9A96E]/10 rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all">
            <Phone className="w-4 h-4" /> {c.contact}
          </Link>
        </div>

        {/* Phone */}
        <div className="mt-8 text-center">
          <p className="text-[#8A7A6A] text-xs font-body mb-1">{c.phone_label}</p>
          <a href="tel:+4979053390" className="text-[#1C1714] font-body text-sm font-semibold hover:text-[#8B6914] transition-colors">
            +49 7905 3390
          </a>
        </div>
      </motion.div>
    </div>
  );
}