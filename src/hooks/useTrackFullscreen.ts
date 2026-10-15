import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createTrackFullscreenController,
  type TrackFullscreenController,
  type TrackFullscreenState,
} from '../utils/trackFullscreen';

const inactiveState: TrackFullscreenState = {
  active: false,
  pending: false,
  mode: null,
  message: null,
};

export function useTrackFullscreen(onBeforeChange: () => void): TrackFullscreenState & { toggle: () => void } {
  const onBeforeChangeRef = useRef(onBeforeChange);
  onBeforeChangeRef.current = onBeforeChange;

  const controllerRef = useRef<TrackFullscreenController | null>(null);
  const [state, setState] = useState<TrackFullscreenState>(inactiveState);

  useEffect(() => {
    let mounted = true;
    const controller = createTrackFullscreenController({
      onStateChange: (nextState) => {
        if (mounted) setState(nextState);
      },
      onBeforeChange: () => {
        onBeforeChangeRef.current();
      },
    });

    controllerRef.current = controller;

    return () => {
      mounted = false;
      controller.destroy();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, []);

  const toggle = useCallback((): void => {
    const controller = controllerRef.current;
    if (controller) void controller.toggle();
  }, []);

  return { ...state, toggle };
}
