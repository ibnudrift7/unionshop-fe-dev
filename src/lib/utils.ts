import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CartItem as MemberCartItem } from '@/types/cart';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toNumber(v: unknown): number {
  if (typeof v === 'number') {
    return Number.isFinite(v) ? v : 0;
  }
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export function formatIDR(amount: number): string {
  const n = toNumber(amount);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n);
}

export function resolveMemberUnitPrice(it: MemberCartItem): number {
  const sale = typeof it.sale_price === 'number' ? it.sale_price : undefined;
  if (typeof sale === 'number' && sale > 0) return sale;
  const base = toNumber(it.base_price);
  if (base > 0) return base;
  const p =
    typeof it.prices === 'number' && Number.isFinite(it.prices)
      ? it.prices
      : typeof it.price === 'number' && Number.isFinite(it.price)
      ? it.price
      : 0;
  if (p > 0) return p;
  const inferred = it.subtotal && it.qty ? it.subtotal / it.qty : 0;
  return Number.isFinite(inferred) ? inferred : 0;
}
