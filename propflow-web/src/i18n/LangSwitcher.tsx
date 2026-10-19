import { useTranslation } from 'react-i18next';
import { LANGS, type Lang } from './index';

const TARGET: Record<Lang, string> = { en: 'EN', es: 'ES' };

export function LangSwitcher({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  const { i18n } = useTranslation();
  const current = (i18n.language?.toLowerCase().startsWith('es') ? 'es' : 'en') as Lang;
  const target: Lang = current === 'es' ? 'en' : 'es';

  const switchTo = (l: Lang) => void i18n.changeLanguage(l);

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => switchTo(target)}
        aria-label={target === 'es' ? 'Cambiar a Español' : 'Switch to English'}
        title={target === 'es' ? 'Cambiar a Español' : 'Switch to English'}
        className={`flex size-8 shrink-0 items-center justify-center rounded-[8px] text-[11px] font-bold uppercase tracking-[0.06em] text-carbon-soft transition-colors hover:bg-paper-well hover:text-carbon ${className}`}
      >
        {TARGET[target]}
      </button>
    );
  }

  return (
    <div
      className={`flex items-center rounded-[8px] bg-paper-well p-0.5 text-[11px] font-bold uppercase tracking-[0.06em] ${className}`}
      role="group"
      aria-label="Language / Idioma"
    >
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
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
