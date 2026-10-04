import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in CampusPulse:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090d16', color: '#fff', fontFamily: 'sans-serif', padding: '24px' }}>
          <div style={{ maxWidth: '480px', width: '100%', background: '#0f172a', padding: '32px', borderRadius: '16px', border: '1px solid #1e293b', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#f87171' }}>CampusPulse Portal Notice</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
              {this.state.error?.message || 'A runtime issue occurred while rendering the portal.'}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);
