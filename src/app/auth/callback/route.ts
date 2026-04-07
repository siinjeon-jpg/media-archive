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

    return getLoginErrorRedirect(
      "이메일 인증을 완료하지 못했어요. 메일의 링크를 다시 열어 주세요."
    );
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash
    });

    if (!error) {
      return response;
    }

    return getLoginErrorRedirect(
      "이메일 인증을 완료하지 못했어요. 메일의 링크를 다시 열어 주세요."
    );
  }

  return getLoginErrorRedirect(
    "인증 링크 정보가 없어요. 메일을 다시 확인해 주세요."
  );
}
