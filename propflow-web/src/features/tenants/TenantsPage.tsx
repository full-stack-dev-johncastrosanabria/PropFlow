import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tenantsApi } from '../../shared/api/tenants';
import TenantsList from './components/TenantsList';
import TenantForm from './components/TenantForm';
import type { TenantDto } from '../../shared/types';

export default function TenantsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantDto | null>(null);

  const { data: tenants = [], isLoading, error, refetch } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenantsApi.getAll,
  });

  const handleCreate = () => {
    setEditingTenant(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tenant: TenantDto) => {
    setEditingTenant(tenant);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTenant(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Loading tenants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error instanceof Error ? error.message : 'Failed to load tenants'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-600 mt-1">Manage your tenant information and contacts</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
        >
          <span className="text-lg">👥</span>
          Add Tenant
        </button>
      </div>

      {/* Tenants List */}
      <TenantsList 
        tenants={tenants} 
        onEdit={handleEdit}
        onRefetch={refetch}
      />

      {/* Tenant Form Modal */}
      {isFormOpen && (
        <TenantForm
          tenant={editingTenant}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}