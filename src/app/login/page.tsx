import { redirect } from "next/navigation";

import { requestMagicLinkAction } from "@/app/actions";
import {
  inputClassName,
  primaryButtonClassName,
  shellCardClass
} from "@/lib/media-config";
import { getViewerContext } from "@/lib/data";
import { getFirstParam } from "@/lib/utils";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const viewer = await getViewerContext();
  const error = getFirstParam(searchParams?.error);
  const sent = getFirstParam(searchParams?.sent);

  if (viewer.user) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center">
      <section className={`${shellCardClass} w-full p-8 md:p-10`}>
        <p className="text-xs uppercase tracking-[0.24em] text-muted">
          Supabase auth
        </p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          Sign in with a magic link
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
          Use email sign-in to unlock your private archive, persistent entries, and
          full add/edit/delete functionality.
        </p>

        {sent ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            Magic link sent. Check your inbox, then come back through the email.
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <form action={requestMagicLinkAction} className="mt-8 space-y-5">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.24em] text-muted">
              Email address
            </span>
            <input
              type="email"
              name="email"
              required
              className={inputClassName}
              placeholder="you@example.com"
            />
          </label>

          <button type="submit" className={primaryButtonClassName}>
            Send magic link
          </button>
        </form>
      </section>
    </div>
  );
}
