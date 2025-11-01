import { API_ENDPOINTS } from '@/constants/api';
import { httpFetch } from '@/services/http';
import type { SettingsResponse } from '@/types/setting';

export const settingService = {
  getSettings() {
    return httpFetch<SettingsResponse>(API_ENDPOINTS.setting, {
      method: 'GET',
    });
  },
};
