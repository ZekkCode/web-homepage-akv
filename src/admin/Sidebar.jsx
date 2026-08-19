import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon.jsx'

const TABS = [
  { id: 'kontak', label: 'Kontak', icon: 'whatsapp' },
  { id: 'layanan', label: 'Layanan', icon: 'palette' },
  { id: 'portofolio', label: 'Portofolio', icon: 'image' },
  { id: 'testimoni', label: 'Testimoni', icon: 'chat' },
  { id: 'tim', label: 'Tim', icon: 'badge' },
]

export default function Sidebar({ tab, setTab, onLogout }) {
  return (
    <aside className="flex shrink-0 flex-col border-b border-akv-navy/10 bg-white px-4 py-4 lg:w-60 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="mb-2 flex items-center justify-between lg:mb-8 lg:block">
        <img
          src="/assets/logo-akv.webp"
          alt="Logo AKV, Arah Karya Visual"
          className="h-9 w-auto select-none"
          width="108"
          height="36"
          draggable="false"
        />
        <p className="mt-0 text-[10px] font-extrabold uppercase tracking-widest text-akv-navy/40 lg:mt-2">
          Dashboard Admin
        </p>
      </div>

      <nav aria-label="Menu dashboard" className="-mx-1 overflow-x-auto lg:mx-0">
        <ul className="flex gap-1.5 px-1 lg:flex-col lg:px-0">
          {TABS.map((t) => (
            <li key={t.id} className="shrink-0">
              <button
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? 'page' : undefined}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                  tab === t.id
                    ? 'bg-akv-blue text-white'
                    : 'text-akv-navy/70 hover:bg-akv-light/70 hover:text-akv-blue'
                }`}
              >
                <Icon name={t.icon} size={17} />
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-3 flex gap-2 lg:mt-auto lg:flex-col">
        <Link
          to="/"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-akv-navy/10 px-3.5 py-2.5 text-sm font-bold text-akv-navy/70 transition-colors hover:border-akv-blue hover:text-akv-blue"
        >
          Lihat Situs
        </Link>
        <button
          onClick={onLogout}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-akv-navy/10 px-3.5 py-2.5 text-sm font-bold text-akv-navy/70 transition-colors hover:border-akv-navy hover:text-akv-navy"
        >
          Keluar
        </button>
      </div>
    </aside>
  )
}
