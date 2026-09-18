import type { T, TL } from "@/lib/i18n";

/* ============================================================
   Sumber kebenaran isi situs.
   Naskah Indonesia berasal dari "Narasi Web" milik klien.
   Angka permainan berasal dari panduan resmi Futures in Action.
   Tata letak tidak pernah menyimpan teks; semuanya di berkas ini.
   ============================================================ */

export const BRAND = {
  mark: "SF",
  name: { id: "Sustainable Futures", en: "Sustainable Futures" } as T,
  tagline: { id: "Futures in Action", en: "Futures in Action" } as T,
  edition: { id: "Samarinda 2045", en: "Samarinda 2045" } as T,
  /** Baris di samping tanda pada kepala halaman. */
  headerLine: {
    id: "Sustainable Futures",
    en: "Sustainable Futures",
  } as T,
  studio: "RDL Labs",
};

/* ---------- Lapis 1: tab utama ---------- */

export type NavItem = { slug: string; label: T };

/* ---------- Jalur menghubungi ----------
   Nomor dan surat resmi dari klien, ditulis satu kali di sini supaya
   tidak ada dua nilai yang bisa berselisih. Format wa.me menuntut
   angka saja, tanpa tanda. */

export const KONTAK = {
  wa: "6281254840507",
  waTampil: "+62 812-5484-0507",
  surel: "shelbot.2026@gmail.com",
  /** Pesan yang sudah terisi saat tombol pesan ditekan. */
  pesanPesan: {
    id: "Halo, saya ingin memesan board game Futures in Action edisi Samarinda 2045.",
    en: "Hello, I would like to order the Futures in Action board game, Samarinda 2045 Edition.",
  } as T,
};

/** Alamat WhatsApp lengkap beserta pesan pembuka. */
export function tautanPesan(lang: "id" | "en") {
  return `https://wa.me/${KONTAK.wa}?text=${encodeURIComponent(
    KONTAK.pesanPesan[lang],
  )}`;
}

export const NAV: NavItem[] = [
  { slug: "", label: { id: "Beranda", en: "Home" } },
  { slug: "permainan", label: { id: "Board Game", en: "Board Game" } },
  { slug: "aturan", label: { id: "Aturan", en: "Rules" } },
  { slug: "dasbor", label: { id: "Dasbor", en: "Dashboard" } },
  { slug: "kartu", label: { id: "Katalog Kartu", en: "Card Catalogue" } },
  { slug: "samarinda", label: { id: "Samarinda", en: "Samarinda" } },
  { slug: "shelbot", label: { id: "Shelbot", en: "Shelbot" } },
  { slug: "mini-game", label: { id: "Mini Game", en: "Mini Game" } },
  { slug: "fasilitator", label: { id: "Fasilitator", en: "Facilitator" } },
  { slug: "kontak", label: { id: "Kontak", en: "Contact" } },
];

/* ---------- Empat City Indicator ---------- */

export type Indicator = {
  key: "env" | "society" | "economy" | "future";
  name: T;
  scope: T;
  color: string;
};

export const INDICATORS: Indicator[] = [
  {
    key: "env",
    color: "var(--color-env)",
    name: { id: "Lingkungan", en: "Environment" },
    scope: {
      id: "Air, udara, banjir, hutan, polusi, dan emisi.",
      en: "Water, air, flooding, forests, pollution, and emissions.",
    },
  },
  {
    key: "society",
    color: "var(--color-society)",
    name: { id: "Masyarakat", en: "Society" },
    scope: {
      id: "Kesetaraan, kesehatan, layanan, partisipasi, dan kelompok rentan.",
      en: "Equity, health, services, participation, and vulnerable groups.",
    },
  },
  {
    key: "economy",
    color: "var(--color-economy)",
    name: { id: "Ekonomi", en: "Economy" },
    scope: {
      id: "Lapangan kerja, keragaman pendapatan, dan ketergantungan batu bara.",
      en: "Jobs, income diversity, and dependence on coal.",
    },
  },
  {
    key: "future",
    color: "var(--color-future)",
    name: { id: "Masa Depan", en: "Future Readiness" },
    scope: {
      id: "Kesiapan menghadapi ketidakpastian, perencanaan jangka panjang, dan adaptasi.",
      en: "Readiness for uncertainty, long-term planning, and adaptation.",
    },
  },
];

