"use client";

import { useEffect, useRef, useState } from "react";
import { Maskot } from "./Maskot";

/**
 * Pawai: Shelly dan Hakam berjalan melintasi tepi bawah bagian.
 *
 * Keduanya melangkah di tempat (sikap `jalan`), dan jalur ini yang
 * membawa mereka dari kiri ke kanan, lalu beristirahat sebentar di
 * luar layar sebelum lewat lagi. Gerak hanya berjalan selama jalurnya
 * terlihat, jadi tidak ada yang dihitung saat pengunjung membaca
 * bagian lain. Saat gerakan diminta dikurangi, mereka berdiri diam di
 * tepi kanan.
 */
export function Pawai({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tampak, setTampak] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const mata = new IntersectionObserver(([e]) => setTampak(e.isIntersecting), {
      threshold: 0.1,
    });
    mata.observe(el);
    return () => mata.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pawai ${tampak ? "pawai-jalan" : ""} ${className}`}
    >
      <div className="pawai-sosok">
        <Maskot pose="jalan" latar={false} className="h-full w-auto" />
      </div>
      <span className="pawai-tanah" />
    </div>
  );
}
