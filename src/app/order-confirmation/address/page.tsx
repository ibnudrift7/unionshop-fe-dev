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
import MapPicker from '@/components/sections/address/MapPicker';

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
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [addressDetailError, setAddressDetailError] = useState<string | null>(
    null,
  );
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [provinceError, setProvinceError] = useState<string | null>(null);
  const [cityError, setCityError] = useState<string | null>(null);
  const [districtError, setDistrictError] = useState<string | null>(null);
  const [postalCodeError, setPostalCodeError] = useState<string | null>(null);
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let v = String(e.target.value || '')?.replace(/\D/g, '');
    if (v.length > 15) v = v.slice(0, 15);
    setPhone(v);
    if (!v) {
      setPhoneError('Nomor handphone wajib diisi');
    } else if (!/^(08|62)\d*$/.test(v)) {
      setPhoneError('Nomor harus diawali dengan 08 atau 62');
    } else if (v.length < 10) {
      setPhoneError('Nomor minimal 10 digit');
    } else {
      setPhoneError(null);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setName(v);
    if (!v.trim()) {
      setNameError('Nama penerima wajib diisi');
    } else if (v.trim().length < 3) {
      setNameError('Nama minimal 3 karakter');
    } else {
      setNameError(null);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setEmail(v);
    if (!v.trim()) {
      setEmailError('Email wajib diisi');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setEmailError('Format email tidak valid');
    } else {
      setEmailError(null);
    }
  };

  const handlePostalCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '');
    setPostalCode(v);
    if (!v) {
      setPostalCodeError('Kode pos wajib diisi');
    } else if (v.length < 5) {
      setPostalCodeError('Kode pos minimal 5 digit');
    } else {
      setPostalCodeError(null);
    }
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
    if (!id) {
      setProvinceError('Provinsi wajib dipilih');
    } else {
      setProvinceError(null);
    }
  };

  const onCityChange = (id: string) => {
    setCityId(id);
    setDistrictId('');
    setDistrictName('');
    if (!id) {
      setCityError('Kota/Kabupaten wajib dipilih');
    } else {
      setCityError(null);
    }
  };

  const onDistrictChange = (id: string) => {
    setDistrictId(id);
    const selected = districts.find((d) => String(d.id) === String(id));
    setDistrictName(selected?.name ?? '');
    if (!id) {
      setDistrictError('Kecamatan wajib dipilih');
    } else {
      setDistrictError(null);
    }
  };

  const handleSubmit = () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError('Nama penerima wajib diisi');
      hasError = true;
    } else if (name.trim().length < 3) {
      setNameError('Nama minimal 3 karakter');
      hasError = true;
    } else {
      setNameError(null);
    }

    if (!email.trim()) {
      setEmailError('Email wajib diisi');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Format email tidak valid');
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (!phone) {
      setPhoneError('Nomor handphone wajib diisi');
      hasError = true;
    } else {
      const digits = phone.replace(/\D/g, '');
      if (!/^(08|62)/.test(digits)) {
        setPhoneError('Nomor harus diawali dengan 08 atau 62');
        hasError = true;
      } else if (!/^\d+$/.test(digits)) {
        setPhoneError('Nomor hanya boleh berisi angka');
        hasError = true;
      } else if (digits.length > 15 || digits.length < 10) {
        setPhoneError('Nomor harus antara 10 hingga 15 digit');
        hasError = true;
      } else {
        setPhoneError(null);
      }
    }

    if (!provinceId) {
      setProvinceError('Provinsi wajib dipilih');
      hasError = true;
    } else {
      setProvinceError(null);
    }

    if (!cityId) {
      setCityError('Kota/Kabupaten wajib dipilih');
      hasError = true;
    } else {
      setCityError(null);
    }

    if (!districtId) {
      setDistrictError('Kecamatan wajib dipilih');
      hasError = true;
    } else {
      setDistrictError(null);
    }

    if (!postalCode.trim()) {
      setPostalCodeError('Kode pos wajib diisi');
      hasError = true;
    } else if (postalCode.length < 5) {
      setPostalCodeError('Kode pos minimal 5 digit');
      hasError = true;
    } else {
      setPostalCodeError(null);
    }

    if (!addressDetail.trim()) {
      setAddressDetailError('Detail alamat wajib diisi');
      hasError = true;
    } else if (addressDetail.trim().length < 10) {
      setAddressDetailError('Detail alamat minimal 10 karakter');
      hasError = true;
    } else {
      setAddressDetailError(null);
    }

    if (latitude === undefined || longitude === undefined) {
      toast.error('Silakan pilih lokasi di peta terlebih dahulu');
      hasError = true;
    }

    if (hasError) {
      toast.error('Harap lengkapi semua field yang wajib diisi');
      return;
    }

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
        latitude: String(latitude ?? ''),
        longitude: String(longitude ?? ''),
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
            latitude: String(latitude ?? ''),
            longitude: String(longitude ?? ''),
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
          <Label htmlFor='name'>
            Nama <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='name'
            type='text'
            placeholder='Nama penerima'
            value={name}
            onChange={handleNameChange}
            className={nameError ? 'border-red-500' : ''}
          />
          {nameError ? (
            <p className='text-xs text-red-600'>{nameError}</p>
          ) : null}
        </div>

        <div className='space-y-1'>
          <Label htmlFor='email'>
            Email <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='email'
            type='email'
            placeholder='email@example.com'
            value={email}
            onChange={handleEmailChange}
            className={emailError ? 'border-red-500' : ''}
          />
          {emailError ? (
            <p className='text-xs text-red-600'>{emailError}</p>
          ) : null}
        </div>

        <div className='space-y-1'>
          <Label htmlFor='phone'>
            Nomor Handphone <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='phone'
            type='tel'
            inputMode='tel'
            placeholder='0812xxxxxxx'
            value={phone}
            onChange={handlePhoneChange}
            maxLength={15}
            className={phoneError ? 'border-red-500' : ''}
          />
          {phoneError ? (
            <p className='text-xs text-red-600'>{phoneError}</p>
          ) : null}
        </div>

        <div className='space-y-1'>
          <Label htmlFor='addr-province'>
            Provinsi <span className='text-red-500'>*</span>
          </Label>
          <select
            id='addr-province'
            className={`w-full border rounded-md px-3 py-2 text-sm bg-white ${
              provinceError ? 'border-red-500' : 'border-gray-300'
            }`}
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
          {provinceError ? (
            <p className='text-xs text-red-600'>{provinceError}</p>
          ) : null}
        </div>
        <div className='space-y-1'>
          <Label htmlFor='addr-city'>
            Kota/Kabupaten <span className='text-red-500'>*</span>
          </Label>
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
              className={`w-full border rounded-md px-3 py-2 text-sm bg-white ${
                cityError ? 'border-red-500' : 'border-gray-300'
              }`}
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
          {cityError ? (
            <p className='text-xs text-red-600'>{cityError}</p>
          ) : null}
        </div>
        <div className='space-y-1'>
          <Label htmlFor='addr-district'>
            Kecamatan <span className='text-red-500'>*</span>
          </Label>
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
              className={`w-full border rounded-md px-3 py-2 text-sm bg-white ${
                districtError ? 'border-red-500' : 'border-gray-300'
              }`}
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
          {districtError ? (
            <p className='text-xs text-red-600'>{districtError}</p>
          ) : null}
        </div>
        <div className='space-y-1'>
          <Label htmlFor='addr-postal'>
            Kode pos <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='addr-postal'
            type='text'
            inputMode='numeric'
            placeholder='Kode pos'
            value={postalCode}
            onChange={handlePostalCodeChange}
            className={postalCodeError ? 'border-red-500' : ''}
          />
          {postalCodeError ? (
            <p className='text-xs text-red-600'>{postalCodeError}</p>
          ) : null}
        </div>

        <MapPicker
          initialLat={latitude}
          initialLng={longitude}
          addressText={addressDetail}
          onLocationChange={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
        />

        <div className='space-y-1'>
          <Label htmlFor='addr-detail'>
            Detail alamat <span className='text-red-500'>*</span>
          </Label>
          <textarea
            id='addr-detail'
            rows={3}
            className={`w-full border rounded-md px-3 py-2 text-sm ${
              addressDetailError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='Nama jalan, no rumah, RT/RW, patokan, dsb.'
            value={addressDetail}
            onChange={(e) => {
              const v = (e.target as HTMLTextAreaElement).value;
              setAddressDetail(v);
              if (!v.trim()) {
                setAddressDetailError('Detail alamat wajib diisi');
              } else if (v.trim().length < 10) {
                setAddressDetailError('Detail alamat minimal 10 karakter');
              } else {
                setAddressDetailError(null);
              }
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
