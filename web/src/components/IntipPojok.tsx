"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Maskot } from "./Maskot";

/**
 * Kepala Shelly atau Hakam yang mengintip dari tepi kanan bawah layar,
 * bergantian. Sekali per halaman ia menyapa dengan satu kalimat, dan
 * kepalanya (juga tautan di sapaan) menuju halaman Shelbot.
 *
 * Kepala menemani selama pengunjung menggulir, lalu menyingkir begitu
 * footer situs terlihat, karena di sana Shelly dan Hakam sudah berdiri
 * utuh (SosokAkhir) atau berpawai (beranda). Tidak ada yang disimpan di
 * peramban: sapaan yang ditutup hanya hilang untuk kunjungan halaman itu.
 */

type Sosok = "shelly" | "hakam";

const SELANG_MS = 7000;
const GESER_MS = 320;

/** Sosok pertama dan sapaan per halaman. Sapaan hanya menunjuk hal yang ada di halaman itu. */
const HALAMAN: Record<string, { sosok: Sosok; id?: string; en?: string }> = {
  "": { sosok: "shelly", id: "Halo! Kami Shelly dan Hakam. Mau tahu cara bermainnya?", en: "Hi! We're Shelly and Hakam. Want to know how it plays?" },
  permainan: { sosok: "hakam", id: "Enam fase menuju Samarinda 2045. Mau kujelaskan fase yang mana?", en: "Six phases toward Samarinda 2045. Which one shall I explain?" },
  aturan: { sosok: "hakam", id: "Lembar aturan ini bisa dicetak. Ada aturan yang membingungkan?", en: "These rules can be printed. Anything confusing?" },
  dasbor: { sosok: "hakam", id: "Ingat, indikator di bawah 3 sudah kritis. Mau tahu artinya?", en: "Remember, an indicator below 3 is critical. Want to know why?" },
  kartu: { sosok: "shelly", id: "Ada 184 kartu di sini. Mau kucarikan kartu soal banjir?", en: "184 cards live here. Shall I find the flooding ones?" },
  samarinda: { sosok: "hakam", id: "Penasaran dengan isu Samarinda? Tanya saja kami.", en: "Curious about Samarinda's issues? Just ask us." },
  "mini-game": { sosok: "shelly", id: "Sudah main? Tanya kami soal isi permainan aslinya.", en: "Played it? Ask us about the real board game." },
  fasilitator: { sosok: "hakam", id: "Menyiapkan sesi? Tanyakan apa saja soal fasenya.", en: "Preparing a session? Ask us anything about the phases." },
  kontak: { sosok: "shelly", id: "Sebelum menghubungi tim, coba tanya kami dulu.", en: "Before contacting the team, try asking us first." },
  privasi: { sosok: "shelly", id: "Punya pertanyaan soal permainan? Tanya Shelbot.", en: "Questions about the game? Ask Shelbot." },
  gaya: { sosok: "shelly", id: "Mau tahu cara bermainnya? Tanya Shelbot.", en: "Want to know how it plays? Ask Shelbot." },
  // Di halaman Shelbot tidak ada sapaan: Shelbot sudah ada di layar.
  shelbot: { sosok: "shelly" },
};

const lawan = (s: Sosok): Sosok => (s === "shelly" ? "hakam" : "shelly");

export function IntipPojok() {
  const pathname = usePathname() || "";
  const [lang = "id", halaman = ""] = pathname.split("/").filter(Boolean);
  const id = lang !== "en";
  const h = HALAMAN[halaman] ?? HALAMAN[""];
  const teks = id ? h.id : h.en;
  const keShelbot = `/${id ? "id" : "en"}/shelbot/`;

  const [sosok, setSosok] = useState<Sosok>(h.sosok);
  const [geser, setGeser] = useState(false);
  const [tahan, setTahan] = useState(false);
  const [sembunyi, setSembunyi] = useState(false);
  const [sapa, setSapa] = useState(false);

  // Pindah halaman: mulai lagi dari sosok halaman itu, sapaan belum tampil.
  useEffect(() => {
    const f = requestAnimationFrame(() => {
      setSosok(h.sosok);
      setSapa(false);
    });
    return () => cancelAnimationFrame(f);
  }, [h.sosok, halaman]);

  // Bergantian: menyelinap turun, berganti sosok, lalu naik lagi.
  useEffect(() => {
    if (tahan || sembunyi) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ganti: ReturnType<typeof setTimeout>;
    const jadwal = setInterval(() => {
      setGeser(true);
      ganti = setTimeout(() => {
        setSosok(lawan);
        setGeser(false);
      }, GESER_MS);
    }, SELANG_MS);
    return () => {
      clearInterval(jadwal);
      clearTimeout(ganti);
      setGeser(false);
    };
  }, [tahan, sembunyi]);

  // Sapaan muncul sekali, setelah pengunjung menggulir sedikit atau 4 detik berlalu.
  useEffect(() => {
    if (!teks) return;
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
  }, [teks]);

  // Menyingkir saat footer situs terlihat. Bukan sembarang <footer>:
  // setiap kartu di katalog juga punya <footer> sendiri.
  useEffect(() => {
    const kaki = document.querySelector("body > footer");
    if (!kaki) return;
    const mata = new IntersectionObserver(([e]) => setSembunyi(e.isIntersecting), { threshold: 0 });
    mata.observe(kaki);
    return () => mata.disconnect();
  }, [pathname]);

  const nama = sosok === "shelly" ? "Shelly" : "Hakam";

  return (
    <div
      className={`intip-wadah ${sembunyi ? "intip-wadah-sembunyi" : ""} print:hidden`}
      onMouseEnter={() => setTahan(true)}
      onMouseLeave={() => setTahan(false)}
    >
      {sapa && teks && (
        <div className="intip-sapa" role="status">
          <p>{teks}</p>
          <Link href={keShelbot} className="intip-ajak">
            {id ? "Tanya Shelbot" : "Ask Shelbot"} →
          </Link>
          <button type="button" onClick={() => setSapa(false)} aria-label={id ? "Tutup sapaan" : "Dismiss greeting"} className="intip-x">
            ×
          </button>
        </div>
      )}
      <Link
        href={keShelbot}
        className={`intip ${geser ? "intip-keluar" : ""}`}
        aria-label={id ? `${nama}: buka Shelbot` : `${nama}: open Shelbot`}
        onFocus={() => setTahan(true)}
        onBlur={() => setTahan(false)}
      >
        <Maskot pose="lambai" latar={false} sosok={`kepala-${sosok}`} />
      </Link>
    </div>
  );
}
