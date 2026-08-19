import fs from 'fs'
import path from 'path'

export function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Generator Sitemap Komprehensif dengan Google Image & Multi-Section Indexing
 */
export function generateSitemap(baseUrl = 'https://akv.zakariamp.id') {
  const cleanBase = (baseUrl || 'https://akv.zakariamp.id').replace(/\/$/, '')
  const today = getTodayDate()

  const pages = [
    {
      loc: `${cleanBase}/`,
      priority: '1.0',
      changefreq: 'daily',
      images: [
        {
          loc: `${cleanBase}/assets/logo-akv.webp`,
          title: 'Logo Resmi AKV — Arah Karya Visual',
          caption: 'Logo resmi dan identitas visual studio AKV (Arah Karya Visual)',
        },
        {
          loc: `${cleanBase}/assets/pegi-present.webp`,
          title: 'Pegi — Maskot Resmi AKV',
          caption: 'Pegi si maskot dinamis Arah Karya Visual',
        },
        {
          loc: `${cleanBase}/assets/pegi-wave.webp`,
          title: 'Pegi Melambai — AKV Visual Studio',
          caption: 'Maskot Pegi menyambut pengunjung di AKV',
        },
        {
          loc: `${cleanBase}/assets/pegi-tablet.webp`,
          title: 'Pegi Digital Tablet AKV',
          caption: 'Pegi dengan tablet digital untuk desain & branding kreatif',
        },
        {
          loc: `${cleanBase}/assets/pegi-megaphone.webp`,
          title: 'Pegi Megafon — Promo & Call to Action AKV',
          caption: 'Pegi mengajak kolaborasi proyek kreatif visual',
        },
      ],
    },
    {
      loc: `${cleanBase}/#layanan`,
      priority: '0.9',
      changefreq: 'weekly',
    },
    {
      loc: `${cleanBase}/#portofolio`,
      priority: '0.9',
      changefreq: 'weekly',
    },
    {
      loc: `${cleanBase}/#proses`,
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      loc: `${cleanBase}/#tentang`,
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      loc: `${cleanBase}/#keunggulan`,
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      loc: `${cleanBase}/#testimoni`,
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      loc: `${cleanBase}/#kontak`,
      priority: '0.9',
      changefreq: 'weekly',
    },
    {
      loc: `${cleanBase}/?lang=id`,
      priority: '0.8',
      changefreq: 'weekly',
    },
    {
      loc: `${cleanBase}/?lang=en`,
      priority: '0.8',
      changefreq: 'weekly',
    },
  ]

  const urlElements = pages
    .map((page) => {
      let imageXml = ''
      if (page.images && page.images.length > 0) {
        imageXml = page.images
          .map(
            (img) => `
    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${img.title}</image:title>
      <image:caption>${img.caption}</image:caption>
    </image:image>`
          )
          .join('')
      }

      return `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${imageXml}
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements}
</urlset>`
}

export function generateRobotsTxt(baseUrl = 'https://akv.zakariamp.id', adminRoute = '/admin-akv') {
  const cleanBase = (baseUrl || 'https://akv.zakariamp.id').replace(/\/$/, '')
  return `User-agent: *
Allow: /
Disallow: ${adminRoute}
Disallow: /admin
Disallow: /login

Sitemap: ${cleanBase}/sitemap.xml`
}

export function writeStaticSitemaps(targetDir, baseUrl = 'https://akv.zakariamp.id', adminRoute = '/admin-akv') {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  const effectiveUrl = baseUrl && baseUrl !== 'http://localhost:5173' ? baseUrl : 'https://akv.zakariamp.id'
  fs.writeFileSync(path.join(targetDir, 'sitemap.xml'), generateSitemap(effectiveUrl), 'utf8')
  fs.writeFileSync(path.join(targetDir, 'robots.txt'), generateRobotsTxt(effectiveUrl, adminRoute), 'utf8')
}
