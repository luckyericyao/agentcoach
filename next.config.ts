import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.AGENTCOACH_TEST_BUILD === "1" ? ".next-e2e" : ".next",
  async headers() {
    const revision = process.env.VERCEL_GIT_COMMIT_SHA;
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      ...["/account/:path*", "/login", "/auth/:path*", "/api/:path*"].map((source) => ({
        source,
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      })),
      ...(revision && /^[a-f0-9]{40}$/.test(revision) ? [
        "/", "/recipes", "/recipes/samples/:slug", "/recipes/samples/:slug/brief", "/recipes/share-image/:slug",
      ].map((source) => ({
        source,
        headers: [{ key: "X-AgentCoach-Revision", value: revision }],
      })) : []),
    ];
  },
};

export default nextConfig;

