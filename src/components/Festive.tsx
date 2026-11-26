import { useEffect, useRef, useState } from 'react'

/** Jemně padající sníh přes mapu. Respektuje „omezit pohyb“ v iOS. */
export function Snow({ density = 70 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    const resize = () => {
      w = c.clientWidth
      h = c.clientHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)
    const flakes = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.8 + Math.random() * 2.4,
      s: 0.25 + Math.random() * 0.7,
      d: Math.random() * Math.PI * 2,
      o: 0.45 + Math.random() * 0.5,
    }))
    let raf = 0
    let last = performance.now()
    const tick = (t: number) => {
      const dt = Math.min(50, t - last) / 16.7
      last = t
      ctx.clearRect(0, 0, w, h)
      for (const f of flakes) {
        f.y += f.s * dt * (0.6 + f.r * 0.25)
        f.d += 0.012 * dt
        f.x += Math.sin(f.d) * 0.35 * dt
        if (f.y > h + 4) {
          f.y = -4
          f.x = Math.random() * w
        }
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${f.o})`
        ctx.shadowColor = 'rgba(148,163,184,0.9)'
        ctx.shadowBlur = 3
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const vis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', vis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [density])
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-[400] h-full w-full" aria-hidden="true" />
}

const MIDNIGHT = new Date('2027-01-01T00:00:00+01:00').getTime()

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

export function useCountdown() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  return { ...parts(MIDNIGHT - now), done: now >= MIDNIGHT }
}

/** Velký odpočet do půlnoci – hlavička pohledu Silvestr. */
export function Countdown() {
  const c = useCountdown()
  if (c.done)
    return (
      <div className="nye-hero rounded-2xl p-4 text-center text-white">
        <div className="text-2xl font-black">Šťastný nový rok 2027!</div>
      </div>
    )
  const cell = (n: number, l: string) => (
    <div className="min-w-0 flex-1 rounded-xl bg-white/10 px-1 py-1.5 text-center ring-1 ring-white/15 backdrop-blur">
      <div className="text-xl font-black tabular-nums leading-none text-amber-300">{String(n).padStart(2, '0')}</div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/70">{l}</div>
    </div>
  )
  return (
    <div className="nye-hero relative overflow-hidden rounded-2xl p-3.5 text-white" data-testid="countdown">
      <Sparkles />
      <div className="relative text-[11px] font-bold uppercase tracking-[0.16em] text-amber-200/90">Do půlnoci zbývá</div>
      <div className="relative mt-2 flex gap-1.5">
        {cell(c.d, 'dní')}
        {cell(c.h, 'hod')}
        {cell(c.m, 'min')}
        {cell(c.s, 'sek')}
      </div>
    </div>
  )
}

/** Malé zlaté jiskry / ohňostroj v pozadí karty. */
export function Sparkles() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          className="spark"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            animationDelay: `${(i * 0.37) % 3}s`,
            animationDuration: `${2.2 + (i % 4) * 0.6}s`,
          }}
        />
      ))}
    </div>
  )
}

/** Krátký text odpočtu pro hlavičku. */
export function CountdownShort() {
  const c = useCountdown()
  if (c.done) return <>Šťastný nový rok!</>
  return (
    <>
      do půlnoci {c.d} d {c.h} h {String(c.m).padStart(2, '0')} min
    </>
  )
}
