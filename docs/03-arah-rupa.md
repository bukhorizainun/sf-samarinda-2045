# Arah Rupa Situs SF

Dokumen Langkah 02. Menetapkan bagaimana situs ini terlihat dan bergerak,
serta dari mana keputusannya berasal.

## Empat referensi, dan apa yang diambil dari masing-masing

| Referensi | Yang diambil | Yang tidak diambil |
|---|---|---|
| [10Forward](https://10forward.star.global/) | Bentuk pintu masuk: pembaca memilih satu masa depan, dan halaman berubah mengikutinya | Kuis kepribadian, dan empat dunia rekaan |
| [Solarpunk Cities](https://solarpunkcities.com/) | Nada optimis yang membumi, netral hangat, tumbuhan sebagai bagian bangunan | Foto stok kota Eropa |
| [Save the Planet City Lab](https://www.dimitarpaskalev.com/spslab) | Susun sesuatu, lalu lihat akibatnya langsung terbaca sebagai angka | Model fisik dan gambar hasil AI |
| [NetZeroCities](https://netzerocities.eu/) | Angka selalu membawa keterangan asalnya; tidak ada dashboard hiasan | Tata letak kartu putih yang seragam |

Dua catatan dari pemeriksaan langsung. NetZeroCities ternyata **tidak** memakai
dashboard interaktif sama sekali; datanya menerangkan, bukan dijelajahi, dan
kredibilitasnya justru datang dari angka berketerangan serta lencana lembaga.
Rupa 10Forward tidak bisa diperiksa dari luar karena halamannya dirender di
sisi peramban, jadi yang dipinjam adalah struktur perjalanannya, bukan warnanya.

## Keputusan pokok

**Tiga masa depan, bukan empat dunia.** Permainan ini sudah punya tiga skenario
resmi di Fase 2: Expected, Alternative, dan Transformative. Ketiganya dipakai apa
adanya sebagai adegan halaman depan. Memilih satu mengubah warna adegan seluruh
bagian, dan kerapatan hijau pada ilustrasi kota ikut berubah. Tidak ada dunia
baru yang dikarang, dan tidak ada kuis: yang menentukan masa depan di permainan
ini adalah kesepakatan lima peran, bukan kepribadian satu pembaca.

**Wastelandia tidak dibuat.** Masa depan yang lebih buruk tetap disebut sebagai
Expected Future, tetapi tidak dijadikan tontonan. Kota bergarisnya tetap kota
yang sama; yang berkurang hanya atap hijau dan pohonnya.

**Kertas, bukan layar putih.** Dasar terang berpindah dari `#FFFFFF` ke krem
hangat, dan dasar gelap berpindah dari abu netral ke hitam bersemu hijau.
Perpindahan kecil ini yang membedakan nada optimis dari nada korporat.

**Warna indikator tidak boleh disentuh.** Environment, Society, Economy, dan
Future Readiness memakai nilai milik panduan permainan. Warna itu muncul di
kartu fisik yang dipegang pemain, jadi menggesernya di layar akan memutus
kaitan antara meja dan situs.

## Sistem token, tiga lapis

```
primitif   --color-env, --color-paper-100, --color-night-800
   ↓
semantik   --bg, --fg, --line, --scene
   ↓
komponen   --radius-card, --field-h, --tap
```

Lapis primitif menyimpan nilai mentah dan tidak pernah dipakai langsung oleh
komponen. Lapis semantik yang berpindah saat tema terang dan gelap bertukar.
`--scene` adalah lapis semantik yang berubah mengikuti masa depan yang sedang
dilihat; ia juga yang mewarnai cincin fokus dan sorotan teks, sehingga adegan
terasa satu kesatuan sampai ke bagian terkecil.

## Tipografi

Empat tingkat saja: display, h1, h2, h3, ditambah lead dan body. Ukurannya
menempel pada lebar layar lewat `clamp()` tanpa titik patah, jadi tidak ada
ukuran yang mendarat canggung di lebar tanggung. Judul memakai Fraunces dengan
sumbu optis yang disetel per tingkat — mata besar untuk judul besar. Prosa
dibatasi 62 karakter per baris.

## Gerak

Satu kurva untuk seluruh situs: `cubic-bezier(0.22, 1, 0.36, 1)`. Perpindahan
adegan 900 ms, munculan isi 700 ms, sentuhan kecil 200–300 ms. Semuanya berhenti
saat `prefers-reduced-motion` menyala.

## Tiga lapis navigasi

1. Tab utama di kepala halaman. Satu tab satu halaman, satu alamat.
2. Tab di dalam halaman. Isi berganti tanpa memuat ulang, alamat `#` ikut berubah.
3. Panel rinci yang menimpa. Dipakai di katalog kartu.

## Yang belum dikerjakan

- Halaman "Rakit Masa Depan" (lapis City Lab): pilih tiga proyek dari dek, empat
  indikator bergerak sesuai angka kartunya. Menunggu penarik kartu dirapikan
  lebih dulu, karena zona dan dampak masih tercampur ke judul pada sebagian kartu.
- Bidang tanda belum dipilih klien. Monogram dipakai sebagai penampung.
