import cards from "@/content/cards.json";
import {
  CHALLENGES,
  COMPONENTS,
  INDICATORS,
  PHASES,
  ROLES,
  WIN_CONDITIONS,
  ZONES,
} from "@/content/site";
import { LEVELS, POIN } from "@/content/minigame";
import { t, type Lang } from "@/lib/i18n";

/* ============================================================
   Otak Shelbot.

   Berjalan seluruhnya di dalam peramban. Tidak ada server, tidak ada
   kunci API, dan tidak ada satu kalimat pun yang dikarang saat dipakai:
   jawabannya disusun dari isi permainan yang sudah ada di situs ini.

   Yang membuatnya terasa hidup bukan model bahasa, melainkan tiga hal:
   penilaian kata kunci yang memaafkan salah ketik, jawaban yang dirangkai
   dari data, dan pencarian langsung ke 184 kartu.
   ============================================================ */

export type Jawaban = {
  teks: string;
  /** Pertanyaan lanjutan yang masuk akal sesudah jawaban ini. */
  lanjutan?: string[];
  /** Dari mana isinya diambil, supaya bisa ditelusuri. */
  sumber?: string;
};

type Niat = {
  key: string;
  kata: string[];
  jawab: (lang: Lang) => Jawaban;
};

const bersih = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Kemiripan dua kata, longgar terhadap salah ketik satu-dua huruf. */
function mirip(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4) return false;
  if (a.startsWith(b) || b.startsWith(a)) return true;
  // Jarak sunting, dibatasi 1 supaya tetap murah.
  if (Math.abs(a.length - b.length) > 1) return false;
  let beda = 0;
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++beda > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return beda + (a.length - i) + (b.length - j) <= 1;
}

/** Naskah kartu berbahasa Inggris; pertanyaan datang dalam bahasa Indonesia. */
const PADANAN: Record<string, string[]> = {
  banjir: ["flood", "flooding", "drainage"],
  sungai: ["river", "riverbank", "mahakam"],
  sampah: ["waste", "rubbish", "litter"],
  tambang: ["mining", "pit", "coal"],
  batubara: ["coal"],
  hutan: ["forest", "logging"],
  pohon: ["tree", "planting"],
  hijau: ["green", "vegetation"],
  air: ["water", "rainwater"],
  udara: ["air", "pollution"],
  energi: ["energy", "power"],
  surya: ["solar"],
  matahari: ["solar"],
  angin: ["wind"],
  sekolah: ["school", "education"],
  pangan: ["food", "farming"],
  transportasi: ["transport", "mobility", "vehicle"],
  bencana: ["disaster", "risk"],
  warga: ["resident", "community"],
  pemerintah: ["government", "policy"],
  pendidikan: ["education", "learning"],
  kesehatan: ["health"],
  proyek: ["project"],
  kejadian: ["event"],
  peluang: ["opportunity"],
};

const daftar = (xs: string[]) => xs.map((x) => `• ${x}`).join("\n");

/* ---------------- yang bisa ditanyakan ---------------- */

