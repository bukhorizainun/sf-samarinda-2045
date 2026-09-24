"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Angka yang menghitung naik saat pertama masuk pandangan.
 *
 * Halaman terbit sudah memuat angka akhirnya, jadi tanpa JavaScript,
 * atau saat gerakan diminta dikurangi, yang tampil tetap angka yang
 * benar. Hitungan hanya menghias perjalanan menuju angka itu.
 * Nilai yang bukan bilangan bulat ditampilkan apa adanya.
 */
export function Hitung({ nilai, durasi = 1100 }: { nilai: string; durasi?: number }) {
  const akhir = /^\d+$/.test(nilai) ? Number(nilai) : null;
  const [kini, setKini] = useState<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || akhir === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let bingkai = 0;
    const mata = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        mata.disconnect();
        const mulai = performance.now();
        const langkah = (t: number) => {
          const p = Math.min(1, (t - mulai) / durasi);
          // Keluar lembut: cepat di awal, melambat saat mendekati angka akhir.
          const k = 1 - Math.pow(1 - p, 4);
          setKini(Math.round(akhir * k));
          if (p < 1) bingkai = requestAnimationFrame(langkah);
          else setKini(null);
        };
        bingkai = requestAnimationFrame(langkah);
      },
      { threshold: 0.6 },
    );
    mata.observe(el);
    return () => {
      mata.disconnect();
      cancelAnimationFrame(bingkai);
    };
  }, [akhir, durasi]);

  return (
    <span ref={ref} aria-label={nilai}>
      <span aria-hidden>{kini ?? nilai}</span>
    </span>
  );
}
