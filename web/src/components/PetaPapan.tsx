"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CHALLENGES, ZONES } from "@/content/site";
import { namaJenis, pita, type Kartu } from "@/lib/kartu";
import { t, type Lang } from "@/lib/i18n";

/**
 * Peta papan berlapis.
 *
 * Ini tata letak KONSEPTUAL delapan zona papan di sekitar sungai, bukan
 * peta geografis Samarinda: letak petak tidak mewakili lokasi nyata, dan
 * catatan itu tertulis di bawah peta. Yang nyata hanya isinya: zona,
 * tantangan kota, dan kartu yang memang tertulis untuk zona itu di dek.
 *
 * Tiga lapis bisa dinyalakan dan dimatikan, seperti lapis data di peta
 * penjelajah: zona, tantangan, dan kartu.
 */

/** Letak petak dalam persen [x, y]: lebar layar, lalu layar sempit. */
const LETAK: Record<string, { lebar: [number, number]; sempit: [number, number] }> = {
  Green: { lebar: [16, 26], sempit: [24, 13] },
  Education: { lebar: [38, 18], sempit: [72, 13] },
  Transport: { lebar: [62, 22], sempit: [26, 33] },
  Energy: { lebar: [85, 28], sempit: [74, 33] },
  River: { lebar: [50, 54], sempit: [50, 53] },
  Disaster: { lebar: [18, 76], sempit: [24, 72] },
  Waste: { lebar: [42, 84], sempit: [74, 72] },
  Food: { lebar: [78, 78], sempit: [50, 90] },
};

type Lapis = "zona" | "tantangan" | "kartu";

