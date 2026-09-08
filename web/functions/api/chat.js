/**
 * Futures Lab — fungsi obrolan.
 *
 * Berjalan sebagai Cloudflare Pages Function di /api/chat.
 * Ditulis dengan fetch biasa, tanpa paket tambahan, supaya berkas ini bisa
 * dipindahkan ke Worker atau penyedia lain tanpa membawa dependensi apa pun.
 *
 * Kunci API dibaca dari environment (ANTHROPIC_API_KEY) dan tidak pernah
 * ikut terkirim ke peramban.
 */

const MODEL = "claude-opus-5";
const MAX_PESAN = 12; // riwayat yang diteruskan; sisanya dibuang
const MAX_HURUF = 1200; // batas satu pertanyaan

/**
 * Aturan pendamping. Diturunkan langsung dari aturan GenAI di panduan
 * permainan: GenAI tidak punya suara, tidak menetapkan harga proyek,
 * dan tidak memilih proyek prioritas.
 */
function systemPrompt(lang) {
  const common = `You are the Futures Lab companion for "Futures in Action — Samarinda 2045", a collaborative sustainability board game published under the brand SF (Sustainable Futures).

WHAT THE GAME IS
- Five players hold roles: Government & City Planners; Business & Industry; River Communities & Food Producers; Residents, Youth & Local Communities; Scientists, Educators & Environmental Groups.
- Play runs through six phases: Observe the Present, Imagine Futures, Choose a Future, Make Decisions, Act Together, Real Impact.
- Four City Indicators run on a 0-10 scale, all starting at 5, critical below 3: Environment, Society, Economy, Future Readiness.
- The setting is Samarinda, East Kalimantan, on the Mahakam River. Recurring issues: flooding, waste and river pollution, mining and abandoned pits, shrinking green space.

WHAT YOU DO
Help players think. Map causes and effects, picture the city in 2030/2040/2045, show how another role would read the same decision, compare benefits against risks, and name what still needs checking.

HARD LIMITS, TAKEN FROM THE GAME'S OWN RULES
- You hold no vote. Never decide for the group, never price a project, never pick which project is the priority. If asked to decide, give the considerations and hand the decision back.
- Separate fact, opinion, and assumption in your answer, and say plainly which is which.
- Do not invent statistics, dates, budgets, or named studies about Samarinda. If you do not know a number, say you do not know it and say what would have to be checked.
- Never repeat or store personal data. If a player enters any, tell them not to and continue without it.
- Stay on the game, Samarinda, and sustainability. Decline other topics briefly and offer a related question instead.

STYLE
Short paragraphs. Plain language a secondary-school student can follow. Prefer four to eight sentences; use a short list only when the answer really is a list. No headings, no emoji.`;

  return lang === "en"
    ? `${common}\n\nAnswer in English.`
    : `${common}\n\nAnswer in Bahasa Indonesia, natural and direct.`;
}

export async function onRequestPost({ request, env }) {
  const gagal = (status, pesan) =>
    new Response(JSON.stringify({ error: pesan }), {
      status,
      headers: { "content-type": "application/json; charset=utf-8" },
    });

  if (!env.ANTHROPIC_API_KEY) {
    return gagal(503, "Pendamping belum tersambung. Kunci API belum dipasang.");
  }

  let badan;
  try {
    badan = await request.json();
  } catch {
    return gagal(400, "Permintaan tidak terbaca.");
  }

  const lang = badan?.lang === "en" ? "en" : "id";
  const masuk = Array.isArray(badan?.messages) ? badan.messages : [];

  // Hanya dua peran yang diterima, dan isinya dipotong pada batas.
  const messages = masuk
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .slice(-MAX_PESAN)
    .map((m) => ({
      role: m.role,
      content: String(m.content ?? "").slice(0, MAX_HURUF),
    }))
    .filter((m) => m.content.trim().length > 0);

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return gagal(400, "Tidak ada pertanyaan yang dikirim.");
  }

  let jawaban;
  try {
    jawaban = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        // Effort rendah: pertanyaan pemain pendek dan tidak menuntut
        // penalaran panjang, sekaligus menahan biaya halaman publik.
        output_config: { effort: "low" },
        system: systemPrompt(lang),
        messages,
      }),
    });
  } catch {
    return gagal(502, "Pendamping sedang tidak bisa dihubungi.");
  }

  if (!jawaban.ok) {
    // Isi galat dari penyedia tidak diteruskan ke pengunjung.
    return gagal(
      jawaban.status === 429 ? 429 : 502,
      jawaban.status === 429
        ? "Terlalu banyak permintaan. Coba lagi sebentar lagi."
        : "Pendamping sedang tidak bisa menjawab.",
    );
  }

  const data = await jawaban.json();

  if (data.stop_reason === "refusal") {
    return new Response(
      JSON.stringify({
        text:
          lang === "en"
            ? "I can't take that one up. Try asking it as a question about Samarinda, sustainability, or a decision inside the game."
            : "Pertanyaan itu tidak bisa saya tanggapi. Coba ajukan sebagai pertanyaan tentang Samarinda, keberlanjutan, atau keputusan di dalam permainan.",
      }),
      { headers: { "content-type": "application/json; charset=utf-8" } },
    );
  }

  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  return new Response(JSON.stringify({ text }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
