import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis smooth-scrolling, disinkronkan dengan GSAP ScrollTrigger.
 * - Nonaktif otomatis saat prefers-reduced-motion.
 * - Anchor `#` di-handle lewat lenis.scrollTo dengan offset navbar.
 */
export default function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.11,
      smoothWheel: true,
      orientation: 'vertical',       // hanya intercept scroll vertikal
      gestureOrientation: 'vertical', // gesture horizontal tetap native (untuk carousel)
    })

    lenis.on('scroll', ScrollTrigger.update)
    // GSAP ticker passes time in seconds; Lenis.raf() expects milliseconds → ×1000
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Smooth anchor navigation via Lenis (clears the fixed navbar)
    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href === '#' || href.length < 2) return

      let target = null
      try {
        target = document.querySelector(href)
      } catch {
        return
      }

      if (!target) return
      e.preventDefault()
      history.pushState(null, '', href)
      lenis.scrollTo(target, { offset: -68, duration: 1.1 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}
