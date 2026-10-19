import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { LogOut, X, Map } from 'lucide-react';

import { useAuth } from './contexts/AuthContext';
import { useTour } from './tour';
import { TourCoach } from './TourCoach';
import { NAV } from '@/components/world/sections';
import { Avatar } from '@/components/world/Avatar';
import { Stamp } from '@/components/world/Stamp';
import { LangSwitcher } from '@/i18n/LangSwitcher';
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';
import { DotPattern } from '@/components/magicui/dot-pattern';
import { cn } from '@/lib/utils';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export function BrandMark({ compact }: { compact?: boolean }) {
  const { t } = useTranslation();
  return (
    <Link to="/dashboard" className="group flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-[10px] bg-ink-red font-display text-[19px] font-bold text-[#fdf8ec] shadow-tab">
        P
      </span>
      {!compact && (
        <span className="font-display text-[21px] font-bold tracking-[-0.02em] text-carbon">
          PropFlow
        </span>
      )}
      {DEMO_MODE && <Stamp tone="carbon" rotate={false} className="hidden sm:inline-flex">{t("app.demo")}</Stamp>}
    </Link>
  );
}

function Rail() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const tour = useTour();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[236px] flex-col border-r border-rule-strong bg-paper-deep lg:flex">
      <div className="flex items-center justify-between px-5 pb-4 pt-6">
        <BrandMark />
      </div>

      <nav aria-label={t('nav.sections')} className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-[10px] px-3 py-[9px] text-[14.5px] font-semibold text-carbon-soft transition-all',
                isActive
                  ? 'tab-edge -ml-1 bg-paper-raised pl-4 text-carbon shadow-tab'
                  : 'hover:bg-paper-well hover:text-carbon'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className="size-[17px] shrink-0"
                  style={{ color: isActive ? item.hue : 'currentColor' }}
                  aria-hidden
                />
                {t(item.labelKey)}
                {isActive && (
                  <span
                    className="ml-auto size-1.5 rounded-full"
                    style={{ backgroundColor: item.hue }}
                    aria-hidden
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-rule-strong px-4 py-3">
        <button
          onClick={() => tour.start()}
          className="mb-2 flex w-full items-center gap-2.5 rounded-[10px] border border-dashed border-rule-strong/80 px-3 py-2 text-[13px] font-semibold text-carbon-soft transition-colors hover:border-ink-blue/60 hover:bg-ink-blue/5 hover:text-ink-blue"
        >
          <Map className="size-4 shrink-0" aria-hidden />
          {t('nav.guidedTour')}
          <span className="text-figure ml-auto text-[11px] font-medium text-carbon-faint">{t('nav.tourStops')}</span>
        </button>
        <div className="flex items-center gap-3">
          <Avatar name={user?.fullName ?? t('app.landlord')} src={user?.imageUrl} className="size-9" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-semibold text-carbon">{user?.fullName ?? t('app.landlord')}</div>
            <div className="truncate text-[12px] text-carbon-faint">{t('app.landlord')}</div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <LangSwitcher />
          <AnimatedThemeToggler className="flex size-8 items-center justify-center rounded-[8px] text-carbon-soft transition-colors hover:bg-paper-well hover:text-carbon [&_svg]:size-4" />
          <span className="flex-1" />
          <button
            onClick={logout}
            aria-label={t('nav.logOut')}
            title={t('nav.logOut')}
            className="flex size-8 items-center justify-center rounded-[8px] text-carbon-soft transition-colors hover:bg-paper-well hover:text-ink-red"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function MobileBar({ onMore }: { onMore: () => void }) {
  const { t } = useTranslation();
  const barItems = NAV.filter((n) => n.mobile === 'bar');
  return (
    <nav
      aria-label={t('nav.sections')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rule-strong bg-paper-raised pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="grid grid-cols-5">
        {barItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold',
                isActive ? 'text-carbon' : 'text-carbon-faint'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className="size-[19px]"
                  style={{ color: isActive ? item.hue : 'currentColor' }}
                  aria-hidden
                />
                {t(item.labelKey)}
              </>
            )}
          </NavLink>
        ))}
        <button
          onClick={onMore}
          className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-carbon-faint"
        >
          <span className="flex h-[19px] items-end gap-[3px]" aria-hidden>
            <span className="size-[4px] rounded-full bg-current" />
            <span className="size-[4px] rounded-full bg-current" />
            <span className="size-[4px] rounded-full bg-current" />
          </span>
          {t('nav.more')}
        </button>
      </div>
    </nav>
  );
}

function MoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const location = useLocation();
  const tour = useTour();
  useEffect(() => {
    onClose();
    // close the sheet whenever the route changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.allSections')}
            className="absolute inset-x-0 bottom-0 rounded-t-sheet border-t border-rule-strong bg-paper-raised px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-sheet-lift"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-[16px] font-semibold">{t('nav.allSections')}</h2>
              <button
                onClick={onClose}
                aria-label={t('common.close')}
                className="flex size-8 items-center justify-center rounded-[8px] text-carbon-soft hover:bg-paper-deep"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pb-2">
              {NAV.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-[10px] border px-3 py-2.5 text-[14px] font-semibold',
                      isActive
                        ? 'border-rule-strong bg-paper-deep text-carbon'
                        : 'border-rule bg-paper-well text-carbon-soft'
                    )
                  }
                >
                  <item.icon className="size-4" style={{ color: item.hue }} aria-hidden />
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </div>
            <button
              onClick={() => {
                onClose();
                tour.start();
              }}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-[10px] border border-dashed border-rule-strong/80 py-2.5 text-[13.5px] font-semibold text-carbon-soft transition-colors hover:border-ink-blue/60 hover:bg-ink-blue/5 hover:text-ink-blue"
            >
              <Map className="size-4" aria-hidden />
              {t('nav.takeTour')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Layout() {
  const [moreOpen, setMoreOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* graph-paper ground */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <DotPattern
          width={22}
          height={22}
          cr={1.1}
          className="text-rule-strong/45 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,#000_55%,transparent_100%)]"
        />
      </div>

      <Rail />
      <MobileBar onMore={() => setMoreOpen(true)} />
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
      <TourCoach />

      {/* mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-rule-strong bg-paper/90 px-4 py-3 backdrop-blur-sm lg:hidden">
        <BrandMark compact />
        <div className="flex items-center gap-1">
          <LangSwitcher className="mr-0.5" />
          <AnimatedThemeToggler className="flex size-8 items-center justify-center rounded-[8px] text-carbon-soft transition-colors hover:bg-paper-well hover:text-carbon [&_svg]:size-4" />
          <Avatar name={user?.fullName ?? t('app.landlord')} src={user?.imageUrl} className="size-8" />
          <button
            onClick={logout}
            aria-label={t('nav.logOut')}
            className="flex size-8 items-center justify-center rounded-[8px] text-carbon-soft hover:text-ink-red"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      <main className="lg:pl-[236px]">
        <div className="mx-auto w-full max-w-[1180px] px-4 pb-28 pt-5 sm:px-6 lg:pb-14 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
