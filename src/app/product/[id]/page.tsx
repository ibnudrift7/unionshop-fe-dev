'use client';

import { ProductDetail } from '@/components/sections/ProductDetail';
import FooterNavigationSection from '@/components/sections/FooterNavigationSection';

export default function ProductDetailPage() {
  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[720px] border-x border-gray-200'>
      <ProductDetail />
      <FooterNavigationSection activeTab='shop' />
    </div>
  );
}