export const INDICATOR_SCALE: T = {
  id: "Skala 0–10. Semua indikator mulai di 5, dan berada dalam keadaan kritis bila turun di bawah 3.",
  en: "A 0–10 scale. Every indicator starts at 5 and turns critical below 3.",
};

/* ---------- Beranda ---------- */

export const HOME = {
  heroKicker: {
    id: "Board game keberlanjutan · Edisi Samarinda 2045",
    en: "A sustainability board game · Samarinda 2045 Edition",
  } as T,
  heroTitle: {
    id: "Hari ini kita membuat keputusan. Pada masa depan, kita melihat dampaknya.",
    en: "We decide today. We meet the consequences later.",
  } as T,
  heroLead: {
    id: "Bagaimana kondisi Samarinda pada tahun 2045? Menjadi kota yang lebih hijau, aman, dan adil, atau justru menghadapi masalah lingkungan yang semakin rumit? Lewat permainan ini kamu menimbang empat hal yang saling tarik-menarik, dan memutuskannya bersama orang lain.",
    en: "What will Samarinda look like in 2045? A greener, safer, fairer city, or one facing steadily harder environmental problems? This game asks you to weigh four forces that pull against each other, and to decide together with other people.",
  } as T,
  ctaPrimary: { id: "Lihat cara bermain", en: "See how it plays" } as T,
  ctaSecondary: { id: "Coba Shelbot", en: "Try Shelbot" } as T,

  pillarsTitle: {
    id: "Empat indikator kota yang harus tetap seimbang",
    en: "Four city indicators that must stay in balance",
  } as T,
  pillarsLead: {
    id: "Keputusan yang menguntungkan satu indikator hampir selalu menekan indikator lain. Di situlah permainannya.",
    en: "A decision that lifts one indicator almost always presses on another. That is where the game lives.",
  } as T,

  whatTitle: { id: "Apa ini sebenarnya", en: "What this actually is" } as T,
  what: [
    {
      title: { id: "Board game fisik", en: "A physical board game" } as T,
      body: {
        id: "Lima pemain, enam fase, 184 kartu, dan papan berisi delapan zona tematik kota. Dimainkan di atas meja, bukan di layar.",
        en: "Five players, six phases, 184 cards, and a board of eight thematic city zones. Played on a table, not on a screen.",
      } as T,
    },
    {
      title: { id: "Isu nyata Samarinda", en: "Real Samarinda issues" } as T,
      body: {
        id: "Banjir, sampah dan pencemaran sungai, lubang bekas tambang, dan menyusutnya ruang hijau. Bukan latar rekaan.",
        en: "Flooding, waste and river pollution, abandoned mining pits, and shrinking green space. Not an invented setting.",
      } as T,
    },
    {
      title: {
        id: "GenAI di dalam permainan",
        en: "GenAI inside the game",
      } as T,
      body: {
        id: "Di meja, GenAI dipakai sebagai teman berpikir: memetakan sebab-akibat dan membandingkan pilihan. Pemakaiannya dijatah lewat token, dan ia tidak punya suara dalam keputusan. Shelbot di situs ini hal yang berbeda — pemandu di luar meja.",
        en: "At the table, GenAI serves as a thinking partner: mapping causes and effects, comparing options. Its use is rationed through tokens, and it holds no vote in the decision. Shelbot on this site is a different thing — a guide away from the table.",
      } as T,
    },
  ],

  closingTitle: {
    id: "Masa depan dimulai dari tindakan hari ini",
    en: "The future begins with today's action",
  } as T,
  closingBody: {
    id: "Amati. Bayangkan. Pilih. Putuskan. Berkolaborasi. Bertindak.",
    en: "Observe. Imagine. Choose. Decide. Collaborate. Act.",
  } as T,
};

