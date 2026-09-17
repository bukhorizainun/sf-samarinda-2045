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

/** Warna adegan tiap halaman, diambil dari palet permainan. */
export const ADEGAN = {
  sungai: "var(--color-aqua)",
  hutan: "var(--color-env)",
  kayu: "var(--color-ember)",
  tenun: "var(--color-iris)",
  langit: "var(--color-future)",
  pangan: "var(--color-rose)",
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
