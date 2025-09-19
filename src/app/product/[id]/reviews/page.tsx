'use client';

import { ProductReviews } from '@/components/sections';
import FooterNavigationSection from '@/components/sections/shop/FooterNavigationSection';

export default function ProductReviewsPage() {
  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <ProductReviews />
      <FooterNavigationSection activeTab='shop' />
    </div>
  );
}
