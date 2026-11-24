import LegalLayout from '../components/LegalLayout.jsx'
import { useLocale } from '../data/i18n.js'
import { usePageSeo } from '../utils/seo.js'

const CONTENT = {
  id: {
    seoTitle: 'Kebijakan Privasi | AKV - Arah Karya Visual',
    seoDesc:
      'Kebijakan privasi AKV (Arah Karya Visual) mengenai perlindungan data klien, materi brief proyek, privasi testimoni, dan penyimpanan browser.',
    eyebrow: 'Legal & Privasi',
    title: 'Kebijakan Privasi',
    subtitle:
      'AKV (Arah Karya Visual) menghargai privasi setiap pengunjung dan klien. Halaman ini menjelaskan bagaimana informasi yang kamu bagikan kami jaga dan gunakan.',
    updatedAt: 'November 2026',
    sections: [
      {
        heading: 'Informasi yang Kami Terima',
        paragraphs: [
          'Saat kamu menghubungi AKV lewat WhatsApp atau email, kami hanya menerima informasi yang kamu kirimkan secara sukarela, seperti nama, nomor WhatsApp, alamat email, deskripsi kebutuhan proyek, dan materi pendukung (foto, CV, dokumen, atau referensi desain).',
        ],
      },
      {
        heading: 'Cara Kami Menggunakan Data',
        bullets: [
          'Menjawab pertanyaan konsultasi dan menyusun estimasi proyek.',
          'Mengerjakan desain, branding, CV, portofolio, website, video, atau animasi sesuai brief.',
          'Mengirimkan pratinjau progres, revisi, dan file final kepada klien.',
          'AKV tidak pernah menjual, menyewakan, atau membagikan data pribadi klien ke pihak ketiga di luar kebutuhan pengerjaan proyek.',
        ],
      },
      {
        heading: 'Keamanan & Masa Simpan File Proyek',
        paragraphs: [
          'Materi sensitif seperti data pribadi pada CV atau dokumen internal organisasi hanya diakses oleh tim internal AKV yang menangani proyek tersebut.',
          'File kerja disimpan sementara maksimal 30 hari setelah proyek selesai untuk mengantisipasi kebutuhan unduh ulang, dan dapat kami hapus lebih cepat atas permintaanmu.',
        ],
      },
      {
        heading: 'Privasi Testimoni & Identitas Klien',
        paragraphs: [
          'Demi menjaga privasi, nama klien pada bagian testimoni di situs AKV ditampilkan secara tersensor sebagian (contoh: Naj***, Az**) kecuali klien secara eksplisit mengizinkan penyebutan nama lengkap atau brand.',
        ],
      },
      {
        heading: 'Penyimpanan Lokal Browser',
        paragraphs: [
          'Situs akv.zakariamp.id menggunakan penyimpanan lokal browser (localStorage untuk cache konten agar halaman cepat dibuka dan sessionStorage agar animasi pembuka hanya diputar sekali per sesi). Kami tidak memasang pelacak iklan pihak ketiga yang mengganggu.',
        ],
      },
      {
        heading: 'Hak Klien atas Data',
        paragraphs: [
          'Kamu berhak meminta penghapusan arsip brief, file proyek, maupun testimoni yang pernah ditampilkan kapan saja dengan menghubungi kontak resmi AKV di bawah ini.',
        ],
      },
    ],
  },
  en: {
    seoTitle: 'Privacy Policy | AKV - Arah Karya Visual',
    seoDesc:
      'Privacy policy of AKV (Arah Karya Visual) explaining how client contact info, project briefs, testimonials, and browser storage are handled.',
    eyebrow: 'Legal & Privacy',
    title: 'Privacy Policy',
    subtitle:
      'AKV (Arah Karya Visual) respects the privacy of every visitor and client. This page outlines how we handle and protect information you share with us.',
    updatedAt: 'November 2026',
    sections: [
      {
        heading: 'Information We Receive',
        paragraphs: [
          'When you contact AKV via WhatsApp or email, we only receive the information you voluntarily provide, such as your name, contact details, project brief, and supporting files (photos, CV details, or design references).',
        ],
      },
      {
        heading: 'How We Use Information',
        bullets: [
          'Responding to consultations and preparing accurate project quotes.',
          'Delivering design, branding, CV, portfolio, website, video, or AI animation services.',
          'Sharing progress previews, revisions, and final files.',
          'We never sell, rent, or trade client data to third parties.',
        ],
      },
      {
        heading: 'Project File Retention',
        paragraphs: [
          'Sensitive materials such as personal CV details are accessed only by the AKV team handling your project. Working backups are kept for up to 30 days after handover and can be deleted earlier upon request.',
        ],
      },
      {
        heading: 'Testimonial Privacy',
        paragraphs: [
          'Client names in testimonials are partially masked (for example, Naj*** or Az**) by default to protect personal privacy unless full attribution is requested.',
        ],
      },
      {
        heading: 'Browser Local Storage',
        paragraphs: [
          'akv.zakariamp.id uses lightweight browser storage (localStorage for content caching and sessionStorage so the hero intro plays once per session).',
        ],
      },
      {
        heading: 'Your Data Rights',
        paragraphs: [
          'You may request deletion of your project files, brief archive, or displayed testimonial at any time by contacting AKV via WhatsApp or email below.',
        ],
      },
    ],
  },
}

export default function Privacy() {
  const locale = useLocale()
  const copy = CONTENT[locale] || CONTENT.id
  const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://akv.zakariamp.id').replace(/\/$/, '')

  usePageSeo({
    title: copy.seoTitle,
    description: copy.seoDesc,
    canonical: locale === 'en' ? `${siteUrl}/privasi?locale=en` : `${siteUrl}/privasi`,
    locale,
  })

  return (
    <LegalLayout
      active="privacy"
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      updatedAt={copy.updatedAt}
      sections={copy.sections}
    />
  )
}
