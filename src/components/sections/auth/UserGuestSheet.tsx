'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export interface UserGuestSheetProps {
  trigger: React.ReactNode;
  onSubmit?: (payload: { password: string; confirmPassword: string }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function UserGuestSheet({
  trigger,
  onSubmit,
  onCancel,
  isSubmitting = false,
  errorMessage = null,
  open,
  onOpenChange,
}: UserGuestSheetProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onSubmit?.({ password, confirmPassword });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side='bottom'
        className='rounded-t-2xl max-h-[85vh] overflow-auto w-full max-w-[720px] left-1/2 -translate-x-1/2 right-auto border-x border-gray-200'
      >
        <SheetHeader>
        </SheetHeader>

        <div className='px-4 pb-4 space-y-3'>
          <div className='space-y-1'>
            <Label htmlFor='guest-password'>Kata sandi</Label>
            <Input
              id='guest-password'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='guest-password-confirm'>
              Konfirmasi kata sandi
            </Label>
            <Input
              id='guest-password-confirm'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className='flex items-center gap-2 pt-1'>
            <input
              id='guest-show-password'
              type='checkbox'
              className='h-4 w-4 rounded border-gray-300'
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor='guest-show-password' className='text-sm'>
              Perlihatkan password
            </Label>
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
              {isSubmitting ? 'Memproses...' : 'Simpan sebagai tamu'}
            </Button>
          </div>

          <div className='pt-2'>
            <SheetClose asChild>
              <button
                className='w-full text-center text-sm font-medium text-black'
                onClick={onCancel}
                type='button'
                disabled={isSubmitting}
              >
                Batal
              </button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default UserGuestSheet;
