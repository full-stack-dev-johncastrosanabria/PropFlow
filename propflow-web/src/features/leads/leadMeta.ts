import { LeadStage, LeadSource } from '../../shared/types';

export interface StageMeta {
  stage: LeadStage;
  label: string;
  icon: string;
  color: string;      // accent color (hex)
  soft: string;       // soft background (rgba/hex)
}

// Ordered pipeline — the columns of the funnel board
export const STAGES: StageMeta[] = [
  { stage: LeadStage.New,         label: 'New',         icon: '✨', color: '#6366f1', soft: 'rgba(99,102,241,0.10)' },
  { stage: LeadStage.Contacted,   label: 'Contacted',   icon: '📞', color: '#0ea5e9', soft: 'rgba(14,165,233,0.10)' },
  { stage: LeadStage.Qualified,   label: 'Qualified',   icon: '✅', color: '#14b8a6', soft: 'rgba(20,184,166,0.10)' },
  { stage: LeadStage.Viewing,     label: 'Viewing',     icon: '🏠', color: '#f59e0b', soft: 'rgba(245,158,11,0.10)' },
  { stage: LeadStage.Negotiation, label: 'Negotiation', icon: '🤝', color: '#f97316', soft: 'rgba(249,115,22,0.10)' },
  { stage: LeadStage.Won,         label: 'Won',         icon: '🎉', color: '#22c55e', soft: 'rgba(34,197,94,0.12)' },
  { stage: LeadStage.Lost,        label: 'Lost',        icon: '💤', color: '#94a3b8', soft: 'rgba(148,163,184,0.12)' },
];

export const stageMeta = (stage: LeadStage): StageMeta =>
  STAGES.find((s) => s.stage === stage) ?? STAGES[0];

export interface SourceMeta {
  source: LeadSource;
  label: string;
  icon: string;
}

export const SOURCES: SourceMeta[] = [
  { source: LeadSource.Website,     label: 'Website',      icon: '🌐' },
  { source: LeadSource.Referral,    label: 'Referral',     icon: '🙌' },
  { source: LeadSource.SocialMedia, label: 'Social Media', icon: '📱' },
  { source: LeadSource.Portal,      label: 'Portal',       icon: '🏷️' },
  { source: LeadSource.WalkIn,      label: 'Walk-in',      icon: '🚶' },
  { source: LeadSource.Other,       label: 'Other',        icon: '📌' },
];

export const sourceMeta = (source: LeadSource): SourceMeta =>
  SOURCES.find((s) => s.source === source) ?? SOURCES[SOURCES.length - 1];

export const formatCurrency = (value: number, currency: string): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
};
