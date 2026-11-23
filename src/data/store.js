/**
 * Store konten AKV.
 *
 * Sumber data utama: Supabase. Fallback: static data dari site.js.
 * Landing page membaca konten lewat useContent() sehingga edit dari
 * dashboard admin langsung tampil.
 *
 * Setiap tabel di-hydrate secara independen agar tabel baru (pricing_packages,
 * faqs) atau kolom opsional tetap fallback bersih ke site.js bila migrasi SQL
 * belum dijalankan di Supabase.
 */
import { useSyncExternalStore } from 'react'
import { supabase } from '../utils/supabase.js'
import {
  contact as defaultContact,
  services as defaultServices,
  pricingPackages as defaultPackages,
  portfolioItems as defaultPortfolio,
  testimonials as defaultTestimonials,
  faqs as defaultFaqs,
  teamMembers as defaultTeam,
} from './site.js'

const STORAGE_KEY = 'akv-content'

const defaults = () => ({
  contact: { ...defaultContact },
  services: defaultServices.map((s) => ({ ...s })),
  pricingPackages: defaultPackages.map((p) => ({ ...p, features: [...p.features] })),
  portfolioItems: defaultPortfolio.map((p) => ({ ...p })),
  testimonials: defaultTestimonials.map((t) => ({ ...t })),
  faqs: defaultFaqs.map((f) => ({ ...f })),
  teamMembers: defaultTeam.map((m) => ({ ...m })),
})

function mergeServiceDefaults(items) {
  return items.map((item, idx) => {
    const fallback =
      defaultServices.find((d) => d.title.toLowerCase() === String(item.title || '').toLowerCase()) ||
      defaultServices[idx]
    return {
      ...item,
      price: item.price ?? fallback?.price ?? '',
      duration: item.duration ?? fallback?.duration ?? '',
    }
  })
}

function mergePortfolioDefaults(items) {
  return items.map((item, idx) => {
    const fallback = defaultPortfolio[idx]
    return {
      ...item,
      description: item.description ?? fallback?.description ?? '',
    }
  })
}

function normalizePackages(items) {
  return items.map((p) => ({
    name: p.name || '',
    badge: p.badge || '',
    price: p.price || '',
    unit: p.unit || 'per proyek',
    desc: p.desc || '',
    featured: Boolean(p.featured),
    ctaLabel: p.cta_label ?? p.ctaLabel ?? 'Pilih Paket',
    features: Array.isArray(p.features)
      ? p.features
      : typeof p.features === 'string'
        ? p.features.split('\n').map((s) => s.trim()).filter(Boolean)
        : [],
  }))
}

/** Attempt load from localStorage (offline cache). */
function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults()
    const saved = JSON.parse(raw)
    const base = defaults()
    return {
      ...base,
      ...saved,
      services: Array.isArray(saved.services) ? mergeServiceDefaults(saved.services) : base.services,
      portfolioItems: Array.isArray(saved.portfolioItems)
        ? mergePortfolioDefaults(saved.portfolioItems)
        : base.portfolioItems,
      pricingPackages:
        Array.isArray(saved.pricingPackages) && saved.pricingPackages.length > 0
          ? normalizePackages(saved.pricingPackages)
          : base.pricingPackages,
      faqs: Array.isArray(saved.faqs) && saved.faqs.length > 0 ? saved.faqs : base.faqs,
    }
  } catch {
    return defaults()
  }
}

let cache = loadLocal()
const listeners = new Set()

function emit() {
  listeners.forEach((fn) => fn())
}

function persistLocal(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* storage penuh/di-block */
  }
}

// --- Supabase fetch ---

async function fetchTableSafe(table) {
  try {
    const { data, error } = await supabase.from(table).select('*').order('id')
    if (error || !Array.isArray(data) || data.length === 0) return null
    return data
  } catch {
    return null
  }
}

async function fetchContactSafe() {
  try {
    const r = await supabase.from('contact').select('*').limit(1).single()
    if (r.error || !r.data) return null
    const { id, ...rest } = r.data
    return rest
  } catch {
    return null
  }
}

/** Fetch semua data dari Supabase secara independen, fallback ke static/local per tabel. */
export async function hydrate() {
  const [contact, services, portfolioItems, testimonials, teamMembers, pricingPackages, faqs] =
    await Promise.all([
      fetchContactSafe(),
      fetchTableSafe('services'),
      fetchTableSafe('portfolio_items'),
      fetchTableSafe('testimonials'),
      fetchTableSafe('team_members'),
      fetchTableSafe('pricing_packages'),
      fetchTableSafe('faqs'),
    ])

  const next = { ...cache }
  let changed = false

  if (contact) {
    next.contact = contact
    changed = true
  }
  if (services) {
    next.services = mergeServiceDefaults(services)
    changed = true
  }
  if (portfolioItems) {
    next.portfolioItems = mergePortfolioDefaults(portfolioItems)
    changed = true
  }
  if (testimonials) {
    next.testimonials = testimonials
    changed = true
  }
  if (teamMembers) {
    next.teamMembers = teamMembers
    changed = true
  }
  if (pricingPackages) {
    next.pricingPackages = normalizePackages(pricingPackages)
    changed = true
  }
  if (faqs) {
    next.faqs = faqs.map(({ question, answer }) => ({ question, answer }))
    changed = true
  }

  if (changed) {
    cache = next
    persistLocal(cache)
    emit()
  }
}

// Hydrate saat module load (non-blocking)
hydrate()

