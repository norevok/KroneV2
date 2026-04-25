import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import { SITE_DEFAULTS } from '@/lib/siteData';

export default function Footer() {
  const { tr, lang } = useLang();
  const s = SITE_DEFAULTS;

  return (
    <footer className="bg-[#0A0805] border-t border-[#C9A96E]/10 mb-[72px] lg:mb-0">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <p className="font-display text-xl font-light text-ivory tracking-[0.1em] uppercase mb-0.5">Krone Langenburg</p>
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-body mb-5">by Ammesso</p>
          <p className="text-ivory/50 text-sm leading-relaxed font-body">
            {lang === 'de' && 'Mediterrane Küche mit Herz. Stilvolle Unterkunft im Herzen Hohenlohes.'}
            {lang === 'en' && 'Mediterranean cuisine with heart. Stylish accommodation in Hohenlohe.'}
            {lang === 'it' && 'Cucina mediterranea con cuore. Alloggio raffinato nell\'Hohenlohe.'}
          </p>
          <div className="flex gap-3 mt-6">
            <a href={s.social_instagram} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 border border-[#C9A96E]/20 rounded-full flex items-center justify-center text-ivory/40 hover:text-gold hover:border-gold/40 transition-colors">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href={s.social_facebook} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 border border-[#C9A96E]/20 rounded-full flex items-center justify-center text-ivory/40 hover:text-gold hover:border-gold/40 transition-colors">
              <Facebook className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-ivory/30 text-[10px] tracking-[0.3em] uppercase font-body font-medium mb-5">
            {lang === 'de' ? 'Kontakt' : lang === 'en' ? 'Contact' : 'Contatti'}
          </h3>
          <ul className="space-y-3 text-sm font-body">
            <li className="flex gap-3 text-ivory/55">
              <MapPin className="w-3.5 h-3.5 mt-0.5 text-gold/60 flex-shrink-0" />
              <span>{s.address_street}<br />{s.address_zip} {s.address_city}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-3.5 h-3.5 mt-0.5 text-gold/60 flex-shrink-0" />
              <a href={`tel:${s.phone}`} className="text-ivory/55 hover:text-gold transition-colors">{s.phone}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="w-3.5 h-3.5 mt-0.5 text-gold/60 flex-shrink-0" />
              <a href={`mailto:${s.email_info}`} className="text-ivory/55 hover:text-gold transition-colors">{s.email_info}</a>
            </li>
          </ul>
          <a href="https://www.google.com/maps/dir/?api=1&destination=Hauptstra%C3%9Fe+24%2C+74595+Langenburg"
            target="_blank" rel="noopener noreferrer"
            className="mt-5 inline-flex text-xs text-gold/60 hover:text-gold transition-colors tracking-wider font-body">
            {lang === 'de' ? 'Route planen →' : lang === 'en' ? 'Get Directions →' : 'Come raggiungerci →'}
          </a>
        </div>

        {/* Hours */}
        <div>
          <h3 className="text-ivory/30 text-[10px] tracking-[0.3em] uppercase font-body font-medium mb-5">
            {lang === 'de' ? 'Öffnungszeiten' : lang === 'en' ? 'Opening Hours' : 'Orari'}
          </h3>
          <ul className="space-y-3 text-sm font-body">
            <li className="flex justify-between text-ivory/30">
              <span>{lang === 'de' ? 'Montag' : lang === 'en' ? 'Monday' : 'Lunedì'}</span>
              <span>{lang === 'de' ? 'Ruhetag' : lang === 'en' ? 'Closed' : 'Chiuso'}</span>
            </li>
            <li className="text-ivory/55">
              <div className="font-medium text-ivory/70">{lang === 'de' ? 'Di – Sa' : lang === 'en' ? 'Tue – Sat' : 'Mar – Sab'}</div>
              <div className="text-xs text-ivory/40 mt-0.5">12:00–14:30 · 17:30–22:00</div>
            </li>
            <li className="text-ivory/55">
              <div className="font-medium text-ivory/70">{lang === 'de' ? 'Sonntag' : lang === 'en' ? 'Sunday' : 'Domenica'}</div>
              <div className="text-xs text-ivory/40 mt-0.5">12:00–20:00</div>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-ivory/30 text-[10px] tracking-[0.3em] uppercase font-body font-medium mb-5">Navigation</h3>
          <ul className="space-y-2.5 text-sm font-body">
            {[
              { to: '/rooms', de: 'Zimmer & Suiten', en: 'Rooms & Suites', it: 'Camere & Suite' },
              { to: '/offers', de: 'Arrangements', en: 'Offers', it: 'Offerte' },
              { to: '/reserve', de: 'Tisch reservieren', en: 'Reserve a Table', it: 'Prenota tavolo' },
              { to: '/menu', de: 'Speisekarte', en: 'Menu', it: 'Menu' },
              { to: '/weddings', de: 'Hochzeiten & Events', en: 'Weddings & Events', it: 'Matrimoni & Eventi' },
              { to: '/discover', de: 'Langenburg entdecken', en: 'Discover Langenburg', it: 'Scopri Langenburg' },
              { to: '/gallery', de: 'Galerie', en: 'Gallery', it: 'Galleria' },
              { to: '/story', de: 'Unsere Geschichte', en: 'Our Story', it: 'La nostra storia' },
              { to: '/faq', de: 'FAQ', en: 'FAQ', it: 'FAQ' },
              { to: '/contact', de: 'Kontakt', en: 'Contact', it: 'Contatti' },
              { to: '/agb', de: 'AGB', en: 'T&C', it: 'Condizioni' },
              { to: '/legal', de: 'Impressum', en: 'Legal', it: 'Note legali' },
            ].map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-ivory/40 hover:text-gold transition-colors tracking-wide">
                  {lang === 'de' ? l.de : lang === 'en' ? l.en : l.it}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent" />
      </div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span className="text-ivory/25 text-xs font-body tracking-wide">
          © {new Date().getFullYear()} Krone Langenburg by Ammesso. {lang === 'de' ? 'Alle Rechte vorbehalten.' : lang === 'en' ? 'All rights reserved.' : 'Tutti i diritti riservati.'}
        </span>
        <div className="flex gap-5 flex-wrap justify-center sm:justify-end">
          <Link to="/legal" className="text-ivory/25 hover:text-gold/60 transition-colors text-xs font-body tracking-wide">
            {lang === 'de' ? 'Impressum' : lang === 'en' ? 'Legal' : 'Note legali'}
          </Link>
          <Link to="/privacy" className="text-ivory/25 hover:text-gold/60 transition-colors text-xs font-body tracking-wide">
            {lang === 'de' ? 'Datenschutz' : lang === 'en' ? 'Privacy' : 'Privacy'}
          </Link>
          <Link to="/agb" className="text-ivory/25 hover:text-gold/60 transition-colors text-xs font-body tracking-wide">
            AGB
          </Link>
        </div>
      </div>
    </footer>
  );
}