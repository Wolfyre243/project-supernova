'use client';

import { DownloadIcon } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './ui/dialog';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

export function InstallPromptModal({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [prompt, setPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event);

      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsOpen(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = () => {
    if (prompt) {
      prompt.prompt();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className={cn(className)}>
        <Button variant={'ghost'}>
          <DownloadIcon />
          Install
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install Nova?</DialogTitle>
          <DialogDescription>
            Install Nova on your device to gain access to your financial manager
            directly from your homescreen!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type='button' variant={'outline'} onClick={handleInstall}>
            Install!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
