import { Pause, Play, SkipForward, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useTour, TOUR_STEPS } from './tour';
import { Button } from '@/components/world/Button';

const STEP_MS = 9000;

// The tour's coach card: a paper card that rides above the content,
// auto-advancing with a ruled progress line. Esc or Skip ends it.
export function TourCoach() {
  const { active, step, playing, stop, next, prev, toggle } = useTour();
  const { t } = useTranslation();
  if (!active) return null;

  const s = TOUR_STEPS[step];
  const last = step === TOUR_STEPS.length - 1;

  return (
    <div
      className="fixed inset-x-4 bottom-24 z-[60] sm:inset-x-auto sm:left-1/2 sm:w-[520px] sm:-translate-x-1/2 lg:bottom-8"
      role="status"
      aria-live="polite"
    >
      <div className="rounded-sheet border border-rule bg-paper-raised p-4 shadow-sheet-lift sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-rule-label">{t('tour.status', { current: step + 1, total: TOUR_STEPS.length })}</div>
            <h2 className="mt-1 font-display text-[19px] font-semibold leading-tight text-carbon">
              {t(s.titleKey)}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={stop} aria-label={t('tour.end')} title={t('tour.endHint')}>
            <X className="size-4" />
          </Button>
        </div>

        <p className="mt-1.5 text-[14px] leading-relaxed text-carbon-soft">{t(s.bodyKey)}</p>

        {/* ruled progress line — fills per step, pauses with the tour */}
        <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-rule/70">
          <div
            key={step}
            className="h-full w-full origin-left rounded-full bg-ink-red"
            style={{
              animation: `tour-progress ${STEP_MS}ms linear forwards`,
              animationPlayState: playing ? 'running' : 'paused',
            }}
          />
        </div>

        <div className="mt-3.5 flex items-center justify-between">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 rounded-[8px] text-[13px] font-semibold text-carbon-soft transition-colors hover:text-carbon"
            aria-label={playing ? t('tour.pauseResume') : t('tour.resume')}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            {playing ? t('tour.pause') : t('tour.play')}
          </button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={prev} disabled={step === 0}>
              <ChevronLeft className="size-4" aria-hidden />
              {t('tour.back')}
            </Button>
            <Button size="sm" onClick={next}>
              {last ? (
                <>
                  {t('tour.finish')} <SkipForward className="size-4" aria-hidden />
                </>
              ) : (
                <>
                  {t('tour.next')} <ChevronRight className="size-4" aria-hidden />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
