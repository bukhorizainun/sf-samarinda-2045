"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shelly dan Hakam, sepasang maskot Samarinda 2045.
 *
 * Digambar sendiri sebagai satu adegan SVG: dua sosok anak berbusana adat
 * Kalimantan Timur yang disederhanakan jadi bidang dan garis.
 *
 * Sikap keduanya mengikuti `pose`, dan itulah yang membuat mereka ikut
 * menanggapi masa depan yang sedang dipilih pengunjung:
 *
 *   lambai — menyambut di dermaga, dipakai di pembuka halaman
 *   amati  — berdiri diam memandang sungai; tidak ada yang ditanam
 *   tanam  — keduanya menanam, dan tunasnya tumbuh dari tanah
 *   terbang— naik ketinting yang melayang, didampingi enggang
 *   loncat — meloncat sekali saat bagiannya masuk pandangan
 *   tunjuk — menunjuk ke arah isi halaman, badan bergoyang pelan
 *   kartu  — memegang satu kartu permainan, dibolak-balik pelan
 *   renang — berenang di Mahakam, badan sebatas dada di atas air
 *   duduk  — duduk di tepi rakit, kaki terjuntai ke air
 *   jalan  — melangkah di tempat: kaki dan lengan berayun bergantian,
 *            badan naik-turun tiap langkah. Pembungkusnya yang
 *            memindahkan sosok melintasi halaman.
 *
 * Diklik atau diketuk, keduanya bersorak: meloncat kecil dan
 * memercikkan empat warna City Indicator. Pupil mengikuti kursor.
 *
 * `latar` mematikan sungai, perahu, dan papan dermaga, supaya sosoknya bisa
 * ditumpangkan pada adegan lain.
 */

const RAMBUT = "#161f28";
const ANGGOTA = "#243040";
const KULIT_A = "#f3d3b8"; // Shelly
const KULIT_B = "#e9c19f"; // Hakam

export type Pose =
  | "lambai"
  | "amati"
  | "tanam"
  | "terbang"
  | "loncat"
  | "tunjuk"
  | "kartu"
  | "renang"
  | "duduk"
  | "jalan";

/** Bidang gambar, dipotong ke sosok yang sedang dibutuhkan. Angkanya
 *  mengikuti pergeseran kedua sosok di dalam adegan. */
const BIDANG = {
  keduanya: "0 0 260 200",
  hakam: "50 0 90 182",
  shelly: "124 0 92 182",
  /* Kepala dan bahu, dari ujung bulu enggang sampai pangkal lengan.
     Tingginya berhenti di 92: di bawah itu lengan sisi dalam mulai
     tergambar, dan ia masuk potongan sebagai puntung gelap. Dipakai
     saat sosoknya nongol besar dari tepi halaman. */
  "kepala-hakam": "72 0 50 92",
  "kepala-shelly": "134 0 50 92",
};

