import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { format } from 'date-fns';
import {
  ArrowLeft, Users, Plus, Search, Mail, Phone, Calendar, Star, Edit2, Trash2,
  Filter, Download, ChevronLeft, ChevronRight, UserCheck, XCircle, CheckCircle,
  MoreVertical, TrendingUp, BedDouble, UtensilsCrossed, Gift
} from 'lucide-react';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const STATUS_COLORS = {
  active: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/30',
  inactive: 'text-ivory/40 bg-ivory/5 border-ivory/10',
  suspended: 'text-red-400 bg-red-950/40 border-red-800/30',
};

const LANGUAGE_LABELS = { de: '🇩🇪 DE', en: '🇬🇧 EN', it: '🇮🇹 IT' };

export default function AdminGuests() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState('loading');
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  const C = {
    de: {
      title: 'Gästeverwaltung',
      back: 'Zurück zum Dashboard',
      add_guest: 'Gast hinzufügen',
      search_placeholder: 'Name, E-Mail suchen...',
      all_status: 'Alle Status',
      active: 'Aktiv',
      inactive: 'Inaktiv',
      suspended: 'Suspendiert',
      total_guests: 'Gesamte Gäste',
      vip_guests: 'VIP Gäste',
      new_this_month: 'Neu diesen Monat',
      name: 'Name',
      email: 'E-Mail',
      phone: 'Telefon',
      language: 'Sprache',
      status: 'Status',
      reservations: 'Reservierungen',
      bookings: 'Buchungen',
      last_activity: 'Letzte Aktivität',
      actions: 'Aktionen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      view_profile: 'Profil ansehen',
      no_guests: 'Keine Gäste gefunden',
      add_title: 'Neuen Gast hinzufügen',
      edit_title: 'Gast bearbeiten',
      first_name: 'Vorname',
      last_name: 'Nachname',
      save: 'Speichern',
      cancel: 'Abbrechen',
      vip: 'VIP',
      notes: 'Notizen',
      dietary: 'Ernährung',
      preferences: 'Präferenzen',
    },
    en: {
      title: 'Guest Management',
      back: 'Back to Dashboard',
      add_guest: 'Add Guest',
      search_placeholder: 'Search name, email...',
      all_status: 'All Status',
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended',
      total_guests: 'Total Guests',
      vip_guests: 'VIP Guests',
      new_this_month: 'New This Month',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      language: 'Language',
      status: 'Status',
      reservations: 'Reservations',
      bookings: 'Bookings',
      last_activity: 'Last Activity',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      view_profile: 'View Profile',
      no_guests: 'No guests found',
      add_title: 'Add New Guest',
      edit_title: 'Edit Guest',
      first_name: 'First Name',
      last_name: 'Last Name',
      save: 'Save',
      cancel: 'Cancel',
      vip: 'VIP',
      notes: 'Notes',
      dietary: 'Dietary',
      preferences: 'Preferences',
    },
    it: {
      title: 'Gestione Ospiti',
      back: 'Torna alla dashboard',
      add_guest: 'Aggiungi ospite',
      search_placeholder: 'Cerca nome, email...',
      all_status: 'Tutti gli stati',
      active: 'Attivo',
      inactive: 'Inattivo',
      suspended: 'Sospeso',
      total_guests: 'Ospiti totali',
      vip_guests: 'Ospiti VIP',
      new_this_month: 'Nuovi questo mese',
      name: 'Nome',
      email: 'Email',
      phone: 'Telefono',
      language: 'Lingua',
      status: 'Stato',
      reservations: 'Prenotazioni',
      bookings: 'Prenotazioni hotel',
      last_activity: 'Ultima attività',
      actions: 'Azioni',
      edit: 'Modifica',
      delete: 'Elimina',
      view_profile: 'Vedi profilo',
      no_guests: 'Nessun ospite trovato',
      add_title: 'Aggiungi nuovo ospite',
      edit_title: 'Modifica ospite',
      first_name: 'Nome',
      last_name: 'Cognome',
      save: 'Salva',
      cancel: 'Annulla',
      vip: 'VIP',
      notes: 'Note',
      dietary: 'Dietetico',
      preferences: 'Preferenze',
    },
  };

  const c = C[lang] || C.de;

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) {
        setAccess('denied');
        return;
      }
      setUser(u);
      setAccess('granted');
      loadGuests();
    }).catch(() => setAccess('denied'));
  }, []);

  async function loadGuests() {
    setLoading(true);
    try {
      const profiles = await base44.entities.GuestProfile.list('-created_date', 200);
      setGuests(profiles);
    } catch (e) {
      console.error('Failed to load guests:', e);
    }
    setLoading(false);
  }

  async function handleAddGuest(formData) {
    try {
      await base44.entities.GuestProfile.create({
        user_email: formData.email.toLowerCase(),
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || '',
        language: formData.language || 'de',
        is_vip: formData.is_vip || false,
        notes: formData.notes || '',
        dietary_restrictions: formData.dietary || '',
        special_preferences: formData.preferences || '',
        account_status: 'active',
      });
      await loadGuests();
      setShowAddModal(false);
    } catch (e) {
      alert(lang === 'de' ? 'Fehler beim Hinzufügen: ' + e.message : 'Error adding guest: ' + e.message);
    }
  }

  async function handleUpdateGuest(formData) {
    try {
      await base44.entities.GuestProfile.update(selectedGuest.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        language: formData.language,
        is_vip: formData.is_vip,
        notes: formData.notes,
        dietary_restrictions: formData.dietary,
        special_preferences: formData.preferences,
        account_status: formData.account_status,
      });
      await loadGuests();
      setShowEditModal(false);
      setSelectedGuest(null);
    } catch (e) {
      alert(lang === 'de' ? 'Fehler beim Speichern: ' + e.message : 'Error saving: ' + e.message);
    }
  }

  async function handleDeleteGuest(guestId) {
    if (!confirm(lang === 'de' ? 'Gast wirklich löschen?' : 'Delete guest?')) return;
    try {
      await base44.entities.GuestProfile.delete(guestId);
      await loadGuests();
    } catch (e) {
      alert(lang === 'de' ? 'Fehler beim Löschen: ' + e.message : 'Error deleting: ' + e.message);
    }
  }

  const filteredGuests = guests.filter(g => {
    const matchesSearch = searchTerm === '' ||
      g.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.account_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: guests.length,
    vip: guests.filter(g => g.is_vip).length,
    new: guests.filter(g => {
      const created = new Date(g.created_date);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
  };

  if (access === 'loading') {
    return <div className="min-h-screen bg-[#1C1714] flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;
  }

  if (access === 'denied') {
    return (
      <div className="min-h-screen bg-[#1C1714] flex items-center justify-center px-5">
        <div className="text-center glass-card border border-red-900/30 rounded-2xl p-10 max-w-sm">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-light text-ivory mb-2">Zugang verweigert</h1>
          <p className="text-ivory/40 text-sm font-body">Nur für autorisierte Admins.</p>
          <button onClick={() => navigate('/admin')} className="mt-6 px-6 py-3 btn-gold rounded-full text-xs uppercase tracking-widest font-body font-semibold">Dashboard</button>
        </div>
      </div>
    );
  }

  const inputCls = "w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-2.5 text-sm text-ivory font-body focus:outline-none focus:border-gold/30 transition-colors";

  return (
    <div className="min-h-screen bg-[#1C1714] text-ivory pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <Link to="/admin" className="flex items-center gap-2 text-gold/60 hover:text-gold text-xs font-body tracking-wider mb-3 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> {c.back}
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory">{c.title}</h1>
            <p className="text-ivory/30 text-xs font-body mt-1">{user?.email}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gold hover:bg-[#B8924A] text-charcoal rounded-xl text-sm font-body font-bold tracking-widest uppercase transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" /> {c.add_guest}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5">
            <Users className="w-5 h-5 text-gold mb-3" />
            <p className="font-display text-3xl font-light text-ivory">{stats.total}</p>
            <p className="text-ivory/40 text-[10px] font-body uppercase tracking-wider mt-1">{c.total_guests}</p>
          </div>
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5">
            <Star className="w-5 h-5 text-gold mb-3" />
            <p className="font-display text-3xl font-light text-ivory">{stats.vip}</p>
            <p className="text-ivory/40 text-[10px] font-body uppercase tracking-wider mt-1">{c.vip_guests}</p>
          </div>
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5">
            <TrendingUp className="w-5 h-5 text-gold mb-3" />
            <p className="font-display text-3xl font-light text-ivory">{stats.new}</p>
            <p className="text-ivory/40 text-[10px] font-body uppercase tracking-wider mt-1">{c.new_this_month}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/30" />
            <input
              type="text"
              placeholder={c.search_placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputCls} pl-10`}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputCls + ' w-40'}
            >
              <option value="all">{c.all_status}</option>
              <option value="active">{c.active}</option>
              <option value="inactive">{c.inactive}</option>
              <option value="suspended">{c.suspended}</option>
            </select>
          </div>
        </div>

        {/* Guest List */}
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
        ) : filteredGuests.length === 0 ? (
          <div className="text-center py-16 text-ivory/30 font-body text-sm">{c.no_guests}</div>
        ) : (
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#C9A96E]/08">
                    <th className="text-left text-[10px] tracking-widest uppercase font-body text-ivory/25 px-4 py-3">{c.name}</th>
                    <th className="text-left text-[10px] tracking-widest uppercase font-body text-ivory/25 px-4 py-3">{c.email}</th>
                    <th className="text-left text-[10px] tracking-widest uppercase font-body text-ivory/25 px-4 py-3">{c.phone}</th>
                    <th className="text-left text-[10px] tracking-widest uppercase font-body text-ivory/25 px-4 py-3">{c.language}</th>
                    <th className="text-left text-[10px] tracking-widest uppercase font-body text-ivory/25 px-4 py-3">{c.status}</th>
                    <th className="text-left text-[10px] tracking-widest uppercase font-body text-ivory/25 px-4 py-3">{c.reservations}</th>
                    <th className="text-left text-[10px] tracking-widest uppercase font-body text-ivory/25 px-4 py-3">{c.last_activity}</th>
                    <th className="text-left text-[10px] tracking-widest uppercase font-body text-ivory/25 px-4 py-3">{c.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map(guest => (
                    <tr key={guest.id} className="border-b border-[#C9A96E]/05 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-gold text-xs font-bold">{guest.first_name?.[0]}{guest.last_name?.[0]}</span>
                          </div>
                          <div>
                            <p className="text-ivory/80 text-sm font-body font-semibold">{guest.first_name} {guest.last_name}</p>
                            {guest.is_vip && <span className="text-[10px] text-gold font-body flex items-center gap-1"><Star className="w-2.5 h-2.5" /> VIP</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ivory/50 text-xs font-body">{guest.user_email}</td>
                      <td className="px-4 py-3 text-ivory/50 text-xs font-body">{guest.phone || '—'}</td>
                      <td className="px-4 py-3 text-ivory/50 text-xs font-body">{LANGUAGE_LABELS[guest.language] || 'DE'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-body font-semibold border ${STATUS_COLORS[guest.account_status]}`}>
                          {guest.account_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ivory/50 text-xs font-body">{guest.total_reservations || 0}</td>
                      <td className="px-4 py-3 text-ivory/30 text-[10px] font-body whitespace-nowrap">
                        {guest.last_activity_at ? format(new Date(guest.last_activity_at), 'dd.MM.yy HH:mm') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setSelectedGuest(guest); setShowEditModal(true); }}
                            className="p-1.5 hover:bg-gold/20 rounded-lg transition-colors"
                            title={c.edit}
                          >
                            <Edit2 className="w-3.5 h-3.5 text-ivory/50 hover:text-gold" />
                          </button>
                          <button
                            onClick={() => handleDeleteGuest(guest.id)}
                            className="p-1.5 hover:bg-red-900/30 rounded-lg transition-colors"
                            title={c.delete}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-ivory/50 hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Guest Modal */}
        {showAddModal && (
          <AddGuestModal
            lang={lang}
            c={c}
            inputCls={inputCls}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddGuest}
          />
        )}

        {/* Edit Guest Modal */}
        {showEditModal && selectedGuest && (
          <EditGuestModal
            guest={selectedGuest}
            lang={lang}
            c={c}
            inputCls={inputCls}
            onClose={() => { setShowEditModal(false); setSelectedGuest(null); }}
            onSubmit={handleUpdateGuest}
          />
        )}
      </div>
    </div>
  );
}

