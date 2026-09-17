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

# Fase tempat tiap dek dipakai. Sumbernya panduan resmi, bukan muka kartu:
# Setup (0) untuk peran dan tujuan; Scenario dan Problem Factor di Fase 1
# (panduan "Reveal and read one Samarinda Scenario Card", "Each stakeholder
# takes two Problem Factor Cards"); Driver dan Uncertainty di Fase 2
# ("Reveal three Change Driver Cards", "Reveal two Uncertainty Cards");
# proyek, Opportunity, dan Event di Fase 4 (Project Market); Event dipakai
# lagi di Fase 6 ("Apply an Event Card"); Action Evidence di Fase 6; dua
# pemakaian inti GenAI ada di Fase 1 dan Fase 4.
FASE = {
    "ROLE CARD": [0],
    "SPECIAL GOAL": [0],
    "SAMARINDA SCENARIO": [1],
    "PROBLEM FACTOR": [1],
    "DRIVER": [2],
    "UNCERTAINTY": [2],
    "MINI-PROJECT": [4],
    "OPEN PROJECT": [4],
    "OPPORTUNITY": [4],
    "EVENT": [4, 6],
    "GENAI PROMPT": [1, 4],
    "ACTION EVIDENCE": [6],
}

KEPALA = re.compile(r"^([A-Z]{1,3}\d{2,3})\s{2,}([A-Z][A-Z &/\-]+)$")

# Delapan zona tematik papan. Dipakai untuk melepas zona yang menempel
# di ujung judul ketika PDF menggabungkan dua kolom jadi satu baris.
ZONA = ["Green", "Energy", "Transport", "Education", "Waste", "Disaster",
        "River", "Food"]

# Nama zona di kartu kadang membawa kata depan: "Environmental Education Zone",
# "Disaster Resilience Zone". Yang disimpan tetap nama pendek milik papan.
PENUH = rf"(?:[A-Z][a-z]+\s+){{0,2}}({'|'.join(ZONA)})(?:\s+[A-Z][a-z]+)?\s+Zone"
EKOR_ZONA = re.compile(rf"\s+{PENUH}\.?$")
AWAL_ZONA = re.compile(rf"^{PENUH}\.\s*")

# Bidang di badan kartu proyek.
BIAYA = re.compile(r"Cost:\s*([^.]+)\.")
DAMPAK = re.compile(r"impact:\s*(-?\d+)\s*/\s*(-?\d+)\s*/\s*(-?\d+)\s*/\s*(-?\d+)")
RISIKO = re.compile(r"Risk:\s*([^.]+\.)")
AKSI = re.compile(r"Real-world action:\s*(.+?)(?:\s+[A-Z]{2,}\b|$)")


# Nama zona dicetak besar sebagai kepala kolom di lembar PDF, lalu ikut
# tersedot ke ujung isi kartu. Itu tata letak lembar cetak, bukan naskah
# kartu, jadi dibuang — tetapi hanya bila memang menyebut zona kartu itu.
EKOR_BESAR = re.compile(r"\s+([A-Z][A-Z &/\-]{2,})$")

# Dua prompt inti yang gratis ditandai begitu di kartunya sendiri. Itu
# aturan permainan, jadi disimpan sebagai penanda, bukan dibuang.
INTI_GRATIS = "FREE CORE PROMPT"
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
            awal = AWAL_ZONA.match(badan)
            if awal:
                zona = awal.group(1)
                badan = badan[awal.end():].strip()

        gratis = False
        if ekor_besar := EKOR_BESAR.search(badan):
            tanda = ekor_besar.group(1)
            if tanda == INTI_GRATIS:
                gratis = True
                badan = badan[: ekor_besar.start()].strip()
            elif zona and zona.upper() in tanda:
                badan = badan[: ekor_besar.start()].strip()

        rec = {"code": k["code"], "type": k["type"], "title": judul,
               "body": badan, "phases": FASE.get(k["type"], [])}
        if gratis:
            rec["freeCorePrompt"] = True
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

    tanpa_zona = [k["code"] for k in kartu
                  if k["type"] == "MINI-PROJECT" and "zone" not in k]
    if tanpa_zona:
        raise SystemExit(f"Proyek kecil tanpa zona: {', '.join(tanpa_zona)}")

    tanpa_fase = sorted({k["type"] for k in kartu if not k["phases"]})
    if tanpa_fase:
        raise SystemExit(f"Jenis tanpa fase: {', '.join(tanpa_fase)}")

    TUJUAN.write_text(
        json.dumps(kartu, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    berdampak = sum(1 for k in kartu if "impact" in k)
    print(f"{len(kartu)} kartu ditulis ke {TUJUAN} "
          f"({berdampak} di antaranya membawa angka dampak)")
