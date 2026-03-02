"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="glass p-8 text-center max-w-md mx-auto mt-20">
          <h2 className="text-2xl font-bold mb-4">Ops! Algo deu errado.</h2>
          <p className="text-gray-400 mb-6">Não foi possível carregar este conteúdo. Tente atualizar a página.</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
