import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {
  generateSitemap,
  generateRobotsTxt,
  writeStaticSitemaps,
} from './scripts/sitemapGenerator.js'

function sitemapPlugin() {
  return {
    name: 'vite-plugin-sitemap',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        if (!['/sitemap.xml', '/robots.txt'].includes(url)) {
          return next()
        }

        const protocol = req.headers['x-forwarded-proto'] || 'http'
        const host = req.headers.host || 'localhost:5173'
        const baseUrl = `${protocol}://${host}`

        if (url === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          return res.end(generateRobotsTxt(baseUrl))
        }

        res.setHeader('Content-Type', 'application/xml; charset=utf-8')
        return res.end(generateSitemap(baseUrl))
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

export default defineConfig({
  plugins: [react(), sitemapPlugin()],
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
})
