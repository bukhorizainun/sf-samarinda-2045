import type { NextConfig } from "next";

// GitHub Pages menyajikan situs di bawah nama repositori. Cloudflare Pages
// nanti menyajikannya di akar, jadi awalan ini dibuat bisa dimatikan.
const AWALAN = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: AWALAN,
  assetPrefix: AWALAN || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  // Lencana pengembangan tidak ikut tampil saat situs direkam.
  devIndicators: false,
  // Halaman 404 seluruh situs. Diperlukan karena tata letak akar
  // berada di segmen dinamis [lang], sehingga alamat yang tidak cocok
  // dengan pola apa pun tidak punya tata letak untuk dipakai.
  experimental: { globalNotFound: true },
};

export default nextConfig;
