import { useState } from 'react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { SITE_DEFAULTS } from '@/lib/siteData';
import { MapPin, Phone, Mail, CheckCircle, Instagram, Facebook, Clock } from 'lucide-react';

export default function Contact() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', message: '', inquiry_type: 'general', gdpr: false, honeypot: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [gdprError, setGdprError] = useState(false);

  const TYPES = [
    { id: 'general', de: 'Allgemeine Anfrage', en: 'General Enquiry', it: 'Richiesta generale' },
    { id: 'wedding', de: 'Hochzeit & Events', en: 'Wedding & Events', it: 'Matrimoni & eventi' },
    { id: 'group', de: 'Gruppenanfrage', en: 'Group Booking', it: 'Prenotazione di gruppo' },
    { id: 'business', de: 'Geschäftsreise', en: 'Business Travel', it: "Viaggio d'affari" },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.honeypot) return; // spam bot trap
    if (!form.gdpr) { setGdprError(true); return; }
    setGdprError(false);
    setSubmitting(true);
    await base44.entities.ContactInquiry.create({
      first_name: form.first_name, last_name: form.last_name,
      email: form.email.toLowerCase().trim(), phone: form.phone,
      message: form.message, inquiry_type: form.inquiry_type,
      language: lang, status: 'new',
    });
    base44.functions.invoke('sendContactEmail', {
      first_name: form.first_name, last_name: form.last_name,
      email: form.email, phone: form.phone, message: form.message,
      inquiry_type: form.inquiry_type, lang,
    }).catch(() => {});
    base44.functions.invoke('notifySlack', {
      type: 'contact', name: `${form.first_name} ${form.last_name}`,
      email: form.email, inquiry_type: form.inquiry_type, message: form.message.slice(0, 200),
    }).catch(() => {});
    setDone(true);
    setSubmitting(false);
  }

  const c = {
    de: { title: 'Kontakt', sub: 'Wir freuen uns von Ihnen zu hören', addr_title: 'Anschrift', hours_title: 'Öffnungszeiten', directions: 'Route planen', send: 'Nachricht senden', success: 'Vielen Dank! Wir melden uns bald.', inquiry_type: 'Art der Anfrage', first: 'Vorname', last: 'Nachname', email: 'E-Mail', phone: 'Telefon', message: 'Nachricht' },
    en: { title: 'Contact', sub: 'We look forward to hearing from you', addr_title: 'Address', hours_title: 'Opening Hours', directions: 'Get Directions', send: 'Send Message', success: 'Thank you! We will be in touch soon.', inquiry_type: 'Type of Enquiry', first: 'First Name', last: 'Last Name', email: 'Email', phone: 'Phone', message: 'Message' },
    it: { title: 'Contatti', sub: 'Siamo felici di sentirvi', addr_title: 'Indirizzo', hours_title: 'Orari di apertura', directions: 'Come raggiungerci', send: 'Invia messaggio', success: 'Grazie! Vi risponderemo presto.', inquiry_type: 'Tipo di richiesta', first: 'Nome', last: 'Cognome', email: 'Email', phone: 'Telefono', message: 'Messaggio' },
  };
  const t = c[lang] || c.de;

  const inputClass = "w-full bg-white border border-stone-mid rounded-xl px-4 py-3 text-sm text-charcoal placeholder-stone-dark focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all font-body";

  return (
    <div className="min-h-screen bg-ivory text-charcoal pt-16 sm:pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-5">
        {/* Header */}
        <div className="text-center py-10 sm:py-14">
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">Krone Langenburg by Ammesso</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-charcoal mb-2 sm:mb-3">{t.title}</h1>
          <p className="font-body text-sm sm:text-base" style={{color:'#7A6A5A'}}>{t.sub}</p>
          {/* WhatsApp CTA - prominent on mobile */}
          <a href={`https://wa.me/4979054177`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-[#25D366] text-[#0F0D0B] rounded-full text-xs font-body font-semibold tracking-widest uppercase shadow-md">
            💬 {lang === 'de' ? 'Direkt auf WhatsApp schreiben' : lang === 'en' ? 'Message us on WhatsApp' : 'Scrivici su WhatsApp'}
          </a>
          <p className="text-[#8A7A6A]/60 text-[10px] font-body mt-2">
            {lang === 'de' ? '· Antwort meist in unter 2 Stunden ·' : lang === 'en' ? '· Usually responds within 2 hours ·' : '· Di solito risponde entro 2 ore ·'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-10">
          {/* Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            <div className="surface-card rounded-2xl p-5 sm:p-6">
              <h2 className="text-[10px] tracking-[0.3em] uppercase font-body mb-5" style={{color:'#8A7A6A'}}>{t.addr_title}</h2>
              <ul className="space-y-4 text-sm font-body">
                <li className="flex gap-3" style={{color:'#5A4A3A'}}>
                  <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <span>{s.address_street}<br />{s.address_zip} {s.address_city}<br />{s.address_country}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="w-4 h-4 text-gold/60 mt-0.5 flex-shrink-0" />
                  <a href={`tel:${s.phone}`} className="text-[#5A4A3A] hover:text-gold transition-colors">{s.phone}</a>
                </li>
                <li className="flex gap-3">
                  <Mail className="w-4 h-4 text-gold/60 mt-0.5 flex-shrink-0" />
                  <a href={`mailto:${s.email_info}`} className="text-[#5A4A3A] hover:text-gold transition-colors">{s.email_info}</a>
                </li>
              </ul>
              <a href="https://www.google.com/maps/dir/?api=1&destination=Hauptstra%C3%9Fe+24%2C+74595+Langenburg"
                target="_blank" rel="noopener noreferrer"
                className="mt-5 block text-center py-3 border border-[#C9A96E]/20 text-gold text-xs tracking-[0.2em] uppercase font-body rounded-xl hover:bg-gold/5 transition-colors">
                {t.directions}
              </a>
            </div>

            <div className="surface-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-3.5 h-3.5 text-gold" />
                <h2 className="text-[10px] tracking-[0.3em] uppercase font-body" style={{color:'#8A7A6A'}}>{t.hours_title}</h2>
              </div>
              <ul className="space-y-3 text-sm font-body">
                <li className="flex justify-between" style={{color:'#B0A090'}}>
                  <span>{lang === 'de' ? 'Montag' : lang === 'en' ? 'Monday' : 'Lunedì'}</span>
                  <span>{lang === 'de' ? 'Ruhetag' : lang === 'en' ? 'Closed' : 'Chiuso'}</span>
                </li>
                <li>
                  <div style={{color:'#5A4A3A'}}>{lang === 'de' ? 'Di – Sa' : lang === 'en' ? 'Tue – Sat' : 'Mar – Sab'}</div>
                  <div className="text-xs mt-0.5" style={{color:'#8A7A6A'}}>12:00 – 14:30 · 17:30 – 22:00</div>
                </li>
                <li>
                  <div style={{color:'#5A4A3A'}}>{lang === 'de' ? 'Sonntag' : lang === 'en' ? 'Sunday' : 'Domenica'}</div>
                  <div className="text-xs mt-0.5" style={{color:'#8A7A6A'}}>12:00 – 20:00</div>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <a href={s.social_instagram} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-[#EDE6D8] rounded-xl text-[#8A7A6A] hover:text-gold hover:border-[#C9A96E]/30 transition-all text-xs font-body tracking-widest uppercase">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <a href={s.social_facebook} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-[#EDE6D8] rounded-xl text-[#8A7A6A] hover:text-gold hover:border-[#C9A96E]/30 transition-all text-xs font-body tracking-widest uppercase">
                <Facebook className="w-4 h-4" /> Facebook
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {done ? (
              <div className="surface-card rounded-2xl p-8 sm:p-12 text-center h-full flex flex-col items-center justify-center">
                <CheckCircle className="w-12 h-12 text-gold mb-4" />
                <h2 className="font-display text-2xl font-light text-charcoal mb-2">{t.success}</h2>
                <p className="text-sm font-body" style={{color:'#8A7A6A'}}>{s.email_info}</p>
              </div>
            ) : (
              <div className="surface-card rounded-2xl p-5 sm:p-7">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[#8A7A6A] text-[10px] tracking-[0.25em] uppercase font-body mb-2">{t.inquiry_type}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {TYPES.map(tp => (
                        <button key={tp.id} type="button"
                          onClick={() => setForm(f => ({ ...f, inquiry_type: tp.id }))}
                          className={`px-3 py-2.5 rounded-xl text-xs font-body text-left border transition-all ${
                            form.inquiry_type === tp.id ? 'border-gold bg-gold/10 text-gold' : 'border-[#EDE6D8] text-[#8A7A6A] hover:border-[#C9A96E]/50'
                          }`}>
                          {lang === 'de' ? tp.de : lang === 'en' ? tp.en : tp.it}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#8A7A6A] text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.first} *</label>
                      <input type="text" required value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[#8A7A6A] text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.last} *</label>
                      <input type="text" required value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#8A7A6A] text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.email} *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[#8A7A6A] text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.phone}</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[#8A7A6A] text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.message} *</label>
                    <textarea rows={5} required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className={`${inputClass} resize-none`} />
                  </div>
                  {/* Honeypot — hidden, bots fill it, humans don't */}
                  <input type="text" tabIndex={-1} autoComplete="off" style={{ display: 'none' }}
                    value={form.honeypot} onChange={e => setForm(f => ({ ...f, honeypot: e.target.value }))} />

                  {/* GDPR consent */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 rounded border-2 transition-colors flex items-center justify-center ${form.gdpr ? 'bg-[#8B6914] border-[#8B6914]' : gdprError ? 'border-red-500' : 'border-[#C8BEA8] group-hover:border-[#8B6914]/50'}`}
                      onClick={() => { setForm(f => ({ ...f, gdpr: !f.gdpr })); setGdprError(false); }}>
                      {form.gdpr && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-[#4A3F35]/60 text-xs font-body leading-relaxed">
                      {lang === 'de'
                        ? 'Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu.'
                        : lang === 'en'
                        ? 'I have read the privacy policy and agree to the processing of my data.'
                        : 'Ho letto l\'informativa sulla privacy e acconsento al trattamento dei miei dati.'
                      }{' '}
                      <a href="/privacy" className="text-[#8B6914] hover:underline" target="_blank">
                        {lang === 'de' ? 'Datenschutz' : lang === 'en' ? 'Privacy Policy' : 'Privacy'}
                      </a>
                    </span>
                  </label>
                  {gdprError && <p className="text-red-500 text-xs font-body">
                    {lang === 'de' ? 'Bitte Datenschutz bestätigen.' : 'Please accept the privacy policy.'}
                  </p>}

                  <button type="submit" disabled={submitting}
                    className="w-full py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold disabled:opacity-50 transition-all">
                    {submitting ? '...' : t.send}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-12 sm:mt-16">
          <h2 className="font-display text-2xl font-light text-charcoal mb-6 text-center">
            {lang === 'de' ? 'Finden Sie uns' : lang === 'en' ? 'Find Us' : 'Trovaci'}
          </h2>
          <div className="rounded-2xl overflow-hidden border border-[#C9A96E]/10 h-[400px] sm:h-[500px]">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyA-OPJc_4CvKv_S8YToDdmlS9hE7f1R1AU&q=${encodeURIComponent('Hauptstraße 24, 74595 Langenburg, Germany')}`}
              title="Krone Langenburg Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}