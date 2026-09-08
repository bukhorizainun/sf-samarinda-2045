# -*- coding: utf-8 -*-
"""Sumber tunggal geometri logo SF.

Empat kandidat, dua keluarga huruf x dua perlakuan:

              tanpa silang        bersilang
  elips       04 Rapat            01 Anyam
  modular     03 Modular          02 Anyam Modular

Gagasannya ada pada kolom kanan: S lewat di depan tiang F, dan di tempat
mereka bertemu ada celah selebar tetap. Celah itu bukan hiasan — ia yang
membuat dua huruf terbaca sebagai satu benda, bukan dua huruf yang berdiri
berdampingan.

Semua bentuk memakai satu bobot sapuan. Tidak ada warna di sini; warna
menyusul setelah bentuknya disetujui.

Jalankan: python tools/build_logo.py
"""

import io
import math
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "brand", "usulan")
PAGE = os.path.join(ROOT, "klien", "logo_sf.html")

H = 100.0          # tinggi huruf besar
W = 23.0           # bobot sapuan, satu-satunya di seluruh sistem
GAP = 8.0          # lebar celah pada titik silang
OVER = 0.28        # dalamnya tindihan, dalam satuan bobot

RX = 28.0          # jari-jari datar mangkuk S elips
TOP = 72.0         # sudut ujung atas S
BOT = 250.0        # sudut ujung bawah S

MR = 27.0          # jari-jari belokan S modular
MX = 68.0          # tepi kanan bar S modular

A1 = 45.0          # panjang lengan atas F
A2 = 34.0          # panjang lengan tengah F
YM = 43.0          # tinggi lengan tengah F
APART = 12.0       # jarak S ke F pada kandidat tanpa silang

BOX = 'x="-60" y="-60" width="400" height="240"'
FIELD = '<rect x="-60" y="-60" width="400" height="240" fill="#fff"/>'


def _pt(cx, cy, rx, ry, t):
    r = math.radians(t)
    return (cx + rx * math.cos(r), cy - ry * math.sin(r))


def s_ellipse():
    """S dari dua elips yang benar-benar bersinggungan. Titik singgungnya
    tepat di tengah tinggi huruf, dan di sana kedua lengkungan mendatar,
    sehingga sambungannya tidak terlihat."""
    ry = (H - W) / 4.0
    cx = RX + W / 2.0
    y1 = W / 2.0 + ry
    a = _pt(cx, y1, RX, ry, TOP)
    b = _pt(cx, y1 + 2 * ry, RX, ry, BOT)
    l1 = 1 if (TOP - 270) % 360 > 180 else 0
    l2 = 1 if (90 - BOT) % 360 > 180 else 0
    d = ("M%.2f %.2f A%.2f %.2f 0 %d 0 %.2f %.2f A%.2f %.2f 0 %d 1 %.2f %.2f"
         % (a[0], a[1], RX, ry, l1, cx, y1 + ry, RX, ry, l2, b[0], b[1]))
    return d, cx + RX + W / 2.0


def s_modular():
    """S dari empat belokan seperempat dan tiga bar lurus. Satu jari-jari
    untuk semua belokan, jadi seluruh huruf lahir dari dua bagian saja."""
    m, x0, r = H / 2.0, W / 2.0, MR
    d = ("M%.2f %.2f H%.2f A%.2f %.2f 0 0 0 %.2f %.2f V%.2f A%.2f %.2f 0 0 0 %.2f %.2f "
         "H%.2f A%.2f %.2f 0 0 1 %.2f %.2f V%.2f A%.2f %.2f 0 0 1 %.2f %.2f H%.2f"
         % (MX, x0, x0 + r, r, r, x0, x0 + r, m - r, r, r, x0 + r, m,
            MX - r, r, r, MX, m + r, H - x0 - r, r, r, MX - r, H - x0, x0))
    return d, MX + W / 2.0


def stroke(d, w, col):
    return ('<path d="%s" fill="none" stroke="%s" stroke-width="%.2f" stroke-linecap="butt"/>'
            % (d, col, w))


def box(x, y, w, h, col):
    return '<path d="M%.2f %.2f H%.2f V%.2f H%.2f Z" fill="%s"/>' % (
        x, y, x + w, y + h, x, col)


def f_glyph(fx, col):
    """F: tiang, palang atas, lengan tengah. Hanya garis tegak dan datar."""
    return (box(fx, 0, W, H, col), box(fx, 0, W + A1, W, col),
            box(fx + W, YM, A2, W, col))


