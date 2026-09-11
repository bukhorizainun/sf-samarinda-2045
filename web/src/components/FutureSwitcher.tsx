"use client";

import { useEffect, useRef, useState } from "react";
import { FUTURES, FUTURES_NOTE } from "@/content/site";
import { Maskot, type Pose } from "./Maskot";
import { t, type Lang } from "@/lib/i18n";

/**
 * Tiga masa depan Fase 2, sebagai pintu masuk halaman depan.
 * Memilih satu mengubah warna adegan seluruh bagian ini (--scene),
 * lalu garis kotanya ikut menyesuaikan kerapatannya.
 */
export function FutureSwitcher({ lang }: { lang: Lang }) {
  const [ke, setKe] = useState(1); // mulai dari Alternative: paling mudah dibayangkan
  const wadahRef = useRef<HTMLDivElement>(null);
  const aktif = FUTURES[ke];

  useEffect(() => {
    const el = wadahRef.current;
    if (!el) return;
    el.style.setProperty("--scene", aktif.warna);
    el.style.setProperty(
      "--scene-wash",
      `color-mix(in oklab, ${aktif.warna} 12%, transparent)`,
    );
  }, [aktif]);

  return (
    <div ref={wadahRef} className="scene-wash">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="t-eyebrow">
          {lang === "id"
            ? "Fase 2 · Bayangkan masa depan"
            : "Phase 2 · Imagine futures"}
        </p>

        <h2 className="t-h1 mt-5 max-w-[17ch]">
          {lang === "id"
            ? "Setiap meja menyusun tiga Samarinda, lalu memilih satu"
            : "Every table builds three Samarindas, then picks one"}
        </h2>

        {/* Pemilih */}
        <div
          role="tablist"
          aria-label={lang === "id" ? "Tiga masa depan" : "Three futures"}
          className="mt-10 grid gap-3 sm:grid-cols-3"
        >
          {FUTURES.map((f, i) => {
            const on = i === ke;
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={on}
                onClick={() => setKe(i)}
                className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500 ease-[var(--ease-out-soft)] rule ${
                  on
                    ? "bg-[var(--bg-raised)] shadow-[0_1px_0_0_var(--line)]"
                    : "hover:bg-[var(--bg-raised)]/60"
                }`}
                style={on ? { borderColor: f.warna } : undefined}
              >
                <span
                  aria-hidden
                  className="block h-1 w-8 rounded-full transition-all duration-500"
                  style={{
                    background: f.warna,
                    width: on ? "3.5rem" : "2rem",
                    opacity: on ? 1 : 0.45,
                  }}
                />
                <span className="mt-4 block text-[0.95rem] font-semibold">
                  {t(f.nama, lang)}
                </span>
                <span className="mt-1 block text-[0.85rem] text-[var(--fg-faint)]">
                  {t(f.label, lang)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Adegan */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
          <div key={aktif.key} className="rise">
            <p className="t-h3 font-normal leading-relaxed">
              {t(aktif.ringkas, lang)}
            </p>
            <p className="t-body measure mt-5">{t(aktif.isi, lang)}</p>
          </div>

          <Kota varian={ke} />
        </div>

        <p className="mt-12 max-w-[52ch] border-t pt-6 text-sm leading-relaxed text-[var(--fg-faint)] rule">
          {t(FUTURES_NOTE, lang)}
        </p>
      </div>
    </div>
  );
}

/**
 * Kota bergaris. Bukan foto, bukan gambar tempelan: tiga varian yang
 * memakai kerangka yang sama, dengan tumbuhan dan atap hijau yang
 * bertambah dari kiri ke kanan. Semuanya memakai warna adegan.
 */
const POSE: Pose[] = ["amati", "lambai", "tanam"];

function Kota({ varian }: { varian: number }) {
  // Kerapatan hijau naik menurut jenis masa depannya.
  const hijau = [2, 5, 9][varian];
  const menara = [6, 6, 6];

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-[var(--bg-raised)] rule">
      {/* Shelly dan Hakam ikut menanggapi masa depan yang sedang dilihat:
          berdiri memandang, menyambut, atau menanam. */}
      <Maskot
        key={varian}
        pose={POSE[varian]}
        latar={false}
        className="rise absolute bottom-[27%] left-[4%] z-10 h-[32%] w-auto"
      />

      <svg
        viewBox="0 0 400 300"
        className="h-full w-full"
        role="img"
        aria-label="Ilustrasi garis kota di tepi sungai"
      >
        {/* Matahari rendah */}
        <circle
          cx="308"
          cy="86"
          r="30"
          fill="var(--scene)"
          opacity="0.14"
          className="transition-all duration-700"
        />

        {/* Bangunan */}
        <g
          stroke="var(--scene)"
          strokeWidth="1.4"
          fill="none"
          className="transition-all duration-700"
        >
          {Array.from({ length: menara[varian] }).map((_, i) => {
            const x = 34 + i * 56;
            const tinggi = 60 + ((i * 37) % 70);
            return (
              <g key={i}>
                <rect x={x} y={200 - tinggi} width="40" height={tinggi} rx="3" />
                {/* Atap bervegetasi, jumlahnya mengikuti varian */}
                {i < hijau && (
                  <path
                    d={`M${x + 5} ${200 - tinggi} q5 -9 10 0 q5 -9 10 0 q5 -9 10 0`}
                    strokeWidth="1.6"
                  />
                )}
                {/* Jendela */}
                {Array.from({ length: Math.floor(tinggi / 22) }).map((_, j) => (
                  <line
                    key={j}
                    x1={x + 8}
                    y1={200 - tinggi + 16 + j * 22}
                    x2={x + 32}
                    y2={200 - tinggi + 16 + j * 22}
                    opacity="0.4"
                  />
                ))}
              </g>
            );
          })}

          {/* Pohon di sela bangunan */}
          {Array.from({ length: hijau }).map((_, i) => {
            const x = 60 + i * 38;
            return (
              <g key={`t${i}`}>
                <line x1={x} y1={200} x2={x} y2={186} />
                <circle cx={x} cy={180} r="7" />
              </g>
            );
          })}

          {/* Sungai Mahakam */}
          <path d="M0 214 C 90 202, 160 232, 250 216 S 360 200, 400 210" />
          <path d="M0 232 C 90 220, 160 250, 250 234 S 360 218, 400 228" opacity="0.55" />
          <path d="M0 250 C 90 238, 160 268, 250 252 S 360 236, 400 246" opacity="0.3" />

          {/* Garis tanah */}
          <line x1="0" y1="200" x2="400" y2="200" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
