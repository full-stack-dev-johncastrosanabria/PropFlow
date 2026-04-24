import { apiClient } from './client';
import type { PropertyDto, CreatePropertyDto, UpdatePropertyDto } from '../types';

export const propertiesApi = {
  getAll: () => apiClient.get<PropertyDto[]>('/properties'),
  
  getById: (id: string) => apiClient.get<PropertyDto>(`/properties/${id}`),
  
  create: (data: CreatePropertyDto) =>
    apiClient.post<PropertyDto>('/properties', data),
  
  update: (id: string, data: UpdatePropertyDto) =>
    apiClient.put<PropertyDto>(`/properties/${id}`, data),
  
  delete: (id: string) => apiClient.delete(`/properties/${id}`),
};