export function Maskot({
  pose = "lambai",
  latar = true,
  sosok = "keduanya",
  sapaan,
  className = "",
}: {
  pose?: Pose;
  latar?: boolean;
  /** Satu sosok saja, atau keduanya dalam satu adegan. */
  sosok?: keyof typeof BIDANG;
  sapaan?: string;
  className?: string;
}) {
  /* Bidang yang sedang tampil, dipakai mask peluruh tepi. */
  const [vx, vy, vw, vh] = (
    pose === "renang" ? "0 0 240 120" : BIDANG[sosok]
  )
    .split(" ")
    .map(Number);

  const [dekat, setDekat] = useState(false);
  const [lirik, setLirik] = useState(0);
  /* Hitungan sorakan. Tiap klik menaikkannya; angka itu jadi key
     percikan, jadi percikan yang berurutan selalu mulai dari awal. */
  const [sorak, setSorak] = useState(0);
  const waktuSorak = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* Kelompok yang meloncat. Kelas animasinya dicabut lalu dipasang
     lagi langsung di DOM, supaya loncatan bisa diulang tanpa membuat
     ulang seluruh sosok. */
  const loncatRef = useRef<SVGGElement>(null);

  const bersorak = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const g = loncatRef.current;
    if (g) {
      g.classList.remove("mk-sorak");
      void g.getBoundingClientRect();
      g.classList.add("mk-sorak");
    }
    setSorak((n) => n + 1);
    if (waktuSorak.current) clearTimeout(waktuSorak.current);
    waktuSorak.current = setTimeout(() => {
      loncatRef.current?.classList.remove("mk-sorak");
      setSorak(0);
    }, 950);
  };
  useEffect(() => () => {
    if (waktuSorak.current) clearTimeout(waktuSorak.current);
  }, []);
  const ref = useRef<SVGSVGElement>(null);

  // Mereka menoleh ke arah kursor, tapi hanya sedikit.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const k = el.getBoundingClientRect();
      const dx = (e.clientX - (k.left + k.width / 2)) / k.width;
      setLirik(Math.max(-1, Math.min(1, dx)) * 1.6);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={pose === "renang" ? "0 0 240 120" : BIDANG[sosok]}
      className={className}
      role="img"
      aria-label={
        sosok === "keduanya"
          ? "Shelly dan Hakam, maskot Samarinda 2045"
          : sosok.endsWith("shelly")
            ? "Shelly, maskot Samarinda 2045"
            : "Hakam, maskot Samarinda 2045"
      }
      onMouseEnter={() => setDekat(true)}
      onMouseLeave={() => setDekat(false)}
      onClick={bersorak}
      style={{ cursor: "pointer" }}
    >
      <defs>
        <linearGradient id="mk-air" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-aqua)" />
          <stop offset="1" stopColor="var(--color-mint)" />
        </linearGradient>
        <linearGradient id="mk-luruh" x1="0" y1="0" x2="1" y2="0">
          {/* Mask memakai luminansi: putih berarti tampak, hitam
              berarti hilang. Jadi peluruhannya ditulis sebagai putih
              yang memudar, bukan hitam. */}
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.16" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.84" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="mk-tepi" maskUnits="userSpaceOnUse" x={vx} y={vy} width={vw} height={vh + 40}>
          <rect x={vx} y={vy} width={vw} height={vh + 40} fill="url(#mk-luruh)" />
        </mask>
        <linearGradient id="mk-manik" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-ember)" />
          <stop offset="1" stopColor="var(--color-rose)" />
        </linearGradient>
      </defs>

      {pose === "terbang" && (
        <g aria-hidden>
          {/* Awan tipis, bergerak berlawanan arah supaya terasa melintas. */}
          <g className="mk-awan" fill="var(--fg)" opacity="0.08">
            <ellipse cx="46" cy="40" rx="30" ry="9" />
            <ellipse cx="214" cy="26" rx="22" ry="7" />
            <ellipse cx="120" cy="18" rx="16" ry="5" />
          </g>

          {/* Tiga enggang gading, dengan ukuran dan jadwal kepak yang
              berbeda. Letaknya dijaga di luar pita x 60–200 pada
              ketinggian lengan, supaya tidak pernah menutupi tangan
              yang melambai. */}
          {/* Dua sosok menempati x 84–190 dan y 31 ke bawah, termasuk
              bulu enggang di kepala dan tangan yang terangkat sampai
              x 189. Ketiga burung dijaga di luar petak itu: dua di
              pita langit y < 28, satu di sisi kiri x < 80. */}
          <g transform="translate(8 -23) scale(0.55)">
            <Enggang />
          </g>
          <g transform="translate(170 -22) scale(0.5)">
            <Enggang jeda="-1.8s" />
          </g>
          <g transform="translate(-4 18) scale(0.7)">
            <Enggang jeda="-3.4s" />
          </g>
        </g>
      )}

      {/* Ketinting yang melayang: perahu bermotor kecil, kendaraan
          sehari-hari di Mahakam. Di sini ia jadi kendaraan terbang. */}
      {pose === "terbang" && (
        <g className="mk-ketinting" aria-hidden>
          {/* Lambung: haluan dan buritan naik, seperti ketinting di
              Mahakam. Dua nada supaya sisi dalamnya terbaca. */}
          <path
            d="M46 162 C 52 182, 90 190, 134 190 C 178 190, 216 182, 224 162 C 196 172, 160 176, 134 176 C 108 176, 74 172, 46 162 Z"
            fill="var(--color-ulin)"
            opacity="0.85"
          />
          <path
            d="M46 162 C 74 172, 108 176, 134 176 C 160 176, 196 172, 224 162 L218 158 L52 158 Z"
            fill="var(--color-ember)"
            opacity="0.55"
          />
          {/* Tumpal: deret pucuk rebung di lambung. */}
          <g fill="var(--bg-raised)" opacity="0.6">
            {[70, 92, 114, 136, 158, 180, 200].map((x) => (
              <path key={x} d={`M${x} 164 l6 0 l-3 6 Z`} />
            ))}
          </g>
          {/* Galah mesin tempel dan baling kecil di buritan. */}
          <path d="M224 168 L250 152" stroke="var(--fg)" strokeWidth="2.4" opacity="0.5" strokeLinecap="round" />
          <circle cx="252" cy="150" r="4.5" fill="none" stroke="var(--fg)" strokeWidth="1.8" opacity="0.5" />
          {/* Riak di bawah lambung: tanda ia benar-benar melayang. */}
          <g stroke="var(--color-aqua)" strokeWidth="1.6" fill="none" opacity="0.4" strokeLinecap="round">
            <path d="M66 196 q10 -5 20 0" />
            <path d="M112 199 q10 -5 20 0" />
            <path d="M158 196 q10 -5 20 0" />
          </g>
        </g>
      )}

      {/* Riak di belakang sosok. Air yang menutup badannya digambar
          setelah sosok, supaya benar-benar berada di depan. */}
      {pose === "duduk" && (
        <g aria-hidden mask="url(#mk-tepi)" stroke="var(--color-aqua)" fill="none" strokeLinecap="round">
          {[150, 166, 182].map((y, i) => (
            <path
              key={y}
              className="mk-riak"
              style={{ animationDelay: `${i * -1.5}s` }}
              d={`M-10 ${y} q16 -7 32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0`}
              strokeWidth={2 - i * 0.4}
              opacity={0.45 - i * 0.1}
            />
          ))}
        </g>
      )}

      {/* Bayangan yang memipih saat sosoknya meloncat. */}
      {pose === "loncat" && (
        <ellipse
          className="mk-bayang"
          cx="130"
          cy="184"
          rx="52"
          ry="6"
          fill="var(--fg)"
          opacity="0.14"
          aria-hidden
        />
      )}

      {latar && pose !== "terbang" && (
        <>
          {/* Sungai dan perahu yang lewat */}
          <g opacity="0.5">
            <path
              d="M0 150 q32 -7 64 0 t64 0 t64 0 t68 0"
              fill="none"
              stroke="url(#mk-air)"
              strokeWidth="2"
            />
            <path
              d="M0 162 q32 -7 64 0 t64 0 t64 0 t68 0"
              fill="none"
              stroke="url(#mk-air)"
              strokeWidth="1.4"
              opacity="0.6"
            />
            <g className="mk-perahu">
              <path d="M0 143 h22 l-4 6 h-14 Z" fill="var(--fg)" opacity="0.45" />
              <path
                d="M11 143 v-7"
                stroke="var(--fg)"
                strokeWidth="1"
                opacity="0.45"
              />
            </g>
          </g>

          {/* Papan dermaga */}
          <g stroke="var(--fg)" strokeWidth="1.4" opacity="0.35" fill="none">
            <line x1="18" y1="168" x2="242" y2="168" />
            <line x1="18" y1="176" x2="242" y2="176" />
            {[40, 78, 116, 154, 192, 226].map((x) => (
              <line key={x} x1={x} y1="168" x2={x} y2="176" />
            ))}
            <line x1="62" y1="176" x2="62" y2="196" />
            <line x1="198" y1="176" x2="198" y2="196" />
          </g>
        </>
      )}

      {/* Tunas yang ditanam. Hanya ada pada masa depan yang menuntut kerja. */}
      {pose === "tanam" && (
        <g fill="none" strokeLinecap="round">
          <g className="mk-tumbuh">
            <path d="M68 170 v-13" stroke="var(--color-env)" strokeWidth="2.4" />
            <path
              d="M68 161 q-8 -4 -10 -12 q10 1 10 10 Z"
              fill="var(--color-env)"
              opacity="0.8"
            />
            <path
              d="M68 158 q8 -5 11 -13 q-10 0 -11 11 Z"
              fill="var(--color-env)"
              opacity="0.8"
            />
          </g>
          <g className="mk-tumbuh" style={{ animationDelay: "0.45s" }}>
            <path d="M196 170 v-11" stroke="var(--color-env)" strokeWidth="2.4" />
            <path
              d="M196 162 q-7 -4 -9 -11 q9 1 9 9 Z"
              fill="var(--color-env)"
              opacity="0.8"
            />
            <path
              d="M196 159 q7 -4 10 -11 q-9 0 -10 9 Z"
              fill="var(--color-env)"
              opacity="0.8"
            />
          </g>
        </g>
      )}

      {pose !== "renang" && (
      <g ref={loncatRef}>
      <g
        className={
          pose === "amati"
            ? undefined
            : pose === "terbang"
              ? "mk-terbang"
              : pose === "loncat"
                ? "mk-loncat"
                : pose === "tunjuk"
                  ? "mk-goyang"
                  : pose === "duduk"
                    ? "mk-duduk"
                    : pose === "jalan"
                      ? "mk-melangkah"
                      : "mk-apung"
        }
        style={{ transform: `translateX(${lirik * 0.4}px)` }}
      >
        {/* ---------- Hakam ---------- */}
        <g transform="translate(78 0)">
          <Lengan pose={pose} sisi="kanan" kulit={KULIT_B} dalam />

          <g className="mk-bulu">
            <path
              d="M14 56 C 10 44, 12 37, 16 33 C 20 39, 20 48, 18 57 Z"
              fill="var(--bg-raised)"
              stroke={ANGGOTA}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>

          <path
            d="M6 108 C 6 92, 13 84, 24 84 C 35 84, 42 92, 42 108 L42 148 L6 148 Z"
            fill="var(--color-future)"
            opacity="0.9"
          />
          <path d="M24 86 L24 148" stroke="var(--bg)" strokeWidth="1.4" opacity="0.5" />
          <path
            d="M10 96 q14 8 28 0 q-3 10 -14 10 q-11 0 -14 -10 Z"
            fill="url(#mk-manik)"
          />

          <g stroke={ANGGOTA} strokeWidth="4" strokeLinecap="round">
            <line className={pose === "jalan" ? "mk-kaki-a" : undefined} x1="16" y1="148" x2="16" y2="170" />
            <line className={pose === "jalan" ? "mk-kaki-b" : undefined} x1="32" y1="148" x2="32" y2="170" />
          </g>

          <Lengan pose={pose} sisi="kiri" kulit={KULIT_B} />
          {pose === "kartu" && <KartuPegang />}

          <path
            d="M8 66 C 8 54, 15 48, 24 48 C 33 48, 40 54, 40 66 L40 74 C 40 82, 33 88, 24 88 C 15 88, 8 82, 8 74 Z"
            fill={KULIT_B}
          />
          <path
            d="M6 68 C 4 50, 13 42, 24 42 C 35 42, 44 50, 42 68 C 38 58, 34 54, 24 54 C 14 54, 10 58, 6 68 Z"
            fill={RAMBUT}
          />
          <path d="M7 62 q17 -8 34 0 l0 6 q-17 -7 -34 0 Z" fill="url(#mk-manik)" />
          <g className="mk-kedip-b" fill={RAMBUT}>
            <g className="mk-pupil" style={{ transform: `translateX(${lirik * 0.7}px)` }}>
              <circle cx="18" cy="71" r="2.2" />
              <circle cx="30" cy="71" r="2.2" />
            </g>
          </g>
          <path
            d={pose === "amati" ? "M20 79 h8" : "M20 78 q4 4 8 0"}
            fill="none"
            stroke={RAMBUT}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* ---------- Shelly ---------- */}
        <g transform="translate(140 0)">
          <Lengan pose={pose} sisi="kiri" kulit={KULIT_A} dalam />

          <g className="mk-bulu" style={{ animationDelay: "-1.8s" }}>
            <path
              d="M30 54 C 34 42, 33 35, 29 31 C 25 37, 26 46, 27 55 Z"
              fill="var(--bg-raised)"
              stroke={ANGGOTA}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>

          <path
            d="M4 108 C 4 92, 11 84, 22 84 C 33 84, 40 92, 40 108 L44 150 L0 150 Z"
            fill="var(--color-env)"
            opacity="0.9"
          />
          <path
            d="M8 96 q14 8 28 0 q-3 10 -14 10 q-11 0 -14 -10 Z"
            fill="url(#mk-manik)"
          />
          <g stroke="var(--bg)" strokeWidth="1.2" opacity="0.45">
            <line x1="4" y1="138" x2="40" y2="138" />
            <line x1="2" y1="144" x2="42" y2="144" />
          </g>

          <g stroke={ANGGOTA} strokeWidth="4" strokeLinecap="round">
            <line className={pose === "jalan" ? "mk-kaki-b" : undefined} x1="15" y1="150" x2="15" y2="170" />
            <line className={pose === "jalan" ? "mk-kaki-a" : undefined} x1="29" y1="150" x2="29" y2="170" />
          </g>

          <Lengan pose={pose} sisi="kanan" kulit={KULIT_A} />
          {pose === "kartu" && <KartuPegang warna="var(--color-future)" />}

          <path
            d="M6 66 C 6 54, 13 48, 22 48 C 31 48, 38 54, 38 66 L38 74 C 38 82, 31 88, 22 88 C 13 88, 6 82, 6 74 Z"
            fill={KULIT_A}
          />
          <path
            d="M4 70 C 2 50, 11 42, 22 42 C 33 42, 42 50, 40 70 L40 84 C 38 74, 36 66, 22 66 C 8 66, 6 74, 4 84 Z"
            fill={RAMBUT}
          />
          <path d="M5 62 q17 -8 34 0 l0 6 q-17 -7 -34 0 Z" fill="url(#mk-manik)" />
          <g className="mk-kedip-a" fill={RAMBUT}>
            <g className="mk-pupil" style={{ transform: `translateX(${lirik * 0.7}px)` }}>
              <circle cx="16" cy="71" r="2.2" />
              <circle cx="28" cy="71" r="2.2" />
            </g>
          </g>
          <path
            d={pose === "amati" ? "M18 79 h8" : "M18 78 q4 4 8 0"}
            fill="none"
            stroke={RAMBUT}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <g className="mk-anting">
            <circle cx="6" cy="76" r="1.8" fill="var(--color-ember)" />
            <circle cx="38" cy="76" r="1.8" fill="var(--color-ember)" />
          </g>
        </g>
      </g>
      </g>
      )}


      {/* Adegan berenang. Sosok berdiri tidak dipakai di sini: orang
          yang berenang dilihat dari samping, badan mendatar, satu
          tangan menjulur ke depan dan satunya mengayuh ke belakang.
          Bajunya pakaian renang biasa — kain adat tidak dipakai masuk
          sungai. */}
      {pose === "renang" && (
        <g aria-hidden>
          {/* Air di belakang perenang */}
          <g mask="url(#mk-tepi)">
            <g stroke="var(--color-aqua)" fill="none" strokeLinecap="round">
              {[70, 84, 98].map((y, i) => (
                <path
                  key={y}
                  className="mk-riak"
                  style={{ animationDelay: `${i * -1.6}s` }}
                  d={`M-20 ${y} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`}
                  strokeWidth={2 - i * 0.4}
                  opacity={0.45 - i * 0.1}
                />
              ))}
            </g>
          </g>

          <g ref={loncatRef}>
          <g className="mk-renang">
            <Perenang
              baju={sosok === "hakam" ? "var(--color-future)" : "var(--color-env)"}
              kulit={sosok === "hakam" ? KULIT_B : KULIT_A}
            />
          </g>
          </g>

          {/* Permukaan air menutupi badan bagian bawah, jadi yang
              terlihat hanya punggung, kepala, dan lengan. */}
          <g mask="url(#mk-tepi)">
            <path
              className="mk-permukaan"
              d="M-20 72 q20 -7 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 L280 130 L-20 130 Z"
              fill="var(--color-aqua)"
              opacity="0.34"
            />
            <path
              className="mk-permukaan"
              style={{ animationDelay: "-2.6s" }}
              d="M-20 82 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 L280 130 L-20 130 Z"
              fill="var(--color-aqua)"
              opacity="0.24"
            />
          </g>

          {/* Percikan: di depan tangan yang masuk air, dan di kaki. */}
          <g className="mk-percik" fill="var(--color-aqua)" opacity="0.6">
            <circle cx="186" cy="62" r="3" />
            <circle cx="196" cy="55" r="2" />
            <circle cx="178" cy="54" r="1.6" />
          </g>
          <g
            className="mk-percik"
            style={{ animationDelay: "-0.8s" }}
            fill="var(--color-aqua)"
            opacity="0.5"
          >
            <circle cx="46" cy="66" r="3.4" />
            <circle cx="34" cy="58" r="2.2" />
            <circle cx="54" cy="56" r="1.8" />
          </g>
        </g>
      )}

      {/* Rakit bambu, digambar di depan kaki yang terjuntai. */}
      {pose === "duduk" && (
        <g className="mk-rakit" aria-hidden mask="url(#mk-tepi)">
          {/* Bambu, bukan ulin: warnanya hangat supaya tidak terbaca
              sebagai pagar hitam melintang. */}
          <g stroke="#c89a5b" strokeWidth="7" strokeLinecap="round">
            {[158, 167].map((y) => (
              <line key={y} x1="40" y1={y} x2="220" y2={y} />
            ))}
          </g>
          <g stroke="#a87c43" strokeWidth="1.6" opacity="0.8">
            <line x1="40" y1="162.5" x2="220" y2="162.5" />
          </g>
          <g stroke="var(--color-ember)" strokeWidth="2.4" opacity="0.8">
            <line x1="62" y1="153" x2="62" y2="172" />
            <line x1="198" y1="153" x2="198" y2="172" />
          </g>
          {/* Tumpal kecil di sisi rakit, kosakata anyaman yang sama. */}
          <g fill="var(--color-mint)" opacity="0.45">
            {[78, 104, 130, 156, 182].map((x) => (
              <path key={x} d={`M${x} 172 l7 0 l-3.5 6 Z`} />
            ))}
          </g>
        </g>
      )}

      {sapaan && (
        <g className="mk-sapa" style={{ opacity: dekat ? 1 : 0 }} aria-hidden>
          <rect
            x="80"
            y="8"
            width="104"
            height="26"
            rx="13"
            fill="var(--bg-raised)"
            stroke="var(--line-strong)"
            strokeWidth="1"
          />
          <path d="M126 34 l6 8 l6 -8 Z" fill="var(--bg-raised)" />
          <text
            x="132"
            y="25"
            textAnchor="middle"
            fontSize="11"
            fill="var(--fg)"
            fontFamily="var(--font-body), system-ui, sans-serif"
          >
            {sapaan}
          </text>
        </g>
      )}
      {/* Percikan sorakan: empat warna City Indicator memancar dari atas
          kepala, lalu hilang. Hanya ada selama sorakan berjalan, dan
          digambar paling akhir supaya tidak tertutup gelembung sapaan. */}
      {sorak > 0 && (
        <Percik
          key={sorak}
          cx={pose === "renang" ? 170 : sosok === "hakam" || sosok === "kepala-hakam" ? 102 : sosok === "shelly" || sosok === "kepala-shelly" ? 162 : 132}
          cy={pose === "renang" ? 40 : 40}
        />
      )}
    </svg>
  );
}

