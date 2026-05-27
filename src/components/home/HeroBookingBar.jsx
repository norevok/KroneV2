/**
 * HeroBookingBar — Marriott-style floating booking bar
 * Solid white background, destination pill selected (like Marriott.com)
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
    de: {
      eyebrow: 'Ihr nächstes Ziel',
      dest_value: 'Krone Langenburg',
      dest_sub: 'Langenburg, Deutschland',
      checkin: 'Anreise',
      checkout: 'Abreise',
      guests: 'Gäste',
      cta: 'Verfügbarkeit prüfen',
      adults_label: 'Erw.',
      night: 'Nacht',
      nights: 'Nächte',
      select_date: 'Datum wählen',
      adults_full: 'Erwachsene',
    },
    en: {
      eyebrow: 'Your next destination',
      dest_value: 'Krone Langenburg',
      dest_sub: 'Langenburg, Germany',
      checkin: 'Check-in',
      checkout: 'Check-out',
      guests: 'Guests',
      cta: 'Check Availability',
      adults_label: 'Adults',
      night: 'Night',
      nights: 'Nights',
      select_date: 'Select date',
      adults_full: 'Adults',
    },
    it: {
      eyebrow: 'La vostra prossima destinazione',
      dest_value: 'Krone Langenburg',
      dest_sub: 'Langenburg, Germania',
      checkin: 'Arrivo',
      checkout: 'Partenza',
      guests: 'Ospiti',
      cta: 'Verifica disponibilità',
      adults_label: 'Adulti',
      night: 'Notte',
      nights: 'Notti',
      select_date: 'Seleziona data',
      adults_full: 'Adulti',
    },
    es: {
      eyebrow: 'Su próximo destino',
      dest_value: 'Krone Langenburg',
      dest_sub: 'Langenburg, Alemania',
      checkin: 'Llegada',
      checkout: 'Salida',
      guests: 'Huéspedes',
      cta: 'Comprobar disponibilidad',
      adults_label: 'Adultos',
      night: 'Noche',
      nights: 'Noches',
      select_date: 'Seleccionar fecha',
      adults_full: 'Adultos',
    },
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

        {/* ── DESKTOP ── */}
        <div className="hidden md:flex flex-col bg-[#0F0E0B]/85 backdrop-blur-xl rounded-2xl overflow-hidden border border-[#C9A96E]/20"
          style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.1)' }}>

          {/* Top — centered location header like Marriott */}
          <div className="px-6 pt-5 pb-4 border-b border-white/8 text-center">
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C9A96E]" />
              <p className="text-white font-body font-semibold text-sm tracking-wide">{c.dest_value} <span className="text-[#C9A96E]">by Ammesso</span></p>
            </div>
            <p className="text-white/35 text-[10px] font-body mt-0.5 tracking-widest">{c.dest_sub}</p>
          </div>

          <div className="flex items-stretch">
            {/* Check-in */}
            <div className="relative flex items-center gap-3 px-6 py-4 border-r border-white/8 flex-1 hover:bg-white/4 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-[#C9A96E]/10 group-hover:bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 transition-colors">
                <Calendar className="w-3.5 h-3.5 text-[#C9A96E]" />
              </div>
              <div className="w-full">
                <p className="text-[9px] font-body font-bold text-white/30 uppercase tracking-widest mb-0.5">{c.checkin}</p>
                <p className={`text-sm font-body font-semibold leading-tight ${checkIn ? 'text-white' : 'text-white/25'}`}>
                  {fmtDate(checkIn) || c.select_date}
                </p>
              </div>
              <input type="date" value={checkIn} min={today}
                onChange={e => handleCheckInChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            </div>

            {/* Nights badge */}
            {nights > 0 && (
              <div className="flex items-center justify-center px-4 border-r border-white/8 bg-[#C9A96E]/8 flex-shrink-0 min-w-[60px]">
                <div className="flex flex-col items-center">
                  <Moon className="w-3 h-3 text-[#C9A96E] mb-0.5" />
                  <span className="text-sm font-body font-bold text-[#C9A96E] leading-none">{nights}</span>
                  <span className="text-[8px] font-body text-white/30 leading-none">{nights === 1 ? c.night : c.nights}</span>
                </div>
              </div>
            )}

            {/* Check-out */}
            <div className="relative flex items-center gap-3 px-6 py-4 border-r border-white/8 flex-1 hover:bg-white/4 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-[#C9A96E]/10 group-hover:bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 transition-colors">
                <Calendar className="w-3.5 h-3.5 text-[#C9A96E]" />
              </div>
              <div className="w-full">
                <p className="text-[9px] font-body font-bold text-white/30 uppercase tracking-widest mb-0.5">{c.checkout}</p>
                <p className={`text-sm font-body font-semibold leading-tight ${checkOut ? 'text-white' : 'text-white/25'}`}>
                  {fmtDate(checkOut) || c.select_date}
                </p>
              </div>
              <input type="date" value={checkOut} min={checkoutMin}
                onChange={e => setCheckOut(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            </div>

            {/* Guests */}
            <div className="relative flex items-center gap-3 px-6 py-4 border-r border-white/8 min-w-[150px] hover:bg-white/4 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-[#C9A96E]/10 group-hover:bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 transition-colors">
                <Users className="w-3.5 h-3.5 text-[#C9A96E]" />
              </div>
              <div className="w-full">
                <p className="text-[9px] font-body font-bold text-white/30 uppercase tracking-widest mb-0.5">{c.guests}</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-body font-semibold text-white leading-tight">{adults} {c.adults_label}</span>
                  <ChevronDown className="w-3 h-3 text-white/30" />
                </div>
                <select value={adults} onChange={e => setAdults(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {c.adults_full}</option>)}
                </select>
              </div>
            </div>

            {/* CTA */}
            <button type="submit"
              className="px-8 bg-gradient-to-r from-[#8B6914] to-[#C9A96E] hover:from-[#9A7520] hover:to-[#D4B87C] text-white font-body font-bold text-[11px] tracking-[0.18em] uppercase transition-all flex items-center gap-2 flex-shrink-0 min-w-[180px] justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_0_24px_rgba(201,169,110,0.3)]">
              <Search className="w-4 h-4" />
              {c.cta}
            </button>
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="md:hidden bg-[#0F0E0B]/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-[#C9A96E]/20"
          style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

          {/* Destination header */}
          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-[#C9A96E]/8 border-b border-[#C9A96E]/15">
            <MapPin className="w-3.5 h-3.5 text-[#C9A96E] flex-shrink-0" />
            <div className="text-center">
              <p className="text-white text-xs font-body font-semibold leading-tight">{c.dest_value} <span className="text-[#C9A96E]">by Ammesso</span></p>
              <p className="text-white/35 text-[9px] font-body">{c.dest_sub}</p>
            </div>
          </div>

          {/* Date row */}
          <div className="grid grid-cols-2 divide-x divide-white/8">
            <div className="relative px-4 py-4 min-h-[68px] hover:bg-white/4 transition-colors">
              <p className="text-[9px] font-body font-bold text-white/30 uppercase tracking-widest mb-1">{c.checkin}</p>
              <p className={`text-base font-body font-bold leading-tight ${checkIn ? 'text-white' : 'text-white/25'}`}>
                {fmtDate(checkIn) || '——'}
              </p>
              <input type="date" value={checkIn} min={today}
                onChange={e => handleCheckInChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            </div>
            <div className="relative px-4 py-4 min-h-[68px] hover:bg-white/4 transition-colors">
              <p className="text-[9px] font-body font-bold text-white/30 uppercase tracking-widest mb-1">{c.checkout}</p>
              <p className={`text-base font-body font-bold leading-tight ${checkOut ? 'text-white' : 'text-white/25'}`}>
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

          {/* Guests row */}
          <div className="relative flex items-center gap-3 px-4 py-3 border-t border-white/8">
            <Users className="w-4 h-4 text-[#C9A96E]/60 flex-shrink-0" />
            <p className="text-[9px] font-body font-bold text-white/30 uppercase tracking-widest flex-shrink-0">{c.guests}:</p>
            <div className="flex items-center gap-1 flex-1">
              <span className="text-sm font-body font-semibold text-white">{adults} {c.adults_full}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/30" />
            </div>
            <select value={adults} onChange={e => setAdults(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 min-h-[44px]">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {c.adults_full}</option>)}
            </select>
          </div>

          {/* Search button */}
          <button type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#8B6914] to-[#C9A96E] hover:from-[#9A7520] hover:to-[#D4B87C] text-white font-body font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 min-h-[52px]">
            <Search className="w-4 h-4" />
            {c.cta}
          </button>
        </div>

      </form>
    </div>
  );
}