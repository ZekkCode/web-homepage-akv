import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon.jsx'
import { useContent, waLink } from '../data/store.js'
import { useLocale, setLocale } from '../data/i18n.js'

/**
 * Kerangka halaman legal (Syarat & Ketentuan Order / Kebijakan Privasi).
 * Ringkas, mudah dibaca di mobile & desktop, konsisten 100% dengan palet AKV.
 */
export default function LegalLayout({ active, eyebrow, title, subtitle, updatedAt, sections }) {
  const { contact } = useContent()
  const locale = useLocale()
  const isEn = locale === 'en'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [active])

  return (
    <div className="min-h-[100svh] bg-akv-pale text-akv-navy">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-akv-light bg-white/90 backdrop-blur-xl">
        <div className="container-akv flex h-14 items-center justify-between gap-3 md:h-16">
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="AKV Beranda">
            <img
              src="/assets/logo-akv.webp"
              alt="Logo AKV, Arah Karya Visual"
              className="h-8 w-auto select-none md:h-9"
              width="120"
              height="40"
              draggable="false"
            />
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLocale(isEn ? 'id' : 'en')}
              aria-label={isEn ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-akv-navy/10 bg-white text-[11px] font-extrabold text-akv-navy/70 transition-colors hover:border-akv-blue hover:text-akv-blue"
            >
              {isEn ? 'ID' : 'EN'}
            </button>
            <Link
              to="/"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border-2 border-akv-navy/15 bg-white px-4 py-1.5 text-xs font-bold text-akv-navy transition-colors hover:border-akv-blue hover:text-akv-blue sm:text-sm"
            >
              {isEn ? 'Back to Home' : 'Ke Beranda'}
            </Link>
          </div>
        </div>
      </header>

      <main className="container-akv max-w-4xl py-10 sm:py-14 md:py-16">
        {/* Switcher tab antar dokumen legal */}
        <nav
          aria-label={isEn ? 'Legal documents' : 'Dokumen legal'}
          className="mb-6 flex flex-wrap gap-2"
        >
          <Link
            to="/syarat-ketentuan"
            className={`rounded-full border-2 px-4 py-2 text-xs font-extrabold transition-colors sm:text-sm ${
              active === 'terms'
                ? 'border-akv-blue bg-akv-blue text-white'
                : 'border-akv-navy/10 bg-white text-akv-navy/70 hover:border-akv-blue/50 hover:text-akv-blue'
            }`}
          >
            {isEn ? 'Terms of Order' : 'Syarat & Ketentuan Order'}
          </Link>
          <Link
            to="/privasi"
            className={`rounded-full border-2 px-4 py-2 text-xs font-extrabold transition-colors sm:text-sm ${
              active === 'privacy'
                ? 'border-akv-blue bg-akv-blue text-white'
                : 'border-akv-navy/10 bg-white text-akv-navy/70 hover:border-akv-blue/50 hover:text-akv-blue'
            }`}
          >
            {isEn ? 'Privacy Policy' : 'Kebijakan Privasi'}
          </Link>
        </nav>

        {/* Header dokumen */}
        <article className="rounded-feature border-2 border-akv-navy/10 bg-white p-6 shadow-card sm:p-8 md:p-10">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-akv-navy sm:text-3xl md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-akv-navy/70 sm:text-base">
            {subtitle}
          </p>
          <p className="mt-3 text-xs font-bold text-akv-navy/45">
            {isEn ? 'Last updated:' : 'Terakhir diperbarui:'} {updatedAt}
          </p>

          <div className="mt-8 space-y-6 border-t border-akv-light pt-8">
            {sections.map((sec, idx) => (
              <section key={sec.heading} aria-labelledby={`legal-sec-${idx}`}>
                <h2
                  id={`legal-sec-${idx}`}
                  className="text-base font-extrabold text-akv-navy sm:text-lg"
                >
                  {idx + 1}. {sec.heading}
                </h2>
                {sec.paragraphs?.map((p, i) => (
                  <p
                    key={i}
                    className="mt-2 text-sm leading-relaxed text-akv-navy/75"
                  >
                    {p}
                  </p>
                ))}
                {sec.bullets && (
                  <ul className="mt-2.5 space-y-1.5 text-sm leading-relaxed text-akv-navy/75">
                    {sec.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-akv-blue"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Footer aksi */}
          <div className="mt-10 flex flex-col gap-4 rounded-card border-2 border-akv-light bg-akv-pale/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold text-akv-navy">
                {isEn ? 'Need clarification before ordering?' : 'Ada yang ingin ditanyakan sebelum pesan?'}
              </p>
              <p className="mt-0.5 text-xs text-akv-navy/65">
                {isEn
                  ? `Contact AKV via WhatsApp or email ${contact.email}.`
                  : `Hubungi AKV lewat WhatsApp atau email ke ${contact.email}.`}
              </p>
            </div>
            <a
              href={waLink(
                isEn
                  ? 'Hi AKV! I have a question regarding your terms and order process.'
                  : 'Halo AKV! Saya ingin bertanya mengenai syarat dan alur pemesanan.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary shrink-0 !py-2.5 !text-sm"
            >
              <Icon name="whatsapp" size={16} />
              {isEn ? 'Chat on WhatsApp' : 'Tanya via WhatsApp'}
            </a>
          </div>
        </article>
      </main>
    </div>
  )
}
