import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  BarChart,
  DollarSign,
  Goal,
  LineChart,
  Lock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ThemeToggler } from '@/components/theme-provider';
import Image from 'next/image';
import Link from 'next/link';
import { APP_VERSION } from '@/config/appInfoConfig';
import { InstallPromptModal } from '@/components/install-prompt-modal';
import { LandingPageDropdown } from '@/components/nav/landing-page-dropdown';

export const metadata: Metadata = {
  title: 'Nova - Empower Your Finances with Simple Tracking',
  description:
    'Nova is a progressive web app that helps you track income, set budgets, monitor spending, and build healthy financial habits. Start your journey to financial resilience today.',
  keywords:
    'finance tracker, budgeting app, spending tracking, personal finance, PWA, financial habits',
};

export default function Home() {
  return (
    <div className='min-h-screen w-full bg-gradient-to-b'>
      {/* Header/Navbar */}
      <header className='main mx-auto flex items-center justify-between px-6 py-6'>
        <div className='flex flex-row items-center gap-4'>
          <LandingPageDropdown />
          <div className='hidden flex-row items-baseline gap-2 md:flex'>
            <h1 className='text-2xl font-semibold'>Nova</h1>
            <p className='text-sm'>{APP_VERSION}</p>
          </div>
        </div>
        <nav className='flex w-fit flex-row items-center gap-4'>
          <div className='hidden flex-row md:flex'>
            <Button variant='ghost' asChild>
              <Link href={'#features'} scroll={true}>
                Features
              </Link>
            </Button>
            <Button variant='ghost' asChild>
              <Link href={'#pricing'} scroll={true}>
                Pricing
              </Link>
            </Button>
            <InstallPromptModal />
            <ThemeToggler />
          </div>
          <Button variant='outline' asChild>
            <Link href={'/auth/login'}>Login</Link>
          </Button>
          <Button asChild>
            <Link href={'/auth/signup'}>
              Get Started <ArrowRight />
            </Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className='flex w-full flex-col items-center justify-center px-6 py-16 text-center md:px-8 lg:px-16 xl:px-20'>
        <h2 className='from-secondary mb-4 w-fit bg-gradient-to-r to-purple-500 bg-clip-text py-2 text-5xl font-extrabold text-transparent'>
          Ignite Your Financial Supernova
        </h2>
        <p className='mx-auto mb-8 max-w-2xl text-xl'>
          Nova helps you track income, set realistic budgets, monitor spending,
          and build resilient habits - your first step to financial literacy.
        </p>
        <Button
          size='lg'
          className='from-secondary text-background cursor-pointer rounded-full bg-gradient-to-r to-purple-500 duration-200 ease-in-out hover:scale-105'
          asChild
        >
          <Link href={'/auth/signup'}>Start Tracking Today!</Link>
        </Button>
        <div className='mt-12 flex w-fit flex-row gap-4'>
          <Badge variant='outline' className='rounded-full px-4 py-1 text-sm'>
            Secure
          </Badge>
          <Badge variant='outline' className='rounded-full px-4 py-1 text-sm'>
            Accessible
          </Badge>
          <Badge variant='outline' className='rounded-full px-4 py-1 text-sm'>
            Empowering
          </Badge>
        </div>
        <div className='text-muted-foreground mt-8 flex w-full flex-col gap-2 md:hidden'>
          <h1 className='text-xl'>Mobile user? Even better!</h1>
          <InstallPromptModal className='text-lg' />
        </div>
      </section>

      {/* Features Section */}
      <section
        id='features'
        className='mb-16 flex w-full flex-col items-center justify-center px-6 md:px-8 lg:px-16 xl:px-20'
      >
        <h3 className='mb-6 text-center text-3xl font-bold'>Core Features</h3>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          <Card className='transition-shadow hover:shadow-lg'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <DollarSign className='mr-2 h-6 w-6 text-green-500' />
                Income & Spending Tracking
              </CardTitle>
              <CardDescription>
                Log income and expenses manually or semi-automatically with OCR
                receipts. Categorize easily for a clear cash flow view.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className=''>Watch your savings and spending</p>
            </CardContent>
          </Card>

          <Card className='transition-shadow hover:shadow-lg'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <BarChart className='mr-2 h-6 w-6 text-blue-500' />
                Smart Budgeting
              </CardTitle>
              <CardDescription>
                Set custom budgets with templates like 50/30/20. Real-time
                progress bars and variance alerts keep you on track.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className=''>Healthy nudges for flexible adjustments.</p>
            </CardContent>
          </Card>

          <Card className='transition-shadow hover:shadow-lg'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Goal className='mr-2 h-6 w-6 text-purple-500' />
                Savings Goals
              </CardTitle>
              <CardDescription>
                Create goals like emergency funds with auto-updates and
                celebratory milestones to build security stress-free.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className=''>Visual progress that motivates.</p>
            </CardContent>
          </Card>

          <Card className='transition-shadow hover:shadow-lg'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <LineChart className='mr-2 h-6 w-6 text-orange-400' />
                Reports & Analysis
              </CardTitle>
              <CardDescription>
                Visualize trends with charts, compare periods, and export data.
                Gain insights without overwhelm.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className=''>Focus on progress, not perfection.</p>
            </CardContent>
          </Card>

          <Card className='transition-shadow hover:shadow-lg'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Zap className='mr-2 h-6 w-6 text-yellow-400' />
                Alerts & Tips
              </CardTitle>
              <CardDescription>
                Get gentle notifications for spending patterns and contextual
                tips to foster mindful habits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className=''>Empowering advice for balanced finances.</p>
            </CardContent>
          </Card>

          <Card className='transition-shadow hover:shadow-lg'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Lock className='mr-2 h-6 w-6 text-red-400' />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Encrypted data, minimal collection, and GDPR compliance. Your
                finances, your control.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className=''>
                Accessible across devices with offline support.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-secondary/80 px-6 py-16 text-center md:px-8 lg:px-16 xl:px-20'>
        <div className='container mx-auto'>
          <h3 className='mb-2 text-3xl font-bold'>
            Ready to Build Resilient Habits?
          </h3>
          <p className='mb-8 text-lg'>
            Join others taking charge of their finances with Nova.
          </p>
          <Button
            size='lg'
            asChild
            className='duration-200 ease-in-out hover:scale-105'
          >
            <Link href={'/auth/signup'}>
              Sign Up Free <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className='container mx-auto py-8 text-center text-gray-500'>
        <p>&copy; 2025 Nova. All rights reserved.</p>
        <nav className='mt-4 space-x-4'>
          <a href='/privacy' className='hover:underline'>
            Privacy
          </a>
          <a href='/terms' className='hover:underline'>
            Terms
          </a>
          <a href='/contact' className='hover:underline'>
            Contact
          </a>
        </nav>
      </footer>
    </div>
  );
}
