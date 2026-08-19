/**
 * Store konten AKV.
 *
 * Sumber data utama: Supabase. Fallback: static data dari site.js.
 * Landing page membaca konten lewat useContent() — tidak perlu berubah.
 *
 * Admin menyimpan via saveContent() yang persist ke Supabase,
 * dengan fallback localStorage jika Supabase unreachable.
 */
import { useSyncExternalStore } from 'react'
import { supabase } from '../utils/supabase.js'
import {
  contact as defaultContact,
  services as defaultServices,
  portfolioItems as defaultPortfolio,
  testimonials as defaultTestimonials,
  teamMembers as defaultTeam,
} from './site.js'

const STORAGE_KEY = 'akv-content'

const defaults = () => ({
  contact: { ...defaultContact },
  services: defaultServices.map((s) => ({ ...s })),
  portfolioItems: defaultPortfolio.map((p) => ({ ...p })),
  testimonials: defaultTestimonials.map((t) => ({ ...t })),
  teamMembers: defaultTeam.map((m) => ({ ...m })),
})

/** Attempt load from localStorage (offline cache). */
function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults()
    const saved = JSON.parse(raw)
    return { ...defaults(), ...saved }
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

async function fetchTable(table) {
  const { data, error } = await supabase.from(table).select('*').order('id')
  if (error) throw error
  return data
}

/** Fetch semua data dari Supabase, fallback ke static/local jika gagal. */
export async function hydrate() {
  try {
    const [contact, services, portfolioItems, testimonials, teamMembers] =
      await Promise.all([
        supabase.from('contact').select('*').limit(1).single().then((r) => {
          if (r.error) throw r.error
          // strip id dari response untuk konsistensi dengan shape site.js
          const { id, ...rest } = r.data
          return rest
        }),
        fetchTable('services'),
        fetchTable('portfolio_items'),
        fetchTable('testimonials'),
        fetchTable('team_members'),
      ])
    cache = { contact, services, portfolioItems, testimonials, teamMembers }
    persistLocal(cache)
    emit()
  } catch {
    // Supabase unreachable — pakai local/static (sudah di cache)
  }
}

// Hydrate saat module load (non-blocking)
hydrate()

// --- Public API (interface tetap sama) ---

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const getContent = () => cache

/**
 * Simpan konten. Persist ke Supabase (upsert), fallback localStorage.
 * @param {Partial<typeof cache>} partial
 */
export async function saveContent(partial) {
  cache = { ...cache, ...partial }
  persistLocal(cache)
  emit()

  // Persist ke Supabase di background
  try {
    const ops = []

    if (partial.contact) {
      ops.push(
        supabase
          .from('contact')
          .upsert({ id: 1, ...partial.contact }, { onConflict: 'id' }),
      )
    }
    if (partial.services) {
      // Replace all: delete lalu insert
      ops.push(
        supabase.from('services').delete().gt('id', 0).then(() =>
          supabase.from('services').insert(
            partial.services.map((s, i) => ({ id: i + 1, ...s })),
          ),
        ),
      )
    }
    if (partial.portfolioItems) {
      ops.push(
        supabase.from('portfolio_items').delete().gt('id', 0).then(() =>
          supabase.from('portfolio_items').insert(
            partial.portfolioItems.map((p, i) => ({
              id: i + 1,
              title: p.title,
              category: p.category,
              image: p.image,
              tone: p.tone,
            })),
          ),
        ),
      )
    }
    if (partial.testimonials) {
      ops.push(
        supabase.from('testimonials').delete().gt('id', 0).then(() =>
          supabase.from('testimonials').insert(
            partial.testimonials.map((t, i) => ({ id: i + 1, ...t })),
          ),
        ),
      )
    }
    if (partial.teamMembers) {
      ops.push(
        supabase.from('team_members').delete().gt('id', 0).then(() =>
          supabase.from('team_members').insert(
            partial.teamMembers.map((m, i) => ({ id: i + 1, ...m })),
          ),
        ),
      )
    }

    await Promise.all(ops)
  } catch {
    // Supabase unreachable — data tetap di localStorage
  }
}

export function resetContent() {
  cache = defaults()
  persistLocal(cache)
  emit()
  // Reset Supabase tables juga (best-effort)
  saveContent(cache).catch(() => {})
}

/** Hook konten reaktif untuk komponen React. */
export function useContent() {
  return useSyncExternalStore(subscribe, getContent)
}

/** Link WhatsApp berdasarkan kontak terkini. */
export const waLink = (text = 'Halo AKV! Saya ingin mulai project.') =>
  `https://wa.me/${cache.contact.whatsapp}?text=${encodeURIComponent(text)}`
