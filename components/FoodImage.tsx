"use client";

import { useEffect, useRef, useState } from "react";
import { Leaf } from "lucide-react";

/** Image with a blur-up fade-in and a branded fallback so a dead photo URL never shows a broken-image icon. */
export default function FoodImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, [src]);

  if (failed) {
    return (
      <div role="img" aria-label={alt} className={`grid place-items-center bg-gradient-to-br from-forest to-charcoal text-gold/60 ${className}`}>
        <Leaf size={28} />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref} src={src} alt={alt} loading="lazy" draggable={false}
      onLoad={() => setLoaded(true)} onError={() => setFailed(true)}
      className={`${className} transition-[opacity,filter,transform] duration-[1400ms] ease-luxe ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"}`}
    />
  );
}
