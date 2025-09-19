'use client';

import { ShopSection, FooterNavigationSection } from '@/components/sections';
import { toast } from 'sonner';

export default function ShopPage() {

  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <ShopSection
        cartCount={3}
        onSearch={(v) => console.log('search:', v)}
        onCartClick={() => toast('Cart opened')}
      />
      <FooterNavigationSection activeTab='shop' />
    </div>
  );
}