// --- Public API ---

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const getContent = () => cache

/** Helper simpan tabel dengan retry kolom inti jika kolom baru belum dimigrasi di Supabase. */
async function replaceTable(table, fullRows, fallbackRows = null) {
  const del = await supabase.from(table).delete().gt('id', 0)
  if (del.error) return { ok: false, error: del.error.message }

  if (fullRows.length === 0) return { ok: true }
  const ins = await supabase.from(table).insert(fullRows)
  if (!ins.error) return { ok: true }

  if (fallbackRows) {
    const retry = await supabase.from(table).insert(fallbackRows)
    if (!retry.error) {
      return {
        ok: true,
        warning: `Sebagian kolom baru di tabel "${table}" belum ada di Supabase. Jalankan ulang supabase/setup.sql.`,
      }
    }
  }
  return { ok: false, error: ins.error.message }
}

/**
 * Simpan konten. Persist ke Supabase (upsert/replace), fallback localStorage.
 * @param {Partial<typeof cache>} partial
 * @returns {Promise<{ok: boolean, warning?: string}>}
 */
export async function saveContent(partial) {
  cache = { ...cache, ...partial }
  persistLocal(cache)
  emit()

  const warnings = []

  try {
    if (partial.contact) {
      const r = await supabase
        .from('contact')
        .upsert({ id: 1, ...partial.contact }, { onConflict: 'id' })
      if (r.error) warnings.push(r.error.message)
    }

    if (partial.services) {
      const fullRows = partial.services.map((s, i) => ({
        id: i + 1,
        icon: s.icon || 'sparkles',
        title: s.title || '',
        desc: s.desc || '',
        price: s.price || '',
        duration: s.duration || '',
      }))
      const baseRows = partial.services.map((s, i) => ({
        id: i + 1,
        icon: s.icon || 'sparkles',
        title: s.title || '',
        desc: s.desc || '',
      }))
      const r = await replaceTable('services', fullRows, baseRows)
      if (r.warning) warnings.push(r.warning)
      else if (!r.ok) warnings.push(r.error)
    }

    if (partial.portfolioItems) {
      const fullRows = partial.portfolioItems.map((p, i) => ({
        id: i + 1,
        title: p.title || '',
        category: p.category || '',
        image: p.image || null,
        tone: p.tone || 'from-akv-blue to-akv-royal',
        description: p.description || '',
      }))
      const baseRows = partial.portfolioItems.map((p, i) => ({
        id: i + 1,
        title: p.title || '',
        category: p.category || '',
        image: p.image || null,
        tone: p.tone || 'from-akv-blue to-akv-royal',
      }))
      const r = await replaceTable('portfolio_items', fullRows, baseRows)
      if (r.warning) warnings.push(r.warning)
      else if (!r.ok) warnings.push(r.error)
    }

    if (partial.testimonials) {
      const rows = partial.testimonials.map((t, i) => ({
        id: i + 1,
        name: t.name || '',
        role: t.role || '',
        quote: t.quote || '',
      }))
      const r = await replaceTable('testimonials', rows)
      if (!r.ok) warnings.push(r.error)
    }

    if (partial.teamMembers) {
      const rows = partial.teamMembers.map((m, i) => ({
        id: i + 1,
        name: m.name || '',
        role: m.role || '',
        url: m.url || '',
      }))
      const r = await replaceTable('team_members', rows)
      if (!r.ok) warnings.push(r.error)
    }

    if (partial.pricingPackages) {
      const rows = partial.pricingPackages.map((p, i) => ({
        id: i + 1,
        name: p.name || '',
        badge: p.badge || '',
        price: p.price || '',
        unit: p.unit || 'per proyek',
        desc: p.desc || '',
        featured: Boolean(p.featured),
        cta_label: p.ctaLabel || 'Pilih Paket',
        features: Array.isArray(p.features) ? p.features : [],
      }))
      const r = await replaceTable('pricing_packages', rows)
      if (!r.ok) warnings.push(`Tabel pricing_packages belum ada di Supabase (tersimpan di lokal). Jalankan supabase/setup.sql.`)
    }

    if (partial.faqs) {
      const rows = partial.faqs.map((f, i) => ({
        id: i + 1,
        question: f.question || '',
        answer: f.answer || '',
      }))
      const r = await replaceTable('faqs', rows)
      if (!r.ok) warnings.push(`Tabel faqs belum ada di Supabase (tersimpan di lokal). Jalankan supabase/setup.sql.`)
    }
  } catch {
    warnings.push('Supabase sedang tidak terjangkau, perubahan tersimpan di browser lokal.')
  }

  return warnings.length > 0 ? { ok: true, warning: warnings[0] } : { ok: true }
}

export function resetContent() {
  cache = defaults()
  persistLocal(cache)
  emit()
  saveContent(cache).catch(() => {})
}

/** Hook konten reaktif untuk komponen React. */
export function useContent() {
  return useSyncExternalStore(subscribe, getContent)
}

/** Normalisasi nomor WA ke format internasional (tanpa +, awalan 0 -> 62). */
function normalizeWaNumber(raw = '') {
  const digits = String(raw).replace(/\D/g, '')
  if (!digits) return ''
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits
}

/** Link WhatsApp berdasarkan kontak terkini. */
export const waLink = (text = 'Halo AKV! Saya ingin mulai project.') =>
  `https://wa.me/${normalizeWaNumber(cache.contact.whatsapp)}?text=${encodeURIComponent(text)}`
