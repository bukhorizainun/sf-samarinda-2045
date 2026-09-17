"use client";

import { KartuMuka } from "./kartu/KartuMuka";
import { Ornamen, type Keluarga } from "./kartu/ornamen";
import { namaJenis, pita, type Kartu } from "@/lib/kartu";
import type { Lang } from "@/lib/i18n";

/**
 * Papan bahan rupa. Semua contoh di bawah dibangun dari token dan
 * komponen yang sama dengan halaman sungguhan, jadi papan ini tidak
 * bisa berbohong: kalau tokennya berubah, contohnya ikut berubah.
 */
export function PapanGaya({ cards, lang }: { cards: Kartu[]; lang: Lang }) {
  const id = lang === "id";

  /* Satu kartu contoh untuk tiap jenis, diambil dari dek sungguhan. */
  const contoh: Kartu[] = [];
  for (const c of cards) {
    if (!contoh.some((k) => k.type === c.type)) contoh.push(c);
  }

  return (
    <div className="space-y-20">
      <Bagian
        judul={id ? "Warna" : "Colour"}
        catatan={
          id
            ? "Empat warna indikator milik panduan permainan dan tidak boleh digeser; warna aurora hanya untuk rupa situs."
            : "The four indicator colours belong to the game guide and must not shift; the aurora colours are for the site's own surfaces."
        }
      >
        <div className="grid gap-8 sm:grid-cols-2">
          <Petak
            judul={id ? "Indikator kota" : "City indicators"}
            warna={[
              ["Environment", "var(--color-env)"],
              ["Society", "var(--color-society)"],
              ["Economy", "var(--color-economy)"],
              ["Future Readiness", "var(--color-future)"],
            ]}
          />
          <Petak
            judul={id ? "Aurora situs" : "Site aurora"}
            warna={[
              ["mint", "var(--color-mint)"],
              ["aqua", "var(--color-aqua)"],
              ["iris", "var(--color-iris)"],
              ["ember", "var(--color-ember)"],
            ]}
          />
        </div>
      </Bagian>

      <Bagian
        judul={id ? "Tipografi" : "Typography"}
        catatan={
          id
            ? "Enam tingkat, tanpa titik patah: ukurannya menempel pada lebar layar lewat clamp(). Judul memakai Fraunces dengan sumbu optis yang disetel per tingkat."
            : "Six levels, no breakpoints: sizes ride the viewport through clamp(). Headings use Fraunces with the optical axis tuned per level."
        }
      >
        <div className="space-y-6 border-t pt-8 rule">
          {[
            ["t-display", "Hari ini kita memutuskan"],
            ["t-h1", "Seluruh 184 kartu, terbuka untuk dibaca"],
            ["t-h2", "Setiap meja menyusun tiga masa depan"],
            ["t-h3", "Empat City Indicator, skala nol sampai sepuluh"],
            ["t-lead", "Prosa pengantar, dibatasi 62 karakter per baris."],
            ["t-body", "Prosa isi, dipakai untuk paragraf panjang."],
          ].map(([kelas, teks]) => (
            <div key={kelas} className="grid gap-2 sm:grid-cols-[7rem_1fr]">
              <code className="pt-2 font-mono text-[0.7rem] text-[var(--fg-faint)]">
                {kelas}
              </code>
              <p className={`${kelas} measure`}>{teks}</p>
            </div>
          ))}
        </div>
      </Bagian>

      <Bagian
        judul={id ? "Permukaan" : "Surfaces"}
        catatan={
          id
            ? "Empat kedalaman bernama. Halaman, kartu, panel menonjol, dan lapis yang menimpa. Tidak ada bayangan kelima."
            : "Four named depths: the page, a card, a raised panel, and the layer that covers everything. There is no fifth shadow."
        }
      >
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            ["--lift-1", id ? "Kartu" : "Card"],
            ["--lift-2", id ? "Menonjol" : "Raised"],
            ["--lift-3", id ? "Menimpa" : "Overlay"],
          ].map(([token, nama]) => (
            <div
              key={token}
              className="rounded-2xl border bg-[var(--surface-1)] p-6 rule"
              style={{ boxShadow: `var(${token})` }}
            >
              <p className="text-[0.9rem] font-medium">{nama}</p>
              <code className="mt-1 block font-mono text-[0.68rem] text-[var(--fg-faint)]">
                {token}
              </code>
            </div>
          ))}
        </div>
      </Bagian>

      <Bagian
        judul={id ? "Gerak" : "Motion"}
        catatan={
          id
            ? "Satu kurva untuk seluruh situs, tiga durasi. Semuanya berhenti saat pengunjung meminta gerakan dikurangi."
            : "One curve across the whole site, three durations. Everything stops when the visitor asks for reduced motion."
        }
      >
        <dl className="grid gap-5 border-t pt-8 rule sm:grid-cols-3">
          {[
            ["--gerak-cepat", "120 ms", id ? "sentuhan kecil, warna" : "small touches, colour"],
            ["--gerak-sedang", "280 ms", id ? "naik, bayangan, pindah" : "lift, shadow, movement"],
            ["--gerak-lambat", "520 ms", id ? "membalik kartu" : "flipping a card"],
          ].map(([token, nilai, guna]) => (
            <div key={token}>
              <dt className="font-mono text-[0.7rem] text-[var(--fg-faint)]">
                {token}
              </dt>
              <dd className="mt-1.5 text-[0.95rem] tabular-nums font-medium">
                {nilai}
              </dd>
              <dd className="mt-1 text-[0.85rem] text-[var(--fg-muted)]">
                {guna}
              </dd>
            </div>
          ))}
        </dl>
      </Bagian>

      <Bagian
        lebar
        judul={id ? "Enam keluarga motif" : "Six ornament families"}
        catatan={
          id
            ? "Dua belas jenis kartu dikelompokkan menjadi enam keluarga rupa. Motifnya diturunkan dari kosakata anyaman — jalinan kepang, pucuk rebung, tumpal, mata punai — dan dari kelokan Mahakam. Yang dipinjam tata jalinannya, bukan lambang upacara."
            : "Twelve card types group into six visual families. The motifs derive from weaving vocabulary — plaiting, bamboo-shoot triangles, tumpal bands, rhombus eyes — and from the bend of the Mahakam. What is borrowed is the geometry, never a ceremonial symbol."
        }
      >
        <ul className="grid gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {(
            [
              ["peran", id ? "Peran" : "Roles"],
              ["konteks", id ? "Konteks" : "Context"],
              ["dorong", id ? "Gaya dorong" : "Drivers"],
              ["proyek", id ? "Proyek" : "Projects"],
              ["kesempatan", id ? "Kesempatan" : "Chance"],
              ["bukti", id ? "Bukti" : "Evidence"],
            ] as [Keluarga, string][]
          ).map(([k, nama]) => (
            <li
              key={k}
              className="rounded-2xl border bg-[var(--surface-1)] p-5 text-center rule"
            >
              <Ornamen
                keluarga={k}
                className="mx-auto h-16 w-16 text-[var(--fg-muted)]"
              />
              <p className="mt-3 text-[0.82rem] font-medium">{nama}</p>
              <code className="mt-0.5 block font-mono text-[0.65rem] text-[var(--fg-faint)]">
                {k}
              </code>
            </li>
          ))}
        </ul>
      </Bagian>

      <Bagian
        lebar
        judul={id ? "Dua belas muka kartu" : "All twelve card faces"}
        catatan={
          id
            ? "Satu kartu sungguhan dari tiap jenis, dibangun oleh komponen yang sama dengan katalog."
            : "One real card of each type, built by the same component the catalogue uses."
        }
      >
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-5">
          {contoh.map((c) => (
            <li key={c.code}>
              <p
                className="t-eyebrow !text-[0.6rem] mb-2.5"
                style={{ color: pita(c.type) }}
              >
                {namaJenis(c.type, lang)}
              </p>
              <KartuMuka kartu={c} lang={lang} />
            </li>
          ))}
        </ul>
      </Bagian>
    </div>
  );
}

