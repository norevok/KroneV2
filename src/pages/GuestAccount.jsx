import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { User, FileText, MessageSquare, UtensilsCrossed, BedDouble, LogOut, ChevronRight, Settings, LayoutDashboard, Calendar, Gift, Star, MapPin, Navigation, Phone, Mail, ArrowRight } from 'lucide-react';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];
const MAPS_URL = 'https://maps.app.goo.gl/GF5S8i2vASmpA7jUA';

const STATUS_COLORS = {
  confirmed: 'text-emerald-300 bg-emerald-950/40 border-emerald-700/30',
  new: 'text-amber-300 bg-amber-950/40 border-amber-700/30',
  pending: 'text-amber-300 bg-amber-950/40 border-amber-700/30',
  cancelled_by_guest: 'text-red-300 bg-red-950/40 border-red-800/30',
  cancelled_by_staff: 'text-red-300 bg-red-950/40 border-red-800/30',
  completed: 'text-white/35 bg-white/5 border-white/8',
  no_show: 'text-red-400/50 bg-red-950/20 border-red-900/15',
};

const STATUS_LABEL = {
  de: { confirmed: 'Bestätigt', new: 'Neu', pending: 'Ausstehend', completed: 'Abgeschlossen', cancelled_by_guest: 'Storniert', cancelled_by_staff: 'Storniert', no_show: 'Nicht erschienen' },
  en: { confirmed: 'Confirmed', new: 'New', pending: 'Pending', completed: 'Completed', cancelled_by_guest: 'Cancelled', cancelled_by_staff: 'Cancelled', no_show: 'No Show' },
};

