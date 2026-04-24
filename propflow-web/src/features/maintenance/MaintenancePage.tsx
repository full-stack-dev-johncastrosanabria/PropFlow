import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { maintenanceApi } from '../../shared/api/maintenance';
import { propertiesApi } from '../../shared/api/properties';
import { unitsApi } from '../../shared/api/units';
import MaintenanceList from './components/MaintenanceList';
import MaintenanceForm from './components/MaintenanceForm';
import type { MaintenanceRequestDto } from '../../shared/types';

export default function MaintenancePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequestDto | null>(null);

  const { data: requests = [], isLoading, error, refetch } = useQuery({
    queryKey: ['maintenance'],
    queryFn: maintenanceApi.getAll,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: propertiesApi.getAll,
  });

  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: unitsApi.getAll,
  });

  const handleCreate = () => {
    setEditingRequest(null);
    setIsFormOpen(true);
  };

  const handleEdit = (request: MaintenanceRequestDto) => {
    setEditingRequest(request);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingRequest(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Loading maintenance requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error instanceof Error ? error.message : 'Failed to load maintenance requests'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-600 mt-1">Track and manage property maintenance issues</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
        >
          <span className="text-lg">🔧</span>
          Add Request
        </button>
      </div>

      {/* Maintenance List */}
      <MaintenanceList 
        requests={requests} 
        onEdit={handleEdit}
        onRefetch={refetch}
      />

      {/* Maintenance Form Modal */}
      {isFormOpen && (
        <MaintenanceForm
          request={editingRequest}
          properties={properties}
          units={units}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}