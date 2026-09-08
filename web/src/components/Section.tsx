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
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="measure">
      {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
      <h2 className={`t-h2 ${eyebrow ? "mt-4" : ""}`}>{title}</h2>
      {lead && <p className="t-lead mt-5">{lead}</p>}
    </div>
  );
}
