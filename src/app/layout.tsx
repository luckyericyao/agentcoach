import type { Metadata } from "next";
import "./globals.css";
import { EarlyAccessMode } from "@/components/landing/EarlyAccessMode";
import { MotionProvider } from "@/components/landing/MotionProvider";
import { publicSiteOrigin } from "@/lib/public-site";
import { isEarlyAccessOpen } from "@/lib/server/early-access";

export const metadata: Metadata = {
  metadataBase: new URL(publicSiteOrigin),
  title: "AgentCoach | Train the world's AI agents",
  description:
    "AgentCoach turns expert workflows into reusable, rankable, and deployable AI agents through complete Agent Recipes.",
  openGraph: {
    title: "AgentCoach",
    description:
      "A public network and future marketplace for expert-built AI Agent Recipes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-carbon text-platinum antialiased">
        <EarlyAccessMode open={isEarlyAccessOpen()}>
          <MotionProvider>{children}</MotionProvider>
        </EarlyAccessMode>
      </body>
    </html>
  );
}
