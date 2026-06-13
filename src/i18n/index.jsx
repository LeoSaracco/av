/**
 * @file index.js
 * @description Contexto de internacionalización con soporte es/en.
 *              Detecta idioma desde `navigator.language`, persiste en
 *              localStorage (`av_lang`) y expone el hook `useI18n()`.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import es from './es.json';
import en from './en.json';

const translations = { es, en };
const I18nContext = createContext(null);

/**
 * Proveedor de internacionalización. Envuelve la aplicación para
 * que cualquier componente hijo pueda usar `useI18n()`.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} Provider con el contexto de i18n
 */
export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const stored = localStorage.getItem('av_lang');
      if (stored && translations[stored]) return stored;
    } catch { /* ignore */ }
    const navLang = (navigator.language || 'es').split('-')[0];
    return translations[navLang] ? navLang : 'es';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('av_lang', lang); } catch { /* ignore */ }
  }, [lang]);

  /**
   * Obtiene la traducción para una clave con notación de punto.
   * Ej: `t('hero.titleLine1')` → "Tu mejor versión"
   *
   * @param {string} key - Clave de traducción separada por puntos
   * @returns {string} Texto traducido o la clave si no se encuentra
   */
  const t = useCallback((key) => {
    const keys = key.split('.');
    let val = translations[lang];
    for (const k of keys) {
      if (val == null) return key;
      val = val[k];
    }
    return val ?? key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ t, lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook para acceder a las funciones de internacionalización.
 * @returns {{ t: Function, lang: string, setLang: Function }} Contexto i18n
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be inside I18nProvider');
  return ctx;
}