export default function GuestAccount() {
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (auth) => {
      if (!auth) { base44.auth.redirectToLogin(window.location.href); return; }
      const u = await base44.auth.me();
      setUser(u);
      const [res, docs, msgs] = await Promise.all([
        base44.entities.RestaurantReservation.filter({ guest_email: u.email }, '-reservation_date', 20).catch(() => []),
        base44.entities.GuestDocument.filter({ user_email: u.email }, '-created_date', 10).catch(() => []),
        base44.entities.GuestMessage.filter({ user_email: u.email }, '-created_date', 10).catch(() => []),
      ]);
      setReservations(res);
      setDocuments(docs);
      setMessages(msgs);
      setLoading(false);
    });
  }, []);

  const t = {
    de: {
      welcome: 'Willkommen zurück', subtitle: 'Ihr persönlicher Bereich',
      logout: 'Abmelden', admin_label: 'Admin-Dashboard',
      quick_reserve: 'Tisch reservieren', quick_rooms: 'Zimmer buchen', quick_voucher: 'Gutschein',
      my_reservations: 'Meine Reservierungen',
      view_all: 'Alle anzeigen →', no_reservations: 'Noch keine Reservierungen',
      upcoming: 'Bevorstehend',
      nav_profile: 'Profil & Einstellungen', nav_profile_desc: 'Name, Adresse, Ernährungshinweise',
      nav_messages: 'Nachrichten', nav_messages_desc: 'Anfragen an das Team',
      nav_docs: 'Dokumente', nav_docs_desc: 'Sicher hochladen & verwalten',
      nav_reservations: 'Reservierungen & Buchungen', nav_reservations_desc: 'Restaurant & Hotel verwalten',
      location_cta: 'Route planen', location_maps: 'In Maps öffnen',
      contact_us: 'Kontakt', discover: 'Region entdecken',
    },
    en: {
      welcome: 'Welcome back', subtitle: 'Your personal area',
      logout: 'Sign Out', admin_label: 'Admin Dashboard',
      quick_reserve: 'Reserve Table', quick_rooms: 'Book Room', quick_voucher: 'Voucher',
      my_reservations: 'My Reservations',
      view_all: 'View all →', no_reservations: 'No reservations yet',
      upcoming: 'Upcoming',
      nav_profile: 'Profile & Settings', nav_profile_desc: 'Name, address, dietary notes',
      nav_messages: 'Messages', nav_messages_desc: 'Communications with the team',
      nav_docs: 'Documents', nav_docs_desc: 'Securely upload & manage',
      nav_reservations: 'Reservations & Bookings', nav_reservations_desc: 'Manage restaurant & hotel bookings',
      location_cta: 'Get Directions', location_maps: 'Open in Maps',
      contact_us: 'Contact', discover: 'Explore Region',
    },
    it: {
      welcome: 'Bentornato', subtitle: 'La tua area personale',
      logout: 'Esci', admin_label: 'Admin Dashboard',
      quick_reserve: 'Prenota tavolo', quick_rooms: 'Prenota camera', quick_voucher: 'Voucher',
      my_reservations: 'Le mie prenotazioni',
      view_all: 'Vedi tutti →', no_reservations: 'Nessuna prenotazione',
      upcoming: 'Prossime',
      nav_profile: 'Profilo', nav_profile_desc: 'Nome, indirizzo, preferenze',
      nav_messages: 'Messaggi', nav_messages_desc: 'Comunicazioni con il team',
      nav_docs: 'Documenti', nav_docs_desc: 'Carica e gestisci',
      nav_reservations: 'Prenotazioni', nav_reservations_desc: 'Ristorante & camere',
      location_cta: 'Come raggiungerci', location_maps: 'Apri in Maps',
      contact_us: 'Contatti', discover: 'Esplora',
    },
  };
  const c = t[lang] || t.de;
  const sl = STATUS_LABEL[lang] || STATUS_LABEL.de;

  if (loading) return (
    <div className="min-h-screen bg-[#0F0E0B] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full animate-spin mx-auto mb-4" />
        <p className="font-display text-lg font-light text-ivory/30 tracking-widest">Krone Langenburg</p>
      </div>
    </div>
  );

  const isAdmin = user && (ADMIN_EMAILS.includes(user.email) || user.role === 'admin');
  const newMessages = messages.filter(m => m.status === 'new').length;
  const today = new Date().toISOString().split('T')[0];
  const upcoming = reservations.filter(r => r.reservation_date >= today && !['cancelled_by_guest','cancelled_by_staff','no_show'].includes(r.status));

  return (
    <div className="min-h-screen bg-[#0F0E0B] text-white pt-[128px] lg:pt-[170px] pb-28 lg:pb-12">

      {/* ── HERO BAND ── */}
      <div className="relative overflow-hidden bg-[#171411] border-b border-[#C9A96E]/10">
        {/* Subtle background image */}
        <img
          src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center opacity-8 pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#171411]/95 via-[#171411]/80 to-[#171411]/95" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-5 py-8 sm:py-12 flex items-start justify-between gap-4">
          <div>
            <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body mb-2">{c.welcome}</p>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-light text-white leading-tight">
              {user?.full_name || user?.email?.split('@')[0]}
            </h1>
            <p className="text-white/35 text-xs font-body mt-1.5 truncate max-w-[220px] sm:max-w-sm">{user?.email}</p>
            <p className="text-white/20 text-[10px] font-body mt-1 tracking-widest">Krone Langenburg by Ammesso</p>
          </div>
          <button
            onClick={() => base44.auth.logout('/')}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs font-body transition-colors flex-shrink-0 py-2 px-3 rounded-xl border border-white/8 hover:border-white/18 mt-1">
            <LogOut className="w-3.5 h-3.5" /> {c.logout}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-5 pt-7">

        {/* Admin shortcut */}
        {isAdmin && (
          <Link to="/admin"
            className="mb-5 flex items-center justify-between border border-[#C9A96E]/25 bg-[#C9A96E]/8 rounded-2xl p-4 hover:bg-[#C9A96E]/12 transition-colors group">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 text-[#C9A96E]" />
              <span className="text-[#C9A96E] text-sm font-body font-semibold">{c.admin_label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#C9A96E]/50 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-7">
          {[
            { to: '/reserve', icon: UtensilsCrossed, label: c.quick_reserve },
            { to: '/rooms', icon: BedDouble, label: c.quick_rooms },
            { to: '/shop', icon: Gift, label: c.quick_voucher },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="bg-[#171411] border border-white/8 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-2.5 hover:border-[#C9A96E]/30 hover:bg-[#C9A96E]/5 transition-all group text-center">
              <div className="w-10 h-10 rounded-full bg-[#C9A96E]/12 border border-[#C9A96E]/15 flex items-center justify-center group-hover:bg-[#C9A96E]/20 transition-colors">
                <item.icon className="w-4.5 h-4.5 text-[#C9A96E]" />
              </div>
              <span className="text-white/45 text-[10px] sm:text-xs font-body group-hover:text-white/75 transition-colors leading-tight text-center">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Nav sections */}
        <div className="space-y-2 mb-8">
          {[
            { to: '/account/reservations', icon: Calendar, label: c.nav_reservations, desc: c.nav_reservations_desc },
            { to: '/account/profile', icon: Settings, label: c.nav_profile, desc: c.nav_profile_desc },
            { to: '/account/messages', icon: MessageSquare, label: c.nav_messages, desc: c.nav_messages_desc, badge: newMessages > 0 ? newMessages : null },
            { to: '/account/documents', icon: FileText, label: c.nav_docs, desc: c.nav_docs_desc, badge: documents.length > 0 ? documents.length : null },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="bg-[#171411] border border-white/8 rounded-2xl p-4 sm:p-5 flex items-center justify-between hover:border-[#C9A96E]/25 hover:bg-[#C9A96E]/4 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-white/4 border border-white/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9A96E]/10 group-hover:border-[#C9A96E]/20 transition-colors">
                  <item.icon className="w-4.5 h-4.5 text-[#C9A96E]/60 group-hover:text-[#C9A96E] transition-colors" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-body font-semibold">{item.label}</p>
                  <p className="text-white/30 text-xs font-body mt-0.5">{item.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.badge && (
                  <span className="px-2 py-0.5 bg-[#C9A96E]/15 text-[#C9A96E] text-[10px] rounded-full font-body font-semibold border border-[#C9A96E]/25">{item.badge}</span>
                )}
                <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-[#C9A96E] transition-colors group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* Upcoming reservations */}
        {upcoming.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white/30 text-[10px] tracking-[0.35em] uppercase font-body flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#C9A96E]/50" /> {c.upcoming}
              </h2>
              <Link to="/account/reservations" className="text-[#C9A96E]/60 hover:text-[#C9A96E] text-[10px] font-body tracking-wider transition-colors font-semibold">{c.view_all}</Link>
            </div>
            <div className="space-y-2">
              {upcoming.slice(0, 3).map(r => (
                <div key={r.id} className="bg-[#171411] border border-white/8 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 hover:border-[#C9A96E]/20 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#C9A96E]/12 border border-[#C9A96E]/20 flex flex-col items-center justify-center flex-shrink-0">
                      <p className="text-[#C9A96E] text-base font-body font-bold leading-none">{r.reservation_date?.split('-')[2]}</p>
                      <p className="text-[#C9A96E]/50 text-[9px] font-body leading-none mt-0.5">
                        {new Date(r.reservation_date + 'T00:00:00').toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { month: 'short' })}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/75 text-sm font-body font-medium">{r.reservation_time} · {r.party_size} {lang === 'de' ? 'Pers.' : lang === 'en' ? 'guests' : 'pers.'}</p>
                      <p className="text-white/25 text-xs font-body truncate mt-0.5">{r.reservation_ref || '—'}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-semibold border uppercase tracking-wider flex-shrink-0 ${STATUS_COLORS[r.status] || 'text-white/40 bg-white/5 border-white/10'}`}>
                    {sl[r.status] || r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LOCATION CARD ── */}
        <div className="bg-[#171411] border border-white/8 rounded-2xl overflow-hidden mb-6 hover:border-[#C9A96E]/15 transition-colors">
          <div className="relative h-48 overflow-hidden">
            <img
              src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/69a6d105a_krone-dz-aussicht-talblick-01.jpg"
              alt="Blick auf Langenburg — Krone Langenburg by Ammesso"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0B]/95 via-[#0F0E0B]/30 to-transparent" />
            {/* Stars */}
            <div className="absolute top-4 right-4 flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#C9A96E] text-[#C9A96E]" />)}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-display text-lg font-light leading-tight">Krone Langenburg <span className="text-[#C9A96E]">by Ammesso</span></p>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3 h-3 text-[#C9A96E]/60 flex-shrink-0" />
                <span className="text-white/45 text-xs font-body">Hauptstraße 24 · 74595 Langenburg</span>
              </div>
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 gap-2">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#8B6914] to-[#C9A96E] hover:from-[#9A7520] hover:to-[#D4B87C] text-white rounded-xl text-xs tracking-widest uppercase font-body font-bold transition-all shadow-md hover:-translate-y-0.5">
              <Navigation className="w-3.5 h-3.5" /> {c.location_cta}
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 border border-[#C9A96E]/25 text-[#C9A96E]/70 hover:text-[#C9A96E] hover:border-[#C9A96E]/50 rounded-xl text-xs tracking-widest uppercase font-body font-semibold transition-all">
              <MapPin className="w-3.5 h-3.5" /> {c.location_maps}
            </a>
          </div>
        </div>

        {/* ── BOTTOM LINKS ── */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Link to="/contact"
            className="bg-[#171411] border border-white/8 rounded-2xl p-4 flex items-center gap-3 hover:border-[#C9A96E]/20 transition-all group">
            <div className="w-8 h-8 rounded-full bg-white/4 flex items-center justify-center flex-shrink-0">
              <Mail className="w-3.5 h-3.5 text-[#C9A96E]/50 group-hover:text-[#C9A96E] transition-colors" />
            </div>
            <span className="text-white/45 text-xs font-body group-hover:text-white/70 transition-colors">{c.contact_us}</span>
          </Link>
          <Link to="/discover"
            className="bg-[#171411] border border-white/8 rounded-2xl p-4 flex items-center gap-3 hover:border-[#C9A96E]/20 transition-all group">
            <div className="w-8 h-8 rounded-full bg-white/4 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#C9A96E]/50 group-hover:text-[#C9A96E] transition-colors" />
            </div>
            <span className="text-white/45 text-xs font-body group-hover:text-white/70 transition-colors">{c.discover}</span>
          </Link>
        </div>

      </div>
    </div>
  );
}