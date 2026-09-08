# -*- coding: utf-8 -*-
"""Sumber tunggal geometri monogram SF — putaran kelima.

Putaran keempat memakai huruf yang benar tetapi bidang yang salah: tandanya
2,22 kali lebih lebar daripada tinggi, jadi setiap bidang persegi — ikon, token,
avatar, favicon — hanya menampung sedikit tinta di tengah lautan ruang kosong.
Putaran ini merapatkan hurufnya (1,59) dan menambahkan satu hal yang belum ada:
bidang. Sudut 45 derajat tidak lagi hanya memotong ujung huruf, tetapi juga
memotong sudut bidangnya, sehingga bentuk wadah dan bentuk huruf memakai satu
aturan yang sama.

Yang tidak berubah: S tetap dibangun dari dua elips yang benar-benar
bersinggungan, dan sudut ujungnya tetap dihitung, bukan dikira-kira.

Keluaran:
  1. brand/logo/*.svg   — versi gradasi dan versi satu warna
  2. brand/logo/sf-favicon.svg
  3. sisipan <symbol> dan viewBox di klien/identitas_sf.html

Jalankan: python tools/build_brand.py
"""

import io
import math
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "brand", "logo")
PAGE = os.path.join(ROOT, "klien", "identitas_sf.html")

# ── warna ────────────────────────────────────────────────────────────────
# Empat warna gradasi bukan pilihan rupa. Nilainya milik City Indicator di
# panduan permainan, dicerahkan seperlunya agar tetap hidup pada cetak kecil.
ENVIRONMENT = "#16a06f"
READINESS   = "#2f7fe0"
SOCIETY     = "#8b5cf6"
ECONOMY     = "#f0a92a"
INK         = "#0e1418"

GRAD_ID = "sfg"
GRADIENT = ('<linearGradient id="%s" x1="0" y1="1" x2="1" y2="0">'
            '<stop offset="0" stop-color="%s"/><stop offset=".36" stop-color="%s"/>'
            '<stop offset=".72" stop-color="%s"/><stop offset="1" stop-color="%s"/>'
            '</linearGradient>' % (GRAD_ID, ENVIRONMENT, READINESS, SOCIETY, ECONOMY))
GRAD_FILL = "url(#%s)" % GRAD_ID

# ── grid huruf ───────────────────────────────────────────────────────────
H   = 100.0        # tinggi huruf besar
W   = 26.0         # tebal sapuan, satu-satunya bobot di seluruh sistem
RY  = (H - W) / 4.0   # jari-jari tegak tiap mangkuk S
RX  = 28.0            # jari-jari datar tiap mangkuk S
CX  = RX + W / 2.0
Y1  = W / 2.0 + RY
S_W = 2 * RX + W   # lebar huruf S
GAP = 10.0         # jarak S ke F
A1  = 54.0         # panjang lengan atas F
A2  = 44.0         # panjang lengan tengah F
YM  = 40.0         # tinggi lengan tengah F
FX  = S_W + GAP
MARK_W = FX + A1 + W / 2.0
CUT = 45           # satu-satunya sudut potong di seluruh sistem

# ── grid bidang ──────────────────────────────────────────────────────────
PAD    = 0.12      # jarak tepi bidang persegi, diukur dari lebar monogram
CHAMF  = 0.26      # panjang potongan sudut, dibanding sisi bidang
NUDGE  = (3.0, -3.0)   # huruf digeser menjauhi sudut yang dipotong
DISC   = 1.18      # garis tengah cakram, dibanding lebar monogram
SLIT   = 5.0       # lebar celah pada penyetelan Iris
SLIDE  = 4.0       # jarak luncur belahan atas, sepanjang celah itu


def _term(rx, ry):
    """Sudut parametrik tempat garis singgung elips miring 135 derajat."""
    return math.degrees(math.atan2(ry, rx))


def _pt(cx, cy, rx, ry, t):
    r = math.radians(t)
    return (cx + rx * math.cos(r), cy - ry * math.sin(r))


