import Reveal from './ui/Reveal.jsx'
import SectionHeading from './ui/SectionHeading.jsx'
import EdgeAsset from './ui/EdgeAsset.jsx'
import { useContent } from '../data/store.js'
import { useLocale, t } from '../data/i18n.js'

export default function About() {
  const { teamMembers } = useContent()
  const locale = useLocale()

  return (
    <section id="tentang" className="relative overflow-hidden bg-white py-12 sm:py-20 md:py-28" aria-labelledby="tentang-heading">
      <EdgeAsset src="/assets/deco-pen-tool.webp" side="left" top="10%" width={165} speed={56} rotate={-4} />
      <EdgeAsset src="/assets/deco-copy-paste.webp" side="right" bottom="14%" width={185} speed={38} rotate={3} />
      <div className="container-akv relative z-10">
        <div className="flex flex-col gap-8 sm:grid sm:grid-cols-12 sm:items-center sm:gap-8 lg:gap-16">
          {/* Pegi illustration */}
          <Reveal className="relative mx-auto w-full max-w-[240px] sm:max-w-full sm:col-span-5 lg:col-span-5 lg:max-w-md">
            <div
              aria-hidden="true"
              className="absolute inset-x-2 sm:inset-x-6 bottom-0 top-3 sm:top-10 rounded-[24px] sm:rounded-[32px] bg-gradient-to-b from-akv-pale to-akv-light"
            />
            <img
              src="/assets/pegi-tablet.webp"
              alt={t(locale, 'about.pegiAlt')}
              loading="lazy"
              width="640"
              height="1000"
              draggable="false"
              className="relative z-10 mx-auto w-4/5 select-none drop-shadow-xl sm:w-4/5"
            />
            <div className="absolute -bottom-2 -left-1 sm:bottom-6 sm:left-0 z-20 rounded-xl border border-akv-navy/10 bg-white px-3 py-2 sm:px-4 sm:py-3 shadow-card sm:border-2">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-akv-navy/45">{t(locale, 'about.since')}</p>
              <p className="text-base sm:text-2xl font-extrabold text-akv-blue">2023</p>
            </div>
          </Reveal>

          {/* Copy & Team */}
          <div className="sm:col-span-7 lg:col-span-7">
            <SectionHeading
              align="left"
              eyebrow={t(locale, 'about.eyebrow')}
              title={<span id="tentang-heading">{t(locale, 'about.title')}</span>}
            />
            <Reveal delay={0.1}>
              <p
                className="-mt-3 text-sm leading-relaxed text-akv-navy/75 sm:-mt-6 sm:text-base sm:leading-relaxed lg:text-lg"
                dangerouslySetInnerHTML={{ __html: t(locale, 'about.p1') }}
              />
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-2 text-sm leading-relaxed text-akv-navy/75 sm:mt-4 sm:text-base sm:leading-relaxed lg:text-lg">
                {t(locale, 'about.p2')}
              </p>
            </Reveal>

            {/* Founder credits — inline after copy */}
            <Reveal delay={0.26}>
              <div className="mt-5 sm:mt-7">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-akv-navy/45 mb-2.5">
                  {locale === 'id' ? 'Pendiri & Tim Kreatif' : 'Founders & Creative Team'}
                </p>
                <ul className="flex flex-wrap gap-x-5 gap-y-3 sm:gap-x-7">
                  {teamMembers.map((member) => {
                    const Tag = member.url ? 'a' : 'span'
                    const linkProps = member.url
                      ? { href: member.url, target: '_blank', rel: 'noopener noreferrer', itemProp: 'url' }
                      : {}
                    return (
                      <li
                        key={member.name}
                        itemScope
                        itemType="https://schema.org/Person"
                        className="flex items-center gap-2.5"
                      >
                        <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-akv-pale text-[10px] font-bold text-akv-blue sm:h-8 sm:w-8 sm:text-xs">
                          {member.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </span>
                        <Tag
                          {...linkProps}
                          className={`leading-tight ${member.url ? 'transition-colors hover:text-akv-blue' : ''}`}
                        >
                          <span itemProp="name" className="block text-sm font-bold text-akv-navy sm:text-sm">{member.name}</span>
                          <span itemProp="jobTitle" className="block text-[11px] text-akv-navy/50 sm:text-[11px]">{member.role}</span>
                        </Tag>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
