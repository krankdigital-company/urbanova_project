import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { fetchSiteContent } from "./content";
import type { SiteContent } from "./content";

/**
 * Loads the whole storefront content payload on the server in a single call so
 * the first paint already contains real data (no "template first, database
 * later" flash) and the browser makes one request instead of ~18.
 */
export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const client = createClient(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
  const data = await fetchSiteContent(client);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any;
});
