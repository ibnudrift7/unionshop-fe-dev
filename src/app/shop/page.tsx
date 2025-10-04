'use client';

import { ShopSection, FooterNavigationSection } from '@/components/sections';
import { toast } from 'sonner';
import { Suspense } from 'react';

export default function ShopPage() {
  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <Suspense
        fallback={
          <div className='p-4 text-sm text-gray-500'>Memuat data shop...</div>
        }
      >
        <ShopSection
          cartCount={3}
          onSearch={(v) => console.log('search:', v)}
          onCartClick={() => toast('Cart opened')}
        />
      </Suspense>
      <FooterNavigationSection activeTab='shop' />
    </div>
  );
}
