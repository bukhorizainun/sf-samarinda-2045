"use client";

import { useEffect, useRef, useState } from "react";

export type TabDef = { id: string; label: string };

/**
 * Lapis 2: tab di dalam halaman.
 * Isi berganti tanpa memuat ulang, tapi alamatnya ikut berubah (#id),
 * sehingga tautannya bisa dibagikan dan tombol kembali peramban tetap masuk akal.
 */
export function Tabs({
  tabs,
  children,
  label,
}: {
  tabs: TabDef[];
  /** Satu panel per tab, urutannya sama dengan `tabs`. */
  children: React.ReactNode[];
  label: string;
}) {
  const [active, setActive] = useState(tabs[0].id);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (h && tabs.some((x) => x.id === h)) setActive(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [tabs]);

  const pick = (id: string) => {
    setActive(id);
    // replaceState: mengganti tab tidak menumpuk riwayat satu per satu.
    history.replaceState(null, "", `#${id}`);
  };

  // Panah kiri-kanan berpindah tab, sesuai kebiasaan tab pada umumnya.
  const onKey = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((x) => x.id === active);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    pick(tabs[next].id);
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>("[role=tab]")
      [next]?.focus();
  };

  return (
    <div>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        onKeyDown={onKey}
        className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-px sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const on = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={on}
              aria-controls={`panel-${tab.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => pick(tab.id)}
              className={`relative shrink-0 whitespace-nowrap rounded-t-lg px-4 py-3 text-[0.9rem] transition-colors duration-200 ${
                on
                  ? "text-[var(--fg)]"
                  : "text-[var(--fg-faint)] hover:text-[var(--fg-muted)]"
              }`}
            >
              {tab.label}
              <span
                aria-hidden
                className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-all duration-300 ease-[var(--ease-out-soft)] sf-gradient ${
                  on ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="border-t rule" />

      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== active}
          tabIndex={0}
          className="pt-10 focus-visible:outline-none"
        >
          {tab.id === active && (
            <div key={tab.id} className="rise">
              {children[i]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
