import { apiClient } from './client';
import type { TenantDto, CreateTenantDto, UpdateTenantDto } from '../types';

export const tenantsApi = {
  getAll: (): Promise<TenantDto[]> => 
    apiClient.get('/tenants'),

  getById: (id: string): Promise<TenantDto> => 
    apiClient.get(`/tenants/${id}`),

  create: (data: CreateTenantDto): Promise<TenantDto> => 
    apiClient.post('/tenants', data),

  update: (id: string, data: UpdateTenantDto): Promise<TenantDto> => 
    apiClient.put(`/tenants/${id}`, data),

  delete: (id: string): Promise<void> => 
    apiClient.delete(`/tenants/${id}`),
};