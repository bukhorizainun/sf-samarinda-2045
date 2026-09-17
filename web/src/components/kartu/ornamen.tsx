/**
 * Ornamen keluarga kartu.
 *
 * Dua belas jenis kartu dikelompokkan menjadi enam keluarga rupa. Tiap
 * keluarga membawa satu motif yang digambar sekali di sini dan dipakai di
 * kepala kartu, punggung kartu, dan kepala penyaring.
 *
 * Motifnya diturunkan dari kosakata anyaman Dayak dan dari bentuk sungai
 * Mahakam: jalinan kepang, pucuk rebung, tumpal bertingkat, mata punai,
 * kisi anyam. Semuanya disederhanakan menjadi garis geometris dan tidak
 * mengutip motif upacara mana pun. Yang dipinjam adalah tata jalinannya,
 * bukan lambangnya.
 *
 * Semua digambar dalam kotak 100x100 dengan `currentColor`, tanpa isian
 * warna sendiri, supaya warnanya selalu datang dari pita jenis kartu.
 */

export type Keluarga =
  | "peran"
  | "konteks"
  | "dorong"
  | "proyek"
  | "kesempatan"
  | "bukti";

/** Jenis kartu di dek resmi, dipetakan ke keluarga rupanya. */
export const KELUARGA: Record<string, Keluarga> = {
  "ROLE CARD": "peran",
  "SPECIAL GOAL": "peran",
  "SAMARINDA SCENARIO": "konteks",
  "PROBLEM FACTOR": "konteks",
  DRIVER: "dorong",
  UNCERTAINTY: "dorong",
  "MINI-PROJECT": "proyek",
  "OPEN PROJECT": "proyek",
  OPPORTUNITY: "kesempatan",
  EVENT: "kesempatan",
  "GENAI PROMPT": "bukti",
  "ACTION EVIDENCE": "bukti",
};

/* ---------- Bahan gambar ---------- */

/** Satu deret pucuk rebung: segitiga bertingkat, dasar di bawah. */
function pucukRebung(y: number, lebar: number, tinggi: number, n: number) {
  const d: string[] = [];
  for (let i = 0; i < n; i++) {
    const x = i * lebar;
    d.push(`M${x} ${y}L${x + lebar / 2} ${y - tinggi}L${x + lebar} ${y}`);
  }
  return d.join("");
}

/** Jalinan kepang: dua deret busur berselang, seperti bilah teranyam. */
function kepang(y: number, langkah: number, n: number, tinggi: number) {
  const d: string[] = [];
  for (let i = 0; i < n; i++) {
    const x = i * langkah;
    const arah = i % 2 === 0 ? -tinggi : tinggi;
    d.push(`M${x} ${y}q${langkah / 2} ${arah} ${langkah} 0`);
  }
  return d.join("");
}

/** Mata punai: belah ketupat bersusun dari satu titik. */
function mataPunai(cx: number, cy: number, r: number, lapis: number) {
  const d: string[] = [];
  for (let i = 1; i <= lapis; i++) {
    const s = (r * i) / lapis;
    d.push(`M${cx} ${cy - s}L${cx + s} ${cy}L${cx} ${cy + s}L${cx - s} ${cy}Z`);
  }
  return d.join("");
}

/* ---------- Enam motif ---------- */

const GARIS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.15,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Peran dan tujuan. Lima simpul yang saling terikat di atas jalinan
 *  kepang: lima pemangku kepentingan, dan kesepakatan yang mengikatnya. */
