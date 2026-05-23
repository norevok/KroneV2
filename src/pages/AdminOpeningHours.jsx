import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plus, X, Check, RefreshCw, Clock, CalendarOff, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];
const DAY_NAMES = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const RULE_TYPES = [
  { value: 'fully_closed', label: 'Geschlossen' },
  { value: 'fully_booked', label: 'Ausgebucht' },
  { value: 'maintenance', label: 'Wartung' },
  { value: 'private_event', label: 'Private Veranstaltung' },
  { value: 'modified_hours', label: 'Geänderte Öffnungszeiten' },
  { value: 'special_menu', label: 'Sondermenü' },
];

const inputCls = "w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-2 text-sm text-ivory font-body focus:outline-none focus:border-gold/30 placeholder-ivory/20";

export default function AdminOpeningHours() {
  const [access, setAccess] = useState('loading');
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('hours');
  const [openingHours, setOpeningHours] = useState([]);
  const [specialRules, setSpecialRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingHour, setEditingHour] = useState(null);
  const [hourForm, setHourForm] = useState(null);
  const [ruleForm, setRuleForm] = useState({
    rule_name: '', effective_date: format(new Date(), 'yyyy-MM-dd'), end_date: '',
    entity_type: 'restaurant', rule_type: 'fully_closed', is_closed: true,
    fully_booked: false, notes_de: '', priority: 0,
  });

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) { setAccess('denied'); return; }
      setUser(u);
      setAccess('granted');
      loadAll();
    }).catch(() => setAccess('denied'));
  }, []);

  async function loadAll() {
    setLoading(true);
    const [hours, rules] = await Promise.all([
      base44.entities.OpeningHour.list('day_of_week', 50).catch(() => []),
      base44.entities.SpecialOpeningRule.list('-effective_date', 100).catch(() => []),
    ]);
    setOpeningHours(hours);
    setSpecialRules(rules);
    setLoading(false);
  }

  async function saveHour() {
    if (!hourForm) return;
    setSaving(true);
    if (hourForm.id) {
      await base44.entities.OpeningHour.update(hourForm.id, hourForm);
      setOpeningHours(prev => prev.map(h => h.id === hourForm.id ? { ...h, ...hourForm } : h));
    } else {
      const created = await base44.entities.OpeningHour.create(hourForm);
      setOpeningHours(prev => [...prev, created]);
    }
    setEditingHour(null);
    setHourForm(null);
    setSaving(false);
  }

  async function deleteHour(id) {
    await base44.entities.OpeningHour.delete(id);
    setOpeningHours(prev => prev.filter(h => h.id !== id));
  }

  async function saveRule() {
    setSaving(true);
    const data = {
      ...ruleForm,
      priority: parseInt(ruleForm.priority) || 0,
      is_closed: ['fully_closed', 'maintenance', 'private_event'].includes(ruleForm.rule_type),
      fully_booked: ruleForm.rule_type === 'fully_booked',
      created_by: user?.email,
    };
    const created = await base44.entities.SpecialOpeningRule.create(data);
    setSpecialRules(prev => [created, ...prev]);
    setShowRuleForm(false);
    setRuleForm({ rule_name: '', effective_date: format(new Date(), 'yyyy-MM-dd'), end_date: '', entity_type: 'restaurant', rule_type: 'fully_closed', is_closed: true, fully_booked: false, notes_de: '', priority: 0 });
    setSaving(false);
  }

  async function deleteRule(id) {
    await base44.entities.SpecialOpeningRule.delete(id);
    setSpecialRules(prev => prev.filter(r => r.id !== id));
  }

  function startEditHour(day) {
    const existing = openingHours.find(h => h.entity_type === 'restaurant' && h.day_of_week === day);
    setEditingHour(day);
    setHourForm(existing ? { ...existing } : {
      entity_type: 'restaurant', day_of_week: day, is_closed: day === 1,
      opening_time: '12:00', closing_time: '22:00', is_active: true,
      service_windows: day === 0
        ? [{ name: 'Ganztags', start: '12:00', end: '20:00', is_bookable: true }]
        : [
            { name: 'Mittagessen', start: '12:00', end: '14:15', is_bookable: true },
            { name: 'Abendessen', start: '17:30', end: '21:30', is_bookable: true },
          ],
    });
  }

  if (access === 'loading') return <div className="min-h-screen bg-charcoal flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;
  if (access === 'denied') return <div className="min-h-screen bg-charcoal flex items-center justify-center"><p className="text-red-400 font-body">Zugang verweigert</p></div>;

  const today = format(new Date(), 'yyyy-MM-dd');
  const upcomingRules = specialRules.filter(r => (!r.end_date || r.end_date >= today));
  const pastRules = specialRules.filter(r => r.end_date && r.end_date < today);

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-5">

        {/* Header */}
        <div className="flex items-center justify-between py-6 sm:py-8 gap-3">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-1">Admin</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory">Öffnungszeiten & Sperrtage</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/admin" className="px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">← Admin</Link>
            <button onClick={loadAll} className="px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-ivory text-xs font-body transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-espresso rounded-xl p-1 mb-6 border border-[#C9A96E]/10">
          {[
            { id: 'hours', label: 'Öffnungszeiten', icon: Clock },
            { id: 'blocked', label: 'Sperrtage / Sonderregeln', icon: CalendarOff },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-body tracking-widest uppercase transition-all ${tab === t.id ? 'bg-gold text-charcoal font-semibold' : 'text-ivory/40 hover:text-ivory'}`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {/* OPENING HOURS TAB */}
        {tab === 'hours' && (
          <div className="space-y-2">
            <p className="text-ivory/40 text-xs font-body mb-4">Konfigurieren Sie die regulären Öffnungszeiten pro Wochentag. Fehlende Tage verwenden die Standard-Einstellungen.</p>
            {[0, 1, 2, 3, 4, 5, 6].map(day => {
              const config = openingHours.find(h => h.entity_type === 'restaurant' && h.day_of_week === day);
              const isEditing = editingHour === day;
              return (
                <div key={day} className="glass-card border border-[#C9A96E]/08 rounded-xl p-4">
                  {!isEditing ? (
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-ivory text-sm font-body font-medium">{DAY_NAMES[day]}</p>
                          {day === 1 && !config && <span className="text-[10px] text-red-400 bg-red-950/30 border border-red-900/20 px-2 py-0.5 rounded-full font-body">Ruhetag (Standard)</span>}
                          {config?.is_closed && <span className="text-[10px] text-red-400 bg-red-950/30 border border-red-900/20 px-2 py-0.5 rounded-full font-body">Geschlossen</span>}
                          {config && !config.is_closed && <span className="text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/20 px-2 py-0.5 rounded-full font-body">Konfiguriert</span>}
                        </div>
                        {config && !config.is_closed && (config.service_windows || []).map((w, i) => (
                          <p key={i} className="text-ivory/40 text-xs font-body">{w.name}: {w.start}–{w.end} {w.is_bookable === false ? '(nicht buchbar)' : ''}</p>
                        ))}
                        {!config && day !== 1 && (
                          <p className="text-ivory/25 text-xs font-body">Standard: Mittag 12:00–14:15, Abend 17:30–21:30 {day === 0 ? '/ Sonntag: 12:00–20:00' : ''}</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => startEditHour(day)} className="px-3 py-1.5 glass-card border border-[#C9A96E]/15 text-ivory/50 hover:text-gold text-[10px] rounded-lg font-body tracking-widest uppercase transition-colors">
                          Bearbeiten
                        </button>
                        {config && (
                          <button onClick={() => deleteHour(config.id)} className="px-3 py-1.5 bg-red-950/30 border border-red-900/20 text-red-400/60 hover:text-red-400 text-[10px] rounded-lg font-body transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gold text-sm font-body font-medium">{DAY_NAMES[day]} bearbeiten</p>
                        <button onClick={() => { setEditingHour(null); setHourForm(null); }} className="text-ivory/30 hover:text-ivory"><X className="w-4 h-4" /></button>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={hourForm?.is_closed || false}
                          onChange={e => setHourForm(f => ({ ...f, is_closed: e.target.checked }))}
                          className="w-4 h-4 rounded border-[#C9A96E]/30 text-gold focus:ring-gold/30" />
                        <span className="text-ivory/60 text-sm font-body">Geschlossen (kein Service)</span>
                      </label>
                      {!hourForm?.is_closed && (
                        <div className="space-y-2">
                          <p className="text-ivory/40 text-[10px] uppercase tracking-widest font-body">Service-Fenster</p>
                          {(hourForm?.service_windows || []).map((w, i) => (
                            <div key={i} className="grid grid-cols-4 gap-2 items-center">
                              <input type="text" value={w.name} placeholder="Name" onChange={e => {
                                const sw = [...(hourForm.service_windows || [])];
                                sw[i] = { ...sw[i], name: e.target.value };
                                setHourForm(f => ({ ...f, service_windows: sw }));
                              }} className={inputCls} />
                              <input type="time" value={w.start} onChange={e => {
                                const sw = [...(hourForm.service_windows || [])];
                                sw[i] = { ...sw[i], start: e.target.value };
                                setHourForm(f => ({ ...f, service_windows: sw }));
                              }} className={inputCls} />
                              <input type="time" value={w.end} onChange={e => {
                                const sw = [...(hourForm.service_windows || [])];
                                sw[i] = { ...sw[i], end: e.target.value };
                                setHourForm(f => ({ ...f, service_windows: sw }));
                              }} className={inputCls} />
                              <button onClick={() => setHourForm(f => ({ ...f, service_windows: f.service_windows.filter((_, j) => j !== i) }))}
                                className="px-2 py-2 text-red-400/60 hover:text-red-400 text-xs font-body">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button onClick={() => setHourForm(f => ({ ...f, service_windows: [...(f.service_windows || []), { name: 'Neu', start: '12:00', end: '14:00', is_bookable: true }] }))}
                            className="text-gold/60 hover:text-gold text-[10px] font-body tracking-widest uppercase">
                            + Fenster hinzufügen
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => { setEditingHour(null); setHourForm(null); }} className="flex-1 py-2 glass-card border border-[#C9A96E]/15 rounded-xl text-ivory/40 text-sm font-body">Abbrechen</button>
                        <button onClick={saveHour} disabled={saving} className="flex-1 py-2 btn-gold rounded-xl text-sm font-body font-semibold flex items-center justify-center gap-2">
                          {saving ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : <><Check className="w-3.5 h-3.5" /> Speichern</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* BLOCKED DATES TAB */}
        {tab === 'blocked' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-ivory/40 text-xs font-body">Sperrtage, Feiertage, Privatveranstaltungen und Sonderregeln</p>
              <button onClick={() => setShowRuleForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 btn-gold rounded-xl text-xs font-body font-semibold tracking-widest uppercase">
                <Plus className="w-3.5 h-3.5" /> Neue Regel
              </button>
            </div>

            {/* New rule modal */}
            {showRuleForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-md px-4">
                <div className="glass-card border border-[#C9A96E]/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display text-xl font-light text-ivory">Neue Sonderregel</h2>
                    <button onClick={() => setShowRuleForm(false)} className="text-ivory/30 hover:text-ivory"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Name der Regel *</label>
                      <input type="text" value={ruleForm.rule_name} onChange={e => setRuleForm(f => ({ ...f, rule_name: e.target.value }))}
                        placeholder="z.B. Heiligabend, Betriebsurlaub..." className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Von *</label>
                        <input type="date" value={ruleForm.effective_date} onChange={e => setRuleForm(f => ({ ...f, effective_date: e.target.value }))} className={inputCls} />
                      </div>
                      <div>
                        <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Bis (leer = nur dieser Tag)</label>
                        <input type="date" value={ruleForm.end_date} onChange={e => setRuleForm(f => ({ ...f, end_date: e.target.value }))} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Regeltyp</label>
                      <select value={ruleForm.rule_type} onChange={e => setRuleForm(f => ({ ...f, rule_type: e.target.value }))} className={inputCls}>
                        {RULE_TYPES.map(rt => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Priorität (höher = Vorrang)</label>
                      <input type="number" min="0" max="100" value={ruleForm.priority} onChange={e => setRuleForm(f => ({ ...f, priority: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Hinweis (intern)</label>
                      <input type="text" value={ruleForm.notes_de} onChange={e => setRuleForm(f => ({ ...f, notes_de: e.target.value }))} placeholder="Interne Notiz..." className={inputCls} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={() => setShowRuleForm(false)} className="flex-1 py-3 glass-card border border-[#C9A96E]/15 rounded-xl text-ivory/40 text-sm font-body">Abbrechen</button>
                    <button onClick={saveRule} disabled={saving || !ruleForm.rule_name || !ruleForm.effective_date}
                      className="flex-1 py-3 btn-gold rounded-xl text-sm font-body font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                      {saving ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : <><Check className="w-3.5 h-3.5" /> Erstellen</>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming rules */}
            <div>
              <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-body mb-3">Aktive & Bevorstehende</p>
              {upcomingRules.length === 0 ? (
                <div className="text-center py-8 text-ivory/20 font-body text-sm">Keine aktiven Sonderregeln</div>
              ) : (
                <div className="space-y-2">
                  {upcomingRules.map(rule => (
                    <div key={rule.id} className="glass-card border border-[#C9A96E]/08 rounded-xl p-4 flex items-center gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-ivory text-sm font-body font-medium">{rule.rule_name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body uppercase tracking-widest ${
                            rule.is_closed ? 'text-red-400 bg-red-950/30 border-red-900/20' :
                            rule.fully_booked ? 'text-amber-400 bg-amber-950/30 border-amber-900/20' :
                            'text-ivory/40 bg-ivory/5 border-ivory/10'
                          }`}>{RULE_TYPES.find(t => t.value === rule.rule_type)?.label || rule.rule_type}</span>
                        </div>
                        <p className="text-ivory/40 text-xs font-body">
                          {rule.effective_date}{rule.end_date && rule.end_date !== rule.effective_date ? ` → ${rule.end_date}` : ''}
                          {rule.notes_de ? ` · ${rule.notes_de}` : ''}
                        </p>
                      </div>
                      <button onClick={() => deleteRule(rule.id)}
                        className="px-3 py-1.5 bg-red-950/30 border border-red-900/20 text-red-400/60 hover:text-red-400 text-[10px] rounded-lg font-body transition-colors flex-shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past rules */}
            {pastRules.length > 0 && (
              <div>
                <p className="text-ivory/20 text-[10px] tracking-[0.3em] uppercase font-body mb-3 mt-6">Vergangene Regeln</p>
                <div className="space-y-1.5 opacity-40">
                  {pastRules.slice(0, 5).map(rule => (
                    <div key={rule.id} className="glass-card border border-ivory/05 rounded-xl p-3 flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-ivory/60 text-xs font-body">{rule.rule_name} · {rule.effective_date}{rule.end_date ? ` → ${rule.end_date}` : ''}</p>
                      </div>
                      <button onClick={() => deleteRule(rule.id)} className="text-ivory/20 hover:text-red-400 text-[10px] font-body"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}