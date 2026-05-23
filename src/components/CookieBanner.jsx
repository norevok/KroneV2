import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { X, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const COOKIE_KEY = 'krone_cookie_consent_v2';

export default function CookieBanner() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) setVisible(true);
  }, []);

  async function saveConsent(analyticsVal, marketingVal) {
    const data = { analytics: analyticsVal, marketing: marketingVal, ts: Date.now(), version: 2 };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(data));
    setVisible(false);
    // Log consent (non-blocking, best-effort)
    try {
      const user = await base44.auth.me().catch(() => null);
      base44.entities.ConsentLog.create({
        user_email: user?.email || 'anonymous',
        consent_type: 'cookies_analytics',
        consent_given: analyticsVal || marketingVal,
        consent_text: `analytics:${analyticsVal}, marketing:${marketingVal}`,
        source_page: window.location.pathname,
        source_form: 'cookie_banner',
        language: lang,
        consented_at: new Date().toISOString(),
      }).catch(() => {});
    } catch (_) {}
  }

  if (!visible) return null;

  const T = {
    de: {
      title: 'Ihre Privatsphäre',
      text: 'Wir verwenden Cookies, um Ihnen das beste Erlebnis auf unserer Website zu bieten. Essentielle Cookies sind immer aktiv. Optionale Cookies helfen uns, unsere Website zu verbessern.',
      essential_title: 'Essentielle Cookies',
      essential_desc: 'Immer aktiv. Notwendig für die Grundfunktionen der Website.',
      analytics_title: 'Analyse-Cookies',
      analytics_desc: 'Helfen uns zu verstehen, wie Besucher die Website nutzen.',
      marketing_title: 'Marketing-Cookies',
      marketing_desc: 'Ermöglichen personalisierte Werbung und Social Media-Funktionen.',
      accept_all: 'Alle akzeptieren',
      essential_only: 'Nur notwendige',
      save: 'Auswahl speichern',
      settings: 'Einstellungen',
      privacy: 'Datenschutzerklärung',
      imprint: 'Impressum',
      always_on: 'Immer aktiv',
    },
    en: {
      title: 'Your Privacy',
      text: 'We use cookies to give you the best experience. Essential cookies are always active. Optional cookies help us improve our website.',
      essential_title: 'Essential Cookies',
      essential_desc: 'Always active. Required for the basic functions of the website.',
      analytics_title: 'Analytics Cookies',
      analytics_desc: 'Help us understand how visitors use the website.',
      marketing_title: 'Marketing Cookies',
      marketing_desc: 'Enable personalised advertising and social media features.',
      accept_all: 'Accept All',
      essential_only: 'Essential Only',
      save: 'Save Preferences',
      settings: 'Settings',
      privacy: 'Privacy Policy',
      imprint: 'Impressum',
      always_on: 'Always on',
    },
    it: {
      title: 'La tua privacy',
      text: 'Utilizziamo cookie per offrirti la migliore esperienza. I cookie essenziali sono sempre attivi. I cookie opzionali ci aiutano a migliorare il sito.',
      essential_title: 'Cookie essenziali',
      essential_desc: 'Sempre attivi. Necessari per le funzioni di base del sito.',
      analytics_title: 'Cookie analitici',
      analytics_desc: 'Ci aiutano a capire come i visitatori usano il sito.',
      marketing_title: 'Cookie di marketing',
      marketing_desc: 'Consentono pubblicità personalizzata e funzioni social.',
      accept_all: 'Accetta tutto',
      essential_only: 'Solo essenziali',
      save: 'Salva preferenze',
      settings: 'Impostazioni',
      privacy: 'Privacy',
      imprint: 'Note legali',
      always_on: 'Sempre attivo',
    },
  };
  const tx = T[lang] || T.de;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center pointer-events-none px-3 sm:px-4 pb-3 sm:pb-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#151515]/40 backdrop-blur-[2px] pointer-events-auto" />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl pointer-events-auto border border-[#E8DED0] overflow-hidden">

        {/* Gold accent top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#A47A12] via-[#C9A96E] to-[#A47A12]" />

        <div className="p-6 sm:p-7">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#A47A12]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-4 h-4 text-[#A47A12]" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-[#151515]">{tx.title}</h2>
              <p className="text-[#5F5A52] text-sm font-body leading-relaxed mt-1">{tx.text}</p>
            </div>
          </div>

          {/* Details toggle */}
          <button
            onClick={() => setShowDetails(d => !d)}
            className="flex items-center gap-1.5 text-[#A47A12] text-xs font-body font-semibold tracking-wider uppercase mb-4 hover:text-[#8B6914] transition-colors">
            {tx.settings}
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Cookie categories */}
          {showDetails && (
            <div className="space-y-3 mb-5 border border-[#E8DED0] rounded-xl p-4 bg-[#F7F2EA]">
              {/* Essential */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[#151515] text-sm font-body font-semibold">{tx.essential_title}</p>
                  <p className="text-[#5F5A52] text-xs font-body mt-0.5">{tx.essential_desc}</p>
                </div>
                <span className="text-[#17352C] text-[10px] font-body font-semibold bg-[#17352C]/10 px-2.5 py-1 rounded-full flex-shrink-0 border border-[#17352C]/20">{tx.always_on}</span>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4 pt-3 border-t border-[#E8DED0]">
                <div>
                  <p className="text-[#151515] text-sm font-body font-semibold">{tx.analytics_title}</p>
                  <p className="text-[#5F5A52] text-xs font-body mt-0.5">{tx.analytics_desc}</p>
                </div>
                <button
                  onClick={() => setAnalytics(v => !v)}
                  className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 border-2 ${analytics ? 'bg-[#17352C] border-[#17352C]' : 'bg-[#E8DED0] border-[#E8DED0]'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${analytics ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between gap-4 pt-3 border-t border-[#E8DED0]">
                <div>
                  <p className="text-[#151515] text-sm font-body font-semibold">{tx.marketing_title}</p>
                  <p className="text-[#5F5A52] text-xs font-body mt-0.5">{tx.marketing_desc}</p>
                </div>
                <button
                  onClick={() => setMarketing(v => !v)}
                  className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 border-2 ${marketing ? 'bg-[#17352C] border-[#17352C]' : 'bg-[#E8DED0] border-[#E8DED0]'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${marketing ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => saveConsent(false, false)}
              className="flex-1 py-3 border-2 border-[#E8DED0] text-[#5F5A52] hover:border-[#151515] hover:text-[#151515] rounded-xl text-xs font-body font-semibold tracking-wider uppercase transition-all">
              {tx.essential_only}
            </button>
            {showDetails && (
              <button
                onClick={() => saveConsent(analytics, marketing)}
                className="flex-1 py-3 bg-[#17352C] hover:bg-[#0F2920] text-white rounded-xl text-xs font-body font-semibold tracking-wider uppercase transition-all">
                {tx.save}
              </button>
            )}
            <button
              onClick={() => saveConsent(true, true)}
              className="flex-1 py-3 bg-[#A47A12] hover:bg-[#8B6914] text-white rounded-xl text-xs font-body font-semibold tracking-wider uppercase transition-all shadow-md">
              {tx.accept_all}
            </button>
          </div>

          {/* Legal links */}
          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-[#E8DED0]">
            <Link to="/privacy" className="text-[#A47A12] text-xs font-body hover:underline underline-offset-2">{tx.privacy}</Link>
            <span className="text-[#E8DED0]">·</span>
            <Link to="/legal" className="text-[#A47A12] text-xs font-body hover:underline underline-offset-2">{tx.imprint}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}