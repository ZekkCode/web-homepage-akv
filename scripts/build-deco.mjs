/**
 * Render aset dekorasi SVG (scripts/deco-src) menjadi WebP transparan 2x
 * di public/assets, plus favicon.webp. Semua aset situs berformat WebP.
 * Run: node scripts/build-deco.mjs
 */
import sharp from 'sharp'
import path from 'node:path'

const SRC = path.resolve(process.cwd(), 'scripts', 'deco-src')
const OUT = path.resolve(process.cwd(), 'public', 'assets')

const jobs = [
  ['deco-pen-tool.svg', 'deco-pen-tool.webp', 380],
  ['deco-pen-tool-light.svg', 'deco-pen-tool-light.webp', 380],
  ['deco-nib-swash.svg', 'deco-nib-swash.webp', 360],
  ['deco-copy-paste.svg', 'deco-copy-paste.webp', 420],
  ['deco-toolbar.svg', 'deco-toolbar.webp', 140],
  ['deco-tool-flyout.svg', 'deco-tool-flyout.webp', 480],
  ['deco-tape.svg', 'deco-tape.webp', 540],
]

for (const [src, out, width] of jobs) {
  await sharp(path.join(SRC, src), { density: 300 })
    .resize({ width })
    .webp({ quality: 88, alphaQuality: 92 })
    .toFile(path.join(OUT, out))
  console.log(`ok ${out}`)
}

// favicon 96x96
await sharp(path.join(SRC, 'favicon.svg'), { density: 300 })
  .resize({ width: 96 })
  .webp({ quality: 92 })
  .toFile(path.resolve(process.cwd(), 'public', 'favicon.webp'))
console.log('ok favicon.webp')
