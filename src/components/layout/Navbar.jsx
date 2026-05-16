import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, LayoutDashboard, UserCircle, UtensilsCrossed, BedDouble, Search } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];
const FLAG = { de: '🇩🇪', en: '🇬🇧', it: '🇮🇹' };

const NAV_LINKS = {
  de: [
    { to: '/rooms', label: 'Zimmer & Suiten' },
    { to: '/restaurant', label: 'Restaurant' },
    { to: '/events', label: 'Events & Feiern' },
    { to: '/gallery', label: 'Galerie' },
    { to: '/story', label: 'Unsere Geschichte' },
    { to: '/contact', label: 'Kontakt' },
  ],
  en: [
    { to: '/rooms', label: 'Rooms & Suites' },
    { to: '/restaurant', label: 'Restaurant' },
    { to: '/events', label: 'Events & Meetings' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/story', label: 'Our Story' },
    { to: '/contact', label: 'Contact' },
  ],
};

export default function Navbar() {
  const { lang, setLang, supported } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u) { setIsLoggedIn(true); if (ADMIN_EMAILS.includes(u.email) || u.role === 'admin') setIsAdmin(true); }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setLangOpen(false); }, [location]);

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  const navLinks = NAV_LINKS[lang] || NAV_LINKS.de;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent border-b border-transparent'
          : 'bg-white border-b border-[#EDE6D8] shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex flex-col leading-none group flex-shrink-0">
              <span className={`font-display text-base sm:text-lg font-light tracking-[0.12em] uppercase transition-colors ${isTransparent ? 'text-white' : 'text-[#1C1714]'}`}>
                Krone Langenburg
              </span>
              <span className={`text-[10px] tracking-[0.3em] uppercase font-body font-semibold transition-colors ${isTransparent ? 'text-[#C9A96E]' : 'text-[#8B6914]'}`}>
                by Ammesso
              </span>
            </Link>

            {/* Desktop center nav */}
            <div className="hidden xl:flex items-center gap-6">
              {navLinks.map(l => {
                const isActive = location.pathname === l.to || (l.to !== '/' && location.pathname.startsWith(l.to));
                return (
                  <Link key={l.to} to={l.to}
                    className={`relative font-body text-[11px] tracking-widest uppercase transition-all duration-200 hover:scale-105 pb-0.5 ${
                      isActive
                        ? (isTransparent ? 'text-[#C9A96E]' : 'text-[#8B6914]')
                        : (isTransparent ? 'text-white/80 hover:text-white' : 'text-[#1C1714]/60 hover:text-[#1C1714]')
                    }`}>
                    {l.label}
                    {isActive && (
                      <span className={`absolute -bottom-0.5 left-0 right-0 h-px ${isTransparent ? 'bg-[#C9A96E]' : 'bg-[#8B6914]'}`} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language */}
              <div className="relative">
                <button onClick={() => setLangOpen(p => !p)}
                  className={`flex items-center gap-1 text-[11px] tracking-wider uppercase font-body transition-colors ${isTransparent ? 'text-white/70 hover:text-white' : 'text-[#1C1714]/50 hover:text-[#8B6914]'}`}>
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lang}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-[#EDE6D8] rounded-xl shadow-lg py-1 min-w-[90px] z-50">
                    {supported.map(l => (
                      <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors hover:bg-[#F7F3EC] ${lang === l ? 'text-[#8B6914] font-semibold' : 'text-[#1C1714]/60'}`}>
                        <span>{FLAG[l]}</span><span className="uppercase">{l}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Primary CTA: Jetzt buchen (rooms) */}
              <Link to="/rooms"
                className={`hidden lg:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[11px] tracking-widest uppercase font-body font-semibold transition-all ${
                  isTransparent
                    ? 'bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/40 text-white'
                    : 'bg-[#8B6914] hover:bg-[#7A5A0F] text-white shadow-sm'
                }`}>
                <BedDouble className="w-3.5 h-3.5" />
                {lang === 'de' ? 'Jetzt buchen' : lang === 'en' ? 'Book Now' : 'Prenota'}
              </Link>
              {/* Secondary CTA: Table reservation */}
              <Link to="/reserve"
                className={`hidden xl:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] tracking-widest uppercase font-body font-semibold transition-all border-2 ${
                  isTransparent
                    ? 'border-white/40 text-white hover:bg-white/10'
                    : 'border-[#8B6914]/40 text-[#8B6914] hover:border-[#8B6914] hover:bg-[#F2E8D0]'
                }`}>
                <UtensilsCrossed className="w-3.5 h-3.5" />
                {lang === 'de' ? 'Tisch' : lang === 'en' ? 'Reserve' : 'Prenota'}
              </Link>

              {/* Account / Admin */}
              {isAdmin ? (
                <Link to="/admin"
                  className={`hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 text-[11px] tracking-widest uppercase font-body font-semibold transition-all ${
                    isTransparent
                      ? 'border-white/40 text-white hover:bg-white/10'
                      : 'border-[#1C1714]/20 text-[#1C1714]/70 hover:border-[#1C1714] hover:text-[#1C1714]'
                  }`}>
                  <LayoutDashboard className="w-3.5 h-3.5" /> Admin
                </Link>
              ) : (
                <Link to="/account"
                  className={`hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 text-[11px] tracking-widest uppercase font-body font-semibold transition-all ${
                    isTransparent
                      ? 'border-white/40 text-white hover:bg-white/10'
                      : 'border-[#1C1714]/20 text-[#1C1714]/70 hover:border-[#1C1714] hover:text-[#1C1714]'
                  }`}>
                  <UserCircle className="w-3.5 h-3.5" /> {lang === 'de' ? 'Mein Bereich' : 'My Account'}
                </Link>
              )}

              {/* Mobile toggle */}
              <button onClick={() => setOpen(p => !p)}
                className={`xl:hidden w-9 h-9 flex items-center justify-center transition-colors ${isTransparent ? 'text-white/80 hover:text-white' : 'text-[#1C1714]/60 hover:text-[#1C1714]'}`}>
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="xl:hidden bg-white border-t border-[#EDE6D8] max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="px-5 py-5">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className={`flex items-center py-3.5 text-base font-body border-b border-[#EDE6D8] transition-colors ${
                    location.pathname === l.to ? 'text-[#8B6914] font-semibold' : 'text-[#1C1714]/70'
                  }`}>
                  {l.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="flex items-center py-3.5 text-base font-body border-b border-[#EDE6D8] text-[#8B6914]/80">
                  ⚙ Admin Dashboard
                </Link>
              )}
              {isLoggedIn && !isAdmin && (
                <Link to="/account" className="flex items-center py-3.5 text-base font-body border-b border-[#EDE6D8] text-[#1C1714]/70">
                  {lang === 'de' ? 'Mein Konto' : 'My Account'}
                </Link>
              )}
              <div className="pt-5 space-y-3">
                <Link to="/rooms" className="block w-full text-center py-4 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-2xl text-sm tracking-widest uppercase font-body font-semibold transition-all">
                  {lang === 'de' ? 'Jetzt buchen' : 'Book Now'}
                </Link>
                <Link to="/reserve" className="block w-full text-center py-4 border-2 border-[#8B6914] text-[#8B6914] hover:bg-[#F2E8D0] rounded-2xl text-sm tracking-widest uppercase font-body font-semibold transition-all">
                  {lang === 'de' ? 'Tisch reservieren' : 'Reserve Table'}
                </Link>
                <a href="https://wa.me/4979054177" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full text-center py-3 text-[#1C1714]/40 hover:text-[#8B6914] text-sm font-body transition-colors">
                  💬 WhatsApp
                </a>
              </div>
              {/* Language */}
              <div className="flex gap-2 pt-5 pb-2">
                {supported.map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-full border transition-colors ${
                      lang === l ? 'border-[#8B6914] text-[#8B6914] bg-[#F2E8D0]' : 'border-[#EDE6D8] text-[#1C1714]/40'
                    }`}>
                    {FLAG[l]} <span className="uppercase">{l}</span>
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