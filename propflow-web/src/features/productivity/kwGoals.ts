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

export type InkTone = 'red' | 'green' | 'blue' | 'amber' | 'plum' | 'teal';

// Metric metadata for the scorecard rings — each metric gets its stationery ink.
export interface MetricMeta {
  key: keyof ProductivityGoalsDto;
  label: string;
  tone: InkTone;
  color: string;
  unit?: string;
}

export const RING_METRICS: MetricMeta[] = [
  { key: 'leadGenHours',    label: 'Lead-Gen Block', tone: 'red',   color: '#b13a25', unit: 'h' },
  { key: 'contacts',        label: 'Contacts',       tone: 'blue',  color: '#2c4a86' },
  { key: 'conversations',   label: 'Conversations',  tone: 'teal',  color: '#23707f' },
  { key: 'appointmentsSet', label: 'Appts Set',      tone: 'plum',  color: '#7a4668' },
  { key: 'leadsAdded',      label: 'Leads Added',    tone: 'green', color: '#2c6a4e' },
  { key: 'appointmentsMet', label: 'Appts Met',      tone: 'amber', color: '#b98a2f' },
];
