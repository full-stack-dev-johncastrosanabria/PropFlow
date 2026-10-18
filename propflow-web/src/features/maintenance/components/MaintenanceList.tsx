import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Pencil, Trash2, Wrench } from 'lucide-react';
import { maintenanceApi } from '../../../shared/api/maintenance';
import { Priority, MaintenanceStatus, type MaintenanceRequestDto } from '../../../shared/types';
import { Badge, Stamp, type BadgeTone } from '@/components/world/Stamp';
import { Button } from '@/components/world/Button';
import { Pagination } from '@/components/world/Pagination';
import { EmptyState } from '@/components/world/EmptyState';

interface MaintenanceListProps {
  requests: MaintenanceRequestDto[];
  onEdit: (request: MaintenanceRequestDto) => void;
  onRefetch: () => void;
}

const PAGE_SIZE = 12;

const priorityMeta: Record<Priority, { tone: BadgeTone; label: string }> = {
  [Priority.High]: { tone: 'red', label: 'High' },
  [Priority.Medium]: { tone: 'amber', label: 'Medium' },
  [Priority.Low]: { tone: 'carbon', label: 'Low' },
};

const statusMeta: Record<MaintenanceStatus, { tone: BadgeTone; label: string; stroke: 'solid' | 'dashed' }> = {
  [MaintenanceStatus.Open]: { tone: 'amber', label: 'Open', stroke: 'dashed' },
  [MaintenanceStatus.InProgress]: { tone: 'blue', label: 'In progress', stroke: 'solid' },
  [MaintenanceStatus.Closed]: { tone: 'green', label: 'Closed', stroke: 'solid' },
};

export default function MaintenanceList({ requests, onEdit, onRefetch }: MaintenanceListProps) {
  const [page, setPage] = useState(1);

  const deleteMutation = useMutation({
    mutationFn: maintenanceApi.delete,
    onSuccess: () => {
      onRefetch();
    },
  });

  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedRequests = requests.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this maintenance request?')) {
      deleteMutation.mutate(id);
    }
  };

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={Wrench}
        title="No maintenance requests"
        copy="Log the first work order — what's broken, where, and how urgent."
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Desktop work-order table */}
      <div className="hidden overflow-hidden rounded-sheet border border-rule bg-paper-raised shadow-sheet md:block">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-rule-strong bg-paper-well/60 text-left">
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">Request</th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">Where</th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">Priority</th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">Status</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">Logged</th>
              <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-carbon-soft">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedRequests.map((request) => {
              const p = priorityMeta[request.priority];
              const s = statusMeta[request.status];
              return (
                <tr key={request.id} className="border-b border-rule/70 transition-colors last:border-b-0 hover:bg-paper-well/50">
                  <td className="max-w-[280px] px-5 py-3">
                    <div className="font-semibold text-carbon">{request.title}</div>
                    <div className="truncate text-[13px] text-carbon-faint">{request.description}</div>
                  </td>
                  <td className="px-4 py-3 text-carbon-soft">
                    {request.propertyName || 'Unknown'}
                    <span className="block text-[12.5px] text-carbon-faint">{request.unitName || 'General'}</span>
                  </td>
                  <td className="px-4 py-3">
                    {request.priority === Priority.High ? (
                      <Stamp tone="red">High</Stamp>
                    ) : (
                      <Badge tone={p.tone}>{p.label}</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={s.tone} stroke={s.stroke}>{s.label}</Badge>
                  </td>
                  <td className="text-figure px-4 py-3 text-right text-carbon-soft">
                    {new Date(request.createdAtUtc).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(request)} aria-label="Edit request" title="Edit">
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(request.id)}
                        disabled={deleteMutation.isPending}
                        aria-label="Delete request"
                        title="Delete"
                        className="hover:bg-ink-red/10 hover:text-ink-red"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination
          page={safePage}
          pageSize={PAGE_SIZE}
          total={requests.length}
          onPageChange={setPage}
          label="requests"
        />
      </div>

      {/* Mobile work-order cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {pagedRequests.map((request) => {
          const p = priorityMeta[request.priority];
          const s = statusMeta[request.status];
          return (
            <article key={request.id} className="rounded-sheet border border-rule bg-paper-raised p-4 shadow-sheet">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-carbon">{request.title}</div>
                  <div className="mt-0.5 text-[13px] text-carbon-soft">
                    {request.propertyName}
                    {request.unitName && ` — ${request.unitName}`}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  {request.priority === Priority.High ? (
                    <Stamp tone="red">High</Stamp>
                  ) : (
                    <Badge tone={p.tone}>{p.label}</Badge>
                  )}
                  <Badge tone={s.tone} stroke={s.stroke}>{s.label}</Badge>
                </div>
              </div>

              <p className="mt-3 line-clamp-3 border-t border-rule pt-2.5 text-[13.5px] text-carbon-soft">
                {request.description}
              </p>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-figure text-[12.5px] text-carbon-faint">
                  Logged {new Date(request.createdAtUtc).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => onEdit(request)}>
                    <Pencil className="size-3.5" aria-hidden /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(request.id)}
                    disabled={deleteMutation.isPending}
                    loading={deleteMutation.isPending}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-sheet border border-rule bg-paper-raised shadow-sheet md:hidden">
        <Pagination
          page={safePage}
          pageSize={PAGE_SIZE}
          total={requests.length}
          onPageChange={setPage}
          label="requests"
        />
      </div>
    </div>
  );
}
