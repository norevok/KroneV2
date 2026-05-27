import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { SITE_DEFAULTS } from '@/lib/siteData';
import { MapPin, Phone, Mail, Instagram, Facebook, Navigation } from 'lucide-react';

const MAPS_URL = 'https://maps.app.goo.gl/iXUqvUm7BRTBvvYy5';

export default function Footer() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;
  const year = new Date().getFullYear();

  const HOURS = {
    de: [
      { day: 'Montag', h: 'Ruhetag', dim: true },
      { day: 'Di – Sa', h: '12:00 – 14:30 & 17:30 – 22:00' },
      { day: 'Sonntag', h: '12:00 – 20:00' },
    ],
    en: [
      { day: 'Monday', h: 'Closed', dim: true },
      { day: 'Tue – Sat', h: '12:00 – 14:30 & 17:30 – 22:00' },
      { day: 'Sunday', h: '12:00 – 20:00' },
    ],
  };
  const hours = HOURS[lang] || HOURS.de;

  const NAV = {
    de: {
      col1: 'Restaurant', col2: 'Hotel', col3: 'Mehr', col4: 'Rechtliches',
      links1: [
        { to: '/restaurant', l: 'Das Restaurant' },
        { to: '/menu', l: 'Speisekarte' },
        { to: '/reserve', l: 'Tisch reservieren' },
        { to: '/weddings', l: 'Events & Hochzeiten' },
      ],
      links2: [
        { to: '/rooms', l: 'Zimmer & Suiten' },
        { to: '/offers', l: 'Angebote' },
        { to: '/booking', l: 'Zimmer buchen' },
      ],
      links3: [
        { to: '/story', l: 'Unsere Geschichte' },
        { to: '/gallery', l: 'Galerie' },
        { to: '/shop', l: '🎁 Gutscheine' },
        { to: '/discover', l: 'Langenburg entdecken' },
        { to: '/karriere', l: 'Karriere' },
        { to: '/faq', l: 'FAQ' },
        { to: '/contact', l: 'Kontakt' },
      ],
      links4: [
        { to: '/legal', l: 'Impressum' },
        { to: '/privacy', l: 'Datenschutz' },
        { to: '/agb', l: 'AGB' },
      ],
    },
    en: {
      col1: 'Restaurant', col2: 'Hotel', col3: 'More', col4: 'Legal',
      links1: [
        { to: '/restaurant', l: 'The Restaurant' },
        { to: '/menu', l: 'Menu' },
        { to: '/reserve', l: 'Reserve a Table' },
        { to: '/weddings', l: 'Events & Weddings' },
      ],
      links2: [
        { to: '/rooms', l: 'Rooms & Suites' },
        { to: '/offers', l: 'Offers' },
        { to: '/booking', l: 'Book a Room' },
      ],
      links3: [
        { to: '/story', l: 'Our Story' },
        { to: '/gallery', l: 'Gallery' },
        { to: '/shop', l: '🎁 Vouchers' },
        { to: '/discover', l: 'Discover Langenburg' },
        { to: '/karriere', l: 'Careers' },
        { to: '/faq', l: 'FAQ' },
        { to: '/contact', l: 'Contact' },
      ],
      links4: [
        { to: '/legal', l: 'Impressum' },
        { to: '/privacy', l: 'Privacy' },
        { to: '/agb', l: 'Terms' },
      ],
    },
  };
  const nav = NAV[lang] || NAV.de;

  return (
    <footer className="bg-[#1C1714] text-[#FAF7F2] pt-0 pb-8 border-t border-black/20">
      {/* Premium CTA strip */}
      <div className="border-b border-[#C9A96E]/10 py-10 sm:py-12 px-5 sm:px-8 bg-[#171411]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-display text-xl sm:text-2xl font-light text-white leading-tight">
              {lang === 'de' ? 'Bereit für Ihren Aufenthalt?' : lang === 'en' ? 'Ready for your stay?' : 'Pronti per il vostro soggiorno?'}
            </p>
            <p className="text-white/40 text-sm font-body mt-1">Krone Langenburg by Ammesso · Hohenlohe</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
            <Link to="/booking"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] rounded-full text-xs tracking-widest uppercase font-body font-bold transition-all shadow-[0_6px_20px_rgba(201,169,110,0.3)] hover:shadow-[0_10px_28px_rgba(201,169,110,0.45)] hover:-translate-y-0.5 w-full sm:w-auto">
              {lang === 'de' ? 'Zimmer buchen' : lang === 'en' ? 'Book a Room' : 'Prenota'}
            </Link>
            <Link to="/reserve"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#C9A96E]/30 text-[#C9A96E] hover:border-[#C9A96E]/60 hover:bg-[#C9A96E]/8 rounded-full text-xs tracking-widest uppercase font-body font-semibold transition-all hover:-translate-y-0.5 w-full sm:w-auto">
              {lang === 'de' ? 'Tisch reservieren' : lang === 'en' ? 'Reserve Table' : 'Prenota tavolo'}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 sm:pt-16">

        {/* Top grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 mb-12 sm:mb-14">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="mb-5">
              <p className="font-display text-xl font-light tracking-[0.15em] uppercase text-white">Krone Langenburg</p>
              <p className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase font-body mt-0.5">by Ammesso</p>
            </div>
            <p className="text-white/40 text-sm font-body leading-relaxed mb-5 max-w-[200px]">
              {lang === 'de' ? 'Mediterrane Küche & stilvolle Unterkunft im historischen Herzen Hohenlohes.' : 'Mediterranean cuisine & stylish accommodation in the historic heart of Hohenlohe.'}
            </p>
            <div className="flex gap-3">
              <a href={s.social_instagram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-[#C9A96E] hover:border-[#C9A96E]/30 transition-all">
                 <Instagram className="w-4 h-4" />
                </a>
                <a href={s.social_facebook} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-[#C9A96E] hover:border-[#C9A96E]/30 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {[
            { title: nav.col1, links: nav.links1 },
            { title: nav.col2, links: nav.links2 },
            { title: nav.col3, links: nav.links3 },
            { title: nav.col4, links: nav.links4 },
          ].map((col, i) => (
            <div key={i}>
              <h3 className="text-white/30 text-[10px] tracking-[0.35em] uppercase font-body mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-white/55 hover:text-[#C9A96E] text-sm font-body transition-colors">{l.l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Info row */}
        <div className="border-t border-white/10 pt-8 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Address */}
          <div>
            <h3 className="text-white/30 text-[10px] tracking-[0.35em] uppercase font-body mb-3">
              {lang === 'de' ? 'Adresse' : 'Address'}
            </h3>
            <div className="flex gap-2 text-white/55 text-sm font-body mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#C9A96E]/50 flex-shrink-0 mt-0.5" />
              <address className="not-italic">
                <strong className="text-white/70">Krone Langenburg by Ammesso</strong><br />
                {s.address_street}<br />
                {s.address_zip} {s.address_city}<br />
                {s.address_country}
              </address>
            </div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#C9A96E]/70 hover:text-[#C9A96E] text-xs font-body tracking-wider transition-colors">
              <Navigation className="w-3 h-3" />
              {lang === 'de' ? 'Route starten' : 'Get Directions'}
            </a>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-white/30 text-[10px] tracking-[0.35em] uppercase font-body mb-3">Kontakt</h3>
            <div className="space-y-2">
              <a href={`tel:${s.phone}`} className="flex items-center gap-2 text-white/55 hover:text-[#C9A96E] text-sm font-body transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#C9A96E]/50" /> {s.phone}
              </a>
              <a href={`mailto:${s.email_info}`} className="flex items-center gap-2 text-white/55 hover:text-[#C9A96E] text-sm font-body transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#C9A96E]/50" /> {s.email_info}
              </a>
            </div>
          </div>
          {/* Hours */}
          <div>
            <h3 className="text-white/30 text-[10px] tracking-[0.35em] uppercase font-body mb-3">
              {lang === 'de' ? 'Öffnungszeiten' : 'Opening Hours'}
            </h3>
            <ul className="space-y-1.5">
              {hours.map((h, i) => (
                <li key={i} className={`flex justify-between text-sm font-body gap-4 ${h.dim ? 'text-white/25' : 'text-white/55'}`}>
                  <span>{h.day}</span><span>{h.h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs font-body tracking-wider">
            © {year} Krone Langenburg by Ammesso — Alle Rechte vorbehalten
          </p>
          <div className="flex gap-4">
            {nav.links4.map(l => (
              <Link key={l.to} to={l.to} className="text-white/25 hover:text-white/60 text-xs font-body tracking-wider transition-colors">{l.l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}