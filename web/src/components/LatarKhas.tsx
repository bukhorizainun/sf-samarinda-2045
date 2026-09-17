/**
 * Latar bermotif khas Samarinda.
 *
 * Gambar garis besar yang duduk jauh di belakang teks, nyaris tak
 * terlihat: kira-kira setipis enam persen. Gunanya menahan halaman agar
 * tidak terbaca sebagai lembar putih berisi tulisan saja, tanpa pernah
 * mengganggu keterbacaan — kontras teks tidak berubah sedikit pun.
 *
 * Tiap halaman memakai satu motif sendiri, dan semuanya benda yang
 * memang ada di kota ini: pesut Mahakam, rumah adat Lamin, perahu
 * ketinting di sungai, tenun sarung Samarinda, jembatan, dan amplang.
 *
 * Warnanya datang dari palet permainan, bukan dari abu-abu. Dua warna
 * per motif, dipasang sebagai gradasi pada garisnya, ditambah satu wash
 * bulat yang sangat lembut di belakangnya. Garis berwarna pada kadar
 * rendah tetap terbaca sebagai warna; garis abu-abu pada kadar yang sama
 * terbaca sebagai kotor. Yang berwarna hanya hiasan: teks, tautan, dan
 * kontrasnya tidak tersentuh.
 */

export type Motif =
  | "pesut"
  | "lamin"
  | "perahu"
  | "tenun"
  | "jembatan"
  | "amplang"
  | "enggang";

/* Dua warna per motif, dipilih dari makna halamannya: sungai kebiruan,
   kayu rumah adat kehangatan, tenun keunguan, pangan kemerahan. */
const WARNA: Record<Motif, [string, string]> = {
  pesut: ["var(--color-aqua)", "var(--color-future)"],
  lamin: ["var(--color-ember)", "var(--color-env)"],
  perahu: ["var(--color-env)", "var(--color-aqua)"],
  tenun: ["var(--color-iris)", "var(--color-rose)"],
  jembatan: ["var(--color-future)", "var(--color-iris)"],
  amplang: ["var(--color-rose)", "var(--color-ember)"],
  enggang: ["var(--color-mint)", "var(--color-iris)"],
};

/* Warna garis tidak ditulis di sini: ia diwarisi dari kelompok induk,
   yang memakai gradasi dua warna motifnya. Titik-titik padat tetap
   memakai `currentColor`, yang disetel ke warna pertama motif. */
