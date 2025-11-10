'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FooterNavigationSection } from '@/components/sections';
import { useSettingsMapQuery } from '@/hooks/use-setting';

export default function TentangMakna() {
  const router = useRouter();
  const { data: settingsMap } = useSettingsMapQuery();

  const aboutTitle = settingsMap?.['about_title']?.value ?? '';
  const aboutContents = settingsMap?.['about_contents']?.value ?? '';
  const paragraphs = aboutContents
    ? aboutContents.split(/\r?\n/).filter(Boolean)
    : [];
  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <div className='flex items-center p-4 border-b'>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8'
          onClick={() => router.push('/user')}
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <h1 className='text-lg font-semibold text-center flex-1 mr-8'>
          Tentang Makna
        </h1>
      </div>

      <div className='p-6 space-y-6'>
        <div className='text-center py-8'>
          <h2 className='text-6xl font-bold text-brand tracking-wider'>
            {aboutTitle}
            <sup className='text-sm'>®</sup>
          </h2>
        </div>

        <div className='space-y-4 text-sm leading-relaxed text-gray-800'>
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>
      <FooterNavigationSection activeTab='profile' />
    </div>
  );
}
