"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Maskot } from "./Maskot";

/**
 * Kepala Shelly atau Hakam yang mengintip dari tepi kanan bawah layar,
 * bergantian. Murni hiasan: diklik, sosoknya bersorak (bawaan Maskot).
 *
 * Kepala menemani selama pengunjung menggulir, lalu menyingkir begitu
 * footer terlihat, karena di sana Shelly dan Hakam sudah berdiri utuh
 * (SosokAkhir) atau berpawai (beranda).
 */

type Sosok = "shelly" | "hakam";

const SELANG_MS = 7000;
const GESER_MS = 320;

/** Sosok pertama per halaman, mengikuti topiknya. */
const MULAI: Record<string, Sosok> = {
  permainan: "hakam",
  aturan: "hakam",
  dasbor: "hakam",
  samarinda: "hakam",
  fasilitator: "hakam",
};

const lawan = (s: Sosok): Sosok => (s === "shelly" ? "hakam" : "shelly");

export function IntipPojok() {
  const pathname = usePathname() || "";
  const halaman = pathname.split("/").filter(Boolean)[1] ?? "";
  const awal = MULAI[halaman] ?? "shelly";

  const [sosok, setSosok] = useState<Sosok>(awal);
  const [geser, setGeser] = useState(false);
  const [tahan, setTahan] = useState(false);
  const [sembunyi, setSembunyi] = useState(false);

  // Pindah halaman: mulai lagi dari sosok halaman itu.
  useEffect(() => {
    const f = requestAnimationFrame(() => setSosok(awal));
    return () => cancelAnimationFrame(f);
  }, [awal]);

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

  // Menyingkir saat footer situs terlihat. Bukan sembarang <footer>:
  // setiap kartu di katalog juga punya <footer> sendiri.
  useEffect(() => {
    const kaki = document.querySelector("body > footer");
    if (!kaki) return;
    const mata = new IntersectionObserver(([e]) => setSembunyi(e.isIntersecting), { threshold: 0 });
    mata.observe(kaki);
    return () => mata.disconnect();
  }, [pathname]);

  return (
    <div
      aria-hidden
      className={`intip ${geser || sembunyi ? "intip-keluar" : ""} print:hidden`}
      onMouseEnter={() => setTahan(true)}
      onMouseLeave={() => setTahan(false)}
    >
      <Maskot pose="lambai" latar={false} sosok={`kepala-${sosok}`} />
    </div>
  );
}
