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
import { toast } from 'sonner'; // optional jika kamu pakai toast

export interface EditAddressPayload {
  province: string;
  city: string;
  district: string; // kecamatan
  postalCode: string; // kode pos
  addressDetail: string;
}

export interface EditAddressSheetProps {
  trigger: React.ReactNode;
  initial?: Partial<EditAddressPayload>;
  onSubmit?: (payload: EditAddressPayload) => void;
}

export default function EditAddressSheet({
  trigger,
  initial,
  onSubmit,
}: EditAddressSheetProps) {
  const [open, setOpen] = useState(false);
  const [province, setProvince] = useState(initial?.province ?? '');
  const [city, setCity] = useState(initial?.city ?? '');
  const [district, setDistrict] = useState(initial?.district ?? '');
  const [postalCode, setPostalCode] = useState(initial?.postalCode ?? '');
  const [addressDetail, setAddressDetail] = useState(
    initial?.addressDetail ?? '',
  );

  const handleSubmit = () => {
    if (!province || !city || !district || !postalCode || !addressDetail) {
      toast?.error?.('Semua kolom harus diisi!');
      return;
    }

    onSubmit?.({ province, city, district, postalCode, addressDetail });
    toast?.success?.('Alamat berhasil diperbarui');
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side='bottom'
        className='rounded-t-2xl max-h-[85vh] overflow-auto w-full max-w-[720px] left-1/2 -translate-x-1/2 right-auto border-x border-gray-200'
      >
        <SheetHeader>
          <SheetTitle className='text-center text-lg'>Edit alamat</SheetTitle>
        </SheetHeader>
        <div className='px-4 pb-4 space-y-3'>
          <div className='space-y-1'>
            <Label htmlFor='edit-province'>Provinsi</Label>
            <Input
              id='edit-province'
              type='text'
              placeholder='Provinsi'
              required
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='edit-city'>Kota/Kabupaten</Label>
            <Input
              id='edit-city'
              type='text'
              placeholder='Kota atau Kabupaten'
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='edit-district'>Kecamatan</Label>
            <Input
              id='edit-district'
              type='text'
              placeholder='Kecamatan'
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='edit-postal'>Kode pos</Label>
            <Input
              id='edit-postal'
              type='text'
              inputMode='numeric'
              placeholder='Kode pos'
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='edit-detail'>Detail alamat</Label>
            <textarea
              id='edit-detail'
              rows={3}
              required
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm'
              placeholder='Nama jalan, no rumah, RT/RW, patokan, dsb.'
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
            />
          </div>

          <div className='pt-2'>
            <Button
              type='button'
              className='w-full bg-brand hover:bg-brand/90 text-white'
              onClick={handleSubmit}
            >
              simpan data pengiriman
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
