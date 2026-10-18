import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, TriangleAlert, FileClock, Wrench, Map, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { dashboardApi } from '../../shared/api/dashboard';
import { useAuth } from '../../app/contexts/AuthContext';
import { useTour } from '../../app/tour';
import { money, shortDate, relativeTime, todayLabel } from './dashboardUtils';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { BlurFade } from '@/components/magicui/blur-fade';
import { AnimatedList } from '@/components/magicui/animated-list';
import { Panel, PanelLink } from '@/components/world/Panel';
import { InkMeter } from '@/components/world/InkMeter';
import { Stamp, Badge } from '@/components/world/Stamp';
import { Avatar, DateStamp } from '@/components/world/Avatar';
import { PageLoading, ErrorNote } from '@/components/world/EmptyState';
import { FadingScroll } from '@/components/world/FadingScroll';
import { Button } from '@/components/world/Button';
import { portraitFor } from '@/shared/media';
import RevenueChart from './components/RevenueChart';
import OccupancyDonut from './components/OccupancyDonut';

// one stationery ink per funnel stage — the section-hue discipline
const activityTypeTone: Record<string, 'red' | 'green' | 'blue' | 'amber' | 'carbon'> = {
  payment: 'green',
  lead: 'blue',
  maintenance: 'red',
  contract: 'amber',
};

