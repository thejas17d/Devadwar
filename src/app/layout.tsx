import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, EB_Garamond, Kalam, Tiro_Devanagari_Sanskrit } from "next/font/google";
import "./globals.css";
import { brand } from "@/config/brand";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { getPlayableManifest } from "@/lib/content";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-cormorant", display: "swap" });
const garamond = EB_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-garamond", display: "swap" });
const tiro = Tiro_Devanagari_Sanskrit({ subsets: ["devanagari", "latin"], weight: "400", variable: "--font-tiro", display: "swap" });
const kalam = Kalam({ subsets: ["devanagari", "latin"], weight: ["400", "700"], variable: "--font-kalam", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: `${brand.name} — ${brand.meaning}`, template: `%s · ${brand.name}` },
  description: `${brand.intro} ${brand.shortDescription}`,
  applicationName: brand.name,
  openGraph: { title: brand.name, description: brand.tagline, type: "website" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#05071a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const manifest = getPlayableManifest();
  return (
    <html lang="en" className={`${cormorant.variable} ${garamond.variable} ${tiro.variable} ${kalam.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] btn-ghost">
          Skip to content
        </a>
        <AudioProvider manifest={manifest}>{children}</AudioProvider>
      </body>
    </html>
  );
}
