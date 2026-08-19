/**
 * i18n ringan berbasis query parameter ?locale=en
 * Default: id (Indonesia). Supported: id, en.
 *
 * Pemakaian:
 *   import { useLocale, t } from '../data/i18n.js'
 *   const locale = useLocale()       // 'id' | 'en'
 *   t(locale, 'hero.eyebrow')        // string terjemahan
 *
 * ponytail: saat butuh >2 bahasa, pindahkan ke file per-locale dan lazy-load.
 */
import { useSyncExternalStore, useEffect } from 'react'

// ─── locale detection & reactivity ───────────────────────────────

function getLocaleFromURL() {
  const params = new URLSearchParams(window.location.search)
  const loc = params.get('locale')
  return loc === 'en' ? 'en' : 'id'
}

let currentLocale = getLocaleFromURL()
const listeners = new Set()

function emit() { listeners.forEach((fn) => fn()) }

/** Update locale saat URL berubah (popstate / manual) */
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

export function getLocale() { return currentLocale }

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Switch locale — push ke URL tanpa reload. */
export function setLocale(loc) {
  const url = new URL(window.location.href)
  if (loc === 'id') url.searchParams.delete('locale')
  else url.searchParams.set('locale', loc)
  window.history.pushState({}, '', url.toString())
  currentLocale = loc
  emit()
}

/** React hook — reactive locale. */
export function useLocale() {
  const locale = useSyncExternalStore(subscribe, getLocale)
  // Update <html lang> setiap kali locale berubah
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return locale
}

// ─── translations ────────────────────────────────────────────────

