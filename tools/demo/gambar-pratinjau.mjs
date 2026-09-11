/** Membuat gambar pratinjau tautan (1200×630) dari pembuka situs.
 *
 *   node gambar-pratinjau.mjs [alamat]
 *
 * Hasilnya ditulis langsung ke web/public/gambar/pratinjau.png, jadi ia ikut
 * terbawa pada build berikutnya. Diambil dari halaman sungguhan supaya
 * pratinjaunya tidak pernah berbeda dari situsnya.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const ASAL = process.argv[2] || "http://localhost:4190";
const TUJUAN = "../../web/public/gambar";

mkdirSync(TUJUAN, { recursive: true });

const b = await chromium.launch();
const p = await b.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

await p.goto(`${ASAL}/id/`, { waitUntil: "networkidle" });

// Kepala halaman dilepas: pada kartu pratinjau, tab navigasi tidak berguna.
await p.evaluate(() => {
  document.querySelector("header")?.remove();
  document.body.style.overflow = "hidden";
  // Dikecilkan sedikit supaya maskot dan kedua tombol muat utuh dalam kartu.
  document.body.style.zoom = "0.86";
});

await p.waitForTimeout(1200); // beri waktu aurora dan maskot mendarat
await p.screenshot({ path: `${TUJUAN}/pratinjau.png` });

await b.close();
console.log(`Pratinjau ditulis ke ${TUJUAN}/pratinjau.png`);
