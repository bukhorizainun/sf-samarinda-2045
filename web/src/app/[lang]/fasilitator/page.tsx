import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { Halaman } from "@/components/Halaman";
import { KepalaHalaman } from "@/components/KepalaHalaman";
import { Ombak } from "@/components/Ombak";
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
    <Halaman motif="perahu" adegan="hutan">
      <KepalaHalaman
        sikap="tunjuk"
        pendamping="keduanya"
        eyebrow={id ? "Untuk fasilitator" : "For facilitators"}
        lebar="17ch"
        title={
          id
            ? "Membawakan satu sesi, dari meja sampai aksi nyata"
            : "Running one session, from table to real action"
        }
        lead={t(FASIL.lead, lang)}
      />

      {/* Sebelum mulai */}

      <Section className="band border-t rule">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <div>
            <p className="bab mb-6"><b>01 / 03</b>{id ? "Sebelum mulai" : "Before you start"}</p>
            <h2 className="t-h2">{t(FASIL.siapkanJudul, lang)}</h2>
            <p className="t-body mt-4 text-[0.95rem]">
              {id
                ? "Lima menit persiapan yang menentukan seratus menit berikutnya."
                : "Five minutes of setup that decide the next hundred."}
            </p>
          </div>
          <ol className="space-y-3">
            {FASIL.siapkan[lang].map((x, i) => (
              <li key={i} className="ubin flex items-start gap-4 !p-5">
                <span className="token token-kecil">{i + 1}</span>
                <p className="t-body pt-0.5 text-[0.95rem]">{x}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Menjaga waktu */}
      <Section className="papan berombak relative">
        <Ombak posisi="atas" />
        <p className="bab mb-6"><b>02 / 03</b>{id ? "Selama sesi" : "During the session"}</p>
        <h2 className="t-h2">{t(FASIL.jalanJudul, lang)}</h2>
        <p className="t-body measure mt-4">
          {id
            ? "Enam fase, masing-masing 15–18 menit. Kalau waktunya sempit, persingkat pembahasan di dalam fase — jangan membuang fasenya, karena tiap fase menyiapkan bahan untuk fase berikutnya."
            : "Six phases, 15–18 minutes each. When time is short, shorten the discussion inside a phase — do not drop the phase, because each one prepares what the next needs."}
        </p>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FASIL.jalan.map((p, i) => (
            <li key={i} className="petak">
              <div className="flex items-center justify-between gap-4">
                <span className="token">{i + 1}</span>
                <span className="rounded-full border px-2.5 py-1 text-xs tabular-nums text-[var(--fg-muted)] rule">
                  {t(p.waktu, lang)}
                </span>
              </div>
              <h3 className="t-h3 mt-1">{t(p.judul, lang)}</h3>
              <p className="t-body text-[0.925rem]">{t(p.isi, lang)}</p>
            </li>
          ))}
        </ol>
        <Ombak posisi="bawah" />
      </Section>

      {/* Lembar validasi & aturan GenAI */}
      <Section className="border-t rule">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="bab mb-6"><b>03 / 03</b>{id ? "Menutup sesi" : "Closing the session"}</p>
            <h2 className="t-h2">{t(FASIL.periksaJudul, lang)}</h2>
            <p className="t-body mt-3 text-[0.95rem]">{t(FASIL.periksaLead, lang)}</p>
            <ul className="mt-8 space-y-4">
              {FASIL.periksa[lang].map((x, i) => (
                <li key={i} className="flex gap-4 border-t pt-4 rule">
                  <span aria-hidden className="centang" />
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
    </Halaman>
  );
}
