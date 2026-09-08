import Link from "next/link";
import { Section, SectionHead } from "@/components/Section";
import { IndicatorBalance } from "@/components/IndicatorBalance";
import { FutureSwitcher } from "@/components/FutureSwitcher";
import { Hero } from "@/components/Hero";
import {
  BRAND,
  HOME,
  INDICATORS,
  INDICATOR_SCALE,
  PHASES,
  UI,
} from "@/content/site";
import { LANGS, t, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const base = `/${lang}`;

  return (
    <>
      <Hero lang={lang} />

      {/* ---------- Tiga masa depan ---------- */}
      <section className="border-t rule">
        <FutureSwitcher lang={lang} />
      </section>

      {/* ---------- Empat indikator ---------- */}
      <Section className="border-t rule">
        <SectionHead
          eyebrow={lang === "id" ? "City Indicators" : "City Indicators"}
          title={t(HOME.pillarsTitle, lang)}
          lead={t(HOME.pillarsLead, lang)}
        />
        <div className="mt-12">
          <IndicatorBalance lang={lang} />
        </div>
        <p className="mt-8 text-sm text-[var(--fg-faint)] measure">
          {t(INDICATOR_SCALE, lang)}
        </p>
      </Section>

      {/* ---------- Apa ini ---------- */}
      <Section className="border-t rule">
        <SectionHead title={t(HOME.whatTitle, lang)} />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-[var(--line)] rule sm:grid-cols-3">
          {HOME.what.map((item, i) => (
            <div key={i} className="bg-[var(--bg)] p-7 sm:p-8">
              <span
                aria-hidden
                className="block h-1 w-10 rounded-full"
                style={{ background: INDICATORS[i].color }}
              />
              <h3 className="t-h3 mt-6">{t(item.title, lang)}</h3>
              <p className="t-body mt-3 text-[0.95rem]">{t(item.body, lang)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Enam fase, sekilas ---------- */}
      <Section className="border-t rule">
        <SectionHead
          eyebrow={lang === "id" ? "Perjalanan permainan" : "The arc of play"}
          title={
            lang === "id"
              ? "Enam fase, dari mengamati kota sampai bertindak di luar meja"
              : "Six phases, from reading the city to acting beyond the table"
          }
        />
        <ol className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {PHASES.map((p) => (
            <li key={p.no} className="border-t pt-5 rule">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl tabular-nums text-[var(--fg-faint)]">
                  {String(p.no).padStart(2, "0")}
                </span>
                <h3 className="t-h3">{t(p.name, lang)}</h3>
              </div>
              <p className="t-body mt-3 text-[0.925rem]">{t(p.output, lang)}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <Link
            href={`${base}/permainan`}
            className="group inline-flex items-center gap-2 text-[0.9rem] font-medium"
          >
            {lang === "id" ? "Rinciannya di sini" : "See it in detail"}
            <span
              aria-hidden
              className="transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </Section>

      {/* ---------- Penutup ---------- */}
      <Section className="border-t rule">
        <div className="measure">
          <h2 className="t-h1">{t(HOME.closingTitle, lang)}</h2>
          <p className="mt-6 text-xl leading-relaxed sf-gradient-text sm:text-2xl">
            {t(HOME.closingBody, lang)}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`${base}/mini-game`}
              className="rounded-full bg-[var(--fg)] px-6 py-3 text-[0.9rem] font-medium text-[var(--bg)] transition-transform duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5"
            >
              {lang === "id" ? "Main mini game" : "Play the mini game"}
            </Link>
            <Link
              href={`${base}/kontak`}
              className="rounded-full border px-6 py-3 text-[0.9rem] font-medium transition-colors hover:bg-[var(--bg-sunken)] rule"
            >
              {lang === "id" ? "Hubungi kami" : "Get in touch"}
            </Link>
          </div>
          <p className="mt-10 text-xs text-[var(--fg-faint)]">
            {t(UI.prototypeNote, lang)} · {t(BRAND.edition, lang)}
          </p>
        </div>
      </Section>
    </>
  );
}
