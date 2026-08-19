import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Aset dekorasi di pinggir kiri/kanan section.
 * - Masuk dari sisi layar saat di-scroll (gaya AOS) via GSAP ScrollTrigger.
 * - Drift parallax pelan (scrub) selama section melewati viewport.
 * - Murni dekoratif: aria-hidden, pointer-events-none, disembunyikan di mobile.
 *
 * Pemakaian: letakkan di dalam <section> ber-class `relative`.
 */
export default function EdgeAsset({
  src,
  side = 'left',
  top,
  bottom,
  width = 150,
  speed = 46,
  rotate = 0,
  opacity = 0.9,
  className = '',
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Tanpa animasi, tampilkan langsung dengan opacity target
      el.style.opacity = opacity
      return
    }

    const ctx = gsap.context(() => {
      // Entrance — slides in from the screen edge (AOS-like, reversible)
      gsap.fromTo(
        el,
        { autoAlpha: 0, x: side === 'left' ? -70 : 70, rotate: rotate + (side === 'left' ? -8 : 8) },
        {
          autoAlpha: opacity,
          x: 0,
          rotate,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            end: 'bottom 5%',
            // hidup dua arah: masuk saat scroll turun, keluar-masuk lagi saat scroll naik
            toggleActions: 'play reverse play reverse',
          },
        }
      )
      // Slow parallax drift while the section scrolls by
      gsap.to(el, {
        y: -speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
    })
    return () => ctx.revert()
  }, [src, side, speed, rotate, opacity])

  const pos = {}
  if (top) pos.top = top
  if (bottom) pos.bottom = bottom
  pos[side] = 'max(0.75rem, 2vw)'

  return (
    <img
      ref={ref}
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      draggable="false"
      width={width}
      height={width}
      style={{ ...pos, width }}
      className={`pointer-events-none absolute z-0 hidden select-none opacity-0 lg:block ${className}`}
    />
  )
}
