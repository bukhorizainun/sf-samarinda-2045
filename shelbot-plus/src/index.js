/**
 * Shelbot+ — lapis satu Shelbot.
 *
 * Cloudflare Worker terpisah dari situs. Situsnya tetap statis di GitHub
 * Pages; Worker ini hanya menjawab dua permintaan:
 *
 *   POST /sesi  { sandi }                         → { tiket, berlaku }
 *   POST /chat  { tiket, lang, pesan, naskah }    → { teks, model }
 *
 * Mode ini hanya menyala lewat kata sandi fasilitator. Sandi diperiksa di
 * sini (secret SANDI_FASILITATOR), lalu ditukar dengan tiket bertanda
 * tangan HMAC yang berumur pendek. Tanpa tiket sah, /chat menolak.
 *
 * Model: Llama di Workers AI. Jatah gratis 10.000 Neuron per hari; kalau
 * habis di paket Free, permintaan gagal dan tidak menagih. Model besar
 * dicoba lebih dulu, model kecil menjadi cadangan.
 */

const MODEL_UTAMA = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const MODEL_CADANGAN = "@cf/meta/llama-3.1-8b-instruct-fast";

const UMUR_TIKET = 4 * 60 * 60; // detik; satu sesi kelas dengan kelonggaran
const MAX_PESAN = 12; // riwayat yang diteruskan ke model
const MAX_HURUF = 1200; // satu pesan
const MAX_NASKAH = 3000; // jawaban naskah yang dijadikan pijakan

const ASAL_DIIZINKAN = [
  "https://bukhorizainun.github.io",
  "http://localhost:3000",
];

/* ---------- Aturan pendamping ----------
   Diturunkan dari aturan GenAI di panduan permainan (GenAI tidak punya
   suara, tidak menetapkan biaya, tidak memilih proyek prioritas) dan dari
   keputusan lingkup: masih dalam konteks permainan, tetapi luwes. */

function aturan(lang) {
  const umum = `You are Shelbot+, the companion of "Futures in Action — Samarinda 2045", a collaborative sustainability board game by SF (Sustainable Futures). You are used during a class session, with a facilitator in the room.

THE GAME
- Five roles: Government & City Planners; Business & Industry; River Communities & Food Producers; Residents, Youth & Local Communities; Scientists, Educators & Environmental Groups.
- Six phases: Observe the Present, Imagine Futures, Choose a Future, Make Decisions, Act Together, Real Impact.
- Phase 2 always produces three scenarios: Expected Future, Alternative Future, Transformative Future. Phase 3 picks one; it needs support from at least 4 of the 5 roles.
- Four City Indicators, scale 0-10, all start at 5, critical below 3: Environment, Society, Economy, Future Readiness.
- 184 cards, 8 thematic zones on the board. Setting: Samarinda, East Kalimantan, on the Mahakam River.

SCOPE
Stay inside the game's world, but be flexible within it. Welcome: the rules, phases, roles, cards and indicators; and the real issues the game is about — the Mahakam river, flooding, waste and river pollution, coal mining and abandoned mining pits, green space, energy, food, transport, health, education, jobs, and how a city like Samarinda could change by 2045. If a question has nothing to do with the game, Samarinda, or city sustainability (for example homework in another subject, celebrities, coding), say briefly that it is outside Shelbot's scope and suggest a related question you can help with.

HARD LIMITS, FROM THE GAME'S OWN RULES
- You hold no vote. Never decide for the group, never set the cost of a project, never choose the priority project. If asked to decide, lay out the considerations and hand the decision back to the players.
- Keep fact, opinion, and assumption apart, and say which is which.
- Do not invent statistics, dates, budgets, laws, or named studies about Samarinda. If you do not know a number, say so and say what would need to be checked.
- Do not ask for or repeat personal data.

SCRIPT REFERENCE
Each question may come with a "script answer": what the site's built-in Shelbot says, taken from the official guide and the card deck. Treat it as the authority on rules, numbers, and card contents. Do not contradict it. Build on it, explain it in your own words, and add reasoning where it helps. If it says nothing useful for the question, ignore it.

STYLE
Plain language a secondary-school student can follow. Short paragraphs, usually four to eight sentences. A short list only when the answer really is a list. No headings, no emoji, no markdown bold.`;

  return lang === "en"
    ? `${umum}\n\nAnswer in English.`
    : `${umum}\n\nAnswer in Bahasa Indonesia that is natural and direct, using "kamu".`;
}

