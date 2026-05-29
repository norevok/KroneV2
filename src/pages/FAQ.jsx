import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { ChevronDown, UtensilsCrossed, BedDouble, Phone, ArrowRight, MessageCircle } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';

const FAQS = {
  de: [
    // Restaurant
    { cat: 'restaurant', q: 'Wie kann ich einen Tisch reservieren?', a: 'Ganz einfach über unser Online-Reservierungssystem unter /reserve — schnell, direkt und ohne Zwischenhändler. Alternativ per E-Mail an info@krone-ammesso.de oder telefonisch unter +49 7905 41770. Für Gruppen ab 10 Personen bitten wir um direkte Kontaktaufnahme, damit wir alles bestmöglich vorbereiten können.' },
    { cat: 'restaurant', q: 'Wann ist das Restaurant geöffnet?', a: 'Dienstag bis Samstag: Mittags 12:00–14:30 Uhr, Abends 17:30–22:00 Uhr. Sonntag: 12:00–20:00 Uhr (durchgehend). Montag ist unser Ruhetag. An Feiertagen können abweichende Zeiten gelten — bitte vorab anfragen.' },
    { cat: 'restaurant', q: 'Gibt es vegetarische, vegane oder glutenfreie Gerichte?', a: 'Ja, unsere Speisekarte bietet stets vegetarische Optionen. Bei veganen Wünschen oder Unverträglichkeiten wie Gluten oder Nüssen informieren Sie uns bitte bei der Reservierung — wir passen das Menü wo möglich gerne an.' },
    { cat: 'restaurant', q: 'Kann ich für eine besondere Feier reservieren?', a: 'Absolut. Für Geburtstage, Jubiläen oder besondere Anlässe sprechen Sie uns einfach bei der Reservierung an. Wir dekorieren den Tisch gerne, koordinieren eine Torte oder stellen ein besonderes Menü zusammen.' },
    { cat: 'restaurant', q: 'Kann ich die Speisekarte im Voraus einsehen?', a: 'Unsere aktuelle Speisekarte finden Sie jederzeit unter /menu. Die Karte ändert sich saisonal — manche Gerichte können je nach Verfügbarkeit abweichen.' },
    { cat: 'restaurant', q: 'Gibt es einen Außenbereich?', a: 'Im Sommer bieten wir eine Terrasse an. Fragen Sie bei Ihrer Reservierung nach Verfügbarkeit.' },

    // Zimmer
    { cat: 'rooms', q: 'Wie buche ich ein Zimmer?', a: 'Zimmer werden über unser sicheres Online-Buchungssystem (Beds24) gebucht. Klicken Sie einfach auf "Zimmer buchen" und wählen Sie Ihren gewünschten Zeitraum, die Zimmerkategorie und die Gästezahl. Sie erhalten unmittelbar eine Buchungsbestätigung.' },
    { cat: 'rooms', q: 'Welche Zimmerkategorien gibt es?', a: 'Wir bieten Deluxe Einzelzimmer, Deluxe Doppelzimmer sowie unsere großzügige King Suite an. Alle Zimmer sind stilvoll eingerichtet und bieten modernen Komfort im historischen Ambiente der Krone Langenburg.' },
    { cat: 'rooms', q: 'Ist Frühstück inklusive?', a: 'Frühstück ist optional zubuchbar für €14 pro Person und Nacht. Sie können es bei der Buchung direkt hinzufügen oder uns per E-Mail vor der Anreise informieren.' },
    { cat: 'rooms', q: 'Wie lauten die Check-in und Check-out Zeiten?', a: 'Check-in ist ab 15:00 Uhr möglich. Check-out bis 11:00 Uhr. Früh-Check-in oder spätes Auschecken können wir nach Verfügbarkeit und auf Anfrage ermöglichen — sprechen Sie uns gerne an.' },
    { cat: 'rooms', q: 'Gibt es WLAN auf dem Zimmer?', a: 'Selbstverständlich — kostenloses WLAN steht in allen Zimmern und im gesamten Haus zur Verfügung.' },
    { cat: 'rooms', q: 'Sind Haustiere erlaubt?', a: 'Bitte kontaktieren Sie uns vorab, wenn Sie mit einem Haustier anreisen möchten. Wir klären das individuell.' },

    // Buchung
    { cat: 'booking', q: 'Kann ich meine Tischreservierung stornieren?', a: 'Tischreservierungen können bis 24 Stunden vor dem Termin kostenfrei storniert werden. Bitte teilen Sie uns eine Absage so früh wie möglich mit — per E-Mail oder Telefon. Bei Nichterscheinen ohne Absage behalten wir uns vor, zukünftige Reservierungen einzuschränken.' },
    { cat: 'booking', q: 'Wie storniere ich eine Zimmerreservierung?', a: 'Die Stornierungsbedingungen für Zimmer hängen von der gewählten Rate ab und werden bei der Buchung klar ausgewiesen. In der Regel sind Stornierungen bis 48 Stunden vor Anreise kostenfrei. Für Direktbuchungen kontaktieren Sie uns per E-Mail.' },
    { cat: 'booking', q: 'Gibt es Vorteile bei Direktbuchung?', a: 'Ja — wer direkt über unsere Website bucht, erhält garantiert den besten verfügbaren Preis, ohne Buchungsgebühren oder Provisionen. Außerdem kommen Sie direkt mit unserem Team in Kontakt, falls Sie besondere Wünsche haben.' },
    { cat: 'booking', q: 'Kann ich eine Anzahlung leisten?', a: 'Für Gruppenreservierungen oder Events kann eine Anzahlung erforderlich sein. Bei regulären Tisch- oder Zimmerreservierungen ist dies in der Regel nicht der Fall.' },

    // Events
    { cat: 'events', q: 'Kann ich die Krone für eine Hochzeit mieten?', a: 'Ja. Wir bieten individuelle Hochzeitspakete inklusive exklusiver Nutzung des Restaurants, Raumkontingenten für Übernachtungsgäste und persönlicher Menügestaltung. Senden Sie uns eine Anfrage über unser Hochzeiten & Events Formular.' },
    { cat: 'events', q: 'Wie viele Personen fasst der Veranstaltungsraum?', a: 'Unser Restaurantbereich bietet Platz für bis zu 120 Gäste. Für Stehempfänge sind auch größere Gruppen möglich. Wir besprechen die ideale Konfiguration gerne in einem persönlichen Gespräch.' },
    { cat: 'events', q: 'Gibt es Menüpakete für Events?', a: 'Ja — für Events und Gruppen erstellen wir individuelle Menüs und Pakete, die auf Ihren Anlass, Ihre Gästezahl und Ihr Budget abgestimmt sind. Kontaktieren Sie uns für ein persönliches Angebot.' },

    // Allgemein
    { cat: 'general', q: 'Gibt es Parkplätze?', a: 'Ja, kostenlose Parkplätze stehen in direkter Nähe zur Krone Langenburg zur Verfügung.' },
    { cat: 'general', q: 'Wie erreiche ich die Krone Langenburg?', a: 'Die Krone befindet sich in der Hauptstraße 24, 74595 Langenburg. Mit dem Auto: über die A6 Richtung Schwäbisch Hall/Crailsheim, dann Richtung Langenburg. Mit dem ÖPNV: Bahnhof Langenburg ist ca. 2 km entfernt.' },
    { cat: 'general', q: 'Ist das Restaurant und Haus barrierefrei?', a: 'Bitte kontaktieren Sie uns direkt, damit wir Ihnen genaue Informationen zur Barrierefreiheit geben können und gegebenenfalls besondere Vorkehrungen treffen.' },
    { cat: 'general', q: 'Sprechen die Mitarbeiter Englisch oder Italienisch?', a: 'Ja — unser Team spricht Deutsch, Englisch und Italienisch. Sie können uns in allen drei Sprachen ansprechen.' },
  ],
  en: [
    { cat: 'restaurant', q: 'How can I reserve a table?', a: 'Easily through our online reservation system at /reserve — quick, direct and without intermediaries. Alternatively by email at info@krone-ammesso.de or by phone at +49 7905 41770. For groups of 10 or more, please contact us directly.' },
    { cat: 'restaurant', q: 'When is the restaurant open?', a: 'Tuesday to Saturday: Lunch 12:00–14:30, Dinner 17:30–22:00. Sunday: 12:00–20:00 (continuous). Monday is our day off. Hours may vary on public holidays — please check in advance.' },
    { cat: 'restaurant', q: 'Are there vegetarian, vegan or gluten-free options?', a: 'Yes, our menu always includes vegetarian options. For vegan requirements or intolerances such as gluten or nuts, please let us know at booking and we will do our best to accommodate.' },
    { cat: 'restaurant', q: 'Can I book for a special celebration?', a: 'Absolutely. For birthdays, anniversaries or special occasions, just mention it in your reservation. We are happy to decorate the table, arrange a cake, or compose a special menu.' },
    { cat: 'restaurant', q: 'Can I view the menu in advance?', a: 'Our current menu is available at /menu at any time. The menu changes seasonally — some dishes may vary based on availability.' },
    { cat: 'restaurant', q: 'Is there an outdoor area?', a: 'In summer we offer a terrace. Ask about availability when making your reservation.' },
    { cat: 'rooms', q: 'How do I book a room?', a: 'Rooms are booked via our secure online booking system (Beds24). Click "Book a Room", select your dates, room category and number of guests. You will receive an instant confirmation.' },
    { cat: 'rooms', q: 'What room categories are available?', a: 'We offer a Deluxe Single Room, Deluxe Double Room, and our generous King Suite. All rooms are stylishly furnished with modern comfort in the historic atmosphere of Krone Langenburg.' },
    { cat: 'rooms', q: 'Is breakfast included?', a: 'Breakfast is optionally available for €14 per person per night. You can add it at booking or inform us by email before arrival.' },
    { cat: 'rooms', q: 'What are the check-in and check-out times?', a: 'Check-in from 3pm. Check-out by 11am. Early check-in or late checkout can be arranged subject to availability — just ask.' },
    { cat: 'rooms', q: 'Is there WiFi?', a: 'Of course — complimentary WiFi is available in all rooms and throughout the property.' },
    { cat: 'booking', q: 'Can I cancel my table reservation?', a: 'Table reservations can be cancelled free of charge up to 24 hours before. Please notify us as early as possible by email or phone. In case of no-show without cancellation, we reserve the right to restrict future bookings.' },
    { cat: 'booking', q: 'How do I cancel a room booking?', a: 'Cancellation conditions depend on the rate selected and are clearly stated at booking. Generally, cancellations are free up to 48 hours before arrival. For direct bookings, contact us by email.' },
    { cat: 'booking', q: 'Are there direct booking benefits?', a: 'Yes — booking directly through our website guarantees the best available price with no booking fees or commissions. You also deal directly with our team for any special requests.' },
    { cat: 'events', q: 'Can I hire the Krone for a wedding?', a: 'Yes. We offer individual wedding packages including exclusive use of the restaurant, room contingents for overnight guests, and personalized menu design. Send us an enquiry via our Weddings & Events form.' },
    { cat: 'events', q: 'How many people does the venue hold?', a: 'Our restaurant area seats up to 120 guests. For standing receptions, larger groups are also possible. We are happy to discuss the ideal setup in a personal conversation.' },
    { cat: 'general', q: 'Is there parking?', a: 'Yes, free parking is available in close proximity to Krone Langenburg.' },
    { cat: 'general', q: 'How do I get to Krone Langenburg?', a: 'We are located at Hauptstraße 24, 74595 Langenburg. By car: via the A6 motorway towards Schwäbisch Hall/Crailsheim, then follow signs to Langenburg.' },
    { cat: 'general', q: 'Do staff speak English or Italian?', a: 'Yes — our team speaks German, English and Italian. Feel free to address us in any of these languages.' },
  ],
  it: [
    { cat: 'restaurant', q: 'Come posso prenotare un tavolo?', a: 'Facilmente tramite il nostro sistema di prenotazione online su /reserve. In alternativa via email a info@krone-ammesso.de o per telefono al +49 7905 41770. Per gruppi di 10 o più persone, contattateci direttamente.' },
    { cat: 'restaurant', q: 'Quando è aperto il ristorante?', a: 'Martedì–Sabato: Pranzo 12:00–14:30, Cena 17:30–22:00. Domenica: 12:00–20:00 (continuato). Lunedì siamo chiusi. Gli orari possono variare nei giorni festivi.' },
    { cat: 'restaurant', q: 'Ci sono opzioni vegetariane, vegane o senza glutine?', a: 'Sì, il nostro menù include sempre opzioni vegetariane. Per esigenze vegane o intolleranze, comunicatecelo alla prenotazione e faremo del nostro meglio per accontentarvi.' },
    { cat: 'rooms', q: 'Come prenoto una camera?', a: 'Le camere si prenotano tramite il nostro sistema sicuro (Beds24). Cliccate su "Prenota una camera", scegliete le date e la categoria. Riceverete una conferma immediata.' },
    { cat: 'rooms', q: 'La colazione è inclusa?', a: 'La colazione è disponibile a €14 a persona per notte. Potete aggiungerla alla prenotazione o comunicarla via email prima dell\'arrivo.' },
    { cat: 'booking', q: 'Posso cancellare la prenotazione del tavolo?', a: 'Le prenotazioni dei tavoli possono essere cancellate gratuitamente fino a 24 ore prima. Comunicateci la cancellazione il prima possibile via email o telefono.' },
    { cat: 'events', q: 'Posso prenotare la Krone per un matrimonio?', a: 'Sì. Offriamo pacchetti matrimonio individuali con uso esclusivo del ristorante, contingenti di camere e menù personalizzato. Inviate una richiesta tramite il modulo Matrimoni & eventi.' },
    { cat: 'general', q: 'C\'è parcheggio?', a: 'Sì, parcheggio gratuito disponibile nelle immediate vicinanze della Krone Langenburg.' },
    { cat: 'general', q: 'Il personale parla italiano?', a: 'Sì — il nostro team parla tedesco, inglese e italiano.' },
  ],
};

