/**
 * Kompresi & konversi gambar ke format WebP langsung di browser sebelum diunggah ke Cloudflare R2.
 * Mendukung PNG, JPG, JPEG, WebP, GIF statis -> WebP ringan & tajam.
 */

export function formatBytes(bytes = 0) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function decodeImage(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file)
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close?.(),
      }
    } catch {
      // Fallback ke elemen Image
    }
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({
        source: img,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        cleanup: () => URL.revokeObjectURL(url),
      })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Gagal membaca file gambar. Pastikan file tidak rusak.'))
    }
    img.src = url
  })
}

function canvasToWebpBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error('Browser gagal mengonversi gambar ke WebP.'))
        else resolve(blob)
      },
      'image/webp',
      quality
    )
  })
}

/**
 * Resize proporsional + konversi ke WebP dengan target ukuran otomatis.
 */
export async function compressToWebP(
  file,
  {
    maxWidth = 1400,
    maxHeight = 1400,
    targetMaxKB = 250,
    initialQuality = 0.84,
    minQuality = 0.62,
  } = {}
) {
  if (!file || !file.type?.startsWith('image/')) {
    throw new Error('Pilih file gambar yang valid (PNG, JPG, WebP).')
  }

  const decoded = await decodeImage(file)
  try {
    const scale = Math.min(1, maxWidth / decoded.width, maxHeight / decoded.height)
    const width = Math.max(1, Math.round(decoded.width * scale))
    const height = Math.max(1, Math.round(decoded.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas tidak tersedia di browser ini.')

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(decoded.source, 0, 0, width, height)

    const targetBytes = targetMaxKB * 1024
    let quality = initialQuality
    let blob = await canvasToWebpBlob(canvas, quality)

    // Turunkan kualitas bertahap bila hasil WebP masih di atas targetMaxKB
    while (blob.size > targetBytes && quality > minQuality) {
      quality = Math.max(minQuality, Number((quality - 0.08).toFixed(2)))
      const nextBlob = await canvasToWebpBlob(canvas, quality)
      blob = nextBlob
      if (quality <= minQuality) break
    }

    const baseName = (file.name || 'gambar').replace(/\.[^.]+$/, '')
    const webpFile = new File([blob], `${baseName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    })

    const originalSize = file.size
    const compressedSize = blob.size
    const savingsPercent =
      originalSize > 0 ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100)) : 0

    return {
      blob,
      file: webpFile,
      width,
      height,
      originalSize,
      compressedSize,
      savingsPercent,
      quality,
    }
  } finally {
    decoded.cleanup()
  }
}
