/**
 * i18n ringan berbasis query parameter ?lang=en (juga mendukung ?locale=en).
 * Default: id (Indonesia). Supported: id, en.
 */
import { useSyncExternalStore, useEffect } from 'react'

// ─── locale detection & reactivity ───────────────────────────────

function getLocaleFromURL() {
  const params = new URLSearchParams(window.location.search)
  const loc = params.get('lang') || params.get('locale')
  return loc === 'en' ? 'en' : 'id'
}

let currentLocale = getLocaleFromURL()
const listeners = new Set()

function emit() {
  listeners.forEach((fn) => fn())
}

function onUrlChange() {
  const next = getLocaleFromURL()
  if (next !== currentLocale) {
    currentLocale = next
    emit()
  }
}
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', onUrlChange)
}

export function getLocale() {
  return currentLocale
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Switch locale tanpa reload (?locale=en, sinkron dengan hreflang & sitemap). */
export function setLocale(loc) {
  const url = new URL(window.location.href)
  url.searchParams.delete('lang')
  if (loc === 'id') url.searchParams.delete('locale')
  else url.searchParams.set('locale', loc)
  window.history.pushState({}, '', url.toString())
  currentLocale = loc
  emit()
}

export function useLocale() {
  const locale = useSyncExternalStore(subscribe, getLocale)
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return locale
}

// ─── translations ────────────────────────────────────────────────

const strings = {
  id: {
    // SEO
    'seo.title': 'AKV - Arah Karya Visual | Jasa Desain Grafis, Branding & Website',
    'seo.description': 'AKV (Arah Karya Visual) oleh Zakaria Mujur Prasetyo & Lia Nur Khasanah. Jasa desain grafis, branding, logo, CV & portofolio, website, video, dan animasi AI.',

    // Navbar
    'nav.startProject': 'Mulai Proyek',
    'nav.openMenu': 'Buka menu',
    'nav.closeMenu': 'Tutup menu',

    // Nav links
    'navLinks': [
      { label: 'Beranda', href: '#beranda' },
      { label: 'Layanan', href: '#layanan' },
      { label: 'Paket', href: '#paket' },
      { label: 'Portofolio', href: '#portofolio' },
      { label: 'Tentang Kami', href: '#tentang' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Kontak', href: '#kontak' },
    ],

    // Hero
    'hero.eyebrow': 'Jasa kreatif · EST 2023',
    'hero.headline1': 'Arahkan Konten,',
    'hero.headline2': 'Urus Visual.',
    'hero.desc': 'AKV membantu kebutuhan desain, branding, CV dan portofolio, website, animasi AI, serta visual digital agar ide kamu tampil lebih jelas dan menarik.',
    'hero.cta1': 'Mulai Proyek',
    'hero.cta2': 'Lihat Paket Harga',
    'hero.trust': ['Konsultasi brief gratis', 'Revisi terarah', 'Harga transparan'],
    'hero.card1.title': 'Desain Grafis',
    'hero.card1.desc': 'Feed, poster & materi promosi',
    'hero.card2.title': 'Branding & Logo',
    'hero.card2.desc': 'Identitas brand yang konsisten',
    'hero.card3.title': 'Website & Portofolio',
    'hero.card3.desc': 'Tampil profesional di mana saja',
    'hero.serviceCount': '8+ layanan kreatif siap dipesan',
    'hero.paletteLabel': 'Palet warna',
    'hero.scrollLabel': 'Scroll website-nya, Cuy!',
    'hero.scrollAriaLabel': 'Gulir ke bagian tentang AKV',
    'hero.ariaLabel': 'Beranda AKV',
    'hero.pegiWaveAlt': 'Pegi, maskot AKV, melambaikan tangan',
    'hero.pegiPresentAlt': 'Pegi, maskot AKV, mempresentasikan layanan AKV',

    // About
    'about.eyebrow': 'Tentang kami',
    'about.title': 'Kenalan Dengan AKV',
    'about.p1Prefix': 'AKV adalah ',
    'about.p1Brand': 'Arah Karya Visual',
    'about.p1Suffix': ', jasa kreatif yang membantu pelajar, mahasiswa, organisasi, UMKM, dan personal brand dalam mengarahkan ide menjadi visual yang lebih rapi, jelas, dan menarik.',
    'about.p2': 'Bersama Pegi, maskot pena digital kami, AKV percaya setiap ide punya arah. Tugas kami memastikan arah itu sampai dalam bentuk visual yang tepat.',
    'about.since': 'Sejak',
    'about.pegiAlt': 'Pegi memegang tablet bertuliskan AKV',

    // Services
    'services.eyebrow': 'Layanan',
    'services.title': 'Semua Kebutuhan Visual, Satu Arah',
    'services.desc': 'Dari desain harian sampai website dan animasi, pilih layanan yang kamu butuhkan, sisanya kami urus.',
    'services.orderBtn': 'Pesan Layanan',
    'services.waPrefix': 'Halo AKV! Saya tertarik memesan layanan',
    'services.items': [
      { icon: 'palette', title: 'Desain Grafis', desc: 'Poster, banner, feed, dan kebutuhan visual harian yang rapi dan konsisten.', price: 'Mulai Rp 35rb', duration: '1-2 hari' },
      { icon: 'badge', title: 'Branding dan Logo', desc: 'Identitas visual lengkap: logo, warna, dan guideline yang siap dipakai.', price: 'Mulai Rp 150rb', duration: '3-5 hari' },
      { icon: 'file', title: 'CV dan Portofolio', desc: 'CV ATS-friendly dan portofolio yang bikin profilmu tampil menonjol.', price: 'Mulai Rp 50rb', duration: '1-3 hari' },
      { icon: 'globe', title: 'Website Portofolio', desc: 'Website personal atau bisnis yang responsif, cepat, dan mudah dikelola.', price: 'Mulai Rp 350rb', duration: '3-7 hari' },
      { icon: 'sparkles', title: 'AI Visual Branding', desc: 'Eksplorasi visual berbasis AI yang tetap diarahkan dengan sentuhan desainer.', price: 'Mulai Rp 75rb', duration: '1-3 hari' },
      { icon: 'film', title: 'Animasi AI', desc: 'Animasi pendek untuk intro brand, konten, dan presentasi yang hidup.', price: 'Mulai Rp 100rb', duration: '2-4 hari' },
      { icon: 'video', title: 'Editing Video', desc: 'Editing reels, konten pendek, dan video promosi dengan pacing yang pas.', price: 'Mulai Rp 60rb', duration: '1-3 hari' },
      { icon: 'megaphone', title: 'Konten Media Sosial', desc: 'Template feed dan konten sosial media yang terarah dan on-brand.', price: 'Mulai Rp 150rb', duration: '2-4 hari' },
    ],

    // Pricing
    'pricing.eyebrow': 'Paket & Harga',
    'pricing.title': 'Pilih Paket Sesuai Kebutuhanmu',
    'pricing.desc': 'Estimasi harga transparan sejak awal. Butuh kombinasi layanan khusus? Kamu tetap bisa konsultasi gratis dulu.',
    'pricing.note': 'Harga akhir disesuaikan dengan kompleksitas brief. DP 50% untuk proyek paket & custom.',
    'pricing.customBtn': 'Tanya Paket Custom via WhatsApp',
    'pricing.waPrefix': 'Halo AKV! Saya tertarik dengan paket',
    'pricing.waCustom': 'Halo AKV! Saya ingin konsultasi paket custom sesuai kebutuhan saya.',

    // Portfolio
    'portfolio.eyebrow': 'Portofolio',
    'portfolio.title': 'Karya Yang Sudah Kami Arahkan',
    'portfolio.desc': 'Kumpulan project yang sudah kami kerjakan bersama klien dari berbagai bidang.',
    'portfolio.filterAll': 'Semua',
    'portfolio.viewDetail': 'Lihat Detail',
    'portfolio.viewDetailAria': 'Lihat detail',
    'portfolio.modalClose': 'Tutup pratinjau',
    'portfolio.modalOrder': 'Pesan Karya Seperti Ini',
    'portfolio.modalPlaceholderNote': 'Gambar karya sedang disiapkan. Hubungi kami untuk melihat sampel terbaru lewat WhatsApp.',
    'portfolio.waMsg': 'Halo AKV! Saya tertarik dengan project',
    'portfolio.filterAriaLabel': 'Filter kategori portofolio',
    'portfolio.filters': ['Semua', 'Desain', 'Branding', 'CV dan Portofolio', 'Website', 'Animasi'],
    'portfolio.items': [
      { id: 1, title: 'Feed Instagram UMKM', category: 'Desain' },
      { id: 2, title: 'Logo & Brand Kit', category: 'Branding' },
      { id: 3, title: 'CV Kreatif Mahasiswa', category: 'CV dan Portofolio' },
      { id: 4, title: 'Website Portofolio Personal', category: 'Website' },
      { id: 5, title: 'Animasi Intro Brand', category: 'Animasi' },
      { id: 6, title: 'Poster Event Kampus', category: 'Desain' },
      { id: 7, title: 'Rebranding Organisasi', category: 'Branding' },
      { id: 8, title: 'Landing Page UMKM', category: 'Website' },
    ],

    // Process
    'process.eyebrow': 'Proses kerja',
    'process.title': 'Lima Langkah Menuju Visual',
    'process.desc': 'Alur kerja yang jelas supaya kamu selalu tahu project-mu ada di tahap mana.',
    'process.steps': [
      { num: '01', title: 'Diskusi dan Brief', desc: 'Ceritakan kebutuhan dan tujuanmu, kami dengarkan dan catat detailnya.' },
      { num: '02', title: 'Riset dan Konsep', desc: 'Kami riset referensi dan susun arah visual yang paling pas.' },
      { num: '03', title: 'Proses Visual', desc: 'Eksekusi desain dimulai, progres selalu kami komunikasikan.' },
      { num: '04', title: 'Revisi', desc: 'Masukanmu kami rapikan sampai hasilnya benar-benar sesuai.' },
      { num: '05', title: 'Final dan Delivery', desc: 'File final dikirim lengkap dengan format yang siap dipakai.' },
    ],

    // Why AKV
    'why.eyebrow': 'Kenapa AKV?',
    'why.title': 'Beda Dari Yang Lain',
    'why.desc': 'Empat hal yang selalu kami jaga di setiap project, apa pun skalanya.',
    'why.benefits': [
      { icon: 'compass', title: 'Strategi Visual', desc: 'Setiap karya dimulai dari arah yang jelas, bukan sekadar bagus dilihat.' },
      { icon: 'gem', title: 'Desain Berkualitas', desc: 'Detail dirapikan, hierarki dijaga, hasil akhir konsisten dengan brand.' },
      { icon: 'chat', title: 'Komunikasi Jelas', desc: 'Progres transparan dan bahasa yang mudah, tanpa jargon berbelit.' },
      { icon: 'zap', title: 'Proses Efisien', desc: 'Alur kerja ringkas sehingga project selesai tepat waktu.' },
    ],

    // Testimonials
    'testimonials.eyebrow': 'Testimoni',
    'testimonials.title': 'Kata Mereka Yang Sudah Dibantu',
    'testimonials.desc': 'Cerita langsung dari klien AKV.',

    // FAQ
    'faq.eyebrow': 'FAQ',
    'faq.title': 'Pertanyaan Yang Sering Ditanyakan',
    'faq.desc': 'Jawaban cepat seputar pemesanan, DP, revisi, estimasi waktu, dan file akhir sebelum kamu mulai proyek.',
    'faq.ctaText': 'Masih ada pertanyaan lain?',
    'faq.ctaBtn': 'Tanya langsung via WhatsApp',

    // Floating WA
    'floatingWa.label': 'Konsultasi WA',
    'floatingWa.shortLabel': 'Chat AKV',
    'floatingWa.ariaLabel': 'Konsultasi proyek lewat WhatsApp AKV',

    // CTA
    'cta.title': 'Punya Ide Yang Ingin Divisualkan?',
    'cta.desc': 'Ceritakan kebutuhanmu, mulai project bersama AKV.',
    'cta.btn1': 'Mulai Proyek',
    'cta.btn2': 'Hubungi AKV',
    'cta.pegiAlt': 'Pegi memegang megafon, mengajak memulai project bersama AKV',

    // Footer
    'footer.tagline': 'Arahkan Konten, Urus Visual.',
    'footer.brandDesc': 'AKV, Arah Karya Visual. Jasa kreatif untuk pelajar, mahasiswa, organisasi, UMKM, dan personal brand. Berdiri sejak 2023.',
    'footer.navCol': 'Navigasi',
    'footer.servicesCol': 'Layanan',
    'footer.socialCol': 'Media Sosial',
    'footer.copyright': 'Semua hak dilindungi.',
    'footer.admin': 'Area Pengelola',

    // Error / 404
    'error.eyebrow': 'Terjadi Kesalahan',
    'error.title1': 'Waduh, ada yang ',
    'error.title2': 'error.',
    'error.desc': 'Halaman mengalami masalah. Coba muat ulang atau kembali ke beranda.',
    'error.reload': 'Muat Ulang',
    'error.home': 'Ke Beranda',

    'notFound.pageTitle': '404 - Halaman Tidak Ditemukan | AKV',
    'notFound.eyebrow': 'Error 404',
    'notFound.title1': 'Waduh, halamannya ',
    'notFound.title2': 'tidak ketemu.',
    'notFound.desc': 'Halaman atau alamat yang kamu buka tidak ditemukan di situs AKV. Yuk balik ke beranda!',
    'notFound.btn': 'Kembali ke Beranda',
    'notFound.pegiAlt': 'Pegi menunjuk, maskot AKV',

    // WhatsApp default
    'wa.default': 'Halo AKV! Saya ingin konsultasi dan mulai proyek.',

    // Language switcher
    'lang.switch': 'EN',
  },

  en: {
    // SEO
    'seo.title': 'AKV - Arah Karya Visual | Graphic Design, Branding & Website Studio',
    'seo.description': 'AKV (Arah Karya Visual) by Zakaria Mujur Prasetyo & Lia Nur Khasanah. Graphic design, branding & logo, CV & portfolio, websites, video editing, and AI animation.',

    // Navbar
    'nav.startProject': 'Start Project',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',

    // Nav links
    'navLinks': [
      { label: 'Home', href: '#beranda' },
      { label: 'Services', href: '#layanan' },
      { label: 'Pricing', href: '#paket' },
      { label: 'Portfolio', href: '#portofolio' },
      { label: 'About Us', href: '#tentang' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact', href: '#kontak' },
    ],

    // Hero
    'hero.eyebrow': 'Creative services · EST 2023',
    'hero.headline1': 'Direct Your Content,',
    'hero.headline2': 'We Handle the Visuals.',
    'hero.desc': 'AKV helps with design, branding, CV & portfolio, websites, AI animation, and digital visuals so your ideas come across clear and compelling.',
    'hero.cta1': 'Start Project',
    'hero.cta2': 'See Pricing',
    'hero.trust': ['Free brief consultation', 'Guided revisions', 'Transparent pricing'],
    'hero.card1.title': 'Graphic Design',
    'hero.card1.desc': 'Feed, poster & promo materials',
    'hero.card2.title': 'Branding & Logo',
    'hero.card2.desc': 'Consistent brand identity',
    'hero.card3.title': 'Website & Portfolio',
    'hero.card3.desc': 'Look professional anywhere',
    'hero.serviceCount': '8+ creative services ready to book',
    'hero.paletteLabel': 'Color palette',
    'hero.scrollLabel': 'Scroll down!',
    'hero.scrollAriaLabel': 'Scroll to about section',
    'hero.ariaLabel': 'AKV Home',
    'hero.pegiWaveAlt': 'Pegi, AKV mascot, waving hello',
    'hero.pegiPresentAlt': 'Pegi, AKV mascot, presenting AKV services',

    // About
    'about.eyebrow': 'About us',
    'about.title': 'Meet AKV',
    'about.p1Prefix': 'AKV stands for ',
    'about.p1Brand': 'Arah Karya Visual',
    'about.p1Suffix': ' (Directed Creative Visual), a creative service helping students, organizations, SMEs, and personal brands turn ideas into cleaner, clearer, and more compelling visuals.',
    'about.p2': 'Together with Pegi, our digital pen mascot, AKV believes every idea has a direction. Our job is to make sure it arrives in the right visual form.',
    'about.since': 'Since',
    'about.pegiAlt': 'Pegi holding a tablet with AKV written on it',

    // Services
    'services.eyebrow': 'Services',
    'services.title': 'All Your Visual Needs, One Direction',
    'services.desc': 'From daily design to websites and animation, pick what you need, we handle the rest.',
    'services.orderBtn': 'Order Service',
    'services.waPrefix': 'Hi AKV! I would like to order',
    'services.items': [
      { icon: 'palette', title: 'Graphic Design', desc: 'Posters, banners, feeds, and daily visuals that are clean and consistent.', price: 'From IDR 35k', duration: '1-2 days' },
      { icon: 'badge', title: 'Branding & Logo', desc: 'Complete visual identity: logo, colors, and guidelines ready to use.', price: 'From IDR 150k', duration: '3-5 days' },
      { icon: 'file', title: 'CV & Portfolio', desc: 'ATS-friendly CVs and portfolios that make your profile stand out.', price: 'From IDR 50k', duration: '1-3 days' },
      { icon: 'globe', title: 'Portfolio Website', desc: 'Personal or business website that is responsive, fast, and easy to manage.', price: 'From IDR 350k', duration: '3-7 days' },
      { icon: 'sparkles', title: 'AI Visual Branding', desc: 'AI-powered visual exploration guided by a designer\'s touch.', price: 'From IDR 75k', duration: '1-3 days' },
      { icon: 'film', title: 'AI Animation', desc: 'Short animations for brand intros, content, and lively presentations.', price: 'From IDR 100k', duration: '2-4 days' },
      { icon: 'video', title: 'Video Editing', desc: 'Reels, short content, and promo videos with the right pacing.', price: 'From IDR 60k', duration: '1-3 days' },
      { icon: 'megaphone', title: 'Social Media Content', desc: 'Feed templates and social media content that is directed and on-brand.', price: 'From IDR 150k', duration: '2-4 days' },
    ],

    // Pricing
    'pricing.eyebrow': 'Packages & Pricing',
    'pricing.title': 'Pick the Package That Fits You',
    'pricing.desc': 'Transparent starting rates from day one. Need a tailored bundle? Reach out for a free consultation.',
    'pricing.note': 'Final quote depends on brief scope. 50% deposit for package and custom projects.',
    'pricing.customBtn': 'Ask for Custom Quote on WhatsApp',
    'pricing.waPrefix': 'Hi AKV! I am interested in the',
    'pricing.waCustom': 'Hi AKV! I would like to discuss a custom package for my project.',
    'pricing.items': [
      {
        name: 'Starter',
        badge: 'Students & Personal',
        price: 'From IDR 50k',
        unit: 'per project',
        desc: 'Ideal for single deliverables that are sharp, structured, and delivered fast.',
        featured: false,
        ctaLabel: 'Order Starter',
        features: [
          'Choose: Single graphic design, ATS-friendly CV, or compact portfolio',
          'Estimated turnaround 1-3 business days',
          '2x free minor revisions',
          'High-resolution ready-to-use files (PNG, PDF, or WebP)',
          'Free brief consultation via WhatsApp',
        ],
      },
      {
        name: 'SME & Creator',
        badge: 'Most Popular',
        price: 'From IDR 250k',
        unit: 'per package',
        desc: 'Built for growing businesses and creators seeking consistent brand visuals.',
        featured: true,
        ctaLabel: 'Choose SME & Creator',
        features: [
          'Social media content pack, starter branding, or promo video editing',
          'Estimated turnaround 3-5 business days',
          '3x guided revisions until it fits',
          'Ready-to-post assets plus editable source files where applicable',
          'Cohesive visual concept and brand color direction',
        ],
      },
      {
        name: 'Brand & Website',
        badge: 'Full Scale',
        price: 'From IDR 500k',
        unit: 'per project',
        desc: 'End-to-end visual identity and responsive website built to convert.',
        featured: false,
        ctaLabel: 'Discuss Custom Scope',
        features: [
          'Full logo & brand guidelines and/or responsive SEO-ready website',
          'Estimated turnaround 5-10 business days',
          'Milestone-based collaborative revisions',
          'Complete master files plus online launch assistance',
          'Post-handover initial support',
        ],
      },
    ],

    // Portfolio
    'portfolio.eyebrow': 'Portfolio',
    'portfolio.title': 'Work We\'ve Directed',
    'portfolio.desc': 'A collection of projects we\'ve crafted with clients across various fields.',
    'portfolio.filterAll': 'All',
    'portfolio.viewDetail': 'View Detail',
    'portfolio.viewDetailAria': 'View detail',
    'portfolio.modalClose': 'Close preview',
    'portfolio.modalOrder': 'Order Something Similar',
    'portfolio.modalPlaceholderNote': 'Project preview image is being prepared. Chat with us on WhatsApp to see recent samples.',
    'portfolio.waMsg': 'Hi AKV! I\'m interested in the project',
    'portfolio.filterAriaLabel': 'Filter portfolio categories',
    'portfolio.filters': ['All', 'Design', 'Branding', 'CV & Portfolio', 'Website', 'Animation'],
    'portfolio.items': [
      { id: 1, title: 'SME Instagram Feed', category: 'Design', description: 'Consistent promotional feed and story set crafted for clear product messaging.' },
      { id: 2, title: 'Logo & Brand Kit', category: 'Branding', description: 'Complete visual identity including primary logo, color system, typography, and usage rules.' },
      { id: 3, title: 'Student Creative CV', category: 'CV & Portfolio', description: 'ATS-friendly CV and portfolio layout highlighting experience and key achievements.' },
      { id: 4, title: 'Personal Portfolio Website', category: 'Website', description: 'Fast, responsive personal profile site built with clean SEO structure.' },
      { id: 5, title: 'Brand Intro Animation', category: 'Animation', description: 'Short motion and AI-assisted opener for reels, decks, and brand videos.' },
      { id: 6, title: 'Campus Event Poster', category: 'Design', description: 'Event publication artwork with clear visual hierarchy for both print and social media.' },
      { id: 7, title: 'Organization Rebranding', category: 'Branding', description: 'Visual refresh helping an organization look cohesive across every channel.' },
      { id: 8, title: 'SME Landing Page', category: 'Website', description: 'Focused, mobile-friendly product and service showcase wired directly to WhatsApp.' },
    ],

    // Process
    'process.eyebrow': 'Our process',
    'process.title': 'Five Steps to the Final Visual',
    'process.desc': 'A clear workflow so you always know where your project stands.',
    'process.steps': [
      { num: '01', title: 'Discussion & Brief', desc: 'Tell us your needs and goals, we listen and note the details.' },
      { num: '02', title: 'Research & Concept', desc: 'We research references and craft the most fitting visual direction.' },
      { num: '03', title: 'Visual Execution', desc: 'Design begins, and we keep you updated on progress.' },
      { num: '04', title: 'Revision', desc: 'Your feedback is refined until the result is exactly right.' },
      { num: '05', title: 'Final & Delivery', desc: 'Final files delivered in formats ready to use.' },
    ],

    // Why AKV
    'why.eyebrow': 'Why AKV',
    'why.title': 'Not Just Done, But Directed',
    'why.desc': 'Four things we uphold in every project, no matter the scale.',
    'why.benefits': [
      { icon: 'compass', title: 'Visual Strategy', desc: 'Every piece starts with a clear direction, not just looks.' },
      { icon: 'gem', title: 'Quality Design', desc: 'Details polished, hierarchy maintained, final result on-brand.' },
      { icon: 'chat', title: 'Clear Communication', desc: 'Transparent progress and simple language, no confusing jargon.' },
      { icon: 'zap', title: 'Efficient Process', desc: 'Streamlined workflow so projects finish on time.' },
    ],

    // Testimonials
    'testimonials.eyebrow': 'Testimonials',
    'testimonials.title': 'What Our Clients Say',
    'testimonials.desc': 'Stories from AKV clients. Names are partially masked for privacy.',

    // FAQ
    'faq.eyebrow': 'FAQ',
    'faq.title': 'Frequently Asked Questions',
    'faq.desc': 'Quick answers about ordering, deposits, revisions, turnaround time, and final file delivery.',
    'faq.ctaText': 'Still have questions?',
    'faq.ctaBtn': 'Ask directly on WhatsApp',
    'faq.items': [
      {
        question: 'How do I order a service from AKV?',
        answer: 'Click the order button on any service or package to chat directly on WhatsApp. Share your brief, references, and target deadline, and we will send a clear quote and timeline before starting.',
      },
      {
        question: 'How does payment work? Is a deposit available?',
        answer: 'Yes. For package and custom projects, work begins after a 50% deposit, with the remaining balance due once you approve the final preview before master file delivery.',
      },
      {
        question: 'How many revisions are included?',
        answer: 'Starter includes 2 minor revisions, SME & Creator includes 3 guided revisions, and Brand & Website includes milestone-based revisions covering copy, color, or layout refinements within the initial brief.',
      },
      {
        question: 'How long does delivery usually take?',
        answer: 'Single graphics, CVs, and short video edits usually take 1-3 business days. Branding and content bundles take 3-5 business days, while websites take 3-10 business days depending on scope.',
      },
      {
        question: 'What file formats will I receive?',
        answer: 'You receive high-resolution ready-to-use files (PNG, PDF, WebP, or MP4). For branding, SME, and website packages, editable files or source code are included as agreed.',
      },
      {
        question: 'Do you work with students, SMEs, and urgent deadlines?',
        answer: 'Yes, we regularly support students, campus organizations, SMEs, and personal brands with friendly rates. Let us know your deadline during the brief chat so we can check slot availability.',
      },
    ],

    // Floating WA
    'floatingWa.label': 'WhatsApp Chat',
    'floatingWa.shortLabel': 'Chat AKV',
    'floatingWa.ariaLabel': 'Start a consultation on AKV WhatsApp',

    // CTA
    'cta.title': 'Have an Idea to Visualize?',
    'cta.desc': 'Tell us what you need, start a project with AKV.',
    'cta.btn1': 'Start Project',
    'cta.btn2': 'Contact AKV',
    'cta.pegiAlt': 'Pegi holding a megaphone, inviting you to start a project with AKV',

    // Footer
    'footer.tagline': 'Direct Your Content, We Handle the Visuals.',
    'footer.brandDesc': 'AKV, Arah Karya Visual. Creative services for students, organizations, SMEs, and personal brands. Established 2023.',
    'footer.navCol': 'Navigation',
    'footer.servicesCol': 'Services',
    'footer.socialCol': 'Social Media',
    'footer.copyright': 'All rights reserved.',
    'footer.admin': 'Admin Area',

    // Error / 404
    'error.eyebrow': 'Something Went Wrong',
    'error.title1': 'Oops, something ',
    'error.title2': 'broke.',
    'error.desc': 'The page ran into a problem. Try reloading or go back to the homepage.',
    'error.reload': 'Reload',
    'error.home': 'Go Home',

    'notFound.pageTitle': '404 - Page Not Found | AKV',
    'notFound.eyebrow': 'Error 404',
    'notFound.title1': 'Oops, this page ',
    'notFound.title2': 'doesn\'t exist.',
    'notFound.desc': 'The page or URL you visited was not found on AKV\'s site. Let\'s head back home!',
    'notFound.btn': 'Back to Home',
    'notFound.pegiAlt': 'Pegi pointing, AKV mascot',

    // WhatsApp default
    'wa.default': 'Hi AKV! I would like to consult and start a project.',

    // Language switcher
    'lang.switch': 'ID',
  },
}

/** Get translated string or array by key. */
export function t(locale, key) {
  return strings[locale]?.[key] ?? strings.id[key] ?? key
}
