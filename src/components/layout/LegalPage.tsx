import Link from "next/link";
import { brand } from "@/config/brand";
import { SiteFooter } from "./SiteFooter";

interface Props {
  title: string;
  eyebrow?: string;
  /** Legal documents show the lawyer-review banner; informational pages (About) can opt out. */
  draft?: boolean;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalPage({ title, eyebrow = brand.name, draft = true, lastUpdated = "24 November 2026", children }: Props) {
  return (
    <div className="relative min-h-dvh bg-[radial-gradient(120%_60%_at_50%_0%,#1a1f4d_0%,#05071a_60%)]">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 pt-6">
        <Link href="/" className="font-display text-xl tracking-[0.2em] text-gold-light uppercase">
          {brand.name}
        </Link>
        <Link href="/deities" className="btn-ghost !min-h-[40px] !px-4 !text-xs">
          Divine Gallery
        </Link>
      </header>
      <main id="main" className="mx-auto max-w-3xl px-4 pb-10 pt-10">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-gold-grad sm:text-5xl">{title}</h1>
        {draft && (
          <div role="note" className="mt-5 rounded-xl border border-saffron/60 bg-saffron/10 px-4 py-3 text-sm text-ivory/90">
            <strong className="font-display tracking-wide text-saffron">DRAFT · </strong>
            {brand.legalReviewNotice}
          </div>
        )}
        <p className="mt-3 text-sm text-ivory/50">Last updated: {lastUpdated}</p>
        <article className="prose-legal mt-6">{children}</article>
      </main>
      <SiteFooter />
    </div>
  );
}
