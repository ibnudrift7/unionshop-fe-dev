'use client';

import { useState } from 'react';
import {
  useProvincesQuery,
  useCitiesQuery,
  useDistrictsQuery,
} from '@/hooks/use-location';
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

export interface RegisterSheetProps {
  trigger: React.ReactNode;
  onSubmit?: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    gender?: 'wanita' | 'pria' | '';
    dateOfBirth?: string; // ISO yyyy-mm-dd
    province?: string;
    city?: string;
    district?: string; // kecamatan
    postalCode?: string; // kode pos
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
  errorMessage = null,
  fieldErrors = {},
}: RegisterSheetProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'' | 'wanita' | 'pria'>('');
  const [dateOfBirth, setDateOfBirth] = useState(''); // ISO yyyy-mm-dd
  const [dobDraft, setDobDraft] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  // Location queries (IDs will be used for value)
  const provincesQuery = useProvincesQuery(true);
  const citiesQuery = useCitiesQuery(province || undefined);
  const districtsQuery = useDistrictsQuery(city || undefined);

  const provinces = provincesQuery.data?.data ?? [];
  const cities = citiesQuery.data?.data ?? [];
  const districts = districtsQuery.data?.data ?? [];

  const handleProvinceChange = (id: string) => {
    setProvince(id);
    setCity('');
    setDistrict('');
  };

  const handleCityChange = (id: string) => {
    setCity(id);
    setDistrict('');
  };

  const handleSubmit = () => {
    // Basic password validations
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

    onSubmit?.({
      name,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      province,
      city,
      district,
      postalCode,
      addressDetail,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side='bottom'
        className='rounded-t-2xl max-h-[85vh] overflow-auto w-full max-w-[720px] left-1/2 -translate-x-1/2 right-auto border-x border-gray-200'
      >
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
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
            />
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
                      onChange={(e) => setDobDraft(e.target.value)}
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
            {fieldErrors.dateOfBirth ? (
              <p className='text-xs text-red-600'>{fieldErrors.dateOfBirth}</p>
            ) : null}
          </div>

          <div className='space-y-1 pt-1'>
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
            <select
              id='register-city'
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={isSubmitting || !province || citiesQuery.isLoading}
            >
              <option value='' disabled>
                {!province
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
            {fieldErrors.city ? (
              <p className='text-xs text-red-600'>{fieldErrors.city}</p>
            ) : null}
          </div>
          <div className='space-y-1'>
            <Label htmlFor='register-district'>Kecamatan</Label>
            <select
              id='register-district'
              className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white'
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={
                isSubmitting || !province || !city || districtsQuery.isLoading
              }
            >
              <option value='' disabled>
                {!province
                  ? 'Pilih provinsi dulu'
                  : !city
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
          ) : null}
          <div className='pt-2'>
            <Button
              className='w-full bg-brand hover:bg-brand/90 text-white'
              onClick={handleSubmit}
              type='button'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : 'Simpan'}
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
      </SheetContent>
    </Sheet>
  );
}

export default RegisterSheet;
