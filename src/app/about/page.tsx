'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FooterNavigationSection } from '@/components/sections';
import { useSettingsMapQuery } from '@/hooks/use-setting';
import DOMPurify from 'isomorphic-dompurify';
import { useMemo } from 'react';

export default function TentangMakna() {
  const router = useRouter();
  const { data: settingsMap } = useSettingsMapQuery();

  const aboutTitle = settingsMap?.['about_title']?.value ?? '';
  const aboutContents = settingsMap?.['about_contents']?.value ?? '';

  const sanitizedContent = useMemo(() => {
    if (!aboutContents) return '';
    return DOMPurify.sanitize(aboutContents, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'a',
        'img',
        'div',
        'span',
        'blockquote',
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style'],
    });
  }, [aboutContents]);
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
          <div
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            className='prose prose-sm max-w-none'
          />
        </div>
      </div>
      <FooterNavigationSection activeTab='profile' />
    </div>
  );
}
