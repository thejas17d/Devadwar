"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Deliberately do not render or log error details to the user (may include context we don't want to expose).
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-4 text-center">
      <div className="ornate max-w-md px-6 py-8">
        <h1 className="font-display text-3xl text-gold-light">A moment of stillness</h1>
        <p className="mt-3 text-ivory/75">Something went wrong on our side. Please try again.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" className="btn-gold" onClick={reset}>Try again</button>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    </main>
  );
}
