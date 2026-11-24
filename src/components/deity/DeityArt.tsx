import Image from "next/image";
import type { Deity } from "@/lib/types";
import { Emblem } from "./emblems";

/** Commissioned artwork if configured, otherwise the built-in emblem. */
export function DeityArt({ deity, className = "", priority = false }: { deity: Deity; className?: string; priority?: boolean }) {
  if (deity.art.image) {
    return (
      <div className={`relative ${className}`}>
        <Image src={deity.art.image} alt={deity.art.imageAlt} fill sizes="(max-width: 768px) 80vw, 480px" className="object-contain" priority={priority} />
      </div>
    );
  }
  return <Emblem id={deity.art.emblem} label={`${deity.name} — ${deity.art.imageAlt}`} className={className} />;
}
