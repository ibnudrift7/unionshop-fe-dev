'use client';

import * as React from 'react';
import { ShoppingBag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { InlineVoucherModalProps } from '@/types/promo';

export default function VoucherModalInline(props: InlineVoucherModalProps) {
  const {
    open,
    onOpenChange,
    title,
    subtitle,
    description,
    promotions,
    loadingPromotions,
    selectedCode,
  } = props;
  const [code, setCode] = React.useState<string>('');
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      const backendCode =
        (typeof selectedCode === 'string' && selectedCode) ||
        (promotions && promotions.length > 0 ? promotions[0].code : '') ||
        '';
      setCode(backendCode);
      setCopied(false);
    }
  }, [open, promotions, selectedCode]);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement('textarea');
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const firstPromo = promotions && promotions.length > 0 ? promotions[0] : null;
  const displayTitle = title || firstPromo?.name || 'VOUCHER';
  const displaySubtitle = subtitle ?? 'Voucher';
  const displayDescription =
    description ?? (firstPromo?.description || undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md border-0 p-0 shadow-lg'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Promotional Voucher</DialogTitle>
        </DialogHeader>

        <div className='flex h-56 overflow-hidden rounded-lg'>
          <div className='flex w-1/3 flex-col items-center justify-center bg-red-500 p-6'>
            <div className='relative flex items-center justify-center'>
              <ShoppingBag
                className='h-16 w-16 text-yellow-400'
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className='flex w-2/3 flex-col items-center justify-center bg-pink-50 p-6'>
            <div className='text-center'>
              <h3 className='text-sm font-semibold text-gray-500'>
                {displaySubtitle}
              </h3>
              <h2 className='text-3xl font-extrabold text-red-600 tracking-wider my-2'>
                {displayTitle}
              </h2>
              {displayDescription && (
                <p className='text-xs text-gray-600 mb-3'>
                  {displayDescription}
                </p>
              )}

              <button
                onClick={handleCopy}
                aria-label='Copy voucher code'
                className='mx-auto flex items-center gap-3 rounded-2xl border border-dashed border-red-200 bg-white/90 px-4 py-3 text-sm font-mono font-semibold text-red-600 shadow-sm hover:bg-white'
              >
                <span className='select-all'>
                  {loadingPromotions ? 'Memuat…' : code}
                </span>
                <span className='ml-2 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white'>
                  {copied ? 'Disalin' : 'Salin'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
