import { Reveal } from "./Reveal";
import { Pendamping } from "./Pendamping";
import type { Pose } from "./Maskot";

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** Kepala bagian: label kecil, judul, satu paragraf pengantar. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  bab,
  pendamping,
  sikap = "loncat",
  lebarPendamping,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  /** Nomor bab editorial, mis. "02 / 06". Label bab memakai eyebrow. */
  bab?: string;
  /** Sosok maskot yang mengisi ruang kosong di kanan judul. Hanya tampil
   *  di layar lebar, supaya di ponsel teks tetap memegang seluruh lebar. */
  pendamping?: "shelly" | "hakam" | "keduanya";
  sikap?: Pose;
  /** Lebar sosok, untuk kepala bagian yang pendek. Tanpa ini sosoknya
   *  bisa lebih tinggi dari kepala bagian dan menabrak garis bab. */
  lebarPendamping?: string;
}) {
  return (
    <div className="relative">
      {bab && (
        <p className="bab mb-8">
          <b>{bab}</b>
          {eyebrow}
        </p>
      )}
      <Reveal className="measure">
      {eyebrow && !bab && <p className="t-eyebrow">{eyebrow}</p>}
      <h2 className={`${bab ? "t-h1" : "t-h2"} ${eyebrow && !bab ? "mt-4" : ""}`}>{title}</h2>
      {lead && <p className="t-lead mt-5">{lead}</p>}
      </Reveal>

      {pendamping && (
        <div
          className={`absolute bottom-0 right-2 hidden lg:block ${
            lebarPendamping
              ? lebarPendamping
              : sikap === "renang"
              ? "w-[250px]"
              : pendamping === "keduanya"
                ? "w-[220px]"
                : "w-[112px]"
          }`}
        >
          <Pendamping sosok={pendamping} pose={sikap} />
        </div>
      )}
    </div>
  );
}
