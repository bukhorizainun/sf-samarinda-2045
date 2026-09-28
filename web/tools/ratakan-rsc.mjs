/**
 * Jalankan sesudah `npm run build`.
 *
 * Ekspor statis Next 16 menyimpan data prefetch per segmen di folder bersarang,
 * misalnya  id/samarinda/__next.$d$lang/samarinda/__PAGE__.txt,
 * tetapi peramban memintanya dengan nama datar
 *           id/samarinda/__next.$d$lang.samarinda.__PAGE__.txt.
 * Di GitHub Pages permintaan itu 404, sehingga setiap klik tautan jatuh ke
 * muat ulang halaman penuh. Skrip ini menambahkan salinan bernama datar di
 * sebelah folder aslinya. Tidak ada berkas yang diubah atau dihapus.
 *
 *   node tools/ratakan-rsc.mjs [folder-out]
 */
import { readdirSync, statSync, copyFileSync, existsSync } from "node:fs";
import { join, relative, sep, dirname } from "node:path";

const OUT = process.argv[2] || join(import.meta.dirname, "..", "out");
let jumlah = 0;

function jelajah(dir) {
  for (const nama of readdirSync(dir)) {
    const p = join(dir, nama);
    if (statSync(p).isDirectory()) {
      if (nama.startsWith("__next.")) ratakan(p);
      else jelajah(p);
    }
  }
}

/** Semua .txt di bawah folder __next.X menjadi __next.X.a.b.txt di folder induknya. */
function ratakan(folder) {
  const induk = dirname(folder);
  const awal = folder.slice(induk.length + 1);
  const isi = (d) =>
    readdirSync(d).flatMap((n) => {
      const p = join(d, n);
      return statSync(p).isDirectory() ? isi(p) : n.endsWith(".txt") ? [p] : [];
    });
  for (const f of isi(folder)) {
    const datar = [awal, ...relative(folder, f).split(sep)].join(".");
    const tujuan = join(induk, datar);
    if (!existsSync(tujuan)) {
      copyFileSync(f, tujuan);
      jumlah++;
    }
  }
}

jelajah(OUT);
console.log(`ratakan-rsc: ${jumlah} salinan prefetch ditambahkan di ${OUT}`);
