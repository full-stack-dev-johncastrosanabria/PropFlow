import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productivityApi } from '../../../shared/api/productivity';
import type { DailyActivityDto } from '../../../shared/types';
import { Modal } from '@/components/world/Modal';
import { Field, TextInput, Textarea } from '@/components/world/fields';
import { Button } from '@/components/world/Button';
import { ErrorNote } from '@/components/world/EmptyState';

interface Props {
  activity: DailyActivityDto;
  onClose: () => void;
}

const FIELDS: { key: keyof DailyActivityDto; label: string; step?: number }[] = [
  { key: 'leadGenHours', label: 'Lead-gen hours (the time block)', step: 0.5 },
  { key: 'contacts', label: 'Contacts (calls, texts, touches)' },
  { key: 'conversations', label: 'Conversations' },
  { key: 'leadsAdded', label: 'New leads added to database' },
  { key: 'appointmentsSet', label: 'Appointments set' },
  { key: 'appointmentsMet', label: 'Appointments met' },
  { key: 'agreementsSigned', label: 'Agreements signed' },
  { key: 'offersWritten', label: 'Offers written' },
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
    <Modal title="Log today's activity" subtitle="The numbers only count if they go on the sheet." onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              <TextInput
                type="number"
                min="0"
                step={f.step || 1}
                value={(form as Record<string, number | string>)[f.key] as number}
                onChange={(e) => set(f.key, e.target.value)}
              />
            </Field>
          ))}
        </div>

        <Field label="Notes">
          <Textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Wins, blockers, follow-ups…"
            rows={2}
          />
        </Field>

        {error && <ErrorNote message={error} />}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={mutation.isPending}>
            Save activity
          </Button>
        </div>
      </form>
    </Modal>
  );
}
