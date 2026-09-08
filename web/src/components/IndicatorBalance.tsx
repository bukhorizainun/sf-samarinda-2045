"use client";

import { useState } from "react";
import { INDICATORS } from "@/content/site";
import { t, type Lang } from "@/lib/i18n";

/**
 * Empat jalur City Indicator, skala 0–10, semuanya mulai di 5.
 * Yang ditampilkan adalah keadaan awal permainan, bukan hasil simulasi:
 * tidak ada satu angka pun di sini yang dikarang.
 */
export function IndicatorBalance({ lang }: { lang: Lang }) {
  const [aktif, setAktif] = useState<string | null>(null);

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border bg-[var(--line)] rule sm:grid-cols-2">
      {INDICATORS.map((ind) => {
        const on = aktif === ind.key;
        return (
          <div
            key={ind.key}
            onMouseEnter={() => setAktif(ind.key)}
            onMouseLeave={() => setAktif(null)}
            onFocus={() => setAktif(ind.key)}
            onBlur={() => setAktif(null)}
            tabIndex={0}
            className="group bg-[var(--bg)] p-7 transition-colors duration-300 hover:bg-[var(--bg-raised)] focus-visible:bg-[var(--bg-raised)] sm:p-8"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="t-h3">{t(ind.name, lang)}</h3>
              <span className="font-display text-[1.6rem] leading-none tabular-nums text-[var(--fg-faint)]">
                5
              </span>
            </div>

            {/* Jalur 0–10. Petak merah di kiri adalah rentang kritis 0–2. */}
            <div className="mt-5">
              <div className="relative h-2 overflow-hidden rounded-full bg-[var(--bg-sunken)]">
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[20%] bg-[var(--line-strong)] opacity-60"
                />
                <span
                  className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-[var(--ease-out-soft)]"
                  style={{
                    width: on ? "50%" : "46%",
                    background: ind.color,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[0.65rem] tabular-nums text-[var(--fg-faint)]">
                <span>0</span>
                <span>
                  {lang === "id" ? "kritis di bawah 3" : "critical below 3"}
                </span>
                <span>10</span>
              </div>
            </div>

            <p className="t-body mt-5 text-[0.925rem]">{t(ind.scope, lang)}</p>
          </div>
        );
      })}
    </div>
  );
}
