import { motion, useReducedMotion } from 'framer-motion'
import SectionHeading from './ui/SectionHeading.jsx'
import EdgeAsset from './ui/EdgeAsset.jsx'
import { useLocale, t } from '../data/i18n.js'

export default function Process() {
  const locale = useLocale()
  const reduce = useReducedMotion()
  const processSteps = t(locale, 'process.steps')

  return (
    <section id="proses" className="relative overflow-hidden bg-akv-navy py-14 sm:py-20 text-white md:py-28" aria-labelledby="proses-heading">
      <EdgeAsset src="/assets/deco-pen-tool-light.webp" side="right" top="10%" width={160} speed={48} rotate={5} opacity={0.6} />
      <div className="container-akv relative z-10">
        <div className="mx-auto mb-5 max-w-2xl text-center sm:mb-12 md:mb-16">
          <p className="mb-2 sm:mb-4">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.14em] text-akv-sky">
              {t(locale, 'process.eyebrow')}
            </span>
          </p>
          <h2 id="proses-heading" className="text-2xl font-extrabold uppercase tracking-tight sm:text-[2.1rem] lg:text-[2.4rem]">
            {t(locale, 'process.title')}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/65 sm:mt-4 sm:text-lg">
            {t(locale, 'process.desc')}
          </p>
        </div>

        {/* Mobile View: Compact Rundown Timeline (Fits in 1 Mobile Frame) */}
        <div className="relative rounded-2xl border border-white/15 bg-white/[0.05] p-3.5 backdrop-blur-sm sm:hidden shadow-lg">
          <div className="relative flex flex-col gap-2.5">
            {/* Vertical timeline line */}
            <span
              aria-hidden="true"
              className="absolute left-[13px] top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b from-akv-sky via-akv-blue/60 to-white/20"
            />
            {processSteps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={reduce ? false : { opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: '-20px' }}
                transition={{ duration: 0.35, delay: reduce ? 0 : i * 0.07 }}
                className="relative flex items-start gap-3 z-10"
              >
                {/* Rundown Step Badge */}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-akv-navy border border-akv-sky/70 text-akv-sky font-extrabold text-[10px] shadow-sm">
                  {step.num}
                </span>

                {/* Rundown Step Details */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-sm font-extrabold text-white leading-snug">{step.title}</h3>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/65">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop View: Standard Cards Grid */}
        <ol className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-5">
          {processSteps.map((step, i) => (
            <motion.li
              key={step.num}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.12, ease: [0.22, 0.65, 0.3, 1] }}
              className="relative rounded-feature border-2 border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition-colors duration-200 hover:border-akv-sky/50 hover:bg-white/10"
            >
              <span className="text-3xl font-extrabold text-akv-sky/90">{step.num}</span>
              <h3 className="mt-3 text-lg font-extrabold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{step.desc}</p>
              {i < processSteps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-4 top-1/2 hidden h-px w-3 bg-white/25 lg:block"
                />
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
