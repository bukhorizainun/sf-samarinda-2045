"use client";

import { usePathname } from "next/navigation";
import { Pendamping } from "./Pendamping";
import type { Pose } from "./Maskot";

/**
 * Shelly dan Hakam di ujung kanan bawah isi setiap halaman, tepat di atas
 * footer. Keduanya meloncat saat masuk pandangan, lalu bergerak sesuai
 * pose halamannya; diklik, keduanya bersorak.
 *
 * Beranda dilewati karena sudah ditutup pawai Shelly dan Hakam.
 */
const POSE: Record<string, Pose> = {
  permainan: "tunjuk",
  aturan: "kartu",
  dasbor: "amati",
  kartu: "kartu",
  samarinda: "amati",
  shelbot: "tunjuk",
  "mini-game": "loncat",
  fasilitator: "lambai",
  kontak: "lambai",
  privasi: "amati",
  gaya: "tanam",
};

export function SosokAkhir() {
  const pathname = usePathname() || "";
  const halaman = pathname.split("/").filter(Boolean)[1] ?? "";
  const pose = POSE[halaman];
  if (!pose) return null;

  return (
    <div aria-hidden className="sosok-akhir mx-auto flex w-full max-w-6xl justify-end px-5 sm:px-8 print:hidden">
      <Pendamping sosok="keduanya" pose={pose} selaluTampil className="w-[170px] sm:w-[250px]" />
    </div>
  );
}
