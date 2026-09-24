import type { Metadata } from "next";
import Link from "next/link";
import { Archivo } from "next/font/google";
import "./globals.css";
import { THEME_SCRIPT } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { Maskot } from "@/components/Maskot";

/**
 * Halaman 404 untuk seluruh situs.
 *
 * Memakai `global-not-found` dan bukan `not-found` biasa, karena tata
 * letak akar situs ini berada di segmen dinamis `[lang]`: alamat yang
 * tidak cocok dengan pola apa pun tidak punya bahasa, jadi tidak ada
 * tata letak yang bisa dipakai. Berkas ini karena itu membawa sendiri
 * dokumen HTML-nya, huruf, gaya, dan penyetel temanya.
 *
 * Isinya dwibahasa berdampingan: pengunjung yang tersesat belum tentu
 * pernah memilih bahasa, jadi keduanya ditulis sekaligus.
 */

/* Satu keluarga untuk seluruh situs. Judul memakai sumbu lebarnya
   (melebar, berat), isi memakai lebar normal; lihat globals.css. */
const huruf = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan · SF",
  description:
    "Alamat itu tidak ada di situs SF — Sustainable Futures, Samarinda 2045.",
};

const TAUTAN = [
  { href: "/id/", id: "Beranda", en: "Home" },
  { href: "/id/permainan/", id: "Board Game", en: "Board Game" },
  { href: "/id/kartu/", id: "Katalog Kartu", en: "Card Catalogue" },
  { href: "/id/kontak/", id: "Kontak", en: "Contact" },
];

export default function GlobalNotFound() {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${huruf.variable}`}>
        <main className="malam panggung relative min-h-screen overflow-hidden">
          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-10 sm:px-8 sm:py-14">
            <Link href="/id/" className="inline-flex w-fit items-center gap-2.5">
              <Logo className="h-7 w-auto" />
              <span className="text-[0.7rem] font-semibold uppercase leading-tight tracking-[0.14em] text-[var(--fg-faint)]">
                Sustainable Futures
              </span>
            </Link>

            <div className="flex flex-1 flex-col justify-center py-14">
              <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="mono text-[0.8rem] text-[var(--fg-faint)]">
                    404 · {new Date().getFullYear()}
                  </p>
                  <h1 className="panggung-judul mt-5 max-w-[16ch]">
                    Jalannya <span className="tekan">belum</span> ada di peta
                  </h1>
                  <p className="t-lead mt-7 max-w-[48ch]">
                    Alamat yang kamu buka tidak ada di situs ini. Mungkin
                    tautannya salah ketik, atau halamannya sudah berpindah.
                  </p>
                  <p className="mt-4 max-w-[48ch] text-[0.95rem] leading-relaxed text-[var(--fg-faint)]">
                    This address does not exist on the site. The link may have a
                    typo, or the page has moved.
                  </p>

                  <nav className="mt-10 flex flex-wrap gap-3" aria-label="Menu">
                    {TAUTAN.map((x, i) => (
                      <Link
                        key={x.href}
                        href={x.href}
                        className={`btn ${i === 0 ? "btn-utama" : "btn-garis"}`}
                      >
                        {x.id}
                        {x.id !== x.en && (
                          <span className="text-[var(--fg-faint)]">
                            · {x.en}
                          </span>
                        )}
                      </Link>
                    ))}
                  </nav>

                  <p className="mt-8 text-xs text-[var(--fg-faint)]">
                    Versi Inggris:{" "}
                    <Link
                      href="/en/"
                      className="underline decoration-[var(--line-strong)] underline-offset-4"
                    >
                      buka halaman depan berbahasa Inggris
                    </Link>
                  </p>
                </div>

                {/* Shelly dan Hakam berdiri memandang: tidak ada yang bisa
                    ditunjuk, karena halamannya memang tidak ada. */}
                <div className="flex justify-center lg:justify-end">
                  <Maskot
                    pose="amati"
                    className="h-[220px] w-auto opacity-95 sm:h-[280px]"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--fg-faint)]">
              SF — Sustainable Futures · Futures in Action · Samarinda 2045
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
