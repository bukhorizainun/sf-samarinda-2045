"use client";

import { useEffect, useRef, useState } from "react";
import { Maskot } from "./Maskot";
import { useGerakDikurangi } from "@/lib/gerak";

/**
 * Kepala yang nongol dari tepi halaman.
 *
 * Satu kepala besar, terpotong tepi layar, timbul lalu tenggelam lagi
 * sambil melambai ke pembaca. Ini unsur desain halaman, bukan tempelan
 * maskot: ukurannya sebesar judul, ia duduk pada garis pemisah bagian,
 * dan warnanya ikut tema.
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
        {/* Pose "tanam" dipilih bukan karena ada yang ditanam: hanya
            pose "amati" yang bermulut datar, jadi semua pose lain
            memberi senyum — dan pada pose ini kedua lengan adegan
            menggantung di bawah batas potongan, sehingga tidak ada
            puntung lengan yang ikut masuk. Tangan yang melambai di
            sini digambar tersendiri. */}
        <Maskot
          pose="tanam"
          latar={false}
          sosok={sosok === "shelly" ? "kepala-shelly" : "kepala-hakam"}
          className="nongol-kepala"
        />
        <Tangan bawa={bawa} sosok={sosok} />
      </div>
    </div>
  );
}

/* Benda yang dipegang adalah barang fisik: kartu, dadu, surat. Warnanya
   tidak ikut tema situs — kartu tetap kertas putih bertinta gelap, juga
   pada tema gelap, sebagaimana kartu di atas meja. */
const KERTAS = "#f7f9fc";
const TINTA = "#243040";

/** Tangan yang melambai, beserta benda yang dibawanya. */
function Tangan({ bawa, sosok }: { bawa: Bawaan; sosok: "shelly" | "hakam" }) {
  const kulit = sosok === "shelly" ? "#f3d3b8" : "#e9c19f";

  /* Warna baju mengikuti sosoknya, seperti di adegan dermaga. */
  const baju = sosok === "shelly" ? "var(--color-env)" : "var(--color-future)";

  return (
    <svg viewBox="0 0 40 52" className="nongol-tangan">
      {/* Lengan berbaju, naik dari balik bahu. */}
      <path
        d="M20 52 L20 30"
        stroke={baju}
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M20 33 L20 20"
        stroke={kulit}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Telapak terbuka menghadap pembaca, dengan tiga jari. */}
      <circle cx="20" cy="15" r="6.5" fill={kulit} />
      {bawa === "dadah" && (
        <g stroke={kulit} strokeWidth="3.2" strokeLinecap="round">
          <line x1="16.5" y1="12" x2="15.5" y2="7" />
          <line x1="20" y1="11" x2="20" y2="5.5" />
          <line x1="23.5" y1="12" x2="24.5" y2="7" />
        </g>
      )}
      {bawa === "kartu" && (
        <g transform="rotate(-14 20 10)">
          <rect
            x="10"
            y="-6"
            width="20"
            height="26"
            rx="3"
            fill={KERTAS}
            stroke={TINTA}
            strokeWidth="1.2"
          />
          <rect x="10" y="-6" width="2.4" height="26" rx="1.2" fill="var(--color-economy)" />
          <g stroke={TINTA} strokeWidth="1.1" strokeLinecap="round" opacity="0.7">
            <line x1="16" y1="2" x2="26" y2="2" />
            <line x1="16" y1="7" x2="26" y2="7" />
            <line x1="16" y1="12" x2="22" y2="12" />
          </g>
        </g>
      )}

      {bawa === "daun" && (
        <g transform="translate(20 8)">
          <path
            d="M0 6 C -10 2, -12 -8, -2 -12 C 4 -6, 4 0, 0 6 Z"
            fill="var(--color-env)"
            opacity="0.85"
          />
          <path d="M-1 5 C -3 -2, -3 -7, -2 -11" stroke={KERTAS} strokeWidth="1.1" fill="none" />
        </g>
      )}

      {bawa === "dadu" && (
        <g transform="rotate(-12 20 4)">
          <rect
            x="10"
            y="-6"
            width="20"
            height="20"
            rx="4.5"
            fill={KERTAS}
            stroke={TINTA}
            strokeWidth="1.2"
          />
          <g fill={TINTA}>
            <circle cx="15.5" cy="-0.5" r="1.7" />
            <circle cx="24.5" cy="-0.5" r="1.7" />
            <circle cx="20" cy="4" r="1.7" />
            <circle cx="15.5" cy="8.5" r="1.7" />
            <circle cx="24.5" cy="8.5" r="1.7" />
          </g>
        </g>
      )}

      {bawa === "surat" && (
        <g transform="rotate(-8 20 4)">
          <rect
            x="8"
            y="-4"
            width="24"
            height="17"
            rx="2.5"
            fill={KERTAS}
            stroke={TINTA}
            strokeWidth="1.2"
          />
          <path
            d="M9 -3 L20 6 L31 -3"
            fill="none"
            stroke="var(--color-future)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
      )}

      {bawa === "pena" && (
        <g transform="rotate(38 20 8)">
          <rect x="18.6" y="-10" width="3" height="20" rx="1.4" fill="var(--color-iris)" />
          <path d="M18.6 10 L21.6 10 L20.1 14 Z" fill={TINTA} />
        </g>
      )}
    </svg>
  );
}
