"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Maskot } from "./Maskot";
import { Shelbot } from "./Shelbot";
import type { Lang } from "@/lib/i18n";

/**
 * Pojok Shelly & Hakam: satu sosok kecil di kanan bawah setiap halaman.
 *
 * Ia menyapa sekali dengan satu kalimat yang sesuai halamannya, dan bila
 * diklik membuka Shelbot dalam panel kecil, sehingga Shelbot bisa dipakai
 * dari halaman mana pun. Tidak ada yang disimpan di peramban: sapaan yang
 * ditutup hanya hilang untuk kunjungan halaman itu.
 *
 * Tiga rupa sedang dibandingkan:
 *   a — mengintip: kepala menyembul dari tepi kanan
 *   b — gelembung: lencana bundar berisi keduanya, dengan kartu sapaan
 *   c — dok: keduanya berdiri di atas bilah kecil bertuliskan ajakan
 * Rupa dipilih lewat NEXT_PUBLIC_POJOK saat build, atau ?pojok=a|b|c untuk
 * pratinjau. Tanpa keduanya, pojok tidak tampil.
 */

type Rupa = "a" | "b" | "c";
type Sosok = "shelly" | "hakam";

/** Sapaan per halaman. Isinya hanya menunjuk hal yang memang ada di halaman itu. */
const SAPAAN: Record<string, { sosok: Sosok; id: string; en: string }> = {
  "": { sosok: "shelly", id: "Halo! Kami Shelly dan Hakam. Mau tahu cara bermainnya?", en: "Hi! We're Shelly and Hakam. Want to know how it plays?" },
  permainan: { sosok: "hakam", id: "Enam fase menuju Samarinda 2045. Mau kujelaskan fase yang mana?", en: "Six phases toward Samarinda 2045. Which one shall I explain?" },
  aturan: { sosok: "hakam", id: "Lembar aturan ini bisa dicetak untuk mejamu.", en: "These rules can be printed for your table." },
  dasbor: { sosok: "hakam", id: "Geser indikatornya. Ingat, di bawah 3 sudah kritis.", en: "Move the indicators. Remember, below 3 is critical." },
  kartu: { sosok: "shelly", id: "Ada 184 kartu di sini. Mau kucarikan kartu soal banjir?", en: "184 cards live here. Shall I find the flooding ones?" },
  samarinda: { sosok: "hakam", id: "Klik satu zona di peta untuk melihat kartunya.", en: "Click a zone on the map to see its cards." },
  "mini-game": { sosok: "shelly", id: "Pemanasan dulu? Coba kalahkan skor terbaikmu.", en: "Warming up? Try to beat your best score." },
  fasilitator: { sosok: "hakam", id: "Menyiapkan sesi? Tanyakan apa saja soal fasenya.", en: "Preparing a session? Ask us anything about the phases." },
  kontak: { sosok: "shelly", id: "Sebelum menghubungi tim, coba tanya kami dulu.", en: "Before contacting the team, try asking us first." },
  privasi: { sosok: "shelly", id: "Obrolan dengan kami tidak disimpan.", en: "Our conversations are not stored." },
  gaya: { sosok: "shelly", id: "Ini ruang rupa situs. Mau lihat cara bermainnya?", en: "This is the site's style room. Want to see how it plays?" },
};

function bacaRupa(): Rupa | null {
  const dariBuild = process.env.NEXT_PUBLIC_POJOK;
  let dariAlamat: string | null = null;
  try {
    dariAlamat = new URLSearchParams(window.location.search).get("pojok");
  } catch {}
  const r = dariAlamat || dariBuild || "";
  return r === "a" || r === "b" || r === "c" ? r : null;
}

