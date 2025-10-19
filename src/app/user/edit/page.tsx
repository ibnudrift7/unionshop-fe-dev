'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { FooterNavigationSection } from '@/components/sections';
import { useAuthStatus } from '@/hooks/use-auth-status';
import {
  useProfileQuery,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
} from '@/hooks/use-profile';

export default function EditProfilePage() {
  const router = useRouter();
  const { isLoggedIn, isReady } = useAuthStatus();
  const { data: profile, isLoading } = useProfileQuery(isReady && isLoggedIn);
  const updateProfile = useUpdateProfileMutation();
  const updatePassword = useUpdatePasswordMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'wanita' | 'pria' | ''>('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordSheetOpen, setPasswordSheetOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady) return; // wait until auth status ready
    if (!isLoggedIn) router.push('/user');
  }, [isLoggedIn, isReady, router]);

  useEffect(() => {
    const p = profile?.data;
    if (!p) return;
    setName(p.full_name ?? '');
    setEmail(p.email ?? '');
    setPhone(p.phone ?? '');
    if (p.date_of_birth) {
      const iso = p.date_of_birth;
      const yyyyMmDd = iso.includes('T') ? iso.split('T')[0] : iso;
      setDateOfBirth(yyyyMmDd);
    } else {
      setDateOfBirth('');
    }
  }, [profile?.data]);

  const handleSaveProfile = () => {
    if (!name || !email || !phone || !dateOfBirth) {
      toast.error('Lengkapi semua data profil terlebih dahulu.');
      return;
    }
    if (gender !== 'wanita' && gender !== 'pria') {
      toast.error('Pilih jenis kelamin.');
      return;
    }
    updateProfile.mutate(
      {
        name,
        email,
        phone,
        gender,
        dateOfBirth,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || 'Profil berhasil diperbarui.');
        },
        onError: (err) => {
          const data = (err as unknown as { data?: unknown })?.data;
          if (
            data &&
            typeof data === 'object' &&
            'errors' in (data as Record<string, unknown>)
          ) {
            const beErrors = (data as Record<string, unknown>).errors as Record<
              string,
              unknown
            >;
            if (beErrors?.date_of_birth) {
              toast.error(
                String((beErrors as Record<string, unknown>).date_of_birth),
              );
              return;
            }
          }
          toast.error(err.message || 'Gagal memperbarui profil.');
        },
      },
    );
  };

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('Lengkapi semua kolom password.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password baru minimal 8 karakter.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Konfirmasi password tidak cocok.');
      return;
    }
    updatePassword.mutate(
      {
        currentPassword,
        newPassword,
        confirmPassword: confirmNewPassword,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || 'Password berhasil diperbarui.');
          setPasswordSheetOpen(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
          setShowPassword(false);
        },
        onError: (err) => {
          const data = (err as unknown as { data?: unknown })?.data;
          if (
            data &&
            typeof data === 'object' &&
            'message' in (data as Record<string, unknown>)
          ) {
            toast.error(String((data as Record<string, unknown>).message));
          } else {
            toast.error(err.message || 'Gagal memperbarui password.');
          }
        },
      },
    );
  };

  return (
    <div className='h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200 flex flex-col'>
      <div className='flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3'>
        <h1 className='text-lg font-semibold text-gray-900'>Edit Profil</h1>
        <Button
          variant='ghost'
          size='icon'
          aria-label='Tutup'
          className='text-gray-500 hover:text-gray-700'
          onClick={() => router.push('/user')}
        >
          <X className='h-5 w-5' />
        </Button>
      </div>

      <main className='p-4 space-y-3 overflow-auto flex-1'>
        <div className='space-y-1'>
          <Label htmlFor='ep-name'>Nama</Label>
          <Input
            id='ep-name'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading || updateProfile.isPending}
          />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='ep-email'>Email</Label>
          <Input
            id='ep-email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || updateProfile.isPending}
          />
        </div>

        <div className='space-y-1'>
          <Label>Password</Label>
          <div className='flex items-center gap-2'>
            <Input
              type='password'
              value={'********'}
              readOnly
              className='flex-1'
            />
            <Sheet
              open={isPasswordSheetOpen}
              onOpenChange={setPasswordSheetOpen}
            >
              <SheetTrigger asChild>
                <Button variant='outline'>Ganti</Button>
              </SheetTrigger>
              <SheetContent
                side='bottom'
                className='rounded-t-2xl max-h-[85vh] overflow-auto w-full max-w-[550px] left-1/2 -translate-x-1/2 right-auto border-x border-gray-200'
              >
                <SheetHeader>
                  <SheetTitle className='text-center text-lg'>
                    Ganti Password
                  </SheetTitle>
                </SheetHeader>
                <div className='px-4 pb-4 space-y-3'>
                  <div className='space-y-1'>
                    <Label htmlFor='cp-current'>Password saat ini</Label>
                    <Input
                      id='cp-current'
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={updatePassword.isPending}
                    />
                  </div>
                  <div className='space-y-1'>
                    <Label htmlFor='cp-new'>Password baru</Label>
                    <Input
                      id='cp-new'
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={updatePassword.isPending}
                    />
                  </div>
                  <div className='space-y-1'>
                    <Label htmlFor='cp-confirm'>Konfirmasi password baru</Label>
                    <Input
                      id='cp-confirm'
                      type={showPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      disabled={updatePassword.isPending}
                    />
                  </div>
                  <div className='flex items-center gap-2 pt-1'>
                    <input
                      id='cp-show'
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300'
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      disabled={updatePassword.isPending}
                    />
                    <Label htmlFor='cp-show' className='text-sm'>
                      Perlihatkan password
                    </Label>
                  </div>
                  <p className='text-xs text-gray-500'>
                    *Kata sandi anda harus terdiri dari setidaknya 8 karakter
                  </p>
                  <div className='pt-2'>
                    <Button
                      className='w-full bg-brand hover:bg-brand/90 text-white'
                      onClick={handleSavePassword}
                      disabled={updatePassword.isPending}
                    >
                      {updatePassword.isPending
                        ? 'Menyimpan...'
                        : 'Simpan password'}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className='space-y-1'>
          <Label htmlFor='ep-phone'>Nomor handphone</Label>
          <Input
            id='ep-phone'
            type='tel'
            inputMode='tel'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading || updateProfile.isPending}
          />
        </div>

        <div className='space-y-2'>
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
              disabled={isLoading || updateProfile.isPending}
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
              disabled={isLoading || updateProfile.isPending}
            >
              Pria
            </Button>
          </div>
        </div>

        <div className='space-y-1'>
          <Label htmlFor='ep-dob'>Tanggal lahir</Label>
          <Input
            id='ep-dob'
            type='date'
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            disabled={isLoading || updateProfile.isPending}
          />
        </div>

        <div className='pt-2'>
          <Button
            className='w-full bg-brand hover:bg-brand/90 text-white'
            onClick={handleSaveProfile}
            disabled={isLoading || updateProfile.isPending}
          >
            {updateProfile.isPending ? 'Menyimpan...' : 'Simpan profil'}
          </Button>
        </div>
      </main>

      <div className='border-t border-gray-200 bg-white'>
        <FooterNavigationSection activeTab='profile' />
      </div>
    </div>
  );
}
