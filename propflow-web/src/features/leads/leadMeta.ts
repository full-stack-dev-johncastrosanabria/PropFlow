import { LeadStage, LeadSource } from '../../shared/types';
import { i18n } from '@/i18n';
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
  labelKey: string;
  icon: LucideIcon;
  color: string; // the section's stationery ink
  tone: 'blue' | 'teal' | 'green' | 'amber' | 'persimmon' | 'greenDeep' | 'carbon';
}

// Ordered pipeline — the columns of the funnel board, one ink each.
export const STAGES: StageMeta[] = [
  { stage: LeadStage.New,         labelKey: 'leads.stage0',         icon: Sparkles,   color: '#2c4a86', tone: 'blue' },
  { stage: LeadStage.Contacted,   labelKey: 'leads.stage1',   icon: Phone,      color: '#23707f', tone: 'teal' },
  { stage: LeadStage.Qualified,   labelKey: 'leads.stage2',   icon: BadgeCheck, color: '#2c6a4e', tone: 'green' },
  { stage: LeadStage.Viewing,     labelKey: 'leads.stage3',     icon: Home,       color: '#b98a2f', tone: 'amber' },
  { stage: LeadStage.Negotiation, labelKey: 'leads.stage4', icon: Handshake,  color: '#bf5426', tone: 'persimmon' },
  { stage: LeadStage.Won,         labelKey: 'leads.stage5',         icon: Trophy,     color: '#20503a', tone: 'greenDeep' },
  { stage: LeadStage.Lost,        labelKey: 'leads.stage6',        icon: CircleSlash, color: '#7d7462', tone: 'carbon' },
];

export const stageMeta = (stage: LeadStage): StageMeta =>
  STAGES.find((s) => s.stage === stage) ?? STAGES[0];

export interface SourceMeta {
  source: LeadSource;
  labelKey: string;
  icon: LucideIcon;
}

export const SOURCES: SourceMeta[] = [
  { source: LeadSource.Website,     labelKey: 'leads.srcWebsite',      icon: Globe },
  { source: LeadSource.Referral,    labelKey: 'leads.srcReferral',     icon: Users },
  { source: LeadSource.SocialMedia, labelKey: 'leads.srcSocial', icon: Smartphone },
  { source: LeadSource.Portal,      labelKey: 'leads.srcPortal',       icon: Tag },
  { source: LeadSource.WalkIn,      labelKey: 'leads.srcWalkIn',      icon: Footprints },
  { source: LeadSource.Other,       labelKey: 'leads.srcOther',        icon: CircleEllipsis },
];

export const sourceMeta = (source: LeadSource): SourceMeta =>
  SOURCES.find((s) => s.source === source) ?? SOURCES[SOURCES.length - 1];

export const formatCurrency = (value: number, currency: string): string => {
  try {
    const locale = () => (i18n.language?.toLowerCase().startsWith('es') ? 'es' : 'en-US');
  return new Intl.NumberFormat(locale(), {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
};
