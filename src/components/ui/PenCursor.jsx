import { useEffect, useRef } from 'react'

/**
 * Kursor custom berbentuk pen digital (stylus).
 * - Hanya aktif di perangkat pointer presisi (mouse) — di layar sentuh
 *   dan saat prefers-reduced-motion kursor bawaan tetap dipakai.
 * - Membesar saat hover elemen interaktif, "menekan" saat klik.
 * - Ujung pena = titik klik (hotspot di kiri-atas SVG 0,0).
 */
export default function PenCursor() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    document.documentElement.classList.add('pen-cursor')

    let raf = 0
    let x = -100
    let y = -100
    const render = () => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = 0
    }
    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      el.style.opacity = '1'
      if (!raf) raf = requestAnimationFrame(render)
    }
    const onOver = (e) => {
      el.classList.toggle(
        'cursor-hot',
        !!e.target.closest('a, button, [role="tab"], input, textarea')
      )
    }
    const onDown = () => el.classList.add('cursor-press')
    const onUp = () => el.classList.remove('cursor-press')
    const onLeave = () => {
      el.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('pen-cursor')
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="pen-cursor-el">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <g filter="drop-shadow(1px 2px 3px rgba(13, 27, 61, 0.45))">
          {/* Main Pen Stylus Shaft */}
          <path
            d="M 1.5 1.5 L 11 5 C 13.5 7.5 16 10 16 10 L 26.5 20.5 C 28.5 22.5 28.5 25 26.5 27 C 24.5 29 22 29 20 27 L 9.5 16.5 C 9.5 16 7 13.5 4.5 11 Z"
            fill="#0D1B3D"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Digital Pen Nib Tip (AKV Royal Blue) */}
          <path
            d="M 1.5 1.5 L 9 4 C 7.5 6 6 7.5 4 9 Z"
            fill="#0B5CFF"
          />
          {/* Breather Slit Line and Hole */}
          <line x1="1.5" y1="1.5" x2="5" y2="5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="5.5" cy="5.5" r="0.9" fill="#FFFFFF" />
          {/* Stylus Cyan Accent Ring */}
          <line x1="9.5" y1="16.5" x2="16" y2="10" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}
