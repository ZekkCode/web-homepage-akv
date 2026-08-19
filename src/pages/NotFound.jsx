import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon.jsx'
import { useLocale, t } from '../data/i18n.js'

export default function NotFound() {
  const locale = useLocale()
  useEffect(() => { document.title = t(locale, 'notFound.pageTitle') }, [locale])

  return (
    <main className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-white via-akv-pale to-akv-light px-4">
      {/* grid kotak halus, konsisten dengan hero */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(30,60,143,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,60,143,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="container-akv relative z-10 flex flex-col items-center text-center">
        <img
          src="/assets/pegi-point.webp"
          alt={t(locale, 'notFound.pegiAlt')}
          width="512"
          height="930"
          draggable="false"
          className="mx-auto mb-3 w-24 select-none drop-shadow-xl sm:w-28 md:w-32 lg:w-36"
        />
        <p className="eyebrow mb-2">{t(locale, 'notFound.eyebrow')}</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-akv-navy sm:text-4xl lg:text-5xl">
          {t(locale, 'notFound.title1')}<span className="text-akv-blue">{t(locale, 'notFound.title2')}</span>
        </h1>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-akv-navy/65 sm:mt-3 sm:text-sm lg:text-base">
          {t(locale, 'notFound.desc')}
        </p>
        <Link to="/" className="btn-primary mt-5 inline-flex items-center gap-2 !px-6 !py-3 text-xs sm:text-sm">
          {t(locale, 'notFound.btn')}
          <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    </main>
  )
}
