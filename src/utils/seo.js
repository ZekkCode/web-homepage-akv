import { useEffect } from 'react'

const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

function upsertMeta(attrName, attrValue, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attrName, attrValue)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Sinkronisasi title, meta description, robots, canonical, dan Open Graph
 * per halaman dan per bahasa (id / en).
 */
export function usePageSeo({
  title,
  description,
  robots = DEFAULT_ROBOTS,
  canonical,
  locale = 'id',
}) {
  useEffect(() => {
    if (title) {
      document.title = title
      upsertMeta('property', 'og:title', title)
      upsertMeta('name', 'twitter:title', title)
    }

    if (description) {
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:description', description)
      upsertMeta('name', 'twitter:description', description)
    }

    if (robots) {
      upsertMeta('name', 'robots', robots)
      upsertMeta('name', 'googlebot', robots)
    }

    if (canonical) {
      upsertLink('canonical', canonical)
      upsertMeta('property', 'og:url', canonical)
      upsertMeta('name', 'twitter:url', canonical)
    }

    upsertMeta('property', 'og:locale', locale === 'en' ? 'en_US' : 'id_ID')
  }, [title, description, robots, canonical, locale])
}
