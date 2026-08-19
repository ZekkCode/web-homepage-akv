import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import useMouseParallax from '../hooks/useMouseParallax.js'
import useIsTouch from '../hooks/useIsTouch.js'
import { useContent, waLink } from '../data/store.js'
import { useLocale, t } from '../data/i18n.js'
import Icon from './ui/Icon.jsx'
import ScrollHint from './ui/ScrollHint.jsx'

/**
 * Intro phases:
 * 0 bg fade-in · 1 big centered logo · 2 logo docks to navbar
 * 3 Pegi enters from below (wave pose) · 4 Pegi waves
 * 5 Pegi switches to presentation pose · 6 interface panels pop in
 * 7 done — hero fully interactive (mouse + scroll parallax)
 */
const PHASE_TIMINGS = [
  [1, 350],
  [2, 1650],
  [3, 2350],
  [4, 3050],
  [5, 4450],
  [6, 5050],
  [7, 5750],
]

const easeOut = [0.22, 0.65, 0.3, 1]

export default function Hero({ onPhase }) {
  useContent() // re-render saat kontak diubah dari dashboard admin
  const locale = useLocale()
  const reduce = useReducedMotion()
  const isTouch = useIsTouch()
  const [phase, setPhase] = useState(reduce ? 7 : 0)
  const sectionRef = useRef(null)

  // ----- intro sequence -----
  // Starts only once the page is actually visible, so the animation is never
  // "used up" while the site loads in a background tab.
  useEffect(() => {
    if (reduce) {
      onPhase?.(7)
      return
    }
    let timers = []
    const start = () => {
      timers = PHASE_TIMINGS.map(([p, t]) =>
        setTimeout(() => {
          setPhase(p)
          onPhase?.(p)
        }, t)
      )
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        document.removeEventListener('visibilitychange', onVisible)
        start()
      }
    }
    if (document.visibilityState === 'visible') start()
    else document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      timers.forEach(clearTimeout)
    }
  }, [reduce, onPhase])

  // Preload the second Pegi pose so the crossfade never flashes
  useEffect(() => {
    const img = new Image()
    img.src = '/assets/pegi-present.webp'
  }, [])

  // ----- mouse parallax (disabled on touch / reduced motion) -----
  const mouseEnabled = !isTouch && !reduce && phase >= 6
  const { x: mx, y: my, onMouseMove, onMouseLeave } = useMouseParallax({ enabled: mouseEnabled })

  // Layer offsets driven by the mouse — background slowest, foreground fastest
  const blobX = useTransform(mx, (v) => v * -7)
  const blobY = useTransform(my, (v) => v * -5)
  const doodleX = useTransform(mx, (v) => v * -13)
  const doodleY = useTransform(my, (v) => v * -9)
  const panelX = useTransform(mx, (v) => v * -19)
  const panelY = useTransform(my, (v) => v * -12)
  const cardX = useTransform(mx, (v) => v * -30)
  const cardY = useTransform(my, (v) => v * -20)
  const pegiX = useTransform(mx, (v) => v * 9)
  const pegiY = useTransform(my, (v) => v * 5)

  // ----- scroll parallax -----
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const factor = reduce ? 0 : isTouch ? 0.45 : 1
  const blobScrollY = useTransform(scrollYProgress, [0, 1], [0, 40 * factor])
  const doodleScrollY = useTransform(scrollYProgress, [0, 1], [0, 90 * factor])
  const panelScrollY = useTransform(scrollYProgress, [0, 1], [0, 150 * factor])
  const cardScrollY = useTransform(scrollYProgress, [0, 1], [0, 220 * factor])
  const pegiScrollY = useTransform(scrollYProgress, [0, 1], [0, 70 * factor])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0.1])

  const contentVisible = phase >= 6
  const panelsVisible = phase >= 6

  return (
    <section
      id="beranda"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      aria-label={t(locale, 'hero.ariaLabel')}
    >
      {/* ===== Layer 1 — background: radial gradient + grid kotak + glow biru AKV ===== */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(125% 125% at 50% 10%, #FFFFFF 40%, #DCEBFF 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(30,60,143,0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(30,60,143,0.07) 1px, transparent 1px),
              radial-gradient(circle 520px at 18% 82%, rgba(11,92,255,0.10), transparent),
              radial-gradient(circle 520px at 82% 18%, rgba(127,174,232,0.20), transparent)
            `,
            backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%',
            maskImage:
              'radial-gradient(140% 140% at 50% 20%, black 55%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(140% 140% at 50% 20%, black 55%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* ===== Layer 2 — soft blobs & waves (slowest) ===== */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ x: blobX, y: blobScrollY }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.15 }}
      >
        <motion.div style={{ y: blobY }} className="absolute inset-0">
          <div className="absolute -left-32 top-[8%] h-[440px] w-[440px] rounded-full bg-akv-sky/25 blur-3xl" />
          <div className="absolute -right-40 top-[30%] h-[520px] w-[520px] rounded-full bg-akv-blue/15 blur-3xl" />
          <div className="absolute bottom-[-12%] left-[22%] h-[400px] w-[560px] rounded-[48%] bg-akv-light/70 blur-2xl" />
          {/* soft wave at the bottom */}
          <svg
            className="absolute bottom-0 left-0 w-full text-akv-light"
            viewBox="0 0 1440 120"
            fill="currentColor"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 60 C 240 110 480 10 720 45 C 960 80 1200 110 1440 55 L 1440 120 L 0 120 Z" />
          </svg>
        </motion.div>
      </motion.div>

      {/* ===== Layer 3 — doodles: dots, sparkles, shapes ===== */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 hidden sm:block"
        style={{ x: doodleX, y: doodleScrollY }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.35 }}
      >
        <motion.div style={{ y: doodleY }} className="absolute inset-0 text-akv-royal/35">
          <Sparkle className="absolute left-[12%] top-[22%]" size={22} />
          <Sparkle className="absolute right-[14%] top-[18%]" size={16} />
          <Sparkle className="absolute left-[20%] bottom-[24%]" size={14} />
          <svg className="absolute right-[9%] top-[46%]" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
          </svg>
          <svg className="absolute left-[7%] top-[52%]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M12 4 20 19 4 19 Z" />
          </svg>
          <svg className="absolute right-[22%] bottom-[18%]" width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {/* dotted grid */}
          <svg className="absolute left-[15%] top-[68%]" width="90" height="60" aria-hidden="true">
            {Array.from({ length: 3 }).map((_, r) =>
              Array.from({ length: 5 }).map((__, c) => (
                <circle key={`${r}-${c}`} cx={8 + c * 18} cy={8 + r * 18} r="2.2" fill="currentColor" />
              ))
            )}
          </svg>
          {/* squiggle */}
          <svg className="absolute right-[7%] bottom-[30%]" width="90" height="30" viewBox="0 0 90 30" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M4 22 C 16 6 26 6 38 20 C 50 34 62 4 86 10" />
          </svg>
          {/* pen tool & mata pena di pinggir hero */}
          <img src="/assets/deco-pen-tool.webp" alt="" className="absolute right-[3%] top-[24%] w-20 select-none opacity-90 xl:w-24" loading="lazy" width="96" height="87" draggable="false" />
          <img src="/assets/deco-nib-swash.webp" alt="" className="absolute left-[3%] bottom-[14%] w-16 select-none opacity-90 xl:w-20" loading="lazy" width="80" height="70" draggable="false" />
        </motion.div>
      </motion.div>

      {/* ===== Big intro logo (docks into the navbar) ===== */}
      <AnimatePresence>
        {!reduce && phase >= 1 && phase < 3 && (
          <motion.div
            key="intro-logo"
            className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.82 }}
            animate={
              phase >= 2
                ? { opacity: 0, scale: 0.22, y: '-42vh' }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: phase >= 2 ? 0.7 : 0.6, ease: easeOut }}
          >
            <img
              src="/assets/logo-akv.webp"
              alt=""
              className="w-[min(64vw,420px)] select-none"
              width="420"
              height="420"
              draggable="false"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Hero content grid ===== */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="container-akv relative z-20 flex flex-1 flex-col justify-center pb-16 pt-24 md:pb-20 md:pt-28"
      >
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-4">
          {/* --- Layer 7 (left): headline + copy (+ CTA on desktop) --- */}
          {/* Mobile order: headline → Pegi → CTA (CTA row repeats below Pegi) */}
          <motion.div
            className="relative z-30 order-1 text-center lg:col-span-4 lg:text-left"
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={contentVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <p className="eyebrow mb-5">{t(locale, 'hero.eyebrow')}</p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-akv-navy sm:text-[2.6rem] xl:text-[2.85rem]">
              {t(locale, 'hero.headline1')}
              <br />
              <span className="text-akv-blue">{t(locale, 'hero.headline2')}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-akv-navy/70 sm:text-base lg:mx-0">
              {t(locale, 'hero.desc')}
            </p>
            <div className="mt-8 hidden flex-wrap gap-3 lg:flex lg:justify-start">
              <CtaButtons locale={locale} />
            </div>
          </motion.div>

          {/* --- Mobile/tablet CTA — sits below Pegi --- */}
          <motion.div
            className="order-3 flex flex-wrap justify-center gap-3 lg:hidden"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={contentVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          >
            <CtaButtons locale={locale} />
          </motion.div>

          {/* --- Center: Pegi + interface panels --- */}
          <div className="relative order-2 mx-auto flex w-full max-w-[460px] items-end justify-center lg:col-span-4">
            {/* Layer 4 — big design-canvas panel behind Pegi */}
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 z-0 w-[108%] max-w-none"
              style={{ x: panelX, translateX: '-50%', translateY: '-56%' }}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={panelsVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.55, ease: easeOut }}
            >
              <motion.div style={{ y: panelScrollY }}>
                <motion.div style={{ y: panelY }}>
                  <BrowserPanel />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Layer 6 — Pegi mascot */}
            <motion.div
              className="relative z-10 w-[min(58vw,235px)] sm:w-[250px] lg:w-[240px] xl:w-[255px]"
              style={reduce ? {} : { x: pegiX, y: pegiScrollY }}
              initial={reduce ? false : { opacity: 0, y: 160 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: easeOut }}
            >
              <motion.div style={reduce ? {} : { y: pegiY }}>
                <motion.div
                  animate={
                    reduce
                      ? {}
                      : phase === 4
                        ? { rotate: [0, -3.5, 3, -3.5, 0] }
                        : phase >= 7
                          ? { y: [0, -7, 0] }
                          : {}
                  }
                  transition={
                    phase === 4
                      ? { duration: 1.15, ease: 'easeInOut' }
                      : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
                  }
                  style={{ transformOrigin: '50% 90%' }}
                  className="relative"
                >
                  {/* Wave pose (intro) */}
                  <img
                    src="/assets/pegi-wave.webp"
                    alt={t(locale, 'hero.pegiWaveAlt')}
                    width="600"
                    height="1080"
                    draggable="false"
                    className={`w-full select-none transition-opacity duration-500 ${
                      phase >= 5 ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  {/* Presentation pose (final) */}
                  <img
                    src="/assets/pegi-present.webp"
                    alt={t(locale, 'hero.pegiPresentAlt')}
                    width="600"
                    height="1080"
                    loading="lazy"
                    draggable="false"
                    className={`absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-500 ${
                      phase >= 5 ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </motion.div>
              </motion.div>
              {/* ground shadow */}
              <div
                aria-hidden="true"
                className="mx-auto mt-[-14px] h-5 w-3/5 rounded-[50%] bg-akv-navy/15 blur-md"
              />
            </motion.div>

            {/* Layer 5 — floating tool cards (fastest) */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 hidden sm:block"
              style={{ x: cardX }}
              initial={reduce ? false : { opacity: 0 }}
              animate={panelsVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <motion.div style={{ y: cardScrollY }} className="absolute inset-0">
                <motion.div style={{ y: cardY }} className="absolute inset-0">
                  <FloatingCard className="left-[-6%] top-[6%]" delay={0}>
                    <ToolbarCard />
                  </FloatingCard>
                  <FloatingCard className="right-[-8%] top-[16%]" delay={0.12}>
                    <PaletteCard locale={locale} />
                  </FloatingCard>
                  <FloatingCard className="bottom-[20%] left-[-5%]" delay={0.24}>
                    <VectorCard />
                  </FloatingCard>
                  <FloatingCard className="bottom-[8%] right-[-7%]" delay={0.36}>
                    <ImageCard />
                  </FloatingCard>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* --- Right: service highlight cards --- */}
          <motion.div
            className="relative z-30 order-3 hidden lg:col-span-4 lg:flex lg:flex-col lg:items-end lg:gap-4"
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={contentVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: easeOut }}
          >
            <HighlightCard icon="palette" title={t(locale, 'hero.card1.title')} desc={t(locale, 'hero.card1.desc')} />
            <HighlightCard icon="badge" title={t(locale, 'hero.card2.title')} desc={t(locale, 'hero.card2.desc')} />
            <HighlightCard icon="globe" title={t(locale, 'hero.card3.title')} desc={t(locale, 'hero.card3.desc')} />
            <div className="mt-1 rounded-full border-2 border-akv-navy/10 bg-white/80 px-5 py-2.5 text-sm font-bold text-akv-navy/70 shadow-card backdrop-blur">
              {t(locale, 'hero.serviceCount')}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* scroll hint */}
      <motion.a
        href="#tentang"
        aria-label={t(locale, 'hero.scrollAriaLabel')}
        className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-akv-navy/50 transition-colors hover:text-akv-blue md:flex"
        initial={reduce ? false : { opacity: 0 }}
        animate={contentVisible ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        style={{ opacity: reduce ? 1 : undefined }}
      >
        <ScrollHint label={t(locale, 'hero.scrollLabel')} />
      </motion.a>
    </section>
  )
}

/* ---------- shared CTA buttons (desktop: left column, mobile: below Pegi) ---------- */

function CtaButtons({ locale }) {
  return (
    <>
      <a href={waLink(t(locale, 'wa.default'))} target="_blank" rel="noopener noreferrer" className="btn-primary">
        {t(locale, 'hero.cta1')}
        <Icon name="arrowRight" size={18} />
      </a>
      <a href="#layanan" className="btn-secondary">
        {t(locale, 'hero.cta2')}
      </a>
    </>
  )
}

/* ---------- decorative sub-components (all pure HTML/SVG) ---------- */

function Sparkle({ className = '', size = 18 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c.6 4.8 2.4 6.9 8 8-5.6 1.1-7.4 3.2-8 8-.6-4.8-2.4-6.9-8-8 5.6-1.1 7.4-3.2 8-8Z" />
    </svg>
  )
}

function FloatingCard({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: easeOut }}
    >
      <motion.div
        animate={reduce ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 5 + delay * 4, repeat: Infinity, ease: 'easeInOut', delay: delay * 2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function panelBase() {
  return 'rounded-2xl border-2 border-akv-navy/10 bg-white/95 shadow-panel backdrop-blur'
}

function BrowserPanel() {
  return (
    <div className={`${panelBase()} overflow-hidden`}>
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-akv-light bg-akv-pale/80 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-akv-sky" />
        <span className="h-2.5 w-2.5 rounded-full bg-akv-blue/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-akv-royal/40" />
        <div className="ml-3 flex h-6 flex-1 items-center rounded-full bg-white px-3 text-[10px] font-semibold tracking-wide text-akv-navy/45">
          arahkaryavisual.id
        </div>
      </div>
      {/* canvas area */}
      <div className="relative grid grid-cols-[44px_1fr] gap-0">
        <div className="flex flex-col items-center gap-3 border-r border-akv-light py-4 text-akv-navy/55">
          <Icon name="pen" size={16} />
          <Icon name="type" size={16} />
          <Icon name="crop" size={16} />
          <Icon name="layers" size={16} />
          <Icon name="image" size={16} />
        </div>
        <div className="relative h-36 bg-[radial-gradient(circle,rgba(30,60,143,0.08)_1px,transparent_1px)] [background-size:14px_14px] md:h-[10.5rem]">
          {/* artboard with selection */}
          <div className="absolute left-1/2 top-1/2 h-24 w-40 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-dashed border-akv-blue/70 bg-akv-light/40 md:h-32 md:w-52">
            <span className="absolute -left-1 -top-1 h-2 w-2 rounded-sm border border-akv-blue bg-white" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-sm border border-akv-blue bg-white" />
            <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-sm border border-akv-blue bg-white" />
            <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-sm border border-akv-blue bg-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ToolbarCard() {
  return (
    <div className={`${panelBase()} flex items-center gap-2 px-3.5 py-2.5 text-akv-navy/70`}>
      <Icon name="pen" size={16} />
      <Icon name="crop" size={16} />
      <Icon name="type" size={16} />
      <span className="mx-1 h-5 w-px bg-akv-light" />
      <span className="rounded-md bg-akv-blue px-2 py-0.5 text-[10px] font-extrabold text-white">
        AKV
      </span>
    </div>
  )
}

function PaletteCard({ locale }) {
  return (
    <div className={`${panelBase()} px-3.5 py-3`}>
      <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-akv-navy/45">
        {t(locale, 'hero.paletteLabel')}
      </p>
      <div className="flex gap-1.5">
        <span className="h-5 w-5 rounded-md bg-akv-blue" />
        <span className="h-5 w-5 rounded-md bg-akv-royal" />
        <span className="h-5 w-5 rounded-md bg-akv-navy" />
        <span className="h-5 w-5 rounded-md bg-akv-sky" />
        <span className="h-5 w-5 rounded-md border border-akv-light bg-white" />
      </div>
    </div>
  )
}

function VectorCard() {
  return (
    <div className={`${panelBase()} px-3.5 py-3`}>
      <svg width="84" height="45" viewBox="0 0 104 56" fill="none" aria-hidden="true">
        <path d="M8 44 C 32 8 66 8 96 36" stroke="#0B5CFF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8" y1="44" x2="30" y2="16" stroke="#7FAEE8" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="96" y1="36" x2="70" y2="12" stroke="#7FAEE8" strokeWidth="1.5" strokeDasharray="3 3" />
        <rect x="4" y="40" width="8" height="8" rx="2" fill="white" stroke="#0D1B3D" strokeWidth="1.6" />
        <rect x="92" y="32" width="8" height="8" rx="2" fill="white" stroke="#0D1B3D" strokeWidth="1.6" />
        <circle cx="30" cy="16" r="4" fill="#0B5CFF" />
        <circle cx="70" cy="12" r="4" fill="#0B5CFF" />
      </svg>
    </div>
  )
}

function ImageCard() {
  return (
    <div className={`${panelBase()} w-28 overflow-hidden`}>
      <div className="flex h-14 items-center justify-center bg-gradient-to-br from-akv-light to-akv-sky/50 text-akv-royal">
        <Icon name="image" size={20} />
      </div>
      <div className="space-y-1.5 px-3 py-2.5">
        <div className="h-1.5 w-4/5 rounded-full bg-akv-light" />
        <div className="h-1.5 w-3/5 rounded-full bg-akv-light" />
      </div>
    </div>
  )
}

function HighlightCard({ icon, title, desc }) {
  return (
    <div className="flex w-60 items-center gap-3 rounded-card border-2 border-akv-navy/10 bg-white/85 p-3.5 shadow-card backdrop-blur transition-transform duration-200 hover:-translate-y-1">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-akv-light text-akv-blue">
        <Icon name={icon} size={20} />
      </span>
      <span>
        <span className="block text-sm font-extrabold text-akv-navy">{title}</span>
        <span className="block text-xs font-medium text-akv-navy/60">{desc}</span>
      </span>
    </div>
  )
}
