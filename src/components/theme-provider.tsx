'use client';

import React, { useEffect } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { Button } from './ui/button';
import { MoonStar, Sun } from 'lucide-react';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ThemeToggler() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant='ghost'
      size='icon'
      className='cursor-pointer rounded-full hover:bg-transparent dark:hover:bg-transparent'
      aria-label='Toggle theme'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun className='size-4' /> : <MoonStar className='size-4' />}
    </Button>
  );
}

import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

export function ThemeToggleBar() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <ToggleGroup
      type='single'
      value={resolvedTheme}
      onValueChange={(val) => val && setTheme(val)}
      aria-label='Toggle theme'
      variant='outline'
      size='sm'
    >
      <ToggleGroupItem
        value='light'
        aria-label='Light theme'
        className='rounded-l-full'
      >
        <Sun className='size-4' />
      </ToggleGroupItem>
      <ToggleGroupItem value='dark' aria-label='Dark theme'>
        <MoonStar className='size-4' />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
