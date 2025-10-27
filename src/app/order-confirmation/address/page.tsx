'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { setGuestAddress } from '@/hooks/use-guest-address';
import {
  useProvincesQuery,
  useCitiesQuery,
  useDistrictsQuery,
} from '@/hooks/use-location';

export default function GuestAddressPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [cityId, setCityId] = useState('');
  const [cityName, setCityName] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [addressDetailError, setAddressDetailError] = useState<string | null>(
    null,
  );
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let v = String(e.target.value || '')?.replace(/\D/g, '');
    if (v.length > 15) v = v.slice(0, 15);
    setPhone(v);
    if (!v || /^(08|62)\d*$/.test(v)) setPhoneError(null);
    else setPhoneError('Nomor harus diawali dengan 08 atau 62');
  };

  const provincesQuery = useProvincesQuery(true);
  const citiesQuery = useCitiesQuery(provinceId || undefined);
  const districtsQuery = useDistrictsQuery(cityId || undefined);
  const provinces = provincesQuery.data?.data ?? [];
  const cities = citiesQuery.data?.data ?? [];
  const districts = districtsQuery.data?.data ?? [];

  const onProvinceChange = (id: string) => {
    setProvinceId(id);
    const selected = provinces.find((p) => String(p.id) === String(id));
    setProvinceName(selected?.name ?? '');
    setCityId('');
    setCityName('');
    setDistrictId('');
    setDistrictName('');
  };

  const onCityChange = (id: string) => {
    setCityId(id);
    const selected = cities.find((c) => String(c.id) === String(id));
    setCityName(selected?.name ?? '');
    setDistrictId('');
    setDistrictName('');
  };

  const onDistrictChange = (id: string) => {
    setDistrictId(id);
    const selected = districts.find((d) => String(d.id) === String(id));
    setDistrictName(selected?.name ?? '');
  };

  const handleSubmit = () => {
    if (addressDetail.trim().length < 10) {
      setAddressDetailError('Detail alamat minimal 10 karakter');
      return;
    }
    if (phone) {
      const digits = phone.replace(/\D/g, '');
      if (!/^(08|62)/.test(digits)) {
        setPhoneError('Nomor harus diawali dengan 08 atau 62');
        return;
      }
      if (!/^\d+$/.test(digits)) {
        setPhoneError('Nomor hanya boleh berisi angka');
        return;
      }
      if (digits.length > 15 || digits.length < 10) {
        setPhoneError('Nomor harus antara 10 hingga 15 digit');
        return;
      }
    }
    setPhoneError(null);
    setGuestAddress({
      name,
      email,
      phone,
      province: provinceName,
      city: cityName,
      district: districtName,
      provinceId,
      provinceName,
      cityId,
      cityName,
      districtId,
      districtName,
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
            onChange={handlePhoneChange}
            maxLength={15}
          />
          {phoneError ? (
            <p className='text-xs text-red-600'>{phoneError}</p>
          ) : null}
        </div>

        <div className='space-y-1'>
          <Label htmlFor='addr-province'>Provinsi</Label>
          <select
            id='addr-province'
            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
            value={provinceId}
            onChange={(e) => onProvinceChange(e.target.value)}
            disabled={provincesQuery.isLoading}
          >
            <option value=''>
              {provincesQuery.isLoading ? 'Memuat...' : 'Pilih provinsi'}
            </option>
            {provinces.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className='space-y-1'>
          <Label htmlFor='addr-city'>Kota/Kabupaten</Label>
          <select
            id='addr-city'
            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
            value={cityId}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={!provinceId || citiesQuery.isLoading}
          >
            <option value=''>
              {!provinceId
                ? 'Pilih provinsi dulu'
                : citiesQuery.isLoading
                ? 'Memuat...'
                : 'Pilih kota/kabupaten'}
            </option>
            {cities.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className='space-y-1'>
          <Label htmlFor='addr-district'>Kecamatan</Label>
          <select
            id='addr-district'
            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
            value={districtId}
            onChange={(e) => onDistrictChange(e.target.value)}
            disabled={!provinceId || !cityId || districtsQuery.isLoading}
          >
            <option value=''>
              {!provinceId
                ? 'Pilih provinsi dulu'
                : !cityId
                ? 'Pilih kota/kabupaten dulu'
                : districtsQuery.isLoading
                ? 'Memuat...'
                : 'Pilih kecamatan'}
            </option>
            {districts.map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.name}
              </option>
            ))}
          </select>
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
            onChange={(e) => {
              const v = (e.target as HTMLTextAreaElement).value;
              setAddressDetail(v);
              if (v.trim().length >= 10) setAddressDetailError(null);
              else setAddressDetailError('Detail alamat minimal 10 karakter');
            }}
          />
          {addressDetailError ? (
            <p className='text-xs text-red-600'>{addressDetailError}</p>
          ) : null}
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
