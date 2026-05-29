/**
 * Beds24 API V2 Authentication Debug
 * 
 * Tests authentication using EXACT Beds24 V2 API specification:
 * - Header: token: {LONG_LIFE_TOKEN}
 * - Endpoint: GET /authentication/details
 * 
 * Debug output includes:
 * - Request URL
 * - Header format
 * - HTTP status
 * - Error body with exact reason
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get token from secret
    const longLifeToken = Deno.env.get('BEDS24_LONG_LIFE_TOKEN');
    const refreshToken = Deno.env.get('BEDS24_REFRESH_TOKEN');
    const apiBaseUrl = Deno.env.get('BEDS24_API_BASE_URL') || 'https://api.beds24.com/v2';

    // Use BEDS24_LONG_LIFE_TOKEN if available, otherwise fall back to BEDS24_REFRESH_TOKEN
    const tokenToTest = longLifeToken || refreshToken;

    const debugInfo = {
      test_timestamp: new Date().toISOString(),
      endpoint_tested: 'GET /authentication/details',
      request_url: `${apiBaseUrl}/authentication/details`,
      header_format_used: 'token: {token_value}',
      header_name: 'token',
      token_analysis: {
        bed24_long_life_token_exists: !!longLifeToken,
        bed24_refresh_token_exists: !!refreshToken,
        token_being_used: longLifeToken ? 'BEDS24_LONG_LIFE_TOKEN' : 'BEDS24_REFRESH_TOKEN',
        token_length: tokenToTest ? tokenToTest.length : 0,
        token_has_value: !!tokenToTest,
        token_format_valid: tokenToTest && tokenToTest.length > 10 && tokenToTest.length < 1000,
        token_starts_with: tokenToTest ? tokenToTest.substring(0, 8) + '...' : 'N/A',
        token_ends_with: tokenToTest ? '...' + tokenToTest.substring(tokenToTest.length - 8) : 'N/A',
      },
      request_headers_sent: {
        'token': tokenToTest ? '[REDACTED - ' + tokenToTest.length + ' chars]' : 'MISSING',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (!tokenToTest) {
      return Response.json({
        status: 'FAILED',
        error: 'NO_TOKEN_FOUND',
        message: 'Neither BEDS24_LONG_LIFE_TOKEN nor BEDS24_REFRESH_TOKEN is set in secrets',
        debug: debugInfo,
      }, { status: 200 });
    }

    // Make the actual API call with CORRECT header format
    const response = await fetch(`${apiBaseUrl}/authentication/details`, {
      method: 'GET',
      headers: {
        'token': tokenToTest,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const responseText = await response.text();
    let responseBody;
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = { raw: responseText };
    }

    const result = {
      status: response.ok ? 'SUCCESS' : 'FAILED',
      http_status: response.status,
      http_status_text: response.statusText,
      request_url: `${apiBaseUrl}/authentication/details`,
      header_format_used: 'token: {token_value}',
      header_name: 'token',
      token_analysis: debugInfo.token_analysis,
      request_headers_sent: debugInfo.request_headers_sent,
      response_body: responseBody,
    };

    if (!response.ok) {
      result.error_details = {
        status_code: response.status,
        status_text: response.statusText,
        error_body: responseBody,
        likely_causes: [
          response.status === 401 ? 'Invalid or expired token' : null,
          response.status === 403 ? 'Token lacks permissions' : null,
          response.status === 404 ? 'Endpoint not found' : null,
          response.status === 500 ? 'Beds24 server error' : null,
          !tokenToTest ? 'Token is missing or empty' : null,
          tokenToTest && tokenToTest.length < 10 ? 'Token appears too short' : null,
        ].filter(Boolean),
      };
    }

    return Response.json(result, { status: 200 });

  } catch (error) {
    return Response.json({
      status: 'FAILED',
      error: 'EXCEPTION',
      message: error.message,
      stack: error.stack,
    }, { status: 200 });
  }
});