/* ---------- Halaman: Tentang Permainan ---------- */

export type Phase = { no: number; name: T; time: string; output: T };

export const PHASES: Phase[] = [
  {
    no: 1,
    time: "12–15",
    name: { id: "Amati Masa Kini", en: "Observe the Present" },
    output: {
      id: "Peta sistem: memahami kondisi kota dan bagaimana masalahnya saling terkait.",
      en: "A system map: understanding the city and how its problems interlock.",
    },
  },
  {
    no: 2,
    time: "15–18",
    name: { id: "Bayangkan Masa Depan", en: "Imagine Futures" },
    output: {
      id: "Tiga skenario: Expected Future, Alternative Future, dan Transformative Future.",
      en: "Three scenarios: Expected, Alternative, and Transformative Future.",
    },
  },
  {
    no: 3,
    time: "10–12",
    name: { id: "Pilih Masa Depan", en: "Choose a Future" },
    output: {
      id: "Satu skenario dipilih. Disetujui bila didukung minimal 4 dari 5 peran, tanpa kerugian berat yang dibiarkan.",
      en: "One scenario is chosen. It passes with at least 4 of 5 roles behind it and no unaddressed critical harm.",
    },
  },
  {
    no: 4,
    time: "22–28",
    name: { id: "Ambil Keputusan", en: "Make Decisions" },
    output: {
      id: "Tindakan dipilih, risikonya ditimbang, dan dampaknya disimulasikan.",
      en: "Actions are chosen, risks weighed, and impacts simulated.",
    },
  },
  {
    no: 5,
    time: "15–18",
    name: { id: "Aksi Bersama", en: "Act Together" },
    output: {
      id: "Tiga proyek berstatus Committed, beserta peta jaringan pendukungnya.",
      en: "Three projects reach Committed status, with their network of backers mapped.",
    },
  },
  {
    no: 6,
    time: "15–18",
    name: { id: "Dampak Nyata", en: "Real Impact" },
    output: {
      id: "Profil dampak simulasi, lalu satu komitmen aksi nyata di dunia luar.",
      en: "A simulated impact profile, then one real commitment outside the game.",
    },
  },
];

export type Role = { name: T; brings: T };

export const ROLES: Role[] = [
  {
    name: { id: "Pemerintah & Perencana Kota", en: "Government & City Planners" },
    brings: {
      id: "Layanan publik, kebijakan, dan keadilan ruang.",
      en: "Public services, policy, and spatial justice.",
    },
  },
  {
    name: { id: "Pelaku Usaha & Industri", en: "Business & Industry" },
    brings: {
      id: "Investasi, lapangan kerja, teknologi, dan pertimbangan kelayakan.",
      en: "Investment, jobs, technology, and questions of feasibility.",
    },
  },
  {
    name: {
      id: "Masyarakat Sungai & Penghasil Pangan",
      en: "River Communities & Food Producers",
    },
    brings: {
      id: "Penghidupan di sungai, pangan, dan pengetahuan lokal.",
      en: "River livelihoods, food, and local knowledge.",
    },
  },
  {
    name: {
      id: "Warga, Pemuda & Komunitas",
      en: "Residents, Youth & Local Communities",
    },
    brings: {
      id: "Kebutuhan warga, partisipasi, dan tuntutan keadilan.",
      en: "Residents' needs, participation, and claims of fairness.",
    },
  },
  {
    name: {
      id: "Ilmuwan, Pendidik & Kelompok Lingkungan",
      en: "Scientists, Educators & Environmental Groups",
    },
    brings: {
      id: "Bukti, pembelajaran, dan penilaian dampak.",
      en: "Evidence, learning, and impact assessment.",
    },
  },
];

