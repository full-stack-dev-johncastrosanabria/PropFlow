import { useMutation } from '@tanstack/react-query';
import { DoorOpen } from 'lucide-react';
import { unitsApi } from '../../../shared/api/units';
import { UnitStatus, type RentalUnitDto, type PropertyDto } from '../../../shared/types';
import { unitImageFor } from '@/shared/media';
import { Badge, type BadgeTone } from '@/components/world/Stamp';
import { Button } from '@/components/world/Button';
import { EmptyState } from '@/components/world/EmptyState';

interface UnitsListProps {
  units: RentalUnitDto[];
  properties: PropertyDto[];
  onEdit: (unit: RentalUnitDto) => void;
  onRefetch: () => void;
}

const statusMeta: Record<UnitStatus, { label: string; tone: BadgeTone; stroke: 'solid' | 'dashed' }> = {
  [UnitStatus.Available]: { label: 'Available', tone: 'blue', stroke: 'solid' },
  [UnitStatus.Occupied]: { label: 'Occupied', tone: 'green', stroke: 'solid' },
  [UnitStatus.Maintenance]: { label: 'Maintenance', tone: 'amber', stroke: 'dashed' },
};

export default function UnitsList({ units, properties, onEdit, onRefetch }: UnitsListProps) {
  const deleteMutation = useMutation({
    mutationFn: unitsApi.delete,
    onSuccess: () => {
      onRefetch();
    },
  });

  const handleDelete = async (unit: RentalUnitDto) => {
    if (window.confirm(`Delete "${unit.name}"? This cannot be undone.`)) {
      deleteMutation.mutate(unit.id);
    }
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    return property?.name || 'Unknown property';
  };

  if (units.length === 0) {
    return (
      <EmptyState
        icon={DoorOpen}
        title="No units yet"
        copy="Add the individual doors inside your properties — each with its rent and status."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:gap-6">
      {units.map((unit) => {
        const status = statusMeta[unit.status];
        return (
          <article
            key={unit.id}
            className="flex h-full flex-col overflow-hidden rounded-sheet border border-rule bg-paper-raised shadow-sheet transition-colors hover:border-rule-strong"
          >
            <div className="relative border-b border-rule">
              <img
                src={unit.imageUrl ?? unitImageFor(unit.id)}
                alt={`Interior of ${unit.name}`}
                loading="lazy"
                className="h-40 w-full object-cover"
              />
              <span className="absolute bottom-3 left-4 flex size-9 items-center justify-center rounded-[10px] border border-rule-strong bg-paper-raised/95 text-hue-units shadow-tab">
                <DoorOpen className="size-[18px]" aria-hidden />
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-[17px] font-semibold text-carbon">{unit.name}</h3>
                  <p className="mt-0.5 truncate text-[13.5px] text-carbon-soft">{getPropertyName(unit.propertyId)}</p>
                  {unit.unitNumber && (
                    <p className="text-figure mt-0.5 text-[12.5px] text-carbon-faint">#{unit.unitNumber}</p>
                  )}
                </div>
                <Badge tone={status.tone} stroke={status.stroke}>{status.label}</Badge>
              </div>

              <div className="mt-4 space-y-0 border-t border-rule">
                <div className="flex items-baseline justify-between border-b border-rule py-2.5">
                  <span className="text-[13px] font-medium text-carbon-soft">Monthly rent</span>
                  <span className="text-figure text-[15px] font-semibold text-carbon">
                    {unit.currency} {unit.monthlyRent.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-baseline justify-between py-2.5">
                  <span className="text-[13px] font-medium text-carbon-soft">Listed</span>
                  <span className="text-figure text-[13.5px] text-carbon-faint">
                    {new Date(unit.createdAtUtc).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-auto flex gap-2 pt-4">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(unit)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(unit)}
                  disabled={deleteMutation.isPending}
                  loading={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
