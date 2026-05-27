import { useState, useEffect } from 'react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { SITE_DEFAULTS, TIME_SLOTS_LUNCH, TIME_SLOTS_DINNER, TIME_SLOTS_SUNDAY } from '@/lib/siteData';
import { CheckCircle, AlertCircle, Clock, Users, ChevronLeft, ChevronRight, UtensilsCrossed, LogIn, Lock } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, isAfter, isSameDay, getDay, addMonths, subMonths } from 'date-fns';
import { de, enUS, it } from 'date-fns/locale';

const MAX_CAPACITY = SITE_DEFAULTS.restaurant_capacity;
const CLOSED_DAYS = SITE_DEFAULTS.restaurant_closed_days;
const LOCALE_MAP = { de, en: enUS, it };

function getDaySlots(date) {
  const day = getDay(new Date(date));
  if (CLOSED_DAYS.includes(day)) return [];
  if (day === 0) return TIME_SLOTS_SUNDAY;
  return [...TIME_SLOTS_LUNCH, ...TIME_SLOTS_DINNER];
}

function MiniCalendar({ selected, onSelect, lang }) {
  const [viewDate, setViewDate] = useState(new Date());
  const locale = LOCALE_MAP[lang] || de;
  const today = new Date();
  const maxDate = addDays(today, 90);
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = (getDay(monthStart) + 6) % 7;
  const padDays = Array(startPad).fill(null);
  const isDisabled = (d) => isBefore(d, today) || isAfter(d, maxDate) || CLOSED_DAYS.includes(getDay(d));
  const dayLabels = lang === 'de' ? ['Mo','Di','Mi','Do','Fr','Sa','So'] : lang === 'it' ? ['Lu','Ma','Me','Gi','Ve','Sa','Do'] : ['Mo','Tu','We','Th','Fr','Sa','Su'];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full">
      <div className="flex items-center justify-between mb-4 gap-2">
        <button onClick={() => setViewDate(d => subMonths(d, 1))}
          disabled={isBefore(startOfMonth(subMonths(viewDate, 1)), startOfMonth(today))}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0">
          <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>
        <h3 className="font-display text-sm sm:text-lg font-medium text-stone-800 capitalize text-center flex-1">
          {format(viewDate, 'MMM yyyy', { locale })}
        </h3>
        <button onClick={() => setViewDate(d => addMonths(d, 1))}
          disabled={isAfter(startOfMonth(addMonths(viewDate, 1)), startOfMonth(addDays(today, 90)))}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0">
          <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1 gap-0.5">
        {dayLabels.map(d => (
          <div key={d} className="text-center text-[9px] sm:text-[10px] font-body font-semibold text-stone-400 uppercase tracking-wider py-0.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 sm:gap-y-1">
        {padDays.map((_, i) => <div key={`pad-${i}`} />)}
        {days.map(day => {
          const disabled = isDisabled(day);
          const isSelected = selected && isSameDay(day, new Date(selected));
          const isToday = isSameDay(day, today);
          const isClosed = CLOSED_DAYS.includes(getDay(day));
          return (
            <button key={day.toISOString()} onClick={() => !disabled && onSelect(format(day, 'yyyy-MM-dd'))}
              disabled={disabled}
              className={`relative w-full aspect-square flex items-center justify-center rounded-full text-xs sm:text-sm font-body transition-all
                ${isSelected ? 'bg-[#C9A96E] text-white font-semibold shadow-md'
                  : disabled ? isClosed ? 'text-stone-200 cursor-not-allowed' : 'text-stone-300 cursor-not-allowed'
                  : 'text-stone-700 hover:bg-[#C9A96E]/10 hover:text-[#8B6914] cursor-pointer'}
                ${isToday && !isSelected ? 'ring-1 ring-[#C9A96E]/40 ring-offset-1' : ''}
              `}>
              {format(day, 'd')}
              {isClosed && !disabled && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-stone-300 rounded-full" />}
            </button>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-body text-stone-400">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#C9A96E] inline-block" />{lang === 'de' ? 'Ausgewählt' : lang === 'en' ? 'Selected' : 'Selezionato'}</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ring-1 ring-[#C9A96E]/40 inline-block" />{lang === 'de' ? 'Heute' : lang === 'en' ? 'Today' : 'Oggi'}</span>
      </div>
    </div>
  );
}

function TimeGrid({ slots, usedCapacity, guests, selected, onSelect, lang }) {
  const lunchSlots = slots.filter(s => TIME_SLOTS_LUNCH.includes(s));
  const dinnerSlots = slots.filter(s => TIME_SLOTS_DINNER.includes(s));
  const sundaySlots = slots.filter(s => !TIME_SLOTS_LUNCH.includes(s) && !TIME_SLOTS_DINNER.includes(s));
  const isFull = (t) => (MAX_CAPACITY - (usedCapacity[t] || 0)) < guests;

  const SlotBtn = ({ slot }) => {
    const full = isFull(slot);
    const isSelected = selected === slot;
    return (
      <button onClick={() => !full && onSelect(slot)} disabled={full}
        className={`py-3 px-2 rounded-xl text-xs font-body font-medium transition-all border
          ${isSelected ? 'bg-[#C9A96E] border-[#C9A96E] text-white shadow-md'
            : full ? 'border-stone-100 text-stone-300 bg-stone-50 cursor-not-allowed line-through'
            : 'border-stone-200 text-stone-600 hover:border-[#C9A96E]/50 hover:text-[#8B6914] hover:bg-[#C9A96E]/5 bg-white'}`}>
        {slot}
      </button>
    );
  };

  return (
    <div className="space-y-5">
      {lunchSlots.length > 0 && (
        <div>
          <p className="text-[10px] font-body font-semibold tracking-[0.25em] uppercase text-stone-400 mb-3">{lang === 'de' ? '🌞 Mittagessen · 12:00–14:30' : lang === 'en' ? '🌞 Lunch · 12:00–14:30' : '🌞 Pranzo · 12:00–14:30'}</p>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2">{lunchSlots.map(s => <SlotBtn key={s} slot={s} />)}</div>
        </div>
      )}
      {dinnerSlots.length > 0 && (
        <div>
          <p className="text-[10px] font-body font-semibold tracking-[0.25em] uppercase text-stone-400 mb-3">{lang === 'de' ? '🌙 Abendessen · 17:30–22:00' : lang === 'en' ? '🌙 Dinner · 17:30–22:00' : '🌙 Cena · 17:30–22:00'}</p>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2">{dinnerSlots.map(s => <SlotBtn key={s} slot={s} />)}</div>
        </div>
      )}
      {sundaySlots.length > 0 && (
        <div>
          <p className="text-[10px] font-body font-semibold tracking-[0.25em] uppercase text-stone-400 mb-3">{lang === 'de' ? '☀️ Sonntag · 12:00–20:00' : lang === 'en' ? '☀️ Sunday · 12:00–20:00' : '☀️ Domenica · 12:00–20:00'}</p>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2">{sundaySlots.map(s => <SlotBtn key={s} slot={s} />)}</div>
        </div>
      )}
    </div>
  );
}

const inputClass = "w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C9A96E]/60 focus:ring-2 focus:ring-[#C9A96E]/10 transition-all font-body";

const COPY = {
  de: { title: 'Tischreservierung', sub: 'Wählen Sie Ihren Wunschtermin', step1: 'Datum & Gäste', step2: 'Uhrzeit', step3: 'Ihre Daten', guests_label: 'Anzahl der Gäste', date_label: 'Datum wählen', closed_msg: 'Montag ist unser Ruhetag – bitte wählen Sie einen anderen Tag.', no_slots: 'Keine verfügbaren Zeiten.', confirm: 'Verbindlich reservieren', policy: 'Ihre Reservierung ist verbindlich. Bei Nichterscheinen behalten wir uns vor, künftige Reservierungen einzuschränken.', success_title: 'Reservierung bestätigt', success_text: 'Sie erhalten in Kürze eine Bestätigung per E-Mail.', error_duplicate: 'Sie haben für diesen Zeitslot bereits eine Reservierung.', error_full: 'Dieser Zeitslot ist leider ausgebucht. Bitte wählen Sie eine andere Zeit.', login_title: 'Bitte einloggen', login_sub: 'Um einen Tisch zu reservieren, müssen Sie eingeloggt sein.', login_btn: 'Einloggen oder Registrieren', gdpr: 'Ich stimme der Verarbeitung meiner Daten gemäß Datenschutzerklärung zu.' },
  en: { title: 'Table Reservation', sub: 'Choose your preferred date', step1: 'Date & Guests', step2: 'Time', step3: 'Your Details', guests_label: 'Number of guests', date_label: 'Select date', closed_msg: 'Monday is our day off — please select another date.', no_slots: 'No available times.', confirm: 'Confirm Reservation', policy: 'Your reservation is binding. In case of no-show we reserve the right to restrict future bookings.', success_title: 'Reservation Confirmed', success_text: 'You will receive a confirmation email shortly.', error_duplicate: 'You already have a reservation for this time slot.', error_full: 'This time slot is fully booked. Please choose a different time.', login_title: 'Please sign in', login_sub: 'You need to be signed in to make a reservation.', login_btn: 'Sign In or Register', gdpr: 'I agree to the processing of my data in accordance with the privacy policy.' },
  it: { title: 'Prenotazione Tavolo', sub: 'Scegli la tua data preferita', step1: 'Data & Ospiti', step2: 'Orario', step3: 'I tuoi dati', guests_label: 'Numero di ospiti', date_label: 'Seleziona data', closed_msg: 'Lunedì siamo chiusi — scegli un altro giorno.', no_slots: 'Nessun orario disponibile.', confirm: 'Conferma prenotazione', policy: 'La prenotazione è vincolante. In caso di mancata presentazione ci riserviamo di limitare le future prenotazioni.', success_title: 'Prenotazione confermata', success_text: 'Riceverete a breve una conferma via email.', error_duplicate: 'Hai già una prenotazione per questo orario.', error_full: 'Questo orario è al completo. Scegliete un orario diverso.', login_title: 'Accedi per continuare', login_sub: 'Devi essere registrato per prenotare un tavolo.', login_btn: 'Accedi o Registrati', gdpr: 'Acconsento al trattamento dei miei dati secondo la privacy policy.' },
};

export default function Reserve() {
  const { lang } = useLang();
  const c = COPY[lang] || COPY.de;
  const [authState, setAuthState] = useState('loading');
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [slots, setSlots] = useState([]);
  const [usedCapacity, setUsedCapacity] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', requests: '' });
  const [reservationRef, setReservationRef] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (auth) => {
      if (auth) {
        const u = await base44.auth.me().catch(() => null);
        setUser(u);
        if (u) {
          const nameParts = (u.full_name || '').split(' ');
          setForm(f => ({
            ...f,
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            email: u.email || '',
          }));
        }
        setAuthState('user');
      } else {
        setAuthState('guest');
      }
    }).catch(() => setAuthState('guest'));
  }, []);

  async function handleDateSelect(d) {
    setDate(d);
    setTime('');
    setLoading(true);
    setError('');

    // Check SpecialOpeningRule for this date
    const specialRules = await base44.entities.SpecialOpeningRule.filter({ entity_type: 'restaurant' }).catch(() => []);
    const blockingRule = specialRules
      .filter(r => r.effective_date <= d && (!r.end_date || r.end_date >= d))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))[0];
    if (blockingRule && (blockingRule.is_closed || blockingRule.fully_booked || ['fully_closed','maintenance','private_event','fully_booked'].includes(blockingRule.rule_type))) {
      const msg = blockingRule.is_closed || ['fully_closed','maintenance','private_event'].includes(blockingRule.rule_type)
        ? (lang === 'de' ? `Das Restaurant ist an diesem Tag geschlossen (${blockingRule.rule_name}).` : lang === 'en' ? `The restaurant is closed on this day (${blockingRule.rule_name}).` : `Il ristorante è chiuso (${blockingRule.rule_name}).`)
        : (lang === 'de' ? 'Dieser Tag ist bereits ausgebucht.' : lang === 'en' ? 'This day is fully booked.' : 'Questo giorno è tutto esaurito.');
      setSlots([]);
      setUsedCapacity({});
      setError(msg);
      setLoading(false);
      return;
    }

    const daySlots = getDaySlots(d);
    if (daySlots.length === 0) { setSlots([]); setUsedCapacity({}); setLoading(false); return; }
    const existing = await base44.entities.RestaurantReservation.filter({ reservation_date: d });
    const activeStatuses = ['new', 'pending', 'confirmed', 'seated'];
    const cap = {};
    daySlots.forEach(s => { cap[s] = 0; });
    existing.filter(r => activeStatuses.includes(r.status))
      .forEach(r => { if (cap[r.reservation_time] !== undefined) cap[r.reservation_time] += (r.party_size || 0); });
    setUsedCapacity(cap);
    setSlots(daySlots);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email) return;
    if (!gdprConsent) {
      setError(lang === 'de' ? 'Bitte stimmen Sie der Datenschutzerklärung zu.' : lang === 'en' ? 'Please accept the privacy policy.' : 'Accettare la privacy policy.');
      return;
    }
    setSubmitting(true);
    setError('');
    const res = await base44.functions.invoke('createReservation', {
      first_name: form.first_name, last_name: form.last_name,
      email: form.email, phone: form.phone,
      date, time, guests, requests: form.requests, lang, gdpr_consent: true,
    });
    if (!res.data?.success) {
      const err = res.data?.error || 'error';
      if (err === 'duplicate') setError(c.error_duplicate);
      else if (err === 'full') setError(c.error_full);
      else if (err.includes('wait') || res.status === 429) setError(lang === 'de' ? 'Bitte kurz warten und erneut versuchen.' : lang === 'en' ? 'Please wait a moment.' : 'Attendere un momento.');
      else if (err.includes('closed')) setError(lang === 'de' ? 'Das Restaurant ist an diesem Tag geschlossen.' : lang === 'en' ? 'The restaurant is closed on this day.' : 'Il ristorante è chiuso.');
      else setError(lang === 'de' ? 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' : lang === 'en' ? 'An error occurred. Please try again.' : 'Si è verificato un errore.');
      setSubmitting(false);
      return;
    }
    setReservationRef(res.data.ref);
    setSuccess(true);
    setSubmitting(false);
  }

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center pt-[126px] lg:pt-[166px]">
        <div className="w-8 h-8 border-2 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full animate-spin" />
      </div>
    );
  }

  if (authState === 'guest') {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <div className="relative overflow-hidden w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A2118] to-[#1C1714]" />
          <img src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg" alt="Krone Langenburg — Panorama" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div className="relative z-10 text-center pt-[126px] lg:pt-[166px] pb-10 lg:pb-14 px-5">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body mb-2">Krone Langenburg by Ammesso</p>
            <h1 className="font-display text-3xl md:text-5xl font-light text-white mb-2">{c.title}</h1>
            <p className="text-white/50 font-body text-sm">{c.sub}</p>
          </div>
        </div>
        <div className="max-w-md mx-auto px-5 py-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center">
            <div className="w-16 h-16 bg-[#C9A96E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-[#C9A96E]" />
            </div>
            <h2 className="font-display text-2xl font-light text-stone-800 mb-2">{c.login_title}</h2>
            <p className="text-stone-500 font-body text-sm mb-8 leading-relaxed">{c.login_sub}</p>
            <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
              className="w-full py-4 bg-[#1C1714] hover:bg-[#2A2118] text-white rounded-2xl text-sm font-body font-semibold tracking-wider transition-all shadow-lg flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              {c.login_btn}
            </button>
            <p className="text-stone-400 text-xs font-body mt-5 leading-relaxed">
              {lang === 'de' ? 'Mit einem kostenlosen Krone Gäste-Konto können Sie Reservierungen verwalten und mehr.' : lang === 'en' ? 'With a free Krone guest account you can manage reservations and more.' : 'Con un account ospiti gratuito puoi gestire le prenotazioni e altro.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center px-4 sm:px-5 pt-16 sm:pt-20 pb-24 sm:pb-16">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-10 text-center">
          <div className="w-20 h-20 bg-[#C9A96E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#C9A96E]" />
          </div>
          <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-3">Krone Langenburg</p>
          <h1 className="font-display text-3xl font-light text-stone-800 mb-3">{c.success_title}</h1>
          <p className="text-stone-500 font-body text-sm mb-6">{c.success_text}</p>
          <p className="text-xs text-stone-400 font-body mb-6">Ref: <strong className="text-stone-600">{reservationRef}</strong></p>
          <div className="bg-stone-50 rounded-2xl p-5 text-sm font-body text-left space-y-3 mb-7 border border-stone-100">
            <div className="flex justify-between"><span className="text-stone-400">{lang === 'de' ? 'Datum' : lang === 'en' ? 'Date' : 'Data'}</span><span className="text-stone-700 font-medium">{format(new Date(date), 'EEEE, d. MMMM yyyy', { locale: LOCALE_MAP[lang] || de })}</span></div>
            <div className="flex justify-between"><span className="text-stone-400">{lang === 'de' ? 'Uhrzeit' : lang === 'en' ? 'Time' : 'Orario'}</span><span className="text-stone-700 font-medium">{time} Uhr</span></div>
            <div className="flex justify-between"><span className="text-stone-400">{lang === 'de' ? 'Personen' : lang === 'en' ? 'Guests' : 'Ospiti'}</span><span className="text-stone-700 font-medium">{guests}</span></div>
          </div>
          <div className="flex gap-3">
            <a href="/account/reservations" className="flex-1 inline-flex items-center justify-center px-5 py-3.5 border-2 border-[#C9A96E] text-[#8B6914] rounded-full text-xs tracking-wider uppercase font-body font-semibold hover:bg-[#C9A96E]/5 transition-colors">
              {lang === 'de' ? 'Meine Reservierungen' : lang === 'en' ? 'My Reservations' : 'Le mie prenotazioni'}
            </a>
            <a href="/" className="flex-1 inline-flex items-center justify-center px-5 py-3.5 bg-[#C9A96E] hover:bg-[#B8924A] text-white rounded-full text-xs tracking-wider uppercase font-body font-semibold shadow-lg transition-colors">
              {lang === 'de' ? 'Startseite' : lang === 'en' ? 'Home' : 'Home'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const steps = [c.step1, c.step2, c.step3];

  return (
    <div className="min-h-screen text-charcoal pb-24 lg:pb-10" style={{ background: '#FAF7F2' }}>
      <div className="relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A2118] to-[#1C1714]" />
        <img src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg" alt="Krone Langenburg — Panorama" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="relative z-10 text-center pt-[126px] lg:pt-[166px] pb-10 lg:pb-14 px-5">
          <p className="text-[#C9A96E] text-[9px] sm:text-[10px] tracking-[0.5em] uppercase font-body mb-2 lg:mb-3">Krone Langenburg by Ammesso</p>
          <h1 className="font-display text-2xl sm:text-3xl md:text-6xl font-light text-white mb-2 lg:mb-3">{c.title}</h1>
          <p className="text-white/50 font-body text-xs sm:text-sm tracking-wider">{c.sub}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 -mt-2 lg:-mt-4">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-8 sm:mb-10 mt-6 sm:mt-8">
          {steps.map((label, i) => {
            const s = i + 1;
            const active = step === s;
            const done = step > s;
            return (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-semibold font-body border-2 transition-all ${done ? 'bg-[#C9A96E] border-[#C9A96E] text-white' : active ? 'bg-white border-[#C9A96E] text-[#8B6914] shadow-md' : 'bg-white border-stone-200 text-stone-400'}`}>
                    {done ? '✓' : s}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-body mt-1 sm:mt-1.5 tracking-wider uppercase max-w-[60px] text-center leading-tight ${active ? 'text-[#8B6914] font-semibold' : 'text-stone-400'}`}>{label}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-10 sm:w-16 md:w-24 h-px mx-1.5 sm:mx-2 mb-5 sm:mb-6 ${done ? 'bg-[#C9A96E]' : 'bg-stone-200'}`} />}
              </div>
            );
          })}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            <div className="lg:col-span-3">
              <MiniCalendar selected={date} onSelect={handleDateSelect} lang={lang} />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6">
                <p className="text-[10px] font-body font-semibold tracking-[0.25em] uppercase text-stone-400 mb-4 sm:mb-5">{c.guests_label}</p>
                <div className="flex items-center justify-between gap-4">
                  <button onClick={() => setGuests(g => Math.max(1, g - 1))}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-stone-200 text-stone-500 hover:border-[#C9A96E]/50 hover:text-[#8B6914] transition-all text-2xl font-light flex items-center justify-center flex-shrink-0">−</button>
                  <div className="text-center">
                    <span className="font-display text-5xl sm:text-6xl font-light text-stone-800">{guests}</span>
                    <p className="text-stone-400 text-xs font-body mt-1">{lang === 'de' ? 'Personen' : lang === 'en' ? 'Persons' : 'Persone'}</p>
                  </div>
                  <button onClick={() => setGuests(g => Math.min(10, g + 1))}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-stone-200 text-stone-500 hover:border-[#C9A96E]/50 hover:text-[#8B6914] transition-all text-2xl font-light flex items-center justify-center flex-shrink-0">+</button>
                </div>
                {guests === 10 && <p className="text-[#C9A96E] text-xs font-body text-center mt-3">{lang === 'de' ? 'Für Gruppen > 10 bitte direkt anfragen.' : lang === 'en' ? 'For groups > 10 please contact us directly.' : 'Per gruppi > 10 contattateci.'}</p>}
              </div>
              {date && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <p className="text-[10px] font-body font-semibold tracking-[0.25em] uppercase text-stone-400 mb-3">{c.date_label}</p>
                  {loading ? (
                    <div className="flex items-center gap-2 text-stone-400">
                      <div className="w-4 h-4 border-2 border-stone-300 border-t-[#C9A96E] rounded-full animate-spin" />
                      <span className="text-sm font-body">…</span>
                    </div>
                  ) : (
                    <>
                      <p className="font-display text-xl text-stone-700">{format(new Date(date), 'EEEE, d. MMMM yyyy', { locale: LOCALE_MAP[lang] || de })}</p>
                      {slots.length === 0
                        ? <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 font-body">{c.closed_msg}</div>
                        : <p className="text-stone-400 text-sm font-body mt-1">{slots.length} {lang === 'de' ? 'Zeiten verfügbar' : lang === 'en' ? 'times available' : 'orari disponibili'}</p>}
                    </>
                  )}
                </div>
              )}
              <button onClick={() => setStep(2)} disabled={!date || slots.length === 0 || loading}
                className="w-full py-4 bg-[#C9A96E] hover:bg-[#B8924A] disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-2xl text-sm font-body font-semibold tracking-wider transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2">
                {lang === 'de' ? 'Uhrzeit wählen' : lang === 'en' ? 'Choose Time' : 'Scegli orario'}<ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-8">
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-stone-400 hover:text-stone-600 text-xs font-body tracking-widest uppercase mb-6 transition-colors">
                <ChevronLeft className="w-4 h-4" /> {lang === 'de' ? 'Zurück' : lang === 'en' ? 'Back' : 'Indietro'}
              </button>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="inline-flex items-center gap-1.5 bg-[#C9A96E]/10 text-[#8B6914] text-xs font-body font-medium px-4 py-2 rounded-full border border-[#C9A96E]/20">
                  📅 {format(new Date(date), 'EEEE, d. MMMM', { locale: LOCALE_MAP[lang] || de })}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-600 text-xs font-body font-medium px-4 py-2 rounded-full">
                  <Users className="w-3.5 h-3.5" /> {guests} {lang === 'de' ? 'Personen' : lang === 'en' ? 'Persons' : 'Persone'}
                </span>
              </div>
              {slots.length === 0 ? (
                <div className="text-center py-10">
                  <AlertCircle className="w-8 h-8 mx-auto mb-3 text-stone-300" />
                  <p className="text-stone-400 font-body text-sm">{c.no_slots}</p>
                </div>
              ) : (
                <TimeGrid slots={slots} usedCapacity={usedCapacity} guests={guests} selected={time} onSelect={(t) => { setTime(t); setStep(3); }} lang={lang} />
              )}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-8">
              <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-stone-400 hover:text-stone-600 text-xs font-body tracking-widest uppercase mb-6 transition-colors">
                <ChevronLeft className="w-4 h-4" /> {lang === 'de' ? 'Zurück' : lang === 'en' ? 'Back' : 'Indietro'}
              </button>
              <div className="bg-[#C9A96E]/8 border border-[#C9A96E]/20 rounded-2xl p-4 mb-7 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm font-body text-stone-700">
                  <UtensilsCrossed className="w-4 h-4 text-[#C9A96E]" />
                  <span className="font-medium">{format(new Date(date), 'EEEE, d. MMMM yyyy', { locale: LOCALE_MAP[lang] || de })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-body text-stone-700">
                  <Clock className="w-4 h-4 text-[#C9A96E]" />
                  <span className="font-medium">{time} Uhr</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-body text-stone-700">
                  <Users className="w-4 h-4 text-[#C9A96E]" />
                  <span className="font-medium">{guests} {lang === 'de' ? 'Personen' : lang === 'en' ? 'Persons' : 'Persone'}</span>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-500 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{lang === 'de' ? 'Vorname' : lang === 'en' ? 'First Name' : 'Nome'} *</label>
                    <input type="text" autoComplete="given-name" required value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-stone-500 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{lang === 'de' ? 'Nachname' : lang === 'en' ? 'Last Name' : 'Cognome'} *</label>
                    <input type="text" autoComplete="family-name" required value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-stone-500 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">E-Mail *</label>
                  <input type="email" autoComplete="email" required value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={`${inputClass} ${user?.email ? 'bg-stone-100 text-stone-500 cursor-not-allowed' : ''}`}
                    readOnly={!!user?.email} />
                </div>
                <div>
                  <label className="block text-stone-500 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{lang === 'de' ? 'Telefon' : lang === 'en' ? 'Phone' : 'Telefono'}</label>
                  <input type="tel" autoComplete="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-stone-500 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{lang === 'de' ? 'Sonderwünsche' : lang === 'en' ? 'Special Requests' : 'Richieste speciali'}</label>
                  <textarea rows={3} value={form.requests} onChange={e => setForm(f => ({ ...f, requests: e.target.value }))} className={`${inputClass} resize-none`} placeholder={lang === 'de' ? 'Allergien, Geburtstag, Hochzeit …' : lang === 'en' ? 'Allergies, birthday, anniversary …' : 'Allergie, compleanno, anniversario …'} />
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={gdprConsent} onChange={e => setGdprConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#C9A96E] focus:ring-[#C9A96E]/30 flex-shrink-0 cursor-pointer" />
                  <span className="text-xs text-stone-500 font-body leading-relaxed">
                    {c.gdpr}{' '}
                    <a href="/legal" target="_blank" className="text-[#8B6914] hover:underline">{lang === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}</a> *
                  </span>
                </label>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 text-sm text-red-600 font-body">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
                  </div>
                )}
                <p className="text-xs text-stone-400 font-body leading-relaxed">{c.policy}</p>
                <button type="submit" disabled={submitting || !gdprConsent}
                  className="w-full py-4 bg-[#8B6914] hover:bg-[#7A5A0F] disabled:opacity-50 text-white rounded-lg text-sm font-body font-bold tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 hover:-translate-y-px">
                  {submitting
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><UtensilsCrossed className="w-4 h-4" /> {c.confirm}</>}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}