"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shelly dan Hakam, sepasang maskot di dermaga tepi Mahakam.
 *
 * Digambar sendiri sebagai satu adegan SVG: dua sosok anak berbusana adat
 * Kalimantan Timur yang disederhanakan jadi bidang dan garis, berdiri di atas
 * papan dermaga, dengan perahu kecil lewat di belakang mereka.
 *
 * Yang bergerak: satu tangan melambai bergantian, badan naik-turun pelan,
 * mata berkedip pada jarak yang berbeda, bulu enggang tertiup angin, dan
 * perahu menyeberang sesekali. Semuanya berhenti bila pengunjung meminta
 * gerakan dikurangi.
 */
const RAMBUT = "#161f28";
const ANGGOTA = "#243040";

export function Maskot({ className = "" }: { className?: string }) {
  const [dekat, setDekat] = useState(false);
  const ref = useRef<SVGSVGElement>(null);

  // Mereka menoleh ke arah kursor, tapi hanya sedikit.
  const [lirik, setLirik] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const k = el.getBoundingClientRect();
      const dx = (e.clientX - (k.left + k.width / 2)) / k.width;
      setLirik(Math.max(-1, Math.min(1, dx)) * 1.6);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 260 200"
      className={className}
      role="img"
      aria-label="Shelly dan Hakam, maskot Samarinda 2045"
      onMouseEnter={() => setDekat(true)}
      onMouseLeave={() => setDekat(false)}
    >
      {/* Rambut dan anggota badan memakai warna tetap: kalau ikut --fg,
          keduanya berubah putih saat tampilan gelap. */}
      <defs>
        <linearGradient id="mk-air" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-aqua)" />
          <stop offset="1" stopColor="var(--color-mint)" />
        </linearGradient>
        <linearGradient id="mk-manik" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-ember)" />
          <stop offset="1" stopColor="var(--color-rose)" />
        </linearGradient>
      </defs>

      {/* Sungai dan perahu yang lewat */}
      <g opacity="0.5">
        <path
          d="M0 150 q32 -7 64 0 t64 0 t64 0 t68 0"
          fill="none"
          stroke="url(#mk-air)"
          strokeWidth="2"
        />
        <path
          d="M0 162 q32 -7 64 0 t64 0 t64 0 t68 0"
          fill="none"
          stroke="url(#mk-air)"
          strokeWidth="1.4"
          opacity="0.6"
        />
        <g className="mk-perahu">
          <path
            d="M0 143 h22 l-4 6 h-14 Z"
            fill="var(--fg)"
            opacity="0.45"
          />
          <path d="M11 143 v-7" stroke="var(--fg)" strokeWidth="1" opacity="0.45" />
        </g>
      </g>

      {/* Papan dermaga */}
      <g stroke="var(--fg)" strokeWidth="1.4" opacity="0.35" fill="none">
        <line x1="18" y1="168" x2="242" y2="168" />
        <line x1="18" y1="176" x2="242" y2="176" />
        {[40, 78, 116, 154, 192, 226].map((x) => (
          <line key={x} x1={x} y1="168" x2={x} y2="176" />
        ))}
        <line x1="62" y1="176" x2="62" y2="196" />
        <line x1="198" y1="176" x2="198" y2="196" />
      </g>

      {/* ---------- Hakam ---------- */}
      <g className="mk-apung" style={{ transform: `translateX(${lirik * 0.4}px)` }}>
        <g transform="translate(78 0)">
          {/* Bulu enggang */}
          <g className="mk-bulu">
            <path
              d="M14 56 C 10 44, 12 37, 16 33 C 20 39, 20 48, 18 57 Z"
              fill="var(--bg-raised)"
              stroke="var(--fg)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>

          {/* Badan: rompi manik */}
          <path
            d="M6 108 C 6 92, 13 84, 24 84 C 35 84, 42 92, 42 108 L42 148 L6 148 Z"
            fill="var(--color-future)"
            opacity="0.9"
          />
          <path d="M24 86 L24 148" stroke="var(--bg)" strokeWidth="1.4" opacity="0.5" />
          <path
            d="M10 96 q14 8 28 0 q-3 10 -14 10 q-11 0 -14 -10 Z"
            fill="url(#mk-manik)"
          />

          {/* Kaki */}
          <g stroke={ANGGOTA} strokeWidth="4" strokeLinecap="round">
            <line x1="16" y1="148" x2="16" y2="168" />
            <line x1="32" y1="148" x2="32" y2="168" />
          </g>

          {/* Melambai dengan tangan luar; tangan satunya di balik badan. */}
          <g className="mk-lambai-b">
            <line
              x1="8" y1="96" x2="-4" y2="80"
              stroke={ANGGOTA} strokeWidth="4" strokeLinecap="round"
            />
            <circle cx="-5" cy="78" r="3.4" fill="#e9c19f" />
          </g>

          {/* Kepala */}
          <path
            d="M8 66 C 8 54, 15 48, 24 48 C 33 48, 40 54, 40 66 L40 74 C 40 82, 33 88, 24 88 C 15 88, 8 82, 8 74 Z"
            fill="#e9c19f"
          />
          <path
            d="M6 68 C 4 50, 13 42, 24 42 C 35 42, 44 50, 42 68 C 38 58, 34 54, 24 54 C 14 54, 10 58, 6 68 Z"
            fill={RAMBUT}
          />
          <path d="M7 62 q17 -8 34 0 l0 6 q-17 -7 -34 0 Z" fill="url(#mk-manik)" />
          <g className="mk-kedip-b" fill={RAMBUT}>
            <circle cx="18" cy="71" r="2.2" />
            <circle cx="30" cy="71" r="2.2" />
          </g>
          <path
            d="M20 78 q4 4 8 0"
            fill="none" stroke={RAMBUT} strokeWidth="1.5" strokeLinecap="round"
          />
        </g>

        {/* ---------- Shelly ---------- */}
        <g transform="translate(140 0)">
          <g className="mk-bulu" style={{ animationDelay: "-1.8s" }}>
            <path
              d="M30 54 C 34 42, 33 35, 29 31 C 25 37, 26 46, 27 55 Z"
              fill="var(--bg-raised)"
              stroke="var(--fg)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>

          {/* Rok dan badan */}
          <path
            d="M4 108 C 4 92, 11 84, 22 84 C 33 84, 40 92, 40 108 L44 150 L0 150 Z"
            fill="var(--color-env)"
            opacity="0.9"
          />
          <path
            d="M8 96 q14 8 28 0 q-3 10 -14 10 q-11 0 -14 -10 Z"
            fill="url(#mk-manik)"
          />
          <g stroke="var(--bg)" strokeWidth="1.2" opacity="0.45">
            <line x1="4" y1="138" x2="40" y2="138" />
            <line x1="2" y1="144" x2="42" y2="144" />
          </g>

          <g stroke={ANGGOTA} strokeWidth="4" strokeLinecap="round">
            <line x1="15" y1="150" x2="15" y2="168" />
            <line x1="29" y1="150" x2="29" y2="168" />
          </g>

          {/* Melambai dengan tangan luar, bergantian dengan Hakam. */}
          <g className="mk-lambai-a">
            <line
              x1="38" y1="96" x2="50" y2="80"
              stroke={ANGGOTA} strokeWidth="4" strokeLinecap="round"
            />
            <circle cx="51" cy="78" r="3.4" fill="#f3d3b8" />
          </g>

          {/* Kepala */}
          <path
            d="M6 66 C 6 54, 13 48, 22 48 C 31 48, 38 54, 38 66 L38 74 C 38 82, 31 88, 22 88 C 13 88, 6 82, 6 74 Z"
            fill="#f3d3b8"
          />
          <path
            d="M4 70 C 2 50, 11 42, 22 42 C 33 42, 42 50, 40 70 L40 84 C 38 74, 36 66, 22 66 C 8 66, 6 74, 4 84 Z"
            fill={RAMBUT}
          />
          <path d="M5 62 q17 -8 34 0 l0 6 q-17 -7 -34 0 Z" fill="url(#mk-manik)" />
          <g className="mk-kedip-a" fill={RAMBUT}>
            <circle cx="16" cy="71" r="2.2" />
            <circle cx="28" cy="71" r="2.2" />
          </g>
          <path
            d="M18 78 q4 4 8 0"
            fill="none" stroke={RAMBUT} strokeWidth="1.5" strokeLinecap="round"
          />
          {/* Anting */}
          <g className="mk-anting">
            <circle cx="6" cy="76" r="1.8" fill="var(--color-ember)" />
            <circle cx="38" cy="76" r="1.8" fill="var(--color-ember)" />
          </g>
        </g>
      </g>

      {/* Sapaan, muncul saat kursor mendekat */}
      <g
        className="mk-sapa"
        style={{ opacity: dekat ? 1 : 0 }}
        aria-hidden
      >
        <rect x="86" y="10" width="92" height="26" rx="13"
          fill="var(--bg-raised)" stroke="var(--line-strong)" strokeWidth="1" />
        <path d="M126 36 l6 8 l6 -8 Z" fill="var(--bg-raised)" />
        <text
          x="132" y="27"
          textAnchor="middle"
          fontSize="11"
          fill="var(--fg)"
          fontFamily="var(--font-body), system-ui, sans-serif"
        >
          Selamat datang
        </text>
      </g>
    </svg>
  );
}
