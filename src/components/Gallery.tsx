import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Photo } from '../data/places'
import { hostOf, photoFallback, photoUrl } from '../lib/util'

const KIND_LABEL: Record<Photo['kind'], string | null> = {
  venue: null,
  event: 'Z akce na místě',
  area: 'Fotka areálu',
  poster: 'Plakát akce',
}

export function Img({ photo, w, className, eager }: { photo: Photo; w: number; className?: string; eager?: boolean }) {
  const [src, setSrc] = useState(photoUrl(photo, w))
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setSrc(photoUrl(photo, w))
    setLoaded(false)
  }, [photo, w])
  return (
    <img
      src={src}
      alt={photo.caption}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onLoad={() => setLoaded(true)}
      onError={() => {
        const fb = photoFallback(photo)
        if (src !== fb) setSrc(fb)
      }}
      className={`${className ?? ''} bg-slate-200 transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}

export function Credit({ photo, dark }: { photo: Photo; dark?: boolean }) {
  return (
    <p className={`text-[11px] leading-snug ${dark ? 'text-white/60' : 'text-slate-500'}`}>
      Foto: {photo.credit}
      {photo.license ? ` · ${photo.license}` : ''} ·{' '}
      <a href={photo.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
        zdroj ({hostOf(photo.sourceUrl)})
      </a>
    </p>
  )
}

export function Gallery({ photos, tall }: { photos: Photo[]; tall?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    ref.current?.scrollTo({ left: 0 })
    setIdx(0)
  }, [photos])

  const onScroll = () => {
    const el = ref.current
    if (!el) return
    setIdx(Math.round(el.scrollLeft / el.clientWidth))
  }

  const cur = photos[Math.min(idx, photos.length - 1)]
  const label = cur ? KIND_LABEL[cur.kind] : null

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl">
        <div
          ref={ref}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          data-testid="gallery"
        >
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setOpen(i)}
              className={`relative w-full shrink-0 snap-center ${tall ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}
              aria-label={`Otevřít fotku: ${p.caption}`}
            >
              <Img photo={p} w={900} eager={i === 0} className="absolute inset-0 h-full w-full object-cover" />
            </button>
          ))}
        </div>
        {label && (
          <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {label}
          </span>
        )}
        <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur">
          {idx + 1} / {photos.length}
        </span>
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-800">
          ⤢ Celá obrazovka
        </span>
      </div>
      {cur && (
        <div className="mt-2 space-y-0.5 px-0.5">
          <p className="text-sm font-medium text-slate-800">{cur.caption}</p>
          <Credit photo={cur} />
        </div>
      )}
      {open !== null && <Lightbox photos={photos} start={open} onClose={() => setOpen(null)} />}
    </div>
  )
}

export function Lightbox({ photos, start, onClose }: { photos: Photo[]; start: number; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(start)

  useLayoutEffect(() => {
    const el = ref.current
    if (el) el.scrollLeft = start * el.clientWidth
  }, [start])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = ref.current
      if (e.key === 'Escape') onClose()
      if (!el) return
      if (e.key === 'ArrowRight') el.scrollBy({ left: el.clientWidth, behavior: 'smooth' })
      if (e.key === 'ArrowLeft') el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' })
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const cur = photos[idx] ?? photos[0]
  return createPortal(
    <div className="fixed inset-0 z-[2000] flex flex-col bg-black" role="dialog" aria-modal="true" aria-label="Galerie fotek">
      <div className="flex items-center justify-between px-4 pb-2 pt-[max(env(safe-area-inset-top),12px)] text-white">
        <span className="text-sm font-semibold tabular-nums">
          {idx + 1} / {photos.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-xl"
          aria-label="Zavřít galerii"
        >
          ✕
        </button>
      </div>
      <div
        ref={ref}
        onScroll={() => {
          const el = ref.current
          if (el) setIdx(Math.round(el.scrollLeft / el.clientWidth))
        }}
        className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto"
      >
        {photos.map((p) => (
          <div key={p.src} className="flex h-full w-full shrink-0 snap-center items-center justify-center">
            <Img photo={p} w={1600} className="max-h-full max-w-full object-contain" />
          </div>
        ))}
      </div>
      <div className="space-y-1 px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-3">
        {KIND_LABEL[cur.kind] && (
          <span className="inline-block rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white">{KIND_LABEL[cur.kind]}</span>
        )}
        <p className="text-sm font-medium text-white">{cur.caption}</p>
        <Credit photo={cur} dark />
      </div>
    </div>,
    document.body,
  )
}