def s_ends():
    """Kedua titik ujung S, tempat bidang potong 45 derajat jatuh."""
    t = _term(RX, RY)
    return _pt(CX, Y1, RX, RY, t), _pt(CX, Y1 + 2 * RY, RX, RY, t + 180.0)


def s_path():
    """Dua elips bersinggungan di satu titik, arah singgungnya mendatar."""
    a, b = s_ends()
    return ("M%.2f %.2f A%.2f %.2f 0 1 0 %.2f %.2f A%.2f %.2f 0 1 1 %.2f %.2f"
            % (a[0], a[1], RX, RY, CX, Y1 + RY, RX, RY, b[0], b[1]))


def s_glyph(fill):
    return ('<path d="%s" fill="none" stroke="%s" stroke-width="%g" stroke-linecap="butt"/>'
            % (s_path(), fill, W))


def f_glyph(fill, point=True):
    """F padat. point: lengan atas berujung runcing, jadi huruf ikut menunjuk."""
    xe = FX + A1
    if point:
        stem = ("M%g 0 H%g L%g %g L%g %g H%g V%g H%g Z"
                % (FX, xe, xe + W / 2.0, W / 2.0, xe, W, FX + W, H, FX))
    else:
        stem = ("M%g 0 H%g L%g %g H%g V%g H%g Z"
                % (FX, xe + W / 2.0, xe - W / 2.0, W, FX + W, H, FX))
    xm = FX + A2
    mid = ("M%g %g H%g L%g %g H%g Z"
           % (FX + W, YM, xm + W / 2.0, xm - W / 2.0, YM + W, FX + W))
    return '<path d="%s %s" fill="%s"/>' % (stem, mid, fill)


def monogram(fill, point=True):
    return s_glyph(fill) + f_glyph(fill, point)


def tick(x, y, size, sw, fill, cap="square"):
    """Panah 45 derajat untuk logotype. Digambar, bukan diambil dari fonta,
    supaya sudut dan bobotnya sama persis dengan potongan pada huruf."""
    ax, ay = x + size, y - size
    L = size * 0.42
    shaft = "M%.2f %.2f L%.2f %.2f" % (x, y, ax, ay)
    head = "M%.2f %.2f H%.2f V%.2f" % (ax - L, ay, ax, ay + L)
    return ('<g fill="none" stroke="%s" stroke-width="%g" stroke-linecap="%s" '
            'stroke-linejoin="miter"><path d="%s"/><path d="%s"/></g>'
            % (fill, sw, cap, shaft, head))


# ── potongan miring ──────────────────────────────────────────────────────
def sliced(art, uid, slit=SLIT, slide=SLIDE):
    """Satu potongan 45 derajat menembus seluruh tanda.

    Belahan atas meluncur *sepanjang* potongan itu, bukan menyeberanginya,
    sehingga lebar celah tidak berubah dan kedua bidang potong tetap sejajar.
    """
    c = MARK_W / 2.0 + H / 2.0
    k1 = c - 0.70711 * slit
    k2 = c + 0.70711 * slit
    o = slide * 0.70711
    B = 900.0
    clips = ('<clipPath id="ca%s" clipPathUnits="userSpaceOnUse">'
             '<path d="M%g %g H%g L%g %g Z"/></clipPath>'
             '<clipPath id="cb%s" clipPathUnits="userSpaceOnUse">'
             '<path d="M%g %g H%g L%g %g Z"/></clipPath>'
             % (uid, -B, -B, k1 + B, -B, k1 + B,
                uid, B, B, k2 - B, B, k2 - B))
    body = ('<g transform="translate(%.3f %.3f)"><g clip-path="url(#ca%s)">%s</g></g>'
            '<g clip-path="url(#cb%s)">%s</g>' % (o, -o, uid, art, uid, art))
    return clips, body, o