export function PojokPendamping({ lang }: { lang: Lang }) {
  const id = lang === "id";
  const pathname = usePathname() || "";
  const halaman = pathname.split("/").filter(Boolean)[1] ?? "";
  const s = SAPAAN[halaman] ?? SAPAAN[""];

  const [rupa, setRupa] = useState<Rupa | null>(null);
  const [sapa, setSapa] = useState(false);
  const [buka, setBuka] = useState(false);
  const [sembunyi, setSembunyi] = useState(false);

  // Rupa dibaca setelah terpasang, karena alamat tidak ada saat build.
  useEffect(() => {
    const f = requestAnimationFrame(() => setRupa(bacaRupa()));
    return () => cancelAnimationFrame(f);
  }, []);

  // Sapaan muncul sekali, setelah pengunjung menggulir sedikit atau 4 detik berlalu.
  useEffect(() => {
    if (!rupa) return;
    let selesai = false;
    const tampil = () => {
      if (selesai) return;
      selesai = true;
      setSapa(true);
    };
    const onScroll = () => window.scrollY > 240 && tampil();
    const t = setTimeout(tampil, 4000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, [rupa, halaman]);

  // Menyingkir saat footer terlihat, supaya tautan di footer tidak tertutup.
  useEffect(() => {
    if (!rupa) return;
    const kaki = document.querySelector("footer");
    if (!kaki) return;
    const mata = new IntersectionObserver(([e]) => setSembunyi(e.isIntersecting), { threshold: 0.05 });
    mata.observe(kaki);
    return () => mata.disconnect();
  }, [rupa]);

  // Esc menutup panel.
  useEffect(() => {
    if (!buka) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [buka]);

  // Di halaman Shelbot, Shelbot sudah ada di layar: pojok tidak perlu.
  if (!rupa || halaman === "shelbot") return null;

  const teks = id ? s.id : s.en;
  const ajak = id ? "Tanya Shelbot" : "Ask Shelbot";
  const labelBuka = id ? `Buka Shelbot. ${teks}` : `Open Shelbot. ${teks}`;
  const tutupSapa = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setSapa(false);
      }}
      aria-label={id ? "Tutup sapaan" : "Dismiss greeting"}
      className="pojok-x"
    >
      ×
    </button>
  );

  return (
    <div className={`pojok pojok-${rupa} ${sembunyi && !buka ? "pojok-sembunyi" : ""} print:hidden`}>
      {buka && (
        <div role="dialog" aria-label="Shelbot" className="pojok-panel">
          <button type="button" onClick={() => setBuka(false)} className="pojok-panel-tutup" aria-label={id ? "Tutup Shelbot" : "Close Shelbot"}>
            ×
          </button>
          <Shelbot lang={lang} ringkas />
        </div>
      )}

      {!buka && sapa && (
        <div className="pojok-sapa" role="status">
          <p>{teks}</p>
          {rupa !== "c" && (
            <button type="button" className="pojok-ajak" onClick={() => setBuka(true)}>
              {ajak} →
            </button>
          )}
          {tutupSapa}
        </div>
      )}

      {!buka && rupa === "a" && (
        <button type="button" className="pojok-intip" onClick={() => setBuka((b) => !b)} aria-label={labelBuka} aria-expanded={buka}>
          <Maskot pose="lambai" latar={false} sosok={`kepala-${s.sosok}`} />
        </button>
      )}

      {!buka && rupa === "b" && (
        <button type="button" className="pojok-lencana" onClick={() => setBuka((b) => !b)} aria-label={labelBuka} aria-expanded={buka}>
          <Maskot pose="lambai" latar={false} sosok="keduanya" />
        </button>
      )}

      {!buka && rupa === "c" && (
        <button type="button" className="pojok-dok" onClick={() => setBuka((b) => !b)} aria-label={labelBuka} aria-expanded={buka}>
          <span className="pojok-dok-sosok">
            <Maskot pose="lambai" latar={false} sosok="keduanya" />
          </span>
          <span className="pojok-dok-teks">{buka ? (id ? "Tutup" : "Close") : ajak}</span>
        </button>
      )}
    </div>
  );
}
