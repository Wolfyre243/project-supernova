'use client';

import { signup } from './actions';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { objectToFormData } from '@/utils/formatters';
import { Eye, EyeClosed } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Image from 'next/image';

const formSchema = z.object({
  name: z
    .string({
      error: 'Invalid input',
    })
    .min(2, {
      error: 'Name must be at least 2 characters',
    })
    .max(100, {
      error: 'Name cannot exceed 100 characters',
    }),
  email: z.email(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain an uppercase letter' })
    .regex(/\d/, { message: 'Password must contain a digit' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain a special character',
    })
    .max(50, { message: 'Password cannot exceed 50 characters' }),
});

function SignUpForm({ className }: React.ComponentProps<'form'>) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // Remove useActionState, use only useForm/formState
  const { setError, formState } = form;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const formData = objectToFormData(data);

    // Call signup directly, mimic server action
    const result = await signup(formData);
    if (result && result.error) {
      toast.error(result.error);
      setError('root', { message: result.error });
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <div className='relative h-full w-full'>
            <Image
              src='https://images.unsplash.com/photo-1500245804862-0692ee1bbee8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJvcGljYWwlMjBzdW5zZXR8ZW58MHx8MHx8fDA%3D'
              alt='Image'
              fill
              className='h-full w-full object-cover dark:brightness-[0.5]'
            />
          </div>
          {/* TODO When doing google SSO might need to split this to button-level form actions */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-4 p-6 md:p-8'
            >
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Create an account</h1>
                <p className='text-muted-foreground text-balance'>
                  Take charge of your finance
                </p>
              </div>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John'
                        type='text'
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the name we will address you by.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* TODO: Live password validation */}
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

              <Button
                type='submit'
                className='w-full'
                disabled={formState.isSubmitting}
              >
                Sign Up
              </Button>
              {formState.errors.root && (
                <div className='text-destructive mt-2 text-sm'>
                  {formState.errors.root.message}
                </div>
              )}
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
                Already have an account?{' '}
                <a href='/auth/login' className='underline underline-offset-4'>
                  Login
                </a>
              </div>
            </form>
          </Form>
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

export default function SignUpPage() {
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
        <SignUpForm />
      </div>
    </div>
  );
}
