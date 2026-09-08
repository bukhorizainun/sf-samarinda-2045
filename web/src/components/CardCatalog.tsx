"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";

export type Kartu = {
  code: string;
  type: string;
  title: string;
  body: string;
  zone?: string;
  cost?: string;
  /** Dampak pada Environment / Society / Economy / Future Readiness. */
  impact?: number[];
  risk?: string;
  action?: string;
};

const INDIKATOR = [
  { nama: { id: "Lingkungan", en: "Environment" }, warna: "var(--color-env)" },
  { nama: { id: "Masyarakat", en: "Society" }, warna: "var(--color-society)" },
  { nama: { id: "Ekonomi", en: "Economy" }, warna: "var(--color-economy)" },
  { nama: { id: "Masa Depan", en: "Future Readiness" }, warna: "var(--color-future)" },
];

/** Warna per jenis kartu, diambil dari empat warna City Indicator. */
const WARNA: Record<string, string> = {
  "ROLE CARD": "var(--color-society)",
  "SPECIAL GOAL": "var(--color-society)",
  "SAMARINDA SCENARIO": "var(--color-future)",
  "PROBLEM FACTOR": "var(--color-env)",
  DRIVER: "var(--color-env)",
  UNCERTAINTY: "var(--color-future)",
  "MINI-PROJECT": "var(--color-economy)",
  "OPEN PROJECT": "var(--color-economy)",
  OPPORTUNITY: "var(--color-economy)",
  EVENT: "var(--color-future)",
  "GENAI PROMPT": "var(--color-society)",
  "ACTION EVIDENCE": "var(--color-env)",
};

const NAMA_ID: Record<string, string> = {
  "ROLE CARD": "Kartu Peran",
  "SPECIAL GOAL": "Tujuan Khusus",
  "SAMARINDA SCENARIO": "Skenario Samarinda",
  "PROBLEM FACTOR": "Faktor Masalah",
  DRIVER: "Pendorong",
  UNCERTAINTY: "Ketidakpastian",
  "MINI-PROJECT": "Proyek Kecil",
  "OPEN PROJECT": "Proyek Terbuka",
  OPPORTUNITY: "Peluang",
  EVENT: "Kejadian",
  "GENAI PROMPT": "Prompt GenAI",
  "ACTION EVIDENCE": "Bukti Aksi",
};

const judul = (jenis: string, lang: Lang) =>
  lang === "id" ? (NAMA_ID[jenis] ?? jenis) : jenis;