# ── bidang ───────────────────────────────────────────────────────────────
def _field(fill, uid, shape, d, art):
    """Monogram dilubangkan dari sebuah bidang. Huruf menjadi lubang, jadi
    yang terbaca pada sablon satu warna adalah bahan di baliknya."""
    ox = (d - MARK_W) / 2.0 + NUDGE[0]
    oy = (d - H) / 2.0 + NUDGE[1]
    mask = ('<mask id="mk%s" maskUnits="userSpaceOnUse" x="0" y="0" width="%g" height="%g">'
            '<rect width="%g" height="%g" fill="#fff"/>'
            '<g transform="translate(%.2f %.2f)">%s</g></mask>'
            % (uid, d, d, d, d, ox, oy, art))
    return mask, '<path d="%s" fill="%s" mask="url(#mk%s)"/>' % (shape, fill, uid)


def _square(d, chamfer=CHAMF):
    """Persegi dengan sudut kiri-atas dipotong 45 derajat — sejajar dengan
    potongan ujung huruf, dan searah dengannya."""
    c = d * chamfer
    return "M%.2f 0 H%.2f V%.2f H0 V%.2f Z" % (c, d, d, c)


def build_blok(fill, uid, pad=PAD, chamfer=CHAMF):
    d = MARK_W * (1 + pad)
    mask, body = _field(fill, uid, _square(d, chamfer), d, monogram("#000"))
    return mask, body, d, d


def build_mark(fill, uid):
    return "", monogram(fill), MARK_W, H


def build_cakram(fill, uid):
    d = MARK_W * DISC
    circle = ("M%.2f %.2f A%.2f %.2f 0 1 0 %.2f %.2f A%.2f %.2f 0 1 0 %.2f %.2f Z"
              % (0, d / 2, d / 2, d / 2, d, d / 2, d / 2, d / 2, 0, d / 2))
    mask, body = _field(fill, uid, circle, d, monogram("#000"))
    return mask, body, d, d


def build_iris(fill, uid):
    """Blok dengan satu potongan miring menembusnya. Penyetelan ekspresif,
    bukan tanda kedua: hurufnya sama, hanya dipotong sekali."""
    d = MARK_W * (1 + PAD)
    clips, art, _ = sliced(monogram("#000"), uid)
    mask, body = _field(fill, uid, _square(d), d, art)
    return clips + mask, body, d, d


def build_construction(fill, uid):
    """Diagram konstruksi: elips, titik singgung, dan bukti bahwa potongan
    sudut bidang sejajar dengan potongan ujung huruf."""
    d = MARK_W * (1 + PAD)
    ox = (d - MARK_W) / 2.0 + NUDGE[0]
    oy = (d - H) / 2.0 + NUDGE[1]
    a, b = s_ends()
    hair = 'stroke="%s" fill="none" stroke-width="1.2" opacity=".40"' % fill
    dash = 'stroke="%s" fill="none" stroke-width="1.2" stroke-dasharray="5 4" opacity=".40"' % fill

    g = ['<path d="%s" fill="none" %s/>' % (_square(d), hair)]
    # garis 45 derajat menembus potongan sudut bidang
    c = d * CHAMF
    g.append('<path d="M%.2f %.2f L%.2f %.2f" %s/>' % (-30, c + 30, c + 30, -30, dash))

    inner = ['<g opacity=".12">%s</g>' % monogram(fill)]
    inner.append('<ellipse cx="%g" cy="%g" rx="%g" ry="%g" %s/>' % (CX, Y1, RX, RY, hair))
    inner.append('<ellipse cx="%g" cy="%g" rx="%g" ry="%g" %s/>'
                 % (CX, Y1 + 2 * RY, RX, RY, hair))
    inner.append('<path d="M%g %g H%g" %s/>' % (0, Y1 + RY, MARK_W, dash))
    inner.append('<circle cx="%g" cy="%g" r="3.0" fill="%s"/>' % (CX, Y1 + RY, fill))
    # ketiga bidang potong huruf, semuanya sejajar dengan potongan sudut bidang
    for p in (a, b):
        inner.append('<path d="M%.2f %.2f l-30 30 M%.2f %.2f l30 -30" %s/>'
                     % (p[0], p[1], p[0], p[1], dash))
        inner.append('<circle cx="%.2f" cy="%.2f" r="3.0" fill="%s"/>' % (p[0], p[1], fill))
    xe = FX + A1
    inner.append('<path d="M%g %g l-26 -26 M%g %g l-26 26" %s/>'
                 % (xe + W / 2.0, W / 2.0, xe + W / 2.0, W / 2.0, dash))
    inner.append('<path d="M%g 0 V%g M%g 0 V%g" %s/>' % (FX, H, FX + W, H, dash))
    g.append('<g transform="translate(%.2f %.2f)">%s</g>' % (ox, oy, "".join(inner)))
    return "", "".join(g), d, d


