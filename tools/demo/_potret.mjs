/**
 * Potret halaman untuk pemeriksaan rupa.
 *   node _potret.mjs <folder-keluaran> [lokal] [halaman,...] [gelap]
 * "lokal" menyajikan web/out dari cakram lewat penyadapan permintaan,
 * tanpa server.
 */
import { chromium } from "playwright";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const OUT = process.argv[2];
const LOKAL = process.argv[3] === "lokal";
const HAL = (process.argv[4] || "id,id/permainan,id/kartu,id/dasbor,id/shelbot,id/samarinda").split(",");
const GELAP = process.argv[5] === "gelap";
const ASAL = "https://bukhorizainun.github.io/sf-samarinda-2045";
const AKAR = join(import.meta.dirname, "../../web/out");
const JENIS = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain", ".ico": "image/x-icon", ".jpg": "image/jpeg", ".webp": "image/webp" };

const b = await chromium.launch({ channel: "msedge" });
for (const [w, h, tag] of [[1440, 900, "d"], [390, 844, "m"]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: GELAP ? "dark" : "light" });
  if (LOKAL) {
    await ctx.route(`${ASAL}/**`, (r) => {
      let p = decodeURIComponent(new URL(r.request().url()).pathname.replace("/sf-samarinda-2045", ""));
      let f = join(AKAR, p);
      if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
      else if (!existsSync(f) && existsSync(f + ".html")) f += ".html";
      if (!existsSync(f)) return r.fulfill({ status: 404, body: "" });
      r.fulfill({ status: 200, body: readFileSync(f), contentType: JENIS[extname(f)] || "application/octet-stream" });
    });
  }
  const p = await ctx.newPage();
  if (GELAP) await p.addInitScript(() => { try { localStorage.setItem("sf-theme", "dark"); } catch {} });
  for (const u of HAL) {
    await p.goto(`${ASAL}/${u}/`, { waitUntil: "networkidle" }).catch(() => {});
    await p.waitForTimeout(1200);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } scrollTo(0, 0); });
    await p.waitForTimeout(500);
    const lebar = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    if (lebar[0] > lebar[1]) console.log(`MELUBER ${tag} ${u}: ${lebar[0]} > ${lebar[1]}`);
    await p.screenshot({ path: `${OUT}/${GELAP ? "g" : ""}${tag}_${u.replace(/\//g, "_")}.png`, fullPage: true });
  }
  await ctx.close();
}
await b.close();