export function CardCatalog({
  cards,
  lang,
}: {
  cards: Kartu[];
  lang: Lang;
}) {
  const id = lang === "id";
  const [jenis, setJenis] = useState<string>("SEMUA");
  const [cari, setCari] = useState("");
  const [buka, setBuka] = useState<Kartu | null>(null);
  const tombolRef = useRef<HTMLElement | null>(null);

  const jenisAda = useMemo(() => {
    const urut: string[] = [];
    for (const c of cards) if (!urut.includes(c.type)) urut.push(c.type);
    return urut;
  }, [cards]);

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return cards.filter(
      (c) =>
        (jenis === "SEMUA" || c.type === jenis) &&
        (!q ||
          c.title.toLowerCase().includes(q) ||
          c.body.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)),
    );
  }, [cards, jenis, cari]);

  /* Lapis 3: panel rinci. Esc menutup, fokus kembali ke kartu asalnya. */
  useEffect(() => {
    if (!buka) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBuka(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      tombolRef.current?.focus();
    };
  }, [buka]);

  return (
    <div>
      {/* Penyaring jenis + pencarian */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label={id ? "Jenis kartu" : "Card types"}
          className="-mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {["SEMUA", ...jenisAda].map((j) => {
            const on = j === jenis;
            return (
              <button
                key={j}
                role="tab"
                aria-selected={on}
                onClick={() => setJenis(j)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[0.8rem] transition-colors rule ${
                  on
                    ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                    : "text-[var(--fg-muted)] hover:bg-[var(--bg-sunken)]"
                }`}
              >
                {j === "SEMUA"
                  ? id
                    ? "Semua"
                    : "All"
                  : judul(j, lang)}
              </button>
            );
          })}
        </div>

        <div className="lg:w-64">
          <label htmlFor="cari" className="sr-only">
            {id ? "Cari kartu" : "Search cards"}
          </label>
          <input
            id="cari"
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder={id ? "Cari kartu…" : "Search cards…"}
            className="w-full rounded-full border bg-transparent px-4 py-2.5 text-[0.875rem] outline-none placeholder:text-[var(--fg-faint)] rule"
          />
        </div>
      </div>

      <p className="mt-5 text-xs tabular-nums text-[var(--fg-faint)]">
        {hasil.length} {id ? "kartu" : "cards"}
        {" · "}
        {id
          ? "naskah kartu masih berbahasa Inggris, mengikuti dek resmi"
          : "card text follows the official English deck"}
      </p>

      {/* Petak kartu */}
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hasil.map((c) => (
          <li key={c.code}>
            <button
              onClick={(e) => {
                tombolRef.current = e.currentTarget;
                setBuka(c);
              }}
              className="group h-full w-full rounded-2xl border bg-[var(--bg-raised)] p-6 text-left transition-transform duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 rule"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="t-eyebrow !text-[0.6rem]"
                  style={{ color: WARNA[c.type] ?? "var(--fg-faint)" }}
                >
                  {judul(c.type, lang)}
                </span>
                <span className="font-mono text-[0.7rem] text-[var(--fg-faint)]">
                  {c.code}
                </span>
              </div>
              <h3 className="t-h3 mt-4 text-[1.02rem]">{c.title}</h3>
              <p className="mt-2.5 line-clamp-3 text-[0.85rem] leading-relaxed text-[var(--fg-muted)]">
                {c.body}
              </p>

              {(c.zone || c.impact) && (
                <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4 rule">
                  {c.zone && (
                    <span className="text-[0.7rem] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
                      {c.zone}
                    </span>
                  )}
                  {c.impact && <Dampak nilai={c.impact} />}
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>

      {hasil.length === 0 && (
        <p className="t-body mt-12">
          {id
            ? "Tidak ada kartu yang cocok dengan pencarian itu."
            : "No card matches that search."}
        </p>
      )}

      {/* Lapis 3 */}
      {buka && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[var(--bg-sunken)]/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setBuka(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-kartu"
            onClick={(e) => e.stopPropagation()}
            className="rise w-full max-w-lg rounded-t-3xl border bg-[var(--bg-raised)] p-8 sm:rounded-3xl sm:p-10 rule"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <span
                  className="t-eyebrow"
                  style={{ color: WARNA[buka.type] ?? "var(--fg-faint)" }}
                >
                  {judul(buka.type, lang)}
                </span>
                <h2 id="judul-kartu" className="t-h2 mt-3">
                  {buka.title}
                </h2>
              </div>
              <button
                onClick={() => setBuka(null)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors hover:bg-[var(--bg-sunken)] rule"
                aria-label={id ? "Tutup" : "Close"}
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </button>
            </div>

            {buka.impact ? (
              <div className="mt-7">
                <p className="t-eyebrow">
                  {id ? "Dampak pada indikator" : "Impact on indicators"}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {buka.impact.map((n, i) => (
                    <li key={i} className="flex items-center gap-3 text-[0.9rem]">
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: INDIKATOR[i].warna }}
                      />
                      <span className="flex-1 text-[var(--fg-muted)]">
                        {INDIKATOR[i].nama[lang]}
                      </span>
                      <span className="tabular-nums font-semibold">
                        {n > 0 ? `+${n}` : n}
                      </span>
                    </li>
                  ))}
                </ul>

                {buka.cost && (
                  <p className="mt-6 text-[0.9rem] text-[var(--fg-muted)]">
                    <span className="t-eyebrow mr-2 !inline">
                      {id ? "Biaya" : "Cost"}
                    </span>
                    {buka.cost}
                  </p>
                )}
                {buka.risk && (
                  <p className="mt-3 text-[0.9rem] text-[var(--fg-muted)]">
                    <span className="t-eyebrow mr-2 !inline">
                      {id ? "Risiko" : "Risk"}
                    </span>
                    {buka.risk}
                  </p>
                )}
                {buka.action && (
                  <p className="mt-3 text-[0.9rem] text-[var(--fg-muted)]">
                    <span className="t-eyebrow mr-2 !inline">
                      {id ? "Aksi nyata" : "Real-world action"}
                    </span>
                    {buka.action}
                  </p>
                )}
              </div>
            ) : (
              <p className="t-body mt-6 text-[0.975rem]">{buka.body}</p>
            )}

            <p className="mt-8 flex items-center justify-between border-t pt-5 font-mono text-[0.7rem] text-[var(--fg-faint)] rule">
              <span>{buka.code}</span>
              {buka.zone && <span>{buka.zone}</span>}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/** Empat angka dampak sebagai batang kecil. Nilainya dikutip dari kartu. */
function Dampak({ nilai }: { nilai: number[] }) {
  return (
    <span className="flex items-end gap-1" aria-hidden>
      {nilai.map((n, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full transition-all duration-500"
          style={{
            height: `${6 + Math.abs(n) * 7}px`,
            background: INDIKATOR[i].warna,
            opacity: n === 0 ? 0.25 : 1,
          }}
        />
      ))}
    </span>
  );
}
