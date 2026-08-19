/**
 * ====================================================================
 *  KONTEN & KONTAK — DATA BAWAAN SITUS AKV
 *  Semua teks, link kontak, layanan, portofolio, dan testimoni
 *  situs diatur dari file ini. Perubahan via dashboard admin
 *  disimpan di localStorage dan menimpa nilai di bawah.
 * ====================================================================
 */

export const contact = {
  whatsapp: '6281234567890',
  instagram: 'https://instagram.com/akuvisual.id',
  tiktok: 'https://tiktok.com/@akuvisual.id',
  email: 'halo@akv.zakariamp.id',
}


export const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Layanan', href: '#layanan' },
  { label: 'Portofolio', href: '#portofolio' },
  { label: 'Proses', href: '#proses' },
  { label: 'Tentang Kami', href: '#tentang' },
  { label: 'Kontak', href: '#kontak' },
]

export const services = [
  {
    icon: 'palette',
    title: 'Desain Grafis',
    desc: 'Poster, banner, feed, dan kebutuhan visual harian yang rapi dan konsisten.',
  },
  {
    icon: 'badge',
    title: 'Branding dan Logo',
    desc: 'Identitas visual lengkap: logo, warna, dan guideline yang siap dipakai.',
  },
  {
    icon: 'file',
    title: 'CV dan Portofolio',
    desc: 'CV ATS-friendly dan portofolio yang bikin profilmu tampil menonjol.',
  },
  {
    icon: 'globe',
    title: 'Website Portofolio',
    desc: 'Website personal atau bisnis yang responsif, cepat, dan mudah dikelola.',
  },
  {
    icon: 'sparkles',
    title: 'AI Visual Branding',
    desc: 'Eksplorasi visual berbasis AI yang tetap diarahkan dengan sentuhan desainer.',
  },
  {
    icon: 'film',
    title: 'Animasi AI',
    desc: 'Animasi pendek untuk intro brand, konten, dan presentasi yang hidup.',
  },
  {
    icon: 'video',
    title: 'Editing Video',
    desc: 'Editing reels, konten pendek, dan video promosi dengan pacing yang pas.',
  },
  {
    icon: 'megaphone',
    title: 'Konten Media Sosial',
    desc: 'Template feed dan konten sosial media yang terarah dan on-brand.',
  },
]

export const portfolioFilters = [
  'Semua',
  'Desain',
  'Branding',
  'CV dan Portofolio',
  'Website',
  'Animasi',
]

export const portfolioItems = [
  { id: 1, title: 'Feed Instagram UMKM', category: 'Desain', image: null, tone: 'from-akv-blue to-akv-royal' },
  { id: 2, title: 'Logo & Brand Kit', category: 'Branding', image: null, tone: 'from-akv-royal to-akv-navy' },
  { id: 3, title: 'CV Kreatif Mahasiswa', category: 'CV dan Portofolio', image: null, tone: 'from-akv-sky to-akv-blue' },
  { id: 4, title: 'Website Portofolio Personal', category: 'Website', image: null, tone: 'from-akv-blue to-akv-sky' },
  { id: 5, title: 'Animasi Intro Brand', category: 'Animasi', image: null, tone: 'from-akv-navy to-akv-blue' },
  { id: 6, title: 'Poster Event Kampus', category: 'Desain', image: null, tone: 'from-akv-royal to-akv-sky' },
  { id: 7, title: 'Rebranding Organisasi', category: 'Branding', image: null, tone: 'from-akv-blue to-akv-navy' },
  { id: 8, title: 'Landing Page UMKM', category: 'Website', image: null, tone: 'from-akv-sky to-akv-royal' },
]

export const processSteps = [
  {
    num: '01',
    title: 'Diskusi dan Brief',
    desc: 'Ceritakan kebutuhan dan tujuanmu, kami dengarkan dan catat detailnya.',
  },
  {
    num: '02',
    title: 'Riset dan Konsep',
    desc: 'Kami riset referensi dan susun arah visual yang paling pas.',
  },
  {
    num: '03',
    title: 'Proses Visual',
    desc: 'Eksekusi desain dimulai, progres selalu kami komunikasikan.',
  },
  {
    num: '04',
    title: 'Revisi',
    desc: 'Masukanmu kami rapikan sampai hasilnya benar-benar sesuai.',
  },
  {
    num: '05',
    title: 'Final dan Delivery',
    desc: 'File final dikirim lengkap dengan format yang siap dipakai.',
  },
]

export const benefits = [
  {
    icon: 'compass',
    title: 'Strategi Visual',
    desc: 'Setiap karya dimulai dari arah yang jelas, bukan sekadar bagus dilihat.',
  },
  {
    icon: 'gem',
    title: 'Desain Berkualitas',
    desc: 'Detail dirapikan, hierarki dijaga, hasil akhir konsisten dengan brand.',
  },
  {
    icon: 'chat',
    title: 'Komunikasi Jelas',
    desc: 'Progres transparan dan bahasa yang mudah, tanpa jargon berbelit.',
  },
  {
    icon: 'zap',
    title: 'Proses Efisien',
    desc: 'Alur kerja ringkas sehingga project selesai tepat waktu.',
  },
]

/** Testimoni — nama klien disensor sebagian untuk menjaga privasi. */
export const testimonials = [
  {
    name: 'Naj***',
    role: 'Mahasiswa',
    quote:
      'CV sama portofolio aku dirapikan sampai enak banget dilihat. Pas interview, desainnya sempat dipuji HRD.',
  },
  {
    name: 'Az**',
    role: 'Pemilik UMKM',
    quote:
      'Feed toko jadi konsisten satu gaya. Pelan-pelan makin banyak yang nanya produk lewat Instagram.',
  },
  {
    name: 'Ra***',
    role: 'Ketua Organisasi',
    quote:
      'Desain buat event kami selalu selesai sebelum deadline. Komunikasinya enak, revisinya juga cepat.',
  },
  {
    name: 'Di**',
    role: 'Personal Brand',
    quote:
      'Website portofolioku cepat jadi, rapi di HP maupun laptop, dan gampang aku update sendiri.',
  },
  {
    name: 'Fa***',
    role: 'Panitia Event Kampus',
    quote:
      'Poster dan feed event langsung kelihatan profesional. Diajak diskusi konsep juga nyambung.',
  },
  {
    name: 'Sal**',
    role: 'Content Creator',
    quote:
      'Editing video dan template konten dari AKV bikin jadwal posting aku jauh lebih ringan.',
  },
]

export const teamMembers = [
  {
    name: 'Lia Nur Khasanah',
    role: 'Founder · Creative Director',
    url: 'https://lianurkhasanah.my.id',
  },
  {
    name: 'Zakaria Mujur Prasetyo',
    role: 'Co-Founder · Visual Designer',
    url: 'https://zdekktech.biz.id/about',
  },
]