def mark(kind, cross, uid, col="currentColor"):
    """kind: elips | modular. cross: S melintas di depan tiang F."""
    d, right = s_ellipse() if kind == "elips" else s_modular()
    fx = (right - W * OVER) if cross else (right + APART)
    stem, top, mid = f_glyph(fx, col)
    width = fx + W + A1
    if not cross:
        return "", stroke(d, W, col) + stem + top + mid, width, H
    m = ('<mask id="k%s" maskUnits="userSpaceOnUse" %s>%s%s</mask>'
         % (uid, BOX, FIELD, stroke(d, W + 2 * GAP, "#000")))
    body = ('<g mask="url(#k%s)">%s%s</g>%s%s'
            % (uid, stem, mid, stroke(d, W, col), top))
    return m, body, width, H


CANDIDATES = [
    ("anyam",   "Anyam",         "The Weave",         "elips",   True),
    ("modanyam", "Anyam Modular", "The Modular Weave", "modular", True),
    ("modular", "Modular",       "The Modular",        "modular", False),
    ("rapat",   "Rapat",         "The Tight",          "elips",   False),
]


def svg_file(key, name, en, kind, cross, col, bg=None):
    defs, body, w, h = mark(kind, cross, key + ("w" if col != "#0e1418" else ""), col)
    plate = box(-w * 0.12, -h * 0.2, w * 1.24, h * 1.4, bg) if bg else ""
    vb = ("%.2f %.2f %.2f %.2f" % (-w * 0.12, -h * 0.2, w * 1.24, h * 1.4)) if bg \
        else ("0 0 %.2f %.2f" % (w, h))
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s" width="%.0f" height="%.0f" '
            'role="img" aria-label="SF — %s"><title>SF — %s (%s)</title>'
            '<defs>%s</defs>%s%s</svg>\n'
            % (vb, w, h, en, name, en, defs, plate, body))


def symbols():
    """Sisipan <symbol> untuk halaman usulan; warna diwarisi dari halaman."""
    out = ['<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>']
    for key, _, _, kind, cross in CANDIDATES:
        defs, body, w, h = mark(kind, cross, key)
        out.append(defs)
        out.append('<symbol id="sf-%s" viewBox="0 0 %.2f %.2f">%s</symbol>' % (key, w, h, body))
    out.append("</defs></svg>")
    return "\n  ".join(out)


def viewboxes():
    vb = {}
    for key, _, _, kind, cross in CANDIDATES:
        _, _, w, h = mark(kind, cross, "vb" + key)
        vb[key] = (w, h)
    return vb


# ── kunci logo ───────────────────────────────────────────────────────────
LEVELS = [
    ("nama",   ["SUSTAINABLE", "FUTURES"], []),
    ("semboyan", ["SUSTAINABLE", "FUTURES"], ["FUTURES IN ACTION"]),
    ("edisi",  ["SUSTAINABLE", "FUTURES"], ["FUTURES IN ACTION", "SAMARINDA 2045"]),
]
FACE = "Outfit,'Segoe UI',system-ui,sans-serif"


def lockup(key, kind, cross, big, small, col="#0e1418", uid=""):
    """Tanda di kiri, tulisan di kanan. Tinggi tanda 100; tulisan diukur
    terhadapnya, bukan terhadap ukuran cetak."""
    defs, body, mw, _ = mark(kind, cross, key + "L" + uid, col)
    cap, lead = 30.0, 34.0
    sub, subl = 11.5, 16.0
    x = mw + 30.0
    n = len(big) * lead + (subl * len(small) + 9.0 if small else 0.0)
    y = (H - n) / 2.0 + cap
    t = []
    for line in big:
        t.append('<text x="%.1f" y="%.1f" font-family="%s" font-size="%.1f" font-weight="600" '
                 'letter-spacing="-.005em" fill="%s">%s</text>' % (x, y, FACE, cap, col, line))
        y += lead
    if small:
        y += 9.0 - lead + subl - 4.0
        for line in small:
            t.append('<text x="%.1f" y="%.1f" font-family="%s" font-size="%.1f" '
                     'font-weight="300" letter-spacing=".22em" fill="%s" opacity=".72">%s</text>'
                     % (x, y, FACE, sub, col, line))
            y += subl
    longest = max(len(l) for l in big) * cap * 0.60
    if small:
        longest = max(longest, max(len(l) for l in small) * sub * 0.82)
    return defs, body + "".join(t), x + longest, H


