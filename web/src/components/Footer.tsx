import Link from "next/link";
import { Logo } from "./Logo";
import { BRAND, navRata, UI } from "@/content/site";
import { t, type Lang } from "@/lib/i18n";

export function Footer({ lang }: { lang: Lang }) {
  const base = `/${lang}`;
  const year = 2026;

  return (
    <footer className="band border-t rule">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        {/* Tiga kolom setinggi baris grid; baris terakhir kolom kiri dan kanan
            didorong ke bawah (mt-auto) supaya ketiganya rata bawah. */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_1.25fr_1fr]">
          <div className="flex flex-col items-start">
            <Logo className="h-8 w-auto" />
            {/* Satu-satunya tempat nama panjang muncul selain kepala halaman. */}
            <p className="mt-4 text-[0.95rem] font-medium">
              {t(BRAND.name, lang)}
            </p>
            <p className="t-eyebrow mt-1">{t(BRAND.tagline, lang)}</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--fg-faint)] lg:mt-auto lg:pt-5">
              {t(UI.prototypeNote, lang)}
            </p>
          </div>

          <nav aria-label={t(UI.menu, lang)}>
            <p className="t-eyebrow">{t(UI.menu, lang)}</p>
            {/* Dua kolom, dibaca dari atas ke bawah, supaya menu tidak menjulur
                lebih panjang dari kolom di kiri dan kanannya. */}
            <ul className="mt-4 columns-2 gap-x-8">
              {navRata().map((item) => (
                <li key={item.slug || "home"} className="mb-2.5 break-inside-avoid">
                  <Link
                    href={item.slug ? `${base}/${item.slug}` : base}
                    className="text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
                  >
                    {t(item.label, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-start">
            <p className="t-eyebrow">{t(BRAND.edition, lang)}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--fg-muted)]">
              {lang === "id"
                ? "Edisi berjalan. Papan, kartu, dan isunya disusun untuk Samarinda; kerangka permainannya bisa dipindahkan ke kota lain."
                : "The current edition. Board, cards, and issues are built for Samarinda; the framework itself can travel to other cities."}
            </p>
            <a
              href="mailto:shelbot.2026@gmail.com"
              className="mt-5 inline-block text-sm text-[var(--fg-muted)] lg:mt-auto lg:pt-5 underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:text-[var(--fg)]"
            >
              shelbot.2026@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t pt-6 text-xs text-[var(--fg-faint)] rule sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {t(BRAND.name, lang)} · {t(BRAND.edition, lang)}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={`${base}/privasi`}
              className="transition-colors hover:text-[var(--fg)]"
            >
              {lang === "id" ? "Kebijakan privasi" : "Privacy"}
            </Link>
            <p>{BRAND.studio}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
