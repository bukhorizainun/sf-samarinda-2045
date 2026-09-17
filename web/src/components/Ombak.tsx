/**
 * Pembatas bagian berbentuk ombak.
 *
 * Dipakai di tepi bidang gelap supaya perpindahan terang ke gelap
 * tidak terbaca sebagai potongan kotak. Bentuknya diisi warna halaman,
 * jadi ia sebenarnya "memakan" tepi bidang gelap dengan lengkungan
 * sungai, bukan menambah garis baru.
 */
export function Ombak({
  posisi,
  className = "",
}: {
  posisi: "atas" | "bawah";
  className?: string;
}) {
  const atas = posisi === "atas";
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      className={`ombak ${atas ? "ombak-atas" : "ombak-bawah"} ${className}`}
    >
      <path
        d={
          atas
            ? "M0 0 H1440 V34 C 1180 78, 980 8, 720 40 C 460 72, 250 22, 0 52 Z"
            : "M0 96 H1440 V62 C 1180 20, 980 90, 720 58 C 460 26, 250 76, 0 46 Z"
        }
        fill="currentColor"
      />
      {/* Satu garis riak tipis mengikuti tepi, memakai warna adegan. */}
      <path
        d={
          atas
            ? "M0 52 C 250 22, 460 72, 720 40 C 980 8, 1180 78, 1440 34"
            : "M0 46 C 250 76, 460 26, 720 58 C 980 90, 1180 20, 1440 62"
        }
        fill="none"
        stroke="var(--scene)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
    </svg>
  );
}
