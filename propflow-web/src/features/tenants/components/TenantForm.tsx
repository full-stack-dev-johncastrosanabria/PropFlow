import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { tenantsApi } from '../../../shared/api/tenants';
import type { TenantDto, UpdateTenantDto } from '../../../shared/types';
import { Modal } from '@/components/world/Modal';
import { Field, TextInput, Textarea } from '@/components/world/fields';
import { Button } from '@/components/world/Button';
import { ErrorNote } from '@/components/world/EmptyState';

interface TenantFormProps {
  tenant?: TenantDto | null;
  onClose: () => void;
}

export default function TenantForm({ tenant, onClose }: TenantFormProps) {
  const [formData, setFormData] = useState({
    fullName: tenant?.fullName || '',
    email: tenant?.email || '',
    phone: tenant?.phone || '',
    identificationNumber: tenant?.identificationNumber || '',
    notes: tenant?.notes || '',
  });
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: tenantsApi.create,
    onSuccess: onClose,
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create tenant'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantDto }) => tenantsApi.update(id, data),
    onSuccess: onClose,
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to update tenant'),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email) {
      setError('A name and email are needed before this tenant can be saved.');
      return;
    }

    const data = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      identificationNumber: formData.identificationNumber || undefined,
      notes: formData.notes || undefined,
    };

    if (tenant) {
      updateMutation.mutate({ id: tenant.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={tenant ? 'Edit tenant' : 'Add tenant'}
      subtitle="Who they are and how to reach them."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" required>
          <TextInput
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Tenant's full name"
            required
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email" required>
            <TextInput
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              required
            />
          </Field>
          <Field label="Phone">
            <TextInput
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 555 000 0000"
            />
          </Field>
        </div>

        <Field label="ID number">
          <TextInput
            value={formData.identificationNumber}
            onChange={(e) => setFormData({ ...formData, identificationNumber: e.target.value })}
            placeholder="ID or passport number"
          />
        </Field>

        <Field label="Notes">
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Anything worth remembering about this tenant"
            rows={3}
          />
        </Field>

        {error && <ErrorNote message={error} />}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={isLoading}>
            {tenant ? 'Update tenant' : 'Create tenant'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
