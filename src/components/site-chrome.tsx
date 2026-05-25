"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Hides children on /admin routes so the admin panel can render without the
 * public site header/footer.
 */
export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
