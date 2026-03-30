import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Keep console output for debugging in production builds too.
    // eslint-disable-next-line no-console
    console.error("UI ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const message = this.state.error?.message || "Something went wrong.";
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-2xl bg-white/[0.03] border border-red-500/30 p-6">
          <div className="text-white font-semibold text-lg">Admin panel crashed</div>
          <div className="mt-2 text-sm text-red-300">{message}</div>
          <div className="mt-4 text-xs text-gray-400">
            Open browser DevTools Console to see the full error.
          </div>
        </div>
      </div>
    );
  }
}

