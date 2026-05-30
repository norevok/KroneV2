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
      subtitle: 'Krone Langenburg by Ammesso – Ein Haus mit Tradition und neuer Seele',
      location: 'Langenburg, Hohenlohe',
    },
    intro: {
      eyebrow: 'Willkommen',
      title: 'Ein Haus mit Tradition und neuer Seele',
      text: [
        'Mitten im Herzen von Langenburg steht Krone Langenburg by Ammesso für das, was ein gutes Haus seit jeher ausmacht: Gastfreundschaft, Ruhe und ein Gefühl von Ankommen.',
        'Über viele Jahre war dieses Haus ein Teil der Geschichte Langenburgs – ein Ort, an dem Menschen einkehrten, übernachteten, feierten und Erinnerungen schufen. Die Mauern von Krone Langenburg by Ammesso erzählen von Begegnungen, von besonderen Momenten und von der warmen Hohenloher Gastlichkeit, die dieses Haus bis heute prägt.',
        'Heute wird diese Geschichte weitergeschrieben.',
        'Mit dem neuen Betreiber Omar Ammesso erhält Krone Langenburg by Ammesso eine neue Handschrift: persönlich, herzlich, emotional und mit viel Liebe zum Detail. Omar Ammesso verbindet den traditionellen Charakter des Hauses mit neuer Energie, mediterraner Leichtigkeit und dem Anspruch, Gästen einen Aufenthalt zu schenken, der nicht nur angenehm ist, sondern in Erinnerung bleibt.',
        'Bei Krone Langenburg by Ammesso steht der Mensch im Mittelpunkt – ob als Hotelgast, Restaurantgast, Hochzeitsgesellschaft, Familie, Reisender oder Besucher aus der Region. Unser Haus soll ein Ort sein, an dem man zur Ruhe kommt, sich willkommen fühlt und die besondere Atmosphäre Langenburgs erleben kann.',
        'Unser Anspruch ist einfach: Gäste sollen spüren, dass sie nicht in einem anonymen Hotel angekommen sind, sondern in einem Haus mit Seele. Krone Langenburg by Ammesso verbindet Tradition, Geschichte, Gastfreundschaft und Geschmack zu einem Ort, an den man gerne zurückkehrt.',
        'Wir bewahren, was dieses Haus besonders macht, und entwickeln es mit Respekt weiter: Schritt für Schritt, mit Leidenschaft, Verantwortung und dem Ziel, die Vergangenheit der Krone mit einer neuen Zukunft zu verbinden.',
      ],
    },
    atmosphere: {
      eyebrow: 'Ein Ort zum Ankommen',
      title: 'Mehr als ein Gebäude',
      text: [
        'Krone Langenburg by Ammesso ist mehr als ein Gebäude. Es ist ein Ort, an dem Ruhe, Herzlichkeit und persönliche Gastfreundschaft zusammenkommen.',
        'Ob nach einer langen Reise, für ein Wochenende in Hohenlohe, für eine Feier oder als Teil eines besonderen Moments – Krone Langenburg by Ammesso soll ein Gefühl vermitteln, das bleibt: ehrlich, warm und persönlich.',
      ],
      highlights: [
        { label: 'Tradition', desc: 'Verbunden mit der Geschichte Langenburgs' },
        { label: 'Ruhe', desc: 'Ein Rückzugsort im Herzen Hohenlohes' },
        { label: 'Gastfreundschaft', desc: 'Persönlich, herzlich und authentisch' },
      ],
    },
    closing: {
      text: 'Willkommen bei Krone Langenburg by Ammesso. Willkommen in einem Haus, das Geschichte nicht nur erzählt, sondern weiterlebt.',
    },
  },
  en: {
    hero: {
      title: 'Our Story',
      subtitle: 'Krone Langenburg by Ammesso – A House with Tradition and a New Soul',
      location: 'Langenburg, Hohenlohe',
    },
    intro: {
      eyebrow: 'Welcome',
      title: 'A House with Tradition and a New Soul',
      text: [
        'In the heart of Langenburg, Krone Langenburg by Ammesso stands for what has always defined a good house: hospitality, tranquillity and a sense of arrival.',
        'For many years this house has been a part of Langenburg\'s history – a place where people came to dine, stay, celebrate and create memories. The walls of Krone Langenburg by Ammesso speak of encounters, of special moments and of the warm Hohenlohe hospitality that defines this house to this day.',
        'Today, this story continues.',
        'Under new owner Omar Ammesso, Krone Langenburg by Ammesso takes on a new signature: personal, warm, emotional and with great attention to detail. Omar Ammesso brings together the traditional character of the house with fresh energy, Mediterranean lightness and the aspiration to give guests a stay that is not just pleasant, but truly memorable.',
        'At Krone Langenburg by Ammesso, people are at the centre – whether as hotel guests, restaurant guests, wedding parties, families, travellers or visitors from the region. Our house is meant to be a place where one finds peace, feels welcome and experiences the special atmosphere of Langenburg.',
        'Our aspiration is simple: guests should sense that they have not arrived at an anonymous hotel, but at a house with soul. Krone Langenburg by Ammesso brings together tradition, history, hospitality and taste into a place one is glad to return to.',
        'We preserve what makes this house special and develop it with respect: step by step, with passion, responsibility and the aim of connecting the Krone\'s past with a new future.',
      ],
    },
    atmosphere: {
      eyebrow: 'A Place to Arrive',
      title: 'More Than a Building',
      text: [
        'Krone Langenburg by Ammesso is more than a building. It is a place where tranquillity, warmth and personal hospitality come together.',
        'Whether after a long journey, for a weekend in Hohenlohe, for a celebration or as part of a special moment – Krone Langenburg by Ammesso should convey a feeling that lasts: honest, warm and personal.',
      ],
      highlights: [
        { label: 'Tradition', desc: 'Connected to the history of Langenburg' },
        { label: 'Tranquillity', desc: 'A retreat in the heart of Hohenlohe' },
        { label: 'Hospitality', desc: 'Personal, warm and authentic' },
      ],
    },
    closing: {
      text: 'Welcome to Krone Langenburg by Ammesso. Welcome to a house that not only tells history, but continues to live it.',
    },
  },
  it: {
    hero: {
      title: 'La Nostra Storia',
      subtitle: 'Krone Langenburg by Ammesso – Una casa con tradizione e nuova anima',
      location: 'Langenburg, Hohenlohe',
    },
    intro: {
      eyebrow: 'Benvenuti',
      title: 'Una casa con tradizione e nuova anima',
      text: [
        'Nel cuore di Langenburg, Krone Langenburg by Ammesso rappresenta ciò che ha sempre definito una buona casa: ospitalità, tranquillità e un senso di arrivo.',
        'Per molti anni questa casa è stata parte della storia di Langenburg – un luogo dove le persone venivano a mangiare, pernottare, festeggiare e creare ricordi. Le mura di Krone Langenburg by Ammesso parlano di incontri, di momenti speciali e della calda ospitalità dell\'Hohenlohe che caratterizza questa casa ancora oggi.',
        'Oggi questa storia continua.',
        'Con il nuovo gestore Omar Ammesso, Krone Langenburg by Ammesso acquisisce una nuova firma: personale, calorosa, emotiva e con grande attenzione ai dettagli. Omar Ammesso unisce il carattere tradizionale della casa con nuova energia, leggerezza mediterranea e l\'ambizione di regalare agli ospiti un soggiorno che non sia solo piacevole, ma indimenticabile.',
        'Presso Krone Langenburg by Ammesso la persona è al centro – che sia come ospite dell\'hotel, del ristorante, come società di nozze, famiglia, viaggiatore o visitatore della regione. La nostra casa vuole essere un luogo dove ritrovare la calma, sentirsi i benvenuti e vivere l\'atmosfera speciale di Langenburg.',
        'La nostra ambizione è semplice: gli ospiti devono sentire di non essere arrivati in un hotel anonimo, ma in una casa con anima. Krone Langenburg by Ammesso unisce tradizione, storia, ospitalità e gusto in un luogo a cui si torna volentieri.',
        'Preserviamo ciò che rende speciale questa casa e la sviluppiamo con rispetto: passo dopo passo, con passione, responsabilità e l\'obiettivo di collegare il passato della Krone a un nuovo futuro.',
      ],
    },
    atmosphere: {
      eyebrow: 'Un luogo per arrivare',
      title: 'Più di un edificio',
      text: [
        'Krone Langenburg by Ammesso è più di un edificio. È un luogo dove tranquillità, calore e ospitalità personale si incontrano.',
        'Che sia dopo un lungo viaggio, per un fine settimana a Hohenlohe, per una celebrazione o come parte di un momento speciale – Krone Langenburg by Ammesso vuole trasmettere un sentimento che rimane: onesto, caloroso e personale.',
      ],
      highlights: [
        { label: 'Tradizione', desc: 'Legata alla storia di Langenburg' },
        { label: 'Tranquillità', desc: 'Un rifugio nel cuore di Hohenlohe' },
        { label: 'Ospitalità', desc: 'Personale, calorosa e autentica' },
      ],
    },
    closing: {
      text: 'Benvenuti a Krone Langenburg by Ammesso. Benvenuti in una casa che non racconta solo la storia, ma continua a viverla.',
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