import type { MetadataRoute } from "next"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dev.canfly.org"
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/platform", "/services", "/agents", "/agents/ingria", "/agents/kristina", "/agents/banita"].map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : 0.7 }))
}
