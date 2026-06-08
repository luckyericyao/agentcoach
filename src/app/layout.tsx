import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentCoach | Train the world's AI agents",
  description:
    "Expert-built AI agent recipes for every individual, business, and institution.",
  openGraph: {
    title: "AgentCoach",
    description:
      "A public network and marketplace for expert-built AI agent recipes.",
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

