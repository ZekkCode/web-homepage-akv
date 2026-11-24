import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthed, logout } from '../admin/auth.js'
import { usePageSeo } from '../utils/seo.js'
import { uploadImageToR2, deleteImageFromR2 } from '../utils/r2Upload.js'
import { formatBytes } from '../utils/imageWebp.js'
import LoginForm from '../admin/LoginForm.jsx'
import Sidebar from '../admin/Sidebar.jsx'
import Icon from '../components/ui/Icon.jsx'
import { portfolioFilters } from '../data/site.js'
import { resetContent, saveContent, useContent, useContentSyncVersion } from '../data/store.js'

const ICON_OPTIONS = [
  'palette', 'badge', 'file', 'globe', 'sparkles', 'film', 'video', 'megaphone',
  'compass', 'gem', 'chat', 'zap',
]

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  usePageSeo({
    title: 'Admin Dashboard | AKV',
    robots: 'noindex, nofollow, noarchive',
  })

  useEffect(() => {
    isAuthed().then((ok) => {
      setAuthed(ok)
      setChecking(false)
    })
  }, [])

  if (checking) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-akv-pale">
        <p className="text-sm font-bold text-akv-navy/50">Memeriksa sesi…</p>
      </main>
    )
  }

  if (!authed) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-gradient-to-b from-white via-akv-pale to-akv-light px-5">
        <LoginForm onSuccess={() => setAuthed(true)} />
      </main>
    )
  }
  return <Dashboard onLogout={() => setAuthed(false)} />
}

function Dashboard({ onLogout }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('kontak')
  const [resetTick, setResetTick] = useState(0)

  const handleLogout = async () => {
    await logout()
    onLogout()
    navigate('/')
  }

  return (
    <div className="flex min-h-[100svh] flex-col bg-akv-pale lg:h-[100svh] lg:flex-row lg:overflow-hidden">
      <Sidebar tab={tab} setTab={setTab} onLogout={handleLogout} />

      {/* Panel konten */}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:overflow-y-auto lg:px-10 lg:py-8">
        {tab === 'kontak' && <ContactPanel key={`kontak-${resetTick}`} />}
        {tab === 'layanan' && <ServicesPanel key={`layanan-${resetTick}`} />}
        {tab === 'paket' && <PricingPanel key={`paket-${resetTick}`} />}
        {tab === 'portofolio' && <PortfolioPanel key={`portofolio-${resetTick}`} />}
        {tab === 'testimoni' && <TestimonialsPanel key={`testimoni-${resetTick}`} />}
        {tab === 'faq' && <FaqPanel key={`faq-${resetTick}`} />}
        {tab === 'tim' && <TeamPanel key={`tim-${resetTick}`} />}

        <div className="mt-10 border-t border-akv-navy/10 pt-5">
          <button
            type="button"
            onClick={async () => {
              if (window.confirm('Kembalikan SEMUA konten ke bawaan? Perubahan tersimpan akan dihapus.')) {
                await resetContent()
                setResetTick((n) => n + 1)
              }
            }}
            className="text-xs font-bold text-akv-navy/45 underline-offset-2 transition-colors hover:text-akv-navy hover:underline"
          >
            Reset semua konten ke bawaan
          </button>
        </div>
      </main>
    </div>
  )
}

/* ---------- kerangka panel ---------- */

function PanelShell({ title, hint, onSave, saved, warning, children }) {
  return (
    <section aria-label={title}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-akv-navy">{title}</h1>
          {hint && <p className="mt-1 text-xs text-akv-navy/55">{hint}</p>}
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs font-bold text-akv-blue" role="status">
              Tersimpan
            </span>
          )}
          <button type="button" onClick={onSave} className="btn-primary !px-5 !py-2 !text-sm">
            Simpan
          </button>
        </div>
      </div>
      {warning && (
        <p role="status" className="mb-4 rounded-xl border border-akv-blue/25 bg-akv-light/70 px-4 py-2.5 text-xs font-semibold text-akv-navy">
          {warning}
        </p>
      )}
      {children}
    </section>
  )
}

