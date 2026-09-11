import { chromium } from "playwright";
const ASAL = process.argv[2] || "https://bukhorizainun.github.io/sf-samarinda-2045";
const TANYA = [
  "hello","what is this game","how do you play","what are the six phases",
  "who are the players","tell me about the government role","what are the city indicators",
  "how do you win","what is in the box","what are the thematic zones",
  "what resources are there","what is a special goal","what is action evidence",
  "what card types are there","what are event cards","what is a collaboration token",
  "how many players","how long does a session take","is there an age limit",
  "do we need digital tools","tell me about samarinda","why is flooding a problem",
  "what about the mahakam river","why 2045","what is sustainability","what are the sdgs",
  "what are the three futures","what are the genai rules","tell me about the mini game",
  "who made this game","any tips for teachers","how do i order it",
  "cards about flooding","P01","how much does it cost","what is its impact",
  "explain more","thanks",
];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
await p.goto(`${ASAL}/en/shelbot/`, { waitUntil: "networkidle" });
let gagal = 0;
for (const t of TANYA) {
  await p.fill("#tanya", t); await p.keyboard.press("Enter"); await p.waitForTimeout(1700);
  const j = await p.locator(".rise .measure").last().innerText();
  const buruk = j.startsWith("That's outside what I know");
  if (buruk) { gagal++; console.log(`✗ ${t}`); }
}
console.log(`\nterjawab: ${TANYA.length - gagal} dari ${TANYA.length}`);
await b.close();
