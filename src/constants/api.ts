export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export const API_ENDPOINTS = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  profile: '/user/profile',
  profilePassword: '/user/profile/password',
  products: '/products',
  // Address & Location
  addressDefault: '/user/address/default',
  locationProvinces: '/location/provinces',
  locationCities: '/location/cities',
  locationDistricts: '/location/districts',
} as const;
