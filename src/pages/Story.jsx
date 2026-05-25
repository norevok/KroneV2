import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { motion } from 'framer-motion';
import { UtensilsCrossed, BedDouble, History, Users, Star, MapPin } from 'lucide-react';

// ── Timeline data — historically accurate, no invented Krone-specific claims ──
const TIMELINE = {
  de: [
    {
      year: '13. Jh.',
      title: 'Langenburg entsteht',
      text: 'Auf einem Bergrücken über dem Jagsttal entsteht im 13. Jahrhundert die erste Burg der Herren von Langenburg. Um die Burg herum wächst die Siedlung, die dem Ort seinen Namen gibt.',
      img: 'https://images.unsplash.com/photo-1564584083593-79f2f3e1e0da?w=800&q=85',
      alt: 'Historische Burg über Jagsttal',
    },
    {
      year: '1610–1616',
      title: 'Schloss und Residenzstadt',
      text: 'Fürst Philipp Ernst zu Hohenlohe-Langenburg lässt das Schloss zur repräsentativen Renaissance-Residenz ausbauen. Langenburg wird Residenzstadt — Gastlichkeit und Handel prägen das Zentrum. Das Gasthaus an der Hauptstraße gilt als Treffpunkt der Region.',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Schloss_Langenburg-msu-2021-0306-.jpg/1280px-Schloss_Langenburg-msu-2021-0306-.jpg',
      alt: 'Schloss Langenburg über dem Jagsttal',
    },
    {
      year: '20. Jh.',
      title: 'Langenburg als Ausflugsziel',
      text: 'Das malerische Langenburg über dem Jagsttal entwickelt sich zum beliebten Ausflugsziel. Die Hohenloher Landschaft, das Schloss und die traditionsreichen Gasthäuser der Hauptstraße ziehen Gäste aus der gesamten Region an.',
      img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=85',
      alt: 'Jagsttal Hohenlohe Landschaft',
    },
    {
      year: 'Heute',
      title: 'Krone Langenburg by Ammesso',
      text: 'Omar Ammesso erweckt die traditionsreiche Krone in der Hauptstraße 24 zu neuem Leben — als Boutique-Hotel mit 10 Zimmern und Suiten sowie dem Kulinarium by Ammesso, das mediterrane Küche mit der Wärme Hohenlohes verbindet. Geschichte trifft auf moderne Gastfreundschaft.',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8e0419119_krone-kingsuite-1-zimmer-uebersicht-01.jpg',
      alt: 'Krone Langenburg by Ammesso — King Suite',
    },
  ],
  en: [
    {
      year: '13th c.',
      title: 'Langenburg is founded',
      text: 'In the 13th century, the first castle of the Lords of Langenburg is built on a ridge above the Jagst Valley. The settlement that grows around the castle gives the town its name.',
      img: 'https://images.unsplash.com/photo-1564584083593-79f2f3e1e0da?w=800&q=85',
      alt: 'Historic castle above Jagst valley',
    },
    {
      year: '1610–1616',
      title: 'Palace and Residence Town',
      text: 'Prince Philipp Ernst of Hohenlohe-Langenburg expands the castle into a Renaissance residence. Langenburg becomes a residence town — hospitality and trade shape its centre. The inn on the Hauptstraße serves as a regional meeting point.',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Schloss_Langenburg-msu-2021-0306-.jpg/1280px-Schloss_Langenburg-msu-2021-0306-.jpg',
      alt: 'Schloss Langenburg above the Jagst valley',
    },
    {
      year: '20th c.',
      title: 'Langenburg as a destination',
      text: 'The picturesque hilltop town of Langenburg develops into a popular destination. The Hohenlohe landscape, the castle and the traditional inns of the Hauptstraße attract guests from across the region.',
      img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=85',
      alt: 'Jagst valley Hohenlohe landscape',
    },
    {
      year: 'Today',
      title: 'Krone Langenburg by Ammesso',
      text: 'Omar Ammesso breathes new life into the historic Krone at Hauptstraße 24 — as a boutique hotel with 10 rooms and suites, and the Kulinarium by Ammesso restaurant combining Mediterranean cuisine with the warmth of Hohenlohe hospitality.',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8e0419119_krone-kingsuite-1-zimmer-uebersicht-01.jpg',
      alt: 'Krone Langenburg by Ammesso — King Suite',
    },
  ],
  it: [
    {
      year: 'XIII sec.',
      title: 'Langenburg viene fondata',
      text: 'Nel XIII secolo viene costruito il primo castello dei Signori di Langenburg su una cresta sopra la Valle del Jagst. Il borgo che cresce intorno al castello dà il nome alla città.',
      img: 'https://images.unsplash.com/photo-1564584083593-79f2f3e1e0da?w=800&q=85',
      alt: 'Castello storico sopra la Valle del Jagst',
    },
    {
      year: '1610–1616',
      title: 'Palazzo e città residenziale',
      text: 'Il Principe Filippo Ernesto di Hohenlohe-Langenburg espande il castello in una residenza rinascimentale. Langenburg diventa città residenziale — l\'ospitalità e il commercio caratterizzano il centro.',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Schloss_Langenburg-msu-2021-0306-.jpg/1280px-Schloss_Langenburg-msu-2021-0306-.jpg',
      alt: 'Schloss Langenburg sulla Valle del Jagst',
    },
    {
      year: 'XX sec.',
      title: 'Langenburg come meta turistica',
      text: 'La pittoresca Langenburg si sviluppa come meta turistica. Il paesaggio di Hohenlohe, il castello e le tradizionali locande della Hauptstraße attirano ospiti da tutta la regione.',
      img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=85',
      alt: 'Valle del Jagst paesaggio Hohenlohe',
    },
    {
      year: 'Oggi',
      title: 'Krone Langenburg by Ammesso',
      text: 'Omar Ammesso ridà vita alla storica Krone in Hauptstraße 24 — come boutique hotel con 10 camere e suite e il Kulinarium by Ammesso, che unisce la cucina mediterranea al calore dell\'ospitalità di Hohenlohe.',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8e0419119_krone-kingsuite-1-zimmer-uebersicht-01.jpg',
      alt: 'Krone Langenburg by Ammesso — King Suite',
    },
  ],
};

