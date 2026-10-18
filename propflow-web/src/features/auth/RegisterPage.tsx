import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/contexts/AuthContext';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { Field, TextInput } from '@/components/world/fields';
import { ErrorNote } from '@/components/world/EmptyState';
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';

export default function RegisterPage() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register({ fullName, email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <AnimatedThemeToggler className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-[10px] border border-rule-strong bg-paper-raised text-carbon-soft shadow-tab transition-colors hover:text-carbon [&_svg]:size-[18px]" />
      <div className="w-full max-w-[420px]">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-[11px] bg-ink-red font-display text-[21px] font-bold text-[#fdf8ec] shadow-tab">
            P
          </span>
          <div className="font-display text-[22px] font-bold text-carbon">PropFlow</div>
        </div>

        <div className="rounded-sheet border border-rule bg-paper-raised p-6 shadow-sheet sm:p-8">
          <h1 className="font-display text-[26px] font-bold text-carbon">Open your planner</h1>
          <p className="mt-1 text-[14.5px] text-carbon-soft">
            One account for properties, tenants, contracts and the daily block.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Full name" required>
              <TextInput
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Alex Morgan"
              />
            </Field>

            <Field label="Email" required>
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </Field>

            <Field label="Password" required>
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="At least 6 characters"
              />
            </Field>

            {error && <ErrorNote message={error} />}

            <ShimmerButton type="submit" disabled={isLoading} className="mt-1 h-12 w-full text-[15px]">
              {isLoading ? 'Creating account…' : 'Create account'}
            </ShimmerButton>
          </form>

          <p className="mt-5 text-center text-[14px] text-carbon-soft">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-ink-blue underline-offset-[3px] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
