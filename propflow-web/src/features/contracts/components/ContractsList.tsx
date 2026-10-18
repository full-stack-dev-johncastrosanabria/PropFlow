import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { FileText } from 'lucide-react';
import { contractsApi } from '../../../shared/api/contracts';
import { i18n } from '@/i18n';
import { ContractStatus, type ContractDto } from '../../../shared/types';
import { Badge, type BadgeTone } from '@/components/world/Stamp';
import { Button } from '@/components/world/Button';
import { EmptyState } from '@/components/world/EmptyState';

interface ContractsListProps {
  contracts: ContractDto[];
  onEdit: (contract: ContractDto) => void;
  onRefetch: () => void;
}

const statusMeta: Record<ContractStatus, { labelKey: string; tone: BadgeTone; stroke: 'solid' | 'dashed' }> = {
  [ContractStatus.Active]: { labelKey: 'contracts.statusActive', tone: 'green', stroke: 'solid' },
  [ContractStatus.Finished]: { labelKey: 'contracts.statusFinished', tone: 'carbon', stroke: 'solid' },
  [ContractStatus.Cancelled]: { labelKey: 'contracts.statusCancelled', tone: 'red', stroke: 'dashed' },
};

export default function ContractsList({ contracts, onEdit, onRefetch }: ContractsListProps) {
  const { t } = useTranslation();
  const deleteMutation = useMutation({
    mutationFn: contractsApi.delete,
    onSuccess: () => {
      onRefetch();
    },
  });

  const handleDelete = async (contract: ContractDto) => {
    const contractName = `${contract.tenantName} — ${contract.unitName}`;
    if (window.confirm(t('contracts.deleteConfirm', { name: contractName }))) {
      deleteMutation.mutate(contract.id);
    }
  };

  if (contracts.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title={t('contracts.emptyTitle')}
        copy={t('contracts.emptyCopy')}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
      {contracts.map((contract) => {
        const status = statusMeta[contract.status];
        return (
          <article
            key={contract.id}
            className="flex h-full flex-col rounded-sheet border border-rule bg-paper-raised p-5 shadow-sheet transition-colors hover:border-rule-strong"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-display text-[16.5px] font-semibold text-carbon">
                  {contract.tenantName || t('contracts.unknownTenant')}
                </h3>
                <p className="mt-0.5 truncate text-[13.5px] text-carbon-soft">{contract.unitName || t('contracts.unknownUnit')}</p>
              </div>
              <Badge tone={status.tone} stroke={status.stroke}>{t(status.labelKey)}</Badge>
            </div>

            <div className="mt-4 border-t border-rule">
              <div className="grid grid-cols-2 gap-x-6">
                <div className="flex items-baseline justify-between border-b border-rule py-2.5">
                  <span className="text-[13px] font-medium text-carbon-soft">{t('contracts.rent')}</span>
                  <span className="text-figure text-[14.5px] font-semibold text-carbon">
                    {contract.currency} {contract.monthlyRent.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-b border-rule py-2.5">
                  <span className="text-[13px] font-medium text-carbon-soft">{t('contracts.deposit')}</span>
                  <span className="text-figure text-[14.5px] font-semibold text-carbon">
                    {contract.currency} {contract.depositAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-baseline justify-between py-2.5">
                  <span className="text-[13px] font-medium text-carbon-soft">{t('contracts.starts')}</span>
                  <span className="text-figure text-[13.5px] text-carbon-soft">
                    {new Date(contract.startDate).toLocaleDateString(i18n.language?.toLowerCase().startsWith('es') ? 'es' : 'en-US')}
                  </span>
                </div>
                <div className="flex items-baseline justify-between py-2.5">
                  <span className="text-[13px] font-medium text-carbon-soft">{t('contracts.ends')}</span>
                  <span className="text-figure text-[13.5px] text-carbon-soft">
                    {contract.endDate ? new Date(contract.endDate).toLocaleDateString(i18n.language?.toLowerCase().startsWith('es') ? 'es' : 'en-US') : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto flex gap-2 pt-4">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(contract)}>
                {t('common.edit')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={() => handleDelete(contract)}
                disabled={deleteMutation.isPending}
                loading={deleteMutation.isPending}
              >
                {t('common.delete')}
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