function useSyncedDraft(source, clone) {
  const syncVersion = useContentSyncVersion()
  const [draft, setDraft] = useState(() => clone(source))
  const dirtyRef = useRef(false)
  const cloneRef = useRef(clone)
  cloneRef.current = clone

  useEffect(() => {
    if (!dirtyRef.current) {
      setDraft(cloneRef.current(source))
    }
  }, [syncVersion, source])

  const updateDraft = (next) => {
    dirtyRef.current = true
    setDraft(next)
  }

  const markClean = () => {
    dirtyRef.current = false
  }

  return [draft, updateDraft, markClean]
}

function useSaveState(onSaved) {
  const [saved, setSaved] = useState(false)
  const [warning, setWarning] = useState('')
  const timerRef = useRef(null)

  const handleSave = async (partial) => {
    setWarning('')
    const res = await saveContent(partial)
    if (res?.warning) setWarning(res.warning)
    onSaved?.()
    setSaved(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setSaved(false), 2400)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])
  return { saved, warning, handleSave }
}

const inputCls =
  'w-full rounded-xl border-2 border-akv-navy/10 bg-white px-3.5 py-2 text-sm font-semibold text-akv-navy outline-none transition-colors placeholder:text-akv-navy/30 focus:border-akv-blue'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-akv-navy/45">
        {label}
      </span>
      {children}
    </label>
  )
}

/* ---------- panel kontak ---------- */

function ContactPanel() {
  const { contact } = useContent()
  const [draft, setDraft, markClean] = useSyncedDraft(contact, (c) => ({ ...c }))
  const { saved, warning, handleSave } = useSaveState(markClean)
  const set = (k) => (e) => setDraft({ ...draft, [k]: e.target.value })

  return (
    <PanelShell
      title="Kontak & Sosial"
      hint="Nomor WhatsApp format internasional tanpa tanda plus, contoh 62881081772005."
      saved={saved}
      warning={warning}
      onSave={() => handleSave({ contact: draft })}
    >
      <div className="grid max-w-2xl gap-4 rounded-feature border-2 border-akv-navy/10 bg-white p-5 shadow-card sm:grid-cols-2">
        <Field label="WhatsApp">
          <input className={inputCls} value={draft.whatsapp} onChange={set('whatsapp')} />
        </Field>
        <Field label="Email">
          <input className={inputCls} type="email" value={draft.email} onChange={set('email')} />
        </Field>
        <Field label="Instagram (URL)">
          <input className={inputCls} value={draft.instagram} onChange={set('instagram')} />
        </Field>
        <Field label="TikTok (URL)">
          <input className={inputCls} value={draft.tiktok} onChange={set('tiktok')} />
        </Field>
      </div>
    </PanelShell>
  )
}

/* ---------- panel daftar generik ---------- */

function CrudList({ items, setItems, renderFields, addLabel, makeNew }) {
  return (
    <div className="grid gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-feature border-2 border-akv-navy/10 bg-white p-5 shadow-card"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-akv-navy/35">
              Item {i + 1}
            </span>
            <button
              type="button"
              onClick={() => setItems(items.filter((_, j) => j !== i))}
              className="text-xs font-bold text-akv-navy/45 transition-colors hover:text-akv-navy hover:underline"
            >
              Hapus
            </button>
          </div>
          {renderFields(item, (patch) =>
            setItems(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, makeNew()])}
        className="rounded-feature border-2 border-dashed border-akv-navy/20 bg-white/60 px-5 py-4 text-sm font-bold text-akv-navy/60 transition-colors hover:border-akv-blue hover:text-akv-blue"
      >
        + {addLabel}
      </button>
    </div>
  )
}

/* ---------- panel layanan ---------- */