function Peran() {
  const simpul = [
    [50, 16],
    [82, 39],
    [70, 76],
    [30, 76],
    [18, 39],
  ];
  const tali = simpul
    .map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`)
    .join("") + "Z";

  return (
    <g {...GARIS}>
      <path d={tali} opacity={0.85} />
      <path d={kepang(92, 20, 5, 7)} opacity={0.6} />
      {simpul.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.4} fill="currentColor" stroke="none" />
      ))}
    </g>
  );
}

/** Skenario dan faktor masalah. Kelokan Mahakam dengan deret pucuk
 *  rebung di tepinya: kota yang duduk di tepi sungai. */
function Konteks() {
  return (
    <g {...GARIS}>
      <path d="M2 30q22 0 32 14t30 14 34-16" opacity={0.9} />
      <path d="M2 44q22 0 32 14t30 14 34-16" opacity={0.55} />
      <path d="M2 58q22 0 32 14t30 14 34-16" opacity={0.3} />
      <path d={pucukRebung(22, 16, 11, 6)} opacity={0.75} />
      <path d={pucukRebung(96, 16, 8, 6)} opacity={0.4} />
    </g>
  );
}

/** Pendorong dan ketidakpastian. Tumpal yang menajam ke satu arah,
 *  lalu pecah menjadi garis putus: arah yang jelas, hasil yang belum. */
function Dorong() {
  return (
    <g {...GARIS}>
      <path d="M6 22L34 40L6 58" opacity={0.85} />
      <path d="M30 22L58 40L30 58" opacity={0.6} />
      <path d="M54 22L82 40L54 58" opacity={0.35} />
      <path d="M8 76h84" strokeDasharray="2 7" opacity={0.7} />
      <path d="M8 86h84" strokeDasharray="2 12" opacity={0.45} />
      <path d={pucukRebung(12, 22, 8, 4)} opacity={0.4} />
    </g>
  );
}

/** Proyek. Kisi anyam: bilah tegak dan melintang yang saling menyilang,
 *  sebagian terisi penuh — modul yang sudah terpasang. */
function Proyek() {
  const bilah: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    const p = 12 + i * 19;
    bilah.push(<path key={`v${i}`} d={`M${p} 8V92`} opacity={0.5} />);
    bilah.push(<path key={`h${i}`} d={`M8 ${p}H92`} opacity={0.5} />);
  }
  const terisi = [
    [12, 31],
    [50, 12],
    [69, 50],
    [31, 69],
  ];
  return (
    <g {...GARIS}>
      {bilah}
      {terisi.map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={19}
          height={19}
          fill="currentColor"
          stroke="none"
          opacity={0.32}
        />
      ))}
    </g>
  );
}

/** Peluang dan kejadian. Mata punai yang memancar: satu titik yang
 *  akibatnya menyebar ke seluruh papan. */
function Kesempatan() {
  return (
    <g {...GARIS}>
      <path d={mataPunai(50, 50, 38, 4)} opacity={0.6} />
      <path d="M50 4v10M96 50H86M50 96V86M4 50h10" opacity={0.8} />
      <path d="M77 23l-7 7M77 77l-7-7M23 77l7-7M23 23l7 7" opacity={0.5} />
      <circle cx={50} cy={50} r={4} fill="currentColor" stroke="none" />
    </g>
  );
}

/** Prompt GenAI dan bukti aksi. Tumpal bertingkat yang menyempit ke
 *  satu titik, lalu satu tanda centang: banyak keluaran, satu yang
 *  lolos pemeriksaan. */
function Bukti() {
  return (
    <g {...GARIS}>
      <path d={pucukRebung(34, 22, 15, 4)} opacity={0.75} />
      <path d={pucukRebung(52, 22, 11, 4)} opacity={0.45} />
      <path d="M30 72l12 12 26-28" strokeWidth={2.1} opacity={0.9} />
      <path d="M8 92h84" opacity={0.4} />
    </g>
  );
}

const MOTIF: Record<Keluarga, () => React.ReactElement> = {
  peran: Peran,
  konteks: Konteks,
  dorong: Dorong,
  proyek: Proyek,
  kesempatan: Kesempatan,
  bukti: Bukti,
};

/**
 * Ornamen satu keluarga. Selalu hiasan: diberi `aria-hidden`, dan
 * warnanya diwarisi dari induknya.
 */
export function Ornamen({
  keluarga,
  className,
}: {
  keluarga: Keluarga;
  className?: string;
}) {
  const Motif = MOTIF[keluarga];
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <Motif />
    </svg>
  );
}

/**
 * Motif yang diulang sebagai pola penuh. Dipakai pada punggung kartu,
 * tempat satu gambar tunggal terlihat terlalu sepi.
 */
export function OrnamenUlang({
  keluarga,
  className,
  petak = 46,
}: {
  keluarga: Keluarga;
  className?: string;
  petak?: number;
}) {
  const Motif = MOTIF[keluarga];
  const id = `anyam-${keluarga}`;
  return (
    <svg className={className} aria-hidden focusable="false">
      <defs>
        <pattern
          id={id}
          width={petak}
          height={petak}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(12)"
        >
          <svg viewBox="0 0 100 100" width={petak} height={petak}>
            <Motif />
          </svg>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
