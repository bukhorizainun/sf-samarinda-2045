import type { T, TL } from "@/lib/i18n";

/* ============================================================
   "Jaga Samarinda!" — isi mini game.
   Seluruh kartu, pertanyaan, kunci jawaban, aturan poin, dan
   ambang hasil berasal dari dokumen klien "Mini Game Interaktif".
   ============================================================ */

export type Sikap = "dukung" | "ancam";

export type Kartu = { teks: T; jawab: Sikap };

export type Level = {
  key: string;
  judul: T;
  instruksi: T;
  detik: number;
  kartu: Kartu[];
};

export type Tantangan = {
  key: string;
  pertanyaan: T;
  pilihan: T[];
  benar: number;
  umpan: T;
};

export const PEMBUKA = {
  judul: { id: "Jaga Samarinda!", en: "Guard Samarinda!" } as T,
  narasi: {
    id: "Samarinda membutuhkan bantuanmu. Pilih aktivitas dan sumber daya yang menjaga lingkungan, dan hindari yang merusaknya. Bisakah kamu menyelesaikan semua tantangan sebelum waktu habis?",
    en: "Samarinda needs your help. Pick the activities and resources that protect the environment, and avoid the ones that damage it. Can you clear every challenge before the clock runs out?",
  } as T,
  petunjuk: {
    id: "Setiap kartu muncul satu per satu. Pilih kategorinya dengan mengeklik salah satu tombol, atau tekan tombol kiri dan kanan pada papan ketik.",
    en: "Cards appear one at a time. Choose a category with the buttons, or use the left and right arrow keys.",
  } as T,
  mulai: { id: "Mulai Bermain", en: "Start Playing" } as T,
};

export const KATEGORI: Record<Sikap, T> = {
  dukung: { id: "Mendukung Keberlanjutan", en: "Supports Sustainability" },
  ancam: { id: "Mengancam Keberlanjutan", en: "Threatens Sustainability" },
};

export const UMPAN = {
  benar: {
    id: "Hebat. Pilihan ini membantu menjaga lingkungan.",
    en: "Well judged. This choice helps protect the environment.",
  } as T,
  salah: {
    id: "Coba perhatikan kembali dampaknya terhadap lingkungan.",
    en: "Look again at what this does to the environment.",
  } as T,
};