/** Lengan, digambar menurut sikap yang sedang dipakai. */
function Lengan({
  pose,
  sisi,
  kulit,
  dalam = false,
}: {
  pose: Pose;
  sisi: "kiri" | "kanan";
  kulit: string;
  /** Lengan sisi dalam: menggantung tenang, dan digambar di balik badan. */
  dalam?: boolean;
}) {
  const garis = {
    stroke: ANGGOTA,
    strokeWidth: 4,
    strokeLinecap: "round" as const,
  };

  if (dalam && (pose === "terbang" || pose === "loncat")) {
    return sisi === "kiri" ? (
      <>
        <line x1="8" y1="94" x2="2" y2="112" {...garis} />
        <circle cx="1" cy="114" r="3.4" fill={kulit} />
      </>
    ) : (
      <>
        <line x1="38" y1="94" x2="44" y2="112" {...garis} />
        <circle cx="45" cy="114" r="3.4" fill={kulit} />
      </>
    );
  }

  if (dalam && pose !== "jalan") {
    return sisi === "kiri" ? (
      <>
        <line x1="8" y1="94" x2="1" y2="120" {...garis} />
        <circle cx="0" cy="122" r="3.4" fill={kulit} />
      </>
    ) : (
      <>
        <line x1="38" y1="94" x2="45" y2="120" {...garis} />
        <circle cx="46" cy="122" r="3.4" fill={kulit} />
      </>
    );
  }

  // Menanam: tangan turun ke depan, menghadap tunas.
  if (pose === "tanam") {
    return sisi === "kiri" ? (
      <g className="mk-tanam-b">
        <line x1="8" y1="98" x2="-2" y2="118" {...garis} />
        <circle cx="-3" cy="120" r="3.4" fill={kulit} />
      </g>
    ) : (
      <g className="mk-tanam-a">
        <line x1="38" y1="98" x2="48" y2="118" {...garis} />
        <circle cx="49" cy="120" r="3.4" fill={kulit} />
      </g>
    );
  }

  // Mengamati: tangan menggantung tenang di sisi badan.
  if (pose === "amati") {
    return sisi === "kiri" ? (
      <>
        <line x1="8" y1="98" x2="3" y2="120" {...garis} />
        <circle cx="2" cy="122" r="3.4" fill={kulit} />
      </>
    ) : (
      <>
        <line x1="38" y1="98" x2="43" y2="120" {...garis} />
        <circle cx="44" cy="122" r="3.4" fill={kulit} />
      </>
    );
  }

  // Menunjuk: lengan sisi luar menunjuk keluar adegan, lengan sisi
  // dalam bertumpu di pinggang. Arahnya mengikuti sisi, jadi kedua
  // sosok menunjuk ke arah yang berbeda dan tidak saling menutupi.
  if (pose === "tunjuk") {
    if (dalam) {
      return sisi === "kiri" ? (
        <>
          <line x1="8" y1="98" x2="2" y2="110" {...garis} />
          <line x1="2" y1="110" x2="13" y2="116" {...garis} />
          <circle cx="14" cy="117" r="3.4" fill={kulit} />
        </>
      ) : (
        <>
          <line x1="38" y1="98" x2="44" y2="110" {...garis} />
          <line x1="44" y1="110" x2="33" y2="116" {...garis} />
          <circle cx="32" cy="117" r="3.4" fill={kulit} />
        </>
      );
    }

    return sisi === "kiri" ? (
      <g className="mk-tunjuk mk-tunjuk-kiri">
        <line x1="8" y1="98" x2="-12" y2="92" {...garis} />
        <circle cx="-14" cy="91" r="3.4" fill={kulit} />
        <line x1="-16" y1="90" x2="-24" y2="88" stroke={kulit} strokeWidth="2.6" strokeLinecap="round" />
      </g>
    ) : (
      <g className="mk-tunjuk">
        <line x1="38" y1="98" x2="58" y2="92" {...garis} />
        <circle cx="60" cy="91" r="3.4" fill={kulit} />
        <line x1="62" y1="90" x2="70" y2="88" stroke={kulit} strokeWidth="2.6" strokeLinecap="round" />
      </g>
    );
  }

  // Memegang kartu: kedua tangan ke depan, sejajar.
  if (pose === "kartu") {
    return sisi === "kiri" ? (
      <>
        <line x1="8" y1="98" x2="12" y2="116" {...garis} />
        <circle cx="13" cy="118" r="3.4" fill={kulit} />
      </>
    ) : (
      <>
        <line x1="38" y1="98" x2="34" y2="116" {...garis} />
        <circle cx="33" cy="118" r="3.4" fill={kulit} />
      </>
    );
  }

  // Berenang: satu tangan menjulur ke depan, satunya mengayuh ke
  // belakang, bergantian seperti gaya bebas.
  if (pose === "renang") {
    return sisi === "kiri" ? (
      <g className="mk-kayuh-b">
        <line x1="8" y1="96" x2="-14" y2="86" {...garis} />
        <circle cx="-16" cy="85" r="3.4" fill={kulit} />
      </g>
    ) : (
      <g className="mk-kayuh-a">
        <line x1="38" y1="96" x2="56" y2="104" {...garis} />
        <circle cx="58" cy="105" r="3.4" fill={kulit} />
      </g>
    );
  }

  // Duduk santai: satu tangan bertumpu di rakit, satunya di lutut.
  if (pose === "duduk") {
    return sisi === "kiri" ? (
      <>
        <line x1="8" y1="96" x2="-4" y2="86" {...garis} />
        <line x1="-4" y1="86" x2="6" y2="74" {...garis} />
        <circle cx="7" cy="73" r="3.4" fill={kulit} />
      </>
    ) : (
      <>
        <line x1="38" y1="96" x2="50" y2="86" {...garis} />
        <line x1="50" y1="86" x2="40" y2="74" {...garis} />
        <circle cx="39" cy="73" r="3.4" fill={kulit} />
      </>
    );
  }

  // Berjalan: lengan menggantung dan berayun berlawanan dengan kaki.
  if (pose === "jalan") {
    return sisi === "kiri" ? (
      <g className={dalam ? "mk-ayun-b" : "mk-ayun-a"}>
        <line x1="8" y1="96" x2="3" y2="118" {...garis} />
        <circle cx="2" cy="120" r="3.4" fill={kulit} />
      </g>
    ) : (
      <g className={dalam ? "mk-ayun-a" : "mk-ayun-b"}>
        <line x1="38" y1="96" x2="43" y2="118" {...garis} />
        <circle cx="44" cy="120" r="3.4" fill={kulit} />
      </g>
    );
  }

  // Terbang dan meloncat: kedua tangan terangkat.
  if (pose === "terbang" || pose === "loncat") {
    return sisi === "kiri" ? (
      <g className="mk-angkat-b">
        <line x1="8" y1="96" x2="-2" y2="74" {...garis} />
        <circle cx="-3" cy="72" r="3.4" fill={kulit} />
      </g>
    ) : (
      <g className="mk-angkat-a">
        <line x1="38" y1="96" x2="48" y2="74" {...garis} />
        <circle cx="49" cy="72" r="3.4" fill={kulit} />
      </g>
    );
  }

  // Menyambut: melambai dengan tangan sisi luar.
  return sisi === "kiri" ? (
    <g className="mk-lambai-b">
      <line x1="8" y1="96" x2="-4" y2="80" {...garis} />
      <circle cx="-5" cy="78" r="3.4" fill={kulit} />
    </g>
  ) : (
    <g className="mk-lambai-a">
      <line x1="38" y1="96" x2="50" y2="80" {...garis} />
      <circle cx="51" cy="78" r="3.4" fill={kulit} />
    </g>
  );
}