const GARIS = {
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Riak sungai, dipakai berulang di beberapa motif. */
function Riak({ y, lebar = 400 }: { y: number; lebar?: number }) {
  const d = [];
  for (let x = 0; x < lebar; x += 40) {
    d.push(`M${x} ${y} q10 -6 20 0 q10 6 20 0`);
  }
  return <path d={d.join(" ")} {...GARIS} strokeWidth={1.6} opacity={0.75} />;
}

/**
 * Pesut Mahakam, lumba-lumba air tawar penghuni sungai ini.
 *
 * Bentuknya sengaja dibedakan dari lumba-lumba laut: kepalanya membulat
 * tanpa moncong, sirip punggungnya kecil dan tumpul, dan badannya
 * gempal. Itu ciri yang membuatnya pesut, bukan ikan mana pun.
 */
function Pesut() {
  return (
    <g {...GARIS}>
      {/* Badan: kepala membulat di kiri, meruncing ke pangkal ekor. */}
      <path d="M74 146 C 74 112, 112 96, 164 98 C 232 101, 282 124, 316 150 C 282 176, 232 190, 164 187 C 112 185, 76 172, 74 146 Z" />
      {/* Sirip punggung kecil dan tumpul. */}
      <path d="M196 100 C 204 88, 216 84, 226 87 C 218 92, 210 98, 206 104" />
      {/* Sirip dada. */}
      <path d="M150 180 C 140 194, 138 206, 144 216 C 156 206, 166 196, 170 186" />
      {/* Ekor bercabang dua. */}
      <path d="M314 150 C 330 134, 348 128, 362 130 C 350 140, 344 150, 344 160 C 350 172, 352 184, 348 194 C 334 184, 322 168, 314 154" />
      {/* Mata dan garis mulut yang khas melengkung ke atas. */}
      <circle cx="98" cy="136" r="3.4" fill="currentColor" stroke="none" />
      <path d="M78 152 C 88 160, 104 162, 118 158" strokeWidth={1.5} opacity={0.85} />
      <Riak y={228} />
      <Riak y={250} />
    </g>
  );
}

/** Rumah adat Lamin: panggung panjang beratap curam dengan ukiran. */
function Lamin() {
  return (
    <g {...GARIS}>
      <path d="M40 132 L200 56 L360 132" />
      <path d="M62 132 L200 76 L338 132" strokeWidth={1.5} opacity={0.7} />
      <path d="M200 56 L200 40" />
      <path d="M180 46 L200 34 L220 46" strokeWidth={1.6} />
      <path d="M62 132 L62 196 M338 132 L338 196" />
      <path d="M62 196 L338 196" />
      {[100, 140, 180, 220, 260, 300].map((x) => (
        <line key={x} x1={x} y1="196" x2={x} y2="244" strokeWidth={1.7} />
      ))}
      <path d="M150 196 L150 152 L250 152 L250 196" strokeWidth={1.5} opacity={0.8} />
      <path d="M186 196 L186 166 L214 166 L214 196" strokeWidth={1.5} opacity={0.8} />
      <Riak y={252} />
    </g>
  );
}

/** Perahu ketinting beratap, tambatan sehari-hari di tepi Mahakam. */
function Perahu() {
  return (
    <g {...GARIS}>
      <path d="M60 176 C 90 200, 300 200, 336 176 L318 172 L78 172 Z" />
      <path d="M104 172 L104 132 L292 132 L292 172" />
      <path d="M92 132 L200 108 L304 132" />
      <path d="M200 108 L200 96" />
      {[140, 176, 212, 248].map((x) => (
        <line key={x} x1={x} y1="132" x2={x} y2="172" strokeWidth={1.4} opacity={0.65} />
      ))}
      <path d="M336 176 L368 158" strokeWidth={1.6} />
      <Riak y={206} />
      <Riak y={228} />
      <Riak y={250} />
    </g>
  );
}

/** Tenun sarung Samarinda: kotak-kotak yang saling menyilang. */
function Tenun() {
  const garis = [];
  for (let i = 0; i < 9; i++) {
    const p = 40 + i * 40;
    garis.push(
      <line key={`v${i}`} x1={p} y1="40" x2={p} y2="240" strokeWidth={i % 2 ? 1.2 : 2.6} opacity={i % 2 ? 0.55 : 1} />,
    );
  }
  for (let i = 0; i < 6; i++) {
    const p = 40 + i * 40;
    garis.push(
      <line key={`h${i}`} x1="40" y1={p} x2="360" y2={p} strokeWidth={i % 2 ? 1.2 : 2.6} opacity={i % 2 ? 0.55 : 1} />,
    );
  }
  return (
    <g {...GARIS}>
      {garis}
      {[
        [80, 80],
        [160, 160],
        [240, 80],
        [320, 160],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y - 14} L${x + 14} ${y} L${x} ${y + 14} L${x - 14} ${y} Z`}
          strokeWidth={1.8}
        />
      ))}
    </g>
  );
}

/** Jembatan di atas Mahakam, dengan kabel-kabelnya. */
function Jembatan() {
  return (
    <g {...GARIS}>
      <path d="M20 168 L380 168" strokeWidth={2.4} />
      <path d="M20 182 L380 182" strokeWidth={1.3} opacity={0.6} />
      <path d="M110 168 L110 56 M290 168 L290 56" />
      <path d="M110 64 C 160 120, 240 120, 290 64" strokeWidth={1.8} />
      <path d="M110 64 C 80 100, 50 130, 20 142" strokeWidth={1.6} opacity={0.8} />
      <path d="M290 64 C 320 100, 350 130, 380 142" strokeWidth={1.6} opacity={0.8} />
      {[140, 170, 200, 230, 260].map((x) => {
        const t = (x - 110) / 180;
        const y = 64 + 56 * (1 - Math.pow(2 * t - 1, 2));
        return <line key={x} x1={x} y1={y} x2={x} y2="168" strokeWidth={1.1} opacity={0.6} />;
      })}
      <Riak y={212} />
      <Riak y={236} />
    </g>
  );
}

/** Amplang, kerupuk ikan yang jadi oleh-oleh khas kota ini. */
function Amplang() {
  const keping = [
    [120, 120, -18],
    [196, 100, 12],
    [268, 128, -8],
    [152, 180, 22],
    [236, 186, -24],
  ] as const;
  return (
    <g {...GARIS}>
      <path d="M70 206 C 70 244, 330 244, 330 206" strokeWidth={2.2} />
      <path d="M62 206 L338 206" strokeWidth={2.2} />
      <path d="M86 226 q114 14 228 0" strokeWidth={1.3} opacity={0.6} />
      {keping.map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <rect x={x - 30} y={y - 16} width="60" height="32" rx="14" strokeWidth={1.9} />
          <path d={`M${x - 16} ${y} q16 -8 32 0`} strokeWidth={1.2} opacity={0.7} />
        </g>
      ))}
    </g>
  );
}

/**
 * Burung enggang, lambang yang sudah hadir di bulu kepala maskot.
 *
 * Tiga ciri yang membuatnya enggang dan bukan burung mana pun: paruh
 * besar melengkung ke bawah, tanduk yang duduk di atas pangkal paruh
 * itu, dan ekor panjang yang menjuntai jauh melewati badan.
 */
function Enggang() {
  return (
    <g {...GARIS}>
      {/* Badan gempal, condong ke kanan. */}
      <path d="M170 168 C 170 124, 204 100, 246 102 C 292 104, 320 134, 316 176 C 312 214, 280 236, 240 232 C 198 228, 170 204, 170 168 Z" />
      {/* Kepala, jauh lebih kecil dari badan dan menempel padanya:
          enggang berleher pendek, jadi tidak ada garis leher sendiri. */}
      <circle cx="162" cy="108" r="22" />
      <circle cx="156" cy="102" r="3.4" fill="currentColor" stroke="none" />
      {/* Paruh besar melengkung ke bawah. */}
      <path d="M142 102 C 114 98, 86 106, 70 122 C 92 130, 120 130, 144 122 Z" strokeWidth={2.1} />
      {/* Tanduk di atas pangkal paruh: ciri utama enggang. */}
      <path d="M84 106 C 92 90, 116 82, 140 88 C 130 94, 122 98, 118 104" strokeWidth={1.9} />
      {/* Sayap terlipat. */}
      <path d="M204 132 C 236 128, 270 144, 288 172 C 260 172, 228 162, 208 146" strokeWidth={1.7} />
      {/* Ekor panjang, tiga helai yang menjuntai. */}
      <path d="M312 194 C 344 208, 372 230, 392 258" />
      <path d="M302 210 C 332 226, 358 248, 374 272" strokeWidth={1.6} opacity={0.8} />
      <path d="M290 222 C 316 240, 338 260, 352 282" strokeWidth={1.4} opacity={0.6} />
      {/* Dahan tempatnya bertengger. */}
      <path d="M64 252 C 140 238, 230 240, 316 256" strokeWidth={2.2} opacity={0.7} />
      <path d="M228 232 L228 248 M252 230 L252 248" strokeWidth={2} />
    </g>
  );
}

const MOTIF: Record<Motif, () => React.ReactElement> = {
  pesut: Pesut,
  lamin: Lamin,
  perahu: Perahu,
  tenun: Tenun,
  jembatan: Jembatan,
  amplang: Amplang,
  enggang: Enggang,
};

export function LatarKhas({ motif }: { motif: Motif }) {
  const Gambar = MOTIF[motif];
  const [a, b] = WARNA[motif];
  const gradasi = `latar-${motif}`;
  const wash = `wash-${motif}`;

  return (
    <div className="latar-khas" aria-hidden>
      <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={gradasi} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
          <radialGradient id={wash} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={a} stopOpacity="0.5" />
            <stop offset="1" stopColor={a} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Wash: satu bulatan warna yang sangat lembut, supaya bidang di
            sekitar motif tidak terasa sekadar putih. */}
        <ellipse cx="210" cy="150" rx="190" ry="130" fill={`url(#${wash})`} />

        {/* Garis motif memakai gradasi dua warna itu. */}
        <g stroke={`url(#${gradasi})`} style={{ color: a }}>
          <Gambar />
        </g>
      </svg>
    </div>
  );
}
