import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-24">
      <span className="font-condensed text-xs uppercase tracking-[0.28em] text-[var(--accent)] font-semibold mb-3 block">
        404 — Page Not Found
      </span>
      <h1 className="font-display text-4xl sm:text-5xl text-[#222] dark:text-[#f4efe6] mb-4">
        Room Not Found
      </h1>
      <p className="text-sm text-[#666] dark:text-[#a8a29e] max-w-md mb-8 leading-relaxed">
        The page or suite you are looking for does not exist, has been relocated, or is temporarily unavailable.
      </p>
      <Link href="/" className="btn-gold px-8 py-3.5 text-xs inline-flex items-center gap-2">
        Return to Home
      </Link>
    </div>
  );
}
