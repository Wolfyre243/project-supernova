import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}

function getPWADisplayMode() {
  if (document.referrer.startsWith('android-app://')) {
    return 'twa'; // Trusted Web Activity
  }
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'standalone';
  }
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return 'fullscreen';
  }
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    return 'minimal-ui';
  }
  if (window.matchMedia('(display-mode: browser)').matches) {
    return 'browser'; // Standard browser tab
  }
  return 'unknown';
}

export function useIsPWA() {
  const [isPWA, setIsPWA] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const displayMode = getPWADisplayMode();
    if (
      displayMode === 'standalone' ||
      displayMode === 'fullscreen' ||
      displayMode === 'minimal-ui'
    ) {
      setIsPWA(true);
    } else {
      setIsPWA(false);
    }
  }, [setIsPWA]);

  return !!isPWA;
}
