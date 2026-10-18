import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { contractsApi } from '../../shared/api/contracts';
import { tenantsApi } from '../../shared/api/tenants';
import { unitsApi } from '../../shared/api/units';
import ContractsList from './components/ContractsList';
import ContractForm from './components/ContractForm';
import type { ContractDto } from '../../shared/types';
import { PageHeader } from '@/components/world/PageHeader';
import { Button } from '@/components/world/Button';
import { PageLoading, ErrorNote } from '@/components/world/EmptyState';
import { BlurFade } from '@/components/magicui/blur-fade';

export default function ContractsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractDto | null>(null);

  const { data: contracts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractsApi.getAll,
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenantsApi.getAll,
  });

  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: unitsApi.getAll,
  });

  const handleCreate = () => {
    setEditingContract(null);
    setIsFormOpen(true);
  };

  const handleEdit = (contract: ContractDto) => {
    setEditingContract(contract);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingContract(null);
    refetch();
  };

  if (isLoading) return <PageLoading label="Pulling the lease file…" />;

  if (error) {
    return <ErrorNote message={error instanceof Error ? error.message : 'Failed to load contracts'} />;
  }

  return (
    <div className="space-y-5">
      <BlurFade>
        <PageHeader
          title="Contracts"
          copy="The signed agreements — terms, deposits, and what renews when."
          action={
            <Button onClick={handleCreate}>
              <Plus className="size-4" aria-hidden />
              Add contract
            </Button>
          }
        />
      </BlurFade>

      <BlurFade delay={0.05}>
        <ContractsList contracts={contracts} onEdit={handleEdit} onRefetch={refetch} />
      </BlurFade>

      {isFormOpen && (
        <ContractForm
          contract={editingContract}
          tenants={tenants}
          units={units}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
