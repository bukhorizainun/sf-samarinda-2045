import { Container } from "./Section";
import { Pendamping } from "./Pendamping";
import type { Pose } from "./Maskot";

/**
 * Pembuka halaman dalam. Satu susunan untuk semua halaman, supaya
 * pembaca selalu tahu di mana judul, pengantar, dan mulai isi.
 * Label kecil tampil sebagai keping berwarna adegan halaman.
 */
export function KepalaHalaman({
  eyebrow,
  title,
  lead,
  lebar = "18ch",
  pendamping,
  sikap = "loncat",
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Lebar maksimal judul, agar patahan barisnya tetap rapi. */
  lebar?: string;
  /** Sosok yang menemani kepala halaman ini. Tiap halaman memakai
   *  sosok dan sikap sendiri, jadi halaman tidak terasa sama. */
  pendamping?: "shelly" | "hakam" | "keduanya";
  /** Sikap sosok itu. Tiap halaman memakai sikap yang cocok dengan
   *  isinya, jadi tidak semuanya meloncat. */
  sikap?: Pose;
  children?: React.ReactNode;
}) {
  return (
    <Container className="kepala-halaman relative pb-12 pt-14 sm:pb-16 sm:pt-20">
      <p className="keping-adegan rise">{eyebrow}</p>
      <h1
        className="t-h1 rise mt-6 [animation-delay:60ms]"
        style={{ maxWidth: lebar }}
      >
        {title}
      </h1>
      {lead && (
        <p className="t-lead measure rise mt-6 [animation-delay:120ms]">{lead}</p>
      )}
      {children && <div className="rise [animation-delay:180ms]">{children}</div>}

      {pendamping && (
        <Pendamping
          sosok={pendamping}
          pose={sikap}
          className={`absolute bottom-6 right-5 sm:right-8 ${
            /* Perenang dilihat dari samping, jadi bidangnya mendatar
               dan butuh lebar lebih dari sosok yang berdiri. */
            sikap === "renang"
              ? "w-[210px] lg:w-[270px]"
              : pendamping === "keduanya"
                ? "w-[190px] lg:w-[240px]"
                : "w-[96px] lg:w-[120px]"
          }`}
        />
      )}
    </Container>
  );
}
