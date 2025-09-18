'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Search, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  searchPlaceholder?: string;
  cartCount?: number;
  images?: string[];
  onSearch?: (value: string) => void;
  onCartClick?: () => void;
}

const defaultImages = [
  '/assets/Background.png',
  '/assets/Background.png',
  '/assets/Background.png',
];

export default function HeroSection({
  searchPlaceholder = 'Makna V4',
  cartCount = 25,
  images = defaultImages,
  onSearch,
  onCartClick,
}: HeroSectionProps) {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      const next = !prev;
      // focus the input after opening
      if (!prev) {
        // queue to next tick so width transition doesn't block focus
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
      return next;
    });
  };

  return (
    <div className='relative'>
      <div className='relative aspect-[16/9] overflow-hidden'>
        <Carousel
          plugins={[plugin.current]}
          className='w-full'
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: 'start',
            loop: true,
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className='relative aspect-[16/9] w-full overflow-hidden'>
                  <Image
                    src={image}
                    alt={`Hero Background ${index + 1}`}
                    fill
                    sizes='(max-width: 720px) 100vw, 720px'
                    className='object-cover'
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className='absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none' />

        <div className='absolute inset-0 flex flex-col justify-start items-center text-center pt-10 px-4'>
          <div className='flex items-center gap-0 w-full'>
            <div className='relative flex items-center w-full justify-end'>
              <div
                className={cn(
                  'relative overflow-hidden min-w-0 transition-all duration-300 ease-in-out',
                  isSearchOpen ? 'w-[calc(100%-96px)]' : 'w-0',
                )}
              >
                {isSearchOpen && (
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5' />
                )}
                <Input
                  ref={searchInputRef}
                  placeholder={searchPlaceholder}
                  className={cn(
                    'pl-10 pr-0 bg-white/50 backdrop-blur-sm border-gray-200 h-12 border-r-0',
                    isSearchOpen
                      ? 'rounded-l-lg rounded-r-none opacity-100'
                      : 'rounded-l-lg rounded-r-none opacity-0 pointer-events-none',
                  )}
                  onChange={(e) => onSearch?.(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsSearchOpen(false);
                  }}
                />
              </div>
              <Button
                size='icon'
                aria-label='Search'
                aria-expanded={isSearchOpen}
                className={cn(
                  'bg-brand hover:bg-brand/90 h-12 w-12',
                  isSearchOpen
                    ? 'rounded-l-none rounded-r-none '
                    : 'rounded-l-lg rounded-r-none',
                )}
                onClick={toggleSearch}
              >
                <Search className='w-5 h-5 text-white' />
              </Button>
              <div className='relative'>
                <Button
                  size='icon'
                  className='bg-brand hover:bg-brand/90 rounded-r-lg rounded-l-none h-12 w-12'
                  onClick={onCartClick}
                  aria-label='Cart'
                >
                  <ShoppingCart className='w-5 h-5 text-white' />
                </Button>
                {cartCount > 0 && (
                  <Badge className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-500 text-white rounded-full min-w-[24px] h-6 flex items-center justify-center text-xs'>
                    {cartCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
