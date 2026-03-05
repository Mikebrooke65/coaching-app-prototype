import { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

const DESKTOP_BREAKPOINT = 768;

export function useResponsive() {
  const { isDesktopLayout, setDesktopLayout } = useAppStore();

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
      setDesktopLayout(isDesktop);
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setDesktopLayout]);

  return {
    isDesktop: isDesktopLayout,
    isMobile: !isDesktopLayout,
    breakpoint: DESKTOP_BREAKPOINT,
  };
}