function AddGuestModal({ lang, c, inputCls, onClose, onSubmit }) {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    language: 'de', is_vip: false, notes: '', dietary: '', preferences: '',
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5">
      <div className="glass-card border border-[#C9A96E]/15 rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-light text-ivory">{c.add_title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <XCircle className="w-5 h-5 text-ivory/50" />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.first_name}</label>
              <input type="text" required value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.last_name}</label>
              <input type="text" required value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">E-Mail</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.phone}</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.language}</label>
              <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} className={inputCls}>
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                <option value="it">Italiano</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="vip" checked={form.is_vip} onChange={e => setForm(f => ({ ...f, is_vip: e.target.checked }))} className="w-4 h-4 rounded border-gold/30 text-gold focus:ring-gold/20" />
            <label htmlFor="vip" className="text-ivory/70 text-sm font-body flex items-center gap-2"><Star className="w-3.5 h-3.5 text-gold" /> {c.vip}</label>
          </div>
          <div>
            <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.notes}</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={`${inputCls} resize-none h-20`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.dietary}</label>
              <textarea value={form.dietary} onChange={e => setForm(f => ({ ...f, dietary: e.target.value }))} className={`${inputCls} resize-none h-16`} />
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.preferences}</label>
              <textarea value={form.preferences} onChange={e => setForm(f => ({ ...f, preferences: e.target.value }))} className={`${inputCls} resize-none h-16`} />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#C9A96E]/20 text-ivory/50 hover:text-ivory rounded-xl text-sm font-body tracking-widest uppercase transition-colors">{c.cancel}</button>
            <button type="submit" className="flex-1 py-3 bg-gold hover:bg-[#B8924A] text-charcoal rounded-xl text-sm font-body font-bold tracking-widest uppercase transition-all shadow-lg">{c.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditGuestModal({ guest, lang, c, inputCls, onClose, onSubmit }) {
  const [form, setForm] = useState({
    first_name: guest.first_name || '',
    last_name: guest.last_name || '',
    phone: guest.phone || '',
    language: guest.language || 'de',
    is_vip: guest.is_vip || false,
    notes: guest.notes || '',
    dietary: guest.dietary_restrictions || '',
    preferences: guest.special_preferences || '',
    account_status: guest.account_status || 'active',
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5">
      <div className="glass-card border border-[#C9A96E]/15 rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-light text-ivory">{c.edit_title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <XCircle className="w-5 h-5 text-ivory/50" />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.first_name}</label>
              <input type="text" required value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.last_name}</label>
              <input type="text" required value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">E-Mail</label>
            <input type="email" value={guest.user_email} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.phone}</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.language}</label>
              <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} className={inputCls}>
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                <option value="it">Italiano</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.status}</label>
            <select value={form.account_status} onChange={e => setForm(f => ({ ...f, account_status: e.target.value }))} className={inputCls}>
              <option value="active">{c.active}</option>
              <option value="inactive">{c.inactive}</option>
              <option value="suspended">{c.suspended}</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="edit-vip" checked={form.is_vip} onChange={e => setForm(f => ({ ...f, is_vip: e.target.checked }))} className="w-4 h-4 rounded border-gold/30 text-gold focus:ring-gold/20" />
            <label htmlFor="edit-vip" className="text-ivory/70 text-sm font-body flex items-center gap-2"><Star className="w-3.5 h-3.5 text-gold" /> {c.vip}</label>
          </div>
          <div>
            <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.notes}</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={`${inputCls} resize-none h-20`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.dietary}</label>
              <textarea value={form.dietary} onChange={e => setForm(f => ({ ...f, dietary: e.target.value }))} className={`${inputCls} resize-none h-16`} />
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-2">{c.preferences}</label>
              <textarea value={form.preferences} onChange={e => setForm(f => ({ ...f, preferences: e.target.value }))} className={`${inputCls} resize-none h-16`} />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#C9A96E]/20 text-ivory/50 hover:text-ivory rounded-xl text-sm font-body tracking-widest uppercase transition-colors">{c.cancel}</button>
            <button type="submit" className="flex-1 py-3 bg-gold hover:bg-[#B8924A] text-charcoal rounded-xl text-sm font-body font-bold tracking-widest uppercase transition-all shadow-lg">{c.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
}