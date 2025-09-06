'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { CircleX, Edit2, PiggyBank, Plus, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/utils/cn';
import { useState } from 'react';
import z from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { IconMap } from '@/config/iconMap';
import { IconSelector } from '../icon-select';
import { ColorSelector } from '../color-select';
import { useCreateAccountMutation } from '@/app/state/account/accountsApi';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z
    .string({
      error: 'Invalid input',
    })
    .min(1, {
      error: 'Name cannot be empty.',
    })
    .max(100, {
      error: 'Name cannot exceed 100 characters',
    }),
  description: z
    .string()
    .max(100, {
      error: 'Description cannot exceed 100 characters',
    })
    .optional(),
  icon: z.string(),
  color: z.string().length(7).lowercase(), // e.g. #FFFFFF
  isSavings: z.boolean(),
});

function NewAccountForm({ setIsOpen }: { setIsOpen: (bool: boolean) => void }) {
  const [createAccountMutation] = useCreateAccountMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      icon: 'CreditCard',
      color: '#f9f9f9',
      isSavings: false,
    },
  });

  const { setError, formState } = form;
  const watchName = useWatch({
    control: form.control,
    name: 'name',
    defaultValue: 'My Account',
  });
  const watchIcon = useWatch({
    control: form.control,
    name: 'icon',
  });
  const watchColor = useWatch({
    control: form.control,
    name: 'color',
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await createAccountMutation(data);
      setIsOpen(false);
      toast.success(`Created account successfully!`, {
        position: 'top-center',
      });
    } catch (error) {
      console.error(error);
      return setError('root', { message: 'Something went wrong!' });
    } finally {
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full flex-col gap-4'
        noValidate
      >
        <div className='flex w-full flex-row justify-center'>
          <div className='flex w-3/4 flex-col gap-2 rounded-xl border-2 p-4 md:w-1/2'>
            <div
              className='flex w-fit flex-row items-center justify-center rounded-full p-2'
              style={{ backgroundColor: watchColor }}
            >
              {(() => {
                const SelectedIcon = IconMap[watchIcon];
                return SelectedIcon ? (
                  <SelectedIcon className='text-card size-4' />
                ) : null;
              })()}
            </div>
            <div>
              <h2 className='text-muted-foreground max-w-full truncate text-base'>
                {watchName === '' ? 'My Account' : watchName}
              </h2>
              <h1 className='text-2xl font-semibold'>$0</h1>
            </div>
          </div>
        </div>

        {formState.errors.root && (
          <div className='text-destructive w-full text-center text-sm'>
            <span>An error occurred while creating a new accounteeeee</span>
          </div>
        )}

        <div className='flex w-full flex-row items-center justify-center gap-2'>
          {/* Select Icon */}
          <FormField
            control={form.control}
            name='icon'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <IconSelector onValueChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='color'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ColorSelector onValueChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='My Account'
                  type='text'
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  maxLength={100}
                  placeholder='Add a description...'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='isSavings'
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <div className='flex flex-row items-center gap-2'>
                  <span className='text-sm font-medium'>Savings Account?</span>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              </FormControl>
              <FormDescription>
                A savings account enables you to start savings goals, keeping
                track of your wealth!
              </FormDescription>
            </FormItem>
          )}
        />

        <Button
          type='submit'
          size={'lg'}
          className='w-fit self-center rounded-full'
        >
          Create Account
        </Button>
      </form>
    </Form>
  );
}

// Consider adapting to a drawer component in the future
// Or add more features to the account entity and display as a separate creation page
export function NewAccountButton() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size={'icon'}
          variant={'ghost'}
          className='h-fit w-fit cursor-pointer hover:bg-transparent dark:hover:bg-transparent'
        >
          <Plus className='size-5' />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          isMobile &&
            'h-screen max-h-screen max-w-screen min-w-screen rounded-none',
          'flex flex-col',
          '[&>button:last-child]:hidden',
        )}
      >
        <DialogTitle className='flex h-fit flex-row justify-between'>
          <span>Add Account</span>
          <Button
            size={'icon'}
            variant={'ghost'}
            className='h-fit w-fit outline-0 hover:bg-none dark:hover:bg-transparent'
            onClick={() => setIsOpen(false)}
          >
            <X className='size-5' />
          </Button>
        </DialogTitle>
        <DialogDescription className='sr-only'>
          Create a new spending / savings account to track spending
        </DialogDescription>
        <div className='mt-8 flex h-full w-full flex-col'>
          <NewAccountForm setIsOpen={setIsOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
