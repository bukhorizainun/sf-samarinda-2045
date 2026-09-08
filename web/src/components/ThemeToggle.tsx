"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark";

export function ThemeToggle({ label }: { label: string }) {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    const stored = (() => {
      try {
        return localStorage.getItem("sf-theme");
      } catch {
        return null;
      }
    })();
    // Terang adalah bawaan. Gelap hanya muncul bila dipilih sendiri.
    const awal: Mode = stored === "dark" ? "dark" : "light";
    const id = setTimeout(() => setMode(awal), 0);
    return () => clearTimeout(id);
  }, []);

  const flip = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("sf-theme", next);
    } catch {
      /* mode penyamaran, atau penyimpanan ditutup. Tampilan tetap jalan. */
    }
  };

  return (
    <button
      type="button"
      onClick={flip}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-full border transition-colors hover:bg-[var(--bg-sunken)] rule"
    >
      <span className="sr-only">{label}</span>
      <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
        {mode === "dark" ? (
          <path
            d="M15.5 12.2A6.2 6.2 0 0 1 7.8 4.5 6.2 6.2 0 1 0 15.5 12.2Z"
            fill="currentColor"
          />
        ) : (
          <>
            <circle cx="10" cy="10" r="3.4" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M10 2v1.8M10 16.2V18M18 10h-1.8M3.8 10H2M15.7 4.3l-1.3 1.3M5.6 14.4l-1.3 1.3M15.7 15.7l-1.3-1.3M5.6 5.6L4.3 4.3" />
            </g>
          </>
        )}
      </svg>
    </button>
  );
}

/** Dijalankan sebelum halaman tergambar, supaya tidak ada kedip terang. */
export const THEME_SCRIPT = `(function(){try{var m=localStorage.getItem('sf-theme');if(m==='light'||m==='dark')document.documentElement.dataset.theme=m;}catch(e){}})();`;
