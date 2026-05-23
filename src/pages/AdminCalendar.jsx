import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight, UtensilsCrossed, Calendar, RefreshCw, Plus, X, Check, Users, Mail, AlertTriangle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday, addDays } from 'date-fns';
import { de } from 'date-fns/locale';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const STATUS_COLORS = {
  new: 'bg-amber-500',
  pending: 'bg-amber-500',
  confirmed: 'bg-emerald-500',
  seated: 'bg-blue-500',
  completed: 'bg-stone-500',
  cancelled_by_guest: 'bg-red-500',
  cancelled_by_staff: 'bg-red-500',
  no_show: 'bg-red-800',
};

export default function AdminCalendar() {
  const navigate = useNavigate();
  const [access, setAccess] = useState('loading');
  const [user, setUser] = useState(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [resendingId, setResendingId] = useState(null);
  const [resendSuccess, setResendSuccess] = useState({});
  const [newForm, setNewForm] = useState({
    guest_first_name: '', guest_last_name: '', guest_email: '', guest_phone: '',
    reservation_date: format(new Date(), 'yyyy-MM-dd'), reservation_time: '19:00',
    party_size: 2, notes: '', language: 'de', source: 'admin_manual'
  });

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) {
        setAccess('denied'); return;
      }
      setUser(u);
      setAccess('granted');
    }).catch(() => setAccess('denied'));
  }, []);

  useEffect(() => {
    if (access === 'granted') loadMonth();
  }, [access, viewDate]);

  async function loadMonth() {
    setLoading(true);
    const start = format(startOfMonth(viewDate), 'yyyy-MM-dd');
    const end = format(endOfMonth(viewDate), 'yyyy-MM-dd');
    const all = await base44.entities.RestaurantReservation.list('-reservation_date', 500).catch(() => []);
    setReservations(all.filter(r => r.reservation_date >= start && r.reservation_date <= end));
    setLoading(false);
  }

  async function createReservation() {
    if (!newForm.guest_first_name || !newForm.guest_email || !newForm.reservation_date) return;
    setSaving(true);
    const dateStr = newForm.reservation_date.replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    const ref = `RES-${dateStr}-${rand}`;
    await base44.entities.RestaurantReservation.create({
      ...newForm,
      reservation_ref: ref,
      status: 'confirmed',
      email_confirmation_sent: false,
      slack_notified: false,
      party_size: parseInt(newForm.party_size),
      duplicate_check_key: `${newForm.guest_email}|${newForm.reservation_date}|${newForm.reservation_time}`,
      confirmed_at: new Date().toISOString(),
      confirmed_by: user?.email,
    });
    base44.functions.invoke('logActivity', {
      action: 'reservation_created',
      description: `Manuelle Reservierung für ${newForm.guest_first_name} ${newForm.guest_last_name} am ${newForm.reservation_date}`,
      entity_type: 'Reservation', entity_ref: ref,
    }).catch(() => {});
    setShowNewForm(false);
    setNewForm({ guest_first_name: '', guest_last_name: '', guest_email: '', guest_phone: '', reservation_date: format(new Date(), 'yyyy-MM-dd'), reservation_time: '19:00', party_size: 2, notes: '', language: 'de', source: 'admin_manual' });
    setSaving(false);
    await loadMonth();
  }

  async function resendConfirmation(reservationId) {
    setResendingId(reservationId);
    const res = await base44.functions.invoke('resendConfirmationEmail', { reservation_id: reservationId });
    if (res.data?.success) {
      setResendSuccess(prev => ({ ...prev, [reservationId]: true }));
      setTimeout(() => setResendSuccess(prev => ({ ...prev, [reservationId]: false })), 3000);
    }
    setResendingId(null);
  }

  async function updateStatus(id, status) {
    setUpdatingId(id);
    const updates = { status };
    if (status === 'confirmed') { updates.confirmed_at = new Date().toISOString(); updates.confirmed_by = user?.email; }
    if (status === 'cancelled_by_staff') { updates.cancelled_at = new Date().toISOString(); updates.cancelled_by = 'staff'; }
    await base44.entities.RestaurantReservation.update(id, updates);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    setUpdatingId(null);
  }

  if (access === 'loading') return <div className="min-h-screen bg-charcoal flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;
  if (access === 'denied') return <div className="min-h-screen bg-charcoal flex items-center justify-center"><p className="text-red-400 font-body">Zugang verweigert</p></div>;

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = (getDay(monthStart) + 6) % 7; // Monday first

  const getResForDay = (day) => reservations.filter(r => r.reservation_date === format(day, 'yyyy-MM-dd'));
  const selectedDayRes = selectedDay ? getResForDay(selectedDay).sort((a, b) => a.reservation_time.localeCompare(b.reservation_time)) : [];

  const inputCls = "w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-2 text-sm text-ivory font-body focus:outline-none focus:border-gold/30 placeholder-ivory/20";

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 pb-20 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">

        {/* Header */}
        <div className="flex items-center justify-between py-6 sm:py-8 gap-3">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-1">Admin</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory">Reservierungskalender</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/admin" className="px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">← Admin</Link>
            <Link to="/admin/opening-hours" className="px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">🕐</Link>
            <button onClick={() => setShowNewForm(true)} className="flex items-center gap-1.5 px-4 py-2 btn-gold rounded-xl text-xs font-body font-semibold tracking-widest uppercase">
              <Plus className="w-3.5 h-3.5" /> Neu
            </button>
            <button onClick={loadMonth} className="px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-ivory text-xs font-body transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* New Reservation Form */}
        {showNewForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-md px-4">
            <div className="glass-card border border-[#C9A96E]/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-light text-ivory">Neue Reservierung</h2>
                <button onClick={() => setShowNewForm(false)} className="text-ivory/30 hover:text-ivory"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Vorname *</label>
                    <input type="text" value={newForm.guest_first_name} onChange={e => setNewForm(f => ({ ...f, guest_first_name: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Nachname *</label>
                    <input type="text" value={newForm.guest_last_name} onChange={e => setNewForm(f => ({ ...f, guest_last_name: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">E-Mail *</label>
                  <input type="email" value={newForm.guest_email} onChange={e => setNewForm(f => ({ ...f, guest_email: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Telefon</label>
                  <input type="tel" value={newForm.guest_phone} onChange={e => setNewForm(f => ({ ...f, guest_phone: e.target.value }))} className={inputCls} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Datum *</label>
                    <input type="date" value={newForm.reservation_date} onChange={e => setNewForm(f => ({ ...f, reservation_date: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Zeit</label>
                    <input type="time" value={newForm.reservation_time} onChange={e => setNewForm(f => ({ ...f, reservation_time: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Personen</label>
                    <input type="number" min="1" max="20" value={newForm.party_size} onChange={e => setNewForm(f => ({ ...f, party_size: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Notizen</label>
                  <textarea rows={3} value={newForm.notes} onChange={e => setNewForm(f => ({ ...f, notes: e.target.value }))} className={inputCls + ' resize-none'} placeholder="Sonderwünsche, Anlass..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Sprache</label>
                    <select value={newForm.language} onChange={e => setNewForm(f => ({ ...f, language: e.target.value }))} className={inputCls}>
                      <option value="de">Deutsch</option>
                      <option value="en">English</option>
                      <option value="it">Italiano</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowNewForm(false)} className="flex-1 py-3 glass-card border border-[#C9A96E]/15 rounded-xl text-ivory/40 text-sm font-body">Abbrechen</button>
                <button onClick={createReservation} disabled={saving} className="flex-1 py-3 btn-gold rounded-xl text-sm font-body font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Erstellen</>}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="xl:col-span-2">
            <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-4 sm:p-6">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setViewDate(d => subMonths(d, 1))} className="w-9 h-9 rounded-full glass-card border border-[#C9A96E]/10 flex items-center justify-center text-ivory/50 hover:text-gold transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="font-display text-2xl font-light text-ivory capitalize">
                  {format(viewDate, 'MMMM yyyy', { locale: de })}
                </h2>
                <button onClick={() => setViewDate(d => addMonths(d, 1))} className="w-9 h-9 rounded-full glass-card border border-[#C9A96E]/10 flex items-center justify-center text-ivory/50 hover:text-gold transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day labels */}
              <div className="grid grid-cols-7 mb-2">
                {['Mo','Di','Mi','Do','Fr','Sa','So'].map(d => (
                  <div key={d} className="text-center text-[10px] font-body text-ivory/30 uppercase tracking-widest py-1">{d}</div>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array(startPad).fill(null).map((_, i) => <div key={`pad-${i}`} />)}
                {days.map(day => {
                  const dayRes = getResForDay(day);
                  const activeRes = dayRes.filter(r => !['completed','cancelled_by_guest','cancelled_by_staff','no_show','archived'].includes(r.status));
                  const isClosed = getDay(day) === 1;
                  const isSelected = selectedDay && isSameDay(day, selectedDay);

                  return (
                    <button key={day.toISOString()} onClick={() => setSelectedDay(isSameDay(day, selectedDay) ? null : day)}
                      className={`relative p-1.5 sm:p-2 min-h-[52px] sm:min-h-[64px] rounded-xl text-left transition-all ${
                        isSelected ? 'bg-gold/15 border border-gold/30' :
                        isClosed ? 'opacity-20 cursor-not-allowed' :
                        'hover:bg-[#C9A96E]/08 border border-transparent'
                      }`}
                      disabled={isClosed}
                    >
                      <span className={`text-xs font-body ${isToday(day) ? 'text-gold font-semibold' : 'text-ivory/60'}`}>
                        {format(day, 'd')}
                      </span>
                      {activeRes.length > 0 && (() => {
                        const totalGuests = activeRes.reduce((s, r) => s + (r.party_size || 0), 0);
                        const pct = totalGuests / 120;
                        const isWarning = pct >= 0.8;
                        return (
                          <div className="mt-1 space-y-0.5">
                            {activeRes.slice(0, 3).map((r, i) => (
                              <div key={i} className={`h-1 rounded-full ${STATUS_COLORS[r.status] || 'bg-ivory/20'}`} />
                            ))}
                            {activeRes.length > 3 && (
                              <p className="text-[9px] font-body text-ivory/30">+{activeRes.length - 3}</p>
                            )}
                            {isWarning && (
                              <div className="absolute top-1 right-1">
                                <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[#C9A96E]/08">
                {[
                  { color: 'bg-amber-500', label: 'Ausstehend' },
                  { color: 'bg-emerald-500', label: 'Bestätigt' },
                  { color: 'bg-blue-500', label: 'Eingecheckt' },
                  { color: 'bg-red-500', label: 'Storniert' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-ivory/40 font-body">
                    <div className={`w-2 h-2 rounded-full ${l.color}`} /> {l.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Day Detail */}
          <div className="xl:col-span-1">
            {selectedDay ? (
              <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-gold text-[10px] tracking-widest uppercase font-body mb-0.5">
                      {format(selectedDay, 'EEEE', { locale: de })}
                    </p>
                    <h3 className="font-display text-2xl font-light text-ivory">
                      {format(selectedDay, 'd. MMMM', { locale: de })}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedDay(null)} className="text-ivory/30 hover:text-ivory"><X className="w-4 h-4" /></button>
                </div>

                {selectedDayRes.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-8 h-8 text-ivory/10 mx-auto mb-2" />
                    <p className="text-ivory/30 text-sm font-body">Keine Reservierungen</p>
                    <button onClick={() => { setNewForm(f => ({ ...f, reservation_date: format(selectedDay, 'yyyy-MM-dd') })); setShowNewForm(true); }}
                      className="mt-3 text-gold/60 hover:text-gold text-xs font-body tracking-widest uppercase transition-colors">
                      + Hinzufügen
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Summary */}
                    {(() => {
                      const activeForDay = selectedDayRes.filter(r => !['cancelled_by_guest','cancelled_by_staff','no_show','archived'].includes(r.status));
                      const totalGuests = activeForDay.reduce((sum, r) => sum + (r.party_size || 0), 0);
                      const pct = Math.round((totalGuests / 120) * 100);
                      const isWarning = pct >= 80;
                      return (
                        <>
                          <div className="flex gap-3 mb-3 text-xs font-body">
                            <div className="glass-card border border-[#C9A96E]/08 rounded-xl px-3 py-2 text-center flex-1">
                              <p className="font-display text-xl text-ivory">{activeForDay.length}</p>
                              <p className="text-ivory/30 text-[10px]">Aktiv</p>
                            </div>
                            <div className={`glass-card border rounded-xl px-3 py-2 text-center flex-1 ${isWarning ? 'border-amber-700/30 bg-amber-950/20' : 'border-[#C9A96E]/08'}`}>
                              <p className={`font-display text-xl ${isWarning ? 'text-amber-400' : 'text-ivory'}`}>{totalGuests}</p>
                              <p className={`text-[10px] ${isWarning ? 'text-amber-400/60' : 'text-ivory/30'}`}>/ 120 Plätze</p>
                            </div>
                          </div>
                          {isWarning && (
                            <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-800/30 rounded-xl px-3 py-2 mb-3">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                              <p className="text-amber-400 text-[10px] font-body">{pct}% Auslastung — Kapazität fast erreicht</p>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    {selectedDayRes.map(r => (
                      <div key={r.id} className="glass-card border border-[#C9A96E]/08 rounded-xl p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <p className="text-ivory text-sm font-body font-medium truncate">{r.guest_first_name} {r.guest_last_name}</p>
                            <div className="flex items-center gap-2 text-ivory/40 text-xs font-body mt-0.5">
                              <span>{r.reservation_time}</span>
                              <span>·</span>
                              <Users className="w-3 h-3" />
                              <span>{r.party_size}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-body px-2 py-0.5 rounded-full whitespace-nowrap ${
                            r.status === 'confirmed' ? 'bg-emerald-900/40 text-emerald-400' :
                            r.status === 'seated' ? 'bg-blue-900/40 text-blue-400' :
                            r.status === 'new' || r.status === 'pending' ? 'bg-gold/10 text-gold' :
                            'bg-red-900/20 text-red-400'
                          }`}>
                            {r.status}
                          </span>
                        </div>
                        {r.notes && <p className="text-ivory/30 text-[10px] font-body mb-2 line-clamp-1">{r.notes}</p>}

                        {/* Quick actions */}
                        <div className="flex gap-1.5 flex-wrap">
                          {!['cancelled_by_guest','cancelled_by_staff','no_show','archived','completed'].includes(r.status) && (
                            <>
                              {(r.status === 'new' || r.status === 'pending') && (
                                <button onClick={() => updateStatus(r.id, 'confirmed')} disabled={updatingId === r.id}
                                  className="px-2.5 py-1 bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 text-[10px] rounded-lg font-body hover:bg-emerald-900/60 transition-colors">
                                  ✓ Bestätigen
                                </button>
                              )}
                              {r.status === 'confirmed' && (
                                <button onClick={() => updateStatus(r.id, 'seated')} disabled={updatingId === r.id}
                                  className="px-2.5 py-1 bg-blue-900/40 border border-blue-700/30 text-blue-400 text-[10px] rounded-lg font-body hover:bg-blue-900/60 transition-colors">
                                  Sitzt
                                </button>
                              )}
                              <button onClick={() => updateStatus(r.id, 'no_show')} disabled={updatingId === r.id}
                                className="px-2.5 py-1 bg-ivory/5 border border-ivory/10 text-ivory/30 text-[10px] rounded-lg font-body hover:text-amber-400 hover:border-amber-900/30 transition-colors">
                                NS
                              </button>
                              <button onClick={() => updateStatus(r.id, 'cancelled_by_staff')} disabled={updatingId === r.id}
                                className="px-2.5 py-1 bg-red-950/40 border border-red-900/30 text-red-400 text-[10px] rounded-lg font-body hover:bg-red-950/60 transition-colors">
                                ✕
                              </button>
                            </>
                          )}
                          {/* Resend confirmation email */}
                          <button
                            onClick={() => resendConfirmation(r.id)}
                            disabled={resendingId === r.id}
                            title="Bestätigung erneut senden"
                            className={`px-2.5 py-1 border text-[10px] rounded-lg font-body transition-colors flex items-center gap-1 ${
                              resendSuccess[r.id]
                                ? 'bg-emerald-900/30 border-emerald-700/30 text-emerald-400'
                                : 'bg-ivory/5 border-ivory/10 text-ivory/30 hover:text-gold hover:border-gold/30'
                            }`}
                          >
                            {resendingId === r.id
                              ? <div className="w-2.5 h-2.5 border border-ivory/30 border-t-ivory rounded-full animate-spin" />
                              : resendSuccess[r.id]
                              ? '✓ E-Mail'
                              : <><Mail className="w-2.5 h-2.5" /> E-Mail</>
                            }
                          </button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => { setNewForm(f => ({ ...f, reservation_date: format(selectedDay, 'yyyy-MM-dd') })); setShowNewForm(true); }}
                      className="w-full py-2 glass-card border border-dashed border-[#C9A96E]/15 rounded-xl text-ivory/30 hover:text-gold hover:border-gold/30 text-xs font-body tracking-widest uppercase transition-all flex items-center justify-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Reservierung hinzufügen
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card border border-[#C9A96E]/08 rounded-2xl p-8 text-center">
                <Calendar className="w-10 h-10 text-ivory/10 mx-auto mb-3" />
                <p className="text-ivory/30 text-sm font-body">Tag auswählen für Details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}