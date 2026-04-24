import { useState, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { unitsApi } from '../../../shared/api/units';
import { UnitStatus, type RentalUnitDto, type PropertyDto, type CreateRentalUnitDto, type UpdateRentalUnitDto } from '../../../shared/types';

interface UnitFormProps {
  unit?: RentalUnitDto | null;
  properties: PropertyDto[];
  onClose: () => void;
}

export default function UnitForm({ unit, properties, onClose }: UnitFormProps) {
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
    onSuccess: () => {
      onClose();
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to create unit');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRentalUnitDto }) => 
      unitsApi.update(id, data),
    onSuccess: () => {
      onClose();
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to update unit');
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.propertyId || !formData.name || formData.monthlyRent <= 0) {
      setError('Please fill in all required fields');
      return;
    }

    if (unit) {
      // Update existing unit
      const updateData: UpdateRentalUnitDto = {
        name: formData.name,
        unitNumber: formData.unitNumber || undefined,
        monthlyRent: formData.monthlyRent,
        currency: formData.currency,
        status: formData.status,
      };
      updateMutation.mutate({ id: unit.id, data: updateData });
    } else {
      // Create new unit
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {unit ? 'Edit Unit' : 'Add New Unit'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="propertyId" className="form-label">
                Property *
              </label>
              <select
                id="propertyId"
                className="form-input"
                value={formData.propertyId}
                onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                required
                disabled={!!unit} // Can't change property for existing unit
              >
                <option value="">Select a property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Unit Name *
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Apartment 1A, Studio Unit"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="unitNumber" className="form-label">
                Unit Number
              </label>
              <input
                id="unitNumber"
                type="text"
                className="form-input"
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                placeholder="e.g., 1A, 101"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="monthlyRent" className="form-label">
                  Monthly Rent *
                </label>
                <input
                  id="monthlyRent"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="currency" className="form-label">
                  Currency
                </label>
                <select
                  id="currency"
                  className="form-input"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="CRC">CRC</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                className="form-input"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) as UnitStatus })}
              >
                <option value={UnitStatus.Available}>Available</option>
                <option value={UnitStatus.Occupied}>Occupied</option>
                <option value={UnitStatus.Maintenance}>Maintenance</option>
              </select>
            </div>

            {error && (
              <div className="alert alert-danger">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="spinner w-4 h-4"></div>
                    {unit ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  unit ? 'Update Unit' : 'Create Unit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}