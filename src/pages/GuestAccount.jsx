import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { User, FileText, MessageSquare, UtensilsCrossed, BedDouble, LogOut, ChevronRight, Settings, LayoutDashboard, Calendar, Gift, Star, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const STATUS_COLORS = {
  confirmed: 'text-[#17352C] bg-[#17352C]/10 border-[#17352C]/20',
  new: 'text-[#A47A12] bg-[#A47A12]/10 border-[#A47A12]/20',
  pending: 'text-[#A47A12] bg-[#A47A12]/10 border-[#A47A12]/20',
  cancelled_by_guest: 'text-[#B42318] bg-[#B42318]/8 border-[#B42318]/15',
  cancelled_by_staff: 'text-[#B42318] bg-[#B42318]/8 border-[#B42318]/15',
  completed: 'text-[#5F5A52] bg-[#5F5A52]/8 border-[#5F5A52]/15',
  no_show: 'text-[#B42318]/70 bg-[#B42318]/5 border-[#B42318]/10',
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
      welcome: 'Willkommen zurück', subtitle: 'Ihr persönlicher Bereich bei Krone Langenburg',
      logout: 'Abmelden', admin_label: 'Admin-Dashboard',
      quick_reserve: 'Tisch reservieren', quick_rooms: 'Zimmer buchen', quick_voucher: 'Gutschein kaufen',
      my_reservations: 'Meine Reservierungen', my_documents: 'Dokumente', my_messages: 'Nachrichten',
      view_all: 'Alle anzeigen →', no_reservations: 'Noch keine Reservierungen',
      upcoming: 'Bevorstehende Reservierungen', past: 'Vergangen',
      nav_profile: 'Profil & Einstellungen', nav_profile_desc: 'Name, Adresse, Ernährungshinweise',
      nav_messages: 'Nachrichten', nav_messages_desc: 'Anfragen an das Team',
      nav_docs: 'Dokumente', nav_docs_desc: 'Sicher hochladen & verwalten',
      nav_reservations: 'Reservierungen & Buchungen', nav_reservations_desc: 'Restaurant & Hotelzimmer verwalten',
    },
    en: {
      welcome: 'Welcome back', subtitle: 'Your personal area at Krone Langenburg',
      logout: 'Sign Out', admin_label: 'Admin Dashboard',
      quick_reserve: 'Reserve a Table', quick_rooms: 'Book a Room', quick_voucher: 'Buy Voucher',
      my_reservations: 'My Reservations', my_documents: 'Documents', my_messages: 'Messages',
      view_all: 'View all →', no_reservations: 'No reservations yet',
      upcoming: 'Upcoming Reservations', past: 'Past',
      nav_profile: 'Profile & Settings', nav_profile_desc: 'Name, address, dietary notes',
      nav_messages: 'Messages', nav_messages_desc: 'Communications with the team',
      nav_docs: 'Documents', nav_docs_desc: 'Securely upload & manage',
      nav_reservations: 'Reservations & Bookings', nav_reservations_desc: 'Manage restaurant & hotel bookings',
    },
    it: {
      welcome: 'Bentornato', subtitle: 'La tua area personale presso Krone Langenburg',
      logout: 'Esci', admin_label: 'Admin Dashboard',
      quick_reserve: 'Prenota un tavolo', quick_rooms: 'Prenota camera', quick_voucher: 'Acquista voucher',
      my_reservations: 'Le mie prenotazioni', my_documents: 'Documenti', my_messages: 'Messaggi',
      view_all: 'Vedi tutti →', no_reservations: 'Nessuna prenotazione',
      upcoming: 'Prenotazioni future', past: 'Passato',
      nav_profile: 'Profilo', nav_profile_desc: 'Nome, indirizzo, preferenze',
      nav_messages: 'Messaggi', nav_messages_desc: 'Comunicazioni con il team',
      nav_docs: 'Documenti', nav_docs_desc: 'Carica e gestisci',
      nav_reservations: 'Prenotazioni', nav_reservations_desc: 'Ristorante & camere',
    },
  };
  const c = t[lang] || t.de;

  if (loading) return (
    <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#A47A12]/20 border-t-[#A47A12] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#5F5A52] text-sm font-body">…</p>
      </div>
    </div>
  );

  const isAdmin = user && (ADMIN_EMAILS.includes(user.email) || user.role === 'admin');
  const newMessages = messages.filter(m => m.status === 'new').length;
  const today = new Date().toISOString().split('T')[0];
  const upcoming = reservations.filter(r => r.reservation_date >= today && !['cancelled_by_guest','cancelled_by_staff','no_show'].includes(r.status));

  return (
    <div className="min-h-screen bg-[#F7F2EA] text-[#151515] pt-16 sm:pt-20 pb-28 lg:pb-10">

      {/* Hero band */}
      <div className="bg-[#17352C] border-b border-[#17352C]">
        <div className="max-w-3xl mx-auto px-4 sm:px-5 py-7 sm:py-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-[#C9A96E] text-[10px] tracking-[0.45em] uppercase font-body mb-1.5">{c.welcome}</p>
            <h1 className="font-display text-2xl sm:text-3xl font-light text-white leading-tight">
              {user?.full_name || user?.email?.split('@')[0]}
            </h1>
            <p className="text-white/50 text-xs font-body mt-1 truncate max-w-[200px] sm:max-w-xs">{user?.email}</p>
          </div>
          <button
            onClick={() => base44.auth.logout('/')}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs font-body transition-colors flex-shrink-0 py-2 px-3 rounded-lg border border-transparent hover:border-white/15 mt-1">
            <LogOut className="w-3.5 h-3.5" /> {c.logout}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-5 pt-6">

        {/* Admin shortcut */}
        {isAdmin && (
          <Link to="/admin"
            className="mb-5 flex items-center justify-between border border-[#A47A12]/30 bg-[#A47A12]/8 rounded-2xl p-4 hover:bg-[#A47A12]/12 transition-colors group">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 text-[#A47A12]" />
              <span className="text-[#A47A12] text-sm font-body font-semibold">{c.admin_label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A47A12]/50 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          {[
            { to: '/reserve', icon: UtensilsCrossed, label: c.quick_reserve },
            { to: '/rooms', icon: BedDouble, label: c.quick_rooms },
            { to: '/shop', icon: Gift, label: c.quick_voucher },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="bg-white border border-[#E8DED0] rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-[#A47A12]/40 hover:shadow-md transition-all group text-center shadow-sm">
              <div className="w-9 h-9 rounded-full bg-[#A47A12]/10 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-[#A47A12] group-hover:text-[#8B6914] transition-colors" />
              </div>
              <span className="text-[#5F5A52] text-[10px] sm:text-xs font-body group-hover:text-[#151515] transition-colors leading-tight text-center">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Nav sections */}
        <div className="space-y-2 mb-7">
          {[
            { to: '/account/reservations', icon: Calendar, label: c.nav_reservations, desc: c.nav_reservations_desc },
            { to: '/account/profile', icon: Settings, label: c.nav_profile, desc: c.nav_profile_desc },
            { to: '/account/messages', icon: MessageSquare, label: c.nav_messages, desc: c.nav_messages_desc, badge: newMessages > 0 ? newMessages : null },
            { to: '/account/documents', icon: FileText, label: c.nav_docs, desc: c.nav_docs_desc, badge: documents.length > 0 ? documents.length : null },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="bg-white border border-[#E8DED0] rounded-2xl p-4 flex items-center justify-between hover:border-[#A47A12]/40 hover:shadow-md transition-all group shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F7F2EA] border border-[#E8DED0] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4.5 h-4.5 text-[#A47A12] group-hover:text-[#8B6914] transition-colors" />
                </div>
                <div>
                  <p className="text-[#151515] text-sm font-body font-semibold">{item.label}</p>
                  <p className="text-[#5F5A52] text-xs font-body mt-0.5">{item.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2 py-0.5 bg-[#A47A12]/15 text-[#A47A12] text-[10px] rounded-full font-body font-semibold">{item.badge}</span>
                )}
                <ChevronRight className="w-4 h-4 text-[#5F5A52]/40 group-hover:text-[#A47A12] transition-colors group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* Upcoming reservations */}
        {upcoming.length > 0 && (
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[#5F5A52] text-[10px] tracking-[0.35em] uppercase font-body flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> {c.upcoming}
              </h2>
              <Link to="/account/reservations" className="text-[#A47A12] hover:text-[#8B6914] text-[10px] font-body tracking-wider transition-colors font-semibold">{c.view_all}</Link>
            </div>
            <div className="space-y-2">
              {upcoming.slice(0, 3).map(r => (
                <div key={r.id} className="bg-white border border-[#E8DED0] rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#17352C] flex flex-col items-center justify-center flex-shrink-0">
                      <p className="text-white text-sm font-body font-bold leading-none">{r.reservation_date?.split('-')[2]}</p>
                      <p className="text-white/60 text-[9px] font-body leading-none mt-0.5">{r.reservation_date?.split('-')[1]}/{r.reservation_date?.split('-')[0].slice(2)}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#151515] text-sm font-body font-medium">{r.reservation_time} · {r.party_size} {lang === 'de' ? 'Pers.' : lang === 'en' ? 'guests' : 'pers.'}</p>
                      <p className="text-[#5F5A52] text-xs font-body truncate">{r.reservation_ref}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-semibold border uppercase tracking-wider flex-shrink-0 ${STATUS_COLORS[r.status] || 'text-[#5F5A52] bg-[#5F5A52]/8 border-[#5F5A52]/15'}`}>
                    {r.status === 'confirmed' ? (lang === 'de' ? 'Bestätigt' : 'Confirmed') : (lang === 'de' ? 'Ausstehend' : 'Pending')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location teaser */}
        <div className="bg-white border border-[#E8DED0] rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="relative h-32 overflow-hidden">
            <img
              src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/a8e3a47b0_krone-kingsuite-1-zimmer-wohnbereich-02.jpg"
              alt="Krone Langenburg by Ammesso — Außenansicht"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17352C]/80 to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span className="text-white text-xs font-body">Hauptstraße 24 · 74595 Langenburg</span>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#A47A12] text-[#A47A12]" />)}
              <span className="text-[#5F5A52] text-xs font-body ml-2">Krone Langenburg by Ammesso</span>
            </div>
            <Link to="/discover" className="text-[#A47A12] hover:text-[#8B6914] text-[10px] font-body tracking-wider transition-colors font-semibold">
              {lang === 'de' ? 'Entdecken →' : lang === 'en' ? 'Discover →' : 'Scopri →'}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}