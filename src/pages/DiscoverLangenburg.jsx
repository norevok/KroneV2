import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/useLang';
import { ArrowRight, MapPin, Compass, Mountain, Castle, ChevronDown, Car } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';
import KroneLocationSection from '@/components/KroneLocationSection';

// Correct real photos for each attraction
const IMG_CASTLE = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/dcd1ee530_IMG_8599.png';
const IMG_JAGSTTAL = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/257e19347_IMG_8593.png';
const IMG_MUSEUM = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/148e52538_IMG_8597.jpeg';
const IMG_ALTSTADT = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/24196381a_IMG_8595.jpeg';

const ATTRACTIONS = [
  {
    id: 'schloss',
    icon: Castle,
    image: IMG_CASTLE,
    de: { title: 'Schloss Langenburg', desc: 'Das fürstliche Schloss Langenburg thront majestätisch über dem Jagsttal und zählt zu den beeindruckendsten Barockschlössern Baden-Württembergs. Geführte Touren, Ausstellungen und eine atemberaubende Aussicht über das Hohenloher Land erwarten Sie.', tag: '5 min zu Fuß' },
    en: { title: 'Langenburg Castle', desc: 'The princely Langenburg Castle majestically overlooks the Jagst valley and is one of the most impressive Baroque castles in Baden-Württemberg. Guided tours, exhibitions and breathtaking views over the Hohenlohe countryside await you.', tag: '5 min walk' },
  },
  {
    id: 'jagsttal',
    icon: Mountain,
    image: IMG_JAGSTTAL,
    de: { title: 'Jagsttal & Wanderungen', desc: 'Das Jagsttal gehört zu den schönsten Flusstälern Süddeutschlands. Malerische Wanderwege führen durch Wiesen, Wälder und historische Dörfer. Der Jagsttalweg verbindet auf über 200 km Kilometer Natur und Kultur.', tag: 'Wanderparadies' },
    en: { title: 'Jagst Valley & Hiking', desc: 'The Jagst valley is one of the most beautiful river valleys in southern Germany. Scenic hiking trails lead through meadows, forests and historic villages. The Jagst Valley Trail connects over 200 km of nature and culture.', tag: 'Hiking paradise' },
  },
  {
    id: 'automuseum',
    icon: Car,
    image: IMG_MUSEUM,
    de: { title: 'Deutsches Automuseum Schloss Langenburg', desc: 'Das Deutsche Automuseum im Schloss Langenburg zählt zu den faszinierendsten Automobilausstellungen Deutschlands. Über 80 historische Fahrzeuge — von frühen Sportwagen bis zu legendären Rennwagen — erzählen die Geschichte des Automobils in einzigartiger Schlosskulisse.', tag: '5 min zu Fuß' },
    en: { title: 'German Automotive Museum Langenburg', desc: 'The German Automotive Museum at Langenburg Castle is one of Germany\'s most fascinating car exhibitions. Over 80 historic vehicles — from early sports cars to legendary racing cars — tell the story of the automobile in a unique castle setting.', tag: '5 min walk' },
  },
  {
    id: 'altstadt',
    icon: Compass,
    image: IMG_ALTSTADT,
    de: { title: 'Langenburger Altstadt', desc: 'Langenburg ist idealer Ausgangspunkt für Tagesausflüge nach Schwäbisch Hall, Bad Mergentheim oder Rothenburg ob der Tauber. Die malerische Altstadt selbst lädt mit Fachwerkhäusern und gepflasterten Gassen zum Spazieren ein.', tag: 'Tagesausflüge' },
    en: { title: 'Langenburg Old Town', desc: 'Langenburg is the ideal base for day trips to Schwäbisch Hall, Bad Mergentheim or Rothenburg ob der Tauber. The picturesque old town itself invites you to stroll among half-timbered houses and cobbled alleys.', tag: 'Day trips' },
  },
];

const NEARBY = [
  { de: 'Schwäbisch Hall', en: 'Schwäbisch Hall', km: '25 km', time: '30 min' },
  { de: 'Rothenburg ob der Tauber', en: 'Rothenburg ob der Tauber', km: '58 km', time: '50 min' },
  { de: 'Bad Mergentheim', en: 'Bad Mergentheim', km: '38 km', time: '40 min' },
  { de: 'Nürnberg', en: 'Nuremberg', km: '110 km', time: '1h 15min' },
  { de: 'Stuttgart', en: 'Stuttgart', km: '100 km', time: '1h 10min' },
  { de: 'Frankfurt', en: 'Frankfurt', km: '155 km', time: '1h 45min' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] } }),
};

