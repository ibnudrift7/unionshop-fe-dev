'use client';

import { ProductReviews } from '@/components/sections/ProductReview';
import FooterNavigationSection from '@/components/sections/FooterNavigationSection';

export default function ProductReviewsPage() {
  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[720px] border-x border-gray-200'>
      <ProductReviews />
      <FooterNavigationSection activeTab='shop' />
    </div>
  );
}
