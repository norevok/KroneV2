import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { MENU_DATA } from '@/lib/siteData';
import { UtensilsCrossed, ArrowRight, Info } from 'lucide-react';

function PriceTag({ price, priceWith, optionDe, optionEn, optionIt, lang }) {
  if (priceWith) {
    return (
      <div className="text-right flex-shrink-0 ml-4">
        <p className="text-[#1C1714] font-body font-semibold text-base">€{price.toFixed(2)}</p>
        <p className="text-[#8B6914] font-body font-semibold text-sm mt-0.5">€{priceWith.toFixed(2)}</p>
        <p className="text-[#4A3F35]/50 text-[10px] font-body leading-tight">
          {lang === 'de' ? optionDe : lang === 'en' ? optionEn : optionIt}
        </p>
      </div>
    );
  }
  return (
    <p className="text-[#1C1714] font-body font-semibold text-base flex-shrink-0 ml-4">
      {price ? `€${price.toFixed(2)}` : ''}
    </p>
  );
}

function MenuItem({ item, lang }) {
  const name = lang === 'de' ? item.name_de : lang === 'en' ? item.name_en : item.name_it;
  const desc = lang === 'de' ? item.desc_de : lang === 'en' ? item.desc_en : item.desc_it;
  return (
    <div className="flex items-start justify-between py-5 border-b border-[#EDE6D8] last:border-b-0 group">
      <div className="flex-1 min-w-0 pr-2">
        <p className="font-display text-lg font-light text-[#1C1714] group-hover:text-[#8B6914] transition-colors leading-snug">{name}</p>
        {desc && <p className="text-[#4A3F35]/65 text-sm font-body leading-relaxed mt-1">{desc}</p>}
      </div>
      <PriceTag
        price={item.price}
        priceWith={item.price_with}
        optionDe={item.option_de} optionEn={item.option_en} optionIt={item.option_it}
        lang={lang}
      />
    </div>
  );
}

function MenuSection({ title, eyebrow, items, lang, showCTA = false }) {
  return (
    <div className="mb-14">
      <div className="mb-6">
        {eyebrow && <p className="text-[#8B6914] text-[10px] tracking-[0.4em] uppercase font-body font-medium mb-2">{eyebrow}</p>}
        <h2 className="font-display text-3xl sm:text-4xl font-light text-[#1C1714]">{title}</h2>
        <div className="w-10 h-px bg-[#8B6914]/40 mt-3" />
      </div>
      <div className="bg-white border border-[#EDE6D8] rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y-0 px-6 sm:px-8 py-2">
          {items.map((item, i) => <MenuItem key={i} item={item} lang={lang} />)}
        </div>
      </div>
      {showCTA && (
        <div className="mt-6 text-center">
          <Link to="/reserve" className="inline-flex items-center gap-2 px-7 py-3 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-full text-sm font-body font-semibold tracking-widest uppercase transition-all">
            <UtensilsCrossed className="w-4 h-4" />
            {lang === 'de' ? 'Tisch reservieren' : lang === 'en' ? 'Reserve a Table' : 'Prenota un tavolo'}
          </Link>
        </div>
      )}
    </div>
  );
}

const DRINKS = {
  de: [
    { name_de: 'Aperol Spritz', desc_de: 'Aperol, Prosecco, Soda', price: 7.5 },
    { name_de: 'Prosecco', desc_de: 'Glas', price: 5.5 },
    { name_de: 'Wein des Hauses', desc_de: 'Weiß oder Rot, 0,2 l', price: 5.0 },
    { name_de: 'Bier vom Fass', desc_de: '0,3 l', price: 4.2 },
    { name_de: 'Softdrinks', desc_de: 'Wasser, Cola, Limo, 0,3 l', price: 3.5 },
    { name_de: 'Kaffee / Espresso', price: 2.8 },
    { name_de: 'Cappuccino', price: 3.5 },
  ],
  en: [
    { name_de: 'Aperol Spritz', name_en: 'Aperol Spritz', desc_en: 'Aperol, Prosecco, Soda', price: 7.5 },
    { name_de: 'Prosecco', name_en: 'Prosecco', desc_en: 'Glass', price: 5.5 },
    { name_de: 'House Wine', name_en: 'House Wine', desc_en: 'White or Red, 0.2 l', price: 5.0 },
    { name_de: 'Draught Beer', name_en: 'Draught Beer', desc_en: '0.3 l', price: 4.2 },
    { name_de: 'Soft Drinks', name_en: 'Soft Drinks', desc_en: 'Water, Cola, Lemonade, 0.3 l', price: 3.5 },
    { name_de: 'Coffee / Espresso', name_en: 'Coffee / Espresso', price: 2.8 },
    { name_de: 'Cappuccino', name_en: 'Cappuccino', price: 3.5 },
  ],
};

