import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { ArrowRight } from 'lucide-react';

const CHEF_IMG = "https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp";
const RESTAURANT_IMG = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80";

export default function Story() {
  const { lang } = useLang();

  const c = {
    de: {
      label: 'Unsere Geschichte', title: 'Ein Traum, der seit Jahren köchelt',
      brand: 'Kulinarium by Ammesso — Wo Geschmack zu Hause ist',
      text1: 'Mitten im Herzen Hohenlohes vereint Kulinarium by Ammesso mediterrane Leichtigkeit mit deutscher Bodenständigkeit. Unsere Küche ist ehrlich, emotional und voller Persönlichkeit.',
      text2: 'Hier entstehen Gerichte, die Geschichten erzählen — mit Liebe zum Detail, Leidenschaft fürs Handwerk und einer tiefen Verbundenheit zu hochwertigen Zutaten. Bei uns steht der Mensch im Mittelpunkt — sowohl in der Küche als auch am Tisch.',
      chef_label: 'Chefkoch & Gründer',
      quote: '"Ammesso bringt Gefühl auf den Teller – bei ihm schmeckt man Herz, Vergangenheit und Vision in jedem Bissen."',
      chef_bio: 'Omar Ammesso, mit vollem Namen Omar Ouardaoui, ist nicht nur der Gründer von Kulinarium, sondern auch dessen kreativer Kern. Seine Leidenschaft fürs Kochen entdeckte er früh – inspiriert von den Aromen seiner Kindheit und einer tiefen Liebe zur mediterranen Küche. Ausgebildet in verschiedenen Küchen Europas, entwickelte er schnell seinen eigenen Stil: kraftvoll, persönlich und voller Emotion. Für Ammesso ist Kochen kein Beruf – es ist Sprache, Identität, und eine tägliche Liebeserklärung an das Leben.',
      values: [
        { e: '🫀', t: 'Mit Herz', d: 'Jedes Gericht ist eine persönliche Aussage.' },
        { e: '🌿', t: 'Mit Ehrlichkeit', d: 'Hochwertige, ehrliche Zutaten ohne Kompromisse.' },
        { e: '🏡', t: 'Mit Wärme', d: 'Jeder Gast fühlt sich wie zu Hause.' },
      ],
      cta: 'Tisch reservieren',
    },
    en: {
      label: 'Our Story', title: 'A Dream Years in the Making',
      brand: 'Kulinarium by Ammesso — Where Taste Feels Like Home',
      text1: 'In the heart of Hohenlohe, Kulinarium by Ammesso combines Mediterranean lightness with German groundedness. Our cuisine is honest, emotional and full of personality.',
      text2: 'Dishes are created that tell stories — with attention to detail, passion for craftsmanship and a deep connection to quality ingredients. The person is at the centre — in the kitchen and at the table.',
      chef_label: 'Head Chef & Founder',
      quote: '"Ammesso brings feeling to the plate — in every bite you taste heart, history and vision."',
      chef_bio: 'Omar Ammesso, born Omar Ouardaoui, is not only the founder of Kulinarium but also its creative core. His passion for cooking started early — inspired by the aromas of his childhood and a deep love for Mediterranean cuisine. Trained in various European kitchens, he quickly developed his own style: powerful, personal and full of emotion. For Ammesso, cooking is not a profession — it is language, identity, and a daily declaration of love for life.',
      values: [
        { e: '🫀', t: 'With Heart', d: 'Every dish is a personal statement.' },
        { e: '🌿', t: 'With Honesty', d: 'Quality, honest ingredients without compromise.' },
        { e: '🏡', t: 'With Warmth', d: 'Every guest feels at home.' },
      ],
      cta: 'Reserve a Table',
    },
    it: {
      label: 'La nostra storia', title: 'Un sogno cucinato per anni',
      brand: 'Kulinarium by Ammesso — Dove il gusto è di casa',
      text1: 'Nel cuore dell\'Hohenlohe, Kulinarium by Ammesso unisce la leggerezza mediterranea con la concretezza tedesca. La nostra cucina è onesta, emozionale e piena di personalità.',
      text2: 'Qui nascono piatti che raccontano storie — con attenzione ai dettagli, passione per l\'artigianato e un profondo legame con ingredienti di qualità.',
      chef_label: 'Chef & Fondatore',
      quote: '"Ammesso porta emozione nel piatto — in ogni boccone si sente cuore, passato e visione."',
      chef_bio: 'Omar Ammesso, vero nome Omar Ouardaoui, non è solo il fondatore di Kulinarium, ma anche il suo cuore creativo. La sua passione per la cucina è nata presto — ispirata dagli aromi della sua infanzia e da un profondo amore per la cucina mediterranea.',
      values: [
        { e: '🫀', t: 'Con Cuore', d: 'Ogni piatto è una dichiarazione personale.' },
        { e: '🌿', t: 'Con Onestà', d: 'Ingredienti di alta qualità, senza compromessi.' },
        { e: '🏡', t: 'Con Calore', d: 'Ogni ospite si sente a casa.' },
      ],
      cta: 'Prenota un tavolo',
    },
  };
  const cv = c[lang] || c.de;

  return (
    <div className="min-h-screen bg-ivory text-charcoal pb-20 lg:pb-0">
      {/* Hero */}
      <div className="relative h-[50vh] sm:h-[55vh] min-h-[320px] sm:min-h-[360px] overflow-hidden">
        <img src={RESTAURANT_IMG} alt="Kulinarium by Ammesso" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/25 to-charcoal" />
        <div className="absolute inset-0 flex items-end pb-10 sm:pb-12 px-5">
          <div className="max-w-3xl mx-auto w-full">
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">{cv.label}</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-light text-ivory leading-tight">{cv.title}</h1>
          </div>
        </div>
      </div>

      {/* Brand quote */}
      <section className="py-14 px-5 bg-stone border-y border-gold-light/15">
        <div className="max-w-2xl mx-auto text-center">
          <div className="section-divider mb-8" />
          <p className="font-display text-2xl font-light italic" style={{color:'#5A4A3A'}}>&ldquo;{cv.brand}&rdquo;</p>
          <div className="section-divider mt-8" />
        </div>
      </section>

      {/* Story text */}
      <section className="py-16 px-5 bg-ivory">
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="font-body text-lg leading-relaxed" style={{color:'#3A2E25'}}>{cv.text1}</p>
          <p className="font-body leading-relaxed" style={{color:'#5A4A3A'}}>{cv.text2}</p>
          
          {/* Additional context */}
          <div className="pt-8 border-t border-stone-mid space-y-4">
            <h3 className="font-display text-xl font-light text-charcoal">
              {lang === 'de' ? 'Inspiration & Handwerk' : lang === 'en' ? 'Inspiration & Craft' : 'Ispirazione & Mestiere'}
            </h3>
            <p className="text-ivory/45 text-sm leading-relaxed">
              {lang === 'de'
                ? 'Unsere Küche speist sich aus drei Quellen: den klassischen Techniken Süditaliens, der Frische des Hohenloher Marktes und der persönlichen Vision des Küchenchefs. Das Ergebnis sind Gerichte, die sich anfühlen wie die Heimat schmeckt — vertraut, warmherzig und unvergesslich.'
                : lang === 'en'
                ? 'Our cuisine draws from three sources: the classic techniques of Southern Italy, the freshness of the Hohenlohe market, and the personal vision of our chef. The result is cuisine that tastes like home feels — familiar, warm-hearted, and unforgettable.'
                : 'La nostra cucina attinge da tre fonti: le tecniche classiche dell\'Italia meridionale, la freschezza del mercato di Hohenlohe e la visione personale dello chef. Il risultato sono piatti che profumano di casa — familiari, calorosi e indimenticabili.'}
            </p>
          </div>
        </div>
      </section>

      {/* Chef section */}
      <section className="py-12 sm:py-16 px-4 sm:px-5 bg-espresso">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden h-72 sm:h-[480px] shadow-premium">
            <img src={CHEF_IMG} alt="Chef Omar Ammesso" className="w-full h-full object-cover object-top" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-display text-2xl text-ivory font-light">Omar Ammesso</p>
              <p className="text-gold text-xs tracking-widest font-body mt-0.5">{cv.chef_label}</p>
            </div>
          </div>
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-4">{cv.chef_label}</p>
            <h2 className="font-display text-4xl font-light text-ivory mb-2">Omar Ammesso</h2>
            <p className="text-ivory/35 text-sm italic font-body mb-6">Omar Ouardaoui</p>
            <blockquote className="border-l-2 border-gold/40 pl-5 mb-6 italic font-display text-xl text-ivory/60 leading-relaxed">
              {cv.quote}
            </blockquote>
            <p className="text-ivory/50 font-body text-sm leading-relaxed">{cv.chef_bio}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 px-4 sm:px-5 bg-ivory">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
          {cv.values.map((v, i) => (
            <div key={i} className="surface-card rounded-2xl p-6 sm:p-8 flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 text-left sm:text-center">
              <div className="text-3xl sm:text-4xl sm:mb-4 flex-shrink-0">{v.e}</div>
              <div>
                <h3 className="font-display text-xl font-light text-charcoal mb-1 sm:mb-2">{v.t}</h3>
                <p className="text-sm font-body leading-relaxed" style={{color:'#7A6A5A'}}>{v.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-espresso py-12 sm:py-14 px-4 sm:px-5 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory mb-5 sm:mb-6">
          {lang === 'de' ? 'Erleben Sie es selbst.' : lang === 'en' ? 'Come experience it.' : 'Vieni a scoprirlo.'}
        </h2>
        <Link to="/reserve"
          className="inline-flex items-center gap-2.5 px-8 py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold shadow-gold-glow">
          {cv.cta} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}