'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FooterNavigationSection } from '@/components/sections';

export default function TentangMakna() {
  const router = useRouter();
  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[720px] border-x border-gray-200'>
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
            MAKNA
            <sup className='text-sm'>®</sup>
          </h2>
        </div>

        <div className='space-y-4 text-sm leading-relaxed text-gray-800'>
          <p>
            <span className='font-semibold'>Makna</span> hadir sebagai rumah
            bagi para pengguna setia Makna. Sebuah ruang yang memudahkan Anda
            untuk menikmati, menghayati, dan menikmati setiap varian rasa Makna
            tanpa batas. Di sini, Anda bisa menjelajahi koleksi produk dan
            mendapatkan informasi terbaru tentang produk produk liquid kami,
            anda juga bisa mendapatkan merchandise official Unionlabs.
          </p>

          <p>
            <span className='font-semibold'>Makna</span> eksis untuk memberikan
            pengalaman ngevape yang lebih dari sekedar puas rasa. Kami percaya
            bahwa vape bukan hanya soal kenikmatan rasa, tetapi juga soal
            bagaimana ia membuat Anda merasa. Tentang cerita hidup, tawa,
            obat-obatan, dan dari cerita hidup, menemani tawa, obrolan, dan
            refleksi diri.
          </p>

          <p>
            Sebagai bagian dari Unionlabs, kami tidak hanya membawa standar
            kualitas tinggi yang telah terbukti, tetapi juga menambahkan
            sentuhan personal yang membuat setiap produk terasa dekat dan
            relevan dengan penggunanya. Di balik setiap racikan, ada proses
            panjang penuh perhatian, pemilihan bahan terbaik, dan eksperimen
            rasa yang dilakukan dengan sepenuh hati.
          </p>
        </div>

        <div className='text-center pt-4'>
          <p className='text-sm text-gray-600'>
            Karena{' '}
            <span className='text-sm text-brand font-medium'>
              #EnakDimulaiHariIni
            </span>
          </p>
        </div>
      </div>
      <FooterNavigationSection activeTab='profile' />
    </div>
  );
}