export default function MenuPage() {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState('food');

  const TABS = [
    { id: 'food', de: 'Speisen', en: 'Food' },
    { id: 'drinks', de: 'Getränke', en: 'Drinks' },
  ];

  const SECTIONS_FOOD = [
    {
      id: 'starters',
      eyebrow_de: 'Zum Anfangen', eyebrow_en: 'To Start',
      title_de: 'Antipasti & Vorspeisen', title_en: 'Starters & Appetisers',
      items: MENU_DATA.starters,
    },
    {
      id: 'mains',
      eyebrow_de: 'Pasta & Hauptgerichte', eyebrow_en: 'Pasta & Mains',
      title_de: 'Unsere Pasta & Gerichte', title_en: 'Our Pasta & Dishes',
      items: MENU_DATA.mains,
      showCTA: true,
    },
    {
      id: 'meat_fish',
      eyebrow_de: 'Fleisch & Fisch', eyebrow_en: 'Meat & Fish',
      title_de: 'Fleisch & Fisch', title_en: 'Meat & Fish',
      items: MENU_DATA.meat_fish,
    },
    {
      id: 'sides',
      eyebrow_de: 'Beilagen', eyebrow_en: 'Sides',
      title_de: 'Beilagen', title_en: 'Side Dishes',
      items: MENU_DATA.sides,
    },
    {
      id: 'desserts',
      eyebrow_de: 'Süßes', eyebrow_en: 'Desserts',
      title_de: 'Desserts & Dolci', title_en: 'Desserts & Dolci',
      items: MENU_DATA.desserts,
      showCTA: true,
    },
  ];

  const drinkItems = DRINKS[lang] || DRINKS.de;

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#1C1714]">

      {/* Hero */}
      <div className="relative bg-[#1C1714] page-top pb-12 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=70"
          alt="Krone Langenburg by Ammesso Restaurant" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1714]/50 to-[#1C1714]/90" />
        <div className="relative text-center px-5 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-[#C9A96E]/50" />
            <p className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-body">Krone Langenburg by Ammesso</p>
            <div className="h-px w-8 bg-[#C9A96E]/50" />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-light text-white mb-4 leading-tight">
            {lang === 'de' ? 'Unsere Speisekarte' : lang === 'en' ? 'Our Menu' : 'La Nostra Carta'}
          </h1>
          <p className="text-white/55 font-body text-base">
            {lang === 'de' ? 'Mediterrane Küche · Hausgemachte Pasta · Saisonale Zutaten' : 'Mediterranean cuisine · Handmade pasta · Seasonal ingredients'}
          </p>
        </div>
      </div>

      {/* Sticky tab bar */}
      <div className="sticky top-[var(--nav-h-mobile)] lg:top-[var(--nav-h-desktop)] z-30 bg-white border-b border-[#EDE6D8] shadow-sm">
        <div className="max-w-4xl mx-auto px-5">
          <div className="flex gap-1 py-2">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-body font-semibold tracking-widest uppercase transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#8B6914] text-white shadow-sm'
                    : 'text-[#1C1714]/50 hover:text-[#1C1714] hover:bg-[#F7F3EC]'
                }`}>
                {lang === 'de' ? tab.de : tab.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-14">

        {activeTab === 'food' && (
          <>
            {SECTIONS_FOOD.map(section => (
              <MenuSection
                key={section.id}
                eyebrow={lang === 'de' ? section.eyebrow_de : section.eyebrow_en}
                title={lang === 'de' ? section.title_de : section.title_en}
                items={section.items}
                lang={lang}
                showCTA={section.showCTA}
              />
            ))}
          </>
        )}

        {activeTab === 'drinks' && (
          <MenuSection
            eyebrow={lang === 'de' ? 'Getränke' : 'Drinks'}
            title={lang === 'de' ? 'Getränkekarte' : 'Drinks Menu'}
            items={drinkItems}
            lang={lang}
            showCTA
          />
        )}

        {/* Allergen note */}
        <div className="mt-4 flex items-start gap-3 bg-white border border-[#EDE6D8] rounded-2xl p-5 text-sm font-body text-[#4A3F35]/70">
          <Info className="w-4 h-4 text-[#8B6914]/60 flex-shrink-0 mt-0.5" />
          <p>
            {lang === 'de'
              ? 'Informationen zu Allergenen und Unverträglichkeiten erhalten Sie auf Anfrage von unserem Personal. Preise inkl. MwSt.'
              : 'Information on allergens and intolerances is available on request from our staff. Prices include VAT.'}
          </p>
        </div>

        {/* Reserve CTA */}
        <div className="mt-12 bg-[#1C1714] rounded-3xl p-8 sm:p-10 text-center">
          <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-3">Krone Langenburg by Ammesso</p>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-3">
            {lang === 'de' ? 'Tisch reservieren' : 'Reserve a Table'}
          </h2>
          <p className="text-white/50 font-body text-base mb-7">
            {lang === 'de' ? 'Di–Sa: 12–14:30 & 18–22:30 Uhr · So: 12–21 Uhr · Mo: Ruhetag' : 'Tue–Sat: 12–14:30 & 18:00–22:30 · Sun: 12–21 · Mon: Closed'}
          </p>
          <Link to="/reserve" className="inline-flex items-center gap-2.5 px-9 py-4 bg-[#8B6914] hover:bg-[#7A5A0F] text-white rounded-full text-sm font-body font-semibold tracking-widest uppercase transition-all shadow-lg">
            <UtensilsCrossed className="w-4 h-4" />
            {lang === 'de' ? 'Jetzt reservieren' : 'Reserve Now'}
          </Link>
        </div>

      </div>
    </div>
  );
}