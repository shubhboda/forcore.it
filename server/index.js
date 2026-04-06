import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

const PORT = Number(process.env.PAYMENT_SERVER_PORT || 3001);
const RAZORPAY_KEY_ID = (process.env.RAZORPAY_KEY_ID || "").trim();
const RAZORPAY_KEY_SECRET = (process.env.RAZORPAY_KEY_SECRET || "").trim();

const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim();
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let razorpay = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
}

const app = express();
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (/^https?:\/\/localhost(:\d+)?$/i.test(origin)) return cb(null, true);
      if (/^https?:\/\/127\.0\.0\.1(:\d+)?$/i.test(origin)) return cb(null, true);
      const extra = (process.env.PAYMENT_ALLOWED_ORIGINS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (extra.some((o) => origin === o)) return cb(null, true);
      cb(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    razorpayConfigured: Boolean(razorpay),
    databaseConfigured: Boolean(supabase),
  });
});

function toMinorUnits(amountMajor, currency) {
  const n = Number(amountMajor);
  if (!Number.isFinite(n) || n <= 0) return null;
  const minor = Math.round(n * 100);
  if (currency === "INR" && minor < 100) return null;
  if (currency === "USD" && minor < 1) return null;
  return minor;
}

function capMinor(minor, currency) {
  const max = currency === "INR" ? 50_000_000_00 : 1_000_000_00;
  return Math.min(minor, max);
}

app.post("/api/payments/create-order", async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ error: "Razorpay is not configured on the server." });
  }

  const currency = String(req.body?.currency || "INR").toUpperCase();
  if (currency !== "INR" && currency !== "USD") {
    return res.status(400).json({ error: "currency must be INR or USD" });
  }

  const minorRaw = toMinorUnits(req.body?.amount, currency);
  if (minorRaw == null) {
    return res.status(400).json({
      error:
        currency === "INR"
          ? "amount must be at least 1.00 INR"
          : "amount must be at least 0.01 USD",
    });
  }
  const amount = capMinor(minorRaw, currency);

  const receipt = `rc_${crypto.randomBytes(8).toString("hex")}`.slice(0, 40);

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes: {
        source: "forcore.it",
      },
    });

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (err) {
    const msg = err?.error?.description || err?.message || "Failed to create order";
    console.error("Razorpay create order:", msg);
    return res.status(502).json({ error: msg });
  }
});

app.post("/api/payments/verify", async (req, res) => {
  if (!RAZORPAY_KEY_SECRET) {
    return res.status(503).json({ error: "Razorpay secret is not configured." });
  }

  const orderId = String(req.body?.razorpay_order_id || "").trim();
  const paymentId = String(req.body?.razorpay_payment_id || "").trim();
  const signature = String(req.body?.razorpay_signature || "").trim();

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({ error: "Missing payment verification fields." });
  }

  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  let valid = expected.length === signature.length;
  if (valid) {
    valid = crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(signature, "utf8"));
  }

  if (!valid) {
    return res.status(400).json({ error: "Invalid payment signature." });
  }

  let payment = null;
  if (razorpay) {
    try {
      payment = await razorpay.payments.fetch(paymentId);
    } catch (e) {
      console.error("Razorpay fetch payment:", e?.message || e);
      return res.status(502).json({ error: "Could not fetch payment from Razorpay." });
    }
  }

  if (payment && String(payment.order_id) !== orderId) {
    return res.status(400).json({ error: "Payment does not match order." });
  }

  const row = {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    amount_minor: payment ? Number(payment.amount) : null,
    currency: payment ? String(payment.currency) : null,
    status: payment ? String(payment.status) : "verified",
    method: payment?.method ? String(payment.method) : null,
    email: payment?.email ? String(payment.email) : null,
    contact: payment?.contact ? String(payment.contact) : null,
    international: payment ? Boolean(payment.international) : false,
    razorpay_payload: payment || { verified_by_signature_only: true },
  };

  if (supabase) {
    const { error: dbError } = await supabase.from("payments").insert(row);
    if (dbError) {
      if (dbError.code === "23505") {
        return res.json({
          ok: true,
          duplicate: true,
          paymentId,
          orderId,
          message: "Payment was already recorded.",
        });
      }
      console.error("Supabase insert payments:", dbError);
      return res.status(500).json({
        error: "Payment verified but could not be saved. Contact support with your payment ID.",
        paymentId,
      });
    }
  } else {
    console.warn("SUPABASE_SERVICE_ROLE_KEY not set — payment verified but not stored.");
  }

  return res.json({
    ok: true,
    paymentId,
    orderId,
    amountMinor: row.amount_minor,
    currency: row.currency,
    status: row.status,
    method: row.method,
    message:
      "Payment successful. A confirmation has been recorded. For USD charges, settlement to your INR balance follows Razorpay’s international pricing (enable International Payments in Dashboard if needed).",
  });
});

app.listen(PORT, () => {
  console.log(`Payments API listening on http://localhost:${PORT}`);
  if (!razorpay) console.warn("Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env");
  if (!supabase) console.warn("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to persist payments");
});
