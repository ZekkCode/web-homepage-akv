import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthed, logout } from '../admin/auth.js'
import LoginForm from '../admin/LoginForm.jsx'
import Sidebar from '../admin/Sidebar.jsx'
import Icon from '../components/ui/Icon.jsx'
import { portfolioFilters } from '../data/site.js'
import { resetContent, saveContent, useContent } from '../data/store.js'

const ICON_OPTIONS = [
  'palette', 'badge', 'file', 'globe', 'sparkles', 'film', 'video', 'megaphone',
  'compass', 'gem', 'chat', 'zap',
]

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    document.title = 'Admin Dashboard | AKV'
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
        {tab === 'kontak' && <ContactPanel key="kontak" />}
        {tab === 'layanan' && <ServicesPanel key="layanan" />}
        {tab === 'portofolio' && <PortfolioPanel key="portofolio" />}
        {tab === 'testimoni' && <TestimonialsPanel key="testimoni" />}
        {tab === 'tim' && <TeamPanel key="tim" />}

        <div className="mt-10 border-t border-akv-navy/10 pt-5">
          <button
            onClick={() => {
              if (window.confirm('Kembalikan SEMUA konten ke bawaan? Perubahan tersimpan akan dihapus.')) {
                resetContent()
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

function PanelShell({ title, hint, onSave, saved, children }) {
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
          <button onClick={onSave} className="btn-primary !px-5 !py-2 !text-sm">
            Simpan
          </button>
        </div>
      </div>
      {children}
    </section>
  )
}

function useSavedFlash() {
  const [saved, setSaved] = useState(false)
  const timerRef = useRef(null)
  const flash = () => {
    setSaved(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setSaved(false), 2200)
  }
  useEffect(() => () => clearTimeout(timerRef.current), [])
  return [saved, flash]
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
  const [draft, setDraft] = useState({ ...contact })
  const [saved, flash] = useSavedFlash()
  const set = (k) => (e) => setDraft({ ...draft, [k]: e.target.value })

  return (
    <PanelShell
      title="Kontak & Sosial"
      hint="Nomor WhatsApp format internasional tanpa tanda plus, contoh 62812xxxxxxx."
      saved={saved}
      onSave={() => {
        saveContent({ contact: draft })
        flash()
      }}
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
  const [items, setItems] = useState(services.map((s) => ({ ...s })))
  const [saved, flash] = useSavedFlash()

  return (
    <PanelShell
      title="Layanan"
      hint="Kartu layanan di section Layanan dan link di footer."
      saved={saved}
      onSave={() => {
        saveContent({ services: items })
        flash()
      }}
    >
      <CrudList
        items={items}
        setItems={setItems}
        addLabel="Tambah layanan"
        makeNew={() => ({ icon: 'sparkles', title: '', desc: '' })}
        renderFields={(item, patch) => (
          <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
            <Field label="Nama layanan">
              <input className={inputCls} value={item.title} onChange={(e) => patch({ title: e.target.value })} />
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
            <div className="sm:col-span-2">
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

/* ---------- panel portofolio ---------- */

function PortfolioPanel() {
  const { portfolioItems } = useContent()
  const [items, setItems] = useState(portfolioItems.map((p) => ({ ...p })))
  const [saved, flash] = useSavedFlash()
  const categories = portfolioFilters.filter((f) => f !== 'Semua')

  return (
    <PanelShell
      title="Portofolio"
      hint="Kosongkan URL gambar untuk memakai placeholder. Letakkan file di public/assets/portfolio/ lalu isi, contoh: /assets/portfolio/nama.webp"
      saved={saved}
      onSave={() => {
        saveContent({
          portfolioItems: items.map((it, i) => ({
            tone: 'from-akv-blue to-akv-royal',
            ...it,
            id: i + 1,
            image: it.image?.trim() ? it.image.trim() : null,
          })),
        })
        flash()
      }}
    >
      <CrudList
        items={items}
        setItems={setItems}
        addLabel="Tambah project"
        makeNew={() => ({
          title: '',
          category: categories[0],
          image: '',
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
              <Field label="URL gambar (opsional, WebP disarankan)">
                <input
                  className={inputCls}
                  value={item.image ?? ''}
                  placeholder="/assets/portfolio/nama-project.webp"
                  onChange={(e) => patch({ image: e.target.value })}
                />
              </Field>
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
  const [items, setItems] = useState(testimonials.map((t) => ({ ...t })))
  const [saved, flash] = useSavedFlash()

  return (
    <PanelShell
      title="Testimoni"
      hint="Singkat nama klien demi privasi, contoh: Naj***"
      saved={saved}
      onSave={() => {
        saveContent({ testimonials: items })
        flash()
      }}
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

/* ---------- panel tim ---------- */

function TeamPanel() {
  const { teamMembers } = useContent()
  const [items, setItems] = useState(teamMembers.map((m) => ({ ...m })))
  const [saved, flash] = useSavedFlash()

  return (
    <PanelShell
      title="Tim"
      hint="Tampil di section Tentang Kami."
      saved={saved}
      onSave={() => {
        saveContent({ teamMembers: items })
        flash()
      }}
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
