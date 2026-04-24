import { apiClient } from './client';
import type { RentalUnitDto, CreateRentalUnitDto, UpdateRentalUnitDto } from '../types';

export const unitsApi = {
  getAll: (): Promise<RentalUnitDto[]> => 
    apiClient.get('/rentalunits'),

  getByPropertyId: (propertyId: string): Promise<RentalUnitDto[]> => 
    apiClient.get(`/rentalunits/property/${propertyId}`),

  getById: (id: string): Promise<RentalUnitDto> => 
    apiClient.get(`/rentalunits/${id}`),

  create: (data: CreateRentalUnitDto): Promise<RentalUnitDto> => 
    apiClient.post('/rentalunits', data),

  update: (id: string, data: UpdateRentalUnitDto): Promise<RentalUnitDto> => 
    apiClient.put(`/rentalunits/${id}`, data),

  delete: (id: string): Promise<void> => 
    apiClient.delete(`/rentalunits/${id}`),
};