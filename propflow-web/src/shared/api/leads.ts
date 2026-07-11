import { apiClient } from './client';
import type { LeadDto, CreateLeadDto, UpdateLeadDto, LeadStage } from '../types';

export const leadsApi = {
  getAll: (): Promise<LeadDto[]> =>
    apiClient.get('/leads'),

  getById: (id: string): Promise<LeadDto> =>
    apiClient.get(`/leads/${id}`),

  create: (data: CreateLeadDto): Promise<LeadDto> =>
    apiClient.post('/leads', data),

  update: (id: string, data: UpdateLeadDto): Promise<LeadDto> =>
    apiClient.put(`/leads/${id}`, data),

  updateStage: (id: string, stage: LeadStage): Promise<LeadDto> =>
    apiClient.request(`/leads/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage }),
    }),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/leads/${id}`),
};
