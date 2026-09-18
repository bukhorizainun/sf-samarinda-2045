import type { Metadata } from "next";
import { Container, Section } from "@/components/Section";
import { Halaman } from "@/components/Halaman";
import { KepalaHalaman } from "@/components/KepalaHalaman";
import { PRIVASI } from "@/content/privasi";
import { BRAND } from "@/content/site";
import { LANGS, t, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Apa yang situs SF simpan dan tidak simpan: tanpa pengukur kunjungan, tanpa borang, dan obrolan yang berjalan di peramban.",
};

const SUREL = "shelbot.2026@gmail.com";

/** Tanda di depan tiap butir: dilakukan, tidak dilakukan, atau catatan. */
const TANDA = {
  ya: { simbol: "✓", warna: "var(--color-env)" },
  tidak: { simbol: "✕", warna: "var(--color-economy)" },
  catatan: { simbol: "!", warna: "var(--color-future)" },
} as const;

export default async function Privasi({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const id = lang === "id";

  return (
    <Halaman motif="tenun" adegan="langit">
      <KepalaHalaman
        sikap="amati"
        pendamping="hakam"
        eyebrow={t(PRIVASI.eyebrow, lang)}
        lebar="20ch"
        title={t(PRIVASI.judul, lang)}
        lead={t(PRIVASI.lead, lang)}
      />

      {/* Ringkasan empat baris, untuk yang tidak membaca sampai bawah. */}
      <Container className="pb-12">
        <div className="malam konsol">
          <div className="konsol-kepala">
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="lampu" />
              {id ? "Ringkasnya" : "In short"}
            </span>
            <span className="mono normal-case tracking-normal">
              {id ? "empat baris" : "four lines"}
            </span>
          </div>
          <ul className="grid gap-px bg-[var(--line)] sm:grid-cols-2">
            {PRIVASI.ringkas[lang].map((x, i) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-[var(--bg)] p-5 text-[0.9rem] leading-relaxed"
              >
                <span
                  aria-hidden
                  className="mono mt-0.5 text-[0.8rem]"
                  style={{ color: "var(--color-mint)" }}
                >
                  0{i + 1}
                </span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Section className="band border-t rule">
        <p className="bab mb-10">
          <b>01 / 02</b>
          {id ? "Rinciannya" : "The detail"}
        </p>

        <ul className="grid gap-4 lg:grid-cols-2">
          {PRIVASI.butir.map((b, i) => {
            const tanda = TANDA[b.jenis];
            return (
              <li
                key={i}
                className="ubin"
                style={{ "--pita": tanda.warna } as React.CSSProperties}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="mono grid h-7 w-7 place-items-center rounded-full text-[0.8rem]"
                    style={{
                      color: tanda.warna,
                      background: `color-mix(in oklab, ${tanda.warna} 14%, transparent)`,
                      border: `1px solid color-mix(in oklab, ${tanda.warna} 35%, transparent)`,
                    }}
                  >
                    {tanda.simbol}
                  </span>
                  <h2 className="t-h3 text-[1rem]">{t(b.judul, lang)}</h2>
                </div>
                <p className="t-body mt-3 text-[0.92rem]">{t(b.isi, lang)}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section className="border-t rule">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <p className="bab mb-6">
              <b>02 / 02</b>
              {id ? "Ke depan" : "Going forward"}
            </p>
            <h2 className="t-h2">{t(PRIVASI.perubahanJudul, lang)}</h2>
          </div>
          <div className="measure">
            <p className="t-body">{t(PRIVASI.perubahan, lang)}</p>

            <h3 className="t-h3 mt-10">{t(PRIVASI.tanyaJudul, lang)}</h3>
            <p className="t-body mt-3">{t(PRIVASI.tanya, lang)}</p>
            <a
              href={`mailto:${SUREL}?subject=${encodeURIComponent(
                id ? "Pertanyaan privasi situs SF" : "SF site privacy question",
              )}`}
              className="btn btn-garis group mt-6"
            >
              {SUREL}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <p className="mt-8 text-xs text-[var(--fg-faint)]">{BRAND.studio}</p>
          </div>
        </div>
      </Section>
    </Halaman>
  );
}
