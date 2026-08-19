import { Component } from 'react'
import Icon from './ui/Icon.jsx'
import { getLocale, t } from '../data/i18n.js'

/**
 * Menangkap error runtime di tree React agar halaman tidak blank putih.
 * ponytail: class component wajib — React belum punya hook error boundary.
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // ponytail: ganti console dengan reporting service (Sentry dll) saat skala naik
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    // ponytail: class component tidak bisa pakai hook, jadi panggil getLocale() langsung
    const locale = getLocale()

    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-gradient-to-b from-white via-akv-pale to-akv-light px-4">
        <div className="text-center">
          <p className="eyebrow mb-3">{t(locale, 'error.eyebrow')}</p>
          <h1 className="text-2xl font-extrabold text-akv-navy sm:text-3xl">
            {t(locale, 'error.title1')}<span className="text-akv-blue">{t(locale, 'error.title2')}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-akv-navy/65">
            {t(locale, 'error.desc')}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              {t(locale, 'error.reload')}
              <Icon name="arrowRight" size={16} />
            </button>
            <a href="/" className="btn-secondary">
              {t(locale, 'error.home')}
            </a>
          </div>
        </div>
      </main>
    )
  }
}
