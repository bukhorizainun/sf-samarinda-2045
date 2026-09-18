import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { Halaman } from "@/components/Halaman";
import { KepalaHalaman } from "@/components/KepalaHalaman";
import { Dasbor } from "@/components/Dasbor";
import cards from "@/content/cards.json";
import { INDICATOR_SCALE, UI } from "@/content/site";
import type { Kartu } from "@/lib/kartu";
import { LANGS, t, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Dasbor Indikator",
  description:
    "Pilih dua Mini-Project dari dek, lalu lihat keempat City Indicator bergerak memakai angka dampak yang tertulis di kartunya sendiri.",
};

export default async function DasborHalaman({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const id = lang === "id";

  return (
    <Halaman motif="jembatan" adegan="langit">
      <KepalaHalaman
        sikap="tunjuk"
        pendamping="shelly"
        eyebrow={id ? "Dasbor indikator" : "Indicator dashboard"}
        lebar="20ch"
        title={
          id
            ? "Satu keputusan menaikkan yang satu, menekan yang lain"
            : "One decision lifts one indicator and presses another"
        }
        lead={
          id
            ? "Di Fase 5, koalisi menutup permainan dengan tepat tiga proyek: dua Mini-Project dan satu Open Project. Pilih dua Mini-Project di bawah, lalu lihat keempat City Indicator bergerak. Angkanya bukan simulasi kami — ia dibaca langsung dari baris dampak yang tertulis di kartu itu."
            : "In Phase 5 the coalition closes the game with exactly three projects: two Mini-Projects and one Open Project. Pick two Mini-Projects below and watch the four City Indicators move. The numbers are not our simulation — they are read straight from the impact line printed on each card."
        }
      />

      <Section className="band border-t rule !pt-12">
        <Dasbor kartu={cards as Kartu[]} lang={lang} />

        <p className="mt-10 max-w-[64ch] text-sm leading-relaxed text-[var(--fg-faint)]">
          {t(INDICATOR_SCALE, lang)}{" "}
          {id
            ? "Dasbor ini memperlihatkan arah, bukan ramalan: di meja, dampak sebuah proyek masih bisa berubah karena kejadian, ketidakpastian, dan kesepakatan kelima peran."
            : "This dashboard shows direction, not a forecast: at the table, a project's impact can still shift through events, uncertainties, and what the five roles agree on."}
        </p>
        <p className="mt-4 text-xs text-[var(--fg-faint)]">
          {t(UI.prototypeNote, lang)}
        </p>
      </Section>
    </Halaman>
  );
}
