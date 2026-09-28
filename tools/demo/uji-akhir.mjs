/**
 * Uji akhir Langkah 06: semua halaman (id + en) di desktop dan ponsel.
 * Diperiksa: halaman termuat, tanpa galat skrip, tanpa geser mendatar di ponsel,
 * semua tautan internal menuju berkas yang ada, dan gambar tidak rusak.
 *   node uji-akhir.mjs <folder-keluaran>
 */
import { chromium } from "playwright";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const OUT = process.argv[2] || ".";
const AKAR = "D:/AI PROJECTS/samarinda_2045-gerak/web/out";
const DOMAIN = "https://bukhorizainun.github.io";
const AWALAN = "/sf-samarinda-2045";
const JENIS = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".txt": "text/plain", ".json": "application/json", ".ico": "image/x-icon", ".webp": "image/webp", ".xml": "application/xml", ".mp4": "video/mp4" };

function berkasUntuk(pathname) {
  let f = join(AKAR, decodeURIComponent(pathname.replace(AWALAN, "")));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f) && existsSync(f + ".html")) f += ".html";
  return existsSync(f) ? f : null;
}

const HALAMAN = ["", "permainan", "aturan", "dasbor", "kartu", "samarinda", "shelbot", "mini-game", "fasilitator", "kontak", "privasi", "gaya"];
const temuan = [];
const rsc = new Set();
const catat = (s) => { temuan.push(s); console.log("  ! " + s); };

const b = await chromium.launch({ channel: "msedge" });
for (const [tag, viewport] of [["desktop", { width: 1366, height: 900 }], ["ponsel", { width: 390, height: 844 }]]) {
  const ctx = await b.newContext({ viewport, deviceScaleFactor: 1 });
  await ctx.route(`${DOMAIN}${AWALAN}/**`, (r) => {
    const f = berkasUntuk(new URL(r.request().url()).pathname);
    if (!f) return r.fulfill({ status: 404, body: "" });
    r.fulfill({ status: 200, body: readFileSync(f), headers: { "content-type": JENIS[extname(f)] || "application/octet-stream" } });
  });
  // Worker AI tidak dipanggil di uji ini (kecuali GET /model yang ringan).
  const page = await ctx.newPage();
  const galat = [];
  page.on("pageerror", (e) => galat.push(e.message));
  page.on("response", (r) => { if (r.status() === 404 && r.url().startsWith(DOMAIN)) (r.url().includes("/__next.") ? rsc.add(new URL(r.url()).pathname) : galat.push(`404 ${r.url()}`)); });

  for (const lang of ["id", "en"]) {
    for (const h of HALAMAN) {
      const url = `${DOMAIN}${AWALAN}/${lang}/${h ? h + "/" : ""}`;
      galat.length = 0;
      const res = await page.goto(url, { waitUntil: "networkidle" }).catch((e) => ({ status: () => `gagal: ${e.message}` }));
      if (res.status() !== 200) { catat(`[${tag}] ${lang}/${h}: status ${res.status()}`); continue; }
      await page.waitForTimeout(300);
      const info = await page.evaluate(() => ({
        lebar: document.documentElement.scrollWidth,
        vw: window.innerWidth,
        tautan: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
        gambarRusak: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && !i.src.startsWith("data:")).map((i) => i.src),
        judul: document.title,
      }));
      if (info.lebar > info.vw + 1) catat(`[${tag}] ${lang}/${h}: geser mendatar (${info.lebar}px > ${info.vw}px)`);
      for (const g of info.gambarRusak) catat(`[${tag}] ${lang}/${h}: gambar rusak ${g}`);
      for (const e of galat) catat(`[${tag}] ${lang}/${h}: ${e}`);
      if (tag === "desktop") {
        for (const href of new Set(info.tautan)) {
          if (!href.startsWith("/")) continue;
          if (href.startsWith(`${AWALAN}/`) || href === AWALAN) {
            const p = href.split("#")[0].split("?")[0];
            if (!berkasUntuk(p)) catat(`${lang}/${h}: tautan mati ${href}`);
          } else {
            catat(`${lang}/${h}: tautan tanpa awalan situs ${href}`);
          }
        }
      }
      if (lang === "id" && ["", "shelbot", "mini-game", "kartu"].includes(h)) {
        await page.screenshot({ path: join(OUT, `akhir-${tag}-${h || "beranda"}.png`), fullPage: false });
      }
    }
  }
  console.log(`${tag}: ${HALAMAN.length * 2} halaman diperiksa`);
  await ctx.close();
}
await b.close();
console.log(`RSC prefetch 404 (unik): ${rsc.size}; contoh: ${[...rsc].slice(0, 2).join(" , ")}`);
console.log(temuan.length ? `TEMUAN: ${temuan.length}` : "TEMUAN: tidak ada");
