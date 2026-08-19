import { motion, useReducedMotion } from 'framer-motion'
import SectionHeading from './ui/SectionHeading.jsx'
import Icon from './ui/Icon.jsx'
import EdgeAsset from './ui/EdgeAsset.jsx'
import { useLocale, t } from '../data/i18n.js'
import { useInfiniteHorizontalScroll } from '../hooks/useInfiniteHorizontalScroll.js'

export default function WhyAkv() {
  const locale = useLocale()
  const reduce = useReducedMotion()
  const benefits = t(locale, 'why.benefits')
  const tripleBenefits = [...benefits, ...benefits, ...benefits]
  const scrollRef = useInfiniteHorizontalScroll([benefits.length])

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-20 md:py-28" aria-labelledby="kenapa-heading">
      <EdgeAsset src="/assets/deco-pen-tool.webp" side="right" bottom="14%" width={155} speed={44} rotate={7} />
      <div className="container-akv relative z-10">
        <SectionHeading
          eyebrow={t(locale, 'why.eyebrow')}
          title={<span id="kenapa-heading">{t(locale, 'why.title')}</span>}
          desc={t(locale, 'why.desc')}
        />

        {/* Mobile: Infinite Bi-Directional Horizontal Carousel (Left & Right Swipe from State 0) */}
        <ul
          ref={scrollRef}
          data-lenis-prevent
          className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 no-scrollbar sm:hidden touch-pan-x overscroll-x-contain"
        >
          {tripleBenefits.map((benefit, i) => (
            <motion.li
              key={`${benefit.title}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.45, delay: reduce ? 0 : (i % 4) * 0.09, ease: [0.22, 0.65, 0.3, 1] }}
              className="rounded-xl border border-akv-navy/10 bg-akv-pale/70 p-4 text-center w-[200px] shrink-0 snap-start transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-card-hover"
            >
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-akv-blue shadow-card">
                <Icon name={benefit.icon} size={20} />
              </span>
              <h3 className="text-sm font-extrabold text-akv-navy">{benefit.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-akv-navy/65">{benefit.desc}</p>
            </motion.li>
          ))}
        </ul>

        {/* Desktop: Standard Grid */}
        <ul className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {benefits.map((benefit, i) => (
            <motion.li
              key={benefit.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.09, ease: [0.22, 0.65, 0.3, 1] }}
              className="rounded-feature border-2 border-akv-navy/10 bg-akv-pale/70 p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-card-hover"
            >
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-akv-blue shadow-card">
                <Icon name={benefit.icon} size={24} />
              </span>
              <h3 className="text-lg font-extrabold text-akv-navy">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-akv-navy/65">{benefit.desc}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
