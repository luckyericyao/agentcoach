import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentCoach | Professional coaches for better decisions",
  description:
    "Professional AI coaches built by industry professionals for Biotech & Pharma, Finance, Tax & Accounting, Technology, Legal, and Healthcare.",
  openGraph: {
    title: "AgentCoach",
    description:
      "A platform for professional AI coaches built by real industry professionals.",
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