/**
 * Enggang gading, burung khas Kalimantan.
 *
 * Yang membuatnya enggang dan bukan burung mana pun: paruh besar
 * melengkung dengan balung di atasnya, badan gempal, dan ekor panjang.
 * `jeda` menggeser jadwal kepak dan layangnya, jadi tiga ekor di satu
 * adegan tidak pernah bergerak serentak.
 */
function Enggang({ jeda = "0s" }: { jeda?: string }) {
  return (
    <g className="mk-enggang" style={{ animationDelay: jeda }}>
      {/* Badan dan ekor panjang */}
      <path
        d="M30 82 C 30 74, 36 69, 45 69 C 54 69, 60 74, 60 81 C 60 87, 54 91, 45 91 C 36 91, 30 88, 30 82 Z"
        fill="var(--fg)"
        opacity="0.62"
      />
      <path d="M30 82 L10 88 L14 80 L10 73 Z" fill="var(--fg)" opacity="0.5" />
      {/* Sayap yang mengepak */}
      <path
        className="mk-sayap"
        style={{ animationDelay: jeda }}
        d="M44 72 C 40 58, 45 49, 55 45 C 56 57, 52 67, 48 74 Z"
        fill="var(--color-ember)"
        opacity="0.8"
      />
      {/* Kepala, paruh melengkung, dan balung */}
      <circle cx="60" cy="76" r="6.5" fill="var(--fg)" opacity="0.62" />
      <path d="M65 75 C 73 73, 80 75, 84 78 C 78 80, 70 81, 65 80 Z" fill="var(--color-ember)" />
      <path d="M66 71 C 72 67, 79 68, 83 71 C 77 72, 71 73, 66 74 Z" fill="var(--color-ember)" opacity="0.75" />
      <circle cx="61" cy="74" r="1.3" fill="var(--bg-raised)" />
    </g>
  );
}

