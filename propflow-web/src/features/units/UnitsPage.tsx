import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { unitsApi } from '../../shared/api/units';
import { propertiesApi } from '../../shared/api/properties';
import UnitsList from './components/UnitsList';
import UnitForm from './components/UnitForm';
import type { RentalUnitDto } from '../../shared/types';

export default function UnitsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<RentalUnitDto | null>(null);

  const { data: units = [], isLoading, error, refetch } = useQuery({
    queryKey: ['units'],
    queryFn: unitsApi.getAll,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: propertiesApi.getAll,
  });

  const handleCreate = () => {
    setEditingUnit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (unit: RentalUnitDto) => {
    setEditingUnit(unit);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingUnit(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Loading units...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error instanceof Error ? error.message : 'Failed to load units'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Rental Units</h1>
          <p className="text-gray-600 mt-1">Manage your rental units and their availability</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
        >
          <span className="text-lg">🏢</span>
          Add Unit
        </button>
      </div>

      {/* Units List */}
      <UnitsList 
        units={units} 
        properties={properties}
        onEdit={handleEdit}
        onRefetch={refetch}
      />

      {/* Unit Form Modal */}
      {isFormOpen && (
        <UnitForm
          unit={editingUnit}
          properties={properties}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}