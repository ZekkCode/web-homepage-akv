import { useMotionValue, useSpring } from 'framer-motion'
import { useCallback } from 'react'

/**
 * Normalized (-1..1) springy mouse position for hero parallax.
 * Attach `onMouseMove` to the hero container; read `x`/`y` motion values.
 */
export default function useMouseParallax({ enabled = true } = {}) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.6 })

  const onMouseMove = useCallback(
    (e) => {
      if (!enabled) return
      const rect = e.currentTarget.getBoundingClientRect()
      rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
      rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1)
    },
    [enabled, rawX, rawY]
  )

  const onMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return { x, y, onMouseMove, onMouseLeave }
}