/**
 * Kartu permainan yang dipegang sosok.
 *
 * Koordinatnya lokal terhadap kelompok sosok, bukan terhadap adegan,
 * supaya ia ikut terpotong bersama sosoknya saat hanya satu sosok yang
 * ditampilkan. Rasionya mengikuti kartu cetak, dan pita jenis di tepi
 * kiri sama seperti kartu di katalog.
 */
function KartuPegang({ warna = "var(--color-env)" }: { warna?: string }) {
  return (
    <g className="mk-kartu" aria-hidden>
      <rect
        x="9"
        y="104"
        width="27"
        height="38"
        rx="3"
        fill="var(--bg-raised)"
        stroke="var(--line-strong)"
        strokeWidth="1.2"
      />
      <rect x="9" y="104" width="3" height="38" rx="1.5" fill={warna} />
      <g stroke="var(--fg-faint)" strokeWidth="1.1" opacity="0.5">
        <line x1="16" y1="114" x2="32" y2="114" />
        <line x1="16" y1="120" x2="32" y2="120" />
        <line x1="16" y1="126" x2="28" y2="126" />
      </g>
    </g>
  );
}

/**
 * Perenang, dilihat dari samping.
 *
 * Gaya bebas: badan mendatar tepat di bawah permukaan, satu tangan
 * menjulur ke depan dan satunya mengayuh ke belakang, kepala menoleh
 * untuk mengambil napas, kaki mengibas kecil. Digambar terpisah dari
 * sosok berdiri karena memutar sosok berdiri hanya menghasilkan orang
 * yang tampak tenggelam, bukan berenang.
 *
 * Bajunya pakaian renang biasa: kain adat tidak dipakai masuk sungai.
 */
