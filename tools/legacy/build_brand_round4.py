# -*- coding: utf-8 -*-
"""Sumber tunggal geometri monogram SF.

Huruf tidak digambar bebas. S dibangun dari dua elips yang benar-benar
bersinggungan, dan sudut kedua ujungnya dihitung, bukan dikira-kira: dicari
titik yang garis singgungnya 135 derajat, supaya potongan ujungnya jatuh tepat
45 derajat — sudut yang sama dengan panah. F memakai potongan yang sama.
Itu sebabnya seluruh tanda terasa satu sistem, bukan dua huruf yang didekatkan.

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
W   = 28.0         # tebal sapuan, satu-satunya bobot di seluruh sistem
RY  = (H - W) / 4.0   # jari-jari tegak tiap mangkuk S
RX  = 42.0            # jari-jari datar tiap mangkuk S
CX  = RX + W / 2.0
Y1  = W / 2.0 + RY
S_W = 2 * RX + W   # lebar huruf S
GAP = 22.0         # jarak S ke F
A1  = 74.0         # panjang lengan atas F
A2  = 60.0         # panjang lengan tengah F
YM  = 42.0         # tinggi lengan tengah F
FX  = S_W + GAP
MARK_W = FX + A1 + W / 2.0
CUT = 45           # satu-satunya sudut potong di seluruh sistem


def _term(rx, ry):
    """Sudut parametrik tempat garis singgung elips miring 135 derajat."""
    return math.degrees(math.atan2(ry, rx))


def _pt(cx, cy, rx, ry, t):
    r = math.radians(t)
    return (cx + rx * math.cos(r), cy - ry * math.sin(r))


def s_path():
    """Dua elips bersinggungan di satu titik, arah singgungnya mendatar."""
    t = _term(RX, RY)
    y2 = Y1 + RY + RY
    a = _pt(CX, Y1, RX, RY, t)
    j = (CX, Y1 + RY)
    b = _pt(CX, y2, RX, RY, t + 180.0)
    return ("M%.2f %.2f A%.2f %.2f 0 1 0 %.2f %.2f A%.2f %.2f 0 1 1 %.2f %.2f"
            % (a[0], a[1], RX, RY, j[0], j[1], RX, RY, b[0], b[1]))


def s_glyph(fill):
    return ('<path d="%s" fill="none" stroke="%s" stroke-width="%g" stroke-linecap="butt"/>'
            % (s_path(), fill, W))


def f_glyph(fill, point=True, both=False):
    """F padat. point: lengan atas berujung runcing, jadi huruf ikut menunjuk."""
    if point:
        xe = FX + A1
        stem = ("M%g 0 H%g L%g %g L%g %g H%g V%g H%g Z"
                % (FX, xe, xe + W / 2.0, W / 2.0, xe, W, FX + W, H, FX))
    else:
        stem = ("M%g 0 H%g L%g %g H%g V%g H%g Z"
                % (FX, FX + A1 + W / 2.0, FX + A1 - W / 2.0, W, FX + W, H, FX))
    if both:
        xm = FX + A2
        mid = ("M%g %g H%g L%g %g L%g %g H%g Z"
               % (FX + W, YM, xm, xm + W / 2.0, YM + W / 2.0, xm, YM + W, FX + W))
    else:
        mid = ("M%g %g H%g L%g %g H%g Z"
               % (FX + W, YM, FX + A2 + W / 2.0, FX + A2 - W / 2.0, YM + W, FX + W))
    return '<path d="%s %s" fill="%s"/>' % (stem, mid, fill)


def tick(x, y, size, sw, fill, cap="square"):
    """Panah 45 derajat untuk logotype. Digambar, bukan diambil dari fonta,
    supaya sudutnya persis sama dengan potongan pada huruf."""
    ax, ay = x + size, y - size
    L = size * 0.42
    shaft = "M%.2f %.2f L%.2f %.2f" % (x, y, ax, ay)
    head = "M%.2f %.2f H%.2f V%.2f" % (ax - L, ay, ax, ay + L)
    return ('<g fill="none" stroke="%s" stroke-width="%g" stroke-linecap="%s" '
            'stroke-linejoin="miter"><path d="%s"/><path d="%s"/></g>'
            % (fill, sw, cap, shaft, head))


# ── tiga susunan ─────────────────────────────────────────────────────────
def build_mark(fill, uid):
    return "", s_glyph(fill) + f_glyph(fill, point=True), MARK_W, H


def build_double(fill, uid):
    return "", s_glyph(fill) + f_glyph(fill, point=True, both=True), MARK_W, H


def build_quiet(fill, uid):
    return "", s_glyph(fill) + f_glyph(fill, point=False), MARK_W, H


def build_badge(fill, uid):
    """Monogram dilubangkan dari satu cakram penuh, untuk bidang persegi."""
    # Cakram diukur dari lebar monogram, bukan tingginya. Monogram ini lebih
    # dari dua kali lebih lebar daripada tinggi, jadi lebarnya yang menentukan.
    d = MARK_W * 1.32
    ox = (d - MARK_W) / 2.0
    oy = (d - H) / 2.0
    mid = "bdg-%s" % uid
    inner = s_glyph("#000") + f_glyph("#000", point=True)
    defs = ('<mask id="%s" maskUnits="userSpaceOnUse" x="0" y="0" width="%g" height="%g">'
            '<rect width="%g" height="%g" fill="#fff"/>'
            '<g transform="translate(%.2f %.2f)">%s</g></mask>'
            % (mid, d, d, d, d, ox, oy, inner))
    body = ('<circle cx="%g" cy="%g" r="%g" fill="%s" mask="url(#%s)"/>'
            % (d / 2.0, d / 2.0, d / 2.0, fill, mid))
    return defs, body, d, d


def build_construction(fill, uid):
    """Diagram konstruksi: dua elips, titik singgung, dan bidang potong 45 derajat."""
    t = _term(RX, RY)
    y2 = Y1 + RY + RY
    a = _pt(CX, Y1, RX, RY, t)
    b = _pt(CX, y2, RX, RY, t + 180.0)
    hair = 'stroke="%s" fill="none" stroke-width="1.1" opacity=".42"' % fill
    dash = 'stroke="%s" fill="none" stroke-width="1.1" stroke-dasharray="5 4" opacity=".42"' % fill
    g = ['<g opacity=".13">%s%s</g>' % (s_glyph(fill), f_glyph(fill, point=True))]
    g.append('<ellipse cx="%g" cy="%g" rx="%g" ry="%g" %s/>' % (CX, Y1, RX, RY, hair))
    g.append('<ellipse cx="%g" cy="%g" rx="%g" ry="%g" %s/>' % (CX, y2, RX, RY, hair))
    g.append('<path d="M0 %g H%g" %s/>' % (Y1 + RY, MARK_W, dash))
    g.append('<circle cx="%g" cy="%g" r="3.2" fill="%s"/>' % (CX, Y1 + RY, fill))
    for p in (a, b):
        g.append('<path d="M%.2f %.2f l-26 26 M%.2f %.2f l26 -26" %s/>'
                 % (p[0], p[1], p[0], p[1], dash))
        g.append('<circle cx="%.2f" cy="%.2f" r="3.2" fill="%s"/>' % (p[0], p[1], fill))
    xe = FX + A1
    g.append('<path d="M%g %g l-22 -22 M%g %g l-22 22" %s/>' % (xe + W / 2.0, W / 2.0,
                                                                xe + W / 2.0, W / 2.0, dash))
    g.append('<path d="M%g 0 V%g M%g 0 V%g" %s/>' % (FX, H, FX + W, H, dash))
    return "", "".join(g), MARK_W, H


def build_badge_tight(fill, uid):
    d = MARK_W * 1.13
    ox = (d - MARK_W) / 2.0
    oy = (d - H) / 2.0
    mid = "bdgt-%s" % uid
    inner = s_glyph("#000") + f_glyph("#000", point=True)
    defs = ('<mask id="%s" maskUnits="userSpaceOnUse" x="0" y="0" width="%g" height="%g">'
            '<rect width="%g" height="%g" fill="#fff"/>'
            '<g transform="translate(%.2f %.2f)">%s</g></mask>'
            % (mid, d, d, d, d, ox, oy, inner))
    body = ('<circle cx="%g" cy="%g" r="%g" fill="%s" mask="url(#%s)"/>'
            % (d / 2.0, d / 2.0, d / 2.0, fill, mid))
    return defs, body, d, d


BUILDERS = {
    "mark":   build_mark,
    "double": build_double,
    "quiet":  build_quiet,
    "badge":  build_badge,
    "construction": build_construction,
}
ORDER = ["mark", "double", "quiet", "badge"]
EXTRA = ["construction"]

NAMES = {
    "mark":   ("Tanda Utama", "The Mark"),
    "double": ("Dua Ujung", "The Double Point"),
    "quiet":  ("Tanpa Ujung", "The Quiet"),
    "badge":  ("Cakram", "The Badge"),
}

DESCS = {
    "mark":   "Monogram SF; lengan atas F berujung runcing, jadi hurufnya menunjuk.",
    "double": "Kedua lengan F berujung runcing.",
    "quiet":  "Kedua lengan F dipotong miring, tanpa ujung runcing.",
    "badge":  "Monogram dilubangkan dari satu cakram penuh.",
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
    """Cakram versi rapat: pada 16 piksel, ruang kosong lebih mahal daripada keanggunan."""

    defs, body, d, _ = build_badge_tight(GRAD_FILL, "fav")
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
    inject(PAGE, symbols_block())


if __name__ == "__main__":
    build()
