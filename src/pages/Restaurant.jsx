import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { ArrowRight, Clock, UtensilsCrossed, Star, MapPin, Phone } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';

// ── Atmospheric dining/restaurant images ──
const IMG_FOOD1 = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85';
const IMG_FOOD2 = 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=85';
const IMG_PANORAMA = 'https://media.base44.com/images/public/69e1fb8a73bbccc7f63ef768/8742a972c_krone-kingsuite-2-aussicht-panorama-01.jpg';

export default function Restaurant() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;

  const copy = {
    de: {
      label: 'Krone Langenburg by Ammesso',
      title: 'Mediterrane Küche mit Herz',
      intro: 'Ehrlich gekochte Gerichte, die Geschichten erzählen. Jede Pasta, jedes Stück Fleisch, jeder Nachtisch ist eine persönliche Aussage des Küchenchefs Omar Ammesso — verfasst mit den besten Zutaten Hohenlohes.',
      hours_title: 'Öffnungszeiten',
      mon: 'Montag',
      mon_hours: 'Ruhetag',
      tue_sat: 'Dienstag – Samstag',
      tue_sat_lunch: '12:00 – 14:30',
      tue_sat_dinner: '18:00 – 22:30',
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
      story_link: 'Unsere Geschichte lesen',
      open_now: 'Jetzt geöffnet',
      closed_now: 'Aktuell geschlossen',
      timing_title: 'Timing',
      timing_body: 'Lunchs sind intim und schnell. Abendessen: Take-your-time Erlebnisse. Sonntags öffnen wir früh und servieren bis spät — vollkommen entspannt.',
      diets_title: 'Diäten & Wünsche',
      diets_body: 'Vegetarisch? Vegan? Allergien? Sagen Sie uns Bescheid — wir passen an und zaubern Ihnen etwas Wunderschönes.',
    },
    en: {
      label: 'Krone Langenburg by Ammesso',
      title: 'Mediterranean Cuisine with Heart',
      intro: 'Honestly cooked dishes that tell stories. Every pasta, every piece of meat, every dessert is a personal statement from head chef Omar Ammesso — crafted with the finest ingredients of Hohenlohe.',
      hours_title: 'Opening Hours',
      mon: 'Monday',
      mon_hours: 'Closed',
      tue_sat: 'Tuesday – Saturday',
      tue_sat_lunch: '12:00 – 14:30',
      tue_sat_dinner: '18:00 – 22:30',
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
      story_link: 'Read our story',
      open_now: 'Open now',
      closed_now: 'Currently closed',
      timing_title: 'Timing',
      timing_body: 'Lunches are intimate and quick. Dinners are take-your-time experiences. Sundays we open early and serve late — completely relaxed.',
      diets_title: 'Diets & Wishes',
      diets_body: 'Vegetarian? Vegan? Allergies? Let us know — we adapt and create something beautiful for you.',
    },
    it: {
      label: 'Krone Langenburg by Ammesso',
      title: 'Cucina Mediterranea con Cuore',
      intro: 'Piatti cucinati con onestà che raccontano storie. Ogni pasta, ogni carne, ogni dolce è una dichiarazione personale dello chef Omar Ammesso — realizzata con i migliori ingredienti di Hohenlohe.',
      hours_title: 'Orari di apertura',
      mon: 'Lunedì',
      mon_hours: 'Chiuso',
      tue_sat: 'Martedì – Sabato',
      tue_sat_lunch: '12:00 – 14:30',
      tue_sat_dinner: '18:00 – 22:30',
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
      story_link: 'Leggi la nostra storia',
      open_now: 'Aperto ora',
      closed_now: 'Attualmente chiuso',
      timing_title: 'Orari',
      timing_body: 'I pranzi sono intimi e veloci. Le cene sono esperienze senza fretta. La domenica apriamo presto e serviamo fino a tardi — completamente rilassati.',
      diets_title: 'Diete & Preferenze',
      diets_body: 'Vegetariano? Vegano? Allergie? Facci sapere — ci adattiamo e creiamo qualcosa di bello per te.',
    },
  };

  const c = copy[lang] || copy.de;

  // Live open/closed status
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  let isOpen = false;
  if (day === 0) isOpen = hour >= 12 && hour < 21;
  else if (day >= 2 && day <= 6) isOpen = (hour >= 12 && hour < 14.5) || (hour >= 18 && hour < 22.5);

  return (
    <div className="min-h-screen bg-[#171311] text-[#FAF8F5] pb-24 lg:pb-0">

      {/* ── HERO ── */}
      <div className="relative pt-[126px] lg:pt-[166px] overflow-hidden" style={{ minHeight: 'calc(70vh + 126px)' }}>
        {/* Warm atmospheric dining image */}
        <img
          src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1600&q=90"
          alt="Krone Langenburg by Ammesso — Restaurant, mediterrane Küche Hohenlohe"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#171311]/55 via-[#171311]/20 to-[#171311]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#171311]/35 via-transparent to-[#171311]/35" />

        {/* Hero content */}
        <div className="relative z-10 flex items-end pb-14 px-5 min-h-[360px]">
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-4">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <span className={`text-sm font-body font-semibold ${isOpen ? 'text-emerald-300' : 'text-red-300'}`}>
                {isOpen ? c.open_now : c.closed_now}
              </span>
              <span className="text-white/30 text-sm">·</span>
              <span className="text-white/50 text-sm font-body hidden sm:inline">Di–Sa 12–14:30 & 18–22:30 · So 12–21</span>
            </div>
            <p className="text-[#B08A42] text-[10px] tracking-[0.4em] uppercase font-body mb-4">{c.label}</p>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-light text-white mb-5 leading-tight">{c.title}</h1>
            <p className="text-white/75 font-body leading-relaxed max-w-2xl mb-8 text-sm sm:text-base">{c.intro}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/reserve"
                className="flex items-center justify-center gap-2 px-7 py-4 bg-[#B08A42] hover:bg-[#9E7A38] text-white rounded-lg text-xs tracking-[0.15em] uppercase font-body font-bold transition-all shadow-lg hover:-translate-y-px w-full sm:w-auto">
                <UtensilsCrossed className="w-4 h-4" /> {c.cta_reserve}
              </Link>
              <Link to="/menu"
                className="flex items-center justify-center gap-2 px-7 py-4 border-2 border-white/30 text-white hover:border-white/60 hover:bg-white/10 rounded-lg text-xs tracking-[0.15em] uppercase font-body font-semibold transition-all w-full sm:w-auto">
                {c.cta_menu} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── PHILOSOPHY ── */}
      <section className="bg-[#241A16] py-14 sm:py-16 px-5 border-y border-[#B08A42]/15">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#B08A42] text-[10px] tracking-[0.4em] uppercase font-body mb-5">{c.philosophy_title}</p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#B08A42]/50 to-transparent mx-auto mb-7" />
          <p className="font-display text-2xl md:text-3xl font-light text-[#FAF8F5]/85 leading-relaxed italic">{c.philosophy}</p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#B08A42]/50 to-transparent mx-auto mt-7" />
        </div>
      </section>

      {/* ── HOURS + CTA ── */}
      <section className="py-16 sm:py-20 px-5 bg-[#171311]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Opening hours card */}
          <div className="bg-[#241A16] rounded-2xl p-8 sm:p-10 border border-[#B08A42]/20 shadow-xl">
            <div className="flex items-center gap-2.5 mb-7">
              <div className="w-8 h-8 rounded-lg bg-[#B08A42]/15 flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#B08A42]" />
              </div>
              <span className="text-[#B08A42] text-[10px] tracking-[0.35em] uppercase font-body font-semibold">{c.hours_title}</span>
            </div>
            <ul className="space-y-5 font-body text-sm">
              <li className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-[#D7D0C5]/50">{c.mon}</span>
                <span className="text-[#D7D0C5]/35 text-xs italic">{c.mon_hours}</span>
              </li>
              <li className="py-3 border-b border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[#FAF8F5] font-semibold">{c.tue_sat}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B08A42]/60" />
                    <span className="text-[#B08A42] text-xs font-semibold">{c.tue_sat_lunch}</span>
                    <span className="text-[#D7D0C5]/40 text-xs">
                      {lang === 'de' ? 'Mittagessen' : lang === 'en' ? 'Lunch' : 'Pranzo'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B08A42]/60" />
                    <span className="text-[#B08A42] text-xs font-semibold">{c.tue_sat_dinner}</span>
                    <span className="text-[#D7D0C5]/40 text-xs">
                      {lang === 'de' ? 'Abendessen' : lang === 'en' ? 'Dinner' : 'Cena'}
                    </span>
                  </div>
                </div>
              </li>
              <li className="py-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[#FAF8F5] font-semibold">{c.sun}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B08A42]/60" />
                  <span className="text-[#B08A42] text-xs font-semibold">{c.sun_hours}</span>
                  <span className="text-[#D7D0C5]/40 text-xs">
                    {lang === 'de' ? 'Durchgehend' : lang === 'en' ? 'All day' : 'Tutto il giorno'}
                  </span>
                </div>
              </li>
            </ul>
            <div className="mt-7 pt-5 border-t border-white/10 flex items-center gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-[#B08A42]/60 flex-shrink-0" />
              <span className="text-[#D7D0C5]/50 text-xs font-body">{c.capacity}</span>
            </div>
          </div>

          {/* Booking CTAs */}
          <div className="space-y-4">
            <Link to="/reserve"
              className="flex items-center justify-center gap-2.5 w-full py-4 bg-[#B08A42] hover:bg-[#9E7A38] text-white rounded-xl text-xs tracking-[0.15em] uppercase font-body font-bold transition-all shadow-lg hover:-translate-y-px">
              <UtensilsCrossed className="w-4 h-4" /> {c.cta_reserve}
            </Link>
            <Link to="/menu"
              className="flex items-center justify-center gap-2.5 w-full py-4 border-2 border-[#B08A42]/40 text-[#B08A42] hover:border-[#B08A42] hover:bg-[#B08A42]/10 rounded-xl text-xs tracking-[0.15em] uppercase font-body font-semibold transition-all">
              {c.cta_menu}
            </Link>
            <a href={`tel:${s.phone}`}
              className="flex items-center justify-center gap-2.5 w-full py-4 border border-white/15 text-[#D7D0C5]/60 hover:text-white hover:border-white/30 rounded-xl text-xs tracking-[0.15em] uppercase font-body font-medium transition-all">
              <Phone className="w-3.5 h-3.5" /> {s.phone}
            </a>
            <p className="text-[#D7D0C5]/40 text-xs text-center font-body pt-1 leading-relaxed">{c.booking_note}</p>
            <a href={`mailto:${s.email_info}`}
              className="block text-center text-[#B08A42]/60 hover:text-[#B08A42] text-xs font-body tracking-wider transition-colors">
              {s.email_info}
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOD GALLERY — real room/view images as atmosphere ── */}
      <section className="py-4 px-4 sm:px-5 bg-[#241A16]">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-2 sm:gap-3">
          <div className="relative rounded-2xl overflow-hidden aspect-square col-span-2 group">
            <img src={IMG_FOOD1} alt="Krone Langenburg by Ammesso — Restaurant Atmosphäre" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171311]/60 to-transparent" />
          </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="relative rounded-2xl overflow-hidden flex-1 group">
              <img src={IMG_FOOD2} alt="Krone Langenburg by Ammesso — Gastraum" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171311]/40 to-transparent" />
            </div>
            <div className="relative rounded-2xl overflow-hidden flex-1 group">
              <img src={IMG_PANORAMA} alt="Panorama Hohenlohe — Krone Langenburg by Ammesso" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171311]/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CHEF ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-5 bg-[#171311]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div className="relative rounded-2xl overflow-hidden h-72 sm:h-[440px] shadow-2xl ring-1 ring-[#B08A42]/20">
            <img
              src="https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp"
              alt="Chef Omar Ammesso — Krone Langenburg by Ammesso"
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171311]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-display text-2xl text-white font-light">Omar Ammesso</p>
              <p className="text-[#B08A42] text-xs tracking-widest font-body mt-1">{c.chef_label}</p>
            </div>
          </div>
          <div>
            <p className="text-[#B08A42] text-[10px] tracking-[0.4em] uppercase font-body mb-4">{c.chef_label}</p>
            <h2 className="font-display text-3xl md:text-4xl font-light text-[#FAF8F5] mb-2">Omar Ammesso</h2>
            <p className="text-[#D7D0C5]/40 text-sm italic font-body mb-6">Omar Ouardaoui</p>
            <blockquote className="border-l-2 border-[#B08A42]/50 pl-5 mb-7 italic font-display text-xl text-[#FAF8F5]/70">
              {lang === 'de' && '"Kochen ist keine Arbeit — es ist Sprache."'}
              {lang === 'en' && '"Cooking is not work — it is language."'}
              {lang === 'it' && '"Cucinare non è lavoro — è linguaggio."'}
            </blockquote>
            <p className="text-[#D7D0C5]/65 font-body text-sm leading-relaxed mb-8">{c.chef_bio}</p>
            <Link to="/story"
              className="inline-flex items-center gap-2 text-[#B08A42] hover:text-[#9E7A38] text-xs tracking-[0.2em] uppercase font-body font-semibold transition-all group">
              {c.story_link} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE NOTES ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-5 bg-[#241A16]">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-[#171311] rounded-2xl p-7 sm:p-8 border border-[#B08A42]/20 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#B08A42]/15 flex items-center justify-center mb-4">
              <Clock className="w-4.5 h-4.5 text-[#B08A42]" />
            </div>
            <h3 className="text-[#FAF8F5] text-base font-body font-semibold mb-3">{c.timing_title}</h3>
            <p className="text-[#D7D0C5]/65 text-sm font-body leading-relaxed">{c.timing_body}</p>
          </div>
          <div className="bg-[#171311] rounded-2xl p-7 sm:p-8 border border-[#B08A42]/20 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#B08A42]/15 flex items-center justify-center mb-4">
              <span className="text-lg">🥗</span>
            </div>
            <h3 className="text-[#FAF8F5] text-base font-body font-semibold mb-3">{c.diets_title}</h3>
            <p className="text-[#D7D0C5]/65 text-sm font-body leading-relaxed">{c.diets_body}</p>
          </div>
        </div>
      </section>

      {/* ── TRUST / FINAL CTA ── */}
      <section className="bg-[#171311] py-14 sm:py-18 px-4 sm:px-5 text-center border-t border-[#B08A42]/10">
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#B08A42] text-[#B08A42]" />)}
        </div>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-[#FAF8F5] mb-4 leading-tight">
          {lang === 'de' ? 'Wir freuen uns auf Sie.' : lang === 'en' ? 'We look forward to seeing you.' : 'Non vediamo l\'ora di vedervi.'}
        </h2>
        <p className="text-[#D7D0C5]/60 text-sm font-body mb-10 max-w-sm mx-auto leading-relaxed">
          {lang === 'de'
            ? 'Buchen Sie Ihren Tisch oder rufen Sie an — wir sind für Sie da.'
            : lang === 'en'
            ? 'Book your table or call us — we\'re here for you.'
            : 'Prenota il tuo tavolo o chiamaci — siamo qui per te.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm sm:max-w-none mx-auto">
          <Link to="/reserve"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 bg-[#B08A42] hover:bg-[#9E7A38] text-white rounded-lg text-xs tracking-[0.15em] uppercase font-body font-bold transition-all shadow-lg hover:-translate-y-px">
            <UtensilsCrossed className="w-4 h-4" />
            {c.cta_reserve}
          </Link>
          <a href={`tel:${s.phone}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 border-2 border-[#B08A42]/40 text-[#B08A42] hover:border-[#B08A42] hover:bg-[#B08A42]/10 rounded-lg text-xs tracking-[0.15em] uppercase font-body font-semibold transition-all">
            <Phone className="w-4 h-4" /> {s.phone}
          </a>
        </div>
      </section>
    </div>
  );
}