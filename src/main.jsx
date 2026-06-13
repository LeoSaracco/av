/**
 * @file Punto de entrada de la aplicación.
 *       Envuelve la app con HelmetProvider para SEO y monta en el DOM.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from './i18n';
import './styles/global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </HelmetProvider>
  </StrictMode>,
);
