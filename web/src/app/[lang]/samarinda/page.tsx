import type { Metadata } from "next";
import { Container, Section } from "@/components/Section";
import { KepalaNongol } from "@/components/KepalaNongol";
import { Tabs } from "@/components/Tabs";
import {
  CHALLENGES,
  INDICATORS,
  REFLECT_QUESTION,
  SAMARINDA_INTRO,
  SAMARINDA_LINK,
  SAMARINDA_QUESTION,
  SDG_NOTE,
  SUSTAINABILITY,
} from "@/content/site";
import { LANGS, t, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = { title: "Samarinda" };

export default async function Samarinda({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const id = lang === "id";

  const tabs = [
    { id: "kota", label: id ? "Kota & Sungai" : "City & River" },
    { id: "tantangan", label: id ? "Empat Tantangan" : "Four Challenges" },
    { id: "keberlanjutan", label: id ? "Keberlanjutan" : "Sustainability" },
  ];

  return (
    <>
      <Container className="pb-10 pt-14 sm:pt-20">
        <p className="t-eyebrow">{id ? "Latar Permainan" : "The Setting"}</p>
        <h1 className="t-h1 mt-4 max-w-[18ch]">
          {id
            ? "Kota yang tumbuh bersama Sungai Mahakam"
            : "A city that grew with the Mahakam"}
        </h1>
        <p className="t-lead measure mt-6">{t(SAMARINDA_INTRO, lang)}</p>
      </Container>

      {/* Kepala yang nongol dari tepi halaman, timbul tenggelam
          sambil melambai. Bawaannya milik halaman ini. */}
      <KepalaNongol sosok="hakam" sisi="kiri" bawa="daun" />

      <Section className="border-t rule !pt-6">
        <Tabs tabs={tabs} label={id ? "Bagian halaman" : "Page sections"}>
          {[
            /* ---- Kota & sungai ---- */
            <div key="kota" className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
              <div className="measure">
                <p className="t-body">{t(SAMARINDA_LINK, lang)}</p>
                <blockquote className="mt-10 border-l-2 pl-6 rule">
                  <p className="t-h3 font-normal leading-relaxed">
                    {t(SAMARINDA_QUESTION, lang)}
                  </p>
                </blockquote>
              </div>
              <aside className="rounded-2xl border p-7 rule sm:p-8">
                <p className="t-eyebrow">
                  {id
                    ? "Mengapa Samarinda dipilih"
                    : "Why Samarinda"}
                </p>
                <p className="t-body mt-4 text-[0.95rem]">
                  {id
                    ? "Isu yang dibawa permainan ini bukan latar rekaan. Sungai, banjir, bekas tambang, dan ruang hidup warga muncul di papan sebagai zona dan kartu, sehingga keputusan di atas meja terasa berhubungan dengan kota yang sama-sama kita tinggali."
                    : "The issues in this game are not an invented backdrop. River, floods, mining pits, and residents' living space appear on the board as zones and cards, so decisions at the table connect back to the city everyone actually lives in."}
                </p>
              </aside>
            </div>,

            /* ---- Empat tantangan ---- */
            <div key="tantangan" className="grid gap-px overflow-hidden rounded-2xl border bg-[var(--line)] rule sm:grid-cols-2">
              {CHALLENGES.map((c, i) => (
                <article key={i} className="bg-[var(--bg)] p-7 sm:p-9">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="h-1 w-8 rounded-full"
                      style={{ background: INDICATORS[i].color }}
                    />
                    <span className="t-eyebrow !text-[0.65rem]">
                      {id ? "Zona" : "Zone"} · {t(c.zone, lang)}
                    </span>
                  </div>
                  <h2 className="t-h3 mt-5 text-[1.15rem]">{t(c.name, lang)}</h2>
                  <p className="t-body mt-3 text-[0.95rem]">{t(c.body, lang)}</p>
                </article>
              ))}
            </div>,

            /* ---- Keberlanjutan ---- */
            <div key="keberlanjutan" className="measure">
              <h2 className="t-h3">
                {id ? "Apa itu keberlanjutan" : "What sustainability means"}
              </h2>
              <p className="t-body mt-4">{t(SUSTAINABILITY, lang)}</p>

              <h2 className="t-h3 mt-12">
                {id
                  ? "Sustainable Development Goals"
                  : "The Sustainable Development Goals"}
              </h2>
              <p className="t-body mt-4">{t(SDG_NOTE, lang)}</p>

              <blockquote className="mt-12 border-l-2 pl-6 rule">
                <p className="t-eyebrow">
                  {id ? "Untuk dipikirkan" : "Worth thinking about"}
                </p>
                <p className="t-h3 mt-3 font-normal leading-relaxed">
                  {t(REFLECT_QUESTION, lang)}
                </p>
              </blockquote>
            </div>,
          ]}
        </Tabs>
      </Section>
    </>
  );
}
