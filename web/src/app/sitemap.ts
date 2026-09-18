import type { MetadataRoute } from "next";
import { NAV } from "@/content/site";
import { LANGS } from "@/lib/i18n";
import { SITUS } from "@/lib/situs";

/** Peta situs: tiap halaman dalam dua bahasa, saling menunjuk satu sama lain. */
export const dynamic = "force-static";

/** Halaman pendukung: ada di peta situs, tetapi tidak di menu utama. */
const PENDUKUNG = [{ slug: "privasi" }];

export default function sitemap(): MetadataRoute.Sitemap {
  return LANGS.flatMap((lang) =>
    [...NAV, ...PENDUKUNG].map((item) => {
      const jalur = item.slug ? `${lang}/${item.slug}` : lang;
      return {
        url: `${SITUS}/${jalur}/`,
        changeFrequency: "monthly" as const,
        priority: item.slug ? 0.7 : 1,
        alternates: {
          languages: Object.fromEntries(
            LANGS.map((l) => [
              l,
              `${SITUS}/${item.slug ? `${l}/${item.slug}` : l}/`,
            ]),
          ),
        },
      };
    }),
  );
}
