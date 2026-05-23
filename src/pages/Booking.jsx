/**
 * /booking — Dedicated Beds24 booking page
 * Marriott-style full booking experience with iframe + fallback
 * All "Jetzt buchen" CTAs that need a standalone page can link here
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { SITE_DEFAULTS } from '@/lib/siteData';
import { ExternalLink, Phone, ArrowLeft, Shield, Star, Check, LogIn, UserCircle, X } from 'lucide-react';

export default function Booking() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [loginBannerDismissed, setLoginBannerDismissed] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(a => setIsLoggedIn(a)).catch(() => setIsLoggedIn(false));
  }, []);

  // Read URL params passed from room search
  const params = new URLSearchParams(window.location.search);
  const checkIn = params.get('checkin') || '';
  const checkOut = params.get('checkout') || '';
  const adults = params.get('adults') || '2';
  const room = params.get('room') || '';

  // Build Beds24 URL with all parameters
  const beds24Base = s.beds24_booking_url;
  const beds24Params = new URLSearchParams();
  if (lang !== 'de') beds24Params.set('lang', lang);
  if (checkIn) beds24Params.set('checkin', checkIn);
  if (checkOut) beds24Params.set('checkout', checkOut);
  if (adults) beds24Params.set('adults', adults);
  const beds24Url = `${beds24Base}&${beds24Params.toString()}`;
  const beds24IframeUrl = `${beds24Url}&iframe=1`;

  // Track booking intent
  useEffect(() => {
    base44.entities.HotelBookingIntent.create({
      intent_ref: `INT-${Date.now().toString(36).toUpperCase()}`,
      status: 'redirected_to_beds24',
      language: lang,
      source_page: 'booking',
      check_in: checkIn,
      check_out: checkOut,
      room_category_interest: room,
      beds24_booking_url_used: beds24IframeUrl,
      redirected_at: new Date().toISOString(),
    }).catch(() => {});
  }, []);

  const T = {
    de: {
      eyebrow: 'Sichere Online-Buchung',
      title: 'Zimmer buchen',
      subtitle: 'Direkt buchen — bester Preis garantiert, keine Aufpreise.',
      fallback_btn: 'Buchung in neuem Fenster öffnen',
      fallback_text: 'Falls die Buchungsmaske nicht angezeigt wird, klicken Sie hier.',
      loading: 'Buchungssystem wird geladen…',
      error_title: 'Das Buchungssystem konnte nicht geladen werden.',
      error_text: 'Bitte öffnen Sie die Buchung direkt oder rufen Sie uns an.',
      back: 'Zurück',
      trust: ['Keine Buchungsgebühren', 'Sofortige Bestätigung', 'Direktbuchung — bester Preis', 'Sicheres Bezahlen via Beds24'],
      phone_cta: 'Telefonisch buchen',
    },
    en: {
      eyebrow: 'Secure Online Booking',
      title: 'Book Your Room',
      subtitle: 'Book directly — best price guaranteed, no fees.',
      fallback_btn: 'Open booking in new window',
      fallback_text: 'If the booking form does not display, click here.',
      loading: 'Loading booking system…',
      error_title: 'The booking system could not be loaded.',
      error_text: 'Please open the booking directly or call us.',
      back: 'Back',
      trust: ['No booking fees', 'Instant confirmation', 'Direct booking — best price', 'Secure payment via Beds24'],
      phone_cta: 'Book by phone',
    },
  };
  const t = T[lang] || T.de;

  return (
    <div className="min-h-screen bg-white text-[#1C1714]">

      {/* Header band */}
      <div className="bg-[#1C1714] pt-16 sm:pt-20 pb-8 px-5">
        <div className="max-w-6xl mx-auto">
          <Link to="/rooms" className="flex items-center gap-2 text-white/40 hover:text-white/70 text-xs font-body tracking-wider uppercase mb-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {t.back}
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body mb-2">{t.eyebrow}</p>
              <h1 className="font-display text-3xl sm:text-4xl font-light text-white">{t.title}</h1>
              <p className="text-white/50 font-body text-sm mt-1">{t.subtitle}</p>
            </div>
            <a href={beds24Url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 border border-[#C9A96E]/30 text-[#C9A96E] rounded-full text-xs font-body tracking-widest uppercase hover:bg-[#C9A96E]/10 transition-colors flex-shrink-0">
              <ExternalLink className="w-3.5 h-3.5" /> {t.fallback_btn}
            </a>
          </div>

          {/* Trust strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {t.trust.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#C9A96E]/70 flex-shrink-0" />
                <span className="text-white/50 text-xs font-body">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login recommendation banner */}
      {isLoggedIn === false && !loginBannerDismissed && (
        <div className="bg-[#F2E8D0] border-b border-[#C9A96E]/30">
          <div className="max-w-6xl mx-auto px-5 py-4">
            <div className="flex items-start gap-3">
              <UserCircle className="w-5 h-5 text-[#8B6914] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[#5C4010] font-body text-sm font-semibold mb-1">
                  {lang === 'de' ? 'Mehr Service mit Konto' : lang === 'en' ? 'More with a guest account' : 'Più servizi con un account'}
                </p>
                <p className="text-[#8B6914]/70 text-xs font-body leading-relaxed mb-3">
                  {lang === 'de'
                    ? 'Melden Sie sich vorher an, damit Ihre Buchung automatisch in Ihrem Gäste-Konto erscheint.'
                    : lang === 'en'
                    ? 'Sign in before booking so your reservation appears automatically in your guest account.'
                    : 'Accedi prima di prenotare per visualizzare la tua prenotazione automaticamente nel tuo account.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#8B6914] text-white text-xs font-body font-semibold rounded-full tracking-wider uppercase transition-all">
                    <LogIn className="w-3.5 h-3.5" />
                    {lang === 'de' ? 'Einloggen' : lang === 'en' ? 'Sign In' : 'Accedi'}
                  </button>
                  <button onClick={() => setLoginBannerDismissed(true)}
                    className="px-4 py-2 border border-[#8B6914]/30 text-[#8B6914]/60 text-xs font-body rounded-full tracking-wider uppercase hover:text-[#8B6914] transition-colors">
                    {lang === 'de' ? 'Ohne Konto fortfahren' : lang === 'en' ? 'Continue without account' : 'Continua senza account'}
                  </button>
                </div>
              </div>
              <button onClick={() => setLoginBannerDismissed(true)} className="text-[#8B6914]/40 hover:text-[#8B6914] flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking widget area */}
      <div className="max-w-6xl mx-auto px-5 py-8">

        {/* Loading indicator */}
        {!iframeLoaded && !iframeError && (
          <div className="flex flex-col items-center justify-center py-20 text-[#4A3F35]/50">
            <div className="w-8 h-8 border-2 border-[#8B6914]/20 border-t-[#8B6914] rounded-full animate-spin mb-4" />
            <p className="font-body text-sm">{t.loading}</p>
          </div>
        )}

        {/* Iframe */}
        <div className={`rounded-2xl overflow-hidden border border-[#EDE6D8] shadow-sm ${iframeLoaded ? 'block' : 'hidden'}`}>
          <iframe
            src={beds24IframeUrl}
            title="Krone Langenburg — Sichere Online-Buchung via Beds24"
            className="w-full"
            style={{ minHeight: '700px', border: 'none' }}
            allow="payment"
            onLoad={() => setIframeLoaded(true)}
            onError={() => { setIframeLoaded(false); setIframeError(true); }}
          />
        </div>

        {/* Error state */}
        {iframeError && (
          <div className="bg-[#F7F3EC] border border-[#EDE6D8] rounded-2xl p-8 text-center">
            <p className="font-body text-[#1C1714] font-semibold mb-2">{t.error_title}</p>
            <p className="text-[#4A3F35]/60 text-sm font-body mb-6">{t.error_text}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={beds24Url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-full text-sm font-body font-semibold tracking-widest uppercase transition-all">
                <ExternalLink className="w-4 h-4" /> {t.fallback_btn}
              </a>
              <a href={`tel:${s.phone}`}
                className="flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-[#8B6914] text-[#8B6914] rounded-full text-sm font-body font-semibold tracking-widest uppercase hover:bg-[#F2E8D0] transition-all">
                <Phone className="w-4 h-4" /> {t.phone_cta}
              </a>
            </div>
          </div>
        )}

        {/* Always-visible fallback button below iframe */}
        {iframeLoaded && (
          <div className="mt-4 text-center">
            <a href={beds24Url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#8B6914]/70 hover:text-[#8B6914] text-sm font-body transition-colors">
              <ExternalLink className="w-4 h-4" />
              {t.fallback_btn}
            </a>
          </div>
        )}

        {/* Direct contact fallback */}
        <div className="mt-8 bg-[#F7F3EC] border border-[#EDE6D8] rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <Shield className="w-5 h-5 text-[#8B6914]/60 mx-auto mb-2" />
            <p className="text-[#1C1714] text-sm font-body font-semibold mb-1">
              {lang === 'de' ? 'Sichere Buchung' : 'Secure Booking'}
            </p>
            <p className="text-[#4A3F35]/60 text-xs font-body">
              {lang === 'de' ? 'Verschlüsselt via Beds24' : 'Encrypted via Beds24'}
            </p>
          </div>
          <div>
            <Star className="w-5 h-5 text-[#8B6914]/60 mx-auto mb-2" />
            <p className="text-[#1C1714] text-sm font-body font-semibold mb-1">
              {lang === 'de' ? 'Bester Preis' : 'Best Price'}
            </p>
            <p className="text-[#4A3F35]/60 text-xs font-body">
              {lang === 'de' ? 'Direktbucher-Garantie' : 'Direct booking guarantee'}
            </p>
          </div>
          <div>
            <Phone className="w-5 h-5 text-[#8B6914]/60 mx-auto mb-2" />
            <p className="text-[#1C1714] text-sm font-body font-semibold mb-1">
              {lang === 'de' ? 'Telefonisch buchen' : 'Book by phone'}
            </p>
            <a href={`tel:${s.phone}`} className="text-[#8B6914] text-xs font-body hover:underline">{s.phone}</a>
          </div>
        </div>
      </div>
    </div>
  );
}