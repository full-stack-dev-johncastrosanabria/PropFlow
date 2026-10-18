import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { maintenanceApi } from '../../shared/api/maintenance';
import { propertiesApi } from '../../shared/api/properties';
import { unitsApi } from '../../shared/api/units';
import MaintenanceList from './components/MaintenanceList';
import MaintenanceForm from './components/MaintenanceForm';
import type { MaintenanceRequestDto } from '../../shared/types';
import { PageHeader } from '@/components/world/PageHeader';
import { Button } from '@/components/world/Button';
import { PageLoading, ErrorNote } from '@/components/world/EmptyState';
import { BlurFade } from '@/components/magicui/blur-fade';

export default function MaintenancePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequestDto | null>(null);

  const { data: requests = [], isLoading, error, refetch } = useQuery({
    queryKey: ['maintenance'],
    queryFn: maintenanceApi.getAll,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: propertiesApi.getAll,
  });

  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: unitsApi.getAll,
  });

  const handleCreate = () => {
    setEditingRequest(null);
    setIsFormOpen(true);
  };

  const handleEdit = (request: MaintenanceRequestDto) => {
    setEditingRequest(request);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingRequest(null);
    refetch();
  };

  if (isLoading) return <PageLoading label="Checking the work orders…" />;

  if (error) {
    return <ErrorNote message={error instanceof Error ? error.message : 'Failed to load maintenance requests'} />;
  }

  return (
    <div className="space-y-5">
      <BlurFade>
        <PageHeader
          title="Maintenance"
          copy="Work orders across the portfolio — priority, progress, and what's fixed."
          action={
            <Button onClick={handleCreate}>
              <Plus className="size-4" aria-hidden />
              Add request
            </Button>
          }
        />
      </BlurFade>

      <BlurFade delay={0.05}>
        <MaintenanceList requests={requests} onEdit={handleEdit} onRefetch={refetch} />
      </BlurFade>

      {isFormOpen && (
        <MaintenanceForm
          request={editingRequest}
          properties={properties}
          units={units}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
