/** Mengambil sosok Shelly dari halaman, lalu menyimpannya sebagai PNG besar.
 *
 *   node gambar-shelly.mjs [alamat]
 *
 * Menghasilkan tiga berkas di keluaran/:
 *   shelly-1024.png        latar bening
 *   shelly-1024-terang.png latar kertas
 *   shelly-1024-gelap.png  latar malam
 */
import { chromium } from "playwright";

const ASAL =
  process.argv[2] || "https://bukhorizainun.github.io/sf-samarinda-2045";
const UKURAN = 1024;

const b = await chromium.launch();
const p = await b.newPage({
  viewport: { width: UKURAN, height: UKURAN },
  deviceScaleFactor: 2,
});

await p.goto(`${ASAL}/id/shelbot/`, { waitUntil: "networkidle" });

// Sosoknya diambil apa adanya dari halaman, lalu dibesarkan.
await p.evaluate((u) => {
  const asli = document.querySelector("svg[aria-label='Shelbot']");
  const salinan = asli.cloneNode(true);
  salinan.setAttribute("width", u);
  salinan.setAttribute("height", u);
  salinan.id = "besar";

  document.body.innerHTML = "";
  document.body.style.cssText =
    `margin:0;width:${u}px;height:${u}px;display:grid;place-items:center;background:transparent`;
  document.body.appendChild(salinan);
}, UKURAN);

await p.waitForTimeout(600); // biarkan mendarat di tengah ayunan, bukan di ujung

const el = p.locator("#besar");
await el.screenshot({ path: "keluaran/shelly-1024.png", omitBackground: true });

for (const [nama, tema, latar] of [
  ["terang", "light", "#f6f8fb"],
  ["gelap", "dark", "#070d16"],
]) {
  await p.evaluate(
    ([t, l]) => {
      document.documentElement.dataset.theme = t;
      document.body.style.background = l;
    },
    [tema, latar],
  );
  await p.waitForTimeout(300);
  await p.screenshot({ path: `keluaran/shelly-1024-${nama}.png` });
}

await b.close();
console.log("selesai");
