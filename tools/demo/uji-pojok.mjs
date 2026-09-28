/**
 * Pratinjau tiga rupa pojok Shelly & Hakam dari build lokal.
 *   node uji-pojok.mjs <folder-keluaran>
 */
import { chromium } from "playwright";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const OUT = process.argv[2] || ".";
const AKAR = "D:/AI PROJECTS/samarinda_2045-gerak/web/out";
const ASAL = "https://bukhorizainun.github.io/sf-samarinda-2045";
const JENIS = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain", ".json": "application/json", ".ico": "image/x-icon", ".webp": "image/webp" };
const cek = (nama, ok) => { console.log(ok ? "LULUS" : "GAGAL", nama); if (!ok) process.exitCode = 1; };

const b = await chromium.launch({ channel: "msedge" });
async function konteks(viewport) {
  const ctx = await b.newContext({ viewport });
  await ctx.route(`${ASAL}/**`, (r) => {
    let f = join(AKAR, decodeURIComponent(new URL(r.request().url()).pathname.replace("/sf-samarinda-2045", "")));
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) return r.fulfill({ status: 404, body: "" });
    r.fulfill({ status: 200, body: readFileSync(f), headers: { "content-type": JENIS[extname(f)] || "application/octet-stream" } });
  });
  return ctx;
}
const galat = [];

const d = await konteks({ width: 1366, height: 860 });
const p = await d.newPage();
p.on("pageerror", (e) => galat.push(e.message));
await p.goto(`${ASAL}/id/`, { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
cek("tanpa ?pojok, pojok tidak tampil", (await p.$(".pojok")) === null);

for (const rupa of ["a", "b", "c"]) {
  for (const hal of ["", "kartu/"]) {
    await p.goto(`${ASAL}/id/${hal}?pojok=${rupa}`, { waitUntil: "networkidle" });
    await p.evaluate(() => window.scrollTo(0, 600));
    await p.waitForSelector(".pojok-sapa", { timeout: 8000 });
    await p.waitForTimeout(500);
    await p.screenshot({ path: join(OUT, `pojok-${rupa}-${hal ? "kartu" : "beranda"}.png`) });
  }
  cek(`rupa ${rupa}: sapaan tampil`, true);
  await p.click(".pojok-intip, .pojok-lencana, .pojok-dok");
  await p.waitForSelector(".pojok-panel .obrolan");
  await p.waitForTimeout(400);
  await p.screenshot({ path: join(OUT, `pojok-${rupa}-panel.png`) });
  cek(`rupa ${rupa}: klik membuka Shelbot mini`, true);
  await p.keyboard.press("Escape");
  cek(`rupa ${rupa}: Esc menutup panel`, (await p.$(".pojok-panel")) === null);
}

await p.goto(`${ASAL}/id/shelbot/?pojok=b`, { waitUntil: "networkidle" });
await p.waitForTimeout(800);
cek("di halaman Shelbot pojok tidak tampil", (await p.$(".pojok")) === null);

const m = await konteks({ width: 390, height: 844 });
const q = await m.newPage();
q.on("pageerror", (e) => galat.push(e.message));
for (const rupa of ["a", "b", "c"]) {
  await q.goto(`${ASAL}/id/?pojok=${rupa}`, { waitUntil: "networkidle" });
  await q.evaluate(() => window.scrollTo(0, 700));
  await q.waitForSelector(".pojok-sapa", { timeout: 8000 });
  await q.waitForTimeout(500);
  await q.screenshot({ path: join(OUT, `pojok-${rupa}-hp.png`) });
}
await q.click(".pojok-dok");
await q.waitForSelector(".pojok-panel .obrolan");
await q.waitForTimeout(400);
await q.screenshot({ path: join(OUT, `pojok-c-hp-panel.png`) });

cek("tanpa galat halaman", galat.length === 0);
if (galat.length) console.log(galat.join("\n"));
await b.close();
