import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './app/App';
import { i18n, setLang, type Lang } from './i18n';
import { setDemoLanguage } from './shared/demo/demoBackend';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/hanken-grotesk';
import '@fontsource/spline-sans-mono/400.css';
import '@fontsource/spline-sans-mono/500.css';
import '@fontsource/spline-sans-mono/600.css';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// keep <html lang>, the document title and the demo dataset in step with the UI language
function applyLanguage(lng: Lang) {
  document.documentElement.lang = lng;
  document.title = i18n.t('app.title');
  setDemoLanguage(lng);
  queryClient.clear();
}

i18n.on('languageChanged', (lng) => applyLanguage(lng as Lang));

applyLanguage(i18n.language as Lang);

// reflect a saved preference onto i18n (the init default may differ if storage was cleared)
const savedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;
if (savedLang === 'en' || savedLang === 'es') setLang(savedLang);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
