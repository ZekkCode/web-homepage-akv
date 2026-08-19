import { motion, useReducedMotion } from 'framer-motion'

/**
 * Scroll-triggered reveal (fade + rise), hidup dua arah:
 * animasi diputar ulang saat elemen masuk viewport lagi (scroll naik/turun).
 * Respects prefers-reduced-motion: konten langsung tampil tanpa animasi.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  once = false,
  className = '',
  as = 'div',
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] ?? motion.div

  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.65, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  )
}
