import { useCallback, useEffect, useMemo, useState } from 'react'
import type { LatLng, NyeVariant, Place } from './data/places'
import { nyeVariants, placeById, places, trip } from './data/places'
import { MapView, type RouteLayer, type ViewRequest } from './components/MapView'
import { BottomSheet, snapHeights, useViewportHeight, type Snap } from './components/BottomSheet'
import { PlaceCompact, PlaceDetail } from './components/PlaceDetail'
import { NyePanel, NyeSummary, VariantToggle } from './components/NyePanel'
import { distanceInfo, routes } from './lib/util'
import { CountdownShort, Snow } from './components/Festive'

type Mode = 'mapa' | 'silvestr'
type Filter = 'vse' | 'nejbliz' | 'apres' | 'party' | 'ski'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'vse', label: 'Vše' },
  { id: 'nejbliz', label: 'Nejblíž chatě' },
  { id: 'apres', label: 'Après-ski' },
  { id: 'party', label: 'Silvestrovské párty' },
  { id: 'ski', label: 'Lyžování' },
]

const NEAR_KM = 20

function sortKm(p: Place) {
  return distanceInfo(p)?.sortKm ?? -1
}

function filterPlaces(f: Filter): Place[] {
  const list = places.filter((p) => p.id !== trip.base)
  const sorted = [...list].sort((a, b) => sortKm(a) - sortKm(b))
  switch (f) {
    case 'nejbliz':
      return sorted.filter((p) => sortKm(p) <= NEAR_KM)
    case 'apres':
      return sorted.filter((p) => p.category.includes('apres'))
    case 'party':
      return sorted.filter((p) => p.category.includes('party'))
    case 'ski':
      return sorted.filter((p) => p.category.includes('ski'))
    default:
      return sorted
  }
}

const focusPoints = (p: Place): LatLng[] => [
  p.pos,
  ...(p.points?.filter((s) => s.kind !== 'parking' || p.id === 'myto').map((s) => s.pos) ?? []),
  ...(p.access.liftLine ?? []),
]

