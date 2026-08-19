import SectionHeading from './ui/SectionHeading.jsx'
import EdgeAsset from './ui/EdgeAsset.jsx'
import AnimatedTestimonials from './ui/AnimatedTestimonials.jsx'
import { useContent } from '../data/store.js'
import { useLocale, t } from '../data/i18n.js'

export default function Testimonials() {
  const { testimonials } = useContent()
  const locale = useLocale()
  return (
    <section className="relative overflow-hidden bg-akv-pale py-14 sm:py-20 md:py-28" aria-labelledby="testimoni-heading">
      <EdgeAsset src="/assets/deco-nib-swash.webp" side="right" top="14%" width={150} speed={46} rotate={4} />
      <div className="container-akv relative z-10">
        <SectionHeading
          eyebrow={t(locale, 'testimonials.eyebrow')}
          title={<span id="testimoni-heading">{t(locale, 'testimonials.title')}</span>}
          desc={t(locale, 'testimonials.desc')}
        />
      </div>

      {/* marquee dibiarkan full-width supaya gulirannya terasa lega */}
      <div className="relative z-10">
        <AnimatedTestimonials data={testimonials} />
      </div>
    </section>
  )
}
