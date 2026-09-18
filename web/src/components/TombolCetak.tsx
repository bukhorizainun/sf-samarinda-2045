"use client";

/**
 * Tombol cetak. Memanggil lembar cetak peramban, yang juga jalan
 * sebagai "simpan sebagai PDF" di hampir semua perangkat — jadi tidak
 * perlu pustaka PDF sama sekali.
 */
export function TombolCetak({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn btn-utama tanpa-cetak"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        <path d="M7 8V4h10v4" />
        <rect x="4" y="8" width="16" height="7" rx="2" />
        <path d="M7 15h10v5H7z" />
      </svg>
      {label}
    </button>
  );
}
