import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import PenCursor from './components/ui/PenCursor.jsx'
import Landing from './pages/Landing.jsx'

// Halaman admin & 404 di-lazy-load supaya bundle landing tetap ramping
const Admin = lazy(() => import('./pages/Admin.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE || '/admin-akv'

function PageLoader() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-akv-pale">
      <p className="text-sm font-bold text-akv-navy/50">Loading…</p>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <PenCursor />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path={ADMIN_ROUTE} element={<Admin />} />
          <Route path="/admin" element={<Navigate to={ADMIN_ROUTE} replace />} />
          <Route path="/login" element={<Navigate to={ADMIN_ROUTE} replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
