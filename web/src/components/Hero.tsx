"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HOME } from "@/content/site";
import { t, type Lang } from "@/lib/i18n";

/**
 * Pembuka halaman depan.
 *
 * Tiga lapis yang bergerak dengan laju berbeda saat digulir: aurora di
 * belakang, arus sungai di tengah, tulisan di depan. Kalau pengunjung
 * meminta gerakan dikurangi, semuanya diam dan halaman tetap utuh.
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
        setY(window.scrollY);
        jalan = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const base = `/${lang}`;
  const id = lang === "id";

  return (
    <section className="relative isolate overflow-hidden">
      {/* Lapis 1 — aurora */}
      <div
        className="aurora"
        aria-hidden
        style={{ transform: `translate3d(0, ${y * 0.18}px, 0)` }}
      >
        <span />
        <span />
        <span />
      </div>

      {/* Lapis 2 — arus sungai */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] opacity-70"
        style={{ transform: `translate3d(0, ${y * -0.09}px, 0)` }}
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
              opacity={0.9 - i * 0.1}
              style={{ animationDuration: `${22 + i * 4}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Lapis 3 — tulisan */}
      <div className="mx-auto w-full max-w-6xl px-5 pb-28 pt-20 sm:px-8 sm:pb-36 sm:pt-28">
        <div className="rise">
          <p className="t-eyebrow flex items-center gap-3">
            <span
              aria-hidden
              className="pulse-soft inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-mint)]"
            />
            {t(HOME.heroKicker, lang)}
          </p>

          <h1 className="t-display mt-7 max-w-[16ch]">
            {id ? (
              <>
                Hari ini kita <span className="grad-text">memutuskan</span>.
                Pada 2045, kita melihat akibatnya.
              </>
            ) : (
              <>
                We <span className="grad-text">decide</span> today. In 2045 we
                meet what it made.
              </>
            )}
          </h1>

          <p className="t-lead measure mt-9">{t(HOME.heroLead, lang)}</p>

          <div className="mt-11 flex flex-wrap items-center gap-3">
            <Link
              href={`${base}/permainan`}
              className="group relative overflow-hidden rounded-full px-7 py-3.5 text-[0.9rem] font-medium text-[var(--color-abyss)] transition-transform duration-500 ease-[var(--ease-glide)] hover:-translate-y-0.5"
            >
              <span aria-hidden className="absolute inset-0 sf-gradient" />
              <span
                aria-hidden
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: "0 18px 60px -18px var(--color-aqua)" }}
              />
              <span className="relative">{t(HOME.ctaPrimary, lang)}</span>
            </Link>

            <Link
              href={`${base}/shelbot`}
              className="glass rounded-full px-7 py-3.5 text-[0.9rem] font-medium transition-colors duration-300 hover:border-[var(--line-strong)]"
            >
              {t(HOME.ctaSecondary, lang)}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
