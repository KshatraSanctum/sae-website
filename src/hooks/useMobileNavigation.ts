import { useCallback, useEffect, useState } from 'react';

export interface MobileNavigationState {
  readonly isOpen: boolean;
  readonly toggle: () => void;
  readonly close: () => void;
}

/** Keeps mobile navigation behavior out of the navbar's presentation markup. */
export function useMobileNavigation(pathname: string): MobileNavigationState {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback((): void => {
    setIsOpen((current) => !current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  useEffect(() => {
    close();
  }, [close, pathname]);

  return { isOpen, toggle, close };
}
