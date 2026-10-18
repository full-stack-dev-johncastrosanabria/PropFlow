import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { leadsApi } from '../../../shared/api/leads';
import type { LeadDto, UpdateLeadDto } from '../../../shared/types';
import { LeadStage, LeadSource } from '../../../shared/types';
import { STAGES, SOURCES } from '../leadMeta';
import { Modal } from '@/components/world/Modal';
import { Field, TextInput, Select, Textarea } from '@/components/world/fields';
import { Button } from '@/components/world/Button';
import { ErrorNote } from '@/components/world/EmptyState';

interface LeadFormProps {
  lead?: LeadDto | null;
  defaultStage?: LeadStage;
  onClose: () => void;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'MXN'];

export default function LeadForm({ lead, defaultStage, onClose }: LeadFormProps) {
  const [formData, setFormData] = useState({
    fullName: lead?.fullName || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    source: lead?.source ?? LeadSource.Website,
    stage: lead?.stage ?? defaultStage ?? LeadStage.New,
    estimatedValue: lead?.estimatedValue ?? 0,
    currency: lead?.currency || 'USD',
    interestedIn: lead?.interestedIn || '',
    notes: lead?.notes || '',
  });
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: leadsApi.create,
    onSuccess: onClose,
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create lead'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadDto }) => leadsApi.update(id, data),
    onSuccess: onClose,
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to update lead'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email) {
      setError('A name and email are needed before this lead can be saved.');
      return;
    }

    const data = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      source: Number(formData.source),
      stage: Number(formData.stage),
      estimatedValue: Number(formData.estimatedValue) || 0,
      currency: formData.currency,
      interestedIn: formData.interestedIn || undefined,
      notes: formData.notes || undefined,
    };

    if (lead) {
      updateMutation.mutate({ id: lead.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal title={lead ? 'Edit lead' : 'New lead'} subtitle="Who's looking, for what, and where they stand." onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" required>
            <TextInput
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Lead's full name"
              required
            />
          </Field>
          <Field label="Email" required>
            <TextInput
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Phone">
            <TextInput
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 555 000 0000"
            />
          </Field>
          <Field label="Looking for">
            <TextInput
              value={formData.interestedIn}
              onChange={(e) => setFormData({ ...formData, interestedIn: e.target.value })}
              placeholder="e.g. 2BR downtown"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Stage">
            <Select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: Number(e.target.value) })}
            >
              {STAGES.map((s) => (
                <option key={s.stage} value={s.stage}>{s.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Source">
            <Select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: Number(e.target.value) })}
            >
              {SOURCES.map((s) => (
                <option key={s.source} value={s.source}>{s.label}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Estimated value (monthly)">
            <TextInput
              type="number"
              min="0"
              step="50"
              value={formData.estimatedValue}
              onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
              placeholder="0"
            />
          </Field>
          <Field label="Currency">
            <Select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Notes">
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Context, next steps, preferences…"
            rows={3}
          />
        </Field>

        {error && <ErrorNote message={error} />}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={isLoading}>
            {lead ? 'Save changes' : 'Create lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
