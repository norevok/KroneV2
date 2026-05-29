import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { motion } from 'framer-motion';
import { UtensilsCrossed, BedDouble, History, Users, Star, MapPin, Heart, Flame, Leaf, ArrowRight } from 'lucide-react';

// ── Timeline — historically accurate ──
const TIMELINE = {
  de: [
    {
      year: '13. Jh.',
      title: 'Langenburg entsteht',
      text: 'Auf einem markanten Bergrücken über dem Jagsttal entsteht im 13. Jahrhundert die erste Burg der Herren von Langenburg. Die Siedlung um die Burg herum wächst zu einem lebendigen Marktort — Händler, Reisende und Pilger kehren ein. Die Gasthäuser an der Hauptstraße werden zum Herzschlag der kleinen Stadt.',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Schloss_Langenburg-msu-2021-0306-.jpg/1280px-Schloss_Langenburg-msu-2021-0306-.jpg',
      alt: 'Schloss Langenburg über dem Jagsttal — historische Ansicht',
    },
    {
      year: '1610–1616',
      title: 'Schloss und Residenzstadt',
      text: 'Fürst Philipp Ernst zu Hohenlohe-Langenburg lässt das Schloss zur prächtigen Renaissance-Residenz ausbauen. Langenburg erhebt sich zur Residenzstadt — Gastlichkeit, Handel und das gesellschaftliche Leben prägen die Hauptstraße. Das Haus an der Nummer 24 gilt als Treffpunkt der Region: Kaufleute, Adel und Gäste von weit her kehren hier ein.',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg',
      alt: 'Panorama Hohenlohe — Blick aus dem Krone Langenburg',
    },
    {
      year: '20. Jh.',
      title: 'Langenburg als Ausflugsziel',
      text: 'Das malerische Langenburg über dem Jagsttal entwickelt sich zum beliebten Ausflugsziel der ganzen Region. Die Hohenloher Landschaft, das Schloss und die traditionsreichen Gasthäuser der Hauptstraße ziehen Gäste aus nah und fern an. Jahrzehnte wechseln, Gesichter wechseln — doch das Haus in der Hauptstraße 24 bleibt ein Ort der Begegnung.',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/737cda4af_krone-kingsuite-1-aussicht-panorama-01.jpg',
      alt: 'Panorama Hohenlohe aus King Suite 1 — Krone Langenburg',
    },
    {
      year: 'Heute',
      title: 'Krone Langenburg by Ammesso',
      text: 'Omar Ammesso erweckt die traditionsreiche Krone in der Hauptstraße 24 zu neuem Leben. Zehn Zimmer und Suiten, mediterrane Küche mit regionaler Seele und echter Gastfreundschaft — das ist Krone Langenburg by Ammesso. Geschichte trifft Moderne. Hohenlohe trifft das Mittelmeer. Und jeder Gast wird wie Familie empfangen.',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8e0419119_krone-kingsuite-1-zimmer-uebersicht-01.jpg',
      alt: 'King Suite 1 — Krone Langenburg by Ammesso',
    },
  ],
  en: [
    {
      year: '13th c.',
      title: 'Langenburg is Founded',
      text: 'On a striking ridge above the Jagst Valley, the first castle of the Lords of Langenburg rises in the 13th century. The settlement around it grows into a lively market town — merchants, travellers and pilgrims stop in. The inns on Hauptstraße become the heartbeat of the small town.',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Schloss_Langenburg-msu-2021-0306-.jpg/1280px-Schloss_Langenburg-msu-2021-0306-.jpg',
      alt: 'Schloss Langenburg above the Jagst Valley',
    },
    {
      year: '1610–1616',
      title: 'Palace and Residence Town',
      text: 'Prince Philipp Ernst of Hohenlohe-Langenburg expands the castle into a magnificent Renaissance residence. Langenburg becomes a residence town — hospitality, trade and social life shape the Hauptstraße. The house at number 24 serves as a meeting point for the region: merchants, nobility and distant guests stop here.',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg',
      alt: 'Panorama Hohenlohe — view from Krone Langenburg',
    },
    {
      year: '20th c.',
      title: 'Langenburg as a Destination',
      text: 'The picturesque hilltop town of Langenburg develops into a beloved destination for the entire region. The Hohenlohe landscape, the castle and the traditional inns of the Hauptstraße attract guests from near and far. Decades pass, faces change — but the house at Hauptstraße 24 remains a place of gathering.',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/737cda4af_krone-kingsuite-1-aussicht-panorama-01.jpg',
      alt: 'Panorama Hohenlohe from King Suite 1 — Krone Langenburg',
    },
    {
      year: 'Today',
      title: 'Krone Langenburg by Ammesso',
      text: 'Omar Ammesso breathes new life into the historic Krone at Hauptstraße 24. Ten rooms and suites, Mediterranean cuisine with regional soul and genuine hospitality — this is Krone Langenburg by Ammesso. History meets modernity. Hohenlohe meets the Mediterranean. And every guest is welcomed like family.',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8e0419119_krone-kingsuite-1-zimmer-uebersicht-01.jpg',
      alt: 'King Suite 1 — Krone Langenburg by Ammesso',
    },
  ],
  it: [
    {
      year: 'XIII sec.',
      title: 'Langenburg viene fondata',
      text: 'Su una cresta panoramica sopra la Valle del Jagst sorge nel XIII secolo il primo castello dei Signori di Langenburg. Il borgo che cresce intorno diventa un vivace mercato — mercanti, viaggiatori e pellegrini si fermano qui. Le locande della Hauptstraße diventano il cuore pulsante della piccola città.',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Schloss_Langenburg-msu-2021-0306-.jpg/1280px-Schloss_Langenburg-msu-2021-0306-.jpg',
      alt: 'Schloss Langenburg sopra la Valle del Jagst',
    },
    {
      year: '1610–1616',
      title: 'Palazzo e Città Residenziale',
      text: 'Il Principe Filippo Ernesto di Hohenlohe-Langenburg espande il castello in una magnifica residenza rinascimentale. Langenburg diventa città residenziale — l\'ospitalità, il commercio e la vita sociale caratterizzano la Hauptstraße. La casa al numero 24 funge da punto d\'incontro regionale.',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg',
      alt: 'Panorama Hohenlohe — vista dalla Krone Langenburg',
    },
    {
      year: 'XX sec.',
      title: 'Langenburg come meta turistica',
      text: 'La pittoresca Langenburg si sviluppa come meta turistica per tutta la regione. Il paesaggio di Hohenlohe, il castello e le tradizionali locande della Hauptstraße attirano ospiti da vicino e lontano. I decenni passano, i volti cambiano — ma la casa in Hauptstraße 24 rimane un luogo di incontro.',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/737cda4af_krone-kingsuite-1-aussicht-panorama-01.jpg',
      alt: 'Panorama Hohenlohe dalla King Suite 1 — Krone Langenburg',
    },
    {
      year: 'Oggi',
      title: 'Krone Langenburg by Ammesso',
      text: 'Omar Ammesso ridà vita alla storica Krone in Hauptstraße 24. Dieci camere e suite, cucina mediterranea con anima regionale e vera ospitalità — questa è Krone Langenburg by Ammesso. La storia incontra la modernità. L\'Hohenlohe incontra il Mediterraneo. E ogni ospite viene accolto come in famiglia.',
      img: 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8e0419119_krone-kingsuite-1-zimmer-uebersicht-01.jpg',
      alt: 'King Suite 1 — Krone Langenburg by Ammesso',
    },
  ],
};

