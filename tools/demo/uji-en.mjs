import { chromium } from "playwright";
const ASAL = process.argv[2] || "https://bukhorizainun.github.io/sf-samarinda-2045";
const TANYA = ["hello","how do you play","who are the players","what are the city indicators",
  "how long does a game take","how many players","what is a special goal","tell me about samarinda",
  "why 2045","what is sustainability","cards about flooding","P01","how much does it cost",
  "what is the mahakam river","how do you win","who made this game","what can you do","thanks"];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
await p.goto(`${ASAL}/en/shelbot/`, { waitUntil: "networkidle" });
let gagal = 0;
for (const t of TANYA) {
  await p.fill("#tanya", t); await p.keyboard.press("Enter"); await p.waitForTimeout(1800);
  const j = await p.locator(".rise .measure").last().innerText();
  const buruk = j.startsWith("That's outside what I know");
  if (buruk) gagal++;
  console.log(`${buruk ? "✗" : "·"} ${t}\n   ${j.slice(0, 95).replace(/\n+/g, " | ")}`);
}
console.log(`\ntidak terjawab: ${gagal} dari ${TANYA.length}`);
await b.close();
