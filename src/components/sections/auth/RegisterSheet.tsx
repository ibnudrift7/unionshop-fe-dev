'use client';

import { useState } from 'react';
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
}

export function RegisterSheet({
  trigger,
  onSubmit,
  onSwitchToLogin,
  isSubmitting = false,
  errorMessage = null,
}: RegisterSheetProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSubmit = () => {
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
          </div>

          <div className='space-y-1 pt-1'>
            <Label htmlFor='register-province'>Provinsi</Label>
            <Input
              id='register-province'
              type='text'
              placeholder='Provinsi'
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='register-city'>Kota/Kabupaten</Label>
            <Input
              id='register-city'
              type='text'
              placeholder='Kota atau Kabupaten'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='register-district'>Kecamatan</Label>
            <Input
              id='register-district'
              type='text'
              placeholder='Kecamatan'
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={isSubmitting}
            />
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