export const LEVELS: Level[] = [
  {
    key: "aktivitas",
    detik: 30,
    judul: { id: "Level 1 — Pilah Aktivitasnya", en: "Level 1 — Sort the Activities" },
    instruksi: {
      id: "Pilahkan setiap aktivitas berikut. Kamu punya waktu 30 detik.",
      en: "Sort each activity below. You have 30 seconds.",
    },
    kartu: [
      {
        jawab: "dukung",
        teks: {
          id: "Berjalan kaki untuk perjalanan dekat",
          en: "Walking for short trips",
        },
      },
      {
        jawab: "ancam",
        teks: {
          id: "Membuang sampah ke Sungai Mahakam",
          en: "Throwing rubbish into the Mahakam",
        },
      },
      {
        jawab: "dukung",
        teks: {
          id: "Menanam pohon di halaman sekolah",
          en: "Planting trees in the school yard",
        },
      },
      {
        jawab: "ancam",
        teks: { id: "Membakar sampah plastik", en: "Burning plastic waste" },
      },
      {
        jawab: "dukung",
        teks: {
          id: "Menggunakan tas belanja berulang kali",
          en: "Reusing a shopping bag",
        },
      },
      {
        jawab: "ancam",
        teks: {
          id: "Membiarkan keran air terus terbuka",
          en: "Leaving the tap running",
        },
      },
      {
        jawab: "dukung",
        teks: {
          id: "Memilah sampah sebelum dibuang",
          en: "Separating waste before throwing it out",
        },
      },
      {
        jawab: "ancam",
        teks: {
          id: "Menangkap ikan menggunakan racun",
          en: "Catching fish with poison",
        },
      },
    ],
  },
  {
    key: "sumberdaya",
    detik: 30,
    judul: { id: "Level 2 — Pilih Sumber Dayanya", en: "Level 2 — Choose the Resources" },
    instruksi: {
      id: "Mana cara pemanfaatan sumber daya yang lebih berkelanjutan?",
      en: "Which way of using a resource is the more sustainable one?",
    },
    kartu: [
      {
        jawab: "dukung",
        teks: {
          id: "Menggunakan air hujan untuk menyiram tanaman",
          en: "Using rainwater for the garden",
        },
      },
      {
        jawab: "ancam",
        teks: {
          id: "Mengambil kayu melalui penebangan liar",
          en: "Taking timber through illegal logging",
        },
      },
      {
        jawab: "dukung",
        teks: { id: "Menggunakan kembali kertas bekas", en: "Reusing scrap paper" },
      },
      {
        jawab: "ancam",
        teks: {
          id: "Membuka hutan tanpa penanaman kembali",
          en: "Clearing forest without replanting",
        },
      },
      {
        jawab: "dukung",
        teks: { id: "Menanam tanaman lokal", en: "Planting native species" },
      },
      {
        jawab: "ancam",
        teks: {
          id: "Mengambil pasir sungai secara berlebihan",
          en: "Over-extracting river sand",
        },
      },
      {
        jawab: "dukung",
        teks: {
          id: "Melakukan penghijauan lahan bekas tambang",
          en: "Revegetating an abandoned mining pit",
        },
      },
      {
        jawab: "ancam",
        teks: {
          id: "Menggunakan plastik sekali pakai setiap hari",
          en: "Using single-use plastic every day",
        },
      },
    ],
  },
  {
    key: "energi",
    detik: 20,
    judul: { id: "Level 3 — Energi Masa Depan", en: "Level 3 — Energy for the Future" },
    instruksi: {
      id: "Pilih sumber energi yang lebih baik bagi masa depan lingkungan. Waktumu 20 detik.",
      en: "Pick the energy sources that serve the environment better. You have 20 seconds.",
    },
    kartu: [
      { jawab: "dukung", teks: { id: "Energi matahari", en: "Solar power" } },
      { jawab: "ancam", teks: { id: "Batu bara", en: "Coal" } },
      { jawab: "dukung", teks: { id: "Energi angin", en: "Wind power" } },
      {
        jawab: "ancam",
        teks: {
          id: "Pembakaran bensin dan solar secara berlebihan",
          en: "Burning petrol and diesel excessively",
        },
      },
      {
        jawab: "dukung",
        teks: {
          id: "Biogas dari limbah organik yang dikelola dengan baik",
          en: "Biogas from well-managed organic waste",
        },
      },
      {
        jawab: "ancam",
        teks: {
          id: "Penggunaan bahan bakar fosil terus-menerus",
          en: "Relying on fossil fuels without pause",
        },
      },
    ],
  },
];

export const TANTANGAN: Tantangan[] = [
  {
    key: "banjir",
    benar: 0,
    pertanyaan: {
      id: "Sampah yang dibuang ke selokan memperparah masalah apa yang sering terjadi di Samarinda?",
      en: "Rubbish thrown into the drains worsens which problem Samarinda often faces?",
    },
    pilihan: [
      { id: "Banjir", en: "Flooding" },
      { id: "Gempa bumi", en: "Earthquakes" },
      { id: "Gunung meletus", en: "Volcanic eruption" },
    ],
    umpan: {
      id: "Benar. Sampah menyumbat saluran air, dan itu menaikkan risiko banjir.",
      en: "Correct. Waste blocks the drains, and that raises the flood risk.",
    },
  },
  {
    key: "tambang",
    benar: 2,
    pertanyaan: {
      id: "Sebuah lahan bekas tambang berada dekat permukiman. Tindakan mana yang paling mendukung keberlanjutan?",
      en: "An abandoned mining pit sits near a settlement. Which action best supports sustainability?",
    },
    pilihan: [
      { id: "Membiarkannya tanpa pengamanan", en: "Leaving it unsecured" },
      {
        id: "Menjadikannya tempat pembuangan sampah",
        en: "Turning it into a rubbish dump",
      },
      {
        id: "Mengamankan dan memulihkan lahan dengan tanaman lokal",
        en: "Securing it and restoring it with native plants",
      },
    ],
    umpan: {
      id: "Tepat. Lahan bekas tambang perlu diamankan dan dipulihkan untuk mengurangi risiko bagi manusia dan lingkungan.",
      en: "Right. An abandoned pit needs securing and restoring to cut the risk to people and the environment.",
    },
  },
];

