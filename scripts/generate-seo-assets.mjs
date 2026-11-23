/**
 * Generate SEO & PWA WebP assets from official AKV brand artwork (without redrawing).
 * Outputs:
 *   - public/assets/og-akv.webp       (1200x630 Open Graph / Twitter Card)
 *   - public/favicon.webp             (96x96 square icon)
 *   - public/assets/icon-192.webp     (192x192 PWA icon)
 *   - public/assets/icon-512.webp     (512x512 PWA & Apple Touch icon)
 *
 * Run: node scripts/generate-seo-assets.mjs
 */
import sharp from 'sharp'
import path from 'node:path'

const PUBLIC = path.resolve(process.cwd(), 'public')
const ASSETS = path.join(PUBLIC, 'assets')

const logoPath = path.join(ASSETS, 'logo-akv.webp')
const pegiPath = path.join(ASSETS, 'pegi-present.webp')

// 1. Square brand icons (contain official logo on clean white square with rounded feel)
async function buildSquareIcon(size, outPath) {
  const pad = Math.round(size * 0.12)
  const innerW = size - pad * 2

  const resizedLogo = await sharp(logoPath)
    .resize({ width: innerW, height: innerW, fit: 'inside' })
    .toBuffer()

  const bgSvg = Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="#FFFFFF"/>
      <rect x="${Math.max(1, Math.round(size * 0.02))}" y="${Math.max(1, Math.round(size * 0.02))}" width="${size - Math.max(2, Math.round(size * 0.04))}" height="${size - Math.max(2, Math.round(size * 0.04))}" rx="${Math.round(size * 0.2)}" fill="none" stroke="#DCEBFF" stroke-width="${Math.max(2, Math.round(size * 0.03))}"/>
    </svg>`
  )

  await sharp(bgSvg)
    .composite([{ input: resizedLogo, gravity: 'centre' }])
    .webp({ quality: 92, alphaQuality: 95 })
    .toFile(outPath)

  console.log(`ok ${path.relative(process.cwd(), outPath)} (${size}x${size})`)
}

// 2. Open Graph banner 1200x630 using official AKV palette (#0B5CFF, #1E3C8F, #0D1B3D, #DCEBFF, #F4F8FF, #FFFFFF)
async function buildOgImage() {
  const W = 1200
  const H = 630

  // Subtle background SVG with AKV grid, soft radial light, typography & badges
  const bgSvg = Buffer.from(
    `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="55%" stop-color="#F4F8FF"/>
          <stop offset="100%" stop-color="#DCEBFF"/>
        </linearGradient>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1E3C8F" stroke-opacity="0.06" stroke-width="1"/>
        </pattern>
        <radialGradient id="glow1" cx="85%" cy="20%" r="45%">
          <stop offset="0%" stop-color="#7FAEE8" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#7FAEE8" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="glow2" cx="12%" cy="88%" r="40%">
          <stop offset="0%" stop-color="#0B5CFF" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#0B5CFF" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <rect width="${W}" height="${H}" fill="url(#grid)"/>
      <rect width="${W}" height="${H}" fill="url(#glow1)"/>
      <rect width="${W}" height="${H}" fill="url(#glow2)"/>

      <!-- Top accent bar -->
      <rect x="0" y="0" width="${W}" height="8" fill="#0B5CFF"/>

      <!-- Decorative card behind Pegi on the right -->
      <rect x="780" y="76" width="350" height="484" rx="32" fill="#FFFFFF" fill-opacity="0.88" stroke="#1E3C8F" stroke-opacity="0.12" stroke-width="2"/>
      <rect x="802" y="98" width="306" height="440" rx="22" fill="#F4F8FF"/>

      <!-- Eyebrow pill -->
      <rect x="76" y="182" width="236" height="36" rx="18" fill="#DCEBFF"/>
      <text x="194" y="205" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="2" fill="#0B5CFF">JASA KREATIF · EST 2023</text>

      <!-- Main Headline -->
      <text x="76" y="286" font-family="Segoe UI, Arial, sans-serif" font-size="56" font-weight="800" fill="#0D1B3D">Arahkan Konten,</text>
      <text x="76" y="352" font-family="Segoe UI, Arial, sans-serif" font-size="56" font-weight="800" fill="#0B5CFF">Urus Visual.</text>

      <!-- Subtitle -->
      <text x="76" y="406" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="600" fill="#12275E" fill-opacity="0.82">Desain Grafis · Branding &amp; Logo · CV &amp; Portofolio</text>
      <text x="76" y="438" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="600" fill="#12275E" fill-opacity="0.82">Website · AI Visual · Animasi &amp; Editing Video</text>

      <!-- Bottom domain + founder bar -->
      <rect x="76" y="492" width="656" height="68" rx="18" fill="#0D1B3D"/>
      <text x="104" y="523" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="800" fill="#FFFFFF">akv.zakariamp.id</text>
      <text x="104" y="546" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="600" fill="#7FAEE8">AKV (Arah Karya Visual) · Zakaria Mujur Prasetyo &amp; Lia Nur Khasanah</text>
    </svg>`
  )

  const logoBuf = await sharp(logoPath)
    .resize({ width: 170, withoutEnlargement: true })
    .toBuffer()

  const pegiBuf = await sharp(pegiPath)
    .resize({ height: 470, withoutEnlargement: true })
    .toBuffer()
  const pegiMeta = await sharp(pegiBuf).metadata()

  const pegiLeft = Math.round(780 + (350 - (pegiMeta.width || 250)) / 2)
  const pegiTop = Math.round(560 - (pegiMeta.height || 470))

  const outPath = path.join(ASSETS, 'og-akv.webp')
  await sharp(bgSvg)
    .composite([
      { input: logoBuf, left: 76, top: 64 },
      { input: pegiBuf, left: pegiLeft, top: pegiTop },
    ])
    .webp({ quality: 88 })
    .toFile(outPath)

  console.log(`ok ${path.relative(process.cwd(), outPath)} (${W}x${H})`)
}

await buildSquareIcon(96, path.join(PUBLIC, 'favicon.webp'))
await buildSquareIcon(192, path.join(ASSETS, 'icon-192.webp'))
await buildSquareIcon(512, path.join(ASSETS, 'icon-512.webp'))
await buildOgImage()
console.log('SEO & PWA WebP assets generated successfully.')
