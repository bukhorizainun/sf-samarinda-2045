"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { BRAND, NAV, UI } from "@/content/site";
import { LANGS, LANG_SHORT, t, type Lang } from "@/lib/i18n";

/** Lapis 1: tab utama. Tiap tab satu halaman, satu alamat. */
export function Header({ lang }: { lang: Lang }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  /** Tab mana yang sedang membuka lapis keduanya. */
  const [lapis, setLapis] = useState<string | null>(null);
  /* Lapis kedua tertutup sendiri saat halaman berpindah. Disetel saat
     render, bukan di dalam efek: begitu alamat berubah, panelnya tidak
     boleh sempat tergambar sekali pun dalam keadaan terbuka. */
  const [jalurTerakhir, setJalurTerakhir] = useState(pathname);
  if (pathname !== jalurTerakhir) {
    setJalurTerakhir(pathname);
    setLapis(null);
  }
  const [lifted, setLifted] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 8);
    // Dibaca pada frame berikutnya, bukan di dalam badan efek.
    const awal = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(awal);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* Escape menutupnya, dan menekan di luar kepala halaman juga. */
  useEffect(() => {
    if (!lapis) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLapis(null);
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setLapis(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [lapis]);

  const base = `/${lang}`;
  const href = (slug: string) => (slug ? `${base}/${slug}` : base);
  const isActive = (slug: string) => {
    const h = href(slug);
    if (!slug) return pathname === base || pathname === `${base}/`;
    return pathname === h || pathname.startsWith(`${h}/`);
  };

  /** Alamat halaman yang sama dalam bahasa lain. */
  const swap = (to: Lang) => {
    const rest = pathname.replace(/^\/(id|en)/, "");
    return `/${to}${rest || ""}` || `/${to}`;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        lifted
          ? "border-b bg-[var(--bg)]/85 backdrop-blur-md rule"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:h-[4.5rem] sm:px-8">
        <Link
          href={base}
          className="group flex shrink-0 items-center gap-2.5"
          aria-label={`${BRAND.mark} — ${t(BRAND.name, lang)}`}
        >
          <Logo mono className="h-6 w-auto transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-px sm:h-7" />
          <span className="hidden text-[0.7rem] font-semibold uppercase leading-tight tracking-[0.14em] text-[var(--fg-faint)] sm:block">
            {t(BRAND.headerLine, lang)}
          </span>
        </Link>

        <nav
          ref={navRef}
          aria-label={t(UI.menu, lang)}
          className="ml-auto hidden xl:block"
        >
          <ul className="flex items-center gap-0.5">
            {NAV.map((item) => {
              const anak = item.anak ?? [];
              /* Tab bercabang dianggap aktif bila salah satu anaknya
                 yang sedang dibuka. */
              const active =
                isActive(item.slug) || anak.some((x) => isActive(x.slug));
              const terbuka = lapis === item.slug;

              const garis = (
                <span
                  aria-hidden
                  className={`absolute inset-x-3 -bottom-px h-px origin-left transition-transform duration-300 ease-[var(--ease-out-soft)] sf-gradient ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              );
              const gaya = `relative block whitespace-nowrap rounded-full px-3 py-2 text-[0.85rem] transition-colors duration-200 ${
                active
                  ? "text-[var(--fg)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`;

              if (!anak.length) {
                return (
                  <li key={item.slug || "home"}>
                    <Link
                      href={href(item.slug)}
                      aria-current={active ? "page" : undefined}
                      className={gaya}
                    >
                      {t(item.label, lang)}
                      {garis}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.slug} className="relative">
                  <button
                    type="button"
                    aria-expanded={terbuka}
                    aria-controls={`lapis-${item.slug}`}
                    onClick={() => setLapis(terbuka ? null : item.slug)}
                    className={`${gaya} inline-flex items-center gap-1.5`}
                  >
                    {t(item.label, lang)}
                    <svg
                      viewBox="0 0 12 12"
                      aria-hidden
                      className={`h-2.5 w-2.5 transition-transform duration-[var(--gerak-sedang)] ease-[var(--ease-out-soft)] ${
                        terbuka ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M2 4.5 L6 8 L10 4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {garis}
                  </button>

                  {/* Lapis kedua: satu baris satu halaman, dengan
                      keterangan pendek supaya pilihannya jelas. */}
                  <div
                    id={`lapis-${item.slug}`}
                    hidden={!terbuka}
                    className="lapis-dua"
                  >
                    <ul>
                      {anak.map((x) => {
                        const on = isActive(x.slug);
                        return (
                          <li key={x.slug}>
                            <Link
                              href={href(x.slug)}
                              aria-current={on ? "page" : undefined}
                              onClick={() => setLapis(null)}
                              className={`lapis-tautan ${on ? "lapis-aktif" : ""}`}
                            >
                              <span className="block text-[0.9rem] font-medium">
                                {t(x.label, lang)}
                              </span>
                              <span className="mt-0.5 block text-[0.78rem] leading-snug text-[var(--fg-faint)]">
                                {t(x.catatan, lang)}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 xl:ml-3">
          <div className="flex items-center rounded-full border p-0.5 rule">
            {LANGS.map((l) => (
              <Link
                key={l}
                href={swap(l)}
                hrefLang={l}
                aria-current={l === lang ? "true" : undefined}
                className={`rounded-full px-2 py-1 text-[0.7rem] font-semibold tracking-wide transition-colors ${
                  l === lang
                    ? "bg-[var(--bg-sunken)] text-[var(--fg)]"
                    : "text-[var(--fg-faint)] hover:text-[var(--fg)]"
                }`}
              >
                {LANG_SHORT[l]}
              </Link>
            ))}
          </div>

          <ThemeToggle label={t(UI.theme, lang)} />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-kecil"
            className="ml-0.5 grid h-9 w-9 place-items-center rounded-full border transition-colors hover:bg-[var(--bg-sunken)] rule xl:hidden"
          >
            <span className="sr-only">{t(UI.menu, lang)}</span>
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
              {open ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu layar sempit */}
      <div
        id="menu-kecil"
        hidden={!open}
        className="border-t bg-[var(--bg)] rule xl:hidden"
      >
        <ul className="mx-auto max-w-6xl px-5 py-2 sm:px-8">
          {NAV.map((item) => {
            const anak = item.anak ?? [];
            const active =
              isActive(item.slug) || anak.some((x) => isActive(x.slug));
            return (
              <li key={item.slug || "home"} className="border-b last:border-b-0 rule">
                {anak.length === 0 ? (
                  <Link
                    href={href(item.slug)}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 py-3 text-[0.95rem] ${
                      active ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`h-4 w-0.5 rounded-full transition-opacity sf-gradient ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {t(item.label, lang)}
                  </Link>
                ) : (
                  <div className="py-3">
                    <p className="t-eyebrow !text-[0.6rem]">
                      {t(item.label, lang)}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {anak.map((x) => {
                        const on = isActive(x.slug);
                        return (
                          <li key={x.slug}>
                            <Link
                              href={href(x.slug)}
                              onClick={() => setOpen(false)}
                              aria-current={on ? "page" : undefined}
                              className={`flex items-center gap-3 rounded-lg py-2 text-[0.95rem] ${
                                on ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"
                              }`}
                            >
                              <span
                                aria-hidden
                                className={`h-4 w-0.5 rounded-full transition-opacity sf-gradient ${
                                  on ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {t(x.label, lang)}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
