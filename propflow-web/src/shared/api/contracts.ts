import { apiClient } from './client';
import type { ContractDto, CreateContractDto, UpdateContractDto } from '../types';

export const contractsApi = {
  getAll: (): Promise<ContractDto[]> => 
    apiClient.get('/contracts'),

  getById: (id: string): Promise<ContractDto> => 
    apiClient.get(`/contracts/${id}`),

  create: (data: CreateContractDto): Promise<ContractDto> => 
    apiClient.post('/contracts', data),

  update: (id: string, data: UpdateContractDto): Promise<ContractDto> => 
    apiClient.put(`/contracts/${id}`, data),

  delete: (id: string): Promise<void> => 
    apiClient.delete(`/contracts/${id}`),
};