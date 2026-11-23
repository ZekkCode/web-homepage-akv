import crypto from 'node:crypto'

const MAX_BYTES = 4 * 1024 * 1024 // 4 MB (di bawah limit 4.5 MB Vercel Function)
const ALLOWED_FOLDERS = new Set(['portfolio', 'team', 'assets'])

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID?.trim()
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim()
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim()
  const bucket = process.env.R2_BUCKET_NAME?.trim()
  const publicUrl = process.env.R2_PUBLIC_URL?.trim()?.replace(/\/$/, '')
  const customEndpoint = process.env.R2_ENDPOINT?.trim()?.replace(/\/$/, '')

  const missing = []
  if (!accountId && !customEndpoint) missing.push('R2_ACCOUNT_ID')
  if (!accessKeyId) missing.push('R2_ACCESS_KEY_ID')
  if (!secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY')
  if (!bucket) missing.push('R2_BUCKET_NAME')
  if (!publicUrl) missing.push('R2_PUBLIC_URL')

  if (missing.length > 0) {
    return { error: `Environment variable R2 belum lengkap: ${missing.join(', ')}` }
  }

  const endpoint = customEndpoint || `https://${accountId}.r2.cloudflarestorage.com`
  return { endpoint, accessKeyId, secretAccessKey, bucket, publicUrl }
}

/** Verifikasi JWT admin terhadap Supabase Auth agar endpoint hanya bisa dipakai admin yang login. */
async function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!token) return { ok: false, status: 401, error: 'Token login admin tidak ditemukan.' }

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '')
  const supabaseKey = (
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim()

  if (!supabaseUrl || !supabaseKey) {
    return { ok: false, status: 500, error: 'Konfigurasi Supabase server belum lengkap.' }
  }

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) return { ok: false, status: 401, error: 'Sesi admin tidak valid atau sudah kedaluwarsa.' }
    const user = await res.json()
    if (!user?.id) return { ok: false, status: 401, error: 'Akun admin tidak terverifikasi.' }
    return { ok: true, user }
  } catch (err) {
    console.error('[upload-r2] Supabase auth check failed:', err)
    return { ok: false, status: 502, error: 'Gagal memverifikasi sesi admin.' }
  }
}

function sha256Hex(data) {
  return crypto.createHash('sha256').update(data).digest('hex')
}

function hmac(key, data) {
  return crypto.createHmac('sha256', key).update(data).digest()
}

