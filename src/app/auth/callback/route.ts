import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import {
  createRouteHandlerSupabaseClient,
  getSiteUrl,
  isSupabaseConfigured
} from "@/lib/supabase/server";

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }

  return next;
}

function getLoginErrorRedirect(message: string) {
  return NextResponse.redirect(
    new URL(`/login?error=${encodeURIComponent(message)}`, getSiteUrl())
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextPath = getSafeNextPath(searchParams.get("next"));

  if (!isSupabaseConfigured()) {
    return getLoginErrorRedirect(
      "Supabase is not configured yet. Add your environment variables first."
    );
  }

  const response = NextResponse.redirect(new URL(nextPath, getSiteUrl()));
  const supabase = createRouteHandlerSupabaseClient(request, response);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }

    return getLoginErrorRedirect(error.message);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash
    });

    if (!error) {
      return response;
    }

    return getLoginErrorRedirect(error.message);
  }

  return getLoginErrorRedirect(
    "The magic link is missing the authentication code. Please request a new link."
  );
}
