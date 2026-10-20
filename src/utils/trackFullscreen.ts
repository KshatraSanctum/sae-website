export type TrackFullscreenMode = 'native' | 'expanded' | null;

export interface TrackFullscreenState {
  active: boolean;
  pending: boolean;
  mode: TrackFullscreenMode;
  message: string | null;
}

export interface TrackFullscreenControllerOptions {
  target?: Element | null;
  onStateChange: (state: TrackFullscreenState) => void;
  onBeforeChange: () => void;
}

export interface TrackFullscreenController {
  getState: () => TrackFullscreenState;
  toggle: () => Promise<void>;
  destroy: () => void;
}

const ROOT_ATTRIBUTE = 'data-track-fullscreen';

const NATIVE_UNSUPPORTED_MESSAGE =
  'Native fullscreen is not supported here; using the expanded browser view. Browser chrome may remain visible.';
const NATIVE_REQUEST_FAILED_MESSAGE =
  'Native fullscreen was unavailable or denied; using the expanded browser view. Browser chrome may remain visible.';
const NATIVE_REQUEST_NO_EFFECT_MESSAGE =
  'Native fullscreen did not start; using the expanded browser view. Browser chrome may remain visible.';
const NATIVE_EXIT_FAILED_MESSAGE =
  'Native fullscreen could not exit. Press Escape, use the browser controls, or try again.';

const initialState = (): TrackFullscreenState => ({
  active: false,
  pending: false,
  mode: null,
  message: null,
});

interface ScrollSnapshot {
  left: number;
  top: number;
}

function getDocument(): Document | null {
  return typeof document === 'undefined' ? null : document;
}

function getWindow(doc: Document | null): Window | null {
  if (doc?.defaultView) return doc.defaultView;
  return typeof window === 'undefined' ? null : window;
}

