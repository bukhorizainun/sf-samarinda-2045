# Sistem Identitas — SF

Status: **satu huruf dengan empat bidang, belum ada yang dipilih.** Dokumen untuk klien ada di
`klien/identitas_sf.html`, versi terbitnya di `docs/identitas-sf.html`.

## Susunan merek

| Tingkat | Nama | Sifat |
|---|---|---|
| Merek utama | **SF** — Sustainable Futures | tetap, punya tanda |
| Semboyan | FUTURES IN ACTION | tetap, hanya tulisan |
| Edisi berjalan | SAMARINDA 2045 | berganti per kota |
| Studio | RDL Labs | baris kredit |

Hanya tingkat teratas yang punya tanda. Tiga tingkat di bawahnya tulisan, dan tulisan itu
boleh berganti tanpa menyentuh tandanya.

Kepala halaman panduan permainan masih berbunyi `FUTURES IN ACTION | Samarinda 2045 Edition`.
Selama belum disesuaikan, ada dua susunan merek yang berselisih. Lihat
`docs/02-ringkasan-panduan-permainan.md`.

SF juga inisial penulisnya. Bacaan itu tidak dijelaskan di materi resmi; di sana SF berarti
Sustainable Futures.

## Kenapa ada putaran kelima

Klien menilai tanda putaran keempat terlalu biasa. Dibaca sebagai soal rupa, penilaian itu
buntu; dibaca sebagai soal ukuran dan wadah, ada dua hal yang bisa diperbaiki.

Pertama, perbandingan. Tanda lama selebar 2,22 kali tingginya, jadi hanya nyaman pada baris
mendatar. Dalam kotak 32 piksel ia menyisakan tinggi huruf 14 piksel; yang sekarang, dengan
perbandingan 1,59, menyisakan 20 piksel di ruang yang sama.

Kedua, tidak ada bidang. Seluruh identitas bertumpu pada dua huruf yang berdiri di ruang
kosong, sehingga tidak ada satu pun bentuk yang bisa dipinjam untuk kartu, sampul, atau
tombol. Cakram putaran lalu hanya menutupi gejalanya: tanda selebar itu dijatuhkan ke dalam
lingkaran, dan sisanya ruang kosong.

Putaran ini merapatkan hurufnya dan menambahkan bidang. Sudut 45 derajat yang selama ini
hanya memotong ujung huruf sekarang juga memotong sudut bidangnya, jadi wadah dan huruf
memakai satu aturan yang sama.

## Konstruksi

Huruf tidak digambar bebas lalu dirapikan.

- **S** dibangun dari dua elips yang benar-benar bersinggungan. Titik singgungnya tepat di
  tengah tinggi huruf, dan di titik itu arah kedua lengkungan mendatar, sehingga sambungannya
  tidak terlihat.
- **Sudut ujung dihitung.** Pada elips dicari titik yang garis singgungnya miring 135°.
  Potongan `butt` yang tegak lurus terhadapnya jatuh tepat 45° — sudut yang sama dengan panah.
  Kalau dikira-kira, kedua ujung S tidak akan pernah sejajar.
- **Satu bobot.** Tebal sapuan S, lebar tiang F, lebar kedua lengan, dan tebal panah kecil di
  logotype memakai satu angka: `W`. Tidak ada bobot kedua di seluruh sistem.
- **Satu sudut.** 45° dipakai untuk potongan ujung S, potongan ujung lengan F, ujung runcing,
  arah panah, dan sekarang juga potongan sudut bidang.

| Ukuran | Nilai | Putaran lalu |
|---|---|---|
| Tinggi huruf `H` | 100 | 100 |
| Bobot `W` | 26 | 28 |
| Jari-jari datar mangkuk `RX` | 28 | 42 |
| Jarak S ke F `GAP` | 10 | 22 |
| Lengan atas / tengah `A1` / `A2` | 54 / 44 | 74 / 60 |
| Lebar tanda | 159 | 222 |
| Perbandingan | **1,59** | 2,22 |

Bidang memakai tiga angka: jarak tepi 0,12 dari lebar monogram (sisi persegi 178,08),
potongan sudut 0,26 dari sisi, dan huruf digeser (+3, −3) menjauhi sudut yang dipotong.
Cakram bergaris tengah 1,18 dari lebar monogram. Angka-angkanya ada di bagian `grid huruf`
dan `grid bidang` pada `tools/build_brand.py`.

## Empat berkas

| Berkas | Nama | Bentuk bidang |
|---|---|---|
| `logo/sf-1-blok.svg` | Blok | persegi, sudut kiri atas dipotong 45° |
| `logo/sf-2-mark.svg` | Monogram | tanpa bidang, huruf berdiri sendiri |
| `logo/sf-3-cakram.svg` | Cakram | lingkaran penuh |
| `logo/sf-4-iris.svg` | Blok Iris | blok dengan satu potongan menembusnya |

Keempatnya memakai monogram yang persis sama, jadi berpindah di antaranya tidak menuntut
menggambar ulang apa pun. Pada tiga bidang tertutup, huruf **dilubangkan** dari bidangnya,
bukan digambar ulang di dalamnya; yang terbaca sebagai huruf adalah bahan di baliknya.

Tiap berkas punya pasangan `-mono.svg` bertinta rata untuk sablon, ukiran, dan cetak satu
warna. `logo/sf-favicon.svg` memakai blok versi rapat, karena pada 16 piksel bidang persegi
mengisi kisi piksel sampai ke tepi sementara cakram membuang keempat sudutnya.

