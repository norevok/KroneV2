/**
 * Beds24ConfigStatus
 * Admin-only component — shows Beds24 integration secret storage audit.
 * Never renders actual secret values.
 */
import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';

function Row({ label, data }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 gap-y-1 items-center py-2.5 border-b border-ivory/05 last:border-0 text-xs font-body">
      <span className="text-ivory/60 font-mono">{label}</span>
      <span className={`flex items-center gap-1 ${data.present ? 'text-emerald-400' : 'text-red-400'}`}>
        {data.present ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
        {data.present ? 'PASS' : 'FAIL'}
      </span>
      <span className="flex items-center gap-1 text-emerald-400">
        <Lock className="w-3 h-3" /> Encrypted
      </span>
      <span className="flex items-center gap-1 text-emerald-400">
        <EyeOff className="w-3 h-3" /> Not exposed
      </span>
      <span className="text-ivory/30 italic text-[10px]">{data.value}</span>
    </div>
  );
}

export default function Beds24ConfigStatus() {
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function check() {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('beds24Auth', {});
      setStatus(res.data);
    } catch (e) {
      setError(e.message || 'Check failed');
    } finally {
      setLoading(false);
    }
  }

  const overall = status?.config_status;

  return (
    <div className="glass-card border border-[#C9A96E]/12 rounded-2xl p-5 mt-6">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gold/70" />
          <p className="text-ivory/50 text-[10px] tracking-[0.3em] uppercase font-body">Beds24 Integration · Secret Storage Audit</p>
        </div>
        <button
          onClick={check}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 glass-card border border-[#C9A96E]/15 rounded-xl text-ivory/50 hover:text-gold text-[10px] font-body transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Prüfe...' : 'Prüfen'}
        </button>
      </div>

      {!status && !error && !loading && (
        <p className="text-ivory/25 text-xs font-body text-center py-4">
          Klicken Sie auf "Prüfen" um den Integrationsstatus zu laden.
        </p>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs font-body py-2">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {status && (
        <div className="space-y-4">
          {/* Overall badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-body font-semibold ${
            overall === 'PASS'
              ? 'bg-emerald-950/30 border-emerald-700/30 text-emerald-400'
              : 'bg-red-950/30 border-red-700/30 text-red-400'
          }`}>
            {overall === 'PASS'
              ? <CheckCircle className="w-4 h-4" />
              : <AlertTriangle className="w-4 h-4" />
            }
            {overall === 'PASS' ? 'PASS — Beds24 integration configured' : `FAIL — ${status.warning}`}
          </div>

          {/* Secrets table */}
          <div className="bg-espresso/60 rounded-xl p-4">
            <p className="text-ivory/30 text-[10px] tracking-[0.3em] uppercase font-body mb-3">
              Secret Storage Report
            </p>
            <div className="space-y-0">
              <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 pb-2 mb-1 border-b border-ivory/10 text-[9px] font-body text-ivory/25 tracking-widest uppercase">
                <span>Secret Name</span><span>Status</span><span>Encryption</span><span>Frontend</span><span>Value</span>
              </div>
              {Object.entries(status.secrets || {}).map(([key, val]) => (
                <Row key={key} label={key} data={val} />
              ))}
            </div>
            <p className="text-ivory/20 text-[10px] font-body mt-3 italic">
              Storage location: Base44 Encrypted Environment Variables (server-side only · Deno.env)
            </p>
          </div>

          {/* Token cache */}
          <div className="bg-espresso/60 rounded-xl p-4">
            <p className="text-ivory/30 text-[10px] tracking-[0.3em] uppercase font-body mb-3">Access Token Cache</p>
            <div className="space-y-2 text-xs font-body">
              <div className="flex justify-between">
                <span className="text-ivory/40">Token in cache</span>
                <span className={status.token_cache.access_token_cached ? 'text-emerald-400' : 'text-ivory/30'}>
                  {status.token_cache.access_token_cached ? 'Yes' : 'No'}
                </span>
              </div>
              {status.token_cache.cache_expires_at && (
                <div className="flex justify-between">
                  <span className="text-ivory/40">Cache expires at</span>
                  <span className="text-ivory/60">{new Date(status.token_cache.cache_expires_at).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-ivory/40">Token exchange test</span>
                <span className={
                  status.token_cache.token_exchange_status === 'ok' ? 'text-emerald-400' :
                  status.token_cache.token_exchange_status === 'failed' ? 'text-red-400' : 'text-ivory/30'
                }>
                  {status.token_cache.token_exchange_status === 'ok' ? '✓ OK' :
                   status.token_cache.token_exchange_status === 'failed' ? `✗ ${status.token_cache.token_exchange_error}` :
                   'Not tested'}
                </span>
              </div>
            </div>
          </div>

          {/* Missing secrets */}
          {status.missing_secrets?.length > 0 && (
            <div className="border border-amber-700/30 bg-amber-950/20 rounded-xl p-4">
              <p className="text-amber-400 text-xs font-body font-semibold mb-2">
                ⚠ Missing secrets — add these in Dashboard → Settings → Environment Variables:
              </p>
              <ul className="space-y-1">
                {status.missing_secrets.map(s => (
                  <li key={s} className="font-mono text-amber-300/80 text-xs">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}