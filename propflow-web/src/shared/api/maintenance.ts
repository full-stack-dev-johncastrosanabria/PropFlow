import { apiClient } from './client';
import type { MaintenanceRequestDto, CreateMaintenanceRequestDto, UpdateMaintenanceRequestDto } from '../types';

export const maintenanceApi = {
  getAll: (): Promise<MaintenanceRequestDto[]> => 
    apiClient.get('/maintenancerequests'),

  getById: (id: string): Promise<MaintenanceRequestDto> => 
    apiClient.get(`/maintenancerequests/${id}`),

  create: (data: CreateMaintenanceRequestDto): Promise<MaintenanceRequestDto> => 
    apiClient.post('/maintenancerequests', data),

  update: (id: string, data: UpdateMaintenanceRequestDto): Promise<MaintenanceRequestDto> => 
    apiClient.put(`/maintenancerequests/${id}`, data),

  delete: (id: string): Promise<void> => 
    apiClient.delete(`/maintenancerequests/${id}`),
};