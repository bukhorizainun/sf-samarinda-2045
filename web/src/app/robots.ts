import type { MetadataRoute } from "next";
import { SITUS } from "@/lib/situs";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITUS}/sitemap.xml`,
  };
}