const NIAT: Niat[] = [
  {
    key: "sapa",
    kata: ["halo", "hai", "hello", "hi", "assalamualaikum", "pagi", "siang",
      "malam", "selamat", "apa kabar"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Halo! Aku Shelbot, pemandu Futures in Action edisi Samarinda 2045. Aku bisa menjelaskan cara bermain, kelima peran, empat indikator kota, isi 184 kartu, sampai isu keberlanjutan di Samarinda. Mau mulai dari mana?"
          : "Hello! I'm Shelbot, your guide to Futures in Action, Samarinda 2045 Edition. I can explain how it plays, the five roles, the four city indicators, any of the 184 cards, and the sustainability issues behind the setting. Where would you like to start?",
      lanjutan:
        l === "id"
          ? ["Bagaimana cara bermainnya?", "Apa saja perannya?", "Apa itu City Indicator?"]
          : ["How does it play?", "What are the roles?", "What are the City Indicators?"],
    }),
  },
  {
    key: "apa-ini",
    kata: ["permainan apa", "futures in action", "board game", "permainan ini",
      "sustainable futures", "game apa", "what is this game", "boardgame"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Futures in Action adalah board game kolaboratif tentang masa depan Samarinda pada 2045. Lima pemain memegang peran yang berbeda dan menempuh enam fase bersama-sama, dari mengamati keadaan kota sampai menyepakati satu aksi nyata di dunia luar.\n\nYang membuatnya tidak mudah: setiap keputusan menekan empat indikator kota sekaligus, dan menaikkan satu indikator hampir selalu menurunkan yang lain. Kalian menang bersama-sama, atau tidak sama sekali."
          : "Futures in Action is a collaborative board game about Samarinda's future in 2045. Five players hold different roles and move through six phases together, from reading the city as it stands to committing to one real action outside the game.\n\nWhat makes it hard: every decision presses on four city indicators at once, and lifting one almost always lowers another. You win together, or not at all.",
      lanjutan:
        l === "id"
          ? ["Enam fasenya apa saja?", "Berapa lama satu sesi?", "Siapa saja pemainnya?"]
          : ["What are the six phases?", "How long is a session?", "Who plays what?"],
      sumber: l === "id" ? "Panduan permainan" : "Game guide",
    }),
  },
  {
    key: "fase",
    kata: ["fase", "phase", "cara main", "cara bermain", "alur", "urutan",
      "bagaimana", "how to play", "gameplay", "tahap", "langkah"],
    jawab: (l) => ({
      teks:
        (l === "id"
          ? "Permainan berjalan lewat enam fase, masing-masing 15–18 menit:\n\n"
          : "Play runs through six phases, 15–18 minutes each:\n\n") +
        PHASES.map(
          (p) => `${p.no}. ${t(p.name, l)} — ${t(p.output, l)}`,
        ).join("\n") +
        (l === "id"
          ? "\n\nSatu sesi penuh sekitar sembilan puluh menit."
          : "\n\nA full session runs about ninety minutes."),
      lanjutan:
        l === "id"
          ? ["Apa itu tiga masa depan?", "Bagaimana cara menang?", "Apa saja perannya?"]
          : ["What are the three futures?", "How do you win?", "What are the roles?"],
      sumber: l === "id" ? "Panduan permainan, Fase 1–6" : "Game guide, Phases 1–6",
    }),
  },
  {
    key: "peran",
    kata: ["peran", "role", "pemain", "stakeholder", "karakter", "siapa",
      "pemerintah", "pengusaha", "warga", "peneliti", "ilmuwan", "player"],
    jawab: (l) => ({
      teks:
        (l === "id"
          ? "Ada lima peran, satu peran satu pemain:\n\n"
          : "There are five roles, one player each:\n\n") +
        daftar(ROLES.map((r) => `${t(r.name, l)} — ${t(r.brings, l)}`)) +
        (l === "id"
          ? "\n\nSetiap peran punya sumber daya awal, satu Special Goal, dan satu kemampuan khusus yang cuma bisa dipakai sekali di Fase 4. Tidak ada peran yang bisa membereskan kota ini sendirian."
          : "\n\nEach role starts with its own resources, one Special Goal, and one special ability usable once in Phase 4. No role can fix the city alone."),
      lanjutan:
        l === "id"
          ? ["Apa itu Special Goal?", "Apa saja sumber dayanya?", "Bagaimana cara menang?"]
          : ["What is a Special Goal?", "What resources are there?", "How do you win?"],
      sumber: l === "id" ? "Kartu peran R01–R05" : "Role cards R01–R05",
    }),
  },
  {
    key: "indikator",
    kata: ["city indicator", "indikator", "indicator", "pilar", "lingkungan",
      "masyarakat", "ekonomi", "environment", "society", "economy", "skor",
      "nilai", "kritis", "empat indikator"],
    jawab: (l) => ({
      teks:
        (l === "id"
          ? "Empat City Indicator berjalan di skala 0–10. Semuanya mulai di 5, dan masuk keadaan kritis kalau turun di bawah 3:\n\n"
          : "Four City Indicators run on a 0–10 scale. All start at 5 and turn critical below 3:\n\n") +
        daftar(INDICATORS.map((i) => `${t(i.name, l)} — ${t(i.scope, l)}`)) +
        (l === "id"
          ? "\n\nKalau ada satu saja indikator yang berakhir di rentang 0–2, koalisi kalah, sebagus apa pun angka yang lain."
          : "\n\nIf even one indicator ends in the 0–2 range, the coalition loses, however good the others look."),
      lanjutan:
        l === "id"
          ? ["Bagaimana cara menang?", "Kartu apa yang menaikkan Lingkungan?", "Apa itu zona tematik?"]
          : ["How do you win?", "Which cards raise Environment?", "What are the zones?"],
      sumber: l === "id" ? "Panduan permainan, City Indicators" : "Game guide, City Indicators",
    }),
  },
  {
    key: "menang",
    kata: ["menang", "win", "kalah", "lose", "syarat", "menangkan", "selesai",
      "akhir", "kondisi"],
    jawab: (l) => ({
      teks:
        (l === "id"
          ? "Koalisi menang bersama-sama kalau keempat syarat ini terpenuhi:\n\n"
          : "The coalition wins together when all four conditions hold:\n\n") +
        WIN_CONDITIONS[l].map((w, i) => `${i + 1}. ${w}`).join("\n"),
      lanjutan:
        l === "id"
          ? ["Apa itu Action Evidence?", "Apa saja zona tematiknya?", "Apa itu City Indicator?"]
          : ["What is Action Evidence?", "What are the zones?", "What are the indicators?"],
      sumber: l === "id" ? "Panduan permainan, syarat menang" : "Game guide, winning conditions",
    }),
  },
  {
    key: "komponen",
    kata: ["komponen", "isi kotak", "component", "kartu berapa", "token",
      "papan", "board", "pion", "dadu", "berapa kartu", "perlengkapan"],
    jawab: (l) => ({
      teks:
        (l === "id" ? "Isi permainannya:\n\n" : "What's in the box:\n\n") +
        daftar(COMPONENTS.map((c) => `${c.count} ${t(c.label, l)}`)) +
        (l === "id" ? "\n\nDelapan zona tematik di papan: " : "\n\nEight thematic zones on the board: ") +
        ZONES.map((z) => t(z, l)).join(", ") +
        ".",
      lanjutan:
        l === "id"
          ? ["Apa saja jenis kartunya?", "Apa itu GenAI Access Token?", "Apa saja perannya?"]
          : ["What card types are there?", "What is a GenAI Access Token?", "What are the roles?"],
      sumber: l === "id" ? "Panduan permainan, komponen" : "Game guide, components",
    }),
  },
  {
    key: "masa-depan",
    kata: ["masa depan", "future", "skenario", "scenario", "expected",
      "alternative", "transformative", "2045", "bayangkan"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Di Fase 2 setiap meja menyusun tiga Samarinda sekaligus.\n\nExpected Future — kebiasaan dan kebijakan hari ini diteruskan apa adanya. Ini garis dasar untuk dibandingkan, bukan ramalan.\n\nAlternative Future — beberapa keputusan diambil berbeda, dan arah kota bergeser. Paling mudah dibayangkan, dan karena itu paling ramai diperdebatkan.\n\nTransformative Future — susunan yang selama ini dianggap tetap ikut diubah: dari mana penghidupan datang, siapa yang ikut memutuskan.\n\nDi Fase 3, satu dipilih. Sah kalau didukung minimal empat dari lima peran dan tidak ada kerugian berat yang dibiarkan."
          : "In Phase 2 every table builds three Samarindas at once.\n\nExpected Future — today's habits and policies carry on. A baseline to measure against, not a prediction.\n\nAlternative Future — a few decisions go differently and the city's direction shifts. Easiest to picture, and for that reason the most argued over.\n\nTransformative Future — what has been treated as fixed changes too: where livelihoods come from, who takes part in deciding.\n\nIn Phase 3 one is chosen. It stands with at least four of five roles behind it and no critical harm left unaddressed.",
      lanjutan:
        l === "id"
          ? ["Enam fasenya apa saja?", "Bagaimana cara menang?", "Apa tantangan Samarinda?"]
          : ["What are the six phases?", "How do you win?", "What challenges does Samarinda face?"],
      sumber: l === "id" ? "Panduan permainan, Fase 2–3" : "Game guide, Phases 2–3",
    }),
  },
  {
    key: "samarinda",
    kata: ["samarinda", "mahakam", "sungai", "banjir", "tambang", "sampah",
      "hijau", "kota", "isu", "tantangan", "masalah", "river", "flood",
      "mining", "waste", "kalimantan"],
    jawab: (l) => ({
      teks:
        (l === "id"
          ? "Samarinda tumbuh bersama Sungai Mahakam, dan permainan ini memakai empat tantangan yang benar-benar dihadapi kotanya:\n\n"
          : "Samarinda grew alongside the Mahakam, and the game uses four challenges the city actually faces:\n\n") +
        daftar(CHALLENGES.map((c) => `${t(c.name, l)} — ${t(c.body, l)}`)) +
        (l === "id"
          ? "\n\nKeempatnya saling terhubung. Satu keputusan bisa menolong satu kelompok sambil menimbulkan risiko bagi kelompok lain."
          : "\n\nAll four interlock. One decision can help one group while creating risk for another."),
      lanjutan:
        l === "id"
          ? ["Kenapa banjirnya makin parah?", "Apa itu keberlanjutan?", "Kartu apa soal sungai?"]
          : ["Why is flooding getting worse?", "What is sustainability?", "Which cards cover the river?"],
      sumber: l === "id" ? "Narasi web, bagian Samarinda" : "Web narrative, Samarinda section",
    }),
  },
  {
    key: "keberlanjutan",
    kata: ["keberlanjutan", "sustainability", "sustainable", "sdg", "sdgs",
      "pembangunan berkelanjutan", "lestari"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Keberlanjutan adalah memenuhi kebutuhan kita hari ini tanpa mempersempit kesempatan generasi berikutnya. Bukan cuma soal lingkungan: setiap keputusan juga menyangkut kehidupan masyarakat, kondisi ekonomi, dan apa yang diwariskan ke masa depan. Empat sisi itulah yang jadi empat indikator di permainan ini.\n\nSustainable Development Goals adalah 17 tujuan global yang disepakati negara-negara anggota PBB untuk 2030. Di Samarinda, tujuan itu berwujud hal sehari-hari: menjaga Mahakam, mengurangi risiko banjir, mengelola sampah, melindungi ruang hijau."
          : "Sustainability means meeting today's needs without narrowing the chances of the generation that follows. Not only the environment: every decision also touches people's lives, the economy, and what the future inherits. Those four sides are the four indicators in this game.\n\nThe Sustainable Development Goals are 17 global goals agreed by UN member states for 2030. In Samarinda they take everyday shape: protecting the Mahakam, cutting flood risk, managing waste, defending green space.",
      lanjutan:
        l === "id"
          ? ["Apa tantangan Samarinda?", "Apa itu City Indicator?", "Apa itu Futures in Action?"]
          : ["What challenges does Samarinda face?", "What are the indicators?", "What is Futures in Action?"],
      sumber: l === "id" ? "Narasi web, bagian keberlanjutan" : "Web narrative, sustainability section",
    }),
  },
  {
    key: "genai",
    kata: ["genai", "ai", "kecerdasan buatan", "chatgpt", "prompt", "token ai",
      "access token", "artificial"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Di dalam permainan, GenAI hadir sebagai teman berpikir, bukan pengambil keputusan. Dua pemakaian inti gratis: peta sistem di Fase 1 dan simulasi dampak di Fase 4. Prompt tambahan menuntut GenAI Access Token, yang diperoleh lewat verifikasi, deteksi bias, pengetahuan lokal, atau rancangan prompt yang baik.\n\nBatasnya tegas: GenAI tidak punya suara, tidak menetapkan biaya proyek, dan tidak memilih proyek prioritas. Prompt dan jawabannya harus ditampilkan terbuka, dan data pribadi tidak boleh dimasukkan.\n\nAku sendiri bukan GenAI. Aku menjawab dari isi permainan yang sudah tertulis, bukan mengarang kalimat baru."
          : "Inside the game GenAI is a thinking partner, not a decision-maker. Two core uses are free: the system map in Phase 1 and the impact simulation in Phase 4. Further prompts cost a GenAI Access Token, earned through verification, bias detection, local knowledge, or well-designed prompting.\n\nThe limits are firm: GenAI holds no vote, does not price projects, and does not pick priorities. Prompts and outputs stay in the open, and no personal data goes in.\n\nI am not GenAI myself. I answer from what is already written in the game, rather than composing new sentences.",
      lanjutan:
        l === "id"
          ? ["Kartu prompt GenAI apa saja?", "Enam fasenya apa saja?", "Kamu ini apa?"]
          : ["What GenAI prompt cards are there?", "What are the six phases?", "What are you?"],
      sumber: l === "id" ? "Panduan permainan, aturan GenAI" : "Game guide, GenAI rules",
    }),
  },
  {
    key: "mini-game",
    kata: ["mini game", "minigame", "jaga samarinda", "poin", "skor game",
      "level", "main online", "permainan web"],
    jawab: (l) => ({
      teks:
        (l === "id"
          ? `Mini game "Jaga Samarinda!" ada di situs ini, bisa dimainkan sendiri sebagai pemanasan. Tiga level, ${LEVELS.reduce((n, x) => n + x.kartu.length, 0)} kartu, diselingi pertanyaan tentang keadaan lingkungan Samarinda.\n\nJawaban benar +${POIN.benar}, salah ${POIN.salah}, dan menjawab Tantangan Samarinda dengan benar +${POIN.tantangan}. Jawaban benar beruntun memberi bonus kombo, dan sisa waktu ikut jadi poin.`
          : `The mini game "Guard Samarinda!" is on this site, playable alone as a warm-up. Three levels, ${LEVELS.reduce((n, x) => n + x.kartu.length, 0)} cards, broken up by questions about Samarinda's environment.\n\nCorrect +${POIN.benar}, wrong ${POIN.salah}, and a correct Samarinda Challenge +${POIN.tantangan}. A correct streak earns a combo bonus, and leftover time turns into points.`),
      lanjutan:
        l === "id"
          ? ["Apa itu Futures in Action?", "Apa tantangan Samarinda?"]
          : ["What is Futures in Action?", "What challenges does Samarinda face?"],
      sumber: l === "id" ? "Mini game di situs ini" : "The mini game on this site",
    }),
  },
  {
    key: "kontak",
    kata: ["beli permainan", "pesan permainan", "harga permainan", "kontak",
      "hubungi", "sekolah", "kelas", "workshop", "fasilitator", "guru",
      "cara pesan", "order", "contact"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Permainan ini dipakai di sekolah, kampus, dan komunitas. Satu sesi penuh sekitar sembilan puluh menit dengan lima pemain, dan bisa difasilitasi guru tanpa pelatihan panjang. Untuk kelas besar, beberapa meja berjalan bersamaan lalu hasilnya dibandingkan.\n\nSaluran pemesanan resminya belum dipasang di situs ini. Begitu ditetapkan, keterangannya muncul di halaman Kontak."
          : "The game is used in schools, universities, and community groups. A full session runs about ninety minutes with five players, and a teacher can facilitate it without lengthy training. For a large class, several tables run at once and compare outcomes.\n\nThe official ordering channels are not on this site yet. Once they are settled, the Contact page will carry them.",
      lanjutan:
        l === "id"
          ? ["Berapa lama satu sesi?", "Perlu alat digital?", "Berapa pemainnya?"]
          : ["How long is a session?", "Do we need digital tools?", "How many players?"],
      sumber: l === "id" ? "Halaman Kontak" : "Contact page",
    }),
  },
  {
    key: "shelbot",
    kata: ["shelbot", "kamu siapa", "kamu ini apa", "siapa kamu", "who are you",
      "what are you", "bot", "robot"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Aku Shelbot, pemandu situs ini. Aku berjalan sepenuhnya di dalam peramban kamu: tidak ada yang dikirim ke server mana pun, dan tidak ada percakapan yang disimpan.\n\nJawabanku disusun dari isi permainan — panduan resmi, naskah situs, dan 184 kartu. Kalau ada yang tidak kuketahui, aku bilang tidak tahu, bukan mengarang."
          : "I'm Shelbot, this site's guide. I run entirely inside your browser: nothing is sent to any server, and no conversation is stored.\n\nMy answers are assembled from the game itself — the official guide, the site text, and the 184 cards. When I don't know something I say so rather than invent it.",
      lanjutan:
        l === "id"
          ? ["Apa saja yang bisa kutanyakan?", "Apa itu Futures in Action?"]
          : ["What can I ask you?", "What is Futures in Action?"],
    }),
  },
  {
    key: "bisa-apa",
    kata: ["bisa apa", "bantu apa", "topik", "menu", "help", "bantuan",
      "what can you", "pertanyaan"],
    jawab: (l) => ({
      teks:
        (l === "id"
          ? "Yang bisa kujawab:\n\n"
          : "What I can answer:\n\n") +
        daftar(
          l === "id"
            ? [
                "Cara bermain dan enam fasenya",
                "Lima peran dan apa yang dibawa masing-masing",
                "Empat City Indicator dan aturan kritisnya",
                "Isi 184 kartu — sebut nama atau kodenya, misalnya P01",
                "Tantangan keberlanjutan di Samarinda",
                "Aturan pemakaian GenAI di dalam permainan",
                "Mini game di situs ini",
              ]
            : [
                "How it plays and the six phases",
                "The five roles and what each brings",
                "The four City Indicators and the critical rule",
                "Any of the 184 cards — name it or use its code, e.g. P01",
                "Samarinda's sustainability challenges",
                "The GenAI rules inside the game",
                "The mini game on this site",
              ],
        ),
      lanjutan:
        l === "id"
          ? ["Bagaimana cara bermainnya?", "Cari kartu tentang banjir", "Apa saja perannya?"]
          : ["How does it play?", "Find cards about flooding", "What are the roles?"],
    }),
  },
  {
    key: "terima-kasih",
    kata: ["terima kasih", "makasih", "thanks", "thank you", "mantap", "oke",
      "sip", "keren"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Sama-sama. Kalau ada yang mau ditanyakan lagi soal permainan atau soal Samarinda, aku di sini."
          : "Any time. If anything else about the game or about Samarinda comes up, I'm here.",
      lanjutan:
        l === "id"
          ? ["Apa saja yang bisa kutanyakan?"]
          : ["What can I ask you?"],
    }),
  },
];

