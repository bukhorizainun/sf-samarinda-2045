"use client";

import { useEffect, useRef, useState } from "react";
import { Dampak, KartuMuka } from "./KartuMuka";
import {
  INDIKATOR,
  labelFase,
  namaJenis,
  namaZona,
  pita,
  type Kartu,
} from "@/lib/kartu";
import type { Lang } from "@/lib/i18n";

/**
 * Lapis tiga: satu kartu dibaca utuh.
 *
 * Kiri memperlihatkan kartunya seperti yang dipegang pemain dan bisa
 * dibalik; kanan memuat seluruh bidang yang tertulis di kartu itu.
 * Panah kiri dan kanan berpindah kartu tanpa menutup panel, karena
 * fasilitator biasanya menelusuri satu dek berturut-turut.
 */
export function PanelKartu({
  kartu,
  lang,
  tutup,
  pindah,
  posisi,
}: {
  kartu: Kartu;
  lang: Lang;
  tutup: () => void;
  pindah: (arah: 1 | -1) => void;
  posisi: [number, number];
}) {
  const id = lang === "id";
  const warna = pita(kartu.type);
  const [balik, setBalik] = useState(false);
  const panel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") tutup();
      if (e.key === "ArrowRight") pindah(1);
      if (e.key === "ArrowLeft") pindah(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [tutup, pindah]);

  /* Bidang yang tertulis di kartu, ditampilkan hanya bila ada. */
  const bidang = [
    kartu.cost && [id ? "Biaya" : "Cost", kartu.cost],
    kartu.risk && [id ? "Risiko" : "Risk", kartu.risk],
    kartu.action && [id ? "Aksi nyata" : "Real-world action", kartu.action],
  ].filter(Boolean) as [string, string][];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[var(--bg-sunken)]/75 backdrop-blur-[3px] sm:items-center sm:p-6"
      onClick={tutup}
    >
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-kartu"
        onClick={(e) => e.stopPropagation()}
        className="rise max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border bg-[var(--surface-3)] p-6 shadow-[var(--lift-3)] outline-none sm:rounded-3xl sm:p-9 rule"
        style={{ "--pita": warna } as React.CSSProperties}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <span className="t-eyebrow" style={{ color: warna }}>
              {namaJenis(kartu.type, lang)}
            </span>
            <h2 id="judul-kartu" className="t-h2 mt-2.5">
              {kartu.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={tutup}
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

        <div className="mt-7 grid gap-8 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-10">
          {/* Kartunya sendiri, bisa dibalik. */}
          <div>
            <div className="balik" data-balik={balik ? "ya" : "tidak"}>
              <div className="balik-isi aspect-[63/88] [--kartu-rasio:63/88]">
                <div className="balik-sisi">
                  <KartuMuka kartu={kartu} lang={lang} />
                </div>
                <div className="balik-sisi balik-belakang">
                  <BelakangKartu kartu={kartu} lang={lang} />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setBalik((b) => !b)}
              className="mt-4 w-full rounded-full border py-2.5 text-[0.78rem] text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-sunken)] rule"
            >
              {balik
                ? id
                  ? "Lihat muka kartu"
                  : "Show the front"
                : id
                  ? "Balik kartu"
                  : "Flip the card"}
            </button>
          </div>

          {/* Seluruh isi kartu dalam bentuk terbaca. */}
          <div>
            {/* Kartu proyek tidak punya prosa: badannya hanya berisi
                bidang yang sudah diuraikan di bawah, jadi tidak diulang
                di sini. */}
            {bidang.length === 0 && (
              <p className="t-body text-[0.95rem]">{kartu.body}</p>
            )}

            {kartu.freeCorePrompt && (
              <p
                className="mt-1 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.75rem] rule"
                style={{ color: warna, borderColor: warna }}
              >
                <span aria-hidden className="h-[6px] w-[6px] rounded-full bg-current" />
                {id ? "Prompt inti, gratis" : "Free core prompt"}
              </p>
            )}

            {kartu.impact && (
              <div className="mt-8">
                <p className="t-eyebrow">
                  {id ? "Dampak pada indikator" : "Impact on indicators"}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {kartu.impact.map((n, i) => (
                    <li key={i} className="flex items-center gap-3 text-[0.88rem]">
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
              </div>
            )}

            {bidang.length > 0 && (
              <dl className="mt-8 space-y-4">
                {bidang.map(([k, v]) => (
                  <div key={k} className="border-t pt-4 rule">
                    <dt className="t-eyebrow !text-[0.62rem]">{k}</dt>
                    <dd className="mt-1.5 text-[0.88rem] leading-relaxed text-[var(--fg-muted)]">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t pt-5 text-[0.78rem] rule">
              <div>
                <dt className="t-eyebrow !text-[0.58rem]">
                  {id ? "Dipakai di" : "Used in"}
                </dt>
                <dd className="mt-1 text-[var(--fg-muted)]">
                  {kartu.phases.map((f) => labelFase(f, lang)).join(" · ")}
                </dd>
              </div>
              {kartu.zone && (
                <div>
                  <dt className="t-eyebrow !text-[0.58rem]">
                    {id ? "Zona" : "Zone"}
                  </dt>
                  <dd className="mt-1 text-[var(--fg-muted)]">
                    {namaZona(kartu.zone, lang)}
                  </dd>
                </div>
              )}
              <div>
                <dt className="t-eyebrow !text-[0.58rem]">
                  {id ? "Kode" : "Code"}
                </dt>
                <dd className="mt-1 font-mono tabular-nums text-[var(--fg-muted)]">
                  {kartu.code}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Menelusuri dek tanpa menutup panel. */}
        <div className="mt-8 flex items-center justify-between border-t pt-5 rule">
          <button
            type="button"
            onClick={() => pindah(-1)}
            className="inline-flex items-center gap-2 text-[0.8rem] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
          >
            <span aria-hidden>←</span>
            {id ? "Sebelumnya" : "Previous"}
          </button>
          <span className="font-mono text-[0.72rem] tabular-nums text-[var(--fg-faint)]">
            {posisi[0]} / {posisi[1]}
          </span>
          <button
            type="button"
            onClick={() => pindah(1)}
            className="inline-flex items-center gap-2 text-[0.8rem] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
          >
            {id ? "Berikutnya" : "Next"}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Sisi belakang kartu di dalam panel. Bukan punggung dek: yang tampil
 * adalah bidang kartu yang tidak muat di muka.
 */
function BelakangKartu({ kartu, lang }: { kartu: Kartu; lang: Lang }) {
  const id = lang === "id";
  const warna = pita(kartu.type);

  return (
    <article
      className="kartu"
      style={{ "--pita": warna } as React.CSSProperties}
    >
      <div className="kartu-badan !pt-5">
        <p className="t-eyebrow !text-[0.58rem]" style={{ color: warna }}>
          {id ? "Selengkapnya" : "In full"}
        </p>
        <p className="mt-3 overflow-y-auto text-[0.78rem] leading-[1.6] text-[var(--fg-muted)]">
          {kartu.body}
        </p>
        <footer className="kartu-kaki">
          <span className="font-mono text-[0.62rem] tabular-nums text-[var(--fg-faint)]">
            {kartu.code}
          </span>
          {kartu.impact && <Dampak nilai={kartu.impact} lang={lang} />}
        </footer>
      </div>
    </article>
  );
}
