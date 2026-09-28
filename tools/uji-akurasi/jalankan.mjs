/**
 * Uji akurasi Shelbot: naskah (peramban) dibandingkan dengan tiap model di Worker.
 *
 *   node tools/uji-akurasi/jalankan.mjs            # semua model yang tersedia
 *   node tools/uji-akurasi/jalankan.mjs llama-8b   # satu model saja
 *   node tools/uji-akurasi/jalankan.mjs --ulang [berkas.csv]
 *       # nilai ulang jawaban yang sudah tersimpan (tanpa memanggil model),
 *       # misalnya setelah rubrik di soal.json diperbaiki
 *
 * Tiap pertanyaan dikirim seperti di situs: jawaban naskah ikut sebagai pijakan.
 * Permintaan diberi jeda supaya tidak melewati batas 8 pertanyaan per menit.
 * Hasil: tools/uji-akurasi/hasil/akurasi-<tanggal>.md dan .csv
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const DI_SINI = dirname(fileURLToPath(import.meta.url));
const AKAR = join(DI_SINI, "../..");
const API = process.env.SHELBOT_API || "https://shelbot-plus.shelbot-plus.workers.dev";
const ASAL = "https://bukhorizainun.github.io";
const JEDA_MS = 8000;

const bank = JSON.parse(readFileSync(join(DI_SINI, "soal.json"), "utf8"));
// SOAL=a,b,c membatasi uji ke soal tertentu (hemat jatah harian).
if (process.env.SOAL) {
  const pilih = new Set(process.env.SOAL.split(","));
  bank.soal = bank.soal.filter((x) => pilih.has(x.id));
}

/* ---------- Mesin naskah: dibundel dari web/src/lib/shelbot.ts ---------- */
const BUNDEL = join(DI_SINI, ".bundel-naskah.mjs");
const WIN = process.platform === "win32";
// Di Windows npx butuh shell, jadi argumen berspasi ("AI PROJECTS") harus dikutip.
const kutip = (a) => (WIN ? `"${a}"` : a);
execFileSync(
  WIN ? "npx.cmd" : "npx",
  [
    "--yes", "esbuild", kutip(join(AKAR, "web/src/lib/shelbot.ts")),
    "--bundle", "--format=esm", "--platform=node", "--log-level=warning",
    kutip(`--alias:@=${join(AKAR, "web/src")}`), kutip(`--outfile=${BUNDEL}`),
  ],
  { stdio: "inherit", shell: WIN },
);
const { tanya } = await import(pathToFileURL(BUNDEL).href);

/* ---------- Penilaian ---------- */
const bersih = (s) =>
  String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ");

const cocok = (teks, kunci) =>
  kunci.startsWith("re:") ? new RegExp(kunci.slice(3), "i").test(teks) : teks.includes(bersih(kunci));

const PENOLAKAN = [
  "di luar", "luar cakupan", "luar lingkup", "tidak bisa membantu", "tidak dapat membantu",
  "bukan bagian", "tidak terkait", "outside", "hanya bisa membantu", "tidak tahu", "belum tahu",
  "tidak bisa menjawab", "bukan wilayah", "tidak termasuk", "ruang lingkup", "tidak ada hubungannya",
  "hanya dapat membantu", "tidak berhubungan", "luar skop",
];
const menolak = (t) => PENOLAKAN.some((k) => t.includes(k));

function nilai(soal, jawaban) {
  const t = bersih(jawaban);
  const kenaLarangan = (soal.terlarang || []).some((k) => cocok(t, k));
  if (soal.jenis === "tolak") {
    const lulus = menolak(t) && !kenaLarangan;
    return { skor: lulus ? 1 : 0, lulus, catatan: kenaLarangan ? "menjawab hal di luar lingkup" : lulus ? "" : "tidak menolak" };
  }
  if (soal.jenis === "luwes") {
    const ada = soal.kata.some((k) => cocok(t, k));
    const lulus = !menolak(t) && ada;
    return { skor: lulus ? 1 : 0, lulus, catatan: lulus ? "" : menolak(t) ? "menolak padahal masih dalam lingkup" : "tanpa kata kunci isu" };
  }
  const hilang = soal.fakta.filter((g) => !g.some((k) => cocok(t, k)));
  const skor = (soal.fakta.length - hilang.length) / soal.fakta.length;
  const lulus = hilang.length === 0 && !kenaLarangan;
  const catatan = [
    hilang.length ? `hilang: ${hilang.map((g) => g[0].replace(/^re:.*/, "(pola)")).join(", ")}` : "",
    kenaLarangan ? "memuat kalimat terlarang" : "",
  ].filter(Boolean).join("; ");
  return { skor: kenaLarangan ? 0 : skor, lulus, catatan };
}

