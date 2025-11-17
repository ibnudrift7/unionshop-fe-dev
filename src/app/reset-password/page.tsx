'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useResetPasswordMutation } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetMutation = useResetPasswordMutation({
    onSuccess: (res) => {
      const msg =
        res?.message ||
        'Password berhasil direset. Silakan login dengan password baru Anda.';
      toast.success(msg);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    },
    onError: (err) => {
      let msg = 'Reset password gagal';
      if (err.data && typeof err.data === 'object') {
        const d = err.data as Record<string, unknown>;
        if (typeof d.message === 'string') {
          msg = d.message;
        }
        if (d.errors && typeof d.errors === 'object') {
          const errors = d.errors as Record<string, unknown>;
          if (typeof errors.password === 'string') {
            msg = errors.password;
          }
        }
      } else if (err.message) {
        msg = err.message;
      }
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Token tidak valid');
      return;
    }

    if (!password) {
      toast.error('Password harus diisi');
      return;
    }

    if (password.length < 8) {
      toast.error('Password harus minimal 8 karakter');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password dan konfirmasi password tidak sama');
      return;
    }

    resetMutation.mutate({ token, password });
  };

  const isLoading = resetMutation.status === 'pending';

  return (
    <div className='min-h-screen bg-white mx-auto max-w-[550px] border-x border-gray-200 flex items-center justify-center px-6'>
      <div className='w-full max-w-md space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-semibold'>Reset Password</h1>
          <p className='text-sm text-gray-600'>Masukkan password baru Anda</p>
        </div>

        {!token ? (
          <div className='text-center space-y-4'>
            <p className='text-sm text-red-600'>
              Token reset password tidak ditemukan atau tidak valid.
            </p>
            <Button
              className='bg-brand hover:bg-brand/90 text-white'
              onClick={() => router.push('/')}
            >
              Ke Beranda
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password Baru</Label>
              <Input
                id='password'
                type='password'
                placeholder='Masukkan password baru'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <p className='text-xs text-gray-500'>Minimal 8 karakter</p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Konfirmasi Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Masukkan ulang password baru'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type='submit'
              className='w-full bg-brand hover:bg-brand/90 text-white'
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Reset Password'}
            </Button>

            <div className='text-center'>
              <Button
                type='button'
                variant='link'
                className='text-sm text-gray-600'
                onClick={() => router.push('/')}
                disabled={isLoading}
              >
                Kembali ke Beranda
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-white mx-auto max-w-[550px] border-x border-gray-200 flex items-center justify-center px-6'>
          <div className='w-full text-center space-y-4'>
            <h1 className='text-xl font-semibold'>Reset Password</h1>
            <p className='text-sm text-gray-700'>Memuat…</p>
          </div>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
