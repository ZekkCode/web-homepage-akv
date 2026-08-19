/**
 * Optimizes the official AKV brand assets (logo + Pegi mascot poses)
 * into compressed transparent WebP files under public/assets.
 *
 * Source art is NEVER redrawn — only trimmed (transparent margins) and resized.
 * Run: npm run optimize-assets
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(process.cwd(), '..')
const OUT = path.resolve(process.cwd(), 'public', 'assets')

const jobs = [
  // Official AKV wordmark (transparent version)
  {
    src: path.join(ROOT, 'logo-akv', 'logo-fix', 'logo-fix-transparant (2).png'),
    out: 'logo-akv.webp',
    width: 1200,
    trim: true,
  },
  // Pegi poses — transparent PNGs, untouched artwork
  { src: path.join(ROOT, 'MASKOT', 'pegi-1.png'), out: 'pegi-wave.webp', width: 900, trim: true },
  { src: path.join(ROOT, 'MASKOT', 'pegi-4.png'), out: 'pegi-present.webp', width: 900, trim: true },
  { src: path.join(ROOT, 'MASKOT', 'pegi-5.png'), out: 'pegi-tablet.webp', width: 800, trim: true },
  { src: path.join(ROOT, 'MASKOT', 'pegi-7.png'), out: 'pegi-megaphone.webp', width: 800, trim: true },
  { src: path.join(ROOT, 'MASKOT', 'pegi-9.png'), out: 'pegi-point.webp', width: 800, trim: true },
  // Catatan: aset dekorasi pinggir (deco-*.svg) digambar tangan langsung di
  // public/assets mengikuti palet AKV — tidak dihasilkan dari skrip ini.
]

await mkdir(OUT, { recursive: true })

for (const job of jobs) {
  let img = sharp(job.src)
  if (job.trim) img = img.trim()
  const outPath = path.join(OUT, job.out)
  await img
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: 84, alphaQuality: 90 })
    .toFile(outPath)
  console.log(`ok ${job.out}`)
}
console.log('All assets optimized.')