function ServicesPanel() {
  const { services } = useContent()
  const [items, setItems, markClean] = useSyncedDraft(services, (list) => list.map((s) => ({ ...s })))
  const { saved, warning, handleSave } = useSaveState(markClean)

  return (
    <PanelShell
      title="Layanan"
      hint="Kartu layanan di section Layanan lengkap dengan estimasi harga, durasi, dan tombol pesan langsung."
      saved={saved}
      warning={warning}
      onSave={() => handleSave({ services: items })}
    >
      <CrudList
        items={items}
        setItems={setItems}
        addLabel="Tambah layanan"
        makeNew={() => ({ icon: 'sparkles', title: '', desc: '', price: '', duration: '' })}
        renderFields={(item, patch) => (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <Field label="Nama layanan">
                <input className={inputCls} value={item.title} onChange={(e) => patch({ title: e.target.value })} />
              </Field>
            </div>
            <Field label="Estimasi harga">
              <input
                className={inputCls}
                value={item.price || ''}
                placeholder="Mulai Rp 50rb"
                onChange={(e) => patch({ price: e.target.value })}
              />
            </Field>
            <Field label="Estimasi waktu">
              <input
                className={inputCls}
                value={item.duration || ''}
                placeholder="1-3 hari"
                onChange={(e) => patch({ duration: e.target.value })}
              />
            </Field>
            <Field label="Ikon">
              <select
                className={inputCls}
                value={item.icon}
                onChange={(e) => patch({ icon: e.target.value })}
              >
                {ICON_OPTIONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Deskripsi singkat">
                <textarea
                  rows={2}
                  className={inputCls}
                  value={item.desc}
                  onChange={(e) => patch({ desc: e.target.value })}
                />
              </Field>
            </div>
          </div>
        )}
      />
    </PanelShell>
  )
}

/* ---------- panel paket harga ---------- */

function PricingPanel() {
  const { pricingPackages } = useContent()
  const [items, setItems, markClean] = useSyncedDraft(pricingPackages, (list) =>
    list.map((p) => ({
      ...p,
      featuresText: Array.isArray(p.features) ? p.features.join('\n') : '',
    }))
  )
  const { saved, warning, handleSave } = useSaveState(markClean)

  return (
    <PanelShell
      title="Paket & Harga"
      hint="Tampil di section Paket & Harga. Tulis daftar fitur 1 poin per baris."
      saved={saved}
      warning={warning}
      onSave={() =>
        handleSave({
          pricingPackages: items.map(({ featuresText, ...rest }) => ({
            ...rest,
            features: featuresText
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean),
          })),
        })
      }
    >
      <CrudList
        items={items}
        setItems={setItems}
        addLabel="Tambah paket"
        makeNew={() => ({
          name: '',
          badge: '',
          price: 'Mulai Rp ',
          unit: 'per proyek',
          desc: '',
          featured: false,
          ctaLabel: 'Pilih Paket',
          featuresText: '',
        })}
        renderFields={(item, patch) => (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Nama paket">
              <input className={inputCls} value={item.name} onChange={(e) => patch({ name: e.target.value })} />
            </Field>
            <Field label="Label / Badge">
              <input
                className={inputCls}
                value={item.badge}
                placeholder="Paling Diminati"
                onChange={(e) => patch({ badge: e.target.value })}
              />
            </Field>
            <Field label="Harga">
              <input
                className={inputCls}
                value={item.price}
                placeholder="Mulai Rp 250rb"
                onChange={(e) => patch({ price: e.target.value })}
              />
            </Field>
            <Field label="Satuan">
              <input
                className={inputCls}
                value={item.unit}
                placeholder="per paket"
                onChange={(e) => patch({ unit: e.target.value })}
              />
            </Field>
            <Field label="Teks tombol CTA">
              <input
                className={inputCls}
                value={item.ctaLabel}
                placeholder="Pilih Paket"
                onChange={(e) => patch({ ctaLabel: e.target.value })}
              />
            </Field>
            <label className="flex items-center gap-2.5 self-end rounded-xl border-2 border-akv-navy/10 bg-akv-pale/60 px-3.5 py-2.5 text-xs font-bold text-akv-navy">
              <input
                type="checkbox"
                checked={Boolean(item.featured)}
                onChange={(e) => patch({ featured: e.target.checked })}
                className="h-4 w-4 accent-akv-blue"
              />
              Sorot sebagai paket utama (Populer)
            </label>
            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Deskripsi singkat">
                <input className={inputCls} value={item.desc} onChange={(e) => patch({ desc: e.target.value })} />
              </Field>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Daftar fitur (1 poin per baris)">
                <textarea
                  rows={4}
                  className={inputCls}
                  value={item.featuresText}
                  onChange={(e) => patch({ featuresText: e.target.value })}
                />
              </Field>
            </div>
          </div>
        )}
      />
    </PanelShell>
  )
}

/* ---------- uploader Cloudflare R2 + kompres WebP ---------- */

