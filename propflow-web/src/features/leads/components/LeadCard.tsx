import type { LeadDto } from '../../../shared/types';
import { sourceMeta, formatCurrency } from '../leadMeta';
import { portraitFor } from '@/shared/media';
import { Trash2, Search } from 'lucide-react';

interface LeadCardProps {
  lead: LeadDto;
  accent: string;
  onEdit: (lead: LeadDto) => void;
  onDelete: (lead: LeadDto) => void;
  onDragStart: (lead: LeadDto) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  dimmed: boolean;
}

export default function LeadCard({
  lead,
  accent,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging,
  dimmed,
}: LeadCardProps) {
  const src = sourceMeta(lead.source);

  return (
    <div
      className={`group cursor-grab rounded-[11px] border border-rule bg-paper-raised p-3 shadow-tab transition-all hover:border-rule-strong hover:shadow-sheet active:cursor-grabbing ${
        isDragging ? 'rotate-[0.6deg] opacity-90 shadow-sheet-lift' : ''
      } ${dimmed ? 'opacity-45' : ''}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(lead);
      }}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(lead)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit(lead);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Lead ${lead.fullName}, ${formatCurrency(lead.estimatedValue, lead.currency)} per month, edit`}
    >
      <div className="flex items-start gap-2.5">
        <img
          src={lead.imageUrl ?? portraitFor(lead.fullName)}
          alt=""
          loading="lazy"
          className="size-8 shrink-0 rounded-full border border-rule-strong object-cover"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-semibold leading-tight text-carbon">{lead.fullName}</div>
          <div className="truncate text-[12.5px] text-carbon-faint">{lead.email}</div>
        </div>
        <button
          className="flex size-7 shrink-0 items-center justify-center rounded-[7px] text-carbon-faint opacity-0 transition-all hover:bg-ink-red/10 hover:text-ink-red focus-visible:opacity-100 group-hover:opacity-100"
          title="Delete lead"
          aria-label={`Delete lead ${lead.fullName}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(lead);
          }}
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      {lead.interestedIn && (
        <div className="mt-2 flex items-center gap-1.5 text-[12.5px] text-carbon-soft">
          <Search className="size-3 shrink-0 text-carbon-faint" aria-hidden />
          <span className="truncate">{lead.interestedIn}</span>
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-rule pt-2.5">
        <span className="text-figure text-[13.5px] font-semibold" style={{ color: accent }}>
          {formatCurrency(lead.estimatedValue, lead.currency)}
          <span className="text-[10.5px] font-medium text-carbon-faint">/mo</span>
        </span>
        <span className="flex items-center gap-1 text-[12px] font-medium text-carbon-faint" title={`Source: ${src.label}`}>
          <src.icon className="size-3.5" aria-hidden />
          {src.label}
        </span>
      </div>
    </div>
  );
}
