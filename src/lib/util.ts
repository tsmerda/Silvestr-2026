import routesJson from '../data/routes.json'
import type { LatLng, Photo, Place } from '../data/places'
import { places, trip } from '../data/places'

export type Route = {
  mode: 'car' | 'foot'
  km: number
  min: number
  coords: LatLng[]
  via: string[]
}

export const routes = routesJson as unknown as Record<string, Route>

export const CHATA = places.find((p) => p.id === trip.base)!

/** Fotky z oficiálních webů jsou velké (2–4 MB) – posíláme je přes zmenšovač wsrv.nl. */
export function photoUrl(p: Photo, w: number) {
  if (p.direct) return p.src
  return `https://wsrv.nl/?url=${encodeURIComponent(p.src)}&w=${w}&output=webp&q=74`
}

/** Záloha, když se fotka nenačte: originál, u Commons naopak zmenšovač. */
export function photoFallback(p: Photo) {
  if (p.direct) return `https://wsrv.nl/?url=${encodeURIComponent(p.src)}&w=1280&output=webp&q=74`
  return encodeURI(decodeURI(p.src))
}

export const km = (n: number) => `${n.toLocaleString('cs-CZ', { maximumFractionDigits: n < 10 ? 1 : 0 })} km`

export function duration(min: number) {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${m} min` : `${h} h`
}

export function airKm(a: LatLng, b: LatLng) {
  const R = 6371
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLon = ((b[1] - a[1]) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

/** Hlavní údaj o vzdálenosti z chaty – vždy po skutečné trase, vzdušná jen s označením. */
export function distanceInfo(p: Place): { label: string; detail: string; sortKm: number; mode: 'foot' | 'car' | 'air' } | null {
  if (p.id === CHATA.id) return null
  const r = p.access.routeId ? routes[p.access.routeId] : undefined
  if (r) {
    const label = r.mode === 'foot' ? `${km(r.km)} pěšky · ${duration(r.min)}` : `${km(r.km)} autem · ${duration(r.min)}`
    const detail = p.access.liftLine ? `${label} + lanovky` : label
    return { label: detail, detail, sortKm: r.km + (p.access.liftLine ? 30 : 0), mode: r.mode }
  }
  const a = airKm(CHATA.pos, p.pos)
  return { label: `${km(a)} vzdušnou čarou`, detail: `${km(a)} vzdušnou čarou`, sortKm: a, mode: 'air' }
}

export function appleMapsUrl(to: [number, number], mode: 'walking' | 'driving') {
  return `https://maps.apple.com/?saddr=${CHATA.pos[0]},${CHATA.pos[1]}&daddr=${to[0]},${to[1]}&dirflg=${mode === 'walking' ? 'w' : 'd'}`
}

export function googleMapsUrl(to: [number, number], mode: 'walking' | 'driving') {
  return `https://www.google.com/maps/dir/?api=1&origin=${CHATA.pos[0]},${CHATA.pos[1]}&destination=${to[0]},${to[1]}&travelmode=${mode}`
}

export function formatDate(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('cs-CZ', { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' })
}

export const verifiedLabel = (iso: string) => {
  const d = new Date(iso + 'T12:00:00')
  return `ověřeno ${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`
}

export const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
