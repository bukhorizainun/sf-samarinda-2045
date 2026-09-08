# -*- coding: utf-8 -*-
"""Logo SF menurut rujukan klien (klien/logo_usulan.jpeg), dibangun ulang.

Yang diambil dari rujukan: huruf dibangun dari lingkaran, satu potongan miring
45 derajat menembus tiap huruf, dan panah 45 derajat di baris tulisan.

Yang diubah:
  - lingkarannya benar-benar lingkaran, jari-jarinya satu angka untuk mangkuk S
    dan untuk siku F, jadi kedua huruf lahir dari cetakan yang sama;
  - potongan miring memakai sudut yang sama dengan ujung huruf dan dengan panah,
    jadi 45 derajat cuma disebut sekali lalu dipakai di mana-mana;
  - panahnya digambar, bukan diambil dari fonta;
  - gradasinya memakai empat warna City Indicator, bukan warna bebas.

Dua penyetelan:
  tegas   — bobot tebal, celah lebar, mendekati rujukan
  elegan  — bobot tipis, ruang dalam lebih lega, tulisan lebih kecil dan renggang

Jalankan: python tools/build_logo_iris.py
"""

import io
import math
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "brand", "usulan-iris")
PAGE = os.path.join(ROOT, "klien", "logo_sf_rujukan.html")

H = 100.0
ENV, RDY, SOC, ECO = "#16a06f", "#2f7fe0", "#8b5cf6", "#f0a92a"
INK = "#0e1418"

SET = {
    "tegas":  dict(W=26.0, A1=54.0, A2=40.0, YM=42.0, GAPF=17.0,
                   SLIT=7.0, SLIDE=0.0, CAP=25.0, TRACK=0.02, TW=400),
    "elegan": dict(W=17.0, A1=60.0, A2=44.0, YM=45.0, GAPF=22.0,
                   SLIT=5.0, SLIDE=0.0, CAP=19.0, TRACK=0.10, TW=300),
}


def grad(uid):
    return ('<linearGradient id="g%s" x1="0" y1="1" x2="1" y2="0">'
            '<stop offset="0" stop-color="%s"/><stop offset=".34" stop-color="%s"/>'
            '<stop offset=".70" stop-color="%s"/><stop offset="1" stop-color="%s"/>'
            '</linearGradient>' % (uid, ENV, RDY, SOC, ECO))


def _p(cx, cy, r, t):
    a = math.radians(t)
    return (cx + r * math.cos(a), cy - r * math.sin(a))


def _arc(cx, cy, r, a0, a1, ccw=True):
    """Busur lingkaran dari sudut a0 ke a1. ccw: berlawanan jarum di layar."""
    x, y = _p(cx, cy, r, a1)
    span = (a1 - a0) % 360 if ccw else (a0 - a1) % 360
    return "A%.3f %.3f 0 %d %d %.3f %.3f" % (r, r, 1 if span > 180 else 0,
                                             0 if ccw else 1, x, y)


