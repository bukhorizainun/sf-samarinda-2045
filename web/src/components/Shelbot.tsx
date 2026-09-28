"use client";

import { useEffect, useRef, useState } from "react";
import { LAB } from "@/content/site";
import { Shelly } from "./Shelly";
import { tanya, type Ingatan, type Jawaban } from "@/lib/shelbot";
import { t, type Lang } from "@/lib/i18n";

type Pesan =
  | { dari: "orang"; teks: string }
  | { dari: "shelbot"; teks: string; sumber?: string }
  | { dari: "banding"; jawaban: { label: string; teks: string; ms?: number; gagal?: boolean }[] };

/** Otak Shelbot+ yang bisa dipilih. Daftar aslinya diambil dari Worker
    (GET /model), karena Claude hanya tersedia bila kuncinya terpasang. */
type Otak = { id: string; nama: string; penyedia: string; berbayar?: boolean };
const OTAK_BAWAAN: Otak[] = [
  { id: "llama-70b", nama: "Llama 3.3 70B", penyedia: "Cloudflare" },
  { id: "llama-8b", nama: "Llama 3.1 8B", penyedia: "Cloudflare" },
];

/** Riwayat untuk model: hanya giliran tanya-jawab biasa, perbandingan dilewati. */
const riwayatDari = (daftar: Pesan[], baru: string) => [
  ...daftar.flatMap((m) =>
    m.dari === "orang"
      ? [{ role: "user", content: m.teks }]
      : m.dari === "shelbot"
        ? [{ role: "assistant", content: m.teks }]
        : [],
  ),
  { role: "user", content: baru },
];

/** Jeda menjawab, dibuat sebanding panjang jawaban supaya terasa wajar. */
const jeda = (teks: string) => Math.min(1500, 420 + teks.length * 3.2);

/* Shelbot+ (lapis satu): Worker terpisah yang memakai Llama. Alamatnya
   ditanam saat build; tanpa alamat, Shelbot tetap sepenuhnya naskah.
   NEXT_PUBLIC_SHELBOT_TERBUKA=1 membuat Shelbot+ langsung menyala untuk
   semua pengunjung (tanpa kata sandi); tanpa itu, fasilitator yang
   menyalakannya dengan kata sandi. */
const API = process.env.NEXT_PUBLIC_SHELBOT_API?.replace(/\/$/, "");
const TERBUKA = Boolean(API) && process.env.NEXT_PUBLIC_SHELBOT_TERBUKA === "1";
const SIMPAN = "sf-shelbot-tiket";
type Sesi = { tiket: string; berlaku: number };

function bacaSesi(): Sesi | null {
  try {
    const s = JSON.parse(sessionStorage.getItem(SIMPAN) || "null") as Sesi | null;
    return s && s.berlaku > Date.now() / 1000 ? s : null;
  } catch {
    return null;
  }
}

