/**
 * Merekam jalan-jalan melalui situs SF, seolah-olah ada orang yang memakainya.
 *
 * Kursornya palsu — digambar di dalam halaman — karena perekam Playwright
 * tidak menangkap penunjuk tetikus asli. Gerakannya dibuat melengkung dan
 * melambat di ujung, supaya tidak terlihat seperti mesin.
 *
 *   node rekam.mjs                     # ke http://localhost:3000
 *   node rekam.mjs https://alamat-lain # ke alamat lain
 */

import { chromium } from "playwright";
import { mkdirSync, existsSync, readdirSync, renameSync } from "node:fs";
import { join } from "node:path";

const ASAL = process.argv[2] || "http://localhost:3000";
const KELUARAN = join(process.cwd(), "keluaran");
const LEBAR = 1440;
const TINGGI = 900;

if (!existsSync(KELUARAN)) mkdirSync(KELUARAN, { recursive: true });

/* Kursor palsu, dipasang ulang setiap kali halaman berganti. */
const KURSOR = `
(() => {
  if (window.__kursor) return;
  const el = document.createElement('div');
  el.id = '__kursor';
  el.style.cssText = [
    'position:fixed','left:0','top:0','width:22px','height:22px',
    'margin:-11px 0 0 -11px','border-radius:50%','z-index:2147483647',
    'pointer-events:none','transition:transform .12s ease-out',
    'background:radial-gradient(circle at 34% 34%, #fff, #cfe6f5 42%, #7fb4d4 100%)',
    'box-shadow:0 2px 10px rgba(8,20,32,.35), 0 0 0 1.5px rgba(8,20,32,.18)'
  ].join(';');
  document.documentElement.appendChild(el);

  const riak = document.createElement('div');
  riak.id = '__riak';
  riak.style.cssText = [
    'position:fixed','left:0','top:0','width:22px','height:22px',
    'margin:-11px 0 0 -11px','border-radius:50%','z-index:2147483646',
    'pointer-events:none','opacity:0','border:2px solid rgba(53,200,255,.9)'
  ].join(';');
  document.documentElement.appendChild(riak);

  window.__kursor = (x, y) => {
    el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    riak.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  };
  window.__klik = () => {
    riak.animate(
      [
        { opacity: .9, transform: riak.style.transform + ' scale(1)' },
        { opacity: 0, transform: riak.style.transform + ' scale(2.6)' }
      ],
      { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' }
    );
    el.animate([{ scale: 1 }, { scale: .82 }, { scale: 1 }], { duration: 220 });
  };
  window.__kursor(${LEBAR / 2}, ${TINGGI / 2});
})();
`;

