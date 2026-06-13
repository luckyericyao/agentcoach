import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
    <html lang="en">
      <body className="bg-carbon text-platinum antialiased">{children}</body>
    </html>
  );
}
