import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { Halaman } from "@/components/Halaman";
import { KepalaHalaman } from "@/components/KepalaHalaman";
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
    <Halaman motif="jembatan" adegan="langit">
      <KepalaHalaman
        sikap="loncat"
        pendamping="keduanya"
        eyebrow={id ? "Mini game" : "Mini game"}
        lebar="16ch"
        title={
          id
            ? "Adu cepat memilah, sebelum waktunya habis"
            : "Sort against the clock"
        }
        lead={
          id
            ? "Tiga level, diselingi pertanyaan tentang keadaan lingkungan Samarinda. Bisa dimainkan sendiri sebagai pemanasan sebelum duduk di meja permainan."
            : "Three levels, broken up by questions about Samarinda's environment. Play it alone as a warm-up before sitting down at the table."
        }
      />


      <Section className="band border-t rule !pt-10">
        <MiniGame lang={lang} />
      </Section>
    </Halaman>
  );
}
