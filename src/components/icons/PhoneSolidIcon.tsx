import type { CSSProperties } from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Solid (filled) phone icon — lucide's outline Phone with fill applied.
 * Used for all phone CTAs across the site.
 */
export function PhoneSolidIcon({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return <Phone className={cn("fill-current", className)} style={style} strokeWidth={1.5} />;
}