/* ---------- Pemanggilan model ---------- */
const tidur = (ms) => new Promise((r) => setTimeout(r, ms));

async function tanyaModel(model, soal, naskah) {
  for (let coba = 0; coba < 3; coba++) {
    const mulai = Date.now();
    const r = await fetch(`${API}/chat`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: ASAL },
      body: JSON.stringify({ lang: "id", model, naskah, pesan: [{ role: "user", content: soal.tanya }] }),
    });
    if (r.status === 429) {
      await tidur(20000);
      continue;
    }
    if (!r.ok) return { teks: "", galat: `HTTP ${r.status}`, ms: Date.now() - mulai };
    const d = await r.json();
    return { teks: d.teks, ms: d.ms ?? Date.now() - mulai };
  }
  return { teks: "", galat: "batas pertanyaan", ms: 0 };
}

/** Pengurai CSV kecil: kolom berkutip, kutip ganda di dalamnya, baris baru di dalam kutip. */
function bacaCSV(teks) {
  const rows = [];
  let row = [], sel = "", kutip = false;
  for (let i = 0; i < teks.length; i++) {
    const c = teks[i];
    if (kutip) {
      if (c === '"' && teks[i + 1] === '"') { sel += '"'; i++; }
      else if (c === '"') kutip = false;
      else sel += c;
    } else if (c === '"') kutip = true;
    else if (c === ",") { row.push(sel); sel = ""; }
    else if (c === "\n") { row.push(sel); rows.push(row); row = []; sel = ""; }
    else if (c !== "\r") sel += c;
  }
  if (sel || row.length) { row.push(sel); rows.push(row); }
  return rows;
}

const keluar = join(DI_SINI, "hasil");
if (!existsSync(keluar)) mkdirSync(keluar, { recursive: true });
const ulang = process.argv[2] === "--ulang";
let otak, baris = [];

if (ulang) {
  const berkas = process.argv[3] || join(keluar, readdirSync(keluar).filter((f) => f.endsWith(".csv")).sort().at(-1));
  const [kepala, ...isi] = bacaCSV(readFileSync(berkas, "utf8").replace(/^\uFEFF/, ""));
  const k = Object.fromEntries(kepala.map((h, i) => [h, i]));
  for (const r of isi) {
    const soal = bank.soal.find((x) => x.id === r[k.soal]);
    if (!soal) continue;
    const teks = r[k.jawaban];
    const v = !teks && r[k.catatan].startsWith("HTTP") ? { skor: 0, lulus: false, catatan: r[k.catatan] } : nilai(soal, teks);
    baris.push({ soal, otak: r[k.otak], teks, ms: Number(r[k.ms]) || 0, ...v });
  }
  otak = [...new Set(baris.map((b) => b.otak))];
  console.log(`Nilai ulang ${berkas} | otak: ${otak.join(", ")}`);
} else {
const daftar = (await (await fetch(`${API}/model`, { headers: { origin: ASAL } })).json()).model.map((m) => m.id);
// "naskah" = hanya mesin naskah (tanpa memanggil model)
const pilihan = process.argv[2] === "naskah" ? [] : process.argv[2] ? [process.argv[2]] : daftar;
otak = ["naskah", ...pilihan];
console.log(`Otak diuji: ${otak.join(", ")} | ${bank.soal.length} soal`);

for (const soal of bank.soal) {
  const n = tanya(soal.tanya, "id", undefined);
  baris.push({ soal, otak: "naskah", teks: n.teks, ms: 0, ...nilai(soal, n.teks) });
  for (const m of pilihan) {
    const j = await tanyaModel(m, soal, n.teks);
    const v = j.galat ? { skor: 0, lulus: false, catatan: j.galat } : nilai(soal, j.teks);
    baris.push({ soal, otak: m, teks: j.teks, ms: j.ms, ...v });
    process.stdout.write(`${soal.id} · ${m}: ${v.lulus ? "lulus" : "gagal"}${v.catatan ? ` (${v.catatan})` : ""}\n`);
    await tidur(JEDA_MS);
  }
}
}

