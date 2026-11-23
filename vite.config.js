import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import {
  generateSitemapIndex,
  generateMainSitemap,
  generateImagesSitemap,
  generateRobotsTxt,
  writeStaticSitemaps,
} from './scripts/sitemapGenerator.js'

function sitemapPlugin() {
  return {
    name: 'vite-plugin-sitemap',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        const handled = ['/sitemap.xml', '/sitemap-main.xml', '/sitemap-images.xml', '/robots.txt']
        if (!handled.includes(url)) {
          return next()
        }

        const protocol = req.headers['x-forwarded-proto'] || 'http'
        const host = req.headers.host || 'localhost:5173'
        const baseUrl = `${protocol}://${host}`
        const adminRoute = process.env.VITE_ADMIN_ROUTE || '/admin-akv'

        if (url === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          return res.end(generateRobotsTxt(baseUrl, adminRoute))
        }

        res.setHeader('Content-Type', 'application/xml; charset=utf-8')
        if (url === '/sitemap-main.xml') return res.end(generateMainSitemap(baseUrl))
        if (url === '/sitemap-images.xml') return res.end(generateImagesSitemap(baseUrl))
        return res.end(generateSitemapIndex(baseUrl))
      })
    },
    buildStart() {
      const prodUrl = process.env.VITE_SITE_URL || 'https://akv.zakariamp.id'
      const adminRoute = process.env.VITE_ADMIN_ROUTE || '/admin-akv'
      writeStaticSitemaps('./public', prodUrl, adminRoute)
    },
    closeBundle() {
      const prodUrl = process.env.VITE_SITE_URL || 'https://akv.zakariamp.id'
      const adminRoute = process.env.VITE_ADMIN_ROUTE || '/admin-akv'
      writeStaticSitemaps('./dist', prodUrl, adminRoute)
    },
  }
}

/** Bridge lokal supaya /api/upload-r2 bisa diuji langsung di `npm run dev` selain di Vercel. */
function localApiPlugin(env) {
  return {
    name: 'vite-plugin-local-r2-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPath = req.url?.split('?')[0]
        if (urlPath !== '/api/upload-r2') return next()

        try {
          Object.assign(process.env, env)
          const mod = await import('./api/upload-r2.js')
          const handler = mod[req.method]
          if (typeof handler !== 'function') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }))
          }

          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const body = Buffer.concat(chunks)

          const headers = new Headers()
          for (const [k, v] of Object.entries(req.headers)) {
            if (Array.isArray(v)) headers.set(k, v.join(', '))
            else if (typeof v === 'string') headers.set(k, v)
          }

          const webReq = new Request(`http://${req.headers.host || 'localhost:5173'}${req.url}`, {
            method: req.method,
            headers,
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : body,
          })

          const webRes = await handler(webReq)
          res.statusCode = webRes.status
          webRes.headers.forEach((val, key) => res.setHeader(key, val))
          const outBuf = Buffer.from(await webRes.arrayBuffer())
          res.end(outBuf)
        } catch (err) {
          console.error('[local-api] /api/upload-r2 error:', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'Gagal menjalankan handler lokal /api/upload-r2.' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), sitemapPlugin(), localApiPlugin(env)],
    server: {
      port: 5173,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-animation': ['framer-motion', 'gsap', 'lenis'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
  }
})
