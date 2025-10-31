'use client';

import { useQuery } from '@tanstack/react-query';
import { settingService } from '@/services/setting';
import type { SettingsResponse, SettingsMap } from '@/types/setting';
import { HttpError } from '@/services/http';

export function useSettingsQuery() {
  return useQuery<SettingsResponse, HttpError>({
    queryKey: ['setting'],
    queryFn: () => settingService.getSettings().then((r) => r.data),
    staleTime: 5 * 60_000, // 5 minutes
  });
}

export function useSettingsMapQuery() {
  return useQuery<SettingsResponse, HttpError, SettingsMap>({
    queryKey: ['setting', 'map'],
    queryFn: () => settingService.getSettings().then((r) => r.data),
    select: (data) => {
      const map: SettingsMap = {};
      for (const item of data.data.flat || []) {
        map[item.name] = item;
      }
      return map;
    },
    staleTime: 5 * 60_000,
  });
}
