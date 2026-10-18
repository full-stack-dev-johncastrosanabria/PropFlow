import { useMutation } from '@tanstack/react-query';
import { Users, Mail, Phone, IdCard, NotebookText, CalendarDays } from 'lucide-react';
import { tenantsApi } from '../../../shared/api/tenants';
import type { TenantDto } from '../../../shared/types';
import { portraitFor } from '@/shared/media';
import { Avatar } from '@/components/world/Avatar';
import { Button } from '@/components/world/Button';
import { EmptyState } from '@/components/world/EmptyState';

interface TenantsListProps {
  tenants: TenantDto[];
  onEdit: (tenant: TenantDto) => void;
  onRefetch: () => void;
}

export default function TenantsList({ tenants, onEdit, onRefetch }: TenantsListProps) {
  const deleteMutation = useMutation({
    mutationFn: tenantsApi.delete,
    onSuccess: () => {
      onRefetch();
    },
  });

  const handleDelete = async (tenant: TenantDto) => {
    if (window.confirm(`Delete "${tenant.fullName}"? Their contact details will be removed.`)) {
      deleteMutation.mutate(tenant.id);
    }
  };

  if (tenants.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No tenants yet"
        copy="Add the people behind your leases — name, email, phone, and ID."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:gap-6">
      {tenants.map((tenant) => (
        <article
          key={tenant.id}
          className="flex h-full flex-col rounded-sheet border border-rule bg-paper-raised p-5 shadow-sheet transition-colors hover:border-rule-strong"
        >
          <div className="flex items-center gap-3">
            <Avatar name={tenant.fullName} src={tenant.imageUrl ?? portraitFor(tenant.fullName)} className="size-11" />
            <div className="min-w-0">
              <h3 className="truncate font-display text-[16.5px] font-semibold text-carbon">{tenant.fullName}</h3>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-[13px] text-carbon-soft">
                <Mail className="size-3.5 shrink-0" aria-hidden />
                {tenant.email}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-0 border-t border-rule">
            {tenant.phone && (
              <div className="flex items-center gap-2.5 border-b border-rule py-2.5 text-[13.5px] text-carbon-soft">
                <Phone className="size-3.5 shrink-0 text-carbon-faint" aria-hidden />
                {tenant.phone}
              </div>
            )}
            {tenant.identificationNumber && (
              <div className="flex items-center gap-2.5 border-b border-rule py-2.5 text-[13.5px] text-carbon-soft">
                <IdCard className="size-3.5 shrink-0 text-carbon-faint" aria-hidden />
                <span className="text-figure">{tenant.identificationNumber}</span>
              </div>
            )}
            {tenant.notes && (
              <div className="flex items-start gap-2.5 border-b border-rule py-2.5 text-[13.5px] text-carbon-soft">
                <NotebookText className="mt-0.5 size-3.5 shrink-0 text-carbon-faint" aria-hidden />
                <span className="line-clamp-2">{tenant.notes}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 py-2.5 text-[12.5px] text-carbon-faint">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden />
              Added {new Date(tenant.createdAtUtc).toLocaleDateString()}
            </div>
          </div>

          <div className="mt-auto flex gap-2 pt-4">
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(tenant)}>
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="flex-1"
              onClick={() => handleDelete(tenant)}
              disabled={deleteMutation.isPending}
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
