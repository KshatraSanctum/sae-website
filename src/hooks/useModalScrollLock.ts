import { useEffect, type RefObject } from 'react';

interface ModalScrollLockOptions {
  readonly scrollableSelector?: string;
}

/** Lock page scrolling while preserving scrolling inside a modal's details area. */
export function useModalScrollLock(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  options: ModalScrollLockOptions = {},
): void {
  const { scrollableSelector } = options;

  useEffect(() => {
    if (!active) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const container = containerRef.current;

    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const handleWheel = (event: WheelEvent): void => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const scrollable = scrollableSelector
        ? target?.closest(scrollableSelector)
        : null;

      if (scrollable instanceof HTMLElement) {
        const canScroll = scrollable.scrollHeight > scrollable.clientHeight;
        const isAtTop = scrollable.scrollTop <= 0 && event.deltaY < 0;
        const isAtBottom =
          scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1 &&
          event.deltaY > 0;

        if (canScroll && !isAtTop && !isAtBottom) {
          return;
        }
      }

      event.preventDefault();
      event.stopPropagation();
    };

    const handleTouchMove = (event: TouchEvent): void => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const scrollable = scrollableSelector ? target?.closest(scrollableSelector) : null;
      if (!(scrollable instanceof HTMLElement)) {
        event.preventDefault();
      }
    };

    container?.addEventListener('wheel', handleWheel, { passive: false });
    container?.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      container?.removeEventListener('wheel', handleWheel);
      container?.removeEventListener('touchmove', handleTouchMove);
    };
  }, [active, containerRef, scrollableSelector]);
}
