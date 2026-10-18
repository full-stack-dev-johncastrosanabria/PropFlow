import { LeadStage, LeadSource } from '../../shared/types';
import {
  Sparkles,
  Phone,
  BadgeCheck,
  Home,
  Handshake,
  Trophy,
  CircleSlash,
  Globe,
  Users,
  Smartphone,
  Tag,
  Footprints,
  CircleEllipsis,
  type LucideIcon,
} from 'lucide-react';

export interface StageMeta {
  stage: LeadStage;
  label: string;
  icon: LucideIcon;
  color: string; // the section's stationery ink
  tone: 'blue' | 'teal' | 'green' | 'amber' | 'persimmon' | 'greenDeep' | 'carbon';
}

// Ordered pipeline — the columns of the funnel board, one ink each.
export const STAGES: StageMeta[] = [
  { stage: LeadStage.New,         label: 'New',         icon: Sparkles,   color: '#2c4a86', tone: 'blue' },
  { stage: LeadStage.Contacted,   label: 'Contacted',   icon: Phone,      color: '#23707f', tone: 'teal' },
  { stage: LeadStage.Qualified,   label: 'Qualified',   icon: BadgeCheck, color: '#2c6a4e', tone: 'green' },
  { stage: LeadStage.Viewing,     label: 'Viewing',     icon: Home,       color: '#b98a2f', tone: 'amber' },
  { stage: LeadStage.Negotiation, label: 'Negotiation', icon: Handshake,  color: '#bf5426', tone: 'persimmon' },
  { stage: LeadStage.Won,         label: 'Won',         icon: Trophy,     color: '#20503a', tone: 'greenDeep' },
  { stage: LeadStage.Lost,        label: 'Lost',        icon: CircleSlash, color: '#7d7462', tone: 'carbon' },
];

export const stageMeta = (stage: LeadStage): StageMeta =>
  STAGES.find((s) => s.stage === stage) ?? STAGES[0];

export interface SourceMeta {
  source: LeadSource;
  label: string;
  icon: LucideIcon;
}

export const SOURCES: SourceMeta[] = [
  { source: LeadSource.Website,     label: 'Website',      icon: Globe },
  { source: LeadSource.Referral,    label: 'Referral',     icon: Users },
  { source: LeadSource.SocialMedia, label: 'Social Media', icon: Smartphone },
  { source: LeadSource.Portal,      label: 'Portal',       icon: Tag },
  { source: LeadSource.WalkIn,      label: 'Walk-in',      icon: Footprints },
  { source: LeadSource.Other,       label: 'Other',        icon: CircleEllipsis },
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
