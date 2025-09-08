'use client';

import { Badge } from '@/components/ui/badge';
import { NavigationTab } from '@/types';
import { Home, ShoppingBag, Gift, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FooterNavigationSectionProps {
  tabs?: NavigationTab[];
  activeTab?: string;
  onTabClick?: (tab: NavigationTab) => void;
}

const defaultTabs: NavigationTab[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'shop', icon: ShoppingBag, label: 'Shop', badge: '3' },
  { id: 'promo', icon: Gift, label: 'Promo', badge: '2' },
  { id: 'profile', icon: User, label: 'Saya' },
  { id: 'logout', icon: LogOut, label: 'Logout' },
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
    }
  };
  return (
    <footer className='bg-white border-t sticky bottom-0 p-4 z-2'>
      <div className='flex justify-around'>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleClick(tab)}
              className={`flex flex-col items-center space-y-1 relative transition-colors ${
                activeTab === tab.id ? 'text-brand' : 'text-gray-600'
              }`}
            >
              <div className='relative'>
                <IconComponent className='w-6 h-6' />
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
  );
}
