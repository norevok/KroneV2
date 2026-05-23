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
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-[#EDE6D8] shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="grid grid-cols-3">
        <Link to="/reserve"
          className="flex flex-col items-center justify-center gap-1 py-3.5 bg-[#8B6914] text-white text-[10px] tracking-widest uppercase font-body font-semibold active:opacity-80 transition-opacity">
          <UtensilsCrossed className="w-4 h-4" />
          {lang === 'de' ? 'Reserv.' : lang === 'en' ? 'Reserve' : 'Prenota'}
        </Link>
        <Link to="/booking"
          className="flex flex-col items-center justify-center gap-1 py-3.5 text-[#8B6914] border-x border-[#EDE6D8] text-[10px] tracking-widest uppercase font-body font-semibold bg-white hover:bg-[#F7F3EC] transition-colors">
          <BedDouble className="w-4 h-4" />
          {lang === 'de' ? 'Buchen' : lang === 'en' ? 'Book' : 'Prenota'}
        </Link>
        <a href={`tel:${SITE_DEFAULTS.phone}`}
          className="flex flex-col items-center justify-center gap-1 py-3.5 bg-[#1C1714] text-white text-[10px] tracking-widest uppercase font-body font-semibold active:opacity-80 transition-opacity">
          <Phone className="w-4 h-4" />
          {lang === 'de' ? 'Anrufen' : lang === 'en' ? 'Call' : 'Chiama'}
        </a>
      </div>
    </div>
  );
}