/**
 * Uji halaman Shelbot hasil build (web/out di worktree gerak) terhadap Worker asli.
 * Halaman disajikan seolah dari github.io supaya Worker menerima asalnya.
 *
 *   node uji-pilih-otak.mjs <folder-keluaran>
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
const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 } });
await ctx.route(`${ASAL}/**`, (r) => {
  let f = join(AKAR, decodeURIComponent(new URL(r.request().url()).pathname.replace("/sf-samarinda-2045", "")));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f) && existsSync(f + ".html")) f += ".html";
  if (!existsSync(f)) return r.fulfill({ status: 404, body: "" });
  r.fulfill({ status: 200, body: readFileSync(f), headers: { "content-type": JENIS[extname(f)] || "application/octet-stream" } });
});
const page = await ctx.newPage();
const galat = [];
page.on("pageerror", (e) => galat.push(e.message));

await page.goto(`${ASAL}/id/shelbot/`, { waitUntil: "networkidle" });
const pil = await page.$$eval('[role="radiogroup"] [role="radio"]', (els) => els.map((e) => e.textContent.trim()));
console.log("pilihan:", pil.join(" | "));
cek("pemilih otak tampil dengan naskah, dua Llama, bandingkan", pil.length >= 4 && pil.some((t) => t.includes("Llama 3.3")) && pil.some((t) => t.startsWith("Bandingkan")));
cek("Llama 3.3 70B terpilih di awal", await page.$eval('[role="radio"][aria-checked="true"]', (e) => e.textContent.includes("Llama 3.3")));

await page.click('button[aria-controls="info-claude"]');
const info = await page.textContent("#info-claude");
cek("pil Claude nonaktif memunculkan keterangan belum tersedia", info.includes("belum tersedia") && info.includes("berbayar"));
cek("pil Claude tidak bisa dipilih", !(await page.$eval('[role="radio"][aria-checked="true"]', (e) => e.textContent.includes("Claude"))));

const tanya = async (t) => {
  await page.fill("#tanya", t);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  await page.waitForFunction(() => !document.querySelector('[aria-live="polite"] .sr-only'), null, { timeout: 60000 });
  await page.waitForTimeout(600);
};

await tanya("Apa saja empat City Indicator?");
const sumber1 = await page.$$eval(".gelembung-shelbot", (els) => els.at(-1).innerText);
console.log("jawaban 1:", sumber1.slice(0, 260).replace(/\n/g, " / "));
cek("jawaban tunggal dari Shelbot+ Llama", sumber1.includes("Shelbot+ · Llama 3.3 70B"));

await page.click('[role="radio"]:has-text("Bandingkan")');
await tanya("Berapa jumlah kartu dalam permainan?");
const kartu = await page.$$eval(".grid .gelembung-shelbot", (els) => els.map((e) => e.innerText.split("\n")[0]));
console.log("kartu banding:", kartu.join(" | "));
cek("mode bandingkan memuat naskah + dua Llama", kartu.length >= 3);

await page.click('[role="radio"]:has-text("Naskah")');
await tanya("Apa itu Fase 3?");
const sumber3 = await page.$$eval(".gelembung-shelbot", (els) => els.at(-1).innerText);
cek("pilihan naskah tidak memanggil model", !sumber3.includes("Shelbot+"));

await page.screenshot({ path: join(OUT, "shelbot-pilih-otak.png"), fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${ASAL}/id/shelbot/`, { waitUntil: "networkidle" });
await page.screenshot({ path: join(OUT, "shelbot-pilih-otak-hp.png"), fullPage: false });
cek("tanpa galat halaman", galat.length === 0);
if (galat.length) console.log(galat.join("\n"));
await b.close();
