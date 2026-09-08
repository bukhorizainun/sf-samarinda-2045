"""Menarik 184 kartu dari PDF dek resmi menjadi web/src/content/cards.json.

Dijalankan ulang bila klien memperbarui dek:

    python tools/extract_cards.py

Hanya halaman muka yang dibaca; halaman belakang berisi punggung kartu.
Satu kartu dikenali dari baris kepala "KODE  JENIS", lalu judul, lalu isi,
dan berakhir pada baris "FUTURES IN ACTION".

Selain judul dan isi, penarik ini memisahkan bidang yang tertulis di kartu
proyek: zona, biaya, dampak pada empat indikator, risiko, dan aksi nyata.
Tidak ada satu pun nilai yang dihitung sendiri di sini; semuanya dikutip.
"""

import json
import re
from pathlib import Path

import pypdf

SUMBER = Path(
    "Bahan Web/Bahan Web/"
    "4. kartu game_futures-in-action-samarinda-2045-complete-184-card-deck-english-duplex(1).pdf"
)
TUJUAN = Path("web/src/content/cards.json")

KEPALA = re.compile(r"^([A-Z]{1,3}\d{2,3})\s{2,}([A-Z][A-Z &/\-]+)$")

# Delapan zona tematik papan. Dipakai untuk melepas zona yang menempel
# di ujung judul ketika PDF menggabungkan dua kolom jadi satu baris.
ZONA = ["Green", "Energy", "Transport", "Education", "Waste", "Disaster",
        "River", "Food"]
EKOR_ZONA = re.compile(rf"\s+({'|'.join(ZONA)})\s+Zone\.?$")

# Bidang di badan kartu proyek.
BIAYA = re.compile(r"Cost:\s*([^.]+)\.")
DAMPAK = re.compile(r"impact:\s*(-?\d+)\s*/\s*(-?\d+)\s*/\s*(-?\d+)\s*/\s*(-?\d+)")
RISIKO = re.compile(r"Risk:\s*([^.]+\.)")
AKSI = re.compile(r"Real-world action:\s*(.+?)(?:\s+[A-Z]{2,}\b|$)")

# Judul boleh melanjut ke baris kedua hanya bila keduanya pendek.
BATAS_JUDUL = 40


def bersihkan(teks: str) -> str:
    """Membuang sisa pemisah kolom dan spasi berlebih."""
    teks = teks.replace(" | ", " ").replace("|", " ")
    return re.sub(r"\s{2,}", " ", teks).strip()


def tarik(sumber: Path) -> list[dict]:
    kartu: list[dict] = []

    for halaman in pypdf.PdfReader(str(sumber)).pages:
        teks = halaman.extract_text() or ""
        if "FRONT SHEET" not in teks:
            continue

        kini = None
        for baris in teks.split("\n"):
            s = baris.strip()

            m = KEPALA.match(s)
            if m:
                if kini:
                    kartu.append(kini)
                kini = {"code": m.group(1), "type": m.group(2).strip(),
                        "judul": [], "body": []}
                continue

            if kini is None or not s:
                continue

            if s == "FUTURES IN ACTION":
                kartu.append(kini)
                kini = None
                continue

            # Baris pertama sesudah kepala selalu judul. Baris kedua ikut
            # jadi judul hanya bila keduanya pendek dan belum ada isi.
            baris_judul = not kini["judul"] or (
                not kini["body"]
                and len(kini["judul"]) == 1
                and len(kini["judul"][0]) <= BATAS_JUDUL
                and len(s) <= BATAS_JUDUL
                and s[-1] not in ".:"
            )
            (kini["judul"] if baris_judul else kini["body"]).append(s)

        if kini:
            kartu.append(kini)

    hasil = []
    for k in kartu:
        judul = bersihkan(" ".join(k["judul"]))
        badan = bersihkan(" ".join(k["body"]))

        # Zona yang menempel di ujung judul dipindahkan ke bidangnya sendiri.
        zona = None
        ekor = EKOR_ZONA.search(judul)
        if ekor:
            zona = ekor.group(1)
            judul = judul[: ekor.start()].strip()
        else:
            awal = re.match(rf"^({'|'.join(ZONA)})\s+Zone\.\s*", badan)
            if awal:
                zona = awal.group(1)
                badan = badan[awal.end():].strip()

        rec = {"code": k["code"], "type": k["type"], "title": judul,
               "body": badan}
        if zona:
            rec["zone"] = zona

        if m := BIAYA.search(badan):
            rec["cost"] = bersihkan(m.group(1))
        if m := DAMPAK.search(badan):
            rec["impact"] = [int(x) for x in m.groups()]
        if m := RISIKO.search(badan):
            rec["risk"] = bersihkan(m.group(1))
        if m := AKSI.search(badan):
            rec["action"] = bersihkan(m.group(1))

        hasil.append(rec)

    return hasil


if __name__ == "__main__":
    kartu = tarik(SUMBER)
    if len(kartu) != 184:
        raise SystemExit(f"Terbaca {len(kartu)} kartu, seharusnya 184.")

    tanpa_judul = [k["code"] for k in kartu if not k["title"]]
    if tanpa_judul:
        raise SystemExit(f"Kartu tanpa judul: {', '.join(tanpa_judul)}")

    TUJUAN.write_text(
        json.dumps(kartu, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    berdampak = sum(1 for k in kartu if "impact" in k)
    print(f"{len(kartu)} kartu ditulis ke {TUJUAN} "
          f"({berdampak} di antaranya membawa angka dampak)")
