"use client";

import { useSyncExternalStore } from "react";

/**
 * Apakah pengunjung meminta gerakan dikurangi.
 *
 * Preferensi ini milik sistem operasi, bukan milik React, dan bisa
 * berubah di tengah kunjungan. Jadi ia dibaca sebagai sumber luar:
 * tidak ada keadaan yang disetel dari dalam efek, dan halaman yang
 * terbit sebagai HTML statis tetap terhidrasi dengan benar.
 */
const TANYA = "(prefers-reduced-motion: reduce)";

function langgan(kabari: () => void) {
  const mq = window.matchMedia(TANYA);
  mq.addEventListener("change", kabari);
  return () => mq.removeEventListener("change", kabari);
}

const bacaPeramban = () => window.matchMedia(TANYA).matches;

/* Saat terbit, anggap gerak tetap berjalan: itu keadaan bawaan sebagian
   besar pengunjung, dan yang meminta gerakan dikurangi mendapatkannya
   segera setelah hidrasi. */
const bacaTerbitan = () => false;

export function useGerakDikurangi() {
  return useSyncExternalStore(langgan, bacaPeramban, bacaTerbitan);
}
