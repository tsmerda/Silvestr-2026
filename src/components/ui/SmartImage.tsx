import { useState } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
  /** Tailwind gradient třídy použité, když se obrázek nenačte. */
  fallback?: string
}

/**
 * Obrázek z veřejné URL. Když se nepodaří načíst (např. mimo síť),
 * místo rozbité ikonky ukáže hezký barevný gradient – stránka zůstane „hotová".
 */
export function SmartImage({ src, alt, className = '', fallback }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} ${fallback ?? 'bg-gradient-to-br from-slate-800 via-teal-900 to-slate-900'}`}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
