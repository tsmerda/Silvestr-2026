import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Photo } from '../data/places'
import { hostOf, photoSources } from '../lib/util'
import { IconClose, IconExpand, IconImage } from './Icons'

const KIND_LABEL: Record<Photo['kind'], string | null> = {
  venue: null,
  event: 'Z akce na místě',
  area: 'Fotka areálu',
  poster: 'Plakát akce',
}

type ImgProps = { photo: Photo; w: number; className?: string; eager?: boolean }

/**
 * Fotka s řetězem záloh (zmenšovač → originál, u Commons naopak).
 * Obrázek je vždy viditelný – žádné skrývání přes opacity, které na iOS
 * u fotek z mezipaměti umělo nechat prázdné místo.
 */
export function Img(props: ImgProps) {
  return <ImgInner key={props.photo.src + '@' + props.w} {...props} />
}

function ImgInner({ photo, w, className, eager }: ImgProps) {
  const sources = useMemo(() => photoSources(photo, w), [photo, w])
  const [i, setI] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true)
  }, [])

  if (i >= sources.length) {
    return (
      <div role="img" aria-label={photo.caption} className={`${className ?? ''} img-missing grid place-items-center`}>
        <div className="flex flex-col items-center gap-1 px-4 text-center text-white/80">
          <IconImage size={26} />
          <span className="text-[11px] font-semibold">Foto se nenačetlo</span>
        </div>
      </div>
    )
  }

  return (
    <img
      ref={ref}
      src={sources[i]}
      alt={photo.caption}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={() => {
        setLoaded(false)
        setI((x) => x + 1)
      }}
      className={`${className ?? ''} ${loaded ? 'img-in' : 'img-loading'}`}
    />
  )
}

export function Credit({ photo, dark }: { photo: Photo; dark?: boolean }) {
  return (
    <p className={`truncate text-[11px] leading-snug ${dark ? 'text-white/55' : 'text-slate-400'}`}>
      Foto: {photo.credit}
      {photo.license ? ` · ${photo.license}` : ''} ·{' '}
      <a href={photo.sourceUrl} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-2">
        {hostOf(photo.sourceUrl)}
      </a>
    </p>
  )
}

export function Gallery({ photos }: { photos: Photo[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    ref.current?.scrollTo({ left: 0 })
    setIdx(0)
  }, [photos])

  const onScroll = () => {
    const el = ref.current
    if (el) setIdx(Math.round(el.scrollLeft / el.clientWidth))
  }

  const cur = photos[Math.min(idx, photos.length - 1)]
  const label = cur ? KIND_LABEL[cur.kind] : null

  return (
    <div>
      <div className="relative overflow-hidden rounded-[22px] bg-slate-200 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.45)]">
        <div ref={ref} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto" data-testid="gallery">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setOpen(i)}
              className="relative aspect-[4/3] w-full shrink-0 snap-center"
              aria-label={`Otevřít fotku: ${p.caption}`}
            >
              <Img photo={p} w={900} eager={i < 2} className="absolute inset-0 h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        {label && <span className="glass-chip pointer-events-none absolute left-3 top-3">{label}</span>}
        <span className="glass-chip pointer-events-none absolute right-3 top-3 !px-2">
          <IconExpand size={13} />
        </span>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3.5 pb-3">
          <p className="line-clamp-2 text-[14px] font-semibold leading-snug text-white drop-shadow">{cur?.caption}</p>
          {photos.length > 1 && (
            <div className="mt-2 flex gap-1">
              {photos.map((p, i) => (
                <span key={p.src} className={`h-1 rounded-full transition-all ${i === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/45'}`} />
              ))}
            </div>
          )}
        </div>
      </div>
      {cur && (
        <div className="mt-1.5 px-1">
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
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const cur = photos[idx] ?? photos[0]
  return createPortal(
    <div className="lightbox fixed inset-0 z-[2000] flex flex-col bg-black" role="dialog" aria-modal="true" aria-label="Galerie fotek">
      <div className="flex items-center justify-between px-4 pb-2 pt-[max(env(safe-area-inset-top),14px)] text-white">
        <span className="text-[13px] font-semibold tabular-nums text-white/80">
          {idx + 1} / {photos.length}
        </span>
        <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur" aria-label="Zavřít galerii">
          <IconClose size={20} />
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
            <Img photo={p} w={1600} eager className="max-h-full max-w-full object-contain" />
          </div>
        ))}
      </div>
      <div className="space-y-1 px-5 pb-[max(env(safe-area-inset-bottom),18px)] pt-3">
        {KIND_LABEL[cur.kind] && <span className="glass-chip">{KIND_LABEL[cur.kind]}</span>}
        <p className="text-[15px] font-semibold leading-snug text-white">{cur.caption}</p>
        <Credit photo={cur} dark />
      </div>
    </div>,
    document.body,
  )
}
