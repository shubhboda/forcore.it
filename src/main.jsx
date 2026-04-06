import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import RootErrorBoundary from "./components/RootErrorBoundary.jsx";
import App from "./App.jsx";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  document.body.innerHTML =
    '<p style="font-family:system-ui;padding:2rem;background:#0a0a0f;color:#f87171;">Missing #root in index.html.</p>';
} else {
  try {
    createRoot(rootEl).render(
      <RootErrorBoundary>
        {/* skipAnimations: avoid stuck initial opacity (blank dark screen) if motion never runs */}
        <MotionConfig reducedMotion="always" skipAnimations>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </MotionConfig>
      </RootErrorBoundary>
    );
  } catch (err) {
    console.error("Bootstrap error:", err);
    rootEl.innerHTML = `<div style="min-height:100vh;background:#0a0a0f;color:#f87171;font-family:system-ui;padding:2rem;max-width:560px;margin:0 auto"><h1 style="color:#fff;font-size:1.1rem;margin-bottom:.75rem">forcore.it failed to start</h1><pre style="white-space:pre-wrap;font-size:.875rem;line-height:1.5">${String(err?.message || err)}</pre><p style="color:#9ca3af;font-size:.875rem;margin-top:1rem">Try: stop the dev server, delete the <code style="color:#67e8f9">node_modules/.vite</code> folder, run <code style="color:#67e8f9">npm run dev</code> again, then hard refresh (Ctrl+Shift+R).</p></div>`;
  }
}
