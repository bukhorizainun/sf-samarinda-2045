"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { labelFase, namaJenis, pita, type Kartu } from "@/lib/kartu";
import type { Lang } from "@/lib/i18n";

/**
 * Komposisi dek, dihitung langsung dari cards.json.
 * Batang atas: berapa kartu tiap jenis. Kolom bawah: berapa kartu yang
 * dipakai di tiap fase (satu kartu bisa dipakai di lebih dari satu fase).
 * Menunjuk satu jenis menyorotnya di batang dan di legenda sekaligus.
 */
export function KomposisiDek({
  kartu,
  lang,
  fase = true,
}: {
  kartu: Kartu[];
  lang: Lang;
  /** Tampilkan kolom per fase. */
  fase?: boolean;
}) {
  const id = lang === "id";
  const [sorot, setSorot] = useState<string | null>(null);

  const { jenis, perFase, puncak } = useMemo(() => {
    const hitung = new Map<string, number>();
    const f = new Map<number, number>();
    for (const c of kartu) {
      hitung.set(c.type, (hitung.get(c.type) ?? 0) + 1);
      for (const p of c.phases) f.set(p, (f.get(p) ?? 0) + 1);
    }
    const perFase = [...f.entries()].sort((a, b) => a[0] - b[0]);
    return {
      jenis: [...hitung.entries()],
      perFase,
      puncak: Math.max(...perFase.map((x) => x[1])),
    };
  }, [kartu]);

  const base = `/${lang}/kartu`;

  return (
    <div className="malam konsol">
      <div className="konsol-kepala">
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="lampu" />
          {id ? "Komposisi dek" : "Deck composition"}
        </span>
        <span className="mono normal-case tracking-normal">
          n = {kartu.length}
        </span>
      </div>

      <div className="p-5 sm:p-7">
        <p className="t-eyebrow !text-[0.62rem]">
          {id ? "Kartu per jenis" : "Cards per type"}
        </p>
        <div
          className="batang mt-3"
          role="img"
          aria-label={jenis
            .map(([j, n]) => `${namaJenis(j, lang)} ${n}`)
            .join(", ")}
          onMouseLeave={() => setSorot(null)}
        >
          {jenis.map(([j, n]) => (
            <span
              key={j}
              style={{ flexGrow: n, "--warna": pita(j) } as React.CSSProperties}
              data-on={sorot === j ? "" : undefined}
              onMouseEnter={() => setSorot(j)}
              title={`${namaJenis(j, lang)} · ${n}`}
            />
          ))}
        </div>

        <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          {jenis.map(([j, n]) => (
            <li key={j}>
              <Link
                href={`${base}/?jenis=${encodeURIComponent(j)}`}
                onMouseEnter={() => setSorot(j)}
                onMouseLeave={() => setSorot(null)}
                onFocus={() => setSorot(j)}
                onBlur={() => setSorot(null)}
                className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[0.82rem] transition-colors ${
                  sorot && sorot !== j
                    ? "text-[var(--fg-faint)]"
                    : "text-[var(--fg-muted)]"
                } hover:bg-[var(--bg-raised)] hover:text-[var(--fg)]`}
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ background: pita(j) }}
                />
                <span className="min-w-0 flex-1 truncate">{namaJenis(j, lang)}</span>
                <span className="mono text-[var(--fg)]">{n}</span>
              </Link>
            </li>
          ))}
        </ul>

        {fase && (
          <div className="mt-8 border-t pt-6 rule">
            <p className="t-eyebrow !text-[0.62rem]">
              {id
                ? "Kartu yang dipakai per fase"
                : "Cards in play per phase"}
            </p>
            <div className="kolom-fase mt-4">
              {perFase.map(([p, n], i) => (
                <div key={p}>
                  <span className="mono text-[0.75rem]">{n}</span>
                  <b
                    style={{
                      height: `${(n / puncak) * 100}%`,
                      animationDelay: `${i * 70}ms`,
                    }}
                  />
                  <span className="mono text-center text-[0.62rem] leading-tight text-[var(--fg-faint)]">
                    {p === 0 ? labelFase(0, lang) : `F${p}`}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[0.72rem] text-[var(--fg-faint)]">
              {id
                ? "Satu kartu bisa tercatat di lebih dari satu fase."
                : "One card can be listed under more than one phase."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
