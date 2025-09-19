'use client';

import { FooterNavigationSection } from '@/components/sections';
import { OrderConfirmation } from '@/components/sections';

export default function OrderConfirmationPage() {
  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <OrderConfirmation />
      <FooterNavigationSection activeTab='shop' />
    </div>
  );
}
