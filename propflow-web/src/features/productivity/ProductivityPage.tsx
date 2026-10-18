import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Flame, Timer, Settings2, PencilLine } from 'lucide-react';
import { productivityApi } from '../../shared/api/productivity';
import type { ProductivitySummaryDto, ActivityTotalsDto, ProductivityGoalsDto } from '../../shared/types';
import { i18n } from '@/i18n';
import { RING_METRICS, KW_DEFAULT_GOALS } from './kwGoals';
import ScoreRing from './components/ScoreRing';
import EconomicModel from './components/EconomicModel';
import WeekStrip from './components/WeekStrip';
import LogActivityModal from './components/LogActivityModal';
import { Panel } from '@/components/world/Panel';
import { InkMeter } from '@/components/world/InkMeter';
import { Stamp } from '@/components/world/Stamp';
import { Button } from '@/components/world/Button';
import { Modal } from '@/components/world/Modal';
import { Field, TextInput } from '@/components/world/fields';
import { BlurFade } from '@/components/magicui/blur-fade';
import { PageLoading, ErrorNote } from '@/components/world/EmptyState';

const formatDayLabel = (iso: string) => {
  const locale = i18n.language?.toLowerCase().startsWith('es') ? 'es' : 'en-US';
  return new Date(iso).toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
};

type RollupKey = { key: keyof ActivityTotalsDto; labelKey: string };
const ROLLUP_ROWS: RollupKey[] = [
  { key: 'leadGenHours', labelKey: 'prod.mLeadGen' },
  { key: 'contacts', labelKey: 'prod.mContacts' },
  { key: 'conversations', labelKey: 'prod.mConversations' },
  { key: 'appointmentsSet', labelKey: 'prod.mApptsSet' },
  { key: 'appointmentsMet', labelKey: 'prod.mApptsMet' },
  { key: 'leadsAdded', labelKey: 'prod.mLeadsAdded' },
  { key: 'agreementsSigned', labelKey: 'prod.agreements' },
  { key: 'offersWritten', labelKey: 'prod.offers' },
];

