import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/contexts/AuthContext';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { DotPattern } from '@/components/magicui/dot-pattern';
import { Field, TextInput } from '@/components/world/fields';
import { ErrorNote } from '@/components/world/EmptyState';
import { Stamp } from '@/components/world/Stamp';
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';
import { MorphingText } from '@/components/magicui/morphing-text';
import { BlurFade } from '@/components/magicui/blur-fade';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const DEMO_EMAIL = 'demo@propflow.app';
const DEMO_PASSWORD = 'Demo1234!';
const AUTO_SIGN_IN_SECONDS = 20;

const FEATURES = [
  'Daily dashboard',
  'Leads funnel',
  'Productivity tracker',
  'Portfolio & leases',
  'Maintenance',
];

const INDEX_LINES = [
  'The whole portfolio at a glance',
  'Drag deals from first touch to won',
  'The 3-hour lead-gen block, tracked',
  'Every door, lease and payment on record',
  'Priority-stamped work orders',
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState(DEMO_MODE ? DEMO_EMAIL : '');
  const [password, setPassword] = useState(DEMO_MODE ? DEMO_PASSWORD : '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_SIGN_IN_SECONDS);
  const autoFired = useRef(false);

  const doLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await doLogin();
  };

  // In demo mode the sheet signs itself in if the visitor hasn't pressed anything —
  // editing a field hands control back and cancels the countdown for good.
  useEffect(() => {
    if (!DEMO_MODE || touched || isLoading) return;

    if (secondsLeft <= 0) {
      if (!autoFired.current) {
        autoFired.current = true;
        void doLogin();
      }
      return;
    }

    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DEMO_MODE, touched, isLoading, secondsLeft]);

  return (
    <div className="relative flex min-h-screen items-stretch">
      <AnimatedThemeToggler className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-[10px] border border-rule-strong bg-paper-raised text-carbon-soft shadow-tab transition-colors hover:text-carbon [&_svg]:size-[18px]" />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <DotPattern
          width={22}
          height={22}
          cr={1.1}
          className="text-rule-strong/40 [mask-image:radial-gradient(ellipse_70%_60%_at_35%_40%,#000_50%,transparent_100%)]"
        />
      </div>

      {/* the planner's inside cover */}
      <aside className="relative hidden w-[46%] max-w-[620px] flex-col justify-between border-r border-rule-strong bg-paper-deep/70 px-10 py-12 lg:flex xl:px-16">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-[12px] bg-ink-red font-display text-[23px] font-bold text-[#fdf8ec] shadow-tab">
            P
          </span>
          <div>
            <div className="font-display text-[24px] font-bold tracking-[-0.02em] text-carbon">
              PropFlow
            </div>
            <div className="text-[13px] font-medium text-carbon-soft">
              Modern property management, made simple
            </div>
          </div>
        </div>

        <div className="my-10">
          <h1 className="max-w-[13ch] font-display text-[44px] font-bold leading-[1.04] text-carbon xl:text-[52px]">
            Run the whole portfolio from one open page.
          </h1>

          <MorphingText
            texts={FEATURES}
            className="mt-9 h-[44px] w-full max-w-none text-left font-display text-[30px] font-semibold leading-none text-carbon md:h-[44px] lg:text-[30px]"
          />

          <div className="mt-5 max-w-[46ch]">
            {INDEX_LINES.map((line, i) => (
              <BlurFade key={line} delay={0.35 + i * 0.14} offset={8}>
                <div className="flex items-baseline gap-3 border-b border-rule py-[9px] text-[14.5px] text-carbon-soft last:border-b-0">
                  <span className="text-figure shrink-0 text-[12px] font-semibold text-ink-red" aria-hidden>
                    —
                  </span>
                  {line}
                </div>
              </BlurFade>
            ))}
          </div>
        </div>

        {DEMO_MODE ? (
          <div className="max-w-[440px]">
            <div className="rounded-sheet border border-rule-strong bg-paper-raised p-4 shadow-sheet">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-rule-label">Demo pass — no signup needed</span>
                <Stamp tone="green">Ready</Stamp>
              </div>
              <div className="space-y-0.5 text-figure text-[13.5px] text-carbon">
                <div>{DEMO_EMAIL}</div>
                <div>{DEMO_PASSWORD}</div>
              </div>
              <p className="mt-2 text-[13px] text-carbon-soft">
                Filled in for you — press <span className="font-semibold">Sign in</span>, or just wait
                a moment.
              </p>
            </div>
          </div>
        ) : (
          <p className="max-w-[40ch] text-[13.5px] text-carbon-faint">
            Full-stack: .NET 10 API, MySQL, React 19. This demo runs on sample data.
          </p>
        )}
      </aside>

      {/* the sign-in sheet */}
      <main className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-[420px]">
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-[11px] bg-ink-red font-display text-[21px] font-bold text-[#fdf8ec] shadow-tab">
              P
            </span>
            <div className="font-display text-[22px] font-bold text-carbon">PropFlow</div>
          </div>

          <div className="rounded-sheet border border-rule bg-paper-raised p-6 shadow-sheet sm:p-8">
            <h2 className="font-display text-[26px] font-bold text-carbon">Welcome back</h2>
            <p className="mt-1 text-[14.5px] text-carbon-soft">
              Open your planner and pick up where the day left off.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Field label="Email" required>
                <TextInput
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setTouched(true);
                  }}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Field>

              <Field label="Password" required>
                <TextInput
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setTouched(true);
                  }}
                  required
                  placeholder="Your password"
                  autoComplete="current-password"
                />
              </Field>

              {error && <ErrorNote message={error} />}

              <ShimmerButton type="submit" disabled={isLoading} className="mt-1 h-12 w-full text-[15px]">
                {isLoading ? 'Signing in…' : 'Sign in'}
              </ShimmerButton>

              {DEMO_MODE && !touched && !isLoading && (
                <div className="pt-1" aria-live="polite">
                  <div className="flex items-center justify-between text-[12.5px] font-medium text-carbon-soft">
                    <span>Just looking? The demo opens itself.</span>
                    <span className="text-figure">{secondsLeft}s</span>
                  </div>
                  <div className="mt-1.5 h-[2px] w-full overflow-hidden rounded-full bg-rule/70">
                    <div
                      className="h-full w-full origin-left bg-ink-amber-stroke"
                      style={{
                        transform: `scaleX(${(AUTO_SIGN_IN_SECONDS - secondsLeft) / AUTO_SIGN_IN_SECONDS})`,
                        transition: 'transform 1s linear',
                      }}
                    />
                  </div>
                </div>
              )}
            </form>

            <p className="mt-5 text-center text-[14px] text-carbon-soft">
              New here?{' '}
              <Link
                to="/register"
                className="font-semibold text-ink-blue underline-offset-[3px] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          {DEMO_MODE && (
            <div className="mt-4 flex items-center justify-between rounded-sheet border border-dashed border-rule-strong bg-paper-well/70 px-4 py-3 lg:hidden">
              <div className="text-figure text-[12.5px] leading-snug text-carbon-soft">
                {DEMO_EMAIL}
                <br />
                {DEMO_PASSWORD}
              </div>
              <Stamp tone="green">Demo</Stamp>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
