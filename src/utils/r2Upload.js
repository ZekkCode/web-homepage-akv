import { supabase } from './supabase.js'
import { compressToWebP } from './imageWebp.js'

/**
 * Kompres gambar ke WebP di browser lalu unggah ke Cloudflare R2 lewat endpoint /api/upload-r2.
 */
export async function uploadImageToR2(rawFile, { folder = 'portfolio', onStatus } = {}) {
  onStatus?.('Mengompres dan mengubah ke WebP…')
  const compressed = await compressToWebP(rawFile)

  const { data: sessionData } = await supabase.auth.getSession()
  const accessToken = sessionData?.session?.access_token
  if (!accessToken) {
    throw new Error('Sesi login admin tidak ditemukan. Silakan login ulang.')
  }

  onStatus?.('Mengunggah WebP ke Cloudflare R2…')
  const formData = new FormData()
  formData.append('file', compressed.file)
  formData.append('folder', folder)

  const res = await fetch('/api/upload-r2', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })

  const payload = await res.json().catch(() => null)
  if (!res.ok || !payload?.ok) {
    if (res.status === 404) {
      throw new Error('Endpoint /api/upload-r2 belum aktif. Pastikan deploy di Vercel atau jalankan dev server.')
    }
    throw new Error(payload?.error || `Upload R2 gagal (HTTP ${res.status}).`)
  }

  return {
    url: payload.url,
    key: payload.key,
    stats: {
      width: compressed.width,
      height: compressed.height,
      originalSize: compressed.originalSize,
      compressedSize: compressed.compressedSize,
      savingsPercent: compressed.savingsPercent,
    },
  }
}

/** Hapus gambar lama dari Cloudflare R2 (best-effort, tidak memblokir UI). */
export async function deleteImageFromR2(url) {
  if (!url || !/^https?:\/\//i.test(url)) return
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData?.session?.access_token
    if (!accessToken) return

    await fetch('/api/upload-r2', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })
  } catch {
    // Abaikan kegagalan cleanup opsional
  }
}
