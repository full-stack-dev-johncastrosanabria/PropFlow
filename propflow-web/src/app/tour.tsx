/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';

export interface TourStep {
  path: string;
  /** i18n keys — titles and bodies live in the locale files */
  titleKey: string;
  bodyKey: string;
}

// The guided lap of the property: one coach card per section, auto-advancing.
export const TOUR_STEPS: TourStep[] = [
  {
    path: '/dashboard',
    titleKey: 'tour.s1Title',
    bodyKey: 'tour.s1Body',
  },
  {
    path: '/leads',
    titleKey: 'tour.s2Title',
    bodyKey: 'tour.s2Body',
  },
  {
    path: '/productivity',
    titleKey: 'tour.s3Title',
    bodyKey: 'tour.s3Body',
  },
  {
    path: '/properties',
    titleKey: 'tour.s4Title',
    bodyKey: 'tour.s4Body',
  },
  {
    path: '/units',
    titleKey: 'tour.s5Title',
    bodyKey: 'tour.s5Body',
  },
  {
    path: '/tenants',
    titleKey: 'tour.s6Title',
    bodyKey: 'tour.s6Body',
  },
  {
    path: '/contracts',
    titleKey: 'tour.s7Title',
    bodyKey: 'tour.s7Body',
  },
  {
    path: '/payments',
    titleKey: 'tour.s8Title',
    bodyKey: 'tour.s8Body',
  },
  {
    path: '/maintenance',
    titleKey: 'tour.s9Title',
    bodyKey: 'tour.s9Body',
  },
];

const STEP_MS = 9000;

interface TourContextType {
  active: boolean;
  step: number;
  playing: boolean;
  start: (at?: number) => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  toggle: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const goToStep = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(i, TOUR_STEPS.length - 1));
      setStep(clamped);
      navigate(TOUR_STEPS[clamped].path);
      window.scrollTo({ top: 0 });
    },
    [navigate]
  );

  const stop = useCallback(() => {
    clearTimer();
    setActive(false);
    setPlaying(true);
    try {
      sessionStorage.setItem('pf-tour-done', '1');
    } catch {
      /* private mode */
    }
  }, []);

  const next = useCallback(() => {
    setStep((s) => {
      if (s >= TOUR_STEPS.length - 1) {
        stop();
        navigate('/dashboard');
        return s;
      }
      const n = s + 1;
      navigate(TOUR_STEPS[n].path);
      window.scrollTo({ top: 0 });
      return n;
    });
  }, [navigate, stop]);

  const prev = useCallback(() => goToStepRef.current(step - 1), [step]);

  const goToStepRef = useRef(goToStep);
  goToStepRef.current = goToStep;

  const start = useCallback(
    (at = 0) => {
      clearTimer();
      setActive(true);
      setPlaying(true);
      goToStepRef.current(at);
    },
    []
  );

  const toggle = useCallback(() => setPlaying((p) => !p), []);

  // auto-advance
  useEffect(() => {
    if (!active || !playing) return;
    clearTimer();
    timer.current = setTimeout(next, STEP_MS);
    return clearTimer;
  }, [active, playing, step, next]);

  // Esc ends the tour
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stop();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, stop]);

  const value = useMemo(
    () => ({ active, step, playing, start, stop, next, prev, toggle }),
    [active, step, playing, start, stop, next, prev, toggle]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour(): TourContextType {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within TourProvider');
  return ctx;
}
