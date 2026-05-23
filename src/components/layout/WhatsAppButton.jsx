/**
 * WhatsAppButton — REMOVED per project requirements.
 * No WhatsApp anywhere in this app.
 * Replaced with a phone call button.
 */
import { SITE_DEFAULTS } from '@/lib/siteData';
import { useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';

export default function PhoneButton() {
  const location = useLocation();
  const hide = ['/admin', '/account', '/reserve'].some(p => location.pathname.startsWith(p));
  if (hide) return null;

  return (
    <a href={`tel:${SITE_DEFAULTS.phone}`}
      aria-label={`Anrufen: ${SITE_DEFAULTS.phone}`}
      className="hidden lg:flex fixed bottom-24 right-6 z-40 items-center justify-center bg-[#1C1714] hover:bg-[#2A2118] rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
      style={{ width: 52, height: 52 }}>
      <Phone className="w-5 h-5 text-[#C9A96E]" />
    </a>
  );
}