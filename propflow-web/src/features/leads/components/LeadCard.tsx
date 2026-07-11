import type { LeadDto } from '../../../shared/types';
import { sourceMeta, formatCurrency } from '../leadMeta';

interface LeadCardProps {
  lead: LeadDto;
  accent: string;
  onEdit: (lead: LeadDto) => void;
  onDelete: (lead: LeadDto) => void;
  onDragStart: (lead: LeadDto) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');

export default function LeadCard({
  lead,
  accent,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging,
}: LeadCardProps) {
  const src = sourceMeta(lead.source);

  return (
    <div
      className={`lead-card ${isDragging ? 'lead-card-dragging' : ''}`}
      style={{ borderLeftColor: accent }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(lead);
      }}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(lead)}
    >
      <div className="lead-card-top">
        <div className="lead-avatar" style={{ background: accent }}>
          {initials(lead.fullName) || '👤'}
        </div>
        <div className="lead-card-id">
          <div className="lead-card-name">{lead.fullName}</div>
          <div className="lead-card-email">{lead.email}</div>
        </div>
        <button
          className="lead-card-del"
          title="Delete lead"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(lead);
          }}
        >
          🗑️
        </button>
      </div>

      {lead.interestedIn && (
        <div className="lead-card-interest">🔎 {lead.interestedIn}</div>
      )}

      <div className="lead-card-foot">
        <span className="lead-value" style={{ color: accent }}>
          {formatCurrency(lead.estimatedValue, lead.currency)}
          <span className="lead-value-suffix">/mo</span>
        </span>
        <span className="lead-source-chip" title={`Source: ${src.label}`}>
          {src.icon} {src.label}
        </span>
      </div>
    </div>
  );
}
