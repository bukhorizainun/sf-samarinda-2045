import { LatarKhas, type Motif } from "./LatarKhas";

/**
 * Pembungkus halaman.
 *
 * Tiga hal yang membuat halaman tidak terbaca sebagai lembar putih
 * berisi tulisan, tanpa satu pun gambar kartun:
 *
 * 1. Warna adegan sendiri. Tiap halaman mengambil satu warna dari palet
 *    permainan, dan warna itu mengalir ke penanda tab, cincin fokus,
 *    sorotan teks, garis rambut, dan kutipan. Halaman jadi punya watak,
 *    bukan sekadar isi yang berganti.
 * 2. Motif kota di belakang pembuka, digambar dengan gradasi dua warna
 *    pada kadar rendah.
 * 3. Irama bagian: bagian berselang diberi warna adegan yang sangat
 *    tipis, jadi mata punya tempat berhenti saat menggulir.
 *
 * Tidak ada yang menyentuh kontras teks. Yang berwarna hanya bidang,
 * garis, dan penanda.
 */

/** Warna adegan tiap halaman. Diturunkan dari bahan, bukan dari layar:
 *  air Mahakam, daun, ulin, tenun, langit, dan tanah. Cukup gelap untuk
 *  garis dan penanda di atas kertas; warna data tetap milik indikator. */
export const ADEGAN = {
  sungai: "var(--adegan-sungai)",
  hutan: "var(--adegan-hutan)",
  kayu: "var(--adegan-kayu)",
  tenun: "var(--adegan-tenun)",
  langit: "var(--adegan-langit)",
  pangan: "var(--adegan-pangan)",
} as const;

export function Halaman({
  motif,
  adegan,
  children,
}: {
  motif: Motif;
  adegan: keyof typeof ADEGAN;
  children: React.ReactNode;
}) {
  return (
    <div
      className="halaman"
      style={{ "--scene": ADEGAN[adegan] } as React.CSSProperties}
    >
      <LatarKhas motif={motif} />
      {children}
    </div>
  );
}
