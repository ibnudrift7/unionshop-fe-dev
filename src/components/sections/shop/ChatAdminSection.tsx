'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface ChatAdminSectionProps {
  title?: string;
  chatTitle?: string;
  phoneNumber?: string;
  onChatClick?: () => void;
}

export default function ChatAdminSection({
  title = 'Curhat Ke Mimin?',
  chatTitle = 'Buat User MAKNA (Chat Only)',
  phoneNumber = '+62 xxx xxx xxx',
  onChatClick,
}: ChatAdminSectionProps) {
  return (
    <section className='px-4'>
      <div className='text-start font-bold text-gray-700 mb-4'>{title}</div>
      <Card
        className='cursor-pointer hover:shadow-md transition-shadow'
        onClick={onChatClick}
      >
        <CardContent className='p-4'>
          <div className='flex items-center space-x-4'>
            <div className='w-12 h-12 flex items-center justify-center'>
              <Image
                src='/assets/whatsapp.png'
                alt='WhatsApp'
                width={48}
                height={48}
                className='object-contain'
              />
            </div>
            <div>
              <p className='font-semibold'>{chatTitle}</p>
              <p className='font-bold text-gray-600'>WhatsApp: {phoneNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
