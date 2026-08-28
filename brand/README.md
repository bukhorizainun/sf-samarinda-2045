# Sistem Identitas — FUTURES IN ACTION

| Tingkat | Nama | Sifat |
|---|---|---|
| Merek permainan | FUTURES IN ACTION | tetap di semua edisi |
| Edisi berjalan | Samarinda 2045 Edition | berganti per kota |
| Studio pengembang | RDL Labs | hanya baris kredit |

Susunan ini mengikuti kepala halaman panduan permainan dari klien,
`FUTURES IN ACTION | Samarinda 2045 Edition`. Rinciannya di `docs/02-ringkasan-panduan-permainan.md`.
Nama studio tidak pernah berbagi ruang dengan tanda utama.

Arah terpilih: Delta Keputusan (Decision Delta), dari lima arah yang dinilai
pada dokumen `klien/identitas_samarinda2045.html`.

## Berkas

| Berkas | Untuk |
|---|---|
| `logo-mark.svg` | Tanda utama, 48×48 |
| `logo-mark-min.svg` | Versi padat untuk favicon dan ukuran di bawah 24 px |
| `logo-token.svg` | Tanda dalam lingkaran untuk token, pion, koin |

Wordmark disusun di sisi kode dari huruf Outfit, bukan dari berkas SVG,
sampai arah ini disetujui. Setelah disetujui, hurufnya dijadikan kurva.

## Arti bentuk

| Elemen | Arti |
|---|---|
| Titik pangkal terisi | Hari ini, satu-satunya hal yang pasti |
| Tiga jalur | Tiga skenario Fase 2: Expected, Alternative, Transformative |
| Dua simpul kosong | Skenario yang tidak dipilih |
| Satu simpul terisi | Preferred Future hasil Fase 3; satu-satunya aksen warna di seluruh sistem |

Jumlah tiga bukan pilihan rupa, melainkan aturan permainan: Fase 2 menghasilkan tepat
tiga skenario dan Fase 3 memilih satu di antaranya.

Bacaannya berlapis: delta Sungai Mahakam, pohon keputusan, dan jalur papan permainan.

## Warna

| Peran | Nilai |
|---|---|
| Tinta | `#12171A` |
| Kertas | `#F7F5F0` |
| Hijau sungai | `#0F5C58` |
| Kuningan endapan (aksen) | `#C08A2E` |
| Kuningan versi gelap | `#D9A04A` |

Aksen hanya boleh muncul pada satu simpul. Bila tampil di lebih dari satu tempat,
tanda kehilangan titik berhentinya.

## Cara memasang warna

Tanda memakai `currentColor` untuk garis dan titik pangkal, serta membaca
variabel `--logo-accent` untuk simpul terisi.

```html
<span style="color:#0f5c58; --logo-accent:#c08a2e;">
  <!-- isi logo-mark.svg -->
</span>
```

Untuk sablon satu warna, set `--logo-accent: currentColor`.

## Aturan pakai

- Ruang kosong di sekeliling tanda minimal setinggi satu simpul.
- Ukuran terkecil tanda utama 24 px. Di bawah itu pakai `logo-mark-min.svg`.
- Jangan memiringkan, memberi bayangan, gradasi, atau garis luar tambahan.
- Jangan mengisi lebih dari satu simpul.

## Kunci wordmark

```
[tanda]  FUTURES IN ACTION        ← Outfit 500, jarak huruf .12em, huruf besar
         SAMARINDA 2045 EDITION   ← Outfit 200, jarak huruf .2em, opasitas .78
```

Baris pertama tetap. Untuk edisi lain hanya baris kedua yang berganti:
JAKARTA 2045 EDITION, BANDUNG 2045 EDITION, ROTTERDAM 2045 EDITION.

Pada bidang sempit di bawah 130 px, pakai tanda saja tanpa teks.

## Belum dikerjakan

- Wordmark berkurva dan berkas PNG. Menunggu persetujuan arah.
- Panduan merek ringkas satu halaman untuk pihak percetakan.
