import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { maintenanceApi } from '../../../shared/api/maintenance';
import { Priority, MaintenanceStatus, type MaintenanceRequestDto, type PropertyDto, type RentalUnitDto, type CreateMaintenanceRequestDto, type UpdateMaintenanceRequestDto } from '../../../shared/types';
import { Modal } from '@/components/world/Modal';
import { Field, TextInput, Select, Textarea } from '@/components/world/fields';
import { Button } from '@/components/world/Button';
import { ErrorNote } from '@/components/world/EmptyState';

interface MaintenanceFormProps {
  request?: MaintenanceRequestDto | null;
  properties: PropertyDto[];
  units: RentalUnitDto[];
  onClose: () => void;
}

interface FormErrors {
  propertyId?: string;
  title?: string;
  description?: string;
  submit?: string;
}

export default function MaintenanceForm({ request, properties, units, onClose }: MaintenanceFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    propertyId: '',
    rentalUnitId: '',
    title: '',
    description: '',
    priority: Priority.Medium,
    status: MaintenanceStatus.Open,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (request) {
      setFormData({
        propertyId: request.propertyId,
        rentalUnitId: request.rentalUnitId || '',
        title: request.title,
        description: request.description,
        priority: request.priority,
        status: request.status,
      });
    }
  }, [request]);

  const filteredUnits = formData.propertyId
    ? units.filter((unit) => unit.propertyId === formData.propertyId)
    : [];

  const createMutation = useMutation({
    mutationFn: maintenanceApi.create,
    onSuccess: onClose,
    onError: () => setErrors({ submit: t('mt.createFailed') }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMaintenanceRequestDto }) =>
      maintenanceApi.update(id, data),
    onSuccess: onClose,
    onError: () => setErrors({ submit: t('mt.updateFailed') }),
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.propertyId) newErrors.propertyId = t('mt.errProperty');
    if (!formData.title.trim()) newErrors.title = t('mt.errTitle');
    if (!formData.description.trim()) newErrors.description = t('mt.errDescription');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      propertyId: formData.propertyId,
      rentalUnitId: formData.rentalUnitId || undefined,
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
    };

    if (request) {
      updateMutation.mutate({ id: request.id, data: submitData });
    } else {
      createMutation.mutate(submitData as CreateMaintenanceRequestDto);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // reset the unit when the property changes and the unit no longer belongs
      ...(name === 'propertyId' && prev.rentalUnitId && !units.find((u) => u.id === prev.rentalUnitId && u.propertyId === value)
        ? { rentalUnitId: '' }
        : {}),
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={request ? t('mt.edit') : t('mt.add')}
      subtitle={t('mt.formSubtitle')}
      onClose={onClose}
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && <ErrorNote message={errors.submit} />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('nav.properties')} required error={errors.propertyId}>
            <Select
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              invalid={!!errors.propertyId}
              disabled={isLoading}
            >
              <option value="">{t('units.selectProperty')}</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name} — {property.address}
                </option>
              ))}
            </Select>
          </Field>

          <Field label={t('mt.unitOptional')}>
            <Select
              name="rentalUnitId"
              value={formData.rentalUnitId}
              onChange={handleChange}
              disabled={isLoading || !formData.propertyId}
            >
              <option value="">{t('mt.general')}</option>
              {filteredUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name} {unit.unitNumber && `(${unit.unitNumber})`}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('mt.priority')}>
            <Select name="priority" value={formData.priority} onChange={handleChange} disabled={isLoading}>
              <option value={Priority.Low}>{t('mt.low')}</option>
              <option value={Priority.Medium}>{t('mt.medium')}</option>
              <option value={Priority.High}>{t('mt.high')}</option>
            </Select>
          </Field>

          <Field label={t('contracts.status')}>
            <Select name="status" value={formData.status} onChange={handleChange} disabled={isLoading}>
              <option value={MaintenanceStatus.Open}>{t('mt.statusOpen')}</option>
              <option value={MaintenanceStatus.InProgress}>{t('mt.statusInProgress')}</option>
              <option value={MaintenanceStatus.Closed}>{t('mt.statusClosed')}</option>
            </Select>
          </Field>
        </div>

        <Field label={t('mt.title')} required error={errors.title}>
          <TextInput
            name="title"
            value={formData.title}
            onChange={handleChange}
            invalid={!!errors.title}
            disabled={isLoading}
            placeholder={t('mt.titlePlaceholder')}
          />
        </Field>

        <Field label={t('mt.description')} required error={errors.description}>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            invalid={!!errors.description}
            disabled={isLoading}
            placeholder={t('mt.descPlaceholder')}
          />
        </Field>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" className="flex-1" loading={isLoading}>
            {request ? t('mt.update') : t('mt.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
