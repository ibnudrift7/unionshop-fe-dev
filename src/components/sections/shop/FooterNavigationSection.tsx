'use client';

import { Badge } from '@/components/ui/badge';
import { NavigationTab } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FooterNavigationSectionProps {
  tabs?: NavigationTab[];
  activeTab?: string;
  onTabClick?: (tab: NavigationTab) => void;
}

const defaultTabs: NavigationTab[] = [
  {
    id: 'home',
    iconSrc: '/assets/nav/home.png',
    activeIconSrc: '/assets/nav/home-active.png',
    label: 'Home',
  },
  {
    id: 'shop',
    iconSrc: '/assets/nav/shop.png',
    activeIconSrc: '/assets/nav/shop-active.png',
    label: 'Shop',
    badge: '3',
  },
  {
    id: 'promo',
    iconSrc: '/assets/nav/promo.png',
    activeIconSrc: '/assets/nav/promo-active.png',
    label: 'Promo',
    badge: '2',
  },
  {
    id: 'profile',
    iconSrc: '/assets/nav/saya.png',
    activeIconSrc: '/assets/nav/saya-active.png',
    label: 'Saya',
  },
];

export default function FooterNavigationSection({
  tabs = defaultTabs,
  activeTab = 'home',
  onTabClick,
}: FooterNavigationSectionProps) {
  const router = useRouter();

  const handleClick = (tab: NavigationTab) => {
    onTabClick?.(tab);
    if (tab.id === 'home') {
      router.push('/');
    } else if (tab.id === 'profile') {
      router.push('/user');
    } else if (tab.id === 'shop') {
      router.push('/shop');
    } else if (tab.id === 'promo') {
      router.push('/promo');
    }
  };
  return (
    <>
      <div className='h-16 sm:h-20' aria-hidden />
      <footer
        role='contentinfo'
        className='fixed bottom-0 left-0 right-0 mx-auto max-w-[550px] bg-gray-50 border-t p-4 z-50'
      >
        <div className='flex justify-around'>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleClick(tab)}
                className={`flex flex-col items-center space-y-1 relative transition-colors ${
                  isActive ? 'text-brand' : 'text-gray-600'
                }`}
              >
                <div className='relative'>
                  {tab.iconSrc ? (
                    <Image
                      src={
                        isActive && tab.activeIconSrc
                          ? tab.activeIconSrc
                          : tab.iconSrc
                      }
                      alt={tab.label}
                      width={24}
                      height={24}
                      className={`w-6 h-auto ${isActive ? '' : 'opacity-70'}`}
                    />
                  ) : (
                    tab.icon && <tab.icon className='w-6 h-6' />
                  )}
                  {tab.badge && (
                    <Badge className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0'>
                      {tab.badge}
                    </Badge>
                  )}
                </div>
                <span className='text-xs'>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </>
  );
}
