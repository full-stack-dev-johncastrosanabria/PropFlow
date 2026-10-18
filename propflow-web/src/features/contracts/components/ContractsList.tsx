import { useMutation } from '@tanstack/react-query';
import { FileText } from 'lucide-react';
import { contractsApi } from '../../../shared/api/contracts';
import { ContractStatus, type ContractDto } from '../../../shared/types';
import { Badge, type BadgeTone } from '@/components/world/Stamp';
import { Button } from '@/components/world/Button';
import { EmptyState } from '@/components/world/EmptyState';

interface ContractsListProps {
  contracts: ContractDto[];
  onEdit: (contract: ContractDto) => void;
  onRefetch: () => void;
}

const statusMeta: Record<ContractStatus, { label: string; tone: BadgeTone; stroke: 'solid' | 'dashed' }> = {
  [ContractStatus.Active]: { label: 'Active', tone: 'green', stroke: 'solid' },
  [ContractStatus.Finished]: { label: 'Finished', tone: 'carbon', stroke: 'solid' },
  [ContractStatus.Cancelled]: { label: 'Cancelled', tone: 'red', stroke: 'dashed' },
};

export default function ContractsList({ contracts, onEdit, onRefetch }: ContractsListProps) {
  const deleteMutation = useMutation({
    mutationFn: contractsApi.delete,
    onSuccess: () => {
      onRefetch();
    },
  });

  const handleDelete = async (contract: ContractDto) => {
    const contractName = `${contract.tenantName} — ${contract.unitName}`;
    if (window.confirm(`Delete the contract for "${contractName}"?`)) {
      deleteMutation.mutate(contract.id);
    }
  };

  if (contracts.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No contracts yet"
        copy="Create the first lease — tenant, unit, term, and deposit in one sheet."
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
                  {contract.tenantName || 'Unknown tenant'}
                </h3>
                <p className="mt-0.5 truncate text-[13.5px] text-carbon-soft">{contract.unitName || 'Unknown unit'}</p>
              </div>
              <Badge tone={status.tone} stroke={status.stroke}>{status.label}</Badge>
            </div>

            <div className="mt-4 border-t border-rule">
              <div className="grid grid-cols-2 gap-x-6">
                <div className="flex items-baseline justify-between border-b border-rule py-2.5">
                  <span className="text-[13px] font-medium text-carbon-soft">Rent</span>
                  <span className="text-figure text-[14.5px] font-semibold text-carbon">
                    {contract.currency} {contract.monthlyRent.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-b border-rule py-2.5">
                  <span className="text-[13px] font-medium text-carbon-soft">Deposit</span>
                  <span className="text-figure text-[14.5px] font-semibold text-carbon">
                    {contract.currency} {contract.depositAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-baseline justify-between py-2.5">
                  <span className="text-[13px] font-medium text-carbon-soft">Starts</span>
                  <span className="text-figure text-[13.5px] text-carbon-soft">
                    {new Date(contract.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-baseline justify-between py-2.5">
                  <span className="text-[13px] font-medium text-carbon-soft">Ends</span>
                  <span className="text-figure text-[13.5px] text-carbon-soft">
                    {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto flex gap-2 pt-4">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(contract)}>
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={() => handleDelete(contract)}
                disabled={deleteMutation.isPending}
                loading={deleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
