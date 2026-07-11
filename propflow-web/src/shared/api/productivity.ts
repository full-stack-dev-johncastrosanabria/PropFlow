import { apiClient } from './client';
import type { ProductivitySummaryDto, DailyActivityDto, UpsertDailyActivityDto, ProductivityGoalsDto } from '../types';

export const productivityApi = {
  getSummary: (): Promise<ProductivitySummaryDto> =>
    apiClient.get('/productivity/summary'),

  getDay: (date?: string): Promise<DailyActivityDto> =>
    apiClient.get(`/productivity/day${date ? `?date=${date}` : ''}`),

  upsertDay: (data: UpsertDailyActivityDto): Promise<DailyActivityDto> =>
    apiClient.put('/productivity/day', data),

  updateGoals: (data: ProductivityGoalsDto): Promise<ProductivityGoalsDto> =>
    apiClient.put('/productivity/goals', data),
};
