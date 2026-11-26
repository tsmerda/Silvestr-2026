import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

export type Snap = 'peek' | 'half' | 'full'

type Props = {
  snap: Snap
  onSnap: (s: Snap) => void
  peekHeight: number
  header: ReactNode
  children: ReactNode
  /** Mění se při výběru jiného místa – posune obsah nahoru. */
  contentKey: string
}

export function useViewportHeight() {
  const [h, setH] = useState(() => window.innerHeight)
  useEffect(() => {
    const on = () => setH(window.visualViewport?.height ?? window.innerHeight)
    window.addEventListener('resize', on)
    window.visualViewport?.addEventListener('resize', on)
    return () => {
      window.removeEventListener('resize', on)
      window.visualViewport?.removeEventListener('resize', on)
    }
  }, [])
  return h
}

export function snapHeights(vh: number, peek: number) {
  return { peek, half: Math.round(vh * 0.56), full: Math.round(vh - 64) }
}

/** Vysouvací panel přes spodní část mapy (styl Apple Maps). */
export function BottomSheet({ snap, onSnap, peekHeight, header, children, contentKey }: Props) {
  const vh = useViewportHeight()
  const H = snapHeights(vh, peekHeight)
  const full = H.full
  const [drag, setDrag] = useState<number | null>(null) // aktuálně viditelná výška během tažení
  const start = useRef<{ y: number; vis: number; t: number; moved: boolean } | null>(null)
  const content = useRef<HTMLDivElement>(null)
  const visible = drag ?? H[snap]

  useEffect(() => {
    content.current?.scrollTo({ top: 0 })
  }, [contentKey])

  const settle = useCallback(
    (vis: number, velocity: number) => {
      const order: Snap[] = ['peek', 'half', 'full']
      let target: Snap
      if (Math.abs(velocity) > 0.6) {
        // rychlé švihnutí – o jednu polohu nahoru/dolů
        const cur = order.reduce((a, b) => (Math.abs(H[b] - vis) < Math.abs(H[a] - vis) ? b : a), 'peek' as Snap)
        const i = order.indexOf(cur)
        const dir = velocity > 0 ? 1 : -1
        const nearestIdx = H[cur] > vis && dir > 0 ? i : H[cur] < vis && dir < 0 ? i : i + dir
        target = order[Math.max(0, Math.min(2, nearestIdx))]
      } else {
        target = order.reduce((a, b) => (Math.abs(H[b] - vis) < Math.abs(H[a] - vis) ? b : a), 'peek' as Snap)
      }
      setDrag(null)
      onSnap(target)
    },
    [H, onSnap],
  )

  const begin = (y: number) => {
    start.current = { y, vis: H[snap], t: performance.now(), moved: false }
  }
  const move = (y: number) => {
    const s = start.current
    if (!s) return false
    const dy = s.y - y
    if (!s.moved && Math.abs(dy) < 6) return false
    s.moved = true
    setDrag(Math.max(peekHeight * 0.7, Math.min(full, s.vis + dy)))
    return true
  }
  const end = (y: number) => {
    const s = start.current
    start.current = null
    if (!s) return
    if (!s.moved) return
    const dt = Math.max(1, performance.now() - s.t)
    const v = (s.y - y) / dt
    settle(Math.max(peekHeight, Math.min(full, s.vis + (s.y - y))), v)
  }

  // Hlavička: tažení vždy, klepnutí přepíná peek ↔ half
  const headerHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('a,button')) return
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      begin(e.clientY)
    },
    onPointerMove: (e: React.PointerEvent) => {
      move(e.clientY)
    },
    onPointerUp: (e: React.PointerEvent) => {
      const s = start.current
      if (s && !s.moved) {
        start.current = null
        const target = (e.target as HTMLElement).closest('a,button[data-stop]')
        if (!target) onSnap(snap === 'peek' ? 'half' : snap === 'half' ? 'full' : 'half')
        return
      }
      end(e.clientY)
    },
    onPointerCancel: () => {
      start.current = null
      setDrag(null)
    },
  }

  // Obsah: když panel není úplně nahoře, táhne se celý panel. Nahoře se scrolluje,
  // a když je obsah odscrollovaný na začátek, tažení dolů panel stáhne.
  useEffect(() => {
    const el = content.current
    if (!el) return
    let sy = 0
    let sx = 0
    let mode: 'none' | 'sheet' | 'scroll' = 'none'
    const ts = (e: TouchEvent) => {
      sy = e.touches[0].clientY
      sx = e.touches[0].clientX
      mode = 'none'
    }
    const tm = (e: TouchEvent) => {
      const y = e.touches[0].clientY
      const dy = y - sy
      if (mode === 'none') {
        const dx = e.touches[0].clientX - sx
        if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return
        if (Math.abs(dx) > Math.abs(dy)) {
          mode = 'scroll'
          return
        }
        if (snap !== 'full' || (el.scrollTop <= 0 && dy > 0)) {
          mode = 'sheet'
          begin(sy)
        } else mode = 'scroll'
      }
      if (mode === 'sheet') {
        e.preventDefault()
        move(y)
      }
    }
    const te = (e: TouchEvent) => {
      if (mode === 'sheet') end(e.changedTouches[0].clientY)
      mode = 'none'
    }
    el.addEventListener('touchstart', ts, { passive: true })
    el.addEventListener('touchmove', tm, { passive: false })
    el.addEventListener('touchend', te)
    return () => {
      el.removeEventListener('touchstart', ts)
      el.removeEventListener('touchmove', tm)
      el.removeEventListener('touchend', te)
    }
  })

  return (
    <div
      className="sheet fixed inset-x-0 bottom-0 z-[900] flex flex-col rounded-t-[28px] bg-[#f7f6f3] shadow-[0_-10px_40px_rgba(15,23,42,0.22)]"
      style={{
        height: full,
        transform: `translateY(${full - visible}px)`,
        transition: drag === null ? 'transform 380ms cubic-bezier(.2,.9,.25,1)' : 'none',
      }}
      data-snap={snap}
      data-testid="sheet"
    >
      <div {...headerHandlers} className="shrink-0 cursor-grab touch-none select-none px-4 pb-2 pt-2 active:cursor-grabbing">
        <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-slate-300/80" aria-hidden="true" />
        {header}
      </div>
      <div
        ref={content}
        className={`min-h-0 flex-1 overscroll-contain px-4 pb-[max(env(safe-area-inset-bottom),24px)] ${snap === 'full' && drag === null ? 'overflow-y-auto' : 'overflow-hidden'}`}
      >
        {children}
      </div>
    </div>
  )
}
