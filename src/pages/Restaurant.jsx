import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { ArrowRight, Clock, UtensilsCrossed, Star, MapPin, Leaf } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';

const IMG_RESTAURANT = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=85";
const IMG_FOOD1 = "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80";
const IMG_FOOD2 = "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80";
const IMG_PASTA = "https://images.unsplash.com/photo-1551183053-bf91798d792e?w=800&q=80";
const IMG_CHEF = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=85";

export default function Restaurant() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;

  const copy = {
    de: {
      label: 'Krone Langenburg by Ammesso',
      title: 'Mediterrane Küche mit Herz',
      intro: 'Ehrlich gekochte Gerichte, die Geschichten erzählen. Jede Pasta, jedes Stück Fleisch, jeder Nachtisch ist eine persönliche Aussage des Küchenchefs Omar Ammesso.',
      hours_title: 'Öffnungszeiten',
      mon: 'Montag',
      mon_hours: 'Ruhetag',
      tue_sat: 'Dienstag – Samstag',
      tue_sat_hours: '12:00 – 14:30 · 18:00 – 22:30',
      sun: 'Sonntag',
      sun_hours: '12:00 – 21:00',
      cta_reserve: 'Tisch reservieren',
      cta_menu: 'Speisekarte ansehen',
      philosophy_title: 'Unsere Philosophie',
      philosophy: 'Krone Langenburg by Ammesso steht für mediterrane Leichtigkeit gepaart mit echter Gastfreundschaft. Frische Zutaten, handgemachte Pasta und Gerichte, die Wärme geben — das ist, was wir täglich auftischen.',
      capacity: '120 Sitzplätze · Außenterrasse im Sommer',
      booking_note: 'Gruppen ab 10 Personen bitte direkt per E-Mail anfragen.',
      chef_label: 'Chefkoch & Gründer',
      chef_bio: 'Seine Leidenschaft fürs Kochen entdeckte er früh — inspiriert von den Aromen seiner Kindheit und einer tiefen Liebe zur mediterranen Küche. Für Ammesso ist Kochen kein Beruf — es ist Sprache, Identität und eine tägliche Liebeserklärung.',
      story_link: 'Unsere Geschichte',
      trust_title: 'Reservieren Sie Ihren Tisch',
    },
    en: {
      label: 'Krone Langenburg by Ammesso',
      title: 'Mediterranean Cuisine with Heart',
      intro: 'Honestly cooked dishes that tell stories. Every pasta, every piece of meat, every dessert is a personal statement from head chef Omar Ammesso.',
      hours_title: 'Opening Hours',
      mon: 'Monday',
      mon_hours: 'Closed',
      tue_sat: 'Tuesday – Saturday',
      tue_sat_hours: '12:00 – 14:30 · 18:00 – 22:30',
      sun: 'Sunday',
      sun_hours: '12:00 – 21:00',
      cta_reserve: 'Reserve a Table',
      cta_menu: 'View Menu',
      philosophy_title: 'Our Philosophy',
      philosophy: 'Krone Langenburg by Ammesso stands for Mediterranean lightness paired with genuine hospitality. Fresh ingredients, handmade pasta and dishes that give warmth — that is what we serve every day.',
      capacity: '120 seats · Terrace in summer',
      booking_note: 'Groups of 10+ please enquire directly by email.',
      chef_label: 'Head Chef & Founder',
      chef_bio: 'His passion for cooking emerged early — inspired by the aromas of his childhood and a deep love for Mediterranean cuisine. For Ammesso, cooking is not a profession — it is language, identity and a daily declaration of love.',
      story_link: 'Our Story',
      trust_title: 'Reserve your table',
    },
    it: {
      label: 'Krone Langenburg by Ammesso',
      title: 'Cucina Mediterranea con Cuore',
      intro: 'Piatti cucinati con onestà che raccontano storie. Ogni pasta, ogni carne, ogni dolce è una dichiarazione personale dello chef Omar Ammesso.',
      hours_title: 'Orari di apertura',
      mon: 'Lunedì',
      mon_hours: 'Chiuso',
      tue_sat: 'Martedì – Sabato',
      tue_sat_hours: '12:00 – 14:30 · 18:00 – 22:30',
      sun: 'Domenica',
      sun_hours: '12:00 – 21:00',
      cta_reserve: 'Prenota un tavolo',
      cta_menu: 'Vedi il menu',
      philosophy_title: 'La nostra filosofia',
      philosophy: 'Krone Langenburg by Ammesso rappresenta la leggerezza mediterranea abbinata a una vera ospitalità. Ingredienti freschi, pasta fatta a mano e piatti che scaldano il cuore.',
      capacity: '120 posti · Terrazza in estate',
      booking_note: 'Gruppi di 10+ persone: scrivere direttamente per email.',
      chef_label: 'Chef & Fondatore',
      chef_bio: 'La sua passione per la cucina è nata presto — ispirata dagli aromi della sua infanzia e da un profondo amore per la cucina mediterranea. Per Ammesso, cucinare non è un mestiere — è linguaggio, identità e una quotidiana dichiarazione d\'amore.',
      story_link: 'La nostra storia',
      trust_title: 'Prenota il tuo tavolo',
    },
  };

  const c = copy[lang] || copy.de;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pb-24 lg:pb-0">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative pt-[126px] lg:pt-[166px] overflow-hidden" style={{ minHeight: 'calc(65vh + 126px)' }}>
        <img src={IMG_RESTAURANT} alt="Krone Langenburg by Ammesso — Restaurant, mediterrane Küche Hohenlohe" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/20 to-charcoal" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-charcoal/40" />
        <div className="relative z-10 flex items-end pb-12 px-5 min-h-[300px]">
          <div className="max-w-4xl mx-auto w-full">
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">{c.label}</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-light text-ivory mb-4 sm:mb-6 leading-tight">{c.title}</h1>
            <p className="text-white/75 font-body leading-relaxed max-w-xl mb-5 sm:mb-7 text-sm sm:text-base">{c.intro}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/reserve"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] rounded-lg text-xs tracking-[0.15em] uppercase font-body font-bold transition-all shadow-lg w-full sm:w-auto hover:-translate-y-px">
                <UtensilsCrossed className="w-3.5 h-3.5" /> {c.cta_reserve}
              </Link>
              <Link to="/menu"
                className="flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-white/35 text-white hover:border-white/65 hover:bg-white/10 rounded-lg text-xs tracking-[0.15em] uppercase font-body font-semibold transition-all w-full sm:w-auto">
                {c.cta_menu} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── PHILOSOPHY ───────────────────────────────────────── */}
      <section className="bg-espresso py-14 px-5 border-y border-[#C9A96E]/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-4">{c.philosophy_title}</p>
          <div className="section-divider mb-7" />
          <p className="font-display text-2xl md:text-3xl font-light text-ivory/80 leading-relaxed italic">{c.philosophy}</p>
          <div className="section-divider mt-7" />
        </div>
      </section>

      {/* ── HOURS + CTA ──────────────────────────────────────── */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="bg-[#2A2118] rounded-2xl p-8 border border-[#C9A96E]/20">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-[#C9A96E]/70" />
              <span className="text-[#C9A96E]/70 text-[10px] tracking-[0.35em] uppercase font-body">{c.hours_title}</span>
            </div>
            <ul className="space-y-4 text-sm font-body">
              <li className="flex justify-between items-center">
                <span className="text-white/40">{c.mon}</span>
                <span className="text-white/35 text-xs">{c.mon_hours}</span>
              </li>
              <li className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-start">
                  <span className="text-white/85 font-medium">{c.tue_sat}</span>
                </div>
                <div className="text-[#C9A96E]/80 text-xs mt-1 font-semibold">{c.tue_sat_hours}</div>
              </li>
              <li className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-start">
                  <span className="text-white/85 font-medium">{c.sun}</span>
                </div>
                <div className="text-[#C9A96E]/80 text-xs mt-1 font-semibold">{c.sun_hours}</div>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-white/45 font-body">
              <MapPin className="w-3.5 h-3.5 text-[#C9A96E]/50" />
              <span>{c.capacity}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/reserve"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] rounded-lg text-xs tracking-[0.15em] uppercase font-body font-bold transition-all shadow-lg hover:-translate-y-px">
              <UtensilsCrossed className="w-4 h-4" /> {c.cta_reserve}
            </Link>
            <Link to="/menu"
              className="flex items-center justify-center gap-2 w-full py-4 border-2 border-[#C9A96E]/40 text-[#C9A96E] hover:border-[#C9A96E] hover:bg-[#C9A96E]/10 rounded-lg text-xs tracking-[0.15em] uppercase font-body font-semibold transition-all">
              {c.cta_menu}
            </Link>
            <p className="text-white/45 text-xs text-center font-body pt-1">{c.booking_note}</p>
            <a href={`mailto:${s.email_info}`}
              className="block text-center text-gold/60 hover:text-gold text-xs font-body tracking-wider transition-colors">
              {s.email_info}
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOD GALLERY ─────────────────────────────────────── */}
      <section className="py-6 px-4 sm:px-5 bg-espresso">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-2 sm:gap-4">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-square col-span-2 group">
            <img src={IMG_FOOD1} alt="Pasta fresca Krone Langenburg by Ammesso — Restaurant" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
          </div>
          <div className="flex flex-col gap-2 sm:gap-4">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden flex-1 group">
              <img src={IMG_FOOD2} alt="Mediterrane Hauptspeise Krone Langenburg by Ammesso" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
            </div>
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden flex-1 group">
              <img src={IMG_PASTA} alt="Handgemachte Pasta Krone Langenburg by Ammesso — Restaurant" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CHEF ─────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden h-72 sm:h-[420px] shadow-premium">
            <img src={IMG_CHEF} alt="Chef Omar Ammesso" className="w-full h-full object-cover object-top" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-display text-2xl text-ivory font-light">Omar Ammesso</p>
              <p className="text-gold text-xs tracking-widest font-body mt-0.5">{c.chef_label}</p>
            </div>
          </div>
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-4">{c.chef_label}</p>
            <h2 className="font-display text-3xl md:text-4xl font-light text-ivory mb-2">Omar Ammesso</h2>
            <p className="text-ivory/30 text-sm italic font-body mb-5">Omar Ouardaoui</p>
            <blockquote className="border-l-2 border-gold/40 pl-5 mb-6 italic font-display text-xl text-ivory/60">
              {lang === 'de' && '"Kochen ist keine Arbeit — es ist Sprache."'}
              {lang === 'en' && '"Cooking is not work — it is language."'}
              {lang === 'it' && '"Cucinare non è lavoro — è linguaggio."'}
            </blockquote>
            <p className="text-ivory/50 font-body text-sm leading-relaxed mb-6">{c.chef_bio}</p>
            <Link to="/story"
              className="inline-flex items-center gap-2 text-gold text-xs tracking-[0.2em] uppercase font-body hover:gap-3 transition-all">
              {c.story_link} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE NOTES ─────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-5">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#2A2118] rounded-2xl p-6 border border-[#C9A96E]/15">
            <h3 className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase font-body font-semibold mb-3">
              {lang === 'de' ? '⏰ Timing' : lang === 'en' ? '⏰ Timing' : '⏰ Orari'}
            </h3>
            <p className="text-white/70 text-sm font-body leading-relaxed">
              {lang === 'de'
                ? 'Lunchs sind intim und schnell. Abendessen: Take-your-time Erlebnisse. Sonntags öffnen wir früh und servieren bis spät — vollkommen entspannt.'
                : lang === 'en'
                ? 'Lunches are intimate and quick. Dinners are take-your-time experiences. Sundays we open early and serve late — completely relaxed.'
                : 'I pranzi sono intimi e veloci. Le cene sono esperienze senza fretta. La domenica apriamo presto e serviamo fino a tardi — completamente rilassati.'}
            </p>
          </div>
          <div className="bg-[#2A2118] rounded-2xl p-6 border border-[#C9A96E]/15">
            <h3 className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase font-body font-semibold mb-3">
              {lang === 'de' ? '🥗 Diäten & Wünsche' : lang === 'en' ? '🥗 Diets & Wishes' : '🥗 Diete & Preferenze'}
            </h3>
            <p className="text-white/70 text-sm font-body leading-relaxed">
              {lang === 'de'
                ? 'Vegetarisch? Vegan? Allergien? Sagen Sie uns Bescheid — wir passen an und zaubern dir etwas Wunderschönes.'
                : lang === 'en'
                ? 'Vegetarian? Vegan? Allergies? Let us know — we adapt and create something beautiful for you.'
                : 'Vegetariano? Vegano? Allergie? Facci sapere — ci adattiamo e creiamo qualcosa di bello per te.'}
            </p>
          </div>
        </div>
      </section>

      {/* ── TRUST / FINAL CTA ────────────────────────────────── */}
      <section className="bg-espresso py-12 sm:py-16 px-4 sm:px-5 text-center border-t border-[#C9A96E]/10">
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-gold text-gold" />)}
        </div>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-ivory mb-3 leading-tight">
          {lang === 'de' ? 'Wir freuen uns auf Sie.' : lang === 'en' ? 'We look forward to seeing you.' : 'Non vediamo l\'ora di vedervi.'}
        </h2>
        <p className="text-white/65 text-sm font-body mb-8">
          {lang === 'de' 
            ? 'Buchen Sie Ihren Tisch oder rufen Sie an — wir sind für Sie da.'
            : lang === 'en'
            ? 'Book your table or call us — we\'re here for you.'
            : 'Prenota il tuo tavolo o chiamaci — siamo qui per te.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm sm:max-w-none mx-auto">
          <Link to="/reserve"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C9A96E] hover:bg-[#B8924A] text-[#1C1714] rounded-lg text-xs tracking-[0.15em] uppercase font-body font-bold transition-all shadow-lg hover:-translate-y-px">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            {c.cta_reserve}
          </Link>
          <a href={`tel:${s.phone}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#C9A96E]/50 text-[#C9A96E] hover:border-[#C9A96E] hover:bg-[#C9A96E]/10 rounded-lg text-xs tracking-[0.15em] uppercase font-body font-semibold transition-all">
            {s.phone}
          </a>
        </div>
      </section>
    </div>
  );
}