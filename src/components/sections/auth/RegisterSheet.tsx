'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useRegisterMutation } from '@/hooks/use-auth';
import { setAuthToken } from '@/lib/auth-token';
// import {
//   useProvincesQuery,
//   useCitiesQuery,
//   useDistrictsQuery,
// } from '@/hooks/use-location';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export interface RegisterSheetProps {
  trigger: React.ReactNode;
  onSubmit?: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    gender?: 'wanita' | 'pria' | '';
    dateOfBirth?: string;
    province?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    addressDetail?: string;
  }) => void;
  onSwitchToLogin?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  fieldErrors?: Partial<
    Record<
      | 'name'
      | 'email'
      | 'password'
      | 'phone'
      | 'gender'
      | 'dateOfBirth'
      | 'province'
      | 'city'
      | 'district'
      | 'postalCode'
      | 'addressDetail',
      string
    >
  >;
}

export function RegisterSheet({
  trigger,
  onSubmit,
  onSwitchToLogin,
  isSubmitting = false,
  // errorMessage = null,
  fieldErrors = {},
}: RegisterSheetProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let v = String(e.target.value || '')?.replace(/\D/g, '');
    if (v.length > 15) v = v.slice(0, 15);
    setPhone(v);
    if (!v || /^(08|62)\d*$/.test(v)) setPhoneError(null);
    else setPhoneError('Nomor harus diawali dengan 08 atau 62');
  };
  const [gender, setGender] = useState<'' | 'wanita' | 'pria'>('');
  const [dateOfBirth, setDateOfBirth] = useState(''); // ISO yyyy-mm-dd
  const [dobDraft, setDobDraft] = useState('');
  const [dobError, setDobError] = useState<string | null>(null);
  // const [province, setProvince] = useState('');
  // const [city, setCity] = useState('');
  // const [district, setDistrict] = useState('');
  // const [cityQuery, setCityQuery] = useState('');
  // const [cityOpen, setCityOpen] = useState(false);
  // const [districtQuery, setDistrictQuery] = useState('');
  // const [districtOpen, setDistrictOpen] = useState(false);
  // const [postalCode, setPostalCode] = useState('');
  // const [addressDetail, setAddressDetail] = useState('');

  // const provincesQuery = useProvincesQuery(true);
  // const citiesQuery = useCitiesQuery(province || undefined);
  // const districtsQuery = useDistrictsQuery(city || undefined);

  // const provinces = provincesQuery.data?.data ?? [];
  // const cities = citiesQuery.data?.data ?? [];
  // const districts = districtsQuery.data?.data ?? [];

  // const handleProvinceChange = (id: string) => {
  //   setProvince(id);
  //   setCity('');
  //   setDistrict('');
  // };

  // const handleCityChange = (id: string) => {
  //   setCity(id);
  //   setDistrict('');
  // };

  const handleSubmit = () => {
    if (!/[a-z]/.test(password)) {
      setPasswordError('Password harus mengandung minimal 1 huruf kecil');
      return;
    }
    if (password.length < 8) {
      setPasswordError('Password minimal 8 karakter');
      return;
    }
    if (confirmPassword !== password) {
      setPasswordError('Konfirmasi kata sandi tidak cocok');
      return;
    }
    setPasswordError(null);

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
      if (digits.length < 10 || digits.length > 15) {
        setPhoneError('Nomor harus antara 10 hingga 15 digit');
        return;
      }
    }
    setPhoneError(null);

    if (dateOfBirth) {
      try {
        const birth = new Date(dateOfBirth);
        if (isNaN(birth.getTime())) {
          setDobError('Tanggal lahir tidak valid');
          return;
        }
        const now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
          age--;
        }
        if (age < 13) {
          setDobError('Anda harus berusia minimal 13 tahun');
          return;
        }
      } catch {
        setDobError('Tanggal lahir tidak valid');
        return;
      }
    }
    setDobError(null);

    const payload = {
      name,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      // province,
      // city,
      // district,
      // postalCode,
      // addressDetail,
    };

    if (typeof onSubmit === 'function') {
      onSubmit(payload);
      return;
    }

    registerMutation.mutate(payload, {
      onSuccess: (response) => {
        try {
          const token =
            (response?.data?.token as string | undefined) ||
            ((response?.data?.tokens as { accessToken?: string } | undefined)
              ?.accessToken as string | undefined) ||
            undefined;
          if (token) setAuthToken(token);
        } catch {}
        toast.success('Registrasi berhasil. Cek email Anda untuk verifikasi.');
        try {
          router.push('/user');
        } catch {}
      },
      onError: (error: unknown) => {
        try {
          let msg = 'Registrasi gagal';
          if (typeof error === 'object' && error !== null) {
            const e = error as Record<string, unknown>;
            const data = e.data;
            if (typeof data === 'object' && data !== null) {
              const d = data as Record<string, unknown>;
              if (typeof d.message === 'string') msg = d.message;
            }
            if (msg === 'Registrasi gagal' && typeof e.message === 'string')
              msg = e.message;
          }
          if (msg.includes('Email already registered')) {
            toast.error('Email sudah terdaftar. Silakan masuk.');
          } else {
            toast.error(msg);
          }
        } catch {
          toast.error('Registrasi gagal');
        }
      },
    });
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setPhone('');
    setPhoneError(null);
    setGender('');
    setDateOfBirth('');
    setDobDraft('');
    setDobError(null);
    setPasswordError(null);
  };

  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const submitting = isSubmitting || registerMutation.status === 'pending';

  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
      }}
    >
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side='bottom'
        className='rounded-t-2xl max-h-[85vh] overflow-auto w-full max-w-[720px] left-1/2 -translate-x-1/2 right-auto border-x border-gray-200'
      >
        <div className='relative'>
          {submitting && (
            <div className='absolute inset-0 z-50 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3 pointer-events-auto'>
              <Spinner className='size-8 text-brand' />
              <p className='text-sm text-gray-700'>Memproses pendaftaran…</p>
            </div>
          )}
          <SheetHeader>
            <SheetTitle className='text-center text-lg'>Daftar</SheetTitle>
          </SheetHeader>
          <div className='px-4 pb-4 space-y-3'>
            <div className='space-y-1'>
              <Label htmlFor='register-name'>Nama</Label>
              <Input
                id='register-name'
                type='text'
                placeholder='Nama lengkap'
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
              {fieldErrors.name ? (
                <p className='text-xs text-red-600'>{fieldErrors.name}</p>
              ) : null}
            </div>
            <div className='space-y-1'>
              <Label htmlFor='register-email'>Email</Label>
              <Input
                id='register-email'
                type='email'
                placeholder='nama@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              {fieldErrors.email ? (
                <p className='text-xs text-red-600'>{fieldErrors.email}</p>
              ) : null}
            </div>
            <div className='space-y-1'>
              <Label htmlFor='register-password'>Kata sandi</Label>
              <Input
                id='register-password'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
              {passwordError ? (
                <p className='text-xs text-red-600'>{passwordError}</p>
              ) : null}
              {fieldErrors.password ? (
                <p className='text-xs text-red-600'>{fieldErrors.password}</p>
              ) : null}
            </div>
            <div className='space-y-1'>
              <Label htmlFor='register-password-confirm'>
                Konfirmasi kata sandi
              </Label>
              <Input
                id='register-password-confirm'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className='flex items-center gap-2 pt-1'>
              <input
                id='register-show-password'
                type='checkbox'
                className='h-4 w-4 rounded border-gray-300'
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                disabled={isSubmitting}
              />
              <Label htmlFor='register-show-password' className='text-sm'>
                Perlihatkan password
              </Label>
            </div>
            <p className='text-xs text-gray-500'>
              *Kata sandi anda harus terdiri dari setidaknya 8 karakter
            </p>

            <div className='space-y-1 pt-2'>
              <Label htmlFor='register-phone'>Nomor handphone</Label>
              <Input
                id='register-phone'
                type='tel'
                inputMode='tel'
                placeholder='08xxxxxxxxxx'
                value={phone}
                onChange={handlePhoneChange}
                maxLength={15}
                disabled={isSubmitting}
              />
              {phoneError ? (
                <p className='text-xs text-red-600'>{phoneError}</p>
              ) : fieldErrors.phone ? (
                <p className='text-xs text-red-600'>{fieldErrors.phone}</p>
              ) : null}
            </div>

            <div className='space-y-2 pt-1'>
              <Label>Jenis kelamin</Label>
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  className={
                    'flex-1 border ' +
                    (gender === 'wanita'
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white text-black border-gray-300')
                  }
                  onClick={() => setGender('wanita')}
                  disabled={isSubmitting}
                >
                  Wanita
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className={
                    'flex-1 border ' +
                    (gender === 'pria'
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white text-black border-gray-300')
                  }
                  onClick={() => setGender('pria')}
                  disabled={isSubmitting}
                >
                  Pria
                </Button>
              </div>
              {fieldErrors.gender ? (
                <p className='text-xs text-red-600'>{fieldErrors.gender}</p>
              ) : null}
            </div>

            <div className='space-y-2 pt-1'>
              <Label>Tanggal lahir</Label>
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    type='button'
                    className='w-full text-left border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
                    disabled={isSubmitting}
                  >
                    {dateOfBirth ? (
                      <span>
                        {new Date(dateOfBirth).toLocaleDateString('id-ID')}
                      </span>
                    ) : (
                      <span className='text-gray-500'>Pilih tanggal lahir</span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent
                  side='bottom'
                  className='rounded-t-2xl max-h-[85vh] overflow-auto w-full max-w-[720px] left-1/2 -translate-x-1/2 right-auto border-x border-gray-200'
                >
                  <SheetHeader>
                    <SheetTitle className='text-center text-lg'>
                      Pilih tanggal lahir
                    </SheetTitle>
                  </SheetHeader>
                  <div className='px-4 pb-4 space-y-3'>
                    <div className='space-y-1'>
                      <Label htmlFor='dob-input'>Tanggal</Label>
                      <Input
                        id='dob-input'
                        type='date'
                        value={dobDraft || dateOfBirth}
                        onChange={(e) => {
                          setDobDraft(e.target.value);
                          setDobError(null);
                        }}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className='pt-2 flex gap-2'>
                      <SheetClose asChild>
                        <Button
                          type='button'
                          variant='outline'
                          className='flex-1'
                          disabled={isSubmitting}
                        >
                          Batal
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          type='button'
                          className='flex-1 bg-brand hover:bg-brand/90 text-white'
                          onClick={() => {
                            setDateOfBirth(dobDraft || dateOfBirth);
                            setDobDraft('');
                            setDobError(null);
                          }}
                          disabled={isSubmitting}
                        >
                          Simpan tanggal
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              {dobError ? (
                <p className='text-xs text-red-600'>{dobError}</p>
              ) : fieldErrors.dateOfBirth ? (
                <p className='text-xs text-red-600'>
                  {fieldErrors.dateOfBirth}
                </p>
              ) : null}
            </div>

            {/* <div className='space-y-1 pt-1'>
            <Label htmlFor='register-province'>Provinsi</Label>
            <select
              id='register-province'
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
              value={province}
              onChange={(e) => handleProvinceChange(e.target.value)}
              disabled={isSubmitting || provincesQuery.isLoading}
            >
              <option value='' disabled>
                {provincesQuery.isLoading ? 'Memuat...' : 'Pilih provinsi'}
              </option>
              {provinces.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.name}
                </option>
              ))}
            </select>
            {fieldErrors.province ? (
              <p className='text-xs text-red-600'>{fieldErrors.province}</p>
            ) : null}
          </div>
          <div className='space-y-1'>
            <Label htmlFor='register-city'>Kota/Kabupaten</Label>
            <div className='relative'>
              <input
                id='register-city'
                role='combobox'
                aria-expanded={cityOpen}
                aria-controls='register-city-listbox'
                placeholder={
                  !province
                    ? 'Pilih provinsi dulu'
                    : citiesQuery.isLoading
                    ? 'Memuat...'
                    : 'Cari atau pilih kota'
                }
                className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
                value={
                  city
                    ? cities.find((c) => String(c.id) === String(city))?.name ??
                      ''
                    : cityQuery
                }
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setCityOpen(true);
                }}
                onFocus={() => setCityOpen(true)}
                disabled={isSubmitting || !province || citiesQuery.isLoading}
              />
              {cityOpen && province && (
                <ul
                  id='register-city-listbox'
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
                        aria-selected={String(city) === String(c.id)}
                        className='px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm'
                        onMouseDown={(ev) => ev.preventDefault()}
                        onClick={() => {
                          handleCityChange(String(c.id));
                          setCityQuery('');
                          setCityOpen(false);
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
            {fieldErrors.city ? (
              <p className='text-xs text-red-600'>{fieldErrors.city}</p>
            ) : null}
          </div>
          <div className='space-y-1'>
            <Label htmlFor='register-district'>Kecamatan</Label>
            <div className='relative'>
              <input
                id='register-district'
                role='combobox'
                aria-expanded={districtOpen}
                aria-controls='register-district-listbox'
                placeholder={
                  !city
                    ? 'Pilih kota/kabupaten dulu'
                    : districtsQuery.isLoading
                    ? 'Memuat...'
                    : 'Cari atau pilih kecamatan'
                }
                className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
                value={
                  district
                    ? districts.find((d) => String(d.id) === String(district))
                        ?.name ?? ''
                    : districtQuery
                }
                onChange={(e) => {
                  setDistrictQuery(e.target.value);
                  setDistrictOpen(true);
                }}
                onFocus={() => setDistrictOpen(true)}
                disabled={
                  isSubmitting || !province || !city || districtsQuery.isLoading
                }
              />
              {districtOpen && city && (
                <ul
                  id='register-district-listbox'
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
                        aria-selected={String(district) === String(d.id)}
                        className='px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm'
                        onMouseDown={(ev) => ev.preventDefault()}
                        onClick={() => {
                          setDistrict(String(d.id));
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
            {fieldErrors.district ? (
              <p className='text-xs text-red-600'>{fieldErrors.district}</p>
            ) : null}
          </div>
          <div className='space-y-1'>
            <Label htmlFor='register-postal'>Kode pos</Label>
            <Input
              id='register-postal'
              type='text'
              inputMode='numeric'
              placeholder='Kode pos'
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              disabled={isSubmitting}
            />
            {fieldErrors.postalCode ? (
              <p className='text-xs text-red-600'>{fieldErrors.postalCode}</p>
            ) : null}
          </div>
          <div className='space-y-1'>
            <Label htmlFor='register-address'>Detail alamat</Label>
            <textarea
              id='register-address'
              rows={3}
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm'
              placeholder='Nama jalan, no rumah, RT/RW, patokan, dsb.'
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              disabled={isSubmitting}
            />
            {fieldErrors.addressDetail ? (
              <p className='text-xs text-red-600'>
                {fieldErrors.addressDetail}
              </p>
            ) : null}
          </div>
          {errorMessage ? (
            <p className='text-sm text-red-600'>{errorMessage}</p>
          ) : null} */}
            <div className='pt-2'>
              <Button
                className='w-full bg-brand hover:bg-brand/90 text-white'
                onClick={handleSubmit}
                type='button'
                disabled={submitting}
              >
                {submitting ? 'Memproses...' : 'Simpan'}
              </Button>
            </div>
            <div className='pt-2 text-center text-sm'>
              Sudah punya akun?{' '}
              <SheetClose asChild>
                <button
                  className='font-semibold text-brand'
                  onClick={onSwitchToLogin}
                  type='button'
                  disabled={isSubmitting}
                >
                  Masuk sekarang
                </button>
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default RegisterSheet;
