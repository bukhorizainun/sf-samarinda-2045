/**
 * Footer: tiga kolom rata bawah di desktop, menu dua kolom.
 *   node uji-footer.mjs <folder-keluaran>
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
for (const [tag, viewport] of [["desktop", { width: 1366, height: 900 }], ["tablet", { width: 820, height: 1000 }], ["ponsel", { width: 390, height: 844 }]]) {
  const ctx = await b.newContext({ viewport });
  await ctx.route(`${ASAL}/**`, (r) => {
    let f = join(AKAR, decodeURIComponent(new URL(r.request().url()).pathname.replace("/sf-samarinda-2045", "")));
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) return r.fulfill({ status: 404, body: "" });
    r.fulfill({ status: 200, body: readFileSync(f), headers: { "content-type": JENIS[extname(f)] || "application/octet-stream" } });
  });
  const p = await ctx.newPage();
  await p.goto(`${ASAL}/id/kontak/`, { waitUntil: "networkidle" });
  const kaki = await p.$("footer");
  await kaki.scrollIntoViewIfNeeded();
  await p.waitForTimeout(600);
  const ukur = await kaki.evaluate((f) => {
    const kolom = [...f.querySelector(".grid").children];
    const bawahIsi = (el) => Math.max(...[...el.querySelectorAll("p, a, li")].map((x) => x.getBoundingClientRect().bottom));
    return kolom.map((k) => Math.round(bawahIsi(k)));
  });
  console.log(tag, "dasar isi tiap kolom (px):", ukur.join(", "));
  if (tag === "desktop") cek("desktop: ketiga kolom rata bawah (selisih <= 14 px)", Math.max(...ukur) - Math.min(...ukur) <= 14);
  await kaki.screenshot({ path: join(OUT, `footer-${tag}.png`) });
  await ctx.close();
}
await b.close();
