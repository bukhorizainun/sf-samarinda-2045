"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  KATEGORI,
  LEVELS,
  MG_UI,
  PEMBUKA,
  PENUTUP,
  POIN,
  TANTANGAN,
  TANTANGAN_AKHIR,
  TINGKAT,
  UMPAN,
  type Kartu,
  type Sikap,
} from "@/content/minigame";
import { t, type Lang } from "@/lib/i18n";

/* Urutan babak: level 1 → tantangan 1 → level 2 → tantangan 2 → level 3 → tantangan akhir → hasil */
type Babak =
  | { jenis: "pembuka" }
  | { jenis: "level"; i: number }
  | { jenis: "tantangan"; i: number }
  | { jenis: "akhir" }
  | { jenis: "hasil" };

type Catatan = {
  soal: string;
  jawabPemain: string;
  jawabBenar: string;
  tepat: boolean;
};

const acak = <X,>(xs: X[]): X[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function MiniGame({ lang }: { lang: Lang }) {
  const id = lang === "id";

  const [babak, setBabak] = useState<Babak>({ jenis: "pembuka" });
  const [skor, setSkor] = useState(0);
  const [kombo, setKombo] = useState(0);
  const [catatan, setCatatan] = useState<Catatan[]>([]);
  const [lihatJawaban, setLihatJawaban] = useState(false);
  const [tersalin, setTersalin] = useState(false);

  /* ---- keadaan satu level ---- */
  const [urutan, setUrutan] = useState<Kartu[]>([]);
  const [ke, setKe] = useState(0);
  const [sisa, setSisa] = useState(0);
  const [kilat, setKilat] = useState<null | { tepat: boolean; teks: string }>(
    null,
  );

  /* ---- keadaan tantangan ---- */
  const [dipilih, setDipilih] = useState<number | null>(null);
  const [pilihTiga, setPilihTiga] = useState<number[]>([]);

  const hidupRef = useRef(true);
  useEffect(() => () => void (hidupRef.current = false), []);

  const mulaiLevel = useCallback((i: number) => {
    setUrutan(acak(LEVELS[i].kartu));
    setKe(0);
    setSisa(LEVELS[i].detik);
    setKilat(null);
    setBabak({ jenis: "level", i });
  }, []);

  const mulai = () => {
    setSkor(0);
    setKombo(0);
    setCatatan([]);
    setLihatJawaban(false);
    mulaiLevel(0);
  };

  /* Babak berikutnya setelah satu level selesai atau waktunya habis. */
  const setelahLevel = useCallback((i: number) => {
    setDipilih(null);
    if (i < TANTANGAN.length) setBabak({ jenis: "tantangan", i });
    else setBabak({ jenis: "akhir" });
  }, []);

  /* Hitung mundur level. */
  useEffect(() => {
    if (babak.jenis !== "level") return;
    if (sisa <= 0) {
      const lompat = setTimeout(() => setelahLevel(babak.i), 0);
      return () => clearTimeout(lompat);
    }
    const detak = setTimeout(() => setSisa((s) => s - 1), 1000);
    return () => clearTimeout(detak);
  }, [babak, sisa, setelahLevel]);

  const jawabKartu = useCallback(
    (pilih: Sikap) => {
      if (babak.jenis !== "level" || kilat) return;
      const kartu = urutan[ke];
      if (!kartu) return;

      const tepat = kartu.jawab === pilih;
      const komboBaru = tepat ? kombo + 1 : 0;
      // Kombo memberi bonus mulai jawaban benar ketiga berturut-turut.
      const bonus = tepat && komboBaru >= 3 ? POIN.komboTiap : 0;

      setKombo(komboBaru);
      setSkor((s) => s + (tepat ? POIN.benar + bonus : POIN.salah));
      setCatatan((c) => [
        ...c,
        {
          soal: t(kartu.teks, lang),
          jawabPemain: t(KATEGORI[pilih], lang),
          jawabBenar: t(KATEGORI[kartu.jawab], lang),
          tepat,
        },
      ]);
      setKilat({ tepat, teks: t(tepat ? UMPAN.benar : UMPAN.salah, lang) });

      setTimeout(() => {
        if (!hidupRef.current) return;
        setKilat(null);
        const lanjut = ke + 1;
        if (lanjut >= urutan.length) {
          // Sisa waktu diubah menjadi poin, sesuai aturan bonus waktu.
          setSkor((s) => s + sisa * POIN.bonusWaktuPerDetik);
          setelahLevel(babak.i);
        } else {
          setKe(lanjut);
        }
      }, 650);
    },
    [babak, ke, kilat, kombo, lang, setelahLevel, sisa, urutan],
  );

  /* Panah kiri-kanan untuk memilih kategori. */
  useEffect(() => {
    if (babak.jenis !== "level") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") jawabKartu("dukung");
      if (e.key === "ArrowRight") jawabKartu("ancam");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [babak, jawabKartu]);

  const jawabTantangan = (i: number, pilih: number) => {
    if (dipilih !== null) return;
    const t2 = TANTANGAN[i];
    const tepat = pilih === t2.benar;
    setDipilih(pilih);
    if (tepat) setSkor((s) => s + POIN.tantangan);
    setCatatan((c) => [
      ...c,
      {
        soal: t(t2.pertanyaan, lang),
        jawabPemain: t(t2.pilihan[pilih], lang),
        jawabBenar: t(t2.pilihan[t2.benar], lang),
        tepat,
      },
    ]);
  };

  const selesaikanAkhir = () => {
    const tepat = pilihTiga.filter(
      (i) => TANTANGAN_AKHIR.pilihan[i].benar,
    ).length;
    setSkor((s) => s + tepat * POIN.benar);
    setCatatan((c) => [
      ...c,
      {
        soal: t(TANTANGAN_AKHIR.skenario, lang),
        jawabPemain: pilihTiga
          .map((i) => t(TANTANGAN_AKHIR.pilihan[i].teks, lang))
          .join(", "),
        jawabBenar: TANTANGAN_AKHIR.pilihan
          .filter((p) => p.benar)
          .map((p) => t(p.teks, lang))
          .join(", "),
        tepat: tepat === 3,
      },
    ]);
    setBabak({ jenis: "hasil" });
  };

  const tingkat = useMemo(
    () => TINGKAT.find((x) => skor >= x.min) ?? TINGKAT[TINGKAT.length - 1],
    [skor],
  );

  /** Bagikan lewat lembar berbagi bawaan perangkat; kalau tidak ada, disalin. */
  async function bagikan() {
    const pesan = id
      ? `Aku dapat ${skor} poin di "Jaga Samarinda!" — ${t(tingkat.gelar, lang)}. Coba juga:`
      : `I scored ${skor} in "Guard Samarinda!" — ${t(tingkat.gelar, lang)}. Try it:`;
    const tautan = typeof window === "undefined" ? "" : window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ text: pesan, url: tautan });
        return;
      }
      await navigator.clipboard.writeText(`${pesan} ${tautan}`);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2200);
    } catch {
      /* Dibatalkan sendiri oleh pengunjung, atau papan klip ditutup peramban. */
    }
  }

  /* ---------------- tampilan ---------------- */

  const Papan = (
    <div className="flex items-center justify-between gap-4 border-b px-6 py-4 rule">
      <p className="text-sm tabular-nums">
        <span className="t-eyebrow !normal-case">{t(MG_UI.skor, lang)}</span>{" "}
        <span className="ml-2 font-display text-xl">{skor}</span>
      </p>
      {babak.jenis === "level" && (
        <div className="flex items-center gap-5">
          {kombo >= 3 && (
            <span className="rounded-full border px-3 py-1 text-xs rule">
              {t(MG_UI.kombo, lang)} ×{kombo}
            </span>
          )}
          <p className="text-sm tabular-nums text-[var(--fg-muted)]">
            {t(MG_UI.waktu, lang)}{" "}
            <span
              className={`font-display text-xl ${sisa <= 5 ? "text-[var(--color-economy)]" : ""}`}
            >
              {sisa}
            </span>
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border bg-[var(--bg-raised)] rule">
      {babak.jenis !== "pembuka" && Papan}

      {/* ---- Pembuka ---- */}
      {babak.jenis === "pembuka" && (
        <div className="p-8 sm:p-12">
          <h2 className="t-h1">{t(PEMBUKA.judul, lang)}</h2>
          <p className="t-lead measure mt-6">{t(PEMBUKA.narasi, lang)}</p>
          <p className="t-body measure mt-5 text-[0.925rem]">
            {t(PEMBUKA.petunjuk, lang)}
          </p>
          <button
            onClick={mulai}
            className="mt-9 rounded-full bg-[var(--fg)] px-7 py-3 text-[0.9rem] font-medium text-[var(--bg)] transition-transform duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5"
          >
            {t(PEMBUKA.mulai, lang)}
          </button>
        </div>
      )}

      {/* ---- Level ---- */}
      {babak.jenis === "level" && (
        <div className="p-6 sm:p-10">
          <p className="t-eyebrow">{t(LEVELS[babak.i].judul, lang)}</p>
          <p className="t-body measure mt-3 text-[0.925rem]">
            {t(LEVELS[babak.i].instruksi, lang)}
          </p>

          <div className="mt-8 flex min-h-[9rem] items-center justify-center rounded-2xl border bg-[var(--bg)] p-8 text-center rule">
            <p key={ke} className="rise t-h3 max-w-[22ch] font-normal">
              {urutan[ke] ? t(urutan[ke].teks, lang) : ""}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => jawabKartu("dukung")}
              disabled={!!kilat}
              className="rounded-xl border px-5 py-4 text-[0.9rem] font-medium transition-colors hover:border-[var(--color-env)] hover:text-[var(--color-env)] disabled:opacity-50 rule"
            >
              {t(KATEGORI.dukung, lang)}
            </button>
            <button
              onClick={() => jawabKartu("ancam")}
              disabled={!!kilat}
              className="rounded-xl border px-5 py-4 text-[0.9rem] font-medium transition-colors hover:border-[var(--color-economy)] hover:text-[var(--color-economy)] disabled:opacity-50 rule"
            >
              {t(KATEGORI.ancam, lang)}
            </button>
          </div>

          <p
            aria-live="polite"
            className={`mt-5 min-h-6 text-sm ${
              kilat?.tepat
                ? "text-[var(--color-env)]"
                : "text-[var(--fg-muted)]"
            }`}
          >
            {kilat?.teks ?? ""}
          </p>

          <p className="mt-2 text-xs tabular-nums text-[var(--fg-faint)]">
            {ke + 1} / {urutan.length}
          </p>
        </div>
      )}

      {/* ---- Tantangan Samarinda ---- */}
      {babak.jenis === "tantangan" && (
        <div className="p-6 sm:p-10">
          <p className="t-eyebrow">
            {id ? "Tantangan Samarinda" : "Samarinda Challenge"} {babak.i + 1}
          </p>
          <h2 className="t-h3 measure mt-4 font-normal leading-relaxed">
            {t(TANTANGAN[babak.i].pertanyaan, lang)}
          </h2>

          <ul className="mt-7 space-y-3">
            {TANTANGAN[babak.i].pilihan.map((p, i) => {
              const sudah = dipilih !== null;
              const benar = i === TANTANGAN[babak.i].benar;
              return (
                <li key={i}>
                  <button
                    onClick={() => jawabTantangan(babak.i, i)}
                    disabled={sudah}
                    className={`w-full rounded-xl border px-5 py-4 text-left text-[0.925rem] transition-colors rule ${
                      sudah && benar
                        ? "border-[var(--color-env)] text-[var(--color-env)]"
                        : sudah && i === dipilih
                          ? "opacity-60"
                          : "hover:bg-[var(--bg)]"
                    }`}
                  >
                    {t(p, lang)}
                  </button>
                </li>
              );
            })}
          </ul>

          {dipilih !== null && (
            <div className="rise mt-7">
              <p className="t-body measure text-[0.925rem]">
                {t(TANTANGAN[babak.i].umpan, lang)}
              </p>
              <button
                onClick={() => mulaiLevel(babak.i + 1)}
                className="mt-6 rounded-full bg-[var(--fg)] px-6 py-3 text-[0.875rem] font-medium text-[var(--bg)]"
              >
                {t(MG_UI.lanjut, lang)}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---- Tantangan terakhir ---- */}
      {babak.jenis === "akhir" && (
        <div className="p-6 sm:p-10">
          <p className="t-eyebrow">
            {id ? "Tantangan Terakhir" : "Final Challenge"} ·{" "}
            {t(MG_UI.pilihTiga, lang)}
          </p>
          <h2 className="t-h3 measure mt-4 font-normal leading-relaxed">
            {t(TANTANGAN_AKHIR.skenario, lang)}
          </h2>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {TANTANGAN_AKHIR.pilihan.map((p, i) => {
              const on = pilihTiga.includes(i);
              return (
                <li key={i}>
                  <button
                    aria-pressed={on}
                    onClick={() =>
                      setPilihTiga((xs) =>
                        xs.includes(i)
                          ? xs.filter((x) => x !== i)
                          : xs.length < 3
                            ? [...xs, i]
                            : xs,
                      )
                    }
                    className={`w-full rounded-xl border px-5 py-4 text-left text-[0.9rem] transition-colors rule ${
                      on
                        ? "border-[var(--fg)] bg-[var(--bg)]"
                        : "hover:bg-[var(--bg)]"
                    }`}
                  >
                    {t(p.teks, lang)}
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            onClick={selesaikanAkhir}
            disabled={pilihTiga.length !== 3}
            className="mt-8 rounded-full bg-[var(--fg)] px-6 py-3 text-[0.875rem] font-medium text-[var(--bg)] disabled:opacity-35"
          >
            {t(MG_UI.lanjut, lang)} ({pilihTiga.length}/3)
          </button>
        </div>
      )}

      {/* ---- Hasil ---- */}
      {babak.jenis === "hasil" && (
        <div className="p-8 sm:p-12">
          <p className="t-eyebrow">{t(MG_UI.hasil, lang)}</p>
          <p className="mt-5 font-display text-6xl tabular-nums">{skor}</p>
          <h2 className="t-h2 mt-4">{t(tingkat.gelar, lang)}</h2>
          <p className="t-lead measure mt-4">{t(tingkat.pesan, lang)}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              onClick={mulai}
              className="rounded-full bg-[var(--fg)] px-6 py-3 text-[0.875rem] font-medium text-[var(--bg)]"
            >
              {t(MG_UI.ulang, lang)}
            </button>
            <button
              onClick={bagikan}
              className="rounded-full border px-6 py-3 text-[0.875rem] font-medium transition-colors hover:bg-[var(--bg)] rule"
            >
              {tersalin ? t(MG_UI.tersalin, lang) : t(MG_UI.bagikan, lang)}
            </button>
            <button
              onClick={() => setLihatJawaban((v) => !v)}
              className="rounded-full border px-6 py-3 text-[0.875rem] font-medium transition-colors hover:bg-[var(--bg)] rule"
            >
              {t(MG_UI.jawaban, lang)}
            </button>
            <a
              href={`/${lang}/samarinda`}
              className="rounded-full border px-6 py-3 text-[0.875rem] font-medium transition-colors hover:bg-[var(--bg)] rule"
            >
              {t(MG_UI.jelajah, lang)}
            </a>
          </div>

          {lihatJawaban && (
            <ul className="rise mt-10 space-y-4">
              {catatan.map((c, i) => (
                <li key={i} className="border-t pt-4 rule">
                  <p className="text-[0.925rem]">{c.soal}</p>
                  <p className="mt-1.5 text-[0.85rem] text-[var(--fg-muted)]">
                    <span
                      aria-hidden
                      className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
                      style={{
                        background: c.tepat
                          ? "var(--color-env)"
                          : "var(--color-economy)",
                      }}
                    />
                    {c.jawabPemain}
                    {!c.tepat && (
                      <>
                        {" · "}
                        {t(MG_UI.benarnya, lang)}: {c.jawabBenar}
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <p className="t-body measure mt-12 text-[0.925rem]">
            {t(PENUTUP, lang)}
          </p>
        </div>
      )}
    </div>
  );
}
