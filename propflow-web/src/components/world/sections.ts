import {
  LayoutDashboard,
  Target,
  Flame,
  Building2,
  DoorOpen,
  Users,
  FileText,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export interface NavSection {
  path: string;
  label: string;
  hue: string;
  icon: LucideIcon;
  mobile: 'bar' | 'sheet';
}

// The planner's tab rail — one stationery ink-hue per section.
export const NAV: NavSection[] = [
  { path: '/dashboard', label: 'Today', hue: 'var(--color-carbon)', icon: LayoutDashboard, mobile: 'bar' },
  { path: '/leads', label: 'Leads', hue: 'var(--color-hue-leads)', icon: Target, mobile: 'bar' },
  { path: '/productivity', label: 'Productivity', hue: 'var(--color-hue-productivity)', icon: Flame, mobile: 'bar' },
  { path: '/properties', label: 'Properties', hue: 'var(--color-hue-properties)', icon: Building2, mobile: 'sheet' },
  { path: '/units', label: 'Units', hue: 'var(--color-hue-units)', icon: DoorOpen, mobile: 'sheet' },
  { path: '/tenants', label: 'Tenants', hue: 'var(--color-hue-tenants)', icon: Users, mobile: 'sheet' },
  { path: '/contracts', label: 'Contracts', hue: 'var(--color-hue-contracts)', icon: FileText, mobile: 'sheet' },
  { path: '/payments', label: 'Payments', hue: 'var(--color-hue-payments)', icon: Wallet, mobile: 'sheet' },
  { path: '/maintenance', label: 'Maintenance', hue: 'var(--color-hue-maintenance)', icon: Wrench, mobile: 'sheet' },
];
