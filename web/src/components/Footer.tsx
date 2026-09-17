import Link from "next/link";
import { Logo } from "./Logo";
import { BRAND, NAV, UI } from "@/content/site";
import { t, type Lang } from "@/lib/i18n";

export function Footer({ lang }: { lang: Lang }) {
  const base = `/${lang}`;
  const year = 2026;

  return (
    <footer className="band border-t rule">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="h-8 w-auto" />
            {/* Satu-satunya tempat nama panjang muncul selain kepala halaman. */}
            <p className="mt-4 text-[0.95rem] font-medium">
              {t(BRAND.name, lang)}
            </p>
            <p className="t-eyebrow mt-1">{t(BRAND.tagline, lang)}</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--fg-faint)]">
              {t(UI.prototypeNote, lang)}
            </p>
          </div>

          <nav aria-label={t(UI.menu, lang)}>
            <p className="t-eyebrow">{t(UI.menu, lang)}</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.slug || "home"}>
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

          <div>
            <p className="t-eyebrow">{t(BRAND.edition, lang)}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--fg-muted)]">
              {lang === "id"
                ? "Edisi berjalan. Papan, kartu, dan isunya disusun untuk Samarinda; kerangka permainannya bisa dipindahkan ke kota lain."
                : "The current edition. Board, cards, and issues are built for Samarinda; the framework itself can travel to other cities."}
            </p>
            <a
              href="mailto:shelbot.2026@gmail.com"
              className="mt-5 inline-block text-sm text-[var(--fg-muted)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:text-[var(--fg)]"
            >
              shelbot.2026@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t pt-6 text-xs text-[var(--fg-faint)] rule sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {t(BRAND.name, lang)} · {t(BRAND.edition, lang)}
          </p>
          <p>{BRAND.studio}</p>
        </div>
      </div>
    </footer>
  );
}
