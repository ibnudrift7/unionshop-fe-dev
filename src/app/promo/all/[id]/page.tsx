'use client';

import { PromoDetail } from '@/components/sections';
import FooterNavigationSection from '@/components/sections/shop/FooterNavigationSection';

export default function PromoDetailPage() {
  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <PromoDetail />
      <FooterNavigationSection activeTab='shop' />
    </div>
  );
}