const VALUES = {
  de: [
    { icon: History, title: 'Tradition bewahren', desc: 'Respekt vor der Geschichte Langenburgs und Hohenlohes — mit jedem Detail.' },
    { icon: Flame, title: 'Mit Herz kochen', desc: 'Mediterrane Küche aus regionalen Zutaten. Jedes Gericht eine Liebeserklärung.' },
    { icon: Users, title: 'Gastfreundschaft leben', desc: 'Jeder Gast ist willkommen wie Familie — das ist keine Phrase, das ist unser Versprechen.' },
    { icon: Leaf, title: 'Qualität liefern', desc: 'Nur die besten Produkte aus der Region landen auf unseren Tellern.' },
  ],
  en: [
    { icon: History, title: 'Honour Tradition', desc: 'Respect for the history of Langenburg and Hohenlohe — in every detail.' },
    { icon: Flame, title: 'Cook with Heart', desc: 'Mediterranean cuisine from regional ingredients. Every dish a declaration of love.' },
    { icon: Users, title: 'Live Hospitality', desc: 'Every guest is welcomed like family — not just a phrase, our promise.' },
    { icon: Leaf, title: 'Deliver Quality', desc: 'Only the finest regional produce finds its way to our plates.' },
  ],
  it: [
    { icon: History, title: 'Onorare la tradizione', desc: 'Rispetto per la storia di Langenburg e Hohenlohe — in ogni dettaglio.' },
    { icon: Flame, title: 'Cucinare con cuore', desc: 'Cucina mediterranea con ingredienti regionali. Ogni piatto una dichiarazione d\'amore.' },
    { icon: Users, title: 'Vivere l\'ospitalità', desc: 'Ogni ospite è benvenuto come in famiglia — non solo una frase, è la nostra promessa.' },
    { icon: Leaf, title: 'Offrire qualità', desc: 'Solo i migliori prodotti regionali finiscono nei nostri piatti.' },
  ],
};