def build_lama(fill, uid):
    """Tanda putaran keempat, digambar ulang di sini hanya untuk pembanding.

    Angka-angkanya sengaja ditulis lokal dan tidak dipakai di tempat lain, supaya
    halaman perbandingan tidak pernah menampilkan bentuk yang sudah usang, dan
    supaya tak ada satu pun tetapan lama yang bocor ke tanda sekarang.
    """
    h, w = 100.0, 28.0
    ry, rx = (h - w) / 4.0, 42.0
    cx, y1 = rx + w / 2.0, w / 2.0 + ry
    fx = 2 * rx + w + 22.0
    a1, a2, ym = 74.0, 60.0, 42.0
    t = math.degrees(math.atan2(ry, rx))
    a = _pt(cx, y1, rx, ry, t)
    b = _pt(cx, y1 + 2 * ry, rx, ry, t + 180.0)
    s = ('<path d="M%.2f %.2f A%.2f %.2f 0 1 0 %.2f %.2f A%.2f %.2f 0 1 1 %.2f %.2f" '
         'fill="none" stroke="%s" stroke-width="%g" stroke-linecap="butt"/>'
         % (a[0], a[1], rx, ry, cx, y1 + ry, rx, ry, b[0], b[1], fill, w))
    xe, xm = fx + a1, fx + a2
    f = ('<path d="M%g 0 H%g L%g %g L%g %g H%g V%g H%g Z '
         'M%g %g H%g L%g %g H%g Z" fill="%s"/>'
         % (fx, xe, xe + w / 2.0, w / 2.0, xe, w, fx + w, h, fx,
            fx + w, ym, xm + w / 2.0, xm - w / 2.0, ym + w, fx + w, fill))
    return "", s + f, fx + a1 + w / 2.0, h


BUILDERS = {
    "blok":   build_blok,
    "mark":   build_mark,
    "cakram": build_cakram,
    "iris":   build_iris,
    "construction": build_construction,
    "lama":   build_lama,
}
ORDER = ["blok", "mark", "cakram", "iris"]
EXTRA = ["construction", "lama"]

NAMES = {
    "blok":   ("Blok", "The Block"),
    "mark":   ("Monogram", "The Monogram"),
    "cakram": ("Cakram", "The Disc"),
    "iris":   ("Blok Iris", "The Sliced Block"),
}

DESCS = {
    "blok":   "Monogram SF dilubangkan dari bidang persegi bersudut potong 45 derajat.",
    "mark":   "Monogram SF berdiri sendiri; lengan atas F berujung runcing.",
    "cakram": "Monogram SF dilubangkan dari cakram penuh.",
    "iris":   "Blok dengan satu potongan 45 derajat menembusnya.",
}


def svg_file(key, fill, uid):
    defs, body, w, h = BUILDERS[key](fill, uid)
    id_, en = NAMES[key]
    gradient = GRADIENT if fill == GRAD_FILL else ""
    dblock = "<defs>%s%s</defs>" % (gradient, defs) if (gradient or defs) else ""
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.2f %.2f" width="%.0f" '
            'height="%.0f" role="img" aria-label="SF — %s">'
            '<title>SF — %s (%s)</title><desc>%s</desc>%s%s</svg>\n'
            % (w, h, w, h, en, id_, en, DESCS[key], dblock, body))