const tidur = (ms) => new Promise((r) => setTimeout(r, ms));
const pelan = (t) => 1 - Math.pow(1 - t, 3); // melambat di ujung

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: LEBAR, height: TINGGI },
    recordVideo: { dir: KELUARAN, size: { width: LEBAR, height: TINGGI } },
    deviceScaleFactor: 1,
    locale: "id-ID",
  });

  await context.addInitScript(KURSOR);
  const page = await context.newPage();

  let px = LEBAR / 2;
  let py = TINGGI / 2;

  const taruhKursor = async () => {
    await page.evaluate(KURSOR).catch(() => {});
    await page.evaluate(([x, y]) => window.__kursor?.(x, y), [px, py]).catch(() => {});
  };

  /** Menggeser kursor ke satu titik, melengkung sedikit. */
  async function ke(x, y, langkah = 26) {
    const x0 = px;
    const y0 = py;
    // Titik kendali di samping garis lurus, supaya jalurnya melengkung.
    const cx = (x0 + x) / 2 + (y - y0) * 0.14;
    const cy = (y0 + y) / 2 - (x - x0) * 0.14;

    for (let i = 1; i <= langkah; i++) {
      const t = pelan(i / langkah);
      const u = 1 - t;
      const nx = u * u * x0 + 2 * u * t * cx + t * t * x;
      const ny = u * u * y0 + 2 * u * t * cy + t * t * y;
      await page.mouse.move(nx, ny);
      await page.evaluate(([a, b]) => window.__kursor?.(a, b), [nx, ny]).catch(() => {});
      await tidur(14);
    }
    px = x;
    py = y;
  }

  /** Menggeser kursor ke sebuah elemen, lalu mengekliknya. */
  async function klik(pemilih, { jeda = 700, nth = 0 } = {}) {
    const el = page.locator(pemilih).nth(nth);
    await el.scrollIntoViewIfNeeded().catch(() => {});
    await tidur(280);
    const kotak = await el.boundingBox();
    if (!kotak) {
      console.warn("tidak ketemu:", pemilih);
      return false;
    }
    await ke(kotak.x + kotak.width / 2, kotak.y + kotak.height / 2);
    await tidur(180);
    await page.evaluate(() => window.__klik?.()).catch(() => {});
    await el.click({ force: true }).catch(() => {});
    await tidur(jeda);
    return true;
  }

  /** Gulir halus, seperti orang membaca. */
  async function gulir(jauh, ms = 1600) {
    await page.evaluate(
      ([jauh, ms]) =>
        new Promise((selesai) => {
          const awal = window.scrollY;
          const mulai = performance.now();
          const langkah = (kini) => {
            const t = Math.min(1, (kini - mulai) / ms);
            const e = 1 - Math.pow(1 - t, 3);
            window.scrollTo(0, awal + jauh * e);
            t < 1 ? requestAnimationFrame(langkah) : selesai();
          };
          requestAnimationFrame(langkah);
        }),
      [jauh, ms],
    );
  }

  async function buka(jalur) {
    await page.goto(`${ASAL}${jalur}`, { waitUntil: "networkidle" });
    await taruhKursor();
    await tidur(900);
  }

  /* ---------------- adegan ---------------- */

  // 1. Datang ke beranda
  await buka("/id/");
  await tidur(2200); // biarkan aurora dan arus sungai terlihat bergerak
  await gulir(420, 1800);
  await tidur(1200);

  // 2. Tiga masa depan
  await gulir(560, 1700);
  await tidur(900);
  await klik('[role="tab"]:has-text("Transformative Future")', { jeda: 2000 });
  await klik('[role="tab"]:has-text("Expected Future")', { jeda: 2000 });

  // 3. Empat indikator
  await gulir(700, 1700);
  await tidur(1600);

  // 4. Tab utama: Tentang Permainan
  await klik('header a:has-text("Tentang Permainan")', { jeda: 1500 });
  await gulir(300, 1200);
  await klik('[role="tab"]:has-text("Lima Peran")', { jeda: 1700 });
  await klik('[role="tab"]:has-text("Empat Indikator")', { jeda: 1700 });
  await klik('[role="tab"]:has-text("Komponen")', { jeda: 1900 });

  // 5. Katalog kartu: saring, cari, buka satu kartu
  await klik('header a:has-text("Katalog Kartu")', { jeda: 1500 });
  await gulir(280, 1200);
  await klik('[role="tab"]:has-text("Skenario Samarinda")', { jeda: 1600 });
  await klik('[role="tab"]:has-text("Proyek Kecil")', { jeda: 1600 });

  await ke(1130, 250);
  await page.locator("#cari").click().catch(() => {});
  for (const huruf of "river") {
    await page.keyboard.type(huruf, { delay: 130 });
  }
  await tidur(1500);
  await page.locator("#cari").fill("").catch(() => {});
  await tidur(900);

  await klik("ul li button.group", { jeda: 2400, nth: 2 }); // panel rinci
  await klik('[role="dialog"] button[aria-label="Tutup"]', { jeda: 1100 });

  // 6. Mini game
  await klik('header a:has-text("Mini Game")', { jeda: 1400 });
  await gulir(240, 1100);
  await klik('button:has-text("Mulai Bermain")', { jeda: 1500 });
  for (let i = 0; i < 4; i++) {
    await klik(
      i % 2 === 0
        ? 'button:has-text("Mendukung Keberlanjutan")'
        : 'button:has-text("Mengancam Keberlanjutan")',
      { jeda: 1150 },
    );
  }
  await tidur(1200);

  // 7. Futures Lab
  await klik('header a:has-text("Futures Lab")', { jeda: 1600 });
  await gulir(220, 1100);
  await tidur(1800);

  // 8. Ganti bahasa, lalu ganti tampilan
  await klik('header a[hreflang="en"]', { jeda: 2000 });
  await klik('header a[hreflang="id"]', { jeda: 1600 });
  await klik("header button[title]", { jeda: 2200 }); // gelap
  await klik("header button[title]", { jeda: 1800 }); // kembali terang

  // 9. Pulang ke beranda
  await buka("/id/");
  await tidur(2600);

  await context.close();
  await browser.close();

  // Beri nama yang jelas pada berkas rekamannya.
  const berkas = readdirSync(KELUARAN).filter((f) => f.endsWith(".webm"));
  const terbaru = berkas.sort().pop();
  if (terbaru) {
    const tujuan = join(KELUARAN, "sf-demo.webm");
    renameSync(join(KELUARAN, terbaru), tujuan);
    console.log("Rekaman:", tujuan);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
