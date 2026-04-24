import { useMutation } from '@tanstack/react-query';
import { contractsApi } from '../../../shared/api/contracts';
import { ContractStatus, type ContractDto } from '../../../shared/types';

interface ContractsListProps {
  contracts: ContractDto[];
  onEdit: (contract: ContractDto) => void;
  onRefetch: () => void;
}

const statusConfig = {
  [ContractStatus.Active]: { label: 'Active', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  [ContractStatus.Finished]: { label: 'Finished', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  [ContractStatus.Cancelled]: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

export default function ContractsList({ contracts, onEdit, onRefetch }: ContractsListProps) {
  const deleteMutation = useMutation({
    mutationFn: contractsApi.delete,
    onSuccess: () => {
      onRefetch();
    },
  });

  const handleDelete = async (contract: ContractDto) => {
    const contractName = `${contract.tenantName} - ${contract.unitName}`;
    if (window.confirm(`Are you sure you want to delete the contract for "${contractName}"?`)) {
      deleteMutation.mutate(contract.id);
    }
  };

  if (contracts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No contracts yet</h3>
        <p className="text-gray-600 mb-6">Create your first rental contract to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {contracts.map((contract) => {
        const status = statusConfig[contract.status];
        const isActive = contract.status === ContractStatus.Active;
        
        return (
          <div key={contract.id} className="card hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {contract.tenantName || 'Unknown Tenant'}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {contract.unitName || 'Unknown Unit'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} ${status.border} border`}>
                {status.label}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Rent:</span>
                <span className="font-semibold text-gray-900">
                  {contract.currency} {contract.monthlyRent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Deposit:</span>
                <span className="font-semibold text-gray-900">
                  {contract.currency} {contract.depositAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Start Date:</span>
                <span className="text-sm text-gray-700">
                  {new Date(contract.startDate).toLocaleDateString()}
                </span>
              </div>
              {contract.endDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">End Date:</span>
                  <span className="text-sm text-gray-700">
                    {new Date(contract.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm text-gray-500">
                  {new Date(contract.createdAtUtc).toLocaleDateString()}
                </span>
              </div>
            </div>

            {isActive && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  <span className="text-sm font-medium text-green-800">Active Contract</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(contract)}
                className="btn btn-secondary flex-1"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(contract)}
                disabled={deleteMutation.isPending}
                className="btn btn-secondary text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                {deleteMutation.isPending ? (
                  <div className="spinner w-4 h-4"></div>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}