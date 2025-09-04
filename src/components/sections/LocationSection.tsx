'use client';

import {
  CardDualSection,
  CardTopSection,
  CardBottomSection,
} from '@/components/ui/card';
import { MapPin } from 'lucide-react';
interface LocationSectionProps {
  onLocationClick?: () => void;
}

export default function LocationSection({
  onLocationClick,
}: LocationSectionProps) {
  return (
    <div className='mx-4'>
      <CardDualSection className='shadow-lg'>
        <CardTopSection className='border-b-2 border-gray-400'>
          <h3 className='font-bold text-lg italic text-brand p-4'>
            GET STARTED, <span className='font-extrabold'>ORDER NOW!</span>
          </h3>
        </CardTopSection>
        <CardBottomSection>
          <div className='flex items-center justify-between p-4'>
            <div className='flex-1'>
              <h3 className='font-semibold text-lg text-gray-900'>
                Ruko Mulyosari Surabaya
              </h3>
              <p className='text-gray-600 text-sm'>
                Ruko Mulyosari Surabaya, Jl Mulyosari No 76G Kec....
              </p>
            </div>
            <div className='ml-4'>
              <button
                onClick={onLocationClick}
                className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center border-3 border-brand hover:bg-purple-200 transition-colors'
              >
                <MapPin className='w-6 h-6 text-red-500' />
              </button>
            </div>
          </div>
        </CardBottomSection>
      </CardDualSection>
    </div>
  );
}
