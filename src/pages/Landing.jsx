import { useCallback, useState } from 'react'
import useLenis from '../hooks/useLenis.js'
import { useLocale } from '../data/i18n.js'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import LogoSequence from '../components/LogoSequence.jsx'
import About from '../components/About.jsx'
import Services from '../components/Services.jsx'
import TapeDivider from '../components/ui/TapeDivider.jsx'
import Portfolio from '../components/Portfolio.jsx'
import Process from '../components/Process.jsx'
import WhyAkv from '../components/WhyAkv.jsx'
import Testimonials from '../components/Testimonials.jsx'
import CtaSection from '../components/CtaSection.jsx'
import Footer from '../components/Footer.jsx'

export default function Landing() {
  // Lenis smooth scroll + GSAP ScrollTrigger sync (khusus landing)
  useLenis()
  const locale = useLocale()

  // Navbar muncul saat logo intro merapat ke atas (fase 2)
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
        <Portfolio />
        <Process />
        <WhyAkv />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
