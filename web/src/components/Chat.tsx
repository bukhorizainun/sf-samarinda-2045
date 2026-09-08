"use client";

import { useEffect, useRef, useState } from "react";
import { LAB } from "@/content/site";
import { t, type Lang } from "@/lib/i18n";

type Pesan = { role: "user" | "assistant"; content: string };

export function Chat({ lang }: { lang: Lang }) {
  const id = lang === "id";
  const [pesan, setPesan] = useState<Pesan[]>([]);
  const [teks, setTeks] = useState("");
  const [menunggu, setMenunggu] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const akhirRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pesan.length) akhirRef.current?.scrollIntoView({ block: "nearest" });
  }, [pesan, menunggu]);

  async function kirim(isi: string) {
    const bersih = isi.trim();
    if (!bersih || menunggu) return;

    const riwayat: Pesan[] = [...pesan, { role: "user", content: bersih }];
    setPesan(riwayat);
    setTeks("");
    setGalat(null);
    setMenunggu(true);

    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lang, messages: riwayat }),
      });
      // Di penyajian statis, /api/chat tidak ada dan yang kembali halaman HTML.
      // Itu bukan galat jaringan, jadi keadaannya dijelaskan apa adanya.
      if (r.status === 404 || !r.headers.get("content-type")?.includes("json")) {
        throw new Error(
          id
            ? "Pendamping belum aktif di pratinjau ini. Tampilan dan contoh pertanyaannya sudah final; jawabannya menyusul setelah layanan AI dipasang."
            : "The companion is not live in this preview. The interface and starter questions are final; answers follow once the AI service is connected.",
        );
      }
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "");
      setPesan([...riwayat, { role: "assistant", content: data.text }]);
    } catch (e) {
      setGalat(
        (e as Error).message ||
          (id
            ? "Pendamping sedang tidak bisa dihubungi."
            : "The companion could not be reached."),
      );
    } finally {
      setMenunggu(false);
    }
  }

  const kosong = pesan.length === 0;

  return (
    <div className="overflow-hidden rounded-2xl border rule">
      {/* Percakapan */}
      <div className="min-h-[22rem] space-y-6 bg-[var(--bg-raised)] p-6 sm:p-8">
        {kosong && (
          <div>
            <p className="t-eyebrow">
              {id ? "Coba mulai dari sini" : "Try starting here"}
            </p>
            <ul className="mt-4 space-y-2.5">
              {LAB.starters[lang].map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => kirim(s)}
                    className="w-full rounded-xl border px-4 py-3 text-left text-[0.9rem] leading-relaxed text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--fg)] rule"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pesan.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--bg-sunken)] px-4 py-3 text-[0.925rem] leading-relaxed">
                {m.content}
              </p>
            </div>
          ) : (
            <div key={i} className="flex gap-3">
              <span
                aria-hidden
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full sf-gradient"
              />
              <div className="measure space-y-3 text-[0.95rem] leading-relaxed">
                {m.content.split(/\n+/).map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          ),
        )}

        {menunggu && (
          <p className="flex items-center gap-2 text-sm text-[var(--fg-faint)]">
            <span
              aria-hidden
              className="h-2 w-2 animate-pulse rounded-full sf-gradient"
            />
            {id ? "Sedang berpikir…" : "Thinking…"}
          </p>
        )}

        {galat && (
          <p role="alert" className="text-sm text-[var(--fg-muted)]">
            {galat}
          </p>
        )}

        <div ref={akhirRef} />
      </div>

      {/* Kolom tulis */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          kirim(teks);
        }}
        className="flex items-end gap-3 border-t bg-[var(--bg)] p-4 rule sm:p-5"
      >
        <label htmlFor="tanya" className="sr-only">
          {t(LAB.placeholder, lang)}
        </label>
        <textarea
          id="tanya"
          rows={1}
          value={teks}
          maxLength={1200}
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
          disabled={menunggu || !teks.trim()}
          className="shrink-0 rounded-full bg-[var(--fg)] px-5 py-2.5 text-[0.85rem] font-medium text-[var(--bg)] transition-opacity disabled:opacity-35"
        >
          {id ? "Kirim" : "Send"}
        </button>
      </form>

      <p className="border-t bg-[var(--bg)] px-5 pb-4 text-xs leading-relaxed text-[var(--fg-faint)] rule">
        <span className="block pt-4">{t(LAB.disclaimer, lang)}</span>
      </p>
    </div>
  );
}
