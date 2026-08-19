/**
 * Indikator scroll bentuk mouse (versi kecil) + label.
 * Dipakai di hero dan section sekuens supaya konsisten.
 */
export default function ScrollHint({ label = 'Scroll website-nya, Cuy!' }) {
  return (
    <span className="flex flex-col items-center gap-1.5">
      <span className="flex h-[38px] w-[24px] rounded-full border-2 border-current opacity-70">
        <span className="mouse-scroll-dot m-auto block h-2.5 w-2.5 rounded-full bg-gradient-to-b from-akv-blue to-akv-royal" />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.16em]">{label}</span>
    </span>
  )
}