/** Tantangan terakhir: memilih tiga tindakan dari enam. */
export const TANTANGAN_AKHIR = {
  skenario: {
    id: "Sekolahmu ingin mengurangi dampak buruknya terhadap lingkungan. Pilih tiga tindakan terbaik.",
    en: "Your school wants to reduce the harm it does to the environment. Choose the three best actions.",
  } as T,
  pilihan: [
    { teks: { id: "Memasang panel surya", en: "Installing solar panels" }, benar: true },
    { teks: { id: "Membuat bank sampah", en: "Starting a waste bank" }, benar: true },
    {
      teks: {
        id: "Menanam pohon dan membuat area resapan",
        en: "Planting trees and building an absorption area",
      },
      benar: true,
    },
    { teks: { id: "Membakar seluruh sampah", en: "Burning all the waste" }, benar: false },
    {
      teks: { id: "Menggunakan plastik sekali pakai", en: "Using single-use plastic" },
      benar: false,
    },
    {
      teks: {
        id: "Membiarkan lampu menyala sepanjang hari",
        en: "Leaving the lights on all day",
      },
      benar: false,
    },
  ],
  umpan: {
    id: "Sekolah yang lebih hijau dibangun dari tindakan yang berulang, bukan dari satu acara.",
    en: "A greener school is built from repeated action, not from a single event.",
  } as T,
};

/** Aturan poin, persis seperti dokumen klien. */
export const POIN = {
  benar: 100,
  salah: -25,
  komboTiap: 50, // bonus untuk setiap jawaban benar beruntun ketiga dan seterusnya
  tantangan: 200,
  bonusWaktuPerDetik: 5,
};

export type Tingkat = { min: number; gelar: T; pesan: T };

export const TINGKAT: Tingkat[] = [
  {
    min: 1600,
    gelar: { id: "Penjaga Masa Depan Samarinda", en: "Guardian of Samarinda's Future" },
    pesan: {
      id: "Kamu mengenali dengan baik pilihan mana yang mendukung keberlanjutan.",
      en: "You read clearly which choices carry sustainability.",
    },
  },
  {
    min: 1000,
    gelar: { id: "Sahabat Lingkungan", en: "Friend of the Environment" },
    pesan: {
      id: "Pilihanmu sudah baik. Terus perhatikan dampak setiap aktivitas.",
      en: "Your choices are solid. Keep watching what each activity does.",
    },
  },
  {
    min: 0,
    gelar: { id: "Pejuang Lingkungan Pemula", en: "Environmental Beginner" },
    pesan: {
      id: "Jangan menyerah. Mainkan lagi dan temukan pilihan yang lebih berkelanjutan.",
      en: "Don't give up. Play again and find the more sustainable choices.",
    },
  },
];

export const PENUTUP: T = {
  id: "Keputusan kecil bisa memberi dampak besar. Pilihanmu hari ini ikut menentukan kondisi Samarinda pada masa depan.",
  en: "Small decisions carry a long way. What you choose today helps set what Samarinda becomes.",
};

export const MG_UI = {
  waktu: { id: "Sisa waktu", en: "Time left" } as T,
  skor: { id: "Skor", en: "Score" } as T,
  kombo: { id: "Kombo", en: "Combo" } as T,
  lanjut: { id: "Lanjut", en: "Continue" } as T,
  ulang: { id: "Main Lagi", en: "Play Again" } as T,
  jawaban: { id: "Lihat Jawaban", en: "Review Answers" } as T,
  jelajah: { id: "Lanjut Menjelajahi Samarinda", en: "Keep Exploring Samarinda" } as T,
  habis: { id: "Waktu habis", en: "Time is up" } as T,
  pilihTiga: { id: "Pilih tiga", en: "Choose three" } as T,
  hasil: { id: "Hasil", en: "Result" } as T,
  benarnya: { id: "Jawaban benar", en: "Correct answer" } as T,
} satisfies Record<string, T>;

export type { T, TL };
