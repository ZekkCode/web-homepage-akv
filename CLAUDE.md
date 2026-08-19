# Manifest AKV — Panduan wajib untuk AI / LLM yang mengerjakan project ini

Project: landing page + dashboard admin **AKV (Arah Karya Visual)**, jasa kreatif Indonesia.
Slogan: **"Arahkan Konten, Urus Visual."** · EST 2023 · Maskot: **Pegi** (pena digital berkacamata).

Baca file ini SEBELUM mengubah apa pun. Semua keputusan di bawah sudah final dari pemilik brand.

## Aturan keras (jangan dilanggar)

1. **JANGAN AI-SLOP.** Dilarang: gradasi ungu/rainbow, glow berlebihan, glassmorphism berat,
   partikel banyak, emoji sebagai ikon, copy hype generik, elemen dekor yang "maksa".
2. **Hanya palet AKV**: primer `#0B5CFF` (akv-blue), royal `#1E3C8F`, navy `#0D1B3D`,
   navy-soft `#12275E`, sky `#7FAEE8`, light `#DCEBFF`, pale `#F4F8FF`, putih.
   Token ada di `tailwind.config.js`. Warna di luar ini = salah.
3. **Semua aset gambar format WebP.** Tidak boleh ada PNG/JPG/SVG di `public/`.
   Dekorasi digambar sebagai SVG di `scripts/deco-src/` lalu dirender WebP 2x via
   `node scripts/build-deco.mjs`. Logo/Pegi dioptimasi via `npm run optimize-assets`
   (sumber di folder induk `E:\LiaaZekk\AKU.visual`: `MASKOT/`, `logo-akv/`).
4. **Aset resmi tidak boleh digambar ulang/di-AI-kan**: logo AKV dan semua pose Pegi
   dipakai apa adanya (hanya boleh trim + kompres).
5. **Tanpa em dash (—)** di seluruh teks yang tampil ke user. Pakai koma/titik/titik dua.
6. **Bahasa Indonesia** gaya "kami/kamu", santai-profesional, sentence case
   (UPPERCASE hanya label kecil ber-letter-spacing). Istilah desain boleh Inggris.
7. **Nama testimoni disensor** (contoh `Naj***`) demi privasi. Jangan mengarang klaim
   (jumlah klien, dll). Placeholder harus diberi label jujur.
8. Ukuran layout sudah dikalibrasi ("jangan zoom"): root font desktop 15px
   (lihat `index.css`), headline hero ±42px, navbar 60px. Jangan membesarkan kembali.

## Stack & struktur

- Vite + React 18 (JS murni, BUKAN TypeScript, BUKAN shadcn — CLI shadcn tidak kompatibel).
- Tailwind CSS v3 (token brand + keyframes `canopy-x` untuk marquee).
- Framer Motion: intro hero, reveal section, parallax mouse.
- GSAP ScrollTrigger: aset pinggir (EdgeAsset), sekuens logo pinned (LogoSequence).
- Lenis: smooth scroll (di Landing saja, sinkron dengan ScrollTrigger di `useLenis`).
- React Router: `/` landing, `/admin` dashboard, `*` = 404 + login admin.

```
src/
  pages/        Landing, Admin (dashboard CRUD), NotFound (404 + login)
  components/   section landing (Hero, About, ..., Footer)
    ui/         Icon, Reveal, SectionHeading, EdgeAsset, PenCursor, ScrollHint,
                AnimatedTestimonials
  admin/        auth.js (password — GANTI sebelum rilis), LoginForm
  data/
    site.js     konten bawaan (teks, layanan, portofolio, dll.)
    store.js    lapisan konten: bawaan + override localStorage (key `akv-content`)
  hooks/        useLenis, useMouseParallax, useIsTouch
scripts/        optimize-assets.mjs, build-deco.mjs, deco-src/ (sumber SVG)
```

## Pola penting

- **Konten dinamis** dibaca lewat `useContent()` dari `src/data/store.js` (BUKAN import
  langsung dari `site.js`) supaya hasil edit dashboard admin langsung tampil.
  Untuk backend nanti: cukup ganti `load()`/`persist()` di `store.js`.
- **Admin**: password di `src/admin/auth.js` (`akv2023` — placeholder, wajib diganti),
  sesi di sessionStorage. CRUD: Kontak, Layanan, Portofolio, Testimoni, Tim + reset.
- **Intro hero** = state machine fase 0-7 di `Hero.jsx`; hanya mulai saat tab terlihat.
- **Animasi hidup dua arah** (scroll turun & naik): framer `viewport={{ once: false }}`,
  GSAP `toggleActions: 'play reverse play reverse'`. Pertahankan.
- **Aksesibilitas**: dukung `prefers-reduced-motion` di SETIAP animasi baru
  (framer `useReducedMotion`, GSAP cek `matchMedia`), alt text deskriptif, focus ring.
- **Performa**: hanya animasikan transform/opacity, lazy-load di bawah lipatan,
  gambar dekor `select-none` + `draggable=false` (teks harus tetap bisa diseleksi).
- Kursor custom pen (`PenCursor`) hanya aktif pointer halus; jangan ganggu.

## Perintah

```bash
npm run dev              # dev server :5173 (config .claude/launch.json: "akv-dev")
npm run build            # build produksi — WAJIB lolos sebelum selesai
npm run optimize-assets  # regenerasi WebP logo/Pegi
node scripts/build-deco.mjs  # regenerasi WebP dekorasi dari SVG sumber
```

## Checklist sebelum menyelesaikan perubahan

- [ ] `npm run build` lolos
- [ ] Tidak ada overflow horizontal di 375 / 768 / 1536 px
- [ ] Tidak ada warna di luar palet, tidak ada em dash di teks tampil
- [ ] Aset baru = WebP, reduced-motion tetap berfungsi
- [ ] Konten editable baru ikut dijalurkan lewat `store.js` + panel admin bila relevan
