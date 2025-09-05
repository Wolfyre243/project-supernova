'use client';

import { ChevronsDown, Plus } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from './ui/drawer';
import { Button } from './ui/button';

import { DialogTitle } from '@radix-ui/react-dialog';
import { cn } from '@/utils/cn';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useState } from 'react';
import { CategorySelector } from './category-select';
import { AccountSelector } from './account-select';
import {
  useCreateExpenseMutation,
  useCreateIncomeMutation,
} from '@/app/state/transaction/transactionsApi';
import { toast } from 'sonner';

const createTransactionFormSchema = z.object({
  categoryId: z.uuid().nonempty({
    error: 'Please select a category',
  }),
  accountId: z.uuid().nonempty({
    error: 'Please select an account',
  }),
  amount: z.coerce
    .number({
      error: 'Please enter an amount',
    })
    .gt(0, { message: 'Amount must be greater than 0' }),
  notes: z
    .string()
    .max(100, {
      error: 'Notes cannot exceed 100 characters',
    })
    .optional(),
});

export function CreateTransactionDrawer() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>(
    'expense',
  );
  // TODO: Merge income and expense into transaction
  const [createIncomeMutation] = useCreateIncomeMutation();
  const [createExpenseMutation] = useCreateExpenseMutation();

  const defaultValues = {
    categoryId: '',
    accountId: '',
    amount: 0.0,
    notes: '',
  };

  const form = useForm<z.input<typeof createTransactionFormSchema>>({
    resolver: zodResolver(createTransactionFormSchema),
    defaultValues,
  });

  const { setError, formState } = form;

  async function onSubmit(data: z.input<typeof createTransactionFormSchema>) {
    // Ensure amount is a number before passing to mutation
    const payload = {
      ...data,
      amount: data.amount as number,
      type: transactionType,
    };

    try {
      if (transactionType === 'income') await createIncomeMutation(payload);
      if (transactionType === 'expense') await createExpenseMutation(payload);

      setIsOpen(false);
      toast.success(`Recorded ${transactionType} successfully, good job!`, {
        position: 'top-center',
      });
    } catch (error: unknown) {
      // if (error instanceof APIError) {
      //   return setError('root', { message: error.message });
      // }
      console.error(error);
      return setError('root', { message: 'Something went wrong!' });
    } finally {
      form.reset(defaultValues);
    }
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      onClose={() => form.reset(defaultValues)}
      repositionInputs={false}
    >
      <DrawerTrigger asChild>
        <div className='bg-homepage-gradient h-fit w-fit rounded-full p-2'>
          <Plus className='size-8 bg-clip-content text-[#f9f9f9]' />
        </div>
      </DrawerTrigger>
      <DrawerContent className='min-h-5/6 w-full outline-0'>
        <DrawerHeader>
          <DialogTitle className='sr-only'>Add Transaction</DialogTitle>
          <div className='flex flex-row justify-around'>
            <button
              onClick={() => setTransactionType('income')}
              className={cn(
                'w-1/3 border-b-2 border-b-transparent py-1 text-center text-xl transition-colors duration-200 ease-in-out',
                transactionType === 'income'
                  ? 'border-b-green-400 font-semibold text-green-400'
                  : 'text-muted-foreground',
              )}
            >
              Income
            </button>
            <button
              onClick={() => setTransactionType('expense')}
              className={cn(
                'w-1/3 border-b-2 border-b-transparent py-1 text-center text-xl transition-colors duration-200 ease-in-out',
                transactionType === 'expense'
                  ? 'border-b-red-400 font-semibold text-red-400'
                  : 'text-muted-foreground',
              )}
            >
              Expense
            </button>
          </div>
        </DrawerHeader>
        <DrawerDescription className='sr-only'>
          Enter the amount you earned or spent today
        </DrawerDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex w-full flex-col items-center gap-4 p-4'
          >
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem className='flex w-2/3 flex-col'>
                  <FormLabel className='text-muted-foreground w-full justify-center'>
                    Amount
                  </FormLabel>
                  <FormControl>
                    <input
                      type='text'
                      inputMode='decimal'
                      pattern='^\$\s?\d*\.?\d*$'
                      className='flex w-full text-center text-3xl font-semibold outline-0'
                      placeholder='$0.00'
                      value={
                        typeof field.value === 'number' ||
                        typeof field.value === 'string'
                          ? `$ ${field.value === '' ? '' : field.value}`
                          : ''
                      }
                      onChange={(e) => {
                        // Remove leading "$ " (dollar sign and space)
                        const raw = e.target.value.replace(/^\$\s?/, '');
                        // Allow empty string, otherwise parse as number
                        field.onChange(raw === '' ? '' : raw);
                      }}
                    />
                  </FormControl>
                  <FormMessage className='text-center' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem className='flex w-2/3 flex-col'>
                  <FormControl>
                    <textarea
                      className='flex w-full resize-none text-center text-sm outline-0'
                      rows={1}
                      maxLength={100}
                      placeholder='Add note'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-center' />
                </FormItem>
              )}
            />

            <div className='flex w-full flex-col items-center justify-center'>
              {/* Category Selection */}
              <FormField
                control={form.control}
                name='categoryId'
                render={({ field }) => (
                  <FormItem className='w-3/4 max-w-5/6'>
                    <FormLabel className='text-muted-foreground'>
                      Category
                    </FormLabel>
                    <CategorySelector
                      onValueChange={field.onChange}
                      transactionType={transactionType}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ChevronsDown
                size={32}
                className={cn(
                  'transition-all duration-200',
                  transactionType === 'income'
                    ? 'text-green-400'
                    : 'rotate-180 text-red-400',
                )}
              />
              <FormField
                control={form.control}
                name='accountId'
                render={({ field }) => (
                  <FormItem className='w-3/4 max-w-5/6'>
                    <FormLabel className='text-muted-foreground'>
                      Account
                    </FormLabel>
                    <AccountSelector onValueChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type='submit'
              className='text-md w-2/3 rounded-full'
              disabled={formState.isSubmitting}
            >
              Add
            </Button>
            <DrawerClose className='w-2/3 rounded-full text-sm'>
              Close
            </DrawerClose>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
