import type { Metadata } from "next";
import { Container, Section } from "@/components/Section";
import { Halaman } from "@/components/Halaman";
import { KepalaHalaman } from "@/components/KepalaHalaman";
import { Shelbot } from "@/components/Shelbot";
import { Tilt } from "@/components/Tilt";
import { INDICATORS, LAB, PHASES, ROLES } from "@/content/site";
import cards from "@/content/cards.json";
import { LANGS, t, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = { title: "Shelbot" };

export default async function HalamanShelbot({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const id = lang === "id";

  return (
    <Halaman motif="enggang" adegan="hutan">
      <KepalaHalaman
        eyebrow={id ? "Pemandu permainan" : "Game guide"}
        title={t(LAB.title, lang)}
        lead={t(LAB.lead, lang)}
      >
        <p className="kutipan measure mt-7 !py-5 text-[0.9rem] leading-relaxed text-[var(--fg-muted)] before:!content-none">
          {t(LAB.catatanMeja, lang)}
        </p>
      </KepalaHalaman>

      <Container className="pb-10">
        <Tilt derajat={3}>
        <div className="malam konsol">
          <div className="konsol-kepala">
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="lampu" />
              {id ? "Yang dihafal Shelbot" : "What Shelbot knows"}
            </span>
            <span className="mono normal-case tracking-normal">
              {id ? "dari panduan resmi" : "from the official guide"}
            </span>
          </div>
          <dl className="fakta px-5 pt-1 sm:px-7">
            <div>
              <dt>{PHASES.length}</dt>
              <dd>{id ? "fase permainan" : "phases of play"}</dd>
            </div>
            <div>
              <dt>{ROLES.length}</dt>
              <dd>{id ? "peran pemain" : "player roles"}</dd>
            </div>
            <div>
              <dt>{INDICATORS.length}</dt>
              <dd>{id ? "indikator kota" : "city indicators"}</dd>
            </div>
            <div>
              <dt>{cards.length}</dt>
              <dd>{id ? "kartu dek" : "cards in the deck"}</dd>
            </div>
          </dl>
        </div>
        </Tilt>
      </Container>

      <Section className="band border-t rule !pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          <Shelbot lang={lang} />

          <aside className="ubin self-start hover:!translate-y-0 sm:!p-8">
            <h2 className="t-h3">{t(LAB.limitsTitle, lang)}</h2>
            <ul className="mt-6 space-y-5">
              {LAB.limits[lang].map((l, i) => (
                <li key={i} className="flex gap-4 border-t pt-4 rule">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--fg-faint)]"
                  />
                  <p className="text-[0.9rem] leading-relaxed text-[var(--fg-muted)]">
                    {l}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[0.85rem] leading-relaxed text-[var(--fg-faint)]">
              {id
                ? "Di dalam permainan, dua pemakaian inti gratis: peta sistem di Fase 1 dan simulasi dampak di Fase 4. Prompt tambahan menuntut GenAI Access Token, yang diperoleh lewat verifikasi, deteksi bias, pengetahuan lokal, atau rancangan prompt yang baik."
                : "Inside the game, two core uses are free: the system map in Phase 1 and the impact simulation in Phase 4. Further prompts cost a GenAI Access Token, earned through verification, bias detection, local knowledge, or well-designed prompting."}
            </p>
          </aside>
        </div>
      </Section>
    </Halaman>
  );
}
