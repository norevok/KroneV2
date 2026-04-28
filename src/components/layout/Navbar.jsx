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

  // On home page: transparent until scrolled. On all other pages: always light.
  const isLight = !isHome || scrolled;

  const navLinks = [
    { to: '/restaurant', label: tr('nav', 'restaurant') },
    { to: '/menu', label: tr('nav', 'menu') },
    { to: '/rooms', label: tr('nav', 'rooms') },
    { to: '/weddings', label: tr('nav', 'weddings') },
    { to: '/contact', label: tr('nav', 'contact') },
  ];

  const mobileLinks = [
    ...navLinks,
    { to: '/offers', label: lang === 'de' ? 'Arrangements' : 'Offers' },
    { to: '/events', label: 'Events' },
    { to: '/discover', label: lang === 'de' ? 'Langenburg entdecken' : 'Discover Langenburg' },
    { to: '/gallery', label: lang === 'de' ? 'Galerie' : 'Gallery' },
    { to: '/shop', label: lang === 'de' ? 'Gutscheine' : 'Vouchers' },
    { to: '/karriere', label: lang === 'de' ? 'Karriere' : 'Careers' },
    { to: '/story', label: tr('nav', 'story') },
    { to: '/faq', label: 'FAQ' },
  ];

  const navBg = isLight
    ? 'bg-ivory/95 backdrop-blur-md border-b border-stone-mid shadow-sm'
    : 'bg-transparent border-b border-transparent';

  const logoColor = isLight ? 'text-charcoal' : 'text-ivory';
  const logoSub = isLight ? 'text-gold' : 'text-gold-light';
  const linkColor = isLight ? 'text-charcoal/60 hover:text-charcoal' : 'text-ivory/70 hover:text-ivory';
  const linkActive = isLight ? 'text-gold' : 'text-gold-light';
  const iconColor = isLight ? 'text-charcoal/40 hover:text-gold' : 'text-ivory/40 hover:text-gold-light';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex flex-col leading-none group">
              <span className={`font-display text-base sm:text-lg font-light tracking-[0.15em] uppercase transition-colors ${logoColor}`}>
                Krone <span className="hidden sm:inline">Langenburg</span>
              </span>
              <span className={`text-[10px] tracking-[0.3em] uppercase font-body font-medium transition-colors ${logoSub}`}>
                by Ammesso
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className={`font-body text-xs tracking-widest uppercase transition-colors duration-200 ${
                    location.pathname === l.to ? linkActive : linkColor
                  }`}>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Language switcher */}
              <div className="relative">
                <button onClick={() => setLangOpen(p => !p)}
                  className={`flex items-center gap-1 transition-colors text-xs tracking-wider uppercase font-body ${iconColor}`}>
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lang}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-stone-mid rounded-xl shadow-card py-1 min-w-[90px]">
                    {supported.map(l => (
                      <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors hover:bg-stone ${lang === l ? 'text-gold font-medium' : 'text-charcoal/60'}`}>
                        <span>{FLAG[l]}</span><span className="uppercase">{l}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin / Account icon (desktop) */}
              {isAdmin && (
                <Link to="/admin" title="Admin" className={`hidden md:flex w-8 h-8 items-center justify-center transition-colors ${iconColor}`}>
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
              )}
              {isLoggedIn && !isAdmin && (
                <Link to="/account" title="Konto" className={`hidden md:flex w-8 h-8 items-center justify-center transition-colors ${iconColor}`}>
                  <UserCircle className="w-4 h-4" />
                </Link>
              )}

              {/* Reserve CTA */}
              <Link to="/reserve"
                className="hidden lg:inline-flex items-center gap-1.5 px-5 py-2.5 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                {lang === 'de' ? 'Reservieren' : lang === 'en' ? 'Reserve' : 'Prenota'}
              </Link>

              {/* Account CTA (desktop) */}
              <Link to={isAdmin ? '/admin' : '/account'}
                className={`hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all ${
                  isLight
                    ? 'border-2 border-charcoal/20 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-ivory'
                    : 'border-2 border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory/10'
                }`}>
                <UserCircle className="w-4 h-4" />
                {isAdmin ? 'Admin' : (lang === 'de' ? 'Mein Bereich' : 'My Account')}
              </Link>

              {/* Mobile toggle */}
              <button onClick={() => setOpen(p => !p)}
                className={`lg:hidden w-9 h-9 flex items-center justify-center transition-colors ${iconColor}`}>
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden bg-ivory border-t border-stone-mid max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-5 py-5 space-y-0.5">
              {mobileLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className={`flex items-center py-3.5 text-sm tracking-widest uppercase font-body border-b border-stone-mid/50 transition-colors ${
                    location.pathname === l.to ? 'text-gold' : 'text-charcoal/70'
                  }`}>
                  {l.label}
                </Link>
              ))}
              {isLoggedIn && (
                <Link to={isAdmin ? '/admin' : '/account'}
                  className="flex items-center py-3.5 text-sm tracking-widest uppercase font-body border-b border-stone-mid/50 text-gold/80">
                  {isAdmin ? '⚙ Admin' : (lang === 'de' ? 'Mein Konto' : 'My Account')}
                </Link>
              )}
              <div className="pt-5 space-y-2.5">
                <Link to="/reserve" className="block w-full text-center py-4 btn-gold rounded-2xl text-xs tracking-widest uppercase font-body font-semibold">
                  {lang === 'de' ? 'Tisch reservieren' : 'Reserve Table'}
                </Link>
                <Link to="/rooms" className="block w-full text-center py-4 btn-ghost-gold rounded-2xl text-xs tracking-widest uppercase font-body font-semibold">
                  {lang === 'de' ? 'Zimmer buchen' : 'Book Room'}
                </Link>
                <a href="https://wa.me/4979054177" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full text-center py-3 text-charcoal/40 hover:text-gold text-[10px] tracking-widest uppercase font-body transition-colors">
                  💬 WhatsApp
                </a>
              </div>
              <div className="flex gap-2 pt-4 pb-2">
                {supported.map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      lang === l ? 'border-gold text-gold bg-gold-pale' : 'border-stone-mid text-charcoal/40'
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