import type { Metadata } from "next";
import { Container, Section } from "@/components/Section";
import { KepalaNongol } from "@/components/KepalaNongol";
import { BRAND, UI } from "@/content/site";
import { LANGS, t, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = { title: "Kontak" };

/** Nomor resmi dari klien. Format wa.me menuntut angka saja, tanpa tanda. */
const WHATSAPP = "6281254840507";
const WHATSAPP_TAMPIL = "+62 812-5484-0507";

/** Surel resmi. Dipakai untuk permintaan yang perlu lampiran atau jejak
 *  tertulis: undangan sekolah, kerja sama, dan pertanyaan panjang. */
const SUREL = "shelbot.2026@gmail.com";

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

      {/* Kepala yang nongol dari tepi halaman, timbul tenggelam
          sambil melambai. Bawaannya milik halaman ini. */}
      <KepalaNongol sosok="shelly" sisi="kanan" bawa="surat" />

      <Section className="border-t rule !pt-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="rounded-2xl border p-8 rule">
            <h2 className="t-h3">
              {id ? "Menghubungi kami" : "Getting in touch"}
            </h2>

            <p className="t-body mt-4 text-[0.95rem]">
              {id
                ? "Cara tercepat lewat WhatsApp. Sebutkan sekolah atau komunitasmu, perkiraan jumlah peserta, dan kapan rencananya dimainkan. Untuk surat resmi, undangan bersurat, atau pertanyaan yang perlu lampiran, kirim ke surel."
                : "WhatsApp is the quickest route. Tell us your school or community, roughly how many people, and when you plan to play. For formal letters, written invitations, or anything needing an attachment, use email."}
            </p>

            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[var(--fg)] px-6 py-3.5 text-[0.9rem] font-medium text-[var(--bg)] transition-transform duration-300 ease-[var(--ease-glide)] hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="currentColor">
                <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.8 9.8 0 0 0 4.68 1.2h.01c5.43 0 9.84-4.4 9.84-9.84 0-2.63-1.02-5.1-2.88-6.96A9.78 9.78 0 0 0 12.04 2Zm0 1.8c2.15 0 4.17.84 5.69 2.36a7.99 7.99 0 0 1 2.35 5.68c0 4.44-3.6 8.04-8.04 8.04a8.05 8.05 0 0 1-4.1-1.12l-.29-.17-3.05.8.81-2.98-.19-.31a7.98 7.98 0 0 1-1.22-4.26c0-4.44 3.6-8.04 8.04-8.04Zm-2.4 4.03c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.84.14.18 1.9 2.9 4.62 3.96 2.26.88 2.72.7 3.21.66.49-.05 1.58-.64 1.8-1.27.22-.63.22-1.16.16-1.27-.07-.11-.25-.18-.52-.32-.27-.13-1.58-.78-1.83-.87-.25-.09-.42-.14-.6.14-.18.27-.69.87-.84 1.05-.16.18-.31.2-.58.07-.27-.14-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.49-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46l-.5-.01Z" />
              </svg>
              {WHATSAPP_TAMPIL}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>

            <a
              href={`mailto:${SUREL}?subject=${encodeURIComponent(
                id
                  ? "Futures in Action — permintaan sesi"
                  : "Futures in Action — session request",
              )}`}
              className="group mt-3 inline-flex items-center gap-3 rounded-full border px-6 py-3.5 text-[0.9rem] transition-colors duration-[var(--gerak-cepat)] hover:bg-[var(--bg-sunken)] rule"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2.5" />
                <path d="M3.5 7.5l8.5 6 8.5-6" strokeLinecap="round" />
              </svg>
              {SUREL}
              <span aria-hidden className="transition-transform duration-[var(--gerak-sedang)] group-hover:translate-x-1">→</span>
            </a>

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
