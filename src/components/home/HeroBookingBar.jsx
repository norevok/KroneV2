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
        <div className="hidden md:block bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.18)' }}>

          {/* Top label bar — like Marriott "Find your destination" */}
          <div className="px-5 pt-3 pb-0 border-b border-stone-100">
            <p className="text-[9px] font-body font-bold text-[#8B6914] uppercase tracking-[0.3em]">{c.eyebrow}</p>
          </div>

          <div className="flex items-stretch">
            {/* Destination — selected/highlighted like Marriott */}
            <div className="flex items-center gap-3 px-5 py-4 border-r border-stone-100 min-w-[200px] bg-[#F2E8D0]">
              <div className="w-9 h-9 rounded-full bg-[#8B6914] flex items-center justify-center flex-shrink-0 shadow-sm">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-body font-bold text-[#1C1714] leading-tight">{c.dest_value}</p>
                <p className="text-[10px] font-body text-[#8B6914]/70 leading-tight mt-0.5">{c.dest_sub}</p>
              </div>
              {/* "Selected" checkmark */}
              <div className="ml-auto w-5 h-5 rounded-full bg-[#8B6914] flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Check-in */}
            <div className="relative flex items-center gap-3 px-5 py-4 border-r border-stone-100 flex-1 min-w-[150px] hover:bg-stone-50 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-[#8B6914]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                <Calendar className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#8B6914] transition-colors" />
              </div>
              <div className="w-full">
                <p className="text-[9px] font-body font-bold text-stone-400 uppercase tracking-widest mb-0.5">{c.checkin}</p>
                <p className={`text-[14px] font-body font-semibold leading-tight ${checkIn ? 'text-[#1C1714]' : 'text-stone-300'}`}>
                  {fmtDate(checkIn) || c.select_date}
                </p>
              </div>
              <input
                type="date" value={checkIn} min={today}
                onChange={e => handleCheckInChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>

            {/* Nights badge */}
            {nights > 0 && (
              <div className="flex items-center justify-center px-3 border-r border-stone-100 bg-[#8B6914]/6 flex-shrink-0 min-w-[56px]">
                <div className="flex flex-col items-center">
                  <Moon className="w-3 h-3 text-[#8B6914] mb-0.5" />
                  <span className="text-[12px] font-body font-bold text-[#8B6914] leading-none">{nights}</span>
                  <span className="text-[8px] font-body text-stone-400 leading-none">{nights === 1 ? c.night : c.nights}</span>
                </div>
              </div>
            )}

            {/* Check-out */}
            <div className="relative flex items-center gap-3 px-5 py-4 border-r border-stone-100 flex-1 min-w-[150px] hover:bg-stone-50 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-[#8B6914]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                <Calendar className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#8B6914] transition-colors" />
              </div>
              <div className="w-full">
                <p className="text-[9px] font-body font-bold text-stone-400 uppercase tracking-widest mb-0.5">{c.checkout}</p>
                <p className={`text-[14px] font-body font-semibold leading-tight ${checkOut ? 'text-[#1C1714]' : 'text-stone-300'}`}>
                  {fmtDate(checkOut) || c.select_date}
                </p>
              </div>
              <input
                type="date" value={checkOut} min={checkoutMin}
                onChange={e => setCheckOut(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>

            {/* Guests */}
            <div className="relative flex items-center gap-3 px-5 py-4 border-r border-stone-100 min-w-[140px] hover:bg-stone-50 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-[#8B6914]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                <Users className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#8B6914] transition-colors" />
              </div>
              <div className="w-full">
                <p className="text-[9px] font-body font-bold text-stone-400 uppercase tracking-widest mb-0.5">{c.guests}</p>
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-body font-semibold text-[#1C1714] leading-tight">{adults} {c.adults_label}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <select value={adults} onChange={e => setAdults(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                  {[1,2,3,4,5,6].map(n => (
                    <option key={n} value={n}>{n} {c.adults_full}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* CTA */}
            <button type="submit"
              className="px-7 bg-[#8B6914] hover:bg-[#7A5A0F] text-white font-body font-bold text-[11px] tracking-[0.15em] uppercase transition-all flex items-center gap-2 flex-shrink-0 min-w-[170px] justify-center hover:shadow-lg">
              <Search className="w-4 h-4" />
              {c.cta}
            </button>
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="md:hidden bg-white rounded-2xl overflow-hidden border border-white/20"
          style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.15)' }}>

          {/* Destination pill */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#F2E8D0] border-b border-[#C9A96E]/20">
            <div className="w-7 h-7 rounded-full bg-[#8B6914] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-body font-bold text-[#1C1714] leading-tight">{c.dest_value}</p>
              <p className="text-[9px] font-body text-[#8B6914]/70">{c.dest_sub}</p>
            </div>
            <div className="w-4 h-4 rounded-full bg-[#8B6914] flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Date row */}
          <div className="grid grid-cols-2 divide-x divide-stone-100">
            <div className="relative px-4 py-4 bg-white min-h-[68px] hover:bg-stone-50 transition-colors">
              <p className="text-[9px] font-body font-bold text-stone-400 uppercase tracking-widest mb-1">{c.checkin}</p>
              <p className={`text-base font-body font-bold leading-tight ${checkIn ? 'text-[#1C1714]' : 'text-stone-300'}`}>
                {fmtDate(checkIn) || '——'}
              </p>
              <input type="date" value={checkIn} min={today}
                onChange={e => handleCheckInChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            </div>
            <div className="relative px-4 py-4 bg-white min-h-[68px] hover:bg-stone-50 transition-colors">
              <p className="text-[9px] font-body font-bold text-stone-400 uppercase tracking-widest mb-1">{c.checkout}</p>
              <p className={`text-base font-body font-bold leading-tight ${checkOut ? 'text-[#1C1714]' : 'text-stone-300'}`}>
                {fmtDate(checkOut) || '——'}
              </p>
              {nights > 0 && (
                <span className="absolute top-2 right-3 text-[9px] font-body font-bold text-[#8B6914] bg-[#8B6914]/10 rounded-full px-1.5 py-0.5">
                  {nights} {nights === 1 ? c.night : c.nights}
                </span>
              )}
              <input type="date" value={checkOut} min={checkoutMin}
                onChange={e => setCheckOut(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            </div>
          </div>

          {/* Guests row */}
          <div className="relative flex items-center gap-3 px-4 py-3 border-t border-stone-100 bg-white">
            <Users className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <p className="text-[9px] font-body font-bold text-stone-400 uppercase tracking-widest flex-shrink-0">{c.guests}:</p>
            <div className="flex items-center gap-1 flex-1">
              <span className="text-sm font-body font-semibold text-[#1C1714]">{adults} {c.adults_full}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </div>
            <select value={adults} onChange={e => setAdults(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 min-h-[44px]">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {c.adults_full}</option>)}
            </select>
          </div>

          {/* Search button */}
          <button type="submit"
            className="w-full py-4 bg-[#8B6914] hover:bg-[#7A5A0F] active:bg-[#6A4A0A] text-white font-body font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 min-h-[52px]">
            <Search className="w-4 h-4" />
            {c.cta}
          </button>
        </div>

      </form>
    </div>
  );
}