# Manifest AKV — Panduan wajib untuk AI / LLM yang mengerjakan project ini

Project: landing page + dashboard admin **AKV (Arah Karya Visual)**, jasa kreatif Indonesia.
Domain: **`https://akv.zakariamp.id`** · Slogan: **"Arahkan Konten, Urus Visual."** · EST 2023 · Maskot: **Pegi** (pena digital berkacamata).
Owner: **Zakaria Mujur Prasetyo** (`https://zakariamp.id`) · Co-Founder: **Lia Nur Khasanah** (`https://lianurkhasanah.my.id`).

Baca file ini SEBELUM mengubah apa pun. Semua keputusan di bawah sudah final dari pemilik brand.

## Aturan keras (jangan dilanggar)

1. **JANGAN AI-SLOP.** Dilarang: gradasi ungu/rainbow, glow berlebihan, glassmorphism berat,
   partikel banyak, emoji sebagai ikon, copy hype generik, elemen dekor yang "maksa".
2. **Hanya palet AKV**: primer `#0B5CFF` (akv-blue), royal `#1E3C8F`, navy `#0D1B3D`,
   navy-soft `#12275E`, sky `#7FAEE8`, light `#DCEBFF`, pale `#F4F8FF`, putih.
   Token ada di `tailwind.config.js`. Warna di luar ini = salah.
3. **Semua aset gambar format WebP.** Tidak boleh ada PNG/JPG/SVG di `public/`.
   Dekorasi digambar sebagai SVG di `scripts/deco-src/` lalu dirender WebP 2x via
   `node scripts/build-deco.mjs`. Logo/Pegi dioptimasi via `npm run optimize-assets`,
   sedangkan OG image & ikon PWA lewat `npm run generate-seo-assets`.
4. **Aset resmi tidak boleh digambar ulang/di-AI-kan**: logo AKV dan semua pose Pegi
   dipakai apa adanya (hanya boleh trim + kompres).
5. **Tanpa em dash (—)** di seluruh teks yang tampil ke user. Pakai koma/titik/titik dua/tanda hubung biasa.
6. **Bahasa Indonesia** gaya "kami/kamu", santai-profesional, sentence case
   (UPPERCASE hanya label kecil ber-letter-spacing). Istilah desain boleh Inggris.
   Dukungan bilingual via `?locale=en` (juga menerima `?lang=en`).
7. **Nama testimoni disensor** (contoh `Naj***`) demi privasi. Jangan mengarang klaim
   (jumlah klien, dll). Placeholder harus diberi label jujur.
8. Ukuran layout sudah dikalibrasi ("jangan zoom"): root font desktop 15px
   (lihat `index.css`), headline hero ±42px, navbar 60px. Jangan membesarkan kembali.

## Stack & struktur

- Vite + React 18 (JS murni, BUKAN TypeScript, BUKAN shadcn).
- Tailwind CSS v3 (token brand + keyframes `canopy-x` untuk marquee).
- Framer Motion: intro hero (~1.5s, sekali per sesi tab), reveal section, parallax mouse.
- GSAP ScrollTrigger: aset pinggir (EdgeAsset khusus >= 1024px), sekuens logo pinned (LogoSequence khusus >= 768px; mobile pakai showcase kompak).
- Lenis: smooth scroll (di Landing saja, sinkron dengan ScrollTrigger di `useLenis`).
- Supabase: database konten (7 tabel + RLS whitelist `public.is_akv_admin()`) & autentikasi admin (`Supabase Auth`).
- Cloudflare R2: penyimpanan gambar portofolio WebP via Vercel Function `api/upload-r2.js` + kompresi WebP otomatis di browser (`src/utils/imageWebp.js`).
- React Router: `/` landing, `/syarat-ketentuan`, `/privasi`, `/admin-akv` (redirect dari `/admin` & `/login`), `*` = 404.

```
api/
  upload-r2.js  Vercel Node.js Function (AWS SigV4 R2 PUT/DELETE, verifikasi JWT + whitelist email admin)
src/
  pages/        Landing, Admin (CRUD 7 tab + R2 WebP uploader), Terms, Privacy, NotFound
  components/   Navbar, Hero, LogoSequence, About, Services, Pricing, Portfolio,
                Process, WhyAkv, Testimonials, Faq, CtaSection, Footer, FloatingWa, LegalLayout
    ui/         Icon, Reveal, SectionHeading, EdgeAsset, PenCursor, ScrollHint,
                TapeDivider, AnimatedTestimonials
  admin/        auth.js (Supabase Auth), LoginForm, Sidebar
  data/
    site.js     konten bawaan (kontak, layanan, paket, portofolio, testimoni, FAQ, tim)
    store.js    hydrate publik via fetch REST ringan (tanpa SDK di landing) + save via lazy Supabase SDK
    i18n.js     bilingual id/en (?locale=en)
  utils/        supabase.js, seo.js, imageWebp.js, r2Upload.js
  hooks/        useLenis, useMouseParallax, useIsTouch, useInfiniteHorizontalScroll
scripts/        optimize-assets.mjs, build-deco.mjs, generate-seo-assets.mjs, sitemapGenerator.js
supabase/       setup.sql (idempoten: 7 tabel + RLS whitelist + seed data)
```

## Pola penting

- **Konten dinamis** dibaca lewat `useContent()` dari `src/data/store.js` (BUKAN import langsung dari `site.js`).
  `store.js` memakai `fetch` REST publik agar `@supabase/supabase-js` tidak masuk ke bundle awal landing.
- **Admin**: autentikasi via Supabase Auth (`src/admin/auth.js`) + whitelist email (`public.is_akv_admin()` di Supabase & `ADMIN_EMAILS` di `api/upload-r2.js`).
  CRUD tersedia untuk: Kontak, Layanan (termasuk harga & durasi), Paket Harga, Portofolio (upload WebP ke R2), Testimoni, FAQ, Tim + reset.
- **Animasi hidup dua arah** (scroll turun & naik): framer `viewport={{ once: false }}`,
  GSAP `toggleActions: 'play reverse play reverse'`. Pertahankan.
- **Aksesibilitas**: dukung `prefers-reduced-motion` di SETIAP animasi baru & `PenCursor`, alt text deskriptif, focus ring, tap target >= 44-48px.
- **SEO & Keamanan**: Sitemap Index (`sitemap.xml` -> `sitemap-main.xml` & `sitemap-images.xml`), JSON-LD `@graph` (termasuk `FAQPage` & entity linking ke `zakariamp.my.id/#person`), `noindex` pada admin/404, security headers + CSP di `vercel.json`.

## Perintah

```bash
npm run dev                  # dev server :5173 (termasuk bridge lokal /api/upload-r2 & sitemap)
npm run build                # build produksi — WAJIB lolos sebelum selesai
npm run optimize-assets      # regenerasi WebP logo/Pegi
npm run generate-seo-assets  # regenerasi OG 1200x630 WebP & ikon persegi WebP
node scripts/build-deco.mjs  # regenerasi WebP dekorasi dari SVG sumber
```

## Checklist sebelum menyelesaikan perubahan

- [ ] `npm run build` lolos
- [ ] Tidak ada overflow horizontal di 375 / 768 / 1536 px
- [ ] Tidak ada warna di luar palet, tidak ada em dash di teks tampil
- [ ] Aset baru di `public/` = WebP, `prefers-reduced-motion` tetap berfungsi
- [ ] Konten editable baru dijalurkan lewat `store.js` + panel admin + `supabase/setup.sql`
