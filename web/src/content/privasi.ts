import type { T, TL } from "@/lib/i18n";

/* ============================================================
   Kebijakan privasi ringkas.

   Diminta oleh peta halaman Langkah 00 karena situs ini punya fitur
   obrolan. Isinya hanya menyatakan apa yang benar-benar dilakukan
   kode di repositori ini, dan sudah diperiksa satu per satu:

   - tidak ada satu pun permintaan jaringan di seluruh src/ (Shelbot
     menjawab dari isi situs, dihitung di peramban)
   - huruf Fraunces dan Inter disajikan dari server situs sendiri,
     jadi tidak ada permintaan ke Google saat halaman dibuka
   - satu-satunya yang disimpan di peramban adalah pilihan tema
     terang atau gelap, dengan kunci sf-theme
   - tidak ada pengukur kunjungan, tidak ada kuki iklan

   Bila kelak pendamping AI berpindah ke fungsi server, halaman ini
   wajib diperbarui lebih dulu.
   ============================================================ */

export const PRIVASI = {
  eyebrow: { id: "Kebijakan privasi", en: "Privacy" } as T,
  judul: {
    id: "Apa yang situs ini simpan, dan apa yang tidak",
    en: "What this site keeps, and what it does not",
  } as T,
  lead: {
    id: "Halaman ini ditulis pendek dan lugas. Isinya bukan janji umum, melainkan keterangan tentang apa yang benar-benar dikerjakan situs ini saat kamu membukanya.",
    en: "This page is short and plain. It is not a general promise; it describes what the site actually does when you open it.",
  } as T,

  perubahanJudul: {
    id: "Bila nanti berubah",
    en: "If this changes",
  } as T,
  perubahan: {
    id: "Situs ini masih berkembang. Bila pendamping AI kelak dipindahkan ke server supaya bisa menjawab lebih luas, pertanyaan yang kamu kirim akan meninggalkan peramban, dan halaman ini diperbarui lebih dulu sebelum perubahan itu dinyalakan.",
    en: "The site is still growing. If the AI companion later moves to a server so it can answer more widely, the questions you send will leave your browser, and this page will be updated before that change is switched on.",
  } as T,

  tanyaJudul: { id: "Bertanya soal ini", en: "Asking about this" } as T,
  tanya: {
    id: "Pertanyaan tentang halaman ini bisa dikirim ke surel di bawah. Karena tidak ada data pengunjung yang disimpan, tidak ada data yang perlu diminta kembali atau dihapus.",
    en: "Questions about this page can go to the email below. Because no visitor data is stored, there is nothing to request back or to delete.",
  } as T,

  /** Tiap baris: satu hal yang dilakukan, atau tidak dilakukan. */
  butir: [
    {
      jenis: "ya",
      judul: { id: "Pilihan tema", en: "Your theme choice" } as T,
      isi: {
        id: "Bila kamu menukar tampilan terang dan gelap, pilihan itu disimpan di peramban kamu sendiri dengan kunci sf-theme. Ia tidak pernah dikirim ke mana pun, dan hilang saat kamu membersihkan data situs.",
        en: "If you switch between light and dark, that choice is stored in your own browser under the key sf-theme. It is never sent anywhere, and it disappears when you clear site data.",
      } as T,
    },
    {
      jenis: "ya",
      judul: { id: "Obrolan Shelbot", en: "The Shelbot conversation" } as T,
      isi: {
        id: "Shelbot berjalan sepenuhnya di peramban kamu. Jawabannya disusun dari naskah situs, panduan permainan, dan 184 kartu yang sudah ikut terkirim bersama halaman. Tidak ada pertanyaan yang dikirim ke server, dan percakapannya hilang begitu halaman ditutup.",
        en: "Shelbot runs entirely in your browser. Its answers come from the site text, the game guide, and the 184 cards that ship with the page. No question is sent to a server, and the conversation is gone once you close the page.",
      } as T,
    },
    {
      jenis: "ya",
      judul: { id: "Skor mini game", en: "Your mini game score" } as T,
      isi: {
        id: "Skor dihitung di peramban dan tidak disimpan. Tombol bagikan hanya bekerja bila kamu menekannya: ia menyerahkan satu kalimat berisi skor dan alamat halaman kepada lembar berbagi perangkatmu, atau menyalinnya ke papan klip.",
        en: "The score is counted in your browser and never stored. The share button only acts when you press it: it hands one sentence with your score and the page address to your device's share sheet, or copies it to your clipboard.",
      } as T,
    },
    {
      jenis: "tidak",
      judul: { id: "Tidak ada pengukur kunjungan", en: "No analytics" } as T,
      isi: {
        id: "Tidak ada Google Analytics, tidak ada piksel, dan tidak ada kuki iklan. Situs ini tidak mengikuti ke mana kamu pergi setelah menutup halaman.",
        en: "There is no Google Analytics, no tracking pixel, and no advertising cookie. This site does not follow where you go after you close the page.",
      } as T,
    },
    {
      jenis: "tidak",
      judul: {
        id: "Tidak ada permintaan ke layanan lain",
        en: "No third-party requests",
      } as T,
      isi: {
        id: "Huruf Fraunces dan Inter disajikan dari server situs ini sendiri, bukan dari Google. Gambar dan ilustrasi digambar sebagai SVG di dalam halaman. Jadi membuka halaman ini tidak memberi tahu pihak ketiga mana pun bahwa kamu membukanya.",
        en: "The Fraunces and Inter typefaces are served from this site's own server, not from Google. Illustrations are drawn as SVG inside the page. Opening this page therefore does not tell any third party that you opened it.",
      } as T,
    },
    {
      jenis: "tidak",
      judul: { id: "Tidak ada borang pendaftaran", en: "No sign-up form" } as T,
      isi: {
        id: "Tidak ada akun, tidak ada kolom nama, dan tidak ada kolom surel di situs ini. Menghubungi kami berjalan lewat WhatsApp atau surel, yang keduanya dibuka di aplikasi kamu sendiri.",
        en: "There is no account, no name field, and no email field on this site. Getting in touch runs through WhatsApp or email, both of which open in your own app.",
      } as T,
    },
    {
      jenis: "catatan",
      judul: { id: "Yang di luar kendali kami", en: "What we do not control" } as T,
      isi: {
        id: "Situs ini disajikan oleh layanan hosting, dan layanan seperti itu umumnya mencatat alamat IP serta permintaan halaman dalam catatan servernya sendiri. Catatan itu milik penyedia hosting, bukan kami, dan kami tidak membacanya.",
        en: "The site is served by a hosting provider, and providers like that normally record IP addresses and page requests in their own server logs. Those logs belong to the provider, not to us, and we do not read them.",
      } as T,
    },
  ] as { jenis: "ya" | "tidak" | "catatan"; judul: T; isi: T }[],

  ringkas: {
    id: [
      "Tidak ada akun dan tidak ada borang.",
      "Tidak ada pengukur kunjungan dan tidak ada kuki iklan.",
      "Obrolan dan skor dihitung di peramban kamu.",
      "Yang disimpan hanya pilihan tema terang atau gelap.",
    ],
    en: [
      "No accounts and no forms.",
      "No analytics and no advertising cookies.",
      "The conversation and the score are computed in your browser.",
      "The only stored thing is your light or dark preference.",
    ],
  } as TL,
};
