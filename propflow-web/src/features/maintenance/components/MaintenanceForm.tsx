import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { maintenanceApi } from '../../../shared/api/maintenance';
import { Priority, MaintenanceStatus, type MaintenanceRequestDto, type PropertyDto, type RentalUnitDto, type CreateMaintenanceRequestDto, type UpdateMaintenanceRequestDto } from '../../../shared/types';

interface MaintenanceFormProps {
  request?: MaintenanceRequestDto | null;
  properties: PropertyDto[];
  units: RentalUnitDto[];
  onClose: () => void;
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filteredUnits, setFilteredUnits] = useState<RentalUnitDto[]>([]);

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

  useEffect(() => {
    if (formData.propertyId) {
      const propertyUnits = units.filter(unit => unit.propertyId === formData.propertyId);
      setFilteredUnits(propertyUnits);
      
      // Reset unit selection if current unit doesn't belong to selected property
      if (formData.rentalUnitId && !propertyUnits.find(unit => unit.id === formData.rentalUnitId)) {
        setFormData(prev => ({ ...prev, rentalUnitId: '' }));
      }
    } else {
      setFilteredUnits([]);
    }
  }, [formData.propertyId, units]);

  const createMutation = useMutation({
    mutationFn: maintenanceApi.create,
    onSuccess: () => {
      onClose();
    },
    onError: (error: any) => {
      console.error('Create maintenance request error:', error);
      setErrors({ submit: 'Failed to create maintenance request. Please try again.' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMaintenanceRequestDto }) =>
      maintenanceApi.update(id, data),
    onSuccess: () => {
      onClose();
    },
    onError: (error: any) => {
      console.error('Update maintenance request error:', error);
      setErrors({ submit: 'Failed to update maintenance request. Please try again.' });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.propertyId) {
      newErrors.propertyId = 'Property is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-semibold text-gray-900">
            {request ? 'Edit Maintenance Request' : 'Add New Maintenance Request'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {errors.submit && (
            <div className="alert alert-danger mb-4">
              {errors.submit}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="propertyId" className="form-label">
                Property *
              </label>
              <select
                id="propertyId"
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                className={`form-input ${errors.propertyId ? 'error' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select a property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name} - {property.address}
                  </option>
                ))}
              </select>
              {errors.propertyId && (
                <span className="form-error">{errors.propertyId}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="rentalUnitId" className="form-label">
                Unit (Optional)
              </label>
              <select
                id="rentalUnitId"
                name="rentalUnitId"
                value={formData.rentalUnitId}
                onChange={handleChange}
                className="form-input"
                disabled={isLoading || !formData.propertyId}
              >
                <option value="">General property issue</option>
                {filteredUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} {unit.unitNumber && `(${unit.unitNumber})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority" className="form-label">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-input"
                disabled={isLoading}
              >
                <option value={Priority.Low}>Low</option>
                <option value={Priority.Medium}>Medium</option>
                <option value={Priority.High}>High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
                disabled={isLoading}
              >
                <option value={MaintenanceStatus.Open}>Open</option>
                <option value={MaintenanceStatus.InProgress}>In Progress</option>
                <option value={MaintenanceStatus.Closed}>Closed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              disabled={isLoading}
              placeholder="Brief description of the issue"
            />
            {errors.title && (
              <span className="form-error">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`form-input ${errors.description ? 'error' : ''}`}
              disabled={isLoading}
              placeholder="Detailed description of the maintenance issue..."
            />
            {errors.description && (
              <span className="form-error">{errors.description}</span>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-sm"></span>
                  {request ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                request ? 'Update Request' : 'Create Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}