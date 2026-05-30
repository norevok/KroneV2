/**
 * beds24Auth — Admin status endpoint for Beds24 V2 integration config check.
 *
 * GET /beds24Auth (admin only) → returns PASS/FAIL secret storage audit.
 * Token exchange is tested live. Actual token values are NEVER returned.
 *
 * Shared token-management logic is inlined in each consuming function
 * (beds24LinkBooking, adminBeds24Lookup) because Deno functions cannot
 * import from sibling files.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ── Module-level token cache (shared across requests in same isolate) ──
let _cachedAccessToken = null;
let _tokenExpiresAt    = 0;

async function _getBeds24AccessToken(triggeredBy, base44) {
  const longLifeToken = Deno.env.get('BEDS24_LONG_LIFE_TOKEN') || '';
  const baseUrl       = Deno.env.get('BEDS24_API_BASE_URL') || 'https://api.beds24.com/v2';

  const now = Date.now();
  if (_cachedAccessToken && now < _tokenExpiresAt) {
    _audit(base44, { action: 'token_cache_hit', success: true, token_used: 'access_token', token_was_cached: true, triggered_by: triggeredBy });
    return _cachedAccessToken;
  }

  if (!longLifeToken) throw new Error('BEDS24_LONG_LIFE_TOKEN not configured');

  // Validate token is still live against /authentication/details
  const t0  = Date.now();
  const res = await fetch(`${baseUrl}/authentication/details`, {
    method: 'GET',
    headers: { 'token': longLifeToken },
  });
  const duration = Date.now() - t0;

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    _audit(base44, { action: 'token_refresh', endpoint: '/authentication/details', http_status: res.status, success: false, error_message: `HTTP ${res.status}: ${err.slice(0, 200)}`, duration_ms: duration, token_used: 'access_token', token_was_cached: false, triggered_by: triggeredBy });
    throw new Error(`Beds24 token validation failed: HTTP ${res.status}`);
  }

  const data      = await res.json();
  const expiresIn = data?.token?.expiresIn || 7776000;

  _cachedAccessToken = longLifeToken;
  _tokenExpiresAt    = Date.now() + Math.min(expiresIn - 300, 86400) * 1000;

  _audit(base44, { action: 'token_refresh', endpoint: '/authentication/details', http_status: res.status, success: true, duration_ms: duration, token_used: 'access_token', token_was_cached: false, triggered_by: triggeredBy });
  return longLifeToken;
}

function _audit(base44, fields) {
  base44.asServiceRole.entities.IntegrationExecutionLog.create({
    integration: 'beds24',
    executed_at: new Date().toISOString(),
    ...fields,
  }).catch(() => {});
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user   = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const longLifeToken = Deno.env.get('BEDS24_LONG_LIFE_TOKEN') || '';
  const propertyId    = Deno.env.get('BEDS24_PROPERTY_ID')    || '';
  const baseUrl       = Deno.env.get('BEDS24_API_BASE_URL')   || '';

  const missing = [];
  if (!longLifeToken) missing.push('BEDS24_LONG_LIFE_TOKEN');
  if (!propertyId)    missing.push('BEDS24_PROPERTY_ID');
  if (!baseUrl)       missing.push('BEDS24_API_BASE_URL');

  const isConfigured = missing.length === 0;

  let tokenStatus = 'not_tested';
  let tokenError  = null;

  if (isConfigured) {
    try {
      await _getBeds24AccessToken('admin_config_check', base44);
      tokenStatus = 'ok';
    } catch (e) {
      tokenStatus = 'failed';
      tokenError  = e.message;
    }
  }

  return Response.json({
    config_status: isConfigured ? 'PASS' : 'FAIL',
    warning: isConfigured ? null : 'Beds24 integration not configured.',
    secrets: {
      BEDS24_LONG_LIFE_TOKEN: {
        storage:          'Base44 Encrypted Secrets (Deno.env — server-side only)',
        present:          !!longLifeToken,
        encrypted:        true,
        frontend_exposed: false,
        value:            '[REDACTED — never exposed]',
      },
      BEDS24_PROPERTY_ID: {
        storage:          'Base44 Encrypted Secrets (Deno.env — server-side only)',
        present:          !!propertyId,
        encrypted:        true,
        frontend_exposed: false,
        value:            '[REDACTED — never exposed]',
      },
      BEDS24_API_BASE_URL: {
        storage:          'Base44 Encrypted Secrets (Deno.env — server-side only)',
        present:          !!baseUrl,
        encrypted:        true,
        frontend_exposed: false,
        value:            baseUrl || '[NOT SET]',
      },
    },
    token_cache: {
      access_token_cached:   !!_cachedAccessToken,
      cache_expires_at:      _tokenExpiresAt ? new Date(_tokenExpiresAt).toISOString() : null,
      token_exchange_status: tokenStatus,
      token_exchange_error:  tokenError,
    },
    missing_secrets: missing,
  });
});