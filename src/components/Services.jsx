import { motion, useReducedMotion } from 'framer-motion'
import SectionHeading from './ui/SectionHeading.jsx'
import Icon from './ui/Icon.jsx'
import EdgeAsset from './ui/EdgeAsset.jsx'
import { useContent, waLink } from '../data/store.js'
import { useLocale, t } from '../data/i18n.js'
import { useInfiniteHorizontalScroll } from '../hooks/useInfiniteHorizontalScroll.js'

export default function Services() {
  const { services: adminServices } = useContent()
  const locale = useLocale()
  const reduce = useReducedMotion()

  const services = locale === 'id' ? adminServices : t(locale, 'services.items')
  const tripleServices = [...services, ...services, ...services]
  const scrollRef = useInfiniteHorizontalScroll([services.length])
  const waPrefix = t(locale, 'services.waPrefix')
  const orderBtn = t(locale, 'services.orderBtn')

  const buildOrderUrl = (service) => {
    const pricePart = service.price ? ` (${service.price})` : ''
    return waLink(`${waPrefix} ${service.title}${pricePart}. Boleh diskusi brief?`)
  }

  return (
    <section id="layanan" className="relative overflow-hidden bg-akv-pale py-14 sm:py-20 md:py-28" aria-labelledby="layanan-heading">
      <EdgeAsset src="/assets/deco-toolbar.webp" side="right" top="12%" width={60} speed={60} rotate={0} />
      <EdgeAsset src="/assets/deco-nib-swash.webp" side="left" bottom="10%" width={165} speed={42} rotate={-3} />
      <div className="container-akv relative z-10">
        <SectionHeading
          eyebrow={t(locale, 'services.eyebrow')}
          title={<span id="layanan-heading">{t(locale, 'services.title')}</span>}
          desc={t(locale, 'services.desc')}
        />

        {/* Mobile View: Bi-Directional Infinite Horizontal Carousel */}
        <ul
          ref={scrollRef}
          data-lenis-prevent
          className="flex overflow-x-auto snap-x snap-mandatory gap-3 px-5 -mx-5 pb-4 pt-1 no-scrollbar sm:hidden touch-pan-x overscroll-x-contain"
        >
          {tripleServices.map((service, i) => (
            <motion.li
              key={`${service.title}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.45, delay: reduce ? 0 : (i % 4) * 0.08, ease: [0.22, 0.65, 0.3, 1] }}
              className="group flex w-[228px] shrink-0 snap-start flex-col rounded-xl border border-akv-navy/10 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:border-akv-blue/40 hover:shadow-card-hover"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-akv-light text-akv-blue transition-colors duration-200 group-hover:bg-akv-blue group-hover:text-white">
                  <Icon name={service.icon} size={20} />
                </span>
                {service.duration && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-akv-pale px-2.5 py-1 text-[10px] font-bold text-akv-navy/65">
                    <Icon name="clock" size={11} />
                    {service.duration}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-extrabold text-akv-navy">{service.title}</h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-akv-navy/65">{service.desc}</p>
              <div className="mt-3.5 border-t border-akv-light pt-3">
                {service.price && (
                  <p className="text-xs font-extrabold text-akv-blue">{service.price}</p>
                )}
                <a
                  href={buildOrderUrl(service)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-akv-navy transition-colors hover:text-akv-blue"
                >
                  {orderBtn}
                  <Icon name="arrowRight" size={13} />
                </a>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* Desktop View: Standard Grid */}
        <ul className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {services.map((service, i) => (
            <motion.li
              key={service.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.45, delay: reduce ? 0 : (i % 4) * 0.08, ease: [0.22, 0.65, 0.3, 1] }}
              className="group flex flex-col rounded-feature border-2 border-akv-navy/10 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:border-akv-blue/40 hover:shadow-card-hover"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-akv-light text-akv-blue transition-colors duration-200 group-hover:bg-akv-blue group-hover:text-white">
                  <Icon name={service.icon} size={22} />
                </span>
                {service.duration && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-akv-pale px-2.5 py-1 text-[11px] font-bold text-akv-navy/65">
                    <Icon name="clock" size={12} />
                    {service.duration}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-extrabold text-akv-navy">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-akv-navy/65">{service.desc}</p>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-akv-light pt-3.5">
                {service.price ? (
                  <span className="text-sm font-extrabold text-akv-blue">{service.price}</span>
                ) : (
                  <span />
                )}
                <a
                  href={buildOrderUrl(service)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-akv-navy transition-colors hover:text-akv-blue"
                >
                  {orderBtn}
                  <Icon name="arrowRight" size={14} />
                </a>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