def symbols_block():
    out = ['<svg width="0" height="0" style="position:absolute" aria-hidden="true" '
           'focusable="false"><defs>', GRADIENT]
    for key in ORDER + EXTRA:
        for suffix, fill in (("", GRAD_FILL), ("-k", "currentColor")):
            uid = key + suffix.replace("-", "")
            defs, body, w, h = BUILDERS[key](fill, uid)
            out.append(defs)
            out.append('<symbol id="sf-%s%s" viewBox="0 0 %.2f %.2f">%s</symbol>'
                       % (key, suffix, w, h, body))
    out.append('<symbol id="sf-tick" viewBox="0 0 100 100">%s</symbol>'
               % tick(12, 84, 66, 11, "currentColor"))
    out.append("</defs></svg>")
    return "\n  ".join(x for x in out if x)


def viewboxes():
    vb = {}
    for key in ORDER + EXTRA:
        _, _, w, h = BUILDERS[key](GRAD_FILL, "vb" + key)
        vb[key] = "0 0 %.2f %.2f" % (w, h)
    vb["tick"] = "0 0 100 100"
    return vb


def set_viewboxes(raw):
    """Isi viewBox pada setiap <svg data-mk="...">.

    Halaman menulis penanda, bukan angka, sehingga perubahan bentuk tidak pernah
    meninggalkan ukuran lama di halaman presentasi.
    """
    vb = viewboxes()
    n = [0]

    def one(m):
        tag, key = m.group(0), m.group(1)
        if key not in vb:
            return tag
        tag = re.sub(r'\s*viewBox="[^"]*"', "", tag)
        n[0] += 1
        return tag.replace("<svg ", '<svg viewBox="%s" ' % vb[key], 1)

    return re.sub(r'<svg [^>]*data-mk="([a-z]+)"[^>]*>', one, raw), n[0]


def inject(path, block):
    if not os.path.exists(path):
        print("lewati sisipan, halaman belum ada:", os.path.basename(path))
        return
    raw = io.open(path, encoding="utf-8").read()
    a, b = "<!-- SF:SYMBOLS -->", "<!-- /SF:SYMBOLS -->"
    if a not in raw or b not in raw:
        print("lewati sisipan, penanda tidak ditemukan")
        return
    raw = raw[:raw.index(a) + len(a)] + "\n  " + block + "\n  " + raw[raw.index(b):]
    raw, count = set_viewboxes(raw)
    io.open(path, "w", encoding="utf-8", newline="\n").write(raw)
    print("sisip: symbol + %d viewBox ke %s" % (count, os.path.basename(path)))


def favicon():
    """Blok versi rapat: pada 16 piksel, ruang kosong lebih mahal daripada
    keanggunan, dan bidang persegi mengisi kisi piksel lebih baik daripada cakram."""
    defs, body, d, _ = build_blok(GRAD_FILL, "fav", pad=0.03, chamfer=0.24)
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.2f %.2f" width="64" height="64">'
            '<defs>%s%s</defs>%s</svg>\n' % (d, d, GRADIENT, defs, body))


def build():
    os.makedirs(OUT, exist_ok=True)
    for i, key in enumerate(ORDER, 1):
        for suffix, fill in (("", GRAD_FILL), ("-mono", INK)):
            name = "sf-%d-%s%s.svg" % (i, key, suffix)
            uid = key + suffix.replace("-", "")
            io.open(os.path.join(OUT, name), "w", encoding="utf-8",
                    newline="\n").write(svg_file(key, fill, uid))
            print("tulis:", name)
    io.open(os.path.join(OUT, "sf-favicon.svg"), "w", encoding="utf-8",
            newline="\n").write(favicon())
    print("tulis: sf-favicon.svg")
    print("rasio monogram: %.2f  (putaran 4: 2,22)" % (MARK_W / H))
    inject(PAGE, symbols_block())


if __name__ == "__main__":
    build()
