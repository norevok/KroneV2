import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { ArrowRight, Check, Star, BedDouble, Coffee, Heart, Calendar } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';

const OFFERS = {
  de: [
    {
      id: 'romantic',
      badge: '💑 Beliebt',
      title: 'Romantik-Auszeit',
      subtitle: 'Für zwei, die sich etwas gönnen',
      description: 'Entfliehen Sie dem Alltag und genießen Sie einen unvergesslichen Aufenthalt zu zweit im historischen Herzen Hohenlohes.',
      price_from: '129',
      per: 'pro Zimmer/Nacht',
      nights_min: 1,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80',
      includes: [
        'Übernachtung im Deluxe Doppelzimmer',
        'Champagner & Schokolade bei Ankunft',
        'Romantisches Frühstück für zwei',
        'Spätes Auschecken bis 12:00 Uhr',
      ],
      color: 'from-rose-950/30 to-charcoal',
    },
    {
      id: 'langenburg',
      badge: '🏰 Regional',
      title: 'Langenburg Entdecker',
      subtitle: 'Geschichte, Natur & Gastlichkeit',
      description: 'Erleben Sie das malerische Langenburg, Schloss Langenburg und die Weite des Jagstals — mit allem Komfort eines stillen Rückzugsorts.',
      price_from: '99',
      per: 'pro Zimmer/Nacht',
      nights_min: 2,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
      includes: [
        'Mindestens 2 Übernachtungen',
        'Frühstück inklusive',
        'Langenburg Schloss-Eintritt (auf Anfrage)',
        'Wanderkarte & Reiseführer',
        'Gratis Parken',
      ],
      color: 'from-emerald-950/30 to-charcoal',
    },
    {
      id: 'wellness',
      badge: '✨ Erholung',
      title: 'Wochenend-Auszeit',
      subtitle: 'Freitag bis Sonntag',
      description: 'Entschleunigen und aufladen: Zwei Nächte in ruhiger Umgebung, kulinarischer Genuss und Zeit für sich selbst.',
      price_from: '119',
      per: 'pro Zimmer/Nacht',
      nights_min: 2,
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&q=80',
      includes: [
        'Fr–So Aufenthalt (2 Nächte)',
        'Frühstück beide Tage',
        'Abendessen im Restaurant (1× inklusive)',
        'Ruhige Lage, keine Mindestlautstärke',
      ],
      color: 'from-amber-950/20 to-charcoal',
    },
    {
      id: 'hochzeit',
      badge: '💍 Hochzeit',
      title: 'Hochzeits-Arrangement',
      subtitle: 'Der schönste Tag Ihres Lebens',
      description: 'Von der Planung bis zur Torte — wir begleiten Ihr Hochzeitswochenende mit Herz, Leidenschaft und persönlicher Aufmerksamkeit.',
      price_from: 'Auf Anfrage',
      per: 'individuell kalkuliert',
      nights_min: null,
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80',
      includes: [
        'Braut-/Bräutigamzimmer',
        'Zimmer für Gäste (Kontingent)',
        'Hochzeitsmenü nach Absprache',
        'Getränkepauschale möglich',
        'Persönliche Eventbetreuung',
      ],
      color: 'from-gold/10 to-charcoal',
    },
  ],
  en: [
    {
      id: 'romantic',
      badge: '💑 Popular',
      title: 'Romantic Getaway',
      subtitle: 'For two who deserve a treat',
      description: 'Escape the everyday and enjoy an unforgettable stay for two in the historic heart of Hohenlohe.',
      price_from: '129',
      per: 'per room/night',
      nights_min: 1,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80',
      includes: [
        'Overnight in Deluxe Double Room',
        'Champagne & chocolates on arrival',
        'Romantic breakfast for two',
        'Late check-out until 12:00',
      ],
      color: 'from-rose-950/30 to-charcoal',
    },
    {
      id: 'langenburg',
      badge: '🏰 Regional',
      title: 'Langenburg Explorer',
      subtitle: 'History, nature & hospitality',
      description: 'Discover picturesque Langenburg, Langenburg Castle and the Jagst valley — with the comfort of a quiet retreat.',
      price_from: '99',
      per: 'per room/night',
      nights_min: 2,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
      includes: [
        'Minimum 2 nights',
        'Breakfast included',
        'Langenburg Castle entry (on request)',
        'Walking map & travel guide',
        'Free parking',
      ],
      color: 'from-emerald-950/30 to-charcoal',
    },
    {
      id: 'wellness',
      badge: '✨ Relaxation',
      title: 'Weekend Escape',
      subtitle: 'Friday to Sunday',
      description: 'Slow down and recharge: two nights in peaceful surroundings, culinary delights and time for yourself.',
      price_from: '119',
      per: 'per room/night',
      nights_min: 2,
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&q=80',
      includes: [
        'Fri–Sun stay (2 nights)',
        'Breakfast both days',
        'Dinner in restaurant (1× included)',
        'Peaceful setting',
      ],
      color: 'from-amber-950/20 to-charcoal',
    },
    {
      id: 'hochzeit',
      badge: '💍 Wedding',
      title: 'Wedding Package',
      subtitle: 'The most beautiful day of your life',
      description: 'From planning to cake — we accompany your wedding weekend with heart, passion and personal attention.',
      price_from: 'On request',
      per: 'individually calculated',
      nights_min: null,
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80',
      includes: [
        'Bridal room',
        'Guest rooms (contingent)',
        'Wedding menu by arrangement',
        'Drinks package available',
        'Personal event management',
      ],
      color: 'from-gold/10 to-charcoal',
    },
  ],
};

