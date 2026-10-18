import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/contexts/AuthContext';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { Field, TextInput } from '@/components/world/fields';
import { ErrorNote } from '@/components/world/EmptyState';
import { LangSwitcher } from '@/i18n/LangSwitcher';
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useTranslation();
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
      setError(err instanceof Error ? err.message : t('auth.registerFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <AnimatedThemeToggler className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-[10px] border border-rule-strong bg-paper-raised text-carbon-soft shadow-tab transition-colors hover:text-carbon [&_svg]:size-[18px]" />
      <LangSwitcher className="absolute right-[68px] top-4 z-20 rounded-[9px] border border-rule-strong bg-paper-raised py-1 shadow-tab" />
      <div className="w-full max-w-[420px]">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-[11px] bg-ink-red font-display text-[21px] font-bold text-[#fdf8ec] shadow-tab">
            P
          </span>
          <div className="font-display text-[22px] font-bold text-carbon">PropFlow</div>
        </div>

        <div className="rounded-sheet border border-rule bg-paper-raised p-6 shadow-sheet sm:p-8">
          <h1 className="font-display text-[26px] font-bold text-carbon">{t('auth.openPlanner')}</h1>
          <p className="mt-1 text-[14.5px] text-carbon-soft">
            {t('auth.openPlannerCopy')}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label={t('auth.fullName')} required>
              <TextInput
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Alex Morgan"
              />
            </Field>

            <Field label={t('auth.email')} required>
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </Field>

            <Field label={t('auth.password')} required>
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder={t('auth.passwordMin')}
              />
            </Field>

            {error && <ErrorNote message={error} />}

            <ShimmerButton type="submit" disabled={isLoading} className="mt-1 h-12 w-full text-[15px]">
              {isLoading ? t('auth.creating') : t('auth.createAccount')}
            </ShimmerButton>
          </form>

          <p className="mt-5 text-center text-[14px] text-carbon-soft">
            {t('auth.haveAccount')}{' '}
            <Link
              to="/login"
              className="font-semibold text-ink-blue underline-offset-[3px] hover:underline"
            >
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
