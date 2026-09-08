/** Uji cepat jawaban Shelbot di peramban sungguhan. */
import { chromium } from "playwright";

const ASAL = process.argv[2] || "http://localhost:4174";
const TANYA = [
  "halo",
  "gimana cara mainnya?",
  "siapa saja peranya",          // sengaja salah ketik
  "apa itu city indicator",
  "P01",
  "kartu tentang banjir",
  "berapa harga tiket pesawat ke bali",
];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto(`${ASAL}/id/shelbot/`, { waitUntil: "networkidle" });

for (const t of TANYA) {
  await p.fill("#tanya", t);
  await p.keyboard.press("Enter");
  await p.waitForTimeout(2200);
  const jawab = await p.locator(".rise .measure").last().innerText();
  console.log(`\n> ${t}\n${jawab.slice(0, 240).replace(/\n+/g, " | ")}`);
}

await p.screenshot({ path: "keluaran/shelbot.png", fullPage: false });
await b.close();