const VALUES = {
  de: [
    { icon: History, title: 'Tradition bewahren', desc: 'Respekt vor der Geschichte Langenburgs und Hohenlohes' },
    { icon: UtensilsCrossed, title: 'Mit Herz kochen', desc: 'Mediterrane Küche aus regionalen Zutaten' },
    { icon: Users, title: 'Gastfreundschaft leben', desc: 'Jeder Gast ist willkommen wie Familie' },
    { icon: Star, title: 'Qualität liefern', desc: 'Nur die besten Produkte aus der Region' },
  ],
  en: [
    { icon: History, title: 'Honour Tradition', desc: 'Respect for the history of Langenburg and Hohenlohe' },
    { icon: UtensilsCrossed, title: 'Cook with Heart', desc: 'Mediterranean cuisine from regional ingredients' },
    { icon: Users, title: 'Live Hospitality', desc: 'Every guest is welcome like family' },
    { icon: Star, title: 'Deliver Quality', desc: 'Only the finest regional produce' },
  ],
  it: [
    { icon: History, title: 'Onorare la tradizione', desc: 'Rispetto per la storia di Langenburg e Hohenlohe' },
    { icon: UtensilsCrossed, title: 'Cucinare con cuore', desc: 'Cucina mediterranea con ingredienti regionali' },
    { icon: Users, title: 'Vivere l\'ospitalità', desc: 'Ogni ospite è benvenuto come in famiglia' },
    { icon: Star, title: 'Offrire qualità', desc: 'Solo i migliori prodotti regionali' },
  ],
};

const CTA = {
  de: { title: 'Erleben Sie Geschichte & Gastfreundschaft', sub: 'Reservieren Sie Ihren Tisch oder buchen Sie Ihr Zimmer direkt.', reserve: 'Tisch reservieren', rooms: 'Zimmer buchen' },
  en: { title: 'Experience History & Hospitality', sub: 'Reserve your table or book your room directly.', reserve: 'Reserve a Table', rooms: 'Book a Room' },
  it: { title: 'Vivete storia e ospitalità', sub: 'Prenotate il vostro tavolo o la vostra camera direttamente.', reserve: 'Prenota un tavolo', rooms: 'Prenota una camera' },
};

