import { useMutation } from '@tanstack/react-query';
import { tenantsApi } from '../../../shared/api/tenants';
import type { TenantDto } from '../../../shared/types';

interface TenantsListProps {
  tenants: TenantDto[];
  onEdit: (tenant: TenantDto) => void;
  onRefetch: () => void;
}

export default function TenantsList({ tenants, onEdit, onRefetch }: TenantsListProps) {
  const deleteMutation = useMutation({
    mutationFn: tenantsApi.delete,
    onSuccess: () => {
      onRefetch();
    },
  });

  const handleDelete = async (tenant: TenantDto) => {
    if (window.confirm(`Are you sure you want to delete "${tenant.fullName}"?`)) {
      deleteMutation.mutate(tenant.id);
    }
  };

  if (tenants.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tenants yet</h3>
        <p className="text-gray-600 mb-6">Add your first tenant to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {tenants.map((tenant) => (
        <div key={tenant.id} className="card hover:shadow-lg transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{tenant.fullName}</h3>
                <p className="text-sm text-gray-600">{tenant.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {tenant.phone && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">📞</span>
                <span className="text-sm text-gray-700">{tenant.phone}</span>
              </div>
            )}
            {tenant.identificationNumber && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">🆔</span>
                <span className="text-sm text-gray-700">{tenant.identificationNumber}</span>
              </div>
            )}
            {tenant.notes && (
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-500 mt-0.5">📝</span>
                <span className="text-sm text-gray-700 line-clamp-2">{tenant.notes}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">📅</span>
              <span className="text-sm text-gray-500">
                Added {new Date(tenant.createdAtUtc).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(tenant)}
              className="btn btn-secondary flex-1"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(tenant)}
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
      ))}
    </div>
  );
}