export default function Offers() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;
  const offers = OFFERS[lang] || OFFERS.de;

  const T = {
    de: {
      eyebrow: 'Arrangements & Angebote',
      title: 'Besondere Momente, perfekt geplant.',
      sub: 'Ob Romantik-Wochenende, Entdecker-Pause oder Traumhochzeit — wir schnüren das passende Arrangement für Sie.',
      book_cta: 'Jetzt anfragen',
      rooms_cta: 'Alle Zimmer ansehen',
      from: 'Ab',
      per_room: 'pro Zimmer',
      includes_label: 'Leistungen',
      nights: n => n === 1 ? 'ab 1 Nacht' : `ab ${n} Nächten`,
      inquiry_note: 'Individuelle Wünsche? Wir erstellen Ihnen gerne ein persönliches Angebot.',
      contact_cta: 'Persönliches Angebot anfragen',
    },
    en: {
      eyebrow: 'Packages & Offers',
      title: 'Special moments, perfectly planned.',
      sub: 'Whether a romantic weekend, explorer break or dream wedding — we create the right arrangement for you.',
      book_cta: 'Enquire Now',
      rooms_cta: 'View All Rooms',
      from: 'From',
      per_room: 'per room',
      includes_label: 'Includes',
      nights: n => n === 1 ? 'from 1 night' : `from ${n} nights`,
      inquiry_note: 'Individual wishes? We\'d love to create a personal offer for you.',
      contact_cta: 'Request personal offer',
    },
  };
  const t = T[lang] || T.de;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pb-24 lg:pb-10">

      {/* Hero */}
      <div className="relative overflow-hidden bg-espresso pt-20 sm:pt-28 pb-14 sm:pb-20 px-5 border-b border-[#C9A96E]/10">
        <img
          src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=60"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none select-none"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/70 to-espresso" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-gold/40" />
            <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-body">Krone Langenburg by Ammesso</p>
            <div className="h-px w-8 bg-gold/40" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-ivory mb-4 leading-[0.95]">
            {t.title}
          </h1>
          <p className="text-ivory/50 font-body text-sm sm:text-base max-w-xl mx-auto leading-relaxed">{t.sub}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-10 sm:py-16 space-y-10 sm:space-y-14">

        {offers.map((offer, idx) => {
          const isReversed = idx % 2 === 1;
          return (
            <div key={offer.id}
              className="glass-card border border-[#C9A96E]/10 rounded-3xl overflow-hidden hover:border-[#C9A96E]/20 transition-all duration-300">
              <div className={`grid grid-cols-1 lg:grid-cols-2 ${isReversed ? 'lg:grid-flow-dense' : ''}`}>

                {/* Image */}
                <div className={`relative h-64 sm:h-80 lg:h-auto lg:min-h-[360px] overflow-hidden group ${isReversed ? 'lg:col-start-2' : ''}`}>
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 bg-charcoal/70 backdrop-blur-sm border border-[#C9A96E]/20 rounded-full px-3 py-1.5 text-xs font-body text-gold/80">
                    {offer.badge}
                  </span>
                  {offer.nights_min && (
                    <span className="absolute bottom-4 right-4 bg-charcoal/70 backdrop-blur-sm border border-[#C9A96E]/20 rounded-full px-3 py-1.5 text-[10px] font-body text-ivory/60 uppercase tracking-wider">
                      {t.nights(offer.nights_min)}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className={`p-6 sm:p-8 md:p-10 flex flex-col justify-center ${isReversed ? 'lg:col-start-1' : ''}`}>
                  <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-2">{offer.subtitle}</p>
                  <h2 className="font-display text-3xl md:text-4xl font-light text-ivory mb-4 leading-tight">
                    {offer.title}
                  </h2>
                  <p className="text-ivory/55 text-sm font-body leading-relaxed mb-6">
                    {offer.description}
                  </p>

                  {/* Includes */}
                  <div className="mb-7">
                    <p className="text-ivory/30 text-[10px] tracking-[0.25em] uppercase font-body mb-3">{t.includes_label}</p>
                    <ul className="space-y-2">
                      {offer.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-body text-ivory/60">
                          <Check className="w-3.5 h-3.5 text-gold/60 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div>
                      {offer.price_from !== 'Auf Anfrage' && offer.price_from !== 'On request' ? (
                        <>
                          <p className="text-ivory/30 text-[10px] uppercase tracking-widest font-body">{t.from}</p>
                          <p className="font-display text-4xl font-light text-gold leading-none">€{offer.price_from}</p>
                          <p className="text-ivory/30 text-xs font-body mt-1">{offer.per}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-ivory/30 text-[10px] uppercase tracking-widest font-body mb-1">Preis</p>
                          <p className="font-display text-2xl font-light text-gold">{offer.price_from}</p>
                        </>
                      )}
                    </div>
                    <Link
                      to={offer.id === 'hochzeit' ? '/weddings' : '/rooms'}
                      className="inline-flex items-center gap-2 px-6 py-3 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold"
                    >
                      {t.book_cta} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Personal offer CTA */}
        <div className="glass-card border border-[#C9A96E]/15 rounded-2xl p-8 sm:p-10 text-center">
          <Star className="w-6 h-6 text-gold/50 mx-auto mb-4" />
          <h3 className="font-display text-2xl sm:text-3xl font-light text-ivory mb-3">{t.inquiry_note}</h3>
          <p className="text-ivory/40 text-sm font-body mb-7 max-w-md mx-auto">
            {lang === 'de'
              ? 'Jeder Aufenthalt ist einzigartig. Wir freuen uns auf Ihre Nachricht und erstellen Ihnen ein maßgeschneidertes Angebot.'
              : 'Every stay is unique. We look forward to your message and will create a tailor-made offer for you.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to="/contact"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold shadow-gold-glow">
              <Heart className="w-3.5 h-3.5" /> {t.contact_cta}
            </Link>
            <a href={`tel:${s.phone}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 btn-ghost-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
              {s.phone}
            </a>
          </div>
        </div>

        {/* Rooms teaser */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 glass-card border border-[#C9A96E]/08 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
              <BedDouble className="w-5 h-5 text-gold/60" />
            </div>
            <div>
              <p className="text-ivory/70 font-body font-medium">
                {lang === 'de' ? 'Unsere Zimmer & Suiten' : 'Our Rooms & Suites'}
              </p>
              <p className="text-ivory/30 text-xs font-body">
                {lang === 'de' ? 'Deluxe Einzelzimmer · Doppelzimmer · King Suite' : 'Deluxe Single · Double · King Suite'}
              </p>
            </div>
          </div>
          <Link to="/rooms"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 btn-ghost-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
            {t.rooms_cta} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}