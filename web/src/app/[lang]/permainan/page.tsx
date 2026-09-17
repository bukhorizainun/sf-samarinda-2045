import type { Metadata } from "next";
import { Container, Section } from "@/components/Section";
import { KepalaNongol } from "@/components/KepalaNongol";
import { Tabs } from "@/components/Tabs";
import { GarisFase } from "@/components/GarisFase";
import {
  COMPONENTS,
  INDICATORS,
  INDICATOR_SCALE,
  ROLES,
  ROLES_NOTE,
  UI,
  WIN_CONDITIONS,
  ZONES,
} from "@/content/site";
import { LANGS, t, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = { title: "Tentang Permainan" };

export default async function Permainan({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const id = lang === "id";

  const tabs = [
    { id: "fase", label: id ? "Enam Fase" : "Six Phases" },
    { id: "peran", label: id ? "Lima Peran" : "Five Roles" },
    { id: "indikator", label: id ? "Empat Indikator" : "Four Indicators" },
    { id: "komponen", label: id ? "Komponen" : "Components" },
    { id: "menang", label: id ? "Syarat Menang" : "Winning" },
  ];

  return (
    <>
      <Container className="pb-10 pt-14 sm:pt-20">
        <p className="t-eyebrow">{id ? "Tentang Permainan" : "The Game"}</p>
        <h1 className="t-h1 mt-4 max-w-[20ch]">
          {id
            ? "Permainan kolaboratif, bukan adu cepat menjawab"
            : "A collaborative game, not a race to answer first"}
        </h1>
        <p className="t-lead measure mt-6">
          {id
            ? "Lima pemain memegang peran yang berbeda dan menempuh enam fase bersama-sama. Kamu perlu berdiskusi, menimbang kepentingan pihak lain, mengelola sumber daya, menghadapi kejadian tak terduga, lalu menentukan tindakan bersama."
            : "Five players hold different roles and move through six phases together. You discuss, weigh other parties' interests, manage resources, absorb unexpected events, and settle on shared action."}
        </p>
      </Container>

      {/* Kepala yang nongol dari tepi halaman, timbul tenggelam
          sambil melambai. Bawaannya milik halaman ini. */}
      <KepalaNongol sosok="hakam" sisi="kanan" bawa="dadah" />

      <Section className="border-t rule !pt-6">
        <Tabs tabs={tabs} label={id ? "Bagian halaman" : "Page sections"}>
          {[
            /* ---- Enam fase ---- */
            (
                <GarisFase key="fase" lang={lang} />
            ),

            /* ---- Lima peran ---- */
            (
                <div key="peran">
                  <div className="grid gap-px overflow-hidden rounded-2xl border bg-[var(--line)] rule sm:grid-cols-2 lg:grid-cols-3">
                    {ROLES.map((r, i) => (
                      <div key={i} className="bg-[var(--bg)] p-7">
                        <span
                          aria-hidden
                          className="block h-1 w-8 rounded-full"
                          style={{
                            background:
                              INDICATORS[i % INDICATORS.length].color,
                          }}
                        />
                        <h3 className="t-h3 mt-5 text-[1.05rem]">
                          {t(r.name, lang)}
                        </h3>
                        <p className="t-body mt-2 text-[0.925rem]">
                          {t(r.brings, lang)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="t-body measure mt-8">{t(ROLES_NOTE, lang)}</p>
                </div>
            ),

            /* ---- Empat indikator ---- */
            (
                <div key="indikator">
                  <div className="grid gap-px overflow-hidden rounded-2xl border bg-[var(--line)] rule sm:grid-cols-2">
                    {INDICATORS.map((ind) => (
                      <div key={ind.key} className="bg-[var(--bg)] p-7 sm:p-8">
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className="h-3 w-3 rounded-full"
                            style={{ background: ind.color }}
                          />
                          <h3 className="t-h3">{t(ind.name, lang)}</h3>
                        </div>
                        <p className="t-body mt-3 text-[0.95rem]">
                          {t(ind.scope, lang)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="t-body measure mt-8">
                    {t(INDICATOR_SCALE, lang)}
                  </p>
                </div>
            ),

            /* ---- Komponen ---- */
            (
                <div key="komponen" className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
                  <div>
                    <dl className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-3">
                      {COMPONENTS.map((c, i) => (
                        <div key={i} className="border-t pt-4 rule">
                          <dt className="font-display text-3xl tabular-nums">
                            {c.count}
                          </dt>
                          <dd className="mt-1 text-[0.85rem] leading-snug text-[var(--fg-muted)]">
                            {t(c.label, lang)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div>
                    <p className="t-eyebrow">
                      {id ? "Delapan zona tematik" : "Eight thematic zones"}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {ZONES.map((z, i) => (
                        <li
                          key={i}
                          className="rounded-full border px-3.5 py-1.5 text-[0.85rem] text-[var(--fg-muted)] rule"
                        >
                          {t(z, lang)}
                        </li>
                      ))}
                    </ul>
                    <p className="t-body mt-7 text-[0.925rem]">
                      {id
                        ? "Enam jenis token sumber daya beredar di antara pemain: Nature, Energy, Funds, Knowledge, Community, dan Technology."
                        : "Six kinds of resource token circulate between players: Nature, Energy, Funds, Knowledge, Community, and Technology."}
                    </p>
                  </div>
                </div>
            ),

            /* ---- Syarat menang ---- */
            (
              <div key="menang" className="measure">
                <p className="t-lead">
                  {id
                    ? "Koalisi menang bersama-sama, atau tidak sama sekali. Empat syarat harus terpenuhi:"
                    : "The coalition wins together, or not at all. Four conditions must hold:"}
                </p>
                <ol className="mt-8 space-y-6">
                  {WIN_CONDITIONS[lang].map((w, i) => (
                    <li key={i} className="flex gap-5 border-t pt-5 rule">
                      <span className="font-display text-xl tabular-nums text-[var(--fg-faint)]">
                        {i + 1}
                      </span>
                      <p className="t-body">{w}</p>
                    </li>
                  ))}
                </ol>
                <p className="mt-10 text-sm text-[var(--fg-faint)]">
                  {t(UI.prototypeNote, lang)}
                </p>
              </div>
            ),
          ]}
        </Tabs>
      </Section>
    </>
  );
}
