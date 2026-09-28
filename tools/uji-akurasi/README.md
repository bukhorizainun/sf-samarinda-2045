# Uji akurasi Shelbot

Bank soal: `soal.json`, 28 pertanyaan dari panduan resmi (`docs/02-ringkasan-panduan-permainan.md`):
23 soal fakta, 2 soal isu Samarinda yang harus dijawab, dan 3 soal di luar lingkup yang harus ditolak.

```bash
node tools/uji-akurasi/jalankan.mjs                 # naskah + semua model di Worker
node tools/uji-akurasi/jalankan.mjs naskah          # hanya mesin naskah, tanpa memanggil model
node tools/uji-akurasi/jalankan.mjs llama-70b       # satu model
SOAL=durasi,pemain node tools/uji-akurasi/jalankan.mjs llama-70b   # sebagian soal (hemat jatah harian)
node tools/uji-akurasi/jalankan.mjs --ulang [csv]   # nilai ulang jawaban tersimpan setelah rubrik diubah
```

Tiap model menerima jawaban naskah sebagai pijakan, sama seperti di situs. Permintaan diberi jeda 8 detik
supaya tidak melewati batas 8 pertanyaan per menit. Satu putaran penuh dua Llama memakai kira-kira sepertiga
jatah gratis harian Workers AI.

## Hasil 28 September 2026

| Otak | Fakta tercakup | Soal fakta lulus penuh | Menolak soal di luar lingkup | Menjawab isu Samarinda |
|---|---|---|---|---|
| Naskah, sebelum perbaikan | 66% | 14/23 | 67% | 100% |
| Llama 3.3 70B, sebelum perbaikan | 70% | 15/23 | 67% | 100% |
| Llama 3.1 8B, sebelum perbaikan | 67% | 15/23 | 67% | 100% |
| **Naskah, sesudah perbaikan** | **100%** | **23/23** | **100%** | **100%** |
| **Llama 3.3 70B, sesudah perbaikan** | 10 soal yang sebelumnya gagal: **10/10 lulus** | | | |

Angka "sebelum" sudah memakai rubrik revisi 1 (lihat `catatan_rubrik` di `soal.json`). Llama 3.1 8B dan
putaran penuh Llama 70B sesudah perbaikan belum diulang, untuk menghemat jatah harian.

### Apa yang salah, dan apa yang diperbaiki

- **Durasi.** Naskah menulis satu sesi "sekitar sembilan puluh menit" dan semua fase "masing-masing 15–18
  menit". Panduan: sesi ±100–120 menit, dengan waktu fase berbeda (Fase 3: 10–12, Fase 4: 22–28 menit).
  Diperbaiki di empat tempat.
- **Topik salah sasaran.** "Berapa lama aksi nyata" dijawab dengan durasi sesi, "Piala Dunia" dijawab dengan
  syarat menang, "kapan GenAI gratis" dijawab dengan daftar komponen, dan "berapa kartu Mini-Project"
  dijawab dengan hasil pencarian kartu. Kata kunci diperbaiki, dua topik baru ditambahkan (Project Market
  tiga ronde, dan tiga proyek akhir), dan pertanyaan jelas di luar lingkup kini langsung ditolak.
- **Nama indikator.** Situs menerjemahkan Future Readiness menjadi "Masa Depan", sehingga model ikut
  kehilangan makna "kesiapan". Jawaban naskah kini menyertakan nama resmi dalam kurung. Label di dasbor
  tidak diubah; itu keputusan rupa untuk klien.
- **Model mengarang saat naskah kosong.** Contoh: "tidak ada ronde Project Market" (8B), "GenAI boleh tanpa
  token kalau semua setuju" (70B). Instruksi Worker kini memuat fakta resmi panduan (waktu fase, jumlah kartu
  per jenis, tiga proyek, 7–30 hari, dua pemakaian GenAI gratis) dan perintah untuk bilang tidak tahu.
- **Menolak sambil menjawab.** Llama 70B menolak soal Piala Dunia tetapi tetap menyebut juaranya; Llama 8B
  menawarkan kode Python. Instruksi kini melarang menjawab soal yang ditolak dalam bentuk apa pun.

Rincian per soal dan jawaban lengkap: `hasil/akurasi-2026-09-28*.md`, data mentah: `hasil/*.csv`.
