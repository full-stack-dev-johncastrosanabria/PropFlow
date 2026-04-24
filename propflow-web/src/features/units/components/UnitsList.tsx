import { useMutation } from '@tanstack/react-query';
import { unitsApi } from '../../../shared/api/units';
import { UnitStatus, type RentalUnitDto, type PropertyDto } from '../../../shared/types';

interface UnitsListProps {
  units: RentalUnitDto[];
  properties: PropertyDto[];
  onEdit: (unit: RentalUnitDto) => void;
  onRefetch: () => void;
}

const statusConfig = {
  [UnitStatus.Available]: { label: 'Available', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  [UnitStatus.Occupied]: { label: 'Occupied', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  [UnitStatus.Maintenance]: { label: 'Maintenance', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
};

export default function UnitsList({ units, properties, onEdit, onRefetch }: UnitsListProps) {
  const deleteMutation = useMutation({
    mutationFn: unitsApi.delete,
    onSuccess: () => {
      onRefetch();
    },
  });

  const handleDelete = async (unit: RentalUnitDto) => {
    if (window.confirm(`Are you sure you want to delete "${unit.name}"?`)) {
      deleteMutation.mutate(unit.id);
    }
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property?.name || 'Unknown Property';
  };

  if (units.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏢</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No units yet</h3>
        <p className="text-gray-600 mb-6">Create your first rental unit to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {units.map((unit) => {
        const status = statusConfig[unit.status];
        return (
          <div key={unit.id} className="card hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{unit.name}</h3>
                <p className="text-sm text-gray-600">{getPropertyName(unit.propertyId)}</p>
                {unit.unitNumber && (
                  <p className="text-sm text-gray-500">Unit #{unit.unitNumber}</p>
                )}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} ${status.border} border`}>
                {status.label}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Rent:</span>
                <span className="font-semibold text-gray-900">
                  {unit.currency} {unit.monthlyRent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm text-gray-500">
                  {new Date(unit.createdAtUtc).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(unit)}
                className="btn btn-secondary flex-1"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(unit)}
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