import type { MetadataRoute } from "next"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dev.canfly.org"
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: ["/", "/platform", "/services", "/agents"], disallow: ["/workspace", "/api/", "/auth/"] }], sitemap: `${baseUrl}/sitemap.xml`, host: baseUrl }
}
