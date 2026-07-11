import type { ProductivityGoalsDto } from '../../shared/types';

// Keller Williams daily goal defaults. Rooted in the MREA "lead generation"
// discipline: a 3-hour daily time block and a high volume of contacts.
// Goals are persisted per-agent in the database; these are the fallback defaults.
export const KW_DEFAULT_GOALS: ProductivityGoalsDto = {
  leadGenHours: 3,     // the sacred 3-hour lead-gen time block
  contacts: 20,        // touches per day
  conversations: 10,   // meaningful conversations
  appointmentsSet: 2,  // appointments scheduled
  leadsAdded: 2,       // new to database / SOI
  appointmentsMet: 1,  // appointments held
};

// Metric metadata for the scorecard rings.
export interface MetricMeta {
  key: keyof ProductivityGoalsDto;
  label: string;
  icon: string;
  color: string;
  unit?: string;
}

export const RING_METRICS: MetricMeta[] = [
  { key: 'leadGenHours',    label: 'Lead-Gen Block', icon: '⏱️', color: '#e11d48', unit: 'h' },
  { key: 'contacts',        label: 'Contacts',       icon: '📞', color: '#2563eb' },
  { key: 'conversations',   label: 'Conversations',  icon: '💬', color: '#0ea5e9' },
  { key: 'appointmentsSet', label: 'Appts Set',      icon: '📅', color: '#7c3aed' },
  { key: 'leadsAdded',      label: 'Leads Added',    icon: '➕', color: '#14b8a6' },
  { key: 'appointmentsMet', label: 'Appts Met',      icon: '🤝', color: '#f59e0b' },
];
