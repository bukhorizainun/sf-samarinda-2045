"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { KartuMuka } from "./kartu/KartuMuka";
import { PanelKartu } from "./kartu/PanelKartu";
import {
  besarDampak,
  labelFase,
  namaJenis,
  namaZona,
  pita,
  type Kartu,
} from "@/lib/kartu";
import type { Lang } from "@/lib/i18n";

export type { Kartu };

type Urutan = "kode" | "judul" | "dampak";
type Saring = {
  jenis: string;
  zona: string;
  fase: string;
  q: string;
  urut: Urutan;
};

const KOSONG: Saring = { jenis: "", zona: "", fase: "", q: "", urut: "kode" };

/** Berapa kartu dirender lebih dulu. Sisanya menyusul saat digulir,
 *  supaya 184 kartu berornamen tidak dipasang sekaligus di ponsel. */
const SEKALI_MUAT = 48;

/* ---------- Penyaring tinggal di alamat halaman ----------

   Alamat adalah satu-satunya sumber kebenaran, bukan salinan dari
   keadaan komponen. Fasilitator bisa membagikan tautan ke satu himpunan
   kartu, tombol kembali peramban bekerja, dan tidak ada dua nilai yang
   bisa berselisih. React membacanya lewat useSyncExternalStore, jadi
   halaman ini boleh terbit sebagai HTML statis tanpa bagian tanya dan
   tetap terhidrasi dengan benar. */

const pendengar = new Set<() => void>();

function langgan(kabari: () => void) {
  pendengar.add(kabari);
  window.addEventListener("popstate", kabari);
  return () => {
    pendengar.delete(kabari);
    window.removeEventListener("popstate", kabari);
  };
}

const bacaPeramban = () => window.location.search;
const bacaTerbitan = () => "";

function urai(tanya: string): Saring {
  const p = new URLSearchParams(tanya);
  return {
    jenis: p.get("jenis") ?? "",
    zona: p.get("zona") ?? "",
    fase: p.get("fase") ?? "",
    q: p.get("q") ?? "",
    urut: (p.get("urut") as Urutan) ?? "kode",
  };
}

function tulis(saring: Saring) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(saring)) {
    if (v && !(k === "urut" && v === "kode")) p.set(k, v);
  }
  window.history.replaceState(
    null,
    "",
    p.toString() ? `${window.location.pathname}?${p}` : window.location.pathname,
  );
  for (const kabari of [...pendengar]) kabari();
}

