import { useState, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productivityApi } from '../../../shared/api/productivity';
import type { DailyActivityDto } from '../../../shared/types';

interface Props {
  activity: DailyActivityDto;
  onClose: () => void;
}

const FIELDS: { key: keyof DailyActivityDto; label: string; icon: string; step?: number }[] = [
  { key: 'leadGenHours', label: 'Lead-gen hours (time block)', icon: '⏱️', step: 0.5 },
  { key: 'contacts', label: 'Contacts (calls/texts/touches)', icon: '📞' },
  { key: 'conversations', label: 'Conversations', icon: '💬' },
  { key: 'leadsAdded', label: 'New leads added to database', icon: '➕' },
  { key: 'appointmentsSet', label: 'Appointments set', icon: '📅' },
  { key: 'appointmentsMet', label: 'Appointments met', icon: '🤝' },
  { key: 'agreementsSigned', label: 'Agreements signed', icon: '✍️' },
  { key: 'offersWritten', label: 'Offers written', icon: '📝' },
];

export default function LogActivityModal({ activity, onClose }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    contacts: activity.contacts,
    conversations: activity.conversations,
    leadsAdded: activity.leadsAdded,
    appointmentsSet: activity.appointmentsSet,
    appointmentsMet: activity.appointmentsMet,
    agreementsSigned: activity.agreementsSigned,
    offersWritten: activity.offersWritten,
    leadGenHours: activity.leadGenHours,
    notes: activity.notes || '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      productivityApi.upsertDay({
        date: activity.date,
        ...form,
        notes: form.notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productivity'] });
      onClose();
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to save'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate();
  };

  const set = (key: string, raw: string) =>
    setForm({ ...form, [key]: raw === '' ? 0 : Number(raw) });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Log today's activity</h2>
            <button onClick={onClose} className="lead-modal-close">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-grid">
              {FIELDS.map((f) => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.icon} {f.label}</label>
                  <input
                    type="number"
                    min="0"
                    step={f.step || 1}
                    className="form-input"
                    value={(form as Record<string, number | string>)[f.key] as number}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                style={{ minHeight: 70 }}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Wins, blockers, follow-ups…"
                rows={2}
              />
            </div>

            {error && <div className="alert alert-danger"><strong>Error:</strong> {error}</div>}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn btn-secondary flex-1" disabled={mutation.isPending}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-1" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <div className="flex items-center gap-2"><div className="spinner w-4 h-4" /> Saving…</div>
                ) : 'Save activity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
