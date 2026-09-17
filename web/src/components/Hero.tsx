"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BRAND, COMPONENTS, HOME, PHASES, ROLES } from "@/content/site";
import { Maskot } from "./Maskot";
import { Ombak } from "./Ombak";
import { t, type Lang } from "@/lib/i18n";

/**
 * Pembuka halaman depan: panggung malam di tepi Mahakam.
 *
 * Judul dibuat sebesar poster, lalu dikunci di bawahnya oleh deret
 * fakta permainan. Semua angka di deret itu diambil dari isi situs,
 * bukan ditulis ulang di sini. Lapis arus dan maskot bergerak dengan
 * laju berbeda saat digulir; kalau gerakan diminta dikurangi, semuanya diam.
 */
export function Hero({ lang }: { lang: Lang }) {
  const [y, setY] = useState(0);
  const diam = useRef(false);

  useEffect(() => {
    diam.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (diam.current) return;

    let jalan = false;
    const onScroll = () => {
      if (jalan) return;
      jalan = true;
      requestAnimationFrame(() => {
        setY(Math.min(window.scrollY, 900));
        jalan = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const base = `/${lang}`;
  const id = lang === "id";

  const jumlah = (i: number) => COMPONENTS[i].count;
  const fakta = [
    { n: String(ROLES.length), l: id ? "peran pemain" : "player roles" },
    { n: String(PHASES.length), l: id ? "fase permainan" : "phases of play" },
    { n: jumlah(0), l: id ? "kartu di dek" : "cards in the deck" },
    { n: jumlah(1), l: id ? "zona tematik di papan" : "thematic zones on the board" },
  ];

  return (
    <section className="malam panggung pb-10">
      {/* Lapis 1 — arus sungai */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[75%] opacity-60"
        style={{ transform: `translate3d(0, ${y * -0.08}px, 0)` }}
      >
        <svg
          viewBox="0 0 1200 420"
          preserveAspectRatio="xMidYMax slice"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="arus" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="var(--color-mint)" />
              <stop offset=".38" stopColor="var(--color-aqua)" />
              <stop offset=".72" stopColor="var(--color-iris)" />
              <stop offset="1" stopColor="var(--color-ember)" />
            </linearGradient>
          </defs>

          {[0, 22, 44, 66, 88, 110, 132].map((d, i) => (
            <path
              key={i}
              className="flowline"
              d={`M-60 ${250 + d} C 200 ${190 + d}, 380 ${320 + d}, 620 ${252 + d} S 1000 ${170 + d}, 1260 ${228 + d}`}
              fill="none"
              stroke="url(#arus)"
              strokeWidth={i % 2 ? 1 : 1.6}
              opacity={0.8 - i * 0.1}
              style={{ animationDuration: `${22 + i * 4}s` }}
            />
          ))}
        </svg>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pt-14 sm:px-8 sm:pt-20">
        <div className="rise flex flex-wrap items-center justify-between gap-4">
          <p className="lockup">
            <span>{t(BRAND.name, lang)}</span>
            <span>{t(BRAND.edition, lang)}</span>
          </p>
          <p className="t-eyebrow flex items-center gap-3 !text-[var(--fg-faint)]">
            <span
              aria-hidden
              className="pulse-soft inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-mint)]"
            />
            {t(HOME.heroKicker, lang)}
          </p>
        </div>

        <div className="relative">
          <h1 className="panggung-judul rise mt-12 max-w-[13ch] [animation-delay:80ms] sm:mt-16">
            {id ? (
              <>
                Hari ini kita <span className="tekan">memutuskan</span>.
                Pada 2045, kita melihat akibatnya.
              </>
            ) : (
              <>
                We <span className="tekan">decide</span> today. In 2045 we
                meet what it made.
              </>
            )}
          </h1>

          <div className="mt-10 grid gap-10 pb-14 sm:pb-16 lg:grid-cols-[minmax(0,34rem)_1fr] lg:items-end">
            <div className="rise [animation-delay:160ms]">
              <p className="t-lead">{t(HOME.heroLead, lang)}</p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href={`${base}/permainan`} className="btn btn-utama group px-7">
                  {t(HOME.ctaPrimary, lang)}
                  <span
                    aria-hidden
                    className="transition-transform duration-[var(--gerak-sedang)] ease-[var(--ease-out-soft)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
                <Link href={`${base}/shelbot`} className="btn btn-garis px-7">
                  {t(HOME.ctaSecondary, lang)}
                </Link>
              </div>
            </div>

            {/* Maskot di dermaga. Di layar sempit ia berdiri di bawah
                tombol, bukan menimpanya. */}
            <div
              className="relative flex justify-end"
              style={{ transform: `translate3d(0, ${y * 0.05}px, 0)` }}
            >
              <Maskot
                pose="lambai"
                sapaan={id ? "Selamat datang" : "Welcome"}
                className="h-[190px] w-auto sm:h-[250px] lg:h-[290px]"
              />
            </div>
          </div>
        </div>

        <dl className="fakta rise [animation-delay:240ms]">
          {fakta.map((f) => (
            <div key={f.l}>
              <dt>{f.n}</dt>
              <dd>{f.l}</dd>
            </div>
          ))}
        </dl>

        <div className="flex items-center gap-4 py-7 text-[0.7rem] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
          <span aria-hidden className="isyarat-gulir" />
          {id ? "Gulir untuk mulai" : "Scroll to begin"}
        </div>
      </div>

      {/* Kaki panggung dipotong lengkungan sungai, bukan garis lurus. */}
      <Ombak posisi="bawah" />
    </section>
  );
}
