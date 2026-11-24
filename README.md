# AKV - Arah Karya Visual · Landing & Admin Platform

Website resmi **AKV (Arah Karya Visual)** di **[akv.zakariamp.id](https://akv.zakariamp.id)** — studio jasa kreatif Indonesia oleh **Zakaria Mujur Prasetyo** (Owner · Visual Designer) dan **Lia Nur Khasanah** (Co-Founder · Creative Director).

**Tagline:** Arahkan Konten, Urus Visual. · EST 2023

## Fitur Utama

- **Landing Page Siap Jualan:** Hero interaktif (intro cepat ~1.5s, sekali per sesi), sekuens brand scroll-scrub (desktop) & showcase kompak (mobile), 8 Layanan dengan estimasi harga & tombol order WA langsung, 3 Paket Harga Utama, Portofolio dengan filter kategori & Modal Detail, Proses Kerja, Testimoni, FAQ Accordion, serta Floating WhatsApp CTA.
- **Halaman Legal Bilingual (ID/EN):** `/syarat-ketentuan` dan `/privasi`, terintegrasi dengan `?locale=en`.
- **Dashboard Admin (`/admin-akv`):** Login via **Supabase Auth** (dilindungi RLS whitelist email admin). CRUD penuh untuk Kontak, Layanan, Paket Harga, Portofolio, Testimoni, FAQ, dan Tim.
- **Upload Portofolio ke Cloudflare R2 + Kompres WebP Otomatis:** Gambar PNG/JPG/WebP otomatis di-resize (maks 1400px), dikompres target <= 250 KB, dan dikonversi ke WebP di browser sebelum diunggah ke Cloudflare R2 melalui Vercel Function `/api/upload-r2`.
- **SEO & Keamanan Produksi:** Sitemap Index (`sitemap.xml`, `sitemap-main.xml`, `sitemap-images.xml`, `sitemap.xsl`), JSON-LD `@graph` (`WebSite`, `WebPage`, `ProfessionalService`, `Person`, `ItemList`, `FAQPage`, `BreadcrumbList`), OG Banner 1200×630 WebP, `manifest.webmanifest`, serta security headers + CSP di `vercel.json`.

## Teknologi

- [Vite](https://vitejs.dev) + [React 18](https://react.dev) + [React Router](https://reactrouter.com)
- [Tailwind CSS v3](https://tailwindcss.com) (token warna AKV di `tailwind.config.js`)
- [Framer Motion](https://www.framer.com/motion/) + [GSAP ScrollTrigger](https://gsap.com/scrolltrigger/) + [Lenis](https://lenis.darkroom.engineering/)
- [Supabase](https://supabase.com) (Database + Auth + RLS)
- [Cloudflare R2](https://developers.cloudflare.com/r2/) via Vercel Node.js Function (`api/upload-r2.js`)

## Menjalankan Lokal

```bash
npm install
npm run dev                  # http://localhost:5173
npm run build                # build produksi ke dist/
npm run preview              # pratinjau hasil build
npm run generate-seo-assets  # regenerasi og-akv.webp & ikon WebP
```

## Konfigurasi Environment

Salin konfigurasi ke `.env` lokal dan **Vercel Dashboard → Project Settings → Environment Variables**:

```env
# Public (aman di client)
VITE_SITE_URL=https://akv.zakariamp.id
VITE_ADMIN_ROUTE=/admin-akv
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>

# Server-side only (JANGAN pakai prefix VITE_)
ADMIN_EMAILS=zakariamujur6@gmail.com
R2_ACCOUNT_ID=<cloudflare-account-id>
R2_ACCESS_KEY_ID=<r2-api-access-key>
R2_SECRET_ACCESS_KEY=<r2-api-secret-key>
R2_BUCKET_NAME=akv-assets
R2_PUBLIC_URL=https://cdn.akv.zakariamp.id
```

## Setup Database Supabase

Jalankan isi [supabase/setup.sql](supabase/setup.sql) di **Supabase Dashboard → SQL Editor**. Script bersifat idempoten (aman dijalankan ulang) dan membuat 7 tabel, fungsi whitelist `public.is_akv_admin()`, RLS policies, serta seed data awal. Pastikan **Allow new users to sign up** di Supabase Auth dimatikan (OFF) agar hanya akun admin yang terdaftar yang bisa login.
