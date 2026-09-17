import type { Metadata } from "next";
import { Container, Section } from "@/components/Section";
import { Halaman } from "@/components/Halaman";
import { KepalaHalaman } from "@/components/KepalaHalaman";
import { BRAND, PHASES, ROLES, UI } from "@/content/site";
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

  /* Ukuran satu sesi, dibaca dari isi situs. Waktu per fase diambil dari
     kolom waktu di daftar fase, bukan ditulis ulang di sini. */
  const sesi = [
    { n: String(ROLES.length), l: id ? "peran pemain" : "player roles" },
    { n: String(PHASES.length), l: id ? "fase permainan" : "phases of play" },
    { n: PHASES[0].time, l: id ? "menit per fase" : "minutes per phase" },
  ];

  const saluran = [
    {
      kunci: "wa",
      aksen: "var(--color-env)",
      nama: "WhatsApp",
      catatan: id ? "Jalur tercepat" : "The quickest route",
      nilai: WHATSAPP_TAMPIL,
      href: `https://wa.me/${WHATSAPP}`,
      luar: true,
      guna: id
        ? "Sebutkan sekolah atau komunitasmu, perkiraan jumlah peserta, dan kapan rencananya dimainkan."
        : "Tell us your school or community, roughly how many people, and when you plan to play.",
      ikon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="currentColor">
          <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.8 9.8 0 0 0 4.68 1.2h.01c5.43 0 9.84-4.4 9.84-9.84 0-2.63-1.02-5.1-2.88-6.96A9.78 9.78 0 0 0 12.04 2Zm0 1.8c2.15 0 4.17.84 5.69 2.36a7.99 7.99 0 0 1 2.35 5.68c0 4.44-3.6 8.04-8.04 8.04a8.05 8.05 0 0 1-4.1-1.12l-.29-.17-3.05.8.81-2.98-.19-.31a7.98 7.98 0 0 1-1.22-4.26c0-4.44 3.6-8.04 8.04-8.04Zm-2.4 4.03c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.84.14.18 1.9 2.9 4.62 3.96 2.26.88 2.72.7 3.21.66.49-.05 1.58-.64 1.8-1.27.22-.63.22-1.16.16-1.27-.07-.11-.25-.18-.52-.32-.27-.13-1.58-.78-1.83-.87-.25-.09-.42-.14-.6.14-.18.27-.69.87-.84 1.05-.16.18-.31.2-.58.07-.27-.14-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.49-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46l-.5-.01Z" />
        </svg>
      ),
      utama: true,
      ajak: id ? "Buka WhatsApp" : "Open WhatsApp",
    },
    {
      kunci: "surel",
      aksen: "var(--color-future)",
      nama: id ? "Surel" : "Email",
      catatan: id ? "Untuk surat resmi" : "For formal letters",
      nilai: SUREL,
      href: `mailto:${SUREL}?subject=${encodeURIComponent(
        id
          ? "Futures in Action — permintaan sesi"
          : "Futures in Action — session request",
      )}`,
      luar: false,
      guna: id
        ? "Untuk surat resmi, undangan bersurat, atau pertanyaan yang perlu lampiran."
        : "For formal letters, written invitations, or anything needing an attachment.",
      ikon: (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2.5" />
          <path d="M3.5 7.5l8.5 6 8.5-6" strokeLinecap="round" />
        </svg>
      ),
      utama: false,
      ajak: id ? "Tulis surel" : "Write an email",
    },
  ];

  const tanya = [
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
      q: id ? "Perlu alat digital?" : "Do we need any digital tools?",
      a: id
        ? "Tidak wajib. Permainan berjalan penuh di atas meja; pendamping AI di situs ini bersifat menambah, bukan menggantikan."
        : "Not required. The game runs fully on the table; the AI companion on this site adds to it rather than replacing it.",
    },
  ];

  return (
    <Halaman motif="amplang" adegan="pangan">
      <KepalaHalaman
        eyebrow={id ? "Kontak" : "Contact"}
        lebar="16ch"
        title={
          id
            ? "Bawa permainan ini ke kelas atau komunitasmu"
            : "Bring this game to your class or community"
        }
        lead={
          id
            ? "Permainan ini dipakai di sekolah, kampus, dan komunitas. Satu sesi penuh berjalan sekitar sembilan puluh menit dengan lima pemain, dan bisa difasilitasi oleh guru tanpa pelatihan panjang."
            : "The game is used in schools, universities, and community groups. A full session runs about ninety minutes with five players, and a teacher can facilitate it without lengthy training."
        }
      />

      {/* Ukuran satu sesi, supaya guru bisa menakar sebelum menghubungi. */}
      <Container className="pb-12">
        <div className="malam konsol">
          <div className="konsol-kepala">
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="lampu" />
              {id ? "Satu sesi di kelas" : "One session in class"}
            </span>
            <span className="mono normal-case tracking-normal">
              {id ? "dari panduan permainan" : "from the game guide"}
            </span>
          </div>
          <dl className="fakta px-5 pt-1 sm:px-7">
            {sesi.map((s) => (
              <div key={s.l}>
                <dt>{s.n}</dt>
                <dd>{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      <Section className="band border-t rule">
        <p className="bab mb-10">
          <b>01 / 02</b>
          {id ? "Dua jalur" : "Two channels"}
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {saluran.map((s) => (
            <div
              key={s.kunci}
              className="saluran"
              style={{ "--aksen": s.aksen } as React.CSSProperties}
            >
              <div className="flex items-center gap-4">
                <span className="saluran-ikon">{s.ikon}</span>
                <span>
                  <span className="block text-[1.05rem] font-semibold">
                    {s.nama}
                  </span>
                  <span className="block text-[0.78rem] text-[var(--fg-faint)]">
                    {s.catatan}
                  </span>
                </span>
              </div>

              <p className="saluran-nilai mt-6">{s.nilai}</p>
              <p className="t-body mt-3 text-[0.9rem]">{s.guna}</p>

              <a
                href={s.href}
                {...(s.luar
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={`btn group mt-7 self-start ${
                  s.utama ? "btn-utama" : "btn-garis"
                }`}
              >
                {s.ajak}
                <span
                  aria-hidden
                  className="transition-transform duration-[var(--gerak-sedang)] group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-[var(--fg-faint)] measure">
          {t(UI.prototypeNote, lang)}
        </p>
      </Section>

      <Section className="border-t rule">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="bab mb-6">
              <b>02 / 02</b>
              {id ? "Tanya-jawab" : "Questions"}
            </p>
            <h2 className="t-h2">
              {id ? "Yang biasanya ditanyakan" : "What people usually ask"}
            </h2>
            <p className="mt-8 text-xs text-[var(--fg-faint)]">{BRAND.studio}</p>
          </div>

          {/* Dibuka satu per satu; pertanyaan pertama terbuka supaya
              bentuknya langsung terbaca. */}
          <div>
            {tanya.map((f, i) => (
              <details key={i} className="faq" open={i === 0}>
                <summary>{f.q}</summary>
                <div className="faq-isi">
                  <p className="t-body measure text-[0.95rem]">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </Section>
    </Halaman>
  );
}
