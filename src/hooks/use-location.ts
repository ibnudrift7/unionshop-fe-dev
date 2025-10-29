'use client';

import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/location';
import type {
  CitiesResponse,
  DistrictsResponse,
  ProvincesResponse,
} from '@/types/location';
import { HttpError } from '@/services/http';

export function useProvincesQuery(enabled: boolean = true) {
  return useQuery<ProvincesResponse, HttpError>({
    queryKey: ['location', 'provinces'],
    queryFn: () => locationService.getProvinces().then((r) => r.data),
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useCitiesQuery(provinceId: number | string | undefined) {
  return useQuery<CitiesResponse, HttpError>({
    queryKey: ['location', 'cities', provinceId ?? ''],
    queryFn: () =>
      locationService.getCities(provinceId as number).then((r) => r.data),
    enabled: Boolean(provinceId),
    staleTime: 60 * 60 * 1000,
  });
}

export function useDistrictsQuery(cityId: number | string | undefined) {
  return useQuery<DistrictsResponse, HttpError>({
    queryKey: ['location', 'districts', cityId ?? ''],
    queryFn: () =>
      locationService.getDistricts(cityId as number).then((r) => r.data),
    enabled: Boolean(cityId),
    staleTime: 60 * 60 * 1000,
  });
}