export const ROLES_NOTE: T = {
  id: "Setiap peran punya sumber daya awal, satu Special Goal, dan satu kemampuan khusus yang hanya bisa dipakai sekali di Fase 4. Tidak ada satu peran pun yang bisa menyelesaikan masalah kota sendirian.",
  en: "Each role starts with its own resources, one Special Goal, and one special ability usable once in Phase 4. No single role can solve the city alone.",
};

export type Component = { count: string; label: T };

export const COMPONENTS: Component[] = [
  { count: "184", label: { id: "kartu dalam dua belas jenis", en: "cards across twelve types" } },
  { count: "8", label: { id: "zona tematik di papan", en: "thematic zones on the board" } },
  { count: "6", label: { id: "jenis token sumber daya", en: "resource token types" } },
  { count: "5", label: { id: "pion peran", en: "role pawns" } },
  { count: "15", label: { id: "Action Token", en: "Action Tokens" } },
  { count: "10", label: { id: "Collaboration Token", en: "Collaboration Tokens" } },
  { count: "10", label: { id: "GenAI Access Token", en: "GenAI Access Tokens" } },
  { count: "4", label: { id: "jalur City Indicator", en: "City Indicator tracks" } },
];

export const ZONES: T[] = [
  { id: "Hijau", en: "Green" },
  { id: "Energi", en: "Energy" },
  { id: "Transportasi", en: "Transport" },
  { id: "Pendidikan", en: "Education" },
  { id: "Sampah", en: "Waste" },
  { id: "Bencana", en: "Disaster" },
  { id: "Sungai", en: "River" },
  { id: "Pangan", en: "Food" },
];

export const WIN_CONDITIONS: TL = {
  id: [
    "Proyek yang dibangun mencakup minimal dua zona dan membentuk strategi yang bisa dijelaskan.",
    "Minimal satu proyek didukung tiga peran atau lebih.",
    "Tidak ada indikator yang berakhir di rentang kritis 0–2.",
    "Minimal satu proyek diubah menjadi rencana aksi nyata 7–30 hari, lengkap dengan indikator dan bukti.",
  ],
  en: [
    "The projects built span at least two zones and add up to a strategy you can explain.",
    "At least one project is backed by three or more roles.",
    "No indicator ends in the critical 0–2 range.",
    "At least one project becomes a real 7–30 day action plan, with indicators and evidence.",
  ],
};

/* ---------- Halaman: Samarinda ---------- */

export const SAMARINDA_INTRO: T = {
  id: "Samarinda adalah ibu kota Provinsi Kalimantan Timur yang tumbuh bersama Sungai Mahakam. Sungai, permukiman, kegiatan ekonomi, transportasi, sumber daya alam, dan kehidupan masyarakat saling terhubung membentuk satu sistem kota. Perkembangannya membuka banyak peluang, dan pada saat yang sama menimbulkan tantangan yang menuntut kerja sama banyak pihak.",
  en: "Samarinda is the capital of East Kalimantan, a city that grew alongside the Mahakam River. River, settlements, economy, transport, natural resources, and daily life connect into a single urban system. Its growth opens opportunities and, at the same time, raises challenges that no single party can settle alone.",
};

export type Challenge = { name: T; body: T; zone: T };

