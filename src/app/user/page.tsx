'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileMenu } from '@/components/sections';
import FooterNavigationSection from '@/components/sections/shop/FooterNavigationSection';
import { Dialog } from '@/components/ui/dialog';
import ThankYouDialogContent from '@/components/sections/checkout/ThankYouDialog';
import UserGuestSheet from '@/components/sections/auth/UserGuestSheet';
import { useRegisterMutation } from '@/hooks/use-auth';
import type { RegisterPayload } from '@/types/auth';
import { toast } from 'sonner';
import { setAuthToken } from '@/lib/auth-token';
import type { HttpError } from '@/services/http';

export default function UserPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const registerMutation = useRegisterMutation();
  const isSubmitting = registerMutation.isPending;
  const errorMessage = (() => {
    if (!registerMutation.isError) return null;
    const raw = registerMutation.error as unknown as {
      message?: string;
      data?: { message?: string };
    };
    const msg = raw?.data?.message || raw?.message || 'Registrasi gagal';
    return msg.includes('Email already registered')
      ? 'Email sudah terdaftar. Silakan masuk.'
      : msg;
  })();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      const show =
        url.searchParams.get('thankyou') === '1' ||
        url.searchParams.get('thankyou') === 'true';
      if (show) setOpen(true);
    } catch {}
  }, []);

  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <MobileMenu />

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            try {
              router.replace('/user');
            } catch {}
          }
        }}
      >
        <ThankYouDialogContent
          onRegister={() => {
            setOpen(false);
            setGuestOpen(true);
          }}
        />
      </Dialog>

      <UserGuestSheet
        trigger={<span className='hidden' />}
        open={guestOpen}
        onOpenChange={setGuestOpen}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onSubmit={({ password, confirmPassword }) => {
          if (!password || password.length < 8) {
            toast.error('Password minimal 8 karakter');
            return;
          }
          if (!/[a-z]/.test(password)) {
            toast.error('Password harus mengandung minimal 1 huruf kecil');
            return;
          }
          if (password !== confirmPassword) {
            toast.error('Konfirmasi kata sandi tidak cocok');
            return;
          }

          // Ambil data user dan alamat dari localStorage
          let name = '';
          let email = '';
          let phone = '';
          let province = '';
          let city = '';
          let district = '';
          let postalCode = '';
          let addressDetail = '';

          try {
            const rawUser =
              typeof window !== 'undefined'
                ? localStorage.getItem('guest_user')
                : null;
            if (rawUser) {
              const u = JSON.parse(rawUser) as {
                email?: string;
                full_name?: string;
                phone?: string;
              };
              email = u.email || email;
              name = u.full_name || name;
              phone = u.phone || phone;
            }
          } catch {}

          try {
            const rawAddr =
              typeof window !== 'undefined'
                ? localStorage.getItem('guest_address')
                : null;
            if (rawAddr) {
              const a = JSON.parse(rawAddr) as {
                name?: string;
                email?: string;
                phone?: string;
                province?: string;
                city?: string;
                district?: string;
                postalCode?: string;
                addressDetail?: string;
              };
              name = name || a.name || '';
              email = email || a.email || '';
              phone = phone || a.phone || '';
              province = a.province || '';
              city = a.city || '';
              district = a.district || '';
              postalCode = a.postalCode || '';
              addressDetail = a.addressDetail || '';
            }
          } catch {}

          if (!email || !name) {
            toast.error('Data tamu tidak lengkap. Silakan daftar manual.');
            router.push('/register');
            return;
          }

          const payload: RegisterPayload = {
            name,
            email,
            password,
            phone,
            province,
            city,
            district,
            postalCode,
            addressDetail,
            gender: 'pria',
            dateOfBirth: '2000-01-01',
          };

          registerMutation.mutate(payload, {
            onSuccess: (response) => {
              try {
                const token =
                  (response?.data?.token as string | undefined) ||
                  ((
                    response?.data?.tokens as
                      | { accessToken?: string }
                      | undefined
                  )?.accessToken ??
                    undefined);
                if (token) setAuthToken(token);
              } catch {}
              toast.success('Registrasi berhasil. Selamat datang!');
              setGuestOpen(false);
              try {
                router.refresh();
              } catch {}
            },
            onError: (error: HttpError) => {
              const msg: string =
                (error?.data && typeof error.data === 'object'
                  ? (error.data as { message?: string }).message
                  : undefined) ||
                error?.message ||
                'Registrasi gagal';
              if (msg.includes('Email already registered')) {
                toast.error('Email sudah terdaftar. Silakan masuk.');
                setGuestOpen(false);
              } else {
                toast.error(msg);
              }
            },
          });
        }}
      />

      <FooterNavigationSection activeTab='profile' />
    </div>
  );
}
