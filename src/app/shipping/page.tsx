import { AddressSection } from '@/components/sections';
import FooterNavigationSection from '@/components/sections/FooterNavigationSection';

export default function ShippingPage() {
  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[720px] border-x border-gray-200'>
      <AddressSection />
      <FooterNavigationSection activeTab='profile' />
    </div>
  );
}
