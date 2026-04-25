import { useLang } from '@/lib/useLang';
import { SITE_DEFAULTS } from '@/lib/siteData';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function AGB() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-20 sm:pt-24 pb-24 lg:pb-10 px-4 sm:px-5">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-5 h-5 text-gold/60" />
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body">Krone Langenburg by Ammesso</p>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-light text-ivory mb-3 leading-tight">
          {lang === 'en' ? 'General Terms & Conditions' : 'Allgemeine Geschäftsbedingungen'}
        </h1>
        <p className="text-ivory/40 text-sm font-body mb-10">Stand: Januar 2025</p>

        <div className="prose prose-sm max-w-none space-y-8 font-body text-ivory/65 leading-relaxed">

          <section>
            <h2 className="font-display text-2xl font-light text-ivory mb-4">§ 1 Geltungsbereich</h2>
            <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen der</p>
            <div className="glass-card border border-[#C9A96E]/10 rounded-xl p-4 my-4 text-sm">
              <p className="font-semibold text-ivory/80">Krone Langenburg by Ammesso</p>
              <p>Inhaber: Omar Ouardaoui (Ammesso)</p>
              <p>{s.address_street}</p>
              <p>{s.address_zip} {s.address_city}</p>
              <p>{s.address_country}</p>
              <p className="mt-2">Telefon: {s.phone}</p>
              <p>E-Mail: {s.email_info}</p>
            </div>
            <p>und deren Gästen bezüglich der Übernachtung sowie der Nutzung des Restaurants und weiterer Leistungen. Abweichende Bedingungen des Gastes gelten nur, wenn wir ihnen ausdrücklich schriftlich zugestimmt haben.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-ivory mb-4">§ 2 Vertragsschluss</h2>
            <p>Der Vertrag kommt durch die Annahme des Antrages des Gastes durch das Hotel zustande. Dem Hotel steht es frei, die Zimmerbuchung in Textform zu bestätigen. Die Buchung über externe Systeme (z. B. Beds24, booking.com) unterliegt zusätzlich den jeweiligen Nutzungsbedingungen dieser Plattformen.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-ivory mb-4">§ 3 Leistungen, Preise und Zahlung</h2>
            <p>Das Hotel ist verpflichtet, die vom Gast gebuchten Zimmer bereitzuhalten und die vereinbarten Leistungen zu erbringen.</p>
            <p className="mt-3">Die vereinbarten Preise schließen die jeweils gültige gesetzliche Mehrwertsteuer ein. Inklusivleistungen sind in der Buchungsbestätigung ausgewiesen. Nicht inkludierte Zusatzleistungen (z. B. Frühstück, Parkplatz, Extras) werden bei der Abreise in Rechnung gestellt.</p>
            <p className="mt-3">Zahlung ist fällig bei Anreise, sofern nicht anders vereinbart. Wir akzeptieren Barzahlung, EC-Karte und gängige Kreditkarten.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-ivory mb-4">§ 4 Stornierung & Rücktritt</h2>
            <h3 className="font-semibold text-ivory/80 mb-2">Hotelbuchungen:</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Kostenlose Stornierung bis <strong className="text-ivory/80">72 Stunden vor Anreise</strong>.</li>
              <li>Bei Stornierung bis 24 Stunden vor Anreise: 50 % des vereinbarten Übernachtungspreises.</li>
              <li>Bei Stornierung weniger als 24 Stunden vor Anreise oder Nichterscheinen (No-Show): 100 % des Zimmerpreises der ersten Nacht.</li>
              <li>Bei Buchungen über externe Plattformen gelten die dortigen Stornobedingungen.</li>
            </ul>
            <h3 className="font-semibold text-ivory/80 mb-2 mt-4">Tischreservierungen Restaurant:</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Kostenlose Stornierung bis <strong className="text-ivory/80">24 Stunden vor dem Termin</strong>.</li>
              <li>Bei Nichterscheinen ohne Absage behalten wir uns vor, künftige Reservierungen einzuschränken.</li>
              <li>Bei Gruppen ab 10 Personen gelten abweichende Stornierungsfristen (individuell vereinbart).</li>
            </ul>
            <h3 className="font-semibold text-ivory/80 mb-2 mt-4">Events & Hochzeiten:</h3>
            <p>Für Veranstaltungen, Hochzeiten und Gruppenevents gelten individuelle Stornierungsbedingungen, die im Veranstaltungsvertrag festgelegt werden.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-ivory mb-4">§ 5 An- und Abreise</h2>
            <p>Das gebuchte Zimmer steht dem Gast am Anreisetag ab <strong className="text-ivory/80">15:00 Uhr</strong> zur Verfügung, sofern nichts anderes vereinbart wurde. Am Abreisetag ist das Zimmer bis <strong className="text-ivory/80">11:00 Uhr</strong> zu räumen. Ein späteres Auschecken ist nach vorheriger Absprache und gegen Aufpreis möglich.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-ivory mb-4">§ 6 Haustiere</h2>
            <p>Haustiere sind nach vorheriger Absprache und gegen einen Aufpreis von <strong className="text-ivory/80">€ 15,– pro Nacht</strong> gestattet. Bitte informieren Sie uns bei der Buchung. Der Gast haftet für alle durch Haustiere verursachten Schäden.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-ivory mb-4">§ 7 Haftung des Hotels</h2>
            <p>Das Hotel haftet für Schäden, die auf vorsätzlichem oder grob fahrlässigem Verhalten beruhen. Im Übrigen ist die Haftung auf vorhersehbare, vertragstypische Schäden beschränkt. Für Wertsachen wird ausdrücklich empfohlen, den hoteleigenen Safe zu nutzen. Für Schäden durch höhere Gewalt oder unvorhersehbare technische Ausfälle wird keine Haftung übernommen.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-ivory mb-4">§ 8 Pflichten des Gastes</h2>
            <p>Der Gast ist verpflichtet, das Hotelzimmer sowie alle genutzten Einrichtungen und Gegenstände pfleglich zu behandeln. Schäden am Zimmer, an der Einrichtung oder am Gebäude sind dem Personal umgehend zu melden. Der Gast haftet für schuldhaft verursachte Schäden und Verunreinigungen.</p>
            <p className="mt-3">Rauchen ist in allen Innenräumen des Hotels und Restaurants verboten. Bei Verstoß wird eine Reinigungspauschale von <strong className="text-ivory/80">€ 150,–</strong> in Rechnung gestellt.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-ivory mb-4">§ 9 Datenschutz</h2>
            <p>Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß unserer <Link to="/privacy" className="text-gold/60 hover:text-gold transition-colors">Datenschutzerklärung</Link> und den geltenden Bestimmungen der DSGVO. Buchungsdaten werden ausschließlich zur Abwicklung des Aufenthalts verarbeitet.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-ivory mb-4">§ 10 Anwendbares Recht & Gerichtsstand</h2>
            <p>Es gilt das Recht der Bundesrepublik Deutschland. Erfüllungsort und Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des Hotels in Langenburg, Baden-Württemberg.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-ivory mb-4">§ 11 Salvatorische Klausel</h2>
            <p>Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, so berührt dies die Wirksamkeit der übrigen Bestimmungen nicht. Die unwirksame Bestimmung ist durch eine wirksame zu ersetzen, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.</p>
          </section>

          <div className="mt-10 pt-8 border-t border-[#C9A96E]/10">
            <p className="text-ivory/30 text-sm">
              Letzte Aktualisierung: Januar 2025 · {s.hotel_name} · {s.address_street}, {s.address_zip} {s.address_city}
            </p>
            <div className="flex gap-4 mt-3">
              <Link to="/legal" className="text-gold/50 hover:text-gold text-xs font-body tracking-wider transition-colors">Impressum</Link>
              <Link to="/privacy" className="text-gold/50 hover:text-gold text-xs font-body tracking-wider transition-colors">Datenschutz</Link>
              <Link to="/contact" className="text-gold/50 hover:text-gold text-xs font-body tracking-wider transition-colors">Kontakt</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}