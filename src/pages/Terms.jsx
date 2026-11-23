import LegalLayout from '../components/LegalLayout.jsx'
import { useLocale } from '../data/i18n.js'
import { usePageSeo } from '../utils/seo.js'

const CONTENT = {
  id: {
    seoTitle: 'Syarat & Ketentuan Order | AKV - Arah Karya Visual',
    seoDesc:
      'Syarat dan ketentuan pemesanan layanan desain grafis, branding, CV, portofolio, website, video, dan animasi AI di AKV (Arah Karya Visual).',
    eyebrow: 'Legal & Transparansi',
    title: 'Syarat & Ketentuan Order',
    subtitle:
      'Panduan ringkas agar kerja sama proyek antara kamu dan tim AKV (Arah Karya Visual) berjalan nyaman, jelas, dan tepat waktu sejak awal.',
    updatedAt: 'November 2026',
    sections: [
      {
        heading: 'Pemesanan & Kesepakatan Brief',
        paragraphs: [
          'Setiap proyek dimulai dari diskusi brief melalui WhatsApp atau email resmi AKV. Sebelum pengerjaan berjalan, kami akan mengirimkan ringkasan ruang lingkup, estimasi biaya, jumlah revisi, serta perkiraan waktu selesai.',
          'Proyek dinyatakan resmi masuk antrean pengerjaan setelah brief disetujui bersama dan pembayaran awal (DP) diterima.',
        ],
      },
      {
        heading: 'Harga, Pembayaran DP 50%, dan Pelunasan',
        bullets: [
          'Harga yang tertera pada halaman Layanan dan Paket bersifat estimasi awal ("Mulai dari") dan dapat menyesuaikan kompleksitas brief.',
          'Untuk proyek paket maupun custom, berlaku DP 50% di awal pengerjaan dan pelunasan 50% setelah pratinjau hasil final disetujui.',
          'Untuk pesanan satuan skala kecil, metode pembayaran dapat dilakukan lunas di awal atau sesuai kesepakatan tertulis saat konfirmasi brief.',
          'File master resolusi tinggi atau akses publikasi website diserahkan setelah pelunasan terkonfirmasi.',
        ],
      },
      {
        heading: 'Ketentuan Revisi',
        bullets: [
          'Jatah revisi mengikuti paket yang dipilih: 2x revisi minor (Starter), 3x revisi terarah (UMKM & Kreator), atau revisi bertahap per milestone (Brand & Website).',
          'Revisi mencakup penyesuaian teks, warna, proporsi, atau tata letak yang masih sesuai dengan konsep brief awal.',
          'Perubahan total konsep di luar brief yang sudah disepakati atau penambahan revisi di luar kuota dapat dikenakan penyesuaian biaya dan waktu.',
        ],
      },
      {
        heading: 'Estimasi Waktu & Kelengkapan Materi',
        paragraphs: [
          'Estimasi pengerjaan (1-10 hari kerja tergantung layanan) dihitung sejak DP diterima dan seluruh materi pendukung dari klien (teks, logo lama, foto produk, atau referensi) telah lengkap.',
          'Keterlambatan pengiriman materi atau respons pratinjau dari klien akan menggeser jadwal serah terima secara proporsional.',
        ],
      },
      {
        heading: 'File Final & Hak Penggunaan',
        paragraphs: [
          'Setelah pelunasan, hak penggunaan penuh atas hasil karya final menjadi milik klien sesuai tujuan proyek yang disepakati.',
          'Format file yang diberikan mengikuti rincian paket (PNG, PDF, WebP, MP4, file editable, atau kode sumber website). File proyek disimpan sebagai arsip sementara di AKV maksimal 30 hari setelah pengiriman final, sehingga klien disarankan segera mengunduh dan mencadangkan file.',
        ],
      },
      {
        heading: 'Penayangan Portofolio',
        paragraphs: [
          'AKV berhak menampilkan cuplikan karya yang telah selesai pada portofolio situs web dan media sosial resmi AKV sebagai referensi kualitas kerja.',
          'Jika proyek bersifat rahasia atau kamu tidak ingin karya dipublikasikan, cukup beri tahu kami saat diskusi brief dan kami akan menghormati permintaan privasi tersebut.',
        ],
      },
      {
        heading: 'Pembatalan Proyek',
        paragraphs: [
          'Jika pembatalan dilakukan sebelum proses riset atau desain dimulai, pembayaran dapat didiskusikan untuk pengembalian atau dialihkan ke layanan lain.',
          'Jika pembatalan dilakukan setelah tahap konsep atau eksekusi visual berjalan, DP tidak dapat dikembalikan sebagai kompensasi waktu dan tenaga tim yang telah dialokasikan.',
        ],
      },
    ],
  },
  en: {
    seoTitle: 'Terms of Order | AKV - Arah Karya Visual',
    seoDesc:
      'Terms and conditions for ordering graphic design, branding, CV, portfolio, website, video editing, and AI animation services at AKV (Arah Karya Visual).',
    eyebrow: 'Legal & Transparency',
    title: 'Terms of Order',
    subtitle:
      'Clear guidelines so every creative project between you and AKV (Arah Karya Visual) runs smoothly, transparently, and on schedule.',
    updatedAt: 'November 2026',
    sections: [
      {
        heading: 'Ordering & Brief Agreement',
        paragraphs: [
          'Every project starts with a brief discussion via WhatsApp or AKV official email. Before work starts, we confirm scope, quote, revision quota, and estimated delivery timeline.',
          'A project officially enters production once the brief is approved and the initial deposit is received.',
        ],
      },
      {
        heading: 'Pricing, 50% Deposit, and Final Payment',
        bullets: [
          'Rates displayed on the Services and Pricing sections are starting estimates and may adjust based on project complexity.',
          'Package and custom projects require a 50% upfront deposit, with the remaining 50% due upon approval of the final preview.',
          'Master high-resolution files or live website handovers are delivered once final payment is confirmed.',
        ],
      },
      {
        heading: 'Revisions Policy',
        bullets: [
          'Included revisions follow the selected package: 2 minor revisions (Starter), 3 guided revisions (SME & Creator), or milestone-based revisions (Brand & Website).',
          'Revisions cover copy, color, spacing, or layout refinements aligned with the agreed initial brief.',
          'Major direction changes outside the agreed brief or extra rounds beyond the quota may incur an additional fee and timeline adjustment.',
        ],
      },
      {
        heading: 'Turnaround Time & Client Materials',
        paragraphs: [
          'Estimated delivery times (1-10 business days depending on scope) start once the deposit and all required client assets (copy, brand assets, references) are received.',
        ],
      },
      {
        heading: 'Final Files & Usage Rights',
        paragraphs: [
          'Upon full payment, full usage rights for the final delivered work transfer to the client. AKV keeps a temporary backup for up to 30 days after delivery, so please download and store your files promptly.',
        ],
      },
      {
        heading: 'Portfolio Showcase',
        paragraphs: [
          'AKV may showcase completed work on our website and official social channels unless you request confidentiality during the initial brief.',
        ],
      },
      {
        heading: 'Cancellation',
        paragraphs: [
          'Deposits are non-refundable once research, concepting, or visual execution has begun, as they cover allocated studio time and effort.',
        ],
      },
    ],
  },
}

export default function Terms() {
  const locale = useLocale()
  const copy = CONTENT[locale] || CONTENT.id
  const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://akv.zakariamp.id').replace(/\/$/, '')

  usePageSeo({
    title: copy.seoTitle,
    description: copy.seoDesc,
    canonical: locale === 'en' ? `${siteUrl}/syarat-ketentuan?lang=en` : `${siteUrl}/syarat-ketentuan`,
    locale,
  })

  return (
    <LegalLayout
      active="terms"
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      updatedAt={copy.updatedAt}
      sections={copy.sections}
    />
  )
}
