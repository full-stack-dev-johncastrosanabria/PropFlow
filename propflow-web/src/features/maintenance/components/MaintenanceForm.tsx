import { useState, useEffect } from 'react';
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
    onError: () => setErrors({ submit: 'Failed to create the request. Please try again.' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMaintenanceRequestDto }) =>
      maintenanceApi.update(id, data),
    onSuccess: onClose,
    onError: () => setErrors({ submit: 'Failed to update the request. Please try again.' }),
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.propertyId) newErrors.propertyId = 'Pick the property this belongs to.';
    if (!formData.title.trim()) newErrors.title = 'A short title is needed.';
    if (!formData.description.trim()) newErrors.description = 'Describe what needs fixing.';
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
      title={request ? 'Edit request' : 'Add request'}
      subtitle="What needs fixing, where, and how urgent."
      onClose={onClose}
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && <ErrorNote message={errors.submit} />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Property" required error={errors.propertyId}>
            <Select
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              invalid={!!errors.propertyId}
              disabled={isLoading}
            >
              <option value="">Select a property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name} — {property.address}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Unit (optional)">
            <Select
              name="rentalUnitId"
              value={formData.rentalUnitId}
              onChange={handleChange}
              disabled={isLoading || !formData.propertyId}
            >
              <option value="">General property issue</option>
              {filteredUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name} {unit.unitNumber && `(${unit.unitNumber})`}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Priority">
            <Select name="priority" value={formData.priority} onChange={handleChange} disabled={isLoading}>
              <option value={Priority.Low}>Low</option>
              <option value={Priority.Medium}>Medium</option>
              <option value={Priority.High}>High</option>
            </Select>
          </Field>

          <Field label="Status">
            <Select name="status" value={formData.status} onChange={handleChange} disabled={isLoading}>
              <option value={MaintenanceStatus.Open}>Open</option>
              <option value={MaintenanceStatus.InProgress}>In progress</option>
              <option value={MaintenanceStatus.Closed}>Closed</option>
            </Select>
          </Field>
        </div>

        <Field label="Title" required error={errors.title}>
          <TextInput
            name="title"
            value={formData.title}
            onChange={handleChange}
            invalid={!!errors.title}
            disabled={isLoading}
            placeholder="Brief description of the issue"
          />
        </Field>

        <Field label="Description" required error={errors.description}>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            invalid={!!errors.description}
            disabled={isLoading}
            placeholder="What's broken, since when, and anything the contractor should know…"
          />
        </Field>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={isLoading}>
            {request ? 'Update request' : 'Create request'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
