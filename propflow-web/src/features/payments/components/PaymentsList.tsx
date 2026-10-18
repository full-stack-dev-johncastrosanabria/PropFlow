import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { Pencil, Trash2, Wallet } from 'lucide-react';
import { paymentsApi } from '../../../shared/api/payments';
import { i18n } from '@/i18n';
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

const statusBadge = (status: PaymentStatus, t: (k: string) => string) => {
  switch (status) {
    case PaymentStatus.Paid:
      return <Badge tone="green" stroke="solid">{t("pay.paid")}</Badge>;
    case PaymentStatus.Late:
      return <Badge tone="red" stroke="dashed">{t("pay.late")}</Badge>;
    default:
      return <Badge tone="amber" stroke="dashed">{t("pay.pending")}</Badge>;
  }
};

export default function PaymentsList({ payments, onEdit, onRefetch }: PaymentsListProps) {
  const { t } = useTranslation();
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
    if (window.confirm(t('pay.deleteConfirm'))) {
      deleteMutation.mutate(id);
    }
  };

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title={t('pay.emptyTitle')}
        copy={t('pay.emptyCopy')}
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
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">{t('contracts.contract')}</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">{t('pay.amount')}</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">{t('pay.dueCol')}</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">{t('pay.paidCol')}</th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">{t('contracts.status')}</th>
              <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">{t('pay.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {pagedPayments.map((payment) => (
              <tr key={payment.id} className="border-b border-rule/70 transition-colors last:border-b-0 hover:bg-paper-well/50">
                <td className="px-5 py-3">
                  <span className="text-figure font-medium text-carbon">#{payment.contractId.slice(0, 8)}</span>
                </td>
                <td className="text-figure px-4 py-3 text-right font-semibold text-carbon">
                  {new Intl.NumberFormat(i18n.language?.toLowerCase().startsWith('es') ? 'es' : 'en-US', { style: 'currency', currency: payment.currency || 'USD' }).format(payment.amount)}
                </td>
                <td className="text-figure px-4 py-3 text-right text-carbon-soft">
                  {new Date(payment.dueDate).toLocaleDateString(i18n.language?.toLowerCase().startsWith('es') ? 'es' : 'en-US')}
                </td>
                <td className="text-figure px-4 py-3 text-right text-carbon-soft">
                  {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString(i18n.language?.toLowerCase().startsWith('es') ? 'es' : 'en-US') : '—'}
                </td>
                <td className="px-4 py-3">{statusBadge(payment.status, t)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(payment)} aria-label={t('pay.editPayment')} title={t('common.edit')}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(payment.id)}
                      disabled={deleteMutation.isPending}
                      aria-label={t('pay.deletePayment')}
                      title={t('common.delete')}
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
          label={t('pay.paymentsCount')}
        />
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {pagedPayments.map((payment) => (
          <article key={payment.id} className="rounded-sheet border border-rule bg-paper-raised p-4 shadow-sheet">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-figure text-[17px] font-semibold text-carbon">
                  {new Intl.NumberFormat(i18n.language?.toLowerCase().startsWith('es') ? 'es' : 'en-US', { style: 'currency', currency: payment.currency || 'USD' }).format(payment.amount)}
                </div>
                <div className="text-figure mt-0.5 text-[12.5px] text-carbon-faint">
                  #{payment.contractId.slice(0, 8)}
                </div>
              </div>
              {statusBadge(payment.status, t)}
            </div>

            <div className="mt-3 space-y-0 border-t border-rule">
              <div className="flex justify-between border-b border-rule py-2 text-[13.5px]">
                <span className="text-carbon-soft">{t('pay.dueCol')}</span>
                <span className="text-figure text-carbon">{new Date(payment.dueDate).toLocaleDateString(i18n.language?.toLowerCase().startsWith('es') ? 'es' : 'en-US')}</span>
              </div>
              <div className="flex justify-between py-2 text-[13.5px]">
                <span className="text-carbon-soft">{t('pay.paidCol')}</span>
                <span className="text-figure text-carbon">
                  {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : t('pay.notPaid')}
                </span>
              </div>
            </div>

            {payment.notes && <p className="mt-2 text-[13.5px] italic text-carbon-faint">{payment.notes}</p>}

            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(payment)}>
                <Pencil className="size-3.5" aria-hidden /> {t('common.edit')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={() => handleDelete(payment.id)}
                disabled={deleteMutation.isPending}
                loading={deleteMutation.isPending}
              >
                <Trash2 className="size-3.5" aria-hidden /> {t('common.delete')}
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
          label={t('pay.paymentsCount')}
        />
      </div>
    </div>
  );
}
