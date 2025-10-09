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
  phoneNumber = '+62 877-7699-9499',
  onChatClick,
}: ChatAdminSectionProps) {
  return (
    <section className='px-4 border-t-8 border-gray-100 my-5'>
      <Card className='border-none shadow-none gap-4' onClick={onChatClick}>
        <div className='text-start font-bold text-black text-xl leading-tight mx-0 mt-7'>
          {title}
        </div>
        <CardContent className='p-6 shadow rounded-2xl bg-white border border-gray-200 mx-0'>
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
              <p className='font-medium'>{chatTitle}</p>
              <p className='font-extrabold text-green-800'>{phoneNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Full-width divider */}
      <div
        className='-mx-4 my-6 mt-8 border-t-8 border-gray-100'
        aria-hidden='true'
      ></div>
      <div className='my-6'>
        <p className='font-bold'>UNIONLABS.ID</p>
        <p className='font-bold'>2022 CREATED BY Union Labs</p>
        <p className='font-bold'>PT. Surya Hutama Anugerah.</p>
      </div>
    </section>
  );
}
