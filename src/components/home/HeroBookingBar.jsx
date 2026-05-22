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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch}>
        {/* Desktop: single-row card */}
        <div className="hidden md:flex bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/50">
          {/* Destination — fixed */}
          <div className="flex items-center gap-3 px-5 py-4 border-r border-stone-100 min-w-[180px]">
            <MapPin className="w-4 h-4 text-[#8B6914] flex-shrink-0" />
            <div>
              <p className="text-[10px] font-body font-semibold text-stone-400 uppercase tracking-widest mb-0.5">{c.destination}</p>
              <p className="text-sm font-body text-stone-800 font-medium">{c.dest_value}</p>
            </div>
          </div>

          {/* Check-in */}
          <div className="flex items-center gap-3 px-5 py-4 border-r border-stone-100 flex-1 min-w-[140px]">
            <Calendar className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <div className="w-full">
              <p className="text-[10px] font-body font-semibold text-stone-400 uppercase tracking-widest mb-0.5">{c.checkin}</p>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={e => {
                  setCheckIn(e.target.value);
                  if (checkOut && e.target.value >= checkOut) setCheckOut('');
                }}
                className="w-full text-sm font-body text-stone-800 bg-transparent outline-none cursor-pointer"
                placeholder={today}
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="flex items-center gap-3 px-5 py-4 border-r border-stone-100 flex-1 min-w-[140px]">
            <Calendar className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <div className="w-full">
              <p className="text-[10px] font-body font-semibold text-stone-400 uppercase tracking-widest mb-0.5">{c.checkout}</p>
              <input
                type="date"
                value={checkOut}
                min={checkIn || tomorrow}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full text-sm font-body text-stone-800 bg-transparent outline-none cursor-pointer"
                placeholder={tomorrow}
              />
            </div>
          </div>

          {/* Guests */}
          <div className="flex items-center gap-3 px-5 py-4 border-r border-stone-100 min-w-[120px]">
            <Users className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <div className="w-full">
              <p className="text-[10px] font-body font-semibold text-stone-400 uppercase tracking-widest mb-0.5">{c.guests}</p>
              <select
                value={adults}
                onChange={e => setAdults(e.target.value)}
                className="w-full text-sm font-body text-stone-800 bg-transparent outline-none cursor-pointer">
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n}>{n} {c.adults_label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CTA */}
          <button type="submit"
            className="px-8 bg-[#1C1714] hover:bg-[#2A2118] text-white font-body font-semibold text-sm tracking-widest uppercase transition-all flex items-center gap-2 flex-shrink-0">
            <Search className="w-4 h-4" />
            {c.cta}
          </button>
        </div>

        {/* Mobile: stacked card */}
        <div className="md:hidden bg-white rounded-2xl shadow-2xl p-4 space-y-3 border border-white/50">
          {/* Destination */}
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <MapPin className="w-4 h-4 text-[#8B6914]" />
            <div>
              <p className="text-[10px] font-body text-stone-400 uppercase tracking-widest">{c.destination}</p>
              <p className="text-sm font-body text-stone-800 font-medium">{c.dest_value}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-body text-stone-400 uppercase tracking-widest block mb-1">{c.checkin}</label>
              <input type="date" value={checkIn} min={today}
                onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(''); }}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-body text-stone-800 outline-none focus:border-[#8B6914]/50" />
            </div>
            <div>
              <label className="text-[10px] font-body text-stone-400 uppercase tracking-widest block mb-1">{c.checkout}</label>
              <input type="date" value={checkOut} min={checkIn || tomorrow}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-body text-stone-800 outline-none focus:border-[#8B6914]/50" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-body text-stone-400 uppercase tracking-widest block mb-1">{c.guests}</label>
            <select value={adults} onChange={e => setAdults(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-body text-stone-800 outline-none focus:border-[#8B6914]/50">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {c.adults_label}</option>)}
            </select>
          </div>
          <button type="submit"
            className="w-full py-3.5 bg-[#1C1714] hover:bg-[#2A2118] text-white font-body font-semibold text-sm tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            {c.cta}
          </button>
        </div>
      </form>
    </div>
  );
}