function R2ImageField({ value, onChange }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)

  const handleFile = async (file) => {
    if (!file) return
    setError('')
    setStats(null)
    setBusy(true)
    const previousUrl = value
    try {
      const result = await uploadImageToR2(file, {
        folder: 'portfolio',
        onStatus: (msg) => setStatus(msg),
      })
      onChange(result.url)
      setStats(result.stats)
      setStatus('Berhasil diunggah ke Cloudflare R2 (WebP). Klik Simpan untuk menyimpan ke database.')
      if (previousUrl && previousUrl !== result.url) {
        deleteImageFromR2(previousUrl)
      }
    } catch (err) {
      setError(err?.message || 'Gagal mengunggah gambar ke Cloudflare R2.')
      setStatus('')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleClear = () => {
    if (value) deleteImageFromR2(value)
    onChange('')
    setStats(null)
    setStatus('')
    setError('')
  }

  return (
    <div className="space-y-3 rounded-xl border-2 border-akv-navy/10 bg-akv-pale/50 p-3.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {value ? (
          <img
            src={value}
            alt="Pratinjau portofolio"
            className="h-24 w-32 shrink-0 rounded-lg border border-akv-navy/10 bg-white object-cover"
          />
        ) : (
          <div className="flex h-24 w-32 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-dashed border-akv-navy/15 bg-white text-akv-navy/35">
            <Icon name="image" size={20} />
            <span className="mt-1 text-[10px] font-bold uppercase">Kosong</span>
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="hidden"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full bg-akv-blue px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-akv-blue-dark disabled:opacity-60"
            >
              <Icon name="upload" size={14} />
              {busy ? 'Memproses…' : 'Upload & Kompres WebP ke R2'}
            </button>
            {value && (
              <button
                type="button"
                disabled={busy}
                onClick={handleClear}
                className="inline-flex items-center gap-1 rounded-full border border-akv-navy/15 bg-white px-3 py-2 text-xs font-bold text-akv-navy/70 transition-colors hover:border-akv-navy hover:text-akv-navy disabled:opacity-60"
              >
                <Icon name="trash" size={13} />
                Hapus gambar
              </button>
            )}
          </div>
          <p className="text-[11px] leading-snug text-akv-navy/55">
            PNG/JPG/WebP otomatis di-resize (maks 1400px), dikompres target ≤ 250 KB, dan dikonversi ke WebP sebelum diunggah ke Cloudflare R2.
          </p>
        </div>
      </div>

      {status && (
        <p className="text-xs font-bold text-akv-blue">{status}</p>
      )}
      {stats && (
        <p className="text-[11px] font-semibold text-akv-navy/70">
          Ukuran: {formatBytes(stats.originalSize)} → {formatBytes(stats.compressedSize)} (hemat {stats.savingsPercent}%) · {stats.width}×{stats.height}px WebP
        </p>
      )}
      {error && (
        <p role="alert" className="text-xs font-bold text-akv-royal">
          {error}
        </p>
      )}

      <Field label="URL gambar (terisi otomatis dari R2 atau tempel manual)">
        <input
          className={inputCls}
          value={value ?? ''}
          placeholder="https://cdn.akv.zakariamp.id/portfolio/..."
          onChange={(e) => onChange(e.target.value)}
        />
      </Field>
    </div>
  )
}

/* ---------- panel portofolio ---------- */

function PortfolioPanel() {
  const { portfolioItems } = useContent()
  const [items, setItems, markClean] = useSyncedDraft(portfolioItems, (list) => list.map((p) => ({ ...p })))
  const { saved, warning, handleSave } = useSaveState(markClean)
  const categories = portfolioFilters.filter((f) => f !== 'Semua')

  return (
    <PanelShell
      title="Portofolio"
      hint="Upload gambar langsung ke Cloudflare R2 (otomatis kompres & ubah ke WebP), lalu klik Simpan."
      saved={saved}
      warning={warning}
      onSave={() =>
        handleSave({
          portfolioItems: items.map((it, i) => ({
            tone: 'from-akv-blue to-akv-royal',
            ...it,
            id: i + 1,
            image: it.image?.trim() ? it.image.trim() : null,
            description: it.description?.trim() || '',
          })),
        })
      }
    >
      <CrudList
        items={items}
        setItems={setItems}
        addLabel="Tambah project"
        makeNew={() => ({
          title: '',
          category: categories[0],
          image: '',
          description: '',
          tone: 'from-akv-blue to-akv-royal',
        })}
        renderFields={(item, patch) => (
          <div className="grid gap-3 sm:grid-cols-[1fr_190px]">
            <Field label="Judul project">
              <input className={inputCls} value={item.title} onChange={(e) => patch({ title: e.target.value })} />
            </Field>
            <Field label="Kategori">
              <select
                className={inputCls}
                value={item.category}
                onChange={(e) => patch({ category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Deskripsi singkat (tampil di modal detail)">
                <textarea
                  rows={2}
                  className={inputCls}
                  value={item.description || ''}
                  placeholder="Ringkasan hasil dan konsep desain yang dikerjakan..."
                  onChange={(e) => patch({ description: e.target.value })}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <R2ImageField
                value={item.image || ''}
                onChange={(url) => patch({ image: url })}
              />
            </div>
          </div>
        )}
      />
    </PanelShell>
  )
}

/* ---------- panel testimoni ---------- */

function TestimonialsPanel() {
  const { testimonials } = useContent()
  const [items, setItems, markClean] = useSyncedDraft(testimonials, (list) => list.map((t) => ({ ...t })))
  const { saved, warning, handleSave } = useSaveState(markClean)

  return (
    <PanelShell
      title="Testimoni"
      hint="Singkat nama klien demi privasi, contoh: Naj***"
      saved={saved}
      warning={warning}
      onSave={() => handleSave({ testimonials: items })}
    >
      <CrudList
        items={items}
        setItems={setItems}
        addLabel="Tambah testimoni"
        makeNew={() => ({ name: '', role: '', quote: '' })}
        renderFields={(item, patch) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nama (disensor)">
              <input className={inputCls} value={item.name} onChange={(e) => patch({ name: e.target.value })} />
            </Field>
            <Field label="Peran">
              <input className={inputCls} value={item.role} onChange={(e) => patch({ role: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Isi testimoni">
                <textarea
                  rows={2}
                  className={inputCls}
                  value={item.quote}
                  onChange={(e) => patch({ quote: e.target.value })}
                />
              </Field>
            </div>
          </div>
        )}
      />
    </PanelShell>
  )
}

/* ---------- panel FAQ ---------- */

function FaqPanel() {
  const { faqs } = useContent()
  const [items, setItems, markClean] = useSyncedDraft(faqs, (list) => list.map((f) => ({ ...f })))
  const { saved, warning, handleSave } = useSaveState(markClean)

  return (
    <PanelShell
      title="FAQ Pembelian"
      hint="Tampil di section FAQ untuk menjawab keraguan calon pembeli sebelum pesan."
      saved={saved}
      warning={warning}
      onSave={() => handleSave({ faqs: items })}
    >
      <CrudList
        items={items}
        setItems={setItems}
        addLabel="Tambah pertanyaan FAQ"
        makeNew={() => ({ question: '', answer: '' })}
        renderFields={(item, patch) => (
          <div className="grid gap-3">
            <Field label="Pertanyaan">
              <input
                className={inputCls}
                value={item.question}
                onChange={(e) => patch({ question: e.target.value })}
              />
            </Field>
            <Field label="Jawaban">
              <textarea
                rows={3}
                className={inputCls}
                value={item.answer}
                onChange={(e) => patch({ answer: e.target.value })}
              />
            </Field>
          </div>
        )}
      />
    </PanelShell>
  )
}

/* ---------- panel tim ---------- */

function TeamPanel() {
  const { teamMembers } = useContent()
  const [items, setItems, markClean] = useSyncedDraft(teamMembers, (list) => list.map((m) => ({ ...m })))
  const { saved, warning, handleSave } = useSaveState(markClean)

  return (
    <PanelShell
      title="Tim"
      hint="Tampil di section Tentang Kami."
      saved={saved}
      warning={warning}
      onSave={() => handleSave({ teamMembers: items })}
    >
      <CrudList
        items={items}
        setItems={setItems}
        addLabel="Tambah anggota"
        makeNew={() => ({ name: '', role: '', url: '' })}
        renderFields={(item, patch) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nama">
              <input className={inputCls} value={item.name} onChange={(e) => patch({ name: e.target.value })} />
            </Field>
            <Field label="Peran">
              <input className={inputCls} value={item.role} onChange={(e) => patch({ role: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="URL website (opsional)">
                <input className={inputCls} value={item.url || ''} placeholder="https://contoh.com" onChange={(e) => patch({ url: e.target.value })} />
              </Field>
            </div>
          </div>
        )}
      />
    </PanelShell>
  )
}
