"use client";

import { useEffect, useRef, useState } from "react";
import { Maskot } from "./Maskot";
import { useGerakDikurangi } from "@/lib/gerak";

/**
 * Sosok besar yang menyandar dari tepi halaman.
 *
 * Bukan tempelan maskot di pojok: tingginya sepertiga layar, badannya
 * ikut tergambar, dan ia miring menyandar ke dalam halaman seolah
 * bersandar pada garis pemisah bagian. Ia timbul, melambai, lalu
 * tenggelam lagi di balik tepi layar.
 *
 * Tiap halaman punya ulahnya sendiri. Yang berbeda bukan cuma sosok dan
 * sisinya, tetapi juga benda yang dibawa: kartu di katalog, daun di
 * halaman kota, dadu di mini game, surat di halaman kontak. Itu yang
 * membuatnya terasa milik halaman itu, bukan hiasan yang sama diulang
 * tujuh kali.
 *
 * Gambarnya dipinjam dari adegan dermaga di beranda, dipotong ke bagian
 * kepala saja. Tidak ada gambar baru yang dibuat untuk sosoknya.
 *
 * Tingginya nol, jadi ia tidak pernah menggeser isi halaman. Timbul
 * tenggelamnya hanya berjalan saat bagian itu benar-benar terlihat, dan
 * berhenti sama sekali bila pengunjung meminta gerakan dikurangi — ia
 * lalu tinggal diam di tempatnya.
 */

export type Bawaan = "dadah" | "kartu" | "daun" | "dadu" | "surat" | "pena";

export function KepalaNongol({
  sosok = "shelly",
  sisi = "kanan",
  bawa = "dadah",
}: {
  sosok?: "shelly" | "hakam";
  sisi?: "kiri" | "kanan";
  /** Yang dipegang tangannya. "dadah" berarti tangan kosong. */
  bawa?: Bawaan;
}) {
  const diam = useGerakDikurangi();
  const [terlihat, setTerlihat] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Timbul tenggelamnya hanya berjalan selama bagian ini di pandangan.
     Di luar itu tidak ada gunanya menganimasikan apa pun. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mata = new IntersectionObserver(([e]) => setTerlihat(e.isIntersecting), {
      rootMargin: "0px 0px -10% 0px",
    });
    mata.observe(el);
    return () => mata.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`nongol ${sisi === "kiri" ? "nongol-kiri" : ""}`}
      data-jalan={terlihat && !diam ? "ya" : "tidak"}
      aria-hidden
    >
      <div className="nongol-sosok">
        {/* Sosok utuh, dengan lambaian yang sudah menjadi bagian adegan
            aslinya. Yang ditambahkan di sini hanya benda yang dipegang
            tangan satunya. */}
        <Maskot
          pose="lambai"
          latar={false}
          sosok={sosok}
          className="nongol-sosok-gambar"
        />
        {bawa !== "dadah" && <Bawa bawa={bawa} />}
      </div>
    </div>
  );
}

/* Benda yang dipegang adalah barang fisik: kartu, dadu, surat. Warnanya
   tidak ikut tema situs — kartu tetap kertas putih bertinta gelap, juga
   pada tema gelap, sebagaimana kartu di atas meja. */
const KERTAS = "#f7f9fc";
const TINTA = "#243040";

/**
 * Benda yang dipegang tangan sisi dalam.
 *
 * Letaknya menempel pada telapak tangan itu, yang di adegan asli
 * menggantung di sisi badan. Persentasenya diambil dari titik telapak
 * di dalam bidang gambar, jadi ia tetap pas berapa pun ukuran sosoknya.
 */
function Bawa({ bawa }: { bawa: Exclude<Bawaan, "dadah"> }) {
  return (
    <svg viewBox="0 0 40 30" className="nongol-bawa">
      {bawa === "kartu" && (
        <g transform="rotate(-12 20 15)">
          <rect x="9" y="2" width="20" height="26" rx="3" fill={KERTAS} stroke={TINTA} strokeWidth="1.2" />
          <rect x="9" y="2" width="2.4" height="26" rx="1.2" fill="var(--color-economy)" />
          <g stroke={TINTA} strokeWidth="1.1" strokeLinecap="round" opacity="0.65">
            <line x1="15" y1="10" x2="25" y2="10" />
            <line x1="15" y1="15" x2="25" y2="15" />
            <line x1="15" y1="20" x2="21" y2="20" />
          </g>
        </g>
      )}

      {bawa === "daun" && (
        <g transform="translate(20 16)">
          <path d="M0 10 C -11 5, -13 -6, -2 -11 C 5 -4, 5 3, 0 10 Z" fill="var(--color-env)" opacity="0.9" />
          <path d="M-1 9 C -3 1, -3 -5, -2 -10" stroke={KERTAS} strokeWidth="1.1" fill="none" />
        </g>
      )}

      {bawa === "dadu" && (
        <g transform="rotate(-10 20 15)">
          <rect x="10" y="5" width="20" height="20" rx="4.5" fill={KERTAS} stroke={TINTA} strokeWidth="1.2" />
          <g fill={TINTA}>
            <circle cx="15.5" cy="10.5" r="1.7" />
            <circle cx="24.5" cy="10.5" r="1.7" />
            <circle cx="20" cy="15" r="1.7" />
            <circle cx="15.5" cy="19.5" r="1.7" />
            <circle cx="24.5" cy="19.5" r="1.7" />
          </g>
        </g>
      )}

      {bawa === "surat" && (
        <g transform="rotate(-7 20 15)">
          <rect x="8" y="7" width="24" height="17" rx="2.5" fill={KERTAS} stroke={TINTA} strokeWidth="1.2" />
          <path d="M9 8 L20 17 L31 8" fill="none" stroke="var(--color-future)" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      )}

      {bawa === "pena" && (
        <g transform="rotate(34 20 15)">
          <rect x="18.6" y="2" width="3" height="20" rx="1.4" fill="var(--color-iris)" />
          <path d="M18.6 22 L21.6 22 L20.1 26 Z" fill={TINTA} />
        </g>
      )}
    </svg>
  );
}
