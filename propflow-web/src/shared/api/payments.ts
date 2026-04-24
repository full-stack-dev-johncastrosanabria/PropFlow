import { apiClient } from './client';
import type { PaymentDto, CreatePaymentDto, UpdatePaymentDto } from '../types';

export const paymentsApi = {
  getAll: (): Promise<PaymentDto[]> => 
    apiClient.get('/payments'),

  getByContractId: (contractId: string): Promise<PaymentDto[]> => 
    apiClient.get(`/payments/contract/${contractId}`),

  getById: (id: string): Promise<PaymentDto> => 
    apiClient.get(`/payments/${id}`),

  create: (data: CreatePaymentDto): Promise<PaymentDto> => 
    apiClient.post('/payments', data),

  update: (id: string, data: UpdatePaymentDto): Promise<PaymentDto> => 
    apiClient.put(`/payments/${id}`, data),

  delete: (id: string): Promise<void> => 
    apiClient.delete(`/payments/${id}`),
};