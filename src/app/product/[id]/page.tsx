'use client';

import { ProductDetail } from '@/components/sections';
import FooterNavigationSection from '@/components/sections/shop/FooterNavigationSection';

export default function ProductDetailPage() {
  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <ProductDetail />
      <FooterNavigationSection activeTab='shop' />
    </div>
  );
}
