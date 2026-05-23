import { useState, useEffect, useCallback } from 'react';
import { t } from './i18n';

const LANG_KEY = 'krone_lang';
const SUPPORTED = ['de', 'en', 'it', 'es'];

export function useLang() {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    const browser = navigator.language?.slice(0, 2);
    if (SUPPORTED.includes(browser)) return browser;
    return 'de';
  });

  const setLang = useCallback((l) => {
    if (SUPPORTED.includes(l)) {
      localStorage.setItem(LANG_KEY, l);
      setLangState(l);
    }
  }, []);

  const tr = useCallback((section, key, vars) => t(lang, section, key, vars), [lang]);

  return { lang, setLang, tr, supported: SUPPORTED };
}