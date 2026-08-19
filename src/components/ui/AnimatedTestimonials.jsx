import { useReducedMotion } from 'framer-motion'

/**
 * Testimoni bergulir (marquee "canopy") ala ScrollX-UI AnimatedTestimonials,
 * dibangun ulang untuk stack project ini (React + Tailwind v3, tanpa shadcn).
 *
 * - Dua baris bergulir berlawanan arah, jeda saat hover.
 * - Tepi kiri/kanan memudar lewat mask.
 * - prefers-reduced-motion: tampil sebagai grid statis.
 *
 * data: Array<{ name, role, quote }>
 */
export default function AnimatedTestimonials({ data, className = '', cardClassName = '' }) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <ul className={`grid gap-3 sm:gap-5 md:grid-cols-3 ${className}`}>
        {data.map((t, i) => (
          <li key={i}>
            <TestimonialCard t={t} className={cardClassName} />
          </li>
        ))}
      </ul>
    )
  }

  const reversed = [...data].reverse()

  return (
    <div className={`space-y-3 sm:space-y-5 ${className}`}>
      <MarqueeRow items={data} duration="46s" cardClassName={cardClassName} />
      <MarqueeRow items={reversed} duration="56s" reverse cardClassName={cardClassName} />
    </div>
  )
}

function MarqueeRow({ items, duration, reverse = false, cardClassName }) {
  return (
    <div
      className="group flex overflow-hidden [--gap:0.75rem] sm:[--gap:1.25rem]"
      style={{
        '--duration': duration,
        gap: 'var(--gap)',
        maskImage:
          'linear-gradient(to right, transparent, black 7%, black 93%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 7%, black 93%, transparent)',
      }}
    >
      {[0, 1].map((dup) => (
        <div
          key={dup}
          aria-hidden={dup === 1}
          className="flex shrink-0 animate-canopy-horizontal items-stretch gap-[var(--gap)] group-hover:[animation-play-state:paused]"
          style={reverse ? { animationDirection: 'reverse' } : undefined}
        >
          {items.map((t, i) => (
            <TestimonialCard key={`${dup}-${i}`} t={t} className={cardClassName} />
          ))}
        </div>
      ))}
    </div>
  )
}

function TestimonialCard({ t, className = '' }) {
  return (
    <figure
      className={`flex w-[200px] shrink-0 flex-col rounded-xl border border-akv-navy/10 bg-white p-3.5 shadow-card transition-colors duration-200 hover:border-akv-blue/40 sm:w-[280px] sm:rounded-feature sm:border-2 sm:p-5 ${className}`}
    >
      <svg
        width="20"
        height="15"
        viewBox="0 0 32 24"
        fill="none"
        aria-hidden="true"
        className="mb-2 text-akv-blue/30 sm:mb-3 sm:h-[21px] sm:w-[28px]"
      >
        <path
          d="M0 24V14.4C0 6.5 4.3 1.7 12.6 0l1.8 4.1c-4.4 1.3-6.6 3.8-6.9 7.2H13V24H0Zm19 0V14.4C19 6.5 23.3 1.7 31.6 0l1.8 4.1c-4.4 1.3-6.6 3.8-6.9 7.2H32V24H19Z"
          fill="currentColor"
        />
      </svg>
      <blockquote className="flex-1 text-xs leading-relaxed text-akv-navy/75 sm:text-sm">
        {t.quote}
      </blockquote>
      <figcaption className="mt-3 flex items-center gap-2.5 border-t border-akv-light pt-3 sm:mt-4 sm:gap-3 sm:pt-4">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-akv-light text-xs font-extrabold text-akv-blue sm:h-10 sm:w-10 sm:text-sm"
        >
          {t.name.charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-xs font-extrabold text-akv-navy sm:text-sm">{t.name}</span>
          <span className="block truncate text-[10px] font-medium text-akv-navy/55 sm:text-xs">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  )
}
