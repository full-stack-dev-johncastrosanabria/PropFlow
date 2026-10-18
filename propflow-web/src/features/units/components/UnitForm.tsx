import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { unitsApi } from '../../../shared/api/units';
import { UnitStatus, type RentalUnitDto, type PropertyDto, type CreateRentalUnitDto, type UpdateRentalUnitDto } from '../../../shared/types';
import { Modal } from '@/components/world/Modal';
import { Field, TextInput, Select } from '@/components/world/fields';
import { Button } from '@/components/world/Button';
import { ErrorNote } from '@/components/world/EmptyState';

interface UnitFormProps {
  unit?: RentalUnitDto | null;
  properties: PropertyDto[];
  onClose: () => void;
}

export default function UnitForm({ unit, properties, onClose }: UnitFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    propertyId: unit?.propertyId || '',
    name: unit?.name || '',
    unitNumber: unit?.unitNumber || '',
    monthlyRent: unit?.monthlyRent || 0,
    currency: unit?.currency || 'USD',
    status: unit?.status ?? UnitStatus.Available,
  });
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: unitsApi.create,
    onSuccess: onClose,
    onError: (err) => setError(err instanceof Error ? err.message : t('units.createFailed')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRentalUnitDto }) => unitsApi.update(id, data),
    onSuccess: onClose,
    onError: (err) => setError(err instanceof Error ? err.message : t('units.updateFailed')),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.propertyId || !formData.name || formData.monthlyRent <= 0) {
      setError(t('units.required'));
      return;
    }

    if (unit) {
      const updateData: UpdateRentalUnitDto = {
        name: formData.name,
        unitNumber: formData.unitNumber || undefined,
        monthlyRent: formData.monthlyRent,
        currency: formData.currency,
        status: formData.status,
      };
      updateMutation.mutate({ id: unit.id, data: updateData });
    } else {
      const createData: CreateRentalUnitDto = {
        propertyId: formData.propertyId,
        name: formData.name,
        unitNumber: formData.unitNumber || undefined,
        monthlyRent: formData.monthlyRent,
        currency: formData.currency,
        status: formData.status,
      };
      createMutation.mutate(createData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={unit ? t('units.edit') : t('units.add')}
      subtitle={t('units.formSubtitle')}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label={t('nav.properties')} required>
          <Select
            value={formData.propertyId}
            onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
            required
            disabled={!!unit}
          >
            <option value="">{t('units.selectProperty')}</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('units.name')} required>
            <TextInput
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('units.namePlaceholder')}
              required
            />
          </Field>
          <Field label={t('units.number')}>
            <TextInput
              value={formData.unitNumber}
              onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
              placeholder={t('units.numberPlaceholder')}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('units.monthlyRent')} required>
            <TextInput
              type="number"
              step="0.01"
              min="0"
              value={formData.monthlyRent}
              onChange={(e) => setFormData({ ...formData, monthlyRent: parseFloat(e.target.value) || 0 })}
              required
            />
          </Field>
          <Field label={t('leads.currency')}>
            <Select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CRC">CRC</option>
            </Select>
          </Field>
        </div>

        <Field label={t('contracts.status')}>
          <Select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) as UnitStatus })}
          >
            <option value={UnitStatus.Available}>{t('units.statusAvailable')}</option>
            <option value={UnitStatus.Occupied}>{t('units.statusOccupied')}</option>
            <option value={UnitStatus.Maintenance}>{t('units.statusMaintenance')}</option>
          </Select>
        </Field>

        {error && <ErrorNote message={error} />}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" className="flex-1" loading={isLoading}>
            {unit ? t('units.update') : t('units.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
