import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Pencil, Trash2, Wallet } from 'lucide-react';
import { paymentsApi } from '../../../shared/api/payments';
import { PaymentStatus, type PaymentDto } from '../../../shared/types';
import { Badge } from '@/components/world/Stamp';
import { Button } from '@/components/world/Button';
import { Pagination } from '@/components/world/Pagination';
import { EmptyState } from '@/components/world/EmptyState';

interface PaymentsListProps {
  payments: PaymentDto[];
  onEdit: (payment: PaymentDto) => void;
  onRefetch: () => void;
}

const PAGE_SIZE = 12;

const statusBadge = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.Paid:
      return <Badge tone="green" stroke="solid">Paid</Badge>;
    case PaymentStatus.Late:
      return <Badge tone="red" stroke="dashed">Late</Badge>;
    default:
      return <Badge tone="amber" stroke="dashed">Pending</Badge>;
  }
};

export default function PaymentsList({ payments, onEdit, onRefetch }: PaymentsListProps) {
  const [page, setPage] = useState(1);

  const deleteMutation = useMutation({
    mutationFn: paymentsApi.delete,
    onSuccess: () => {
      onRefetch();
    },
  });

  const totalPages = Math.max(1, Math.ceil(payments.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedPayments = payments.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this payment record?')) {
      deleteMutation.mutate(id);
    }
  };

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="No payments yet"
        copy="Record the first rent payment — due date, amount, and status."
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Desktop ledger table */}
      <div className="hidden overflow-hidden rounded-sheet border border-rule bg-paper-raised shadow-sheet md:block">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-rule-strong bg-paper-well/60 text-left">
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">Contract</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">Amount</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">Due</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">Paid</th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">Status</th>
              <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedPayments.map((payment) => (
              <tr key={payment.id} className="border-b border-rule/70 transition-colors last:border-b-0 hover:bg-paper-well/50">
                <td className="px-5 py-3">
                  <span className="text-figure font-medium text-carbon">#{payment.contractId.slice(0, 8)}</span>
                </td>
                <td className="text-figure px-4 py-3 text-right font-semibold text-carbon">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: payment.currency || 'USD' }).format(payment.amount)}
                </td>
                <td className="text-figure px-4 py-3 text-right text-carbon-soft">
                  {new Date(payment.dueDate).toLocaleDateString()}
                </td>
                <td className="text-figure px-4 py-3 text-right text-carbon-soft">
                  {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3">{statusBadge(payment.status)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(payment)} aria-label="Edit payment" title="Edit">
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(payment.id)}
                      disabled={deleteMutation.isPending}
                      aria-label="Delete payment"
                      title="Delete"
                      className="hover:bg-ink-red/10 hover:text-ink-red"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          page={safePage}
          pageSize={PAGE_SIZE}
          total={payments.length}
          onPageChange={setPage}
          label="payments"
        />
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {pagedPayments.map((payment) => (
          <article key={payment.id} className="rounded-sheet border border-rule bg-paper-raised p-4 shadow-sheet">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-figure text-[17px] font-semibold text-carbon">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: payment.currency || 'USD' }).format(payment.amount)}
                </div>
                <div className="text-figure mt-0.5 text-[12.5px] text-carbon-faint">
                  #{payment.contractId.slice(0, 8)}
                </div>
              </div>
              {statusBadge(payment.status)}
            </div>

            <div className="mt-3 space-y-0 border-t border-rule">
              <div className="flex justify-between border-b border-rule py-2 text-[13.5px]">
                <span className="text-carbon-soft">Due date</span>
                <span className="text-figure text-carbon">{new Date(payment.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2 text-[13.5px]">
                <span className="text-carbon-soft">Paid date</span>
                <span className="text-figure text-carbon">
                  {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : 'Not paid'}
                </span>
              </div>
            </div>

            {payment.notes && <p className="mt-2 text-[13.5px] italic text-carbon-faint">{payment.notes}</p>}

            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(payment)}>
                <Pencil className="size-3.5" aria-hidden /> Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={() => handleDelete(payment.id)}
                disabled={deleteMutation.isPending}
                loading={deleteMutation.isPending}
              >
                <Trash2 className="size-3.5" aria-hidden /> Delete
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-sheet border border-rule bg-paper-raised shadow-sheet md:hidden">
        <Pagination
          page={safePage}
          pageSize={PAGE_SIZE}
          total={payments.length}
          onPageChange={setPage}
          label="payments"
        />
      </div>
    </div>
  );
}
