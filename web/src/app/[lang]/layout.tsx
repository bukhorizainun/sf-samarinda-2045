import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Inter } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { THEME_SCRIPT } from "@/components/ThemeToggle";
import { UI } from "@/content/site";
import { LANGS, isLang, t, type Lang } from "@/lib/i18n";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SF — Sustainable Futures · Futures in Action",
    template: "%s · SF",
  },
  description:
    "Futures in Action, edisi Samarinda 2045. Board game keberlanjutan tentang menimbang lingkungan, masyarakat, ekonomi, dan masa depan kota.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1013" },
  ],
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Menetapkan tampilan sebelum halaman tergambar, supaya tidak ada kedip. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${display.variable} ${body.variable}`}>
        <a
          href="#isi"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:border focus:bg-[var(--bg-raised)] focus:px-4 focus:py-2 focus:text-sm rule"
        >
          {t(UI.skip, lang)}
        </a>
        <Header lang={lang} />
        <main id="isi">{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
