import { useEffect, useState } from 'react'
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
  const filterAll = filters[0]
  const [active, setActive] = useState(filterAll)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    setActive(filterAll)
  }, [filterAll])

  useEffect(() => {
    if (!selectedItem) return
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedItem(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedItem])

  // Merge admin data (image, tone, description) with i18n labels for EN
  const i18nItems = t(locale, 'portfolio.items')
  const portfolioItems = adminItems.map((adminItem, idx) => ({
    ...adminItem,
    title: locale === 'en' ? (i18nItems[idx]?.title ?? adminItem.title) : adminItem.title,
    category: locale === 'en' ? (i18nItems[idx]?.category ?? adminItem.category) : adminItem.category,
    description:
      locale === 'en'
        ? (i18nItems[idx]?.description ?? adminItem.description ?? '')
        : (adminItem.description ?? ''),
  }))

  const items =
    active === filterAll
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === active)

  const tripleItems = [...items, ...items, ...items]
  const scrollRef = useInfiniteHorizontalScroll([active, items.length])

  const waMsgPrefix = t(locale, 'portfolio.waMsg')

  return (
    <section id="portofolio" className="relative overflow-hidden bg-akv-pale/60 py-14 sm:py-20 md:py-28" aria-labelledby="portofolio-heading">
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
                type="button"
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

        {/* Mobile: Infinite Bi-Directional Horizontal Carousel */}
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
              <button
                type="button"
                onClick={() => setSelectedItem(item)}
                className="block w-full text-left"
                aria-label={`${t(locale, 'portfolio.viewDetailAria')} ${item.title}`}
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
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-akv-light text-akv-blue shrink-0">
                    <Icon name="eye" size={14} />
                  </span>
                </div>
              </button>
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
                    className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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

                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-akv-navy/90 via-akv-navy/35 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-akv-sky">
                    {item.category}
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold text-white">{item.title}</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="pointer-events-auto mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-akv-navy transition-colors hover:bg-akv-light"
                  >
                    {t(locale, 'portfolio.viewDetail')}
                    <Icon name="eye" size={14} />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      {/* Modal Detail Portofolio */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-modal-title"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-akv-navy/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.22, ease: [0.22, 0.65, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl overflow-hidden rounded-feature border-2 border-akv-navy/15 bg-white shadow-panel"
            >
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label={t(locale, 'portfolio.modalClose')}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-akv-navy shadow-card transition-colors hover:bg-akv-blue hover:text-white"
              >
                <Icon name="close" size={18} />
              </button>

              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="aspect-[4/3] w-full bg-akv-pale object-cover"
                />
              ) : (
                <div
                  className={`flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-gradient-to-br ${selectedItem.tone} px-6 text-center text-white/85`}
                >
                  <Icon name="image" size={32} />
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    Placeholder
                  </span>
                  <p className="max-w-sm text-xs text-white/80">
                    {t(locale, 'portfolio.modalPlaceholderNote')}
                  </p>
                </div>
              )}

              <div className="p-5 sm:p-6">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-akv-blue">
                  {selectedItem.category}
                </p>
                <h3 id="portfolio-modal-title" className="mt-1 text-xl font-extrabold text-akv-navy">
                  {selectedItem.title}
                </h3>
                {selectedItem.description && (
                  <p className="mt-2 text-sm leading-relaxed text-akv-navy/70">
                    {selectedItem.description}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={waLink(`${waMsgPrefix} "${selectedItem.title}" (${selectedItem.category}). Boleh lihat detail dan estimasinya?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary !py-2.5 !text-sm"
                  >
                    <Icon name="whatsapp" size={16} />
                    {t(locale, 'portfolio.modalOrder')}
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="btn-secondary !py-2.5 !text-sm"
                  >
                    {t(locale, 'portfolio.modalClose')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
