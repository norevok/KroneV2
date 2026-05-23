import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Creates a HotelBookingIntent before redirecting guest to Beds24.
 * Captures check-in, check-out, guests, room interest, language, source.
 * Returns: { intent_id, intent_ref, beds24_redirect_url }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const {
      check_in,
      check_out,
      guests_adults,
      guests_children,
      room_category_interest,
      language,
      source_page,
      source_url,
      guest_email,
      guest_first_name,
      guest_last_name,
      guest_phone
    } = payload;

    // Get settings for Beds24 URL
    const settings = await base44.asServiceRole.entities.SiteSettings.filter(
      { key: 'global' },
      undefined,
      1
    );

    if (!settings || settings.length === 0) {
      return Response.json(
        { error: 'System configuration missing' },
        { status: 500 }
      );
    }

    const config = settings[0];
    const beds24BaseUrl = config.beds24_booking_url || 'https://beds24.com/booking2.php?propid=310599';

    // Build Beds24 URL with language parameter
    const beds24Url = new URL(beds24BaseUrl);
    if (language && ['de', 'en', 'it'].includes(language)) {
      beds24Url.searchParams.set('lang', language);
    }

    // Create booking intent
    const intentRef = `INTENT-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const intent = await base44.asServiceRole.entities.HotelBookingIntent.create({
      intent_ref: intentRef,
      status: 'initiated',
      check_in,
      check_out,
      guests_adults: guests_adults || 0,
      guests_children: guests_children || 0,
      room_category_interest: room_category_interest || '',
      language: language || 'de',
      source_page: source_page || '',
      source_url: source_url || '',
      guest_email: guest_email ? guest_email.toLowerCase() : '',
      guest_first_name: guest_first_name || '',
      guest_last_name: guest_last_name || '',
      guest_phone: guest_phone || '',
      beds24_booking_url_used: beds24Url.toString(),
      redirected_at: new Date().toISOString()
    });

    // Try to link to guest profile if email matches
    if (guest_email) {
      try {
        const profiles = await base44.asServiceRole.entities.GuestProfile.filter(
          { user_email: guest_email.toLowerCase() },
          undefined,
          1
        );
        if (profiles.length > 0) {
          await base44.asServiceRole.entities.HotelBookingIntent.update(intent.id, {
            guest_profile_id: profiles[0].id
          });
        }
      } catch (e) {
        // Silently ignore if profile linking fails
      }
    }

    // Slack notification (non-blocking)
    const webhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            { type: 'header', text: { type: 'plain_text', text: '🏨 Neue Buchungsanfrage (Beds24)', emoji: true } },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: `*Ref:*\n${intentRef}` },
                { type: 'mrkdwn', text: `*Check-in:*\n${check_in || '—'}` },
                { type: 'mrkdwn', text: `*Check-out:*\n${check_out || '—'}` },
                { type: 'mrkdwn', text: `*Personen:*\n${guests_adults || 1} Erw.${guests_children ? ` + ${guests_children} Kinder` : ''}` },
                ...(guest_email ? [{ type: 'mrkdwn', text: `*Gast:*\n${guest_first_name ? guest_first_name + ' ' + guest_last_name : guest_email}` }] : []),
                ...(room_category_interest ? [{ type: 'mrkdwn', text: `*Zimmer:*\n${room_category_interest}` }] : []),
              ]
            },
            { type: 'divider' }
          ]
        })
      }).catch(() => {});
    }

    return Response.json({
      success: true,
      intent_id: intent.id,
      intent_ref: intentRef,
      beds24_redirect_url: beds24Url.toString()
    });
  } catch (error) {
    console.error('Hotel booking intent creation error:', error);
    return Response.json(
      { error: 'Server error creating booking intent' },
      { status: 500 }
    );
  }
});