import type { Keluarga } from "@/components/kartu/ornamen";
import { KELUARGA } from "@/components/kartu/ornamen";
import type { Lang } from "@/lib/i18n";

/** Satu kartu dek resmi, sebagaimana ditulis tools/extract_cards.py. */
export type Kartu = {
  code: string;
  type: string;
  title: string;
  body: string;
  /** Fase permainan tempat kartu ini dipakai. 0 berarti penyiapan. */
  phases: number[];
  zone?: string;
  cost?: string;
  /** Dampak pada Environment / Society / Economy / Future Readiness. */
  impact?: number[];
  risk?: string;
  action?: string;
  /** Dua prompt inti yang tidak menuntut GenAI Access Token. Ditandai
   *  begitu di kartunya sendiri. */
  freeCorePrompt?: boolean;
};

export const INDIKATOR = [
  { nama: { id: "Lingkungan", en: "Environment" }, warna: "var(--color-env)" },
  { nama: { id: "Masyarakat", en: "Society" }, warna: "var(--color-society)" },
  { nama: { id: "Ekonomi", en: "Economy" }, warna: "var(--color-economy)" },
  { nama: { id: "Masa Depan", en: "Future Readiness" }, warna: "var(--color-future)" },
] as const;

/** Warna pita per jenis, diambil dari empat warna City Indicator. */
const PITA: Record<string, string> = {
  "ROLE CARD": "var(--color-society)",
  "SPECIAL GOAL": "var(--color-society)",
  "SAMARINDA SCENARIO": "var(--color-future)",
  "PROBLEM FACTOR": "var(--color-env)",
  DRIVER: "var(--color-env)",
  UNCERTAINTY: "var(--color-future)",
  "MINI-PROJECT": "var(--color-economy)",
  "OPEN PROJECT": "var(--color-economy)",
  OPPORTUNITY: "var(--color-economy)",
  EVENT: "var(--color-future)",
  "GENAI PROMPT": "var(--color-society)",
  "ACTION EVIDENCE": "var(--color-env)",
};

const NAMA_ID: Record<string, string> = {
  "ROLE CARD": "Kartu Peran",
  "SPECIAL GOAL": "Tujuan Khusus",
  "SAMARINDA SCENARIO": "Skenario Samarinda",
  "PROBLEM FACTOR": "Faktor Masalah",
  DRIVER: "Pendorong",
  UNCERTAINTY: "Ketidakpastian",
  "MINI-PROJECT": "Proyek Kecil",
  "OPEN PROJECT": "Proyek Terbuka",
  OPPORTUNITY: "Peluang",
  EVENT: "Kejadian",
  "GENAI PROMPT": "Prompt GenAI",
  "ACTION EVIDENCE": "Bukti Aksi",
};

/** Delapan zona tematik papan. Nama pendeknya yang tertulis di kartu. */
const ZONA_ID: Record<string, string> = {
  Green: "Hijau",
  Energy: "Energi",
  Transport: "Transportasi",
  Education: "Pendidikan",
  Waste: "Sampah",
  Disaster: "Kebencanaan",
  River: "Sungai",
  Food: "Pangan",
};

/** Enam fase permainan, ditambah penyiapan sebagai fase nol. */
export const FASE: { no: number; nama: { id: string; en: string } }[] = [
  { no: 0, nama: { id: "Penyiapan", en: "Setup" } },
  { no: 1, nama: { id: "Mengamati Hari Ini", en: "Observe the Present" } },
  { no: 2, nama: { id: "Membayangkan Masa Depan", en: "Imagine Futures" } },
  { no: 3, nama: { id: "Memilih Masa Depan", en: "Choose a Future" } },
  { no: 4, nama: { id: "Mengambil Keputusan", en: "Make Decisions" } },
  { no: 5, nama: { id: "Bertindak Bersama", en: "Act Together" } },
  { no: 6, nama: { id: "Dampak Nyata", en: "Real Impact" } },
];

export const pita = (jenis: string) => PITA[jenis] ?? "var(--fg-faint)";

export const keluarga = (jenis: string): Keluarga =>
  KELUARGA[jenis] ?? "konteks";

export const namaJenis = (jenis: string, lang: Lang) =>
  lang === "id" ? (NAMA_ID[jenis] ?? jenis) : jenis;

export const namaZona = (zona: string, lang: Lang) =>
  lang === "id" ? (ZONA_ID[zona] ?? zona) : zona;

export const namaFase = (no: number, lang: Lang) =>
  FASE.find((f) => f.no === no)?.nama[lang] ?? String(no);

/** Label pendek fase untuk kaki kartu: "Fase 4", "Penyiapan". */
export const labelFase = (no: number, lang: Lang) =>
  no === 0
    ? namaFase(0, lang)
    : lang === "id"
      ? `Fase ${no}`
      : `Phase ${no}`;

/** Besar dampak sebuah kartu: jumlah nilai mutlak keempat indikator.
 *  Dipakai hanya untuk mengurutkan, tidak pernah ditampilkan sebagai
 *  angka tersendiri — permainan tidak mengenal skor gabungan. */
export const besarDampak = (k: Kartu) =>
  k.impact ? k.impact.reduce((j, n) => j + Math.abs(n), 0) : -1;