export default function ProductivityPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [logOpen, setLogOpen] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(false);

  const { data, isLoading, error } = useQuery<ProductivitySummaryDto>({
    queryKey: ['productivity', 'summary'],
    queryFn: productivityApi.getSummary,
  });

  const goalsMutation = useMutation({
    mutationFn: productivityApi.updateGoals,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productivity'] });
      setGoalsOpen(false);
    },
  });

  if (isLoading) return <PageLoading label={t('prod.opening')} />;

  if (error || !data) {
    return <ErrorNote message={error instanceof Error ? error.message : t('prod.fail')} />;
  }

  const day = data.todayActivity;
  const goals = data.goals ?? KW_DEFAULT_GOALS;
  const blockDone = day.leadGenHours >= goals.leadGenHours;

  const todayVal = (k: keyof ActivityTotalsDto): number => {
    const v = (day as unknown as Record<string, number>)[k as string];
    return typeof v === 'number' ? v : 0;
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      <BlurFade className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-bold leading-tight text-carbon sm:text-[34px]">
            {t('prod.title')}
          </h1>
          <p className="mt-1 text-[15px] text-carbon-soft">
            {t('prod.todayLine', { today: formatDayLabel(data.today) })}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="secondary" onClick={() => setGoalsOpen(true)}>
            <Settings2 className="size-4" aria-hidden />
            {t('prod.goals')}
          </Button>
          <Button onClick={() => setLogOpen(true)}>
            <PencilLine className="size-4" aria-hidden />
            {t('prod.logToday')}
          </Button>
        </div>
      </BlurFade>

      {/* the lead-gen block — the page's headline meter */}
      <BlurFade delay={0.05}>
        <section
          className={`rounded-sheet border bg-paper-raised p-5 shadow-sheet sm:p-6 ${
            blockDone ? 'border-ink-green/60' : 'border-rule'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
            <div className="min-w-[240px] flex-1">
              <div className="flex items-center gap-2.5">
                <Timer className="size-[18px] text-ink-red" aria-hidden />
                <h2 className="font-display text-[18px] font-semibold text-carbon">
                  {t('prod.blockTitle')}
                </h2>
                {blockDone && <Stamp tone="green">{t("prod.blockDone")}</Stamp>}
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-figure text-[34px] font-semibold leading-none text-carbon">
                  {day.leadGenHours}h
                </span>
                <span className="text-figure text-[15px] text-carbon-faint">{t('prod.blockOf', { goal: goals.leadGenHours })}</span>
              </div>
              <div className="mt-3.5 max-w-[520px]">
                <InkMeter
                  value={day.leadGenHours}
                  goal={goals.leadGenHours}
                  tone={blockDone ? 'green' : 'red'}
                  form={blockDone ? 'doubled' : 'solid'}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-2.5 rounded-[10px] border border-rule bg-paper-well/60 px-4 py-3">
                <Flame className="size-5 text-ink-red" aria-hidden />
                <div>
                  <div className="text-figure text-[20px] font-semibold leading-none text-carbon">
                    {data.leadGenStreak}
                  </div>
                  <div className="mt-1 text-[11.5px] font-semibold uppercase tracking-wide text-carbon-faint">
                    {t('prod.dayStreak')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-[10px] border border-rule bg-paper-well/60 px-4 py-3">
                <div className="flex size-5 items-center justify-center rounded-full border-[1.5px] border-ink-amber text-[10px] font-bold text-ink-amber">
                  ★
                </div>
                <div>
                  <div className="text-figure text-[20px] font-semibold leading-none text-carbon">
                    {data.bestStreak}
                  </div>
                  <div className="mt-1 text-[11.5px] font-semibold uppercase tracking-wide text-carbon-faint">
                    {t('prod.bestStreak')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </BlurFade>

      {/* scorecard rings */}
      <BlurFade delay={0.1}>
        <Panel title={t('prod.scorecard')} hint={t('prod.scorecardHint')}>
          <div className="grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-6">
            {RING_METRICS.map((m) => (
              <ScoreRing
                key={m.key}
                value={todayVal(m.key)}
                goal={goals[m.key]}
                label={t(m.labelKey)}
                color={m.color}
                unit={m.unit}
              />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-rule pt-4 text-[13.5px] text-carbon-soft">
            <span>
              <span className="text-figure text-[16px] font-semibold text-carbon">{day.agreementsSigned}</span>{' '}
              {t('prod.agreementsSigned')}
            </span>
            <span>
              <span className="text-figure text-[16px] font-semibold text-carbon">{day.offersWritten}</span>{' '}
              {t('prod.offersWritten')}
            </span>
          </div>
        </Panel>
      </BlurFade>

      {/* 4-1-1 + economic model */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <BlurFade delay={0.05}>
          <Panel title={t('prod.fourOneOne')} hint={t('prod.fourOneOneHint')} bodyClassName="p-0 sm:p-0">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-rule text-left">
                  <th className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-faint sm:px-6">
                    {t('prod.metric')}
                  </th>
                  <th className="px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-ink-red">
                    {t('prod.today')}
                  </th>
                  <th className="px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-faint">
                    {t('prod.week')}
                  </th>
                  <th className="px-5 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-faint sm:px-6">
                    {t('prod.month')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROLLUP_ROWS.map((r) => (
                  <tr key={r.key} className="border-b border-rule/70 last:border-b-0">
                    <td className="px-5 py-2 font-medium text-carbon-soft sm:px-6">{t(r.labelKey)}</td>
                    <td className="text-figure px-3 py-2 text-right font-semibold text-carbon">
                      {todayVal(r.key)}
                    </td>
                    <td className="text-figure px-3 py-2 text-right text-carbon-soft">{data.weekTotals[r.key]}</td>
                    <td className="text-figure px-5 py-2 text-right text-carbon-soft sm:px-6">
                      {data.monthTotals[r.key]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-rule px-5 py-3 text-[12.5px] text-carbon-faint sm:px-6">
              {t('prod.daysLogged', { count: data.monthTotals.daysLogged })}
            </div>
          </Panel>
        </BlurFade>

        <BlurFade delay={0.1}>
          <Panel title={t('prod.economic')} hint={t('prod.economicHint')}>
            <EconomicModel totals={data.last30Totals} />
          </Panel>
        </BlurFade>
      </div>

      {/* weekly block strip */}
      <BlurFade delay={0.05}>
        <Panel title={t('prod.weekStrip')} hint={t('prod.weekStripHint')}>
          <WeekStrip days={data.last7Days} goalHours={goals.leadGenHours} />
        </Panel>
      </BlurFade>

      {logOpen && <LogActivityModal activity={day} onClose={() => setLogOpen(false)} />}
      {goalsOpen && (
        <GoalsModal
          goals={goals}
          saving={goalsMutation.isPending}
          onClose={() => setGoalsOpen(false)}
          onSave={(g) => goalsMutation.mutate(g)}
        />
      )}
    </div>
  );
}

function GoalsModal({
  goals,
  saving,
  onClose,
  onSave,
}: {
  goals: ProductivityGoalsDto;
  saving: boolean;
  onClose: () => void;
  onSave: (g: ProductivityGoalsDto) => void;
}) {
  const [g, setG] = useState<ProductivityGoalsDto>(goals);
  const { t } = useTranslation();
  const rows: { key: keyof ProductivityGoalsDto; labelKey: string; step?: number }[] = [
    { key: 'leadGenHours', labelKey: 'prod.mLeadGen', step: 0.5 },
    { key: 'contacts', labelKey: 'prod.mContacts' },
    { key: 'conversations', labelKey: 'prod.mConversations' },
    { key: 'appointmentsSet', labelKey: 'prod.fApptsSet' },
    { key: 'appointmentsMet', labelKey: 'prod.fApptsMet' },
    { key: 'leadsAdded', labelKey: 'prod.mLeadsAdded' },
  ];
  return (
    <Modal title={t('prod.goalsTitle')} subtitle={t('prod.goalsSubtitle')} onClose={onClose}>
      <div className="space-y-4">
        {rows.map((r) => (
          <Field key={r.key} label={t(r.labelKey)}>
            <TextInput
              type="number"
              min="0"
              step={r.step || 1}
              value={g[r.key]}
              onChange={(e) => setG({ ...g, [r.key]: e.target.value === '' ? 0 : Number(e.target.value) })}
            />
          </Field>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => setG({ ...KW_DEFAULT_GOALS })} disabled={saving}>
          {t('prod.resetKw')}
        </Button>
        <Button className="flex-1" onClick={() => onSave(g)} loading={saving}>
          {t('prod.saveGoals')}
        </Button>
      </div>
    </Modal>
  );
}
