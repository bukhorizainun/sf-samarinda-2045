import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { Halaman } from "@/components/Halaman";
import { KepalaHalaman } from "@/components/KepalaHalaman";
import { Tabs } from "@/components/Tabs";
import { PetaPapan } from "@/components/PetaPapan";
import cards from "@/content/cards.json";
import type { Kartu } from "@/lib/kartu";
import { Container } from "@/components/Section";
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
    <Halaman motif="pesut" adegan="sungai">
      <KepalaHalaman
        sikap="amati"
        pendamping="shelly"
        eyebrow={id ? "Latar Permainan" : "The Setting"}
        title={
          id
            ? "Kota yang tumbuh bersama Sungai Mahakam"
            : "A city that grew with the Mahakam"
        }
        lead={t(SAMARINDA_INTRO, lang)}
      />


      <Container className="pb-16">
        <PetaPapan kartu={cards as Kartu[]} lang={lang} />
      </Container>

      <Section className="band border-t rule !pt-10">
        <Tabs tabs={tabs} label={id ? "Bagian halaman" : "Page sections"}>
          {[
            /* ---- Kota & sungai ---- */
            <div key="kota" className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
              <div className="measure">
                <p className="t-body">{t(SAMARINDA_LINK, lang)}</p>
                <blockquote className="kutipan mt-10">
                  <p className="t-h3 font-normal leading-relaxed">
                    {t(SAMARINDA_QUESTION, lang)}
                  </p>
                </blockquote>
              </div>
              <aside className="papan self-start rounded-3xl p-7 sm:p-9">
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
            <div key="tantangan" className="grid gap-4 sm:grid-cols-2">
              {CHALLENGES.map((c, i) => (
                <article
                  key={i}
                  className="ubin sm:p-9"
                  style={{ "--pita": INDICATORS[i].color } as React.CSSProperties}
                >
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

              <blockquote className="kutipan mt-12">
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
    </Halaman>
  );
}
