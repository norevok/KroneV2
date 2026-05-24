/**
 * HeroBookingBar — Marriott-style floating booking search box
 * Sits over the hero, passes dates to /booking with Beds24 URL params
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Search, MapPin } from 'lucide-react';

export default function HeroBookingBar({ lang = 'de' }) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState('2');

  const t = {
    de: {
      destination: 'Reiseziel',
      dest_value: 'Langenburg, Deutschland',
      checkin: 'Anreise',
      checkout: 'Abreise',
      guests: 'Gäste',
      cta: 'Zimmer suchen',
      adults_label: 'Erwachsene',
    },
    en: {
      destination: 'Destination',
      dest_value: 'Langenburg, Germany',
      checkin: 'Check-in',
      checkout: 'Check-out',
      guests: 'Guests',
      cta: 'Search Rooms',
      adults_label: 'Adults',
    },
    it: {
      destination: 'Destinazione',
      dest_value: 'Langenburg, Germania',
      checkin: 'Arrivo',
      checkout: 'Partenza',
      guests: 'Ospiti',
      cta: 'Cerca camere',
      adults_label: 'Adulti',
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

  // Auto-set checkout to next day when checkin is selected
  function handleCheckInChange(val) {
    setCheckIn(val);
    if (val) {
      const next = new Date(val);
      next.setDate(next.getDate() + 1);
      const nextStr = next.toISOString().split('T')[0];
      if (!checkOut || checkOut <= val) setCheckOut(nextStr);
    }
  }

  const checkoutMin = checkIn
    ? (() => { const d = new Date(checkIn); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })()
    : tomorrow;

  // Format date nicely for display overlay
  function fmtDate(val) {
    if (!val) return null;
    const d = new Date(val + 'T00:00:00');
    return d.toLocaleDateString(lang === 'de' ? 'de-DE' : lang === 'it' ? 'it-IT' : 'en-GB', { day: '2-digit', month: 'short' });
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch}>

        {/* Desktop */}
        <div className="hidden md:flex bg-white/98 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/60"
          style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.15)' }}>

          {/* Destination */}
          <div className="flex items-center gap-3 px-6 py-5 border-r border-stone-100 min-w-[210px] bg-[#8B6914]/4">
            <div className="w-9 h-9 rounded-full bg-[#8B6914]/12 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4.5 h-4.5 text-[#8B6914]" />
            </div>
            <div>
              <p className="text-[10px] font-body font-bold text-stone-400 uppercase tracking-widest mb-0.5">{c.destination}</p>
              <p className="text-[15px] font-body text-stone-800 font-semibold leading-tight">{c.dest_value}</p>
            </div>
          </div>

          {/* Check-in */}
          <div className="relative flex items-center gap-3 px-6 py-5 border-r border-stone-100 flex-1 min-w-[160px] group hover:bg-stone-50/60 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-stone-500" />
            </div>
            <div className="w-full">
              <p className="text-[10px] font-body font-bold text-stone-400 uppercase tracking-widest mb-0.5">{c.checkin}</p>
              <p className={`text-[15px] font-body font-semibold leading-tight ${checkIn ? 'text-stone-800' : 'text-stone-300'}`}>
                {fmtDate(checkIn) || '——'}
              </p>
              <input
                type="date" value={checkIn} min={today}
                onChange={e => handleCheckInChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="relative flex items-center gap-3 px-6 py-5 border-r border-stone-100 flex-1 min-w-[160px] group hover:bg-stone-50/60 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-stone-500" />
            </div>
            <div className="w-full">
              <p className="text-[10px] font-body font-bold text-stone-400 uppercase tracking-widest mb-0.5">{c.checkout}</p>
              <p className={`text-[15px] font-body font-semibold leading-tight ${checkOut ? 'text-stone-800' : 'text-stone-300'}`}>
                {fmtDate(checkOut) || '——'}
              </p>
              <input
                type="date" value={checkOut} min={checkoutMin}
                onChange={e => setCheckOut(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="flex items-center gap-3 px-6 py-5 border-r border-stone-100 min-w-[140px]">
            <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-stone-500" />
            </div>
            <div className="w-full">
              <p className="text-[10px] font-body font-bold text-stone-400 uppercase tracking-widest mb-0.5">{c.guests}</p>
              <select value={adults} onChange={e => setAdults(e.target.value)}
                className="text-[15px] font-body text-stone-800 font-semibold bg-transparent outline-none cursor-pointer w-full leading-tight">
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n}>{n} {c.adults_label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CTA */}
          <button type="submit"
            className="px-8 bg-[#8B6914] hover:bg-[#7A5A0F] text-white font-body font-bold text-sm tracking-widest uppercase transition-all flex items-center gap-2.5 flex-shrink-0 shadow-none">
            <Search className="w-4 h-4" />
            {c.cta}
          </button>
        </div>

        {/* Mobile */}
        <div className="md:hidden bg-white/97 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/60"
          style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.12)' }}>

          {/* Destination row */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-100 bg-[#8B6914]/4">
            <div className="w-8 h-8 rounded-full bg-[#8B6914]/12 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-[#8B6914]" />
            </div>
            <div>
              <p className="text-[9px] font-body font-bold text-stone-400 uppercase tracking-widest leading-none mb-0.5">{c.destination}</p>
              <p className="text-sm font-body text-stone-800 font-semibold leading-none">{c.dest_value}</p>
            </div>
          </div>

          {/* Date row */}
          <div className="grid grid-cols-2 divide-x divide-stone-100">
            <div className="relative px-4 py-4">
              <p className="text-[9px] font-body font-bold text-stone-400 uppercase tracking-widest mb-1">{c.checkin}</p>
              <p className={`text-base font-body font-bold leading-tight ${checkIn ? 'text-stone-800' : 'text-stone-300'}`}>
                {fmtDate(checkIn) || '——'}
              </p>
              <input type="date" value={checkIn} min={today}
                onChange={e => handleCheckInChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <div className="relative px-4 py-4">
              <p className="text-[9px] font-body font-bold text-stone-400 uppercase tracking-widest mb-1">{c.checkout}</p>
              <p className={`text-base font-body font-bold leading-tight ${checkOut ? 'text-stone-800' : 'text-stone-300'}`}>
                {fmtDate(checkOut) || '——'}
              </p>
              <input type="date" value={checkOut} min={checkoutMin}
                onChange={e => setCheckOut(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </div>

          {/* Guests row */}
          <div className="flex items-center gap-3 px-4 py-3 border-t border-stone-100">
            <Users className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <p className="text-[9px] font-body font-bold text-stone-400 uppercase tracking-widest">{c.guests}:</p>
            <select value={adults} onChange={e => setAdults(e.target.value)}
              className="text-sm font-body text-stone-800 font-semibold bg-transparent outline-none">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {c.adults_label}</option>)}
            </select>
          </div>

          {/* Search button */}
          <button type="submit"
            className="w-full py-4 bg-[#8B6914] hover:bg-[#7A5A0F] active:bg-[#6A4A0A] text-white font-body font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            {c.cta}
          </button>
        </div>

      </form>
    </div>
  );
}