import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productivityApi } from '../../shared/api/productivity';
import type { ProductivitySummaryDto, ActivityTotalsDto, ProductivityGoalsDto } from '../../shared/types';
import { RING_METRICS, KW_DEFAULT_GOALS } from './kwGoals';
import ScoreRing from './components/ScoreRing';
import EconomicModel from './components/EconomicModel';
import WeekStrip from './components/WeekStrip';
import LogActivityModal from './components/LogActivityModal';

const formatDayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });

type RollupKey = { key: keyof ActivityTotalsDto; label: string; icon: string };
const ROLLUP_ROWS: RollupKey[] = [
  { key: 'leadGenHours', label: 'Lead-gen hours', icon: '⏱️' },
  { key: 'contacts', label: 'Contacts', icon: '📞' },
  { key: 'conversations', label: 'Conversations', icon: '💬' },
  { key: 'appointmentsSet', label: 'Appts set', icon: '📅' },
  { key: 'appointmentsMet', label: 'Appts met', icon: '🤝' },
  { key: 'leadsAdded', label: 'Leads added', icon: '➕' },
  { key: 'agreementsSigned', label: 'Agreements', icon: '✍️' },
  { key: 'offersWritten', label: 'Offers', icon: '📝' },
];

export default function ProductivityPage() {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center"><div className="spinner mb-4" /><p className="text-gray-600">Loading your numbers…</p></div>
      </div>
    );
  }
  if (error || !data) {
    return <div className="alert alert-danger"><strong>Error:</strong> {error instanceof Error ? error.message : 'Failed to load'}</div>;
  }

  const t = data.todayActivity;
  const goals = data.goals ?? KW_DEFAULT_GOALS;
  const blockPct = Math.min(100, (t.leadGenHours / goals.leadGenHours) * 100);
  const blockDone = t.leadGenHours >= goals.leadGenHours;

  const todayVal = (k: keyof ActivityTotalsDto): number => {
    const v = (t as unknown as Record<string, number>)[k as string];
    return typeof v === 'number' ? v : 0;
  };

  return (
    <div className="prod">
      {/* Header */}
      <div className="prod-header">
        <div>
          <div className="prod-eyebrow">Keller Williams · Daily Productivity</div>
          <h1 className="prod-title">Your numbers today</h1>
          <p className="prod-sub">{formatDayLabel(data.today)} — lead generation is priority #1.</p>
        </div>
        <div className="prod-actions">
          <button className="btn btn-secondary" onClick={() => setGoalsOpen(true)}>⚙️ Goals</button>
          <button className="btn btn-primary" onClick={() => setLogOpen(true)}>✏️ Log today</button>
        </div>
      </div>

      {/* Lead-gen block hero */}
      <div className={`block-hero ${blockDone ? 'block-hero-done' : ''}`}>
        <div className="block-hero-left">
          <div className="block-hero-icon">{blockDone ? '🔥' : '⏱️'}</div>
          <div>
            <div className="block-hero-label">3-Hour Lead-Gen Block</div>
            <div className="block-hero-value">{t.leadGenHours}h <span className="block-hero-goal">/ {goals.leadGenHours}h today</span></div>
            <div className="block-hero-track"><div className="block-hero-fill" style={{ width: `${blockPct}%` }} /></div>
          </div>
        </div>
        <div className="block-hero-streaks">
          <div className="streak-box">
            <div className="streak-num">{data.leadGenStreak}🔥</div>
            <div className="streak-lbl">Day streak</div>
          </div>
          <div className="streak-box">
            <div className="streak-num">{data.bestStreak}</div>
            <div className="streak-lbl">Best streak</div>
          </div>
        </div>
      </div>

      {/* Scorecard rings */}
      <div className="card dash-panel">
        <div className="panel-head">
          <h3 className="panel-title">Today's scorecard</h3>
          <span className="panel-hint">vs your daily goals</span>
        </div>
        <div className="rings-row">
          {RING_METRICS.map((m) => (
            <ScoreRing
              key={m.key}
              value={todayVal(m.key)}
              goal={goals[m.key]}
              label={m.label}
              icon={m.icon}
              color={m.color}
              unit={m.unit}
            />
          ))}
        </div>
        <div className="secondary-counts">
          <span className="sec-count"><b>{t.agreementsSigned}</b> agreements ✍️</span>
          <span className="sec-count"><b>{t.offersWritten}</b> offers 📝</span>
        </div>
      </div>

      {/* 4-1-1 rollup + Economic model */}
      <div className="dash-grid-2">
        <div className="card dash-panel">
          <div className="panel-head">
            <h3 className="panel-title">The 4-1-1</h3>
            <span className="panel-hint">Today · Week · Month</span>
          </div>
          <table className="rollup-table">
            <thead>
              <tr><th></th><th>Today</th><th>Week</th><th>Month</th></tr>
            </thead>
            <tbody>
              {ROLLUP_ROWS.map((r) => (
                <tr key={r.key}>
                  <td className="rollup-metric">{r.icon} {r.label}</td>
                  <td className="rollup-today">{todayVal(r.key)}</td>
                  <td>{data.weekTotals[r.key]}</td>
                  <td>{data.monthTotals[r.key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="rollup-foot">{data.monthTotals.daysLogged} days logged this month</div>
        </div>

        <div className="card dash-panel">
          <div className="panel-head">
            <h3 className="panel-title">Economic Model</h3>
            <span className="panel-hint">last 30 days · conversion</span>
          </div>
          <EconomicModel totals={data.last30Totals} />
        </div>
      </div>

      {/* Weekly lead-gen strip */}
      <div className="card dash-panel">
        <div className="panel-head">
          <h3 className="panel-title">Lead-gen block · last 7 days</h3>
          <span className="panel-hint">green = 3h block done</span>
        </div>
        <WeekStrip days={data.last7Days} goalHours={goals.leadGenHours} />
      </div>

      {logOpen && <LogActivityModal activity={t} onClose={() => setLogOpen(false)} />}
      {goalsOpen && (
        <GoalsModal
          goals={goals}
          saving={goalsMutation.isPending}
          onClose={() => setGoalsOpen(false)}
          onSave={(g) => goalsMutation.mutate(g)}
        />
      )}

      <div className="h-20 md:hidden" />
    </div>
  );
}

function GoalsModal({ goals, saving, onClose, onSave }: { goals: ProductivityGoalsDto; saving: boolean; onClose: () => void; onSave: (g: ProductivityGoalsDto) => void }) {
  const [g, setG] = useState<ProductivityGoalsDto>(goals);
  const rows: { key: keyof ProductivityGoalsDto; label: string; step?: number }[] = [
    { key: 'leadGenHours', label: '⏱️ Lead-gen hours', step: 0.5 },
    { key: 'contacts', label: '📞 Contacts' },
    { key: 'conversations', label: '💬 Conversations' },
    { key: 'appointmentsSet', label: '📅 Appointments set' },
    { key: 'appointmentsMet', label: '🤝 Appointments met' },
    { key: 'leadsAdded', label: '➕ Leads added' },
  ];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Daily goals</h2>
            <button onClick={onClose} className="lead-modal-close">✕</button>
          </div>
          <div className="space-y-4">
            {rows.map((r) => (
              <div key={r.key} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{r.label}</label>
                <input
                  type="number" min="0" step={r.step || 1} className="form-input"
                  value={g[r.key]}
                  onChange={(e) => setG({ ...g, [r.key]: e.target.value === '' ? 0 : Number(e.target.value) })}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-5">
            <button className="btn btn-secondary flex-1" onClick={() => setG({ ...KW_DEFAULT_GOALS })} disabled={saving}>Reset to KW</button>
            <button className="btn btn-primary flex-1" onClick={() => onSave(g)} disabled={saving}>
              {saving ? 'Saving…' : 'Save goals'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
