import { Link, useLocation } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { UtensilsCrossed, BedDouble, Phone } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';

export default function StickyMobileCTA() {
  const { lang } = useLang();
  const location = useLocation();
  const hide = ['/reserve', '/rooms', '/book', '/admin', '/account', '/activity-log', '/dashboard', '/booking-return'].some(p => location.pathname.startsWith(p));
  if (hide) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
      style={{ boxShadow: '0 -4px 24px rgba(28,23,20,0.15)' }}
    >
      {/* gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-transparent" />
      <div className="grid grid-cols-3 bg-white border-t border-[#EDE6D8]">
        <Link to="/reserve"
          className="flex flex-col items-center justify-center gap-1.5 bg-[#8B6914] active:bg-[#7A5A0F] text-white transition-all active:scale-95"
          style={{ minHeight: 58, paddingBottom: 'max(14px, env(safe-area-inset-bottom))', paddingTop: 10 }}>
          <UtensilsCrossed className="w-4 h-4" />
          <span className="text-[9px] tracking-[0.18em] uppercase font-body font-bold leading-none">
            {lang === 'de' ? 'Reservieren' : lang === 'en' ? 'Reserve' : 'Prenota'}
          </span>
        </Link>
        <Link to="/booking"
          className="flex flex-col items-center justify-center gap-1.5 bg-white active:bg-[#F2E8D0] text-[#8B6914] border-x border-[#EDE6D8] transition-all active:scale-95"
          style={{ minHeight: 58, paddingBottom: 'max(14px, env(safe-area-inset-bottom))', paddingTop: 10 }}>
          <BedDouble className="w-4 h-4" />
          <span className="text-[9px] tracking-[0.18em] uppercase font-body font-bold leading-none">
            {lang === 'de' ? 'Buchen' : lang === 'en' ? 'Book' : 'Prenota'}
          </span>
        </Link>
        <a href={`tel:${SITE_DEFAULTS.phone}`}
          className="flex flex-col items-center justify-center gap-1.5 bg-[#1C1714] active:bg-[#2A2118] text-white transition-all active:scale-95"
          style={{ minHeight: 58, paddingBottom: 'max(14px, env(safe-area-inset-bottom))', paddingTop: 10 }}>
          <Phone className="w-4 h-4" />
          <span className="text-[9px] tracking-[0.18em] uppercase font-body font-bold leading-none">
            {lang === 'de' ? 'Anrufen' : lang === 'en' ? 'Call' : 'Chiama'}
          </span>
        </a>
      </div>
    </div>
  );
}