"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BRAND, COMPONENTS, HOME, PHASES, ROLES, tautanPesan } from "@/content/site";
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

          {/* Tiga pesut Mahakam melompat menyeberangi lapis arus, dengan
              ukuran, ketinggian, dan jadwal yang berbeda. Bentuknya
              kepala membulat tanpa moncong, seperti pesut sungguhan,
              bukan lumba-lumba laut. Bidang skala dipisahkan dari
              bidang gerak supaya keduanya tidak saling menimpa. */}
          {[
            { skala: 1, atas: 0, jeda: "0s", laju: "34s" },
            { skala: 0.62, atas: 74, jeda: "-13s", laju: "44s" },
            { skala: 0.44, atas: 120, jeda: "-26s", laju: "52s" },
          ].map((p) => (
            <g key={p.jeda} transform={`translate(0 ${p.atas}) scale(${p.skala})`}>
              <g
                className="pesut"
                fill="var(--color-aqua)"
                opacity={0.5}
                style={{ animationDelay: p.jeda, animationDuration: p.laju }}
              >
                <path d="M0 0 C 0 -9, 10 -14, 24 -13 C 42 -12, 54 -6, 62 0 C 54 6, 42 10, 24 11 C 10 12, 0 9, 0 0 Z" />
                <path d="M34 -12 C 37 -17, 42 -19, 46 -18 C 43 -16, 40 -13, 39 -10 Z" />
                <path d="M62 0 C 70 -6, 78 -8, 84 -7 C 79 -3, 77 0, 77 3 C 79 8, 80 13, 78 17 C 72 13, 66 6, 62 2 Z" />
              </g>
            </g>
          ))}

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

        <div className="relative mt-10 grid items-center gap-8 sm:mt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <div>
          <h1 className="panggung-judul rise max-w-[18ch] [animation-delay:80ms]">
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

          <div className="rise mt-8 [animation-delay:160ms]">
              <p className="t-lead measure">{t(HOME.heroLead, lang)}</p>

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
                {/* Pemesanan berjalan lewat WhatsApp yang sama dengan
                    halaman kontak, dengan pesan pembuka sudah terisi. */}
                <a
                  href={tautanPesan(lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-garis px-7"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="currentColor">
                    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.8 9.8 0 0 0 4.68 1.2h.01c5.43 0 9.84-4.4 9.84-9.84 0-2.63-1.02-5.1-2.88-6.96A9.78 9.78 0 0 0 12.04 2Zm0 1.8c2.15 0 4.17.84 5.69 2.36a7.99 7.99 0 0 1 2.35 5.68c0 4.44-3.6 8.04-8.04 8.04a8.05 8.05 0 0 1-4.1-1.12l-.29-.17-3.05.8.81-2.98-.19-.31a7.98 7.98 0 0 1-1.22-4.26c0-4.44 3.6-8.04 8.04-8.04Zm-2.4 4.03c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.84.14.18 1.9 2.9 4.62 3.96 2.26.88 2.72.7 3.21.66.49-.05 1.58-.64 1.8-1.27.22-.63.22-1.16.16-1.27-.07-.11-.25-.18-.52-.32-.27-.13-1.58-.78-1.83-.87-.25-.09-.42-.14-.6.14-.18.27-.69.87-.84 1.05-.16.18-.31.2-.58.07-.27-.14-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.49-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46l-.5-.01Z" />
                  </svg>
                  {id ? "Pesan lewat WhatsApp" : "Order on WhatsApp"}
                </a>
                <Link
                  href={`${base}/shelbot`}
                  className="text-[0.88rem] font-medium underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:text-[var(--fg)]"
                >
                  {t(HOME.ctaSecondary, lang)}
                </Link>
              </div>
          </div>
          </div>

          {/* Adegan maskot mengisi kolom kanan, bergerak sedikit lebih
              lambat dari tulisan saat digulir. */}
          <div
            className="relative flex justify-center lg:justify-end"
            style={{ transform: `translate3d(0, ${y * 0.05}px, 0)` }}
          >
            <Maskot
              pose="terbang"
              sapaan={id ? "Selamat datang" : "Welcome"}
              className="h-[240px] w-auto sm:h-[300px] lg:h-[380px]"
            />
          </div>
        </div>

        <dl className="fakta rise mt-12 [animation-delay:240ms] sm:mt-16">
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
