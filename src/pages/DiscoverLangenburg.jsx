import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { ArrowRight, MapPin, Camera, Compass, Mountain, Wine, Castle } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';

const ATTRACTIONS = [
  {
    id: 'schloss',
    icon: Castle,
    image: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=80',
    de: { title: 'Schloss Langenburg', desc: 'Das fürstliche Schloss Langenburg thront majestätisch über dem Jagsttal und zählt zu den beeindruckendsten Barockschlössern Baden-Württembergs. Geführte Touren, Ausstellungen und eine atemberaubende Aussicht über das Hohenloher Land erwarten Sie.', tag: '5 min zu Fuß' },
    en: { title: 'Langenburg Castle', desc: 'The princely Langenburg Castle majestically overlooks the Jagst valley and is one of the most impressive Baroque castles in Baden-Württemberg. Guided tours, exhibitions and breathtaking views over the Hohenlohe countryside await you.', tag: '5 min walk' },
  },
  {
    id: 'jagsttal',
    icon: Mountain,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    de: { title: 'Jagsttal & Wanderungen', desc: 'Das Jagsttal gehört zu den schönsten Flusstälern Süddeutschlands. Malerische Wanderwege führen durch Wiesen, Wälder und historische Dörfer. Der Jagsttalweg verbindet auf über 200 km Kilometer Natur und Kultur.', tag: 'Wanderparadies' },
    en: { title: 'Jagst Valley & Hiking', desc: 'The Jagst valley is one of the most beautiful river valleys in southern Germany. Scenic hiking trails lead through meadows, forests and historic villages. The Jagst Valley Trail connects over 200 km of nature and culture.', tag: 'Hiking paradise' },
  },
  {
    id: 'altstadt',
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    de: { title: 'Altstadt Langenburg', desc: 'Die malerische Altstadt Langenburgs lädt zum Spazieren und Entdecken ein. Historische Fachwerkhäuser, gepflasterte Gassen und eine entspannte Atmosphäre machen Langenburg zu einem der schönsten kleinen Städte Hohenlohes.', tag: 'Stadtspaziergang' },
    en: { title: 'Langenburg Old Town', desc: 'The picturesque old town of Langenburg invites you to stroll and discover. Historic half-timbered houses, cobbled alleys and a relaxed atmosphere make Langenburg one of the most beautiful small towns in Hohenlohe.', tag: 'Town walk' },
  },
  {
    id: 'wein',
    icon: Wine,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    de: { title: 'Hohenloher Wein & Genuss', desc: 'Die Region Hohenlohe ist für ihre Weinbaukultur bekannt. Entdecken Sie lokale Weingüter, Straußenwirtschaften und kulinarische Besonderheiten der Region. Paaren Sie den Weingenuss mit einem Abendessen bei uns im Kulinarium.', tag: 'Weinkultur' },
    en: { title: 'Hohenlohe Wine & Pleasure', desc: 'The Hohenlohe region is known for its wine culture. Discover local wineries, seasonal wine taverns and culinary specialities of the region. Pair wine enjoyment with an evening dinner at our Kulinarium.', tag: 'Wine culture' },
  },
  {
    id: 'ausflug',
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80',
    de: { title: 'Ausflugsziele in der Nähe', desc: 'Langenburg ist idealer Ausgangspunkt für Tagesausflüge nach Schwäbisch Hall, Bad Mergentheim, Rothenburg ob der Tauber oder in den Schwarzwald. Alle sind bequem in unter zwei Stunden erreichbar.', tag: 'Tagesausflüge' },
    en: { title: 'Day Trip Destinations Nearby', desc: 'Langenburg is the ideal base for day trips to Schwäbisch Hall, Bad Mergentheim, Rothenburg ob der Tauber or the Black Forest. All are easily reachable within two hours.', tag: 'Day trips' },
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

export default function DiscoverLangenburg() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;

  const T = {
    de: {
      eyebrow: 'Langenburg & Hohenlohe',
      title: 'Entdecken Sie eine der schönsten Ecken Deutschlands.',
      sub: 'Langenburg liegt im Herzen Hohenlohes — umgeben von Wäldern, Weinbergen, historischen Schlössern und einer der malerischsten Flusslandschaften Süddeutschlands.',
      how_label: 'Anfahrt & Lage',
      address_note: 'Wir befinden uns direkt im Ortskern von Langenburg.',
      nearby_title: 'Entfernungen',
      cta_rooms: 'Zimmer buchen',
      cta_contact: 'Kontakt',
      directions_label: 'Route planen',
      map_note: 'Langenburg, Baden-Württemberg · Mitten in Hohenlohe',
    },
    en: {
      eyebrow: 'Langenburg & Hohenlohe',
      title: 'Discover one of the most beautiful corners of Germany.',
      sub: 'Langenburg is located in the heart of Hohenlohe — surrounded by forests, vineyards, historic castles and one of the most picturesque river landscapes in southern Germany.',
      how_label: 'Getting Here',
      address_note: 'We are located right in the centre of Langenburg.',
      nearby_title: 'Distances',
      cta_rooms: 'Book a Room',
      cta_contact: 'Contact',
      directions_label: 'Get Directions',
      map_note: 'Langenburg, Baden-Württemberg · In the heart of Hohenlohe',
    },
  };
  const t = T[lang] || T.de;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pb-24 lg:pb-10">

      {/* Hero */}
      <div className="relative h-[55vh] sm:h-[65vh] min-h-[360px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85"
          alt="Hohenlohe Landschaft"
          className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/20 to-charcoal" />
        <div className="absolute inset-0 flex items-end pb-12 px-5">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold/40" />
              <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-body">{t.eyebrow}</p>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-light text-ivory mb-4 leading-[0.95] max-w-3xl">
              {t.title}
            </h1>
            <p className="text-ivory/55 font-body text-sm sm:text-base leading-relaxed max-w-xl">{t.sub}</p>
          </div>
        </div>
      </div>

      {/* Attractions */}
      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-12 sm:py-16">
        <div className="space-y-8 sm:space-y-10">
          {ATTRACTIONS.map((att, idx) => {
            const content = att[lang] || att.de;
            const isReversed = idx % 2 === 1;
            return (
              <div key={att.id}
                className="glass-card border border-[#C9A96E]/08 rounded-3xl overflow-hidden hover:border-[#C9A96E]/18 transition-all duration-300">
                <div className={`grid grid-cols-1 md:grid-cols-2 ${isReversed ? 'md:grid-flow-dense' : ''}`}>
                  {/* Image */}
                  <div className={`relative h-56 sm:h-72 md:h-auto md:min-h-[280px] overflow-hidden group ${isReversed ? 'md:col-start-2' : ''}`}>
                    <img
                      src={att.image}
                      alt={content.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
                    <span className="absolute top-4 left-4 bg-charcoal/70 backdrop-blur-sm border border-[#C9A96E]/20 rounded-full px-3 py-1.5 text-[10px] font-body text-gold/70 tracking-wider uppercase">
                      {content.tag}
                    </span>
                  </div>
                  {/* Text */}
                  <div className={`p-6 sm:p-8 flex flex-col justify-center ${isReversed ? 'md:col-start-1' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
                      <att.icon className="w-4 h-4 text-gold/70" />
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-light text-ivory mb-3">{content.title}</h2>
                    <p className="text-ivory/55 text-sm font-body leading-relaxed">{content.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Getting here */}
        <div className="mt-14 sm:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Map */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gold/60" />
                <h2 className="font-display text-2xl font-light text-ivory">{t.how_label}</h2>
              </div>
              <p className="text-ivory/40 text-sm font-body mb-4">{t.address_note}</p>
              <div className="rounded-2xl overflow-hidden border border-[#C9A96E]/10 h-[300px] sm:h-[380px]">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen=""
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyA-OPJc_4CvKv_S8YToDdmlS9hE7f1R1AU&q=${encodeURIComponent('Hauptstraße 24, 74595 Langenburg, Germany')}&zoom=14`}
                  title="Krone Langenburg Lage"
                />
              </div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Hauptstra%C3%9Fe+24%2C+74595+Langenburg"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-gold/60 hover:text-gold text-xs font-body tracking-wider transition-colors"
              >
                {t.directions_label} →
              </a>
            </div>

            {/* Distances */}
            <div>
              <h3 className="font-display text-2xl font-light text-ivory mb-5">{t.nearby_title}</h3>
              <div className="space-y-2">
                {NEARBY.map((n, i) => (
                  <div key={i} className="glass-card border border-[#C9A96E]/08 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-ivory/60 text-sm font-body">{lang === 'de' ? n.de : n.en}</span>
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-ivory/30 text-xs font-body">{n.km}</span>
                      <span className="text-gold/60 text-xs font-body border border-gold/20 rounded-full px-2 py-0.5">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Address card */}
              <div className="mt-5 glass-card border border-[#C9A96E]/10 rounded-xl p-5">
                <p className="text-ivory/30 text-[10px] uppercase tracking-widest font-body mb-3">Adresse</p>
                <p className="text-ivory font-body text-sm leading-relaxed">
                  Krone Langenburg by Ammesso<br />
                  {s.address_street}<br />
                  {s.address_zip} {s.address_city}<br />
                  {s.address_country}
                </p>
                <div className="mt-4 pt-3 border-t border-[#C9A96E]/08 space-y-1.5">
                  <a href={`tel:${s.phone}`} className="block text-gold/60 hover:text-gold text-sm font-body transition-colors">{s.phone}</a>
                  <a href={`mailto:${s.email_info}`} className="block text-gold/60 hover:text-gold text-sm font-body transition-colors">{s.email_info}</a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CTA strip */}
        <div className="mt-12 glass-card border border-[#C9A96E]/15 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-display text-2xl font-light text-ivory mb-1">
              {lang === 'de' ? 'Bereit für Ihren Aufenthalt?' : 'Ready for your stay?'}
            </p>
            <p className="text-ivory/40 text-sm font-body">
              {lang === 'de' ? 'Buchen Sie direkt bei uns — ohne Gebühren, mit persönlichem Service.' : 'Book directly with us — no fees, with personal service.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link to="/rooms" className="flex items-center gap-1.5 px-6 py-3 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
              {t.cta_rooms} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/contact" className="flex items-center gap-1.5 px-6 py-3 btn-ghost-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
              {t.cta_contact}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}