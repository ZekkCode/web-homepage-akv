import fs from 'fs'
import path from 'path'

export function getLastModISO() {
  return new Date().toISOString()
}

export function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

function xmlEscape(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Sitemap Index (sitemap.xml) mengikuti arsitektur zakariamp.my.id & zekktech.biz.id:
 * memisahkan peta halaman utama (hreflang) dan peta gambar (Google Image Indexing).
 */
export function generateSitemapIndex(baseUrl = 'https://akv.zakariamp.id') {
  const cleanBase = (baseUrl || 'https://akv.zakariamp.id').replace(/\/$/, '')
  const lastmod = getLastModISO()

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${xmlEscape(`${cleanBase}/sitemap-main.xml`)}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${xmlEscape(`${cleanBase}/sitemap-images.xml`)}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`
}

/**
 * Sitemap halaman kanonik (tanpa #fragment) dengan dukungan hreflang en-US, x-default.
 */
export function generateMainSitemap(baseUrl = 'https://akv.zakariamp.id') {
  const cleanBase = (baseUrl || 'https://akv.zakariamp.id').replace(/\/$/, '')
  const lastmod = getLastModISO()

  const alternates = `
    <xhtml:link rel="alternate" hreflang="en-US" href="${xmlEscape(`${cleanBase}/?locale=en`)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(`${cleanBase}/`)}"/>`

  const urls = [
    { loc: `${cleanBase}/`, priority: '1.0', changefreq: 'weekly' },

    { loc: `${cleanBase}/?locale=en`, priority: '0.9', changefreq: 'weekly' },
  ]

  const entries = urls
    .map(
      (page) => `  <url>
    <loc>${xmlEscape(page.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${alternates}
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>`
}

/**
 * Sitemap Gambar (Google Image Indexing) untuk seluruh aset resmi brand AKV & maskot Pegi.
 */
export function generateImagesSitemap(baseUrl = 'https://akv.zakariamp.id') {
  const cleanBase = (baseUrl || 'https://akv.zakariamp.id').replace(/\/$/, '')
  const lastmod = getLastModISO()

  const images = [
    {
      loc: `${cleanBase}/assets/og-akv.webp`,
      title: 'AKV - Arah Karya Visual | Jasa Desain Grafis, Branding & Website',
      caption: 'Banner resmi AKV (Arah Karya Visual) oleh Zakaria Mujur Prasetyo dan Lia Nur Khasanah. Arahkan Konten, Urus Visual.',
    },
    {
      loc: `${cleanBase}/assets/logo-akv.webp`,
      title: 'Logo Resmi AKV - Arah Karya Visual',
      caption: 'Logo resmi dan identitas visual studio kreatif AKV (Arah Karya Visual)',
    },
    {
      loc: `${cleanBase}/assets/pegi-present.webp`,
      title: 'Pegi - Maskot Resmi AKV Presentasi Layanan',
      caption: 'Pegi, maskot pena digital berkacamata Arah Karya Visual',
    },
    {
      loc: `${cleanBase}/assets/pegi-wave.webp`,
      title: 'Pegi Melambai - Studio Kreatif AKV',
      caption: 'Maskot Pegi menyambut pengunjung di situs resmi AKV (Arah Karya Visual)',
    },
    {
      loc: `${cleanBase}/assets/pegi-tablet.webp`,
      title: 'Pegi Tablet Digital - Desain & Branding AKV',
      caption: 'Pegi memegang tablet digital untuk layanan desain grafis, branding, dan website AKV',
    },
    {
      loc: `${cleanBase}/assets/pegi-megaphone.webp`,
      title: 'Pegi Megafon - Mulai Proyek Kreatif Bersama AKV',
      caption: 'Pegi mengajak kolaborasi proyek desain, CV, portofolio, website, dan animasi AI di AKV',
    },
    {
      loc: `${cleanBase}/assets/pegi-point.webp`,
      title: 'Pegi Menunjuk - Maskot AKV',
      caption: 'Ilustrasi resmi Pegi maskot AKV (Arah Karya Visual)',
    },
  ]

  const imageXml = images
    .map(
      (img) => `    <image:image>
      <image:loc>${xmlEscape(img.loc)}</image:loc>
      <image:title>${xmlEscape(img.title)}</image:title>
      <image:caption>${xmlEscape(img.caption)}</image:caption>
    </image:image>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${xmlEscape(`${cleanBase}/`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
${imageXml}
  </url>
</urlset>`
}

/** Alias kompatibilitas untuk sitemap utama (sitemap index). */
export const generateSitemap = generateSitemapIndex

/**
 * Generator robots.txt mengikuti pola zakariamp.my.id.
 */
export function generateRobotsTxt(baseUrl = 'https://akv.zakariamp.id', adminRoute = '/admin-akv') {
  const cleanBase = (baseUrl || 'https://akv.zakariamp.id').replace(/\/$/, '')
  const cleanAdmin = (adminRoute || '/admin-akv').replace(/\/$/, '')

  return `User-Agent: *
Allow: /
Disallow: ${cleanAdmin}
Disallow: ${cleanAdmin}/
Disallow: /admin
Disallow: /admin/
Disallow: /login
Disallow: /api/
Disallow: /private/

User-Agent: Googlebot
User-Agent: Googlebot-Image
User-Agent: Bingbot
User-Agent: Slurp
User-Agent: DuckDuckBot
User-Agent: Baiduspider
User-Agent: YandexBot
User-Agent: Applebot
User-Agent: Bravebot
Allow: /
Disallow: ${cleanAdmin}
Disallow: ${cleanAdmin}/
Disallow: /admin
Disallow: /admin/
Disallow: /login
Disallow: /api/
Disallow: /private/

Host: ${cleanBase}
Sitemap: ${cleanBase}/sitemap.xml
`
}

export function writeStaticSitemaps(targetDir, baseUrl = 'https://akv.zakariamp.id', adminRoute = '/admin-akv') {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  const effectiveUrl = baseUrl && baseUrl !== 'http://localhost:5173' ? baseUrl : 'https://akv.zakariamp.id'
  fs.writeFileSync(path.join(targetDir, 'sitemap.xml'), generateSitemapIndex(effectiveUrl), 'utf8')
  fs.writeFileSync(path.join(targetDir, 'sitemap-main.xml'), generateMainSitemap(effectiveUrl), 'utf8')
  fs.writeFileSync(path.join(targetDir, 'sitemap-images.xml'), generateImagesSitemap(effectiveUrl), 'utf8')
  fs.writeFileSync(path.join(targetDir, 'robots.txt'), generateRobotsTxt(effectiveUrl, adminRoute), 'utf8')
}