function encodeS3Path(key) {
  return key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

/** Tanda tangan AWS Signature Version 4 untuk Cloudflare R2 S3 API (region: auto, service: s3). */
function buildSignedR2Request({ method, config, key, body = Buffer.alloc(0), contentType, cacheControl }) {
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)
  const region = 'auto'
  const service = 's3'

  const url = new URL(`${config.endpoint}/${config.bucket}/${encodeS3Path(key)}`)
  const payloadHash = sha256Hex(body)

  const headersToSign = {
    host: url.host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
  }
  if (contentType) headersToSign['content-type'] = contentType
  if (cacheControl) headersToSign['cache-control'] = cacheControl

  const sortedKeys = Object.keys(headersToSign).sort()
  const canonicalHeaders = sortedKeys.map((k) => `${k}:${headersToSign[k]}\n`).join('')
  const signedHeaders = sortedKeys.join(';')

  const canonicalRequest = [
    method,
    url.pathname,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n')

  const kDate = hmac(`AWS4${config.secretAccessKey}`, dateStamp)
  const kRegion = hmac(kDate, region)
  const kService = hmac(kRegion, service)
  const kSigning = hmac(kService, 'aws4_request')
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex')

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`

  const headers = {
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
    Authorization: authorization,
  }
  if (contentType) headers['Content-Type'] = contentType
  if (cacheControl) headers['Cache-Control'] = cacheControl

  return { url: url.toString(), headers }
}

function sanitizeSlug(filename = 'image') {
  const base = String(filename).replace(/\.[^.]+$/, '')
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  return slug || 'akv-image'
}

export async function POST(request) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return json({ ok: false, error: auth.error }, auth.status)

  const config = getR2Config()
  if (config.error) return json({ ok: false, error: config.error }, 503)

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const rawFolder = String(formData.get('folder') || 'portfolio').trim().toLowerCase()
    const folder = ALLOWED_FOLDERS.has(rawFolder) ? rawFolder : 'portfolio'

    if (!file || typeof file.arrayBuffer !== 'function') {
      return json({ ok: false, error: 'File gambar tidak ditemukan.' }, 400)
    }

    const mime = (file.type || '').toLowerCase()
    if (mime !== 'image/webp') {
      return json({ ok: false, error: 'Format gambar harus WebP. Pastikan kompresi WebP aktif.' }, 400)
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    if (buffer.length === 0) {
      return json({ ok: false, error: 'File gambar kosong.' }, 400)
    }
    if (buffer.length > MAX_BYTES) {
      return json({ ok: false, error: 'Ukuran file melebihi batas 4 MB setelah kompresi.' }, 413)
    }

    // Validasi header magic bytes RIFF....WEBP
    const isWebpMagic =
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    if (!isWebpMagic) {
      return json({ ok: false, error: 'File bukan gambar WebP yang valid.' }, 400)
    }

    const slug = sanitizeSlug(file.name)
    const suffix = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}`
    const key = `${folder}/${slug}-${suffix}.webp`

    const signed = buildSignedR2Request({
      method: 'PUT',
      config,
      key,
      body: buffer,
      contentType: 'image/webp',
      cacheControl: 'public, max-age=31536000, immutable',
    })

    const uploadRes = await fetch(signed.url, {
      method: 'PUT',
      headers: signed.headers,
      body: buffer,
    })

    if (!uploadRes.ok) {
      const errText = await uploadRes.text().catch(() => '')
      console.error('[upload-r2] R2 PUT error:', uploadRes.status, errText)
      return json({ ok: false, error: `Gagal mengunggah ke Cloudflare R2 (HTTP ${uploadRes.status}).` }, 502)
    }

    return json({
      ok: true,
      key,
      url: `${config.publicUrl}/${key}`,
      size: buffer.length,
    })
  } catch (err) {
    console.error('[upload-r2] Unexpected POST error:', err)
    return json({ ok: false, error: 'Terjadi kesalahan saat memproses upload ke R2.' }, 500)
  }
}

export async function DELETE(request) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return json({ ok: false, error: auth.error }, auth.status)

  const config = getR2Config()
  if (config.error) return json({ ok: false, error: config.error }, 503)

  try {
    const body = await request.json().catch(() => ({}))
    let key = String(body.key || '').trim()

    if (!key && body.url) {
      const targetUrl = String(body.url).trim()
      if (!targetUrl.startsWith(`${config.publicUrl}/`)) {
        return json({ ok: false, error: 'URL bukan berasal dari bucket R2 situs ini.' }, 400)
      }
      key = decodeURIComponent(targetUrl.slice(config.publicUrl.length + 1))
    }

    const topFolder = key.split('/')[0]
    if (!key || key.includes('..') || !ALLOWED_FOLDERS.has(topFolder)) {
      return json({ ok: false, error: 'Key objek R2 tidak valid.' }, 400)
    }

    const signed = buildSignedR2Request({
      method: 'DELETE',
      config,
      key,
    })

    const delRes = await fetch(signed.url, {
      method: 'DELETE',
      headers: signed.headers,
    })

    if (!delRes.ok && delRes.status !== 404) {
      const errText = await delRes.text().catch(() => '')
      console.error('[upload-r2] R2 DELETE error:', delRes.status, errText)
      return json({ ok: false, error: `Gagal menghapus file dari R2 (HTTP ${delRes.status}).` }, 502)
    }

    return json({ ok: true, key })
  } catch (err) {
    console.error('[upload-r2] Unexpected DELETE error:', err)
    return json({ ok: false, error: 'Terjadi kesalahan saat menghapus file di R2.' }, 500)
  }
}
