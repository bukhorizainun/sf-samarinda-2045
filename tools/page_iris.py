# -*- coding: utf-8 -*-
"""Lembar usulan untuk dua penyetelan logo SF menurut rujukan klien."""

import build_logo_iris as B

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box}
body{margin:0;background:#fbfbfa;color:#0e1418;font:400 15px/1.6 Outfit,system-ui,sans-serif;
     -webkit-font-smoothing:antialiased}
.wrap{max-width:1080px;margin:0 auto;padding:54px 26px 96px}
.lbl{font:500 10px/1 'JetBrains Mono',monospace;letter-spacing:.22em;text-transform:uppercase;
     color:#8b949b}
h1{font:200 56px/1 Outfit;letter-spacing:-.03em;margin:12px 0 10px}
h1 b{font-weight:600}
h2{font:300 28px/1.15 Outfit;letter-spacing:-.02em;margin:0 0 6px}
.lede{max-width:54ch;color:#4b555e;margin:0}
.rule{height:1px;background:#e2e2dd;margin:52px 0 24px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}
.box{border:1px solid #e2e2dd;background:#fff;border-radius:4px;overflow:hidden}
.box img{display:block;width:100%}
.stage{display:grid;place-items:center;padding:46px 30px;min-height:210px}
.stage svg{width:auto;height:118px}
.hero .stage{padding:30px 26px;min-height:0}
.hero .stage svg{height:150px}
.strip{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid #e2e2dd}
.strip div{display:grid;place-items:center;padding:24px 14px}
.strip div+div{border-left:1px solid #e2e2dd}
.strip div:nth-child(2){background:#0e1418}
.strip svg{height:46px;width:auto}
.sizes{display:flex;align-items:flex-end;justify-content:center;gap:20px;padding:20px;
       border-top:1px solid #e2e2dd}
.sizes span{display:flex;flex-direction:column;align-items:center;gap:6px}
.sizes i{font:400 9px/1 'JetBrains Mono',monospace;color:#a8b0b6;font-style:normal}
.cap{font:400 10.5px/1.5 'JetBrains Mono',monospace;color:#a8b0b6;padding:13px 18px;
     border-top:1px solid #e2e2dd;margin:0}
.lock{border:1px solid #e2e2dd;background:#fff;border-radius:4px;padding:40px;display:grid;
      place-items:center}
.lock.k{background:#0e1418;border-color:#0e1418}
.lock svg{height:212px;width:auto}
.rules{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:8px}
.rules div{border-top:2px solid #0e1418;padding-top:11px}
.rules b{display:block;font-weight:500;font-size:14px;margin-bottom:3px}
.rules p{margin:0;font-size:13px;line-height:1.5;color:#4b555e}
@media(max-width:820px){.two,.rules{grid-template-columns:1fr}h1{font-size:40px}}
"""

NAME = {"tegas": ("Tegas", "sedekat rujukan"), "elegan": ("Elegan", "lebih tipis, lebih lega")}
NOTE = {
    "tegas":  "Bobot 26. Ruang dalam rapat, warna punya banyak bidang. Paling dekat dengan "
              "rujukan yang Anda kirim.",
    "elegan": "Bobot 17. Ruang dalam lega, potongan lebih halus, tulisan lebih kecil dan "
              "renggang. Sama sistemnya, beda suaranya.",
}


def _svg(name, uid, col, solid=False, height=None):
    d, b, w, h = B.mark(name, uid, col, solid=solid)
    return B.svg(d, b, w, h, col, uid, height=height)


def block(name):
    n, sub = NAME[name]
    g = B.Geom(**B.SET[name])
    sizes = "".join(
        "<span>%s<i>%d</i></span>" % (_svg(name, "%s%d" % (name, px), B.INK,
                                           solid=(px <= 16), height=px), px)
        for px in (64, 48, 32, 24, 16))
    return ('<div class="box"><div class="stage">%s</div>'
            '<div class="strip"><div>%s</div><div>%s</div><div>%s</div></div>'
            '<div class="sizes">%s</div>'
            '<p class="cap">%s &middot; bobot %g &middot; rasio %.2f<br>'
            'gradasi &middot; putih &middot; padat (16 px, ukiran, sablon)</p></div>'
            % (_svg(name, name + "G", "url(#g%sG)" % name),
               _svg(name, name + "K", B.INK),
               _svg(name, name + "W", "#ffffff"),
               _svg(name, name + "S", B.INK, solid=True),
               sizes, sub, g.W, g.width / B.H))


def page():
    locks = ""
    for name in ("tegas", "elegan"):
        d, b, w, h = B.lockup(name, name + "LK", B.INK, edition="SAMARINDA 2045")
        locks += '<div class="lock">%s</div>' % B.svg(d, b, w, h, B.INK, "x")
    return """<!DOCTYPE html>
<html lang="id"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>SF — Dua Penyetelan</title><style>%s</style></head><body><div class="wrap">

<span class="lbl">Menurut rujukan yang Anda kirim</span>
<h1>S<b>F</b></h1>
<p class="lede">Bentuknya dibangun ulang dari lingkaran, dipotong satu sudut, dan panahnya
digambar sendiri. Dua penyetelan: tegas dan elegan.</p>

<div class="rule"></div>
<div class="two">
  <div class="box"><img src="logo_usulan.jpeg" alt="Rujukan dari klien">
    <p class="cap">rujukan yang Anda kirim</p></div>
  <div class="box hero"><div class="stage">%s</div>
    <p class="cap">hasil bangun ulang &middot; penyetelan tegas</p></div>
</div>

<div class="rule"></div>
<span class="lbl">Dua penyetelan</span><h2>Tegas dan Elegan</h2>
<p class="lede" style="margin-bottom:22px">Satu sistem, dua bobot. Berpindah di antara keduanya
tidak menuntut menggambar ulang apa pun.</p>
<div class="two">%s%s</div>

<div class="rule"></div>
<span class="lbl">Kunci logo</span><h2>Tanda, nama, semboyan, edisi</h2>
<p class="lede" style="margin-bottom:22px">Panah 45&deg; memakai sudut yang sama dengan potongan
pada huruf. Baris edisi yang berganti kota.</p>
<div class="two">%s</div>

<div class="rule"></div>
<span class="lbl">Aturan</span><h2>Empat hal yang mengikat</h2>
<div class="rules">
  <div><b>Satu sudut</b><p>45&deg; dipakai untuk potongan ujung huruf, potongan yang menembus
  tiap huruf, dan arah panah. Tidak ada sudut kedua.</p></div>
  <div><b>Satu jari-jari</b><p>Mangkuk S dan siku F memakai angka yang sama, jadi kedua huruf
  lahir dari cetakan yang sama.</p></div>
  <div><b>Potongan punya alamat</b><p>Pada S ia lewat titik singgung kedua mangkuk; pada F lewat
  pertemuan tiang dan lengan tengah.</p></div>
  <div><b>Versi padat</b><p>Untuk 16 px, ukiran, dan sablon satu warna, potongannya ditutup.
  Bentuknya tetap sama.</p></div>
</div>

</div></body></html>
""" % (CSS, _svg("tegas", "hero", "url(#gheroX)".replace("X", "")),
       block("tegas"), block("elegan"), locks)
