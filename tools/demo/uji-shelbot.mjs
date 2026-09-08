/** Uji jawaban Shelbot di peramban sungguhan.
 *
 *   node uji-shelbot.mjs                       # situs live
 *   node uji-shelbot.mjs http://localhost:4174 # hasil build lokal
 */
import { chromium } from "playwright";

const ASAL =
  process.argv[2] || "https://bukhorizainun.github.io/sf-samarinda-2045";

const TANYA = [
  "berapa pemainnya",
  "berapa lama mainnya",
  "apa itu zona tematik",
  "apa itu special goal",
  "samarinda",
  "kenapa",
  "peran pemerintah tugasnya apa",
  "P01",
  "berapa biayanya",
  "apa dampaknya",
  "aksi nyata itu apa",
  "kenapa 2045",
  "siapa yang membuat permainan ini",
  "tips buat guru",
  "halo",
  "samarinda",
  "apa itu samarinda",
  "ceritakan tentang samarinda",
  "sungai mahakam",
  "kenapa 2045",
  "berapa pemainnya",
  "berapa lama mainnya",
  "umur berapa yang boleh main",
  "apa itu sdgs",
  "apa itu zona tematik",
  "apa itu special goal",
  "apa itu action evidence",
  "genai access token itu apa",
  "kenapa banjir di samarinda",
  "apa hubungan batu bara dengan kota ini",
  "siapa yang membuat permainan ini",
  "gimana cara mainnya",
  "P01",
  "kartu tentang banjir",
];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto(`${ASAL}/id/shelbot/`, { waitUntil: "networkidle" });

let gagal = 0;
for (const t of TANYA) {
  await p.fill("#tanya", t);
  await p.keyboard.press("Enter");
  await p.waitForTimeout(2000);
  const jawab = await p.locator(".rise .measure").last().innerText();
  const tidakTahu = jawab.startsWith("Itu di luar yang aku tahu");
  if (tidakTahu) gagal++;
  console.log(
    `${tidakTahu ? "✗" : "·"} ${t}\n   ${jawab.slice(0, 110).replace(/\n+/g, " | ")}`,
  );
}

console.log(`\ntidak terjawab: ${gagal} dari ${TANYA.length}`);
await b.close();
