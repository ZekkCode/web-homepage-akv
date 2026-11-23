import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import SectionHeading from './ui/SectionHeading.jsx'
import Icon from './ui/Icon.jsx'
import { useContent, waLink } from '../data/store.js'
import { useLocale, t } from '../data/i18n.js'

export default function Faq() {
  const { faqs: adminFaqs } = useContent()
  const locale = useLocale()
  const reduce = useReducedMotion()
  const [openIndex, setOpenIndex] = useState(0)

  const items = locale === 'id' ? adminFaqs : t(locale, 'faq.items')

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-white py-14 sm:py-20 md:py-28"
      aria-labelledby="faq-heading"
    >
      <div className="container-akv relative z-10 max-w-4xl">
        <SectionHeading
          eyebrow={t(locale, 'faq.eyebrow')}
          title={<span id="faq-heading">{t(locale, 'faq.title')}</span>}
          desc={t(locale, 'faq.desc')}
        />

        <div className="space-y-3">
          {items.map((item, idx) => {
            const open = openIndex === idx
            const panelId = `faq-panel-${idx}`
            return (
              <div
                key={`${item.question}-${idx}`}
                className={`rounded-card border-2 transition-colors duration-200 ${
                  open
                    ? 'border-akv-blue/40 bg-akv-pale/70 shadow-card'
                    : 'border-akv-navy/10 bg-white hover:border-akv-blue/30'
                }`}
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? -1 : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="text-sm font-extrabold text-akv-navy sm:text-base">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                        open
                          ? 'rotate-180 bg-akv-blue text-white'
                          : 'bg-akv-light text-akv-blue'
                      }`}
                    >
                      <Icon name="chevronDown" size={16} />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={panelId}
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 0.65, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-xs leading-relaxed text-akv-navy/75 sm:px-6 sm:pb-6 sm:text-sm">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
          <span className="text-xs font-semibold text-akv-navy/60 sm:text-sm">
            {t(locale, 'faq.ctaText')}
          </span>
          <a
            href={waLink(t(locale, 'wa.default'))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-akv-blue/25 bg-akv-pale px-4 py-2 text-xs font-extrabold text-akv-blue transition-colors hover:border-akv-blue hover:bg-akv-blue hover:text-white sm:text-sm"
          >
            <Icon name="whatsapp" size={15} />
            {t(locale, 'faq.ctaBtn')}
          </a>
        </div>
      </div>
    </section>
  )
}
