import Link from "next/link";
import { BRAND, COMPONENTS, HOME, PHASES, ROLES, tautanPesan } from "@/content/site";
import { KartuMuka } from "./kartu/KartuMuka";
import cards from "@/content/cards.json";
import type { Kartu } from "@/lib/kartu";
import { t, type Lang } from "@/lib/i18n";

/* Tiga kartu yang dibagikan di pembuka, dibaca kiri ke kanan sebagai
   satu cerita: keadaan kota, kejadian yang menimpanya, dan satu aksi. */
const KIPAS = ["S01", "K01", "P34"].map(
  (kode) => (cards as Kartu[]).find((k) => k.code === kode)!,
);

/**
 * Pembuka halaman depan: bidang air Mahakam selebar layar.
 *
 * Yang dipajang adalah benda permainannya sendiri, yaitu kartu dari dek,
 * bukan ilustrasi. Semua angka di deret fakta diambil dari isi situs.
 */
export function Hero({ lang }: { lang: Lang }) {
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
    <section className="malam panggung">
      <div className="mx-auto w-full max-w-6xl px-5 pt-12 sm:px-8 sm:pt-16">
        <div className="rise flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="bab">
            {t(BRAND.tagline, lang)} · {t(BRAND.edition, lang)}
          </p>
          <p className="text-[0.78rem] text-[var(--fg-faint)]">
            {id ? "Board game keberlanjutan" : "A sustainability board game"}
          </p>
        </div>

        <div className="mt-10 grid items-center gap-12 sm:mt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
          <div>
            <h1 className="panggung-judul rise [animation-delay:80ms]">
              {id ? (
                <>
                  Hari ini kita <span className="tekan">memutuskan</span>.{" "}
                  <span className="text-[var(--fg-muted)]">
                    Pada <span className="text-[var(--kuningan)]">2045</span>,
                    kita melihat akibatnya.
                  </span>
                </>
              ) : (
                <>
                  We <span className="tekan">decide</span> today.{" "}
                  <span className="text-[var(--fg-muted)]">
                    In <span className="text-[var(--kuningan)]">2045</span> we
                    meet what it made.
                  </span>
                </>
              )}
            </h1>

            <p className="t-lead measure rise mt-8 [animation-delay:160ms]">
              {t(HOME.heroLead, lang)}
            </p>

            <div className="rise mt-9 flex flex-wrap items-center gap-3 [animation-delay:200ms]">
              <Link href={`${base}/permainan`} className="btn btn-utama group">
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
                className="btn btn-garis"
              >
                {id ? "Pesan lewat WhatsApp" : "Order on WhatsApp"}
              </a>
              <Link
                href={`${base}/shelbot`}
                className="ml-2 text-[0.9rem] font-medium underline decoration-[var(--line-strong)] underline-offset-[6px] transition-colors hover:decoration-[var(--kuningan)]"
              >
                {t(HOME.ctaSecondary, lang)}
              </Link>
            </div>
          </div>

          <div className="kipas rise [animation-delay:240ms]" aria-hidden>
            {KIPAS.map((k) => (
              <div key={k.code}>
                <KartuMuka kartu={k} lang={lang} />
              </div>
            ))}
          </div>
        </div>

        <dl className="fakta rise mt-14 [animation-delay:280ms] sm:mt-20">
          {fakta.map((f) => (
            <div key={f.l}>
              <dt>{f.n}</dt>
              <dd>{f.l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
