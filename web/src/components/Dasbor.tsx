"use client";

import { useMemo, useState } from "react";
import { INDICATORS } from "@/content/site";
import { namaZona, type Kartu } from "@/lib/kartu";
import { t, type Lang } from "@/lib/i18n";

/**
 * Dasbor empat City Indicator.
 *
 * Aturan yang dipakai di sini semuanya milik panduan permainan, bukan
 * karangan situs:
 *
 *   - keempat jalur mulai di 5, pada skala 0–10, dan kritis di bawah 3
 *   - keluaran Fase 5 tepat tiga proyek: 2 Mini-Project + 1 Open Project
 *   - koalisi menang bila proyek mencakup minimal dua zona, minimal satu
 *     proyek didukung tiga peran atau lebih, tidak ada indikator yang
 *     berakhir di rentang kritis 0–2, dan minimal satu proyek menjadi
 *     rencana aksi nyata 7–30 hari
 *
 * Angka dampak dan biaya diambil apa adanya dari kartu yang dipilih.
 * Tidak ada rumus tambahan, tidak ada pembobotan, dan tidak ada nilai
 * yang diperkirakan. Open Project sengaja tidak punya angka: kartunya
 * memang lembar kosong yang diisi pemain di meja, jadi di sini ia
 * tampil sebagai slot yang menunggu, bukan sebagai simulasi.
 */

const AWAL = 5;
const SKALA = 10;
const BATAS_KRITIS = 3;
/** Fase 5 menuntup dua Mini-Project; satu Open Project diisi di meja. */
const SLOT_MINI = 2;

/** Enam jenis token sumber daya, urut seperti di panduan. */
const SUMBER = ["Nature", "Energy", "Funds", "Knowledge", "Community", "Technology"];

const SUMBER_ID: Record<string, string> = {
  Nature: "Alam",
  Energy: "Energi",
  Funds: "Dana",
  Knowledge: "Pengetahuan",
  Community: "Komunitas",
  Technology: "Teknologi",
};

/** Biaya kartu tertulis sebagai "Knowledge 2, Community 1". */
function uraiBiaya(teks: string): Record<string, number> {
  const hasil: Record<string, number> = {};
  for (const bagian of teks.split(",")) {
    const m = bagian.trim().match(/^([A-Za-z ]+?)\s+(\d+)$/);
    if (m) hasil[m[1]] = (hasil[m[1]] ?? 0) + Number(m[2]);
  }
  return hasil;
}