/* ---------- Laporan ---------- */
const tanggal = new Date().toISOString().slice(0, 10);
// Putaran sebagian diberi akhiran supaya tidak menimpa data mentah putaran lengkap.
const akhiran = !ulang && process.argv[2] ? `-${process.argv[2]}` : ulang && process.argv[3] ? "-ulang" : "";
const nama = `akurasi-${tanggal}${akhiran}`;

const persen = (x) => `${Math.round(x * 100)}%`;
const ringkas = otak.map((o) => {
  const b = baris.filter((x) => x.otak === o);
  const fakta = b.filter((x) => !x.soal.jenis);
  const tolak = b.filter((x) => x.soal.jenis === "tolak");
  const luwes = b.filter((x) => x.soal.jenis === "luwes");
  const rata = (a, f) => (a.length ? a.reduce((s, x) => s + f(x), 0) / a.length : 0);
  const berwaktu = b.filter((x) => x.ms > 0);
  return {
    o,
    fakta: rata(fakta, (x) => x.skor),
    lulusFakta: fakta.filter((x) => x.lulus).length,
    nFakta: fakta.length,
    tolak: rata(tolak, (x) => x.skor),
    luwes: rata(luwes, (x) => x.skor),
    ms: berwaktu.length ? Math.round(rata(berwaktu, (x) => x.ms)) : 0,
  };
});

let md = `# Uji akurasi Shelbot, ${tanggal}\n\n`;
md += `Bank soal: ${bank.soal.length} pertanyaan dari ${bank.sumber}.\n`;
md += `Tiap model menerima jawaban naskah sebagai pijakan, sama seperti di situs.\n\n`;
md += `${bank.cara_nilai}\n\n`;
md += `| Otak | Fakta tercakup | Soal fakta lulus penuh | Menolak soal di luar lingkup | Menjawab isu Samarinda | Rata-rata waktu |\n|---|---|---|---|---|---|\n`;
for (const r of ringkas) {
  md += `| ${r.o} | ${persen(r.fakta)} | ${r.lulusFakta}/${r.nFakta} | ${persen(r.tolak)} | ${persen(r.luwes)} | ${r.ms ? (r.ms / 1000).toFixed(1) + " s" : "di peramban"} |\n`;
}
md += `\n## Rincian per soal\n\n| Soal | ${otak.join(" | ")} |\n|---|${otak.map(() => "---").join("|")}|\n`;
for (const soal of bank.soal) {
  const sel = otak.map((o) => {
    const x = baris.find((b) => b.soal.id === soal.id && b.otak === o);
    return `${x.lulus ? "lulus" : "gagal"} ${persen(x.skor)}${x.catatan ? `<br><small>${x.catatan}</small>` : ""}`;
  });
  md += `| ${soal.id}: ${soal.tanya} | ${sel.join(" | ")} |\n`;
}
md += `\n## Jawaban lengkap\n`;
for (const soal of bank.soal) {
  md += `\n### ${soal.id}: ${soal.tanya}\n`;
  for (const o of otak) {
    const x = baris.find((b) => b.soal.id === soal.id && b.otak === o);
    md += `\n**${o}** (${x.lulus ? "lulus" : "gagal"}${x.catatan ? `, ${x.catatan}` : ""})\n\n> ${String(x.teks || "(kosong)").replace(/\n+/g, "\n> ")}\n`;
  }
}
writeFileSync(join(keluar, `${nama}.md`), md);

const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const csv = [
  "soal,kategori,otak,lulus,skor,catatan,ms,jawaban",
  ...baris.map((x) => [x.soal.id, x.soal.kategori, x.otak, x.lulus, x.skor.toFixed(2), x.catatan, x.ms, x.teks].map(esc).join(",")),
].join("\n");
if (!ulang) writeFileSync(join(keluar, `${nama}.csv`), "\uFEFF" + csv);

console.log("\nRINGKASAN");
for (const r of ringkas) {
  console.log(`${r.o.padEnd(10)} fakta ${persen(r.fakta).padStart(4)} | lulus penuh ${r.lulusFakta}/${r.nFakta} | tolak ${persen(r.tolak)} | luwes ${persen(r.luwes)} | ${r.ms} ms`);
}
console.log(`Laporan: ${join(keluar, `${nama}.md`)}`);