/* ---------------- pencarian kartu ---------------- */

type KartuRingkas = {
  code: string;
  type: string;
  title: string;
  body: string;
  zone?: string;
  impact?: number[];
};

const SEMUA = cards as KartuRingkas[];

function cariKartu(kunci: string[], mentah: string, mintaKartu: boolean): KartuRingkas[] {
  // Kata Indonesia diterjemahkan lebih dulu, karena kartunya berbahasa Inggris.
  const diperluas = [...kunci];
  for (const k of kunci) {
    for (const [id, en] of Object.entries(PADANAN)) {
      if (k === id) diperluas.push(...en);
    }
  }
  kunci = [...new Set(diperluas)];

  // Kode kartu disebut langsung, misalnya "P01" atau "k02".
  const kode = mentah.toUpperCase().match(/\b([A-Z]{1,3}\d{2,3})\b/);
  if (kode) {
    const tepat = SEMUA.find((c) => c.code === kode[1]);
    if (tepat) return [tepat];
  }

  const nilai = SEMUA.map((c) => {
    const judul = bersih(c.title);
    const isi = bersih(c.body);
    let n = 0;
    let kenaJudul = false;
    for (const k of kunci) {
      if (k.length < 4) continue;
      if (judul.includes(k)) {
        n += 6;
        kenaJudul = true;
      } else if (isi.includes(k)) n += 2;
    }
    return { c, n, kenaJudul };
  })
    // Kena di badan kartu saja terlalu mudah kebetulan; judul yang menentukan,
    // kecuali penanya memang sedang mencari kartu.
    .filter((x) => x.kenaJudul || (mintaKartu && x.n >= 4))
    .sort((a, b) => b.n - a.n);

  return nilai.slice(0, 3).map((x) => x.c);
}

