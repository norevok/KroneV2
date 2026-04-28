/**
 * Generate a secure booking link token for Beds24 account-linking.
 *
 * Called when a logged-in user clicks "Book Now" on the rooms page.
 * Returns a token that is appended to the Beds24 URL as a referer param.
 * Token expires in 2 hours.
 * Token is stored in BookingLinkSession for later reconciliation.
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function generateToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Token generation is only for logged-in users
    // Unauthenticated users can still book, just without account-linking
    const body = await req.json().catch(() => ({}));
    const { check_in, check_out, adults, room_category } = body;

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours

    if (user) {
      // Logged-in: create full link session
      await base44.asServiceRole.entities.BookingLinkSession.create({
        token,
        user_id: user.id || user.email,
        user_email: user.email,
        status: 'pending',
        check_in: check_in || '',
        check_out: check_out || '',
        adults: adults || 2,
        room_category: room_category || '',
        expires_at: expiresAt,
      });
    }
    // If not logged in: still return token but don't store (anonymous booking)

    return Response.json({ token, expires_at: expiresAt, authenticated: !!user });

  } catch (error) {
    console.error('generateBookingToken error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});