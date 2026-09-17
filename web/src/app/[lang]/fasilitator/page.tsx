import type { Metadata } from "next";
import { Container, Section } from "@/components/Section";
import { KepalaNongol } from "@/components/KepalaNongol";
import { FASIL } from "@/content/fasilitator";
import { INDICATORS, UI } from "@/content/site";
import { LANGS, t, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Fasilitator",
  description:
    "Panduan membawakan satu sesi Futures in Action: menjaga waktu enam fase, lembar validasi, aturan GenAI di meja, dan cara menutup sesi.",
};

export default async function Fasilitator({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const id = lang === "id";

  return (
    <>
      <Container className="pb-10 pt-14 sm:pt-20">
        <p className="t-eyebrow">{id ? "Untuk fasilitator" : "For facilitators"}</p>
        <h1 className="t-h1 mt-4 max-w-[17ch]">
          {id
            ? "Membawakan satu sesi, dari meja sampai aksi nyata"
            : "Running one session, from table to real action"}
        </h1>
        <p className="t-lead measure mt-6">{t(FASIL.lead, lang)}</p>
      </Container>

      {/* Sebelum mulai */}
      {/* Kepala yang nongol dari tepi halaman, timbul tenggelam
          sambil melambai. Bawaannya milik halaman ini. */}
      <KepalaNongol sosok="shelly" sisi="kanan" bawa="pena" />

      <Section className="border-t rule !pt-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <div>
            <h2 className="t-h2">{t(FASIL.siapkanJudul, lang)}</h2>
            <p className="t-body mt-4 text-[0.95rem]">
              {id
                ? "Lima menit persiapan yang menentukan sembilan puluh menit berikutnya."
                : "Five minutes of setup that decide the next ninety."}
            </p>
          </div>
          <ol className="space-y-5">
            {FASIL.siapkan[lang].map((x, i) => (
              <li key={i} className="flex gap-5 border-t pt-5 rule">
                <span className="font-display text-xl tabular-nums text-[var(--fg-faint)]">
                  {i + 1}
                </span>
                <p className="t-body text-[0.95rem]">{x}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Menjaga waktu */}
      <Section className="border-t rule">
        <h2 className="t-h2">{t(FASIL.jalanJudul, lang)}</h2>
        <p className="t-body measure mt-4">
          {id
            ? "Enam fase, masing-masing 15–18 menit. Kalau waktunya sempit, persingkat pembahasan di dalam fase — jangan membuang fasenya, karena tiap fase menyiapkan bahan untuk fase berikutnya."
            : "Six phases, 15–18 minutes each. When time is short, shorten the discussion inside a phase — do not drop the phase, because each one prepares what the next needs."}
        </p>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-[var(--line)] rule sm:grid-cols-2">
          {FASIL.jalan.map((p, i) => (
            <li key={i} className="bg-[var(--bg)] p-7 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-display text-2xl tabular-nums text-[var(--fg-faint)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs tabular-nums text-[var(--fg-faint)]">
                  {t(p.waktu, lang)}
                </span>
              </div>
              <h3 className="t-h3 mt-4">{t(p.judul, lang)}</h3>
              <p className="t-body mt-2.5 text-[0.925rem]">{t(p.isi, lang)}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Lembar validasi & aturan GenAI */}
      <Section className="border-t rule">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="t-h2">{t(FASIL.periksaJudul, lang)}</h2>
            <p className="t-body mt-3 text-[0.95rem]">{t(FASIL.periksaLead, lang)}</p>
            <ul className="mt-8 space-y-4">
              {FASIL.periksa[lang].map((x, i) => (
                <li key={i} className="flex gap-4 border-t pt-4 rule">
                  <span
                    aria-hidden
                    className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded border text-[0.7rem] rule"
                  />
                  <p className="text-[0.925rem] leading-relaxed text-[var(--fg-muted)]">
                    {x}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="t-h2">{t(FASIL.genaiJudul, lang)}</h2>
            <ul className="mt-8 space-y-4">
              {FASIL.genai[lang].map((x, i) => (
                <li key={i} className="flex gap-4 border-t pt-4 rule">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: INDICATORS[i % 4].color }}
                  />
                  <p className="text-[0.925rem] leading-relaxed text-[var(--fg-muted)]">
                    {x}
                  </p>
                </li>
              ))}
            </ul>

            <h2 className="t-h2 mt-14">{t(FASIL.tutupJudul, lang)}</h2>
            <p className="t-body mt-4">{t(FASIL.tutup, lang)}</p>
          </div>
        </div>

        <p className="mt-14 border-t pt-6 text-xs text-[var(--fg-faint)] rule">
          {t(UI.prototypeNote, lang)}
        </p>
      </Section>
    </>
  );
}
