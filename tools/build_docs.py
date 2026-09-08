# Membungkus dokumen di klien/ menjadi halaman HTML utuh di docs/,
# lengkap dengan meta viewport, charset, dan favicon.
# Jalankan: python tools/build_docs.py

import io
import os
import re
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "klien")
OUT = os.path.join(ROOT, "docs")

# Favicon dibaca dari berkas yang ditulis tools/build_brand.py, supaya bentuknya
# tidak pernah berbeda dengan tanda di halaman.
FAVICON_SRC = os.path.join(ROOT, "brand", "logo", "sf-favicon.svg")
FAVICON = io.open(FAVICON_SRC, encoding="utf-8").read().strip()
FAVICON_HREF = "data:image/svg+xml," + urllib.parse.quote(FAVICON)

PAGES = [
    ("identitas_sf.html", "identitas-sf.html",
     "Enam usulan tanda untuk SF (Sustainable Futures): gagasan, penilaian terbuka, "
     "usulan terpilih, dan uji penerapannya di papan permainan maupun layar."),
    ("fia_samarinda2045.html", "identitas.html",
     "Eksplorasi identitas visual SAMARINDA 2045: lima arah konsep, matriks penilaian, "
     "arah terpilih, dan uji penerapannya."),
    ("peta_pengerjaan.html", "peta-pengerjaan.html",
     "Urutan tujuh langkah pengerjaan website dan pendamping AI SAMARINDA 2045."),
]

SHELL = """<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta name="description" content="{desc}">
<meta name="robots" content="noindex">
<link rel="icon" href="{icon}">
{head}
</head>
<body>
{body}
</body>
</html>
"""


def split_fragment(text):
    """Pisahkan bagian kepala (title/link/style) dari isi halaman."""
    marker = "</style>"
    i = text.rindex(marker) + len(marker)
    return text[:i].strip(), text[i:].strip()


def build():
    os.makedirs(OUT, exist_ok=True)
    written = []
    for src_name, out_name, desc in PAGES:
        src = os.path.join(SRC, src_name)
        if not os.path.exists(src):
            print("lewati (tidak ada):", src_name)
            continue
        raw = io.open(src, encoding="utf-8").read()
        head, body = split_fragment(raw)
        page = SHELL.format(desc=desc, icon=FAVICON_HREF, head=head, body=body)
        dst = os.path.join(OUT, out_name)
        io.open(dst, "w", encoding="utf-8", newline="\n").write(page)
        title = re.search(r"<title>(.*?)</title>", head)
        written.append((out_name, title.group(1) if title else out_name))
        print("tulis:", out_name, len(page), "bytes")
    return written


if __name__ == "__main__":
    build()
