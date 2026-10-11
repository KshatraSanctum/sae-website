import React from 'react';

export const RouteLoadingFallback: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '2px solid rgba(246, 183, 25, 0.2)',
          borderTopColor: 'var(--color-signal)',
          animation: 'spin 0.75s linear infinite',
        }}
      ></div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
