import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Admin function: Get filtered restaurant reservations.
 * Admin-only. Returns paginated, sortable list with filtering.
 * No audit log on plain reads — audit log only on mutations.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const {
      status,
      date,
      email,
      limit = 50,
      offset = 0,
      sort_by = '-created_date'
    } = payload;

    const query = {};
    if (status) query.status = status;
    if (date) query.reservation_date = date;
    if (email) query.guest_email = email.toLowerCase();

    const reservations = await base44.asServiceRole.entities.RestaurantReservation.filter(
      query, sort_by, limit + 1, offset
    );

    const hasMore = reservations.length > limit;
    if (hasMore) reservations.pop();

    return Response.json({
      reservations,
      has_more: hasMore,
      offset,
      limit,
      total_returned: reservations.length,
    });
  } catch (error) {
    console.error('Admin get reservations error:', error);
    return Response.json({ error: 'Server error retrieving reservations' }, { status: 500 });
  }
});