import { MapPin, Navigation } from 'lucide-react';
import { useLang } from '@/lib/useLang';

const MAPS_URL = 'https://maps.app.goo.gl/GF5S8i2vASmpA7jUA';
const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2604.2316221936717!2d9.8452029!3d49.2530556!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47985de90735ea63%3A0x86445a21b13205c1!2sKrone%20Langenburg%20by%20Ammesso!5e0!3m2!1sde!2sth!4v1779880134107!5m2!1sde!2sth';

const COPY = {
  de: {
    eyebrow: 'Direkt im Herzen von Langenburg',
    route: 'Route starten',
    open: 'Auf Google Maps öffnen',
    fallback: 'Krone Langenburg by Ammesso auf Google Maps öffnen',
    addr_label: 'Adresse',
  },
  en: {
    eyebrow: 'Right in the heart of Langenburg',
    route: 'Get Directions',
    open: 'Open in Google Maps',
    fallback: 'Open Krone Langenburg by Ammesso on Google Maps',
    addr_label: 'Address',
  },
  it: {
    eyebrow: 'Nel cuore di Langenburg',
    route: 'Avvia navigazione',
    open: 'Apri su Google Maps',
    fallback: 'Apri Krone Langenburg by Ammesso su Google Maps',
    addr_label: 'Indirizzo',
  },
};

export default function KroneLocationSection({ compact = false, darkBg = false }) {
  const { lang } = useLang();
  const t = COPY[lang] || COPY.de;

  const bg = darkBg ? 'bg-[#241A16] border-[#C9A96E]/20' : 'bg-white border-[#EDE6D8]';
  const textPrimary = darkBg ? 'text-white' : 'text-[#1C1714]';
  const textSecondary = darkBg ? 'text-white/60' : 'text-[#4A3F35]';
  const eyebrowColor = darkBg ? 'text-[#C9A96E]' : 'text-[#8B6914]';

  return (
    <div className={`rounded-2xl overflow-hidden border ${bg} shadow-lg`}>
      {/* Embedded Map */}
      <div className="relative w-full" style={{ paddingBottom: compact ? '45%' : '56%', minHeight: compact ? 200 : 280 }}>
        <iframe
          title="Google Maps Karte – Krone Langenburg by Ammesso"
          src={MAPS_EMBED}
          width="100%"
          height="100%"
          style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Fallback overlay — shown only if iframe fails (no JS error, just a link behind) */}
        <noscript>
          <div className="absolute inset-0 flex items-center justify-center bg-[#EDE6D8]">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
              className="text-[#8B6914] underline text-sm font-body">
              {t.fallback}
            </a>
          </div>
        </noscript>
      </div>

      {/* Address + Buttons */}
      <div className={`p-5 sm:p-6 ${darkBg ? '' : ''}`}>
        <p className={`${eyebrowColor} text-[10px] tracking-[0.4em] uppercase font-body mb-3`}>{t.eyebrow}</p>
        <div className="flex items-start gap-2 mb-5">
          <MapPin className={`w-4 h-4 ${eyebrowColor} flex-shrink-0 mt-0.5`} />
          <address className={`not-italic text-sm font-body leading-relaxed ${textSecondary}`}>
            <strong className={`${textPrimary} font-semibold`}>Krone Langenburg by Ammesso</strong><br />
            Hauptstraße 24<br />
            74595 Langenburg<br />
            Deutschland
          </address>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-xl text-xs tracking-[0.15em] uppercase font-body font-bold transition-all shadow-md hover:-translate-y-px">
            <Navigation className="w-3.5 h-3.5" />
            {t.route}
          </a>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 rounded-xl text-xs tracking-[0.15em] uppercase font-body font-semibold transition-all hover:-translate-y-px ${
              darkBg
                ? 'border-[#C9A96E]/40 text-[#C9A96E] hover:border-[#C9A96E] hover:bg-[#C9A96E]/10'
                : 'border-[#8B6914]/30 text-[#8B6914] hover:border-[#8B6914] hover:bg-[#8B6914]/5'
            }`}>
            <MapPin className="w-3.5 h-3.5" />
            {t.open}
          </a>
        </div>
      </div>
    </div>
  );
}