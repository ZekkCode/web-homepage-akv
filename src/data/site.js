/**
 * ====================================================================
 *  KONTEN & KONTAK — DATA BAWAAN SITUS AKV
 *  Semua teks, link kontak, layanan, paket harga, portofolio, FAQ,
 *  dan testimoni diatur dari file ini. Perubahan via dashboard admin
 *  disimpan ke Supabase (dengan cache localStorage) dan menimpa nilai ini.
 * ====================================================================
 */

export const contact = {
  whatsapp: '62881081772005',
  instagram: 'https://instagram.com/akuvisual.id',
  tiktok: 'https://tiktok.com/@akuvisual.id',
  email: 'halo@akv.zakariamp.id',
}

export const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Layanan', href: '#layanan' },
  { label: 'Paket', href: '#paket' },
  { label: 'Portofolio', href: '#portofolio' },
  { label: 'Tentang Kami', href: '#tentang' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Kontak', href: '#kontak' },
]

export const services = [
  {
    icon: 'palette',
    title: 'Desain Grafis',
    desc: 'Poster, banner, feed, dan kebutuhan visual harian yang rapi dan konsisten.',
    price: 'Mulai Rp 35rb',
    duration: '1-2 hari',
  },
  {
    icon: 'badge',
    title: 'Branding dan Logo',
    desc: 'Identitas visual lengkap: logo, warna, dan guideline yang siap dipakai.',
    price: 'Mulai Rp 150rb',
    duration: '3-5 hari',
  },
  {
    icon: 'file',
    title: 'CV dan Portofolio',
    desc: 'CV ATS-friendly dan portofolio yang bikin profilmu tampil menonjol.',
    price: 'Mulai Rp 50rb',
    duration: '1-3 hari',
  },
  {
    icon: 'globe',
    title: 'Website Portofolio',
    desc: 'Website personal atau bisnis yang responsif, cepat, dan mudah dikelola.',
    price: 'Mulai Rp 350rb',
    duration: '3-7 hari',
  },
  {
    icon: 'sparkles',
    title: 'AI Visual Branding',
    desc: 'Eksplorasi visual berbasis AI yang tetap diarahkan dengan sentuhan desainer.',
    price: 'Mulai Rp 75rb',
    duration: '1-3 hari',
  },
  {
    icon: 'film',
    title: 'Animasi AI',
    desc: 'Animasi pendek untuk intro brand, konten, dan presentasi yang hidup.',
    price: 'Mulai Rp 100rb',
    duration: '2-4 hari',
  },
  {
    icon: 'video',
    title: 'Editing Video',
    desc: 'Editing reels, konten pendek, dan video promosi dengan pacing yang pas.',
    price: 'Mulai Rp 60rb',
    duration: '1-3 hari',
  },
  {
    icon: 'megaphone',
    title: 'Konten Media Sosial',
    desc: 'Template feed dan konten sosial media yang terarah dan on-brand.',
    price: 'Mulai Rp 150rb',
    duration: '2-4 hari',
  },
]