/* ---------- Tiket bertanda tangan ---------- */

const enc = new TextEncoder();

const b64url = (bytes) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

async function kunci(env) {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(env.KUNCI_TIKET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function buatTiket(env) {
  const berlaku = Math.floor(Date.now() / 1000) + UMUR_TIKET;
  const isi = b64url(enc.encode(JSON.stringify({ exp: berlaku })));
  const tanda = await crypto.subtle.sign("HMAC", await kunci(env), enc.encode(isi));
  return { tiket: `${isi}.${b64url(tanda)}`, berlaku };
}

async function tiketSah(env, tiket) {
  if (typeof tiket !== "string" || !tiket.includes(".")) return false;
  const [isi, tanda] = tiket.split(".");
  const harap = b64url(
    await crypto.subtle.sign("HMAC", await kunci(env), enc.encode(isi)),
  );
  if (!samaPersis(harap, tanda)) return false;
  try {
    const { exp } = JSON.parse(atob(isi.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof exp === "number" && exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

/** Perbandingan yang lamanya tidak bergantung pada letak huruf yang beda. */
function samaPersis(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const x = enc.encode(a);
  const y = enc.encode(b);
  let beda = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    beda |= (x[i] ?? 0) ^ (y[i] ?? 0);
  }
  return beda === 0;
}

/* ---------- Jalur ---------- */

function kepalaCors(asal) {
  const izin = ASAL_DIIZINKAN.includes(asal) ? asal : ASAL_DIIZINKAN[0];
  return {
    "access-control-allow-origin": izin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "origin",
  };
}

export default {
  async fetch(request, env) {
    const asal = request.headers.get("origin") || "";
    const cors = kepalaCors(asal);
    const balas = (status, data) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          ...cors,
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      });

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return balas(405, { galat: "Hanya POST." });

    const { pathname } = new URL(request.url);
    let badan;
    try {
      badan = await request.json();
    } catch {
      return balas(400, { galat: "Permintaan tidak terbaca." });
    }

    if (pathname === "/sesi") {
      if (!env.SANDI_FASILITATOR || !env.KUNCI_TIKET) {
        return balas(503, { galat: "Shelbot+ belum disetel." });
      }
      if (!samaPersis(String(badan?.sandi ?? ""), env.SANDI_FASILITATOR)) {
        return balas(401, { galat: "Kata sandi salah." });
      }
      return balas(200, await buatTiket(env));
    }

    if (pathname === "/chat") {
      if (!(await tiketSah(env, badan?.tiket))) {
        return balas(401, { galat: "Sesi fasilitator tidak aktif." });
      }

      const lang = badan?.lang === "en" ? "en" : "id";
      const pesan = (Array.isArray(badan?.pesan) ? badan.pesan : [])
        .filter((m) => m && (m.role === "user" || m.role === "assistant"))
        .slice(-MAX_PESAN)
        .map((m) => ({ role: m.role, content: String(m.content ?? "").slice(0, MAX_HURUF) }))
        .filter((m) => m.content.trim());

      if (!pesan.length || pesan[pesan.length - 1].role !== "user") {
        return balas(400, { galat: "Tidak ada pertanyaan." });
      }

      // Jawaban naskah ditempelkan pada pertanyaan terakhir sebagai pijakan.
      const naskah = String(badan?.naskah ?? "").slice(0, MAX_NASKAH).trim();
      if (naskah) {
        const akhir = pesan[pesan.length - 1];
        akhir.content = `${akhir.content}\n\n[Script answer]\n${naskah}`;
      }

      const messages = [{ role: "system", content: aturan(lang) }, ...pesan];

      for (const model of [MODEL_UTAMA, MODEL_CADANGAN]) {
        try {
          const hasil = await env.AI.run(model, { messages, max_tokens: 700, temperature: 0.4 });
          const teks = String(hasil?.response ?? "").trim();
          if (teks) return balas(200, { teks, model: model.split("/").pop() });
        } catch {
          // Jatah habis atau model sibuk: coba model berikutnya.
        }
      }
      return balas(503, { galat: "Shelbot+ sedang tidak bisa menjawab." });
    }

    return balas(404, { galat: "Jalur tidak dikenal." });
  },
};
