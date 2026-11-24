import Link from "next/link";
import { Diya } from "@/components/visual/Flame";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center bg-[radial-gradient(120%_60%_at_50%_0%,#1a1f4d_0%,#05071a_60%)] px-4 text-center">
      <div className="ornate max-w-md px-6 py-8">
        <div className="flex justify-center"><Diya size={48} /></div>
        <h1 className="mt-2 font-display text-3xl text-gold-light">This path leads nowhere</h1>
        <p className="mt-3 text-ivory/75">The page you were looking for isn&apos;t here. Let us guide you back.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/deities" className="btn-gold">Divine Gallery</Link>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    </main>
  );
}
