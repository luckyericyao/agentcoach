import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentCoach | Agent recipes for data-heavy decisions",
  description:
    "Reusable AI agent recipes that turn high-value professional data into repeatable decision workflows.",
  openGraph: {
    title: "AgentCoach",
    description:
      "A marketplace for reusable AI agent recipes that automate data-heavy professional workflows.",
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