class Geom:
    """Satu jari-jari untuk mangkuk S dan siku F; satu bobot untuk semuanya."""

    def __init__(self, W, A1, A2, YM, GAPF, **_):
        self.W = W
        self.R = (H - W) / 4.0            # jari-jari sumbu mangkuk
        self.sx = self.R + W / 2.0        # sumbu tegak S
        self.sw = 2 * self.R + W          # lebar S
        self.fx = self.sw + GAPF          # tepi kiri tiang F
        self.cx = self.fx + W / 2.0       # sumbu tiang F
        self.A1, self.A2, self.YM = A1, A2, YM
        self.width = self.cx + max(A1, A2) + W / 2.0

    # ── S: dua mangkuk lingkaran, kedua ujung dipotong 45 derajat ────────
    def s_path(self, top=45.0, bot=225.0):
        R, sx = self.R, self.sx
        cy1, cy2 = self.W / 2.0 + R, H - self.W / 2.0 - R
        a = _p(sx, cy1, R, top)
        return ("M%.3f %.3f %s %s"
                % (a[0], a[1], _arc(sx, cy1, R, top, 270, True),
                   _arc(sx, cy2, R, 90, bot, False)))

    # ── F: tiang, siku seperempat lingkaran, dua lengan berpotongan 45 ──
    def f_elbow(self):
        """Siku seperempat lingkaran, jari-jarinya sama dengan mangkuk S."""
        R, cx, W = self.R, self.cx, self.W
        return ("M%.3f %.3f V%.3f %s H%.3f"
                % (cx, W / 2.0 + R + 1.0, W / 2.0 + R,
                   _arc(cx + R, W / 2.0 + R, R, 180, 90, False),
                   cx + R + 2.0))

    def f_stem(self):
        """Tiang tegak; ujung bawahnya dipotong 45 derajat, searah dengan
        potongan ujung S dan dengan panah."""
        cx, W = self.cx, self.W
        return ("M%.3f %.3f H%.3f V%.3f L%.3f %.3f Z"
                % (cx - W / 2.0, self.W / 2.0 + self.R, cx + W / 2.0,
                   H - W, cx - W / 2.0, H))

    def arm(self, y, length, back):
        """Lengan datar, ujung kanannya dipotong 45 derajat."""
        W = self.W
        x0, x1 = self.cx - back, self.cx + length
        return ("M%.3f %.3f H%.3f L%.3f %.3f H%.3f Z"
                % (x0, y - W / 2.0, x1 + W / 2.0, x1 - W / 2.0, y + W / 2.0, x0))


def stroke(d, w, col):
    return ('<path d="%s" fill="none" stroke="%s" stroke-width="%.2f" '
            'stroke-linecap="butt" stroke-linejoin="miter"/>' % (d, col, w))


def fill(d, col):
    return '<path d="%s" fill="%s"/>' % (d, col)


def sliced(art, uid, cut, slit, slide):
    """Satu potongan 45 derajat menembus huruf. cut = nilai x+y garis potong."""
    k1, k2 = cut - 0.70711 * slit, cut + 0.70711 * slit
    o = slide * 0.70711
    B = 900.0
    clips = ('<clipPath id="a%s"><path d="M%g %g H%g L%g %g Z"/></clipPath>'
             '<clipPath id="b%s"><path d="M%g %g H%g L%g %g Z"/></clipPath>'
             % (uid, -B, -B, k1 + B, -B, k1 + B,
                uid, B, B, k2 - B, B, k2 - B))
    body = ('<g transform="translate(%.3f %.3f)"><g clip-path="url(#a%s)">%s</g></g>'
            '<g clip-path="url(#b%s)">%s</g>' % (o, -o, uid, art, uid, art))
    return clips, body


def mark(name, uid, col, solid=False):
    """Tanda SF: dua huruf, dua potongan 45 derajat yang sejajar.

    Potongan pada S lewat titik singgung kedua mangkuk; potongan pada F lewat
    titik pertemuan tiang dan lengan tengah. Keduanya titik struktur, bukan
    tempat yang dipilih dengan mata.

    solid: tanpa potongan — untuk 16 px, ukiran, dan sablon satu warna.
    """
    s = SET[name]
    g = Geom(**s)
    sl, sd = s["SLIT"], s["SLIDE"]

    s_art = stroke(g.s_path(), g.W, col)
    f_art = (fill(g.f_stem(), col) + stroke(g.f_elbow(), g.W, col)
             + fill(g.arm(g.W / 2.0, g.A1, 0.0), col)
             + fill(g.arm(g.YM + g.W / 2.0, g.A2, g.W / 2.0), col))
    if solid:
        return "", s_art + f_art, g.width, H

    c1, b1 = sliced(s_art, uid + "s", g.sx + H / 2.0, sl, sd)
    c2, b2 = sliced(f_art, uid + "f", g.cx + g.YM + g.W / 2.0, sl, sd)
    return c1 + c2, b1 + b2, g.width, H


