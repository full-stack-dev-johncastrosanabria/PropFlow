import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { paymentsApi } from '../../../shared/api/payments';
import { PaymentStatus, type PaymentDto, type ContractDto, type CreatePaymentDto, type UpdatePaymentDto } from '../../../shared/types';
import { Modal } from '@/components/world/Modal';
import { Field, TextInput, Select, Textarea } from '@/components/world/fields';
import { Button } from '@/components/world/Button';
import { ErrorNote } from '@/components/world/EmptyState';

interface PaymentFormProps {
  payment?: PaymentDto | null;
  contracts: ContractDto[];
  onClose: () => void;
}

interface FormErrors {
  contractId?: string;
  dueDate?: string;
  amount?: string;
  paidDate?: string;
  submit?: string;
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

  const [errors, setErrors] = useState<FormErrors>({});

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
    onSuccess: onClose,
    onError: () => setErrors({ submit: 'Failed to create payment. Please try again.' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentDto }) => paymentsApi.update(id, data),
    onSuccess: onClose,
    onError: () => setErrors({ submit: 'Failed to update payment. Please try again.' }),
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.contractId) newErrors.contractId = 'Pick the contract this payment belongs to.';
    if (!formData.dueDate) newErrors.dueDate = 'A due date is needed.';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'The amount has to be greater than zero.';
    }
    if (formData.status === PaymentStatus.Paid && !formData.paidDate) {
      newErrors.paidDate = 'A paid date is needed once the status is Paid.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={payment ? 'Edit payment' : 'Add payment'}
      subtitle="One line on the rent roll."
      onClose={onClose}
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && <ErrorNote message={errors.submit} />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Contract" required error={errors.contractId}>
            <Select
              id="contractId"
              name="contractId"
              value={formData.contractId}
              onChange={handleChange}
              invalid={!!errors.contractId}
              disabled={isLoading}
            >
              <option value="">Select a contract</option>
              {contracts.map((contract) => (
                <option key={contract.id} value={contract.id}>
                  {contract.tenantName} — {contract.unitName} ({contract.currency} {contract.monthlyRent})
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Amount" required error={errors.amount}>
            <TextInput
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              invalid={!!errors.amount}
              disabled={isLoading}
              placeholder="0.00"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Currency">
            <Select name="currency" value={formData.currency} onChange={handleChange} disabled={isLoading}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
            </Select>
          </Field>

          <Field label="Status">
            <Select name="status" value={formData.status} onChange={handleChange} disabled={isLoading}>
              <option value={PaymentStatus.Pending}>Pending</option>
              <option value={PaymentStatus.Paid}>Paid</option>
              <option value={PaymentStatus.Late}>Late</option>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Due date" required error={errors.dueDate}>
            <TextInput
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              invalid={!!errors.dueDate}
              disabled={isLoading}
            />
          </Field>

          <Field
            label={`Paid date${formData.status === PaymentStatus.Paid ? '' : ' (optional)'}`}
            required={formData.status === PaymentStatus.Paid}
            error={errors.paidDate}
          >
            <TextInput
              type="date"
              name="paidDate"
              value={formData.paidDate}
              onChange={handleChange}
              invalid={!!errors.paidDate}
              disabled={isLoading}
            />
          </Field>
        </div>

        <Field label="Notes">
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            disabled={isLoading}
            placeholder="Anything worth noting about this payment…"
          />
        </Field>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={isLoading}>
            {payment ? 'Update payment' : 'Create payment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
