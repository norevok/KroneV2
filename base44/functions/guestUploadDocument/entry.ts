import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Guest function: Upload a document (ID, invoice, etc).
 * Requires authentication. Uses private storage, notifies admin via Slack.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file');
    const category = formData.get('category') || 'other';
    const description = formData.get('description') || '';

    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 });

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) return Response.json({ error: 'File too large (max 10 MB)' }, { status: 413 });

    const allowedTypes = [
      'application/pdf', 'image/jpeg', 'image/png', 'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: 'File type not allowed' }, { status: 415 });
    }

    // Upload to private storage
    const fileBuffer = await file.arrayBuffer();
    let uploadedFile;
    try {
      uploadedFile = await base44.asServiceRole.integrations.Core.UploadPrivateFile({ file: fileBuffer });
    } catch (uploadErr) {
      console.error('Private file upload failed:', uploadErr.message);
      return Response.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Create document record
    const doc = await base44.entities.GuestDocument.create({
      user_email: user.email.toLowerCase(),
      category,
      file_uri: uploadedFile.file_uri,
      original_filename: file.name,
      file_size_bytes: file.size,
      mime_type: file.type,
      description,
      status: 'uploaded',
      email_notification_sent: false,
    });

    // Link to guest profile if exists (non-blocking)
    base44.entities.GuestProfile.filter({ user_email: user.email.toLowerCase() }, undefined, 1)
      .then(profiles => {
        if (profiles.length > 0) {
          base44.entities.GuestDocument.update(doc.id, { guest_profile_id: profiles[0].id }).catch(() => {});
        }
      }).catch(() => {});

    // Notify admin via Slack — read SLACK_WEBHOOK_URL directly from env (no SiteSettings fetch)
    const webhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
    if (webhookUrl && webhookUrl.startsWith('https://')) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            { type: 'header', text: { type: 'plain_text', text: '📎 Neues Dokument hochgeladen', emoji: true } },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: `*Gast:*\n${user.email}` },
                { type: 'mrkdwn', text: `*Kategorie:*\n${category}` },
                { type: 'mrkdwn', text: `*Datei:*\n${file.name} (${Math.round(file.size / 1024)} KB)` },
              ]
            },
            { type: 'divider' }
          ]
        }),
      }).catch(e => console.warn('Slack notification failed:', e.message));
    }

    return Response.json({ success: true, document_id: doc.id, file_name: file.name, status: 'uploaded' });
  } catch (error) {
    console.error('Guest document upload error:', error);
    return Response.json({ error: 'Server error uploading document' }, { status: 500 });
  }
});