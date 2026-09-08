import type { Metadata } from "next";
import { Container, Section } from "@/components/Section";
import { Chat } from "@/components/Chat";
import { LAB } from "@/content/site";
import { LANGS, t, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = { title: "Futures Lab" };

export default async function FuturesLab({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const id = lang === "id";

  return (
    <>
      <Container className="pb-10 pt-14 sm:pt-20">
        <p className="t-eyebrow">
          {id ? "Pendamping berpikir" : "Thinking companion"}
        </p>
        <h1 className="t-h1 mt-4 max-w-[18ch]">{t(LAB.title, lang)}</h1>
        <p className="t-lead measure mt-6">{t(LAB.lead, lang)}</p>
      </Container>

      <Section className="!pt-4">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          <Chat lang={lang} />

          <aside>
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
    </>
  );
}
