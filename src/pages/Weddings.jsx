import { useState } from 'react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { CheckCircle, ArrowRight, Phone, Mail } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
  table: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80",
  dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
  exterior: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80",
};

const EVENT_TYPES = [
  { id: 'wedding', de: '💍 Hochzeit', en: '💍 Wedding', it: '💍 Matrimonio' },
  { id: 'celebration', de: '🥂 Geburtstag & Jubiläum', en: '🥂 Birthday & Anniversary', it: '🥂 Compleanno & anniversario' },
  { id: 'corporate', de: '🏢 Firmenevent', en: '🏢 Corporate Event', it: '🏢 Evento aziendale' },
  { id: 'private_dining', de: '🍽 Private Dining', en: '🍽 Private Dining', it: '🍽 Cena privata' },
  { id: 'group', de: '👥 Gruppenreise / Kontingent', en: '👥 Group Stay / Contingent', it: '👥 Soggiorno di gruppo' },
  { id: 'other', de: '✦ Sonstige Anfrage', en: '✦ Other Request', it: '✦ Altra richiesta' },
];

const inputCls = "w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-4 py-3.5 text-sm text-ivory placeholder-ivory/25 focus:outline-none focus:border-gold/40 transition-colors font-body";

export default function Weddings() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    event_type: 'wedding', guest_count: '', preferred_date: '', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.ContactInquiry.create({
      first_name: form.first_name, last_name: form.last_name,
      email: form.email, phone: form.phone,
      inquiry_type: form.event_type === 'wedding' ? 'wedding' : form.event_type === 'group' ? 'group' : 'event',
      guest_count: parseInt(form.guest_count) || 0,
      preferred_date: form.preferred_date,
      message: `[${form.event_type}] Gäste: ${form.guest_count} | Datum: ${form.preferred_date}\n\n${form.message}`,
      language: lang,
    });
    base44.functions.invoke('notifySlack', {
      type: 'contact', name: `${form.first_name} ${form.last_name}`,
      email: form.email, inquiry_type: form.event_type,
      message: form.message.slice(0, 200),
    }).catch(() => {});
    base44.functions.invoke('sendContactEmail', {
      first_name: form.first_name, last_name: form.last_name,
      email: form.email, phone: form.phone,
      message: `[${form.event_type}] Gäste: ${form.guest_count} | Datum: ${form.preferred_date}\n\n${form.message}`,
      inquiry_type: form.event_type, lang,
    }).catch(() => {});
    setDone(true);
    setSubmitting(false);
  }

  const C = {
    de: {
      eyebrow: 'Hochzeiten & Events',
      title: 'Ihr besonderer Tag.\nUnser ganzes Herz.',
      lead: 'Die Krone Langenburg ist nicht nur ein Ort — sie ist eine Bühne für die schönsten Momente Ihres Lebens. Wir begleiten Sie von der ersten Idee bis zum letzten Tanz.',
      features: [
        { icon: '💍', title: 'Traumhochzeiten', text: 'Intimes Ambiente für bis zu 120 Gäste, Raumkontingente für Übernachtungsgäste, individuelle Menügestaltung. Ihre Hochzeit, so wie sie sein soll — und noch schöner.' },
        { icon: '🥂', title: 'Feiern & Jubiläen', text: 'Geburtstage, runde Jahrestage, Familientreffen — wir gestalten Ihre Feier mit Wärme und Eleganz. Vom intimen Dinner bis zur großen Tafel.' },
        { icon: '🏢', title: 'Firmenevents', text: 'Tagungen, Produktpräsentationen, Mitarbeiterevents — die Krone bietet den idealen Rahmen, der Professionalität mit Gastlichkeit verbindet.' },
        { icon: '🍽', title: 'Private Dining', text: 'Exklusives Abendessen in privatem Rahmen. Chef Omar Ammesso gestaltet für Sie ein unvergessliches Menü — abgestimmt auf Ihre Gäste und den Anlass.' },
      ],
      capacity: 'Bis zu 120 Gäste',
      rooms: 'Raumkontingente verfügbar',
      flexible: 'Individuelle Menügestaltung',
      form_title: 'Anfrage senden',
      form_sub: 'Schildern Sie uns Ihren Wunsch — wir melden uns innerhalb von 24 Stunden bei Ihnen.',
      et_label: 'Art des Events',
      guests: 'Geschätzte Gästezahl',
      date: 'Wunschdatum (ungefähr)',
      first: 'Vorname', last: 'Nachname', email: 'E-Mail', phone: 'Telefon', message: 'Erzählen Sie uns von Ihrem Event',
      msg_ph: 'Was planen Sie? Welche Atmosphäre wünschen Sie sich? Gibt es besondere Wünsche oder Anforderungen?',
      submit: 'Anfrage senden',
      success_title: 'Vielen Dank!',
      success_text: 'Ihre Anfrage ist bei uns eingegangen. Wir melden uns innerhalb von 24 Stunden.',
      or_contact: 'Oder kontaktieren Sie uns direkt:',
    },
    en: {
      eyebrow: 'Weddings & Events',
      title: 'Your Special Day.\nOur Whole Heart.',
      lead: 'Krone Langenburg is not just a venue — it is a stage for the most beautiful moments of your life. We accompany you from the first idea to the last dance.',
      features: [
        { icon: '💍', title: 'Dream Weddings', text: 'Intimate setting for up to 120 guests, room contingents for overnight guests, individual menu design. Your wedding, exactly as it should be — and even more beautiful.' },
        { icon: '🥂', title: 'Celebrations & Anniversaries', text: 'Birthdays, milestone anniversaries, family gatherings — we design your celebration with warmth and elegance. From intimate dinner to a large banquet.' },
        { icon: '🏢', title: 'Corporate Events', text: 'Meetings, product presentations, team events — the Krone offers the ideal setting that combines professionalism with genuine hospitality.' },
        { icon: '🍽', title: 'Private Dining', text: 'Exclusive dinner in a private setting. Chef Omar Ammesso creates an unforgettable menu tailored to your guests and the occasion.' },
      ],
      capacity: 'Up to 120 guests',
      rooms: 'Room contingents available',
      flexible: 'Individual menu design',
      form_title: 'Send an Enquiry',
      form_sub: 'Tell us about your vision — we will be in touch within 24 hours.',
      et_label: 'Event Type',
      guests: 'Estimated Guest Count',
      date: 'Preferred Date (approximate)',
      first: 'First Name', last: 'Last Name', email: 'Email', phone: 'Phone', message: 'Tell us about your event',
      msg_ph: 'What are you planning? What atmosphere do you have in mind? Any special requirements?',
      submit: 'Send Enquiry',
      success_title: 'Thank you!',
      success_text: 'Your enquiry has been received. We will be in touch within 24 hours.',
      or_contact: 'Or contact us directly:',
    },
    it: {
      eyebrow: 'Matrimoni & eventi',
      title: 'Il vostro giorno speciale.\nTutto il nostro cuore.',
      lead: 'Krone Langenburg non è solo un luogo — è un palcoscenico per i momenti più belli della vostra vita. Vi accompagniamo dalla prima idea all\'ultimo ballo.',
      features: [
        { icon: '💍', title: 'Matrimoni da sogno', text: 'Ambiente intimo per fino a 120 ospiti, contingenti di camere per gli ospiti pernottanti, menù individuale. Il vostro matrimonio, esattamente come deve essere.' },
        { icon: '🥂', title: 'Feste e anniversari', text: 'Compleanni, anniversari importanti, riunioni di famiglia — organizziamo la vostra festa con calore ed eleganza.' },
        { icon: '🏢', title: 'Eventi aziendali', text: 'Riunioni, presentazioni di prodotti, eventi per i dipendenti — la Krone offre la cornice ideale.' },
        { icon: '🍽', title: 'Cena privata', text: 'Cena esclusiva in un ambiente privato. Lo chef Omar Ammesso crea un menù indimenticabile su misura per voi.' },
      ],
      capacity: 'Fino a 120 ospiti',
      rooms: 'Contingenti di camere disponibili',
      flexible: 'Menù individuale su misura',
      form_title: 'Invia una richiesta',
      form_sub: 'Raccontateci la vostra idea — vi risponderemo entro 24 ore.',
      et_label: 'Tipo di evento',
      guests: 'Numero di ospiti stimato',
      date: 'Data preferita (indicativa)',
      first: 'Nome', last: 'Cognome', email: 'Email', phone: 'Telefono', message: 'Raccontateci il vostro evento',
      msg_ph: 'Cosa state pianificando? Che atmosfera desiderate? Ci sono esigenze particolari?',
      submit: 'Invia richiesta',
      success_title: 'Grazie!',
      success_text: 'La vostra richiesta è stata ricevuta. Vi risponderemo entro 24 ore.',
      or_contact: 'Oppure contattateci direttamente:',
    },
  };
  const c = C[lang] || C.de;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pb-20 lg:pb-0">

      {/* Hero */}
      <div className="relative h-[55vh] sm:h-[65vh] min-h-[360px] sm:min-h-[440px] overflow-hidden">
        <img src={IMAGES.hero} alt="Hochzeit & Events Krone Langenburg by Ammesso — Eventlocation Hohenlohe" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/65 via-charcoal/30 to-charcoal" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-charcoal/40" />
        <div className="absolute inset-0 flex items-end pb-14 px-5">
          <div className="max-w-4xl mx-auto w-full">
            <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-body mb-3 sm:mb-4">{c.eyebrow}</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-ivory leading-[1.0] whitespace-pre-line">{c.title}</h1>
          </div>
        </div>
      </div>

      {/* Lead */}
      <section className="py-16 px-5 bg-espresso border-y border-[#C9A96E]/10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="section-divider mb-8" />
          <p className="font-display text-2xl md:text-3xl font-light text-ivory/75 italic leading-relaxed">&ldquo;{c.lead}&rdquo;</p>
          <div className="section-divider mt-8" />
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[c.capacity, c.rooms, c.flexible].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-body text-ivory/50">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 sm:py-20 px-4 sm:px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {c.features.map((f, i) => (
            <div key={i} className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5 sm:p-8 flex gap-4 sm:gap-5">
              <span className="text-3xl flex-shrink-0 mt-1">{f.icon}</span>
              <div>
                <h3 className="font-display text-xl font-light text-ivory mb-3">{f.title}</h3>
                <p className="text-ivory/50 text-sm font-body leading-relaxed">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery strip */}
      <section className="px-5 pb-10">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4 h-56 md:h-72">
          {[
            { src: IMAGES.table, alt: 'Hochzeitstafel Krone Langenburg — festlich gedeckter Tisch' },
            { src: IMAGES.dining, alt: 'Kulinarium by Ammesso — Eventküche mediterrane Festtafel' },
            { src: IMAGES.exterior, alt: 'Krone Langenburg Eventlocation Außenbereich' },
          ].map((item, i) => (
            <div key={i} className={`relative rounded-2xl overflow-hidden ${i === 1 ? '' : 'opacity-70'}`}>
              <img src={item.src} alt={item.alt} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
            </div>
          ))}
        </div>
      </section>

      {/* Process / How It Works */}
      <section className="py-14 sm:py-16 px-4 sm:px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">
              {lang === 'de' ? 'So funktioniert es' : lang === 'en' ? 'How it works' : 'Come funziona'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory">
              {lang === 'de' ? 'Von der ersten Idee bis zum unvergesslichen Abend' : lang === 'en' ? 'From the first idea to the unforgettable evening' : 'Dalla prima idea alla serata indimenticabile'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                de_t: 'Anfrage senden',
                en_t: 'Send an Enquiry',
                it_t: 'Invia una richiesta',
                de: 'Erzählen Sie uns von Ihrem Event — Art, Datum, Gästezahl und Ihre Wünsche.',
                en: 'Tell us about your event — type, date, guest count and your wishes.',
                it: 'Raccontateci del vostro evento — tipo, data, numero di ospiti e i vostri desideri.',
              },
              {
                step: '02',
                de_t: 'Persönliches Gespräch',
                en_t: 'Personal Consultation',
                it_t: 'Consulenza personale',
                de: 'Wir melden uns innerhalb von 24h und besprechen gemeinsam das ideale Konzept.',
                en: 'We respond within 24h and discuss the ideal concept together.',
                it: 'Vi rispondiamo entro 24h e discutiamo insieme il concetto ideale.',
              },
              {
                step: '03',
                de_t: 'Ihr unvergesslicher Tag',
                en_t: 'Your Unforgettable Day',
                it_t: 'Il vostro giorno indimenticabile',
                de: 'Unser Team sorgt dafür, dass jedes Detail stimmt — vom Menü bis zur letzten Dekoration.',
                en: 'Our team ensures every detail is perfect — from the menu to the last decoration.',
                it: 'Il nostro team si assicura che ogni dettaglio sia perfetto — dal menù all\'ultima decorazione.',
              },
            ].map((item, i) => (
              <div key={i} className="glass-card border border-[#C9A96E]/10 rounded-2xl p-6 relative">
                <p className="font-display text-5xl font-light text-gold/20 mb-4">{item.step}</p>
                <h3 className="font-display text-xl font-light text-ivory mb-3">
                  {lang === 'de' ? item.de_t : lang === 'en' ? item.en_t : item.it_t}
                </h3>
                <p className="text-ivory/45 text-sm font-body leading-relaxed">
                  {lang === 'de' ? item.de : lang === 'en' ? item.en : item.it}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-14 sm:py-20 px-4 sm:px-5 bg-espresso">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-4">{c.eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory mb-3 sm:mb-4">{c.form_title}</h2>
            <p className="text-ivory/40 font-body text-sm">{c.form_sub}</p>
          </div>

          {done ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-gold/15">
              <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-display text-3xl font-light text-ivory mb-3">{c.success_title}</h3>
              <p className="text-ivory/50 font-body text-sm mb-8">{c.success_text}</p>
              <p className="text-ivory/30 text-xs font-body mb-4">{c.or_contact}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`tel:${s.phone}`} className="flex items-center justify-center gap-2 px-6 py-3 btn-ghost-gold rounded-full text-xs tracking-widest uppercase font-body">
                  <Phone className="w-3.5 h-3.5" /> {s.phone}
                </a>
                <a href={`mailto:${s.email_info}`} className="flex items-center justify-center gap-2 px-6 py-3 btn-ghost-gold rounded-full text-xs tracking-widest uppercase font-body">
                  <Mail className="w-3.5 h-3.5" /> {s.email_info}
                </a>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-5 sm:p-8 md:p-10 border border-[#C9A96E]/10">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Event type */}
                <div>
                  <label className="block text-ivory/40 text-[10px] tracking-[0.3em] uppercase font-body mb-3">{c.et_label}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {EVENT_TYPES.map(et => (
                      <button key={et.id} type="button"
                        onClick={() => setForm(f => ({ ...f, event_type: et.id }))}
                        className={`px-3 py-2.5 rounded-xl text-xs font-body text-left border transition-all ${form.event_type === et.id ? 'border-gold bg-gold/10 text-gold' : 'border-[#C9A96E]/12 text-ivory/45 hover:border-[#C9A96E]/30'}`}>
                        {lang === 'de' ? et.de : lang === 'en' ? et.en : et.it}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.first} *</label>
                    <input type="text" required value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.last} *</label>
                    <input type="text" required value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.email} *</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.phone}</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.guests}</label>
                    <input type="number" min="1" value={form.guest_count} onChange={e => setForm(f => ({ ...f, guest_count: e.target.value }))} className={inputCls} placeholder="z.B. 60" />
                  </div>
                </div>
                <div>
                  <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.date}</label>
                  <input type="date" value={form.preferred_date} onChange={e => setForm(f => ({ ...f, preferred_date: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.message} *</label>
                  <textarea rows={5} required placeholder={c.msg_ph} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className={`${inputCls} resize-none`} />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-4 btn-gold rounded-full text-xs tracking-[0.2em] uppercase font-body font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting
                    ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                    : <>{c.submit} <ArrowRight className="w-3.5 h-3.5" /></>
                  }
                </button>
                <p className="text-center text-ivory/25 text-xs font-body">
                  {lang === 'de' ? 'Wir antworten innerhalb von 24 Stunden.' : lang === 'en' ? 'We respond within 24 hours.' : 'Risponderemo entro 24 ore.'}
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Direct contact strip */}
      <section className="py-12 px-5 border-t border-[#C9A96E]/10">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-ivory/40 text-sm font-body">{c.or_contact}</p>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${s.phone}`} className="flex items-center gap-2 px-5 py-2.5 glass-card border border-[#C9A96E]/15 rounded-full text-xs text-ivory/60 hover:text-gold hover:border-gold/30 transition-all font-body">
              <Phone className="w-3.5 h-3.5" /> {s.phone}
            </a>
            <a href={`mailto:${s.email_info}`} className="flex items-center gap-2 px-5 py-2.5 glass-card border border-[#C9A96E]/15 rounded-full text-xs text-ivory/60 hover:text-gold hover:border-gold/30 transition-all font-body">
              <Mail className="w-3.5 h-3.5" /> {s.email_info}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}