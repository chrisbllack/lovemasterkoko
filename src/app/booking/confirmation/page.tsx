"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { naira } from "@/lib/hotel";

type VerifyState = "verifying" | "confirmed" | "pending" | "failed";

type VerifyPayload = {
  status: string;
  paymentStatus: string;
  reference: string;
  amountPaid: number;
  balanceDue: number;
};

const MAX_POLLS = 6;
const POLL_INTERVAL_MS = 3000;

export default function BookingConfirmationPage() {
  const [state, setState] = useState<VerifyState>("verifying");
  const [message, setMessage] = useState<string>("Confirming your payment…");
  const [payload, setPayload] = useState<VerifyPayload | null>(null);
    const [ref, setRef] = useState<string | null>(null);
    const pollsLeft = useRef(MAX_POLLS);

  const verify = useCallback(async (reference: string) => {
    try {
      const res = await fetch("/api/booking/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const json = (await res.json()) as
        | { ok: true; data: VerifyPayload }
        | { ok: false; error: string; message: string };

      if (json.ok) {
        setPayload(json.data);
        setState("confirmed");
        return true;
      }
      if (json.error === "PAYMENT_PENDING" && pollsLeft.current > 0) {
        pollsLeft.current -= 1;
        setMessage("Payment is still processing — checking again…");
        return false;
      }
      if (json.error === "PAYMENT_PENDING") {
        setState("pending");
        setMessage("Your payment is taking longer than usual to confirm. You can wait here or check again in a minute.");
        return true; // stop polling, user can retry manually
      }
      setState("failed");
      setMessage(json.message || "We could not verify your payment. Please contact the front desk with your reference.");
      return true;
    } catch {
      if (pollsLeft.current > 0) {
        pollsLeft.current -= 1;
        return false;
      }
      setState("failed");
      setMessage("Network error while verifying your payment. Please try again.");
      return true;
    }
  }, []);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (!ref) {
      setState("failed");
      setMessage("No reservation reference was provided. If you just paid, check your email or contact the front desk.");
      return;
    }

    let cancelled = false;
    (async () => {
      while (!cancelled) {
        const done = await verify(ref);
        if (done || cancelled) break;
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [verify]);

  const ref = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("ref") : null;

  return (
    <>
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-[#1b1b1b]">
        <div className="container-x relative z-10 text-center">
          <span className="eyebrow text-[var(--accent)] block mb-3">Reservations</span>
          <h1 className="font-display text-4xl sm:text-5xl text-white">Payment Status</h1>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white dark:bg-[#121212]">
        <div className="container-x max-w-2xl">
          <div className="glass p-8 sm:p-10 rounded-xl border border-[#ece6dd] text-center space-y-6">
            {state === "verifying" && (
              <>
                <div className="h-16 w-16 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mx-auto animate-pulse">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
                <h2 className="font-display text-2xl text-stone-900 dark:text-white">Confirming your payment…</h2>
                <p className="text-sm text-stone-600 dark:text-stone-300">{message}</p>
                {ref && <p className="text-xs text-stone-500">Reference <strong>{ref}</strong> — keep this for your records.</p>}
              </>
            )}

            {state === "confirmed" && (
              <>
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="font-display text-3xl text-stone-900 dark:text-white">Booking Confirmed</h2>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Your payment was verified and your reservation is confirmed. Present your reference at the front desk on arrival.
                </p>
                <div className="text-left text-sm space-y-2 border border-[#ece6dd] rounded-lg p-5 bg-white/60 dark:bg-[#1a1815]">
                  <div className="flex justify-between"><span className="text-stone-600 dark:text-stone-300">Reference</span><strong className="text-[var(--accent)]">{payload?.reference ?? ref}</strong></div>
                  <div className="flex justify-between"><span className="text-stone-600 dark:text-stone-300">Amount paid</span><span>{naira((payload?.amountPaid ?? 0) / 100)}</span></div>
                  <div className="flex justify-between"><span className="text-stone-600 dark:text-stone-300">Balance at hotel</span><span>{naira((payload?.balanceDue ?? 0) / 100)}</span></div>
                </div>
                <Link href="/" className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-xs font-medium">
                  Back to Home <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}

            {state === "pending" && (
              <>
                <div className="h-16 w-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <Loader2 className="h-8 w-8" />
                </div>
                <h2 className="font-display text-2xl text-stone-900 dark:text-white">Payment processing</h2>
                <p className="text-sm text-stone-600 dark:text-stone-300">{message}</p>
                {ref && <p className="text-xs text-stone-500">Reference <strong>{ref}</strong></p>}
                <button
                  type="button"
                  onClick={() => {
                    pollsLeft.current = MAX_POLLS;
                    setState("verifying");
                    if (ref) void verify(ref);
                  }}
                  className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-xs font-medium"
                >
                  <ShieldCheck className="h-4 w-4" /> Check again
                </button>
              </>
            )}

            {state === "failed" && (
              <>
                <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h2 className="font-display text-2xl text-stone-900 dark:text-white">We couldn&apos;t confirm your payment</h2>
                <p className="text-sm text-stone-600 dark:text-stone-300">{message}</p>
                {ref && <p className="text-xs text-stone-500">Reference <strong>{ref}</strong> — quote this to the front desk.</p>}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      pollsLeft.current = MAX_POLLS;
                      setState("verifying");
                      if (ref) void verify(ref);
                    }}
                    className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-xs font-medium"
                  >
                    Try verification again
                  </button>
                  <Link href="/booking" className="btn-outline-white inline-flex items-center gap-2 px-6 py-3 text-xs font-medium">
                    Start a new booking
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