const strings = {
  id: {
    // Navbar
    'nav.startProject': 'Mulai Proyek',
    'nav.openMenu': 'Buka menu',
    'nav.closeMenu': 'Tutup menu',

    // Nav links
    'navLinks': [
      { label: 'Beranda', href: '#beranda' },
      { label: 'Layanan', href: '#layanan' },
      { label: 'Portofolio', href: '#portofolio' },
      { label: 'Proses', href: '#proses' },
      { label: 'Tentang Kami', href: '#tentang' },
      { label: 'Kontak', href: '#kontak' },
    ],

    // Hero
    'hero.eyebrow': 'Jasa kreatif · EST 2023',
    'hero.headline1': 'Arahkan Konten,',
    'hero.headline2': 'Urus Visual.',
    'hero.desc': 'AKV membantu kebutuhan desain, branding, CV dan portofolio, website, animasi AI, serta visual digital agar ide kamu tampil lebih jelas dan menarik.',
    'hero.cta1': 'Mulai Proyek',
    'hero.cta2': 'Lihat Layanan',
    'hero.card1.title': 'Desain Grafis',
    'hero.card1.desc': 'Feed, poster & materi promosi',
    'hero.card2.title': 'Branding & Logo',
    'hero.card2.desc': 'Identitas brand yang konsisten',
    'hero.card3.title': 'Website & Portofolio',
    'hero.card3.desc': 'Tampil profesional di mana saja',
    'hero.serviceCount': '8+ layanan kreatif untukmu',
    'hero.paletteLabel': 'Palet warna',
    'hero.scrollLabel': 'Scroll website-nya, Cuy!',
    'hero.scrollAriaLabel': 'Gulir ke bagian tentang AKV',
    'hero.ariaLabel': 'Beranda AKV',
    'hero.pegiWaveAlt': 'Pegi, maskot AKV, melambaikan tangan',
    'hero.pegiPresentAlt': 'Pegi, maskot AKV, mempresentasikan layanan AKV',

    // About
    'about.eyebrow': 'Tentang kami',
    'about.title': 'Kenalan Dengan AKV',
    'about.p1': 'AKV adalah <strong>Arah Karya Visual</strong>, jasa kreatif yang membantu pelajar, mahasiswa, organisasi, UMKM, dan personal brand dalam mengarahkan ide menjadi visual yang lebih rapi, jelas, dan menarik.',
    'about.p2': 'Bersama Pegi, maskot pena digital kami, AKV percaya setiap ide punya arah. Tugas kami memastikan arah itu sampai dalam bentuk visual yang tepat.',
    'about.since': 'Sejak',
    'about.pegiAlt': 'Pegi memegang tablet bertuliskan AKV',

    // Services
    'services.eyebrow': 'Layanan',
    'services.title': 'Semua Kebutuhan Visual, Satu Arah',
    'services.desc': 'Dari desain harian sampai website dan animasi — pilih layanan yang kamu butuhkan, sisanya kami urus.',
    'services.items': [
      { icon: 'palette', title: 'Desain Grafis', desc: 'Poster, banner, feed, dan kebutuhan visual harian yang rapi dan konsisten.' },
      { icon: 'badge', title: 'Branding dan Logo', desc: 'Identitas visual lengkap: logo, warna, dan guideline yang siap dipakai.' },
      { icon: 'file', title: 'CV dan Portofolio', desc: 'CV ATS-friendly dan portofolio yang bikin profilmu tampil menonjol.' },
      { icon: 'globe', title: 'Website Portofolio', desc: 'Website personal atau bisnis yang responsif, cepat, dan mudah dikelola.' },
      { icon: 'sparkles', title: 'AI Visual Branding', desc: 'Eksplorasi visual berbasis AI yang tetap diarahkan dengan sentuhan desainer.' },
      { icon: 'film', title: 'Animasi AI', desc: 'Animasi pendek untuk intro brand, konten, dan presentasi yang hidup.' },
      { icon: 'video', title: 'Editing Video', desc: 'Editing reels, konten pendek, dan video promosi dengan pacing yang pas.' },
      { icon: 'megaphone', title: 'Konten Media Sosial', desc: 'Template feed dan konten sosial media yang terarah dan on-brand.' },
    ],

    // Portfolio
    'portfolio.eyebrow': 'Portofolio',
    'portfolio.title': 'Karya Yang Sudah Kami Arahkan',
    'portfolio.desc': 'Kumpulan project yang sudah kami kerjakan bersama klien dari berbagai bidang.',
    'portfolio.filterAll': 'Semua',
    'portfolio.viewDetail': 'Lihat Detail',
    'portfolio.viewDetailAria': 'Lihat detail',
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
    'why.desc': 'Empat hal yang selalu kami jaga di setiap project — apa pun skalanya.',
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

    // CTA
    'cta.title': 'Punya Ide Yang Ingin Divisualkan?',
    'cta.desc': 'Ceritakan kebutuhanmu — mulai project bersama AKV.',
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

    'notFound.pageTitle': '404 — Halaman Tidak Ditemukan | AKV',
    'notFound.eyebrow': 'Error 404',
    'notFound.title1': 'Waduh, halamannya ',
    'notFound.title2': 'tidak ketemu.',
    'notFound.desc': 'Halaman atau alamat yang kamu buka tidak ditemukan di situs AKV. Yuk balik ke beranda!',
    'notFound.btn': 'Kembali ke Beranda',
    'notFound.pegiAlt': 'Pegi menunjuk, maskot AKV',

    // WhatsApp default
    'wa.default': 'Halo AKV! Saya ingin mulai project.',

    // Language switcher
    'lang.switch': 'EN',
  },

  en: {
    // Navbar
    'nav.startProject': 'Start Project',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',

    // Nav links
    'navLinks': [
      { label: 'Home', href: '#beranda' },
      { label: 'Services', href: '#layanan' },
      { label: 'Portfolio', href: '#portofolio' },
      { label: 'Process', href: '#proses' },
      { label: 'About Us', href: '#tentang' },
      { label: 'Contact', href: '#kontak' },
    ],

    // Hero
    'hero.eyebrow': 'Creative services · EST 2023',
    'hero.headline1': 'Direct Your Content,',
    'hero.headline2': 'We Handle the Visuals.',
    'hero.desc': 'AKV helps with design, branding, CV & portfolio, websites, AI animation, and digital visuals so your ideas come across clear and compelling.',
    'hero.cta1': 'Start Project',
    'hero.cta2': 'View Services',
    'hero.card1.title': 'Graphic Design',
    'hero.card1.desc': 'Feed, poster & promo materials',
    'hero.card2.title': 'Branding & Logo',
    'hero.card2.desc': 'Consistent brand identity',
    'hero.card3.title': 'Website & Portfolio',
    'hero.card3.desc': 'Look professional anywhere',
    'hero.serviceCount': '8+ creative services for you',
    'hero.paletteLabel': 'Color palette',
    'hero.scrollLabel': 'Scroll down!',
    'hero.scrollAriaLabel': 'Scroll to about section',
    'hero.ariaLabel': 'AKV Home',
    'hero.pegiWaveAlt': 'Pegi, AKV mascot, waving hello',
    'hero.pegiPresentAlt': 'Pegi, AKV mascot, presenting AKV services',

    // About
    'about.eyebrow': 'About us',
    'about.title': 'Meet AKV',
    'about.p1': 'AKV stands for <strong>Arah Karya Visual</strong> (Directed Creative Visual), a creative service helping students, organizations, SMEs, and personal brands turn ideas into cleaner, clearer, and more compelling visuals.',
    'about.p2': 'Together with Pegi, our digital pen mascot, AKV believes every idea has a direction. Our job is to make sure it arrives in the right visual form.',
    'about.since': 'Since',
    'about.pegiAlt': 'Pegi holding a tablet with AKV written on it',

    // Services
    'services.eyebrow': 'Services',
    'services.title': 'All Your Visual Needs, One Direction',
    'services.desc': 'From daily design to websites and animation — pick what you need, we handle the rest.',
    'services.items': [
      { icon: 'palette', title: 'Graphic Design', desc: 'Posters, banners, feeds, and daily visuals that are clean and consistent.' },
      { icon: 'badge', title: 'Branding & Logo', desc: 'Complete visual identity: logo, colors, and guidelines ready to use.' },
      { icon: 'file', title: 'CV & Portfolio', desc: 'ATS-friendly CVs and portfolios that make your profile stand out.' },
      { icon: 'globe', title: 'Portfolio Website', desc: 'Personal or business website that is responsive, fast, and easy to manage.' },
      { icon: 'sparkles', title: 'AI Visual Branding', desc: 'AI-powered visual exploration guided by a designer\'s touch.' },
      { icon: 'film', title: 'AI Animation', desc: 'Short animations for brand intros, content, and lively presentations.' },
      { icon: 'video', title: 'Video Editing', desc: 'Reels, short content, and promo videos with the right pacing.' },
      { icon: 'megaphone', title: 'Social Media Content', desc: 'Feed templates and social media content that is directed and on-brand.' },
    ],

    // Portfolio
    'portfolio.eyebrow': 'Portfolio',
    'portfolio.title': 'Work We\'ve Directed',
    'portfolio.desc': 'A collection of projects we\'ve crafted with clients across various fields.',
    'portfolio.filterAll': 'All',
    'portfolio.viewDetail': 'View Detail',
    'portfolio.viewDetailAria': 'View detail',
    'portfolio.waMsg': 'Hi AKV! I\'m interested in the project',
    'portfolio.filterAriaLabel': 'Filter portfolio categories',
    'portfolio.filters': ['All', 'Design', 'Branding', 'CV & Portfolio', 'Website', 'Animation'],
    'portfolio.items': [
      { id: 1, title: 'SME Instagram Feed', category: 'Design' },
      { id: 2, title: 'Logo & Brand Kit', category: 'Branding' },
      { id: 3, title: 'Student Creative CV', category: 'CV & Portfolio' },
      { id: 4, title: 'Personal Portfolio Website', category: 'Website' },
      { id: 5, title: 'Brand Intro Animation', category: 'Animation' },
      { id: 6, title: 'Campus Event Poster', category: 'Design' },
      { id: 7, title: 'Organization Rebranding', category: 'Branding' },
      { id: 8, title: 'SME Landing Page', category: 'Website' },
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
    'why.desc': 'Four things we uphold in every project — no matter the scale.',
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

    // CTA
    'cta.title': 'Have an Idea to Visualize?',
    'cta.desc': 'Tell us what you need — start a project with AKV.',
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

    'notFound.pageTitle': '404 — Page Not Found | AKV',
    'notFound.eyebrow': 'Error 404',
    'notFound.title1': 'Oops, this page ',
    'notFound.title2': 'doesn\'t exist.',
    'notFound.desc': 'The page or URL you visited was not found on AKV\'s site. Let\'s head back home!',
    'notFound.btn': 'Back to Home',
    'notFound.pegiAlt': 'Pegi pointing, AKV mascot',

    // WhatsApp default
    'wa.default': 'Hi AKV! I\'d like to start a project.',

    // Language switcher
    'lang.switch': 'ID',
  },
}

/** Get translated string or array by key. */
export function t(locale, key) {
  return strings[locale]?.[key] ?? strings.id[key] ?? key
}
