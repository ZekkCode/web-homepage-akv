import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import SectionHeading from './ui/SectionHeading.jsx'
import Icon from './ui/Icon.jsx'
import EdgeAsset from './ui/EdgeAsset.jsx'
import { useContent, waLink } from '../data/store.js'
import { useLocale, t } from '../data/i18n.js'
import { useInfiniteHorizontalScroll } from '../hooks/useInfiniteHorizontalScroll.js'

export default function Portfolio() {
  const { portfolioItems: adminItems } = useContent()
  const locale = useLocale()
  const reduce = useReducedMotion()

  const filters = t(locale, 'portfolio.filters')
  const filterAll = filters[0] // 'Semua' or 'All'
  const [active, setActive] = useState(filterAll)

  // Merge admin data (image, tone) with i18n labels
  const i18nItems = t(locale, 'portfolio.items')
  const portfolioItems = adminItems.map((adminItem, idx) => ({
    ...adminItem,
    title: i18nItems[idx]?.title ?? adminItem.title,
    category: i18nItems[idx]?.category ?? adminItem.category,
  }))

  // Build category map: i18n filter label → list of i18n categories
  // filters[0] = All, filters[1..n] map to unique categories in order
  const items =
    active === filterAll
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === active)

  const tripleItems = [...items, ...items, ...items]
  const scrollRef = useInfiniteHorizontalScroll([active, items.length])

  const waMsgPrefix = t(locale, 'portfolio.waMsg')

  return (
    <section id="portofolio" className="relative overflow-hidden bg-white py-14 sm:py-20 md:py-28" aria-labelledby="portofolio-heading">
      <EdgeAsset src="/assets/deco-tool-flyout.webp" side="left" top="8%" width={225} speed={52} rotate={-2} />
      <EdgeAsset src="/assets/deco-tape.webp" side="right" bottom="12%" width={250} speed={44} rotate={0} />
      <div className="container-akv relative z-10">
        <SectionHeading
          eyebrow={t(locale, 'portfolio.eyebrow')}
          title={<span id="portofolio-heading">{t(locale, 'portfolio.title')}</span>}
          desc={t(locale, 'portfolio.desc')}
        />

        {/* Filter buttons */}
        <div
          role="tablist"
          aria-label={t(locale, 'portfolio.filterAriaLabel')}
          data-lenis-prevent
          className="mb-6 flex overflow-x-auto whitespace-nowrap no-scrollbar gap-2 pb-2 touch-pan-x overscroll-x-contain sm:flex-wrap sm:justify-center sm:overflow-visible sm:whitespace-normal sm:touch-auto sm:overscroll-auto"
        >
          {filters.map((filter) => {
            const selected = active === filter
            return (
              <button
                key={filter}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(filter)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold transition-all duration-200 sm:border-2 sm:px-5 sm:py-2.5 sm:text-sm ${
                  selected
                    ? 'border-akv-blue bg-akv-blue text-white shadow-card'
                    : 'border-akv-navy/10 bg-white text-akv-navy/70 hover:border-akv-blue/50 hover:text-akv-blue'
                }`}
              >
                {filter}
              </button>
            )
          })}
        </div>

        {/* Mobile: Infinite Bi-Directional Horizontal Carousel (Left & Right Swipe from State 0) */}
        <ul
          ref={scrollRef}
          data-lenis-prevent
          className="flex overflow-x-auto snap-x snap-mandatory gap-3 px-5 -mx-5 pb-4 pt-1 no-scrollbar sm:hidden touch-pan-x overscroll-x-contain"
        >
          {tripleItems.map((item, i) => (
            <motion.li
              key={`${item.id}-${i}`}
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 0.65, 0.3, 1] }}
              className="group relative overflow-hidden rounded-xl border border-akv-navy/10 bg-white shadow-card w-[220px] shrink-0 snap-start"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div
                  className={`flex aspect-[4/3] w-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br ${item.tone} text-white/80 p-2 text-center`}
                >
                  <Icon name="image" size={20} />
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                    Placeholder
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="min-w-0 pr-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-akv-blue">
                    {item.category}
                  </p>
                  <h3 className="text-sm font-extrabold text-akv-navy truncate">{item.title}</h3>
                </div>
                <a
                  href={waLink(`${waMsgPrefix} "${item.title}".`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t(locale, 'portfolio.viewDetailAria')} ${item.title}`}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-akv-light text-akv-blue shrink-0"
                >
                  <Icon name="arrowRight" size={14} />
                </a>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* Desktop: Standard Grid */}
        <motion.ul layout={!reduce} className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.li
                layout={!reduce}
                key={item.id}
                initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, ease: [0.22, 0.65, 0.3, 1] }}
                className="group relative overflow-hidden rounded-feature border-2 border-akv-navy/10 bg-white shadow-card"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div
                    className={`flex aspect-[4/3] w-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br ${item.tone} text-white/80 p-2 text-center`}
                  >
                    <Icon name="image" size={24} />
                    <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                      Placeholder
                    </span>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-akv-navy/85 via-akv-navy/30 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-akv-sky">
                    {item.category}
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold text-white">{item.title}</h3>
                  <a
                    href={waLink(`${waMsgPrefix} "${item.title}".`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-akv-navy transition-colors hover:bg-akv-light"
                  >
                    {t(locale, 'portfolio.viewDetail')}
                    <Icon name="arrowRight" size={14} />
                  </a>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  )
}
