import * as React from 'react';

import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card'
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border',
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-title'
      className={cn(
        'leading-none tracking-tight text-lg font-semibold',
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-description'
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-action'
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-content'
      className={cn('px-6', className)}
      {...props}
    />
  );
}

function CardDualSection({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-dual-section'
      className={cn(
        'bg-white rounded-2xl overflow-hidden shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

function CardTopSection({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-top-section'
      className={cn(
        'bg-gradient-to-l from-brand to-white text-white p-4',
        className,
      )}
      {...props}
    />
  );
}

function CardBottomSection({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-bottom-section'
      className={cn('bg-white p-4', className)}
      {...props}
    />
  );
}

function CardVoucher({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-voucher'
      className={cn(
        'bg-white rounded-2xl overflow-hidden shadow-lg flex',
        className,
      )}
      {...props}
    />
  );
}

function CardVoucherLeft({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-voucher-left'
      className={cn(
        'bg-brand p-6 flex items-center justify-center relative min-w-[180px]',
        className,
      )}
      style={{
        clipPath: 'polygon(0 0, 90% 0, 75% 100%, 0 100%)',
      }}
      {...props}
    />
  );
}

function CardVoucherRight({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-voucher-right'
      className={cn('bg-white flex-1 p-4 pl-8 flex items-center', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-footer'
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardDualSection,
  CardTopSection,
  CardBottomSection,
  CardVoucher,
  CardVoucherLeft,
  CardVoucherRight,
};
