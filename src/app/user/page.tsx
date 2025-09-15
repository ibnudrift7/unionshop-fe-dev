import { MobileMenu } from '@/components/sections';
import FooterNavigationSection from '@/components/sections/shop/FooterNavigationSection';

export default function UserPage() {
  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[720px] border-x border-gray-200'>
      <MobileMenu />
      <FooterNavigationSection activeTab='profile' />
    </div>
  );
}
