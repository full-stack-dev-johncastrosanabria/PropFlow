import { apiClient } from './client';
import type { DashboardDto } from '../types';

export const dashboardApi = {
  getDashboard: () => apiClient.get<DashboardDto>('/dashboard'),
};