export function PetaPapan({ kartu, lang }: { kartu: Kartu[]; lang: Lang }) {
  const id = lang === "id";
  const [pilih, setPilih] = useState("River");
  const [lapis, setLapis] = useState<Record<Lapis, boolean>>({
    zona: true,
    tantangan: true,
    kartu: true,
  });

  const zona = useMemo(
    () =>
      ZONES.map((z) => ({
        kunci: z.en,
        nama: t(z, lang),
        tantangan: CHALLENGES.find((c) => c.zone.en === z.en),
        kartu: kartu.filter((c) => c.zone === z.en),
      })),
    [kartu, lang],
  );
  const aktif = zona.find((z) => z.kunci === pilih) ?? zona[0];

  const tombolLapis: { k: Lapis; label: string; warna: string }[] = [
    { k: "zona", label: id ? "Zona" : "Zones", warna: "var(--color-mint)" },
    { k: "tantangan", label: id ? "Tantangan kota" : "City challenges", warna: "var(--color-ember)" },
    { k: "kartu", label: id ? "Kartu zona" : "Zone cards", warna: "var(--color-aqua)" },
  ];

  return (
    <div className="malam konsol">
      <div className="konsol-kepala flex-wrap">
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="lampu" />
          {id ? "Peta papan · 8 zona" : "Board map · 8 zones"}
        </span>
        <span className="mono normal-case tracking-normal">
          {id ? "tata letak konseptual" : "conceptual layout"}
        </span>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr]">
        <div className="p-3 sm:p-4">
          {/* Lapis */}
          <div className="mb-3 flex flex-wrap gap-2" aria-label={id ? "Lapis peta" : "Map layers"} role="group">
            {tombolLapis.map((b) => (
              <button
                key={b.k}
                type="button"
                aria-pressed={lapis[b.k]}
                onClick={() => setLapis((l) => ({ ...l, [b.k]: !l[b.k] }))}
                className="peta-lapis"
                style={{ "--lapis": b.warna } as React.CSSProperties}
              >
                <i aria-hidden />
                {b.label}
              </button>
            ))}
          </div>

          <div className="peta">
            <div aria-hidden className="peta-kisi" />

            {/* Sungai: satu pita yang mengalir melintang. */}
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="peta-sungai" x1="0" x2="1">
                  <stop offset="0" stopColor="var(--color-aqua)" stopOpacity=".05" />
                  <stop offset=".5" stopColor="var(--color-aqua)" stopOpacity=".32" />
                  <stop offset="1" stopColor="var(--color-aqua)" stopOpacity=".05" />
                </linearGradient>
              </defs>
              <path
                d="M-5 60 C 20 40, 35 70, 55 52 S 85 38, 105 50"
                stroke="url(#peta-sungai)"
                strokeWidth="11"
                fill="none"
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: 42 }}
              />
              {[0, 1, 2].map((i) => (
                <path
                  key={i}
                  className="flowline"
                  d={`M-5 ${58 + i * 2} C 20 ${38 + i * 2}, 35 ${68 + i * 2}, 55 ${50 + i * 2} S 85 ${36 + i * 2}, 105 ${48 + i * 2}`}
                  stroke="var(--color-aqua)"
                  strokeOpacity={0.5 - i * 0.12}
                  strokeWidth="1"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  style={{ animationDuration: `${30 + i * 8}s` }}
                />
              ))}

              {/* Garis hubung dari zona terpilih ke zona lain. */}
              {lapis.zona &&
                zona
                  .filter((z) => z.kunci !== aktif.kunci)
                  .map((z) => {
                    const a = LETAK[aktif.kunci].lebar;
                    const b = LETAK[z.kunci].lebar;
                    return (
                      <line
                        key={z.kunci}
                        x1={a[0]}
                        y1={a[1]}
                        x2={b[0]}
                        y2={b[1]}
                        stroke="var(--color-mint)"
                        strokeOpacity=".16"
                        strokeDasharray="1 1.5"
                        vectorEffect="non-scaling-stroke"
                        className="hidden sm:inline"
                      />
                    );
                  })}
            </svg>

            {zona.map((z, i) => {
              const on = z.kunci === aktif.kunci;
              const [lx, ly] = LETAK[z.kunci].lebar;
              const [sx, sy] = LETAK[z.kunci].sempit;
              return (
                <button
                  key={z.kunci}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPilih(z.kunci)}
                  className={`peta-zona left-[var(--sx)] top-[var(--sy)] sm:left-[var(--lx)] sm:top-[var(--ly)] transition-opacity duration-300 ${
                    lapis.zona || on ? "opacity-100" : "opacity-40"
                  }`}
                  style={
                    {
                      "--lx": `${lx}%`,
                      "--ly": `${ly}%`,
                      "--sx": `${sx}%`,
                      "--sy": `${sy}%`,
                    } as React.CSSProperties
                  }
                  aria-label={`${z.nama}${z.tantangan ? `, ${t(z.tantangan.name, lang)}` : ""}, ${z.kartu.length} ${id ? "kartu" : "cards"}`}
                >
                  <span className="peta-zona-titik">
                    {String(i + 1).padStart(2, "0")}
                    {lapis.tantangan && z.tantangan && (
                      <span aria-hidden className="peta-cincin" />
                    )}
                    {lapis.kartu && z.kartu.length > 0 && (
                      <span
                        aria-hidden
                        className="mono absolute -right-2 -top-2 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full px-1 text-[0.6rem] text-[#04212a]"
                        style={{ background: "var(--color-aqua)" }}
                      >
                        {z.kartu.length}
                      </span>
                    )}
                  </span>
                  {lapis.zona && <span className="peta-zona-nama">{z.nama}</span>}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-[0.72rem] text-[var(--fg-faint)]">
            <span className="flex items-center gap-2">
              <span aria-hidden className="h-3 w-3 rounded-[4px] border border-[var(--color-ember)]" />
              {id ? "zona dengan tantangan kota" : "zone with a city challenge"}
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: "var(--color-aqua)" }} />
              {id ? "jumlah kartu zona di dek" : "zone cards in the deck"}
            </span>
          </div>
        </div>

        {/* Panel rincian zona terpilih */}
        <aside
          aria-live="polite"
          className="border-t p-5 rule sm:p-7 lg:border-l lg:border-t-0"
        >
          <div key={aktif.kunci} className="rise">
            <p className="mono text-[0.7rem] text-[var(--fg-faint)]">
              {id ? "ZONA" : "ZONE"} {String(zona.indexOf(aktif) + 1).padStart(2, "0")} / 08
            </p>
            <h3 className="t-h2 mt-2">{aktif.nama}</h3>

            {aktif.tantangan ? (
              <div className="mt-5 rounded-xl border border-[color-mix(in_oklab,var(--color-ember)_40%,transparent)] bg-[color-mix(in_oklab,var(--color-ember)_8%,transparent)] p-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ember)]">
                  {id ? "Tantangan kota" : "City challenge"}
                </p>
                <p className="mt-1.5 font-semibold">{t(aktif.tantangan.name, lang)}</p>
                <p className="mt-1.5 text-[0.85rem] leading-relaxed text-[var(--fg-muted)]">
                  {t(aktif.tantangan.body, lang)}
                </p>
              </div>
            ) : null}

            <p className="t-eyebrow mt-6 !text-[0.62rem]">
              {id ? "Kartu zona ini" : "Cards for this zone"} ·{" "}
              <span className="mono">{aktif.kartu.length}</span>
            </p>
            <ul className="mt-3 space-y-1.5">
              {aktif.kartu.map((c) => (
                <li
                  key={c.code}
                  className="flex items-baseline gap-3 rounded-lg border-l-2 bg-[var(--bg-raised)] px-3 py-2"
                  style={{ borderLeftColor: pita(c.type) }}
                >
                  <span className="mono shrink-0 text-[0.68rem] text-[var(--fg-faint)]">
                    {c.code}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.85rem] leading-snug">{c.title}</span>
                    <span className="block text-[0.68rem] text-[var(--fg-faint)]">
                      {namaJenis(c.type, lang)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={`/${lang}/kartu/?zona=${encodeURIComponent(aktif.kunci)}`}
              className="btn btn-garis group mt-6 !min-h-0 !py-2.5 text-[0.82rem]"
            >
              {id ? "Buka di katalog" : "Open in catalogue"}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </aside>
      </div>

      <p className="border-t px-5 py-3 text-[0.7rem] text-[var(--fg-faint)] rule">
        {id
          ? "Tata letak konseptual zona papan permainan, bukan peta geografis Samarinda. Letak petak tidak mewakili lokasi nyata."
          : "A conceptual layout of the game board's zones, not a geographic map of Samarinda. Tile positions do not represent real locations."}
      </p>
    </div>
  );
}
