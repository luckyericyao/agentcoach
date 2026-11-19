import type { MetadataRoute } from "next";
import { industries } from "@/lib/industries-data";
import { publicSiteOrigin } from "@/lib/public-site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/recipes", ...industries.map(({ slug }) => `/industries/${slug}`)];
  return paths.map((path) => ({ url: new URL(path, publicSiteOrigin).href }));
}