/**
 * Satu bagian papan: judul di kolom kiri, keterangan dan contohnya di
 * kanan. Bagian yang contohnya berupa petak kartu memakai `lebar`,
 * supaya petak itu memakai seluruh lebar halaman.
 */
function Bagian({
  judul,
  catatan,
  lebar,
  children,
}: {
  judul: string;
  catatan: string;
  lebar?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-12">
        <div>
          <h2 className="t-h3">{judul}</h2>
        </div>
        <div>
          <p className="t-body measure text-[0.92rem]">{catatan}</p>
          {!lebar && <div className="mt-8">{children}</div>}
        </div>
      </div>
      {lebar && <div className="mt-9">{children}</div>}
    </section>
  );
}

function Petak({
  judul,
  warna,
}: {
  judul: string;
  warna: [string, string][];
}) {
  return (
    <div>
      <p className="t-eyebrow !text-[0.62rem]">{judul}</p>
      <ul className="mt-4 space-y-2.5">
        {warna.map(([nama, nilai]) => (
          <li key={nama} className="flex items-center gap-3">
            <span
              aria-hidden
              className="h-7 w-7 shrink-0 rounded-lg border rule"
              style={{ background: nilai }}
            />
            <span className="flex-1 text-[0.88rem]">{nama}</span>
            <code className="font-mono text-[0.68rem] text-[var(--fg-faint)]">
              {nilai.replace("var(--color-", "").replace(")", "")}
            </code>
          </li>
        ))}
      </ul>
    </div>
  );
}
