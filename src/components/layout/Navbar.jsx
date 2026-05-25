import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown, LayoutDashboard, UserCircle, UtensilsCrossed, BedDouble, HelpCircle, Star, MapPin, Gift, Calendar, ChevronRight } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];
const FLAG = { de: '🇩🇪', en: '🇬🇧', it: '🇮🇹', es: '🇪🇸' };
const LANG_LABEL = { de: 'Deutsch', en: 'English', it: 'Italiano', es: 'Español' };

const NAV_LINKS = {
  de: [
    { to: '/booking', label: 'Suchen & Reservieren', icon: BedDouble, desc: 'Zimmer & Verfügbarkeit' },
    { to: '/rooms', label: 'Zimmer & Suiten', icon: Star, desc: '10 exklusive Zimmer' },
    { to: '/offers', label: 'Angebote', icon: Gift, desc: 'Exklusive Arrangements' },
    { to: '/restaurant', label: 'Restaurant + Bar', icon: UtensilsCrossed, desc: 'Mediterrane Küche' },
    { to: '/weddings', label: 'Events & Feiern', icon: Calendar, desc: 'Hochzeiten & Corporate' },
    { to: '/story', label: 'Unsere Geschichte', icon: Star, desc: 'Seit dem 16. Jahrhundert' },
    { to: '/discover', label: 'Entdecken', icon: MapPin, desc: 'Region Hohenlohe' },
    { to: '/contact', label: 'Kontakt', icon: HelpCircle, desc: 'Wir helfen gerne' },
  ],
  en: [
    { to: '/booking', label: 'Search & Book', icon: BedDouble, desc: 'Rooms & Availability' },
    { to: '/rooms', label: 'Rooms & Suites', icon: Star, desc: '10 exclusive rooms' },
    { to: '/offers', label: 'Offers', icon: Gift, desc: 'Exclusive arrangements' },
    { to: '/restaurant', label: 'Restaurant + Bar', icon: UtensilsCrossed, desc: 'Mediterranean cuisine' },
    { to: '/weddings', label: 'Events & Celebrations', icon: Calendar, desc: 'Weddings & Corporate' },
    { to: '/story', label: 'Our Story', icon: Star, desc: 'Since the 16th century' },
    { to: '/discover', label: 'Discover', icon: MapPin, desc: 'Hohenlohe region' },
    { to: '/contact', label: 'Contact', icon: HelpCircle, desc: 'We are here to help' },
  ],
  it: [
    { to: '/booking', label: 'Cerca & Prenota', icon: BedDouble, desc: 'Camere & Disponibilità' },
    { to: '/rooms', label: 'Camere & Suite', icon: Star, desc: '10 camere esclusive' },
    { to: '/offers', label: 'Offerte', icon: Gift, desc: 'Arrangiamenti esclusivi' },
    { to: '/restaurant', label: 'Ristorante + Bar', icon: UtensilsCrossed, desc: 'Cucina mediterranea' },
    { to: '/weddings', label: 'Events & Feste', icon: Calendar, desc: 'Matrimoni & Corporate' },
    { to: '/story', label: 'La Nostra Storia', icon: Star, desc: 'Dal XVI secolo' },
    { to: '/discover', label: 'Scopri', icon: MapPin, desc: 'Regione Hohenlohe' },
    { to: '/contact', label: 'Contatti', icon: HelpCircle, desc: 'Siamo qui per aiutare' },
  ],
  es: [
    { to: '/booking', label: 'Buscar & Reservar', icon: BedDouble, desc: 'Habitaciones & Disponibilidad' },
    { to: '/rooms', label: 'Habitaciones & Suites', icon: Star, desc: '10 habitaciones exclusivas' },
    { to: '/offers', label: 'Ofertas', icon: Gift, desc: 'Arreglos exclusivos' },
    { to: '/restaurant', label: 'Restaurante + Bar', icon: UtensilsCrossed, desc: 'Cocina mediterránea' },
    { to: '/weddings', label: 'Eventos & Celebraciones', icon: Calendar, desc: 'Bodas & Corporativo' },
    { to: '/story', label: 'Nuestra Historia', icon: Star, desc: 'Desde el siglo XVI' },
    { to: '/discover', label: 'Descubrir', icon: MapPin, desc: 'Región de Hohenlohe' },
    { to: '/contact', label: 'Contacto', icon: HelpCircle, desc: 'Estamos aquí para ayudar' },
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

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
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1.5 bg-white border border-[#EDE6D8] rounded-xl shadow-xl py-1 min-w-[120px] z-50">
                    {supported.map(l => (
                      <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors hover:bg-[#F7F3EC] ${lang === l ? 'text-[#8B6914] font-semibold' : 'text-[#1C1714]/60'}`}>
                        <span>{FLAG[l]}</span>
                        <span>{LANG_LABEL[l]}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="hidden sm:block h-3 w-px bg-white/20" />
            <Link to="/account"
              className="hidden sm:flex items-center gap-1 text-white/50 hover:text-white/80 text-[11px] font-body tracking-wider transition-colors">
              {lang === 'de' ? 'Meine Reisen' : lang === 'en' ? 'My Trips' : 'I miei viaggi'}
            </Link>
            <div className="hidden sm:block h-3 w-px bg-white/20" />
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
      <nav className={`fixed top-9 left-0 right-0 transition-all duration-300 ${
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

            {/* Desktop center nav */}
            <div className="hidden lg:flex items-center justify-center flex-1 px-2">
              <div className="flex items-center gap-3 xl:gap-5 flex-wrap justify-center">
                {navLinks.map((l, i) => {
                  const isActive = location.pathname === l.to && i > 0;
                  return (
                    <Link key={`${l.to}-${i}`} to={l.to}
                      className={`relative font-body text-[9px] xl:text-[10px] tracking-[0.1em] uppercase whitespace-nowrap transition-all duration-200 group pb-1 flex-shrink-0 ${
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
              <motion.button
                onClick={() => setOpen(p => !p)}
                whileTap={{ scale: 0.92 }}
                className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                  open
                    ? 'bg-[#C9A96E]/15 text-[#C9A96E]'
                    : isTransparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-[#1C1714]/60 hover:text-[#1C1714] hover:bg-[#F7F3EC]'
                }`}>
                <AnimatePresence mode="wait">
                  {open ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE FULL-SCREEN DRAWER ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[380px] bg-[#FAF7F2] z-50 lg:hidden overflow-y-auto flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#EDE6D8] bg-white">
                <div>
                  <p className="font-display text-base font-light tracking-[0.1em] text-[#1C1714] uppercase">Krone Langenburg</p>
                  <p className="text-[10px] tracking-[0.3em] uppercase font-body font-semibold text-[#8B6914]">by Ammesso</p>
                </div>
                <motion.button
                  onClick={() => setOpen(false)}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F7F3EC] text-[#1C1714]/60 hover:text-[#1C1714] transition-colors">
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* CTA buttons */}
              <div className="px-5 pt-5 pb-4 grid grid-cols-2 gap-2.5">
                <Link to="/booking" className="flex items-center justify-center gap-2 py-3.5 bg-[#17352C] hover:bg-[#0F2920] text-white rounded-xl text-xs tracking-[0.1em] uppercase font-body font-bold transition-all shadow-md">
                  <BedDouble className="w-4 h-4" />
                  {lang === 'de' ? 'Zimmer buchen' : lang === 'en' ? 'Book Room' : lang === 'it' ? 'Prenota' : 'Reservar'}
                </Link>
                <Link to="/reserve" className="flex items-center justify-center gap-2 py-3.5 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] rounded-xl text-xs tracking-[0.1em] uppercase font-body font-bold transition-all shadow-md">
                  <UtensilsCrossed className="w-4 h-4" />
                  {lang === 'de' ? 'Tisch reserv.' : lang === 'en' ? 'Reserve Table' : lang === 'it' ? 'Tavolo' : 'Mesa'}
                </Link>
              </div>

              {/* Nav links with icons */}
              <div className="flex-1 px-5 pb-5">
                <p className="text-[#8A7A6A] text-[10px] tracking-[0.3em] uppercase font-body font-semibold mb-3 px-1">
                  {lang === 'de' ? 'Navigation' : 'Menu'}
                </p>
                <div className="space-y-1">
                  {navLinks.map((l, i) => {
                    const isActive = location.pathname === l.to;
                    const Icon = l.icon;
                    return (
                      <motion.div
                        key={`mob-${l.to}-${i}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                      >
                        <Link to={l.to}
                          className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all group ${
                            isActive
                              ? 'bg-[#8B6914]/10 border border-[#8B6914]/20'
                              : 'hover:bg-white hover:shadow-sm border border-transparent'
                          }`}>
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            isActive ? 'bg-[#8B6914] shadow-sm' : 'bg-[#EDE6D8] group-hover:bg-[#8B6914]/15'
                          }`}>
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8B6914]'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-body font-semibold leading-tight ${isActive ? 'text-[#8B6914]' : 'text-[#1C1714]'}`}>
                              {l.label}
                            </p>
                            <p className="text-[11px] font-body text-[#8A7A6A] mt-0.5">{l.desc}</p>
                          </div>
                          <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-all ${isActive ? 'text-[#8B6914]' : 'text-[#C8BEA8] group-hover:text-[#8B6914] group-hover:translate-x-0.5'}`} />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Admin link */}
                {isAdmin && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <Link to="/admin" className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent transition-all group mt-1">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#C9A96E]/15 group-hover:bg-[#C9A96E]/25 transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-[#8B6914]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-body font-semibold text-[#8B6914]">Admin Dashboard</p>
                        <p className="text-[11px] font-body text-[#8A7A6A] mt-0.5">{lang === 'de' ? 'Verwaltung & Einstellungen' : 'Management & Settings'}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#C8BEA8] group-hover:text-[#8B6914] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Bottom: Account + Language */}
              <div className="border-t border-[#EDE6D8] bg-white px-5 py-4 space-y-3">
                {isLoggedIn ? (
                  <Link to="/account"
                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#F7F3EC] hover:bg-[#EDE6D8] transition-colors">
                    <div className="w-9 h-9 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0">
                      <UserCircle className="w-5 h-5 text-[#8B6914]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-semibold text-[#1C1714] truncate">{userName}</p>
                      <p className="text-[11px] font-body text-[#8A7A6A]">{lang === 'de' ? 'Mein Konto' : lang === 'en' ? 'My Account' : 'Il mio account'}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C8BEA8]" />
                  </Link>
                ) : (
                  <button
                    onClick={() => base44.auth.redirectToLogin(window.location.href)}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl w-full bg-[#F7F3EC] hover:bg-[#EDE6D8] transition-colors text-left">
                    <div className="w-9 h-9 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0">
                      <UserCircle className="w-5 h-5 text-[#8B6914]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-body font-semibold text-[#1C1714]">
                        {lang === 'de' ? 'Einloggen / Registrieren' : lang === 'en' ? 'Sign In / Register' : 'Accedi / Registrati'}
                      </p>
                      <p className="text-[11px] font-body text-[#8A7A6A]">
                        {lang === 'de' ? 'Exklusive Gästevorteile' : lang === 'en' ? 'Exclusive guest benefits' : 'Vantaggi esclusivi'}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C8BEA8]" />
                  </button>
                )}

                {/* Language switcher */}
                <div className="flex gap-2">
                  {supported.map(l => (
                    <button key={l} onClick={() => setLang(l)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border transition-all flex-1 justify-center ${
                        lang === l
                          ? 'border-[#8B6914] text-[#8B6914] bg-[#F2E8D0] font-semibold shadow-sm'
                          : 'border-[#EDE6D8] text-[#1C1714]/40 hover:border-[#8B6914]/30 hover:text-[#8B6914]/60'
                      }`}>
                      {FLAG[l]} <span className="uppercase">{l}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}