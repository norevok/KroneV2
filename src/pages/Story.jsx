import { useLang } from '@/lib/useLang';
import { motion } from 'framer-motion';
import { MapPin, Heart } from 'lucide-react';

// ── APPROVED IMAGES ──
const HERO_IMAGE = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8b814211e_Krone_vorne.png';
const INTERIOR_IMAGE = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/a8e3a47b0_krone-kingsuite-1-zimmer-wohnbereich-02.jpg';

// ── TEXT CONTENT ──
const CONTENT = {
  de: {
    hero: {
      title: 'Unsere Geschichte',
      subtitle: 'Die Krone Langenburg – ein Haus mit Seele',
      location: 'Langenburg, Hohenlohe',
    },
    intro: {
      eyebrow: 'Willkommen',
      title: 'Ein Haus mit Tradition',
      text: [
        'Mitten im Herzen von Langenburg steht die Krone für das, was ein gutes Haus seit jeher ausmacht: Gastfreundschaft, Ruhe und ein Gefühl von Ankommen.',
        'Hier treffen Geschichte, Hohenloher Charakter und eine warme, persönliche Atmosphäre aufeinander. Die Krone ist kein anonymes Hotel, sondern ein Ort mit eigener Identität – geprägt von den Menschen, die hier einkehren, übernachten, feiern und Erinnerungen schaffen.',
        'Unser Anspruch ist einfach: Gäste sollen sich willkommen fühlen. Ob für eine Nacht, ein Wochenende, eine Feier oder einen besonderen Anlass – die Krone verbindet den Charme eines traditionellen Hauses mit dem Wunsch, jeden Aufenthalt ehrlich, angenehm und persönlich zu gestalten.',
        'Wir bewahren, was dieses Haus besonders macht, und entwickeln es mit Respekt weiter: Schritt für Schritt, mit Liebe zum Detail und mit dem Ziel, einen Ort zu schaffen, an den man gerne zurückkehrt.',
      ],
    },
    atmosphere: {
      eyebrow: 'Ein Ort zum Ankommen',
      title: 'Mehr als ein Gebäude',
      text: [
        'Die Krone ist mehr als ein Gebäude. Sie ist ein Ort, an dem Gäste zur Ruhe kommen, sich willkommen fühlen und die besondere Atmosphäre Langenburgs erleben können.',
        'Ob nach einer langen Reise, für ein Wochenende in Hohenlohe oder als Teil eines besonderen Moments – unser Haus soll ein Gefühl vermitteln, das bleibt: ehrlich, herzlich und persönlich.',
      ],
      highlights: [
        { label: 'Tradition', desc: 'Verbunden mit der Geschichte Langenburgs' },
        { label: 'Ruhe', desc: 'Ein Rückzugsort im Herzen Hohenlohes' },
        { label: 'Gastfreundschaft', desc: 'Persönlich, herzlich, authentisch' },
      ],
    },
    closing: {
      text: 'Willkommen in der Krone Langenburg. Willkommen an einem Ort, der Geschichte nicht nur erzählt, sondern weiterlebt.',
    },
  },
  en: {
    hero: {
      title: 'Our Story',
      subtitle: 'The Krone Langenburg – A House with Soul',
      location: 'Langenburg, Hohenlohe',
    },
    intro: {
      eyebrow: 'Welcome',
      title: 'A House with Tradition',
      text: [
        'In the heart of Langenburg, the Krone stands for what has always defined a good house: hospitality, tranquillity and a sense of arrival.',
        'Here, history, Hohenlohe character and a warm, personal atmosphere come together. The Krone is not an anonymous hotel, but a place with its own identity – shaped by the people who dine here, stay overnight, celebrate and create memories.',
        'Our mission is simple: guests should feel welcome. Whether for a night, a weekend, a celebration or a special occasion – the Krone combines the charm of a traditional house with the desire to make every stay honest, pleasant and personal.',
        'We preserve what makes this house special and develop it with respect: step by step, with love for detail and with the aim of creating a place where people like to return.',
      ],
    },
    atmosphere: {
      eyebrow: 'A Place to Arrive',
      title: 'More Than a Building',
      text: [
        'The Krone is more than a building. It is a place where guests find peace, feel welcome and experience the special atmosphere of Langenburg.',
        'Whether after a long journey, for a weekend in Hohenlohe or as part of a special moment – our house should convey a feeling that remains: honest, warm and personal.',
      ],
      highlights: [
        { label: 'Tradition', desc: 'Connected to the history of Langenburg' },
        { label: 'Tranquillity', desc: 'A retreat in the heart of Hohenlohe' },
        { label: 'Hospitality', desc: 'Personal, warm, authentic' },
      ],
    },
    closing: {
      text: 'Welcome to the Krone Langenburg. Welcome to a place that not only tells history, but continues to live it.',
    },
  },
  it: {
    hero: {
      title: 'La Nostra Storia',
      subtitle: 'Krone Langenburg – Una casa con anima',
      location: 'Langenburg, Hohenlohe',
    },
    intro: {
      eyebrow: 'Benvenuti',
      title: 'Una casa con tradizione',
      text: [
        'Nel cuore di Langenburg, la Krone rappresenta ciò che ha sempre definito una buona casa: ospitalità, tranquillità e un senso di arrivo.',
        'Qui, storia, carattere di Hohenlohe e un\'atmosfera calda e personale si incontrano. La Krone non è un hotel anonimo, ma un luogo con una propria identità – plasmato dalle persone che qui cenano, pernottano, festeggiano e creano ricordi.',
        'La nostra missione è semplice: gli ospiti devono sentirsi i benvenuti. Che sia per una notte, un fine settimana, una celebrazione o un\'occasione speciale – la Krone combina il fascino di una casa tradizionale con il desiderio di rendere ogni soggiorno onesto, piacevole e personale.',
        'Conserviamo ciò che rende speciale questa casa e la sviluppiamo con rispetto: passo dopo passo, con amore per il dettaglio e con l\'obiettivo di creare un luogo dove le persone amano tornare.',
      ],
    },
    atmosphere: {
      eyebrow: 'Un luogo per arrivare',
      title: 'Più di un edificio',
      text: [
        'La Krone è più di un edificio. È un luogo dove gli ospiti trovano pace, si sentono i benvenuti e sperimentano l\'atmosfera speciale di Langenburg.',
        'Che sia dopo un lungo viaggio, per un fine settimana a Hohenlohe o come parte di un momento speciale – la nostra casa dovrebbe trasmettere un sentimento che rimane: onesto, caloroso e personale.',
      ],
      highlights: [
        { label: 'Tradizione', desc: 'Collegato alla storia di Langenburg' },
        { label: 'Tranquillità', desc: 'Un rifugio nel cuore di Hohenlohe' },
        { label: 'Ospitalità', desc: 'Personale, caloroso, autentico' },
      ],
    },
    closing: {
      text: 'Benvenuti alla Krone Langenburg. Benvenuti in un luogo che non racconta solo la storia, ma continua a viverla.',
    },
  },
};