export const CHALLENGES: Challenge[] = [
  {
    zone: { id: "Bencana", en: "Disaster" },
    name: { id: "Banjir", en: "Flooding" },
    body: {
      id: "Curah hujan, perubahan penggunaan lahan, berkurangnya daerah resapan, kondisi drainase, dan sampah saling berhubungan, dan bersama-sama menaikkan risiko banjir.",
      en: "Rainfall, changing land use, shrinking absorption areas, drainage conditions, and waste all connect, and together they raise flood risk.",
    },
  },
  {
    zone: { id: "Sungai", en: "River" },
    name: { id: "Sampah & Pencemaran Sungai", en: "Waste & River Pollution" },
    body: {
      id: "Sampah dan limbah menurunkan kualitas air, mengganggu ekosistem, dan memengaruhi masyarakat yang menggantungkan hidupnya pada sungai.",
      en: "Waste and effluent lower water quality, disturb the ecosystem, and affect the communities whose livelihoods depend on the river.",
    },
  },
  {
    zone: { id: "Energi", en: "Energy" },
    name: {
      id: "Pertambangan & Lubang Bekas Tambang",
      en: "Mining & Abandoned Pits",
    },
    body: {
      id: "Pertambangan menyumbang kegiatan ekonomi, tetapi juga mengubah bentang alam dan meninggalkan risiko keselamatan bila tidak dikelola dengan baik.",
      en: "Mining contributes to the economy, yet it also reshapes the landscape and leaves safety risks behind when it is poorly managed.",
    },
  },
  {
    zone: { id: "Hijau", en: "Green" },
    name: { id: "Berkurangnya Ruang Hijau", en: "Shrinking Green Space" },
    body: {
      id: "Pertumbuhan kota menekan hutan dan ruang terbuka hijau yang menyerap air, menahan suhu kota, serta menjadi habitat makhluk hidup.",
      en: "Urban growth presses on the forests and open green space that absorb water, hold down city temperatures, and house other living things.",
    },
  },
];

export const SAMARINDA_LINK: T = {
  id: "Masalah keberlanjutan tidak berdiri sendiri. Satu keputusan bisa menguntungkan satu kelompok sekaligus menimbulkan risiko bagi kelompok lain. Karena itu penyelesaiannya menuntut banyak sudut pandang, bukti yang bisa dipercaya, dan kerja sama antar-pihak.",
  en: "Sustainability problems do not stand alone. One decision can benefit one group while creating risk for another. That is why solving them takes many perspectives, evidence you can trust, and cooperation across parties.",
};

export const SAMARINDA_QUESTION: T = {
  id: "Jika kebiasaan dan kebijakan hari ini terus berlanjut, seperti apa Samarinda pada 2045? Dan masa depan seperti apa yang sebenarnya kita inginkan?",
  en: "If today's habits and policies simply continue, what does Samarinda look like in 2045? And which future do we actually want?",
};

/* ---------- Sustainability, dipakai di halaman Samarinda ---------- */

export const SUSTAINABILITY: T = {
  id: "Keberlanjutan adalah upaya memenuhi kebutuhan kita saat ini tanpa mengurangi kesempatan generasi mendatang untuk memenuhi kebutuhannya. Ia bukan hanya soal menjaga lingkungan: setiap keputusan juga menyangkut kehidupan masyarakat, kondisi ekonomi, dan akibatnya pada masa depan.",
  en: "Sustainability means meeting our needs today without narrowing the chances of the generations that follow. It is not only about protecting the environment: every decision also touches people's lives, the economy, and what the future inherits.",
};

export const SDG_NOTE: T = {
  id: "Sustainable Development Goals adalah 17 tujuan global yang disepakati negara-negara anggota PBB untuk kehidupan yang lebih adil, sejahtera, dan berkelanjutan pada 2030. Di Samarinda, tujuan itu berwujud hal-hal seperti menjaga Sungai Mahakam, mengurangi risiko banjir, mengelola sampah, melindungi ruang hijau, dan memastikan pembangunan memberi manfaat yang adil.",
  en: "The Sustainable Development Goals are 17 global goals agreed by UN member states for a fairer, more prosperous, more sustainable life by 2030. In Samarinda they take shape as protecting the Mahakam, reducing flood risk, managing waste, defending green space, and making sure development benefits people fairly.",
};

export const REFLECT_QUESTION: T = {
  id: "Apakah sebuah keputusan masih bisa disebut baik jika menguntungkan kita sekarang, tetapi menimbulkan masalah bagi generasi mendatang?",
  en: "Can a decision still be called a good one if it serves us now but leaves a problem for the generation after us?",
};

/* ---------- Halaman: Futures Lab ---------- */

