"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shelly dan Hakam, sepasang maskot Samarinda 2045.
 *
 * Digambar sendiri sebagai satu adegan SVG: dua sosok anak berbusana adat
 * Kalimantan Timur yang disederhanakan jadi bidang dan garis.
 *
 * Sikap keduanya mengikuti `pose`, dan itulah yang membuat mereka ikut
 * menanggapi masa depan yang sedang dipilih pengunjung:
 *
 *   lambai — menyambut di dermaga, dipakai di pembuka halaman
 *   amati  — berdiri diam memandang sungai; tidak ada yang ditanam
 *   tanam  — keduanya menanam, dan tunasnya tumbuh dari tanah
 *
 * `latar` mematikan sungai, perahu, dan papan dermaga, supaya sosoknya bisa
 * ditumpangkan pada adegan lain.
 */

const RAMBUT = "#161f28";
const ANGGOTA = "#243040";
const KULIT_A = "#f3d3b8"; // Shelly
const KULIT_B = "#e9c19f"; // Hakam

export type Pose = "lambai" | "amati" | "tanam";

export function Maskot({
  pose = "lambai",
  latar = true,
  sapaan,
  className = "",
}: {
  pose?: Pose;
  latar?: boolean;
  sapaan?: string;
  className?: string;
}) {
  const [dekat, setDekat] = useState(false);
  const [lirik, setLirik] = useState(0);
  const ref = useRef<SVGSVGElement>(null);

  // Mereka menoleh ke arah kursor, tapi hanya sedikit.
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

      {latar && (
        <>
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
              <path d="M0 143 h22 l-4 6 h-14 Z" fill="var(--fg)" opacity="0.45" />
              <path
                d="M11 143 v-7"
                stroke="var(--fg)"
                strokeWidth="1"
                opacity="0.45"
              />
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
        </>
      )}

      {/* Tunas yang ditanam. Hanya ada pada masa depan yang menuntut kerja. */}
      {pose === "tanam" && (
        <g fill="none" strokeLinecap="round">
          <g className="mk-tumbuh">
            <path d="M68 170 v-13" stroke="var(--color-env)" strokeWidth="2.4" />
            <path
              d="M68 161 q-8 -4 -10 -12 q10 1 10 10 Z"
              fill="var(--color-env)"
              opacity="0.8"
            />
            <path
              d="M68 158 q8 -5 11 -13 q-10 0 -11 11 Z"
              fill="var(--color-env)"
              opacity="0.8"
            />
          </g>
          <g className="mk-tumbuh" style={{ animationDelay: "0.45s" }}>
            <path d="M196 170 v-11" stroke="var(--color-env)" strokeWidth="2.4" />
            <path
              d="M196 162 q-7 -4 -9 -11 q9 1 9 9 Z"
              fill="var(--color-env)"
              opacity="0.8"
            />
            <path
              d="M196 159 q7 -4 10 -11 q-9 0 -10 9 Z"
              fill="var(--color-env)"
              opacity="0.8"
            />
          </g>
        </g>
      )}

      <g
        className={pose === "amati" ? undefined : "mk-apung"}
        style={{ transform: `translateX(${lirik * 0.4}px)` }}
      >
        {/* ---------- Hakam ---------- */}
        <g transform="translate(78 0)">
          <g className="mk-bulu">
            <path
              d="M14 56 C 10 44, 12 37, 16 33 C 20 39, 20 48, 18 57 Z"
              fill="var(--bg-raised)"
              stroke={ANGGOTA}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>

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

          <g stroke={ANGGOTA} strokeWidth="4" strokeLinecap="round">
            <line x1="16" y1="148" x2="16" y2="170" />
            <line x1="32" y1="148" x2="32" y2="170" />
          </g>

          <Lengan pose={pose} sisi="kiri" kulit={KULIT_B} />

          <path
            d="M8 66 C 8 54, 15 48, 24 48 C 33 48, 40 54, 40 66 L40 74 C 40 82, 33 88, 24 88 C 15 88, 8 82, 8 74 Z"
            fill={KULIT_B}
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
            d={pose === "amati" ? "M20 79 h8" : "M20 78 q4 4 8 0"}
            fill="none"
            stroke={RAMBUT}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* ---------- Shelly ---------- */}
        <g transform="translate(140 0)">
          <g className="mk-bulu" style={{ animationDelay: "-1.8s" }}>
            <path
              d="M30 54 C 34 42, 33 35, 29 31 C 25 37, 26 46, 27 55 Z"
              fill="var(--bg-raised)"
              stroke={ANGGOTA}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>

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
            <line x1="15" y1="150" x2="15" y2="170" />
            <line x1="29" y1="150" x2="29" y2="170" />
          </g>

          <Lengan pose={pose} sisi="kanan" kulit={KULIT_A} />

          <path
            d="M6 66 C 6 54, 13 48, 22 48 C 31 48, 38 54, 38 66 L38 74 C 38 82, 31 88, 22 88 C 13 88, 6 82, 6 74 Z"
            fill={KULIT_A}
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
            d={pose === "amati" ? "M18 79 h8" : "M18 78 q4 4 8 0"}
            fill="none"
            stroke={RAMBUT}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <g className="mk-anting">
            <circle cx="6" cy="76" r="1.8" fill="var(--color-ember)" />
            <circle cx="38" cy="76" r="1.8" fill="var(--color-ember)" />
          </g>
        </g>
      </g>

      {sapaan && (
        <g className="mk-sapa" style={{ opacity: dekat ? 1 : 0 }} aria-hidden>
          <rect
            x="80"
            y="8"
            width="104"
            height="26"
            rx="13"
            fill="var(--bg-raised)"
            stroke="var(--line-strong)"
            strokeWidth="1"
          />
          <path d="M126 34 l6 8 l6 -8 Z" fill="var(--bg-raised)" />
          <text
            x="132"
            y="25"
            textAnchor="middle"
            fontSize="11"
            fill="var(--fg)"
            fontFamily="var(--font-body), system-ui, sans-serif"
          >
            {sapaan}
          </text>
        </g>
      )}
    </svg>
  );
}