function tulisKartu(k: KartuRingkas, l: Lang): string {
  const baris = [`${k.title} (${k.code})`];
  if (k.zone) baris.push(l === "id" ? `Zona ${k.zone}` : `${k.zone} zone`);
  baris.push(k.body);
  if (k.impact) {
    const nama = INDICATORS.map((i) => t(i.name, l));
    const isi = k.impact
      .map((n, i) => `${nama[i]} ${n > 0 ? `+${n}` : n}`)
      .join(", ");
    baris.push(l === "id" ? `Dampak: ${isi}` : `Impact: ${isi}`);
  }
  return baris.join("\n");
}

/* ---------------- jawaban ---------------- */

export function tanya(pertanyaan: string, lang: Lang): Jawaban {
  const teks = bersih(pertanyaan);
  const kata = teks.split(" ").filter((w) => w.length >= 2);

  // 1. Niat yang paling cocok. Frasa dinilai lebih tinggi daripada kata lepas.
  let terbaik: { niat: Niat; nilai: number } | null = null;
  for (const niat of NIAT) {
    let nilai = 0;
    for (const k of niat.kata) {
      if (k.includes(" ")) {
        if (teks.includes(k)) nilai += 8;
        continue;
      }
      for (const w of kata) {
        if (w === k) nilai += 6;
        else if (mirip(w, k)) nilai += k.length >= 5 ? 4 : 3;
      }
    }
    if (nilai > 0 && (!terbaik || nilai > terbaik.nilai)) terbaik = { niat, nilai };
  }

  // 2. Kartu yang cocok. Kalau lebih meyakinkan daripada niat, kartu yang menang.
  // Menyebut "kartu" atau "card" berarti memang kartu yang dicari.
  const mintaKartu = /\bkartu\b|\bcard\b/.test(teks);
  const kartu = cariKartu(kata, pertanyaan, mintaKartu);
  const nilaiKartu = kartu.length
    ? (kartu.length === 1 ? 9 : 6) + (mintaKartu ? 8 : 0)
    : 0;

  if (nilaiKartu > (terbaik?.nilai ?? 0)) {
    const kepala =
      kartu.length === 1
        ? lang === "id"
          ? "Ini kartunya:"
          : "Here's the card:"
        : lang === "id"
          ? `Ada ${kartu.length} kartu yang cocok:`
          : `${kartu.length} cards match:`;
    return {
      teks: `${kepala}\n\n${kartu.map((k) => tulisKartu(k, lang)).join("\n\n")}`,
      lanjutan:
        lang === "id"
          ? ["Apa saja jenis kartunya?", "Apa itu City Indicator?"]
          : ["What card types are there?", "What are the indicators?"],
      sumber: lang === "id" ? "Dek resmi, 184 kartu" : "Official deck, 184 cards",
    };
  }

  if (terbaik && terbaik.nilai >= 5) return terbaik.niat.jawab(lang);

  // 3. Tidak ketemu. Katakan apa adanya, jangan mengarang.
  return {
    teks:
      lang === "id"
        ? "Itu di luar yang aku tahu. Aku hanya menjawab dari isi permainan ini — panduannya, naskah situs, dan 184 kartunya — dan aku memilih bilang tidak tahu daripada mengarang jawaban.\n\nCoba tanyakan soal cara bermain, peran, indikator kota, isi kartu tertentu, atau isu keberlanjutan di Samarinda."
        : "That's outside what I know. I only answer from this game — its guide, the site text, and its 184 cards — and I would rather say I don't know than invent something.\n\nTry asking about how it plays, the roles, the city indicators, a particular card, or Samarinda's sustainability issues.",
    lanjutan:
      lang === "id"
        ? ["Apa saja yang bisa kutanyakan?", "Bagaimana cara bermainnya?", "Apa tantangan Samarinda?"]
        : ["What can I ask you?", "How does it play?", "What challenges does Samarinda face?"],
  };
}
