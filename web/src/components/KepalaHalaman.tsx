import { Container } from "./Section";

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
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Lebar maksimal judul, agar patahan barisnya tetap rapi. */
  lebar?: string;
  children?: React.ReactNode;
}) {
  return (
    <Container className="kepala-halaman pb-12 pt-14 sm:pb-16 sm:pt-20">
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
    </Container>
  );
}