/** Lengan, digambar menurut sikap yang sedang dipakai. */
function Lengan({
  pose,
  sisi,
  kulit,
}: {
  pose: Pose;
  sisi: "kiri" | "kanan";
  kulit: string;
}) {
  const garis = {
    stroke: ANGGOTA,
    strokeWidth: 4,
    strokeLinecap: "round" as const,
  };

  // Menanam: tangan turun ke depan, menghadap tunas.
  if (pose === "tanam") {
    return sisi === "kiri" ? (
      <g className="mk-tanam-b">
        <line x1="8" y1="98" x2="-2" y2="118" {...garis} />
        <circle cx="-3" cy="120" r="3.4" fill={kulit} />
      </g>
    ) : (
      <g className="mk-tanam-a">
        <line x1="38" y1="98" x2="48" y2="118" {...garis} />
        <circle cx="49" cy="120" r="3.4" fill={kulit} />
      </g>
    );
  }

  // Mengamati: tangan menggantung tenang di sisi badan.
  if (pose === "amati") {
    return sisi === "kiri" ? (
      <>
        <line x1="8" y1="98" x2="3" y2="120" {...garis} />
        <circle cx="2" cy="122" r="3.4" fill={kulit} />
      </>
    ) : (
      <>
        <line x1="38" y1="98" x2="43" y2="120" {...garis} />
        <circle cx="44" cy="122" r="3.4" fill={kulit} />
      </>
    );
  }

  // Menyambut: melambai dengan tangan sisi luar.
  return sisi === "kiri" ? (
    <g className="mk-lambai-b">
      <line x1="8" y1="96" x2="-4" y2="80" {...garis} />
      <circle cx="-5" cy="78" r="3.4" fill={kulit} />
    </g>
  ) : (
    <g className="mk-lambai-a">
      <line x1="38" y1="96" x2="50" y2="80" {...garis} />
      <circle cx="51" cy="78" r="3.4" fill={kulit} />
    </g>
  );
}
