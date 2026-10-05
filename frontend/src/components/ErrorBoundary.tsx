import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui';
import { Icon } from './Icon';

interface Props {
  children: ReactNode;
  fallbackScreen?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[NexusErrorBoundary] Error capturado:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            display: 'grid',
            placeItems: 'center',
            marginBottom: '20px'
          }}>
            <Icon name="x" size={32}/>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e1b4b', marginBottom: '8px' }}>
            Algo no cargó como esperábamos
          </h2>
          <p style={{ maxWidth: '480px', color: '#6b7280', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            Ocurrió un detalle técnico temporal en esta vista. Puedes recargar o regresar al inicio de la plataforma.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button onClick={() => { this.setState({ hasError: false }); if (this.props.onReset) this.props.onReset(); }}>
              Reintentar
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Recargar página
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
