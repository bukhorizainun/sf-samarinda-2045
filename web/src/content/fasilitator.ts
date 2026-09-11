import type { T, TL } from "@/lib/i18n";

/* ============================================================
   Halaman fasilitator.

   Untuk guru atau siapa pun yang membawakan sesi. Seluruh angka dan aturan
   di sini dikutip dari panduan permainan; tidak ada yang ditambahkan.
   ============================================================ */

export type Langkah = { waktu: T; judul: T; isi: T };

export const FASIL = {
  lead: {
    id: "Membawakan sesi ini tidak menuntut hafal aturan. Yang menentukan cuma dua hal: menjaga waktu, dan menjaga supaya setiap keputusan dijelaskan alasannya. Halaman ini dibuat untuk dibuka sambil sesi berjalan.",
    en: "Running a session does not take memorising the rules. Two things decide how it goes: keeping time, and making sure every decision comes with its reasoning. This page is meant to stay open while you facilitate.",
  } as T,

  siapkanJudul: { id: "Sebelum mulai", en: "Before you start" } as T,
  siapkan: {
    id: [
      "Bagikan peran secara acak. Kalau pemain memilih sendiri, sebagian besar mengambil peran yang sudah mereka setujui, dan perdebatannya hilang.",
      "Pastikan keempat jalur indikator mulai di angka 5, dan tunjukkan rentang kritis 0–2 sejak awal supaya pemain tahu apa yang sedang mereka jaga.",
      "Satu perangkat per meja sudah cukup untuk bagian GenAI. Tidak perlu satu ponsel per anak.",
      "Sediakan kertas untuk mencatat alasan tiap keputusan. Bagian ini paling sering terlewat, dan paling berguna saat penutup.",
      "Untuk kelas besar, jalankan beberapa meja bersamaan. Perbandingan antarmeja di akhir biasanya lebih berkesan daripada permainannya sendiri.",
    ],
    en: [
      "Hand out roles at random. Left to choose, most players take the role they already agree with, and the argument disappears.",
      "Check that all four indicator tracks start at 5, and point out the critical 0–2 range early so players know what they are protecting.",
      "One device per table is enough for the GenAI steps. You do not need a phone per child.",
      "Have paper ready for the reasoning behind each decision. This step is the most often skipped, and the most useful at the close.",
      "For a large class, run several tables at once. Comparing tables at the end usually lands harder than the game itself.",
    ],
  } as TL,

  jalanJudul: { id: "Menjaga waktu", en: "Keeping time" } as T,
  jalan: [
    {
      waktu: { id: "15–18 menit", en: "15–18 min" },
      judul: { id: "Amati Masa Kini", en: "Observe the Present" },
      isi: {
        id: "Tujuannya peta sistem, bukan daftar masalah. Kalau kelompok mulai mengusulkan solusi, ingatkan bahwa fase ini hanya untuk melihat kaitan.",
        en: "The aim is a system map, not a list of problems. When a group starts proposing solutions, remind them this phase is only for seeing connections.",
      },
    },
    {
      waktu: { id: "15–18 menit", en: "15–18 min" },
      judul: { id: "Bayangkan Masa Depan", en: "Imagine Futures" },
      isi: {
        id: "Fase yang paling sering molor. Tiga skenario harus jadi, jadi beri batas waktu per skenario, dan jangan biarkan Expected Future dilewati — tanpa garis dasar, semua rencana terdengar bagus.",
        en: "The phase that habitually overruns. Three scenarios have to exist, so cap the time per scenario, and do not let the Expected Future be skipped — without a baseline, every plan sounds good.",
      },
    },
    {
      waktu: { id: "15–18 menit", en: "15–18 min" },
      judul: { id: "Pilih Masa Depan", en: "Choose a Future" },
      isi: {
        id: "Pilihan sah bila didukung minimal empat dari lima peran dan tidak ada kerugian berat yang dibiarkan. Kalau baru tiga peran yang setuju, itu bukan kebuntuan — itu permainannya sedang bekerja.",
        en: "A choice stands with at least four of five roles behind it and no critical harm left unaddressed. Three roles in favour is not a deadlock — it is the game working.",
      },
    },
    {
      waktu: { id: "15–18 menit", en: "15–18 min" },
      judul: { id: "Ambil Keputusan", en: "Make Decisions" },
      isi: {
        id: "Fase kedua yang sering molor, karena tawar-menawar sumber daya dimulai di sini. Tiap peran punya satu kemampuan khusus yang hanya bisa dipakai sekali, dan hanya di fase ini.",
        en: "The second phase that tends to overrun, because resource bargaining begins here. Each role has one special ability, usable once, and only in this phase.",
      },
    },
    {
      waktu: { id: "15–18 menit", en: "15–18 min" },
      judul: { id: "Aksi Bersama", en: "Act Together" },
      isi: {
        id: "Targetnya tiga proyek berstatus Committed. Perhatikan sebarannya: syarat menang menuntut minimal dua zona, jadi kelompok yang menumpuk di satu tema perlu diingatkan lebih awal.",
        en: "The target is three projects reaching Committed. Watch the spread: winning takes at least two zones, so a group piling into one theme needs an early nudge.",
      },
    },
    {
      waktu: { id: "15–18 menit", en: "15–18 min" },
      judul: { id: "Dampak Nyata", en: "Real Impact" },
      isi: {
        id: "Jangan dikorbankan saat waktu menipis. Di sinilah satu proyek berubah jadi rencana aksi 7–30 hari lengkap dengan indikator dan bukti, dan bagian inilah yang membuat sesinya berbekas.",
        en: "Do not sacrifice this when time runs short. Here one project becomes a 7–30 day action plan with an indicator and evidence, and this is the part that makes the session stick.",
      },
    },
  ] as Langkah[],

  periksaJudul: { id: "Lembar validasi", en: "Validation sheet" } as T,
  periksaLead: {
    id: "Dipakai di akhir sesi. Koalisi menang bila kelimanya terpenuhi.",
    en: "Use this at the close. The coalition wins when all five hold.",
  } as T,
  periksa: {
    id: [
      "Proyek yang dibangun mencakup minimal dua zona tematik.",
      "Minimal satu proyek didukung tiga peran atau lebih.",
      "Tidak ada indikator yang berakhir di rentang kritis 0–2.",
      "Minimal satu proyek jadi rencana aksi nyata 7–30 hari, dengan indikator yang bisa diukur dan bukti yang bisa ditunjukkan.",
      "Setiap keluaran GenAI dicatat sebagai diterima, direvisi, atau ditolak, beserta alasannya.",
    ],
    en: [
      "The projects built span at least two thematic zones.",
      "At least one project is backed by three or more roles.",
      "No indicator ends in the critical 0–2 range.",
      "At least one project becomes a real 7–30 day action plan, with a measurable indicator and evidence you can show.",
      "Every GenAI output is recorded as accepted, revised, or rejected, with reasons.",
    ],
  } as TL,

  genaiJudul: { id: "Aturan GenAI di meja", en: "GenAI rules at the table" } as T,
  genai: {
    id: [
      "Dua pemakaian inti gratis: peta sistem di Fase 1 dan simulasi dampak di Fase 4.",
      "Prompt tambahan menuntut GenAI Access Token, yang diperoleh lewat verifikasi, deteksi bias, pengetahuan lokal, atau rancangan prompt yang baik.",
      "GenAI tidak punya suara, tidak menetapkan biaya proyek, dan tidak memilih proyek prioritas.",
      "Prompt dan jawabannya ditampilkan terbuka lalu dibahas bersama. Data pribadi siswa tidak boleh dimasukkan.",
    ],
    en: [
      "Two core uses are free: the system map in Phase 1 and the impact simulation in Phase 4.",
      "Further prompts cost a GenAI Access Token, earned through verification, bias detection, local knowledge, or well-designed prompting.",
      "GenAI holds no vote, does not price projects, and does not pick priorities.",
      "Prompts and answers stay in the open and get discussed together. No student personal data goes in.",
    ],
  } as TL,

  tutupJudul: { id: "Menutup sesi", en: "Closing the session" } as T,
  tutup: {
    id: "Sisakan waktu untuk satu pertanyaan: keputusan mana yang paling sulit disepakati, dan kenapa. Jawabannya hampir selalu menunjuk ke kepentingan yang bertabrakan, dan di situlah pelajaran keberlanjutan yang sebenarnya. Tutup dengan menuliskan aksi 7–30 hari di tempat yang akan terlihat lagi minggu depan.",
    en: "Leave time for one question: which decision was hardest to agree on, and why. The answer nearly always points at clashing interests, and that is where the real sustainability lesson sits. Close by writing the 7–30 day action somewhere it will be seen again next week.",
  } as T,

  cetak: { id: "Cetak halaman ini", en: "Print this page" } as T,
};
