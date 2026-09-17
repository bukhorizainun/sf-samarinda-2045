import type { Metadata } from "next";
import { Container, Section } from "@/components/Section";
import { PapanGaya } from "@/components/PapanGaya";
import cards from "@/content/cards.json";
import type { Kartu } from "@/lib/kartu";
import { LANGS, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Sistem Rupa",
  description:
    "Token, tangga tipografi, permukaan, gerak, dan dua belas muka kartu SF dalam satu halaman.",
  robots: { index: false, follow: false },
};

/**
 * Halaman sistem rupa.
 *
 * Bukan halaman pengunjung: ini rujukan kerja. Selama situs tumbuh,
 * setiap keputusan rupa diperiksa di sini lebih dulu, jadi halaman baru
 * tidak diam-diam melahirkan warna, bayangan, atau jarak yang kelima.
 */
export default async function Gaya({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const id = lang === "id";

  return (
    <>
      <Container className="pb-8 pt-14 sm:pt-20">
        <p className="t-eyebrow">{id ? "Rujukan kerja" : "Working reference"}</p>
        <h1 className="t-h1 mt-4 max-w-[17ch]">
          {id ? "Sistem rupa SF" : "The SF design system"}
        </h1>
        <p className="t-lead measure mt-6">
          {id
            ? "Satu halaman yang memuat seluruh bahan rupa situs ini: token warna, tangga tipografi, tangga permukaan, kaidah gerak, dan dua belas muka kartu. Halaman baru mengambil bahannya dari sini, tidak membuat sendiri."
            : "One page holding every material this site is built from: colour tokens, the type scale, the surface scale, motion rules, and all twelve card faces. New pages draw from here rather than inventing their own."}
        </p>
      </Container>

      <Section className="!pt-4">
        <PapanGaya cards={cards as Kartu[]} lang={lang} />
      </Section>
    </>
  );
}
