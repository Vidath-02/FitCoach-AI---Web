import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Which key the server writes with. "secret" is the hardened setup. */
export function supabaseKeyType(): "secret" | "publishable" | "none" {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return "none";
  if (process.env.SUPABASE_SECRET_KEY) return "secret";
  if (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return "publishable";
  return "none";
}

/**
 * Server-side Supabase client for the API route.
 * Prefers SUPABASE_SECRET_KEY (server-only, never sent to the browser). Once it's set
 * and migration 004 has run, the public key can't write to the database at all.
 * Falls back to the publishable key, which the database only allows to INSERT.
 * Returns null when Supabase isn't configured (e.g. local dev without .env.local).
 */
export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
