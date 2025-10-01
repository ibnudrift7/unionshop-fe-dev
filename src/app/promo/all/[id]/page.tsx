'use client';

import { PromoDetail } from '@/components/sections';
import FooterNavigationSection from '@/components/sections/shop/FooterNavigationSection';

export default function PromoDetailPage() {
  // You can pass the id to PromoDetail later if needed for fetching
  // e.g. <PromoDetail id={params.id} /> (after adding prop)
  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <PromoDetail />
      <FooterNavigationSection activeTab='shop' />
    </div>
  );
}
