import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { paymentsApi } from '../../shared/api/payments';
import { contractsApi } from '../../shared/api/contracts';
import PaymentsList from './components/PaymentsList';
import PaymentForm from './components/PaymentForm';
import type { PaymentDto } from '../../shared/types';
import { PageHeader } from '@/components/world/PageHeader';
import { Button } from '@/components/world/Button';
import { PageLoading, ErrorNote } from '@/components/world/EmptyState';
import { BlurFade } from '@/components/magicui/blur-fade';

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

  if (isLoading) return <PageLoading label="Balancing the rent roll…" />;

  if (error) {
    return <ErrorNote message={error instanceof Error ? error.message : 'Failed to load payments'} />;
  }

  return (
    <div className="space-y-5">
      <BlurFade>
        <PageHeader
          title="Payments"
          copy="The rent roll — what's due, what's paid, and what's gone late."
          action={
            <Button onClick={handleCreate}>
              <Plus className="size-4" aria-hidden />
              Add payment
            </Button>
          }
        />
      </BlurFade>

      <BlurFade delay={0.05}>
        <PaymentsList payments={payments} onEdit={handleEdit} onRefetch={refetch} />
      </BlurFade>

      {isFormOpen && (
        <PaymentForm payment={editingPayment} contracts={contracts} onClose={handleFormClose} />
      )}
    </div>
  );
}
