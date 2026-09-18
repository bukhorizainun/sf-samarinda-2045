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
    { id: "sumber", label: id ? "Sumber" : "Sources" },
  ];

  return (
    <Halaman motif="pesut" adegan="sungai">
      <KepalaHalaman
        sikap="renang"
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

            /* ---- Sumber ----
               Peta halaman menetapkan tiap angka dan klaim di halaman ini
               harus bisa ditelusuri. Karena belum ada rujukan data kota
               yang disepakati, halaman ini memang tidak memuat satu angka
               pun — dan blok ini menyatakan hal itu terbuka, alih-alih
               menyebut lembaga yang belum pernah dirujuk. */
            <div key="sumber" className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
              <div className="measure">
                <h2 className="t-h3">
                  {id ? "Dari mana keterangan ini" : "Where this comes from"}
                </h2>
                <p className="t-body mt-4">
                  {id
                    ? "Seluruh keterangan permainan di halaman ini — delapan zona, empat tantangan kota, kaitan tiap isu dengan mekanisme di meja, dan pertanyaan pembuka Fase 2 — dirangkum dari panduan resmi permainan: Complete Game Guide, edisi Samarinda 2045, disusun RDL Labs."
                    : "Everything about the game on this page — the eight zones, the four city challenges, how each issue appears as a mechanism at the table, and the opening question of Phase 2 — is condensed from the official game guide: the Complete Game Guide, Samarinda 2045 Edition, written by RDL Labs."}
                </p>

                <h2 className="t-h3 mt-10">
                  {id
                    ? "Mengapa tidak ada angka di halaman ini"
                    : "Why there are no figures on this page"}
                </h2>
                <p className="t-body mt-4">
                  {id
                    ? "Isu yang disebut di sini nyata, tetapi besarannya tidak dituliskan: tidak ada luas ruang hijau, jumlah lubang tambang, tinggi muka air, atau angka penduduk. Alasannya satu — angka semacam itu hanya boleh muncul bila rujukannya bisa dibuka dan diperiksa pembaca. Selama rujukan resmi belum disepakati bersama klien, halaman ini tetap ditulis umum."
                    : "The issues named here are real, but their magnitudes are not written down: no green-space area, no count of mining pits, no water levels, no population figures. The reason is simple — numbers like those may only appear when a reader can open and check the source. Until those references are agreed with the client, this page stays general."}
                </p>
                <p className="t-body mt-4">
                  {id
                    ? "Bila kelak klien menyerahkan rujukan resmi, angkanya ditulis di halaman ini bersama nama sumber, tahun, dan tautannya — di blok ini."
                    : "If the client later supplies official references, the figures will appear on this page together with the source name, its year, and its link — in this block."}
                </p>
              </div>

              <aside className="papan self-start rounded-3xl p-7 sm:p-9">
                <p className="t-eyebrow">
                  {id ? "Rujukan yang dipakai" : "References in use"}
                </p>
                <ul className="mt-5 space-y-4">
                  <li className="border-b pb-4 rule">
                    <p className="text-[0.95rem] font-semibold">
                      Complete Game Guide — Futures in Action
                    </p>
                    <p className="mt-1 text-[0.85rem] leading-relaxed text-[var(--fg-muted)]">
                      {id
                        ? "Edisi Samarinda 2045, 24 halaman, RDL Labs. Sumber tetap untuk aturan, fase, peran, indikator, komponen, dan aturan GenAI."
                        : "Samarinda 2045 Edition, 24 pages, RDL Labs. The standing source for rules, phases, roles, indicators, components, and the GenAI rules."}
                    </p>
                  </li>
                  <li>
                    <p className="text-[0.95rem] font-semibold">
                      {id ? "Dek 184 kartu" : "The 184-card deck"}
                    </p>
                    <p className="mt-1 text-[0.85rem] leading-relaxed text-[var(--fg-muted)]">
                      {id
                        ? "Naskah kartu resmi. Sumber untuk katalog kartu, zona, biaya, dampak, risiko, dan aksi nyata di situs ini."
                        : "The official card text. The source for the card catalogue, zones, costs, impacts, risks, and real-world actions on this site."}
                    </p>
                  </li>
                </ul>
                <p className="mt-6 border-t pt-4 text-[0.8rem] leading-relaxed text-[var(--fg-faint)] rule">
                  {id
                    ? "Belum ada satu pun statistik kota yang dikutip di situs ini."
                    : "No city statistic is quoted anywhere on this site yet."}
                </p>
              </aside>
            </div>,
          ]}
        </Tabs>
      </Section>
    </Halaman>
  );
}