export function CardCatalog({ cards, lang }: { cards: Kartu[]; lang: Lang }) {
  const id = lang === "id";
  const tanya = useSyncExternalStore(langgan, bacaPeramban, bacaTerbitan);
  const saring = useMemo(() => urai(tanya), [tanya]);

  const ubah = useCallback(
    (bidang: Partial<Saring>) =>
      tulis({ ...urai(window.location.search), ...bidang }),
    [],
  );

  const [tampilan, setTampilan] = useState<"petak" | "daftar">("petak");

  const hitungJenis = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of cards) m[c.type] = (m[c.type] ?? 0) + 1;
    return m;
  }, [cards]);

  const sumbu = useMemo(() => {
    const jenis: string[] = [];
    const zona: string[] = [];
    const fase = new Set<number>();
    for (const c of cards) {
      if (!jenis.includes(c.type)) jenis.push(c.type);
      if (c.zone && !zona.includes(c.zone)) zona.push(c.zone);
      for (const f of c.phases) fase.add(f);
    }
    return { jenis, zona, fase: [...fase].sort((a, b) => a - b) };
  }, [cards]);

  const hasil = useMemo(() => {
    const q = saring.q.trim().toLowerCase();
    const fase = saring.fase ? Number(saring.fase) : null;

    const cocok = cards.filter(
      (c) =>
        (!saring.jenis || c.type === saring.jenis) &&
        (!saring.zona || c.zone === saring.zona) &&
        (fase === null || c.phases.includes(fase)) &&
        (!q ||
          c.title.toLowerCase().includes(q) ||
          c.body.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)),
    );

    if (saring.urut === "judul") {
      return [...cocok].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (saring.urut === "dampak") {
      return [...cocok].sort((a, b) => besarDampak(b) - besarDampak(a));
    }
    return cocok;
  }, [cards, saring]);

  const bersih = !!(saring.jenis || saring.zona || saring.fase || saring.q);

  return (
    <div>
      <Penyaring
        lang={lang}
        sumbu={sumbu}
        saring={saring}
        ubah={ubah}
        jumlah={hasil.length}
        bersih={bersih}
        hitungJenis={hitungJenis}
        total={cards.length}
        tampilan={tampilan}
        setTampilan={setTampilan}
      />

      {/* Petak dipasang ulang setiap penyaring berubah, jadi jumlah kartu
          yang sudah dimuat kembali ke awal tanpa efek tambahan. */}
      <Petak key={tanya} hasil={hasil} lang={lang} tampilan={tampilan} />

      {hasil.length === 0 && (
        <div className="mt-16 text-center">
          <p className="t-body">
            {id
              ? "Tidak ada kartu yang cocok dengan penyaring itu."
              : "No card matches those filters."}
          </p>
          <button
            type="button"
            onClick={() => ubah(KOSONG)}
            className="mt-5 rounded-full border px-5 py-2.5 text-[0.8rem] transition-colors hover:bg-[var(--bg-sunken)] rule"
          >
            {id ? "Kosongkan penyaring" : "Clear filters"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Petak kartu ---------- */

function Petak({
  hasil,
  lang,
  tampilan,
}: {
  hasil: Kartu[];
  lang: Lang;
  tampilan: "petak" | "daftar";
}) {
  const id = lang === "id";
  const [tampil, setTampil] = useState(SEKALI_MUAT);
  const [buka, setBuka] = useState<Kartu | null>(null);
  const asal = useRef<HTMLElement | null>(null);
  const ujung = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sen = ujung.current;
    if (!sen || tampil >= hasil.length) return;
    const mata = new IntersectionObserver(
      ([e]) => e.isIntersecting && setTampil((n) => n + SEKALI_MUAT),
      { rootMargin: "800px" },
    );
    mata.observe(sen);
    return () => mata.disconnect();
  }, [tampil, hasil.length]);

  return (
    <>
      {/* Lebar kolom tetap supaya rasio kartu terjaga di tiap lebar layar. */}
      {tampilan === "daftar" ? (
        <ul className="mt-9 overflow-hidden rounded-2xl border rule">
          {hasil.slice(0, tampil).map((c) => (
            <li key={c.code} className="border-b last:border-b-0 rule">
              <button
                type="button"
                onClick={(e) => {
                  asal.current = e.currentTarget;
                  setBuka(c);
                }}
                className="baris-kartu"
                style={{ "--pita": pita(c.type) } as React.CSSProperties}
              >
                <span className="mono text-[0.75rem] text-[var(--fg-faint)]">{c.code}</span>
                <span className="hidden text-[0.72rem] font-semibold uppercase tracking-[0.1em] md:block" style={{ color: pita(c.type) }}>
                  {namaJenis(c.type, lang)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[0.95rem] font-medium">{c.title}</span>
                  <span className="block truncate text-[0.78rem] text-[var(--fg-faint)]">{c.body}</span>
                </span>
                <span className="mono shrink-0 text-right text-[0.68rem] text-[var(--fg-faint)]">
                  {c.zone ? namaZona(c.zone, lang) : c.phases.map((f) => (f === 0 ? labelFase(0, lang) : `F${f}`)).join(" · ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
      <ul className="mt-9 grid grid-cols-[repeat(auto-fill,minmax(15.5rem,1fr))] gap-5 sm:gap-6">
        {hasil.slice(0, tampil).map((c) => (
          <li key={c.code}>
            <button
              type="button"
              onClick={(e) => {
                asal.current = e.currentTarget;
                setBuka(c);
              }}
              className="block w-full rounded-[14px] text-left"
              aria-label={`${namaJenis(c.type, lang)} ${c.code}: ${c.title}`}
            >
              <KartuMuka kartu={c} lang={lang} />
            </button>
          </li>
        ))}
      </ul>
      )}

      <div ref={ujung} aria-hidden className="h-px" />

      {tampil < hasil.length && (
        <p className="mt-10 text-center text-xs text-[var(--fg-faint)]">
          {id
            ? `Menampilkan ${tampil} dari ${hasil.length} kartu`
            : `Showing ${tampil} of ${hasil.length} cards`}
        </p>
      )}

      {buka && (
        <PanelKartu
          /* Dikunci pada kode kartu: panel yang baru selalu mulai dari
             muka kartu, tanpa menyetel ulang keadaan di dalam efek. */
          key={buka.code}
          kartu={buka}
          lang={lang}
          tutup={() => {
            setBuka(null);
            asal.current?.focus();
          }}
          pindah={(arah) => {
            const i = hasil.findIndex((c) => c.code === buka.code);
            setBuka(hasil[(i + arah + hasil.length) % hasil.length]);
          }}
          posisi={[
            hasil.findIndex((c) => c.code === buka.code) + 1,
            hasil.length,
          ]}
        />
      )}
    </>
  );
}

/* ---------- Penyaring ---------- */

function Penyaring({
  lang,
  sumbu,
  saring,
  ubah,
  jumlah,
  bersih,
  hitungJenis,
  total,
  tampilan,
  setTampilan,
}: {
  lang: Lang;
  sumbu: { jenis: string[]; zona: string[]; fase: number[] };
  saring: Saring;
  ubah: (b: Partial<Saring>) => void;
  jumlah: number;
  bersih: boolean;
  hitungJenis: Record<string, number>;
  total: number;
  tampilan: "petak" | "daftar";
  setTampilan: (t: "petak" | "daftar") => void;
}) {
  const id = lang === "id";

  return (
    <div className="rounded-2xl border bg-[color-mix(in_oklab,var(--surface-2)_88%,transparent)] p-5 shadow-[var(--lift-2)] backdrop-blur-md sm:p-6 rule">
      {/* Sumbu satu: jenis kartu. */}
      <div
        role="tablist"
        aria-label={id ? "Jenis kartu" : "Card types"}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <Keping
          on={!saring.jenis}
          pilih={() => ubah({ jenis: "" })}
          label={id ? "Semua jenis" : "All types"}
          hitung={total}
        />
        {sumbu.jenis.map((j) => (
          <Keping
            key={j}
            on={saring.jenis === j}
            pilih={() => ubah({ jenis: saring.jenis === j ? "" : j })}
            label={namaJenis(j, lang)}
            hitung={hitungJenis[j]}
            warna={pita(j)}
            ikon={
              <span className="block h-[7px] w-[7px] rounded-full bg-current" />
            }
          />
        ))}
      </div>

      {/* Sumbu dua: fase permainan dan zona tematik, plus pencarian. */}
      <div className="mt-5 flex flex-col gap-4 border-t pt-5 rule lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="t-eyebrow !text-[0.6rem] mr-1">
            {id ? "Fase" : "Phase"}
          </span>
          {sumbu.fase.map((f) => (
            <Keping
              key={f}
              kecil
              on={saring.fase === String(f)}
              pilih={() =>
                ubah({ fase: saring.fase === String(f) ? "" : String(f) })
              }
              label={f === 0 ? labelFase(0, lang) : String(f)}
            />
          ))}

          <span className="t-eyebrow !text-[0.6rem] ml-3 mr-1">
            {id ? "Zona" : "Zone"}
          </span>
          <select
            value={saring.zona}
            onChange={(e) => ubah({ zona: e.target.value })}
            aria-label={id ? "Zona tematik" : "Thematic zone"}
            className="rounded-full border bg-transparent px-3.5 py-2 text-[0.78rem] rule"
          >
            <option value="">{id ? "Semua" : "All"}</option>
            {sumbu.zona.map((z) => (
              <option key={z} value={z}>
                {namaZona(z, lang)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="cari" className="sr-only">
            {id ? "Cari kartu" : "Search cards"}
          </label>
          <input
            id="cari"
            type="search"
            value={saring.q}
            onChange={(e) => ubah({ q: e.target.value })}
            placeholder={id ? "Cari kartu…" : "Search cards…"}
            className="w-full min-w-0 rounded-full border bg-transparent px-4 py-2 text-[0.82rem] outline-none placeholder:text-[var(--fg-faint)] rule lg:w-52"
          />
          <select
            value={saring.urut}
            onChange={(e) => ubah({ urut: e.target.value as Urutan })}
            aria-label={id ? "Urutan" : "Sort order"}
            className="shrink-0 rounded-full border bg-transparent px-3.5 py-2 text-[0.78rem] rule"
          >
            <option value="kode">{id ? "Urut kode" : "By code"}</option>
            <option value="judul">{id ? "Urut judul" : "By title"}</option>
            <option value="dampak">
              {id ? "Dampak terbesar" : "Largest impact"}
            </option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tabular-nums text-[var(--fg-faint)]">
        <span className="mono text-[var(--fg)]">
          {jumlah}
          <span className="text-[var(--fg-faint)]"> / {total}</span>{" "}
          {id ? "kartu" : "cards"}
        </span>
        <span aria-hidden>·</span>
        <span>
          {id
            ? "naskah kartu berbahasa Inggris, mengikuti dek resmi"
            : "card text follows the official English deck"}
        </span>
        {bersih && (
          <button
            type="button"
            onClick={() => ubah(KOSONG)}
            className="underline underline-offset-4 transition-colors hover:text-[var(--fg)]"
          >
            {id ? "kosongkan" : "clear"}
          </button>
        )}
      </p>
      <div className="segmen !p-0.5" role="group" aria-label={id ? "Tampilan" : "View"}>
        {(["petak", "daftar"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={tampilan === v}
            onClick={() => setTampilan(v)}
            className="segmen-tab !min-h-0 !px-3 !py-1.5 !text-[0.75rem]"
          >
            {v === "petak" ? (id ? "Petak" : "Grid") : id ? "Daftar" : "List"}
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}

function Keping({
  on,
  pilih,
  label,
  warna,
  ikon,
  kecil,
  hitung,
}: {
  hitung?: number;
  on: boolean;
  pilih: () => void;
  label: string;
  warna?: string;
  ikon?: React.ReactNode;
  kecil?: boolean;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={on}
      onClick={pilih}
      style={on && warna ? { borderColor: warna } : undefined}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border transition-colors duration-[var(--gerak-cepat)] rule ${
        kecil ? "px-3 py-1.5 text-[0.75rem]" : "px-3.5 py-2 text-[0.78rem]"
      } ${
        on
          ? "bg-[var(--fg)] text-[var(--bg)]"
          : "text-[var(--fg-muted)] hover:bg-[var(--bg-sunken)]"
      }`}
    >
      {ikon && (
        <span style={{ color: on ? "var(--bg)" : warna }} aria-hidden>
          {ikon}
        </span>
      )}
      {label}
      {hitung !== undefined && <span className="hitung">{hitung}</span>}
    </button>
  );
}
