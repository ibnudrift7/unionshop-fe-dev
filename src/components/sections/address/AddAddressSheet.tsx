'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export interface AddressPayload {
  province: string;
  city: string;
  district: string; // kecamatan
  postalCode: string; // kode pos
  addressDetail: string;
}

export interface AddAddressSheetProps {
  trigger: React.ReactNode;
  onSubmit?: (payload: AddressPayload) => void;
}

export default function AddAddressSheet({
  trigger,
  onSubmit,
}: AddAddressSheetProps) {
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  const handleSubmit = () => {
    onSubmit?.({ province, city, district, postalCode, addressDetail });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side='bottom'
        className='rounded-t-2xl max-h-[85vh] overflow-auto w-full max-w-[720px] left-1/2 -translate-x-1/2 right-auto border-x border-gray-200'
      >
        <SheetHeader>
          <SheetTitle className='text-center text-lg'>Tambah alamat</SheetTitle>
        </SheetHeader>
        <div className='px-4 pb-4 space-y-3'>
          <div className='space-y-1'>
            <Label htmlFor='addr-province'>Provinsi</Label>
            <Input
              id='addr-province'
              type='text'
              placeholder='Provinsi'
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='addr-city'>Kota/Kabupaten</Label>
            <Input
              id='addr-city'
              type='text'
              placeholder='Kota atau Kabupaten'
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='addr-district'>Kecamatan</Label>
            <Input
              id='addr-district'
              type='text'
              placeholder='Kecamatan'
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='addr-postal'>Kode pos</Label>
            <Input
              id='addr-postal'
              type='text'
              inputMode='numeric'
              placeholder='Kode pos'
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='addr-detail'>Detail alamat</Label>
            <textarea
              id='addr-detail'
              rows={3}
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm'
              placeholder='Nama jalan, no rumah, RT/RW, patokan, dsb.'
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
            />
          </div>

          <div className='pt-2'>
            <Button
              className='w-full bg-brand hover:bg-brand/90 text-white'
              onClick={handleSubmit}
            >
              tambah data pengiriman
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
