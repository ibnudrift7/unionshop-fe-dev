'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getGuestAddress, setGuestAddress } from '@/hooks/use-guest-address';
import { useRegisterGuestMutation } from '@/hooks/use-auth';
import { useCartStore } from '@/store/cart';
import {
  useProvincesQuery,
  useCitiesQuery,
  useDistrictsQuery,
} from '@/hooks/use-location';

export default function GuestAddressPage() {
  const router = useRouter();
  const { items: guestItems } = useCartStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [cityId, setCityId] = useState('');
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
  const [cityQuery, setCityQuery] = useState('');
  const [cityOpen, setCityOpen] = useState(false);
  const [districtQuery, setDistrictQuery] = useState('');
  const [districtOpen, setDistrictOpen] = useState(false);
  const { mutate: registerGuest, isPending } = useRegisterGuestMutation();

  const onProvinceChange = (id: string) => {
    setProvinceId(id);
    setCityId('');
    setDistrictId('');
    setDistrictName('');
  };

  const onCityChange = (id: string) => {
    setCityId(id);
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

    const cartItems = guestItems.map((i) => {
      const pid = Number(i.product.id);
      const qty = i.quantity;
      const productMaybe = i.product as unknown as {
        selectedAttributes?: Array<{ name: string; value: string }>;
      };
      const attrs: Array<{ name: string; value: string }> = Array.isArray(
        productMaybe?.selectedAttributes,
      )
        ? productMaybe.selectedAttributes!
        : [];
      return {
        product_id: Number.isFinite(pid)
          ? pid
          : parseInt(String(i.product.id), 10) || 0,
        qty,
        attributes: attrs,
      };
    });

    if (cartItems.length === 0) {
      toast.error('Keranjang masih kosong');
      return;
    }

    const payload = {
      email,
      full_name: name,
      phone,
      shipping_address: {
        province_id: parseInt(provinceId || '0', 10),
        city_id: parseInt(cityId || '0', 10),
        subdistrict_id: parseInt(districtId || '0', 10),
        subdistrict_name: districtName,
        address_line: addressDetail,
        postal_code: postalCode,
      },
      cart_items: cartItems,
    };

    registerGuest(payload, {
      onSuccess: (res) => {
        try {
          if (res.data?.token) {
            localStorage.setItem('guest_token', res.data.token);
          }

          localStorage.setItem('guest_user', JSON.stringify(res.data.user));
          localStorage.setItem(
            'guest_cart_info',
            JSON.stringify({
              cart_id: res.data.cart_id,
              address_id: res.data.address_id,
            }),
          );

          const provinceName =
            provinces.find((p) => String(p.id) === String(provinceId))?.name ??
            '';
          const cityName =
            cities.find((c) => String(c.id) === String(cityId))?.name ?? '';
          const guestAddr = {
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
          };
          setGuestAddress(guestAddr);
        } catch {}

        toast.success(
          res.message || 'Akun tamu berhasil dibuat. Lanjutkan ke konfirmasi.',
        );
        router.push('/order-confirmation');
      },
      onError: (err) => {
        const raw = err?.data as unknown;
        const obj =
          (raw && typeof raw === 'object'
            ? (raw as Record<string, unknown>)
            : {}) || {};
        const msg =
          (typeof obj.message === 'string' && obj.message) ||
          'Gagal mendaftarkan tamu';
        const errors = obj.errors as Record<string, unknown> | undefined;
        if (errors) {
          if (typeof errors.email === 'string')
            toast.error(String(errors.email));
          if (typeof errors.full_name === 'string')
            toast.error(String(errors.full_name));
          if (typeof errors.phone === 'string')
            toast.error(String(errors.phone));
          if (typeof errors.shipping_address === 'string')
            toast.error(String(errors.shipping_address));
          if (typeof errors.cart_items === 'string')
            toast.error(String(errors.cart_items));
        }
        toast.error(msg);
      },
    });
  };

  useEffect(() => {
    const existing = getGuestAddress();
    if (existing) {
      setName(existing.name || '');
      setEmail(existing.email || '');
      setPhone(existing.phone || '');
      setProvinceId(existing.provinceId || '');
      setCityId(existing.cityId || '');
      setDistrictId(existing.districtId || '');
      setDistrictName(existing.districtName || existing.district || '');
      setPostalCode(existing.postalCode || '');
      setAddressDetail(existing.addressDetail || '');
    }
  }, []);

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
          <div className='relative'>
            <input
              id='addr-city'
              role='combobox'
              aria-expanded={cityOpen}
              aria-controls='guest-city-listbox'
              placeholder={
                !provinceId
                  ? 'Pilih provinsi dulu'
                  : citiesQuery.isLoading
                  ? 'Memuat...'
                  : 'Cari atau pilih kota'
              }
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
              value={
                cityId
                  ? cities.find((c) => String(c.id) === String(cityId))?.name ??
                    ''
                  : cityQuery
              }
              onChange={(e) => {
                setCityQuery(e.target.value);
                setCityOpen(true);
              }}
              onFocus={() => setCityOpen(true)}
              disabled={!provinceId || citiesQuery.isLoading}
            />
            {cityOpen && provinceId && (
              <ul
                id='guest-city-listbox'
                role='listbox'
                className='absolute z-20 left-0 right-0 mt-1 max-h-56 overflow-auto bg-white border border-gray-200 rounded-md shadow-sm'
              >
                {(citiesQuery.isLoading ? [] : cities)
                  .filter((c) =>
                    cityQuery
                      ? c.name.toLowerCase().includes(cityQuery.toLowerCase())
                      : true,
                  )
                  .map((c) => (
                    <li
                      key={c.id}
                      role='option'
                      aria-selected={String(cityId) === String(c.id)}
                      className='px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm'
                      onMouseDown={(ev) => ev.preventDefault()}
                      onClick={() => {
                        onCityChange(String(c.id));
                        setCityQuery('');
                        setCityOpen(false);
                        // reset district related
                        setDistrictQuery('');
                        setDistrictOpen(false);
                      }}
                    >
                      {c.name}
                    </li>
                  ))}
                {!citiesQuery.isLoading && cities.length === 0 && (
                  <li className='px-3 py-2 text-sm text-gray-500'>
                    Tidak ada kota.
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
        <div className='space-y-1'>
          <Label htmlFor='addr-district'>Kecamatan</Label>
          <div className='relative'>
            <input
              id='addr-district'
              role='combobox'
              aria-expanded={districtOpen}
              aria-controls='guest-district-listbox'
              placeholder={
                !cityId
                  ? 'Pilih kota/kabupaten dulu'
                  : districtsQuery.isLoading
                  ? 'Memuat...'
                  : 'Cari atau pilih kecamatan'
              }
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
              value={
                districtId
                  ? districts.find((d) => String(d.id) === String(districtId))
                      ?.name ?? ''
                  : districtQuery
              }
              onChange={(e) => {
                setDistrictQuery(e.target.value);
                setDistrictOpen(true);
              }}
              onFocus={() => setDistrictOpen(true)}
              disabled={!provinceId || !cityId || districtsQuery.isLoading}
            />
            {districtOpen && cityId && (
              <ul
                id='guest-district-listbox'
                role='listbox'
                className='absolute z-20 left-0 right-0 mt-1 max-h-56 overflow-auto bg-white border border-gray-200 rounded-md shadow-sm'
              >
                {(districtsQuery.isLoading ? [] : districts)
                  .filter((d) =>
                    districtQuery
                      ? d.name
                          .toLowerCase()
                          .includes(districtQuery.toLowerCase())
                      : true,
                  )
                  .map((d) => (
                    <li
                      key={d.id}
                      role='option'
                      aria-selected={String(districtId) === String(d.id)}
                      className='px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm'
                      onMouseDown={(ev) => ev.preventDefault()}
                      onClick={() => {
                        onDistrictChange(String(d.id));
                        setDistrictQuery('');
                        setDistrictOpen(false);
                      }}
                    >
                      {d.name}
                    </li>
                  ))}
                {!districtsQuery.isLoading && districts.length === 0 && (
                  <li className='px-3 py-2 text-sm text-gray-500'>
                    Tidak ada kecamatan.
                  </li>
                )}
              </ul>
            )}
          </div>
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
            disabled={isPending}
          >
            {isPending ? 'Menyimpan…' : 'Simpan Data Pengiriman'}
          </Button>
        </div>
      </div>
    </div>
  );
}