export function Dasbor({ kartu, lang }: { kartu: Kartu[]; lang: Lang }) {
  const id = lang === "id";
  const [pilih, setPilih] = useState<string[]>([]);
  const [zona, setZona] = useState("");

  const proyek = useMemo(
    () => kartu.filter((c) => c.type === "MINI-PROJECT" && c.impact),
    [kartu],
  );

  const zonaAda = useMemo(
    () => [...new Set(proyek.map((c) => c.zone).filter(Boolean))] as string[],
    [proyek],
  );

  const terpilih = useMemo(
    () => pilih.map((k) => proyek.find((c) => c.code === k)!).filter(Boolean),
    [pilih, proyek],
  );

  /* Nilai akhir tiap jalur: 5 ditambah dampak kartu terpilih, lalu
     dijepit pada 0–10 karena jalurnya memang berhenti di kedua ujung. */
  const nilai = INDICATORS.map((_, i) => {
    const delta = terpilih.reduce((n, c) => n + (c.impact?.[i] ?? 0), 0);
    return {
      delta,
      akhir: Math.max(0, Math.min(SKALA, AWAL + delta)),
    };
  });

  const biaya = useMemo(() => {
    const total: Record<string, number> = {};
    for (const c of terpilih) {
      for (const [k, v] of Object.entries(uraiBiaya(c.cost ?? ""))) {
        total[k] = (total[k] ?? 0) + v;
      }
    }
    return total;
  }, [terpilih]);

  const zonaTercakup = [...new Set(terpilih.map((c) => c.zone))];
  const adaKritis = nilai.some((n) => n.akhir < BATAS_KRITIS);
  const penuh = terpilih.length === SLOT_MINI;

  const daftar = zona ? proyek.filter((c) => c.zone === zona) : proyek;

  const pilihKartu = (kode: string) =>
    setPilih((xs) =>
      xs.includes(kode)
        ? xs.filter((x) => x !== kode)
        : xs.length < SLOT_MINI
          ? [...xs, kode]
          : [xs[1], kode],
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      {/* ---------- Jalur indikator ---------- */}
      <div className="malam konsol min-w-0 lg:sticky lg:top-24">
        <div className="konsol-kepala">
          <span className="flex items-center gap-2.5">
            <span aria-hidden className="lampu" />
            {id ? "Profil dampak" : "Impact profile"}
          </span>
          {/* Keterangan skala ditulis sekali di sini, bukan diulang di
              bawah keempat jalur. */}
          <span className="mono normal-case tracking-normal">
            0–10 · {id ? "mulai 5" : "starts 5"} ·{" "}
            <span className="text-[var(--fg)]">
              {terpilih.length}/{SLOT_MINI}
            </span>
          </span>
        </div>

        <div>
          {INDICATORS.map((ind, i) => {
            const { delta, akhir } = nilai[i];
            const kritis = akhir < BATAS_KRITIS;
            return (
              <div
                key={ind.key}
                className="baris-indikator"
                style={{ "--warna": ind.color } as React.CSSProperties}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="flex items-center gap-2.5 text-[0.95rem] font-semibold">
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ background: ind.color }}
                    />
                    {t(ind.name, lang)}
                  </h3>
                  <span className="mono flex items-baseline gap-1.5 text-[1.25rem] leading-none">
                    {delta !== 0 && (
                      <>
                        <span className="text-[0.8rem] text-[var(--fg-faint)]">
                          {String(AWAL).padStart(2, "0")}
                        </span>
                        <span
                          aria-hidden
                          className="text-[0.75rem]"
                          style={{
                            color:
                              delta > 0 ? "var(--color-env)" : "var(--kritis)",
                          }}
                        >
                          →
                        </span>
                      </>
                    )}
                    <span style={kritis ? { color: "var(--kritis)" } : undefined}>
                      {String(akhir).padStart(2, "0")}
                    </span>
                  </span>
                </div>

                {/* Sel ke-5 diberi tanda: itu titik awal tiap jalur,
                    jadi kenaikan dan penurunan terbaca tanpa keterangan
                    tambahan di bawahnya. */}
                <div
                  className="jalur mt-2.5"
                  role="img"
                  aria-label={`${t(ind.name, lang)}: ${akhir} / ${SKALA}`}
                >
                  {Array.from({ length: SKALA }, (_, s) => (
                    <i
                      key={s}
                      data-kritis={s < BATAS_KRITIS ? "" : undefined}
                      data-isi={s < akhir ? "" : undefined}
                      data-awal={s === AWAL - 1 ? "" : undefined}
                      style={{ transitionDelay: `${s * 22}ms` }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Biaya sumber daya, dijumlahkan dari kartu terpilih. */}
        <div className="border-t px-5 py-4 rule">
          <p className="t-eyebrow !text-[0.6rem]">
            {id ? "Biaya sumber daya" : "Resource cost"}
          </p>
          <ul className="deret-biaya mt-2.5">
            {SUMBER.map((s) => (
              <li key={s} data-nol={biaya[s] ? undefined : ""}>
                <span className="mono">{biaya[s] ?? 0}</span>
                <span>{id ? SUMBER_ID[s] : s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Empat syarat menang: dua bisa diperiksa di sini, dua milik meja. */}
        <div className="border-t px-5 py-4 rule">
          <p className="t-eyebrow !text-[0.6rem]">
            {id ? "Syarat menang" : "Win conditions"} ·{" "}
            <span className="normal-case tracking-normal text-[var(--fg-faint)]">
              {id ? "dua diperiksa di sini, dua di meja" : "two checked here, two at the table"}
            </span>
          </p>
          <ul className="mt-2.5 space-y-1.5 text-[0.8rem]">
            <Syarat
              lulus={zonaTercakup.length >= 2}
              teks={
                id
                  ? `Mencakup minimal dua zona — sekarang ${zonaTercakup.length}`
                  : `Spans at least two zones — currently ${zonaTercakup.length}`
              }
            />
            <Syarat
              lulus={penuh && !adaKritis}
              teks={
                id
                  ? "Tidak ada indikator yang berakhir di rentang kritis 0–2"
                  : "No indicator ends in the critical 0–2 range"
              }
            />
            <Syarat
              meja
              teks={
                id
                  ? "Minimal satu proyek didukung tiga peran atau lebih"
                  : "At least one project backed by three or more roles"
              }
            />
            <Syarat
              meja
              teks={
                id
                  ? "Minimal satu proyek menjadi rencana aksi nyata 7–30 hari"
                  : "At least one project becomes a real 7–30 day action plan"
              }
            />
          </ul>
        </div>
      </div>

      {/* ---------- Pemilih proyek ---------- */}
      <div className="min-w-0">
        <div className="ubin hover:!translate-y-0 hover:!transform-none">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="t-eyebrow !text-[0.62rem]">
              {id ? "Pilih dua Mini-Project" : "Pick two Mini-Projects"}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="zona-dasbor" className="sr-only">
                {id ? "Saring zona" : "Filter by zone"}
              </label>
              <select
                id="zona-dasbor"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                className="rounded-full border bg-transparent px-3 py-1.5 text-[0.78rem] rule"
              >
                <option value="">{id ? "Semua zona" : "All zones"}</option>
                {zonaAda.map((z) => (
                  <option key={z} value={z}>
                    {namaZona(z, lang)}
                  </option>
                ))}
              </select>
              {pilih.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPilih([])}
                  className="rounded-full border px-3 py-1.5 text-[0.78rem] text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-sunken)] rule"
                >
                  {id ? "Kosongkan" : "Clear"}
                </button>
              )}
            </div>
          </div>

          <ul className="mt-4 max-h-[26rem] space-y-1.5 overflow-y-auto overscroll-contain pr-1">
            {daftar.map((c) => {
              const on = pilih.includes(c.code);
              return (
                <li key={c.code}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => pilihKartu(c.code)}
                    className={`flex w-full min-w-0 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors rule ${
                      on
                        ? "border-[var(--scene)] bg-[color-mix(in_oklab,var(--scene)_10%,transparent)]"
                        : "hover:bg-[var(--bg-sunken)]"
                    }`}
                  >
                    <span className="mono shrink-0 text-[0.68rem] text-[var(--fg-faint)]">
                      {c.code}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.9rem] font-medium">
                        {c.title}
                      </span>
                      <span className="block truncate text-[0.72rem] text-[var(--fg-faint)]">
                        {c.zone ? namaZona(c.zone, lang) : ""}
                      </span>
                    </span>
                    <span className="mono flex shrink-0 gap-1 text-[0.68rem]">
                      {c.impact?.map((v, i) => (
                        <span
                          key={i}
                          className="grid h-5 w-5 place-items-center rounded"
                          title={t(INDICATORS[i].name, lang)}
                          style={{
                            background:
                              v === 0
                                ? "var(--bg-sunken)"
                                : `color-mix(in oklab, ${INDICATORS[i].color} ${v < 0 ? 22 : 18 * v}%, transparent)`,
                            color: v === 0 ? "var(--fg-faint)" : "var(--fg)",
                          }}
                        >
                          {v > 0 ? `+${v}` : v}
                        </span>
                      ))}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Slot ketiga: Open Project, tanpa angka, diisi di meja. */}
        <div className="ubin mt-4 border-dashed hover:!translate-y-0 hover:!transform-none">
          <p className="t-eyebrow !text-[0.62rem]">
            {id ? "Slot ketiga · Open Project" : "Third slot · Open Project"}
          </p>
          <p className="t-body mt-2 text-[0.88rem]">
            {id
              ? "Kartu Open Project adalah lembar kosong yang diisi pemain: nama, zona, tiga sumber daya, dukungan minimal tiga pihak, dampak, risiko, dan jadwal 7–30 hari. Karena angkanya ditulis di meja, ia tidak punya nilai bawaan untuk ditampilkan di sini."
              : "An Open Project card is a blank sheet players fill in: name, zone, three resources, support from at least three stakeholders, impact, risk, and a 7–30 day timeline. Because those numbers are written at the table, it carries no preset value to show here."}
          </p>
        </div>

        {/* Risiko dan aksi nyata, dari kartu yang sedang dipilih. */}
        {terpilih.length > 0 && (
          <div className="mt-4 grid gap-3">
            {terpilih.map((c) => (
              <div key={c.code} className="ubin !p-5">
                <div className="flex items-baseline gap-3">
                  <span className="mono text-[0.7rem] text-[var(--fg-faint)]">
                    {c.code}
                  </span>
                  <h3 className="t-h3 text-[0.98rem]">{c.title}</h3>
                </div>
                {c.cost && (
                  <p className="mono mt-2 text-[0.72rem] text-[var(--fg-muted)]">
                    {id ? "Biaya" : "Cost"}: {c.cost}
                  </p>
                )}
                {c.risk && (
                  <p className="t-body mt-2 text-[0.85rem]">
                    <span className="font-semibold text-[var(--fg)]">
                      {id ? "Risiko" : "Risk"}:
                    </span>{" "}
                    {c.risk}
                  </p>
                )}
                {c.action && (
                  <p className="t-body mt-1.5 text-[0.85rem]">
                    <span className="font-semibold text-[var(--fg)]">
                      {id ? "Aksi nyata" : "Real-world action"}:
                    </span>{" "}
                    {c.action}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Satu baris syarat menang. Yang diputuskan di meja tidak pernah
 *  ditandai lulus oleh situs, karena situs tidak berhak memutuskannya. */
function Syarat({
  teks,
  lulus,
  meja,
}: {
  teks: string;
  lulus?: boolean;
  meja?: boolean;
}) {
  const warna = meja
    ? "var(--color-future)"
    : lulus
      ? "var(--color-mint)"
      : "var(--fg-faint)";
  return (
    <li className="flex items-start gap-2.5 leading-snug">
      <span
        aria-hidden
        className="mono mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-sm text-[0.6rem]"
        style={{
          color: warna,
          border: `1px solid color-mix(in oklab, ${warna} 45%, transparent)`,
          background: `color-mix(in oklab, ${warna} 12%, transparent)`,
        }}
      >
        {meja ? "·" : lulus ? "✓" : ""}
      </span>
      <span className={meja ? "text-[var(--fg-faint)]" : undefined}>{teks}</span>
    </li>
  );
}
