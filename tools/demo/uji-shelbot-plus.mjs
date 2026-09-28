/**
 * Uji ujung-ke-ujung Shelbot+ tanpa Cloudflare.
 *
 * Situs disajikan dari web/out (build dengan NEXT_PUBLIC_SHELBOT_API=https://uji.lokal),
 * dan permintaan ke https://uji.lokal diteruskan ke kode Worker yang asli
 * dengan env.AI tiruan. Yang diuji: sandi salah, sandi benar, jawaban model,
 * dan jatuh kembali ke naskah bila model gagal.
 *
 *   node uji-shelbot-plus.mjs
 */
import { chromium } from "playwright";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { pathToFileURL } from "node:url";

const worker = (await import(pathToFileURL(join(import.meta.dirname, "../../shelbot-plus/src/index.js")).href)).default;
const AKAR = join(import.meta.dirname, "../../web/out");
const ASAL = "https://bukhorizainun.github.io/sf-samarinda-2045";
const JENIS = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain" };

let aiGagal = false;
let naskahTerkirim = "";
const env = {
  SANDI_FASILITATOR: "kelas-uji",
  KUNCI_TIKET: "kunci-uji-panjang-sekali",
  AI: {
    async run(model, input) {
      if (aiGagal) throw new Error("kuota habis");
      naskahTerkirim = input.messages.at(-1).content;
      return { response: "Jawaban Llama tiruan tentang tambang dan Sungai Mahakam." };
    },
  },
};

const cek = (nama, ok) => { console.log(ok ? "LULUS" : "GAGAL", nama); if (!ok) process.exitCode = 1; };

const b = await chromium.launch({ channel: "msedge" });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.route(`${ASAL}/**`, (r) => {
  let f = join(AKAR, decodeURIComponent(new URL(r.request().url()).pathname.replace("/sf-samarinda-2045", "")));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) return r.fulfill({ status: 404, body: "" });
  r.fulfill({ status: 200, body: readFileSync(f), contentType: JENIS[extname(f)] || "application/octet-stream" });
});
await ctx.route("https://uji.lokal/**", async (r) => {
  const q = r.request();
  const res = await worker.fetch(new Request(q.url(), { method: q.method(), headers: q.headers(), body: q.method() === "POST" ? q.postData() : undefined }), env);
  r.fulfill({ status: res.status, headers: Object.fromEntries(res.headers), body: await res.text() });
});

const p = await ctx.newPage();
await p.goto(`${ASAL}/id/shelbot/`, { waitUntil: "networkidle" });

const tombol = p.getByRole("button", { name: "Mode fasilitator" });
cek("tombol fasilitator tampil", await tombol.isVisible());

await tombol.click();
await p.fill("#sandi-fasilitator", "salah");
await p.getByRole("button", { name: "Nyalakan" }).click();
await p.getByRole("alert").filter({ hasText: "Kata sandi salah" }).waitFor({ timeout: 8000 });
cek("sandi salah ditolak", true);

await p.fill("#sandi-fasilitator", "kelas-uji");
await p.getByRole("button", { name: "Nyalakan" }).click();
await p.getByText("mode kelas aktif").waitFor();
cek("sandi benar → mode kelas", true);

await p.fill("#tanya", "Apa dampak tambang di Samarinda?");
await p.keyboard.press("Enter");
await p.getByText("Jawaban Llama tiruan").waitFor({ timeout: 8000 });
cek("jawaban Llama tampil", true);
cek("sumber menyebut Shelbot+", await p.getByText(/Sumber: Shelbot\+ · llama-3\.3/).isVisible());
cek("naskah ikut sebagai pijakan", naskahTerkirim.includes("[Script answer]"));

aiGagal = true;
await p.fill("#tanya", "Apa itu Fase 3?");
await p.keyboard.press("Enter");
await p.getByText("Naskah (Shelbot+ tidak menjawab)").waitFor({ timeout: 8000 });
cek("model gagal → jawaban naskah", true);

await p.reload({ waitUntil: "networkidle" });
cek("tiket bertahan setelah muat ulang", await p.getByText("mode kelas aktif").isVisible());
await p.getByRole("button", { name: "Kembali ke naskah" }).click();
cek("kembali ke naskah", await p.getByText("Berjalan di peramban kamu, tanpa server").isVisible());

await p.screenshot({ path: join(import.meta.dirname, "keluaran/shelbot-plus.png") });
await b.close();