export const LAB = {
  title: { id: "Shelbot", en: "Shelbot" } as T,
  lead: {
    id: "Pemandu permainan yang tinggal di dalam situs ini. Shelbot hafal enam fase, kelima peran, empat indikator kota, dan seluruh 184 kartu. Tanya cara bermain, cari kartu tertentu, atau tanyakan isu keberlanjutan di Samarinda. Semuanya berjalan di peramban kamu, tanpa mengirim apa pun ke server.",
    en: "A game guide that lives inside this site. Shelbot knows the six phases, the five roles, the four city indicators, and all 184 cards. Ask how it plays, look up a card, or ask about Samarinda's sustainability issues. It all runs in your browser, with nothing sent to a server.",
  } as T,
  catatanMeja: {
    id: "Shelbot pemandu di luar meja — untuk belajar sebelum bermain dan menengok kembali sesudahnya. Selama sesi berlangsung, yang berlaku tetap aturan permainan: pemakaian GenAI dijatah lewat GenAI Access Token, dan keputusan tetap milik kelima peran.",
    en: "Shelbot guides away from the table — for learning before a session and looking back after one. During play the game's own rules stand: GenAI use is rationed through GenAI Access Tokens, and the decision belongs to the five roles.",
  } as T,
  limitsTitle: {
    id: "Batas yang dipegang Shelbot",
    en: "The limits Shelbot keeps",
  } as T,
  limits: {
    id: [
      "Jawabannya diambil dari panduan resmi, naskah situs, dan 184 kartu. Bukan karangan baru.",
      "Shelbot tidak punya suara di meja. Ia tidak menetapkan biaya proyek dan tidak memilih prioritas.",
      "Kalau pertanyaannya di luar isi permainan, ia bilang tidak tahu.",
      "Percakapan berjalan di peramban kamu. Tidak ada yang dikirim atau disimpan di server.",
      "Untuk pemakaian GenAI di dalam permainan, aturannya terpisah dan tertulis di panduan.",
    ],
    en: [
      "Answers come from the official guide, the site text, and the 184 cards. Nothing is invented.",
      "Shelbot holds no vote at the table. It does not price projects and does not pick priorities.",
      "When a question falls outside the game, it says it does not know.",
      "The conversation runs in your browser. Nothing is sent to or stored on a server.",
      "GenAI use inside the game is a separate matter, with its own rules in the guide.",
    ],
  } as TL,
  starters: {
    id: [
      "Bagaimana cara bermainnya?",
      "Apa saja perannya?",
      "Cari kartu tentang banjir",
    ],
    en: [
      "How does it play?",
      "What are the roles?",
      "Find cards about flooding",
    ],
  } as TL,
  placeholder: {
    id: "Tanya cara bermain, nama kartu, atau isu Samarinda…",
    en: "Ask about the rules, a card, or Samarinda…",
  } as T,
  disclaimer: {
    id: "Shelbot menjawab dari isi permainan yang sudah tertulis, bukan mengarang kalimat baru. Kalau pertanyaannya di luar itu, ia akan bilang tidak tahu. Keputusan di meja tetap milik kamu dan kelompokmu.",
    en: "Shelbot answers from what the game already says rather than composing new claims. Outside that, it will tell you it does not know. Decisions at the table stay with you and your group.",
  } as T,
};

/* ---------- Umum ---------- */

export const UI = {
  skip: { id: "Lompat ke isi", en: "Skip to content" } as T,
  menu: { id: "Menu", en: "Menu" } as T,
  close: { id: "Tutup", en: "Close" } as T,
  theme: { id: "Ganti tampilan terang atau gelap", en: "Toggle light or dark" } as T,
  back: { id: "Kembali", en: "Back" } as T,
  wip: {
    id: "Halaman ini sedang dikerjakan.",
    en: "This page is still being built.",
  } as T,
  prototypeNote: {
    id: "Futures in Action masih berstatus prototipe playtesting. Isi dan aturannya bisa berubah.",
    en: "Futures in Action is still a playtesting prototype. Its content and rules may change.",
  } as T,
};