export default function Story() {
  const { lang } = useLang();
  const timeline = TIMELINE[lang] || TIMELINE.de;
  const values = VALUES[lang] || VALUES.de;
  const cta = CTA[lang] || CTA.de;

  const heroTitles = { de: 'Unsere Geschichte', en: 'Our Story', it: 'La Nostra Storia' };
  const heroSubs = {
    de: 'Von Langenburg über dem Jagsttal zur modernen Krone by Ammesso',
    en: 'From Langenburg above the Jagst valley to the modern Krone by Ammesso',
    it: 'Da Langenburg sopra la Valle del Jagst alla moderna Krone by Ammesso',
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1714] pb-0">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-[#1C1714] pt-[126px] lg:pt-[166px] pb-16 sm:pb-24">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Schloss_Langenburg-msu-2021-0306-.jpg/1280px-Schloss_Langenburg-msu-2021-0306-.jpg"
          alt="Schloss Langenburg über dem Jagsttal"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1714]/60 via-transparent to-[#1C1714]/80" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-5">
          <motion.div className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <MapPin className="w-4 h-4 text-[#C9A96E]" />
            <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body">Langenburg, Hohenlohe</p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-light text-white mb-4">
            {heroTitles[lang] || heroTitles.de}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 font-body text-sm sm:text-base max-w-xl mx-auto">
            {heroSubs[lang] || heroSubs.de}
          </motion.p>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="space-y-0">
          {timeline.map((item, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.05 * i }}
                className="relative"
              >
                {/* Vertical line */}
                {i < timeline.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-px h-12 bg-gradient-to-b from-[#C9A96E]/30 to-transparent hidden sm:block" />
                )}

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 sm:mb-20 ${!isEven ? 'lg:direction-rtl' : ''}`}>
                  {/* Text */}
                  <div className={`${!isEven ? 'lg:order-2' : ''}`}>
                    {/* Year badge */}
                    <div className="inline-flex items-center gap-2 bg-[#8B6914]/10 border border-[#8B6914]/20 rounded-full px-4 py-1.5 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8B6914]" />
                      <span className="text-[#8B6914] text-xs font-body font-bold tracking-[0.2em] uppercase">{item.year}</span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-light text-[#1C1714] mb-4">{item.title}</h2>
                    <p className="font-body text-[#4A3F35] leading-relaxed text-sm sm:text-base">{item.text}</p>
                  </div>

                  {/* Image */}
                  <div className={`${!isEven ? 'lg:order-1' : ''}`}>
                    <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                      <img
                        src={item.img}
                        alt={item.alt}
                        className="w-full h-full object-cover"
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  </div>
                </div>

                {/* Divider between items */}
                {i < timeline.length - 1 && (
                  <div className="flex items-center gap-3 mb-16 sm:mb-20">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/25 to-transparent" />
                    <div className="w-7 h-7 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]/60" />
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/25 to-transparent" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── VALUES ── */}
      <div className="bg-white border-t border-[#EDE6D8] py-14 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body text-center mb-10">
            {lang === 'de' ? 'Unsere Werte' : lang === 'en' ? 'Our Values' : 'I nostri valori'}
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {values.map((v, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center px-2">
                <div className="w-12 h-12 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-light text-[#1C1714] mb-1.5">{v.title}</h3>
                <p className="font-body text-xs sm:text-sm text-[#8A7A6A] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-[#1C1714] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center px-5">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-light text-white mb-4">
            {cta.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 font-body text-sm mb-8">
            {cta.sub}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/reserve"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] rounded-lg text-sm tracking-widest uppercase font-body font-bold transition-all shadow-lg">
              <UtensilsCrossed className="w-4 h-4" /> {cta.reserve}
            </Link>
            <Link to="/rooms"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/25 text-white/70 hover:text-white hover:border-white/50 rounded-lg text-sm tracking-widest uppercase font-body font-semibold transition-all">
              <BedDouble className="w-4 h-4" /> {cta.rooms}
            </Link>
          </motion.div>
        </div>
      </div>

    </div>
  );
}