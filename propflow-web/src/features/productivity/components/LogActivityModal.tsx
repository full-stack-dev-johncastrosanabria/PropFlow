import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
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

const FIELDS: { key: keyof DailyActivityDto; labelKey: string; step?: number }[] = [
  { key: 'leadGenHours', labelKey: 'prod.fLeadGen', step: 0.5 },
  { key: 'contacts', labelKey: 'prod.fContacts' },
  { key: 'conversations', labelKey: 'prod.fConversations' },
  { key: 'leadsAdded', labelKey: 'prod.fLeadsAdded' },
  { key: 'appointmentsSet', labelKey: 'prod.fApptsSet' },
  { key: 'appointmentsMet', labelKey: 'prod.fApptsMet' },
  { key: 'agreementsSigned', labelKey: 'prod.fAgreements' },
  { key: 'offersWritten', labelKey: 'prod.fOffers' },
];

export default function LogActivityModal({ activity, onClose }: Props) {
  const { t } = useTranslation();
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
    onError: (err) => setError(err instanceof Error ? err.message : t('prod.saveFailed')),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate();
  };

  const set = (key: string, raw: string) =>
    setForm({ ...form, [key]: raw === '' ? 0 : Number(raw) });

  return (
    <Modal title={t('prod.logTitle')} subtitle={t('prod.logSubtitle')} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <Field key={f.key} label={t(f.labelKey)}>
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

        <Field label={t('leads.notes')}>
          <Textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={t('prod.notesPlaceholder')}
            rows={2}
          />
        </Field>

        {error && <ErrorNote message={error} />}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={mutation.isPending}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" className="flex-1" loading={mutation.isPending}>
            {t('prod.saveActivity')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