/* ---------- Tiga masa depan (Fase 2) ----------
   Nama ketiganya milik panduan permainan dan selalu sama.
   Keterangannya menjelaskan apa arti tiap jenis skenario di dalam
   permainan, bukan ramalan tentang Samarinda. */

export type MasaDepan = {
  key: "expected" | "alternative" | "transformative";
  nama: T;
  label: T;
  ringkas: T;
  isi: T;
  warna: string;
};

export const FUTURES: MasaDepan[] = [
  {
    key: "expected",
    warna: "var(--color-economy)",
    nama: { id: "Expected Future", en: "Expected Future" },
    label: { id: "Yang sudah berjalan", en: "The road we are on" },
    ringkas: {
      id: "Kebiasaan dan kebijakan hari ini diteruskan apa adanya.",
      en: "Today's habits and policies simply carry on.",
    },
    isi: {
      id: "Skenario pertama menahan diri untuk tidak berharap. Pemain menuliskan ke mana kota ini sampai bila tidak ada yang berubah: tekanan yang sudah ada berlanjut, dan keputusan yang ditunda tetap ditunda. Gunanya bukan menakuti, melainkan menetapkan garis dasar untuk dibandingkan.",
      en: "The first scenario refuses to hope. Players write down where the city arrives if nothing changes: existing pressures continue, and postponed decisions stay postponed. Its purpose is not to frighten but to set the baseline everything else is measured against.",
    },
  },
  {
    key: "alternative",
    warna: "var(--color-future)",
    nama: { id: "Alternative Future", en: "Alternative Future" },
    label: { id: "Yang bisa dibelokkan", en: "The turn that is available" },
    ringkas: {
      id: "Beberapa keputusan diambil berbeda, dan arahnya bergeser.",
      en: "A few decisions go differently, and the direction shifts.",
    },
    isi: {
      id: "Skenario kedua mengubah sebagian pilihan, bukan seluruh sistemnya. Yang diuji di sini sederhana: keputusan mana yang paling banyak menggeser keadaan bila diambil lebih awal, dan siapa yang menanggung akibatnya. Kebanyakan kelompok menemukan masa depan ini paling mudah dibayangkan, dan justru karena itu paling mudah diperdebatkan.",
      en: "The second scenario changes some choices, not the whole system. What it tests is simple: which decisions move the most if taken earlier, and who carries the consequences. Most groups find this future the easiest to picture, and for that reason the easiest to argue about.",
    },
  },
  {
    key: "transformative",
    warna: "var(--color-env)",
    nama: { id: "Transformative Future", en: "Transformative Future" },
    label: { id: "Yang menuntut susunan baru", en: "The one that asks for a new arrangement" },
    ringkas: {
      id: "Cara kota bekerja diatur ulang, bukan diperbaiki sedikit-sedikit.",
      en: "The way the city works is rearranged, not patched.",
    },
    isi: {
      id: "Skenario ketiga menyentuh susunan yang selama ini dianggap tetap: dari mana penghidupan datang, siapa yang ikut memutuskan, dan apa yang dianggap wajar. Masa depan ini paling menjanjikan sekaligus paling mahal untuk disepakati, karena menuntut lebih banyak pihak melepaskan sesuatu.",
      en: "The third scenario touches what has been treated as fixed: where livelihoods come from, who takes part in deciding, and what counts as normal. It promises the most and costs the most to agree on, because it asks more parties to give something up.",
    },
  },
];

export const FUTURES_NOTE: T = {
  id: "Di Fase 3, satu dari ketiganya dipilih. Pilihan itu hanya sah bila didukung minimal empat dari lima peran, dan tidak ada kerugian berat yang dibiarkan tanpa penanganan.",
  en: "In Phase 3, one of the three is chosen. The choice only stands with at least four of the five roles behind it, and no critical harm left unaddressed.",
};
