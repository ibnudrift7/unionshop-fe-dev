'use client';

import { useCallback, useEffect, useState } from 'react';

export interface GuestAddressData {
  name: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  provinceId?: string;
  provinceName?: string;
  cityId?: string;
  cityName?: string;
  districtId?: string;
  districtName?: string;
  postalCode: string;
  addressDetail: string;
}

const KEY = 'guest_address';

export function getGuestAddress(): GuestAddressData | null {
  try {
    if (typeof window === 'undefined') return null;
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as GuestAddressData) : null;
  } catch {
    return null;
  }
}

export function setGuestAddress(data: GuestAddressData | null) {
  try {
    if (typeof window === 'undefined') return;
    if (data) localStorage.setItem(KEY, JSON.stringify(data));
    else localStorage.removeItem(KEY);
  } catch {}
}

export function useGuestAddress() {
  const [data, setData] = useState<GuestAddressData | null>(() =>
    getGuestAddress(),
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setData(getGuestAddress());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const save = useCallback((next: GuestAddressData | null) => {
    setGuestAddress(next);
    setData(next);
  }, []);

  return { data, save };
}
