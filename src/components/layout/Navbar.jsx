import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, LayoutDashboard, UserCircle, UtensilsCrossed, BedDouble, HelpCircle } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];
const FLAG = { de: '🇩🇪', en: '🇬🇧', it: '🇮🇹', es: '🇪🇸' };
const LANG_LABEL = { de: 'Deutsch', en: 'English', it: 'Italiano', es: 'Español' };

const NAV_LINKS = {
  de: [
    { to: '/booking', label: 'Suchen & Reservieren' },
    { to: '/rooms', label: 'Zimmer & Suiten' },
    { to: '/offers', label: 'Angebote' },
    { to: '/restaurant', label: 'Restaurant + Bar' },
    { to: '/weddings', label: 'Events & Feiern' },
    { to: '/story', label: 'Unsere Geschichte' },
    { to: '/discover', label: 'Entdecken' },
    { to: '/contact', label: 'Kontakt' },
  ],
  en: [
    { to: '/booking', label: 'Search & Book' },
    { to: '/rooms', label: 'Rooms & Suites' },
    { to: '/offers', label: 'Offers' },
    { to: '/restaurant', label: 'Restaurant + Bar' },
    { to: '/weddings', label: 'Events & Celebrations' },
    { to: '/story', label: 'Our Story' },
    { to: '/discover', label: 'Discover' },
    { to: '/contact', label: 'Contact' },
  ],
  it: [
    { to: '/booking', label: 'Cerca & Prenota' },
    { to: '/rooms', label: 'Camere & Suite' },
    { to: '/offers', label: 'Offerte' },
    { to: '/restaurant', label: 'Ristorante + Bar' },
    { to: '/weddings', label: 'Events & Feste' },
    { to: '/story', label: 'La Nostra Storia' },
    { to: '/discover', label: 'Scopri' },
    { to: '/contact', label: 'Contatti' },
  ],
  es: [
    { to: '/booking', label: 'Buscar & Reservar' },
    { to: '/rooms', label: 'Habitaciones & Suites' },
    { to: '/offers', label: 'Ofertas' },
    { to: '/restaurant', label: 'Restaurante + Bar' },
    { to: '/weddings', label: 'Eventos & Celebraciones' },
    { to: '/story', label: 'Nuestra Historia' },
    { to: '/discover', label: 'Descubrir' },
    { to: '/contact', label: 'Contacto' },
  ],
};

