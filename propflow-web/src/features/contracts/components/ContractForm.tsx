import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { contractsApi } from '../../../shared/api/contracts';
import { ContractStatus, UnitStatus, type ContractDto, type TenantDto, type RentalUnitDto, type CreateContractDto, type UpdateContractDto } from '../../../shared/types';
import { Modal } from '@/components/world/Modal';
import { Field, TextInput, Select } from '@/components/world/fields';
import { Button } from '@/components/world/Button';
import { ErrorNote } from '@/components/world/EmptyState';

interface ContractFormProps {
  contract?: ContractDto | null;
  tenants: TenantDto[];
  units: RentalUnitDto[];
  onClose: () => void;
}

export default function ContractForm({ contract, tenants, units, onClose }: ContractFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    tenantId: contract?.tenantId || '',
    rentalUnitId: contract?.rentalUnitId || '',
    startDate: contract?.startDate ? contract.startDate.split('T')[0] : '',
    endDate: contract?.endDate ? contract.endDate.split('T')[0] : '',
    monthlyRent: contract?.monthlyRent || 0,
    depositAmount: contract?.depositAmount || 0,
    currency: contract?.currency || 'USD',
    status: contract?.status ?? ContractStatus.Active,
  });
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: contractsApi.create,
    onSuccess: onClose,
    onError: (err) => setError(err instanceof Error ? err.message : t('contracts.createFailed')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContractDto }) => contractsApi.update(id, data),
    onSuccess: onClose,
    onError: (err) => setError(err instanceof Error ? err.message : t('contracts.updateFailed')),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.tenantId || !formData.rentalUnitId || !formData.startDate || formData.monthlyRent <= 0) {
      setError(t('contracts.required'));
      return;
    }

    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError(t('contracts.endDateAfter'));
      return;
    }

    if (contract) {
      const updateData: UpdateContractDto = {
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        monthlyRent: formData.monthlyRent,
        depositAmount: formData.depositAmount,
        currency: formData.currency,
        status: formData.status,
      };
      updateMutation.mutate({ id: contract.id, data: updateData });
    } else {
      const createData: CreateContractDto = {
        tenantId: formData.tenantId,
        rentalUnitId: formData.rentalUnitId,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        monthlyRent: formData.monthlyRent,
        depositAmount: formData.depositAmount,
        currency: formData.currency,
        status: formData.status,
      };
      createMutation.mutate(createData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Available units: not occupied, unless it's the current contract's unit
  const availableUnits = units.filter(
    (unit) => unit.status !== UnitStatus.Occupied || unit.id === contract?.rentalUnitId
  );

  return (
    <Modal
      title={contract ? t('contracts.edit') : t('contracts.add')}
      subtitle={t('contracts.formSubtitle')}
      onClose={onClose}
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('nav.tenants')} required>
            <Select
              value={formData.tenantId}
              onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
              required
              disabled={!!contract}
            >
              <option value="">{t('contracts.selectTenant')}</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.fullName} ({tenant.email})
                </option>
              ))}
            </Select>
          </Field>

          <Field label={t('nav.units')} required>
            <Select
              value={formData.rentalUnitId}
              onChange={(e) => setFormData({ ...formData, rentalUnitId: e.target.value })}
              required
              disabled={!!contract}
            >
              <option value="">{t('units.selectProperty')}</option>
              {availableUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name} — {unit.currency} {unit.monthlyRent.toLocaleString()}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('contracts.startDate')} required>
            <TextInput
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </Field>
          <Field label={t('contracts.endDate')}>
            <TextInput
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
          <Field label={t('contracts.depositAmount')}>
            <TextInput
              type="number"
              step="0.01"
              min="0"
              value={formData.depositAmount}
              onChange={(e) => setFormData({ ...formData, depositAmount: parseFloat(e.target.value) || 0 })}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <Field label={t('contracts.status')}>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) as ContractStatus })}
            >
              <option value={ContractStatus.Active}>{t('contracts.statusActive')}</option>
              <option value={ContractStatus.Finished}>{t('contracts.statusFinished')}</option>
              <option value={ContractStatus.Cancelled}>{t('contracts.statusCancelled')}</option>
            </Select>
          </Field>
        </div>

        {error && <ErrorNote message={error} />}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" className="flex-1" loading={isLoading}>
            {contract ? t('contracts.update') : t('contracts.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
