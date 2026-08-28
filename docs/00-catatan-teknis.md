# Catatan Teknis Internal

Bukan dokumen klien. Berisi keputusan teknis dan alasannya.

## Rencana tempat tinggal situs

Kebutuhan yang menentukan: mulai Langkah 04 situs perlu menyimpan kunci API layanan AI di
sisi server. Halaman statis murni tidak bisa melakukan itu, karena apa pun yang dikirim ke
peramban bisa dibaca pengunjung.

| Langkah | Tempat | Alasan |
|---|---|---|
| 01–03 | GitHub Pages | Gratis, cepat dipasang, cukup untuk halaman statis dan dashboard 4 pilar |
| 04–06 | Cloudflare Pages | Gratis, mendukung fungsi server untuk menyimpan kunci API, mendukung repositori privat |
| 06 | Domain berbayar | Dipasang di atas Cloudflare, tanpa membangun ulang apa pun |

Pilihan lain: langsung memakai Cloudflare Pages sejak Langkah 01 sehingga hanya ada satu
kali pemasangan seumur proyek. Alamat sementaranya `*.pages.dev`, sama gratisnya dengan
`github.io`.

Catatan berbayar-atau-tidak: GitHub Pages pada akun gratis hanya melayani repositori publik.
Bila materi board game belum boleh terbuka sebelum rilis, repositori harus privat, dan itu
berarti Cloudflare Pages sejak awal.

## Rencana tumpukan teknologi

- Next.js dengan keluaran statis, TypeScript, Tailwind. Sama dengan proyek lain di mesin ini,
  sehingga tidak ada tumpukan baru yang perlu dipelajari saat pemeliharaan.
- Isi situs disimpan sebagai berkas data terpisah dari tata letak. Ini yang membuat edisi
  kota lain nanti tidak menuntut pembangunan ulang.
- Fungsi obrolan AI dijalankan sebagai satu fungsi server kecil. Kunci API tidak pernah
  ikut terkirim ke peramban.

Belum ada satu pun paket dipasang. `npm install` sengaja ditunda sampai Langkah 02 supaya
tidak membebani mesin selama ada pekerjaan lain berjalan.

## Urutan pemasangan yang belum dijalankan

1. Membuat repositori di GitHub. Perlu keputusan privat atau publik lebih dulu.
2. Menyambungkan repositori ke penyedia hosting pratinjau.
3. Baru setelah itu `npm create next-app` di dalam folder `web/`.

## Batas pengerjaan yang disepakati dengan pemilik usaha

Ruang lingkup mengikuti Tier 2. Ekspansi multi-kota dan persona AI ganda berada di Tier 3,
jadi tidak dibangun sekarang. Yang dilakukan sekarang hanya menyiapkan struktur agar
penambahan itu kelak tidak menuntut pembongkaran.
