import { apiClient } from './client';
import type { LoginDto, RegisterDto, AuthResponseDto, LandlordDto } from '../types';

export const authApi = {
  register: (data: RegisterDto) =>
    apiClient.post<AuthResponseDto>('/auth/register', data),

  login: (data: LoginDto) =>
    apiClient.post<AuthResponseDto>('/auth/login', data),

  getCurrentUser: () =>
    apiClient.get<LandlordDto>('/auth/me'),
};
