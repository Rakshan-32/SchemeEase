import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { darkMode = false } = this.props;

      return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
          <div className="max-w-md w-full text-center">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>

              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Something went wrong
              </h1>

              <p className="text-slate-600 dark:text-slate-300 mb-6">
                An unexpected error occurred. Please refresh the page or try again later.
              </p>

              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </button>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs bg-slate-100 dark:bg-slate-900 p-3 rounded overflow-auto text-red-600 dark:text-red-400">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
