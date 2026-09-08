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
};

export default nextConfig;
