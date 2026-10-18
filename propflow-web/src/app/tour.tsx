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
  title: string;
  body: string;
}

// The guided lap of the property: one coach card per section, auto-advancing.
export const TOUR_STEPS: TourStep[] = [
  {
    path: '/dashboard',
    title: "Today's sheet",
    body: 'The whole portfolio at a glance — collected rent, occupancy, overdue stamps, and the sales funnel, each as an inked meter against its goal.',
  },
  {
    path: '/leads',
    title: 'The sales funnel',
    body: 'Every deal from first touch to won. Drag a card between stages and the board — counts, values, meters — follows instantly.',
  },
  {
    path: '/productivity',
    title: 'The 3-hour block',
    body: 'The Keller Williams scorecard: lead-gen hours against the goal, streaks, the 4-1-1 rollup, and the economic model of your last 30 days.',
  },
  {
    path: '/properties',
    title: 'The portfolio',
    body: 'Every building with its address and photo — open one and its units, tenants and history hang off it.',
  },
  {
    path: '/units',
    title: 'Every door',
    body: 'Each unit with its rent, currency, interior photo and status — available, occupied, or in maintenance.',
  },
  {
    path: '/tenants',
    title: 'The tenant index',
    body: 'Who lives where, with a face, contact details and ID on one ruled card.',
  },
  {
    path: '/contracts',
    title: 'Leases on record',
    body: 'Terms, deposits, start and end dates — and which ones expire soon enough to act on.',
  },
  {
    path: '/payments',
    title: 'The rent roll',
    body: 'What is due, what is paid, what went late — a paginated ledger with the state carried in ink strokes.',
  },
  {
    path: '/maintenance',
    title: 'Work orders',
    body: 'Priority-stamped requests across the portfolio, from open to in progress to closed.',
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
