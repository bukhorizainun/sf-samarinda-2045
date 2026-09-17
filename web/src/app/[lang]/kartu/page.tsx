import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { Halaman } from "@/components/Halaman";
import { KepalaHalaman } from "@/components/KepalaHalaman";
import { CardCatalog, type Kartu } from "@/components/CardCatalog";
import cards from "@/content/cards.json";
import { LANGS, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = { title: "Katalog Kartu" };

export default async function KatalogKartu({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const id = lang === "id";

  return (
    <Halaman motif="tenun" adegan="tenun">
      <KepalaHalaman
        eyebrow={id ? "Katalog Kartu" : "Card Catalogue"}
        title={
          id
            ? "Seluruh 184 kartu, terbuka untuk dibaca"
            : "All 184 cards, open to read"
        }
        lead={
          id
            ? "Isi dek lengkap dalam dua belas jenis kartu, mulai dari peran dan skenario Samarinda sampai peluang, kejadian, dan bukti aksi. Saring menurut jenis, fase, atau zona; klik satu kartu untuk membacanya utuh."
            : "The full deck across twelve card types, from roles and Samarinda scenarios to opportunities, events, and action evidence. Filter by type, phase, or zone; click a card to read it in full."
        }
      />


      <Section className="band border-t rule !pt-10">
        <CardCatalog cards={cards as Kartu[]} lang={lang} />
      </Section>
    </Halaman>
  );
}
