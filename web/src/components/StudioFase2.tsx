"use client";

import { useRef, useState } from "react";
import { FUTURES } from "@/content/site";
import { t, type Lang } from "@/lib/i18n";

/* Studio Fase 2: siswa menulis bayangan Samarinda 2045 untuk satu skenario,
   lalu Worker (Flux di Cloudflare) menggambarnya. Gambar selalu ilustrasi,
   selalu bertanda AI, tidak disimpan, dan prompt-nya ditampilkan terbuka
   seperti aturan GenAI di dalam permainan. Tanpa alamat Worker, studio ini
   tidak tampil. */
const API = process.env.NEXT_PUBLIC_SHELBOT_API?.replace(/\/$/, "");

type Hasil = { gambar: string; prompt: string; skenario: string; deskripsi: string };

export function StudioFase2({ lang }: { lang: Lang }) {
  const id = lang === "id";
  const [ke, setKe] = useState(2); // mulai dari Transformative: paling memancing imajinasi
  const [deskripsi, setDeskripsi] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState("");
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const gambarRef = useRef<HTMLImageElement>(null);

  if (!API) return null;
  const aktif = FUTURES[ke];
  const tanda = id ? "GAMBAR AI · BUKAN FOTO SAMARINDA" : "AI IMAGE · NOT A PHOTO OF SAMARINDA";

  async function buat(e: React.FormEvent) {
    e.preventDefault();
    if (sibuk) return;
    setSibuk(true);
    setGalat("");
    try {
      const r = await fetch(`${API}/gambar`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ skenario: aktif.key, deskripsi, lang }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.gambar) {
        throw new Error(d.galat || (id ? "Gambar belum bisa dibuat. Coba lagi sebentar." : "The image could not be made. Try again shortly."));
      }
      setHasil({ gambar: d.gambar, prompt: d.prompt, skenario: t(aktif.nama, lang), deskripsi });
    } catch (err) {
      setGalat(err instanceof Error ? err.message : String(err));
    } finally {
      setSibuk(false);
    }
  }

  /** Unduhan membawa tanda AI di dalam gambarnya, bukan hanya di halaman. */
  function unduh() {
    const img = gambarRef.current;
    if (!img || !hasil) return;
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const g = c.getContext("2d");
    if (!g) return;
    g.drawImage(img, 0, 0);
    const tinggi = Math.round(c.height * 0.06);
    g.fillStyle = "rgba(10, 20, 22, 0.78)";
    g.fillRect(0, c.height - tinggi, c.width, tinggi);
    g.fillStyle = "#ffffff";
    g.font = `600 ${Math.round(tinggi * 0.42)}px system-ui, sans-serif`;
    g.textBaseline = "middle";
    g.fillText(`${tanda} · ${hasil.skenario} · Samarinda 2045`, Math.round(tinggi * 0.5), c.height - tinggi / 2);
    const a = document.createElement("a");
    a.href = c.toDataURL("image/jpeg", 0.92);
    a.download = `bayangan-samarinda-2045-${FUTURES[ke].key}.jpg`;
    a.click();
  }

  return (
    <div id="studio" className="grid scroll-mt-28 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
      <div>
        <p className="mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
          {id ? "Studio Fase 2 · Bayangkan masa depan" : "Phase 2 studio · Imagine futures"}
        </p>
        <h2 className="t-h2 mt-3 max-w-[20ch]">
          {id ? "Gambarkan Samarinda 2045 versimu" : "Draw your Samarinda 2045"}
        </h2>
        <p className="t-body measure mt-4">
          {id
            ? "Pilih satu dari tiga skenario, lalu tulis apa yang kamu bayangkan: sungainya, jalannya, kampungnya, pekerjaannya. Shelbot mengubahnya menjadi ilustrasi. Gambar ini alat berdiskusi, bukan ramalan, dan selalu bertanda buatan AI."
            : "Pick one of the three scenarios, then write what you imagine: the river, the streets, the neighbourhoods, the work. Shelbot turns it into an illustration. The picture is a prompt for discussion, not a forecast, and it is always marked as AI-made."}
        </p>

        <form onSubmit={buat} className="mt-7 space-y-5">
          <div role="radiogroup" aria-label={id ? "Skenario" : "Scenario"} className="flex flex-wrap gap-2">
            {FUTURES.map((f, i) => (
              <button
                key={f.key}
                type="button"
                role="radio"
                aria-checked={i === ke}
                onClick={() => setKe(i)}
                className="rounded-full border px-3.5 py-1.5 text-[0.8rem] transition-colors rule"
                style={i === ke ? { background: f.warna, borderColor: f.warna, color: "#fff" } : undefined}
              >
                {t(f.nama, lang)}
              </button>
            ))}
          </div>
          <p className="text-[0.85rem] text-[var(--fg-muted)]">{t(aktif.ringkas, lang)}</p>

          <div>
            <label htmlFor="deskripsi-studio" className="text-[0.85rem] font-semibold">
              {id ? "Apa yang kamu bayangkan?" : "What do you imagine?"}
            </label>
            <textarea
              id="deskripsi-studio"
              rows={4}
              maxLength={400}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder={
                id
                  ? "Contoh: Sungai Mahakam jernih, perahu listrik membawa warga ke pasar, taman hijau di bekas lubang tambang."
                  : "Example: a clear Mahakam River, electric boats taking people to market, green parks on old mining pits."
              }
              className="mt-2 w-full resize-y rounded-xl border bg-transparent px-4 py-3 text-[0.95rem] leading-relaxed outline-none rule placeholder:text-[var(--fg-faint)] focus:border-[var(--fg-muted)]"
            />
            <p className="mt-1 flex justify-between gap-4 text-[0.72rem] text-[var(--fg-faint)]">
              <span>
                {id
                  ? "Boleh dikosongkan: Shelbot memakai bayangan bawaan skenario ini."
                  : "You may leave it empty: Shelbot uses this scenario's default vision."}
              </span>
              <span>{deskripsi.length}/400</span>
            </p>
          </div>

          <button type="submit" disabled={sibuk} className="btn btn-utama disabled:opacity-50">
            {sibuk ? (id ? "Sedang menggambar…" : "Drawing…") : id ? "Gambar bayanganku" : "Draw my vision"}
          </button>
          {galat && (
            <p role="alert" className="text-[0.85rem] text-[var(--kritis)]">
              {galat}
            </p>
          )}
          <p className="text-[0.78rem] leading-relaxed text-[var(--fg-faint)]">
            {id
              ? "Tulisanmu dikirim ke Cloudflare untuk diperiksa dan digambar. Gambar tidak disimpan. Batas tiga gambar per menit. Jangan menulis nama orang atau data pribadi."
              : "Your text is sent to Cloudflare to be checked and drawn. Images are not stored. Limit of three images per minute. Do not write people's names or personal data."}
          </p>
        </form>
      </div>

      <figure className="self-start">
        <div className="relative aspect-square overflow-hidden rounded-2xl border bg-[var(--bg-sunken)] rule">
          {hasil ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={gambarRef}
              src={`data:image/jpeg;base64,${hasil.gambar}`}
              alt={
                id
                  ? `Ilustrasi buatan AI: ${hasil.skenario} untuk Samarinda 2045. ${hasil.deskripsi}`
                  : `AI-made illustration: ${hasil.skenario} for Samarinda 2045. ${hasil.deskripsi}`
              }
              className={`h-full w-full object-cover transition-opacity ${sibuk ? "opacity-40" : ""}`}
            />
          ) : (
            <div className="grid h-full place-items-center p-10 text-center text-[0.9rem] text-[var(--fg-faint)]">
              {sibuk
                ? id ? "Shelbot sedang menggambar…" : "Shelbot is drawing…"
                : id ? "Ilustrasimu akan muncul di sini." : "Your illustration will appear here."}
            </div>
          )}
          {hasil && (
            <span className="mono absolute left-3 top-3 rounded-md bg-black/70 px-2.5 py-1 text-[0.66rem] tracking-[0.1em] text-white">
              {tanda}
            </span>
          )}
        </div>
        {hasil && (
          <figcaption className="mt-4 space-y-3 text-[0.85rem] text-[var(--fg-muted)]">
            <p>
              {hasil.skenario} · Samarinda 2045 ·{" "}
              {id ? "ilustrasi Flux (Cloudflare), bukan foto" : "Flux illustration (Cloudflare), not a photo"}
            </p>
            <details>
              <summary className="cursor-pointer text-[var(--fg)]">
                {id ? "Prompt yang dipakai (ditampilkan terbuka)" : "The prompt used (shown openly)"}
              </summary>
              <p className="mono mt-2 text-[0.75rem] leading-relaxed">{hasil.prompt}</p>
            </details>
            <button type="button" onClick={unduh} className="btn btn-garis !min-h-0 !px-4 !py-2 text-[0.8rem]">
              {id ? "Unduh dengan tanda AI" : "Download with AI label"}
            </button>
          </figcaption>
        )}
      </figure>
    </div>
  );
}
