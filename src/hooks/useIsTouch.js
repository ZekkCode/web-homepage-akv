import { useEffect, useState } from 'react'

/** Detects coarse-pointer (touch) devices so mouse parallax can be disabled. */
export default function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const update = () => setIsTouch(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isTouch
}