const CAT_LABELS = {
  de: { restaurant: 'Restaurant', rooms: 'Zimmer & Suiten', booking: 'Buchung & Storno', events: 'Events & Hochzeiten', general: 'Allgemein' },
  en: { restaurant: 'Restaurant', rooms: 'Rooms & Suites', booking: 'Booking & Cancellation', events: 'Events & Weddings', general: 'General' },
  it: { restaurant: 'Ristorante', rooms: 'Camere & Suite', booking: 'Prenotazioni', events: 'Matrimoni & eventi', general: 'Generale' },
};

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
      open 
        ? 'border-[#C9A96E]/30 bg-white/5 shadow-lg' 
        : 'border-[#C9A96E]/10 bg-white/[0.02] hover:border-[#C9A96E]/20 hover:bg-white/[0.03]'
    }`}>
      <button 
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 group" 
        onClick={() => setOpen(o => !o)}
      >
        <span className={`font-body text-sm leading-relaxed transition-colors ${
          open ? 'text-white font-semibold' : 'text-ivory/80 font-medium group-hover:text-ivory/95'
        }`}>
          {q}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          open 
            ? 'bg-[#C9A96E]/20 rotate-180' 
            : 'bg-[#C9A96E]/10 group-hover:bg-[#C9A96E]/15'
        }`}>
          <ChevronDown className={`w-4 h-4 transition-all duration-300 ${
            open ? 'text-[#C9A96E]' : 'text-[#C9A96E]/60 group-hover:text-[#C9A96E]/80'
          }`} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9A96E]/15 to-transparent mb-4" />
          <p className="text-ivory/60 text-sm font-body leading-relaxed pl-1">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;
  const [activecat, setActiveCat] = useState('all');
  const items = FAQS[lang] || FAQS.de;
  const labels = CAT_LABELS[lang] || CAT_LABELS.de;
  const categories = ['all', ...Object.keys(labels).filter(k => items.some(f => f.cat === k))];
  const filtered = activecat === 'all' ? items : items.filter(f => f.cat === activecat);
  const allLabel = { de: 'Alle Fragen', en: 'All Questions', it: 'Tutte' };

  return (
    <div className="min-h-screen bg-charcoal text-ivory pb-20 lg:pb-0">

      {/* Header */}
      <div className="bg-espresso pt-20 sm:pt-24 pb-10 sm:pb-16 px-5 border-b border-[#C9A96E]/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-body mb-4">Krone Langenburg by Ammesso</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-ivory mb-3 sm:mb-4">
            {lang === 'de' ? 'Häufige Fragen' : lang === 'en' ? 'Frequently Asked Questions' : 'Domande frequenti'}
          </h1>
          <p className="text-ivory/40 font-body text-sm max-w-md mx-auto">
            {lang === 'de' ? 'Alles was Sie wissen möchten — über Restaurant, Zimmer, Buchungen und mehr.' : lang === 'en' ? 'Everything you need to know — about the restaurant, rooms, bookings and more.' : 'Tutto quello che volete sapere — sul ristorante, le camere, le prenotazioni e altro.'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-12">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCat(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-body tracking-wider uppercase border transition-all duration-300 flex items-center gap-2 ${
                activecat === cat 
                  ? 'border-[#C9A96E] bg-[#C9A96E]/15 text-[#C9A96E] shadow-md' 
                  : 'border-[#C9A96E]/15 text-ivory/50 hover:border-[#C9A96E]/30 hover:text-ivory/70 hover:bg-white/[0.02]'
              }`}>
              {cat === 'all' ? (allLabel[lang] || allLabel.de) : labels[cat]}
            </button>
          ))}
        </div>

        {/* FAQ items */}
        <div className="space-y-3 mb-14">
          {filtered.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} />
          ))}
        </div>

        {/* Still have questions */}
        <div className="glass-card border border-[#C9A96E]/12 rounded-3xl p-6 sm:p-8 md:p-10">
          <div className="max-w-md mx-auto text-center">
            <p className="text-2xl mb-3">✦</p>
            <h2 className="font-display text-2xl md:text-3xl font-light text-ivory mb-3">
              {lang === 'de' ? 'Noch eine Frage?' : lang === 'en' ? 'Still have a question?' : 'Hai ancora domande?'}
            </h2>
            <p className="text-ivory/40 text-sm font-body mb-8 leading-relaxed">
              {lang === 'de' ? 'Unser Team hilft Ihnen persönlich weiter — per Telefon, E-Mail oder WhatsApp.' : lang === 'en' ? 'Our team is happy to help personally — by phone, email or WhatsApp.' : 'Il nostro team è felice di aiutarvi personalmente — per telefono, email o WhatsApp.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/contact" className="flex items-center justify-center gap-2 px-6 py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
                {lang === 'de' ? 'Kontakt' : lang === 'en' ? 'Contact Us' : 'Contattaci'} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a href={`tel:${s.phone}`} className="flex items-center justify-center gap-2 px-6 py-3.5 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
                <Phone className="w-3.5 h-3.5" /> {s.phone}
              </a>
              <a href="https://maps.app.goo.gl/iXUqvUm7BRTBvvYy5" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
                📍 {lang === 'de' ? 'Route starten' : lang === 'en' ? 'Get Directions' : 'Navigazione'}
              </a>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link to="/reserve" className="flex items-center justify-center gap-2 py-3 glass-card border border-[#C9A96E]/10 rounded-xl text-xs text-ivory/40 hover:text-gold hover:border-gold/20 transition-all font-body tracking-widest uppercase">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                {lang === 'de' ? 'Tisch buchen' : lang === 'en' ? 'Reserve Table' : 'Prenota'}
              </Link>
              <Link to="/rooms" className="flex items-center justify-center gap-2 py-3 glass-card border border-[#C9A96E]/10 rounded-xl text-xs text-ivory/40 hover:text-gold hover:border-gold/20 transition-all font-body tracking-widest uppercase">
                <BedDouble className="w-3.5 h-3.5" />
                {lang === 'de' ? 'Zimmer buchen' : lang === 'en' ? 'Book Room' : 'Prenota camera'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}