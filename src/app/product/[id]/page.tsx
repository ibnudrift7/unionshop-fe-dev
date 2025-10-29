'use client';

import { ProductDetail } from '@/components/sections';
import FooterNavigationSection from '@/components/sections/shop/FooterNavigationSection';
import { useParams } from 'next/navigation';
import { useProductDetailQuery } from '@/hooks/use-product-detail';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const slugOrId = params?.id;
  const { data: product, isLoading } = useProductDetailQuery(slugOrId);

  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <ProductDetail product={product} loading={isLoading} />
      <FooterNavigationSection activeTab='shop' />
    </div>
  );
}
