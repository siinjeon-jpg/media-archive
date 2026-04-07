import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const LOCAL_DEV_SITE_URL = "http://localhost:3000";

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

  if (process.env.NODE_ENV !== "production") {
    return LOCAL_DEV_SITE_URL;
  }

  return configured || LOCAL_DEV_SITE_URL;
}

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set({
              name,
              value,
              ...options
            });
          } catch {
            // Cookie writes can be ignored from read-only server components.
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({
              name,
              value: "",
              ...options
            });
          } catch {
            // Cookie writes can be ignored from read-only server components.
          }
        }
      }
    }
  );
}

export function createRouteHandlerSupabaseClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          response.cookies.set({
            name,
            value,
            ...options
          });
        },
        remove(name: string, options) {
          response.cookies.set({
            name,
            value: "",
            ...options
          });
        }
      }
    }
  );
}
