import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

import { ThemeMetaUpdater, ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/authProvider';
// import RootLayoutClient from '@/components/root-layout-client';
import {
  APP_NAME,
  APP_DEFAULT_TITLE,
  APP_TITLE_TEMPLATE,
  APP_DESCRIPTION,
} from '@/config/appInfoConfig';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  authors: [{ name: 'Wolfyre', url: 'https://github.com/Wolfyre243' }],
  manifest: '/manifest',
  generator: 'Next.js',

  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: APP_DEFAULT_TITLE,
    // startUpImage: [], // TODO: Add start up image for apple web app
  },

  // Determines what should be intepreted as actionable links
  formatDetection: {
    telephone: false,
  },

  category: 'website',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  keywords: [
    'finance',
    'tracking',
    'budgeting',
    'spending',
    'personal',
    'income logging',
    'savings goals',
    'healthy financial habits',
    'PWA finance app',
    'freelancer budget tool',
    'money management',
  ],
  // TODO: Tweak in the future to improve SEO
  // alternates: {
  //   canonical: 'https://your-nova-app-domain.com', // Replace with your production URL
  // },
  // openGraph: {
  //   title: 'Nova - Empower Your Finances with Smart Tracking',
  //   description:
  //     'Take control of your money with Nova: Track spending, set realistic budgets, log income, and build healthy habits. Perfect for freelancers and young professionals.',
  //   url: 'https://your-nova-app-domain.com', // Replace with your site URL
  //   siteName: 'Nova Finance Tracker',
  //   images: [
  //     {
  //       url: '/og-image.png', // Add a 1200x630 image in public/ for optimal sharing
  //       width: 1200,
  //       height: 630,
  //       alt: 'Nova app screenshot showing budgeting dashboard',
  //     },
  //   ],
  //   locale: 'en_US',
  //   type: 'website',
  // },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Nova - Take Charge of Your Finance',
  //   description:
  //     'Track your spending, budget wisely, and save more with Nova. Build resilient money habits today! #FinanceTracker #BudgetingApp',
  //   images: ['/twitter-image.png'], // Add a 1200x675 image in public/
  //   creator: '@yourTwitterHandle', // Replace with your X handle if available
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning className='scrollbar-thin'>
      <head>
        {/* Theme color for light mode */}
        <meta
          name='theme-color'
          content='#ffffff'
          media='(prefers-color-scheme: light)'
        />
        {/* Theme color for dark mode */}
        <meta
          name='theme-color'
          content='#121212'
          media='(prefers-color-scheme: dark)'
        />
        <link rel='manifest' href='/manifest.webmanifest' />
      </head>
      <body className={`${outfit.variable} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          enableColorScheme
        >
          <AuthProvider>
            <main className='flex max-w-screen flex-col items-center justify-center'>
              <ThemeMetaUpdater />
              {children}
            </main>
          </AuthProvider>
          <Toaster richColors closeButton expand={true} />
        </ThemeProvider>
      </body>
    </html>
  );
}