const slideIn = (dir = 1) => ({
  hidden: { opacity: 0, x: dir * 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
});

export default function DiscoverLangenburg() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;
  const [activeCard, setActiveCard] = useState(null);

  const T = {
    de: {
      eyebrow: 'Langenburg & Hohenlohe',
      title: 'Entdecken Sie eine der schönsten Ecken Deutschlands.',
      sub: 'Langenburg liegt im Herzen Hohenlohes — umgeben von Wäldern, Weinbergen, historischen Schlössern und einer der malerischsten Flusslandschaften Süddeutschlands.',
      scroll_hint: 'Entdecken',
      how_label: 'Anfahrt & Lage',
      address_note: 'Wir befinden uns direkt im Ortskern von Langenburg.',
      nearby_title: 'Entfernungen',
      cta_rooms: 'Zimmer buchen',
      cta_contact: 'Kontakt',
      directions_label: 'Route planen',
    },
    en: {
      eyebrow: 'Langenburg & Hohenlohe',
      title: 'Discover one of the most beautiful corners of Germany.',
      sub: 'Langenburg is located in the heart of Hohenlohe — surrounded by forests, vineyards, historic castles and one of the most picturesque river landscapes in southern Germany.',
      scroll_hint: 'Discover',
      how_label: 'Getting Here',
      address_note: 'We are located right in the centre of Langenburg.',
      nearby_title: 'Distances',
      cta_rooms: 'Book a Room',
      cta_contact: 'Contact',
      directions_label: 'Get Directions',
    },
  };
  const t = T[lang] || T.de;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1714] pb-24 lg:pb-10 overflow-hidden">

      {/* ── HERO ── */}
      <div className="relative hero-top overflow-hidden" style={{ minHeight: 'clamp(580px, 85vh, 860px)' }}>
        <img
          src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/dcd1ee530_IMG_8599.png"
          alt="Schloss Langenburg Luftaufnahme Hohenlohe"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 40%' }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#FAF7F2]" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Gold accent lines */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent opacity-60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 pb-16">
          <motion.p
            className="text-[#C9A96E] text-[10px] tracking-[0.6em] uppercase font-body mb-5"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
            {t.eyebrow}
          </motion.p>
          <motion.h1
            className="font-display font-light text-white mb-6 max-w-4xl"
            style={{ fontSize: 'clamp(2.25rem, 4.2vw, 4rem)', lineHeight: '1.05', textShadow: '0 2px 24px rgba(0,0,0,0.9)' }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            {t.title}
          </motion.h1>
          <motion.p
            className="text-white/90 font-body text-sm sm:text-lg leading-relaxed max-w-2xl"
            style={{ textShadow: '0 1px 12px rgba(0,0,0,0.8)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>
            {t.sub}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col items-center gap-2 cursor-pointer"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            onClick={() => document.getElementById('attractions')?.scrollIntoView({ behavior: 'smooth' })}>
            <span className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-body">{t.scroll_hint}</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
              <ChevronDown className="w-5 h-5 text-[#C9A96E]" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── ATTRACTIONS ── */}
      <div id="attractions" className="max-w-6xl mx-auto px-4 sm:px-5 py-16 sm:py-20">
        <div className="space-y-10 sm:space-y-14">
          {ATTRACTIONS.map((att, idx) => {
            const content = att[lang] || att.de;
            const isReversed = idx % 2 === 1;
            const isActive = activeCard === att.id;
            return (
              <motion.div
                key={att.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                custom={0}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActiveCard(isActive ? null : att.id)}
                className={`bg-white border rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ${
                  isActive
                    ? 'border-[#C9A96E]/50 shadow-[0_20px_60px_rgba(139,105,20,0.15)]'
                    : 'border-[#EDE6D8] shadow-[0_4px_24px_rgba(28,23,20,0.06)] hover:shadow-[0_12px_40px_rgba(28,23,20,0.10)] hover:border-[#C9A96E]/30'
                }`}>
                <div className={`grid grid-cols-1 md:grid-cols-2 ${isReversed ? 'md:grid-flow-dense' : ''}`}>
                  {/* Image */}
                  <motion.div
                    className={`relative h-64 sm:h-80 md:h-auto md:min-h-[320px] overflow-hidden ${isReversed ? 'md:col-start-2' : ''}`}>
                    <motion.img
                     src={att.image}
                     alt={`${content.title} — Krone Langenburg Hotel Hohenlohe`}
                     className="w-full h-full object-cover"
                     style={{
                       objectPosition: att.id === 'jagsttal' ? '50% 60%' : att.id === 'altstadt' ? '50% 55%' : att.id === 'schloss' ? '50% 40%' : '50% 50%'
                     }}
                     whileHover={{ scale: 1.06 }}
                     transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                     loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <motion.span
                      className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm border border-[#C9A96E]/30 rounded-full px-4 py-1.5 text-[10px] font-body text-[#8B6914] tracking-wider uppercase shadow-md"
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}>
                      {content.tag}
                    </motion.span>
                    {/* Number overlay */}
                    <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <span className="font-display text-sm font-light text-white/80">{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                  </motion.div>

                  {/* Text */}
                  <motion.div
                    className={`p-7 sm:p-10 flex flex-col justify-center ${isReversed ? 'md:col-start-1' : ''}`}
                    variants={slideIn(isReversed ? -1 : 1)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}>
                    <div className="w-10 h-10 rounded-full bg-[#F2E8D0] border border-[#C9A96E]/30 flex items-center justify-center mb-5">
                      <att.icon className="w-4.5 h-4.5 text-[#8B6914]" />
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-light text-[#1C1714] mb-3 leading-tight">{content.title}</h2>
                    <p className="text-[#4A3F35] text-sm font-body leading-relaxed">{content.desc}</p>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="mt-5 pt-5 border-t border-[#EDE6D8]">
                          <Link
                            to={att.id === 'schloss' ? 'https://schloss-langenburg.de' : att.id === 'ausflug' ? '/discover' : '/contact'}
                            target={att.id === 'schloss' ? '_blank' : undefined}
                            className="inline-flex items-center gap-2 text-[#8B6914] text-xs font-body font-semibold tracking-widest uppercase hover:gap-3 transition-all">
                            {lang === 'de' ? 'Mehr erfahren' : 'Learn more'} <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── GETTING HERE ── */}
        <motion.div
          className="mt-20 sm:mt-24"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#8B6914]" />
                <h2 className="font-display text-2xl font-light text-[#1C1714]">{t.how_label}</h2>
              </div>
              <p className="text-[#4A3F35]/60 text-sm font-body mb-5">{t.address_note}</p>
              <KroneLocationSection compact />
            </div>

            {/* Distances */}
            <div>
              <h3 className="font-display text-2xl font-light text-[#1C1714] mb-6">{t.nearby_title}</h3>
              <div className="space-y-2">
                {NEARBY.map((n, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp} initial="hidden" whileInView="visible"
                    viewport={{ once: true }} custom={i * 0.5}
                    whileHover={{ x: 4 }}
                    className="bg-white border border-[#EDE6D8] rounded-xl px-5 py-3.5 flex items-center justify-between shadow-sm hover:border-[#C9A96E]/40 hover:shadow-md transition-all duration-200 cursor-default">
                    <span className="text-[#4A3F35] text-sm font-body">{lang === 'de' ? n.de : n.en}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#8A7A6A] text-xs font-body">{n.km}</span>
                      <span className="text-[#8B6914] text-xs font-body border border-[#C9A96E]/30 bg-[#F2E8D0] rounded-full px-3 py-1">{n.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Address card */}
              <motion.div
                whileHover={{ y: -2 }}
                className="mt-6 bg-[#1C1714] border border-[#C9A96E]/20 rounded-2xl p-6 shadow-lg">
                <p className="text-[#C9A96E] text-[10px] uppercase tracking-[0.35em] font-body mb-4">Adresse</p>
                <p className="text-white font-body text-sm leading-relaxed">
                  Krone Langenburg by Ammesso<br />
                  {s.address_street}<br />
                  {s.address_zip} {s.address_city}<br />
                  {s.address_country}
                </p>
                <div className="mt-4 pt-4 border-t border-[#C9A96E]/15 space-y-2">
                  <a href={`tel:${s.phone}`} className="block text-[#C9A96E]/80 hover:text-[#C9A96E] text-sm font-body transition-colors">{s.phone}</a>
                  <a href={`mailto:${s.email_info}`} className="block text-[#C9A96E]/80 hover:text-[#C9A96E] text-sm font-body transition-colors">{s.email_info}</a>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── CTA STRIP ── */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mt-14 sm:mt-16 bg-gradient-to-r from-[#1C1714] to-[#2A2118] border border-[#C9A96E]/20 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl overflow-hidden relative">
          {/* Decorative gold glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#C9A96E]/08 rounded-full blur-3xl pointer-events-none" />
          <div>
            <p className="font-display text-2xl sm:text-3xl font-light text-white mb-2">
              {lang === 'de' ? 'Bereit für Ihren Aufenthalt?' : 'Ready for your stay?'}
            </p>
            <p className="text-white/50 text-sm font-body">
              {lang === 'de' ? 'Buchen Sie direkt bei uns — ohne Gebühren, mit persönlichem Service.' : 'Book directly with us — no fees, with personal service.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/rooms" className="btn-gold">
                {t.cta_rooms} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact" className="btn-outline-dark">
                {t.cta_contact}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}