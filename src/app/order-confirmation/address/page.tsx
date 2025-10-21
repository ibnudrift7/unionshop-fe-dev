'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { setGuestAddress } from '@/hooks/use-guest-address';

export default function GuestAddressPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  const handleSubmit = () => {
    setGuestAddress({
      name,
      email,
      phone,
      province,
      city,
      district,
      postalCode,
      addressDetail,
    });
    toast.success('Alamat pengiriman disimpan');
    router.push('/order-confirmation');
  };

  return (
    <div className='min-h-screen bg-white mx-auto max-w-[550px] border-x border-gray-200'>
      <div className='mb-4 p-4 pt-10 border-b border-gray-100 relative'>
        <h1 className='text-lg font-semibold text-gray-900 text-center'>
          Data Pengiriman
        </h1>
        <div className='absolute right-4 top-6'>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8'
            onClick={() => router.back()}
            aria-label='Close'
          >
            <X className='h-5 w-5' />
          </Button>
        </div>
      </div>

      <div className='px-4 pb-8 space-y-3'>
        <div className='space-y-1'>
          <Label htmlFor='name'>Nama</Label>
          <Input
            id='name'
            type='text'
            placeholder='Nama penerima'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='email@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='phone'>Nomor Handphone</Label>
          <Input
            id='phone'
            type='tel'
            inputMode='tel'
            placeholder='0812xxxxxxx'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

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
            Simpan Data Pengiriman
          </Button>
        </div>
      </div>
    </div>
  );
}
