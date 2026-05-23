/**
 * /admin/offers — Offers / Arrangements Manager
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Trash2, Check, X, RefreshCw, Eye, EyeOff } from 'lucide-react';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const OFFER_TYPES = [
  { id: 'direktbucher', label: 'Direktbucher-Vorteil' },
  { id: 'wochenende', label: 'Wochenendaufenthalt' },
  { id: 'geschaeftsreise', label: 'Geschäftsreise' },
  { id: 'gruppe', label: 'Gruppe / Event' },
  { id: 'saisonal', label: 'Saisonal' },
  { id: 'other', label: 'Sonstiges' },
];

const EMPTY = {
  title_de: '', title_en: '', description_de: '', description_en: '',
  offer_type: 'direktbucher', price_info: '', image_url: '',
  valid_from: '', valid_until: '', cta_link: '/booking',
  is_active: true, sort_order: 0,
};

const inputCls = "w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-2.5 text-sm text-ivory font-body focus:outline-none focus:border-gold/30 placeholder-ivory/20";

export default function AdminOffers() {
  const [access, setAccess] = useState('loading');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) { setAccess('denied'); return; }
      setAccess('granted');
      load();
    }).catch(() => setAccess('denied'));
  }, []);

  async function load() {
    setLoading(true);
    const all = await base44.entities.Offer.list('sort_order', 100).catch(() => []);
    setOffers(all);
    setLoading(false);
  }

  async function save() {
    if (!editing?.title_de) return;
    setSaving(true);
    const data = { ...editing, sort_order: parseInt(editing.sort_order) || 0 };
    if (data.id) {
      await base44.entities.Offer.update(data.id, data);
    } else {
      await base44.entities.Offer.create(data);
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    await load();
  }

  async function toggle(offer) {
    await base44.entities.Offer.update(offer.id, { is_active: !offer.is_active });
    setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, is_active: !o.is_active } : o));
  }

  async function remove(id) {
    if (!confirm('Angebot wirklich löschen?')) return;
    await base44.entities.Offer.delete(id);
    setOffers(prev => prev.filter(o => o.id !== id));
  }

  if (access === 'loading') return <div className="min-h-screen bg-charcoal flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;
  if (access === 'denied') return <div className="min-h-screen bg-charcoal flex items-center justify-center"><p className="text-red-400 font-body">Zugang verweigert</p></div>;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-5">
        <div className="flex items-center justify-between py-6 sm:py-8 gap-3 flex-wrap">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-1">Admin</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory">Angebote verwalten</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/admin" className="px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">← Admin</Link>
            <button onClick={load} className="px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-ivory text-xs transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => { setEditing({ ...EMPTY, sort_order: offers.length }); setShowForm(true); }}
              className="flex items-center gap-1.5 px-4 py-2 btn-gold rounded-xl text-xs font-body font-semibold tracking-widest uppercase">
              <Plus className="w-3.5 h-3.5" /> Neues Angebot
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-md px-4">
            <div className="glass-card border border-[#C9A96E]/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-light text-ivory">{editing.id ? 'Angebot bearbeiten' : 'Neues Angebot'}</h2>
                <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-5 h-5 text-ivory/40 hover:text-ivory" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Angebots-Typ</label>
                  <select value={editing.offer_type} onChange={e => setEditing(p => ({ ...p, offer_type: e.target.value }))} className={inputCls}>
                    {OFFER_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Titel DE *</label>
                    <input type="text" value={editing.title_de} onChange={e => setEditing(p => ({ ...p, title_de: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Titel EN</label>
                    <input type="text" value={editing.title_en || ''} onChange={e => setEditing(p => ({ ...p, title_en: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Beschreibung DE</label>
                    <textarea rows={3} value={editing.description_de || ''} onChange={e => setEditing(p => ({ ...p, description_de: e.target.value }))} className={inputCls + ' resize-none'} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Beschreibung EN</label>
                    <textarea rows={3} value={editing.description_en || ''} onChange={e => setEditing(p => ({ ...p, description_en: e.target.value }))} className={inputCls + ' resize-none'} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Preis-Info (z.B. "Ab €99/Nacht")</label>
                    <input type="text" value={editing.price_info || ''} onChange={e => setEditing(p => ({ ...p, price_info: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Bild-URL</label>
                    <input type="url" value={editing.image_url || ''} onChange={e => setEditing(p => ({ ...p, image_url: e.target.value }))} className={inputCls} placeholder="https://..." />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Gültig von</label>
                    <input type="date" value={editing.valid_from || ''} onChange={e => setEditing(p => ({ ...p, valid_from: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Gültig bis</label>
                    <input type="date" value={editing.valid_until || ''} onChange={e => setEditing(p => ({ ...p, valid_until: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">CTA Link</label>
                    <input type="text" value={editing.cta_link || ''} onChange={e => setEditing(p => ({ ...p, cta_link: e.target.value }))} className={inputCls} placeholder="/booking" />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Reihenfolge</label>
                    <input type="number" value={editing.sort_order || 0} onChange={e => setEditing(p => ({ ...p, sort_order: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => setEditing(p => ({ ...p, is_active: !p.is_active }))}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${editing.is_active ? 'bg-gold border-gold' : 'border-[#C9A96E]/20'}`}>
                    {editing.is_active && <Check className="w-3 h-3 text-charcoal" />}
                  </div>
                  <span className="text-ivory/60 text-sm font-body">Aktiv (auf der Angebote-Seite anzeigen)</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-3 glass-card border border-[#C9A96E]/15 rounded-xl text-ivory/40 text-sm font-body">Abbrechen</button>
                <button onClick={save} disabled={saving || !editing.title_de}
                  className="flex-1 py-3 btn-gold rounded-xl text-sm font-body font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Speichern</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
        ) : offers.length === 0 ? (
          <div className="text-center py-16 glass-card border border-[#C9A96E]/08 rounded-2xl">
            <p className="text-ivory/30 text-sm font-body">Noch keine DB-Angebote. Die Angebote-Seite zeigt statische Inhalte aus dem Code.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {offers.map(offer => (
              <div key={offer.id} className={`glass-card border rounded-xl p-4 transition-all ${offer.is_active ? 'border-[#C9A96E]/08 hover:border-[#C9A96E]/20' : 'border-[#C9A96E]/04 opacity-50'}`}>
                <div className="flex items-center gap-3 flex-wrap">
                  {offer.image_url && (
                    <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={offer.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-body text-sm text-ivory">{offer.title_de}</span>
                      <span className="text-[10px] text-ivory/30 border border-ivory/10 px-1.5 py-0.5 rounded-full font-body">{OFFER_TYPES.find(t => t.id === offer.offer_type)?.label}</span>
                    </div>
                    {offer.price_info && <span className="text-gold/70 text-xs font-body">{offer.price_info}</span>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => toggle(offer)} className={`p-1.5 rounded-lg transition-colors ${offer.is_active ? 'text-emerald-400' : 'text-ivory/20'}`}>
                      {offer.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => { setEditing({ ...offer }); setShowForm(true); }} className="p-1.5 text-ivory/30 hover:text-gold rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => remove(offer.id)} className="p-1.5 text-ivory/20 hover:text-red-400 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}