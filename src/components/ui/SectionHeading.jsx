import Reveal from './Reveal.jsx'

export default function SectionHeading({ eyebrow, title, desc, align = 'center' }) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={`max-w-2xl ${alignCls} mb-8 sm:mb-10 md:mb-16`}>
      {eyebrow && (
        <Reveal as="p" className="mb-2 sm:mb-4">
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-akv-navy sm:text-[2.1rem] lg:text-[2.4rem] lg:leading-[1.15]">
          {title}
        </h2>
      </Reveal>
      {desc && (
        <Reveal delay={0.16}>
          <p className="mt-2 text-sm leading-relaxed text-akv-navy/70 sm:mt-4 sm:text-base lg:text-lg">{desc}</p>
        </Reveal>
      )}
    </div>
  )
}