export function Shelbot({ lang }: { lang: Lang }) {
  const id = lang === "id";
  const [pesan, setPesan] = useState<Pesan[]>([]);
  const [teks, setTeks] = useState("");
  const [mengetik, setMengetik] = useState(false);
  const [lanjutan, setLanjutan] = useState<string[]>(LAB.starters[lang]);
  const akhirRef = useRef<HTMLDivElement>(null);
  const hidupRef = useRef(true);
  // Apa yang barusan dibicarakan, supaya "kenapa?" tetap nyambung.
  const ingatanRef = useRef<Ingatan | undefined>(undefined);
  const [sesi, setSesi] = useState<Sesi | null>(null);
  const [bukaSandi, setBukaSandi] = useState(false);
  const [sandi, setSandi] = useState("");
  const [galatSandi, setGalatSandi] = useState("");
  // "naskah", id model, atau "bandingkan". Mode terbuka mulai dari Llama besar.
  const [daftarOtak, setDaftarOtak] = useState<Otak[]>(OTAK_BAWAAN);
  const [otak, setOtak] = useState<string>("llama-70b");
  const bisaPlus = TERBUKA || Boolean(sesi);
  const plusAktif = bisaPlus && otak !== "naskah";
  const otakDipilih = daftarOtak.find((o) => o.id === otak);
  // Claude sudah terpasang di Worker, tapi baru muncul sebagai pilihan aktif
  // setelah kuncinya dipasang. Sebelum itu ia tampil sebagai "belum tersedia".
  const claudeAktif = daftarOtak.some((o) => o.id === "claude");
  const [infoClaude, setInfoClaude] = useState(false);

  useEffect(() => () => void (hidupRef.current = false), []);
  useEffect(() => {
    if (!API) return;
    fetch(`${API}/model`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { model?: Otak[] } | null) => {
        if (hidupRef.current && d?.model?.length) setDaftarOtak(d.model);
      })
      .catch(() => {});
  }, []);
  // Tiket dibaca setelah terpasang, karena sessionStorage tidak ada saat build.
  useEffect(() => {
    if (!API || TERBUKA) return;
    const f = requestAnimationFrame(() => setSesi(bacaSesi()));
    return () => cancelAnimationFrame(f);
  }, []);

  async function masuk(e: React.FormEvent) {
    e.preventDefault();
    setGalatSandi("");
    try {
      const r = await fetch(`${API}/sesi`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sandi }),
      });
      if (!r.ok) throw new Error(String(r.status));
      const s = (await r.json()) as Sesi;
      try {
        sessionStorage.setItem(SIMPAN, JSON.stringify(s));
      } catch {}
      setSesi(s);
      setBukaSandi(false);
      setSandi("");
    } catch (err) {
      setGalatSandi(
        String(err).includes("401")
          ? id ? "Kata sandi salah." : "Wrong password."
          : id ? "Shelbot+ tidak bisa dihubungi." : "Shelbot+ cannot be reached.",
      );
    }
  }

  function keluar() {
    try {
      sessionStorage.removeItem(SIMPAN);
    } catch {}
    setSesi(null);
  }
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

    // Jawaban naskah selalu dihitung di peramban. Di mode biasa ia yang
    // tampil; di Shelbot+ ia menjadi pijakan model sekaligus cadangan.
    const jawab: Jawaban = tanya(bersih, lang, ingatanRef.current);
    ingatanRef.current = jawab.ingatan;

    const riwayat = riwayatDari(pesan, bersih);
    const panggil = (model?: string) =>
      fetch(`${API}/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tiket: sesi?.tiket, lang, pesan: riwayat, naskah: jawab.teks, model }),
      });

    if (API && plusAktif && otak === "bandingkan") {
      const tanpaJawaban = id
        ? "Tidak menjawab: jatah harian habis, batas pertanyaan tercapai, atau layanan sibuk."
        : "No answer: daily allowance used up, question limit reached, or service busy.";
      Promise.all(
        daftarOtak.map((o) =>
          panggil(o.id)
            .then(async (r) => {
              if (!r.ok) throw new Error(String(r.status));
              const d = (await r.json()) as { teks: string; ms?: number };
              return { label: `${o.nama} · ${o.penyedia}`, teks: d.teks, ms: d.ms };
            })
            .catch(() => ({ label: `${o.nama} · ${o.penyedia}`, teks: tanpaJawaban, gagal: true })),
        ),
      ).then((hasil) => {
        if (!hidupRef.current) return;
        setPesan((p) => [
          ...p,
          {
            dari: "banding",
            jawaban: [
              { label: id ? "Naskah · peramban" : "Script · browser", teks: jawab.teks },
              ...hasil,
            ],
          },
        ]);
        setLanjutan(jawab.lanjutan ?? []);
        setMengetik(false);
      });
      return;
    }

    if (API && plusAktif) {
      panggil(otak)
        .then(async (r) => {
          if (r.status === 401 && !TERBUKA) keluar();
          if (!r.ok) throw new Error(String(r.status));
          return (await r.json()) as { teks: string; model: string; ms?: number };
        })
        .then((d) => {
          if (!hidupRef.current) return;
          setPesan((p) => [
            ...p,
            {
              dari: "shelbot",
              teks: d.teks,
              sumber: `Shelbot+ · ${otakDipilih?.nama ?? d.model}${jawab.sumber ? ` · ${jawab.sumber}` : ""}`,
            },
          ]);
          setLanjutan(jawab.lanjutan ?? []);
          setMengetik(false);
        })
        .catch(() => {
          if (!hidupRef.current) return;
          setPesan((p) => [
            ...p,
            {
              dari: "shelbot",
              teks: jawab.teks,
              sumber: `${id ? "Naskah (Shelbot+ tidak menjawab)" : "Script (Shelbot+ did not answer)"}${jawab.sumber ? ` · ${jawab.sumber}` : ""}`,
            },
          ]);
          setLanjutan(jawab.lanjutan ?? []);
          setMengetik(false);
        });
      return;
    }

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
    <div className="obrolan">
      {/* Kepala */}
      <div className="obrolan-kepala sm:px-7">
        <span className="block h-12 w-12 shrink-0 self-start overflow-hidden rounded-full ring-1 ring-[var(--line-strong)]">
          <Shelly size={48} bicara={mengetik} />
        </span>
        <div>
          <p className="text-[0.95rem] font-semibold">Shelbot</p>
          <p className="flex items-center gap-2 text-[0.78rem] text-[var(--fg-faint)]">
            <span
              aria-hidden
              className="pulse-soft inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-mint)]"
            />
            {plusAktif && otak === "bandingkan"
              ? id
                ? "Mode bandingkan · naskah dan semua model menjawab"
                : "Compare mode · the script and every model answer"
              : plusAktif
                ? id
                  ? `Shelbot+ · ${otakDipilih?.nama ?? "Llama"}, berpijak pada naskah`
                  : `Shelbot+ · ${otakDipilih?.nama ?? "Llama"}, built on the script`
              : TERBUKA
                ? id
                  ? "Naskah · berjalan di peramban kamu, tanpa server"
                  : "Script · runs in your browser, no server"
              : sesi
                ? id
                  ? `Shelbot+ · mode kelas aktif sampai ${jam(sesi.berlaku)}`
                  : `Shelbot+ · class mode on until ${jam(sesi.berlaku)}`
                : id
                  ? "Berjalan di peramban kamu, tanpa server"
                  : "Runs in your browser, no server"}
          </p>
        </div>
        {API && !TERBUKA && (
          <button
            type="button"
            onClick={() => (sesi ? keluar() : setBukaSandi((b) => !b))}
            className="ml-auto self-start rounded-full border px-3 py-1.5 text-[0.75rem] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] rule"
          >
            {sesi
              ? id ? "Kembali ke naskah" : "Back to script"
              : id ? "Mode fasilitator" : "Facilitator mode"}
          </button>
        )}
      </div>

      {bisaPlus && (
        <div
          role="radiogroup"
          aria-label={id ? "Pilih otak Shelbot" : "Choose Shelbot's brain"}
          className="flex flex-wrap items-center gap-2 border-b px-6 py-3 rule sm:px-7"
        >
          {(
            [
              { id: "naskah", label: id ? "Naskah" : "Script", catatan: "" },
              ...daftarOtak.map((o) => ({ id: o.id, label: o.nama, catatan: o.berbayar ? (id ? "berbayar" : "paid") : "" })),
              ...(claudeAktif
                ? []
                : [{ id: "claude-segera", label: "Claude", catatan: id ? "belum tersedia" : "not available yet", nonaktif: true }]),
              { id: "bandingkan", label: id ? "Bandingkan semua" : "Compare all", catatan: "" },
            ] as { id: string; label: string; catatan: string; nonaktif?: boolean }[]
          ).map((o) =>
            o.nonaktif ? (
              <button
                key={o.id}
                type="button"
                aria-expanded={infoClaude}
                aria-controls="info-claude"
                onClick={() => setInfoClaude((v) => !v)}
                className="rounded-full border border-dashed px-3 py-1.5 text-[0.75rem] text-[var(--fg-faint)] rule"
              >
                {o.label}
                <span className="ml-1 opacity-80">· {o.catatan}</span>
              </button>
            ) : (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={otak === o.id}
                disabled={mengetik}
                onClick={() => setOtak(o.id)}
                className={`rounded-full border px-3 py-1.5 text-[0.75rem] transition-colors rule ${
                  otak === o.id
                    ? "bg-[var(--fg)] text-[var(--bg)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {o.label}
                {o.catatan && <span className="ml-1 opacity-70">· {o.catatan}</span>}
              </button>
            ),
          )}
        </div>
      )}
      {bisaPlus && !claudeAktif && infoClaude && (
        <p id="info-claude" className="border-b bg-[var(--bg-sunken)] px-6 py-3 text-[0.8rem] leading-relaxed text-[var(--fg-muted)] rule sm:px-7">
          {id
            ? "Model Claude dari Anthropic sudah dipasang di mesin Shelbot, tapi belum tersedia. Saat dirilis, Claude bisa dicoba gratis untuk beberapa pertanyaan. Pemakaian yang lebih banyak akan berbayar, karena setiap jawaban Claude ditagih oleh Anthropic."
            : "Anthropic's Claude model is already built into Shelbot's engine, but it is not available yet. At release, Claude can be tried free for a few questions. Heavier use will be paid, because every Claude answer is billed by Anthropic."}
        </p>
      )}

      {!TERBUKA && bukaSandi && !sesi && (
        <form onSubmit={masuk} className="flex flex-wrap items-center gap-2 border-b px-6 py-4 rule sm:px-7">
          <label htmlFor="sandi-fasilitator" className="text-[0.8rem] text-[var(--fg-muted)]">
            {id ? "Kata sandi fasilitator" : "Facilitator password"}
          </label>
          <input
            id="sandi-fasilitator"
            type="password"
            autoComplete="off"
            value={sandi}
            onChange={(e) => setSandi(e.target.value)}
            className="min-w-0 flex-1 rounded-md border bg-transparent px-3 py-2 text-[0.9rem] rule"
          />
          <button type="submit" disabled={!sandi} className="btn btn-utama !min-h-0 !px-4 !py-2 text-[0.8rem] disabled:opacity-40">
            {id ? "Nyalakan" : "Turn on"}
          </button>
          {galatSandi && (
            <p role="alert" className="w-full text-[0.8rem] text-[var(--kritis)]">
              {galatSandi}
            </p>
          )}
        </form>
      )}

      {/* Percakapan */}
      <div className="max-h-[62vh] min-h-[24rem] space-y-6 overflow-y-auto overscroll-contain p-6 sm:p-7">
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
          m.dari === "banding" ? (
            <div key={i} className="rise space-y-3">
              <p className="text-[0.75rem] text-[var(--fg-faint)]">
                {id ? "Jawaban dari tiap otak, untuk pertanyaan yang sama" : "Each brain's answer to the same question"}
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {m.jawaban.map((j, k) => (
                  <div key={k} className={`gelembung-shelbot ${j.gagal ? "opacity-60" : ""}`}>
                    <p className="mb-2 text-[0.75rem] font-semibold text-[var(--fg-muted)]">
                      {j.label}
                      {j.ms ? ` · ${(j.ms / 1000).toFixed(1)} s` : ""}
                    </p>
                    <div className="space-y-2 text-[0.9rem] leading-relaxed">
                      {j.teks.split("\n\n").map((p, n) => (
                        <p key={n} className="whitespace-pre-line">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : m.dari === "orang" ? (
            <div key={i} className="flex justify-end">
              <p className="gelembung-orang">{m.teks}</p>
            </div>
          ) : (
            <div key={i} className="rise flex gap-4">
              <Wajah />
              <div className="gelembung-shelbot measure">
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
            <Wajah bicara />
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
                  className="saran"
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
        className="tulis sm:px-5"
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
          className="btn btn-utama shrink-0 !min-h-0 !px-5 !py-2.5 text-[0.85rem] disabled:opacity-35"
        >
          {id ? "Kirim" : "Send"}
        </button>
      </form>

      <p className="border-t bg-[var(--bg-sunken)] px-5 py-4 text-xs leading-relaxed text-[var(--fg-faint)] rule">
        {t(LAB.disclaimer, lang)}
      </p>
    </div>
  );
}

/** Jam berakhirnya sesi, menurut jam perangkat pengunjung. */
const jam = (detik: number) =>
  new Date(detik * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Wajah kecil di samping tiap jawaban. */
function Wajah({ bicara = false }: { bicara?: boolean }) {
  return (
    <span className="mt-0.5 block h-9 w-9 shrink-0 self-start overflow-hidden rounded-full ring-1 ring-[var(--line)]">
      <Shelly size={36} bicara={bicara} />
    </span>
  );
}
