import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollHint from './ui/ScrollHint.jsx'
import { useLocale } from '../data/i18n.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * Sekuens brand AKV:
 * - Desktop/Tablet (>= 768px): pinned GSAP ScrollTrigger scrub penuh (tajam tanpa video).
 * - Mobile (< 768px): showcase brand kompak tanpa pin panjang agar pengunjung mobile
 *   langsung meluncur cepat ke Tentang, Layanan, dan Paket Harga.
 */
export default function LogoSequence() {
  const sectionRef = useRef(null)
  const sceneRef = useRef(null)
  const locale = useLocale()
  const reduce = useReducedMotion()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const mm = gsap.matchMedia()
    const q = gsap.utils.selector(sceneRef)

    mm.add('(min-width: 768px)', () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const logoLift = () => -(window.innerHeight * 0.31)

      if (reducedMotion) {
        gsap.set(q('[data-seq="bg"], [data-seq="doodle"]'), { autoAlpha: 1 })
        gsap.set(q('[data-seq="logo"]'), {
          autoAlpha: 1,
          yPercent: -50,
          y: logoLift(),
          scale: 0.48,
        })
        gsap.set(q('[data-seq="pegi-b"], [data-seq="sparkle"]'), { autoAlpha: 1 })
        return
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      })

      tl.fromTo(q('[data-seq="bg"]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0)
      tl.fromTo(
        q('[data-seq="doodle"]'),
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.02 },
        0.04
      )
      tl.fromTo(
        q('[data-seq="logo"]'),
        { autoAlpha: 0, scale: 0.45, yPercent: -40 },
        { autoAlpha: 1, scale: 1, yPercent: -50, duration: 0.26 },
        0.08
      )
      tl.to(q('[data-seq="logo"]'), { y: logoLift, scale: 0.48, duration: 0.2 }, 0.42)
      tl.fromTo(
        q('[data-seq="pegi-a"]'),
        { autoAlpha: 0, yPercent: 70 },
        { autoAlpha: 1, yPercent: 0, duration: 0.22 },
        0.56
      )
      tl.to(q('[data-seq="pegi-a"]'), { autoAlpha: 0, duration: 0.07 }, 0.82)
      tl.fromTo(q('[data-seq="pegi-b"]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.07 }, 0.82)
      tl.fromTo(
        q('[data-seq="sparkle"]'),
        { autoAlpha: 0, scale: 0.3 },
        { autoAlpha: 1, scale: 1, duration: 0.1, stagger: 0.02, ease: 'power1.out' },
        0.88
      )
      tl.to(q('[data-seq="drift-l"]'), { x: -36, duration: 1 }, 0)
      tl.to(q('[data-seq="drift-r"]'), { x: 36, duration: 1 }, 0)
    })

    return () => mm.revert()
  }, [])

  return (
    <>
      {/* Mobile (<768px): showcase brand ringkas tanpa scroll trap */}
      <section
        aria-label={locale === 'en' ? 'AKV brand highlight' : 'Sorotan brand AKV'}
        className="relative overflow-hidden bg-gradient-to-b from-akv-light via-akv-pale to-white py-10 md:hidden"
      >
        <div className="container-akv relative z-10 flex flex-col items-center text-center">
          <motion.img
            src="/assets/logo-akv.webp"
            alt="Logo AKV, Arah Karya Visual"
            width="240"
            height="142"
            loading="lazy"
            draggable="false"
            initial={reduce ? false : { opacity: 0, y: 14, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, margin: '-30px' }}
            transition={{ duration: 0.45, ease: [0.22, 0.65, 0.3, 1] }}
            className="w-40 select-none"
          />
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-30px' }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 0.08 }}
            className="mt-3 text-xs font-extrabold uppercase tracking-[0.18em] text-akv-blue"
          >
            {locale === 'en' ? 'Direct Your Content, We Handle the Visuals.' : 'Arahkan Konten, Urus Visual.'}
          </motion.p>
        </div>
      </section>

      {/* Tablet & Desktop (>=768px): sekuens scroll-scrub pinned penuh */}
      <section
        ref={sectionRef}
        aria-label={locale === 'en' ? 'AKV scroll-driven brand sequence' : 'Animasi brand AKV yang bergerak mengikuti scroll'}
        className="relative hidden h-[100svh] overflow-hidden bg-gradient-to-b from-akv-light via-akv-pale to-white md:block"
      >
        <div ref={sceneRef} className="relative h-full w-full">
          {/* blob latar */}
          <div data-seq="bg" className="absolute inset-0 opacity-0">
            <div className="absolute -left-24 -top-24 h-[45vmin] w-[45vmin] rounded-[45%] bg-akv-light/80" />
            <div className="absolute -right-28 top-[10%] h-[50vmin] w-[50vmin] rounded-[45%] bg-akv-sky/25" />
            <div className="absolute -left-20 bottom-[-10%] h-[40vmin] w-[40vmin] rounded-[45%] bg-akv-sky/20" />
            <div className="absolute -right-24 bottom-[-14%] h-[46vmin] w-[46vmin] rounded-[45%] bg-akv-light/80" />
          </div>

          {/* doodle kiri */}
          <div data-seq="drift-l" className="absolute inset-0 text-akv-royal/40">
            <svg data-seq="doodle" className="absolute left-[8%] top-[22%] opacity-0" width="26" height="26" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            <svg data-seq="doodle" className="absolute left-[16%] top-[44%] opacity-0" width="90" height="60" aria-hidden="true">
              {Array.from({ length: 3 }).map((_, r) =>
                Array.from({ length: 5 }).map((__, c) => (
                  <circle key={`${r}-${c}`} cx={8 + c * 18} cy={8 + r * 18} r="2.1" fill="currentColor" />
                ))
              )}
            </svg>
            <svg data-seq="doodle" className="absolute bottom-[24%] left-[10%] opacity-0" width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </div>

          {/* doodle kanan */}
          <div data-seq="drift-r" className="absolute inset-0 text-akv-royal/40">
            <svg data-seq="doodle" className="absolute right-[9%] top-[18%] opacity-0" width="26" height="26" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            <svg data-seq="doodle" className="absolute right-[14%] top-[46%] opacity-0" width="30" height="30" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="9" /></svg>
            <svg data-seq="doodle" className="absolute bottom-[28%] right-[10%] opacity-0" width="90" height="30" viewBox="0 0 90 30" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round"><path d="M4 22 C 16 6 26 6 38 20 C 50 34 62 4 86 10" /></svg>
          </div>

          {/* logo */}
          <div data-seq="logo" className="absolute inset-x-0 top-1/2 flex justify-center opacity-0">
            <img
              src="/assets/logo-akv.webp"
              alt=""
              draggable="false"
              className="w-[min(58vw,460px)] select-none"
              width="460"
              height="460"
            />
          </div>

          {/* Pegi */}
          <div className="absolute inset-x-0 bottom-[6%] flex justify-center">
            <div className="relative aspect-[3/5] h-[48svh]">
              <img
                data-seq="pegi-a"
                src="/assets/pegi-wave.webp"
                alt="Pegi, maskot AKV"
                draggable="false"
                className="absolute inset-0 h-full w-full select-none object-contain object-bottom opacity-0"
                width="600"
                height="1080"
                loading="lazy"
              />
              <img
                data-seq="pegi-b"
                src="/assets/pegi-tablet.webp"
                alt=""
                draggable="false"
                className="absolute inset-0 h-full w-full select-none object-contain object-bottom opacity-0"
                width="600"
                height="1080"
                loading="lazy"
              />
              <svg data-seq="sparkle" className="absolute -left-14 top-[18%] text-akv-blue opacity-0" width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 4.8 2.4 6.9 8 8-5.6 1.1-7.4 3.2-8 8-.6-4.8-2.4-6.9-8-8 5.6-1.1 7.4-3.2 8-8Z" /></svg>
              <svg data-seq="sparkle" className="absolute -right-16 top-[30%] text-akv-sky opacity-0" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 4.8 2.4 6.9 8 8-5.6 1.1-7.4 3.2-8 8-.6-4.8-2.4-6.9-8-8 5.6-1.1 7.4-3.2 8-8Z" /></svg>
              <svg data-seq="sparkle" className="absolute -right-10 bottom-[24%] text-akv-blue opacity-0" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 4.8 2.4 6.9 8 8-5.6 1.1-7.4 3.2-8 8-.6-4.8-2.4-6.9-8-8 5.6-1.1 7.4-3.2 8-8Z" /></svg>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-akv-navy/50">
            <ScrollHint label={locale === 'en' ? 'Scroll to play' : 'Scroll untuk memutar'} />
          </div>
        </div>
      </section>
    </>
  )
}
