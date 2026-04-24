import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { paymentsApi } from '../../../shared/api/payments';
import { PaymentStatus, type PaymentDto, type ContractDto, type CreatePaymentDto, type UpdatePaymentDto } from '../../../shared/types';

interface PaymentFormProps {
  payment?: PaymentDto | null;
  contracts: ContractDto[];
  onClose: () => void;
}

export default function PaymentForm({ payment, contracts, onClose }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    contractId: '',
    dueDate: '',
    paidDate: '',
    amount: '',
    currency: 'USD',
    status: PaymentStatus.Pending,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (payment) {
      setFormData({
        contractId: payment.contractId,
        dueDate: payment.dueDate.split('T')[0],
        paidDate: payment.paidDate ? payment.paidDate.split('T')[0] : '',
        amount: payment.amount.toString(),
        currency: payment.currency,
        status: payment.status,
        notes: payment.notes || '',
      });
    }
  }, [payment]);

  const createMutation = useMutation({
    mutationFn: paymentsApi.create,
    onSuccess: () => {
      onClose();
    },
    onError: (error: any) => {
      console.error('Create payment error:', error);
      setErrors({ submit: 'Failed to create payment. Please try again.' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentDto }) =>
      paymentsApi.update(id, data),
    onSuccess: () => {
      onClose();
    },
    onError: (error: any) => {
      console.error('Update payment error:', error);
      setErrors({ submit: 'Failed to update payment. Please try again.' });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contractId) {
      newErrors.contractId = 'Contract is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (formData.status === PaymentStatus.Paid && !formData.paidDate) {
      newErrors.paidDate = 'Paid date is required when status is Paid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      contractId: formData.contractId,
      dueDate: formData.dueDate,
      paidDate: formData.paidDate || undefined,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      status: formData.status,
      notes: formData.notes || undefined,
    };

    if (payment) {
      updateMutation.mutate({ id: payment.id, data: submitData });
    } else {
      createMutation.mutate(submitData as CreatePaymentDto);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-semibold text-gray-900">
            {payment ? 'Edit Payment' : 'Add New Payment'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {errors.submit && (
            <div className="alert alert-danger mb-4">
              {errors.submit}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="contractId" className="form-label">
                Contract *
              </label>
              <select
                id="contractId"
                name="contractId"
                value={formData.contractId}
                onChange={handleChange}
                className={`form-input ${errors.contractId ? 'error' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select a contract</option>
                {contracts.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.tenantName} - {contract.unitName} (${contract.monthlyRent})
                  </option>
                ))}
              </select>
              {errors.contractId && (
                <span className="form-error">{errors.contractId}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                Amount *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`form-input ${errors.amount ? 'error' : ''}`}
                disabled={isLoading}
                placeholder="0.00"
              />
              {errors.amount && (
                <span className="form-error">{errors.amount}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="currency" className="form-label">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="form-input"
                disabled={isLoading}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
                disabled={isLoading}
              >
                <option value={PaymentStatus.Pending}>Pending</option>
                <option value={PaymentStatus.Paid}>Paid</option>
                <option value={PaymentStatus.Late}>Late</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">
                Due Date *
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`form-input ${errors.dueDate ? 'error' : ''}`}
                disabled={isLoading}
              />
              {errors.dueDate && (
                <span className="form-error">{errors.dueDate}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="paidDate" className="form-label">
                Paid Date {formData.status === PaymentStatus.Paid && '*'}
              </label>
              <input
                type="date"
                id="paidDate"
                name="paidDate"
                value={formData.paidDate}
                onChange={handleChange}
                className={`form-input ${errors.paidDate ? 'error' : ''}`}
                disabled={isLoading}
              />
              {errors.paidDate && (
                <span className="form-error">{errors.paidDate}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="form-input"
              disabled={isLoading}
              placeholder="Additional notes about this payment..."
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-sm"></span>
                  {payment ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                payment ? 'Update Payment' : 'Create Payment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}