export const pricingPackages = [
  {
    name: 'Starter',
    badge: 'Pelajar & Mahasiswa',
    price: 'Mulai Rp 50rb',
    unit: 'per proyek',
    desc: 'Cocok untuk kebutuhan satuan yang rapi, jelas, dan cepat siap pakai.',
    featured: false,
    ctaLabel: 'Pesan Paket Starter',
    features: [
      'Pilih: Desain Grafis satuan, CV ATS-friendly, atau Portofolio ringkas',
      'Estimasi pengerjaan 1-3 hari kerja',
      '2x revisi minor gratis',
      'File final resolusi tinggi siap pakai (PNG, PDF, atau WebP)',
      'Konsultasi brief gratis via WhatsApp',
    ],
  },
  {
    name: 'UMKM & Kreator',
    badge: 'Paling Diminati',
    price: 'Mulai Rp 250rb',
    unit: 'per paket',
    desc: 'Pas untuk bisnis dan konten rutin agar tampilan brand tampil konsisten.',
    featured: true,
    ctaLabel: 'Pilih UMKM & Kreator',
    features: [
      'Paket desain konten media sosial, branding awal, atau editing video promosi',
      'Estimasi pengerjaan 3-5 hari kerja',
      '3x revisi terarah sampai hasil sesuai',
      'File siap unggah plus file editable/source sesuai kebutuhan',
      'Arahan konsep visual dan palet warna yang seragam',
    ],
  },
  {
    name: 'Brand & Website',
    badge: 'Skala Penuh',
    price: 'Mulai Rp 500rb',
    unit: 'per proyek',
    desc: 'Solusi menyeluruh untuk identitas brand lengkap dan website siap jualan.',
    featured: false,
    ctaLabel: 'Diskusi Paket Custom',
    features: [
      'Logo dan brand guideline lengkap dan/atau website responsif SEO-ready',
      'Estimasi pengerjaan 5-10 hari kerja',
      'Revisi bertahap per tahap progres',
      'File master lengkap plus bantuan publikasi online',
      'Dukungan penyesuaian awal setelah proyek selesai',
    ],
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
  {
    id: 1,
    title: 'Feed Instagram UMKM',
    category: 'Desain',
    image: null,
    tone: 'from-akv-blue to-akv-royal',
    description: 'Rangkaian desain feed dan story promosi dengan grid rapi dan pesan produk yang mudah dibaca.',
  },
  {
    id: 2,
    title: 'Logo & Brand Kit',
    category: 'Branding',
    image: null,
    tone: 'from-akv-royal to-akv-navy',
    description: 'Identitas visual lengkap mencakup logo utama, variasi warna, tipografi, dan panduan penggunaan.',
  },
  {
    id: 3,
    title: 'CV Kreatif Mahasiswa',
    category: 'CV dan Portofolio',
    image: null,
    tone: 'from-akv-sky to-akv-blue',
    description: 'Tata letak CV ATS-friendly dan portofolio yang menonjolkan pengalaman serta pencapaian utama.',
  },
  {
    id: 4,
    title: 'Website Portofolio Personal',
    category: 'Website',
    image: null,
    tone: 'from-akv-blue to-akv-sky',
    description: 'Website profil responsif dan cepat untuk personal brand dengan struktur ramah mesin pencari.',
  },
  {
    id: 5,
    title: 'Animasi Intro Brand',
    category: 'Animasi',
    image: null,
    tone: 'from-akv-navy to-akv-blue',
    description: 'Animasi pembuka singkat berbasis AI dan motion untuk konten reels, presentasi, dan video profil.',
  },
  {
    id: 6,
    title: 'Poster Event Kampus',
    category: 'Desain',
    image: null,
    tone: 'from-akv-royal to-akv-sky',
    description: 'Materi publikasi acara dengan hierarki informasi jelas untuk cetak maupun media sosial.',
  },
  {
    id: 7,
    title: 'Rebranding Organisasi',
    category: 'Branding',
    image: null,
    tone: 'from-akv-blue to-akv-navy',
    description: 'Pembaruan karakter visual organisasi agar lebih segar, terarah, dan konsisten di setiap kanal.',
  },
  {
    id: 8,
    title: 'Landing Page UMKM',
    category: 'Website',
    image: null,
    tone: 'from-akv-sky to-akv-royal',
    description: 'Halaman penawaran produk dan jasa yang ringkas, mobile-friendly, dan terhubung ke WhatsApp.',
  },
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

/** Testimoni: nama klien disensor sebagian untuk menjaga privasi. */
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

export const faqs = [
  {
    question: 'Bagaimana cara memesan layanan di AKV?',
    answer:
      'Klik tombol pesan pada layanan atau paket yang kamu butuhkan untuk langsung terhubung ke WhatsApp AKV. Ceritakan kebutuhan singkat, referensi, dan deadline, lalu kami kirimkan estimasi biaya dan jadwal pengerjaan sebelum proyek dimulai.',
  },
  {
    question: 'Bagaimana sistem pembayarannya, apakah bisa DP dulu?',
    answer:
      'Bisa. Untuk proyek paket maupun custom, pengerjaan dimulai setelah DP 50% dan pelunasan dilakukan setelah pratinjau hasil final disetujui sebelum pengiriman file master. Untuk pesanan satuan skala kecil, pembayaran dilakukan sesuai kesepakatan di awal.',
  },
  {
    question: 'Berapa kali revisi yang didapat di setiap proyek?',
    answer:
      'Paket Starter mendapat 2x revisi minor, paket UMKM dan Kreator mendapat 3x revisi terarah, dan paket Brand serta Website menggunakan revisi bertahap per milestone. Revisi meliputi penyesuaian teks, warna, atau tata letak sesuai brief awal.',
  },
  {
    question: 'Berapa lama estimasi waktu pengerjaan?',
    answer:
      'Desain grafis satuan, CV, dan editing video pendek umumnya selesai dalam 1-3 hari kerja. Branding dan paket konten memerlukan 3-5 hari kerja, sedangkan website portofolio atau landing page UMKM sekitar 3-10 hari kerja tergantung kelengkapan materi.',
  },
  {
    question: 'Format file apa saja yang akan saya terima di akhir?',
    answer:
      'Semua hasil dikirim dalam format siap pakai resolusi tinggi seperti PNG, PDF, WebP, atau MP4. Untuk paket branding, UMKM, dan website, kamu juga mendapatkan file editable atau kode sumber sesuai kesepakatan paket.',
  },
  {
    question: 'Apakah AKV melayani proyek pelajar, UMKM, dan deadline mendadak?',
    answer:
      'Ya, AKV memang fokus membantu pelajar, mahasiswa, organisasi, UMKM, dan personal brand dengan biaya yang ramah. Jika butuh pengerjaan lebih cepat, beri tahu tanggal deadlinemu saat diskusi brief agar kami cek ketersediaan slot.',
  },
]

export const teamMembers = [
  {
    name: 'Zakaria Mujur Prasetyo',
    role: 'Owner & Founder · Visual Designer',
    url: 'https://zakariamp.id',
  },
  {
    name: 'Lia Nur Khasanah',
    role: 'Co-Founder · Creative Director',
    url: 'https://lianurkhasanah.my.id',
  },
]
