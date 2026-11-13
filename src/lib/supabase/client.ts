"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./config";

export function hasSupabaseBrowserConfig() {
  return Boolean(getSupabasePublicConfig());
}

export function createSupabaseBrowserClient() {
  const config = getSupabasePublicConfig();
  return config ? createBrowserClient(config.url, config.key) : null;
}
