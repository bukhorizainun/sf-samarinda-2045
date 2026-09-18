"use client";

import { useEffect, useRef, useState } from "react";
import { Maskot, type Pose } from "./Maskot";

/**
 * Pendamping halaman.
 *
 * Satu sosok maskot yang meloncat sekali ketika bagiannya masuk
 * pandangan, lalu tenang kembali. Gunanya mengisi ruang kosong di
 * kepala halaman tanpa mengganggu bacaan: ia duduk di sisi kanan,
 * dan di layar sempit ia tidak tampil sama sekali supaya teks tetap
 * memegang seluruh lebar.
 *
 * Loncatan dijalankan lewat satu IntersectionObserver, bukan
 * pendengar gulir, jadi tidak ada perhitungan di tiap bingkai.
 */
export function Pendamping({
  sosok = "shelly",
  pose = "loncat",
  sapaan,
  className = "",
}: {
  sosok?: "shelly" | "hakam" | "keduanya";
  pose?: Pose;
  sapaan?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [jalan, setJalan] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mata = new IntersectionObserver(
      ([e]) => setJalan(e.isIntersecting),
      { threshold: 0.4 },
    );
    mata.observe(el);
    return () => mata.disconnect();
  }, []);

  return (
    /* Pembungkus luar memegang penempatan; .bidak di dalamnya memegang
       ruang 3D, supaya kelas posisi dari halaman tidak bertabrakan
       dengan position: relative milik .bidak. */
    <div
      ref={ref}
      className={`hidden sm:block ${jalan ? "loncat-jalan" : ""} ${className}`}
    >
      {/* Dudukan dan bayangan bidak hanya masuk akal untuk sosok yang
          berdiri. Yang sedang berenang tidak berdiri di atas apa pun. */}
      <div className="bidak w-full">
        {pose !== "renang" && <span aria-hidden className="bidak-bayang" />}
        <div className="bidak-sosok">
          <Maskot pose={pose} sosok={sosok} latar={false} sapaan={sapaan} />
        </div>
        {pose !== "renang" && <span aria-hidden className="bidak-dudukan" />}
      </div>
    </div>
  );
}