export default function Navbar() {
  const { lang, setLang, supported } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u) {
        setIsLoggedIn(true);
        setUserName(u.full_name || u.email?.split('@')[0] || '');
        if (ADMIN_EMAILS.includes(u.email) || u.role === 'admin') setIsAdmin(true);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setLangOpen(false); }, [location]);

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;
  const navLinks = NAV_LINKS[lang] || NAV_LINKS.de;

  return (
    <>
      {/* ── TOP UTILITY BAR ── */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent ? 'bg-black/40 backdrop-blur-sm border-b border-white/10' : 'bg-[#1C1714] border-b border-[#C9A96E]/10'
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-end h-9 gap-4">

            {/* Help */}
            <Link to="/contact"
              className="hidden sm:flex items-center gap-1 text-white/50 hover:text-white/80 text-[11px] font-body tracking-wider transition-colors">
              <HelpCircle className="w-3 h-3" />
              {lang === 'de' ? 'Hilfe' : lang === 'en' ? 'Help' : 'Aiuto'}
            </Link>

            <div className="hidden sm:block h-3 w-px bg-white/20" />

            {/* Language selector */}
            <div className="relative">
              <button onClick={() => setLangOpen(p => !p)}
                className="flex items-center gap-1 text-white/50 hover:text-white/80 text-[11px] font-body tracking-wider transition-colors">
                <span>{FLAG[lang]}</span>
                <span className="hidden sm:inline">{LANG_LABEL[lang]}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#EDE6D8] rounded-xl shadow-xl py-1 min-w-[120px] z-50">
                  {supported.map(l => (
                    <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors hover:bg-[#F7F3EC] ${lang === l ? 'text-[#8B6914] font-semibold' : 'text-[#1C1714]/60'}`}>
                      <span>{FLAG[l]}</span>
                      <span>{LANG_LABEL[l]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:block h-3 w-px bg-white/20" />

            {/* My Trips */}
            <Link to="/account"
              className="hidden sm:flex items-center gap-1 text-white/50 hover:text-white/80 text-[11px] font-body tracking-wider transition-colors">
              {lang === 'de' ? 'Meine Reisen' : lang === 'en' ? 'My Trips' : 'I miei viaggi'}
            </Link>

            <div className="hidden sm:block h-3 w-px bg-white/20" />

            {/* Sign in / Account */}
            {isLoggedIn ? (
              <Link to="/account"
                className="flex items-center gap-1 text-[#C9A96E] hover:text-[#E8C07E] text-[11px] font-body tracking-wider font-medium transition-colors">
                <UserCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline max-w-[100px] truncate">{userName}</span>
              </Link>
            ) : (
              <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
                className="flex items-center gap-1 text-white/50 hover:text-[#C9A96E] text-[11px] font-body tracking-wider transition-colors">
                <UserCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {lang === 'de' ? 'Einloggen oder Mitglied werden' : lang === 'en' ? 'Sign In or Join' : 'Accedi o Iscriviti'}
                </span>
              </button>
            )}

            {isAdmin && (
              <>
                <div className="hidden sm:block h-3 w-px bg-white/20" />
                <Link to="/admin"
                  className="hidden sm:flex items-center gap-1 text-[#C9A96E]/60 hover:text-[#C9A96E] text-[11px] font-body tracking-wider transition-colors">
                  <LayoutDashboard className="w-3 h-3" /> Admin
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN NAV BAR ── */}
      <nav className={`fixed top-9 left-0 right-0 z-49 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent border-b border-white/10'
          : 'bg-white border-b border-[#EDE6D8] shadow-sm'
      }`} style={{ zIndex: 49 }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">

            {/* Logo */}
            <Link to="/" className="flex flex-col leading-none group flex-shrink-0">
              <span className={`font-display text-base sm:text-lg font-light tracking-[0.12em] uppercase transition-colors ${isTransparent ? 'text-white' : 'text-[#1C1714]'}`}>
                Krone Langenburg
              </span>
              <span className={`text-[10px] tracking-[0.3em] uppercase font-body font-semibold transition-colors ${isTransparent ? 'text-[#C9A96E]' : 'text-[#8B6914]'}`}>
                by Ammesso
              </span>
            </Link>

            {/* Desktop center nav — scrollable */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-7 overflow-x-auto no-scrollbar flex-1 justify-center px-4">
              {navLinks.map((l, i) => {
                const isActive = location.pathname === l.to && i > 0;
                return (
                  <Link key={`${l.to}-${i}`} to={l.to}
                    className={`relative font-body text-[10px] xl:text-[11px] tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-200 group pb-1 flex-shrink-0 ${
                      isActive
                        ? (isTransparent ? 'text-[#C9A96E]' : 'text-[#8B6914]')
                        : (isTransparent ? 'text-white/75 hover:text-white' : 'text-[#1C1714]/55 hover:text-[#1C1714]')
                    }`}>
                    {l.label}
                    <span className={`absolute bottom-0 left-0 h-px transition-all duration-300 ${
                      isActive
                        ? `right-0 ${isTransparent ? 'bg-[#C9A96E]' : 'bg-[#8B6914]'}`
                        : `right-full group-hover:right-0 ${isTransparent ? 'bg-[#C9A96E]/60' : 'bg-[#8B6914]/50'}`
                    }`} />
                  </Link>
                );
              })}
            </div>

            {/* Right: Book Now CTA + mobile toggle */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/booking"
                className={`hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-body font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-px ${
                  isTransparent
                    ? 'bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] shadow-[0_4px_16px_rgba(201,169,110,0.35)]'
                    : 'bg-[#17352C] hover:bg-[#0F2920] text-white shadow-[0_4px_16px_rgba(23,53,44,0.25)]'
                }`}>
                <BedDouble className="w-3.5 h-3.5" />
                {lang === 'de' ? 'Jetzt buchen' : lang === 'en' ? 'Book Now' : lang === 'es' ? 'Reservar' : 'Prenota'}
              </Link>
              <Link to="/reserve"
                className={`hidden xl:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-body font-semibold transition-all border ${
                  isTransparent
                    ? 'border-white/40 text-white/80 hover:bg-white/12 hover:text-white hover:border-white/60'
                    : 'border-[#8B6914]/30 text-[#8B6914] hover:border-[#8B6914] hover:bg-[#F2E8D0]'
                }`}>
                <UtensilsCrossed className="w-3.5 h-3.5" />
                {lang === 'de' ? 'Tisch' : lang === 'es' ? 'Mesa' : lang === 'it' ? 'Tavolo' : 'Table'}
              </Link>

              {/* Mobile toggle */}
              <button onClick={() => setOpen(p => !p)}
                className={`lg:hidden w-9 h-9 flex items-center justify-center transition-colors ${isTransparent ? 'text-white/80 hover:text-white' : 'text-[#1C1714]/60 hover:text-[#1C1714]'}`}>
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden bg-white border-t border-[#EDE6D8] max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="px-5 py-5">
              {navLinks.map((l, i) => (
                <Link key={`mob-${l.to}-${i}`} to={l.to}
                  className={`flex items-center py-3.5 text-sm font-body border-b border-[#EDE6D8] transition-colors ${
                    location.pathname === l.to && i > 0 ? 'text-[#8B6914] font-semibold' : 'text-[#1C1714]/70'
                  }`}>
                  {l.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="flex items-center py-3.5 text-sm font-body border-b border-[#EDE6D8] text-[#8B6914]/80">
                  Admin Dashboard
                </Link>
              )}
              <div className="pt-5 space-y-2.5">
                <Link to="/booking" className="flex items-center justify-center gap-2 w-full py-4 bg-[#17352C] hover:bg-[#0F2920] text-white rounded-2xl text-sm tracking-[0.1em] uppercase font-body font-bold transition-all shadow-md">
                  <BedDouble className="w-4 h-4" />
                  {lang === 'de' ? 'Jetzt Zimmer buchen' : 'Book Room Now'}
                </Link>
                <Link to="/reserve" className="flex items-center justify-center gap-2 w-full py-4 border-2 border-[#8B6914] text-[#8B6914] hover:bg-[#F2E8D0] rounded-2xl text-sm tracking-[0.1em] uppercase font-body font-semibold transition-all">
                  <UtensilsCrossed className="w-4 h-4" />
                  {lang === 'de' ? 'Tisch reservieren' : lang === 'en' ? 'Reserve Table' : lang === 'it' ? 'Prenota tavolo' : 'Reservar mesa'}
                </Link>
                {!isLoggedIn && (
                  <button
                    onClick={() => base44.auth.redirectToLogin(window.location.href)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 text-[#1C1714]/50 hover:text-[#8B6914] text-sm font-body transition-colors border border-[#EDE6D8] rounded-2xl hover:border-[#8B6914]/30">
                    <UserCircle className="w-4 h-4" />
                    {lang === 'de' ? 'Einloggen / Registrieren' : lang === 'en' ? 'Sign In / Register' : lang === 'it' ? 'Accedi / Registrati' : 'Iniciar sesión'}
                  </button>
                )}
              </div>
              {/* Language */}
              <div className="flex gap-2 pt-5 pb-2">
                {supported.map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-full border transition-colors ${
                      lang === l ? 'border-[#8B6914] text-[#8B6914] bg-[#F2E8D0]' : 'border-[#EDE6D8] text-[#1C1714]/40'
                    }`}>
                    {FLAG[l]} <span className="uppercase text-xs">{l}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}