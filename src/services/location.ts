import { API_ENDPOINTS } from '@/constants/api';
import { httpFetch } from '@/services/http';
import type {
  CitiesResponse,
  DistrictsResponse,
  ProvincesResponse,
} from '@/types/location';

export const locationService = {
  getProvinces() {
    return httpFetch<ProvincesResponse>(API_ENDPOINTS.locationProvinces, {
      method: 'GET',
    });
  },
  getCities(provinceId: number | string) {
    const params = new URLSearchParams();
    params.set('province_id', String(provinceId));
    return httpFetch<CitiesResponse, URLSearchParams>(
      API_ENDPOINTS.locationCities,
      {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
  },
  getDistricts(cityId: number | string) {
    const params = new URLSearchParams();
    params.set('city_id', String(cityId));
    return httpFetch<DistrictsResponse, URLSearchParams>(
      API_ENDPOINTS.locationDistricts,
      {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
  },
};
