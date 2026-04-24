import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contractsApi } from '../../shared/api/contracts';
import { tenantsApi } from '../../shared/api/tenants';
import { unitsApi } from '../../shared/api/units';
import ContractsList from './components/ContractsList';
import ContractForm from './components/ContractForm';
import type { ContractDto } from '../../shared/types';

export default function ContractsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractDto | null>(null);

  const { data: contracts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractsApi.getAll,
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenantsApi.getAll,
  });

  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: unitsApi.getAll,
  });

  const handleCreate = () => {
    setEditingContract(null);
    setIsFormOpen(true);
  };

  const handleEdit = (contract: ContractDto) => {
    setEditingContract(contract);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingContract(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Loading contracts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error instanceof Error ? error.message : 'Failed to load contracts'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Contracts</h1>
          <p className="text-gray-600 mt-1">Manage rental contracts and agreements</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
        >
          <span className="text-lg">📄</span>
          Add Contract
        </button>
      </div>

      {/* Contracts List */}
      <ContractsList 
        contracts={contracts} 
        onEdit={handleEdit}
        onRefetch={refetch}
      />

      {/* Contract Form Modal */}
      {isFormOpen && (
        <ContractForm
          contract={editingContract}
          tenants={tenants}
          units={units}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}