function finiteOrZero(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export function createTrackFullscreenController(
  options: TrackFullscreenControllerOptions,
): TrackFullscreenController {
  const doc = getDocument();
  const root = doc?.documentElement ?? null;
  const target = options.target ?? root;
  const win = getWindow(doc);

  let state = initialState();
  let destroyed = false;
  let nativeOwned = false;
  let expectedNativeExit = false;

  let nextEntryAttempt = 0;
  let nativeEntryAttempt: number | null = null;
  let nativeEntryResolve: (() => void) | null = null;

  let nextExitAttempt = 0;
  let nativeExitAttempt: number | null = null;
  let nativeExitResolve: (() => void) | null = null;

  let rootAttributeCaptured = false;
  let previousRootAttribute: string | null = null;
  let scrollCaptured = false;
  let scrollSnapshot: ScrollSnapshot | null = null;
  let destroyedExitRequested = false;

  const getFullscreenElement = (): Element | null => {
    if (!doc) return null;
    try {
      return doc.fullscreenElement ?? null;
    } catch {
      return null;
    }
  };

  const emitState = (next: TrackFullscreenState): void => {
    if (destroyed) return;
    if (
      state.active === next.active &&
      state.pending === next.pending &&
      state.mode === next.mode &&
      state.message === next.message
    ) {
      return;
    }
    state = next;
    options.onStateChange({ ...next });
  };

  const notifyBeforeChange = (): void => {
    options.onBeforeChange();
  };

  const captureRootAttribute = (): void => {
    if (rootAttributeCaptured || !root) return;

    rootAttributeCaptured = true;
    try {
      previousRootAttribute = root.getAttribute(ROOT_ATTRIBUTE);
    } catch {
      previousRootAttribute = null;
    }
  };

  const captureScroll = (): void => {
    if (scrollCaptured) return;

    scrollCaptured = true;
    scrollSnapshot = {
      left: finiteOrZero(win?.scrollX ?? win?.pageXOffset),
      top: finiteOrZero(win?.scrollY ?? win?.pageYOffset),
    };
  };

  const captureEntryEnvironment = (): void => {
    captureRootAttribute();
    captureScroll();
  };

  const setRootAttributeActive = (): void => {
    if (!root) return;
    try {
      root.setAttribute(ROOT_ATTRIBUTE, 'true');
    } catch {
      // A detached or test-only document can reject attribute writes.
    }
  };

  const restoreScroll = (snapshot: ScrollSnapshot | null): void => {
    if (!snapshot || !win || typeof win.scrollTo !== 'function') return;

    try {
      win.scrollTo({ left: snapshot.left, top: snapshot.top, behavior: 'instant' });
    } catch {
      try {
        win.scrollTo(snapshot.left, snapshot.top);
      } catch {
        // Scroll restoration is best effort when the host does not expose it.
      }
    }
  };

  const restoreEntryEnvironment = (): void => {
    if (root && rootAttributeCaptured) {
      try {
        if (previousRootAttribute === null) {
          root.removeAttribute(ROOT_ATTRIBUTE);
        } else {
          root.setAttribute(ROOT_ATTRIBUTE, previousRootAttribute);
        }
      } catch {
        // Keep fullscreen lifecycle cleanup independent from attribute support.
      }
    }

    if (scrollCaptured) restoreScroll(scrollSnapshot);
    rootAttributeCaptured = false;
    previousRootAttribute = null;
    scrollCaptured = false;
    scrollSnapshot = null;
  };

  const nativeEntrySupported = (): boolean => {
    if (!doc || !target || typeof target.requestFullscreen !== 'function') return false;
    return doc.fullscreenEnabled !== false;
  };

  const resolveNativeEntry = (): void => {
    const resolve = nativeEntryResolve;
    nativeEntryResolve = null;
    resolve?.();
  };

  const resolveNativeExit = (): void => {
    const resolve = nativeExitResolve;
    nativeExitResolve = null;
    resolve?.();
  };

  const enterExpanded = (message: string): void => {
    if (destroyed) return;

    nativeEntryAttempt = null;
    nativeOwned = false;
    captureEntryEnvironment();
    setRootAttributeActive();
    emitState({ active: true, pending: false, mode: 'expanded', message });
    resolveNativeEntry();
  };

  const enterNative = (): void => {
    if (destroyed) return;

    nativeEntryAttempt = null;
    nativeOwned = true;
    captureEntryEnvironment();
    setRootAttributeActive();
    emitState({ active: true, pending: false, mode: 'native', message: null });
    resolveNativeEntry();
  };

  const leaveActiveState = (): void => {
    nativeEntryAttempt = null;
    nativeOwned = false;
    expectedNativeExit = false;
    nativeExitAttempt = null;
    restoreEntryEnvironment();
    emitState(initialState());
    resolveNativeEntry();
    resolveNativeExit();
  };

  const failNativeExit = (attempt: number): void => {
    if (destroyed || nativeExitAttempt !== attempt) return;

    // A host may reject the promise after it has already left fullscreen. The
    // actual element is authoritative, so do not report a stale failure.
    if (getFullscreenElement() !== target) {
      leaveActiveState();
      return;
    }

    nativeExitAttempt = null;
    expectedNativeExit = false;
    emitState({
      active: true,
      pending: false,
      mode: 'native',
      message: NATIVE_EXIT_FAILED_MESSAGE,
    });
    resolveNativeExit();
  };

  const finishNativeExit = (): void => {
    if (destroyed) return;
    leaveActiveState();
  };

  const settleNativeEntry = (attempt: number, failureMessage: string | null): void => {
    if (destroyed) {
      // A rejected request must not tear down a fullscreen session that was
      // established by some other owner while this request was pending.
      if (
        failureMessage === null &&
        getFullscreenElement() === target &&
        doc?.exitFullscreen &&
        !destroyedExitRequested
      ) {
        destroyedExitRequested = true;
        try {
          void doc.exitFullscreen();
        } catch {
          // The controller is already destroyed; there is no state to revive.
        }
      }
      return;
    }

    if (nativeEntryAttempt !== attempt) return;
    nativeEntryAttempt = null;

    if (failureMessage === null && getFullscreenElement() === target) {
      enterNative();
      return;
    }

    enterExpanded(failureMessage ?? NATIVE_REQUEST_NO_EFFECT_MESSAGE);
  };

  const requestNativeEntry = async (): Promise<void> => {
    if (!target || !doc) {
      enterExpanded(NATIVE_UNSUPPORTED_MESSAGE);
      return;
    }

    const attempt = ++nextEntryAttempt;
    nativeEntryAttempt = attempt;
    emitState({ active: false, pending: true, mode: null, message: null });

    const completion = new Promise<void>((resolve) => {
      nativeEntryResolve = resolve;
    });

    let requestResult: Promise<void> | undefined;
    try {
      requestResult = target.requestFullscreen();
    } catch {
      settleNativeEntry(attempt, NATIVE_REQUEST_FAILED_MESSAGE);
      return completion;
    }

    void Promise.resolve(requestResult).then(
      () => settleNativeEntry(attempt, null),
      () => settleNativeEntry(attempt, NATIVE_REQUEST_FAILED_MESSAGE),
    );

    await completion;
  };

  const requestNativeExit = async (): Promise<void> => {
    notifyBeforeChange();
    if (destroyed) return;

    const actualFullscreenElement = getFullscreenElement();
    if (!nativeOwned || actualFullscreenElement !== target) {
      finishNativeExit();
      return;
    }

    expectedNativeExit = true;
    const attempt = ++nextExitAttempt;
    nativeExitAttempt = attempt;
    emitState({ active: true, pending: true, mode: 'native', message: null });

    const completion = new Promise<void>((resolve) => {
      nativeExitResolve = resolve;
    });

    if (typeof doc?.exitFullscreen !== 'function') {
      failNativeExit(attempt);
      await completion;
      return;
    }

    let exitResult: Promise<void> | undefined;
    try {
      exitResult = doc.exitFullscreen();
    } catch {
      failNativeExit(attempt);
      await completion;
      return;
    }

    void Promise.resolve(exitResult).then(
      () => {
        if (nativeExitAttempt !== attempt || destroyed) return;
        if (getFullscreenElement() !== target) {
          finishNativeExit();
        } else {
          failNativeExit(attempt);
        }
      },
      () => failNativeExit(attempt),
    );

    await completion;
  };

  const toggle = async (): Promise<void> => {
    if (destroyed || state.pending) return;

    if (state.mode === 'expanded') {
      notifyBeforeChange();
      if (!destroyed) leaveActiveState();
      return;
    }

    if (state.mode === 'native') {
      await requestNativeExit();
      return;
    }

    notifyBeforeChange();
    if (destroyed) return;

    captureEntryEnvironment();
    const actualFullscreenElement = getFullscreenElement();
    if (!nativeEntrySupported()) {
      enterExpanded(NATIVE_UNSUPPORTED_MESSAGE);
      return;
    }

    // Never take ownership of an existing fullscreen session that was started
    // by another feature or controller.
    if (actualFullscreenElement !== null) {
      enterExpanded(
        'Browser fullscreen is already in use; using the expanded browser view. Browser chrome may remain visible.',
      );
      return;
    }

    await requestNativeEntry();
  };

  const handleFullscreenChange = (): void => {
    if (destroyed) return;

    const actualFullscreenElement = getFullscreenElement();
    if (nativeEntryAttempt !== null) {
      if (actualFullscreenElement === target) enterNative();
      return;
    }

    if (state.mode === 'native' && nativeOwned && actualFullscreenElement !== target) {
      if (!expectedNativeExit) notifyBeforeChange();
      if (!destroyed) finishNativeExit();
    }
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && state.mode === 'expanded' && !state.pending) {
      void toggle();
    }
  };

  if (doc && typeof doc.addEventListener === 'function') {
    doc.addEventListener('fullscreenchange', handleFullscreenChange);
    doc.addEventListener('keydown', handleKeyDown);
  }

  const destroy = (): void => {
    if (destroyed) return;
    destroyed = true;

    if (doc && typeof doc.removeEventListener === 'function') {
      doc.removeEventListener('fullscreenchange', handleFullscreenChange);
      doc.removeEventListener('keydown', handleKeyDown);
    }

    const shouldExitOwnedNative = nativeOwned && getFullscreenElement() === target;
    if (shouldExitOwnedNative && typeof doc?.exitFullscreen === 'function') {
      destroyedExitRequested = true;
      try {
        void doc.exitFullscreen();
      } catch {
        // There is no mounted consumer left to report the failure to.
      }
    }

    nativeEntryAttempt = null;
    nativeExitAttempt = null;
    expectedNativeExit = false;
    nativeOwned = false;
    resolveNativeEntry();
    resolveNativeExit();
    restoreEntryEnvironment();
  };

  return {
    getState: () => ({ ...state }),
    toggle,
    destroy,
  };
}
