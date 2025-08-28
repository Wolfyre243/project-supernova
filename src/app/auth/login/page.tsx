'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Eye, EyeClosed } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { createClient } from '@/utils/supabase/client';
import useAuth from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { Roles } from '@/config/authConfig';

const formSchema = z.object({
  email: z.email(),
  password: z.string(),
});

function LoginForm({ className }: React.ComponentProps<'form'>) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setUserId, setRole } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { setError, formState } = form;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message || 'Login failed');
      setError('root', { message: error.message || 'Login failed' });
      return;
    }

    const { data: jwtData, error: userError } = await supabase.auth.getClaims();
    const user_role = (
      jwtData?.claims as { user_role?: Roles; sub?: string } | null
    )?.user_role;

    if (userError || !jwtData) {
      toast.error('Something went wrong!');
      setError('root', {
        message: 'Something went wrong!',
      });
      return;
    }

    setUserId(jwtData.claims.sub);
    setRole(user_role ?? null);
    redirect('/account');
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          {/* TODO When doing google SSO might need to split this to button-level form actions */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-4 p-6 md:p-8'
            >
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Welcome back</h1>
                <p className='text-muted-foreground text-balance'>
                  Login to your Nova account
                </p>
              </div>

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='johndoe@example.com'
                        type='email'
                        required
                        autoComplete='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <div className='flex w-full flex-row items-end gap-2'>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=''
                            type={showPassword ? 'text' : 'password'}
                            required
                            autoComplete='password'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='button'
                    variant={'default'}
                    size={'icon'}
                    className='text-accent-foreground cursor-pointer bg-transparent px-2 py-1 hover:bg-transparent'
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </Button>
                </div>
                <a
                  href='#'
                  className='text-sm underline-offset-2 hover:underline'
                >
                  Forgot your password?
                </a>
              </div>

              <Button
                type='submit'
                className='w-full'
                disabled={formState.isSubmitting}
              >
                Login
              </Button>

              <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                <span className='bg-card text-muted-foreground relative z-10 px-2'>
                  Or
                </span>
              </div>

              <div className=''>
                <Button variant='outline' type='button' className='w-full'>
                  <FcGoogle />
                  <span className=''>Continue with Google</span>
                </Button>
              </div>
              <div className='text-center text-sm'>
                Don&apos;t have an account?{' '}
                <a href='/auth/signup' className='underline underline-offset-4'>
                  Sign up
                </a>
              </div>
            </form>
          </Form>
          <div className='relative h-full w-full'>
            <Image
              src='https://images.unsplash.com/photo-1500245804862-0692ee1bbee8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJvcGljYWwlMjBzdW5zZXR8ZW58MHx8MHx8fDA%3D'
              alt='Image'
              fill
              className='h-full w-full object-cover dark:brightness-[0.5]'
            />
          </div>
        </CardContent>
      </Card>
      {/* TODO: Set real ToS and PP once done */}
      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { userId, loading } = useAuth();

  // Redirect if authenticated
  if (!loading && userId) {
    redirect('/home');
  }

  if (loading) {
    // Optionally, show a spinner or nothing while loading
    return null;
  }

  return (
    <div className='flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        {/* <Link href={'/'}>
          <p className='text-muted-foreground/80 text-sm'>← Back to Website</p>
        </Link> */}
        <LoginForm />
      </div>
    </div>
  );
}
