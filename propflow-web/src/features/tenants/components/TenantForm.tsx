import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    onError: (err) => setError(err instanceof Error ? err.message : t('tenants.createFailed')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantDto }) => tenantsApi.update(id, data),
    onSuccess: onClose,
    onError: (err) => setError(err instanceof Error ? err.message : t('tenants.updateFailed')),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email) {
      setError(t('tenants.nameEmailRequired'));
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
      title={tenant ? t('tenants.edit') : t('tenants.add')}
      subtitle={t('tenants.formSubtitle')}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label={t('auth.fullName')} required>
          <TextInput
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder={t('tenants.namePlaceholder')}
            required
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('auth.email')} required>
            <TextInput
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              required
            />
          </Field>
          <Field label={t('leads.phone')}>
            <TextInput
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 555 000 0000"
            />
          </Field>
        </div>

        <Field label={t('tenants.idNumber')}>
          <TextInput
            value={formData.identificationNumber}
            onChange={(e) => setFormData({ ...formData, identificationNumber: e.target.value })}
            placeholder={t('tenants.idPlaceholder')}
          />
        </Field>

        <Field label={t('leads.notes')}>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder={t('tenants.notesPlaceholder')}
            rows={3}
          />
        </Field>

        {error && <ErrorNote message={error} />}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" className="flex-1" loading={isLoading}>
            {tenant ? t('tenants.update') : t('tenants.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
