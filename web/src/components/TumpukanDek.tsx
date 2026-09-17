"use client";

import { useEffect, useRef, useState } from "react";
import { KartuMuka } from "./kartu/KartuMuka";
import { useGerakDikurangi } from "@/lib/gerak";
import type { Kartu } from "@/lib/kartu";
import type { Lang } from "@/lib/i18n";

/** Berapa kartu terlihat dalam tumpukan sekaligus. */
const TERLIHAT = 4;
const JEDA = 4200;

/**
 * Dek sebagai tumpukan kartu.
 *
 * Kartu teratas diambil dan pindah ke dasar tumpukan, lalu berganti
 * sendiri. Pada permainan kartu, tumpukan bukan hiasan: begitulah dek
 * ini berada di meja sebelum dibagikan.
 *
 * Perputarannya berhenti saat pengunjung menyentuh tumpukan atau
 * meminta gerakan dikurangi, dan bisa dimajukan sendiri lewat tombol.
 */
export function TumpukanDek({
  kartu,
  jumlahDek,
  lang,
}: {
  kartu: Kartu[];
  /** Besar dek sebenarnya. Tumpukan hanya memuat satu contoh tiap
   *  jenis, jadi jumlah lapisnya bukan jumlah kartu. */
  jumlahDek: number;
  lang: Lang;
}) {
  const id = lang === "id";
  const diam = useGerakDikurangi();
  const [atas, setAtas] = useState(0);
  const dijeda = useRef(false);

  useEffect(() => {
    if (diam) return;
    const jam = setInterval(() => {
      if (!dijeda.current && !document.hidden) {
        setAtas((n) => (n + 1) % kartu.length);
      }
    }, JEDA);
    return () => clearInterval(jam);
  }, [diam, kartu.length]);

  const maju = () => setAtas((n) => (n + 1) % kartu.length);

  return (
    <div>
      <div
        className="tumpukan"
        onPointerEnter={() => (dijeda.current = true)}
        onPointerLeave={() => (dijeda.current = false)}
      >
        {Array.from({ length: TERLIHAT }, (_, lapis) => {
          const k = kartu[(atas + lapis) % kartu.length];
          return (
            <div
              key={k.code}
              className="tumpukan-lapis"
              data-lapis={lapis}
              aria-hidden={lapis > 0}
              style={{ zIndex: TERLIHAT - lapis }}
            >
              <KartuMuka kartu={k} lang={lang} />
            </div>
          );
        })}
      </div>

      {/* Lapis terbawah tumpukan turun sampai 39 px, jadi barisan ini
          diberi jarak agar tidak tertimpa. */}
      <div className="mt-16 flex items-center justify-between gap-4">
        <p className="text-xs text-[var(--fg-faint)]">
          {id
            ? `Satu contoh tiap jenis, dari ${jumlahDek} kartu`
            : `One sample of each type, from ${jumlahDek} cards`}
        </p>
        <button
          type="button"
          onClick={maju}
          className="shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[0.78rem] text-[var(--fg-muted)] transition-colors duration-[var(--gerak-cepat)] hover:bg-[var(--bg-sunken)] rule"
        >
          {id ? "Kartu berikutnya" : "Next card"}
        </button>
      </div>

      {diam && (
        <p className="sr-only">
          {id
            ? "Perputaran kartu dimatikan karena gerakan diminta dikurangi."
            : "The rotation is off because reduced motion is requested."}
        </p>
      )}
    </div>
  );
}
