import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Search, RefreshCw, CheckCircle, AlertCircle, XCircle, Link2, Eye, Settings, Loader2, BedDouble, User, Mail } from 'lucide-react';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

function StatusBadge({ status }) {
  const MAP = {
    pending: 'bg-amber-900/30 text-amber-400 border-amber-700/20',
    in_review: 'bg-blue-900/30 text-blue-400 border-blue-700/20',
    linked: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/20',
    not_found: 'bg-red-900/30 text-red-400 border-red-700/20',
    rejected: 'bg-red-900/30 text-red-400 border-red-700/20',
    matched: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/20',
    no_match: 'bg-red-900/30 text-red-400 border-red-700/20',
    api_error: 'bg-red-900/30 text-red-400 border-red-700/20',
    manual_review: 'bg-amber-900/30 text-amber-400 border-amber-700/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-medium border tracking-wider uppercase ${MAP[status] || 'bg-ivory/5 text-ivory/40 border-ivory/10'}`}>
      {status}
    </span>
  );
}

export default function AdminBeds24Bookings() {
  const navigate = useNavigate();
  const [access, setAccess] = useState('loading');
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('links');
  const [links, setLinks] = useState([]);
  const [lookupRequests, setLookupRequests] = useState([]);
  const [returnLogs, setReturnLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // API lookup state
  const [apiRef, setApiRef] = useState('');
  const [apiEmail, setApiEmail] = useState('');
  const [apiArrival, setApiArrival] = useState('');
  const [apiResults, setApiResults] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Settings
  const [cred, setCred] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) {
        setAccess('denied'); return;
      }
      setUser(u);
      setAccess('granted');
      loadAll();
    }).catch(() => setAccess('denied'));
  }, []);

  async function loadAll() {
    setLoading(true);
    const [lnks, reqs, logs, creds] = await Promise.all([
      base44.entities.GuestReservationLink.list('-created_date', 100).catch(() => []),
      base44.entities.BookingLookupRequest.list('-created_date', 50).catch(() => []),
      base44.entities.Beds24ReturnLog.list('-created_at', 50).catch(() => []),
      base44.entities.Beds24ApiCredential.list().catch(() => []),
    ]);
    setLinks(lnks);
    setLookupRequests(reqs);
    setReturnLogs(logs);
    setCred(creds[0] || { api_enabled: false, api_base_url: 'https://api.beds24.com/v2', require_login_before_booking: false, return_url: 'https://krone-ammesso.de/booking-confirmed' });
    setLoading(false);
  }

  async function handleApiLookup() {
    setApiLoading(true);
    setApiError('');
    setApiResults(null);
    const res = await base44.functions.invoke('adminBeds24Lookup', {
      booking_reference: apiRef,
      guest_email: apiEmail,
      arrival_date: apiArrival,
    });
    if (res.data?.success) {
      setApiResults(res.data.bookings);
    } else {
      setApiError(res.data?.error || 'Lookup fehlgeschlagen');
    }
    setApiLoading(false);
  }

  async function handleManualLink(lookupReqId, guestUserId) {
    setUpdatingId(lookupReqId);
    const res = await base44.functions.invoke('adminBeds24Lookup', {
      action: 'manual_link',
      lookup_request_id: lookupReqId,
      guest_user_id: guestUserId,
      booking_reference: apiRef || selectedItem?.booking_reference,
      admin_notes: adminNotes,
    });
    if (res.data?.success) {
      await loadAll();
      setSelectedItem(null);
    } else {
      alert(res.data?.error || 'Fehler beim Verknüpfen');
    }
    setUpdatingId(null);
  }

  async function handleUnlink(linkId) {
    if (!confirm('Buchungsverknüpfung wirklich entfernen?')) return;
    await base44.entities.GuestReservationLink.delete(linkId);
    setLinks(prev => prev.filter(l => l.id !== linkId));
  }

  async function handleVerifyLink(linkId) {
    await base44.entities.GuestReservationLink.update(linkId, {
      verified: true,
      verified_at: new Date().toISOString(),
      verified_by: user.email,
    });
    setLinks(prev => prev.map(l => l.id === linkId ? { ...l, verified: true } : l));
  }

  async function saveSettings() {
    setSavingSettings(true);
    if (cred?.id) {
      await base44.entities.Beds24ApiCredential.update(cred.id, {
        api_enabled: cred.api_enabled,
        api_base_url: cred.api_base_url,
        require_login_before_booking: cred.require_login_before_booking,
        return_url: cred.return_url,
        property_id: cred.property_id,
      });
    } else {
      await base44.entities.Beds24ApiCredential.create({ ...cred });
    }
    setSavingSettings(false);
    alert('Einstellungen gespeichert');
    loadAll();
  }

  if (access === 'loading') {
    return <div className="min-h-screen bg-charcoal flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>;
  }
  if (access === 'denied') {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-5">
        <div className="text-center p-10 glass-card border border-red-900/30 rounded-2xl max-w-sm">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-ivory font-body">Zugang verweigert</p>
          <button onClick={() => navigate('/')} className="mt-4 px-5 py-2.5 btn-gold rounded-full text-xs uppercase tracking-widest font-body">Startseite</button>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'links', label: 'Verknüpfte Buchungen', count: links.length },
    { id: 'requests', label: 'Lookup-Anfragen', count: lookupRequests.filter(r => r.status === 'pending').length },
    { id: 'logs', label: 'Return Logs', count: returnLogs.length },
    { id: 'lookup', label: 'API Lookup', count: null },
    { id: 'settings', label: 'Einstellungen', count: null },
  ];

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-5">

        {/* Header */}
        <div className="flex items-center justify-between py-6 sm:py-8">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-1">Admin · Beds24</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory">Buchungs-Links</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/admin" className="px-4 py-2.5 glass-card border border-[#C9A96E]/10 text-ivory/40 hover:text-gold text-xs font-body rounded-xl transition-colors">← Admin</Link>
            <button onClick={loadAll} className="px-3 py-2.5 glass-card border border-[#C9A96E]/10 text-ivory/40 hover:text-ivory text-xs font-body rounded-xl transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 bg-espresso rounded-xl p-1 mb-6 border border-[#C9A96E]/10 overflow-x-auto no-scrollbar">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 py-2.5 px-3 sm:px-4 rounded-lg text-[10px] sm:text-xs font-body tracking-widest uppercase transition-all whitespace-nowrap ${tab === t.id ? 'bg-gold text-charcoal font-semibold' : 'text-ivory/40 hover:text-ivory'}`}>
              {t.label}
              {t.count !== null && t.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === t.id ? 'bg-charcoal/20 text-charcoal' : 'bg-gold/20 text-gold'}`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* LINKED BOOKINGS */}
        {tab === 'links' && (
          <div className="space-y-2">
            {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>
              : links.length === 0 ? <div className="text-center py-16 text-ivory/30 font-body text-sm">Keine verknüpften Buchungen</div>
              : links.map(link => (
                <div key={link.id} className="glass-card border border-[#C9A96E]/08 rounded-xl p-4 hover:border-[#C9A96E]/20 transition-all">
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-body text-sm text-ivory font-semibold tracking-wider">{link.source_reference}</span>
                        <StatusBadge status={link.booking_status} />
                        {link.verified
                          ? <span className="px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-700/20 text-[10px] font-body">✓ Verifiziert</span>
                          : <span className="px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-400 border border-amber-700/20 text-[10px] font-body">⏳ Ausstehend</span>}
                        {link.linked_by_admin && <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 text-[10px] font-body">Admin</span>}
                      </div>
                      <p className="text-ivory/40 text-xs font-body">{link.user_email} · {link.guest_name} · Anreise: {link.arrival_date || '—'}</p>
                      {link.room_type && <p className="text-ivory/30 text-[10px] font-body mt-0.5">Zimmer: {link.room_type}</p>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {!link.verified && (
                        <button onClick={() => handleVerifyLink(link.id)}
                          className="px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 text-[10px] rounded-lg font-body tracking-widest uppercase hover:bg-emerald-900/60 transition-colors">
                          ✓ Verifizieren
                        </button>
                      )}
                      <button onClick={() => handleUnlink(link.id)}
                        className="px-3 py-1.5 bg-red-950/40 border border-red-900/30 text-red-400 text-[10px] rounded-lg font-body tracking-widest uppercase hover:bg-red-950/60 transition-colors">
                        Trennen
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* LOOKUP REQUESTS */}
        {tab === 'requests' && (
          <div className="space-y-2">
            {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>
              : lookupRequests.length === 0 ? <div className="text-center py-16 text-ivory/30 font-body text-sm">Keine Anfragen</div>
              : lookupRequests.map(req => (
                <div key={req.id} className={`glass-card border rounded-xl p-4 transition-all ${selectedItem?.id === req.id ? 'border-gold/30' : 'border-[#C9A96E]/08 hover:border-[#C9A96E]/20'}`}>
                  <div className="flex items-start gap-3 flex-wrap">
                    <button onClick={() => setSelectedItem(selectedItem?.id === req.id ? null : req)} className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-body text-sm text-ivory">{req.booking_reference || '(keine Ref.)'}</span>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-ivory/40 text-xs font-body">{req.user_email} · Anreise: {req.arrival_date || '—'} · {req.created_date ? format(new Date(req.created_date), 'dd.MM.yy HH:mm') : ''}</p>
                    </button>
                    {req.status === 'pending' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => { setSelectedItem(req); setApiRef(req.booking_reference || ''); setApiEmail(req.guest_email || ''); setApiArrival(req.arrival_date || ''); setTab('lookup'); }}
                          className="px-3 py-1.5 glass-card border border-[#C9A96E]/20 text-gold text-[10px] rounded-lg font-body tracking-widest uppercase flex items-center gap-1">
                          <Search className="w-3 h-3" /> API Lookup
                        </button>
                      </div>
                    )}
                  </div>
                  {selectedItem?.id === req.id && (
                    <div className="mt-4 pt-4 border-t border-[#C9A96E]/08 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs font-body">
                        <div><span className="text-ivory/30">Name</span><br /><span className="text-ivory/70">{req.first_name} {req.last_name}</span></div>
                        <div><span className="text-ivory/30">E-Mail</span><br /><span className="text-ivory/70">{req.guest_email}</span></div>
                        <div><span className="text-ivory/30">Anreise</span><br /><span className="text-ivory/70">{req.arrival_date || '—'}</span></div>
                        <div><span className="text-ivory/30">Buchungsref.</span><br /><span className="text-ivory/70">{req.booking_reference || '—'}</span></div>
                      </div>
                      <div>
                        <label className="text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-1.5 block">Admin-Notiz</label>
                        <input type="text" value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Interne Notiz..."
                          className="w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-2 text-xs text-ivory font-body focus:outline-none focus:border-gold/30" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleManualLink(req.id, req.user_id)} disabled={updatingId === req.id}
                          className="flex-1 py-2.5 bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 text-[10px] rounded-lg font-body tracking-widest uppercase hover:bg-emerald-900/60 transition-colors flex items-center justify-center gap-1.5">
                          {updatingId === req.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Link2 className="w-3 h-3" />} Manuell verknüpfen
                        </button>
                        <button onClick={() => { base44.entities.BookingLookupRequest.update(req.id, { status: 'not_found', admin_reviewed_by: user.email, admin_reviewed_at: new Date().toISOString(), admin_notes: adminNotes }); loadAll(); setSelectedItem(null); }}
                          className="flex-1 py-2.5 bg-red-950/40 border border-red-900/30 text-red-400 text-[10px] rounded-lg font-body tracking-widest uppercase hover:bg-red-950/60 transition-colors">
                          Nicht gefunden
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* RETURN LOGS */}
        {tab === 'logs' && (
          <div className="space-y-2">
            {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>
              : returnLogs.length === 0 ? <div className="text-center py-16 text-ivory/30 font-body text-sm">Keine Return Logs</div>
              : returnLogs.map(log => (
                <div key={log.id} className="glass-card border border-[#C9A96E]/08 rounded-xl p-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-body text-sm text-ivory">{log.extracted_booking_reference || '(kein Ref.)'}</span>
                        <StatusBadge status={log.match_status} />
                      </div>
                      <p className="text-ivory/40 text-xs font-body">{log.user_email || '—'} · {log.extracted_arrival || '—'} · {log.created_at ? format(new Date(log.created_at), 'dd.MM.yy HH:mm') : ''}</p>
                      {log.error_message && <p className="text-red-400/60 text-[10px] font-body mt-1">{log.error_message}</p>}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* API LOOKUP */}
        {tab === 'lookup' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="glass-card border border-[#C9A96E]/10 rounded-xl p-6">
              <h2 className="text-ivory font-display text-xl mb-5">Beds24 API Lookup</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-1.5 block">Buchungsreferenz / bookId</label>
                  <input type="text" value={apiRef} onChange={e => setApiRef(e.target.value)} placeholder="z.B. 12345678"
                    className="w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-3 text-sm text-ivory font-body focus:outline-none focus:border-gold/30" />
                </div>
                <div>
                  <label className="text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-1.5 block">Gast-E-Mail</label>
                  <input type="email" value={apiEmail} onChange={e => setApiEmail(e.target.value)}
                    className="w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-3 text-sm text-ivory font-body focus:outline-none focus:border-gold/30" />
                </div>
                <div>
                  <label className="text-ivory/40 text-[10px] tracking-widest uppercase font-body mb-1.5 block">Anreise (optional)</label>
                  <input type="date" value={apiArrival} onChange={e => setApiArrival(e.target.value)}
                    className="w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-3 text-sm text-ivory font-body focus:outline-none focus:border-gold/30" />
                </div>
                {apiError && <p className="text-red-400 text-xs font-body">{apiError}</p>}
                <button onClick={handleApiLookup} disabled={apiLoading || (!apiRef && !apiEmail)}
                  className="w-full py-3.5 bg-gold hover:bg-[#7A5A0F] disabled:opacity-50 text-charcoal rounded-xl text-xs tracking-widest uppercase font-body font-semibold transition-all flex items-center justify-center gap-2">
                  {apiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} API Anfrage starten
                </button>
              </div>
            </div>

            {apiResults !== null && (
              <div className="glass-card border border-[#C9A96E]/10 rounded-xl p-6">
                <h3 className="text-ivory font-display text-lg mb-4">{apiResults.length} Ergebnis{apiResults.length !== 1 ? 'se' : ''}</h3>
                {apiResults.length === 0
                  ? <p className="text-ivory/30 text-sm font-body">Keine Buchungen gefunden.</p>
                  : apiResults.map((b, i) => (
                    <div key={i} className="border border-[#C9A96E]/10 rounded-xl p-4 mb-3">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-ivory font-body text-sm font-semibold">#{b.bookId || b.reference}</p>
                          <p className="text-ivory/50 text-xs font-body">{b.guestName} · {b.guestEmail}</p>
                        </div>
                        <span className="text-gold text-sm font-body">€{b.price || '—'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-body mb-3">
                        <span className="text-ivory/40">Anreise: {b.firstNight}</span>
                        <span className="text-ivory/40">Abreise: {b.lastNight}</span>
                        <span className="text-ivory/40">Zimmer: {b.roomName || '—'}</span>
                        <span className="text-ivory/40">Status: {b.status}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && cred && (
          <div className="max-w-xl">
            <div className="glass-card border border-[#C9A96E]/10 rounded-xl p-6 space-y-5">
              <h2 className="text-ivory font-display text-xl">Beds24 Einstellungen</h2>

              <div className="space-y-1">
                <label className="text-ivory/40 text-[10px] tracking-widest uppercase font-body block">Return URL (configure in Beds24)</label>
                <input readOnly value={cred.return_url || 'https://krone-ammesso.de/booking-confirmed'}
                  className="w-full bg-[#0F0D0B] border border-[#C9A96E]/10 rounded-xl px-3 py-3 text-sm text-gold/60 font-body font-mono" />
                <p className="text-ivory/25 text-[10px] font-body">Beds24 → Settings → Booking Engine → Booking Return URL</p>
              </div>

              <div className="space-y-1">
                <label className="text-ivory/40 text-[10px] tracking-widest uppercase font-body block">Property ID</label>
                <input type="text" value={cred.property_id || ''} onChange={e => setCred(p => ({ ...p, property_id: e.target.value }))}
                  className="w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-3 text-sm text-ivory font-body focus:outline-none focus:border-gold/30" />
              </div>

              <div className="space-y-1">
                <label className="text-ivory/40 text-[10px] tracking-widest uppercase font-body block">API Base URL</label>
                <input type="text" value={cred.api_base_url || ''} onChange={e => setCred(p => ({ ...p, api_base_url: e.target.value }))}
                  className="w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-3 text-sm text-ivory font-body focus:outline-none focus:border-gold/30" />
              </div>

              <div className="p-4 bg-amber-950/30 border border-amber-800/20 rounded-xl text-xs font-body text-amber-400">
                <p className="font-semibold mb-1">🔐 API-Key (BEDS24_API_KEY)</p>
                <p>Der API-Key wird ausschließlich als Umgebungsvariable gespeichert und nie im Frontend exponiert.</p>
                <p className="mt-1 text-amber-400/60">Setzen Sie BEDS24_API_KEY in den App-Einstellungen → Umgebungsvariablen.</p>
              </div>

              <div className="flex items-center justify-between border border-[#C9A96E]/10 rounded-xl px-4 py-3">
                <div>
                  <p className="text-ivory text-sm font-body">API aktivieren</p>
                  <p className="text-ivory/30 text-[10px] font-body">Aktiviert automatische Buchungsverifikation</p>
                </div>
                <button onClick={() => setCred(p => ({ ...p, api_enabled: !p.api_enabled }))}
                  className={`relative w-12 h-6 rounded-full transition-all ${cred.api_enabled ? 'bg-gold' : 'bg-ivory/10'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${cred.api_enabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border border-[#C9A96E]/10 rounded-xl px-4 py-3">
                <div>
                  <p className="text-ivory text-sm font-body">Login vor Buchung erforderlich</p>
                  <p className="text-ivory/30 text-[10px] font-body">Standard: Aus (empfohlen für Konversion)</p>
                </div>
                <button onClick={() => setCred(p => ({ ...p, require_login_before_booking: !p.require_login_before_booking }))}
                  className={`relative w-12 h-6 rounded-full transition-all ${cred.require_login_before_booking ? 'bg-gold' : 'bg-ivory/10'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${cred.require_login_before_booking ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <button onClick={saveSettings} disabled={savingSettings}
                className="w-full py-3.5 bg-gold hover:bg-[#7A5A0F] disabled:opacity-50 text-charcoal rounded-xl text-xs tracking-widest uppercase font-body font-semibold transition-all flex items-center justify-center gap-2">
                {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />} Einstellungen speichern
              </button>
            </div>

            {/* Setup guide */}
            <div className="mt-5 glass-card border border-[#C9A96E]/10 rounded-xl p-6">
              <h3 className="text-gold font-body text-sm font-semibold mb-3">📋 Setup-Anleitung (einmalig)</h3>
              <ol className="text-ivory/50 text-xs font-body space-y-2 list-decimal list-inside">
                <li>Beds24 öffnen → Settings → Booking Engine</li>
                <li>Booking Page → Behaviour → "Redirect after Booking"</li>
                <li>Return URL eintragen: <code className="text-gold/70 font-mono">https://krone-ammesso.de/booking-confirmed</code></li>
                <li>BEDS24_API_KEY in Base44 App-Einstellungen setzen</li>
                <li>Property ID eintragen und API aktivieren</li>
                <li>Testbuchung durchführen und Return Log prüfen</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}