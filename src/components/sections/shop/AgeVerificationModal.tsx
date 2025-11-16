'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface AgeVerificationModalProps {
  open: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function AgeVerificationModal({
  open,
  onConfirm,
  onCancel,
}: AgeVerificationModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <Dialog open={open}>
      <DialogContent className='max-w-md border-0 shadow-lg p-0 gap-0'>
        <div className='px-6 py-8'>
          <DialogHeader className='mb-4'>
            <DialogTitle className='text-2xl font-bold text-center text-brand'>
              Apakah Anda sudah berusia 21 tahun atau lebih?
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className='text-center text-gray-600 text-sm leading-relaxed'>
            Dengan mengklik tombol di bawah, Anda mengkonfirmasi bahwa Anda
            memiliki kartu identitas resmi yang menunjukkan usia Anda adalah 21
            tahun
          </DialogDescription>
        </div>

        <div className='border-t border-gray-200'></div>

        <DialogFooter className='flex gap-0 p-0'>
          <button
            onClick={handleConfirm}
            className='flex-1 px-6 py-4 bg-brand text-white font-semibold hover:bg-brand transition-colors border-r border-white'
          >
            Konfirmasi & Lanjutkan
          </button>
          <button
            onClick={handleCancel}
            className='flex-1 px-6 py-4 bg-brand text-white font-semibold hover:bg-brand transition-colors'
          >
            Tidak, Saya Belum 21+
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AgeVerificationRejectModal({ open }: { open: boolean }) {
  const handleClose = () => {
    window.location.href =
      'https://kemkes.go.id/eng/layanan/-indonesian-stop-smoking-program';
    localStorage.removeItem('age_verified');
    localStorage.removeItem('age_rejected');
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className='max-w-md border-0 shadow-lg p-0 gap-0'
        showCloseButton={false}
      >
        <button
          onClick={handleClose}
          className='absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10'
          aria-label='Close'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-4 w-4'
          >
            <path d='M18 6 6 18' />
            
            <path d='m6 6 12 12' />
          </svg>
        </button>
        <div className='px-6 py-8'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-extrabold text-center text-black'>
              Peraturan Usia Berlaku
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className='border-t border-gray-200'></div>
        <DialogFooter className='flex flex-col gap-4 p-6'>
          <DialogDescription className='text-center text-gray-600 text-sm leading-relaxed mb-4'>
            Terimakasih atas kejujuran Anda, Anda belum memenuhi persyaratan
            usia 21 tahun. Akses ke konten ini tidak diizinkan.
          </DialogDescription>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
