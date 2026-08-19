import fs from 'fs'
import path from 'path'

export function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Sitemap tunggal — SPA satu halaman, Google tidak mengindeks fragment (#).
 * Hanya URL root yang valid untuk crawling.
 *
 * ponytail: kalau nanti ada route terpisah (misal /blog/:slug), tambahkan di sini.
 */
export function generateSitemap(baseUrl) {
  const today = getTodayDate()
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
}

export function generateRobotsTxt(baseUrl, adminRoute = '/admin-akv') {
  return `User-agent: *
Allow: /
Disallow: ${adminRoute}
Disallow: /admin
Disallow: /login

Sitemap: ${baseUrl}/sitemap.xml`
}

export function writeStaticSitemaps(targetDir, baseUrl, adminRoute = '/admin-akv') {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  fs.writeFileSync(path.join(targetDir, 'sitemap.xml'), generateSitemap(baseUrl))
  fs.writeFileSync(path.join(targetDir, 'robots.txt'), generateRobotsTxt(baseUrl, adminRoute))
}
