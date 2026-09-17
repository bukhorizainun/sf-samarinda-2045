"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lapis latar menerus untuk seluruh situs.
 *
 * Satu bidang tetap di belakang segalanya, berisi dua hal: kelokan
 * Sungai Mahakam dan satu pita jalinan anyaman. Keduanya bergeser
 * dengan laju berbeda saat halaman digulir, jadi bagian-bagian halaman
 * tidak lagi terbaca sebagai kotak yang bertumpuk — ada satu arus yang
 * berjalan menembus semuanya.
 *
 * Kadarnya sangat rendah dan tidak pernah menyentuh kontras teks.
 * Kalau pengunjung meminta gerakan dikurangi, lapis ini tetap tampil
 * tetapi berhenti bergerak.
 */
export function Aliran() {
  const [y, setY] = useState(0);
  const diam = useRef(false);

  useEffect(() => {
    diam.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (diam.current) return;

    let jalan = false;
    const onScroll = () => {
      if (jalan) return;
      jalan = true;
      requestAnimationFrame(() => {
        setY(window.scrollY);
        jalan = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Dua laju. Sungai hanyut ke atas perlahan, pita anyaman lebih
     lambat lagi dan sedikit bergeser ke samping, seperti kain yang
     ditarik. Keduanya berulang, jadi tidak pernah habis. */
  const sungai = -((y * 0.06) % 320);
  const anyam = -((y * 0.028) % 160);
  const geser = ((y * 0.01) % 40) - 20;

  return (
    <div aria-hidden className="aliran">
      <svg
        className="aliran-sungai"
        viewBox="0 0 1200 960"
        preserveAspectRatio="xMidYMin slice"
        style={{ transform: `translate3d(0, ${sungai}px, 0)` }}
      >
        <defs>
          <linearGradient id="aliran-arus" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--scene)" />
            <stop offset="0.55" stopColor="var(--color-mint)" />
            <stop offset="1" stopColor="var(--color-aqua)" />
          </linearGradient>
        </defs>

        {/* Empat kelokan sejajar, diulang dua kali tinggi supaya
            sambungannya tidak pernah terlihat saat digulir. */}
        {[0, 320, 640].map((dy) =>
          [0, 26, 52, 78].map((d, i) => (
            <path
              key={`${dy}-${d}`}
              d={`M-40 ${120 + dy + d} C 220 ${60 + dy + d}, 380 ${200 + dy + d}, 620 ${130 + dy + d} S 1000 ${50 + dy + d}, 1240 ${110 + dy + d}`}
              fill="none"
              stroke="url(#aliran-arus)"
              strokeWidth={i % 2 ? 1 : 1.8}
              opacity={0.85 - i * 0.16}
            />
          )),
        )}
      </svg>

      {/* Pita jalinan: dua arah miring yang saling menyilang, kosakata
          anyaman yang sama dengan motif kartu. */}
      <div
        className="aliran-anyam"
        style={{
          transform: `translate3d(${geser}px, ${anyam}px, 0)`,
        }}
      />
    </div>
  );
}