// ── Omar Story copy ──
const OMAR_STORY = {
  de: {
    eyebrow: 'Der Mensch hinter der Krone',
    title: 'Omar Ammesso',
    subtitle: 'Chef, Gastgeber, Visionär',
    quote: '"Ein Haus wie die Krone ist keine Immobilie — es ist eine Verantwortung. Ich habe sie mit beiden Händen angenommen."',
    body: [
      'Omar Ammesso wuchs mit dem Duft von frischen Kräutern, heißem Olivenöl und der unerschütterlichen Überzeugung auf, dass Essen Liebe ist. Was als persönliche Leidenschaft begann, wurde zu einer Berufung — und schließlich zu einem Lebensprojekt.',
      'Als er die Krone in Langenburg übernahm, sah er nicht nur ein altes Gasthaus. Er sah ein Versprechen: einen Ort zu schaffen, der Geschichte bewahrt und gleichzeitig neu atmet. Einen Ort, an dem die Wärme des Mittelmeers auf die ehrliche Gastfreundschaft Hohenlohes trifft.',
      'Heute führt Omar die Krone mit der gleichen Leidenschaft, mit der er kocht: aufmerksam, herzlich und kompromisslos in der Qualität. Jedes Zimmer wurde von ihm mitgestaltet. Jedes Gericht trägt seine Handschrift. Jeder Gast spürt, dass hier jemand am Werk ist, dem es wirklich wichtig ist.',
      'Krone Langenburg by Ammesso ist keine Hotelmarke — es ist ein Lebensstil. Und Omar Ammesso lebt ihn täglich.',
    ],
  },
  en: {
    eyebrow: 'The Person Behind the Krone',
    title: 'Omar Ammesso',
    subtitle: 'Chef, Host, Visionary',
    quote: '"A house like the Krone is not real estate — it is a responsibility. I took it with both hands."',
    body: [
      'Omar Ammesso grew up with the scent of fresh herbs, warm olive oil and the unshakeable conviction that food is love. What began as a personal passion became a calling — and ultimately a life project.',
      'When he took over the Krone in Langenburg, he did not just see an old inn. He saw a promise: to create a place that preserves history while breathing anew. A place where the warmth of the Mediterranean meets the honest hospitality of Hohenlohe.',
      'Today Omar runs the Krone with the same passion he brings to cooking: attentive, warm and uncompromising in quality. Every room bears his touch. Every dish carries his signature. Every guest feels that someone genuinely cares.',
      'Krone Langenburg by Ammesso is not a hotel brand — it is a way of life. And Omar Ammesso lives it every day.',
    ],
  },
  it: {
    eyebrow: 'La persona dietro la Krone',
    title: 'Omar Ammesso',
    subtitle: 'Chef, ospite, visionario',
    quote: '"Una casa come la Krone non è un immobile — è una responsabilità. L\'ho presa con entrambe le mani."',
    body: [
      'Omar Ammesso è cresciuto con il profumo delle erbe fresche, dell\'olio d\'oliva caldo e la convinzione incrollabile che il cibo sia amore. Quella che era una passione personale è diventata una vocazione — e infine un progetto di vita.',
      'Quando ha rilevato la Krone a Langenburg, non ha visto solo una vecchia locanda. Ha visto una promessa: creare un luogo che preservi la storia respirando al tempo stesso di nuovo. Un luogo dove il calore del Mediterraneo incontra la genuina ospitalità di Hohenlohe.',
      'Oggi Omar gestisce la Krone con la stessa passione che porta in cucina: attento, caloroso e senza compromessi sulla qualità. Ogni camera porta il suo tocco. Ogni piatto porta la sua firma. Ogni ospite sente che c\'è qualcuno che ci tiene davvero.',
      'Krone Langenburg by Ammesso non è un marchio alberghiero — è uno stile di vita. E Omar Ammesso lo vive ogni giorno.',
    ],
  },
};

