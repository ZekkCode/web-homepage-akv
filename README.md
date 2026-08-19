# AKV — Arah Karya Visual · Landing Website

Website landing satu halaman untuk **AKV (Arah Karya Visual)** dengan parallax
bertingkat, animasi intro logo → Pegi, dan desain responsif penuh.

**Tagline:** Arahkan Konten, Urus Visual. · EST 2023

## Teknologi

- [Vite](https://vitejs.dev) + [React 18](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com) (token warna AKV di `tailwind.config.js`)
- [Framer Motion](https://www.framer.com/motion/) — animasi intro hero, scroll reveal, parallax mouse
- [GSAP ScrollTrigger](https://gsap.com/scrolltrigger/) — aset dekorasi pinggir kiri/kanan (entrance gaya AOS + drift parallax)
- [Lenis](https://lenis.darkroom.engineering/) — smooth scrolling seluruh halaman
- Font: Plus Jakarta Sans (Google Fonts)

Fitur tambahan:

- **Sekuens brand scroll-scrub** (`src/components/LogoSequence.jsx`) — intro brand
  AKV dibangun langsung dari elemen asli (logo WebP hi-res, Pegi, doodle SVG),
  di-pin dan di-scrub GSAP ScrollTrigger. Tajam di semua resolusi karena tanpa
  frame video.
- **Semua aset WebP** — dekorasi digambar sebagai SVG di `scripts/deco-src/` lalu
  dirender ke WebP via `node scripts/build-deco.mjs` (termasuk `favicon.webp`).

- **Kursor pen digital** (`src/components/ui/PenCursor.jsx`) — hanya aktif di
  perangkat ber-mouse; membesar saat hover elemen interaktif.
- **Favicon persegi** (`public/favicon.svg`) — motif mata pena AKV, tidak gepeng
  di tab browser.
- **Animasi dua arah** — reveal & aset pinggir hidup saat scroll turun maupun naik.
- **Pegi "napak" di panel CTA** — kaki tepat di dasar kartu, kepala overflow keluar
  panel di desktop.

## Menjalankan

```bash
npm install
npm run dev        # server development di http://localhost:5173
npm run build      # build produksi ke folder dist/
npm run preview    # pratinjau hasil build
```

## Struktur

```
public/assets/          aset brand hasil optimasi (WebP, transparan)
scripts/optimize-assets.mjs   skrip kompresi ulang aset dari folder sumber
src/
  data/site.js          ⭐ SEMUA konten & kontak — edit di sini
  hooks/                useMouseParallax, useIsTouch, useLenis (smooth scroll + GSAP sync)
  components/
    ui/                 Icon, Reveal, SectionHeading, EdgeAsset (reusable)
    Navbar.jsx          navbar sticky + menu hamburger mobile
    Hero.jsx            hero parallax + urutan intro (logo → Pegi → panel)
    About.jsx           Kenalan dengan AKV + tim
    Services.jsx        8 kartu layanan
    Portfolio.jsx       showcase + filter kategori
    Process.jsx         5 langkah proses kerja
    WhyAkv.jsx          4 keunggulan
    Testimonials.jsx    testimoni (placeholder)
    CtaSection.jsx      ajakan mulai project + Pegi megafon
    Footer.jsx          footer lengkap
```

## Dashboard admin

- Buka rute apa pun yang tidak ada (halaman 404) atau langsung `/admin`, lalu login.
- Password bawaan: `akv2023` — **wajib diganti** di `src/admin/auth.js` sebelum rilis.
- CRUD tersedia untuk: Kontak & Sosial, Layanan, Portofolio, Testimoni, Tim,
  plus tombol reset ke bawaan. Perubahan disimpan di localStorage browser
  (key `akv-content`) dan langsung tampil di landing tanpa build ulang.
- Integrasi backend nanti cukup mengganti `load()`/`persist()` di `src/data/store.js`.
- Panduan lengkap untuk AI/LLM penerus ada di `CLAUDE.md`.

## Mengganti konten placeholder

Semua konten yang perlu diganti ada di **`src/data/site.js`**:

1. **Kontak** — objek `contact` di bagian atas file:
   - `whatsapp`: nomor WA format internasional tanpa `+` (contoh `62812xxxxxxx`)
   - `instagram`, `tiktok`, `email`
2. **Portofolio** — array `portfolioItems`. Letakkan gambar project di
   `public/assets/portfolio/`, lalu ganti `image: null` menjadi
   `image: '/assets/portfolio/nama-file.webp'`. Gunakan rasio 4:3.
3. **Testimoni** — array `testimonials` (nama, peran, kutipan asli).
4. **Tim** — array `teamMembers` di bagian bawah.

## Aset brand

Aset resmi (logo & Pegi) diambil dari folder induk `AKU.visual` dan
dikompresi ke WebP transparan **tanpa digambar ulang**. Jika ada aset baru,
tambahkan entri di `scripts/optimize-assets.mjs` lalu jalankan:

```bash
npm run optimize-assets
```

Pose Pegi yang dipakai:

| File | Pose | Dipakai di |
|---|---|---|
| `pegi-wave.webp` | melambai + tablet | Hero (intro) |
| `pegi-present.webp` | presentasi (pena diangkat) | Hero (final) |
| `pegi-tablet.webp` | menunjukkan tablet AKV | Tentang Kami |
| `pegi-megaphone.webp` | megafon + tangan terbuka | Bagian CTA |
| `pegi-point.webp` | menunjuk ke depan | cadangan |

## Aksesibilitas & performa

- Navigasi keyboard penuh, focus ring terlihat, skip-link, HTML semantik.
- `prefers-reduced-motion`: intro & parallax dimatikan, semua konten langsung tampil.
- Parallax mouse otomatis nonaktif di perangkat sentuh; parallax scroll dikurangi.
- Gambar di bawah lipatan memakai `loading="lazy"`; semua aset WebP (~90–140 KB).
- Animasi hanya memakai `transform` dan `opacity` (target 60 FPS).
