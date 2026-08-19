/**
 * Dua strip tape menyilang diagonal (police-tape style) sebagai section divider.
 * Teks "ARAH KARYA VISUAL" berulang di sepanjang tape.
 *
 * ponytail: ganti ke gambar custom kalau butuh tekstur realistis.
 */
export default function TapeDivider({ className = '' }) {
  const label = 'ARAH KARYA VISUAL'
  /* Repeat teks cukup banyak supaya menutup 160vw */
  const repeated = Array(20).fill(label).join(' ✦ ')

  const tapeBase =
    'absolute left-1/2 -translate-x-1/2 pointer-events-none select-none flex items-center whitespace-nowrap overflow-hidden'

  const tapeText =
    'text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.25em] text-white/90'

  const h = 'h-8 sm:h-9 md:h-10'
  const w = 'w-[200vw]'

  /* Stripe overlay via repeating-linear-gradient */
  const stripeOverlay =
    'repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(255,255,255,0.08) 120px, rgba(255,255,255,0.08) 122px)'

  return (
    <div
      className={`relative overflow-hidden h-28 sm:h-32 md:h-36 ${className}`}
      aria-hidden="true"
    >
      {/* tape 1: miring ke kanan — biru */}
      <div
        className={`${tapeBase} ${h} ${w} top-1/2 -translate-y-[75%] -rotate-2`}
        style={{
          backgroundImage: stripeOverlay,
          backgroundColor: '#2563EB',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}
      >
        <span className={tapeText}>{repeated}</span>
      </div>
      {/* tape 2: miring ke kiri — navy */}
      <div
        className={`${tapeBase} ${h} ${w} top-1/2 -translate-y-[25%] rotate-2`}
        style={{
          backgroundImage: stripeOverlay,
          backgroundColor: '#1E3A8A',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}
      >
        <span className={tapeText}>{repeated}</span>
      </div>
    </div>
  )
}
