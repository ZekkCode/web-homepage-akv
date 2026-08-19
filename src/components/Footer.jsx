import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useContent, waLink } from '../data/store.js'
import { useLocale, t } from '../data/i18n.js'
import Icon from './ui/Icon.jsx'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Footer() {
  const { contact, services: adminServices } = useContent()
  const locale = useLocale()
  const reduce = useReducedMotion()
  const year = new Date().getFullYear()
  const navLinks = t(locale, 'navLinks')
  const services = locale === 'id' ? adminServices : t(locale, 'services.items')

  return (
    <footer className="relative w-full overflow-hidden border-t border-akv-light bg-white" aria-label="Footer AKV">
      <motion.div
        variants={reduce ? undefined : containerVariants}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'visible'}
        viewport={{ once: false, margin: '-40px' }}
        className="container-akv relative z-10 pb-6 pt-12"
      >
        {/* Jargon brand */}
        <motion.p
          variants={itemVariants}
          className="mb-8 text-xs font-extrabold uppercase tracking-[0.22em] text-akv-blue"
        >
          {t(locale, 'footer.tagline')}
        </motion.p>

        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <motion.div variants={itemVariants} className="max-w-xs">
            <img
              src="/assets/logo-akv.webp"
              alt="Logo AKV, Arah Karya Visual"
              className="h-12 w-auto select-none"
              width="144"
              height="48"
              loading="lazy"
              draggable="false"
            />
            <p className="mt-4 text-[13px] leading-relaxed text-akv-navy/65 sm:text-sm">
              {t(locale, 'footer.brandDesc')}
            </p>
          </motion.div>

          {/* Kolom link */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:gap-x-16">
            <motion.nav variants={itemVariants} aria-label={locale === 'id' ? 'Navigasi footer' : 'Footer navigation'}>
              <p className="mb-2.5 text-[11px] sm:text-[11px] font-extrabold uppercase tracking-widest text-akv-navy/45">
                {t(locale, 'footer.navCol')}
              </p>
              <ul className="flex flex-col gap-1.5 sm:gap-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-xs sm:text-sm font-semibold text-akv-navy/70 transition-colors duration-200 hover:text-akv-blue"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>

            <motion.div variants={itemVariants}>
              <p className="mb-2.5 text-[11px] sm:text-[11px] font-extrabold uppercase tracking-widest text-akv-navy/45">
                {t(locale, 'footer.servicesCol')}
              </p>
              <ul className="flex flex-col gap-1.5 sm:gap-2.5">
                {services.slice(0, 6).map((service) => (
                  <li key={service.title}>
                    <a
                      href="#layanan"
                      className="text-xs sm:text-sm font-semibold text-akv-navy/70 transition-colors duration-200 hover:text-akv-blue"
                    >
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sosial */}
          <motion.div variants={itemVariants} className="md:text-right">
            <p className="mb-2.5 sm:mb-4 text-[11px] sm:text-[11px] font-extrabold uppercase tracking-widest text-akv-navy/45">
              {t(locale, 'footer.socialCol')}
            </p>
            <ul className="flex items-center gap-3 md:justify-end" aria-label={locale === 'id' ? 'Media sosial AKV' : 'AKV social media'}>
              <SocialLink href={contact.instagram} icon="instagram" label="Instagram AKV" />
              <SocialLink href={contact.tiktok} icon="tiktok" label="TikTok AKV" />
              <SocialLink href={waLink(t(locale, 'wa.default'))} icon="whatsapp" label="WhatsApp AKV" />
              <SocialLink href={`mailto:${contact.email}`} icon="mail" label="Email AKV" />
            </ul>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-10 border-t border-akv-navy/10" />

        <motion.div
          variants={itemVariants}
          className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          <p className="text-xs font-medium text-akv-navy/55">
            © {year} AKV Arah Karya Visual. {t(locale, 'footer.copyright')}
          </p>
          <p className="text-xs font-extrabold tracking-wide text-akv-blue">
            {t(locale, 'footer.tagline')}
          </p>
        </motion.div>
      </motion.div>

      {/* Tulisan brand raksasa memudar */}
      <motion.p
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: false }}
        className="pointer-events-none -mb-[0.22em] mt-4 select-none bg-gradient-to-b from-akv-light via-akv-light/60 to-white bg-clip-text text-center font-extrabold leading-none tracking-tight text-transparent"
        style={{ fontSize: 'clamp(3rem, 10vw, 8.5rem)' }}
      >
        AKV
      </motion.p>
    </footer>
  )
}

function SocialLink({ href, icon, label }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-akv-navy/10 bg-akv-pale text-akv-navy/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-akv-blue hover:text-akv-blue"
      >
        <Icon name={icon} size={18} />
      </a>
    </li>
  )
}
