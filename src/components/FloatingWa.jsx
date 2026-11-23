import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useContent, waLink } from '../data/store.js'
import { useLocale, t } from '../data/i18n.js'
import Icon from './ui/Icon.jsx'

/**
 * Tombol konsultasi WhatsApp mengambang di pojok kanan bawah.
 * Menggunakan palet resmi AKV (#0B5CFF) dan muncul halus setelah user mulai scroll.
 */
export default function FloatingWa() {
  useContent()
  const locale = useLocale()
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 220)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={waLink(t(locale, 'wa.default'))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t(locale, 'floatingWa.ariaLabel')}
          initial={reduce ? false : { opacity: 0, y: 18, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.94 }}
          transition={{ duration: 0.25, ease: [0.22, 0.65, 0.3, 1] }}
          className="fixed bottom-4 right-4 z-40 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-akv-blue px-4 py-3 text-xs font-extrabold text-white shadow-panel transition-all duration-200 hover:-translate-y-0.5 hover:bg-akv-blue-dark active:scale-[0.98] sm:bottom-6 sm:right-6 sm:px-5 sm:text-sm"
        >
          <Icon name="whatsapp" size={19} />
          <span className="sm:hidden">{t(locale, 'floatingWa.shortLabel')}</span>
          <span className="hidden sm:inline">{t(locale, 'floatingWa.label')}</span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
