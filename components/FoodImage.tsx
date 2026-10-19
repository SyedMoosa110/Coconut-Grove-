"use client";

import { useState } from "react";
import { Leaf } from "lucide-react";

/** Image with a branded fallback so a dead photo URL never leaves a broken-image icon on the menu. */
export default function FoodImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div role="img" aria-label={alt} className={`grid place-items-center bg-gradient-to-br from-forest to-charcoal text-gold/60 ${className}`}>
        <Leaf size={28} />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} />;
}
