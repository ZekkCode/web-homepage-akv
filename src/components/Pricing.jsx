import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import SectionHeading from './ui/SectionHeading.jsx'
import Icon from './ui/Icon.jsx'
import { useContent, waLink } from '../data/store.js'
import { useLocale, t } from '../data/i18n.js'

export default function Pricing() {
  const { pricingPackages: adminPackages } = useContent()
  const locale = useLocale()
  const reduce = useReducedMotion()

  const packages = locale === 'id' ? adminPackages : t(locale, 'pricing.items')
  const waPrefix = t(locale, 'pricing.waPrefix')

  return (
    <section
      id="paket"
      className="relative overflow-hidden bg-white py-14 sm:py-20 md:py-28"
      aria-labelledby="paket-heading"
    >
      <div className="container-akv relative z-10">
        <SectionHeading
          eyebrow={t(locale, 'pricing.eyebrow')}
          title={<span id="paket-heading">{t(locale, 'pricing.title')}</span>}
          desc={t(locale, 'pricing.desc')}
        />

        <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch lg:gap-6">
          {packages.map((pkg, i) => {
            const featured = Boolean(pkg.featured)
            const msg = `${waPrefix} "${pkg.name}" (${pkg.price}). Boleh diskusi kebutuhan proyek saya?`
            return (
              <motion.article
                key={`${pkg.name}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-40px' }}
                transition={{
                  duration: 0.45,
                  delay: reduce ? 0 : i * 0.09,
                  ease: [0.22, 0.65, 0.3, 1],
                }}
                className={`relative flex flex-col rounded-feature border-2 p-6 transition-all duration-200 sm:p-7 ${
                  featured
                    ? 'border-akv-blue bg-akv-navy text-white shadow-panel lg:-translate-y-2'
                    : 'border-akv-navy/10 bg-akv-pale/60 text-akv-navy shadow-card hover:border-akv-blue/40 hover:bg-white hover:shadow-card-hover'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] ${
                      featured
                        ? 'bg-akv-blue text-white'
                        : 'bg-akv-light text-akv-blue'
                    }`}
                  >
                    {pkg.badge || pkg.name}
                  </span>
                </div>

                <h3
                  className={`mt-4 text-xl font-extrabold sm:text-2xl ${
                    featured ? 'text-white' : 'text-akv-navy'
                  }`}
                >
                  {pkg.name}
                </h3>

                <div className="mt-3 flex items-baseline gap-2">
                  <span
                    className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${
                      featured ? 'text-akv-sky' : 'text-akv-blue'
                    }`}
                  >
                    {pkg.price}
                  </span>
                  {pkg.unit && (
                    <span
                      className={`text-xs font-semibold ${
                        featured ? 'text-white/60' : 'text-akv-navy/50'
                      }`}
                    >
                      / {pkg.unit}
                    </span>
                  )}
                </div>

                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    featured ? 'text-white/75' : 'text-akv-navy/70'
                  }`}
                >
                  {pkg.desc}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5 border-t pt-5 text-sm leading-snug border-current/10">
                  {(pkg.features || []).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          featured
                            ? 'bg-akv-blue/30 text-akv-sky'
                            : 'bg-akv-light text-akv-blue'
                        }`}
                      >
                        <Icon name="check" size={12} strokeWidth={2.6} />
                      </span>
                      <span className={featured ? 'text-white/85' : 'text-akv-navy/80'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={waLink(msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-7 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                    featured
                      ? 'bg-akv-blue text-white shadow-card hover:bg-white hover:text-akv-navy'
                      : 'bg-akv-navy text-white shadow-card hover:bg-akv-blue'
                  }`}
                >
                  {pkg.ctaLabel || (locale === 'en' ? 'Choose Package' : 'Pilih Paket')}
                  <Icon name="arrowRight" size={16} />
                </a>
              </motion.article>
            )
          })}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-card border-2 border-akv-navy/10 bg-akv-pale/70 px-5 py-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs font-medium leading-relaxed text-akv-navy/70 sm:text-sm">
            {t(locale, 'pricing.note')}{' '}
            <Link
              to="/syarat-ketentuan"
              className="font-bold text-akv-blue underline-offset-4 hover:underline"
            >
              {locale === 'en' ? 'Read Terms of Order' : 'Lihat Syarat & Ketentuan'}
            </Link>
            .
          </p>
          <a
            href={waLink(t(locale, 'pricing.waCustom'))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-akv-blue underline-offset-4 transition-colors hover:text-akv-royal hover:underline sm:text-sm"
          >
            {t(locale, 'pricing.customBtn')}
            <Icon name="arrowRight" size={15} />
          </a>
        </div>
      </div>
    </section>
  )
}
