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

function getAuthErrorRedirect(nextPath: string, message: string) {
  const target = nextPath.startsWith("/reset-password/update")
    ? `/reset-password?error=${encodeURIComponent(message)}`
    : `/login?${new URLSearchParams({
        ...(nextPath === "/dashboard" ? { mode: "signup" } : {}),
        error: message
      }).toString()}`;

  return NextResponse.redirect(new URL(target, getSiteUrl()));
}

function getCallbackErrorMessage(nextPath: string) {
  if (nextPath.startsWith("/reset-password/update")) {
    return "재설정 링크가 유효하지 않거나 만료되었어요. 메일을 다시 요청해 주세요.";
  }

  return "인증 링크가 유효하지 않거나 만료되었어요. 메일을 다시 확인해 주세요.";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextPath = getSafeNextPath(searchParams.get("next"));

  if (!isSupabaseConfigured()) {
    return getAuthErrorRedirect(
      nextPath,
      "아직 Supabase가 설정되지 않았어요. 환경 변수를 먼저 추가해 주세요."
    );
  }

  const response = NextResponse.redirect(new URL(nextPath, getSiteUrl()));
  const supabase = createRouteHandlerSupabaseClient(request, response);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }

    return getAuthErrorRedirect(nextPath, getCallbackErrorMessage(nextPath));
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash
    });

    if (!error) {
      return response;
    }

    return getAuthErrorRedirect(nextPath, getCallbackErrorMessage(nextPath));
  }

  return getAuthErrorRedirect(nextPath, getCallbackErrorMessage(nextPath));
}
