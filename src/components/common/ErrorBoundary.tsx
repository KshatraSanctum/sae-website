import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?:
    | ReactNode
    | ((error: Error, reset: () => void) => ReactNode);
  readonly onReset?: () => void;
}

interface ErrorBoundaryState {
  readonly error: Error | null;
}

const normalizeError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  return new Error('An unexpected application error occurred.');
};

const reloadPage = (): void => {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

const DefaultErrorFallback = ({ onRetry }: { readonly onRetry: () => void }): ReactNode => (
  <main
    role="alert"
    style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: '2rem',
      background: '#101010',
      color: '#f7f7f7',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}
  >
    <section style={{ maxWidth: '34rem' }}>
      <p style={{ margin: '0 0 0.75rem', color: '#f6b719', fontWeight: 700 }}>SAE INDIA · BIT SINDRI</p>
      <h1 style={{ margin: '0 0 1rem', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>
        Something went wrong
      </h1>
      <p style={{ margin: '0 0 1.5rem', lineHeight: 1.6, color: '#c9c9c9' }}>
        The application could not render this view. You can try again or reload the page to recover.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={onRetry}
          style={{
            cursor: 'pointer',
            border: '1px solid #f6b719',
            borderRadius: '999px',
            padding: '0.7rem 1.2rem',
            background: '#f6b719',
            color: '#101010',
            fontWeight: 700,
          }}
        >
          Try again
        </button>
        <button
          type="button"
          onClick={reloadPage}
          style={{
            cursor: 'pointer',
            border: '1px solid #666',
            borderRadius: '999px',
            padding: '0.7rem 1.2rem',
            background: 'transparent',
            color: '#f7f7f7',
            fontWeight: 700,
          }}
        >
          Reload page
        </button>
      </div>
    </section>
  </main>
);

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error: normalizeError(error) };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unhandled render error', error, errorInfo);
  }

  private readonly reset = (): void => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (!this.state.error) {
      return this.props.children;
    }

    if (typeof this.props.fallback === 'function') {
      return this.props.fallback(this.state.error, this.reset);
    }

    return this.props.fallback ?? <DefaultErrorFallback onRetry={this.reset} />;
  }
}
