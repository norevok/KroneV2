import { useLang } from '@/lib/useLang';
import { motion } from 'framer-motion';

// ── HERO IMAGE — Hochwertiges Krone Langenburg Bild ──
const HERO_IMAGE = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8b814211e_Krone_vorne.png';

// ── TEXT CONTENT ──
const CONTENT = {
  de: {
    title: 'Unsere Geschichte',
    subtitle: 'Die Krone Langenburg – ein Haus mit Seele',
    body: [
      'Mitten im Herzen von Langenburg steht die Krone für das, was ein gutes Haus seit jeher ausmacht: Gastfreundschaft, Ruhe und ein Gefühl von Ankommen.',
      'Hier treffen Geschichte, Hohenloher Charakter und eine warme, persönliche Atmosphäre aufeinander. Die Krone ist kein anonymes Hotel, sondern ein Ort mit eigener Identität – geprägt von den Menschen, die hier einkehren, übernachten, feiern und Erinnerungen schaffen.',
      'Unser Anspruch ist einfach: Gäste sollen sich willkommen fühlen. Ob für eine Nacht, ein Wochenende, eine Feier oder einen besonderen Anlass – die Krone verbindet den Charme eines traditionellen Hauses mit dem Wunsch, jeden Aufenthalt ehrlich, angenehm und persönlich zu gestalten.',
      'Wir bewahren, was dieses Haus besonders macht, und entwickeln es mit Respekt weiter: Schritt für Schritt, mit Liebe zum Detail und mit dem Ziel, einen Ort zu schaffen, an den man gerne zurückkehrt.',
    ],
    closing: 'Willkommen in der Krone Langenburg. Willkommen an einem Ort, der Geschichte nicht nur erzählt, sondern weiterlebt.',
  },
  en: {
    title: 'Our Story',
    subtitle: 'The Krone Langenburg – A House with Soul',
    body: [
      'In the heart of Langenburg, the Krone stands for what has always defined a good house: hospitality, tranquillity and a sense of arrival.',
      'Here, history, Hohenlohe character and a warm, personal atmosphere come together. The Krone is not an anonymous hotel, but a place with its own identity – shaped by the people who dine here, stay overnight, celebrate and create memories.',
      'Our mission is simple: guests should feel welcome. Whether for a night, a weekend, a celebration or a special occasion – the Krone combines the charm of a traditional house with the desire to make every stay honest, pleasant and personal.',
      'We preserve what makes this house special and develop it with respect: step by step, with love for detail and with the aim of creating a place where people like to return.',
    ],
    closing: 'Welcome to the Krone Langenburg. Welcome to a place that not only tells history, but continues to live it.',
  },
  it: {
    title: 'La Nostra Storia',
    subtitle: 'Krone Langenburg – Una casa con anima',
    body: [
      'Nel cuore di Langenburg, la Krone rappresenta ciò che ha sempre definito una buona casa: ospitalità, tranquillità e un senso di arrivo.',
      'Qui, storia, carattere di Hohenlohe e un\'atmosfera calda e personale si incontrano. La Krone non è un hotel anonimo, ma un luogo con una propria identità – plasmato dalle persone che qui cenano, pernottano, festeggiano e creano ricordi.',
      'La nostra missione è semplice: gli ospiti devono sentirsi i benvenuti. Che sia per una notte, un fine settimana, una celebrazione o un\'occasione speciale – la Krone combina il fascino di una casa tradizionale con il desiderio di rendere ogni soggiorno onesto, piacevole e personale.',
      'Conserviamo ciò che rende speciale questa casa e la sviluppiamo con rispetto: passo dopo passo, con amore per il dettaglio e con l\'obiettivo di creare un luogo dove le persone amano tornare.',
    ],
    closing: 'Benvenuti alla Krone Langenburg. Benvenuti in un luogo che non racconta solo la storia, ma continua a viverla.',
  },
};

export default function Story() {
  const { lang } = useLang();
  const content = CONTENT[lang] || CONTENT.de;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1714]">

      {/* ── HERO SECTION ── */}
      <div className="relative overflow-hidden" style={{ height: 'clamp(500px, 65vh, 750px)' }}>
        <img
          src={HERO_IMAGE}
          alt="Krone Langenburg – stilvolles Haus mit Geschichte"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 45%' }}
          loading="eager"
        />
        {/* Subtle gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/60" />
        
        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 sm:pb-24 px-5" style={{ paddingTop: 'var(--nav-h-mobile)' }}>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>
              <h1 className="font-display font-light text-white mb-4"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.05', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
                {content.title}
              </h1>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent mx-auto mb-4" />
              <p className="text-white/85 font-body text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
                style={{ textShadow: '0 1px 12px rgba(0,0,0,0.7)' }}>
                {content.subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}>
          
          {/* Text content */}
          <div className="space-y-8 sm:space-y-10">
            {content.body.map((paragraph, i) => (
              <p key={i} className="font-body text-[#4A3F35] text-base sm:text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Closing line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 pt-12 border-t border-[#EDE6D8]">
            <p className="font-display text-lg sm:text-xl font-light text-[#8B6914] leading-relaxed italic">
              {content.closing}
            </p>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}