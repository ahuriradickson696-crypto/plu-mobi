import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // In production send to Sentry / server; here we log.
    console.error("App crash:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <main
          role="alert"
          aria-live="assertive"
          className="min-h-[60vh] flex items-center justify-center px-4"
        >
          <div className="max-w-md text-center bg-white border border-red-200 rounded-2xl p-6 shadow-md">
            <h1 className="text-xl font-extrabold text-plu-black mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-plu-slate mb-4">
              The page crashed. You can reload, or go back home - your data is safe
              and queued actions are not lost.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-plu-black text-white font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-black/40"
              >
                Reload page
              </button>
              <a
                href="/"
                className="min-h-[44px] px-4 py-2 rounded-xl bg-plu-yellow text-plu-black font-semibold inline-flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-plu-yellow/60"
              >
                Go to Home
              </a>
            </div>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
