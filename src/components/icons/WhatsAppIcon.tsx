import React from "react";
import { cn } from "@/lib/utils";

export interface WhatsAppIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  iconClassName?: string;
  text?: string;
  children?: React.ReactNode;
}

/**
 * Official WhatsApp logo glyph (speech bubble + handset) with optional text support.
 * Used for all WhatsApp CTAs across the site.
 */
export function WhatsAppIcon({
  className,
  iconClassName,
  text,
  children,
  ...props
}: WhatsAppIconProps) {
  const label = text || children;
  const svg = (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn(label ? (iconClassName || "h-4 w-4 shrink-0") : (className || "h-4 w-4"), !label && iconClassName)}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.057 22l4.98-1.306A9.946 9.946 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm.05 17.5a7.46 7.46 0 01-3.808-1.04l-.273-.162-2.827.742.754-2.755-.178-.283A7.46 7.46 0 014.55 12c0-4.115 3.348-7.462 7.462-7.462 4.115 0 7.463 3.347 7.463 7.462 0 4.114-3.348 7.5-7.425 7.5zm4.092-5.617c-.225-.112-1.33-.656-1.536-.731-.206-.075-.356-.112-.506.113-.15.225-.58.73-.711.88-.131.15-.262.169-.487.056-.225-.112-.95-.35-1.81-1.117-.669-.597-1.121-1.334-1.252-1.56-.131-.225-.014-.347.098-.459.101-.1.225-.262.337-.394.113-.131.15-.225.225-.375.075-.15.038-.281-.019-.394-.056-.112-.506-1.218-.693-1.668-.182-.438-.368-.378-.506-.385-.131-.006-.281-.008-.431-.008-.15 0-.394.056-.6.281-.206.225-.787.769-.787 1.875 0 1.106.806 2.175.918 2.325.113.15 1.587 2.424 3.846 3.398.537.232.956.37 1.283.473.539.172 1.03.148 1.418.09.432-.065 1.33-.544 1.518-1.069.188-.525.188-.975.131-1.069-.056-.094-.206-.15-.431-.262z"
      />
    </svg>
  );

  if (!label) {
    return svg;
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {svg}
      <span>{label}</span>
    </span>
  );
}
