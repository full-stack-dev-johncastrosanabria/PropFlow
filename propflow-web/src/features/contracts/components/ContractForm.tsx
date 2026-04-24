import { useState, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { contractsApi } from '../../../shared/api/contracts';
import { ContractStatus, UnitStatus, type ContractDto, type TenantDto, type RentalUnitDto, type CreateContractDto, type UpdateContractDto } from '../../../shared/types';

interface ContractFormProps {
  contract?: ContractDto | null;
  tenants: TenantDto[];
  units: RentalUnitDto[];
  onClose: () => void;
}

export default function ContractForm({ contract, tenants, units, onClose }: ContractFormProps) {
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
    onSuccess: () => {
      onClose();
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to create contract');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContractDto }) => 
      contractsApi.update(id, data),
    onSuccess: () => {
      onClose();
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to update contract');
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.tenantId || !formData.rentalUnitId || !formData.startDate || formData.monthlyRent <= 0) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date');
      return;
    }

    if (contract) {
      // Update existing contract
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
      // Create new contract
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

  // Filter available units (not occupied, unless it's the current contract's unit)
  const availableUnits = units.filter(unit => 
    unit.status !== UnitStatus.Occupied || unit.id === contract?.rentalUnitId
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {contract ? 'Edit Contract' : 'Add New Contract'}
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
              <label htmlFor="tenantId" className="form-label">
                Tenant *
              </label>
              <select
                id="tenantId"
                className="form-input"
                value={formData.tenantId}
                onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                required
                disabled={!!contract} // Can't change tenant for existing contract
              >
                <option value="">Select a tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.fullName} ({tenant.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rentalUnitId" className="form-label">
                Rental Unit *
              </label>
              <select
                id="rentalUnitId"
                className="form-input"
                value={formData.rentalUnitId}
                onChange={(e) => setFormData({ ...formData, rentalUnitId: e.target.value })}
                required
                disabled={!!contract} // Can't change unit for existing contract
              >
                <option value="">Select a unit</option>
                {availableUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} - {unit.currency} {unit.monthlyRent.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  Start Date *
                </label>
                <input
                  id="startDate"
                  type="date"
                  className="form-input"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  className="form-input"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
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
                <label htmlFor="depositAmount" className="form-label">
                  Deposit Amount
                </label>
                <input
                  id="depositAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  value={formData.depositAmount}
                  onChange={(e) => setFormData({ ...formData, depositAmount: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) as ContractStatus })}
                >
                  <option value={ContractStatus.Active}>Active</option>
                  <option value={ContractStatus.Finished}>Finished</option>
                  <option value={ContractStatus.Cancelled}>Cancelled</option>
                </select>
              </div>
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
                    {contract ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  contract ? 'Update Contract' : 'Create Contract'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}