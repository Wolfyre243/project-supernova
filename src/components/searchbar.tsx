'use client';

import React from 'react';
import { Search } from 'lucide-react';
import {
  ShortcutBadge,
  ShortcutBadgeGroup,
  ShortcutPlusBadge,
} from './shortcut-badges';
import { useEffect, useRef, useState } from 'react';

export function SearchBar() {
  const searchInputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check for Ctrl+F (or Cmd+F on Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault(); // Prevent the browser's default find behavior
        if (searchInputRef.current) {
          // TODO: Display search ui here too when user is searching
          (searchInputRef.current as HTMLInputElement).focus(); // Focus the search input
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // TODO: Implement search functionality
  return (
    <search className='text-muted-foreground flex h-fit w-1/3 flex-row items-center gap-3 rounded-xl border px-3 py-1 transition-all duration-200'>
      <Search className='size-4 flex-shrink-0' />
      <input
        name='searchTerm'
        type='text'
        placeholder={isFocused ? '' : 'Search'}
        className='placeholder:text-muted-foreground w-full text-sm outline-0'
        ref={searchInputRef}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div
        className={`transition-opacity duration-200 ${isFocused ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      >
        <ShortcutBadgeGroup>
          <ShortcutBadge>Ctrl</ShortcutBadge>
          <ShortcutPlusBadge />
          <ShortcutBadge>F</ShortcutBadge>
        </ShortcutBadgeGroup>
      </div>
    </search>
  );
}
