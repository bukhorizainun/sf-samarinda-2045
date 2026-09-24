import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Archivo } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { THEME_SCRIPT } from "@/components/ThemeToggle";
import { UI } from "@/content/site";
import { LANGS, isLang, t, type Lang } from "@/lib/i18n";
import { SITUS } from "@/lib/situs";

/* Satu keluarga untuk seluruh situs. Judul memakai sumbu lebarnya
   (melebar, berat), isi memakai lebar normal; lihat globals.css. */
const huruf = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  axes: ["wdth"],
});

const JUDUL = "SF — Sustainable Futures · Futures in Action";
const RINGKAS = {
  id: "Futures in Action, edisi Samarinda 2045. Board game keberlanjutan tentang menimbang lingkungan, masyarakat, ekonomi, dan masa depan kota.",
  en: "Futures in Action, Samarinda 2045 Edition. A sustainability board game about weighing environment, society, economy, and the city's future.",
};

/** Pratinjau tautan: yang muncul saat alamat situs dibagikan di percakapan. */
export const metadata: Metadata = {
  metadataBase: new URL(SITUS),
  title: { default: JUDUL, template: "%s · SF" },
  description: RINGKAS.id,
  openGraph: {
    type: "website",
    siteName: "SF — Sustainable Futures",
    title: JUDUL,
    description: RINGKAS.id,
    images: [
      {
        url: "/gambar/pratinjau.png",
        width: 1200,
        height: 630,
        alt: "Futures in Action — Samarinda 2045",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: JUDUL,
    description: RINGKAS.id,
    images: ["/gambar/pratinjau.png"],
  },
  alternates: {
    languages: { id: `${SITUS}/id/`, en: `${SITUS}/en/` },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2ede3" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1312" },
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
      <body className={`${huruf.variable}`}>
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
