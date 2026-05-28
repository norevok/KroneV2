import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/admin/AdminShell';
import { Search, Filter, Check, X, RefreshCw, Mail, Gift, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  redeemed: 'bg-blue-100 text-blue-700 border-blue-200',
  expired: 'bg-stone-100 text-stone-500 border-stone-200',
  pending_payment: 'bg-amber-100 text-amber-700 border-amber-200',
  refunded: 'bg-red-100 text-red-700 border-red-200',
};
const STATUS_LABELS = {
  active: 'Aktiv',
  redeemed: 'Eingelöst',
  expired: 'Abgelaufen',
  pending_payment: 'Ausstehend',
  refunded: 'Erstattet',
};

export default function AdminVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState('');

  async function load() {
    setLoading(true);
    const data = await base44.entities.GiftVoucher.list('-created_date', 200);
    setVouchers(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = vouchers.filter(v => {
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || (v.code || '').toLowerCase().includes(q)
      || (v.purchaser_email || '').toLowerCase().includes(q)
      || (v.recipient_email || '').toLowerCase().includes(q)
      || (v.purchaser_name || '').toLowerCase().includes(q)
      || (v.recipient_name || '').toLowerCase().includes(q)
      || (v.product_name || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  async function markRedeemed(v) {
    if (!window.confirm(`Gutschein ${v.code} als eingelöst markieren?`)) return;
    setActionLoading(v.id);
    await base44.entities.GiftVoucher.update(v.id, {
      status: 'redeemed',
      redeemed_at: new Date().toISOString(),
      redeemed_by: 'admin',
    });
    await load();
    setActionLoading('');
  }

  async function deactivate(v) {
    if (!window.confirm(`Gutschein ${v.code} deaktivieren?`)) return;
    setActionLoading(v.id);
    await base44.entities.GiftVoucher.update(v.id, { status: 'expired' });
    await load();
    setActionLoading('');
  }

  async function resendEmail(v) {
    if (!v.purchaser_email) return;
    setActionLoading(v.id + '-email');
    try {
      const code = v.code;
      const lang = v.language || 'de';
      const amount = v.amount_eur?.toFixed(2) || '0.00';
      const subject = lang === 'en'
        ? `Your Krone Langenburg Voucher — ${code}`
        : `Ihr Krone Langenburg Gutschein — ${code}`;

      await base44.integrations.Core.SendEmail({
        to: v.purchaser_email,
        from_name: 'Krone Langenburg by Ammesso',
        subject,
        body: `<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <div style="text-align:center;border-bottom:2px solid #C9A96E;padding-bottom:16px;margin-bottom:24px;">
            <h1 style="font-family:Georgia,serif;font-weight:300;color:#1C1714;">KRONE LANGENBURG</h1>
            <p style="color:#C9A96E;font-size:11px;letter-spacing:4px;text-transform:uppercase;">by Ammesso</p>
          </div>
          <h2 style="font-family:Georgia,serif;font-weight:300;">${lang === 'en' ? 'Your Voucher (Resent)' : 'Ihr Gutschein (Erneut gesendet)'}</h2>
          <div style="background:#f9f6f0;border:2px solid #C9A96E;padding:24px;border-radius:14px;text-align:center;margin:20px 0;">
            <p style="color:#8A7A6A;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">${lang === 'en' ? 'Voucher Code' : 'Gutscheincode'}</p>
            <p style="font-family:Georgia,serif;font-size:30px;font-weight:300;color:#8B6914;letter-spacing:5px;margin:0;">${code}</p>
            <p style="color:#8A7A6A;font-size:13px;margin-top:8px;">${lang === 'en' ? `Value: €${amount}` : `Wert: €${amount}`}</p>
          </div>
          <p style="color:#666;font-size:13px;">Produkt: ${v.product_name || '—'}</p>
          <p style="font-size:14px;">Team Krone Langenburg by Ammesso</p>
          <div style="text-align:center;border-top:1px solid #eee;padding-top:16px;margin-top:24px;color:#aaa;font-size:11px;">
            Hauptstraße 24 · 74595 Langenburg · info@krone-ammesso.de
          </div>
        </body></html>`,
      });
      alert('E-Mail wurde erneut gesendet.');
    } catch (e) {
      alert('Fehler: ' + e.message);
    }
    setActionLoading('');
  }

  const stats = {
    total: vouchers.length,
    active: vouchers.filter(v => v.status === 'active').length,
    redeemed: vouchers.filter(v => v.status === 'redeemed').length,
    pending: vouchers.filter(v => v.status === 'pending_payment').length,
    revenue: vouchers.filter(v => ['active','redeemed'].includes(v.status)).reduce((s, v) => s + (v.amount_eur || 0), 0),
  };

  return (
    <AdminShell title="Gutschein-Verwaltung" onRefresh={load}>
      <div className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Gesamt', value: stats.total, sub: 'Gutscheine' },
            { label: 'Aktiv', value: stats.active, sub: 'einlösbar', color: 'text-emerald-600' },
            { label: 'Eingelöst', value: stats.redeemed, sub: 'verwendet', color: 'text-blue-600' },
            { label: 'Umsatz', value: `€${stats.revenue.toFixed(0)}`, sub: 'verkauft', color: 'text-[#8B6914]' },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
              <p className={`font-display text-2xl font-light ${s.color || 'text-[#1C1714]'}`}>{s.value}</p>
              <p className="font-body text-xs text-stone-500 mt-0.5">{s.label} <span className="text-stone-400">· {s.sub}</span></p>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Suche nach Code, E-Mail, Name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-body text-[#1C1714] placeholder-stone-400 focus:outline-none focus:border-[#8B6914]/40 transition-all"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'active', 'redeemed', 'pending_payment', 'expired'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-body font-semibold border transition-all ${
                  statusFilter === s
                    ? 'bg-[#8B6914] text-white border-[#8B6914]'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-[#8B6914]/40'
                }`}>
                {s === 'all' ? 'Alle' : STATUS_LABELS[s] || s}
              </button>
            ))}
          </div>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-body text-stone-500 hover:border-stone-300 transition-all">
            <RefreshCw className="w-4 h-4" /> Aktualisieren
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-stone-400">
              <div className="w-6 h-6 border-2 border-[#C9A96E]/30 border-t-[#C9A96E] rounded-full animate-spin mr-3" />
              Wird geladen…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-stone-400 font-body text-sm">
              {search || statusFilter !== 'all' ? 'Keine Gutscheine gefunden.' : 'Noch keine Gutscheine vorhanden.'}
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filtered.map(v => (
                <div key={v.id}>
                  <div
                    className="flex items-center gap-3 px-4 sm:px-5 py-4 hover:bg-stone-50 cursor-pointer transition-colors"
                    onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}>

                    {/* Code */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-body font-bold text-sm text-[#8B6914] tracking-wider">{v.code}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body font-semibold ${STATUS_COLORS[v.status] || 'bg-stone-100 text-stone-500'}`}>
                          {STATUS_LABELS[v.status] || v.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-body mt-0.5 truncate">
                        {v.product_name || '—'} · {v.purchaser_name || v.purchaser_email}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-display text-lg font-light text-[#1C1714]">€{(v.amount_eur || 0).toFixed(0)}</p>
                      <p className="text-[10px] text-stone-400 font-body">
                        {v.created_date ? new Date(v.created_date).toLocaleDateString('de-DE') : '—'}
                      </p>
                    </div>

                    {/* Expand */}
                    <div className="flex-shrink-0 ml-2">
                      {expandedId === v.id
                        ? <ChevronUp className="w-4 h-4 text-stone-400" />
                        : <ChevronDown className="w-4 h-4 text-stone-400" />}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expandedId === v.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-stone-50 border-t border-stone-100 px-5 py-4 space-y-4">

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-body">
                        <div>
                          <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-1">Käufer</p>
                          <p className="font-semibold text-[#1C1714]">{v.purchaser_name || '—'}</p>
                          <p className="text-stone-500">{v.purchaser_email}</p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-1">Empfänger</p>
                          <p className="font-semibold text-[#1C1714]">{v.recipient_name || '—'}</p>
                          <p className="text-stone-500">{v.recipient_email || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-1">Details</p>
                          <p className="text-stone-600">Gültig bis: {v.expires_at ? new Date(v.expires_at).toLocaleDateString('de-DE') : '—'}</p>
                          {v.redeemed_at && <p className="text-blue-600">Eingelöst: {new Date(v.redeemed_at).toLocaleDateString('de-DE')}</p>}
                          {v.paid_at && <p className="text-emerald-600">Bezahlt: {new Date(v.paid_at).toLocaleDateString('de-DE')}</p>}
                        </div>
                      </div>

                      {v.personal_message && (
                        <div className="bg-white border border-stone-200 rounded-xl px-4 py-3">
                          <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-1">Persönliche Nachricht</p>
                          <p className="text-sm text-stone-600 italic">"{v.personal_message}"</p>
                        </div>
                      )}

                      {v.stripe_session_id && (
                        <p className="text-[10px] text-stone-400 font-body">Stripe: {v.stripe_session_id}</p>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {v.status === 'active' && (
                          <button
                            onClick={() => markRedeemed(v)}
                            disabled={actionLoading === v.id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-body font-semibold transition-all disabled:opacity-50">
                            <Check className="w-3.5 h-3.5" />
                            Als eingelöst markieren
                          </button>
                        )}
                        {['active', 'pending_payment'].includes(v.status) && (
                          <button
                            onClick={() => deactivate(v)}
                            disabled={actionLoading === v.id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-body font-semibold transition-all border border-red-200 disabled:opacity-50">
                            <X className="w-3.5 h-3.5" />
                            Deaktivieren
                          </button>
                        )}
                        <button
                          onClick={() => resendEmail(v)}
                          disabled={actionLoading === v.id + '-email' || !v.purchaser_email}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-stone-100 text-stone-600 rounded-lg text-xs font-body font-semibold transition-all border border-stone-200 disabled:opacity-50">
                          <Mail className="w-3.5 h-3.5" />
                          Gutschein erneut senden
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-stone-400 font-body text-center">
          {filtered.length} von {vouchers.length} Gutscheinen · Gutscheine werden 2 Jahre nach Kauf automatisch als abgelaufen markiert
        </p>
      </div>
    </AdminShell>
  );
}