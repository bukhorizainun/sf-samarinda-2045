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

FAVICON = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">'
    '<rect width="48" height="48" rx="8" fill="#12171a"/>'
    '<circle cx="12" cy="24" r="3.6" fill="#f7f5f0"/>'
    '<g fill="none" stroke="#f7f5f0" stroke-width="3">'
    '<path d="M16 22.4L28 15.4"/><path d="M16.5 24H29"/><path d="M16 25.6L28 32.6"/>'
    '<circle cx="34" cy="24" r="3.8" stroke-width="2.8"/>'
    '<circle cx="33" cy="35.6" r="3.8" stroke-width="2.8"/></g>'
    '<circle cx="33" cy="12.4" r="4.4" fill="#c08a2e"/></svg>'
)
FAVICON_HREF = "data:image/svg+xml," + urllib.parse.quote(FAVICON)

PAGES = [
    ("identitas_samarinda2045.html", "identitas.html",
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
