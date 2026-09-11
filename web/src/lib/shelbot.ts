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

/** Apa yang baru saja dibicarakan, supaya pertanyaan lanjutan nyambung. */
export type Ingatan = { key?: string; kartu?: KartuRingkas[] };

type KartuRingkas = {
  code: string;
  type: string;
  title: string;
  body: string;
  zone?: string;
  cost?: string;
  risk?: string;
  action?: string;
  impact?: number[];
};

export type Jawaban = {
  teks: string;
  /** Diisi mesin, lalu dikembalikan lagi pada pertanyaan berikutnya. */
  ingatan?: Ingatan;
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
      "bagaimana", "how to play", "how do you play", "gameplay", "tahap",
      "langkah", "bermain", "playing", "rules", "aturan", "turn", "giliran",
      "works", "berjalan"],
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
    kata: ["peran", "role", "roles", "pemain", "player", "players",
      "stakeholder", "stakeholders", "karakter", "character", "siapa",
      "pemerintah", "pengusaha", "warga", "peneliti", "ilmuwan", "who plays",
      "siapa saja"],
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
    kata: ["city indicator", "city indicators", "indikator", "indicator",
      "indicators", "pilar", "lingkungan", "masyarakat", "ekonomi",
      "environment", "society", "economy", "skor", "score", "nilai", "kritis",
      "critical", "empat indikator", "four indicators"],
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
          ? ["Bagaimana cara menang?", "Apa itu zona tematik?", "Apa saja perannya?"]
          : ["How do you win?", "What are the zones?", "What are the roles?"],
      sumber: l === "id" ? "Panduan permainan, City Indicators" : "Game guide, City Indicators",
    }),
  },
  {
    key: "menang",
    kata: ["menang", "win", "winning", "kalah", "lose", "losing", "syarat",
      "condition", "conditions", "menangkan", "selesai", "akhir", "kondisi"],
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
    kata: ["komponen", "isi kotak", "component", "components", "in the box",
      "contents", "included", "kartu berapa", "token", "tokens", "papan",
      "pion", "pawn", "dadu", "dice", "berapa kartu", "perlengkapan"],
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
      "pembangunan berkelanjutan", "lestari", "development goals"],
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
      "hubungi", "cara pesan", "order", "contact", "beli di mana",
      "pesan di mana"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Permainan ini dipakai di sekolah, kampus, dan komunitas. Satu sesi penuh sekitar sembilan puluh menit dengan lima pemain, dan bisa difasilitasi guru tanpa pelatihan panjang. Untuk kelas besar, beberapa meja berjalan bersamaan lalu hasilnya dibandingkan.\n\nUntuk memesan atau bertanya lebih jauh, hubungi WhatsApp +62 812-5484-0507. Tautannya ada di halaman Kontak."
          : "The game is used in schools, universities, and community groups. A full session runs about ninety minutes with five players, and a teacher can facilitate it without lengthy training. For a large class, several tables run at once and compare outcomes.\n\nTo order or ask anything further, reach us on WhatsApp at +62 812-5484-0507. The link is on the Contact page.",
      lanjutan:
        l === "id"
          ? ["Berapa lama satu sesi?", "Perlu alat digital?", "Berapa pemainnya?"]
          : ["How long is a session?", "Do we need digital tools?", "How many players?"],
      sumber: l === "id" ? "Halaman Kontak" : "Contact page",
    }),
  },

  {
    key: "meja",
    kata: ["berapa pemain", "berapa orang", "jumlah pemain", "berapa lama",
      "durasi", "duration", "berapa menit", "berapa jam", "umur", "usia",
      "age", "kelas berapa", "cocok untuk", "berapa pemainnya",
      "how many players", "how long", "how many people", "session"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Lima pemain, satu peran untuk satu orang. Enam fase, masing-masing 15–18 menit, jadi satu sesi penuh sekitar sembilan puluh menit ditambah waktu penutup.\n\nPanduannya tidak menetapkan batas usia. Yang tertulis, permainan ini dipakai di sekolah, kampus, dan komunitas, dan bisa difasilitasi guru tanpa pelatihan panjang. Untuk kelas besar, beberapa meja berjalan bersamaan lalu hasilnya dibandingkan."
          : "Five players, one role each. Six phases at 15–18 minutes apiece, so a full session runs about ninety minutes plus a closing discussion.\n\nThe guide sets no age limit. What it does say is that the game is used in schools, universities, and community groups, and that a teacher can facilitate it without lengthy training. For a large class, several tables run at once and then compare outcomes.",
      lanjutan:
        l === "id"
          ? ["Perlu alat digital?", "Apa saja perannya?", "Bagaimana cara bermainnya?"]
          : ["Do we need digital tools?", "What are the roles?", "How does it play?"],
      sumber: l === "id" ? "Panduan permainan" : "Game guide",
    }),
  },
  {
    key: "alat",
    kata: ["alat digital", "perlu internet", "perlu hp", "perlu laptop",
      "main online", "daring", "offline", "aplikasi", "digital tools"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Tidak wajib. Permainan berjalan penuh di atas meja: papan, kartu, token, dan pembicaraan antarpemain. Situs ini menambahkan, bukan menggantikan.\n\nYang memang memakai layar cuma bagian GenAI di Fase 1 dan Fase 4, dan itu pun bisa dijalankan satu perangkat untuk satu meja."
          : "Not required. The game runs fully on the table: board, cards, tokens, and the conversation between players. This site adds to it rather than replacing it.\n\nThe only part that wants a screen is the GenAI step in Phases 1 and 4, and one device per table is enough for that.",
      lanjutan:
        l === "id"
          ? ["Apa aturan GenAI-nya?", "Berapa lama satu sesi?"]
          : ["What are the GenAI rules?", "How long is a session?"],
      sumber: l === "id" ? "Panduan permainan" : "Game guide",
    }),
  },
  {
    key: "zona",
    kata: ["zona", "zone", "zones", "tematik", "thematic", "papan", "board",
      "petak", "area", "wilayah"],
    jawab: (l) => ({
      teks:
        (l === "id"
          ? "Papan dibagi menjadi delapan zona tematik, dan tiap proyek berdiri di salah satunya:\n\n"
          : "The board is divided into eight thematic zones, and every project stands in one of them:\n\n") +
        daftar(ZONES.map((z) => t(z, l))) +
        (l === "id"
          ? "\n\nSyarat menang menuntut proyek kalian mencakup minimal dua zona, jadi bertumpu pada satu tema saja tidak cukup."
          : "\n\nWinning requires your projects to span at least two zones, so leaning on a single theme is not enough."),
      lanjutan:
        l === "id"
          ? ["Bagaimana cara menang?", "Kartu apa saja yang ada?"]
          : ["How do you win?", "What cards are there?"],
      sumber: l === "id" ? "Panduan permainan, komponen" : "Game guide, components",
    }),
  },
  {
    key: "sumberdaya",
    kata: ["sumber daya", "resource", "token", "nature", "funds", "knowledge",
      "community token", "technology", "modal", "biaya proyek"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Ada enam jenis token sumber daya yang beredar di antara pemain: Nature, Energy, Funds, Knowledge, Community, dan Technology.\n\nSetiap peran memulai dengan tiga token yang berbeda-beda, dan tiap proyek punya harga yang tertulis di kartunya. Karena tidak ada satu peran pun yang memegang semua jenis, proyek yang berarti hampir selalu menuntut patungan — dan di situlah tawar-menawarnya."
          : "Six kinds of resource token circulate between players: Nature, Energy, Funds, Knowledge, Community, and Technology.\n\nEach role starts with three of them, and every project carries a price printed on its card. Since no single role holds every kind, any project worth building usually takes pooling — and that is where the negotiation happens.",
      lanjutan:
        l === "id"
          ? ["Apa saja perannya?", "Apa itu Collaboration Token?", "Kartu proyek apa saja?"]
          : ["What are the roles?", "What is a Collaboration Token?", "What project cards are there?"],
      sumber: l === "id" ? "Panduan permainan, komponen" : "Game guide, components",
    }),
  },
  {
    key: "special-goal",
    kata: ["special goal", "tujuan khusus", "misi rahasia", "tujuan pribadi",
      "objective"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Setiap peran memegang satu Special Goal, satu kartu untuk satu pemain, lima kartu untuk lima peran. Isinya tujuan tambahan di luar tujuan bersama — misalnya memastikan setiap proyek terpilih punya indikator yang bisa diukur, atau memastikan bukti GenAI benar-benar diverifikasi.\n\nTujuan pribadi ini tidak menggantikan syarat menang bersama. Ia menambah ketegangan: kalian tetap harus lulus berempat-lima, tapi masing-masing punya kepentingan sendiri yang ingin dititipkan."
          : "Each role holds one Special Goal, one card per player, five for five roles. It sets an extra aim beyond the shared one — making sure every chosen project carries a measurable indicator, say, or that GenAI output is genuinely verified.\n\nThese private aims do not replace the shared winning conditions. They add tension: you still have to pass together, while each of you carries an interest you would like folded in.",
      lanjutan:
        l === "id"
          ? ["Bagaimana cara menang?", "Apa saja perannya?"]
          : ["How do you win?", "What are the roles?"],
      sumber: l === "id" ? "Kartu O01–O05" : "Cards O01–O05",
    }),
  },
  {
    key: "aksi-nyata",
    kata: ["aksi nyata", "action evidence", "bukti aksi", "real world",
      "real-world", "rencana aksi", "action plan", "tindak lanjut",
      "setelah main", "7 hari", "30 hari", "after the game"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Ini bagian yang membedakan permainan ini dari simulasi biasa. Di Fase 6, minimal satu proyek yang kalian bangun di atas meja harus diubah menjadi rencana aksi nyata berdurasi 7 sampai 30 hari, lengkap dengan indikator yang bisa diukur dan bukti yang bisa ditunjukkan.\n\nSepuluh kartu Action Evidence menjelaskan bentuk buktinya: data, foto, peta, atau produk. Tanpa langkah ini, syarat menang tidak terpenuhi — jadi permainannya baru selesai setelah ada yang benar-benar dikerjakan di luar meja."
          : "This is what separates the game from an ordinary simulation. In Phase 6, at least one project you built on the table has to become a real 7 to 30 day action plan, with a measurable indicator and evidence you can show.\n\nTen Action Evidence cards spell out what counts: data, photos, maps, or a product. Without this step the winning conditions are not met — so the game only ends once something is actually done away from the table.",
      lanjutan:
        l === "id"
          ? ["Bagaimana cara menang?", "Enam fasenya apa saja?"]
          : ["How do you win?", "What are the six phases?"],
      sumber: l === "id" ? "Panduan permainan, Fase 6" : "Game guide, Phase 6",
    }),
  },
  {
    key: "jenis-kartu",
    kata: ["jenis kartu", "macam kartu", "kartu apa saja", "card types",
      "card type", "berapa jenis", "isi dek", "dek", "deck", "what cards"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Deknya 184 kartu dalam sembilan jenis: 5 Peran, 5 Tujuan Khusus, 12 Skenario Samarinda, 36 Faktor Masalah, Pendorong, dan Ketidakpastian, 40 Proyek Kecil, 10 Proyek Terbuka, 24 Peluang, 18 Kejadian, 24 Prompt GenAI, dan 10 Bukti Aksi.\n\nSemuanya bisa dibaca di halaman Katalog Kartu situs ini, dan aku bisa membacakan satu per satu — sebut judulnya atau kodenya, misalnya P01."
          : "The deck holds 184 cards in nine types: 5 Role, 5 Special Goal, 12 Samarinda Scenario, 36 Problem Factor, Driver and Uncertainty, 40 Mini-Project, 10 Open Project, 24 Opportunity, 18 Event, 24 GenAI Prompt, and 10 Action Evidence.\n\nAll of them are on this site's Card Catalogue page, and I can read any of them out — name it or use its code, for instance P01.",
      lanjutan:
        l === "id"
          ? ["Kartu tentang banjir", "Apa itu Proyek Kecil?", "Apa itu Kejadian?"]
          : ["Cards about flooding", "What is a Mini-Project?", "What is an Event?"],
      sumber: l === "id" ? "Dek resmi, 184 kartu" : "Official deck, 184 cards",
    }),
  },
  {
    key: "kejadian",
    kata: ["kejadian", "event", "kartu kejadian", "kejutan", "musibah",
      "tak terduga"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Delapan belas kartu Kejadian menyela permainan dengan hal yang tidak direncanakan: hujan ekstrem, banjir besar, dan sejenisnya. Efeknya langsung menekan indikator kota.\n\nYang menarik, sebagian besar bisa ditahan. Banjir Besar menurunkan Masyarakat satu tingkat, kecuali kalian sudah punya proyek di zona Bencana atau bersedia membayar satu Collaboration Token. Jadi kartu ini sebenarnya menguji apakah kalian membangun ketahanan sebelum dibutuhkan, atau baru sibuk setelah kejadian."
          : "Eighteen Event cards interrupt play with what nobody planned for: extreme rain, a major flood, and the like. The effect lands straight on the city indicators.\n\nWhat makes them interesting is that most can be absorbed. A Major Flood costs Society one point, unless you already run a Disaster project or are willing to spend a Collaboration Token. So the card really asks whether you built resilience before it was needed, or only scrambled afterwards.",
      lanjutan:
        l === "id"
          ? ["Apa itu Collaboration Token?", "Apa itu City Indicator?"]
          : ["What is a Collaboration Token?", "What are the indicators?"],
      sumber: l === "id" ? "Kartu kejadian K01–K18" : "Event cards K01–K18",
    }),
  },
  {
    key: "kolaborasi",
    kata: ["collaboration token", "kolaborasi", "kerja sama token",
      "token kerjasama"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Ada sepuluh Collaboration Token dalam permainan. Fungsinya menandai dan membayar kerja sama: menahan sebagian kartu Kejadian, dan menopang proyek yang tidak bisa dibiayai satu peran sendirian.\n\nJumlahnya sengaja terbatas. Kerja sama di sini bukan slogan; ia sumber daya yang bisa habis, dan kalian harus memilih kapan memakainya."
          : "There are ten Collaboration Tokens in the game. They mark and pay for cooperation: absorbing some Event cards, and backing projects no single role can fund alone.\n\nThe supply is deliberately small. Cooperation here is not a slogan; it is a resource that runs out, and you have to choose when to spend it.",
      lanjutan:
        l === "id"
          ? ["Apa itu kartu Kejadian?", "Apa saja sumber dayanya?"]
          : ["What are Event cards?", "What resources are there?"],
      sumber: l === "id" ? "Panduan permainan, komponen" : "Game guide, components",
    }),
  },
  {
    key: "kota",
    kata: ["samarinda", "kaltim", "kalimantan timur", "east kalimantan",
      "ibu kota", "capital", "kota ini", "the city", "letak", "dimana",
      "where is", "geografi", "penduduk", "sejarah", "history"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Samarinda adalah ibu kota Provinsi Kalimantan Timur, dan kota ini tumbuh di kedua tepi Sungai Mahakam. Sungai, permukiman, kegiatan ekonomi, transportasi, dan sumber daya alam saling terhubung membentuk satu sistem kota — itulah yang membuatnya jadi latar permainan ini.\n\nDalam permainan, empat isunya yang dipakai: banjir, sampah dan pencemaran sungai, pertambangan beserta lubang bekasnya, dan menyusutnya ruang hijau.\n\nAku sengaja tidak menyebut angka apa pun tentang kota ini — jumlah penduduk, luas, curah hujan — karena tidak ada sumber yang bisa kurujuk di sini, dan aku tidak mau mengarang."
          : "Samarinda is the capital of East Kalimantan province, and the city grew along both banks of the Mahakam River. River, settlements, economy, transport, and natural resources connect into a single urban system — which is exactly why it works as this game's setting.\n\nThe game draws on four of its issues: flooding, waste and river pollution, mining and the pits it leaves, and shrinking green space.\n\nI deliberately quote no figures about the city — population, area, rainfall — because I have no source to point at here, and I would rather not invent one.",
      lanjutan:
        l === "id"
          ? ["Kenapa banjirnya jadi masalah?", "Apa itu Sungai Mahakam?", "Kenapa tahun 2045?"]
          : ["Why is flooding a problem?", "What about the Mahakam?", "Why 2045?"],
      sumber: l === "id" ? "Narasi web, bagian Samarinda" : "Web narrative, Samarinda section",
    }),
  },
  {
    key: "mahakam",
    kata: ["mahakam", "sungai mahakam", "mahakam river", "sungai besar",
      "the river", "ponton", "tongkang", "barge", "barges", "kapal"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Sungai Mahakam adalah sumbu kota ini. Ia jalan transportasi, sumber penghidupan, tempat tinggal, sekaligus penampung akibat dari apa pun yang terjadi di daratan.\n\nDi permainan, sungai punya zona sendiri dan muncul di banyak kartu: sampah yang terbawa arus, tongkang batu bara yang menambah risiko keselamatan sekaligus menopang ekonomi, dan permukiman tepi sungai yang paling dulu kena saat air naik. Hampir semua keputusan penting di permainan ini akhirnya menyentuh sungai."
          : "The Mahakam is this city's axis. It is a transport route, a livelihood, a place to live, and the receptacle for whatever happens on land.\n\nIn the game the river has its own zone and turns up across many cards: waste carried downstream, coal barges that raise safety risks while holding up the economy, and riverside settlements that feel rising water first. Nearly every serious decision in this game ends up touching the river.",
      lanjutan:
        l === "id"
          ? ["Kartu tentang sungai", "Apa tantangan Samarinda?"]
          : ["Cards about the river", "What challenges does Samarinda face?"],
      sumber: l === "id" ? "Kartu skenario dan zona River" : "Scenario cards and the River zone",
    }),
  },
  {
    key: "kenapa-2045",
    kata: ["kenapa 2045", "mengapa 2045", "kenapa tahun", "2045", "why 2045",
      "kenapa masa depan"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "2045 adalah satu abad kemerdekaan Indonesia, dan itu sudah lama dipakai sebagai batas cakrawala untuk perencanaan jangka panjang. Jaraknya pas: cukup jauh untuk membuat kebiasaan hari ini terlihat akibatnya, tapi cukup dekat untuk dialami sendiri oleh pemain yang sekarang duduk di kelas.\n\nItu juga yang bikin pertanyaan permainannya menggigit. Anak yang bermain hari ini akan berusia sekitar tiga puluhan pada 2045, dan tinggal di kota yang bentuknya ditentukan keputusan orang-orang sekarang."
          : "2045 marks one century of Indonesian independence, and it has long served as the horizon for long-term planning. The distance is well judged: far enough for today's habits to show their consequences, near enough that the players now sitting in a classroom will live through it.\n\nThat is what gives the question its bite. A child playing today will be in their thirties in 2045, living in a city shaped by decisions being made right now.",
      lanjutan:
        l === "id"
          ? ["Apa itu tiga masa depan?", "Apa itu keberlanjutan?"]
          : ["What are the three futures?", "What is sustainability?"],
    }),
  },
  {
    key: "merek",
    kata: ["siapa pembuat", "siapa yang membuat", "penerbit", "pengembang",
      "sf itu apa", "merek", "brand", "rdl", "studio", "who made"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Permainan ini terbit di bawah merek SF, singkatan dari Sustainable Futures, dengan semboyan Futures in Action. Samarinda 2045 adalah edisi yang sedang berjalan; kerangka permainannya dirancang supaya bisa dipindahkan ke kota lain tanpa dibangun ulang.\n\nPanduannya menyebut dirinya prototipe playtesting, jadi isinya masih mungkin berubah. Situs ini dikerjakan RDL Labs."
          : "The game appears under the SF brand, short for Sustainable Futures, with the line Futures in Action. Samarinda 2045 is the current edition; the framework is built so it can travel to another city without being rebuilt.\n\nThe guide calls itself a playtesting prototype, so its content may still change. This site was built by RDL Labs.",
      lanjutan:
        l === "id"
          ? ["Apa itu Futures in Action?", "Bagaimana cara memesannya?"]
          : ["What is Futures in Action?", "How do I order it?"],
      sumber: l === "id" ? "Panduan permainan dan identitas merek" : "Game guide and brand identity",
    }),
  },
  {
    key: "fasilitator",
    kata: ["fasilitator", "facilitator", "memfasilitasi", "facilitate",
      "cara mengajar", "teaching", "untuk guru", "for teachers", "guru",
      "teacher", "di kelas", "classroom", "persiapan", "sebelum main",
      "tips"],
    jawab: (l) => ({
      teks:
        l === "id"
          ? "Yang paling menentukan bukan hafal aturan, melainkan menjaga waktu. Enam fase masing-masing 15–18 menit, dan fase yang paling sering molor adalah Fase 2 dan Fase 4, karena di situ orang mulai berdebat serius.\n\nTiga hal yang membantu: bagikan peran secara acak supaya tidak ada yang memilih peran yang paling nyaman baginya, minta setiap keputusan dijelaskan alasannya bukan sekadar disetujui, dan sisakan waktu penutup untuk Fase 6 — bagian aksi nyata itulah yang membuat sesinya berbekas.\n\nUntuk kelas besar, jalankan beberapa meja bersamaan, lalu bandingkan masa depan yang mereka pilih."
          : "What matters most is not knowing the rules by heart but keeping time. Six phases at 15–18 minutes each, and the two that habitually overrun are Phases 2 and 4, because that is where people start arguing in earnest.\n\nThree things help: hand out roles at random so nobody picks the one they already agree with, ask for the reasoning behind each decision rather than a simple show of hands, and protect the closing time for Phase 6 — the real-action step is what makes the session stick.\n\nFor a large class, run several tables at once, then compare the futures they chose.",
      lanjutan:
        l === "id"
          ? ["Enam fasenya apa saja?", "Berapa lama satu sesi?", "Bagaimana cara menang?"]
          : ["What are the six phases?", "How long is a session?", "How do you win?"],
      sumber: l === "id" ? "Panduan permainan, catatan fasilitasi" : "Game guide, facilitation notes",
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


/** Lapisan kedua tiap topik, dibuka kalau penanya minta diperjelas. */
const PENDALAMAN: Record<string, Record<Lang, string>> = {
  fase: {
    id: "Yang sering luput: keenam fase itu satu rantai, bukan enam kegiatan terpisah. Isu sistemik di Fase 1 menentukan masa depan apa yang masuk akal disusun di Fase 2. Masa depan yang dipilih di Fase 3 membatasi proyek mana yang pantas dibiayai di Fase 4 dan 5. Dan Fase 6 menagih semuanya menjadi satu aksi berdurasi 7–30 hari.\n\nKarena itu memotong satu fase merusak fase berikutnya. Kalau waktunya sempit, panduan menyarankan mempersingkat pembahasan di dalam fase, bukan membuang fasenya.",
    en: "What usually gets missed: the six phases are one chain, not six separate activities. The systemic issue in Phase 1 decides which futures make sense in Phase 2. The future chosen in Phase 3 bounds which projects deserve funding in Phases 4 and 5. And Phase 6 collects all of it into a single 7–30 day action.\n\nSo cutting one phase damages the next. When time is short, the guide suggests shortening discussion inside a phase rather than dropping the phase.",
  },
  peran: {
    id: "Yang membuat peran ini bekerja bukan perbedaan sumber dayanya, melainkan perbedaan cara mereka menilai kata \"berhasil\". Pemerintah menimbang keadilan ruang dan layanan; Pelaku Usaha menimbang kelayakan dan lapangan kerja; Masyarakat Sungai menimbang penghidupan yang menempel pada sungai; Warga menimbang siapa yang ikut diajak bicara; Ilmuwan menimbang apakah buktinya cukup.\n\nSatu proyek yang sama bisa terlihat cerdas bagi tiga peran dan berbahaya bagi dua lainnya. Permainan tidak menyediakan jalan keluar yang memuaskan semua orang — yang disediakan cuma ruang untuk menegosiasikannya.",
    en: "What makes the roles work is not their different resources but their different readings of the word \"success\". Government weighs spatial justice and services; Business weighs feasibility and jobs; River Communities weigh livelihoods attached to the river; Residents weigh who was consulted; Scientists weigh whether the evidence holds.\n\nThe same project can look shrewd to three roles and dangerous to two. The game offers no route that satisfies everyone — only room to negotiate.",
  },
  indikator: {
    id: "Aturan kritis di bawah 3 itu yang mengubah cara orang bermain. Tanpa aturan itu, kelompok cenderung mengejar satu angka besar dan mengabaikan sisanya. Dengan aturan itu, satu indikator yang jatuh membatalkan seluruh kemenangan, sebagus apa pun yang lain.\n\nAkibatnya, keputusan yang paling menguntungkan sering kalah oleh keputusan yang paling seimbang. Itu memang maksudnya: keberlanjutan bukan soal memaksimalkan satu hal, melainkan menahan agar tidak ada yang roboh.",
    en: "The critical-below-3 rule is what changes how people play. Without it, groups chase one big number and let the rest slide. With it, a single collapsing indicator voids the whole win, however good the others look.\n\nSo the most profitable decision often loses to the most balanced one. That is the point: sustainability is not about maximising one thing but about keeping anything from falling over.",
  },
  kota: {
    id: "Yang membuat kasus Samarinda tajam adalah keempat isunya saling memberi makan. Ruang hijau yang menyusut mengurangi daerah resapan; resapan yang berkurang menambah limpasan; limpasan bertemu drainase yang tersumbat sampah; banjir yang datang justru menyebarkan sampah lebih jauh. Sementara itu, kegiatan yang menopang ekonomi kota adalah juga kegiatan yang mengubah bentang alamnya.\n\nKarena itu tidak ada satu tombol yang bisa ditekan. Setiap perbaikan menyentuh pihak yang berbeda, dan setiap pihak punya alasan yang masuk akal untuk keberatan.",
    en: "What sharpens the Samarinda case is that its four issues feed each other. Shrinking green space reduces absorption; less absorption means more runoff; runoff meets drainage blocked by waste; and the flood that follows spreads that waste further. Meanwhile the activity holding up the city's economy is the same activity reshaping its landscape.\n\nSo there is no single lever. Every improvement touches a different party, and every party has a reasonable objection.",
  },
  "masa-depan": {
    id: "Tiga skenario itu bukan pilihan ganda biasa. Expected Future sengaja disusun tanpa harapan supaya kelompok punya pembanding yang jujur; tanpa itu, setiap rencana terdengar bagus. Alternative Future menguji seberapa jauh perubahan bisa dicapai lewat keputusan yang sudah ada di tangan. Transformative Future menyentuh hal yang biasanya dianggap tidak bisa diganggu.\n\nDi Fase 3, yang menentukan bukan skenario mana yang paling indah, melainkan mana yang bisa didukung empat dari lima peran tanpa meninggalkan kerugian berat pada satu pihak.",
    en: "The three scenarios are not a multiple-choice question. The Expected Future is deliberately written without hope so the group has an honest benchmark; without it, every plan sounds good. The Alternative tests how far change reaches through decisions already within reach. The Transformative touches what is normally treated as untouchable.\n\nIn Phase 3 what decides is not which scenario reads best, but which one four of five roles can back without leaving serious harm on anyone.",
  },
  menang: {
    id: "Perhatikan bahwa keempat syaratnya tidak ada yang berupa angka tertinggi. Tidak ada \"kumpulkan skor terbanyak\". Yang diminta: cakupan minimal dua zona, dukungan lintas peran, tidak ada indikator yang roboh, dan satu aksi nyata yang benar-benar dijalankan.\n\nArtinya kelompok bisa saja menaikkan semua indikator dan tetap kalah, kalau proyeknya menumpuk di satu zona atau tidak ada yang berlanjut ke dunia nyata.",
    en: "Notice that none of the four conditions is a maximum. There is no \"score the most points\". What is asked: at least two zones covered, backing across roles, no indicator collapsing, and one real action actually carried out.\n\nWhich means a group can raise every indicator and still lose, if the projects pile into one zone or nothing carries over into the real world.",
  },
  genai: {
    id: "Alasan pembatasannya bukan teknis, melainkan pedagogis. Kalau GenAI boleh dipakai bebas, kelompok akan berhenti berdebat dan mulai menyalin. Dengan token yang harus diperoleh lewat verifikasi dan deteksi bias, memakai GenAI jadi keputusan yang ikut dipertimbangkan — persis seperti sumber daya lain di permainan ini.\n\nItu juga kenapa setiap keluaran GenAI harus dicatat sebagai diterima, direvisi, atau ditolak beserta alasannya. Yang dilatih bukan kemampuan bertanya ke mesin, melainkan kemampuan menimbang jawabannya.",
    en: "The restriction is pedagogical, not technical. Given free rein, a group stops arguing and starts copying. With tokens earned through verification and bias detection, using GenAI becomes a decision that has to be weighed — exactly like the other resources here.\n\nIt is also why every GenAI output must be recorded as accepted, revised, or rejected, with reasons. What is being trained is not the ability to ask a machine, but the ability to judge its answer.",
  },
};

/* ---------------- pencarian kartu ---------------- */

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

/** Pertanyaan pendek yang hanya masuk akal sebagai kelanjutan. */
const LANJUTAN = /^(kenapa|mengapa|kok|lalu|terus|contohnya|contoh|misalnya|jelaskan|jelasin|maksudnya|gimana|bagaimana|lebih lanjut|lebih detail|detail|apa lagi|selanjutnya|kok bisa|why|how so|explain|more|elaborate)\b/;

/** Menemukan satu peran yang disebut namanya. */
function peranDisebut(teks: string, lang: Lang): number {
  const petunjuk = [
    ["pemerintah", "government", "perencana", "planner"],
    ["usaha", "bisnis", "business", "industri", "industry", "pengusaha"],
    ["sungai", "river", "pangan", "food", "nelayan", "petani"],
    ["warga", "resident", "pemuda", "youth", "komunitas", "community"],
    ["ilmuwan", "scientist", "peneliti", "pendidik", "educator", "lingkungan"],
  ];
  void lang;
  return petunjuk.findIndex((xs) => xs.some((x) => teks.includes(x)));
}

export function tanya(
  pertanyaan: string,
  lang: Lang,
  ingatan?: Ingatan,
): Jawaban {
  const teks = bersih(pertanyaan);
  const kata = teks.split(" ").filter((w) => w.length >= 2);

  // 0b. Pertanyaan tentang kartu yang barusan dibicarakan.
  const mintaDefinisi =
    /apa itu|itu apa|artinya|what is (a|an|the)/.test(teks) &&
    !/its|nya/.test(teks);
  if (ingatan?.kartu?.length === 1 && kata.length <= 6 && !mintaDefinisi) {
    const k = ingatan.kartu[0];
    const soalBiaya = /biaya|harga|cost|butuh|perlu/.test(teks);
    const soalDampak = /dampak|impact|efek|pengaruh/.test(teks);
    const soalRisiko = /risiko|risk|bahaya/.test(teks);
    const soalAksi = /aksi|action|nyata|lapangan/.test(teks);
    if (soalBiaya || soalDampak || soalRisiko || soalAksi) {
      const bagian: string[] = [`${k.title} (${k.code})`];
      if (soalBiaya)
        bagian.push(
          k.cost
            ? `${lang === "id" ? "Biaya" : "Cost"}: ${k.cost}`
            : lang === "id"
              ? "Kartu ini tidak mencantumkan biaya."
              : "This card lists no cost.",
        );
      if (soalDampak)
        bagian.push(
          k.impact
            ? `${lang === "id" ? "Dampak" : "Impact"}: ` +
              k.impact
                .map((n, i) => `${t(INDICATORS[i].name, lang)} ${n > 0 ? `+${n}` : n}`)
                .join(", ")
            : lang === "id"
              ? "Kartu ini tidak mencantumkan dampak berupa angka."
              : "This card lists no numeric impact.",
        );
      if (soalRisiko && k.risk) bagian.push(`${lang === "id" ? "Risiko" : "Risk"}: ${k.risk}`);
      if (soalAksi && k.action)
        bagian.push(`${lang === "id" ? "Aksi nyata" : "Real-world action"}: ${k.action}`);
      return {
        teks: bagian.join("\n"),
        ingatan,
        sumber: lang === "id" ? "Dek resmi, 184 kartu" : "Official deck, 184 cards",
      };
    }
  }

  // 0c. Satu peran disebut namanya: jawab peran itu saja.
  const ip = peranDisebut(teks, lang);
  if (ip >= 0 && /peran|role|main jadi|jadi apa|tugas|kerja/.test(teks)) {
    const r = ROLES[ip];
    const kartu = SEMUA.find((c) => c.code === `R0${ip + 1}`);
    return {
      teks:
        `${t(r.name, lang)}\n${t(r.brings, lang)}` +
        (kartu ? `\n\n${kartu.body}` : ""),
      ingatan: { key: "peran" },
      lanjutan:
        lang === "id"
          ? ["Apa saja peran yang lain?", "Apa itu Special Goal?"]
          : ["What are the other roles?", "What is a Special Goal?"],
      sumber: lang === "id" ? `Kartu peran R0${ip + 1}` : `Role card R0${ip + 1}`,
    };
  }

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
        // "players" terhadap "player", "bermain" terhadap "main": tetap sah.
        else if (mirip(w, k)) nilai += k.length >= 5 ? 5 : 3;
      }
    }
    if (nilai > 0 && (!terbaik || nilai > terbaik.nilai)) terbaik = { niat, nilai };
  }

  // 0a. Pertanyaan lanjutan yang pendek: dalamkan topik sebelumnya.
  // Hanya dianggap lanjutan kalau tidak ada topik yang cocok kuat.
  if (
    LANJUTAN.test(teks) &&
    kata.length <= 5 &&
    ingatan?.key &&
    (terbaik?.nilai ?? 0) < 6
  ) {
    const dalam =
      PENDALAMAN[ingatan.key === "samarinda" ? "kota" : ingatan.key];
    return {
      teks: dalam
        ? dalam[lang]
        : lang === "id"
          ? "Untuk yang satu itu aku tidak punya lapisan yang lebih dalam — yang kutahu sudah kusampaikan tadi. Coba tanyakan sisi lainnya, atau sebut hal yang lebih khusus."
          : "On that one I have no deeper layer — what I know is what I already said. Try another side of it, or name something more specific.",
      ingatan,
      lanjutan:
        lang === "id"
          ? ["Apa saja yang bisa kutanyakan?", "Bagaimana cara menang?"]
          : ["What can I ask you?", "How do you win?"],
    };
  }

  // 2. Kartu yang cocok. Kalau lebih meyakinkan daripada niat, kartu yang menang.
  // Menyebut "kartu" atau "card" berarti memang kartu yang dicari.
  const mintaKartu = /\bkartu\b|\bcards?\b/.test(teks);
  const kartu = cariKartu(kata, pertanyaan, mintaKartu);
  const kodeDisebut = /\b[a-z]{1,3}\d{2,3}\b/.test(teks);
  // Topik menang lebih dulu; kartu tampil kalau memang kartu yang dicari.
  const nilaiKartu =
    kartu.length && (mintaKartu || kodeDisebut) ? 99 : kartu.length ? 3 : 0;

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
      ingatan: { key: "kartu", kartu },
      lanjutan:
        lang === "id"
          ? ["Apa saja jenis kartunya?", "Apa itu City Indicator?"]
          : ["What card types are there?", "What are the indicators?"],
      sumber: lang === "id" ? "Dek resmi, 184 kartu" : "Official deck, 184 cards",
    };
  }

  if (terbaik && terbaik.nilai >= 5) {
    const j = terbaik.niat.jawab(lang);
    // Topik yang punya lapisan kedua ditandai, supaya "kenapa?" bisa dijawab.
    return { ...j, ingatan: { key: terbaik.niat.key } };
  }

  // 3. Tidak ketemu. Katakan apa adanya, jangan mengarang.
  return {
    ingatan,
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
