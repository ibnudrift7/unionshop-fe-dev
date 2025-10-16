'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, Edit2 } from 'lucide-react';
import AddAddressSheet, {
  AddressPayload,
} from '@/components/sections/address/AddAddressSheet';
import EditAddressSheet, {
  EditAddressPayload,
} from '@/components/sections/address/EditAddressSheet';
import Image from 'next/image';

export interface Address {
  id: string;
  text: string;
  isFavorite?: boolean;
}

const initialAddresses: Address[] = [
  {
    id: '1',
    text: 'Banyuurip Wetan gg 5 no 20 dekat pasar malam stand asuke',
    isFavorite: true,
  },
  {
    id: '2',
    text: 'Banyuurip Wetan gg 5 no 20 dekat pasar malam stand asuke',
    isFavorite: true,
  },
];

export default function AddressSection() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);

  const handleBack = () => {
    router.back();
  };

  const buildAddressText = (p: AddressPayload | EditAddressPayload) => {
    const parts = [
      p.addressDetail?.trim(),
      p.district?.trim(),
      p.city?.trim(),
      p.province?.trim(),
      p.postalCode ? `Kode Pos ${p.postalCode}` : undefined,
    ].filter(Boolean) as string[];
    return parts.join(', ');
  };

  const handleAddSubmit = (payload: AddressPayload) => {
    const text = buildAddressText(payload);
    setAddresses((prev) => [
      {
        id: Date.now().toString(),
        text: text || payload.addressDetail || 'Alamat baru',
        isFavorite: false,
      },
      ...prev,
    ]);
  };

  const handleEditSubmit = (addressId: string, payload: EditAddressPayload) => {
    const text = buildAddressText(payload);
    setAddresses((prev) =>
      prev.map((a) =>
        a.id === addressId ? { ...a, text: text || a.text } : a,
      ),
    );
  };

  const handleToggleFavorite = (addressId: string) => {
    setAddresses((prev) =>
      prev.map((a) =>
        a.id === addressId ? { ...a, isFavorite: !a.isFavorite } : a,
      ),
    );
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
        {addresses.map((address) => (
          <Card key={address.id} className='p-4 bg-white shadow-sm'>
            <div className='flex items-center gap-3'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => handleToggleFavorite(address.id)}
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
                  {address.text}
                </p>
              </div>

              <EditAddressSheet
                initial={{ addressDetail: address.text }}
                onSubmit={(p) => handleEditSubmit(address.id, p)}
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