function Perenang({ baju, kulit }: { baju: string; kulit: string }) {
  const anggota = {
    stroke: kulit,
    strokeWidth: 7,
    strokeLinecap: "round" as const,
    fill: "none",
  };

  return (
    <g>
      {/* Kaki: dua tungkai yang mengibas bergantian */}
      <g className="mk-kibas-a">
        <path d="M78 62 C 62 60, 50 56, 40 50" {...anggota} />
      </g>
      <g className="mk-kibas-b">
        <path d="M78 66 C 62 70, 50 74, 42 78" {...anggota} />
      </g>

      {/* Badan: punggung mendatar, dari pinggul ke bahu */}
      <path
        d="M76 58 C 96 52, 126 50, 148 54 C 152 58, 152 66, 148 70 C 126 74, 96 72, 76 66 Z"
        fill={baju}
      />
      {/* Garis pinggang, penanda pakaian renang */}
      <path d="M96 52 C 98 58, 98 66, 96 72" stroke="var(--bg)" strokeWidth="1.6" fill="none" opacity="0.5" />

      {/* Leher dan kepala, menoleh ke atas untuk bernapas */}
      <path d="M148 58 C 156 56, 160 58, 163 60" {...anggota} strokeWidth="9" />
      <circle cx="170" cy="56" r="11" fill={kulit} />
      {/* Rambut basah menempel, dengan ikat kepala warna merek */}
      <path
        d="M160 50 C 162 42, 176 40, 181 47 C 183 51, 182 56, 180 58 C 176 52, 168 50, 160 54 Z"
        fill={RAMBUT}
      />
      <path d="M161 53 q10 -5 19 0 l0 3 q-10 -4 -19 0 Z" fill="url(#mk-manik)" />
      <circle cx="173" cy="57" r="1.6" fill={RAMBUT} />
      {/* Mulut terbuka kecil: sedang mengambil napas */}
      <path d="M177 61 q3 2 5 0" stroke={RAMBUT} strokeWidth="1.4" fill="none" strokeLinecap="round" />

      {/* Lengan depan menjulur, lengan belakang mengayuh */}
      <g className="mk-ayun-depan">
        <path d="M146 58 C 164 48, 178 44, 190 44" {...anggota} />
        <circle cx="193" cy="44" r="4.4" fill={kulit} />
      </g>
      <g className="mk-ayun-belakang">
        <path d="M100 58 C 84 50, 70 48, 58 50" {...anggota} />
        <circle cx="55" cy="50" r="4.4" fill={kulit} />
      </g>
    </g>
  );
}

