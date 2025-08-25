import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/authProvider';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'Nova - Take Charge of Your Finance',
  description:
    'Nova is a Finance Tracking app that encourages healthy spending habits and cultivates a good saving mindset.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <main className='max-w-screen flex flex-col justify-center items-center'>
              {children}
            </main>
          </AuthProvider>
          <Toaster richColors closeButton expand={true} />
        </ThemeProvider>
      </body>
    </html>
  );
}
