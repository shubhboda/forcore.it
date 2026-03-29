import { Component } from "react";

export default class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("RootErrorBoundary:", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const message = this.state.error?.message || "Something went wrong.";
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0f",
          color: "#e5e7eb",
          padding: "2rem",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <h1 style={{ color: "#fff", fontSize: "1.25rem", marginBottom: "0.75rem" }}>
            forcore.it — app error
          </h1>
          <p style={{ color: "#f87171", marginBottom: "1rem", lineHeight: 1.5 }}>{message}</p>
          <p style={{ fontSize: "0.875rem", color: "#9ca3af", marginBottom: "1rem", lineHeight: 1.5 }}>
            Try a hard refresh (Ctrl+Shift+R). If you use <code style={{ color: "#67e8f9" }}>.env</code>,
            restart <code style={{ color: "#67e8f9" }}>npm run dev</code>. Clear Vite cache: delete{" "}
            <code style={{ color: "#67e8f9" }}>node_modules/.vite</code> then start again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 8,
              border: "1px solid #22d3ee",
              background: "transparent",
              color: "#22d3ee",
              cursor: "pointer",
            }}
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
