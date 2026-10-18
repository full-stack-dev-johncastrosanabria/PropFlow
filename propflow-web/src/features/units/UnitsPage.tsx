import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { unitsApi } from '../../shared/api/units';
import { propertiesApi } from '../../shared/api/properties';
import UnitsList from './components/UnitsList';
import UnitForm from './components/UnitForm';
import type { RentalUnitDto } from '../../shared/types';
import { PageHeader } from '@/components/world/PageHeader';
import { Button } from '@/components/world/Button';
import { PageLoading, ErrorNote } from '@/components/world/EmptyState';
import { BlurFade } from '@/components/magicui/blur-fade';

export default function UnitsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<RentalUnitDto | null>(null);

  const { data: units = [], isLoading, error, refetch } = useQuery({
    queryKey: ['units'],
    queryFn: unitsApi.getAll,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: propertiesApi.getAll,
  });

  const handleCreate = () => {
    setEditingUnit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (unit: RentalUnitDto) => {
    setEditingUnit(unit);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingUnit(null);
    refetch();
  };

  if (isLoading) return <PageLoading label="Counting the doors…" />;

  if (error) {
    return <ErrorNote message={error instanceof Error ? error.message : 'Failed to load units'} />;
  }

  return (
    <div className="space-y-5">
      <BlurFade>
        <PageHeader
          title="Rental units"
          copy="Each door, its rent, and whether someone is living behind it."
          action={
            <Button onClick={handleCreate}>
              <Plus className="size-4" aria-hidden />
              Add unit
            </Button>
          }
        />
      </BlurFade>

      <BlurFade delay={0.05}>
        <UnitsList units={units} properties={properties} onEdit={handleEdit} onRefetch={refetch} />
      </BlurFade>

      {isFormOpen && (
        <UnitForm unit={editingUnit} properties={properties} onClose={handleFormClose} />
      )}
    </div>
  );
}
