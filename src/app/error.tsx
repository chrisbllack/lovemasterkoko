"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-24">
      <span className="font-condensed text-xs uppercase tracking-[0.28em] text-[var(--accent)] font-semibold mb-3 block">
        Notice
      </span>
      <h1 className="font-display text-4xl sm:text-5xl text-[#222] dark:text-[#f4efe6] mb-4">
        Something went wrong
      </h1>
      <p className="text-sm text-[#666] dark:text-[#a8a29e] max-w-md mb-8 leading-relaxed">
        We encountered an unexpected error while loading this page. Please try again or return home.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="btn-gold px-8 py-3.5 text-xs inline-flex items-center gap-2"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="btn-outline-gold px-8 py-3.5 text-xs inline-flex items-center gap-2"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
