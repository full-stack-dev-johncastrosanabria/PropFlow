import { useState, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { leadsApi } from '../../../shared/api/leads';
import type { LeadDto, UpdateLeadDto } from '../../../shared/types';
import { LeadStage, LeadSource } from '../../../shared/types';
import { STAGES, SOURCES } from '../leadMeta';

interface LeadFormProps {
  lead?: LeadDto | null;
  defaultStage?: LeadStage;
  onClose: () => void;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'MXN'];

export default function LeadForm({ lead, defaultStage, onClose }: LeadFormProps) {
  const [formData, setFormData] = useState({
    fullName: lead?.fullName || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    source: lead?.source ?? LeadSource.Website,
    stage: lead?.stage ?? defaultStage ?? LeadStage.New,
    estimatedValue: lead?.estimatedValue ?? 0,
    currency: lead?.currency || 'USD',
    interestedIn: lead?.interestedIn || '',
    notes: lead?.notes || '',
  });
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: leadsApi.create,
    onSuccess: onClose,
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create lead'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadDto }) => leadsApi.update(id, data),
    onSuccess: onClose,
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to update lead'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email) {
      setError('Please fill in name and email');
      return;
    }

    const data = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      source: Number(formData.source),
      stage: Number(formData.stage),
      estimatedValue: Number(formData.estimatedValue) || 0,
      currency: formData.currency,
      interestedIn: formData.interestedIn || undefined,
      notes: formData.notes || undefined,
    };

    if (lead) {
      updateMutation.mutate({ id: lead.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {lead ? 'Edit Lead' : 'New Lead'}
            </h2>
            <button onClick={onClose} className="lead-modal-close">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Lead's full name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555 000 0000"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Interested In</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.interestedIn}
                  onChange={(e) => setFormData({ ...formData, interestedIn: e.target.value })}
                  placeholder="e.g. 2BR downtown"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Stage</label>
                <select
                  className="form-input"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: Number(e.target.value) })}
                >
                  {STAGES.map((s) => (
                    <option key={s.stage} value={s.stage}>{s.icon} {s.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Source</label>
                <select
                  className="form-input"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: Number(e.target.value) })}
                >
                  {SOURCES.map((s) => (
                    <option key={s.source} value={s.source}>{s.icon} {s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Estimated Value (monthly)</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  className="form-input"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select
                  className="form-input"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                style={{ minHeight: 80 }}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Context, next steps, preferences…"
                rows={3}
              />
            </div>

            {error && (
              <div className="alert alert-danger"><strong>Error:</strong> {error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn btn-secondary flex-1" disabled={isLoading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-1" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="spinner w-4 h-4" /> {lead ? 'Saving…' : 'Creating…'}
                  </div>
                ) : (
                  lead ? 'Save Changes' : 'Create Lead'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
