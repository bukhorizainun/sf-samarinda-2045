import Link from "next/link";
import { Section, SectionHead } from "@/components/Section";
import { IndicatorBalance } from "@/components/IndicatorBalance";
import { FutureSwitcher } from "@/components/FutureSwitcher";
import { Hero } from "@/components/Hero";
import { TumpukanDek } from "@/components/TumpukanDek";
import { PetaPapan } from "@/components/PetaPapan";
import { KomposisiDek } from "@/components/KomposisiDek";
import { Tilt } from "@/components/Tilt";
import { Ombak } from "@/components/Ombak";
import { Reveal } from "@/components/Reveal";
import { Pawai } from "@/components/Pawai";
import cards from "@/content/cards.json";
import type { Kartu } from "@/lib/kartu";
import {
  BRAND,
  HOME,
  tautanPesan,
  INDICATORS,
  INDICATOR_SCALE,
  PHASES,
  UI,
} from "@/content/site";
import { LANGS, t, type Lang } from "@/lib/i18n";

/* Satu kartu untuk tiap jenis, supaya tumpukan di beranda
   memperlihatkan keragaman dek, bukan satu dek yang seragam. */
const DEK: Kartu[] = (() => {
  const pilih: Kartu[] = [];
  for (const c of cards as Kartu[]) {
    if (!pilih.some((k) => k.type === c.type)) pilih.push(c);
  }
  return pilih;
})();

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
      <Section className="band border-t rule">
        <SectionHead
          bab="02 / 06"
          eyebrow={lang === "id" ? "City Indicators" : "City Indicators"}
          title={t(HOME.pillarsTitle, lang)}
          lead={t(HOME.pillarsLead, lang)}
          pendamping="hakam"
          sikap="tunjuk"
        />
        <div className="mt-12">
          <Tilt derajat={3}>
            <IndicatorBalance lang={lang} />
          </Tilt>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link href={`${base}/dasbor`} className="btn btn-garis group">
            {lang === "id"
              ? "Coba di dasbor indikator"
              : "Try the indicator dashboard"}
            <span
              aria-hidden
              className="transition-transform duration-[var(--gerak-sedang)] ease-[var(--ease-out-soft)] group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <p className="text-sm text-[var(--fg-faint)] measure">
            {t(INDICATOR_SCALE, lang)}
          </p>
        </div>
      </Section>

      {/* ---------- Peta papan ---------- */}
      <Section className="border-t rule">
        <SectionHead
          bab="03 / 06"
          eyebrow={lang === "id" ? "Papan" : "The board"}
          title={
            lang === "id"
              ? "Delapan zona kota di satu papan"
              : "Eight city zones on one board"
          }
          pendamping="hakam"
          sikap="renang"
        />
        <div className="mt-12">
          <PetaPapan kartu={cards as Kartu[]} lang={lang} />
        </div>
      </Section>

      {/* ---------- Apa ini ---------- */}
      <Section className="band border-t rule">
        <SectionHead
          bab="04 / 06"
          eyebrow={lang === "id" ? "Tentang" : "About"}
          title={t(HOME.whatTitle, lang)}
          pendamping="keduanya"
          sikap="kartu"
          lebarPendamping="w-[130px]"
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-[var(--line)] rule sm:grid-cols-3">
          {HOME.what.map((item, i) => (
            <Reveal key={i} delay={i * 90} className="bg-[var(--surface-1)] p-7 transition-colors duration-300 hover:bg-[var(--bg-raised)] sm:p-8">
              <span
                aria-hidden
                className="block h-1 w-10 rounded-full"
                style={{ background: INDICATORS[i].color }}
              />
              <h3 className="t-h3 mt-6">{t(item.title, lang)}</h3>
              <p className="t-body mt-3 text-[0.95rem]">{t(item.body, lang)}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- Enam fase, sekilas ---------- */}
      <Section className="papan berombak relative">
        <Ombak posisi="atas" />
        <SectionHead
          bab="05 / 06"
          eyebrow={lang === "id" ? "Perjalanan permainan" : "The arc of play"}
          title={
            lang === "id"
              ? "Enam fase, dari mengamati kota sampai bertindak di luar meja"
              : "Six phases, from reading the city to acting beyond the table"
          }
          pendamping="keduanya"
          sikap="duduk"
        />
        {/* Lintasan papan: enam petak berurutan, tiap petak satu fase. */}
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PHASES.map((p, i) => (
            <Reveal as="li" key={p.no} delay={(i % 3) * 80 + Math.floor(i / 3) * 60}>
              <div className="petak">
                <div className="flex items-center gap-3">
                  <span className="token">{p.no}</span>
                  <h3 className="t-h3">{t(p.name, lang)}</h3>
                </div>
                <p className="t-body text-[0.925rem]">{t(p.output, lang)}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="mt-12">
          <Link
            href={`${base}/permainan`}
            className="btn btn-garis group"
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
        <Ombak posisi="bawah" />
      </Section>

      {/* ---------- Dek ---------- */}
      <Section className="border-t rule">
        <p className="bab mb-12">
          <b>06 / 06</b>
          {lang === "id" ? "Isi kotak" : "What is in the box"}
        </p>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
          <TumpukanDek kartu={DEK} jumlahDek={cards.length} lang={lang} />

          <div>
            <h2 className="t-h1 measure-tight">
              {lang === "id"
                ? "184 kartu, dua belas jenis, delapan zona kota"
                : "184 cards, twelve types, eight city zones"}
            </h2>
            <p className="t-body measure mt-6">
              {lang === "id"
                ? "Peran, skenario Samarinda, faktor masalah, pendorong, ketidakpastian, proyek, peluang, kejadian, prompt GenAI, dan bukti aksi. Tiap kartu menyebut fase tempat ia dipakai, dan kartu proyek membawa biaya, dampak, risiko, serta satu aksi nyata yang bisa dikerjakan siswa."
                : "Roles, Samarinda scenarios, problem factors, drivers, uncertainties, projects, opportunities, events, GenAI prompts, and action evidence. Each card names the phase it belongs to, and project cards carry cost, impact, risk, and one real-world action students can run."}
            </p>
            <Link
              href={`${base}/kartu`}
              className="btn btn-garis group mt-9"
            >
              {lang === "id" ? "Buka katalog kartu" : "Open the card catalogue"}
              <span
                aria-hidden
                className="transition-transform duration-[var(--gerak-sedang)] ease-[var(--ease-out-soft)] group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
        <div className="mt-16">
          <Tilt derajat={3}>
            <KomposisiDek kartu={cards as Kartu[]} lang={lang} />
          </Tilt>
        </div>
      </Section>

      {/* ---------- Penutup ---------- */}
      <Section className="band border-t rule">
        <div className="measure">
          <h2 className="t-h1">{t(HOME.closingTitle, lang)}</h2>
          <p className="mt-6 text-xl leading-relaxed sm:text-2xl">
            {t(HOME.closingBody, lang)}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={tautanPesan(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-utama"
            >
              {lang === "id"
                ? "Pesan lewat WhatsApp"
                : "Order on WhatsApp"}
            </a>
            <Link href={`${base}/mini-game`} className="btn btn-garis">
              {lang === "id" ? "Main mini game" : "Play the mini game"}
            </Link>
            <Link
              href={`${base}/kontak`}
              className="btn btn-garis"
            >
              {lang === "id" ? "Hubungi kami" : "Get in touch"}
            </Link>
          </div>
          <p className="mt-10 text-xs text-[var(--fg-faint)]">
            {t(UI.prototypeNote, lang)} · {t(BRAND.edition, lang)}
          </p>
        </div>
        {/* Shelly dan Hakam berjalan menuju masa depan yang baru saja
            diajak untuk dimulai. */}
        <Pawai className="mt-14" />
      </Section>
    </>
  );
}
