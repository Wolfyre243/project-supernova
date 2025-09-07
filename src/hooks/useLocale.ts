import { useState, useEffect } from 'react';

function getUserLocale(): string {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }
  return 'en-US'; // fallback locale
}

export function useLocale(): string {
  const [locale, setLocale] = useState<string>(getUserLocale());

  useEffect(() => {
    const handleLanguageChange = () => {
      setLocale(getUserLocale());
    };

    window.addEventListener('languagechange', handleLanguageChange);

    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, []);

  return locale;
}
