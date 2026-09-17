"use client";

import { Ornamen, OrnamenUlang } from "./ornamen";
import {
  INDIKATOR,
  besarDampak,
  keluarga,
  labelFase,
  namaJenis,
  namaZona,
  pita,
  type Kartu,
} from "@/lib/kartu";
import type { Lang } from "@/lib/i18n";

/**
 * Muka kartu.
 *
 * Bentuknya mengikuti kartu di meja: rasio 63 x 88 mm, pita jenis di tepi
 * kiri, ornamen keluarga di kepala, dan kaki yang membawa kode serta
 * angka. Susunannya sama untuk dua belas jenis; yang berbeda hanya
 * bidang yang memang tertulis di kartu itu.
 */
export function KartuMuka({
  kartu,
  lang,
  className = "",
}: {
  kartu: Kartu;
  lang: Lang;
  className?: string;
}) {
  const id = lang === "id";
  const warna = pita(kartu.type);

  /* Sorotan mengikuti kursor. Titiknya ditulis sebagai variabel CSS
     langsung ke simpulnya, jadi tidak ada render ulang React saat
     tetikus bergerak. */
  const ikuti = (e: React.PointerEvent<HTMLElement>) => {
    const k = e.currentTarget;
    const b = k.getBoundingClientRect();
    k.style.setProperty("--sorot-x", `${((e.clientX - b.left) / b.width) * 100}%`);
    k.style.setProperty("--sorot-y", `${((e.clientY - b.top) / b.height) * 100}%`);
  };

  return (
    <article
      className={`kartu ${className}`}
      style={{ "--pita": warna } as React.CSSProperties}
      onPointerMove={ikuti}
    >
      <span aria-hidden className="kartu-sorot" />

      <header className="kartu-kepala">
        <Ornamen keluarga={keluarga(kartu.type)} className="kartu-ornamen" />
        <div className="flex items-baseline justify-between gap-2">
          <span
            className="t-eyebrow !text-[0.58rem] !tracking-[0.16em]"
            style={{ color: warna }}
          >
            {namaJenis(kartu.type, lang)}
          </span>
          <span className="font-mono text-[0.66rem] tabular-nums text-[var(--fg-faint)]">
            {kartu.code}
          </span>
        </div>

        <h3
          className="t-h3 mt-3 text-[1rem] leading-[1.22] text-pretty"
          style={{ textWrap: "balance" }}
        >
          {kartu.title}
        </h3>
      </header>

      <div className="kartu-badan">
        {/* Prosa mengambil sisa tinggi kartu, lalu meredup di batas
            bawahnya. Yang terpotong jadi terbaca sebagai bacaan yang
            bersambung, bukan sebagai kotak yang kurang isi. */}
        <p className="kartu-prosa mt-1 text-[0.82rem] leading-[1.62] text-[var(--fg-muted)]">
          {ringkas(kartu)}
        </p>

        {/* Biaya proyek sebagai keping sumber daya, seperti token yang
            benar-benar dibayarkan di meja. */}
        {kartu.cost && (
          <ul className="kartu-keping mt-4 flex flex-wrap gap-1.5">
            {keping(kartu.cost).map((b, i) => (
              <li
                key={i}
                className="rounded-full border px-2 py-[3px] text-[0.6rem] tabular-nums text-[var(--fg-muted)] rule"
              >
                {b}
              </li>
            ))}
          </ul>
        )}

        <footer className="kartu-kaki">
          <span className="text-[0.62rem] uppercase tracking-[0.13em] text-[var(--fg-faint)]">
            {kartu.zone
              ? namaZona(kartu.zone, lang)
              : kartu.phases.map((f) => labelFase(f, lang)).join(" · ")}
          </span>
          {kartu.impact ? (
            <Dampak nilai={kartu.impact} lang={lang} />
          ) : kartu.freeCorePrompt ? (
            <span
              className="rounded-full border px-2 py-[2px] text-[0.58rem] uppercase tracking-[0.1em]"
              style={{ color: warna, borderColor: warna }}
            >
              {id ? "gratis" : "free"}
            </span>
          ) : (
            <span
              aria-hidden
              className="h-[3px] w-6 rounded-full"
              style={{ background: warna, opacity: 0.35 }}
            />
          )}
        </footer>
      </div>

      <span className="sr-only">
        {id ? "Buka untuk membaca kartu utuh" : "Open to read the full card"}
      </span>
    </article>
  );
}

/**
 * Punggung kartu. Motif keluarga diulang penuh, seperti punggung kartu
 * cetak yang membuat satu dek terlihat satu himpunan.
 */
export function KartuPunggung({
  kartu,
  lang,
  className = "",
}: {
  kartu: Kartu;
  lang: Lang;
  className?: string;
}) {
  const warna = pita(kartu.type);
  return (
    <div
      className={`kartu punggung items-center justify-center ${className}`}
      style={{ "--pita": warna } as React.CSSProperties}
    >
      <OrnamenUlang
        keluarga={keluarga(kartu.type)}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.13]"
      />
      <div className="relative z-[2] px-6 text-center">
        <p className="t-eyebrow !text-[0.6rem]" style={{ color: warna }}>
          {namaJenis(kartu.type, lang)}
        </p>
        <p className="mt-2 font-mono text-[0.72rem] tabular-nums text-[var(--fg-faint)]">
          {kartu.code}
        </p>
      </div>
    </div>
  );
}

/** Empat angka dampak sebagai batang. Nilainya dikutip dari kartu. */
export function Dampak({ nilai, lang }: { nilai: number[]; lang: Lang }) {
  const judul = nilai
    .map((n, i) => `${INDIKATOR[i].nama[lang]} ${n > 0 ? `+${n}` : n}`)
    .join(", ");
  return (
    <span className="flex items-end gap-[3px]" title={judul}>
      <span className="sr-only">{judul}</span>
      {nilai.map((n, i) => (
        <span
          key={i}
          aria-hidden
          className="dampak-batang"
          style={{
            height: `${5 + Math.abs(n) * 6}px`,
            background: INDIKATOR[i].warna,
            opacity: n === 0 ? 0.22 : n < 0 ? 0.55 : 1,
          }}
        />
      ))}
    </span>
  );
}

/**
 * Kalimat yang tampil di muka kartu.
 *
 * Kartu proyek tidak punya prosa: badannya berisi biaya, dampak, risiko,
 * dan aksi nyata. Yang paling berarti dibaca lebih dulu adalah aksinya,
 * jadi itu yang naik ke muka; sisanya menunggu di balik kartu.
 */
function ringkas(k: Kartu) {
  return k.action ?? k.body;
}

/** "Knowledge 2, Community 1" menjadi dua keping terpisah. */
function keping(biaya: string) {
  return biaya
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);
}

export { besarDampak };