/**
 * Percikan sorakan: delapan keping kecil dalam empat warna City
 * Indicator, memancar dari satu titik lalu jatuh dan memudar.
 * Arah tiap keping ditulis tetap, bukan acak, supaya gambar yang
 * terbit sama dengan yang terhidrasi.
 */
const KEPING = [
  { dx: -46, dy: -26, w: "var(--color-env)" },
  { dx: -26, dy: -46, w: "var(--color-society)" },
  { dx: 0, dy: -54, w: "var(--color-economy)" },
  { dx: 26, dy: -46, w: "var(--color-future)" },
  { dx: 46, dy: -26, w: "var(--color-env)" },
  { dx: -56, dy: -4, w: "var(--color-economy)" },
  { dx: 56, dy: -4, w: "var(--color-society)" },
  { dx: 12, dy: -34, w: "var(--color-future)" },
];

function Percik({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g aria-hidden transform={`translate(${cx} ${cy})`}>
      {KEPING.map((k, i) => (
        <g
          key={i}
          className="mk-keping"
          style={
            {
              "--dx": `${k.dx}px`,
              "--dy": `${k.dy}px`,
              animationDelay: `${(i % 3) * 30}ms`,
            } as React.CSSProperties
          }
        >
          {i % 2 === 0 ? (
            <circle r="4.2" fill={k.w} />
          ) : (
            <path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z" fill={k.w} />
          )}
        </g>
      ))}
    </g>
  );
}
