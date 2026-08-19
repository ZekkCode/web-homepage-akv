/**
 * Minimal inline stroke-icon set (Lucide-style: 2px stroke, rounded caps)
 * so the site has zero icon dependencies. All icons inherit currentColor.
 */
const paths = {
  palette: (
    <>
      <path d="M12 22a10 10 0 1 1 10-10c0 2.2-1.8 3-3.5 3H16a2 2 0 0 0-1.5 3.3c.5.6.6 1.7-.5 2.2-.6.3-1.3.5-2 .5Z" />
      <circle cx="7.5" cy="11.5" r="1" />
      <circle cx="11" cy="7.5" r="1" />
      <circle cx="15.5" cy="9.5" r="1" />
    </>
  ),
  badge: (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      <path d="M5 3v4M3 5h4" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  film: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M2 9h5M2 15h5M17 9h5M17 15h5" />
    </>
  ),
  video: (
    <>
      <path d="m16 10 6-4v12l-6-4" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </>
  ),
  megaphone: (
    <>
      <path d="m3 11 18-6v12L3 13v-2Z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m16.2 7.8-2.2 6.2-6.2 2.2 2.2-6.2 6.2-2.2Z" />
    </>
  ),
  gem: (
    <>
      <path d="M6 3h12l4 6-10 12L2 9l4-6Z" />
      <path d="M2 9h20M12 3l-4 6 4 12 4-12-4-6" />
    </>
  ),
  chat: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  zap: (
    <>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
    </>
  ),
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </>
  ),
  tiktok: (
    <path d="M9 12a4 4 0 1 0 4 4V4c.5 2.5 2.5 4.5 5 5" />
  ),
  whatsapp: (
    <>
      <path d="M12 2a9.97 9.97 0 0 0-8.5 15.2L2 22l4.9-1.4A9.97 9.97 0 1 0 12 2z" />
      <path
        d="M16.6 13.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.5-1.8-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.2 0-.3 0-.4-.1-.1-.5-1.3-.7-1.8-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.3-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.7 4.3 3.8.6.3 1.1.4 1.4.5.6.2 1.1.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 10 5.5-10 5.5L2 7.5 12 2Z" />
      <path d="m2 12.5 10 5.5 10-5.5" />
      <path d="m2 17 10 5.5L22 17" />
    </>
  ),
  pen: (
    <>
      <path d="M12 2C8 7.5 6 9.5 2 12l8 8c2.5-4 4.5-6 10-10L12 2Z" />
      <circle cx="10" cy="10" r="1.5" />
      <line x1="2" y1="12" x2="8.5" y2="10.5" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5-11 11" />
    </>
  ),
  type: (
    <>
      <path d="M4 7V4h16v3M12 4v16M9 20h6" />
    </>
  ),
  crop: (
    <>
      <path d="M6 2v16a2 2 0 0 0 2 2h14" />
      <path d="M2 6h16a2 2 0 0 1 2 2v14" />
    </>
  ),
}

export default function Icon({ name, size = 24, className = '', strokeWidth = 2, label }) {
  const content = paths[name]
  if (!content) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {content}
    </svg>
  )
}
