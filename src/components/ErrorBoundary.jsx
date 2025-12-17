import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center h-screen w-screen bg-[#0f172a] text-white p-8">
                    <div className="max-w-md bg-[#1e293b] rounded-xl border border-white/10 p-6 shadow-2xl">
                        <h1 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h1>
                        <p className="text-slate-300 text-sm mb-4">
                            The application encountered an unexpected error.
                        </p>
                        <div className="bg-black/50 p-3 rounded-lg overflow-auto max-h-48 mb-4">
                            <code className="text-xs font-mono text-slate-400 whitespace-pre-wrap">
                                {this.state.error && this.state.error.toString()}
                            </code>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
