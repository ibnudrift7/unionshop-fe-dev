'use client';

import {
  HeroSection,
  LocationSection,
  CategoryGridSection,
  VoucherBannersSection,
  SpecialTodaySection,
  OfficialMerchandiseSection,
  ProductSection,
  ChatAdminSection,
  FooterNavigationSection,
  PromoSection,
} from '@/components/sections';
import { toast } from 'sonner';
import { Category, SpecialProduct, Product, NavigationTab } from '@/types';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (value: string) => {
    console.log('Search:', value);
  };

  const handleCartClick = () => {
    toast('Cart clicked', {
      description: 'You have 25 items in your cart.',
      action: {
        label: 'View Cart',
        onClick: () => console.log('View Cart'),
      },
    });
  };

  const handleLocationClick = () => {
    toast('Location clicked', {
      description: 'You can change your delivery location here.',
      action: {
        label: 'Change Location',
        onClick: () => console.log('Change Location'),
      },
    });
  };

  const handleCategoryClick = (category: Category) => {
    toast(`Category clicked: ${category.name}`);
  };

  const handleVoucherClaim = () => {
    toast('Voucher claimed successfully!', {
      description: 'You can use this voucher at checkout.',
      action: {
        label: 'View Vouchers',
        onClick: () => console.log('View Vouchers'),
      },
    });
  };

  const handleProductClick = (product: Product | SpecialProduct) => {
    toast(`Product clicked: ${product.name}`, {
      description: `Price: ${product.price || product.discountPrice} IDR`,
      action: {
        label: 'View Product',
        onClick: () => console.log('View Product'),
      },
    });
  };

  const handleOrderClick = () => {
    toast('Order placed successfully!', {
      description: 'Your order will be processed shortly.',
      action: {
        label: 'View Orders',
        onClick: () => console.log('View Orders'),
      },
    });
  };

  const handleChatClick = () => {
    toast('Chat with admin initiated', {
      description: 'You can now chat with our support team.',
      action: {
        label: 'Start Chat',
        onClick: () => console.log('Start Chat'),
      },
    });
  };

  const handleTabClick = (tab: NavigationTab) => {
    toast(`Tab clicked: ${tab.label}`, {
      description: `You are now on the ${tab.label} tab.`,
      action: {
        label: 'Go to Tab',
        onClick: () => console.log(`Go to ${tab.label} tab`),
      },
    });
  };

  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[720px] border-x border-gray-200'>
      <div className='relative'>
        <HeroSection
          searchPlaceholder='Makna V4'
          cartCount={25}
          onSearch={handleSearch}
          onCartClick={handleCartClick}
        />

        <div className='absolute bottom-0 left-0 right-0 transform translate-y-3/4 z-1'>
          <LocationSection onLocationClick={handleLocationClick} />
        </div>
      </div>

      <div className='pt-45'>
        <CategoryGridSection
          isLoading={isLoading}
          onCategoryClick={handleCategoryClick}
        />
      </div>

      <VoucherBannersSection
        voucher1={{
          title: 'Voucher buy 1 get 1 special',
          subtitle: 'UNIONLABS WEBSITE USER.',
          onClaim: handleVoucherClaim,
        }}
        voucher2={{
          title1: 'Mau Voucher',
          title2: 'Diskon 10RB?',
          description: 'Gabung & Ambil Vouchernya Sekarang juga!',
          onClaim: handleVoucherClaim,
        }}
      />

      <SpecialTodaySection
        isLoading={isLoading}
        onProductClick={handleProductClick}
      />

      <OfficialMerchandiseSection onOrderClick={handleOrderClick} />

      <ProductSection
        isLoading={isLoading}
        onProductClick={handleProductClick}
      />

      <PromoSection />

      <ChatAdminSection
        chatTitle='Buat User MAKNA (Chat Only)'
        phoneNumber='+62 xxx xxx xxx'
        onChatClick={handleChatClick}
      />

      <FooterNavigationSection activeTab='home' onTabClick={handleTabClick} />
    </div>
  );
}
