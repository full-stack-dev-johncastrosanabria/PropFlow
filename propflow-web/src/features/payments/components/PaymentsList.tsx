import { useMutation } from '@tanstack/react-query';
import { paymentsApi } from '../../../shared/api/payments';
import { PaymentStatus, type PaymentDto } from '../../../shared/types';

interface PaymentsListProps {
  payments: PaymentDto[];
  onEdit: (payment: PaymentDto) => void;
  onRefetch: () => void;
}

export default function PaymentsList({ payments, onEdit, onRefetch }: PaymentsListProps) {
  const deleteMutation = useMutation({
    mutationFn: paymentsApi.delete,
    onSuccess: () => {
      onRefetch();
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Paid:
        return <span className="badge badge-success">Paid</span>;
      case PaymentStatus.Late:
        return <span className="badge badge-danger">Late</span>;
      case PaymentStatus.Pending:
      default:
        return <span className="badge badge-warning">Pending</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  if (payments.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first payment record</p>
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
              <th>Contract</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Paid Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>
                  <div className="font-medium text-gray-900">
                    Contract #{payment.contractId.slice(0, 8)}
                  </div>
                </td>
                <td>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(payment.amount, payment.currency)}
                  </div>
                </td>
                <td>
                  <div className="text-gray-900">
                    {formatDate(payment.dueDate)}
                  </div>
                </td>
                <td>
                  <div className="text-gray-900">
                    {payment.paidDate ? formatDate(payment.paidDate) : '-'}
                  </div>
                </td>
                <td>{getStatusBadge(payment.status)}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(payment)}
                      className="btn btn-sm btn-secondary"
                      title="Edit payment"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="btn btn-sm btn-danger"
                      title="Delete payment"
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
        {payments.map((payment) => (
          <div key={payment.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-gray-900 mb-1">
                  {formatCurrency(payment.amount, payment.currency)}
                </div>
                <div className="text-sm text-gray-600">
                  Contract #{payment.contractId.slice(0, 8)}
                </div>
              </div>
              {getStatusBadge(payment.status)}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Due Date:</span>
                <span className="text-gray-900">{formatDate(payment.dueDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Paid Date:</span>
                <span className="text-gray-900">
                  {payment.paidDate ? formatDate(payment.paidDate) : 'Not paid'}
                </span>
              </div>
              {payment.notes && (
                <div className="text-sm">
                  <span className="text-gray-600">Notes:</span>
                  <p className="text-gray-900 mt-1">{payment.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(payment)}
                className="btn btn-sm btn-secondary flex-1"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(payment.id)}
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