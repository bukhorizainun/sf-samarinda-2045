import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { Halaman } from "@/components/Halaman";
import { KepalaHalaman } from "@/components/KepalaHalaman";
import { Tabs } from "@/components/Tabs";
import { GarisFase } from "@/components/GarisFase";
import { KomposisiDek } from "@/components/KomposisiDek";
import cards from "@/content/cards.json";
import type { Kartu } from "@/lib/kartu";
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
    <Halaman motif="lamin" adegan="kayu">
      <KepalaHalaman
        eyebrow={id ? "Tentang Permainan" : "The Game"}
        lebar="20ch"
        title={
          id
            ? "Permainan kolaboratif, bukan adu cepat menjawab"
            : "A collaborative game, not a race to answer first"
        }
        lead={
          id
            ? "Lima pemain memegang peran yang berbeda dan menempuh enam fase bersama-sama. Kamu perlu berdiskusi, menimbang kepentingan pihak lain, mengelola sumber daya, menghadapi kejadian tak terduga, lalu menentukan tindakan bersama."
            : "Five players hold different roles and move through six phases together. You discuss, weigh other parties' interests, manage resources, absorb unexpected events, and settle on shared action."
        }
      />


      <Section className="band border-t rule !pt-10">
        <Tabs tabs={tabs} label={id ? "Bagian halaman" : "Page sections"}>
          {[
            /* ---- Enam fase ---- */
            (
                <GarisFase key="fase" lang={lang} />
            ),

            /* ---- Lima peran ---- */
            (
                <div key="peran">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {ROLES.map((r, i) => (
                      <div
                        key={i}
                        className="ubin"
                        style={{
                          "--pita": INDICATORS[i % INDICATORS.length].color,
                        } as React.CSSProperties}
                      >
                        <span className="token token-kecil">{i + 1}</span>
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    {INDICATORS.map((ind) => (
                      <div
                        key={ind.key}
                        className="ubin sm:p-8"
                        style={{ "--pita": ind.color } as React.CSSProperties}
                      >
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
                <div key="komponen" className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
                  <div>
                    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {COMPONENTS.map((c, i) => (
                        <div key={i} className="ubin !p-5">
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
                  <div className="papan self-start rounded-3xl p-6 sm:p-8">
                    <p className="t-eyebrow">
                      {id ? "Delapan zona tematik" : "Eight thematic zones"}
                    </p>
                    <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {ZONES.map((z, i) => (
                        <li key={i} className="zona">
                          <span>{String(i + 1).padStart(2, "0")}</span>
                          {t(z, lang)}
                        </li>
                      ))}
                    </ul>
                    <p className="t-body mt-7 text-[0.925rem] !text-[var(--fg-muted)]">
                      {id
                        ? "Enam jenis token sumber daya beredar di antara pemain: Nature, Energy, Funds, Knowledge, Community, dan Technology."
                        : "Six kinds of resource token circulate between players: Nature, Energy, Funds, Knowledge, Community, and Technology."}
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <KomposisiDek kartu={cards as Kartu[]} lang={lang} />
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
                <ol className="mt-8 space-y-3">
                  {WIN_CONDITIONS[lang].map((w, i) => (
                    <li key={i} className="ubin flex items-start gap-4 !p-5">
                      <span className="token token-kecil">{i + 1}</span>
                      <p className="t-body pt-0.5">{w}</p>
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
    </Halaman>
  );
}
