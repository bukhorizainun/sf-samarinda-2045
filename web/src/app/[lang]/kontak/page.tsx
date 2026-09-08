import type { Metadata } from "next";
import { Container, Section } from "@/components/Section";
import { BRAND, UI } from "@/content/site";
import { LANGS, t, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = { title: "Kontak" };

/**
 * Nomor dan tautan pemesanan belum diputuskan klien
 * (lihat docs/01-peta-halaman.md, "Yang belum bisa diputuskan sekarang").
 * Selama kosong, halaman menahan diri dan tidak menampilkan tautan palsu.
 */
const WHATSAPP: string | null = null;
const EMAIL: string | null = null;

export default async function Kontak({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const id = lang === "id";

  return (
    <>
      <Container className="pb-10 pt-14 sm:pt-20">
        <p className="t-eyebrow">{id ? "Kontak" : "Contact"}</p>
        <h1 className="t-h1 mt-4 max-w-[16ch]">
          {id
            ? "Bawa permainan ini ke kelas atau komunitasmu"
            : "Bring this game to your class or community"}
        </h1>
        <p className="t-lead measure mt-6">
          {id
            ? "Permainan ini dipakai di sekolah, kampus, dan komunitas. Satu sesi penuh berjalan sekitar sembilan puluh menit dengan lima pemain, dan bisa difasilitasi oleh guru tanpa pelatihan panjang."
            : "The game is used in schools, universities, and community groups. A full session runs about ninety minutes with five players, and a teacher can facilitate it without lengthy training."}
        </p>
      </Container>

      <Section className="!pt-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="rounded-2xl border p-8 rule">
            <h2 className="t-h3">
              {id ? "Menghubungi kami" : "Getting in touch"}
            </h2>

            {WHATSAPP || EMAIL ? (
              <ul className="mt-6 space-y-3">
                {WHATSAPP && (
                  <li>
                    <a
                      href={`https://wa.me/${WHATSAPP}`}
                      className="text-[0.95rem] underline underline-offset-4"
                    >
                      WhatsApp
                    </a>
                  </li>
                )}
                {EMAIL && (
                  <li>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="text-[0.95rem] underline underline-offset-4"
                    >
                      {EMAIL}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="t-body mt-5 text-[0.95rem]">
                {id
                  ? "Saluran resmi belum dipasang di halaman ini. Nomor WhatsApp dan alamat surel akan muncul di sini begitu ditetapkan."
                  : "The official channels are not on this page yet. A WhatsApp number and an email address will appear here once they are settled."}
              </p>
            )}

            <p className="mt-8 border-t pt-6 text-sm leading-relaxed text-[var(--fg-faint)] rule">
              {t(UI.prototypeNote, lang)}
            </p>
          </div>

          <div>
            <h2 className="t-h3">
              {id ? "Yang biasanya ditanyakan" : "What people usually ask"}
            </h2>
            <dl className="mt-6 space-y-7">
              {[
                {
                  q: id ? "Berapa pemainnya?" : "How many players?",
                  a: id
                    ? "Lima peran, satu peran satu pemain. Untuk kelas besar, beberapa meja berjalan bersamaan lalu hasilnya dibandingkan."
                    : "Five roles, one player each. For a large class, several tables run at once and then compare outcomes.",
                },
                {
                  q: id ? "Berapa lama satu sesi?" : "How long is a session?",
                  a: id
                    ? "Enam fase, masing-masing lima belas sampai delapan belas menit. Sekitar sembilan puluh menit ditambah waktu penutup."
                    : "Six phases at fifteen to eighteen minutes each. Around ninety minutes, plus a closing discussion.",
                },
                {
                  q: id
                    ? "Perlu alat digital?"
                    : "Do we need any digital tools?",
                  a: id
                    ? "Tidak wajib. Permainan berjalan penuh di atas meja; pendamping AI di situs ini bersifat menambah, bukan menggantikan."
                    : "Not required. The game runs fully on the table; the AI companion on this site adds to it rather than replacing it.",
                },
              ].map((f, i) => (
                <div key={i} className="border-t pt-5 rule">
                  <dt className="text-[0.95rem] font-semibold">{f.q}</dt>
                  <dd className="t-body mt-2 text-[0.925rem]">{f.a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 text-xs text-[var(--fg-faint)]">
              {BRAND.studio}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
