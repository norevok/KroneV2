/**
 * AdminGuestCalendar — Gästekalender
 * Shows all reservations (restaurant + hotel) in a calendar view.
 * Supports day / week / month toggle.
 */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, UtensilsCrossed, BedDouble, RefreshCw, XCircle } from 'lucide-react';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

function EventPill({ type, label, count }) {
  if (type === 'restaurant') {
    return (
      <div className="flex items-center gap-1 bg-gold/15 border border-gold/20 rounded-md px-1.5 py-0.5 text-[9px] font-body text-gold/80 truncate">
        <UtensilsCrossed className="w-2.5 h-2.5 flex-shrink-0" />
        <span className="truncate">{count > 1 ? `${count}x ` : ''}{label}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 bg-blue-950/40 border border-blue-800/20 rounded-md px-1.5 py-0.5 text-[9px] font-body text-blue-400/80 truncate">
      <BedDouble className="w-2.5 h-2.5 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

export default function AdminGuestCalendar() {
  const navigate = useNavigate();
  const [access, setAccess] = useState('loading');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [view, setView] = useState('month'); // month | list

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) {
        setAccess('denied'); return;
      }
      setAccess('granted');
      loadData();
    }).catch(() => setAccess('denied'));
  }, []);

  async function loadData() {
    setLoading(true);
    const [res, ints] = await Promise.all([
      base44.entities.RestaurantReservation.list('-reservation_date', 500),
      base44.entities.HotelBookingIntent.filter({ status: 'synced_confirmed' }, '-check_in', 200).catch(() => []),
    ]);
    setReservations(res.filter(r => !['archived', 'cancelled_by_guest', 'cancelled_by_staff', 'no_show'].includes(r.status)));
    setIntents(ints.filter(i => i.check_in));
    setLoading(false);
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd });

  function getResForDay(day) {
    const dayStr = format(day, 'yyyy-MM-dd');
    return reservations.filter(r => r.reservation_date === dayStr);
  }

  function getIntentsForDay(day) {
    const dayStr = format(day, 'yyyy-MM-dd');
    return intents.filter(i => {
      if (!i.check_in || !i.check_out) return false;
      return dayStr >= i.check_in && dayStr < i.check_out;
    });
  }

  const selectedDayRes = selectedDay ? getResForDay(selectedDay) : [];
  const selectedDayIntents = selectedDay ? getIntentsForDay(selectedDay) : [];

  // Upcoming list for list view
  const today = format(new Date(), 'yyyy-MM-dd');
  const upcomingRes = reservations
    .filter(r => r.reservation_date >= today)
    .sort((a, b) => a.reservation_date.localeCompare(b.reservation_date) || a.reservation_time.localeCompare(b.reservation_time));

  if (access === 'loading') return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  );

  if (access === 'denied') return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-5">
      <div className="text-center glass-card border border-red-900/30 rounded-2xl p-10 max-w-sm">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-light text-ivory mb-2">Zugang verweigert</h1>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 btn-gold rounded-full text-xs uppercase tracking-widest font-body font-semibold">Startseite</button>
      </div>
    </div>
  );

  const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-5">

        {/* Header */}
        <div className="flex items-center justify-between py-6 gap-3 flex-wrap">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-1">Admin · Kalender</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory">Gästekalender</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/admin" className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">
              ← Admin
            </Link>
            <div className="flex gap-0.5 bg-espresso rounded-xl p-1 border border-[#C9A96E]/10">
              {(['month', 'list']).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-body tracking-widest uppercase transition-all ${view === v ? 'bg-gold text-charcoal font-semibold' : 'text-ivory/40 hover:text-ivory'}`}>
                  {v === 'month' ? 'Monat' : 'Liste'}
                </button>
              ))}
            </div>
            <button onClick={loadData} className="flex items-center gap-1.5 px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-ivory text-xs font-body transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 text-[10px] font-body text-ivory/40">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gold/20 border border-gold/30" /> Restaurant</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-950/60 border border-blue-800/30" /> Hotel (Beds24)</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-950/40 border border-emerald-700/30" /> Heute</div>
        </div>

        {view === 'month' && (
          <>
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentMonth(m => subMonths(m, 1))}
                className="w-9 h-9 flex items-center justify-center glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="font-display text-xl font-light text-ivory">
                {format(currentMonth, 'MMMM yyyy', { locale: de })}
              </h2>
              <button onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                className="w-9 h-9 flex items-center justify-center glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar grid */}
            <div className="glass-card border border-[#C9A96E]/10 rounded-2xl overflow-hidden">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 border-b border-[#C9A96E]/10">
                {WEEKDAYS.map(d => (
                  <div key={d} className="py-2 text-center text-[10px] font-body text-ivory/25 tracking-wider uppercase">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7">
                {calDays.map((day, idx) => {
                  const inMonth = day.getMonth() === currentMonth.getMonth();
                  const dayRes = getResForDay(day);
                  const dayIntents = getIntentsForDay(day);
                  const isSelected = selectedDay && isSameDay(day, selectedDay);
                  const isT = isToday(day);

                  return (
                    <button key={idx}
                      onClick={() => setSelectedDay(isSameDay(day, selectedDay) ? null : day)}
                      className={`min-h-[80px] sm:min-h-[100px] p-1.5 sm:p-2 border-b border-r border-[#C9A96E]/06 text-left transition-all ${
                        isSelected ? 'bg-gold/10' : 'hover:bg-ivory/3'
                      } ${!inMonth ? 'opacity-25' : ''}`}>
                      <div className={`text-xs font-body mb-1.5 w-6 h-6 flex items-center justify-center rounded-full ${
                        isT ? 'bg-gold text-charcoal font-semibold' : 'text-ivory/40'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        {dayRes.length > 0 && (
                          <EventPill type="restaurant" label={`${dayRes.length} Res.`} count={dayRes.length} />
                        )}
                        {dayIntents.length > 0 && (
                          <EventPill type="hotel" label={`${dayIntents.length} Hotel`} count={dayIntents.length} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected day detail */}
            {selectedDay && (selectedDayRes.length > 0 || selectedDayIntents.length > 0) && (
              <div className="mt-4 glass-card border border-gold/15 rounded-2xl p-5">
                <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-body mb-3">
                  {format(selectedDay, 'EEEE, d. MMMM yyyy', { locale: de })}
                </p>
                {selectedDayRes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-ivory/30 text-[10px] uppercase tracking-wider font-body mb-2 flex items-center gap-1.5">
                      <UtensilsCrossed className="w-3 h-3" /> Restaurant ({selectedDayRes.length})
                    </p>
                    <div className="space-y-1.5">
                      {selectedDayRes
                        .sort((a, b) => a.reservation_time.localeCompare(b.reservation_time))
                        .map(r => (
                          <div key={r.id} className="flex items-center justify-between bg-gold/5 rounded-lg px-3 py-2">
                            <div>
                              <span className="text-xs font-body text-ivory/80">{r.reservation_time} — {r.guest_first_name} {r.guest_last_name}</span>
                              <span className="text-ivory/40 text-[10px] ml-2">{r.party_size} P.</span>
                            </div>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full border font-body uppercase tracking-wider ${
                              r.status === 'confirmed' ? 'text-emerald-400 border-emerald-800/30 bg-emerald-950/30' : 'text-gold/60 border-gold/20 bg-gold/5'
                            }`}>{r.status}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                {selectedDayIntents.length > 0 && (
                  <div>
                    <p className="text-ivory/30 text-[10px] uppercase tracking-wider font-body mb-2 flex items-center gap-1.5">
                      <BedDouble className="w-3 h-3" /> Hotel-Aufenthalte ({selectedDayIntents.length})
                    </p>
                    <div className="space-y-1.5">
                      {selectedDayIntents.map(i => (
                        <div key={i.id} className="flex items-center justify-between bg-blue-950/20 rounded-lg px-3 py-2">
                          <div>
                            <span className="text-xs font-body text-ivory/80">{i.guest_first_name} {i.guest_last_name}</span>
                            <span className="text-ivory/40 text-[10px] ml-2">{i.check_in} → {i.check_out}</span>
                          </div>
                          <span className="text-[9px] px-2 py-0.5 rounded-full border text-blue-400 border-blue-800/30 bg-blue-950/30 font-body uppercase tracking-wider">
                            {i.beds24_booking_ref || 'Hotel'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
            ) : upcomingRes.length === 0 ? (
              <div className="text-center py-16 text-ivory/30 font-body text-sm">Keine bevorstehenden Reservierungen</div>
            ) : (
              upcomingRes.map(r => (
                <div key={r.id} className="glass-card border border-[#C9A96E]/08 rounded-xl px-4 py-3 hover:border-[#C9A96E]/20 transition-all flex items-center gap-3 flex-wrap">
                  <div className="w-16 flex-shrink-0 text-center bg-gold/10 rounded-lg py-2">
                    <p className="text-gold font-display text-lg font-light leading-none">{format(new Date(r.reservation_date + 'T12:00:00'), 'd')}</p>
                    <p className="text-gold/60 text-[9px] font-body uppercase tracking-wider">{format(new Date(r.reservation_date + 'T12:00:00'), 'MMM', { locale: de })}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-body text-ivory">{r.guest_first_name} {r.guest_last_name}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-body uppercase tracking-wider ${
                        r.status === 'confirmed' ? 'text-emerald-400 border-emerald-800/30 bg-emerald-950/30' : 'text-gold/60 border-gold/20 bg-gold/5'
                      }`}>{r.status}</span>
                    </div>
                    <p className="text-ivory/30 text-xs font-body mt-0.5">{r.reservation_time} · {r.party_size} Personen · {r.guest_email}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-ivory/20 text-[10px] font-body font-mono">{r.reservation_ref}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}