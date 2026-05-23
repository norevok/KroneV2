import { useState, useRef } from 'react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { SITE_DEFAULTS } from '@/lib/siteData';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, CheckCircle, Instagram, Facebook, Clock, Upload, X, FileText, AlertCircle } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const COPY = {
  de: {
    eyebrow: 'Krone Langenburg by Ammesso',
    title: 'Kontakt',
    sub: 'Wir freuen uns, von Ihnen zu hören',
    whatsapp: 'Direkt auf WhatsApp schreiben',
    whatsapp_note: '· Antwort meist in unter 2 Stunden ·',
    addr_title: 'Anschrift',
    hours_title: 'Öffnungszeiten',
    directions: 'Route planen',
    mon: 'Montag', closed: 'Ruhetag',
    tue_sat: 'Di – Sa', sun: 'Sonntag',
    inquiry_label: 'Art der Anfrage',
    first: 'Vorname', last: 'Nachname',
    email: 'E-Mail', phone: 'Telefon', message: 'Nachricht',
    file_label: 'Dateianhang (optional)',
    file_hint: 'PDF, JPG, PNG – max. 10 MB',
    file_too_large: 'Datei zu groß (max. 10 MB).',
    file_remove: 'Entfernen',
    gdpr: 'Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu.',
    privacy_link: 'Datenschutz',
    gdpr_error: 'Bitte Datenschutz bestätigen.',
    send: 'Nachricht senden',
    sending: 'Wird gesendet…',
    success_title: 'Vielen Dank!',
    success_sub: 'Ihre Nachricht ist eingegangen. Wir melden uns schnellstmöglich.',
    map_title: 'Finden Sie uns',
    find_us: 'Finden Sie uns',
  },
  en: {
    eyebrow: 'Krone Langenburg by Ammesso',
    title: 'Contact',
    sub: 'We look forward to hearing from you',
    whatsapp: 'Message us on WhatsApp',
    whatsapp_note: '· Usually responds within 2 hours ·',
    addr_title: 'Address',
    hours_title: 'Opening Hours',
    directions: 'Get Directions',
    mon: 'Monday', closed: 'Closed',
    tue_sat: 'Tue – Sat', sun: 'Sunday',
    inquiry_label: 'Type of Enquiry',
    first: 'First Name', last: 'Last Name',
    email: 'Email', phone: 'Phone', message: 'Message',
    file_label: 'Attachment (optional)',
    file_hint: 'PDF, JPG, PNG – max. 10 MB',
    file_too_large: 'File too large (max. 10 MB).',
    file_remove: 'Remove',
    gdpr: 'I have read the privacy policy and agree to the processing of my personal data.',
    privacy_link: 'Privacy Policy',
    gdpr_error: 'Please accept the privacy policy.',
    send: 'Send Message',
    sending: 'Sending…',
    success_title: 'Thank you!',
    success_sub: 'Your message has been received. We will be in touch shortly.',
    map_title: 'Find Us',
    find_us: 'Find Us',
  },
  it: {
    eyebrow: 'Krone Langenburg by Ammesso',
    title: 'Contatti',
    sub: 'Siamo lieti di sentirvi',
    whatsapp: 'Scrivici su WhatsApp',
    whatsapp_note: '· Di solito risponde entro 2 ore ·',
    addr_title: 'Indirizzo',
    hours_title: 'Orari di apertura',
    directions: 'Come raggiungerci',
    mon: 'Lunedì', closed: 'Chiuso',
    tue_sat: 'Mar – Sab', sun: 'Domenica',
    inquiry_label: 'Tipo di richiesta',
    first: 'Nome', last: 'Cognome',
    email: 'Email', phone: 'Telefono', message: 'Messaggio',
    file_label: 'Allegato (opzionale)',
    file_hint: 'PDF, JPG, PNG – max. 10 MB',
    file_too_large: 'File troppo grande (max. 10 MB).',
    file_remove: 'Rimuovi',
    gdpr: 'Ho letto l\'informativa sulla privacy e acconsento al trattamento dei miei dati personali.',
    privacy_link: 'Privacy',
    gdpr_error: 'Accettare la privacy policy.',
    send: 'Invia messaggio',
    sending: 'Invio in corso…',
    success_title: 'Grazie!',
    success_sub: 'Il vostro messaggio è stato ricevuto. Vi risponderemo al più presto.',
    map_title: 'Trovaci',
    find_us: 'Trovaci',
  },
  es: {
    eyebrow: 'Krone Langenburg by Ammesso',
    title: 'Contacto',
    sub: 'Estaremos encantados de atenderle',
    whatsapp: 'Escríbanos por WhatsApp',
    whatsapp_note: '· Normalmente respondemos en menos de 2 horas ·',
    addr_title: 'Dirección',
    hours_title: 'Horario de apertura',
    directions: 'Cómo llegar',
    mon: 'Lunes', closed: 'Cerrado',
    tue_sat: 'Mar – Sáb', sun: 'Domingo',
    inquiry_label: 'Tipo de consulta',
    first: 'Nombre', last: 'Apellido',
    email: 'Correo electrónico', phone: 'Teléfono', message: 'Mensaje',
    file_label: 'Archivo adjunto (opcional)',
    file_hint: 'PDF, JPG, PNG – máx. 10 MB',
    file_too_large: 'Archivo demasiado grande (máx. 10 MB).',
    file_remove: 'Eliminar',
    gdpr: 'He leído la política de privacidad y acepto el tratamiento de mis datos personales.',
    privacy_link: 'Privacidad',
    gdpr_error: 'Por favor acepte la política de privacidad.',
    send: 'Enviar mensaje',
    sending: 'Enviando…',
    success_title: '¡Gracias!',
    success_sub: 'Su mensaje ha sido recibido. Nos pondremos en contacto en breve.',
    map_title: 'Encuéntrenos',
    find_us: 'Encuéntrenos',
  },
};

