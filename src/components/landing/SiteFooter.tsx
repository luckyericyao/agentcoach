import Link from "next/link";
import { industries } from "@/lib/industries-data";

const productLinks = [
  { label: "Agent Recipes", href: "/recipes" },
  { label: "Become a Client", href: "/become-a-client" },
  { label: "Become a Coach", href: "/become-a-coach" },
  { label: "Login", href: "/login" },
  { label: "Account", href: "/account" },
  { label: "Enterprise", href: "/#enterprise" },
  { label: "Waitlist", href: "/#waitlist" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-5 py-12 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr_0.7fr]">
        <div>
          <p className="text-base font-semibold text-platinum">AgentCoach</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-steel">
            A public network and future marketplace for expert-built Agent Recipes,
            plus private deployment paths for enterprise AI agents.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-platinum">Industries</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="text-sm text-steel transition duration-200 hover:text-platinum"
              >
                {industry.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-platinum">Product</p>
          <div className="mt-4 grid gap-2">
            {productLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-steel transition duration-200 hover:text-platinum"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-sm text-steel sm:flex-row sm:items-center sm:justify-between">
        <p>Train the world&apos;s AI agents.</p>
        <p>Agent Recipes are complete expert workflow systems.</p>
      </div>
    </footer>
  );
}
