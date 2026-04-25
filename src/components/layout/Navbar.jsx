import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, LayoutDashboard, UserCircle, UtensilsCrossed } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const FLAG = { de: '🇩🇪', en: '🇬🇧', it: '🇮🇹' };

export default function Navbar() {
  const { lang, setLang, tr, supported } = useLang();
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
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setLangOpen(false); }, [location]);

  const isHome = location.pathname === '/';
  const alwaysDark = !isHome || scrolled;

  // Desktop shows 5 core links (FAQ + Story stay in footer / mobile drawer)
  const navLinks = [
    { to: '/restaurant', label: tr('nav', 'restaurant') },
    { to: '/menu', label: tr('nav', 'menu') },
    { to: '/rooms', label: tr('nav', 'rooms') },
    { to: '/weddings', label: tr('nav', 'weddings') },
    { to: '/contact', label: tr('nav', 'contact') },
  ];
  // Mobile drawer gets all links including FAQ, Story, Gallery, Events, Offers, Discover
  const mobileLinks = [
    ...navLinks,
    { to: '/offers', label: lang === 'de' ? 'Arrangements' : lang === 'en' ? 'Offers' : 'Offerte' },
    { to: '/events', label: lang === 'de' ? 'Events' : lang === 'en' ? 'Events' : 'Eventi' },
    { to: '/discover', label: lang === 'de' ? 'Langenburg entdecken' : lang === 'en' ? 'Discover Langenburg' : 'Scopri Langenburg' },
    { to: '/gallery', label: lang === 'de' ? 'Galerie' : lang === 'en' ? 'Gallery' : 'Galleria' },
    { to: '/story', label: tr('nav', 'story') },
    { to: '/faq', label: 'FAQ' },
  ];



  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        alwaysDark
          ? 'bg-[#0F0D0B]/95 backdrop-blur-md border-b border-[#C9A96E]/10'
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex flex-col leading-none group">
              <span className="font-display text-base sm:text-lg font-light tracking-[0.15em] text-ivory uppercase">
                Krone <span className="hidden sm:inline">Langenburg</span>
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold font-body font-medium">
                by Ammesso
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className={`font-body text-xs tracking-widest uppercase transition-colors duration-300 ${
                    location.pathname === l.to
                      ? 'text-gold'
                      : 'text-ivory/70 hover:text-ivory'
                  }`}>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              {/* Language */}
              <div className="relative">
                <button onClick={() => setLangOpen(p => !p)}
                  className="flex items-center gap-1 text-ivory/60 hover:text-ivory transition-colors text-xs tracking-wider uppercase font-body">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lang}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-[#1A1410] border border-[#C9A96E]/20 rounded-lg shadow-premium py-1 min-w-[90px]">
                    {supported.map(l => (
                      <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors hover:bg-[#C9A96E]/10 ${lang === l ? 'text-gold font-medium' : 'text-ivory/60'}`}>
                        <span>{FLAG[l]}</span><span className="uppercase">{l}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Account / Admin shortcut */}
              {isAdmin && (
                <Link to="/admin" title="Admin"
                  className="hidden md:flex w-8 h-8 items-center justify-center text-ivory/30 hover:text-gold transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
              )}
              {isLoggedIn && !isAdmin && (
                <Link to="/account" title="Konto"
                  className="hidden md:flex w-8 h-8 items-center justify-center text-ivory/30 hover:text-gold transition-colors">
                  <UserCircle className="w-4 h-4" />
                </Link>
              )}

              {/* Persistent Reserve CTA */}
              <Link to="/reserve"
                className="hidden lg:inline-flex items-center gap-1.5 px-5 py-2.5 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold shadow-gold-glow">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                {lang === 'de' ? 'Reservieren' : lang === 'en' ? 'Reserve' : 'Prenota'}
              </Link>

              {/* Mein Bereich CTA */}
              <Link to={isAdmin ? '/admin' : '/account'}
                className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 btn-ghost-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
                <UserCircle className="w-4 h-4" />
                {isAdmin
                  ? (lang === 'de' ? 'Admin' : 'Admin')
                  : (lang === 'de' ? 'Mein Bereich' : lang === 'en' ? 'My Account' : 'Il mio profilo')}
              </Link>

              {/* Mobile toggle */}
              <button onClick={() => setOpen(p => !p)}
                className="lg:hidden w-9 h-9 flex items-center justify-center text-ivory/70 hover:text-ivory transition-colors">
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden bg-[#0F0D0B] border-t border-[#C9A96E]/10 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-5 py-5 space-y-0.5">
              {mobileLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className={`flex items-center py-3.5 text-sm tracking-widest uppercase font-body border-b border-[#C9A96E]/08 transition-colors ${
                    location.pathname === l.to ? 'text-gold' : 'text-ivory/70'
                  }`}>
                  {l.label}
                </Link>
              ))}
              {/* Account/Admin in mobile */}
              {isLoggedIn && (
                <Link to={isAdmin ? '/admin' : '/account'}
                  className="flex items-center py-3.5 text-sm tracking-widest uppercase font-body border-b border-[#C9A96E]/08 text-gold/70 transition-colors">
                  {isAdmin ? '⚙ Admin' : (lang === 'de' ? 'Mein Konto' : lang === 'en' ? 'My Account' : 'Il mio account')}
                </Link>
              )}
              <div className="pt-5 space-y-2.5">
                <Link to="/reserve"
                  className="block w-full text-center py-4 btn-gold rounded-2xl text-xs tracking-widest uppercase font-body font-semibold">
                  {tr('nav', 'reserve')}
                </Link>
                <Link to="/rooms"
                  className="block w-full text-center py-4 btn-ghost-gold rounded-2xl text-xs tracking-widest uppercase font-body font-semibold">
                  {tr('nav', 'book')}
                </Link>
                <a href={`https://wa.me/4979054177`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full text-center py-3 text-ivory/40 hover:text-gold text-[10px] tracking-widest uppercase font-body transition-colors">
                  💬 WhatsApp
                </a>
              </div>
              <div className="flex gap-2 pt-4 pb-2">
                {supported.map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      lang === l ? 'border-gold text-gold bg-gold/5' : 'border-[#C9A96E]/20 text-ivory/40'
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