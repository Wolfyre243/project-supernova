'use client';

import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import Link from 'next/link';
import { InstallPromptModal } from '../install-prompt-modal';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { useState } from 'react';
import { DownloadIcon } from 'lucide-react';
import { ThemeToggler } from '../theme-provider';

export function LandingPageDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='ring-0 outline-0'>
        <Image
          src='/logo.svg' // Path relative to public directory
          alt='Nova Logo'
          width={40} // Set your desired width
          height={40} // Set your desired height
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'start'} alignOffset={-10} className='mt-1'>
        <DropdownMenuItem>
          <Link href={'#features'} scroll={true}>
            Features
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={'#pricing'} scroll={true}>
            Pricing
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          Theme
          <ThemeToggler />
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
