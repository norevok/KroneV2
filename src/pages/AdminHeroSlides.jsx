/**
 * /admin/hero — Hero Slide Manager
 * Allows admin to add, edit, reorder, and delete homepage hero slides.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Trash2, Check, X, RefreshCw, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const EMPTY = {
  title_de: '', title_en: '', subtitle_de: '', subtitle_en: '',
  image_url: '', cta_label_de: '', cta_label_en: '', cta_link: '',
  sort_order: 0, is_active: true,
};

const inputCls = "w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-2.5 text-sm text-ivory font-body focus:outline-none focus:border-gold/30 placeholder-ivory/20";

export default function AdminHeroSlides() {
  const [access, setAccess] = useState('loading');
  const [slides, setSlides] = useState([]);
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
    const all = await base44.entities.HeroSlide.list('sort_order', 50).catch(() => []);
    setSlides(all);
    setLoading(false);
  }

  async function save() {
    if (!editing?.title_de || !editing?.image_url) return;
    setSaving(true);
    const data = { ...editing, sort_order: parseInt(editing.sort_order) || 0 };
    if (data.id) {
      await base44.entities.HeroSlide.update(data.id, data);
    } else {
      await base44.entities.HeroSlide.create(data);
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    await load();
  }

  async function toggle(slide) {
    await base44.entities.HeroSlide.update(slide.id, { is_active: !slide.is_active });
    setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, is_active: !s.is_active } : s));
  }

  async function remove(id) {
    if (!confirm('Slide wirklich löschen?')) return;
    await base44.entities.HeroSlide.delete(id);
    setSlides(prev => prev.filter(s => s.id !== id));
  }

  async function reorder(slide, dir) {
    const newOrder = (slide.sort_order || 0) + dir;
    await base44.entities.HeroSlide.update(slide.id, { sort_order: newOrder });
    await load();
  }

  if (access === 'loading') return <div className="min-h-screen bg-charcoal flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;
  if (access === 'denied') return <div className="min-h-screen bg-charcoal flex items-center justify-center"><p className="text-red-400 font-body">Zugang verweigert</p></div>;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-5">
        <div className="flex items-center justify-between py-6 sm:py-8 gap-3 flex-wrap">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-1">Admin</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory">Hero Slider verwalten</h1>
            <p className="text-ivory/30 text-xs font-body mt-1">Slides werden auf der Startseite im Hero-Bereich angezeigt.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin" className="px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">← Admin</Link>
            <button onClick={load} className="px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-ivory text-xs transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => { setEditing({ ...EMPTY, sort_order: slides.length }); setShowForm(true); }}
              className="flex items-center gap-1.5 px-4 py-2 btn-gold rounded-xl text-xs font-body font-semibold tracking-widest uppercase">
              <Plus className="w-3.5 h-3.5" /> Neuer Slide
            </button>
          </div>
        </div>

        {/* Note about static slides */}
        <div className="mb-6 bg-gold/8 border border-gold/20 rounded-xl p-4">
          <p className="text-gold/80 text-xs font-body">
            <strong>Hinweis:</strong> Die Homepage zeigt aktuell statische Slides aus dem Code. Diese Seite verwaltet zusätzliche DB-Slides. 
            Um den Slider vollständig DB-gesteuert zu machen, können Slides aus der HeroSlide-Entity in die Homepage integriert werden.
          </p>
        </div>

        {/* Form Modal */}
        {showForm && editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-md px-4">
            <div className="glass-card border border-[#C9A96E]/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-light text-ivory">{editing.id ? 'Slide bearbeiten' : 'Neuer Slide'}</h2>
                <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-5 h-5 text-ivory/40 hover:text-ivory" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Bild-URL *</label>
                  <input type="url" value={editing.image_url} onChange={e => setEditing(p => ({ ...p, image_url: e.target.value }))} className={inputCls} placeholder="https://..." />
                  {editing.image_url && (
                    <div className="mt-2 rounded-xl overflow-hidden h-32">
                      <img src={editing.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Überschrift DE *</label>
                    <input type="text" value={editing.title_de} onChange={e => setEditing(p => ({ ...p, title_de: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Überschrift EN</label>
                    <input type="text" value={editing.title_en || ''} onChange={e => setEditing(p => ({ ...p, title_en: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Untertitel DE</label>
                    <input type="text" value={editing.subtitle_de || ''} onChange={e => setEditing(p => ({ ...p, subtitle_de: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Untertitel EN</label>
                    <input type="text" value={editing.subtitle_en || ''} onChange={e => setEditing(p => ({ ...p, subtitle_en: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">CTA Label DE</label>
                    <input type="text" value={editing.cta_label_de || ''} onChange={e => setEditing(p => ({ ...p, cta_label_de: e.target.value }))} className={inputCls} placeholder="Zimmer buchen" />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">CTA Link</label>
                    <input type="text" value={editing.cta_link || ''} onChange={e => setEditing(p => ({ ...p, cta_link: e.target.value }))} className={inputCls} placeholder="/booking" />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Reihenfolge</label>
                    <input type="number" value={editing.sort_order || 0} onChange={e => setEditing(p => ({ ...p, sort_order: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div onClick={() => setEditing(p => ({ ...p, is_active: !p.is_active }))}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${editing.is_active ? 'bg-gold border-gold' : 'border-[#C9A96E]/20'}`}>
                        {editing.is_active && <Check className="w-3 h-3 text-charcoal" />}
                      </div>
                      <span className="text-ivory/60 text-sm font-body">Aktiv (auf Startseite anzeigen)</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-3 glass-card border border-[#C9A96E]/15 rounded-xl text-ivory/40 text-sm font-body">Abbrechen</button>
                <button onClick={save} disabled={saving || !editing.title_de || !editing.image_url}
                  className="flex-1 py-3 btn-gold rounded-xl text-sm font-body font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Speichern</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
        ) : slides.length === 0 ? (
          <div className="text-center py-16 glass-card border border-[#C9A96E]/08 rounded-2xl">
            <p className="text-ivory/30 text-sm font-body mb-4">Noch keine DB-Slides. Klicken Sie auf "Neuer Slide" um einen hinzuzufügen.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((slide, i) => (
              <div key={slide.id} className={`glass-card border rounded-2xl overflow-hidden transition-all ${slide.is_active ? 'border-[#C9A96E]/12 hover:border-[#C9A96E]/25' : 'border-[#C9A96E]/05 opacity-50'}`}>
                <div className="flex items-start gap-3 p-4">
                  {slide.image_url && (
                    <div className="w-20 h-14 sm:w-28 sm:h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={slide.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-body text-ivory/30">#{slide.sort_order ?? i}</span>
                      {slide.is_active
                        ? <span className="text-[10px] font-body text-emerald-400 border border-emerald-800/30 px-1.5 py-0.5 rounded-full">Aktiv</span>
                        : <span className="text-[10px] font-body text-ivory/25 border border-ivory/10 px-1.5 py-0.5 rounded-full">Inaktiv</span>}
                    </div>
                    <p className="text-ivory font-body text-sm font-semibold truncate">{slide.title_de}</p>
                    {slide.subtitle_de && <p className="text-ivory/40 text-xs font-body truncate">{slide.subtitle_de}</p>}
                    {slide.cta_link && <p className="text-gold/50 text-xs font-body mt-1">{slide.cta_link}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => reorder(slide, -1)} disabled={i === 0} className="p-1.5 text-ivory/20 hover:text-ivory/60 disabled:opacity-20 transition-colors"><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => reorder(slide, 1)} disabled={i === slides.length - 1} className="p-1.5 text-ivory/20 hover:text-ivory/60 disabled:opacity-20 transition-colors"><ArrowDown className="w-3.5 h-3.5" /></button>
                    <button onClick={() => toggle(slide)} className={`p-1.5 rounded-lg transition-colors ${slide.is_active ? 'text-emerald-400' : 'text-ivory/20'}`}>
                      {slide.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => { setEditing({ ...slide }); setShowForm(true); }} className="p-1.5 text-ivory/30 hover:text-gold rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => remove(slide.id)} className="p-1.5 text-ivory/20 hover:text-red-400 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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