import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { leadsApi } from '../../shared/api/leads';
import type { LeadDto } from '../../shared/types';
import { LeadStage } from '../../shared/types';
import { STAGES, stageMeta, formatCurrency } from './leadMeta';
import LeadCard from './components/LeadCard';
import LeadForm from './components/LeadForm';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { BlurFade } from '@/components/magicui/blur-fade';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { FadingScroll } from '@/components/world/FadingScroll';
import { PageLoading, ErrorNote } from '@/components/world/EmptyState';
import { cn } from '@/lib/utils';

export default function LeadsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadDto | null>(null);
  const [formStage, setFormStage] = useState<LeadStage>(LeadStage.New);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);

  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getAll,
  });

  const stageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: LeadStage }) => leadsApi.updateStage(id, stage),
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });
      const previous = queryClient.getQueryData<LeadDto[]>(['leads']);
      queryClient.setQueryData<LeadDto[]>(['leads'], (old) =>
        (old ?? []).map((l) => (l.id === id ? { ...l, stage } : l)),
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['leads'], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: leadsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  const byStage = useMemo(() => {
    const map = new Map<LeadStage, LeadDto[]>();
    STAGES.forEach((s) => map.set(s.stage, []));
    leads.forEach((l) => map.get(l.stage)?.push(l));
    return map;
  }, [leads]);

  const metrics = useMemo(() => {
    const active = leads.filter((l) => l.stage !== LeadStage.Won && l.stage !== LeadStage.Lost);
    const won = leads.filter((l) => l.stage === LeadStage.Won);
    const lost = leads.filter((l) => l.stage === LeadStage.Lost);
    const pipelineValue = active.reduce((sum, l) => sum + l.estimatedValue, 0);
    const wonValue = won.reduce((sum, l) => sum + l.estimatedValue, 0);
    const decided = won.length + lost.length;
    const winRate = decided > 0 ? Math.round((won.length / decided) * 100) : 0;
    return { total: leads.length, active: active.length, won: won.length, pipelineValue, wonValue, winRate };
  }, [leads]);

  const handleCreate = (stage: LeadStage = LeadStage.New) => {
    setEditingLead(null);
    setFormStage(stage);
    setIsFormOpen(true);
  };

  const handleEdit = (lead: LeadDto) => {
    setEditingLead(lead);
    setIsFormOpen(true);
  };

  const handleDelete = (lead: LeadDto) => {
    if (window.confirm(t('leads.deleteConfirm', { name: lead.fullName }))) {
      deleteMutation.mutate(lead.id);
    }
  };

  const handleDropOn = (stage: LeadStage) => {
    setDragOverStage(null);
    if (draggingId) {
      const lead = leads.find((l) => l.id === draggingId);
      if (lead && lead.stage !== stage) {
        stageMutation.mutate({ id: draggingId, stage });
      }
    }
    setDraggingId(null);
  };

  if (isLoading) return <PageLoading label={t('leads.opening')} />;

  if (error) {
    return <ErrorNote message={error instanceof Error ? error.message : t('leads.fail')} />;
  }

  return (
    <div className="space-y-5">
      <BlurFade className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-bold leading-tight text-carbon sm:text-[34px]">
            {t('leads.title')}
          </h1>
          <p className="mt-1 text-[15px] text-carbon-soft">
            {t('leads.copy')}
          </p>
        </div>
        <ShimmerButton onClick={() => handleCreate()} className="h-11 px-5 text-[14.5px]">
          <Plus className="size-4" aria-hidden />
          {t('leads.new')}
        </ShimmerButton>
      </BlurFade>

      {/* the ledger strip */}
      <BlurFade delay={0.05}>
        <section
          aria-label={t('leads.pipelineFigures')}
          className="grid grid-cols-2 divide-rule rounded-sheet border border-rule bg-paper-raised shadow-sheet lg:grid-cols-4 lg:divide-x"
        >
          <MetricCell label={t('leads.active')} value={metrics.active} foot={t('leads.activeFoot')} />
          <MetricCell
            label={t('dashboard.pipeline')}
            value={formatCurrency(metrics.pipelineValue, 'USD')}
            foot={t('leads.pipelineFoot')}
            mono
          />
          <MetricCell label={t('leads.won')} value={metrics.won} foot={t('leads.wonFoot', { amount: formatCurrency(metrics.wonValue, 'USD') })} cellBorder="max-sm:border-t max-sm:border-rule" />
          <MetricCell
            label={t('leads.winRate')}
            value={`${metrics.winRate}%`}
            foot={t('dashboard.funnelHint', { count: metrics.total })}
            mono
            cellBorder="max-sm:border-t max-sm:border-rule"
          />
        </section>
      </BlurFade>

      {/* the board */}
      <BlurFade delay={0.1}>
        <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
          <div className="flex min-w-[980px] gap-4">
            {STAGES.map((s) => {
              const items = byStage.get(s.stage) ?? [];
              const colValue = items.reduce((sum, l) => sum + l.estimatedValue, 0);
              const over = dragOverStage === s.stage;
              return (
                <div
                  key={s.stage}
                  className={cn(
                    'flex w-[232px] shrink-0 flex-col rounded-sheet border bg-paper-well/40 transition-colors',
                    over ? 'border-ink-blue border-dashed bg-ink-blue/5' : 'border-rule'
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (dragOverStage !== s.stage) setDragOverStage(s.stage);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverStage(null);
                  }}
                  onDrop={() => handleDropOn(s.stage)}
                >
                  {/* the column's ink tab */}
                  <div className="px-3.5 pb-2.5 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex size-6 items-center justify-center rounded-[7px] text-[#fdf8ec]"
                          style={{ backgroundColor: s.color }}
                          aria-hidden
                        >
                          <s.icon className="size-3.5" />
                        </span>
                        <span className="text-[13.5px] font-bold text-carbon">{t(s.labelKey)}</span>
                        <span className="text-figure rounded-full bg-paper-deep px-1.5 text-[11.5px] font-semibold text-carbon-soft">
                          {items.length}
                        </span>
                      </div>
                      <span className="text-figure text-[12px] font-semibold text-carbon-faint">
                        {formatCurrency(colValue, 'USD')}
                      </span>
                    </div>
                  </div>

                  <FadingScroll
                    className="min-h-[120px] flex-1"
                    innerClassName="flex flex-col gap-2 px-2.5 pt-0.5 pb-12 max-h-[380px]"
                  >
                    {items.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        accent={stageMeta(lead.stage).color}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onDragStart={(l) => setDraggingId(l.id)}
                        onDragEnd={() => { setDraggingId(null); setDragOverStage(null); }}
                        isDragging={draggingId === lead.id}
                        dimmed={!!draggingId && draggingId !== lead.id}
                      />
                    ))}

                    {items.length === 0 && (
                      <div className="flex flex-1 items-center justify-center rounded-[10px] border border-dashed border-rule-strong/70 py-10 text-[12.5px] text-carbon-faint">
                        {t('leads.dropHere')}
                      </div>
                    )}
                  </FadingScroll>

                  <div className="px-2.5 pb-2.5">
                    <button
                      className="flex w-full items-center justify-center gap-1.5 rounded-[9px] border border-dashed border-rule-strong/70 py-2 text-[12.5px] font-semibold text-carbon-soft transition-colors hover:border-ink-blue/60 hover:bg-ink-blue/5 hover:text-ink-blue"
                      onClick={() => handleCreate(s.stage)}
                    >
                      <Plus className="size-3.5" aria-hidden /> {t('leads.add')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </BlurFade>

      {isFormOpen && (
        <LeadForm
          lead={editingLead}
          defaultStage={formStage}
          onClose={() => { setIsFormOpen(false); setEditingLead(null); }}
        />
      )}
    </div>
  );
}

function MetricCell({
  label,
  value,
  foot,
  mono,
  cellBorder,
}: {
  label: string;
  value: React.ReactNode;
  foot: string;
  mono?: boolean;
  cellBorder?: string;
}) {
  return (
    <div className={`p-4 sm:p-5 ${cellBorder ?? ''}`}>
      <div className="text-rule-label">{label}</div>
      <div
        className={cn(
          'mt-2 text-[24px] font-semibold leading-none text-carbon sm:text-[26px]',
          mono && 'text-figure'
        )}
      >
        {typeof value === 'number' ? <NumberTicker value={value} /> : value}
      </div>
      <div className="mt-2 text-[12.5px] text-carbon-faint">{foot}</div>
    </div>
  );
}