Saran studio: **01 Blok** sebagai tanda utama, **02 Monogram** sebagai pendamping wajib untuk
kop surat dan kepala situs, **03 Cakram** hanya untuk benda yang memang bundar, dan
**04 Blok Iris** disimpan untuk sampul dan bidang besar.

## Cara membangun

```
python tools/build_brand.py     # tanda → brand/logo/*.svg + symbol & viewBox ke halaman klien
python tools/build_docs.py      # halaman klien → docs/*.html
```

`tools/build_brand.py` satu-satunya tempat geometri ditulis. Berkas SVG, `<symbol>` di halaman
presentasi, `viewBox` tiap tanda, favicon, dan diagram konstruksi semuanya lahir dari sana.
Jangan menyunting berkas di `logo/` dengan tangan; suntingannya akan tertimpa.

Tanda putaran keempat ikut dibangun dari berkas yang sama, dengan nama `lama`, semata untuk
perbandingan sebelum-sesudah di halaman klien. Angka-angkanya ditulis lokal di dalam
fungsinya sendiri supaya tidak ada tetapan lama yang bocor ke tanda sekarang.

Di halaman klien, tanda ditulis tanpa `viewBox`:

```html
<svg data-mk="blok"><use href="#sf-blok"/></svg>
```

`build_brand.py` yang mengisi `viewBox`-nya, sehingga perubahan bentuk tidak pernah
meninggalkan ukuran lama di halaman. Penanda sisipan symbol:

```html
<!-- SF:SYMBOLS -->  ... diisi oleh build_brand.py ...  <!-- /SF:SYMBOLS -->
```

Akhiran `-k` berarti versi `currentColor`, dipakai di atas dasar gelap dan untuk satu warna.
`#sf-construction` adalah diagram konstruksi, `#sf-tick` panah kecil untuk logotype, dan
`#sf-lama` tanda putaran keempat.

## Warna

| Peran | Nilai |
|---|---|
| Tinta | `#0E1418` |
| Putih | `#FFFFFF` |

Empat warna gradasi, nilainya milik City Indicator di panduan permainan, dicerahkan seperlunya
untuk cetak kecil:

| Indikator | Nilai |
|---|---|
| Environment | `#16A06F` |
| Future Readiness | `#2F7FE0` |
| Society | `#8B5CF6` |
| Economy | `#F0A92A` |

Urutan gradasi mengikuti daftar itu, dari kiri bawah ke kanan atas, searah panah. Pada bidang
persegi keempat warna punya ruang untuk terbaca satu per satu; pada sapuan huruf yang tipis
mereka berdesakan jadi satu campuran. Itu sebabnya blok yang dipakai bila gradasi harus
menjelaskan dirinya.

## Aturan pakai

- Gradasi hanya untuk layar dan cetak penuh warna, pada ukuran 24 px ke atas. Di bawah itu,
  dan untuk sablon, ukiran, atau cetak satu warna, pakai versi tinta atau putih.
- Ukuran terkecil monogram 24 px. Untuk 16 px dan semua bidang persegi, pakai blok.
- Blok Iris hanya 64 px ke atas, hanya layar dan cetak penuh warna. Tidak untuk favicon,
  token, ukiran, atau sablon satu warna.
- Cakram hanya untuk benda yang memang bundar: token, pin, stempel, penanda giliran. Untuk
  favicon dan ikon aplikasi, blok yang dipakai.
- Ruang kosong di sekeliling blok minimal selebar potongan sudutnya. Untuk monogram, ruang
  kosong di kanan minimal selebar satu tiang F, karena ujung runcing perlu jarak.
- Jangan memiringkan, memberi bayangan, garis luar tambahan, atau mengubah sudut potong.
- Nama studio tidak pernah berbagi ruang dengan tanda utama.

## Kunci logo

```
[tanda]  ↗ SUSTAINABLE       ← Outfit 600, huruf besar
           FUTURES
           FUTURES IN ACTION ← Outfit 300, jarak huruf .22em, opasitas .66
           SAMARINDA 2045    ← baris yang berganti kota
```

Kunci A (utama) dan D (bertumpuk) memakai blok; kunci B dan C memakai monogram terbuka.
Panah kecil di kepala baris digambar sendiri (`#sf-tick`), bukan diambil dari fonta, supaya
sudut dan bobotnya sama persis dengan potongan pada huruf.

Pada bidang lebih sempit dari 130 px, pakai tanda saja tanpa tulisan.

## Huruf

Outfit untuk logotype dan judul, Karla untuk teks isi, JetBrains Mono untuk label kecil.

## Belum dikerjakan

- Kunci logo sebagai berkas SVG. Menunggu bidang terpilih; setelah itu tulisannya dijadikan
  kurva supaya tidak bergantung pada ketersediaan fonta.
- Berkas PNG dan PDF untuk percetakan.
- Panduan merek ringkas satu halaman untuk pihak percetakan.
- Sudut potong 45° sebagai bentuk pinjaman untuk kartu, foto, dan tombol di situs. Aturannya
  sudah ada di tanda; penerapannya di web belum ditulis.

## Arsip

- `legacy/` — Delta Keputusan, putaran pertama, ketika Futures in Action masih merek utama.
- `legacy/round2/` — enam lambang bergaya instrumen kuningan.
- `legacy/round3/` — monogram gradasi putaran ketiga, hurufnya masih digambar bebas.
- `legacy/round4/` — monogram terbangun putaran keempat, lebar 2,22. Hurufnya benar,
  bidangnya belum ada.
- `../tools/legacy/build_brand_round4.py` — pembangun putaran keempat, disimpan utuh.

Keempatnya disimpan sebagai catatan, bukan bahan pakai.