const TYPES = [
  { id: 'general', de: 'Allgemeine Anfrage', en: 'General Enquiry', it: 'Richiesta generale', es: 'Consulta general' },
  { id: 'wedding', de: 'Hochzeit & Events', en: 'Wedding & Events', it: 'Matrimoni & eventi', es: 'Bodas & eventos' },
  { id: 'group', de: 'Gruppenanfrage', en: 'Group Booking', it: 'Prenotazione di gruppo', es: 'Reserva de grupo' },
  { id: 'business', de: 'Geschäftsreise', en: 'Business Travel', it: "Viaggio d'affari", es: 'Viaje de negocios' },
];

const inputClass = "w-full bg-[#FAF7F2] border border-[#EDE6D8] rounded-xl px-4 py-3.5 text-sm text-[#1C1714] placeholder-[#C8BEA8] focus:outline-none focus:border-[#C9A96E]/60 focus:ring-2 focus:ring-[#C9A96E]/10 transition-all font-body";

export default function Contact() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;
  const t = COPY[lang] || COPY.de;
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    message: '', inquiry_type: 'general', gdpr: false, honeypot: '',
  });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [gdprError, setGdprError] = useState(false);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) { setFileError(t.file_too_large); return; }
    setFileError('');
    setFile(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.honeypot) return;
    if (!form.gdpr) { setGdprError(true); return; }
    setGdprError(false);
    setSubmitting(true);

    // Upload file if present
    let fileUri = null;
    let originalFilename = null;
    if (file) {
      try {
        const res = await base44.integrations.Core.UploadFile({ file });
        fileUri = res.file_url;
        originalFilename = file.name;
      } catch (_) {
        // file upload failed — continue without attachment
      }
    }

    // Create ContactInquiry
    const inquiry = await base44.entities.ContactInquiry.create({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email.toLowerCase().trim(),
      phone: form.phone,
      message: form.message,
      inquiry_type: form.inquiry_type,
      language: lang,
      status: 'new',
    });

    // If file was uploaded, log as GuestDocument linked to inquiry
    if (fileUri && inquiry?.id) {
      base44.entities.GuestDocument.create({
        user_email: form.email.toLowerCase().trim(),
        category: 'event_attachment',
        status: 'uploaded',
        file_uri: fileUri,
        original_filename: originalFilename,
        file_size_bytes: file.size,
        mime_type: file.type,
        description: `Kontaktformular-Anhang: ${form.inquiry_type}`,
        related_reservation_ref: inquiry.id,
      }).catch(() => {});
    }

    // Send email notifications (non-blocking)
    base44.functions.invoke('sendContactEmail', {
      first_name: form.first_name, last_name: form.last_name,
      email: form.email, phone: form.phone,
      message: form.message, inquiry_type: form.inquiry_type, lang,
      has_attachment: !!fileUri, attachment_filename: originalFilename,
    }).catch(() => {});

    base44.functions.invoke('notifySlack', {
      type: 'contact', name: `${form.first_name} ${form.last_name}`,
      email: form.email, inquiry_type: form.inquiry_type,
      message: form.message.slice(0, 200),
    }).catch(() => {});

    setDone(true);
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1714] pt-16 sm:pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-5">

        {/* ── HEADER ── */}
        <motion.div
          className="text-center py-12 sm:py-16"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-[#8B6914] text-[10px] tracking-[0.5em] uppercase font-body mb-3">{t.eyebrow}</p>
          <h1 className="font-display text-5xl sm:text-6xl font-light text-[#1C1714] mb-3">{t.title}</h1>
          <p className="font-body text-[#8A7A6A] text-base">{t.sub}</p>
          <a href="https://wa.me/4979054177" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#25D366] text-[#0F1A0F] rounded-full text-xs font-body font-bold tracking-widest uppercase shadow-lg hover:shadow-xl transition-all">
            💬 {t.whatsapp}
          </a>
          <p className="text-[#8A7A6A]/50 text-[10px] font-body mt-2 tracking-wider">{t.whatsapp_note}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-10">

          {/* ── LEFT INFO COLUMN ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Address */}
            <motion.div
              className="bg-white border border-[#EDE6D8] rounded-2xl p-6 shadow-[0_4px_20px_rgba(28,23,20,0.06)]"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
              <h2 className="text-[10px] tracking-[0.35em] uppercase font-body text-[#8A7A6A] mb-5">{t.addr_title}</h2>
              <ul className="space-y-4 text-sm font-body">
                <li className="flex gap-3 text-[#4A3F35]">
                  <MapPin className="w-4 h-4 text-[#8B6914] mt-0.5 flex-shrink-0" />
                  <span>{s.address_street}<br />{s.address_zip} {s.address_city}<br />{s.address_country}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="w-4 h-4 text-[#C9A96E] mt-0.5 flex-shrink-0" />
                  <a href={`tel:${s.phone}`} className="text-[#4A3F35] hover:text-[#8B6914] transition-colors">{s.phone}</a>
                </li>
                <li className="flex gap-3">
                  <Mail className="w-4 h-4 text-[#C9A96E] mt-0.5 flex-shrink-0" />
                  <a href={`mailto:${s.email_info}`} className="text-[#4A3F35] hover:text-[#8B6914] transition-colors">{s.email_info}</a>
                </li>
              </ul>
              <a href="https://www.google.com/maps/dir/?api=1&destination=Hauptstra%C3%9Fe+24%2C+74595+Langenburg"
                target="_blank" rel="noopener noreferrer"
                className="mt-5 block text-center py-3 border border-[#C9A96E]/30 text-[#8B6914] text-xs tracking-[0.2em] uppercase font-body rounded-xl hover:bg-[#8B6914]/5 transition-colors">
                {t.directions}
              </a>
            </motion.div>

            {/* Hours */}
            <motion.div
              className="bg-white border border-[#EDE6D8] rounded-2xl p-6 shadow-[0_4px_20px_rgba(28,23,20,0.06)]"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-3.5 h-3.5 text-[#8B6914]" />
                <h2 className="text-[10px] tracking-[0.35em] uppercase font-body text-[#8A7A6A]">{t.hours_title}</h2>
              </div>
              <ul className="space-y-3 text-sm font-body">
                <li className="flex justify-between text-[#C8BEA8]">
                  <span>{t.mon}</span><span>{t.closed}</span>
                </li>
                <li className="border-t border-[#EDE6D8] pt-3">
                  <div className="text-[#4A3F35]">{t.tue_sat}</div>
                  <div className="text-xs text-[#8A7A6A] mt-0.5">12:00 – 14:30 · 17:30 – 22:00</div>
                </li>
                <li className="border-t border-[#EDE6D8] pt-3">
                  <div className="text-[#4A3F35]">{t.sun}</div>
                  <div className="text-xs text-[#8A7A6A] mt-0.5">12:00 – 20:00</div>
                </li>
              </ul>
            </motion.div>

            {/* Socials */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <a href={s.social_instagram} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-[#EDE6D8] rounded-xl text-[#8A7A6A] hover:text-[#8B6914] hover:border-[#C9A96E]/40 transition-all text-xs font-body tracking-widest uppercase shadow-sm">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <a href={s.social_facebook} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-[#EDE6D8] rounded-xl text-[#8A7A6A] hover:text-[#8B6914] hover:border-[#C9A96E]/40 transition-all text-xs font-body tracking-widest uppercase shadow-sm">
                <Facebook className="w-4 h-4" /> Facebook
              </a>
            </motion.div>
          </div>

          {/* ── FORM COLUMN ── */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.7 }}>
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="bg-white border border-[#EDE6D8] rounded-2xl p-10 sm:p-14 text-center shadow-[0_4px_20px_rgba(28,23,20,0.06)] h-full flex flex-col items-center justify-center min-h-[500px]">
                  <div className="w-20 h-20 bg-[#C9A96E]/10 border border-[#C9A96E]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-9 h-9 text-[#C9A96E]" />
                  </div>
                  <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body mb-3">{t.eyebrow}</p>
                  <h2 className="font-display text-3xl font-light text-[#1C1714] mb-3">{t.success_title}</h2>
                  <p className="text-[#8A7A6A] font-body text-sm leading-relaxed max-w-sm">{t.success_sub}</p>
                  <p className="text-[#C9A96E] text-xs font-body mt-5">{s.email_info}</p>
                </motion.div>
              ) : (
                <motion.div key="form" className="bg-white border border-[#EDE6D8] rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(28,23,20,0.06)]">
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Inquiry type */}
                    <div>
                      <label className="block text-[10px] tracking-[0.3em] uppercase font-body text-[#8A7A6A] mb-3">{t.inquiry_label}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {TYPES.map(tp => (
                          <button key={tp.id} type="button"
                            onClick={() => setForm(f => ({ ...f, inquiry_type: tp.id }))}
                            className={`px-3 py-3 rounded-xl text-xs font-body text-left border transition-all ${
                              form.inquiry_type === tp.id
                                ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#8B6914] font-semibold'
                                : 'border-[#EDE6D8] text-[#8A7A6A] hover:border-[#C9A96E]/40 hover:bg-[#FAF7F2]'
                            }`}>
                            {tp[lang] || tp.de}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] tracking-[0.25em] uppercase font-body text-[#8A7A6A] mb-1.5">{t.first} *</label>
                        <input type="text" required autoComplete="given-name"
                          value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.25em] uppercase font-body text-[#8A7A6A] mb-1.5">{t.last} *</label>
                        <input type="text" required autoComplete="family-name"
                          value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className={inputClass} />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase font-body text-[#8A7A6A] mb-1.5">{t.email} *</label>
                      <input type="email" required autoComplete="email"
                        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase font-body text-[#8A7A6A] mb-1.5">{t.phone}</label>
                      <input type="tel" autoComplete="tel"
                        value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase font-body text-[#8A7A6A] mb-1.5">{t.message} *</label>
                      <textarea rows={5} required
                        value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className={`${inputClass} resize-none`} />
                    </div>

                    {/* File upload */}
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase font-body text-[#8A7A6A] mb-2">{t.file_label}</label>
                      {file ? (
                        <div className="flex items-center gap-3 bg-[#F2E8D0] border border-[#C9A96E]/30 rounded-xl px-4 py-3">
                          <FileText className="w-4 h-4 text-[#8B6914] flex-shrink-0" />
                          <span className="text-sm font-body text-[#4A3F35] flex-1 truncate">{file.name}</span>
                          <span className="text-[10px] text-[#8A7A6A] font-body flex-shrink-0">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                          <button type="button" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                            className="text-[#8A7A6A] hover:text-[#1C1714] transition-colors flex-shrink-0">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => fileRef.current?.click()}
                          className="w-full border-2 border-dashed border-[#EDE6D8] hover:border-[#C9A96E]/50 rounded-xl px-4 py-5 flex flex-col items-center gap-2 transition-all group">
                          <Upload className="w-5 h-5 text-[#C8BEA8] group-hover:text-[#C9A96E] transition-colors" />
                          <span className="text-xs font-body text-[#C8BEA8] group-hover:text-[#8A7A6A] transition-colors">{t.file_hint}</span>
                        </button>
                      )}
                      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFile} />
                      {fileError && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-body">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {fileError}
                        </div>
                      )}
                    </div>

                    {/* Honeypot */}
                    <input type="text" tabIndex={-1} autoComplete="off" style={{ display: 'none' }}
                      value={form.honeypot} onChange={e => setForm(f => ({ ...f, honeypot: e.target.value }))} />

                    {/* GDPR */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        onClick={() => { setForm(f => ({ ...f, gdpr: !f.gdpr })); setGdprError(false); }}
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 rounded border-2 transition-colors flex items-center justify-center cursor-pointer ${
                          form.gdpr ? 'bg-[#8B6914] border-[#8B6914]' : gdprError ? 'border-red-500' : 'border-[#C8BEA8] group-hover:border-[#8B6914]/50'
                        }`}>
                        {form.gdpr && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="text-[#4A3F35]/60 text-xs font-body leading-relaxed">
                        {t.gdpr}{' '}
                        <a href="/privacy" className="text-[#8B6914] hover:underline" target="_blank">{t.privacy_link}</a>
                      </span>
                    </label>
                    {gdprError && (
                      <p className="text-red-500 text-xs font-body flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> {t.gdpr_error}
                      </p>
                    )}

                    {/* Submit */}
                    <button type="submit" disabled={submitting}
                      className="w-full py-4 bg-[#1C1714] hover:bg-[#2A2118] disabled:opacity-50 text-white rounded-full text-xs tracking-[0.2em] uppercase font-body font-semibold transition-all shadow-lg flex items-center justify-center gap-2">
                      {submitting
                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t.sending}</>
                        : t.send}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── MAP ── */}
        <motion.div
          className="mt-14 sm:mt-20"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="font-display text-3xl font-light text-[#1C1714] mb-6 text-center">{t.find_us}</h2>
          <div className="rounded-2xl overflow-hidden border border-[#EDE6D8] h-[380px] sm:h-[480px] shadow-[0_8px_32px_rgba(28,23,20,0.1)]">
            <iframe
              width="100%" height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=9.8390%2C49.2495%2C9.8540%2C49.2585&layer=mapnik&marker=49.2540%2C9.8465"
              title="Krone Langenburg"
            />
          </div>
          <div className="text-center mt-4">
            <a href="https://www.google.com/maps/dir/?api=1&destination=Hauptstra%C3%9Fe+24%2C+74595+Langenburg"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#8B6914] hover:text-[#5C4010] text-xs font-body tracking-wider transition-colors">
              {t.directions} →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}