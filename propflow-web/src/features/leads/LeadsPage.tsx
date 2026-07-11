import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../../shared/api/leads';
import type { LeadDto } from '../../shared/types';
import { LeadStage } from '../../shared/types';
import { STAGES, stageMeta, formatCurrency } from './leadMeta';
import LeadCard from './components/LeadCard';
import LeadForm from './components/LeadForm';

export default function LeadsPage() {
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
    if (window.confirm(`Delete lead "${lead.fullName}"?`)) {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-gray-600">Loading pipeline…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error instanceof Error ? error.message : 'Failed to load leads'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="funnel-header">
        <div>
          <h1 className="funnel-title">Sales Funnel</h1>
          <p className="funnel-subtitle">Track and convert your rental leads through the pipeline</p>
        </div>
        <button onClick={() => handleCreate()} className="btn btn-primary">
          <span className="text-lg">➕</span> New Lead
        </button>
      </div>

      {/* Metrics */}
      <div className="funnel-metrics">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(99,102,241,0.12)' }}>👥</div>
          <div>
            <div className="metric-value">{metrics.active}</div>
            <div className="metric-label">Active Leads</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(14,165,233,0.12)' }}>💼</div>
          <div>
            <div className="metric-value">{formatCurrency(metrics.pipelineValue, 'USD')}</div>
            <div className="metric-label">Pipeline Value / mo</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(34,197,94,0.14)' }}>🎉</div>
          <div>
            <div className="metric-value">{metrics.won}</div>
            <div className="metric-label">Won Deals</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(245,158,11,0.14)' }}>📈</div>
          <div>
            <div className="metric-value">{metrics.winRate}%</div>
            <div className="metric-label">Win Rate</div>
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <div className="funnel-board">
        {STAGES.map((s) => {
          const items = byStage.get(s.stage) ?? [];
          const colValue = items.reduce((sum, l) => sum + l.estimatedValue, 0);
          return (
            <div
              key={s.stage}
              className={`funnel-col ${dragOverStage === s.stage ? 'funnel-col-over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverStage !== s.stage) setDragOverStage(s.stage);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverStage(null);
              }}
              onDrop={() => handleDropOn(s.stage)}
            >
              <div className="funnel-col-head" style={{ borderTopColor: s.color }}>
                <div className="funnel-col-title">
                  <span className="funnel-col-dot" style={{ background: s.color }} />
                  <span>{s.icon} {s.label}</span>
                  <span className="funnel-col-count">{items.length}</span>
                </div>
                <div className="funnel-col-value">{formatCurrency(colValue, 'USD')}</div>
              </div>

              <div className="funnel-col-body">
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
                  />
                ))}

                {items.length === 0 && (
                  <div className="funnel-col-empty">Drop leads here</div>
                )}

                <button className="funnel-add-btn" onClick={() => handleCreate(s.stage)}>
                  + Add
                </button>
              </div>
            </div>
          );
        })}
      </div>

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
