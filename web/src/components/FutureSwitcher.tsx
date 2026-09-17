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
        <p className="bab mb-8">
          <b>01 / 06</b>
          {lang === "id"
            ? "Fase 2 · Bayangkan masa depan"
            : "Phase 2 · Imagine futures"}
        </p>

        <h2 className="t-h1 max-w-[17ch]">
          {lang === "id"
            ? "Setiap meja menyusun tiga Samarinda, lalu memilih satu"
            : "Every table builds three Samarindas, then picks one"}
        </h2>

        {/* Pemilih: satu titik hari ini, tiga cabang menuju 2045. */}
        <div className="mt-12 grid items-center gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-0">
          <Cabang ke={ke} pilih={setKe} lang={lang} />

          <div
            role="tablist"
            aria-label={lang === "id" ? "Tiga masa depan" : "Three futures"}
            className="grid gap-3"
          >
            {FUTURES.map((f, i) => {
              const on = i === ke;
              return (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setKe(i)}
                  className="cabang-pilih"
                  style={{ "--scene": f.warna } as React.CSSProperties}
                >
                  <span
                    aria-hidden
                    className="mono grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[0.7rem] rule"
                    style={on ? { background: f.warna, borderColor: f.warna, color: "#fff" } : undefined}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>
                    <span className="block text-[0.95rem] font-semibold">
                      {t(f.nama, lang)}
                    </span>
                    <span className="mt-0.5 block text-[0.83rem] text-[var(--fg-faint)]">
                      {t(f.label, lang)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
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
 * Diagram cabang. Garis ini tidak mengukur apa pun: ia hanya
 * menggambarkan bahwa ketiga masa depan berangkat dari keadaan hari
 * ini yang sama, lalu berpisah. Tidak ada sumbu, tidak ada nilai.
 */
function Cabang({
  ke,
  pilih,
  lang,
}: {
  ke: number;
  pilih: (i: number) => void;
  lang: Lang;
}) {
  const ujungY = [70, 170, 270];
  const jalur = ujungY.map(
    (y) => `M60 170 C 240 170, 300 ${y}, 470 ${y} L 560 ${y}`,
  );

  return (
    <svg
      viewBox="0 0 640 340"
      className="hidden w-full lg:block"
      role="img"
      aria-label={
        lang === "id"
          ? "Tiga cabang masa depan berangkat dari keadaan hari ini menuju 2045"
          : "Three future branches leaving today's situation toward 2045"
      }
    >
      {/* Rel waktu */}
      <line x1="60" y1="318" x2="600" y2="318" stroke="var(--line-strong)" />
      <text x="60" y="336" fontSize="11" fill="var(--fg-faint)" className="mono">
        {lang === "id" ? "HARI INI" : "TODAY"}
      </text>
      <text x="600" y="336" fontSize="11" fill="var(--fg-faint)" textAnchor="end" className="mono">
        2045
      </text>

      {FUTURES.map((f, i) => {
        const on = i === ke;
        return (
          <g
            key={f.key}
            onClick={() => pilih(i)}
            className="cursor-pointer"
            aria-hidden
          >
            {/* Wilayah klik yang lebih lebar dari garisnya. */}
            <path d={jalur[i]} stroke="transparent" strokeWidth="26" fill="none" />
            <path
              d={jalur[i]}
              className="cabang-jalur"
              stroke={f.warna}
              strokeWidth={on ? 4 : 1.6}
              opacity={on ? 1 : 0.35}
            />
            {on && (
              <path
                d={jalur[i]}
                className="cabang-jalur cabang-alir"
                stroke="var(--bg)"
                strokeWidth="2"
              />
            )}
            <circle
              cx="560"
              cy={ujungY[i]}
              r={on ? 11 : 7}
              fill={on ? f.warna : "var(--bg)"}
              stroke={f.warna}
              strokeWidth="2"
              className="transition-all duration-500"
            />
            <text
              x="584"
              y={ujungY[i] + 4}
              fontSize="12"
              fontWeight="600"
              fill={on ? "var(--fg)" : "var(--fg-faint)"}
              className="mono"
            >
              {String.fromCharCode(65 + i)}
            </text>
          </g>
        );
      })}

      {/* Titik hari ini */}
      <circle cx="60" cy="170" r="16" fill="var(--scene)" opacity="0.18" className="pulse-soft" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      <circle cx="60" cy="170" r="8" fill="var(--fg)" />
    </svg>
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
