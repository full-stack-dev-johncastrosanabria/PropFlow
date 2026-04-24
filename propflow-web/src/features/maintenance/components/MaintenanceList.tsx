import { useMutation } from '@tanstack/react-query';
import { maintenanceApi } from '../../../shared/api/maintenance';
import { Priority, MaintenanceStatus, type MaintenanceRequestDto } from '../../../shared/types';

interface MaintenanceListProps {
  requests: MaintenanceRequestDto[];
  onEdit: (request: MaintenanceRequestDto) => void;
  onRefetch: () => void;
}

export default function MaintenanceList({ requests, onEdit, onRefetch }: MaintenanceListProps) {
  const deleteMutation = useMutation({
    mutationFn: maintenanceApi.delete,
    onSuccess: () => {
      onRefetch();
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this maintenance request?')) {
      deleteMutation.mutate(id);
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case Priority.High:
        return <span className="badge badge-danger">High</span>;
      case Priority.Medium:
        return <span className="badge badge-warning">Medium</span>;
      case Priority.Low:
      default:
        return <span className="badge badge-secondary">Low</span>;
    }
  };

  const getStatusBadge = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.Closed:
        return <span className="badge badge-success">Closed</span>;
      case MaintenanceStatus.InProgress:
        return <span className="badge badge-info">In Progress</span>;
      case MaintenanceStatus.Open:
      default:
        return <span className="badge badge-warning">Open</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (requests.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No maintenance requests</h3>
          <p className="text-gray-600 mb-6">Start by adding your first maintenance request</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="card table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Property</th>
              <th>Unit</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className="font-medium text-gray-900">
                    {request.title}
                  </div>
                  <div className="text-sm text-gray-600 truncate max-w-xs">
                    {request.description}
                  </div>
                </td>
                <td>
                  <div className="text-gray-900">
                    {request.propertyName || 'Unknown Property'}
                  </div>
                </td>
                <td>
                  <div className="text-gray-900">
                    {request.unitName || 'General'}
                  </div>
                </td>
                <td>{getPriorityBadge(request.priority)}</td>
                <td>{getStatusBadge(request.status)}</td>
                <td>
                  <div className="text-gray-900">
                    {formatDate(request.createdAtUtc)}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(request)}
                      className="btn btn-sm btn-secondary"
                      title="Edit request"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="btn btn-sm btn-danger"
                      title="Delete request"
                      disabled={deleteMutation.isPending}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards">
        {requests.map((request) => (
          <div key={request.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">
                  {request.title}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {request.propertyName} {request.unitName && `- ${request.unitName}`}
                </div>
              </div>
              <div className="flex gap-2">
                {getPriorityBadge(request.priority)}
                {getStatusBadge(request.status)}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 line-clamp-3">
                {request.description}
              </p>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <span>Created: {formatDate(request.createdAtUtc)}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(request)}
                className="btn btn-sm btn-secondary flex-1"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(request.id)}
                className="btn btn-sm btn-danger flex-1"
                disabled={deleteMutation.isPending}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}