# ── lembar usulan ────────────────────────────────────────────────────────
NOTE = {
    "anyam":    "S lewat di depan tiang F. Celahnya satu ukuran, di mana pun mereka bertemu.",
    "modanyam": "Silang yang sama, hurufnya dibangun dari bar dan belokan seperempat.",
    "modular":  "Tanpa silang. Paling tenang, paling aman di ukuran kecil.",
    "rapat":    "Tanpa silang, huruf elips. Pembanding paling polos.",
}
CRIT = ["Kekhasan", "Mudah diingat", "Kesederhanaan", "Perpaduan huruf", "Kesan profesional",
        "Skalabilitas", "Kaitan keberlanjutan", "Kaitan masa depan", "Layar", "Cetak"]
SCORE = {
    "anyam":    [8, 8, 6, 9, 8, 7, 7, 8, 8, 7],
    "modanyam": [7, 7, 6, 8, 8, 7, 7, 7, 8, 7],
    "modular":  [5, 5, 9, 4, 8, 9, 4, 5, 9, 9],
    "rapat":    [4, 4, 9, 4, 7, 9, 4, 5, 9, 9],
}
REJECTED = [
    ("Ruang negatif", 3, "F hilang, yang tersisa hanya S"),
    ("Pita menerus", 2, "tidak terbaca sebagai huruf"),
    ("Berpita lurus", 2, "S terbaca sebagai E"),
    ("Lingkaran murni", 5, "S mengecil jadi huruf kecil"),
    ("Belokan", 2, "tidak terbaca"),
    ("Bukaan", 2, "terbaca sebagai Œ"),
    ("Ligatur palang atas", 3, "terbaca sebagai SH"),
    ("Salin-silang", 4, "S rusak di titik tindih"),
]

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box}
body{margin:0;background:#fbfbfa;color:#0e1418;font:400 15px/1.6 Outfit,system-ui,sans-serif;
     -webkit-font-smoothing:antialiased}
