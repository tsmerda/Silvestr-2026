import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { LatLng, Place, SubPoint } from '../data/places'

export type RouteLayer = {
  id: string
  coords: LatLng[]
  kind: 'car' | 'foot' | 'lift' | 'back'
  label?: string
}

export type ViewRequest = { key: number; points: LatLng[]; maxZoom?: number }

type Props = {
  places: Place[]
  dimmed: Set<string>
  selectedId: string
  onSelect: (id: string) => void
  routes: RouteLayer[]
  subPoints: SubPoint[]
  view: ViewRequest
  padding: { top: number; bottom: number; left: number; right: number }
}

const CAT_COLOR: Record<string, string> = {
  base: '#0f172a',
  apres: '#f97316',
  party: '#a21caf',
  ski: '#0284c7',
}

const ICONS: Record<string, string> = {
  base: '<path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  apres:
    '<path d="M7 3h10l-1 9a4 4 0 0 1-8 0zM12 16v4M8.5 21h7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  party:
    '<path d="M9 18V6l11-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm11-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  ski: '<path d="m3 20 18-8M13 4l-3 7 5 3-2 5M16 5.5a1.5 1.5 0 1 0 0-.01" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
}

const SUB_ICON: Record<SubPoint['kind'], string> = { bar: '🍺', lift: '🚡', parking: 'P', club: '🎵' }

function mainCat(p: Place) {
  return p.category[0]
}

function markerHtml(p: Place, selected: boolean, dimmed: boolean) {
  const cat = mainCat(p)
  const color = CAT_COLOR[cat]
  const isBase = cat === 'base'
  const cls = ['pin', isBase ? 'pin--base' : '', selected ? 'pin--sel' : '', dimmed ? 'pin--dim' : ''].join(' ')
  const label = isBase ? 'Chata Lenka' : p.name.split(' – ')[0]
  return `<div class="${cls}" style="--c:${color}">
    <div class="pin__dot"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS[cat]}</svg></div>
    <div class="pin__label">${label}</div>
  </div>`
}

export function MapView({ places, dimmed, selectedId, onSelect, routes, subPoints, view, padding }: Props) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markerLayer = useRef<L.LayerGroup | null>(null)
  const routeLayer = useRef<L.LayerGroup | null>(null)
  const subLayer = useRef<L.LayerGroup | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const padRef = useRef(padding)
  padRef.current = padding

  // init
  useEffect(() => {
    if (!el.current || map.current) return
    const m = L.map(el.current, { zoomControl: false, attributionControl: true, zoomSnap: 0.25 })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'osm-tiles',
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m)
    m.attributionControl.setPrefix(false)
    routeLayer.current = L.layerGroup().addTo(m)
    subLayer.current = L.layerGroup().addTo(m)
    markerLayer.current = L.layerGroup().addTo(m)
    m.setView([48.846, 19.616], 15)
    const zcls = () => el.current?.classList.toggle('zoom-low', m.getZoom() < 12.5)
    m.on('zoomend', zcls)
    zcls()
    map.current = m
    return () => {
      m.remove()
      map.current = null
    }
  }, [])

  // markers
  useEffect(() => {
    const layer = markerLayer.current
    if (!layer) return
    layer.clearLayers()
    for (const p of places) {
      const sel = p.id === selectedId
      const icon = L.divIcon({
        className: 'pin-wrap',
        html: markerHtml(p, sel, dimmed.has(p.id)),
        iconSize: [0, 0],
      })
      const mk = L.marker(p.pos, {
        icon,
        zIndexOffset: sel ? 1000 : p.category[0] === 'base' ? 500 : 0,
        keyboard: true,
        title: p.name,
        riseOnHover: true,
      })
      mk.on('click', () => onSelectRef.current(p.id))
      layer.addLayer(mk)
    }
  }, [places, selectedId, dimmed])

  // sub points (bar / lanovka / parkoviště)
  useEffect(() => {
    const layer = subLayer.current
    if (!layer) return
    layer.clearLayers()
    for (const s of subPoints) {
      const icon = L.divIcon({
        className: 'pin-wrap',
        html: `<div class="sub sub--${s.kind}"><span>${SUB_ICON[s.kind]}</span><em>${s.label}</em></div>`,
        iconSize: [0, 0],
      })
      layer.addLayer(L.marker(s.pos, { icon, interactive: false, zIndexOffset: -100 }))
    }
  }, [subPoints])

  // routes
  useEffect(() => {
    const layer = routeLayer.current
    if (!layer) return
    layer.clearLayers()
    for (const r of routes) {
      if (r.kind === 'lift') {
        layer.addLayer(L.polyline(r.coords, { color: '#7c3aed', weight: 4, dashArray: '2 9', lineCap: 'round', opacity: 0.95 }))
        continue
      }
      const color = r.kind === 'foot' ? '#16a34a' : r.kind === 'back' ? '#64748b' : '#2563eb'
      layer.addLayer(L.polyline(r.coords, { color: '#fff', weight: 9, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }))
      layer.addLayer(
        L.polyline(r.coords, {
          color,
          weight: 5,
          opacity: 0.95,
          dashArray: r.kind === 'foot' ? '1 9' : r.kind === 'back' ? '8 8' : undefined,
          lineCap: 'round',
          lineJoin: 'round',
        }),
      )
    }
  }, [routes])

  // view requests
  useEffect(() => {
    const m = map.current
    if (!m || view.points.length === 0) return
    const p = padRef.current
    const opts: L.FitBoundsOptions = {
      paddingTopLeft: [p.left, p.top],
      paddingBottomRight: [p.right, p.bottom],
      maxZoom: view.maxZoom ?? 16,
      animate: true,
      duration: 0.8,
    }
    const b = L.latLngBounds(view.points)
    if (view.key === 0) m.fitBounds(b, { ...opts, animate: false })
    else m.flyToBounds(b, opts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.key])

  // keep tiles correct when layout changes
  useEffect(() => {
    map.current?.invalidateSize()
  }, [padding.left, padding.right])

  return <div ref={el} className="absolute inset-0 z-0" aria-label="Mapa okolí chaty" />
}
