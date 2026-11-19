import type { MetadataRoute } from "next";
import { publicSiteOrigin } from "@/lib/public-site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", publicSiteOrigin).href,
  };
}
