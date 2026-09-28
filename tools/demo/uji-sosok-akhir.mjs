/**
 * Shelly & Hakam di ujung kanan bawah setiap halaman (build lokal).
 *   node uji-sosok-akhir.mjs <folder-keluaran>
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
const galat = [];
for (const [tag, viewport] of [["desktop", { width: 1366, height: 860 }], ["ponsel", { width: 390, height: 844 }]]) {
  const ctx = await b.newContext({ viewport });
  await ctx.route(`${ASAL}/**`, (r) => {
    let f = join(AKAR, decodeURIComponent(new URL(r.request().url()).pathname.replace("/sf-samarinda-2045", "")));
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) return r.fulfill({ status: 404, body: "" });
    r.fulfill({ status: 200, body: readFileSync(f), headers: { "content-type": JENIS[extname(f)] || "application/octet-stream" } });
  });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => galat.push(e.message));
  for (const hal of ["permainan", "kartu", "samarinda", "mini-game", "kontak"]) {
    await p.goto(`${ASAL}/id/${hal}/`, { waitUntil: "networkidle" });
    const sosok = await p.$(".sosok-akhir");
    if (sosok) await sosok.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await p.waitForTimeout(1400);
    const info = sosok && (await sosok.evaluate((el) => {
      const r = el.querySelector("svg")?.getBoundingClientRect();
      const k = el.getBoundingClientRect();
      const gaya = getComputedStyle(el);
      return { lebar: r?.width ?? 0, kanan: r ? k.right - parseFloat(gaya.paddingRight) - r.right : -1 };
    }));
    cek(`[${tag}] ${hal}: Shelly & Hakam tampil di kanan bawah`, Boolean(sosok) && info.lebar > 60 && info.kanan < 60);
    await p.screenshot({ path: join(OUT, `akhir-${tag}-${hal}.png`) });
  }
  await p.goto(`${ASAL}/id/`, { waitUntil: "networkidle" });
  cek(`[${tag}] beranda: tidak dobel dengan pawai`, (await p.$(".sosok-akhir")) === null);
  await ctx.close();
}
cek("tanpa galat halaman", galat.length === 0);
if (galat.length) console.log(galat.join("\n"));
await b.close();
