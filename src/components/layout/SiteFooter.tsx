import Link from "next/link";
import { brand } from "@/config/brand";

export const LEGAL_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refunds", label: "Refunds & Cancellation" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/grievance", label: "Grievance Redressal" },
] as const;

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={`relative z-10 px-4 ${compact ? "py-4" : "py-8"} text-center`}>
      <nav aria-label="Legal and information">
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-ivory/70">
          {LEGAL_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="underline-offset-4 hover:text-gold-light hover:underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-ivory/50">
        {brand.name} is an independent digital devotional experience. It is not affiliated with, endorsed by or acting for any
        temple, trust or religious institution, and does not offer temple entry, priest-performed sevas or donations.
      </p>
      <p className="mt-2 text-xs text-ivory/40">
        © {brand.copyrightYear} {brand.name}
      </p>
    </footer>
  );
}
