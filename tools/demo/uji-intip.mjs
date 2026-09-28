/**
 * Kepala mengintip di tepi kanan bawah: tampil, bergantian, menyingkir di footer.
 *   node uji-intip.mjs <folder-keluaran>
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
  await p.goto(`${ASAL}/id/kartu/`, { waitUntil: "networkidle" });
  await p.evaluate(() => window.scrollTo(0, 1500));
  await p.waitForTimeout(700);

  const keadaan = () => p.evaluate(() => {
    const el = document.querySelector(".intip");
    const svg = el?.querySelector("svg");
    const r = svg?.getBoundingClientRect();
    return {
      ada: Boolean(el),
      kotak: svg?.getAttribute("viewBox") ?? "",
      keluar: el?.classList.contains("intip-keluar") ?? true,
      terlihat: r ? r.top < window.innerHeight - 20 && r.width > 30 : false,
    };
  });
  const a = await keadaan();
  cek(`[${tag}] kepala tampil di pojok saat menggulir`, a.ada && !a.keluar && a.terlihat);
  await p.screenshot({ path: join(OUT, `intip-${tag}-1.png`) });
  await p.waitForTimeout(7800);
  const c = await keadaan();
  cek(`[${tag}] sosok bergantian setelah ±7 detik`, c.kotak !== a.kotak && !c.keluar);
  await p.screenshot({ path: join(OUT, `intip-${tag}-2.png`) });
  await p.goto(`${ASAL}/id/permainan/`, { waitUntil: "networkidle" }); // katalog memuat kartu tambahan saat digulir
  await p.evaluate(() => document.querySelector("body > footer").scrollIntoView());
  await p.waitForTimeout(700);
  cek(`[${tag}] menyingkir saat footer terlihat`, (await keadaan()).keluar);
  await ctx.close();
}
cek("tanpa galat halaman", galat.length === 0);
if (galat.length) console.log(galat.join("\n"));
await b.close();
