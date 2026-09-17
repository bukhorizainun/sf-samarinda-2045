"use client";

import { useState } from "react";
import { INDICATORS } from "@/content/site";
import { t, type Lang } from "@/lib/i18n";

/** Nilai awal tiap jalur menurut panduan: semuanya mulai di 5. */
const AWAL = 5;
const SKALA = 10;
/** Di bawah 3 berarti kritis, jadi sel 0, 1, dan 2 diarsir. */
const BATAS_KRITIS = 3;

/**
 * Empat jalur City Indicator sebagai konsol instrumen.
 * Yang ditampilkan adalah keadaan awal permainan, bukan hasil simulasi:
 * tidak ada satu angka pun di sini yang dikarang.
 */
export function IndicatorBalance({ lang }: { lang: Lang }) {
  const id = lang === "id";
  const [aktif, setAktif] = useState<string | null>(null);

  return (
    <div className="malam konsol">
      <div className="konsol-kepala">
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="lampu" />
          City Indicators
        </span>
        <span className="mono normal-case tracking-normal">
          {id ? "keadaan awal · skala 0–10" : "starting state · 0–10 scale"}
        </span>
      </div>

      <div className="grid lg:grid-cols-2">
        {INDICATORS.map((ind, n) => {
          const on = aktif === ind.key;
          return (
            <div
              key={ind.key}
              tabIndex={0}
              onMouseEnter={() => setAktif(ind.key)}
              onMouseLeave={() => setAktif(null)}
              onFocus={() => setAktif(ind.key)}
              onBlur={() => setAktif(null)}
              className={`baris-indikator focus-visible:outline-none sm:p-6 ${
                n % 2 === 0 ? "lg:border-r lg:border-r-[var(--line)]" : ""
              }`}
              style={{ "--warna": ind.color } as React.CSSProperties}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="flex items-center gap-2.5 text-[1rem] font-semibold">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ background: ind.color }}
                  />
                  {t(ind.name, lang)}
                </h3>
                <span className="mono text-[1.6rem] leading-none">
                  {String(AWAL).padStart(2, "0")}
                  <span className="text-[0.85rem] text-[var(--fg-faint)]">
                    /{SKALA}
                  </span>
                </span>
              </div>

              <div
                className="jalur mt-4"
                role="img"
                aria-label={
                  id
                    ? `${t(ind.name, lang)}: mulai di ${AWAL} dari ${SKALA}, kritis di bawah ${BATAS_KRITIS}`
                    : `${t(ind.name, lang)}: starts at ${AWAL} of ${SKALA}, critical below ${BATAS_KRITIS}`
                }
              >
                {Array.from({ length: SKALA }, (_, i) => (
                  <i
                    key={i}
                    data-kritis={i < BATAS_KRITIS ? "" : undefined}
                    data-isi={i < AWAL ? "" : undefined}
                    style={{ transitionDelay: on ? `${i * 25}ms` : "0ms" }}
                  />
                ))}
              </div>
              <div className="mono mt-1.5 flex justify-between text-[0.62rem] text-[var(--fg-faint)]">
                <span>0</span>
                <span className="text-[#ff9b9b]">
                  {id ? "kritis di bawah 3" : "critical below 3"}
                </span>
                <span>10</span>
              </div>

              <p className="mt-4 text-[0.88rem] leading-relaxed text-[var(--fg-muted)]">
                {t(ind.scope, lang)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
