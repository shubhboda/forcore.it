import { useCallback, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { CreditCard, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { paymentApiUrl } from "../lib/paymentApi";

const DEFAULT_INR = Number(import.meta.env.VITE_PAYMENT_DEFAULT_INR || "499");
const DEFAULT_USD = Number(import.meta.env.VITE_PAYMENT_DEFAULT_USD || "6");

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Razorpay script failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = RAZORPAY_SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Razorpay script failed"));
    document.body.appendChild(s);
  });
}

export default function PayNow() {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [amount, setAmount] = useState(String(DEFAULT_INR));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const onCurrencyChange = (next) => {
    setCurrency(next);
    setAmount(String(next === "INR" ? DEFAULT_INR : DEFAULT_USD));
    setError("");
    setSuccess(null);
  };

  const handlePay = useCallback(async () => {
    setError("");
    setSuccess(null);
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    setBusy(true);
    try {
      await loadRazorpayScript();

      const createRes = await fetch(paymentApiUrl("/api/payments/create-order"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency, amount: num }),
      });
      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok) {
        throw new Error(createData.error || "Could not start payment.");
      }

      const { orderId, amount: amountMinor, currency: orderCurrency, keyId } = createData;
      if (!orderId || !keyId) {
        throw new Error("Invalid response from payment server.");
      }

      await new Promise((resolve) => {
        const rzp = new window.Razorpay({
          key: keyId,
          amount: amountMinor,
          currency: orderCurrency,
          order_id: orderId,
          name: "forcore.it",
          description: `Payment (${orderCurrency})`,
          theme: { color: "#06b6d4" },
          handler: async (response) => {
            try {
              const verifyRes = await fetch(paymentApiUrl("/api/payments/verify"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json().catch(() => ({}));
              if (!verifyRes.ok) {
                throw new Error(verifyData.error || "Verification failed.");
              }
              setSuccess({
                message: verifyData.message || "Payment successful.",
                paymentId: verifyData.paymentId,
                orderId: verifyData.orderId,
                currency: verifyData.currency,
                amountMinor: verifyData.amountMinor,
                status: verifyData.status,
                duplicate: verifyData.duplicate,
              });
              setOpen(false);
            } catch (e) {
              setError(e.message || "Verification failed.");
            } finally {
              resolve();
            }
          },
          modal: {
            ondismiss: () => resolve(),
          },
        });
        rzp.on("payment.failed", (fail) => {
          const desc = fail?.error?.description || "Payment failed.";
          setError(desc);
          resolve();
        });
        rzp.open();
      });
    } catch (e) {
      if (e.message && !e.message.includes("Payment failed")) {
        setError(e.message || "Something went wrong.");
      }
    } finally {
      setBusy(false);
    }
  }, [amount, currency]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            setError("");
            setSuccess(null);
          }}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-[#0a0a0f] bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_40px_rgba(34,211,238,0.25)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]"
        >
          <CreditCard className="w-5 h-5" aria-hidden />
          Pay Now
        </button>
      </Motion.div>

      <AnimatePresence>
        {open && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 text-left"
          >
            {/* <p className="text-xs text-gray-500 mb-3">
              Test mode: use Razorpay test cards from the dashboard. USD requires International Payments on your Razorpay account; settlement to INR is handled by Razorpay.
            </p> */}
            <div className="flex rounded-lg border border-white/10 p-0.5 mb-4 bg-black/20">
              {["INR", "USD"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onCurrencyChange(c)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                    currency === c
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {c === "INR" ? "₹ INR" : "$ USD"}
                </button>
              ))}
            </div>
            <label className="block text-sm text-gray-400 mb-1">Amount ({currency})</label>
            <input
              type="number"
              min={currency === "INR" ? "1" : "0.01"}
              step={currency === "INR" ? "1" : "0.01"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none"
            />
            {error && (
              <p className="mt-3 flex items-start gap-2 text-sm text-red-400">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </p>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={handlePay}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-60"
            >
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {busy ? "Opening checkout…" : "Continue to secure payment"}
            </button>
          </Motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <Motion.div
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md rounded-2xl border border-emerald-500/30 bg-emerald-950/40 px-5 py-4 text-left"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" aria-hidden />
              <div>
                <p className="font-medium text-emerald-100">{success.duplicate ? "Already recorded" : "Thank you"}</p>
                <p className="text-sm text-emerald-200/90 mt-1">{success.message}</p>
                <dl className="mt-3 space-y-1 text-xs text-gray-400 font-mono">
                  <div className="flex gap-2">
                    <dt className="text-gray-500 shrink-0">Payment ID</dt>
                    <dd className="truncate text-cyan-200/90">{success.paymentId}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500 shrink-0">Order ID</dt>
                    <dd className="truncate text-cyan-200/90">{success.orderId}</dd>
                  </div>
                  {success.currency != null && success.amountMinor != null && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 shrink-0">Charged</dt>
                      <dd>
                        {(success.amountMinor / 100).toFixed(2)} {success.currency}
                      </dd>
                    </div>
                  )}
                </dl>
                <button
                  type="button"
                  onClick={() => setSuccess(null)}
                  className="mt-3 text-xs text-gray-500 hover:text-white underline underline-offset-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
