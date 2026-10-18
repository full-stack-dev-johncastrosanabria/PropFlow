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
  labelKey: string;
  hue: string;
  icon: LucideIcon;
  mobile: 'bar' | 'sheet';
}

// The planner's tab rail — one stationery ink-hue per section. Labels resolve
// through i18n at render time so the language toggle updates instantly.
export const NAV: NavSection[] = [
  { path: '/dashboard', labelKey: 'nav.today', hue: 'var(--color-carbon)', icon: LayoutDashboard, mobile: 'bar' },
  { path: '/leads', labelKey: 'nav.leads', hue: 'var(--color-hue-leads)', icon: Target, mobile: 'bar' },
  { path: '/productivity', labelKey: 'nav.productivity', hue: 'var(--color-hue-productivity)', icon: Flame, mobile: 'bar' },
  { path: '/properties', labelKey: 'nav.properties', hue: 'var(--color-hue-properties)', icon: Building2, mobile: 'sheet' },
  { path: '/units', labelKey: 'nav.units', hue: 'var(--color-hue-units)', icon: DoorOpen, mobile: 'sheet' },
  { path: '/tenants', labelKey: 'nav.tenants', hue: 'var(--color-hue-tenants)', icon: Users, mobile: 'sheet' },
  { path: '/contracts', labelKey: 'nav.contracts', hue: 'var(--color-hue-contracts)', icon: FileText, mobile: 'sheet' },
  { path: '/payments', labelKey: 'nav.payments', hue: 'var(--color-hue-payments)', icon: Wallet, mobile: 'sheet' },
  { path: '/maintenance', labelKey: 'nav.maintenance', hue: 'var(--color-hue-maintenance)', icon: Wrench, mobile: 'sheet' },
];