export default function Story() {
  const { lang } = useLang();
  const timeline = TIMELINE[lang] || TIMELINE.de;
  const values = VALUES[lang] || VALUES.de;
  const omar = OMAR_STORY[lang] || OMAR_STORY.de;

  const heroTitles = { de: 'Unsere Geschichte', en: 'Our Story', it: 'La Nostra Storia' };
  const heroSubs = {
    de: 'Von der mittelalterlichen Residenzstadt bis zur modernen Krone by Ammesso',
    en: 'From a medieval residence town to the modern Krone by Ammesso',
    it: 'Da una città residenziale medievale alla moderna Krone by Ammesso',
  };
  const ctaT = {
    de: { title: 'Erleben Sie Geschichte & Gastfreundschaft', sub: 'Reservieren Sie Ihren Tisch oder buchen Sie Ihr Zimmer direkt.', reserve: 'Tisch reservieren', rooms: 'Zimmer buchen' },
    en: { title: 'Experience History & Hospitality', sub: 'Reserve your table or book your room directly.', reserve: 'Reserve a Table', rooms: 'Book a Room' },
    it: { title: 'Vivete storia e ospitalità', sub: 'Prenotate il vostro tavolo o la vostra camera direttamente.', reserve: 'Prenota un tavolo', rooms: 'Prenota una camera' },
  };
  const cta = ctaT[lang] || ctaT.de;

  return (
    <div className="min-h-screen bg-[#F7F2EA] text-[#1A1A1A] pb-24 lg:pb-0">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-[#171311] page-top pb-20 sm:pb-28">
        <img
          src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/dcd1ee530_IMG_8599.png"
          alt="Schloss Langenburg Luftaufnahme — Hohenlohe"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          style={{ objectPosition: '50% 40%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#171311]/60 via-transparent to-[#171311]/85" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-5">
          <motion.div className="flex items-center justify-center gap-2 mb-5"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <MapPin className="w-4 h-4 text-[#B08A42]" />
            <p className="text-[#B08A42] text-[10px] tracking-[0.5em] uppercase font-body">Langenburg, Hohenlohe</p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-light text-white mb-5"
            style={{ fontSize: 'clamp(2.25rem, 4.2vw, 4rem)', lineHeight: '1.05' }}>
            {heroTitles[lang] || heroTitles.de}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="w-20 h-px bg-gradient-to-r from-transparent via-[#B08A42] to-transparent mx-auto mb-5"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 font-body text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {heroSubs[lang] || heroSubs.de}
          </motion.p>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <p className="text-[#B08A42] text-[10px] tracking-[0.5em] uppercase font-body mb-3">
            {lang === 'de' ? 'Geschichte' : lang === 'en' ? 'History' : 'Storia'}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1A1A1A]">
            {lang === 'de' ? 'Jahrhunderte der Gastlichkeit' : lang === 'en' ? 'Centuries of Hospitality' : 'Secoli di ospitalità'}
          </h2>
        </motion.div>

        <div className="space-y-0">
          {timeline.map((item, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.05 * i }}
                className="relative"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 sm:mb-24`}>
                  {/* Text */}
                  <div className={`${!isEven ? 'lg:order-2' : ''}`}>
                    <div className="inline-flex items-center gap-2 bg-[#B08A42]/12 border border-[#B08A42]/25 rounded-full px-5 py-2 mb-5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#B08A42]" />
                      <span className="text-[#B08A42] text-xs font-body font-bold tracking-[0.2em] uppercase">{item.year}</span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-light text-[#1A1A1A] mb-5 leading-tight">{item.title}</h2>
                    <p className="font-body text-[#2A2A2A] leading-relaxed text-sm sm:text-base">{item.text}</p>
                  </div>

                  {/* Image */}
                  <div className={`${!isEven ? 'lg:order-1' : ''}`}>
                    <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] ring-1 ring-[#D7D0C5]">
                      <img
                        src={item.img}
                        alt={item.alt}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  </div>
                </div>

                {/* Timeline divider */}
                {i < timeline.length - 1 && (
                  <div className="flex items-center gap-4 mb-16 sm:mb-24">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#B08A42]/30 to-transparent" />
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-[#B08A42]/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-[#B08A42]/50" />
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#B08A42]/30 to-transparent" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── OMAR STORY SECTION ── */}
      <div className="bg-[#171311] py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <p className="text-[#B08A42] text-[10px] tracking-[0.5em] uppercase font-body mb-3">{omar.eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-5xl font-light text-white mb-2">{omar.title}</h2>
            <p className="text-[#B08A42]/70 font-display text-lg italic">{omar.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Portrait */}
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] max-w-sm mx-auto lg:max-w-none ring-1 ring-[#B08A42]/20">
                <img
                  src="https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp"
                  alt="Omar Ammesso — Chefkoch und Gründer Krone Langenburg by Ammesso"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171311]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-display text-2xl text-white font-light">Omar Ammesso</p>
                  <p className="text-[#B08A42] text-xs tracking-widest font-body mt-1">
                    {lang === 'de' ? 'Chefkoch & Gründer' : lang === 'en' ? 'Head Chef & Founder' : 'Chef & Fondatore'}
                  </p>
                </div>
              </div>
              {/* Decorative gold accent */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-[#B08A42]/20 rounded-2xl -z-10 hidden lg:block" />
            </motion.div>

            {/* Story text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex flex-col justify-center">
              {/* Pull quote */}
              <blockquote className="border-l-4 border-[#B08A42] pl-6 mb-8">
                <p className="font-display text-xl sm:text-2xl text-white font-light leading-relaxed italic">{omar.quote}</p>
              </blockquote>

              {/* Body paragraphs */}
              <div className="space-y-5">
                {omar.body.map((para, i) => (
                  <p key={i} className="font-body text-white/80 text-sm sm:text-base leading-relaxed">{para}</p>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link to="/reserve"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#B08A42] hover:bg-[#9E7A38] text-white rounded-lg text-xs tracking-widest uppercase font-body font-bold transition-all shadow-lg hover:-translate-y-px">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  {lang === 'de' ? 'Tisch reservieren' : lang === 'en' ? 'Reserve a Table' : 'Prenota tavolo'}
                </Link>
                <Link to="/restaurant"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 border-2 border-white/20 text-white/65 hover:text-white hover:border-white/40 rounded-lg text-xs tracking-widest uppercase font-body font-semibold transition-all">
                  {lang === 'de' ? 'Das Restaurant' : lang === 'en' ? 'The Restaurant' : 'Il Ristorante'} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── VALUES ── */}
      <div className="bg-white border-t border-[#D7D0C5] py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <p className="text-[#B08A42] text-[10px] tracking-[0.4em] uppercase font-body mb-3">
              {lang === 'de' ? 'Unsere Werte' : lang === 'en' ? 'Our Values' : 'I nostri valori'}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-[#1A1A1A]">
              {lang === 'de' ? 'Was uns antreibt' : lang === 'en' ? 'What drives us' : 'Cosa ci muove'}
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-8">
            {values.map((v, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#B08A42]/10 border border-[#B08A42]/20 flex items-center justify-center mx-auto mb-5">
                  <v.icon className="w-6 h-6 text-[#B08A42]" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-medium text-[#1A1A1A] mb-2">{v.title}</h3>
                <p className="font-body text-xs sm:text-sm text-[#2A2A2A] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FINAL VISUAL — Exterior image ── */}
      <div className="relative h-80 sm:h-[480px] overflow-hidden">
        <img
          src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/dcd1ee530_IMG_8599.png"
          alt="Schloss Langenburg Luftaufnahme — Historisches Stadtbild"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171311]/80 via-[#171311]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 text-center">
          <p className="text-[#B08A42] text-[10px] tracking-[0.5em] uppercase font-body mb-2">Langenburg, Hohenlohe</p>
          <p className="font-display text-2xl sm:text-4xl font-light text-white">
            {lang === 'de' ? 'Geschichte, die man spürt.' : lang === 'en' ? 'History you can feel.' : 'Storia che si sente.'}
          </p>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div className="bg-[#171311] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-12 h-12 rounded-full bg-[#B08A42]/15 border border-[#B08A42]/30 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-5 h-5 text-[#B08A42]" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-4">{cta.title}</h2>
            <p className="text-white/55 font-body text-sm sm:text-base mb-10 leading-relaxed">{cta.sub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/reserve"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-[#B08A42] hover:bg-[#9E7A38] text-white rounded-lg text-sm tracking-widest uppercase font-body font-bold transition-all shadow-lg hover:-translate-y-px">
                <UtensilsCrossed className="w-4 h-4" /> {cta.reserve}
              </Link>
              <Link to="/rooms"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 border-2 border-white/25 text-white/75 hover:text-white hover:border-white/50 rounded-lg text-sm tracking-widest uppercase font-body font-semibold transition-all">
                <BedDouble className="w-4 h-4" /> {cta.rooms}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}