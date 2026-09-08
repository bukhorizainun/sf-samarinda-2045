/**
 * Tanda SF. Geometri persis mengikuti brand/logo/sf-2-mark.svg —
 * monogram putaran kelima, perbandingan 1,59.
 *
 * SEMENTARA: bidang tanda belum dipilih klien (Blok / Monogram / Cakram / Iris).
 * Monogram dipakai di kepala situs sesuai saran studio. Menukarnya nanti
 * cukup mengganti isi berkas ini; tidak ada tata letak yang ikut berubah.
 */
export function Logo({
  className = "",
  mono = false,
  id = "sfg",
}: {
  className?: string;
  mono?: boolean;
  id?: string;
}) {
  const fill = mono ? "currentColor" : `url(#${id})`;
  return (
    <svg
      viewBox="0 0 159 100"
      className={className}
      role="img"
      aria-label="SF — Sustainable Futures"
    >
      {!mono && (
        <defs>
          <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#16a06f" />
            <stop offset=".36" stopColor="#2f7fe0" />
            <stop offset=".72" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#f0a92a" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M64.36 21.30 A28 18.5 0 1 0 41 50 A28 18.5 0 1 1 17.64 78.70"
        fill="none"
        stroke={fill}
        strokeWidth="26"
        strokeLinecap="butt"
      />
      <path
        d="M92 0 H146 L159 13 L146 26 H118 V100 H92 Z M118 40 H149 L123 66 H118 Z"
        fill={fill}
      />
    </svg>
  );
}
