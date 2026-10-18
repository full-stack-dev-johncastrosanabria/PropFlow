import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { tenantsApi } from '../../shared/api/tenants';
import TenantsList from './components/TenantsList';
import TenantForm from './components/TenantForm';
import type { TenantDto } from '../../shared/types';
import { PageHeader } from '@/components/world/PageHeader';
import { Button } from '@/components/world/Button';
import { PageLoading, ErrorNote } from '@/components/world/EmptyState';
import { BlurFade } from '@/components/magicui/blur-fade';

export default function TenantsPage() {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantDto | null>(null);

  const { data: tenants = [], isLoading, error, refetch } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenantsApi.getAll,
  });

  const handleCreate = () => {
    setEditingTenant(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tenant: TenantDto) => {
    setEditingTenant(tenant);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTenant(null);
    refetch();
  };

  if (isLoading) return <PageLoading label={t('tenants.opening')} />;

  if (error) {
    return <ErrorNote message={error instanceof Error ? error.message : t('tenants.fail')} />;
  }

  return (
    <div className="space-y-5">
      <BlurFade>
        <PageHeader
          title={t('nav.tenants')}
          copy={t('tenants.copy')}
          action={
            <Button onClick={handleCreate}>
              <Plus className="size-4" aria-hidden />
              {t('tenants.add')}
            </Button>
          }
        />
      </BlurFade>

      <BlurFade delay={0.05}>
        <TenantsList tenants={tenants} onEdit={handleEdit} onRefetch={refetch} />
      </BlurFade>

      {isFormOpen && <TenantForm tenant={editingTenant} onClose={handleFormClose} />}
    </div>
  );
}