# ── panah 45 derajat, digambar bukan diambil dari fonta ─────────────────
def arrow(x, y, size, w, col):
    ax, ay = x + size, y - size
    L = size * 0.46
    return ('<g fill="none" stroke="%s" stroke-width="%.2f" stroke-linecap="butt" '
            'stroke-linejoin="miter"><path d="M%.2f %.2f L%.2f %.2f"/>'
            '<path d="M%.2f %.2f H%.2f V%.2f"/></g>'
            % (col, w, x, y, ax, ay, ax - L, ay, ax, ay + L))


FACE = "Outfit,'Segoe UI',system-ui,sans-serif"


def lockup(name, uid, col, edition=None):
    """Tanda di atas, tulisan di bawah — susunan yang dipakai rujukan."""
    s = SET[name]
    defs, body, mw, mh = mark(name, uid, col)
    cap, track, tw = s["CAP"], s["TRACK"], s["TW"]
    lead = cap * 1.16
    aw = cap * 0.62
    gapy = cap * 1.5
    tx = aw + cap * 0.52
    lines = ["SUSTAINABLE", "FUTURES"]
    tw_est = max(len(l) for l in lines) * cap * (0.655 + track)
    total_w = max(mw, tx + tw_est)
    ox = (total_w - mw) / 2.0
    y0 = mh + gapy + cap
    t = ['<g transform="translate(%.2f 0)">%s</g>' % (ox, body)]
    t.append(arrow(0.0, y0 - cap * 0.10, aw, max(2.0, cap * 0.085), col))
    for i, line in enumerate(lines):
        t.append('<text x="%.2f" y="%.2f" font-family="%s" font-size="%.2f" '
                 'font-weight="%d" letter-spacing="%.3fem" fill="%s">%s</text>'
                 % (tx, y0 + i * lead, FACE, cap, tw, track, col, line))
    h = y0 + lead + cap * 0.10
    if edition:
        sub = cap * 0.34
        t.append('<text x="%.2f" y="%.2f" font-family="%s" font-size="%.2f" '
                 'font-weight="300" letter-spacing=".26em" fill="%s" opacity=".7">%s</text>'
                 % (tx, h + sub * 1.9, FACE, sub, col, edition))
        h += sub * 2.7
    return defs, "".join(t), total_w, h


def svg(defs, body, w, h, col, uid, height=None, pad=0.0):
    gd = grad(uid) if col.startswith("url") else ""
    hh = ' height="%s"' % height if height else ""
    return ('<svg viewBox="%.2f %.2f %.2f %.2f"%s xmlns="http://www.w3.org/2000/svg">'
            '<defs>%s%s</defs>%s</svg>'
            % (-pad, -pad, w + 2 * pad, h + 2 * pad, hh, gd, defs, body))


def build():
    os.makedirs(OUT, exist_ok=True)
    n = 0
    for name in ("tegas", "elegan"):
        for tag, col, uid in (("gradasi", "url(#g%s)", "G"), ("tinta", INK, "K"),
                              ("putih", "#ffffff", "P")):
            c = col % (name + uid) if "%s" in col else col
            d, b, w, h = mark(name, name + uid, c)
            io.open(os.path.join(OUT, "sf-%s-%s.svg" % (name, tag)), "w",
                    encoding="utf-8", newline="\n").write(
                svg(d, b, w, h, c, name + uid) + "\n")
            d, b, w, h = lockup(name, name + uid + "L", c)
            io.open(os.path.join(OUT, "sf-%s-%s-kunci.svg" % (name, tag)), "w",
                    encoding="utf-8", newline="\n").write(
                svg(d, b, w, h, c, name + uid) + "\n")
            n += 2
    print("tulis: %d berkas di brand/usulan-iris" % n)
    try:
        from page_iris import page
    except ImportError:
        print("lewati halaman: page_iris.py belum ada")
        return
    io.open(PAGE, "w", encoding="utf-8", newline="\n").write(page())
    print("tulis: klien/logo_sf_rujukan.html")


if __name__ == "__main__":
    build()
