'use client';

import { useRouter } from 'next/navigation';
// no-op
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import AddAddressSheet from '@/components/sections/address/AddAddressSheet';
import EditAddressSheet, {
  EditAddressPayload,
} from '@/components/sections/address/EditAddressSheet';
import Image from 'next/image';
import {
  useAddressesQuery,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from '@/hooks/use-address';
import type { AddressItem } from '@/types/address';

export default function AddressSection() {
  const router = useRouter();
  const { data: listRes, isLoading } = useAddressesQuery(true);
  const { mutate: updateAddress } = useUpdateAddressMutation();
  const { mutate: deleteAddress } = useDeleteAddressMutation();
  const addresses = listRes?.data ?? [];

  const handleBack = () => {
    router.back();
  };

  // const buildAddressText = (p: AddressPayload | EditAddressPayload) => {
  //   const parts = [
  //     p.addressDetail?.trim(),
  //     p.district?.trim(),
  //     p.city?.trim(),
  //     p.province?.trim(),
  //     p.postalCode ? `Kode Pos ${p.postalCode}` : undefined,
  //   ].filter(Boolean) as string[];
  //   return parts.join(', ');
  // };

  const addressToText = (a: AddressItem) => {
    const parts = [
      a.address_line,
      a.subdistrict_name,
      a.postal_code ? `Kode Pos ${a.postal_code}` : undefined,
    ].filter(Boolean) as string[];
    return parts.join(', ');
  };

  const handleAddSubmit = () => {
    router.refresh?.();
  };

  const handleEditSubmit = (
    addressId: string,
    payload: EditAddressPayload & { isDefault?: boolean },
  ) => {
    const target = addresses.find((a) => String(a.id) === addressId);
    if (!target) return;
    const isDefault = payload.isDefault ? 'true' : String(!!target.is_default);
    const nextProvinceId = payload.provinceId ?? target.province_id;
    const nextCityId = payload.cityId ?? target.city_id;
    const nextDistrictId = payload.districtId ?? target.subdistrict_id;
    const nextSubdistrictName =
      (payload.districtName ?? target.subdistrict_name) || '';
    updateAddress({
      id: addressId,
      payload: {
        recipient_name: target.recipient_name,
        phone: payload.phone || target.phone,
        province_id: nextProvinceId,
        city_id: nextCityId,
        subdistrict_id: nextDistrictId,
        subdistrict_name: nextSubdistrictName,
        address_line: payload.addressDetail || target.address_line,
        postal_code: payload.postalCode || target.postal_code,
        is_default: isDefault,
      },
    });
  };

  const handleToggleFavorite = (addressId: string) => {
    const target = addresses.find((a) => String(a.id) === addressId);
    if (!target) return;
    updateAddress({
      id: addressId,
      payload: {
        recipient_name: target.recipient_name,
        phone: target.phone,
        province_id: target.province_id,
        city_id: target.city_id,
        subdistrict_id: target.subdistrict_id,
        subdistrict_name: target.subdistrict_name || '',
        address_line: target.address_line,
        postal_code: target.postal_code,
        is_default: 'true',
      },
    });
  };

  const handleDelete = (addressId: string) => {
    if (typeof window !== 'undefined') {
      if (!confirm('Hapus alamat ini?')) return;
    }
    deleteAddress({ id: addressId });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-white border-b border-gray-200 px-4 py-3'>
        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleBack}
            className='h-8 w-8'
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>

          <h1 className='text-lg font-semibold text-gray-900'>Pilih Alamat</h1>

          <AddAddressSheet
            onSubmit={handleAddSubmit}
            trigger={
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <Plus className='h-5 w-5' />
              </Button>
            }
          />
        </div>
      </div>

      <div className='p-4 space-y-3'>
        {isLoading && <p className='text-sm text-gray-500'>Memuat alamat…</p>}
        {!isLoading && addresses.length === 0 && (
          <p className='text-sm text-gray-500'>Belum ada alamat.</p>
        )}
        {addresses.map((address) => (
          <Card key={address.id} className='p-4 bg-white shadow-sm'>
            <div className='flex items-center gap-3'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => handleToggleFavorite(String(address.id))}
                className='h-8 w-8 flex-shrink-0'
              >
                <Image
                  src='/assets/alamat-utama-icon.png'
                  alt='Alamat Utama Icon'
                  width={60}
                  height={60}
                  className='w-20 h-auto'
                />
              </Button>

              <div className='flex-1 min-w-0'>
                <p className='text-sm text-gray-700 leading-relaxed'>
                  {addressToText(address)}
                </p>
              </div>

              <EditAddressSheet
                initial={{
                  provinceId: address.province_id,
                  cityId: address.city_id,
                  districtId: address.subdistrict_id,
                  district: address.subdistrict_name,
                  phone: address.phone,
                  addressDetail: address.address_line,
                  postalCode: address.postal_code,
                  isDefault: address.is_default === 1,
                }}
                onSubmit={(p) => handleEditSubmit(String(address.id), p)}
                trigger={
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 flex-shrink-0'
                  >
                    <Edit2 className='h-4 w-4 text-gray-400' />
                  </Button>
                }
              />
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 flex-shrink-0'
                onClick={() => handleDelete(String(address.id))}
                aria-label='Hapus alamat'
              >
                <Trash2 className='h-4 w-4 text-gray-400' />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
