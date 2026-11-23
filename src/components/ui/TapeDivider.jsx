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
      className={`relative overflow-hidden h-20 sm:h-28 md:h-32 ${className}`}
      aria-hidden="true"
    >
      {/* tape 1: miring ke kanan — akv-blue */}
      <div
        className={`${tapeBase} ${h} ${w} top-1/2 -translate-y-[75%] -rotate-2`}
        style={{
          backgroundImage: stripeOverlay,
          backgroundColor: '#0B5CFF',
          boxShadow: '0 2px 8px rgba(13,27,61,0.22)',
        }}
      >
        <span className={tapeText}>{repeated}</span>
      </div>
      {/* tape 2: miring ke kiri — akv-navy */}
      <div
        className={`${tapeBase} ${h} ${w} top-1/2 -translate-y-[25%] rotate-2`}
        style={{
          backgroundImage: stripeOverlay,
          backgroundColor: '#0D1B3D',
          boxShadow: '0 2px 8px rgba(13,27,61,0.22)',
        }}
      >
        <span className={tapeText}>{repeated}</span>
      </div>
    </div>
  )
}
