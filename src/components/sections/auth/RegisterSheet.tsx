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
  const [nameError, setNameError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setName(v);
    if (!v.trim()) {
      setNameError('Nama lengkap wajib diisi');
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

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setPassword(v);
    if (!v) {
      setPasswordError('Kata sandi wajib diisi');
    } else if (v.length < 8) {
      setPasswordError('Kata sandi minimal 8 karakter');
    } else if (!/[a-z]/.test(v)) {
      setPasswordError('Kata sandi harus mengandung minimal 1 huruf kecil');
    } else if (!/[A-Z]/.test(v)) {
      setPasswordError('Kata sandi harus mengandung minimal 1 huruf kapital');
    } else {
      setPasswordError(null);
    }
    // Revalidate confirm password if it's already filled
    if (confirmPassword) {
      if (confirmPassword !== v) {
        setConfirmPasswordError('Konfirmasi kata sandi tidak cocok');
      } else {
        setConfirmPasswordError(null);
      }
    }
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setConfirmPassword(v);
    if (!v) {
      setConfirmPasswordError('Konfirmasi kata sandi wajib diisi');
    } else if (v !== password) {
      setConfirmPasswordError('Konfirmasi kata sandi tidak cocok');
    } else {
      setConfirmPasswordError(null);
    }
  };

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
    let hasError = false;

    if (!name.trim()) {
      setNameError('Nama lengkap wajib diisi');
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

    if (!password) {
      setPasswordError('Kata sandi wajib diisi');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Kata sandi minimal 8 karakter');
      hasError = true;
    } else if (!/[a-z]/.test(password)) {
      setPasswordError('Kata sandi harus mengandung minimal 1 huruf kecil');
      hasError = true;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError('Kata sandi harus mengandung minimal 1 huruf kapital');
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Konfirmasi kata sandi wajib diisi');
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Konfirmasi kata sandi tidak cocok');
      hasError = true;
    } else {
      setConfirmPasswordError(null);
    }

    if (hasError) {
      toast.error('Harap lengkapi semua field yang wajib diisi dengan benar');
      return;
    }

    const payload = {
      name,
      email,
      password,
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
    setNameError(null);
    setEmail('');
    setEmailError(null);
    setPassword('');
    setPasswordError(null);
    setConfirmPassword('');
    setConfirmPasswordError(null);
    setShowPassword(false);
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
              <Label htmlFor='register-name'>
                Nama <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='register-name'
                type='text'
                placeholder='Nama lengkap'
                value={name}
                onChange={handleNameChange}
                disabled={isSubmitting}
                className={nameError ? 'border-red-500' : ''}
              />
              {nameError ? (
                <p className='text-xs text-red-600'>{nameError}</p>
              ) : null}
              {fieldErrors.name ? (
                <p className='text-xs text-red-600'>{fieldErrors.name}</p>
              ) : null}
            </div>
            <div className='space-y-1'>
              <Label htmlFor='register-email'>
                Email <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='register-email'
                type='email'
                placeholder='nama@email.com'
                value={email}
                onChange={handleEmailChange}
                disabled={isSubmitting}
                className={emailError ? 'border-red-500' : ''}
              />
              {emailError ? (
                <p className='text-xs text-red-600'>{emailError}</p>
              ) : null}
              {fieldErrors.email ? (
                <p className='text-xs text-red-600'>{fieldErrors.email}</p>
              ) : null}
            </div>
            <div className='space-y-1'>
              <Label htmlFor='register-password'>
                Kata sandi <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='register-password'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                value={password}
                onChange={handlePasswordChange}
                disabled={isSubmitting}
                className={passwordError ? 'border-red-500' : ''}
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
                Konfirmasi kata sandi <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='register-password-confirm'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                disabled={isSubmitting}
                className={confirmPasswordError ? 'border-red-500' : ''}
              />
              {confirmPasswordError ? (
                <p className='text-xs text-red-600'>{confirmPasswordError}</p>
              ) : null}
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
              *Kata sandi anda harus terdiri dari setidaknya 8 karakter,
              mengandung minimal 1 huruf kecil dan 1 huruf kapital
            </p>

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
