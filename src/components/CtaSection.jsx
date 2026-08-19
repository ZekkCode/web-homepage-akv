import Reveal from './ui/Reveal.jsx'
import Icon from './ui/Icon.jsx'
import EdgeAsset from './ui/EdgeAsset.jsx'
import { useContent, waLink } from '../data/store.js'
import { useLocale, t } from '../data/i18n.js'

export default function CtaSection() {
  const { contact } = useContent()
  const locale = useLocale()
  return (
    <section
      id="kontak"
      className="relative overflow-hidden bg-white py-14 sm:py-20 md:py-28"
      aria-labelledby="cta-heading"
    >
      <EdgeAsset src="/assets/deco-pen-tool.webp" side="left" top="16%" width={150} speed={48} rotate={-6} />
      <div className="container-akv relative z-10">
        <Reveal>
          {/* Panel tanpa overflow-hidden supaya Pegi bisa "keluar" dari kartu */}
          <div className="relative rounded-[32px] bg-gradient-to-br from-akv-navy via-akv-navy-soft to-akv-royal px-5 py-8 text-white sm:px-12 md:px-16 md:py-16">
            {/* blob dekoratif tetap terpotong rapi di dalam panel */}
            <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[32px]">
              <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-akv-blue/20 blur-3xl" />
              <div className="absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-akv-sky/15 blur-3xl" />
            </div>

            <div className="relative z-10 grid grid-cols-12 items-center gap-4 lg:pr-80">
              <div className="col-span-12 text-left">
                <h2 id="cta-heading" className="text-xl font-extrabold uppercase tracking-tight sm:text-4xl">
                  {t(locale, 'cta.title')}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/70 sm:mt-4 sm:text-lg">
                  {t(locale, 'cta.desc')}
                </p>
                <div className="mt-4 flex flex-row items-center gap-2.5 sm:mt-8 sm:gap-3">
                  <a
                    href={waLink(t(locale, 'wa.default'))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-akv-navy shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-akv-light active:translate-y-0 active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-base"
                  >
                    {t(locale, 'cta.btn1')}
                    <Icon name="arrowRight" size={14} />
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white/10 active:translate-y-0 active:scale-[0.98] sm:border-2 sm:px-7 sm:py-3.5 sm:text-base"
                  >
                    {t(locale, 'cta.btn2')}
                  </a>
                </div>
              </div>
            </div>

            {/* Pegi illustration */}
            <img
              src="/assets/pegi-megaphone.webp"
              alt={t(locale, 'cta.pegiAlt')}
              loading="lazy"
              width="512"
              height="700"
              draggable="false"
              className="pointer-events-none absolute -bottom-2 right-3 z-20 w-24 select-none drop-shadow-2xl sm:bottom-0 sm:right-8 sm:w-56 lg:right-10 lg:w-64 xl:right-14 xl:w-72"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
