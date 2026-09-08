# Situs SF — Sustainable Futures

Aplikasi situs untuk *Futures in Action*, edisi Samarinda 2045.
Next.js 16 dengan keluaran statis, TypeScript, Tailwind 4.

## Menjalankan di mesin sendiri

```bash
npm install
npm run dev      # http://localhost:3000/id
npm run build    # hasil terbit ada di out/
```

Fungsi obrolan tidak jalan di `next dev`. Untuk mencobanya sekalian:

```bash
npm run build
npx wrangler pages dev out --binding ANTHROPIC_API_KEY=...
```

## Susunan berkas

| Tempat | Isi |
|---|---|
| `src/content/site.ts` | Seluruh naskah situs, berpasangan id/en. Tata letak tidak pernah menyimpan teks |
| `src/content/minigame.ts` | Kartu, pertanyaan, kunci jawaban, dan aturan poin "Jaga Samarinda!" |
| `src/content/cards.json` | 184 kartu, ditarik dari PDF dek resmi. Lihat `tools/extract_cards.py` |
| `src/components/` | Kerangka rupa dan bagian yang berinteraksi |
| `functions/api/chat.js` | Fungsi obrolan Futures Lab. Tanpa dependensi, agar mudah dipindahkan |

## Tiga lapis navigasi

1. Tab utama di kepala halaman — tiap tab satu halaman, satu alamat.
2. Tab di dalam halaman — isi berganti tanpa memuat ulang, alamat `#` ikut berubah.
3. Panel rinci yang menimpa — dipakai di katalog kartu; ditutup dengan Esc atau klik luar.

## Penerbitan

Cloudflare Pages, dengan repositori di GitHub.

| Pengaturan | Nilai |
|---|---|
| Perintah bangun | `npm run build` |
| Folder keluaran | `out` |
| Folder akar | `web` |
| Environment variable | `ANTHROPIC_API_KEY` (rahasia, hanya di panel Cloudflare) |

Kunci API tidak pernah ditulis di dalam kode dan tidak pernah dikirim ke peramban.

Situsnya sendiri statis. Bila suatu saat pindah ke GitHub Pages atau tempat lain,
yang perlu tempat baru hanya `functions/api/chat.js`.

## Bahasa

Alamat `/id` dan `/en` dibangun berpasangan. `/` melempar pengunjung sesuai bahasa
peramban, dengan Indonesia sebagai yang utama.

## Yang masih menunggu klien

- Bidang tanda belum dipilih. `src/components/Logo.tsx` memakai monogram sebagai penampung.
- Nomor WhatsApp dan surel di halaman Kontak masih kosong; halaman menahan diri
  daripada menampilkan tautan yang belum benar.
- Naskah kartu masih berbahasa Inggris, mengikuti dek resmi.
