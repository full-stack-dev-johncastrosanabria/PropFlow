import { useState, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { tenantsApi } from '../../../shared/api/tenants';
import type { TenantDto, UpdateTenantDto } from '../../../shared/types';

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
    onSuccess: () => {
      onClose();
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to create tenant');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantDto }) => 
      tenantsApi.update(id, data),
    onSuccess: () => {
      onClose();
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to update tenant');
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email) {
      setError('Please fill in all required fields');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {tenant ? 'Edit Tenant' : 'Add New Tenant'}
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
              <label htmlFor="fullName" className="form-label">
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                className="form-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter tenant's full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="identificationNumber" className="form-label">
                ID Number
              </label>
              <input
                id="identificationNumber"
                type="text"
                className="form-input"
                value={formData.identificationNumber}
                onChange={(e) => setFormData({ ...formData, identificationNumber: e.target.value })}
                placeholder="Enter ID or passport number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notes
              </label>
              <textarea
                id="notes"
                className="form-input min-h-[80px]"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about the tenant"
                rows={3}
              />
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
                    {tenant ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  tenant ? 'Update Tenant' : 'Create Tenant'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}