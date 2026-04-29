import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';

const COOKIE_KEY = 'krone_cookie_consent';

export default function CookieBanner() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics: true, marketing: true, ts: Date.now() }));
    setVisible(false);
  }

  function reject() {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics: false, marketing: false, ts: Date.now() }));
    setVisible(false);
  }

  if (!visible) return null;

  const T = {
    de: {
      title: 'Datenschutzeinstellungen',
      text: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Essentielle Cookies sind immer aktiv. Optionale Cookies helfen uns, die Website zu analysieren.',
      accept: 'Alle akzeptieren',
      reject: 'Nur essentielle',
      privacy: 'Datenschutzerklärung',
      imprint: 'Impressum',
    },
    en: {
      title: 'Privacy Settings',
      text: 'We use cookies to improve your experience. Essential cookies are always active. Optional cookies help us analyse the website.',
      accept: 'Accept All',
      reject: 'Essential Only',
      privacy: 'Privacy Policy',
      imprint: 'Impressum',
    },
    it: {
      title: 'Impostazioni privacy',
      text: 'Utilizziamo i cookie per migliorare la tua esperienza. I cookie essenziali sono sempre attivi. I cookie opzionali ci aiutano ad analizzare il sito.',
      accept: 'Accetta tutto',
      reject: 'Solo essenziali',
      privacy: 'Privacy',
      imprint: 'Note legali',
    },
  };
  const tx = T[lang] || T.de;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-3 sm:p-5 pointer-events-none">
      <div className="max-w-2xl mx-auto bg-charcoal border border-[#C9A96E]/20 rounded-2xl shadow-2xl p-5 sm:p-6 pointer-events-auto">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex-1 min-w-0">
            <p className="font-display text-base font-light text-ivory mb-1">{tx.title}</p>
            <p className="text-ivory/50 text-xs font-body leading-relaxed">{tx.text}{' '}
              <Link to="/privacy" className="text-gold-light underline underline-offset-2 hover:text-gold transition-colors">{tx.privacy}</Link>
              {' · '}
              <Link to="/legal" className="text-gold-light underline underline-offset-2 hover:text-gold transition-colors">{tx.imprint}</Link>
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={reject}
              className="px-4 py-2.5 border border-ivory/20 text-ivory/60 hover:text-ivory hover:border-ivory/40 rounded-full text-xs font-body tracking-widest uppercase transition-all">
              {tx.reject}
            </button>
            <button onClick={accept}
              className="px-5 py-2.5 bg-gold hover:bg-[#7A5A0F] text-white rounded-full text-xs font-body font-semibold tracking-widest uppercase transition-all shadow-lg">
              {tx.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}