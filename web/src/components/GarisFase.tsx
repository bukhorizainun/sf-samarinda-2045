"use client";

import { useEffect, useRef, useState } from "react";
import { PHASES } from "@/content/site";
import { useGerakDikurangi } from "@/lib/gerak";
import { t, type Lang } from "@/lib/i18n";

/**
 * Enam fase sebagai garis waktu.
 *
 * Rel tipis berjalan di tepi kiri; bagian yang sudah terlewat terisi
 * mengikuti gulir, dan simpul fase yang sedang dibaca menyala. Gunanya
 * bukan hiasan: satu sesi berjalan seratus menit, dan pembaca perlu tahu
 * ia sedang di bagian mana dari enam.
 *
 * Gulir dibaca lewat satu IntersectionObserver per simpul, bukan
 * pendengar scroll, jadi tidak ada perhitungan tata letak di tiap bingkai.
 */
export function GarisFase({ lang }: { lang: Lang }) {
  const id = lang === "id";
  const diam = useGerakDikurangi();
  const [terlewat, setTerlewat] = useState(-1);
  const rel = useRef<HTMLOListElement | null>(null);

  /* Saat gerakan diminta dikurangi, seluruh rel tampil terisi: keadaan
     akhir, tanpa sesuatu pun yang bergerak. */
  const sampai = diam ? PHASES.length - 1 : terlewat;

  useEffect(() => {
    if (diam) return;

    const simpul = rel.current?.querySelectorAll("li") ?? [];
    const mata = new IntersectionObserver(
      (masuk) => {
        for (const e of masuk) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.urut);
          setTerlewat((n) => Math.max(n, i));
        }
      },
      /* Simpul dihitung terlewat saat mencapai sepertiga atas layar,
         bukan saat baru menyentuh tepi bawah. */
      { rootMargin: "-33% 0px -55% 0px" },
    );
    for (const s of simpul) mata.observe(s);
    return () => mata.disconnect();
  }, [diam]);

  const isi = sampai < 0 ? 0 : ((sampai + 1) / PHASES.length) * 100;

  return (
    <ol ref={rel} className="fase-rel">
      {/* Rel dan bagian yang sudah terlewat. */}
      <span aria-hidden className="fase-rel-dasar" />
      <span
        aria-hidden
        className="fase-rel-isi"
        style={{ height: `${isi}%` }}
      />

      {PHASES.map((p, i) => (
        <li
          key={p.no}
          data-urut={i}
          data-lewat={i <= sampai ? "ya" : "tidak"}
          className="fase-butir"
        >
          <span aria-hidden className="fase-simpul" />

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
            <div>
              <p className="flex items-baseline gap-3">
                <span className="font-display text-2xl leading-none tabular-nums text-[var(--fg-faint)]">
                  {String(p.no).padStart(2, "0")}
                </span>
                <span className="t-h3">{t(p.name, lang)}</span>
              </p>
              <p className="t-body measure mt-2.5 text-[0.95rem]">
                {t(p.output, lang)}
              </p>
            </div>
            <span className="shrink-0 text-xs tabular-nums text-[var(--fg-faint)]">
              {p.time} {id ? "mnt" : "min"}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