function useIsDesktop() {
  const q = '(min-width: 900px)'
  const [d, setD] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setD(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return d
}

const CHATA = placeById(trip.base)
const INITIAL = 'myto'

export default function App() {
  const desktop = useIsDesktop()
  const vh = useViewportHeight()
  const [mode, setMode] = useState<Mode>(() => (location.hash === '#silvestr' ? 'silvestr' : 'mapa'))
  const [filter, setFilter] = useState<Filter>('vse')
  const [selectedId, setSelectedId] = useState(INITIAL)
  const [variantId, setVariantId] = useState<NyeVariant['id']>('blizko')
  const [snap, setSnap] = useState<Snap>('peek')
  const [view, setView] = useState<ViewRequest>(() => ({
    key: 0,
    points: mode === 'silvestr' ? nyeVariants[0].placeIds.map((id) => placeById(id).pos) : [CHATA.pos, ...focusPoints(placeById(INITIAL))],
    maxZoom: 16.25,
  }))
  const [safeBottom, setSafeBottom] = useState(0)

  useEffect(() => {
    const probe = document.createElement('div')
    probe.style.cssText = 'position:fixed;bottom:0;height:0;padding-bottom:env(safe-area-inset-bottom);visibility:hidden'
    document.body.appendChild(probe)
    setSafeBottom(probe.offsetHeight || 0)
    probe.remove()
  }, [])

  useEffect(() => {
    history.replaceState(null, '', mode === 'silvestr' ? '#silvestr' : location.pathname + location.search)
  }, [mode])

  const variant = nyeVariants.find((v) => v.id === variantId)!
  const filtered = useMemo(() => filterPlaces(filter), [filter])
  const selected = placeById(selectedId)

  const mapPlaces = useMemo(() => {
    if (mode === 'silvestr') return variant.placeIds.map(placeById)
    return [CHATA, ...filtered]
  }, [mode, variant, filtered])

  const fly = useCallback((points: LatLng[], maxZoom = 16) => {
    setView((v) => ({ key: v.key + 1, points, maxZoom }))
  }, [])

  const peek = 132 + safeBottom
  const H = snapHeights(vh, peek)

  const padding = desktop
    ? { top: 72, left: 40, right: mode === 'mapa' ? 440 : 40, bottom: 40 }
    : { top: mode === 'mapa' ? 150 : 110, left: 56, right: 56, bottom: (snap === 'peek' ? H.peek : H.half) + 44 }

  // trasy na mapě
  const routeLayers: RouteLayer[] = useMemo(() => {
    if (mode === 'silvestr') {
      const r = routes[variant.routeThere]
      return [{ id: variant.routeThere, coords: r.coords, kind: 'car' }]
    }
    const p = selected
    const out: RouteLayer[] = []
    if (p.access.routeId) {
      const r = routes[p.access.routeId]
      out.push({ id: p.access.routeId, coords: r.coords, kind: r.mode === 'foot' ? 'foot' : 'car' })
    }
    if (p.access.liftLine) out.push({ id: p.id + '-lift', coords: p.access.liftLine, kind: 'lift' })
    return out
  }, [mode, variant, selected])

  const select = (id: string, opts: { fromMap?: boolean } = {}) => {
    const p = placeById(id)
    if (mode === 'silvestr' && opts.fromMap) setMode('mapa')
    setSelectedId(id)
    fly(id === CHATA.id ? [CHATA.pos] : focusPoints(p), id === CHATA.id ? 16 : p.points && p.points.length > 1 ? 16.5 : 15)
    if (!desktop) setSnap(opts.fromMap ? 'half' : 'peek')
  }

  const changeFilter = (f: Filter) => {
    setFilter(f)
    const list = filterPlaces(f)
    let sel = selectedId
    if (sel !== CHATA.id && !list.some((p) => p.id === sel)) sel = list[0]?.id ?? CHATA.id
    setSelectedId(sel)
    fly([CHATA.pos, ...list.map((p) => p.pos)], 15)
  }

  const changeMode = (m: Mode) => {
    setMode(m)
    if (m === 'silvestr') {
      fly(variant.placeIds.map((id) => placeById(id).pos), 14)
      setSnap('peek')
    } else {
      fly([CHATA.pos, ...focusPoints(selected)], 16)
      setSnap('peek')
    }
  }

  const changeVariant = (id: NyeVariant['id']) => {
    setVariantId(id)
    const v = nyeVariants.find((x) => x.id === id)!
    fly(v.placeIds.map((pid) => placeById(pid).pos), 14)
  }

  const focusFromPlan = (id: string) => {
    setSelectedId(id)
    fly(focusPoints(placeById(id)), 15)
    if (!desktop) setSnap('peek')
  }

  const backHome = () => {
    if (mode === 'silvestr') {
      setSelectedId(CHATA.id)
      fly([CHATA.pos], 16)
      if (!desktop) setSnap('peek')
      return
    }
    select(CHATA.id)
  }
  const wholeArea = () => fly(mapPlaces.map((p) => p.pos), 14)

  const dimmed = useMemo(() => new Set<string>(), [])
  const subPoints = mode === 'mapa' || variant.placeIds.includes(selectedId) ? (selected.points ?? []) : []

  const legend = routeLayers.length > 0 && (
    <div className="pointer-events-none flex flex-col items-start gap-1.5 text-[11px] font-semibold">
      {routeLayers.some((r) => r.kind === 'foot') && <span className="legend"><i className="legend__foot" />pěšky</span>}
      {routeLayers.some((r) => r.kind === 'car') && <span className="legend"><i className="legend__car" />autem po silnici</span>}
      {routeLayers.some((r) => r.kind === 'lift') && <span className="legend"><i className="legend__lift" />lanovky + lyže, ne silnice</span>}
    </div>
  )

  const modeToggle = (
    <div className="grid shrink-0 grid-cols-2 gap-0.5 rounded-full bg-white/95 p-0.5 shadow-md ring-1 ring-black/5 backdrop-blur" role="tablist" aria-label="Pohled">
      {(['mapa', 'silvestr'] as Mode[]).map((m) => (
        <button
          key={m}
          type="button"
          role="tab"
          aria-selected={mode === m}
          onClick={() => changeMode(m)}
          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-bold transition ${mode === m ? (m === 'silvestr' ? 'nye-tab text-white' : 'bg-slate-900 text-white') : 'text-slate-700'}`}
        >
          {m === 'mapa' ? 'Mapa' : desktop ? '🎆 Silvestr 31. 12.' : '🎆 Silvestr'}
        </button>
      ))}
    </div>
  )

  const filterChips = (
    <div className="no-scrollbar -mx-3 flex gap-1.5 overflow-x-auto px-3 pb-1" role="toolbar" aria-label="Rychlé filtry">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          aria-pressed={filter === f.id}
          onClick={() => changeFilter(f.id)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-semibold shadow-sm ring-1 transition ${filter === f.id ? 'bg-[#b4232a] text-white ring-[#b4232a]' : 'bg-white/95 text-slate-800 ring-black/5'}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )

  const mapButtons = (
    <div className="flex shrink-0 flex-col items-end gap-2 whitespace-nowrap">
      <button type="button" onClick={backHome} className="map-btn" data-testid="back-home">
        <span aria-hidden="true">⌂</span> Zpět na chatu
      </button>
      <button type="button" onClick={wholeArea} className="map-btn" data-testid="whole-area">
        <span aria-hidden="true">⤢</span> Celá oblast
      </button>
    </div>
  )

  const otherPlaces = (
    <section className="mt-6">
      <h4 className="mb-1.5 text-sm font-bold uppercase tracking-wide text-slate-500">
        {FILTERS.find((f) => f.id === filter)!.label === 'Vše' ? 'Všechna místa' : FILTERS.find((f) => f.id === filter)!.label}
      </h4>
      <div className="space-y-1" data-testid="place-list">
        {(filter === 'vse' ? [CHATA, ...filtered] : filtered).map((p) => (
          <PlaceCompact key={p.id} place={p} active={p.id === selectedId} onClick={() => select(p.id)} />
        ))}
      </div>
    </section>
  )

  const map = (
    <MapView
      places={mapPlaces}
      dimmed={dimmed}
      selectedId={selectedId}
      onSelect={(id) => select(id, { fromMap: true })}
      routes={routeLayers}
      subPoints={subPoints}
      view={view}
      padding={padding}
    />
  )

  if (desktop) {
    return (
      <div className="flex h-full w-full">
        <aside className="flex h-full w-[380px] shrink-0 flex-col border-r border-slate-200 bg-white">
          <div className="space-y-3 border-b border-slate-100 p-4">
            <div className="nye-hero relative overflow-hidden rounded-2xl p-3.5 text-white">
              <h1 className="relative text-xl font-black tracking-tight text-amber-300">❄ {trip.title}</h1>
              <p className="relative text-sm text-white/85">Chata Lenka · Mýto pod Ďumbierom · {trip.dates}</p>
              <p className="relative mt-1 text-xs font-semibold text-amber-200/90">
                <CountdownShort />
              </p>
            </div>
            {modeToggle}
            {mode === 'mapa' ? filterChips : <VariantToggle variants={nyeVariants} value={variantId} onChange={changeVariant} />}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {mode === 'mapa' ? (
              <div className="space-y-1" data-testid="place-list">
                {(filter === 'vse' ? [CHATA, ...filtered] : filtered).map((p) => (
                  <PlaceCompact key={p.id} place={p} active={p.id === selectedId} onClick={() => select(p.id)} />
                ))}
              </div>
            ) : (
              <NyePanel variant={variant} onFocus={focusFromPlan} />
            )}
          </div>
        </aside>
        <main className="relative h-full min-w-0 flex-1">
          {map}
          <Snow density={80} />
          <div className="absolute left-4 top-4 z-[800] flex flex-col items-start gap-2">
            {mapButtons}
            {legend}
          </div>
          {mode === 'mapa' && (
            <div className="absolute bottom-4 right-4 top-4 z-[800] w-[400px] overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
              <div key={selectedId} className="fade-up">
                <h2 className="text-xl font-black leading-tight text-slate-900">{selected.name}</h2>
                <p className="mb-3 text-sm text-slate-600">{selected.short}</p>
                <PlaceDetail place={selected} />
              </div>
            </div>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {map}
      <Snow density={mode === 'silvestr' ? 90 : 55} />
      <header className="pointer-events-none absolute inset-x-0 top-0 z-[800] space-y-2 px-3 pt-[max(env(safe-area-inset-top),10px)]">
        <div className="pointer-events-auto flex items-center justify-between gap-2">
          <div className="brand-pill min-w-0 rounded-2xl px-3 py-1.5 shadow-lg">
            <div className="truncate text-[13px] font-extrabold leading-tight text-amber-300">❄ Silvestr v Mýtě</div>
            <div className="truncate text-[11px] font-medium leading-tight text-white/80" data-testid="countdown-short">
              <CountdownShort />
            </div>
          </div>
          {modeToggle}
        </div>
        {mode === 'mapa' && <div className="pointer-events-auto">{filterChips}</div>}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 pt-0.5">{legend}</div>
          <div className="pointer-events-auto">{mapButtons}</div>
        </div>
      </header>

      <BottomSheet
        snap={snap}
        onSnap={setSnap}
        peekHeight={peek}
        contentKey={mode + selectedId + variantId}
        header={
          mode === 'mapa' ? (
            <div key={selectedId} className="fade-in">
              <PlaceCompact place={selected} />
            </div>
          ) : (
            <div>
              <VariantToggle variants={nyeVariants} value={variantId} onChange={changeVariant} />
              <NyeSummary variant={variant} />
            </div>
          )
        }
      >
        <div key={mode + selectedId + variantId} className="fade-up">
          {mode === 'mapa' ? (
            <>
              <PlaceDetail place={selected} />
              {otherPlaces}
            </>
          ) : (
            <NyePanel variant={variant} onFocus={focusFromPlan} />
          )}
        </div>
      </BottomSheet>
    </div>
  )
}
