/**
 * HeroBookingBar — Rebuilt for correct proportions & no text clipping
 * Marriott-style dark glass bar — all text always fully visible
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Search, MapPin, Moon, ChevronDown } from 'lucide-react';

export default function HeroBookingBar({ lang = 'de' }) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState('2');

  const t = {
    de: { dest_value: 'Krone Langenburg', dest_sub: 'Langenburg, Deutschland', checkin: 'Anreise', checkout: 'Abreise', guests: 'Gäste', cta: 'Verfügbarkeit prüfen', adults_full: 'Erwachsene', night: 'Nacht', nights: 'Nächte', select_date: 'Datum wählen' },
    en: { dest_value: 'Krone Langenburg', dest_sub: 'Langenburg, Germany', checkin: 'Check-in', checkout: 'Check-out', guests: 'Guests', cta: 'Check Availability', adults_full: 'Adults', night: 'Night', nights: 'Nights', select_date: 'Select date' },
    it: { dest_value: 'Krone Langenburg', dest_sub: 'Langenburg, Germania', checkin: 'Arrivo', checkout: 'Partenza', guests: 'Ospiti', cta: 'Verifica disponibilità', adults_full: 'Adulti', night: 'Notte', nights: 'Notti', select_date: 'Seleziona data' },
    es: { dest_value: 'Krone Langenburg', dest_sub: 'Langenburg, Alemania', checkin: 'Llegada', checkout: 'Salida', guests: 'Huéspedes', cta: 'Comprobar disponibilidad', adults_full: 'Adultos', night: 'Noche', nights: 'Noches', select_date: 'Seleccionar fecha' },
  };
  const c = t[lang] || t.de;

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set('checkin', checkIn);
    if (checkOut) params.set('checkout', checkOut);
    if (adults) params.set('adults', adults);
    navigate(`/booking?${params.toString()}`);
  }

  function handleCheckInChange(val) {
    setCheckIn(val);
    if (val) {
      const next = new Date(val + 'T00:00:00');
      next.setDate(next.getDate() + 1);
      const nextStr = next.toISOString().split('T')[0];
      if (!checkOut || checkOut <= val) setCheckOut(nextStr);
    }
  }

  const checkoutMin = checkIn
    ? (() => { const d = new Date(checkIn + 'T00:00:00'); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })()
    : tomorrow;

  const nights = (checkIn && checkOut)
    ? Math.max(0, Math.round((new Date(checkOut + 'T00:00:00') - new Date(checkIn + 'T00:00:00')) / 86400000))
    : 0;

  function fmtDate(val) {
    if (!val) return null;
    const d = new Date(val + 'T00:00:00');
    return d.toLocaleDateString(
      lang === 'de' ? 'de-DE' : lang === 'it' ? 'it-IT' : lang === 'es' ? 'es-ES' : 'en-GB',
      { day: '2-digit', month: 'short' }
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSearch}>

        {/* ── DESKTOP (md+) ── */}
        <div className="hidden md:block bg-[#0D0C09]/88 backdrop-blur-xl rounded-2xl border border-[#C9A96E]/20 overflow-hidden"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,169,110,0.08)' }}>

          {/* Destination header row */}
          <div className="flex items-center justify-center gap-2 px-6 py-2.5 border-b border-white/6 bg-[#C9A96E]/5">
            <MapPin className="w-3 h-3 text-[#C9A96E] flex-shrink-0" />
            <p className="text-white/80 font-body font-medium text-xs tracking-wide whitespace-nowrap">
              Krone Langenburg <span className="text-white/35 font-normal">· Hauptstraße 24 · 74595 Langenburg</span>
            </p>
          </div>

          {/* Fields row */}
          <div className="flex items-stretch min-h-[68px]">

            {/* Check-in */}
            <div className="relative flex items-center gap-3 px-5 py-3 border-r border-white/8 flex-1 hover:bg-white/4 transition-colors cursor-pointer group min-w-0">
              <Calendar className="w-4 h-4 text-[#C9A96E] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-body font-bold text-white/30 uppercase tracking-widest mb-0.5 whitespace-nowrap">{c.checkin}</p>
                <p className={`text-sm font-body font-semibold leading-tight truncate ${checkIn ? 'text-white' : 'text-white/25'}`}>
                  {fmtDate(checkIn) || c.select_date}
                </p>
              </div>
              <input type="date" value={checkIn} min={today}
                onChange={e => handleCheckInChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            </div>

            {/* Nights badge — only shown if > 0 */}
            {nights > 0 && (
              <div className="flex items-center justify-center px-4 border-r border-white/8 bg-[#C9A96E]/6 flex-shrink-0">
                <div className="flex flex-col items-center gap-0.5">
                  <Moon className="w-3 h-3 text-[#C9A96E]" />
                  <span className="text-[#C9A96E] text-sm font-body font-bold leading-none">{nights}</span>
                  <span className="text-white/25 text-[8px] font-body leading-none whitespace-nowrap">{nights === 1 ? c.night : c.nights}</span>
                </div>
              </div>
            )}

            {/* Check-out */}
            <div className="relative flex items-center gap-3 px-5 py-3 border-r border-white/8 flex-1 hover:bg-white/4 transition-colors cursor-pointer group min-w-0">
              <Calendar className="w-4 h-4 text-[#C9A96E] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-body font-bold text-white/30 uppercase tracking-widest mb-0.5 whitespace-nowrap">{c.checkout}</p>
                <p className={`text-sm font-body font-semibold leading-tight truncate ${checkOut ? 'text-white' : 'text-white/25'}`}>
                  {fmtDate(checkOut) || c.select_date}
                </p>
              </div>
              <input type="date" value={checkOut} min={checkoutMin}
                onChange={e => setCheckOut(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            </div>

            {/* Guests */}
            <div className="relative flex items-center gap-3 px-5 py-3 border-r border-white/8 w-36 flex-shrink-0 hover:bg-white/4 transition-colors group">
              <Users className="w-4 h-4 text-[#C9A96E] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-body font-bold text-white/30 uppercase tracking-widest mb-0.5 whitespace-nowrap">{c.guests}</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-body font-semibold text-white leading-tight">{adults}</span>
                  <ChevronDown className="w-3 h-3 text-white/30 flex-shrink-0" />
                </div>
              </div>
              <select value={adults} onChange={e => setAdults(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {c.adults_full}</option>)}
              </select>
            </div>

            {/* CTA — fixed min-width so text never clips */}
            <button type="submit"
              className="flex items-center justify-center gap-2 px-6 bg-gradient-to-r from-[#A47A12] to-[#D2AD63] hover:from-[#B68A1A] hover:to-[#DDB96E] text-white font-body font-bold text-[11px] tracking-[0.15em] uppercase transition-all flex-shrink-0 min-w-[172px] hover:shadow-[0_0_24px_rgba(201,169,110,0.35)] active:scale-[0.98]"
              style={{ transition: 'all 250ms ease' }}>
              <Search className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{c.cta}</span>
            </button>
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="md:hidden bg-[#0D0C09]/90 backdrop-blur-xl rounded-2xl border border-[#C9A96E]/20 overflow-hidden"
          style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.55)' }}>

          {/* Destination */}
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C9A96E]/8 border-b border-[#C9A96E]/15">
            <MapPin className="w-3 h-3 text-[#C9A96E] flex-shrink-0" />
            <p className="text-white/80 text-xs font-body font-medium">Krone Langenburg · Langenburg</p>
          </div>

          {/* Date row */}
          <div className="grid grid-cols-2 divide-x divide-white/8">
            <div className="relative px-4 py-4">
              <p className="text-[9px] font-body font-bold text-white/30 uppercase tracking-widest mb-1">{c.checkin}</p>
              <p className={`text-sm font-body font-bold leading-tight ${checkIn ? 'text-white' : 'text-white/25'}`}>
                {fmtDate(checkIn) || '——'}
              </p>
              <input type="date" value={checkIn} min={today}
                onChange={e => handleCheckInChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            </div>
            <div className="relative px-4 py-4">
              <p className="text-[9px] font-body font-bold text-white/30 uppercase tracking-widest mb-1">{c.checkout}</p>
              <p className={`text-sm font-body font-bold leading-tight ${checkOut ? 'text-white' : 'text-white/25'}`}>
                {fmtDate(checkOut) || '——'}
              </p>
              {nights > 0 && (
                <span className="absolute top-2 right-3 text-[9px] font-body font-bold text-[#C9A96E] bg-[#C9A96E]/12 rounded-full px-1.5 py-0.5">
                  {nights} {nights === 1 ? c.night : c.nights}
                </span>
              )}
              <input type="date" value={checkOut} min={checkoutMin}
                onChange={e => setCheckOut(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            </div>
          </div>

          {/* Guests */}
          <div className="relative flex items-center gap-3 px-4 py-3 border-t border-white/8">
            <Users className="w-4 h-4 text-[#C9A96E]/60 flex-shrink-0" />
            <p className="text-[9px] font-body font-bold text-white/30 uppercase tracking-widest flex-shrink-0">{c.guests}:</p>
            <div className="flex items-center gap-1 flex-1">
              <span className="text-sm font-body font-semibold text-white">{adults} {c.adults_full}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/30" />
            </div>
            <select value={adults} onChange={e => setAdults(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {c.adults_full}</option>)}
            </select>
          </div>

          {/* Search CTA */}
          <button type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#A47A12] to-[#D2AD63] hover:from-[#B68A1A] hover:to-[#DDB96E] text-white font-body font-bold text-sm tracking-[0.12em] uppercase flex items-center justify-center gap-2 min-h-[52px]"
            style={{ transition: 'all 250ms ease' }}>
            <Search className="w-4 h-4 flex-shrink-0" />
            <span>{c.cta}</span>
          </button>
        </div>

      </form>
    </div>
  );
}