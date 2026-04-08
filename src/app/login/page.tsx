import { redirect } from "next/navigation";

import Link from "next/link";

import { LoginForm } from "@/components/login-form";
import { shellCardClass } from "@/lib/media-config";
import { getViewerContext } from "@/lib/data";

export default async function LoginPage() {
  const viewer = await getViewerContext();

  if (viewer.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className={`${shellCardClass} w-full max-w-lg px-8 py-10 md:px-10`}>
        <Link
          href="/"
          className="text-sm text-muted transition hover:text-foreground"
        >
          JP-Log
        </Link>

        <div className="mt-6 max-w-xl">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">계정</p>
          <h1 className="mt-3 font-display text-4xl text-foreground md:text-5xl">
            로그인 또는 회원가입
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            이메일과 비밀번호로 기록을 이어 보거나 새 계정을 만들 수 있어요.
          </p>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
