import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '../../shared/api/payments';
import { contractsApi } from '../../shared/api/contracts';
import PaymentsList from './components/PaymentsList';
import PaymentForm from './components/PaymentForm';
import type { PaymentDto } from '../../shared/types';

export default function PaymentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentDto | null>(null);

  const { data: payments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentsApi.getAll,
  });

  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractsApi.getAll,
  });

  const handleCreate = () => {
    setEditingPayment(null);
    setIsFormOpen(true);
  };

  const handleEdit = (payment: PaymentDto) => {
    setEditingPayment(payment);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPayment(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error instanceof Error ? error.message : 'Failed to load payments'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Track rent payments and payment history</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
        >
          <span className="text-lg">💰</span>
          Add Payment
        </button>
      </div>

      {/* Payments List */}
      <PaymentsList 
        payments={payments} 
        onEdit={handleEdit}
        onRefetch={refetch}
      />

      {/* Payment Form Modal */}
      {isFormOpen && (
        <PaymentForm
          payment={editingPayment}
          contracts={contracts}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}