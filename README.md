# Futures in Action — Platform Digital

Web showcase dan pendamping AI untuk board game *Futures in Action*, edisi Samarinda 2045.
Dikerjakan oleh RDL Labs.

Sumber kebenaran isi permainan: `docs/02-ringkasan-panduan-permainan.md`, ringkasan dari
panduan resmi klien.

## Isi folder

| Folder | Isi |
|---|---|
| `klien/` | Dokumen yang dikirim ke klien: peta pengerjaan, arah visual, usulan tanda SF |
| `docs/` | Halaman siap terbit untuk GitHub Pages, plus catatan internal |
| `brand/` | Tanda, aturan pakainya, dan arsip empat putaran sebelumnya |
| `tools/` | Pembangun tanda dan halaman. `build_brand.py` satu-satunya sumber geometri tanda |
| `web/` | Aplikasi situs. Next.js 16 + Tailwind 4, terbit statis |

Dua berkas HTML di akar folder adalah dokumen penawaran awal beserta rencana eksekusinya.

## Status pengerjaan

| Langkah | Nama | Status |
|---|---|---|
| 00 | Fondasi & peta halaman | Menunggu tanggapan klien |
| 01 | Logo & arah visual | Putaran kelima: monogram dirapatkan 2,22 → 1,59 dan bidang ditambahkan, menunggu pilihan bidang |
| — | Koreksi nama merek dari panduan klien | Selesai |
| — | Merek utama berpindah ke SF, Futures in Action jadi semboyan | Selesai di sisi rupa |
| 02 | Halaman inti & isi | Berjalan: katalog kartu, sistem rupa, dan halaman `/gaya` selesai |
| 03 | Dashboard 4 pilar | Belum mulai |
| 04 | GenAI Futures Lab Companion | Belum mulai |
| 05 | Panel admin | Belum mulai |
| 06 | Uji akhir & peluncuran | Belum mulai |

Urutannya mengikat. Langkah berikutnya menunggu persetujuan langkah sebelumnya.
Tidak ada tanggal mati; penjadwalan menyesuaikan kesiapan kedua pihak.

## Keputusan yang masih menggantung

1. Repositori privat atau publik. Menentukan apakah pratinjau bisa memakai GitHub Pages
   atau harus langsung ke Cloudflare Pages. Rinciannya di `docs/00-catatan-teknis.md`.
2. Bidang tanda: 01 Blok, 02 Monogram, 03 Cakram, atau 04 Blok Iris. Keempatnya memakai huruf
   yang persis sama, jadi berpindah tidak menuntut menggambar ulang. Saran studio: 01 Blok
   sebagai tanda utama, dengan 02 Monogram sebagai pendamping wajib untuk kop surat dan
   kepala situs.
3. Blok Iris dipakai atau tidak. Bila dipakai, ia hanya boleh muncul pada 64 px ke atas dan
   pada cetak penuh warna, jadi perlu disepakati lebih dulu di mana saja tempatnya.
4. Gradasi memakai empat warna City Indicator, atau warna lain. Bila warna lain, kaitan dengan
   permainan hilang dan gradasi menjadi hiasan.
5. Kepala halaman panduan permainan disesuaikan menjadi SF atau tidak. Selama belum, ada dua
   susunan merek yang berselisih di mata pembaca.
6. Bahasa situs: Indonesia saja, atau disiapkan tempat untuk Inggris sejak awal.
