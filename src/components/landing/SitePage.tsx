import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { TopNavigation } from "./TopNavigation";

export function SitePage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-carbon text-platinum">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <TopNavigation />
      <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
