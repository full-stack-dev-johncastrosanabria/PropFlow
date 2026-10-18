import { useTranslation } from 'react-i18next';
import { LANGS, type Lang } from './index';

export function LangSwitcher({ className = '' }: { className?: string }) {
  const { i18n } = useTranslation();
  const current = (i18n.language?.toLowerCase().startsWith('es') ? 'es' : 'en') as Lang;

  return (
    <div
      className={`flex items-center rounded-[8px] bg-paper-well p-0.5 text-[11px] font-bold uppercase tracking-[0.06em] ${className}`}
      role="group"
      aria-label="Language / Idioma"
    >
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => void i18n.changeLanguage(l)}
          aria-current={current === l ? 'true' : undefined}
          className={`rounded-[6px] px-2 py-1 transition-colors ${
            current === l ? 'bg-paper-raised text-carbon shadow-tab' : 'text-carbon-faint hover:text-carbon-soft'
          }`}
        >
          {l === 'en' ? 'EN' : 'ES'}
        </button>
      ))}
    </div>
  );
}
