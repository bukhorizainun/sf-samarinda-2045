"use client";

import { useEffect, useRef, useState } from "react";
import { LAB } from "@/content/site";

// next/image tidak menambahkan basePath pada gambar statis, jadi awalannya
// dipasang sendiri di sini supaya wajah Shelbot tetap muncul di GitHub Pages.
const AWALAN = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const WAJAH = `${AWALAN}/gambar/shelbot-avatar.webp`;
import { tanya, type Jawaban } from "@/lib/shelbot";
import { t, type Lang } from "@/lib/i18n";

type Pesan =
  | { dari: "orang"; teks: string }
  | { dari: "shelbot"; teks: string; sumber?: string };

/** Jeda menjawab, dibuat sebanding panjang jawaban supaya terasa wajar. */
const jeda = (teks: string) => Math.min(1500, 420 + teks.length * 3.2);

export function Shelbot({ lang }: { lang: Lang }) {
  const id = lang === "id";
  const [pesan, setPesan] = useState<Pesan[]>([]);
  const [teks, setTeks] = useState("");
  const [mengetik, setMengetik] = useState(false);
  const [lanjutan, setLanjutan] = useState<string[]>(LAB.starters[lang]);
  const akhirRef = useRef<HTMLDivElement>(null);
  const hidupRef = useRef(true);

  useEffect(() => () => void (hidupRef.current = false), []);
  useEffect(() => {
    if (pesan.length) akhirRef.current?.scrollIntoView({ block: "nearest" });
  }, [pesan, mengetik]);

  function kirim(isi: string) {
    const bersih = isi.trim();
    if (!bersih || mengetik) return;

    setPesan((p) => [...p, { dari: "orang", teks: bersih }]);
    setTeks("");
    setLanjutan([]);
    setMengetik(true);

    // Jawabannya dihitung di sini juga, di dalam peramban. Tidak ada
    // permintaan jaringan, jadi tidak ada yang bisa gagal di tengah jalan.
    const jawab: Jawaban = tanya(bersih, lang);

    setTimeout(() => {
      if (!hidupRef.current) return;
      setPesan((p) => [
        ...p,
        { dari: "shelbot", teks: jawab.teks, sumber: jawab.sumber },
      ]);
      setLanjutan(jawab.lanjutan ?? []);
      setMengetik(false);
    }, jeda(jawab.teks));
  }

  const kosong = pesan.length === 0;

  return (
    <div className="glass overflow-hidden">
      {/* Kepala */}
      <div className="flex items-center gap-4 border-b p-5 rule sm:px-7">
        <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-[var(--line-strong)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={WAJAH} alt="" width={360} height={360}
            className="h-full w-full object-cover" />
        </span>
        <div>
          <p className="text-[0.95rem] font-semibold">Shelbot</p>
          <p className="flex items-center gap-2 text-[0.78rem] text-[var(--fg-faint)]">
            <span
              aria-hidden
              className="pulse-soft inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-mint)]"
            />
            {id
              ? "Berjalan di peramban kamu, tanpa server"
              : "Runs in your browser, no server"}
          </p>
        </div>
      </div>

      {/* Percakapan */}
      <div className="min-h-[24rem] space-y-6 p-6 sm:p-7">
        {kosong && (
          <div className="flex gap-4">
            <Wajah />
            <div className="measure">
              <p className="text-[0.95rem] leading-relaxed">
                {id
                  ? "Halo! Aku Shelbot. Aku tahu isi permainan ini luar dalam — enam fasenya, kelima peran, empat indikator kota, dan seluruh 184 kartunya. Tanya apa saja, atau mulai dari salah satu ini."
                  : "Hello! I'm Shelbot. I know this game inside out — its six phases, five roles, four city indicators, and all 184 cards. Ask me anything, or start with one of these."}
              </p>
            </div>
          </div>
        )}

        {pesan.map((m, i) =>
          m.dari === "orang" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--bg-sunken)] px-4 py-3 text-[0.925rem] leading-relaxed">
                {m.teks}
              </p>
            </div>
          ) : (
            <div key={i} className="rise flex gap-4">
              <Wajah />
              <div className="measure">
                <div className="space-y-3 text-[0.95rem] leading-relaxed">
                  {m.teks.split("\n\n").map((p, j) => (
                    <p key={j} className="whitespace-pre-line">
                      {p}
                    </p>
                  ))}
                </div>
                {m.sumber && (
                  <p className="mt-3 text-[0.75rem] text-[var(--fg-faint)]">
                    {id ? "Sumber" : "Source"}: {m.sumber}
                  </p>
                )}
              </div>
            </div>
          ),
        )}

        {mengetik && (
          <div className="flex gap-4">
            <Wajah />
            <p className="flex items-center gap-1.5 pt-3" aria-live="polite">
              <span className="sr-only">
                {id ? "Shelbot sedang menulis" : "Shelbot is typing"}
              </span>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  aria-hidden
                  className="pulse-soft h-1.5 w-1.5 rounded-full bg-[var(--fg-faint)]"
                  style={{ animationDelay: `${i * 0.22}s` }}
                />
              ))}
            </p>
          </div>
        )}

        {/* Pertanyaan lanjutan, berganti mengikuti jawaban terakhir */}
        {lanjutan.length > 0 && !mengetik && (
          <ul className="rise flex flex-wrap gap-2 pt-1">
            {lanjutan.map((s, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => kirim(s)}
                  className="rounded-full border px-4 py-2 text-left text-[0.85rem] leading-snug text-[var(--fg-muted)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--fg)] rule"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div ref={akhirRef} />
      </div>

      {/* Kolom tulis */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          kirim(teks);
        }}
        className="flex items-end gap-3 border-t p-4 rule sm:p-5"
      >
        <label htmlFor="tanya" className="sr-only">
          {t(LAB.placeholder, lang)}
        </label>
        <textarea
          id="tanya"
          rows={1}
          value={teks}
          maxLength={500}
          onChange={(e) => setTeks(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              kirim(teks);
            }
          }}
          placeholder={t(LAB.placeholder, lang)}
          className="max-h-40 min-h-[2.75rem] flex-1 resize-none bg-transparent py-2.5 text-[0.95rem] leading-relaxed outline-none placeholder:text-[var(--fg-faint)]"
        />
        <button
          type="submit"
          disabled={mengetik || !teks.trim()}
          className="shrink-0 rounded-full bg-[var(--fg)] px-5 py-2.5 text-[0.85rem] font-medium text-[var(--bg)] transition-opacity disabled:opacity-35"
        >
          {id ? "Kirim" : "Send"}
        </button>
      </form>

      <p className="border-t px-5 py-4 text-xs leading-relaxed text-[var(--fg-faint)] rule">
        {t(LAB.disclaimer, lang)}
      </p>
    </div>
  );
}

/** Wajah kecil di samping tiap jawaban. */
function Wajah() {
  return (
    <span className="relative mt-0.5 block h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-[var(--line)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={WAJAH} alt="" width={360} height={360}
        className="h-full w-full object-cover" />
    </span>
  );
}
