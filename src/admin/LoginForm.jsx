import { useState } from 'react'
import { login } from './auth.js'
import Icon from '../components/ui/Icon.jsx'

/** Form login admin, dipakai di halaman 404 dan /admin. */
export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await login(email, password)
    setLoading(false)
    if (result.ok) {
      onSuccess?.()
    } else {
      setError(result.error || 'Login gagal. Coba lagi.')
    }
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-sm rounded-feature border-2 border-akv-navy/10 bg-white p-6 shadow-card"
    >
      <p className="mb-1 flex items-center gap-2 text-sm font-extrabold text-akv-navy">
        <Icon name="badge" size={18} className="text-akv-blue" />
        Login Admin AKV
      </p>
      <p className="mb-4 text-xs text-akv-navy/55">
        Khusus pengelola. Masukkan email dan password untuk membuka dashboard.
      </p>
      <label className="block">
        <span className="sr-only">Email admin</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="username"
          required
          className="w-full rounded-xl border-2 border-akv-navy/15 bg-akv-pale px-4 py-2.5 text-sm font-semibold text-akv-navy outline-none transition-colors placeholder:text-akv-navy/35 focus:border-akv-blue"
        />
      </label>
      <label className="mt-3 block">
        <span className="sr-only">Password admin</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border-2 border-akv-navy/15 bg-akv-pale px-4 py-2.5 text-sm font-semibold text-akv-navy outline-none transition-colors placeholder:text-akv-navy/35 focus:border-akv-blue"
        />
      </label>
      {error && (
        <p role="alert" className="mt-2 text-xs font-bold text-akv-blue">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-4 w-full !py-2.5 !text-sm disabled:opacity-60"
      >
        {loading ? 'Memproses…' : 'Masuk Dashboard'}
      </button>
    </form>
  )
}
