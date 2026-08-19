import { useEffect, useRef, useCallback } from 'react'

/**
 * Hook to make a horizontal scroll container bi-directionally infinite.
 * On mount, sets scrollLeft to the middle set so users can swipe LEFT or RIGHT immediately.
 * Seamlessly loops when reaching bounds.
 *
 * Perbaikan: gunakan rAF bukan setTimeout agar layout stabil sebelum set scrollLeft,
 * dan nonaktifkan snap sementara saat jump agar tidak conflit.
 */
export function useInfiniteHorizontalScroll(deps = []) {
  const containerRef = useRef(null)
  const metaRef = useRef({ setWidth: 0, busy: false })

  const jumpWithoutSnap = useCallback((el, newLeft) => {
    // Nonaktifkan snap sementara agar programmatic jump tidak di-fight browser
    const meta = metaRef.current
    if (meta.busy) return
    meta.busy = true

    const prevSnap = el.style.scrollSnapType
    el.style.scrollSnapType = 'none'
    el.scrollLeft = newLeft

    // Re-enable snap setelah browser settle (1 frame)
    requestAnimationFrame(() => {
      el.style.scrollSnapType = prevSnap
      meta.busy = false
    })
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cleanupScroll = null
    let rafId = null

    // Gunakan dua rAF frames agar layout benar-benar selesai (paint + composite)
    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => {
        if (!el.children.length) return

        const totalChildren = el.children.length
        const setSize = Math.floor(totalChildren / 3)
        if (setSize <= 0) return

        let singleSetWidth = 0
        const computedGap = parseFloat(window.getComputedStyle(el).gap) || 12

        for (let i = 0; i < setSize; i++) {
          const child = el.children[i]
          const width = child.getBoundingClientRect().width
          singleSetWidth += width + computedGap
        }

        if (singleSetWidth <= 0) return

        metaRef.current.setWidth = singleSetWidth

        // Set initial scroll position to start of set 2 (middle) — tanpa snap interference
        const prevSnap = el.style.scrollSnapType
        el.style.scrollSnapType = 'none'
        el.scrollLeft = singleSetWidth
        // Re-enable snap setelah settle
        requestAnimationFrame(() => {
          el.style.scrollSnapType = prevSnap
        })

        const handleScroll = () => {
          const sw = metaRef.current.setWidth
          if (sw <= 0 || metaRef.current.busy) return

          // Threshold lebih toleran untuk momentum scroll di touch devices
          if (el.scrollLeft <= 2) {
            jumpWithoutSnap(el, el.scrollLeft + sw)
          } else if (el.scrollLeft >= sw * 2 - 2) {
            jumpWithoutSnap(el, el.scrollLeft - sw)
          }
        }

        el.addEventListener('scroll', handleScroll, { passive: true })
        cleanupScroll = () => el.removeEventListener('scroll', handleScroll)
      })
    })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (cleanupScroll) cleanupScroll()
    }
  // ponytail: deps di-serialize agar ESLint tidak protes; upgrade ke useRef tracker jika deps kompleks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(deps), jumpWithoutSnap])

  return containerRef
}
