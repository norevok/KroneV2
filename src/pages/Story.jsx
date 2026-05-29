import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { motion } from 'framer-motion';
import { UtensilsCrossed, BedDouble, History, Users, Star, MapPin, Heart, Flame, Leaf, ArrowRight } from 'lucide-react';

// ── Timeline ──
const IMG_1 = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/188279e50_generated_image.png';
const IMG_2 = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/13b22aee0_generated_image.png';
const IMG_3 = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/c24929afe_generated_image.png';
const IMG_4 = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/4a59cfcb2_generated_image.png';

const TIMELINE = {
  de: [
    {
      year: 'Die Anfänge',
      title: 'Ein Ort der Begegnung entsteht',
      text: 'Im Herzen Hohenlohes, hoch über dem Jagsttal, wächst Langenburg zu einer lebendigen Marktstadt heran. Händler, Reisende und Pilger kehren an der Hauptstraße ein. Das Gasthaus an der Nummer 24 wird zum Treffpunkt — ein Ort, an dem Geschichten beginnen, Freundschaften entstehen und Gastfreundschaft gelebt wird.',
      img: IMG_1,
      alt: 'Historische Ansicht Langenburg — Burg über dem Jagsttal',
    },
    {
      year: 'Residenzstadt',
      title: 'Langenburg im Glanz seiner Zeit',
      text: 'Das fürstliche Schloss wird zur prunkvollen Residenz ausgebaut. Langenburg erhebt sich zur bedeutenden Residenzstadt Hohenlohes — Kultur, Handel und gesellschaftliches Leben prägen die Hauptstraße. Das Haus an der Nummer 24 empfängt Adel und Kaufleute gleichermaßen. Gastlichkeit wird zur Kunst.',
      img: IMG_2,
      alt: 'Schloss Langenburg Residenz — historische Ansicht',
    },
    {
      year: 'Tradition',
      title: 'Jahrzehnte der Beständigkeit',
      text: 'Die Jahrzehnte ziehen vorbei, Gesichter wechseln — doch das Haus in der Hauptstraße 24 bleibt. Als Treffpunkt für Reisende, Einheimische und all jene, die Langenburg als ihr Zuhause auf Zeit betrachten. Echte Gastfreundschaft, ehrliches Handwerk und die Wärme eines Ortes, der sich nie verbiegt.',
      img: IMG_3,
      alt: 'Traditionelles Gasthaus Langenburg — 20. Jahrhundert',
    },
    {
      year: 'Heute',
      title: 'Kulinarium by Ammesso — Wo Geschmack zu Hause ist',
      text: 'Mitten im Herzen Hohenlohes vereint Kulinarium by Ammesso mediterrane Leichtigkeit mit deutscher Bodenständigkeit. Unsere Küche ist ehrlich, emotional und voller Persönlichkeit. Hier entstehen Gerichte, die Geschichten erzählen — mit Liebe zum Detail, Leidenschaft fürs Handwerk und einer tiefen Verbundenheit zu hochwertigen Zutaten. Bei uns steht der Mensch im Mittelpunkt — sowohl in der Küche als auch am Tisch.',
      img: IMG_4,
      alt: 'Krone Langenburg by Ammesso — Restaurant Interieur heute',
    },
  ],
  en: [
    {
      year: 'The Beginning',
      title: 'A Place of Encounter is Born',
      text: 'In the heart of Hohenlohe, high above the Jagst Valley, Langenburg grows into a lively market town. Merchants, travellers and pilgrims stop at Hauptstraße. The inn at number 24 becomes a meeting point — a place where stories begin, friendships form and hospitality is lived.',
      img: IMG_1,
      alt: 'Historic view of Langenburg — castle above the Jagst Valley',
    },
    {
      year: 'Residence Town',
      title: 'Langenburg in Its Golden Age',
      text: 'The princely castle is expanded into a magnificent residence. Langenburg rises to become an important residence town of Hohenlohe — culture, trade and social life shape the Hauptstraße. The house at number 24 receives nobility and merchants alike. Hospitality becomes an art.',
      img: IMG_2,
      alt: 'Langenburg Castle residence — historic view',
    },
    {
      year: 'Tradition',
      title: 'Decades of Constancy',
      text: 'The decades pass, faces change — but the house at Hauptstraße 24 endures. As a meeting point for travellers, locals and all those who consider Langenburg their temporary home. Genuine hospitality, honest craftsmanship and the warmth of a place that never bends.',
      img: IMG_3,
      alt: 'Traditional inn Langenburg — 20th century',
    },
    {
      year: 'Today',
      title: 'Kulinarium by Ammesso — Where Taste Feels at Home',
      text: 'In the heart of Hohenlohe, Kulinarium by Ammesso unites Mediterranean lightness with German authenticity. Our cuisine is honest, emotional and full of personality. Dishes are created here that tell stories — with attention to detail, passion for the craft and a deep connection to quality ingredients. The person is always at the centre — both in the kitchen and at the table.',
      img: IMG_4,
      alt: 'Krone Langenburg by Ammesso — Restaurant interior today',
    },
  ],
  it: [
    {
      year: 'Gli inizi',
      title: 'Nasce un luogo di incontro',
      text: 'Nel cuore di Hohenlohe, in alto sopra la Valle del Jagst, Langenburg cresce fino a diventare una vivace città mercantile. Mercanti, viaggiatori e pellegrini si fermano alla Hauptstraße. La locanda al numero 24 diventa un punto di ritrovo — un luogo dove nascono storie, si formano amicizie e si vive l\'ospitalità.',
      img: IMG_1,
      alt: 'Vista storica di Langenburg — castello sulla Valle del Jagst',
    },
    {
      year: 'Città residenziale',
      title: 'Langenburg nel suo periodo d\'oro',
      text: 'Il castello principesco viene ampliato in una magnifica residenza. Langenburg diventa una delle più importanti città residenziali di Hohenlohe. La casa al numero 24 accoglie nobili e mercanti. L\'ospitalità diventa un\'arte.',
      img: IMG_2,
      alt: 'Castello di Langenburg — veduta storica',
    },
    {
      year: 'Tradizione',
      title: 'Decenni di continuità',
      text: 'I decenni passano, i volti cambiano — ma la casa in Hauptstraße 24 resiste. Come punto d\'incontro per viaggiatori, locali e tutti coloro che considerano Langenburg la loro casa temporanea. Vera ospitalità, artigianato onesto e il calore di un luogo che non si piega mai.',
      img: IMG_3,
      alt: 'Locanda tradizionale Langenburg — XX secolo',
    },
    {
      year: 'Oggi',
      title: 'Kulinarium by Ammesso — Dove il gusto è di casa',
      text: 'Nel cuore di Hohenlohe, Kulinarium by Ammesso unisce la leggerezza mediterranea con l\'autenticità tedesca. La nostra cucina è onesta, emotiva e piena di personalità. Qui nascono piatti che raccontano storie — con attenzione ai dettagli, passione per il mestiere e un profondo legame con ingredienti di qualità. La persona è sempre al centro — sia in cucina che a tavola.',
      img: IMG_4,
      alt: 'Krone Langenburg by Ammesso — interno del ristorante oggi',
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
    eyebrow: 'Der Chefkoch',
    title: 'Omar Ammesso',
    subtitle: 'Ammesso bringt Gefühl auf den Teller — man schmeckt Herz, Vergangenheit und Vision in jedem Bissen.',
    quote: '"Kochen ist für mich kein Beruf — es ist Sprache, Identität und eine tägliche Liebeserklärung an das Leben."',
    body: [
      'Ammesso, mit vollem Namen Omar Ouardaoui, ist nicht nur der Gründer von Kulinarium, sondern auch dessen kreativer Kern. Seine Leidenschaft fürs Kochen entdeckte er früh — inspiriert von den Aromen seiner Kindheit und einer tiefen Liebe zur mediterranen Küche.',
      'Ausgebildet in verschiedenen Küchen Europas, entwickelte er schnell seinen eigenen Stil: kraftvoll, persönlich und voller Emotion. Für ihn ist jedes Gericht ein Ausdruck von dem, wer er ist — und ein Angebot an jeden Gast, sich willkommen zu fühlen.',
      'Als er die Krone in Langenburg übernahm, sah er nicht nur ein altes Gasthaus. Er sah ein Versprechen: einen Ort zu schaffen, der Geschichte bewahrt und gleichzeitig neu atmet. Einen Ort, an dem die Wärme des Mittelmeers auf die ehrliche Gastfreundschaft Hohenlohes trifft.',
      'Heute führt Omar das Kulinarium mit der gleichen Leidenschaft, mit der er kocht: aufmerksam, herzlich und kompromisslos in der Qualität. Jedes Gericht trägt seine Handschrift. Jeder Gast spürt, dass hier jemand am Werk ist, dem es wirklich wichtig ist.',
    ],
  },
  en: {
    eyebrow: 'The Head Chef',
    title: 'Omar Ammesso',
    subtitle: 'Ammesso brings feeling to the plate — you taste heart, past and vision in every bite.',
    quote: '"Cooking is not a profession for me — it is language, identity and a daily declaration of love for life."',
    body: [
      'Ammesso, whose full name is Omar Ouardaoui, is not only the founder of Kulinarium but also its creative core. He discovered his passion for cooking early — inspired by the aromas of his childhood and a deep love for Mediterranean cuisine.',
      'Trained in various kitchens across Europe, he quickly developed his own style: powerful, personal and full of emotion. For him, every dish is an expression of who he is — and an invitation for every guest to feel welcome.',
      'When he took over the Krone in Langenburg, he did not just see an old inn. He saw a promise: to create a place that preserves history while breathing anew. A place where the warmth of the Mediterranean meets the honest hospitality of Hohenlohe.',
      'Today Omar runs Kulinarium with the same passion he brings to cooking: attentive, warm and uncompromising in quality. Every dish carries his signature. Every guest feels that someone genuinely cares.',
    ],
  },
  it: {
    eyebrow: 'Lo Chef',
    title: 'Omar Ammesso',
    subtitle: 'Ammesso porta emozione nel piatto — si assapora cuore, passato e visione in ogni boccone.',
    quote: '"Cucinare non è un mestiere per me — è linguaggio, identità e una dichiarazione d\'amore quotidiana alla vita."',
    body: [
      'Ammesso, il cui nome completo è Omar Ouardaoui, non è solo il fondatore di Kulinarium ma anche il suo nucleo creativo. Ha scoperto la sua passione per la cucina presto — ispirato dagli aromi della sua infanzia e da un profondo amore per la cucina mediterranea.',
      'Formatosi in diverse cucine europee, ha sviluppato rapidamente il suo stile personale: potente, personale e pieno di emozione. Per lui ogni piatto è un\'espressione di chi è — e un invito per ogni ospite a sentirsi benvenuto.',
      'Quando ha rilevato la Krone a Langenburg, non ha visto solo una vecchia locanda. Ha visto una promessa: creare un luogo che preservi la storia respirando al tempo stesso di nuovo.',
      'Oggi Omar gestisce il Kulinarium con la stessa passione che porta in cucina: attento, caloroso e senza compromessi sulla qualità. Ogni piatto porta la sua firma. Ogni ospite sente che c\'è qualcuno che ci tiene davvero.',
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
      <div className="relative overflow-hidden bg-[#171311]" style={{ minHeight: 'clamp(600px, 90vh, 900px)' }}>
        <img
          src="https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8b814211e_Krone_vorne.png"
          alt="Krone Langenburg by Ammesso — Außenansicht Hotel"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 50%' }}
        />
        {/* Leichtes Overlay nur oben (Navbar) und unten (Text) — Mitte frei für das Gebäude */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 sm:pb-20 px-5" style={{ paddingTop: 'var(--nav-h-mobile)' }}>
          <div className="relative z-10 max-w-3xl mx-auto text-center w-full">
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
            className="text-white/70 font-body text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {heroSubs[lang] || heroSubs.de}
          </motion.p>
        </div>
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