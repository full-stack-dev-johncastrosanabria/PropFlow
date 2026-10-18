import { i18n } from '@/i18n';

const locale = (): string => (i18n.language?.toLowerCase().startsWith('es') ? 'es' : 'en-US');

export const money = (value: number, currency = 'USD', compact = false): string => {
  try {
    return new Intl.NumberFormat(locale(), {
      style: 'currency',
      currency: currency || 'USD',
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 1 : 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
};

export const shortDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString(locale(), { month: 'short', day: 'numeric' });
};

export const relativeTime = (iso: string): string => {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return i18n.t('dashboard.relNow');
  if (mins < 60) return i18n.t('dashboard.relMin', { count: mins });
  const hours = Math.round(mins / 60);
  if (hours < 24) return i18n.t('dashboard.relHour', { count: hours });
  const days = Math.round(hours / 24);
  if (days < 30) return i18n.t('dashboard.relDay', { count: days });
  const months = Math.round(days / 30);
  return i18n.t('dashboard.relMonth', { count: months });
};

export const todayLabel = (): string =>
  new Date().toLocaleDateString(locale(), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
