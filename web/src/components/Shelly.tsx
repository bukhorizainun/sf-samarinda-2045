"use client";

/**
 * Wajah Shelbot. Digambar sendiri, bukan gambar tempelan.
 *
 * Sosoknya perempuan muda dengan ikat kepala bermanik dan dua bulu enggang —
 * mengacu pada busana adat Kalimantan Timur, disederhanakan jadi bidang dan
 * garis supaya sebangun dengan bahasa rupa situs ini, dan supaya tetap tajam
 * pada 36 piksel maupun 240 piksel.
 *
 * Bagian yang bergerak: bulu melambai, anting berayun, kelopak mata berkedip
 * pada jarak yang tidak teratur, dan dada naik-turun pelan. Saat `bicara`
 * menyala, mulutnya ikut bergerak. Semuanya berhenti kalau pengunjung
 * meminta gerakan dikurangi.
 */
// Rambut tetap gelap di kedua tampilan.
const RAMBUT = "#161f28";

export function Shelly({
  size = 40,
  bicara = false,
  className = "",
}: {
  size?: number;
  bicara?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Shelbot"
    >
      <defs>
        <linearGradient id="sh-langit" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-mint)" />
          <stop offset=".5" stopColor="var(--color-aqua)" />
          <stop offset="1" stopColor="var(--color-iris)" />
        </linearGradient>
        <linearGradient id="sh-manik" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-ember)" />
          <stop offset="1" stopColor="var(--color-rose)" />
        </linearGradient>
        <clipPath id="sh-bulat">
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>

      <g clipPath="url(#sh-bulat)">
        {/* Langit sore di tepi Mahakam */}
        <rect width="120" height="120" fill="url(#sh-langit)" opacity="0.18" />
        <circle cx="92" cy="40" r="16" fill="var(--color-ember)" opacity="0.35" />

        {/* Riak sungai */}
        <g stroke="var(--color-aqua)" strokeWidth="1.5" fill="none" opacity="0.45">
          <path d="M-6 96 q16 -5 32 0 t32 0 t32 0 t32 0" />
          <path d="M-6 106 q16 -5 32 0 t32 0 t32 0 t32 0" opacity="0.7" />
        </g>

        <g className="sh-apung">
          {/* Bulu enggang */}
          <g className="sh-bulu">
            <path
              d="M38 30 C 33 16, 35 8, 40 3 C 45 10, 45 20, 42 31 Z"
              fill="var(--bg-raised)"
              stroke="var(--fg)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M40 5 L40 29" stroke="var(--fg)" strokeWidth="1" opacity="0.5" />
            <path
              d="M50 28 C 47 15, 50 8, 55 4 C 59 12, 58 21, 54 29 Z"
              fill="var(--bg-raised)"
              stroke="var(--fg)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M54 6 L53 27" stroke="var(--fg)" strokeWidth="1" opacity="0.5" />
          </g>

          {/* Rambut */}
          <path
            d="M34 56 C 32 32, 45 22, 60 22 C 75 22, 88 32, 86 56 L86 74 C 86 78, 82 80, 79 76 C 80 62, 76 52, 60 52 C 44 52, 40 62, 41 76 C 38 80, 34 78, 34 74 Z"
            fill={RAMBUT}
          />

          {/* Wajah */}
          <path
            d="M42 52 C 42 44, 50 39, 60 39 C 70 39, 78 44, 78 52 L78 64 C 78 76, 70 84, 60 84 C 50 84, 42 76, 42 64 Z"
            fill="#f3d3b8"
          />

          {/* Ikat kepala bermanik */}
          <path
            d="M40 47 C 46 40, 74 40, 80 47 L80 55 C 74 48, 46 48, 40 55 Z"
            fill="url(#sh-manik)"
          />
          <g fill="var(--bg-raised)" opacity="0.85">
            <circle cx="48" cy="48" r="1.6" />
            <circle cx="55" cy="46" r="1.6" />
            <circle cx="62" cy="45.6" r="1.6" />
            <circle cx="69" cy="46.4" r="1.6" />
            <circle cx="75" cy="48.6" r="1.6" />
          </g>

          {/* Poni */}
          <path
            d="M40 50 C 46 42, 74 42, 80 50 C 72 46, 48 46, 40 50 Z"
            fill={RAMBUT}
          />

          {/* Mata */}
          <g className="sh-kedip" fill={RAMBUT}>
            <ellipse cx="52" cy="61" rx="3" ry="3.6" />
            <ellipse cx="68" cy="61" rx="3" ry="3.6" />
          </g>
          <g fill="#fff" opacity="0.9">
            <circle cx="53" cy="60" r="1" />
            <circle cx="69" cy="60" r="1" />
          </g>

          {/* Pipi */}
          <g fill="var(--color-rose)" opacity="0.35">
            <ellipse cx="47" cy="68" rx="4" ry="2.6" />
            <ellipse cx="73" cy="68" rx="4" ry="2.6" />
          </g>

          {/* Mulut */}
          <path
            className={bicara ? "sh-bicara" : ""}
            d="M55 72 q5 5 10 0"
            fill="none"
            stroke={RAMBUT}
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Anting berayun */}
          <g className="sh-anting">
            <circle cx="41" cy="66" r="2.2" fill="url(#sh-manik)" />
            <path d="M41 68 v5" stroke="var(--color-ember)" strokeWidth="1.4" />
            <circle cx="41" cy="75" r="1.6" fill="var(--color-ember)" />
          </g>
          <g className="sh-anting" style={{ animationDelay: "-1.1s" }}>
            <circle cx="79" cy="66" r="2.2" fill="url(#sh-manik)" />
            <path d="M79 68 v5" stroke="var(--color-ember)" strokeWidth="1.4" />
            <circle cx="79" cy="75" r="1.6" fill="var(--color-ember)" />
          </g>

          {/* Bahu dan kalung manik */}
          <path
            d="M30 120 C 30 100, 44 88, 60 88 C 76 88, 90 100, 90 120 Z"
            fill="var(--color-env)"
            opacity="0.9"
          />
          <path
            d="M46 92 C 52 100, 68 100, 74 92 C 70 104, 50 104, 46 92 Z"
            fill="url(#sh-manik)"
          />
          <g fill="var(--bg-raised)" opacity="0.9">
            <circle cx="54" cy="98" r="1.5" />
            <circle cx="60" cy="99.5" r="1.5" />
            <circle cx="66" cy="98" r="1.5" />
          </g>
        </g>
      </g>
    </svg>
  );
}