export default function Story() {
  const { lang } = useLang();
  const c = CONTENT[lang] || CONTENT.de;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1714]">

      {/* ── HERO SECTION ── */}
      <div className="relative overflow-hidden" style={{ height: 'clamp(500px, 65vh, 750px)' }}>
        <img
          src={HERO_IMAGE}
          alt="Krone Langenburg – historic hotel with welcoming atmosphere"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 45%' }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/60" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 sm:pb-24 px-5" style={{ paddingTop: 'var(--nav-h-mobile)' }}>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>
              
              <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-[#C9A96E]/40 rounded-full px-5 py-2 mb-5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body font-semibold">
                  {c.hero.location}
                </span>
              </div>
              
              <h1 className="font-display font-light text-white mb-4"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.05', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
                {c.hero.title}
              </h1>
              
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent mx-auto mb-4" />
              
              <p className="text-white/85 font-body text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
                style={{ textShadow: '0 1px 12px rgba(0,0,0,0.7)' }}>
                {c.hero.subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── INTRO SECTION ── */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}>
          
          <div className="text-center mb-12">
            <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body mb-3">{c.intro.eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714]">{c.intro.title}</h2>
          </div>
          
          <div className="space-y-8 sm:space-y-10">
            {c.intro.text.map((paragraph, i) => (
              <p key={i} className="font-body text-[#4A3F35] text-base sm:text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── INTERIOR IMAGE ── */}
      <div className="relative h-80 sm:h-[500px] overflow-hidden">
        <img
          src={INTERIOR_IMAGE}
          alt="Interior atmosphere of Krone Langenburg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 50%' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-transparent to-black/30" />
      </div>

      {/* ── ATMOSPHERE SECTION ── */}
      <div className="bg-[#FAF7F2] py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}>
            
            <div className="text-center mb-12">
              <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body mb-3">{c.atmosphere.eyebrow}</p>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714]">{c.atmosphere.title}</h2>
            </div>
            
            <div className="space-y-8 sm:space-y-10 mb-12">
              {c.atmosphere.text.map((paragraph, i) => (
                <p key={i} className="font-body text-[#4A3F35] text-base sm:text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {c.atmosphere.highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="text-center p-6 bg-white border border-[#EDE6D8] rounded-2xl shadow-sm">
                  <h3 className="font-display text-lg font-light text-[#8B6914] mb-2">{item.label}</h3>
                  <p className="font-body text-sm text-[#4A3F35]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── CLOSING SECTION ── */}
      <div className="bg-white border-t border-[#EDE6D8] py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}>
            
            <div className="w-10 h-10 rounded-full bg-[#8B6914]/10 border border-[#8B6914]/20 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-4 h-4 text-[#8B6914]" />
            </div>
            
            <p className="font-display text-lg sm:text-xl font-light text-[#8B6914] leading-relaxed italic">
              {c.closing.text}
            </p>
          </motion.div>
        </div>
      </div>

    </div>
  );
}