import type { Metadata } from "next";
import { Container } from "@/components/Section";
import { Halaman } from "@/components/Halaman";
import { KepalaHalaman } from "@/components/KepalaHalaman";
import { TombolCetak } from "@/components/TombolCetak";
import {
  BRAND,
  COMPONENTS,
  INDICATORS,
  INDICATOR_SCALE,
  PHASES,
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

export const metadata: Metadata = {
  title: "Aturan Ringkas",
  description:
    "Satu lembar aturan ringkas Futures in Action edisi Samarinda 2045: enam fase beserta waktunya, lima peran, empat City Indicator, komponen, aturan GenAI, dan syarat menang.",
};

/**
 * Aturan ringkas satu lembar, dibuat untuk dicetak.
 *
 * Ini BUKAN panduan resmi. Seluruh isinya dirangkum dari panduan resmi
 * klien (Complete Game Guide, 24 halaman) lewat ringkasan tetap di
 * docs/02-ringkasan-panduan-permainan.md, dan memakai data yang sama
 * dengan halaman lain di situs ini — jadi bila satu angka diperbaiki,
 * lembar ini ikut berubah sendiri.
 *
 * Yang sengaja tidak dimuat: bunyi prompt GenAI Fase 1 dan Fase 4,
 * naskah lengkap kartu, dan rincian Project Market. Ketiganya milik
 * panduan resmi, dan keputusan boleh-tidaknya diunduh masih di tangan
 * klien.
 */
export default async function Aturan({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const id = lang === "id";

  /* Aturan GenAI di meja, dikutip dari panduan. Ditulis di sini dan
     bukan di content/ karena hanya lembar ini yang memakainya. */
  const genai = id
    ? [
        "Dua pemakaian inti gratis: System Map di Fase 1 dan Impact Simulation di Fase 4.",
        "Prompt tambahan menuntut GenAI Access Token, diperoleh lewat verifikasi, deteksi bias, pengetahuan lokal, atau rancangan prompt yang baik.",
        "Data pribadi siswa tidak boleh dikirim.",
        "Prompt dan keluarannya ditampilkan terbuka kepada seluruh pemain.",
        "GenAI tidak punya suara, tidak menetapkan harga proyek, dan tidak memilih proyek prioritas.",
      ]
    : [
        "Two core uses are free: the System Map in Phase 1 and the Impact Simulation in Phase 4.",
        "Further prompts cost a GenAI Access Token, earned through verification, bias detection, local knowledge, or well-designed prompting.",
        "Students' personal data must not be sent.",
        "Prompts and their output are shown openly to all players.",
        "GenAI holds no vote, does not price projects, and does not pick priority projects.",
      ];

  const profil = id
    ? [
        ["Pemain", "5 pemangku kepentingan"],
        ["Fasilitator", "1 orang di luar peran"],
        ["Durasi", "± 100–120 menit"],
        ["Sifat", "Kooperatif, menang atau kalah bersama"],
        ["Keluaran", "Tepat 3 proyek: 2 Mini-Project + 1 Open Project"],
        ["Lanjutan", "1 proyek prioritas jadi aksi nyata 7–30 hari"],
      ]
    : [
        ["Players", "5 stakeholders"],
        ["Facilitator", "1 person outside the roles"],
        ["Length", "± 100–120 minutes"],
        ["Nature", "Cooperative; the table wins or loses together"],
        ["Output", "Exactly 3 projects: 2 Mini-Projects + 1 Open Project"],
        ["Afterwards", "1 priority project becomes a real 7–30 day action"],
      ];

  return (
    <Halaman motif="lamin" adegan="kayu">
      <KepalaHalaman
        sikap="kartu"
        pendamping="hakam"
        eyebrow={id ? "Aturan ringkas" : "Rules summary"}
        lebar="19ch"
        title={
          id
            ? "Satu lembar untuk dibawa ke meja"
            : "One sheet to bring to the table"
        }
        lead={
          id
            ? "Rangkuman aturan untuk dibaca sebelum bermain atau ditempel di dekat papan. Isinya dirangkum dari panduan resmi permainan, dan panduan itu tetap yang berlaku bila ada yang berselisih. Lembar ini bisa dicetak atau disimpan sebagai PDF lewat tombol di bawah."
            : "A rules summary to read before playing or to keep beside the board. It is condensed from the official game guide, and that guide still prevails wherever the two differ. This sheet can be printed or saved as PDF with the button below."
        }
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <TombolCetak
            label={id ? "Cetak atau simpan PDF" : "Print or save as PDF"}
          />
          <p className="tanpa-cetak text-xs text-[var(--fg-faint)]">
            {id
              ? "Sekitar lima halaman A4, tanpa menu dan tanpa hiasan."
              : "About five A4 pages, without the menu and the decoration."}
          </p>
        </div>
      </KepalaHalaman>

      <Container className="lembar pb-24">
        {/* Kepala lembar. Hanya tampil saat dicetak. */}
        <header className="hanya-cetak mb-8 border-b pb-4 rule">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
            {BRAND.mark} — {t(BRAND.name, lang)} · {t(BRAND.tagline, lang)}
          </p>
          <h1 className="t-h2 mt-2">
            {id ? "Aturan Ringkas" : "Rules Summary"} ·{" "}
            {t(BRAND.edition, lang)}
          </h1>
        </header>

        <div className="grid gap-12">
          {/* 1. Profil permainan */}
          <section>
            <p className="bab mb-5">
              <b>01</b>
              {id ? "Profil permainan" : "Game profile"}
            </p>
            <dl className="grid gap-px overflow-hidden rounded-2xl border bg-[var(--line)] rule sm:grid-cols-2">
              {profil.map(([k, v]) => (
                <div
                  key={k}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-[var(--surface-1)] px-5 py-4"
                >
                  <dt className="text-[0.8rem] uppercase tracking-[0.1em] text-[var(--fg-faint)]">
                    {k}
                  </dt>
                  <dd className="text-[0.95rem] font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 2. Enam fase beserta waktunya */}
          <section>
            <p className="bab mb-5">
              <b>02</b>
              {id ? "Enam fase" : "Six phases"}
            </p>
            <ol className="overflow-hidden rounded-2xl border rule">
              {PHASES.map((p) => (
                <li
                  key={p.no}
                  className="grid gap-1 border-b bg-[var(--surface-1)] px-5 py-4 last:border-b-0 rule sm:grid-cols-[2.5rem_1fr_5.5rem] sm:items-baseline sm:gap-4"
                >
                  <span className="mono text-[0.85rem] text-[var(--fg-faint)]">
                    {String(p.no).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-[0.98rem] font-semibold">
                      {t(p.name, lang)}
                    </span>
                    <span className="mt-0.5 block text-[0.88rem] leading-relaxed text-[var(--fg-muted)]">
                      {t(p.output, lang)}
                    </span>
                  </span>
                  <span className="mono text-[0.78rem] text-[var(--fg-muted)] sm:text-right">
                    {p.time} {id ? "mnt" : "min"}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-[var(--fg-faint)]">
              {id
                ? "Penyiapan 10–15 menit berjalan sebelum Fase 1 dan tidak dihitung sebagai fase."
                : "A 10–15 minute setup runs before Phase 1 and does not count as a phase."}
            </p>
          </section>

          {/* 3. Lima peran */}
          <section>
            <p className="bab mb-5">
              <b>03</b>
              {id ? "Lima peran" : "Five roles"}
            </p>
            <ol className="grid gap-3 sm:grid-cols-2">
              {ROLES.map((r, i) => (
                <li key={i} className="ubin !p-5">
                  <div className="flex items-start gap-3">
                    <span className="token token-kecil">{i + 1}</span>
                    <span>
                      <span className="block text-[0.95rem] font-semibold">
                        {t(r.name, lang)}
                      </span>
                      <span className="mt-1 block text-[0.88rem] leading-relaxed text-[var(--fg-muted)]">
                        {t(r.brings, lang)}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ol>
            <p className="t-body measure mt-4 text-[0.9rem]">
              {t(ROLES_NOTE, lang)}
            </p>
          </section>

          {/* 4. Empat City Indicator */}
          <section>
            <p className="bab mb-5">
              <b>04</b>City Indicators
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {INDICATORS.map((ind) => (
                <li
                  key={ind.key}
                  className="ubin !p-5"
                  style={{ "--pita": ind.color } as React.CSSProperties}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ background: ind.color }}
                    />
                    <h3 className="text-[0.95rem] font-semibold">
                      {t(ind.name, lang)}
                    </h3>
                  </div>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--fg-muted)]">
                    {t(ind.scope, lang)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="t-body measure mt-4 text-[0.9rem]">
              {t(INDICATOR_SCALE, lang)}
            </p>
          </section>

          {/* 5. Komponen dan zona */}
          <section>
            <p className="bab mb-5">
              <b>05</b>
              {id ? "Komponen" : "Components"}
            </p>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {COMPONENTS.map((c, i) => (
                <div key={i} className="ubin !p-4">
                  <dt className="font-display text-2xl tabular-nums">
                    {c.count}
                  </dt>
                  <dd className="mt-1 text-[0.8rem] leading-snug text-[var(--fg-muted)]">
                    {t(c.label, lang)}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="t-eyebrow mt-6 !text-[0.62rem]">
              {id ? "Delapan zona tematik" : "Eight thematic zones"}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {ZONES.map((z, i) => (
                <li
                  key={i}
                  className="rounded-full border px-3 py-1.5 text-[0.85rem] text-[var(--fg-muted)] rule"
                >
                  {t(z, lang)}
                </li>
              ))}
            </ul>
            <p className="t-body mt-4 text-[0.9rem]">
              {id
                ? "Enam jenis token sumber daya beredar di antara pemain: Nature, Energy, Funds, Knowledge, Community, dan Technology."
                : "Six kinds of resource token circulate between players: Nature, Energy, Funds, Knowledge, Community, and Technology."}
            </p>
          </section>

          {/* 6. Aturan GenAI di meja */}
          <section>
            <p className="bab mb-5">
              <b>06</b>
              {id ? "Aturan GenAI di meja" : "GenAI rules at the table"}
            </p>
            <ul className="space-y-2.5">
              {genai.map((x, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 border-b pb-2.5 text-[0.92rem] leading-relaxed last:border-b-0 rule"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: INDICATORS[i % 4].color }}
                  />
                  {x}
                </li>
              ))}
            </ul>
          </section>

          {/* 7. Syarat menang */}
          <section>
            <p className="bab mb-5">
              <b>07</b>
              {id ? "Syarat menang" : "Win conditions"}
            </p>
            <p className="t-body measure">
              {id
                ? "Koalisi menang bersama-sama, atau tidak sama sekali. Empat syarat harus terpenuhi:"
                : "The coalition wins together, or not at all. Four conditions must hold:"}
            </p>
            <ol className="mt-5 space-y-3">
              {WIN_CONDITIONS[lang].map((w, i) => (
                <li key={i} className="ubin flex items-start gap-4 !p-5">
                  <span className="token token-kecil">{i + 1}</span>
                  <p className="t-body pt-0.5 text-[0.92rem]">{w}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Asal-usul lembar ini. */}
          <section className="border-t pt-6 rule">
            <p className="t-eyebrow !text-[0.62rem]">
              {id ? "Asal lembar ini" : "Where this sheet comes from"}
            </p>
            <p className="t-body measure mt-3 text-[0.88rem]">
              {id
                ? "Seluruh angka dan istilah di lembar ini dirangkum dari panduan resmi permainan, Complete Game Guide edisi Samarinda 2045, yang disusun oleh RDL Labs. Lembar ini ringkasan, bukan pengganti: bunyi prompt GenAI, naskah lengkap 184 kartu, dan rincian Project Market hanya ada di panduan resmi. Bila ada yang berselisih, panduan resmi yang berlaku."
                : "Every number and term on this sheet is condensed from the official game guide, the Complete Game Guide for the Samarinda 2045 Edition, written by RDL Labs. This sheet is a summary, not a replacement: the GenAI prompt wording, the full text of all 184 cards, and the Project Market detail live only in the official guide. Wherever the two differ, the official guide prevails."}
            </p>
            <p className="mt-4 text-xs text-[var(--fg-faint)]">
              {t(UI.prototypeNote, lang)} · {t(BRAND.edition, lang)} ·{" "}
              {BRAND.studio}
            </p>
          </section>
        </div>
      </Container>
    </Halaman>
  );
}
