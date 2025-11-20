import type { Metadata } from 'next';
import { QueryProvider } from '@/components/providers/QueryProvider';
import AgeGate from '@/components/providers/AgeGate';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { settingService } from '@/services/setting';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const resp = await settingService.getSettings();
    const settingsResp = resp.data;
    const flat = settingsResp?.data?.flat ?? [];
    const map: Record<string, string> = {};
    for (const it of flat) {
      if (it && typeof it.name === 'string') map[it.name] = it.value ?? '';
    }

    const title = map['default_meta_title'] ?? '';
    const description = map['default_meta_description'] ?? '';
    const keywordsRaw = map['default_meta_keywords'] ?? '';
    const webmaster = map['google_tools_webmaster'] ?? '';
    const keywords = keywordsRaw
      ? keywordsRaw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const meta: Metadata = {
      title,
      description,
      keywords,
      robots: {
        index: false,
        follow: false,
      },
    };

    if (webmaster) {
      meta.verification = { google: webmaster };
    }

    return meta;
  } catch {
    return {
      title: '',
      description: '',
      keywords: [],
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <script
          async
          defer
          src='https://maps.googleapis.com/maps/api/js?key=AIzaSyD9iwShId91xhFO3puDqnzzMbWSV1CSq6g&libraries=places'
        />
      </head>
      <body className='antialiased font-sans'>
        <QueryProvider>
          <AgeGate />
          {children}
          <Toaster position='top-center' />
        </QueryProvider>
      </body>
    </html>
  );
}
