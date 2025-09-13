'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

interface BottomActionBarProps {
  noteText?: string;
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  showQuantity?: boolean;
  primaryLabel: string;
  onPrimaryClick?: () => void;
}

export default function BottomActionBar({
  noteText,
  quantity = 1,
  onIncrease,
  onDecrease,
  showQuantity = true,
  primaryLabel,
  onPrimaryClick,
}: BottomActionBarProps) {
  return (
    <div className='fixed left-1/2 -translate-x-1/2 bottom-[72px] sm:bottom-[76px] w-full max-w-[720px] bg-white border-t border-gray-200 p-4'>
      {noteText && (
        <div className='flex items-center justify-between mb-3'>
          <span className='text-sm text-green-600 font-medium'>{noteText}</span>
        </div>
      )}
      <div className='flex items-center justify-between'>
        {showQuantity ? (
          <div className='flex items-center border border-gray-300 rounded-lg'>
            <Button
              variant='ghost'
              size='icon'
              className='h-10 w-10'
              onClick={onDecrease}
            >
              <Minus className='h-4 w-4' />
            </Button>
            <span className='px-4 py-2 min-w-[3rem] text-center'>
              {quantity}
            </span>
            <Button
              variant='ghost'
              size='icon'
              className='h-10 w-10'
              onClick={onIncrease}
            >
              <Plus className='h-4 w-4' />
            </Button>
          </div>
        ) : (
          <div />
        )}

        <Button
          className='bg-brand hover:bg-brand/80 text-white px-6 py-3 rounded-lg flex-1 ml-4'
          onClick={onPrimaryClick}
        >
          {primaryLabel}
        </Button>
      </div>
    </div>
  );
}
