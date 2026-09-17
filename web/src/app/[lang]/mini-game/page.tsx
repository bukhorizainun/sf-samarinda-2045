import type { Metadata } from "next";
import { Container, Section } from "@/components/Section";
import { KepalaNongol } from "@/components/KepalaNongol";
import { MiniGame } from "@/components/MiniGame";
import { LANGS, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = { title: "Mini Game" };

export default async function MiniGamePage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const id = lang === "id";

  return (
    <>
      <Container className="pb-10 pt-14 sm:pt-20">
        <p className="t-eyebrow">{id ? "Mini game" : "Mini game"}</p>
        <h1 className="t-h1 mt-4 max-w-[16ch]">
          {id
            ? "Adu cepat memilah, sebelum waktunya habis"
            : "Sort against the clock"}
        </h1>
        <p className="t-lead measure mt-6">
          {id
            ? "Tiga level, diselingi pertanyaan tentang keadaan lingkungan Samarinda. Bisa dimainkan sendiri sebagai pemanasan sebelum duduk di meja permainan."
            : "Three levels, broken up by questions about Samarinda's environment. Play it alone as a warm-up before sitting down at the table."}
        </p>
      </Container>

      {/* Kepala yang nongol dari tepi halaman, timbul tenggelam
          sambil melambai. Bawaannya milik halaman ini. */}
      <KepalaNongol sosok="hakam" sisi="kiri" bawa="dadu" />

      <Section className="border-t rule !pt-4">
        <MiniGame lang={lang} />
      </Section>
    </>
  );
}
