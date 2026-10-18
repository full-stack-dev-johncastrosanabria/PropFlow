import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    onError: () => setErrors({ submit: t('pay.createFailed') }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentDto }) => paymentsApi.update(id, data),
    onSuccess: onClose,
    onError: () => setErrors({ submit: t('pay.updateFailed') }),
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.contractId) newErrors.contractId = t('pay.errContract');
    if (!formData.dueDate) newErrors.dueDate = t('pay.errDueDate');
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = t('pay.errAmount');
    }
    if (formData.status === PaymentStatus.Paid && !formData.paidDate) {
      newErrors.paidDate = t('pay.errPaidDate');
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
      title={payment ? t('pay.edit') : t('pay.add')}
      subtitle={t('pay.formSubtitle')}
      onClose={onClose}
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && <ErrorNote message={errors.submit} />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('contracts.contract')} required error={errors.contractId}>
            <Select
              id="contractId"
              name="contractId"
              value={formData.contractId}
              onChange={handleChange}
              invalid={!!errors.contractId}
              disabled={isLoading}
            >
              <option value="">{t('pay.selectContract')}</option>
              {contracts.map((contract) => (
                <option key={contract.id} value={contract.id}>
                  {contract.tenantName} — {contract.unitName} ({contract.currency} {contract.monthlyRent})
                </option>
              ))}
            </Select>
          </Field>

          <Field label={t('pay.amount')} required error={errors.amount}>
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
          <Field label={t('leads.currency')}>
            <Select name="currency" value={formData.currency} onChange={handleChange} disabled={isLoading}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
            </Select>
          </Field>

          <Field label={t('contracts.status')}>
            <Select name="status" value={formData.status} onChange={handleChange} disabled={isLoading}>
              <option value={PaymentStatus.Pending}>{t('pay.pending')}</option>
              <option value={PaymentStatus.Paid}>{t('pay.paid')}</option>
              <option value={PaymentStatus.Late}>{t('pay.late')}</option>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('pay.dueDate')} required error={errors.dueDate}>
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
            label={formData.status === PaymentStatus.Paid ? t('pay.paidDate') : t('pay.paidDateOptional')}
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

        <Field label={t('leads.notes')}>
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            disabled={isLoading}
            placeholder={t('pay.notesPlaceholder')}
          />
        </Field>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" className="flex-1" loading={isLoading}>
            {payment ? t('pay.update') : t('pay.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
