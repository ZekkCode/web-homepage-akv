import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useContent, waLink } from '../data/store.js'
import { useLocale, t, setLocale } from '../data/i18n.js'
import Icon from './ui/Icon.jsx'

export default function Navbar({ visible }) {
  useContent() // re-render saat kontak diubah dari dashboard admin
  const locale = useLocale()
  const navLinks = t(locale, 'navLinks')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const toggleLocale = () => setLocale(locale === 'id' ? 'en' : 'id')

  return (
    <motion.header
      initial={reduce ? false : { y: -72, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -72, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.65, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-shadow ${
        scrolled ? 'shadow-card' : ''
      }`}
    >
      <div
        className={`backdrop-blur-xl transition-colors ${
          scrolled ? 'bg-white/90' : 'bg-white/60'
        }`}
      >
        <nav
          className="container-akv flex h-14 items-center justify-between gap-4 md:h-16"
          aria-label={locale === 'id' ? 'Navigasi utama' : 'Main navigation'}
        >
          <a href="#beranda" className="flex shrink-0 items-center gap-2" aria-label="AKV">
            <img
              src="/assets/logo-akv.webp"
              alt="Logo AKV, Arah Karya Visual"
              className="h-8 w-auto select-none md:h-9"
              width="120"
              height="40"
              draggable="false"
            />
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-akv-navy/75 transition-colors hover:bg-akv-light/60 hover:text-akv-blue"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-akv-navy/10 bg-white text-[11px] font-extrabold text-akv-navy/70 transition-all duration-200 hover:border-akv-blue hover:text-akv-blue"
            >
              {t(locale, 'lang.switch')}
            </button>
            <a
              href={waLink(t(locale, 'wa.default'))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary hidden !px-5 !py-2.5 !text-sm lg:inline-flex"
            >
              {t(locale, 'nav.startProject')}
            </a>
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? t(locale, 'nav.closeMenu') : t(locale, 'nav.openMenu')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-akv-navy/10 bg-white text-akv-navy transition-colors hover:border-akv-blue hover:text-akv-blue lg:hidden"
            >
              <Icon name={open ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="menu-mobile"
              initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="overflow-hidden border-t border-akv-light bg-white/95 lg:hidden"
            >
              <ul className="container-akv flex flex-col gap-1 py-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 text-base font-semibold text-akv-navy/80 transition-colors hover:bg-akv-light/60 hover:text-akv-blue"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="mt-2">
                  <a
                    href={waLink(t(locale, 'wa.default'))}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="btn-primary w-full"
                  >
                    {t(locale, 'nav.startProject')}
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
