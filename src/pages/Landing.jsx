import { useCallback, useState } from 'react'
import useLenis from '../hooks/useLenis.js'
import { useLocale, t } from '../data/i18n.js'
import { usePageSeo } from '../utils/seo.js'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import LogoSequence from '../components/LogoSequence.jsx'
import About from '../components/About.jsx'
import Services from '../components/Services.jsx'
import TapeDivider from '../components/ui/TapeDivider.jsx'
import Pricing from '../components/Pricing.jsx'
import Portfolio from '../components/Portfolio.jsx'
import Process from '../components/Process.jsx'
import WhyAkv from '../components/WhyAkv.jsx'
import Testimonials from '../components/Testimonials.jsx'
import Faq from '../components/Faq.jsx'
import CtaSection from '../components/CtaSection.jsx'
import Footer from '../components/Footer.jsx'
import FloatingWa from '../components/FloatingWa.jsx'

export default function Landing() {
  // Lenis smooth scroll + GSAP ScrollTrigger sync (khusus landing)
  useLenis()
  const locale = useLocale()
  const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://akv.zakariamp.id').replace(/\/$/, '')

  usePageSeo({
    title: t(locale, 'seo.title'),
    description: t(locale, 'seo.description'),
    canonical: locale === 'en' ? `${siteUrl}/?lang=en` : `${siteUrl}/`,
    locale,
  })

  // Navbar muncul saat logo intro merapat ke atas (fase 2) atau langsung jika intro sudah pernah dilihat
  const [navVisible, setNavVisible] = useState(false)

  const handleHeroPhase = useCallback((phase) => {
    if (phase >= 2) setNavVisible(true)
  }, [])

  return (
    <>
      <a
        href="#beranda"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-akv-blue focus:px-5 focus:py-2.5 focus:font-bold focus:text-white"
      >
        {locale === 'en' ? 'Skip to main content' : 'Lewati ke konten utama'}
      </a>
      <Navbar visible={navVisible} />
      <main>
        <Hero onPhase={handleHeroPhase} />
        <LogoSequence />
        <About />
        <Services />
        <TapeDivider />
        <Pricing />
        <Portfolio />
        <Process />
        <WhyAkv />
        <Testimonials />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
      <FloatingWa />
    </>
  )
}