const greetingKey = () => {
  const h = new Date().getHours();
  if (h < 12) return 'dashboard.morning';
  if (h < 18) return 'dashboard.afternoon';
  return 'dashboard.evening';
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tour = useTour();
  const { data: d, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboard,
  });

  if (isLoading) return <PageLoading label={t('dashboard.openingSheet')} />;

  if (error || !d) {
    return <ErrorNote message={error instanceof Error ? error.message : t('dashboard.fail')} />;
  }

  const firstName = user?.fullName?.split(' ')[0] || t('dashboard.there');
  const cur = d.currency || 'USD';
  const funnelMax = Math.max(1, ...d.leadsByStage.map((s) => s.count));
  const attention =
    d.overdueAmount > 0 || d.expiringContracts > 0 || d.highPriorityMaintenance > 0;

  const showTourInvite =
    !tour.active &&
    (() => {
      try {
        return !sessionStorage.getItem('pf-tour-done');
      } catch {
        return false;
      }
    })();

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* today header */}
      <BlurFade className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-bold leading-tight text-carbon sm:text-[36px]">
            {t(greetingKey())}, {firstName}.
          </h1>
          <p className="mt-1 text-[15px] text-carbon-soft">
            {t('dashboard.todayLine', { today: todayLabel() })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateStamp className="hidden sm:inline-flex" />
          <ShimmerButton onClick={() => navigate('/payments')} className="h-11 px-5 text-[14.5px]">
            {t('dashboard.recordPayment')}
            <ArrowRight className="size-4" aria-hidden />
          </ShimmerButton>
        </div>
      </BlurFade>

      {/* guided tour invitation — first visit only */}
      {showTourInvite && (
        <BlurFade delay={0.2}>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-sheet border border-dashed border-rule-strong bg-paper-well/70 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-rule-strong bg-paper-raised text-ink-blue shadow-tab">
                <Map className="size-[18px]" aria-hidden />
              </span>
              <div className="min-w-0">
                <div className="text-[14.5px] font-semibold text-carbon">
                  {t('dashboard.tourInvite')}
                </div>
                <div className="text-[13px] text-carbon-soft">
                  {t('dashboard.tourInviteCopy')}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  try {
                    sessionStorage.setItem('pf-tour-done', '1');
                  } catch {
                    /* private mode */
                  }
                }}
              >
                {t('dashboard.noThanks')}
              </Button>
              <Button size="sm" onClick={() => tour.start()}>
                <Play className="size-4" aria-hidden />
                {t('dashboard.startTour')}
              </Button>
            </div>
          </div>
        </BlurFade>
      )}

      {/* the ledger strip — figures ruled onto one sheet */}
      <BlurFade delay={0.05}>
        <section
          aria-label={t('dashboard.keyFigures')}
          className="grid grid-cols-2 divide-rule rounded-sheet border border-rule bg-paper-raised shadow-sheet sm:grid-cols-2 lg:grid-cols-4 lg:divide-x"
        >
          <LedgerCell
            label={t('dashboard.collected')}
            value={<NumberTicker value={d.collectedThisMonth} format={(v) => money(v, cur)} />}
            foot={t('dashboard.ofExpected', { amount: money(d.expectedThisMonth, cur) })}
            meter={{ value: d.collectedThisMonth, goal: d.expectedThisMonth, tone: 'green' }}
            toneClass="text-ink-green-deep"
          />
          <LedgerCell
            label={t('dashboard.occupancy')}
            value={
              <>
                <NumberTicker value={d.occupancyRate} />
                <span className="text-[0.6em]">%</span>
              </>
            }
            foot={t('dashboard.occupancyFoot', { occupied: d.occupiedUnits, total: d.totalUnits, mrr: money(d.monthlyRecurringRevenue, cur, true) })}
            meter={{ value: d.occupiedUnits, goal: d.totalUnits, tone: 'blue' }}
            toneClass="text-ink-blue-deep"
          />
          <LedgerCell
            label={t('dashboard.overdue')}
            value={
              <span className={d.overdueAmount > 0 ? 'text-ink-red-deep' : ''}>
                <NumberTicker value={d.overdueAmount} format={(v) => money(v, cur)} />
              </span>
            }
            foot={t('dashboard.overdueFoot', { late: d.latePayments, outstanding: money(d.outstandingAmount, cur, true) })}
            meter={{
              value: d.overdueAmount,
              goal: d.outstandingAmount || 1,
              tone: 'red',
              form: d.overdueAmount > 0 ? 'dashed' : 'solid',
            }}
          />
          <LedgerCell
            label={t('dashboard.pipeline')}
            value={<NumberTicker value={d.pipelineValue} format={(v) => money(v, cur, true)} />}
            foot={t('dashboard.pipelineFoot', { active: d.activeLeads, won: d.wonLeads })}
            meter={{ value: d.pipelineValue, goal: d.pipelineValue * 1.25, tone: 'amber', form: 'half' }}
            className="border-t border-rule lg:border-t-0 sm:border-t-0 max-sm:border-r-0"
            cellBorder="max-sm:border-t max-sm:border-rule"
          />
        </section>
      </BlurFade>

      {/* charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5 lg:gap-6">
        <BlurFade delay={0.1} className="lg:col-span-3">
          <Panel title={t('dashboard.rentCollected')} hint={t('dashboard.rentCollectedHint')}>
            <RevenueChart data={d.revenueTrend} currency={cur} />
          </Panel>
        </BlurFade>
        <BlurFade delay={0.15} className="lg:col-span-2">
          <Panel
            title={t('dashboard.occupancy')}
            action={<PanelLink to="/units">{t('dashboard.manageUnits')}</PanelLink>}
          >
            <OccupancyDonut
              occupied={d.occupiedUnits}
              available={d.availableUnits}
              maintenance={d.maintenanceUnits}
              rate={d.occupancyRate}
            />
          </Panel>
        </BlurFade>
      </div>

      {/* funnel + attention */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <BlurFade delay={0.05}>
          <Panel title={t('dashboard.funnel')} hint={t('dashboard.funnelHint', { count: d.totalLeads })} action={<PanelLink to="/leads">{t('dashboard.openBoard')}</PanelLink>}>
            <div className="space-y-3">
              {d.leadsByStage.map((s, i) => (
                <div key={s.stage} className="grid grid-cols-[86px_1fr_auto] items-center gap-3">
                  <span className="truncate text-[13px] font-semibold text-carbon-soft">{t(`leads.stage${s.stage}`)}</span>
                  <InkMeter
                    value={s.count}
                    max={funnelMax}
                    tone={i === 6 ? 'carbon' : i === 5 ? 'green' : i === 4 ? 'red' : i === 3 ? 'amber' : i === 1 ? 'blue' : 'green'}
                    form={i === 5 ? 'doubled' : i === 6 ? 'half' : 'solid'}
                    thin
                    delay={i * 0.04}
                  />
                  <span className="text-figure w-6 text-right text-[13px] font-semibold text-carbon">{s.count}</span>
                </div>
              ))}
            </div>
          </Panel>
        </BlurFade>

        <BlurFade delay={0.1}>
          <Panel title={t('dashboard.attention')} hint={t('dashboard.attentionHint')}>
            {attention ? (
              <ul className="space-y-2.5">
                {d.overdueAmount > 0 && (
                  <AttentionRow
                    to="/payments"
                    icon={<TriangleAlert className="size-4 text-ink-red" aria-hidden />}
                    stamp={<Stamp tone="red">{t("dashboard.overdueStamp")}</Stamp>}
                    title={t('dashboard.overdueTitle', { count: d.latePayments })}
                    sub={t('dashboard.toCollect', { amount: money(d.overdueAmount, cur) })}
                  />
                )}
                {d.expiringContracts > 0 && (
                  <AttentionRow
                    to="/contracts"
                    icon={<FileClock className="size-4 text-ink-amber" aria-hidden />}
                    stamp={<Stamp tone="amber">{t("dashboard.expiringStamp")}</Stamp>}
                    title={t('dashboard.expiringTitle', { count: d.expiringContracts })}
                    sub={t('dashboard.expiringSub')}
                  />
                )}
                {d.highPriorityMaintenance > 0 && (
                  <AttentionRow
                    to="/maintenance"
                    icon={<Wrench className="size-4 text-ink-red" aria-hidden />}
                    stamp={<Stamp tone="red">{t("dashboard.urgentStamp")}</Stamp>}
                    title={t('dashboard.urgentTitle', { count: d.highPriorityMaintenance })}
                    sub={t('dashboard.urgentSub')}
                  />
                )}
              </ul>
            ) : (
              <p className="flex items-center gap-2 py-6 text-[14.5px] text-carbon-soft">
                <ClipboardList className="size-4 text-ink-green" aria-hidden />
                {t('dashboard.cleanSheet')}
              </p>
            )}
          </Panel>
        </BlurFade>
      </div>

      {/* lists */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <BlurFade delay={0.05}>
          <Panel
            title={t('dashboard.upcomingRent')}
            action={<PanelLink to="/payments">{t('dashboard.allPayments')}</PanelLink>}
            bodyClassName="p-3 sm:p-3"
          >
            {d.upcomingPayments.length === 0 ? (
              <p className="px-3 py-8 text-center text-[14.5px] text-carbon-soft">
                {t('dashboard.noOutstanding')}
              </p>
            ) : (
              <FadingScroll innerClassName="max-h-[336px]">
                <ul className="divide-y divide-rule">
                  {d.upcomingPayments.map((p) => (
                  <li key={p.id} className="group flex items-center gap-3 px-2 py-2.5 transition-opacity hover:bg-paper-well/60">
                    <Avatar name={p.tenantName} src={portraitFor(p.tenantName)} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14.5px] font-semibold text-carbon">{p.tenantName}</div>
                      <div className="truncate text-[13px] text-carbon-faint">{p.unitName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-figure text-[14px] font-semibold text-carbon">
                        {money(p.amount, p.currency)}
                      </div>
                      {p.isOverdue ? (
                        <Badge tone="red" stroke="dashed">{t("dashboard.daysOverdue", { count: Math.abs(p.daysUntilDue) })}</Badge>
                      ) : (
                        <Badge tone="blue">{t("dashboard.dueOn", { date: shortDate(p.dueDate) })}</Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              </FadingScroll>
            )}
          </Panel>
        </BlurFade>

        <BlurFade delay={0.1}>
          <Panel title={t('dashboard.recentActivity')} bodyClassName="p-3 sm:p-3">
            {d.recentActivity.length === 0 ? (
              <p className="px-3 py-8 text-center text-[14.5px] text-carbon-soft">{t('dashboard.allCaughtUp')}</p>
            ) : (
              <FadingScroll innerClassName="max-h-[336px]">
                <AnimatedList className="gap-0" delay={120}>
                {d.recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 border-b border-rule px-2 py-2.5 last:border-b-0">
                    <Badge tone={activityTypeTone[a.type] ?? 'carbon'} stroke="solid" className="uppercase tracking-wide">
                      {t(`dashboard.type.${a.type}`)}
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14.5px] font-semibold text-carbon">{a.title}</div>
                      <div className="truncate text-[13px] text-carbon-faint">{a.subtitle}</div>
                    </div>
                    <span className="shrink-0 text-[12.5px] text-carbon-faint">{relativeTime(a.when)}</span>
                  </div>
                ))}
              </AnimatedList>
              </FadingScroll>
            )}
          </Panel>
        </BlurFade>
      </div>

      {/* expiring contracts */}
      {d.expiringContractsList.length > 0 && (
        <BlurFade delay={0.05}>
          <Panel
            title={t('dashboard.expiringSoon')}
            action={<PanelLink to="/contracts">{t('dashboard.manage')}</PanelLink>}
            bodyClassName="p-3 sm:p-3"
          >
            <FadingScroll innerClassName="max-h-[336px]">
              <ul className="divide-y divide-rule">
                {d.expiringContractsList.map((c) => (
                <li key={c.id} className="flex items-center gap-3 px-2 py-2.5 hover:bg-paper-well/60">
                  <Avatar name={c.tenantName} src={portraitFor(c.tenantName)} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14.5px] font-semibold text-carbon">{c.tenantName}</div>
                    <div className="truncate text-[13px] text-carbon-faint">
                      {c.unitName} · {money(c.monthlyRent, c.currency)}{t('dashboard.perMonth')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-figure text-[14px] font-semibold text-carbon">{shortDate(c.endDate)}</div>
                    <Badge tone={c.daysLeft <= 15 ? 'red' : 'amber'} stroke={c.daysLeft <= 15 ? 'dashed' : 'solid'}>
                      {t('dashboard.daysLeft', { count: c.daysLeft })}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
            </FadingScroll>
          </Panel>
        </BlurFade>
      )}
    </div>
  );
}

function LedgerCell({
  label,
  value,
  foot,
  meter,
  toneClass,
  className,
  cellBorder,
}: {
  label: string;
  value: React.ReactNode;
  foot: string;
  meter: { value: number; goal: number; tone: 'red' | 'green' | 'blue' | 'amber' | 'carbon'; form?: 'solid' | 'dashed' | 'half' | 'doubled' };
  toneClass?: string;
  className?: string;
  cellBorder?: string;
}) {
  return (
    <div className={`p-4 sm:p-5 ${cellBorder ?? ''} ${className ?? ''}`}>
      <div className="text-rule-label">{label}</div>
      <div className={`text-figure mt-2 text-[24px] font-semibold leading-none sm:text-[27px] ${toneClass ?? 'text-carbon'}`}>
        {value}
      </div>
      <div className="mt-2.5">
        <InkMeter {...meter} delay={0.15} />
      </div>
      <div className="mt-2 text-[12.5px] text-carbon-faint">{foot}</div>
    </div>
  );
}

function AttentionRow({
  to,
  icon,
  stamp,
  title,
  sub,
}: {
  to: string;
  icon: React.ReactNode;
  stamp: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="group flex items-center gap-3.5 rounded-[10px] border border-rule bg-paper-well/50 px-4 py-3 transition-colors hover:border-rule-strong hover:bg-paper-deep/70"
      >
        {icon}
        <div className="min-w-0 flex-1">
          <div className="text-[14.5px] font-semibold text-carbon">{title}</div>
          <div className="text-[13px] text-carbon-soft">{sub}</div>
        </div>
        {stamp}
        <ArrowRight className="size-4 shrink-0 text-carbon-faint transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </li>
  );
}
