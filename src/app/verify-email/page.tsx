'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const verifyMutation = useMutation({
    mutationKey: ['auth', 'verify-email'],
    mutationFn: (tkn: string) =>
      authService.verifyEmail(tkn).then((r) => r.data),
    onSuccess: (res) => {
      const msg =
        res?.message ||
        'Email berhasil diverifikasi. Anda bisa login sekarang.';
      toast.success(msg);
    },
    onError: (err: unknown) => {
      let msg = 'Verifikasi email gagal';
      if (typeof err === 'object' && err !== null) {
        const e = err as Record<string, unknown>;
        const data = e.data;
        if (typeof data === 'object' && data !== null) {
          const d = data as Record<string, unknown>;
          if (typeof d.message === 'string') msg = d.message;
        } else if (typeof e.message === 'string') {
          msg = e.message;
        }
      }
      toast.error(msg);
    },
  });

  useEffect(() => {
    if (!token) return;
    verifyMutation.mutate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const isLoading = verifyMutation.status === 'pending';
  const isSuccess = verifyMutation.status === 'success';
  const isError = verifyMutation.status === 'error';

  return (
    <div className='min-h-screen bg-white mx-auto max-w-[550px] border-x border-gray-200 flex items-center justify-center px-6'>
      <div className='w-full text-center space-y-4'>
        <h1 className='text-xl font-semibold'>Verifikasi Email</h1>
        {!token && (
          <p className='text-sm text-red-600'>
            Token verifikasi tidak ditemukan.
          </p>
        )}
        {token && isLoading && (
          <p className='text-sm text-gray-700'>Memverifikasi email Anda...</p>
        )}
        {token && isSuccess && (
          <p className='text-sm text-green-600'>
            Email berhasil diverifikasi. Anda bisa login sekarang.
          </p>
        )}
        {token && isError && (
          <p className='text-sm text-red-600'>
            Terjadi kesalahan saat verifikasi. Coba lagi atau hubungi dukungan.
          </p>
        )}
        <div className='pt-2'>
          <Button
            className='bg-brand hover:bg-brand/90 text-white'
            onClick={() => router.push('/')}
          >
            Ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
