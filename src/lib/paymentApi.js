/**
 * Base URL for the payments API. In development, leave empty to use the Vite proxy (`/api` → localhost:3001).
 * In production, set `VITE_PAYMENT_API_BASE` to your API origin if it differs from the site (e.g. https://api.example.com).
 */
export function getPaymentApiBase() {
  const raw = (import.meta.env.VITE_PAYMENT_API_BASE || "").trim();
  return raw.replace(/\/$/, "");
}

export function paymentApiUrl(path) {
  const base = getPaymentApiBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}
