"use client";

import { useRef, useState } from "react";

/**
 * Kedalaman yang menanggapi kursor.
 *
 * Bidang di dalamnya dimiringkan sedikit mengikuti posisi tetikus —
 * paling jauh enam derajat — sehingga panel terasa sebagai benda yang
 * tergeletak di meja, bukan gambar yang ditempel di layar. Sorotan
 * lembut mengikuti kursor pada sudut yang sama.
 *
 * Tidak ada apa pun yang bergerak sebelum kursor masuk, dan tidak ada
 * yang bergerak di perangkat sentuh. Saat pengunjung meminta gerakan
 * dikurangi, komponen ini hanya meneruskan isinya tanpa perubahan.
 */
export function Tilt({
  children,
  derajat = 5,
  className = "",
}: {
  children: React.ReactNode;
  /** Sudut miring maksimal. */
  derajat?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [sudut, setSudut] = useState<{ x: number; y: number } | null>(null);
  const [kilau, setKilau] = useState({ x: 50, y: 50 });

  const gerak = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setSudut({
      x: (0.5 - py) * derajat * 2,
      y: (px - 0.5) * derajat * 2,
    });
    setKilau({ x: px * 100, y: py * 100 });
  };

  return (
    <div className={`pentas ${className}`}>
      <div
        ref={ref}
        className="pentas-bidang"
        onPointerMove={gerak}
        onPointerLeave={() => setSudut(null)}
        style={
          {
            transform: sudut
              ? `rotateX(${sudut.x}deg) rotateY(${sudut.y}deg)`
              : undefined,
            "--kilau-x": `${kilau.x}%`,
            "--kilau-y": `${kilau.y}%`,
            "--kilau-tampak": sudut ? 1 : 0,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