.wrap{max-width:1120px;margin:0 auto;padding:56px 28px 100px}
.lbl{font:500 10px/1 'JetBrains Mono',monospace;letter-spacing:.22em;text-transform:uppercase;
     color:#8b949b}
h1{font:200 62px/1 Outfit;letter-spacing:-.03em;margin:14px 0 10px}
h1 b{font-weight:600}
h2{font:300 30px/1.15 Outfit;letter-spacing:-.02em;margin:0 0 6px}
.lede{max-width:56ch;color:#4b555e;margin:0}
.rule{height:1px;background:#e2e2dd;margin:56px 0 26px}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.card{border:1px solid #e2e2dd;background:#fff;border-radius:4px;overflow:hidden}
.plate{display:grid;place-items:center;padding:44px 30px;min-height:190px}
.plate svg{width:auto;height:104px}
.pair{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #e2e2dd}
.pair div{display:grid;place-items:center;padding:22px}
.pair div:last-child{background:#0e1418;border-left:1px solid #e2e2dd}
.pair svg{height:44px;width:auto}
.meta{padding:18px 22px 22px;border-top:1px solid #e2e2dd}
.meta h3{font:600 19px/1 Outfit;margin:0 0 3px;display:flex;align-items:baseline;gap:9px}
.meta h3 em{font:500 10px/1 'JetBrains Mono',monospace;letter-spacing:.16em;color:#8b949b;
            font-style:normal;text-transform:uppercase}
.meta p{margin:6px 0 0;color:#4b555e;font-size:13.5px;line-height:1.5}
.sizes{display:flex;align-items:flex-end;gap:16px;padding:16px 22px;border-top:1px solid #e2e2dd}
.sizes span{display:flex;flex-direction:column;align-items:center;gap:5px}
.sizes i{font:400 9px/1 'JetBrains Mono',monospace;color:#a8b0b6;font-style:normal}
table{border-collapse:collapse;width:100%;font-size:13.5px}
th,td{text-align:left;padding:9px 10px;border-bottom:1px solid #eceeea}
th{font:500 10px/1.3 'JetBrains Mono',monospace;letter-spacing:.12em;text-transform:uppercase;
   color:#8b949b;vertical-align:bottom}
td.n,th.n{text-align:center;font-family:'JetBrains Mono',monospace;width:98px}
tr.tot td{font-weight:600;border-bottom:none;border-top:2px solid #0e1418}
td.win{background:#f2f4f2}
.reject{columns:2;column-gap:34px;font-size:13.5px;color:#4b555e}
.reject div{break-inside:avoid;padding:7px 0;border-bottom:1px solid #eceeea}
.reject b{font-weight:500;color:#0e1418}
.reject i{font:400 11px/1 'JetBrains Mono',monospace;color:#a8b0b6;font-style:normal;float:right}
.locks{display:grid;gap:16px}
.lock{border:1px solid #e2e2dd;background:#fff;border-radius:4px;padding:34px 38px}
.lock svg{height:74px;width:auto}
.deliver{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.deliver div{border:1px solid #e2e2dd;background:#fff;border-radius:4px;display:grid;
             place-items:center;padding:34px}
.deliver div:nth-child(2){background:#0e1418;border-color:#0e1418}
.deliver svg{height:60px;width:auto}
.cap{font:400 11px/1.4 'JetBrains Mono',monospace;color:#a8b0b6;margin:8px 0 0;text-align:center}
@media(max-width:760px){.grid,.deliver{grid-template-columns:1fr}.reject{columns:1}h1{font-size:44px}}
"""


def _svg(defs, body, w, h, height=None, cls=""):
    hh = ' height="%s"' % height if height else ""
    return ('<svg viewBox="0 0 %.2f %.2f"%s class="%s" xmlns="http://www.w3.org/2000/svg">'
            '<defs>%s</defs>%s</svg>' % (w, h, hh, cls, defs, body))


def page():
    o = []
    vb = viewboxes()
    for i, (key, name, en, kind, cross) in enumerate(CANDIDATES, 1):
        w, h = vb[key]
        d1, b1, _, _ = mark(kind, cross, key + "p1", "#0e1418")
        d2, b2, _, _ = mark(kind, cross, key + "p2", "#0e1418")
        d3, b3, _, _ = mark(kind, cross, key + "p3", "#ffffff")
        sizes = ""
        for px in (64, 48, 32, 24, 16):
            dz, bz, _, _ = mark(kind, cross, "%s%d" % (key, px), "#0e1418")
            sizes += "<span>%s<i>%d</i></span>" % (_svg(dz, bz, w, h, px), px)
        o.append(
            '<article class="card"><div class="plate">%s</div>'
            '<div class="pair"><div>%s</div><div>%s</div></div>'
            '<div class="sizes">%s</div>'
            '<div class="meta"><h3>%02d %s <em>%s</em></h3><p>%s</p>'
            '<p style="color:#a8b0b6;font-family:JetBrains Mono,monospace;font-size:11px;'
            'margin-top:9px">rasio %.2f &middot; nilai %d</p></div></article>'
            % (_svg(d1, b1, w, h), _svg(d2, b2, w, h), _svg(d3, b3, w, h), sizes,
               i, name, en, NOTE[key], w / h, sum(SCORE[key])))
    cards = "".join(o)

    head = "".join('<th class="n">%02d</th>' % i for i in range(1, 5))
    rows = ""
    for j, c in enumerate(CRIT):
        cells = "".join('<td class="n%s">%d</td>'
                        % (" win" if k == 0 else "", SCORE[key][j])
                        for k, (key, *_r) in enumerate(CANDIDATES))
        rows += "<tr><td>%s</td>%s</tr>" % (c, cells)
    tot = "".join('<td class="n%s">%d</td>' % (" win" if k == 0 else "", sum(SCORE[key]))
                  for k, (key, *_r) in enumerate(CANDIDATES))
    table = ('<table><thead><tr><th>Kriteria</th>%s</tr></thead><tbody>%s'
             '<tr class="tot"><td>Jumlah</td>%s</tr></tbody></table>' % (head, rows, tot))

    rej = "".join('<div><b>%s</b> — %s<i>%d</i></div>' % (n, why, s) for n, s, why in REJECTED)

    key, name, en, kind, cross = CANDIDATES[0]
    w, h = vb[key]
    dp, bp, _, _ = mark(kind, cross, "dl1", "#0e1418")
    dr, br, _, _ = mark(kind, cross, "dl2", "#ffffff")
    dm, bm, _, _ = mark(kind, cross, "dl3", "#6f7a81")
    deliver = ('<div class="deliver"><div>%s</div><div>%s</div><div>%s</div></div>'
               % (_svg(dp, bp, w, h), _svg(dr, br, w, h), _svg(dm, bm, w, h)))

    locks = ""
    for tag, big, small in LEVELS:
        d, b, lw, lh = lockup(key, kind, cross, big, small, uid=tag)
        locks += '<div class="lock">%s</div>' % _svg(d, b, lw, lh)

    return """<!DOCTYPE html>
<html lang="id"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>SF — Usulan Logo</title><style>%s</style></head><body><div class="wrap">
<span class="lbl">Usulan logo &middot; hitam putih</span>
<h1>S<b>F</b></h1>
<p class="lede">Empat usulan. Dua memakai satu gagasan yang sama — S lewat di depan tiang F —
dan dua sisanya tanpa silang, sebagai pembanding. Warna menyusul setelah bentuknya dipilih.</p>

<div class="rule"></div>
<div class="grid">%s</div>

<div class="rule"></div>
<span class="lbl">Penilaian</span><h2>Nilai 1–10</h2>
<p class="lede" style="margin-bottom:22px">Diisi kritis. Usulan 03 dan 04 memang menang di
kesederhanaan dan cetak, tetapi kalah di perpaduan huruf — di situ letak persoalannya.</p>
%s

<div class="rule"></div>
<span class="lbl">Yang ditolak</span><h2>Delapan arah yang tidak dilanjutkan</h2>
<p class="lede" style="margin-bottom:22px">Dicoba, digambar, lalu dibuang. Alasannya satu baris.</p>
<div class="reject">%s</div>

<div class="rule"></div>
<span class="lbl">Pilihan kami</span><h2>01 Anyam</h2>
<p class="lede" style="margin-bottom:22px">Satu-satunya yang membuat dua huruf terbaca sebagai
satu benda. Celah di titik silang punya lebar tetap, jadi ukuran itu bisa dipakai lagi di
seluruh materi. Tidak bergantung pada warna, dan masih terbaca di 16 px.</p>
%s
<p class="cap">tanda &middot; tanda dibalik &middot; uji abu-abu</p>

<div class="rule"></div>
<span class="lbl">Kunci logo</span><h2>Tiga tingkat</h2>
<p class="lede" style="margin-bottom:22px">Tanda tidak berubah. Yang bertambah hanya baris
tulisan, dan baris edisi yang berganti kota.</p>
<div class="locks">%s</div>
<p class="cap">tulisan masih memakai fonta; setelah bentuk disetujui, hurufnya dijadikan kurva</p>
</div></body></html>
""" % (CSS, cards, table, rej, deliver, locks)


def build():
    os.makedirs(OUT, exist_ok=True)
    for i, (key, name, en, kind, cross) in enumerate(CANDIDATES, 1):
        io.open(os.path.join(OUT, "sf-%d-%s.svg" % (i, key)), "w", encoding="utf-8",
                newline="\n").write(svg_file(key, name, en, kind, cross, "#0e1418"))
        io.open(os.path.join(OUT, "sf-%d-%s-putih.svg" % (i, key)), "w", encoding="utf-8",
                newline="\n").write(svg_file(key, name, en, kind, cross, "#ffffff", "#0e1418"))
        w, h = viewboxes()[key]
        print("tulis: sf-%d-%s.svg  (%.2f x %.0f, rasio %.2f)" % (i, key, w, h, w / h))

    key, name, en, kind, cross = CANDIDATES[0]
    for j, (tag, big, small) in enumerate(LEVELS, 5):
        d, b, w, h = lockup(key, kind, cross, big, small)
        io.open(os.path.join(OUT, "sf-%d-kunci-%s.svg" % (j, tag)), "w", encoding="utf-8",
                newline="\n").write(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.2f %.2f" width="%.0f" '
            'height="%.0f" role="img" aria-label="SF lockup %s"><defs>%s</defs>%s</svg>\n'
            % (w, h, w, h, tag, d, b))
        print("tulis: sf-%d-kunci-%s.svg" % (j, tag))
    io.open(PAGE, "w", encoding="utf-8", newline="\n").write(page())
    print("tulis: klien/logo_sf.html")
    print("catatan: tulisan pada kunci logo masih memakai fonta; setelah bentuk "
          "disetujui, hurufnya dijadikan kurva.")


if __name__ == "__main__":
    build()
