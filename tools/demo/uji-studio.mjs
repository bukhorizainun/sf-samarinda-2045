/**
 * Uji Studio Fase 2 hasil build (worktree gerak) terhadap Worker asli.
 *   node uji-studio.mjs <folder-keluaran>
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
const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true });
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

// Tautan dari beranda (Fase 2) menuju studio
await page.goto(`${ASAL}/id/`, { waitUntil: "networkidle" });
const tautan = page.locator('a[href*="shelbot/#studio"]');
cek("beranda punya tautan ke Studio Fase 2", (await tautan.count()) === 1);
cek("tautan memakai awalan situs", (await tautan.getAttribute("href")).startsWith("/sf-samarinda-2045/id/shelbot/"));
await tautan.click();
await page.waitForURL(/shelbot\/#studio/);
await page.waitForSelector("#studio");
cek("tautan membuka halaman Shelbot di bagian studio", true);

await page.fill("#deskripsi-studio", "Sungai Mahakam jernih, perahu listrik ke pasar terapung, taman di bekas lubang tambang");
await page.click('#studio button[type="submit"]');
await page.waitForSelector("#studio figure img", { timeout: 60000 });
const tanda = await page.textContent("#studio figure span.mono");
cek("gambar tampil dengan tanda AI", tanda.includes("GAMBAR AI"));
const alt = await page.getAttribute("#studio figure img", "alt");
cek("teks alternatif menyebut buatan AI", alt.startsWith("Ilustrasi buatan AI"));
await page.click("#studio details summary");
const prompt = await page.textContent("#studio details p");
cek("prompt ditampilkan terbuka", prompt.includes("watercolour"));

const [unduhan] = await Promise.all([page.waitForEvent("download"), page.click('#studio button:has-text("Unduh")')]);
const berkas = join(OUT, "studio-unduhan.jpg");
await unduhan.saveAs(berkas);
cek("unduhan berupa JPEG", readFileSync(berkas).subarray(0, 2).toString("hex") === "ffd8");

await page.locator("#studio").scrollIntoViewIfNeeded();
await page.locator("#studio").screenshot({ path: join(OUT, "studio.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.locator("#studio").screenshot({ path: join(OUT, "studio-hp.png") });
cek("tanpa galat halaman", galat.length === 0);
if (galat.length) console.log(galat.join("\n"));
await b.close();
